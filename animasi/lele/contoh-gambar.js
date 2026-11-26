
// ---------- Tokoh "Lele Aldi" ----------
Object.assign(people,{
  aldi:{skin:['#d2a07a','#a8724e','#7a5034'],shirt:['#e8782a','#c85e18','#984408'],pants:'#5a4632',kind:'hair',hair:'#16120e',spiky:true}
});
const HOOK=['LELENYA HILANG…','PELAKUNYA','DI DALAM KOLAM'],HOOK_HL='DI DALAM KOLAM',EP_TITLE='Lele Aldi Hilang Satu per Satu';
// --- lele tampak samping (kepala di kiri). o.flip = menghadap kanan ---
function leleSide(x,y,s,t,o={}){at(x,y,s,()=>{if(o.flip)g.scale(-1,1);const ph=t*(o.speed||6)+(o.seed||0),amp=o.amp??3.5;
  const bend=(px)=>Math.sin(ph-px*.045)*amp*clamp((px+40)/110);
  const top=[[-64,1],[-60,-9],[-48,-15],[-30,-16],[-5,-15],[20,-12],[45,-8],[62,-5]],bot=[[62,5],[45,8],[20,11],[-5,14],[-30,15],[-48,13],[-60,8]];
  const P=a=>a.map(([px,py])=>[px,py+bend(px)]);
  // sirip punggung & dubur (panjang)
  g.beginPath();const dt=P([[-12,-15],[0,-21],[15,-21],[30,-19],[45,-15],[60,-10],[62,-5],[45,-8],[20,-12],[-5,-15]]);dt.forEach(([a,b],i)=>i?g.lineTo(a,b):g.moveTo(a,b));g.closePath();g.fillStyle='rgba(60,58,48,.85)';g.fill();
  g.beginPath();const an=P([[0,14],[15,20],[30,19],[45,16],[60,10],[62,5],[45,8],[20,11]]);an.forEach(([a,b],i)=>i?g.lineTo(a,b):g.moveTo(a,b));g.closePath();g.fillStyle='rgba(70,66,54,.8)';g.fill();
  // ekor
  const tb=bend(62),tw=Math.sin(ph-3)*.25;at(62,tb,1,()=>{g.rotate(tw);g.beginPath();g.moveTo(0,-5);g.quadraticCurveTo(18,-16,26,-10);g.quadraticCurveTo(30,0,26,10);g.quadraticCurveTo(18,16,0,5);g.closePath();g.fillStyle=gradient(0,0,28,0,[[0,'#4a483c'],[1,'#2e2c24']]);g.fill();
    for(let k=-3;k<=3;k++)line([[2,k*1.2],[26,k*3.2]],'rgba(20,18,12,.35)',1)});
  // badan
  g.beginPath();P(top).forEach(([a,b],i)=>i?g.lineTo(a,b):g.moveTo(a,b));P(bot).forEach(([a,b])=>g.lineTo(a,b));g.closePath();
  g.fillStyle=gradient(0,-16,0,15,[[0,o.pale?'#7a7a6a':'#3c3e34'],[.45,o.pale?'#9a988a':'#5e6052'],[.75,'#a8a494'],[1,'#d8d2c2']]);g.fill();
  g.save();g.clip();for(let i=0;i<22;i++){const px=-50+i*5.4;ellipse(px,-8+bend(px)+Math.sin(i*2.3)*3,2.4,1.4,'rgba(30,30,24,.25)')}
  const hl=g.createLinearGradient(0,-16,0,-4);hl.addColorStop(0,'rgba(255,255,255,.22)');hl.addColorStop(1,'rgba(255,255,255,0)');g.fillStyle=hl;g.fillRect(-70,-20,140,16);
  line(P([[-44,-2],[-20,-1],[10,0],[40,0],[60,0]]),'rgba(220,215,195,.35)',1);g.restore();
  // kepala pipih (lebih gelap) + sirip dada
  g.beginPath();g.ellipse(-50,-2+bend(-50),15,13,0,0,TAU);g.fillStyle='rgba(40,40,32,.35)';g.fill();
  g.beginPath();g.moveTo(-40,8+bend(-40));g.quadraticCurveTo(-30,22+Math.sin(ph*1.5)*3,-22,18);g.lineTo(-34,9+bend(-34));g.closePath();g.fillStyle='rgba(70,66,54,.85)';g.fill();line([[-40,8],[-26,20]],'#2a281e',1.4);
  // mata & mulut
  ellipse(-52,-6,3.2,3,'#e8e0c8');ellipse(-52.6,-6.2,2,2,'#111');ellipse(-53.2,-7,0.8,0.8,'#fff');
  curve(-64,2,-60,5,-54,5,'#1e1c16',1.6);
  // kumis (4 pasang)
  const w=Math.sin(t*3+(o.seed||0))*4,K=[[-61,-4,-100,-26+w,1.8],[-62,3,-104,16-w,1.8],[-60,5,-84,22+w,1.2],[-58,6,-78,28-w,1.1]];
  K.forEach(([a,b,c,d,lw])=>curve(a,b,(a+c)/2,b+(d-b)*.2-6,c,d,'#2a281e',lw))})}
