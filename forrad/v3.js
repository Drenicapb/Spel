/* Bucinca Förrådsfejden – 3D-förrådet (three.js r128): rulldörr, lampa, sakerna som enkla 3D-modeller,
   lådor som öppnas, prislappar. Kräver forrad/three.min.js och forrad/data.js. */
'use strict';
const LABEL_COL = {jack:['#ffd23f','#1a1000'],hi:['#3ddc84','#04210f'],mid:['#7fd3ff','#04192a'],lo:['#f4ede4','#1a120a'],junk:['#5d544b','#fff'],q:['#b78cff','#180a2e'],bad:['#ff5a5a','#2a0505'],info:['#000000cc','#fff']};

const V3 = (() => {
  const S={ok:false,onTap:null};
  let R,scene,cam,root=null,tweens=[],items=[],door=null,bulb=null,bulbBase=2.4,mountEl=null,DOOR_H=2.2,door0=1.1,doorOpenY=3.6;
  let focused=false,target,camTarget,homeT,yaw=0,pitch=.17,dist=5.2,distT=5.2,distHome=5.2,drag=null,lastIn=-1e9;
  const D=4.2,H=2.6;
  let MC={},TX={};
  // --- hjälp ---
  function ctex(w,h,draw,rx=1,ry=1){const c=document.createElement('canvas');c.width=w;c.height=h;const x=c.getContext('2d');draw(x,w,h);const t=new THREE.CanvasTexture(c);t.encoding=THREE.sRGBEncoding;t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(rx,ry);t.anisotropy=4;return t}
  function rep(t,rx,ry){const c=t.clone();c.needsUpdate=true;c.repeat.set(rx,ry);return c}
  function noise(x,w,h,b,a){const d=x.createImageData(w,h);for(let i=0;i<w*h;i++){const n=(Math.random()-.5)*a;d.data[i*4]=b[0]+n;d.data[i*4+1]=b[1]+n;d.data[i*4+2]=b[2]+n;d.data[i*4+3]=255}x.putImageData(d,0,0)}
  function mat(c,r=.7,m=0,ex){const k=c+r+m+(ex?JSON.stringify(ex):'');if(!MC[k])MC[k]=new THREE.MeshStandardMaterial(Object.assign({color:c,roughness:r,metalness:m},ex||{}));return MC[k]}
  function mesh(geo,m,x=0,y=0,z=0){const o=new THREE.Mesh(geo,m);o.position.set(x,y,z);o.castShadow=true;o.receiveShadow=true;return o}
  const grp=()=>new THREE.Group();
  const box=(w,h,d,m,x,y,z)=>mesh(new THREE.BoxGeometry(w,h,d),m,x,y,z);
  const cyl=(a,b,h,m,x,y,z,s=18)=>mesh(new THREE.CylinderGeometry(a,b,h,s),m,x,y,z);
  const sph=(r,m,x,y,z)=>mesh(new THREE.SphereGeometry(r,18,14),m,x,y,z);
  const tor=(Rr,r,m,x,y,z)=>mesh(new THREE.TorusGeometry(Rr,r,10,28),m,x,y,z);
  function rod(a,b,r,m){const A=new THREE.Vector3(...a),B=new THREE.Vector3(...b),o=cyl(r,r,A.distanceTo(B),m,0,0,0,8);o.position.copy(A).add(B).multiplyScalar(.5);o.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),B.clone().sub(A).normalize());return o}
  const hx=o=>{o.rotation.z=Math.PI/2;return o},hz=o=>{o.rotation.x=Math.PI/2;return o};
  function lean(g,a){const o=grp();g.rotation.x=a;o.add(g);return o}
  function onCrate(g){const o=grp();o.add(box(.5,.34,.42,TX.woodM,0,.17,0));g.position.y=.34;o.add(g);return o}
  function emojiSprite(e,s=.5){const t=ctex(128,128,(x)=>{x.font='100px "Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif';x.textAlign='center';x.textBaseline='middle';x.fillText(e,64,70)});const sp=new THREE.Sprite(new THREE.SpriteMaterial({map:t,transparent:true}));sp.scale.set(s,s,1);return sp}
  function textSprite(text,bg,fg,h=.27){
    const c=document.createElement('canvas'),x=c.getContext('2d'),F='800 54px Inter,system-ui,"Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif';
    x.font=F;const w=Math.ceil(x.measureText(text).width)+56;c.width=w;c.height=92;x.font=F;
    x.fillStyle=bg;const r=26;x.beginPath();x.moveTo(r,4);x.arcTo(w-4,4,w-4,88,r);x.arcTo(w-4,88,4,88,r);x.arcTo(4,88,4,4,r);x.arcTo(4,4,w-4,4,r);x.closePath();x.fill();
    x.fillStyle=fg;x.textAlign='center';x.textBaseline='middle';x.fillText(text,w/2,50);
    const t=new THREE.CanvasTexture(c);t.encoding=THREE.sRGBEncoding;
    const sp=new THREE.Sprite(new THREE.SpriteMaterial({map:t,transparent:true,depthTest:false}));sp.renderOrder=20;sp.scale.set(h*w/92,h,1);return sp}
  function tween(dur,fn,done,delay=0){tweens.push({t0:performance.now()+delay,dur,fn,done})}
  const easeOut=p=>1-Math.pow(1-p,3),easeIO=p=>p<.5?4*p*p*p:1-Math.pow(-2*p+2,3)/2,back=p=>{const c=1.7;return 1+(c+1)*Math.pow(p-1,3)+c*Math.pow(p-1,2)};
  // --- modeller ---
  const B={
    cardboard(s=1){const g=grp(),w=rnd(.45,.6)*s,h=rnd(.34,.5)*s,d=rnd(.4,.5)*s;g.add(box(w,h,d,TX.cardM,0,h/2,0));g.add(box(w+.006,.012,.09,mat('#d7c79e',.45),0,h+.002,0));g.add(box(.09,h+.004,d+.006,mat('#d7c79e',.45),0,h/2,0));return g},
    bigbox(){return B.cardboard(1.3)},
    bag(c='#0d0d0f'){const g=grp(),m=mat(c,.22,.15),b=sph(.32,m,0,.27,0);b.scale.set(1.05,.85,.95);g.add(b,sph(.08,m,0,.55,0),cyl(.02,.06,.12,m,0,.63,0));return g},
    bagLight(){return B.bag(pick(['#e6e0d0','#5b7fb8','#8fae6b']))},
    tarp(){const geo=new THREE.BoxGeometry(.9,.6,.75,6,4,6),p=geo.attributes.position;for(let i=0;i<p.count;i++){const y=p.getY(i);p.setY(i,y+(y>-.29?rnd(-.05,.06):0));if(y<-.29){p.setX(i,p.getX(i)*1.08);p.setZ(i,p.getZ(i)*1.08)}else{p.setX(i,p.getX(i)+rnd(-.03,.03));p.setZ(i,p.getZ(i)+rnd(-.03,.03))}}geo.computeVertexNormals();const g=grp();g.add(mesh(geo,mat('#2d5fa8',.55,0,{flatShading:true}),0,.3,0));return g},
    crate(){const g=grp(),m=mat('#2f4a35',.6,.2),st=mat('#888',.3,.8);g.add(box(.62,.4,.42,m,0,.2,0));[-.2,.2].forEach(x=>g.add(box(.04,.41,.43,st,x,.2,0)));g.add(box(.08,.1,.03,mat('#c9a227',.3,.9),0,.3,.22));return g},
    bin(){const g=grp();g.add(box(.56,.34,.4,mat('#8fa3b5',.35,0,{transparent:true,opacity:.85}),0,.17,0));g.add(box(.6,.04,.44,mat('#3f6e9c',.4),0,.36,0));return g},
    mattress(){const g=grp();g.add(box(.9,1.85,.2,mat('#e9e4d6',.9),0,.925,0));const st=mesh(new THREE.CircleGeometry(.16,20),mat('#a88d5c',.9),.15,1.15,.102);g.add(st);return lean(g,-.12)},
    openbox(){const g=B.cardboard(1);const h=new THREE.Box3().setFromObject(g).max.y;for(let i=0;i<6;i++){const s=box(rnd(.08,.18),rnd(.1,.2),rnd(.08,.16),mat(pick(['#ddd','#c33','#36c','#eee','#cb3','#555']),.6),rnd(-.15,.15),h-.02,rnd(-.12,.12));s.rotation.set(rnd(-.4,.4),rnd(0,3),rnd(-.4,.4));g.add(s)}return g},
    tv(){const g=grp();g.add(box(.62,.52,.52,mat('#3a3631',.6),0,.26,0));g.add(box(.5,.38,.02,mat('#14232e',.1,.3),0,.28,.26));g.add(box(.08,.08,.02,mat('#222'),.22,.08,.26));return g},
    monitor(){const g=grp(),k=mat('#1a1a1a',.4);g.add(box(.7,.42,.04,k,0,.52,0),box(.64,.36,.01,mat('#0e1a24',.1,.3),0,.52,.022),cyl(.03,.03,.3,k,0,.2,-.03),box(.28,.02,.2,k,0,.01,0));return g},
    laptop(){const g=grp(),m=mat('#9aa0a6',.3,.7);g.add(box(.36,.02,.25,m,0,.01,0));const s=box(.36,.25,.015,m,0,.135,-.12);s.rotation.x=-.25;g.add(s);return onCrate(g)},
    sofa(){const g=grp(),m=mat(pick(['#5a3a22','#2b2b2b','#7a2d22']),.45);g.add(box(1.5,.4,.75,m,0,.2,0),box(1.5,.5,.18,m,0,.62,-.3),box(.16,.6,.75,m,-.72,.3,0),box(.16,.6,.75,m,.72,.3,0));[-.36,.36].forEach(x=>g.add(box(.68,.12,.6,m,x,.46,.04)));return g},
    chair(c='#a07a4f'){const g=grp(),m=mat(c,.6);g.add(box(.45,.05,.45,m,0,.45,0),box(.45,.45,.04,m,0,.7,-.2));[[-.2,-.2],[.2,-.2],[-.2,.2],[.2,.2]].forEach(([x,z])=>g.add(cyl(.02,.02,.45,m,x,.22,z,6)));return g},
    brokenchair(){const g=B.chair('#8a6a44');g.children[3].scale.y=.5;g.children[3].position.y=.11;g.rotation.z=.3;g.position.y=.05;const o=grp();o.add(g);return o},
    designchair(){const g=grp(),c=mat(pick(['#e94e1b','#f2c84b','#2aa198','#fafafa']),.3);const s=sph(.3,c,0,.5,0);s.scale.set(1,.35,1);g.add(s);const b=sph(.3,c,0,.72,-.18);b.scale.set(1,.7,.3);g.add(b);const w=mat('#c89b62',.5);[[-.18,-.18],[.18,-.18],[-.18,.18],[.18,.18]].forEach(([x,z])=>g.add(rod([x*1.3,0,z*1.3],[x*.6,.45,z*.6],.015,w)));return g},
    painting(fancy){const g=grp(),fw=.75,fh=.58;const fr=fancy?mat('#c9a227',.35,.8):mat('#2b2b2b',.6);g.add(box(fw,fh,.05,fr,0,fh/2+.02,0));
      const t=ctex(128,100,(x,w,h)=>{x.fillStyle=fancy?'#2b2418':pick(['#f6c27a','#9fd3f5','#f0e6d2']);x.fillRect(0,0,w,h);for(let i=0;i<9;i++){x.fillStyle=fancy?pick(['#6b4a2b','#a4743a','#3d5a3a','#c9b27a','#5a2a1f']):pick(['#e94e1b','#2a6fdb','#f2c84b','#2aa198','#333']);x.globalAlpha=.8;x.beginPath();x.arc(rnd(0,w),rnd(0,h),rnd(8,30),0,7);x.fill()}});
      g.add(mesh(new THREE.PlaneGeometry(fw-.1,fh-.1),new THREE.MeshStandardMaterial({map:t,roughness:.8}),0,fh/2+.02,.027));return lean(g,-.2)},
    paintingFancy(){return B.painting(true)},
    safe(){const g=grp(),m=mat('#33373c',.35,.7);g.add(box(.6,.65,.55,m,0,.325,0));g.add(hz(cyl(.07,.07,.03,mat('#aaa',.3,.9),.08,.4,.28)));g.add(box(.04,.18,.04,mat('#aaa',.3,.9),.2,.3,.29));g.add(box(.5,.55,.01,mat('#2a2d31',.4,.6),0,.325,.276));return g},
    chest(){const g=grp(),w=mat('#5a2d1a',.4),gd=mat('#d4af37',.25,.9);g.add(box(.3,.15,.2,w,0,.075,0),box(.31,.03,.21,gd,0,.15,0),box(.04,.06,.01,gd,0,.1,.1));return onCrate(g)},
    drums(){const g=grp(),sh=mat(pick(['#b5221c','#1d4fa0','#111']),.3,.3),hd=mat('#f2f0ea',.6),cy=mat('#d4af37',.25,.9);const bd=hz(cyl(.26,.26,.35,sh,0,.27,0,24));g.add(bd,hz(cyl(.255,.255,.36,hd,0,.27,0,24)));
      g.add(cyl(.15,.15,.15,sh,.32,.52,.15,20),cyl(.13,.13,.13,sh,-.3,.55,.1,20),rod([.45,0,-.1],[.45,.9,-.1],.01,mat('#999',.3,.8)),cyl(.2,.2,.01,cy,.45,.9,-.1,24));return g},
    synth(){const g=grp(),k=mat('#222',.5);const keys=ctex(256,32,(x,w,h)=>{x.fillStyle='#fafafa';x.fillRect(0,0,w,h);x.fillStyle='#222';for(let i=0;i<w;i+=10){x.fillRect(i,0,1,h);if(i%70!==0&&i%70!==30)x.fillRect(i+6,0,6,h*.6)}});
      g.add(box(1.0,.08,.32,k,0,.72,0));g.add(mesh(new THREE.PlaneGeometry(.9,.16),new THREE.MeshStandardMaterial({map:keys,roughness:.5}),0,.761,.06).rotateX(-Math.PI/2));
      const m=mat('#555',.4,.7);g.add(rod([-.35,0,-.2],[-.35,.68,.15],.015,m),rod([-.35,0,.15],[-.35,.68,-.2],.015,m),rod([.35,0,-.2],[.35,.68,.15],.015,m),rod([.35,0,.15],[.35,.68,-.2],.015,m));return g},
    tires(){const g=grp(),t=mat('#141414',.85),r=mat('#b8bcc0',.3,.8),n=ri(2,4);for(let i=0;i<n;i++){g.add(cyl(.32,.32,.21,t,0,.105+i*.22,0,24),cyl(.2,.2,.215,r,0,.105+i*.22,0,20))}return g},
    skis(){const g=grp();[[-.08,'#d6332f'],[.08,'#d6332f'],[.3,'#222'],[.42,'#222']].forEach(([x,c],i)=>{const s=box(.08,i<2?1.7:1.2,.02,mat(c,.4),x,i<2?.85:.6,0);g.add(s)});g.add(box(.2,.3,.25,mat('#2a6fdb',.4),.65,.15,.1));return lean(g,-.12)},
    hockey(){const g=B.bag('#1b2d5c');g.add(rod([.3,0,.1],[-.2,1.2,-.1],.02,mat('#c49a6c',.6)));return g},
    golfbag(){const g=grp();g.add(cyl(.15,.14,.85,mat('#e7e2d8',.5),0,.425,0),cyl(.155,.155,.06,mat('#1b4d2b',.5),0,.83,0));for(let i=0;i<5;i++){const a=i*1.25,x=Math.cos(a)*.07,z=Math.sin(a)*.07;g.add(rod([x,.8,z],[x*1.6,1.05,z*1.6],.008,mat('#bbb',.3,.8)),box(.08,.05,.04,mat('#333',.3,.8),x*1.6,1.07,z*1.6))}return lean(g,-.1)},
    toolbox(){const g=grp(),m=mat('#c62828',.4,.3);g.add(box(.55,.26,.26,m,0,.13,0),box(.3,.03,.03,mat('#222'),0,.32,0),box(.03,.06,.03,mat('#222'),-.15,.29,0),box(.03,.06,.03,mat('#222'),.15,.29,0));return g},
    chainsaw(){const g=grp();g.add(box(.3,.22,.2,mat('#f07c1a',.45),0,.11,0),box(.55,.06,.03,mat('#9aa0a6',.3,.8),.4,.1,0),box(.15,.08,.18,mat('#222'),-.05,.26,0));return g},
    compressor(){const g=grp();g.add(hx(cyl(.18,.18,.6,mat('#c62828',.4,.3),0,.25,0)),box(.25,.18,.2,mat('#333',.5),0,.5,0));[-.22,.22].forEach(x=>g.add(hz(cyl(.06,.06,.04,mat('#111'),x,.06,.18))));return g},
    clock(){const g=grp(),w=mat('#5a3a22',.4);g.add(box(.42,1.6,.3,w,0,.8,0));const f=ctex(128,128,(x)=>{x.fillStyle='#efe6cf';x.beginPath();x.arc(64,64,60,0,7);x.fill();x.strokeStyle='#222';x.lineWidth=4;for(let i=0;i<12;i++){const a=i/12*6.283;x.beginPath();x.moveTo(64+Math.cos(a)*48,64+Math.sin(a)*48);x.lineTo(64+Math.cos(a)*56,64+Math.sin(a)*56);x.stroke()}x.lineWidth=5;x.beginPath();x.moveTo(64,64);x.lineTo(64,24);x.moveTo(64,64);x.lineTo(92,70);x.stroke()});
      g.add(mesh(new THREE.CircleGeometry(.16,24),new THREE.MeshStandardMaterial({map:f,roughness:.5}),0,1.3,.152));g.add(box(.3,.6,.01,mat('#2b1a10',.2,.3),0,.6,.151));g.add(cyl(.06,.06,.01,mat('#d4af37',.2,.9),0,.5,.16).rotateX(Math.PI/2));return g},
    vase(){const pts=[[.0,0],[.12,0],[.16,.1],[.2,.3],[.16,.5],[.08,.62],[.07,.72],[.11,.78]].map(([x,y])=>new THREE.Vector2(x,y));const t=ctex(64,64,(x,w,h)=>{x.fillStyle='#f4f1ea';x.fillRect(0,0,w,h);x.strokeStyle='#1f4fa0';x.lineWidth=3;for(let i=0;i<6;i++){x.beginPath();x.arc(rnd(0,w),rnd(0,h),rnd(5,14),0,5);x.stroke()}},3,1);
      const g=grp();g.add(mesh(new THREE.LatheGeometry(pts,24),new THREE.MeshStandardMaterial({map:t,roughness:.2,side:THREE.DoubleSide}),0,0,0));return onCrate(g)},
    shelf(){const g=grp(),w=mat('#8a6a44',.6);g.add(box(.9,1.6,.04,w,0,.8,-.15),box(.04,1.6,.32,w,-.43,.8,0),box(.04,1.6,.32,w,.43,.8,0));for(let s=0;s<4;s++){const y=.05+s*.5;g.add(box(.86,.03,.3,w,0,y,0));let x=-.38;while(x<.36){const bw=rnd(.04,.08),bh=rnd(.25,.4);g.add(box(bw,bh,.22,mat(pick(['#7a2d22','#1d4fa0','#2e6b3a','#c9a227','#ddd','#3a2a4a']),.7),x+bw/2,y+.015+bh/2,0));x+=bw+.01}if(s===3)break}return g},
    suitcase(){const g=grp(),m=mat(pick(['#7a4a2a','#3a2a1a','#9a6a3a']),.5);g.add(box(.55,.4,.2,m,0,.2,0),box(.2,.04,.04,mat('#2a1a10'),0,.42,0));[-.2,.2].forEach(x=>g.add(box(.03,.41,.21,mat('#c9a227',.3,.8),x,.2,0)));return g},
    moped(big){const g=grp(),s=big?1.25:1,body=mat(big?'#111':pick(['#d6332f','#2aa198','#f2c84b']),.3,.5),t=mat('#141414',.85),ch=mat('#cfd3d6',.2,.9);
      [-.55*s,.55*s].forEach(x=>{g.add(tor(.26*s,.07*s,t,x,.33*s,0),cyl(.12*s,.12*s,.1,ch,x,.33*s,0).rotateX(Math.PI/2))});
      g.add(box(.7*s,.3*s,.25*s,body,-.05*s,.6*s,0),box(.4*s,.08*s,.26*s,mat('#1a1a1a',.6),-.15*s,.8*s,0),rod([.55*s,.33*s,0],[.42*s,1.0*s,0],.025*s,ch),rod([.42*s,1.0*s,-.28*s],[.42*s,1.0*s,.28*s],.02*s,ch));if(big)g.add(box(.3,.25,.2,ch,.0,.35,0));return g},
    motorcycle(){return B.moped(true)},
    gokart(){const g=grp(),t=mat('#141414',.85);g.add(box(1.1,.08,.6,mat('#e0b21b',.4,.3),0,.14,0),box(.3,.35,.35,mat('#222',.6),-.15,.33,0),rod([.3,.18,0],[.2,.5,0],.02,mat('#888',.3,.8)));[[-.45,-.35],[-.45,.35],[.45,-.35],[.45,.35]].forEach(([x,z])=>g.add(hz(cyl(.13,.13,.12,t,x,.13,z))));return g},
    cabinet(){const g=grp(),m=mat('#7d868f',.4,.6);g.add(box(.45,1.05,.55,m,0,.525,0));for(let i=0;i<4;i++)g.add(box(.12,.03,.03,mat('#ddd',.3,.9),0,.17+i*.25,.29));return g},
    printer(){const g=grp();g.add(box(.48,.26,.38,mat('#d9d4c7',.5),0,.13,0),box(.36,.02,.15,mat('#fff',.8),0,.27,.08));return onCrate(g)},
    plant(){const g=grp();g.add(cyl(.14,.1,.25,mat('#b5653a',.8),0,.125,0));for(let i=0;i<5;i++)g.add(rod([0,.24,0],[rnd(-.2,.2),rnd(.5,.8),rnd(-.2,.2)],.008,mat('#6b5634',.9)));return g},
    xmas(){const g=grp(),m=mat('#1f5c35',.7);g.add(cyl(.02,.35,.5,m,0,.55,0,10),cyl(.02,.42,.5,m,0,.3,0,10),cyl(.03,.03,.1,mat('#5a3a22'),0,.03,0));for(let i=0;i<6;i++)g.add(sph(.035,mat(pick(['#c33','#ec3','#36c']),.2,.6),rnd(-.2,.2),rnd(.2,.7),rnd(.1,.25)));return g},
    broom(){const g=grp();g.add(rod([0,.1,0],[0,1.3,0],.015,mat('#c49a6c',.6)),box(.3,.12,.08,mat('#e0b21b',.8),0,.06,0),cyl(.15,.12,.3,mat('#2a6fdb',.5),.3,.15,0));return lean(g,-.15)},
    paint(){const g=grp();for(let i=0;i<4;i++){const x=(i%2)*.24-.12,z=Math.floor(i/2)*.24-.12;g.add(cyl(.1,.1,.22,mat('#b8bcc0',.35,.7),x,.11,z),cyl(.101,.101,.05,mat(pick(['#e94e1b','#2a6fdb','#fafafa','#2aa198']),.5),x,.19,z))}return g},
    trophies(){const g=grp(),gd=mat('#d4af37',.25,.9);for(let i=0;i<3;i++){const x=(i-1)*.15;g.add(box(.08,.05,.08,mat('#222'),x,.025,0),cyl(.012,.012,.1,gd,x,.1,0,8),cyl(.05,.02,.08,gd,x,.19,0,12))}return onCrate(g)},
    games(){const g=grp();for(let i=0;i<5;i++){const b=box(.4,.06,.28,mat(pick(['#c33','#36c','#2e6b3a','#cb3','#723a8a']),.6),rnd(-.03,.03),.03+i*.065,rnd(-.03,.03));b.rotation.y=rnd(-.3,.3);g.add(b)}return onCrate(g)},
    radio(){const g=grp();g.add(box(.42,.26,.16,mat('#7a4a2a',.5),0,.13,0),mesh(new THREE.CircleGeometry(.08,20),mat('#c9b27a',.8),-.09,.13,.081),cyl(.025,.025,.02,mat('#ddd',.3,.8),.12,.15,.08).rotateX(Math.PI/2));return onCrate(g)},
    mic(){const g=grp(),m=mat('#333',.4,.7);g.add(cyl(.12,.12,.02,m,0,.01,0),rod([0,0,0],[0,1.1,0],.012,m),rod([0,1.1,0],[.25,1.25,0],.01,m));const h=cyl(.05,.05,.16,mat('#bbb',.25,.9),.3,1.28,0);h.rotation.z=-.5;g.add(h);return g},
    parts(){const g=grp();g.add(box(.5,.35,.35,mat('#5a5f64',.5,.6),0,.175,0),cyl(.05,.05,.3,mat('#888',.4,.8),-.1,.45,0),cyl(.05,.05,.3,mat('#888',.4,.8),.1,.45,0));const t=cyl(.3,.3,.18,mat('#141414',.85),.55,.09,.1);g.add(t);return g},
    wine(){const g=grp();g.add(box(.5,.3,.36,TX.woodM,0,.15,0));for(let i=0;i<6;i++){const x=(i%3-1)*.14,z=(i<3?-.08:.08);g.add(cyl(.04,.04,.25,mat('#1d3b22',.15,.2),x,.38,z,10),cyl(.015,.015,.08,mat('#1d3b22',.15,.2),x,.54,z,8))}return g},
    guitar(){const g=grp(),body=mat(pick(['#b5221c','#111','#e8e1d0','#2a5caa']),.3,.1),wd=mat('#6b4423',.6),k=mat('#111',.5);g.add(hz(cyl(.21,.21,.07,body,0,.3,0,24)),hz(cyl(.16,.16,.07,body,0,.56,0,24)),box(.06,.62,.03,wd,0,.98,0),box(.09,.16,.035,k,0,1.36,0),box(.16,.03,.08,k,0,.3,0));return lean(g,-.15)},
    bike(){const g=grp(),fr=mat(pick(['#d6332f','#2f7dd6','#1fa36b','#e0b21b']),.35,.4),t=mat('#151515',.8),m=mat('#bbb',.3,.8);
      [-.48,.48].forEach(x=>g.add(tor(.31,.035,t,x,.34,0)));
      [[[-.48,.34,0],[-.05,.36,0]],[[-.05,.36,0],[-.12,.78,0]],[[-.48,.34,0],[-.12,.78,0]],[[-.12,.78,0],[.36,.8,0]],[[-.05,.36,0],[.36,.8,0]],[[.48,.34,0],[.36,.8,0]]].forEach(([a,b])=>g.add(rod(a,b,.022,fr)));
      g.add(rod([.36,.8,0],[.33,.98,0],.018,m),rod([.33,.98,-.22],[.33,.98,.22],.016,m),box(.22,.05,.1,mat('#111',.6),-.14,.83,0));return g},
    small(it){const g=grp();g.add(box(.46,.34,.42,TX.woodM,0,.17,0));const sp=emojiSprite(it.e,.5);sp.position.y=.6;g.add(sp);return g}
  };
  function buildModel(key,it){try{return key&&key!=='small'&&B[key]?B[key]():B.small(it)}catch(e){return B.small(it)}}
  function fitWrap(model,cell,maxH){const b=new THREE.Box3().setFromObject(model),s=b.getSize(new THREE.Vector3());const k=Math.min(1,cell*.9/Math.max(s.x,s.z,.01),maxH/Math.max(s.y,.01));
    model.position.set(-(b.min.x+b.max.x)/2,-b.min.y,-(b.min.z+b.max.z)/2);const w=grp();w.add(model);w.scale.setScalar(k);w.userData.s=k;w.userData.h=s.y*k;return w}
  // --- scen ---
  function init(){
    if(S.ok)return true;if(!window.THREE)return false;
    try{R=new THREE.WebGLRenderer({antialias:true,powerPreference:'high-performance'});if(!R.getContext())return false}catch(e){return false}
    R.setPixelRatio(Math.min(window.devicePixelRatio||1,1.75));R.outputEncoding=THREE.sRGBEncoding;R.toneMapping=THREE.ACESFilmicToneMapping;R.toneMappingExposure=.85;R.shadowMap.enabled=true;R.shadowMap.type=THREE.PCFSoftShadowMap;
    scene=new THREE.Scene();scene.background=new THREE.Color('#0d0c0b');scene.fog=new THREE.Fog('#0d0c0b',10,24);
    cam=new THREE.PerspectiveCamera(52,1,.05,60);
    target=new THREE.Vector3(0,.4,-2.0);camTarget=target.clone();homeT=target.clone();
    const rib=(vert)=>ctex(vert?4:64,vert?64:4,(x,w,h)=>{const g=vert?x.createLinearGradient(0,0,0,h):x.createLinearGradient(0,0,w,0);g.addColorStop(0,'#ffffff');g.addColorStop(.3,'#a9a9a9');g.addColorStop(.55,'#6d6d6d');g.addColorStop(.8,'#c4c4c4');g.addColorStop(1,'#ffffff');x.fillStyle=g;x.fillRect(0,0,w,h)});
    TX.ribV=rib(false);TX.ribH=rib(true);
    TX.concrete=ctex(256,256,(x,w,h)=>{noise(x,w,h,[128,125,120],26);for(let i=0;i<14;i++){x.fillStyle=`rgba(40,35,30,${rnd(.05,.15)})`;x.beginPath();x.arc(rnd(0,w),rnd(0,h),rnd(10,40),0,7);x.fill()}});
    TX.asphalt=ctex(256,256,(x,w,h)=>noise(x,w,h,[48,48,52],30));
    TX.card=ctex(64,64,(x,w,h)=>noise(x,w,h,[178,136,86],16));TX.cardM=new THREE.MeshStandardMaterial({map:TX.card,roughness:.85});
    TX.wood=ctex(64,128,(x,w,h)=>{x.fillStyle='#8a6a44';x.fillRect(0,0,w,h);for(let i=0;i<30;i++){x.strokeStyle=`rgba(60,40,20,${rnd(.1,.35)})`;x.beginPath();const y=rnd(0,h);x.moveTo(0,y);x.bezierCurveTo(w/3,y+rnd(-6,6),2*w/3,y+rnd(-6,6),w,y);x.stroke()}});TX.woodM=new THREE.MeshStandardMaterial({map:TX.wood,roughness:.75});
    bindInput();loop();S.ok=true;window.addEventListener('resize',S.resize);return true;
  }
  function bindInput(){const el=R.domElement;
    el.addEventListener('pointerdown',e=>{drag={x:e.clientX,y:e.clientY,yaw,pitch,mv:0};try{el.setPointerCapture(e.pointerId)}catch(_){}lastIn=performance.now()});
    el.addEventListener('pointermove',e=>{if(!drag)return;const dx=e.clientX-drag.x,dy=e.clientY-drag.y;drag.mv=Math.max(drag.mv,Math.abs(dx)+Math.abs(dy));yaw=Math.max(-.75,Math.min(.75,drag.yaw-dx*.006));pitch=Math.max(.02,Math.min(.6,drag.pitch+dy*.004));lastIn=performance.now()});
    el.addEventListener('pointerup',e=>{if(drag&&drag.mv<10)tap(e);drag=null;lastIn=performance.now()});
    el.addEventListener('pointercancel',()=>drag=null);
  }
  function isVis(o){while(o){if(!o.visible)return false;o=o.parent}return true}
  function tap(e){const r=R.domElement.getBoundingClientRect(),v=new THREE.Vector2((e.clientX-r.left)/r.width*2-1,-(e.clientY-r.top)/r.height*2+1),ray=new THREE.Raycaster();ray.setFromCamera(v,cam);
    const hits=ray.intersectObjects(items.map(i=>i.root),true);
    for(const h of hits){if(!isVis(h.object)||h.object.userData.label)continue;let o=h.object;while(o&&o.userData.k===undefined)o=o.parent;if(o){S.onTap&&S.onTap(o.userData.k);return}}}
  function loop(){requestAnimationFrame(loop);if(!mountEl||!R.domElement.isConnected||!root)return;
    const now=performance.now();
    tweens=tweens.filter(t=>{const p=(now-t.t0)/t.dur;if(p<0)return true;t.fn(Math.min(1,p));if(p>=1){t.done&&t.done();return false}return true});
    const y=yaw+(now-lastIn>3500?Math.sin(now/2600)*.13:0);
    camTarget.lerp(target,.06);dist+=(distT-dist)*.06;
    cam.position.set(camTarget.x+Math.sin(y)*Math.cos(pitch)*dist,camTarget.y+.55+Math.sin(pitch)*dist,camTarget.z+Math.cos(y)*Math.cos(pitch)*dist);cam.lookAt(camTarget);
    if(bulb)bulb.intensity=bulbBase*(Math.random()<.015?.45:1);
    R.render(scene,cam)}
  function disposeRoot(){if(!root)return;scene.remove(root);root.traverse(o=>{if(o.geometry)o.geometry.dispose();if(o.material&&o.material.map&&o.isSprite){o.material.map.dispose();o.material.dispose()}});root=null}
  S.mount=el=>{if(!init())return false;mountEl=el;el.prepend(R.domElement);S.resize();return true};
  S.resize=()=>{if(!mountEl||!R)return;const w=mountEl.clientWidth||300,h=mountEl.clientHeight||200;R.setSize(w,h,false);cam.aspect=w/h;
    const a=w/h;distHome=a>=1.25?5.2:Math.min(8,5.2*1.25/a);if(!focused)distT=distHome;cam.updateProjectionMatrix()};
  S.build=(L,opt={})=>{
    if(!S.ok)return;disposeRoot();tweens=[];items=[];root=grp();scene.add(root);S.key=opt.key;
    const n=L.items.length,W=n<=6?3.2:n<=9?3.9:4.7,ow=W-.2;
    // ljus
    root.add(new THREE.HemisphereLight('#aab6c8','#1a140e',.28));
    const sun=new THREE.DirectionalLight('#fff1dc',.6);sun.position.set(2.5,6,6.5);sun.target.position.set(0,0,-2);root.add(sun,sun.target);
    sun.castShadow=true;sun.shadow.mapSize.set(1024,1024);Object.assign(sun.shadow.camera,{left:-4,right:4,top:4,bottom:-4,near:1,far:22});sun.shadow.bias=-.0008;
    bulb=new THREE.PointLight('#ffc77a',bulbBase,11,1.1);bulb.castShadow=false;const fill=new THREE.PointLight('#9fb4d0',.5,9,1.5);fill.position.set(0,1.6,-.6);root.add(fill);bulb.position.set(0,H-.35,-D/2);root.add(bulb);
    root.add(sph(.06,new THREE.MeshBasicMaterial({color:'#fff2c4'}),0,H-.35,-D/2),cyl(.005,.005,.3,mat('#111'),0,H-.17,-D/2,4));
    // rum
    const floor=mesh(new THREE.PlaneGeometry(W,D),new THREE.MeshStandardMaterial({map:rep(TX.concrete,W/2,D/2),roughness:.9}),0,0,-D/2);floor.rotation.x=-Math.PI/2;floor.castShadow=false;root.add(floor);
    const wallM=(w)=>new THREE.MeshStandardMaterial({color:'#737a81',map:rep(TX.ribV,w/.16,1),bumpMap:rep(TX.ribV,w/.16,1),bumpScale:.03,roughness:.55,metalness:.35});
    const back=mesh(new THREE.PlaneGeometry(W,H),wallM(W),0,H/2,-D);back.castShadow=false;root.add(back);
    [-1,1].forEach(sx=>{const w=mesh(new THREE.PlaneGeometry(D,H),wallM(D),sx*W/2,H/2,-D/2);w.rotation.y=-sx*Math.PI/2;w.castShadow=false;root.add(w)});
    const ceil=mesh(new THREE.PlaneGeometry(W,D),new THREE.MeshStandardMaterial({color:'#2e3134',roughness:.9,side:THREE.DoubleSide}),0,H,-D/2);ceil.rotation.x=Math.PI/2;root.add(ceil);
    // fasad
    const fM=new THREE.MeshStandardMaterial({color:'#6f7a85',map:rep(TX.ribV,16/.18,1),bumpMap:rep(TX.ribV,16/.18,1),bumpScale:.03,roughness:.5,metalness:.4});
    const side=(8-ow/2);[-1,1].forEach(sx=>root.add(box(side,5.2,.2,fM,sx*(ow/2+side/2),2.6,.1)));
    root.add(box(ow,5.2-DOOR_H,.2,fM,0,DOOR_H+(5.2-DOOR_H)/2,.1));
    root.add(box(ow+.24,.08,.24,mat('#e2711d',.5,.3),0,DOOR_H+.04,.12));[-1,1].forEach(sx=>root.add(box(.08,DOOR_H,.24,mat('#e2711d',.5,.3),sx*(ow/2+.04),DOOR_H/2,.12)));
    const sign=ctex(512,128,(x,w,h)=>{x.fillStyle='#161616';x.fillRect(0,0,w,h);x.fillStyle='#ffd23f';x.font='bold 74px Impact,"Bebas Neue",sans-serif';x.textAlign='center';x.textBaseline='middle';x.fillText('FÖRRÅD '+String(opt.round||1).padStart(2,'0'),w/2,h/2+4)});
    root.add(mesh(new THREE.PlaneGeometry(1.4,.35),new THREE.MeshStandardMaterial({map:sign,roughness:.6}),0,DOOR_H+.42,.205));
    // mark utanför
    const gr=mesh(new THREE.PlaneGeometry(24,14),new THREE.MeshStandardMaterial({map:rep(TX.asphalt,8,5),roughness:.95}),0,-.002,7);gr.rotation.x=-Math.PI/2;gr.castShadow=false;root.add(gr);
    const ln=mesh(new THREE.PlaneGeometry(24,.08),mat('#e0b21b',.8),0,.001,1.4);ln.rotation.x=-Math.PI/2;ln.castShadow=false;root.add(ln);
    // dörr
    const dM=new THREE.MeshStandardMaterial({color:'#e2711d',map:rep(TX.ribH,1,DOOR_H/.12),bumpMap:rep(TX.ribH,1,DOOR_H/.12),bumpScale:.04,roughness:.45,metalness:.35});
    door=grp();door.add(box(ow+.1,DOOR_H+.04,.03,dM,0,0,0),box(.3,.05,.06,mat('#333',.4,.7),0,-DOOR_H/2+.12,.03));
    door0=DOOR_H/2;doorOpenY=door0+DOOR_H+.3;door.position.set(0,opt.doorOpen?doorOpenY:door0,-.04);root.add(door);
    // saker
    const cols=n<=9?3:4,rows=Math.ceil(n/cols),x0=-W/2+.55,x1=W/2-.55,z0=-D+.6,z1=-.8;
    const cw=(x1-x0)/(cols-1),cz=rows>1?(z1-z0)/(rows-1):1,cell=Math.min(cw,cz);
    const slots=[];for(let r=0;r<rows;r++)for(let c=0;c<cols;c++)slots.push({x:x0+c*cw,z:rows>1?z0+r*cz:(z0+z1)/2,r});
    const built=L.items.map((it,k)=>{
      const IT=FR.ITEMS[it.id],model=fitWrap(buildModel(IT.k,IT),cell,1.9);
      const cover=it.vis?null:fitWrap(buildModel((FR.COVERS[it.cover]||FR.COVERS[0])[1],IT),cell,1.9);
      return{k,model,cover,h:(cover||model).userData.h}});
    const order=[...built].sort((a,b)=>b.h-a.h);
    const used=slots.slice(0,n).sort((a,b)=>a.z-b.z);
    order.forEach((b,i)=>{const s=used[i],rootG=grp();rootG.userData.k=b.k;
      rootG.position.set(s.x+rnd(-.1,.1),0,s.z+rnd(-.1,.1));rootG.rotation.y=rnd(-.35,.35);
      rootG.add(b.model);if(b.cover){rootG.add(b.cover);b.model.visible=false;b.model.scale.setScalar(.001)}
      root.add(rootG);items[b.k]={root:rootG,model:b.model,cover:b.cover,top:Math.max(b.model.userData.h,b.cover?b.cover.userData.h:0),label:null,glow:null}});
    S.home(true);yaw=0;pitch=.17;
  };
  S.openDoor=(delay=0)=>{if(!door)return;const d=door;tween(1700,p=>{d.position.y=door0+easeIO(p)*(doorOpenY-door0)},null,delay);setTimeout(()=>window.SFX&&SFX.door&&SFX.door(),delay)};
  S.setDoorOpen=()=>{if(door&&door.position.y<doorOpenY-.01&&!tweens.length)door.position.y=doorOpenY};
  S.home=(snap)=>{if(!target)return;focused=false;target.copy(homeT);distT=distHome;if(snap){camTarget.copy(target);dist=distT}};
  S.focus=k=>{const it=items[k];if(!it)return;focused=true;target.set(it.root.position.x,.35,it.root.position.z+.2);distT=3.4;lastIn=performance.now()-2000};
  S.label=(k,text,col,ttl=0)=>{const it=items[k];if(!it)return;if(it.label){it.root.remove(it.label);it.label.material.map.dispose()}
    const [bg,fg]=LABEL_COL[col]||LABEL_COL.info,sp=textSprite(text,bg,fg);sp.userData.label=true;sp.position.y=it.top+.28;const sx=sp.scale.x,sy=sp.scale.y;sp.scale.set(.001,.001,1);it.root.add(sp);it.label=sp;
    tween(320,p=>{const e=back(p);sp.scale.set(sx*e,sy*e,1)});
    if(ttl)setTimeout(()=>{if(it.label===sp){tween(200,p=>sp.scale.set(sx*(1-p)+.001,sy*(1-p)+.001,1),()=>{it.root.remove(sp);if(it.label===sp)it.label=null})}},ttl)};
  S.reveal=k=>{const it=items[k];if(!it)return;
    if(it.cover&&it.cover.visible){const c=it.cover,s0=c.userData.s;window.SFX&&SFX.poof&&SFX.poof();tween(450,p=>{c.position.y=easeOut(p)*.9;c.rotation.y=p*2.4;c.rotation.z=p*.6;c.scale.setScalar(Math.max(.001,s0*(1-p)))},()=>{c.visible=false});puff(it.root.position);
      const m=it.model,s1=m.userData.s;m.visible=true;tween(650,p=>m.scale.setScalar(Math.max(.001,s1*back(p))),null,200)}
    else{const m=it.model;tween(420,p=>{m.position.y=Math.sin(p*Math.PI)*.18})}};
  S.glow=k=>{const it=items[k];if(!it)return;const l=new THREE.PointLight('#ffd23f',0,3,1.5);l.position.y=it.top+.3;it.root.add(l);tween(3200,p=>{l.intensity=(1-p)*3*(.6+.4*Math.sin(p*30))},()=>it.root.remove(l))};
  function puff(pos){for(let i=0;i<12;i++){const m=new THREE.Mesh(new THREE.BoxGeometry(.05,.05,.05),new THREE.MeshStandardMaterial({color:pick(['#b2885a','#d7c79e','#8a6a44']),transparent:true}));m.position.copy(pos).add(new THREE.Vector3(0,.35,0));root.add(m);
    const v=new THREE.Vector3(rnd(-1,1),rnd(1,2.4),rnd(-1,1)),p0=m.position.clone(),r=root;tween(800,p=>{const t=p*.8;m.position.set(p0.x+v.x*t,p0.y+v.y*t-4.9*t*t,p0.z+v.z*t);m.rotation.x+=.2;m.material.opacity=1-p},()=>{r.remove(m);m.geometry.dispose();m.material.dispose()})}}
  S.isRevealed=k=>{const it=items[k];return !!it&&(!it.cover||!it.cover.visible)};
  S.count=()=>items.length;
  return S;
})();

