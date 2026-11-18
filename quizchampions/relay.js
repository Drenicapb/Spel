/* Quiz Champions – anslutning över internet via en öppen MQTT-förmedlare (reserv till WebRTC).
 *
 * WebRTC (PeerJS) pratar direkt mellan mobilen och storskärmen. Det fungerar oftast, men vissa mobilnät,
 * jobb- och skolnät stoppar direktkopplingen. Då går trafiken i stället via en öppen MQTT-förmedlare över
 * vanlig krypterad WebSocket (wss://) – det kommer igenom alla nät, och ingen behöver konto.
 *
 * Gränssnittet härmar PeerJS DataConnection: conn.open, conn.send(obj), conn.close(), conn.on('open'|'data'|'close'|'error').
 *
 * Ämnen: qchamp1/<pin>/info  (kvar hos förmedlaren medan rummet finns, töms om värden försvinner)
 *        qchamp1/<pin>/h      (till värden:  "<rid>|<json>"  eller "<rid>|\u0001join" / "\u0001leave")
 *        qchamp1/<pin>/c/<rid> (till en mobil: json eller "\u0001ok" / "\u0001close")
 */
'use strict';
(function () {
  let BROKERS = ['wss://broker.emqx.io:8084/mqtt', 'wss://broker.hivemq.com:8884/mqtt', 'wss://mqtt.eclipseprojects.io:443/mqtt', 'wss://test.mosquitto.org:8081/mqtt'];
  // för tester: localStorage qk_brokers = ["ws://127.0.0.1:8883"]
  try { const o = JSON.parse(localStorage.getItem('qk_brokers') || 'null'); if (Array.isArray(o) && o.length) BROKERS = o; } catch (e) { }
  const PFX = 'qchamp1/';
  const T = (pin, t) => PFX + pin + '/' + t;
  const rid = () => Math.random().toString(36).slice(2, 8) + Math.random().toString(36).slice(2, 6);

  /* ---------- liten MQTT 3.1.1-klient (QoS 0) över WebSocket ---------- */
  const te = new TextEncoder(), td = new TextDecoder();
  const mqStr = s => { const b = typeof s === 'string' ? te.encode(s) : s; const o = new Uint8Array(2 + b.length); o[0] = b.length >> 8; o[1] = b.length & 255; o.set(b, 2); return o; };
  function mqPkt(type, parts) {
    let n = 0; for (const p of parts) n += p.length;
    const len = []; let x = n; do { let d = x % 128; x = Math.floor(x / 128); if (x > 0) d |= 128; len.push(d); } while (x > 0);
    const o = new Uint8Array(1 + len.length + n); o[0] = type; o.set(len, 1);
    let i = 1 + len.length; for (const p of parts) { o.set(p, i); i += p.length; }
    return o;
  }
  class Mqtt {
    constructor(url, will) {
      this.onmsg = this.onopen = this.onclose = null; this.open = false; this.dead = false; this.buf = new Uint8Array(0); this.pid = 1;
      this.id = 'qc' + rid();
      try { this.ws = new WebSocket(url, ['mqtt']); } catch (e) { setTimeout(() => this._closed(), 0); return; }
      this.ws.binaryType = 'arraybuffer';
      this.ws.onopen = () => {
        let flags = 0x02; const pay = [mqStr(this.id)];
        if (will) { flags |= 0x04 | (will.retain ? 0x20 : 0); pay.push(mqStr(will.topic), mqStr(te.encode(will.payload))); }
        this.ws.send(mqPkt(0x10, [mqStr('MQTT'), new Uint8Array([4, flags, 0, 30]), ...pay]));
      };
      this.ws.onmessage = e => this._data(new Uint8Array(e.data));
      this.ws.onclose = this.ws.onerror = () => this._closed();
    }
    _closed() { if (this.dead) return; this.dead = true; this.open = false; clearInterval(this.ping); try { this.ws && this.ws.close(); } catch (e) { } if (this.onclose) this.onclose(); }
    _data(chunk) {
      const b = new Uint8Array(this.buf.length + chunk.length); b.set(this.buf); b.set(chunk, this.buf.length); this.buf = b;
      while (this.buf.length >= 2) {
        let mul = 1, len = 0, i = 1, d;
        do { if (i >= this.buf.length) return; d = this.buf[i++]; len += (d & 127) * mul; mul *= 128; } while (d & 128);
        if (this.buf.length < i + len) return;
        const h = this.buf[0], body = this.buf.subarray(i, i + len);
        this.buf = this.buf.slice(i + len);
        const t = h >> 4;
        if (t === 2) { // CONNACK
          if (body[1] === 0) { this.open = true; this.ping = setInterval(() => { try { this.ws.send(new Uint8Array([0xC0, 0])); } catch (e) { } }, 15000); if (this.onopen) this.onopen(); }
          else this._closed();
        } else if (t === 3) { // PUBLISH
          const tl = (body[0] << 8) | body[1], topic = td.decode(body.subarray(2, 2 + tl));
          let p = 2 + tl; if ((h >> 1) & 3) p += 2;
          if (this.onmsg) try { this.onmsg(topic, td.decode(body.subarray(p)), !!(h & 1)); } catch (e) { console.error(e); }
        }
      }
    }
    sub(...topics) { if (!this.open) return; const id = this.pid++; const parts = [new Uint8Array([id >> 8, id & 255])]; for (const t of topics) parts.push(mqStr(t), new Uint8Array([0])); this.ws.send(mqPkt(0x82, parts)); }
    pub(topic, payload, retain) { if (!this.open) return false; try { this.ws.send(mqPkt(0x30 | (retain ? 1 : 0), [mqStr(topic), te.encode(payload)])); return true; } catch (e) { return false; } }
    end() { if (this.dead) return; try { this.ws.send(new Uint8Array([0xE0, 0])); } catch (e) { } this.dead = true; this.open = false; clearInterval(this.ping); setTimeout(() => { try { this.ws.close(); } catch (e) { } }, 100); }
  }
  // Anslut till första förmedlaren som svarar (från start), med tidsgräns per förmedlare
  function connectAny(start, will, cb, tried = 0) {
    if (tried >= BROKERS.length) { cb(null, -1); return; }
    const bi = (start + tried) % BROKERS.length, m = new Mqtt(BROKERS[bi], will(bi));
    let done = false;
    const fail = () => { if (done) return; done = true; m.onclose = null; m.end(); connectAny(start, will, cb, tried + 1); };
    const to = setTimeout(fail, 6000);
    m.onclose = () => { clearTimeout(to); fail(); };
    m.onopen = () => { if (done) return; done = true; clearTimeout(to); m.onclose = null; cb(m, bi); };
  }

  class Emitter {
    constructor() { this._h = {}; this.open = false; }
    on(e, f) { (this._h[e] = this._h[e] || []).push(f); return this; }
    _emit(e, ...a) { for (const f of this._h[e] || []) try { f(...a); } catch (err) { console.error(err); } }
  }

  /* ═════ Värd ═════ */
  class HostConn extends Emitter {
    constructor(owner, id) { super(); this.owner = owner; this.rid = id; this.relay = true; this.open = true; }
    send(obj) { if (this.open) this.owner.m && this.owner.m.pub(T(this.owner.pin, 'c/' + this.rid), JSON.stringify(obj)); }
    close() { if (!this.open) return; this.owner.m && this.owner.m.pub(T(this.owner.pin, 'c/' + this.rid), '\u0001close'); this._gone(); }
    _gone() { if (!this.open) return; this.open = false; this.owner.conns.delete(this.rid); this._emit('close'); }
  }
  class RelayHost {
    // opts: onConn(conn), onReady(brokerIndex), onFail(), onTaken()
    constructor(pin, opts) {
      this.pin = pin; this.opts = opts; this.conns = new Map(); this.ready = false; this.dead = false; this.bi = 0; this.m = null;
      this.hid = 'h' + rid(); this._connect(0, true);
    }
    _connect(start, first) {
      connectAny(start, () => ({ topic: T(this.pin, 'info'), payload: '', retain: true }), (m, bi) => {
        if (this.dead) { m && m.end(); return; }
        if (!m) { if (first) this.opts.onFail && this.opts.onFail(); else setTimeout(() => this._connect(this.bi, false), 3000); return; }
        this.m = m; this.bi = bi;
        let checked = !first;
        m.onmsg = (topic, msg, retained) => {
          if (topic === T(this.pin, 'info')) {
            if (!checked && retained && msg && !msg.includes('"' + this.hid + '"')) { checked = true; this.taken = true; this.destroy(true); this.opts.onTaken && this.opts.onTaken(); }
            return;
          }
          if (topic !== T(this.pin, 'h')) return;
          const bar = msg.indexOf('|'); if (bar < 1) return;
          const id = msg.slice(0, bar), body = msg.slice(bar + 1);
          let c = this.conns.get(id);
          if (body === '\u0001leave') { if (c) c._gone(); return; }
          if (!c) { c = new HostConn(this, id); this.conns.set(id, c); this.opts.onConn && this.opts.onConn(c); }
          if (body === '\u0001join') { m.pub(T(this.pin, 'c/' + id), '\u0001ok'); return; }
          let data; try { data = JSON.parse(body); } catch (e) { return; }
          c._emit('data', data);
        };
        m.onclose = () => { this.m = null; if (!this.dead) setTimeout(() => this._connect(this.bi, false), 1500); };
        m.sub(T(this.pin, 'info'), T(this.pin, 'h'));
        setTimeout(() => {
          if (this.dead || this.m !== m) return;
          checked = true;
          m.pub(T(this.pin, 'info'), JSON.stringify({ app: 'quizchampions', host: this.hid, t: Date.now() }), true);
          if (!this.ready) { this.ready = true; this.opts.onReady && this.opts.onReady(bi); }
        }, first ? 900 : 100);
      });
    }
    destroy(quiet) {
      if (this.dead) return; this.dead = true;
      const m = this.m; this.m = null;
      if (m && m.open) {
        if (!quiet) for (const c of this.conns.values()) m.pub(T(this.pin, 'c/' + c.rid), '\u0001close');
        if (!this.taken) m.pub(T(this.pin, 'info'), '', true);
      }
      for (const c of [...this.conns.values()]) { c.open = false; }
      this.conns.clear();
      setTimeout(() => { try { m && m.end(); } catch (e) { } }, 200);
    }
  }

  /* ═════ Mobil ═════ */
  class RelayClient extends Emitter {
    constructor(pin, hint) {
      super(); this.pin = pin; this.rid = 'm' + rid(); this.relay = true; this.dead = false;
      this._try(Math.max(0, +hint || 0), 0);
    }
    _try(start, n) {
      if (this.dead) return;
      if (n >= BROKERS.length) { this._fail('peer-unavailable'); return; }
      connectAny(start, () => ({ topic: T(this.pin, 'h'), payload: this.rid + '|\u0001leave' }), (m, bi) => {
        if (this.dead) { m && m.end(); return; }
        if (!m) { this._fail('network'); return; }
        this.m = m; this.bi = bi;
        let seen = false;
        m.onmsg = (topic, msg) => {
          if (topic === T(this.pin, 'info')) {
            if (!msg) { if (this.open) this._lost(); return; }
            if (!seen) { seen = true; m.pub(T(this.pin, 'h'), this.rid + '|\u0001join'); }
            return;
          }
          if (msg === '\u0001ok') { if (!this.open) { this.open = true; this.broker = bi; this._emit('open'); } return; }
          if (msg === '\u0001close') { this._lost(); return; }
          if (!this.open) return;
          let data; try { data = JSON.parse(msg); } catch (e) { return; }
          this._emit('data', data);
        };
        m.onclose = () => { if (this.open) this._lost(); else if (!this.dead && this.m === m) { this.m = null; this._try((bi + 1) % BROKERS.length, n + 1); } };
        m.sub(T(this.pin, 'info'), T(this.pin, 'c/' + this.rid));
        // inget rum med den PIN-koden hos den här förmedlaren → prova nästa
        setTimeout(() => { if (!seen && !this.dead && this.m === m) { m.onclose = null; m.end(); this.m = null; this._try((bi + 1) % BROKERS.length, n + 1); } }, 3500);
      });
    }
    _fail(type) { if (this.dead) return; this.dead = true; this._emit('error', { type }); }
    _lost() { if (this.dead) return; this.dead = true; this.open = false; try { this.m && this.m.end(); } catch (e) { } this._emit('close'); }
    send(obj) { if (this.open && this.m) this.m.pub(T(this.pin, 'h'), this.rid + '|' + JSON.stringify(obj)); }
    close() {
      if (this.dead) return; this.dead = true; this.open = false;
      const m = this.m; if (m && m.open) m.pub(T(this.pin, 'h'), this.rid + '|\u0001leave');
      setTimeout(() => { try { m && m.end(); } catch (e) { } }, 150);
    }
  }

  window.QCRelay = { RelayHost, RelayClient, brokers: () => BROKERS.slice() };
})();