// --- lele tampak atas (untuk kolam dilihat dari atas) ---
function leleTop(x,y,s,ang,t,o={}){at(x,y,s,()=>{g.rotate(ang);const ph=t*(o.speed||7)+(o.seed||0);
  const pts=[];for(let i=0;i<=12;i++){const u=i/12,px=-40+u*95,w=(u<.18?8+u*30:14*(1-u)+2)*(u<.05?.7:1);pts.push([px,Math.sin(ph-u*4)*4*u,w])}
  g.beginPath();pts.forEach(([px,py,w],i)=>i?g.lineTo(px,py-w):g.moveTo(px,py-w));pts.slice().reverse().forEach(([px,py,w])=>g.lineTo(px,py+w));g.closePath();
  g.fillStyle=o.col||'rgba(40,42,34,.92)';g.fill();const l=pts[12];polygon([[l[0],l[1]],[l[0]+16,l[1]-8],[l[0]+16,l[1]+8]],o.col||'rgba(40,42,34,.92)');
  ellipse(-34,-7,1.6,1.6,'#d8d0b8');ellipse(-34,7,1.6,1.6,'#d8d0b8');
  for(const sd of [-1,1]){curve(-40,sd*4,-52,sd*(10+Math.sin(t*3)*3),-60,sd*20,'rgba(30,30,24,.9)',1.2);curve(-38,sd*7,-46,sd*16,-50,sd*26,'rgba(30,30,24,.9)',1)}})}
// --- kolam terpal (tampak agak dari atas). y = tepi depan atas, h = tinggi dinding depan, o.d = kedalaman pandang permukaan ---
function kolamTerpal(x,y,w,h,t,o={}){const d=o.d||150,ins=26;
  const front=[[x,y],[x+w,y]],back=[[x+w-ins,y-d],[x+ins,y-d]];
  // dinding dalam belakang (terpal terlihat)
  polygon([[x+ins,y-d],[x+w-ins,y-d],[x+w-ins-6,y-d+18],[x+ins+6,y-d+18]],'#1e4a80');
  // permukaan air
  g.save();g.beginPath();g.moveTo(x+8,y-4);g.lineTo(x+w-8,y-4);g.lineTo(x+w-ins-6,y-d+16);g.lineTo(x+ins+6,y-d+16);g.closePath();
  g.fillStyle=gradient(0,y-d,0,y,[[0,o.murky?'#6a6440':'#5a7a4e'],[1,o.murky?'#3e3a24':'#2e4e34']]);g.fill();g.clip();
  for(let i=0;i<10;i++){const rx=x+40+random(i)*(w-80),ry=y-d+30+random(i+4)*(d-40);g.save();g.globalAlpha=.22;g.beginPath();g.ellipse(rx,ry,10+((t*8+i*3)%22),3.5,0,0,TAU);g.strokeStyle='#d8e8d0';g.lineWidth=1.2;g.stroke();g.restore()}
  if(o.fish)o.fish();
  const sh=g.createLinearGradient(0,y-d,0,y-d+50);sh.addColorStop(0,'rgba(255,255,255,.18)');sh.addColorStop(1,'rgba(255,255,255,0)');g.fillStyle=sh;g.fillRect(x,y-d,w,50);g.restore();
  // dinding depan (terpal biru) + lipatan
  polygon([[x,y],[x+w,y],[x+w-4,y+h],[x+4,y+h]],'#2a64a8');g.fillStyle=gradient(0,y,0,y+h,[[0,'rgba(255,255,255,.12)'],[1,'rgba(0,0,0,.25)']]);g.fillRect(x,y,w,h);
  for(let i=0;i<7;i++)curve(x+20+i*(w-40)/6,y+2,x+26+i*(w-40)/6,y+h*.5,x+22+i*(w-40)/6,y+h-2,'rgba(10,30,60,.35)',2);
  // bingkai bambu
  const bb=(p0,p1,wd)=>{line([p0,p1],'#a8803a',wd);line([[p0[0],p0[1]-wd*.25],[p1[0],p1[1]-wd*.25]],'#d8b060',wd*.4)};
  bb([x+ins,y-d],[x+w-ins,y-d],6);bb([x,y],[x+ins,y-d],7);bb([x+w,y],[x+w-ins,y-d],7);bb([x-4,y],[x+w+4,y],9);
  for(const px of [x,x+w])box(px-5,y-6,10,h+10,4,'#9a7434');ellipse(x+w/2,y+h+4,w*.52,8,'rgba(0,0,0,.2)')}
function pekarangan(t,mode='day'){sky(t,mode);g.fillStyle=gradient(0,330,0,560,[[0,'#8cbf5e'],[1,'#6fa84a']]);g.fillRect(-300,330,1100,240);
  house(70,520,1.1,mode);tree(410,520,1,mode);
  // pisang
  at(30,560,1,()=>{box(-6,-130,12,130,5,'#8a9a4a');for(let k=0;k<6;k++){const a=-2.6+k*.55,L=70+random(k)*20;g.save();g.translate(0,-128);g.rotate(a+Math.sin(t*1.2+k)*.04);
    g.beginPath();g.moveTo(0,0);g.quadraticCurveTo(L*.5,-16,L,4);g.quadraticCurveTo(L*.5,14,0,0);g.fillStyle=k%2?'#4a9a34':'#5ab040';g.fill();line([[0,0],[L,4]],'#3a7a2a',1.6);for(let j=1;j<6;j++)line([[L*j/6,2],[L*j/6+4,-10+j]],'rgba(255,255,255,.18)',1);g.restore()}});
  g.fillStyle=gradient(0,556,0,900,[[0,'#b8a880'],[1,'#988860']]);g.fillRect(-300,556,1100,400);for(let i=0;i<10;i++)grass(-40+i*52,600+random(i)*200,1,t,'#6a8a3a')}
function bawahAir(t,o={}){g.fillStyle=gradient(0,-300,0,900,[[0,o.night?'#0e1a16':'#3a5a44'],[.5,o.night?'#08120e':'#24402e'],[1,o.night?'#040806':'#14261a']]);g.fillRect(-300,-300,1100,1400);
  for(let i=0;i<5;i++){g.save();g.globalAlpha=o.night?.08:.12;polygon([[40+i*90,-300],[70+i*90,-300],[120+i*90+Math.sin(t+i)*20,900],[0+i*90+Math.sin(t+i)*20,900]],o.night?'#d8e8ff':'#e8f4c8');g.restore()}
  for(let i=0;i<40;i++){const px=random(i)*450,py=(900-((t*30*(random(i+3)+.5)+random(i+9)*900)%1000));ellipse(px+Math.sin(t*2+i)*4,py,1.5+random(i)*2.5,1.5+random(i)*2.5,'rgba(220,240,230,.35)')}
  for(let i=0;i<60;i++)ellipse(random(i+40)*450,random(i+50)*800,.8,.8,'rgba(200,220,180,.25)');
  g.fillStyle=gradient(0,650,0,800,[[0,'rgba(40,34,20,0)'],[1,'rgba(40,34,20,.9)']]);g.fillRect(-300,650,1100,300)}
function senterBeam(x,y,ang){g.save();g.translate(x,y);g.rotate(ang);const gr=g.createLinearGradient(0,0,320,0);gr.addColorStop(0,'rgba(255,250,200,.55)');gr.addColorStop(1,'rgba(255,250,200,0)');g.fillStyle=gr;g.beginPath();g.moveTo(0,-6);g.lineTo(320,-70);g.lineTo(320,70);g.lineTo(0,6);g.closePath();g.fill();g.restore()}
function hujan(t,a=1){g.save();g.globalAlpha=a;for(let i=0;i<120;i++){const px=(random(i)*520+t*40)%520-40,py=(random(i+5)*900+t*700*(.8+random(i)*.4))%900-60;line([[px,py],[px-4,py+16]],'rgba(200,220,240,.55)',1.3)}g.restore()}
function kertasPH(x,y,s,c){at(x,y,s,()=>{box(-10,-60,20,120,3,'#f4f0e4');box(-10,10,20,40,2,c);box(-12,-62,24,10,2,'#d8d0c0')})}
