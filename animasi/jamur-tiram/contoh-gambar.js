
// ---------- Tokoh "Jamur Tiram" (contoh gambar) ----------
Object.assign(people,{
  kamu:{skin:['#d8a37a','#b07552','#845438'],shirt:['#2e7a5a','#1f5e44','#123e2c'],pants:'#4a3a2a',kind:'hair',hair:'#1a1612',spiky:true}
});
const HOOK=['500 BAGLOG…','SEMUA','JADI HIJAU'],HOOK_HL='JADI HIJAU',EP_TITLE='Jamur Tiram';
// --- jamur tiram: satu tudung kipas (pangkal di 0,0, tudung mengarah ke -y) ---
function capTiram(x,y,s,ang,seed,o={}){at(x,y,s,()=>{g.rotate(ang);
  const L=30,rx=40,ry=25,curl=o.curl||0,sh=o.dark?.86:1;
  const pt=a=>{let r=1+.045*Math.sin(3*a+seed)+.03*Math.sin(5*a+seed*1.7)+curl*.08*Math.sin(9*a);const sa=Math.sin(a);if(sa>.55)r*=1-(sa-.55)*1.25;return [Math.cos(a)*rx*r,-L+sa*ry*r*(1-curl*.2)]};
  // tangkai pendek
  g.beginPath();g.moveTo(-6,3);g.quadraticCurveTo(-4,-8,-9,-16);g.lineTo(9,-16);g.quadraticCurveTo(4,-8,6,3);g.closePath();g.fillStyle=gradient(-7,0,7,0,[[0,'#cfc4ae'],[.5,'#efe8da'],[1,'#c2b69e']]);g.fill();
  const path=()=>{g.beginPath();for(let i=0;i<=64;i++){const [px,py]=pt(i/64*TAU);i?g.lineTo(px,py):g.moveTo(px,py)}g.closePath()};
  // bayangan
  g.save();g.translate(3,5);path();g.fillStyle='rgba(50,36,22,.22)';g.fill();g.restore();
  // sisi bawah (insang) mengintip di tepi depan
  if(o.under){g.save();g.beginPath();for(let i=0;i<=32;i++){const a=i/32*Math.PI;const [px,py]=pt(a);i?g.lineTo(px,py+5):g.moveTo(px,py+5)}for(let i=32;i>=0;i--){const a=i/32*Math.PI;const [px,py]=pt(a);g.lineTo(px*.9,py-2)}g.closePath();
    g.fillStyle=o.dark?'#cfc4ae':'#e6dcc6';g.fill();g.clip();for(let i=0;i<46;i++){const a=i/46*Math.PI;const [px,py]=pt(a);line([[0,-12],[px,py+6]],'rgba(140,120,90,.28)',.9)}g.restore()}
  // tudung
  path();const lg=g.createLinearGradient(0,-4,0,-L-ry);lg.addColorStop(0,o.dark?'#bfb39c':'#d6cab3');lg.addColorStop(.45,o.dark?'#d9d0bf':'#efe8da');lg.addColorStop(1,o.dark?'#e4dccd':'#fbf8f1');g.fillStyle=lg;g.fill();
  g.save();path();g.clip();const hg=g.createRadialGradient(-rx*.35,-L-ry*.35,2,-rx*.35,-L-ry*.35,rx*.9);hg.addColorStop(0,'rgba(255,255,255,'+(.55*sh)+')');hg.addColorStop(1,'rgba(255,255,255,0)');g.fillStyle=hg;g.fillRect(-rx*1.5,-L-ry*2,rx*3,ry*4);
  for(let i=0;i<14;i++){const a=Math.PI*1.08+i/13*Math.PI*.84;const [px,py]=pt(a);line([[0,-14],[px*.92,py*.92-L*.08]],'rgba(170,150,120,.12)',1.2)}
  g.restore();path();g.strokeStyle='rgba(150,130,100,.55)';g.lineWidth=1.1;g.stroke()})}
// --- rumpun jamur bertumpuk dari mulut baglog; gr 0..1 = tumbuh ---
const RUMPUN=[[-10,-12,-.85,.8,0,1],[12,-14,.8,.82,0,1],[0,-22,.05,.9,0,1],[-20,-2,-1.35,.95,1,0],[20,0,1.3,1.0,1,0],[-7,-6,-.42,1.05,0,0],[9,-5,.45,1.0,0,0],[-4,6,-.12,1.12,1,0],[14,8,.95,.9,1,0]];
function rumpun(x,y,s,gr,seed=1,o={}){
  if(gr<.18){const k=clamp(gr/.18);for(let i=0;i<11;i++){const a=random(i+seed)*TAU,r=random(i+seed+5)*12*s;orb(x+Math.cos(a)*r,y+Math.sin(a)*r*.6,(2.5+random(i)*2.5)*s*(.4+k),(2.5+random(i)*2.5)*s*(.4+k),'#fbf8f1','#ece4d4','#c4b8a0')}return}
  const k=ease(clamp((gr-.18)/.82));RUMPUN.forEach(([dx,dy,a,sz,u,d],i)=>capTiram(x+dx*s*(.4+.6*k),y+dy*s*(.4+.6*k),s*sz*(.3+.7*k),a,i*1.3+seed,{under:u,dark:d,curl:o.curl}))}
// --- ujung baglog tampak depan (di rak): plastik kerut + cincin leher ---
function ujungBaglog(x,y,r,o={}){ellipse(x+3,y+4,r*1.02,r*.98,'rgba(0,0,0,.3)');
  g.beginPath();g.ellipse(x,y,r,r*.96,0,0,TAU);g.fillStyle=gradient(x-r,y-r,x+r,y+r,[[0,o.bad?'#a8b08a':'#f1ebe0'],[1,o.bad?'#6a7a4a':'#c9bea8']]);g.fill();
  for(let i=0;i<7;i++){const px=x+(random(i+x*.1)-.5)*r*1.4,py=y+(random(i+y*.1)-.5)*r*1.3;if(Math.hypot(px-x,py-y)<r*.9)ellipse(px,py,1.6,1.6,'rgba(140,100,60,.35)')}
  if(o.bad)for(let i=0;i<4;i++){const px=x+(random(i+x)-.5)*r,py=y+(random(i+y)-.5)*r;ellipse(px,py,r*.3,r*.24,i%2?'rgba(58,110,50,.85)':'rgba(30,32,26,.8)')}
  for(let i=0;i<10;i++){const a=i/10*TAU+.2;line([[x+Math.cos(a)*r*.38,y+Math.sin(a)*r*.38],[x+Math.cos(a)*r*.92,y+Math.sin(a)*r*.9]],'rgba(255,255,255,.35)',1.2)}
  ellipse(x,y,r*.36,r*.36,'#8e98a2');ellipse(x,y,r*.27,r*.27,'#5a646e');ellipse(x,y,r*.2,r*.2,o.bad?'#2a3a1a':'#efe8da');
  g.beginPath();g.arc(x-r*.25,y-r*.28,r*.55,Math.PI*1.05,Math.PI*1.55);g.strokeStyle='rgba(255,255,255,.75)';g.lineWidth=2;g.stroke()}
// --- baglog berdiri (close-up): myc 0..1 = miselium; bad = kontaminasi ---
function baglogBerdiri(x,y,s,myc,t,o={}){at(x,y,s,()=>{
  const W=70,H=170;ellipse(0,4,W*.62,10,'rgba(0,0,0,.25)');
  g.beginPath();g.moveTo(-W/2,-H+30);g.quadraticCurveTo(-W/2-4,-H/2,-W/2,-8);g.quadraticCurveTo(0,8,W/2,-8);g.quadraticCurveTo(W/2+4,-H/2,W/2,-H+30);g.quadraticCurveTo(0,-H+22,-W/2,-H+30);g.closePath();
  g.fillStyle=gradient(-W/2,0,W/2,0,[[0,'#8a6440'],[.5,'#a87e52'],[1,'#7a5634']]);g.fill();g.save();g.clip();
  for(let i=0;i<220;i++){const px=(random(i)-.5)*W,py=-H+30+random(i+9)*(H-30);ellipse(px,py,1.2,1.2,random(i+4)>.5?'#6a4a2a':'#c49a6a')}
  if(myc>0){const fy=-H+28+myc*(H-20);g.fillStyle=gradient(0,-H,0,fy+14,[[0,'rgba(250,248,240,.97)'],[.85,'rgba(246,242,232,.93)'],[1,'rgba(246,242,232,0)']]);g.fillRect(-W,-H,W*2,fy+14+H);
    for(let i=0;i<40;i++){const px=(random(i+30)-.5)*W*1.1,py=fy+(random(i+50)-.3)*14;ellipse(px,py,4+random(i)*5,3,'rgba(248,245,236,.8)')}
    for(let i=0;i<60;i++){const px=(random(i+130)-.5)*W,py=-H+30+random(i+150)*(fy+H-30);curve(px,py,px+4,py+3,px+1,py+8,'rgba(220,210,190,.6)',1)}}
  if(o.bad){for(let b=0;b<4;b++){const cx=(random(b+70)-.5)*W*.7,cy=-H+60+random(b+80)*(H-90),R=14+random(b+90)*14;
      for(let i=0;i<26;i++){const a=random(i+b*31)*TAU,r=random(i+b*17)*R;ellipse(cx+Math.cos(a)*r,cy+Math.sin(a)*r*.8,3+random(i)*5,3+random(i+1)*4,b===2?'rgba(28,30,24,.85)':['rgba(64,140,60,.8)','rgba(110,170,80,.75)','rgba(40,100,44,.85)'][i%3])}
      ellipse(cx,cy,R*1.15,R*.95,'rgba(230,220,120,.12)')}}
  g.restore();
  // plastik: kilau
  g.beginPath();g.moveTo(-W/2+8,-H+40);g.quadraticCurveTo(-W/2+4,-H/2,-W/2+8,-20);g.strokeStyle='rgba(255,255,255,.55)';g.lineWidth=4;g.stroke();
  // leher, cincin, tutup
  polygon([[-W/2,-H+30],[-12,-H+6],[12,-H+6],[W/2,-H+30]],'rgba(230,230,235,.6)');box(-15,-H-4,30,12,4,'#8a9aa8');box(-15,-H-4,30,4,2,'#b8c4ce');
  ellipse(0,-H-8,14,8,o.bad?'#d8d0b0':'#f8f4ea');for(let i=0;i<5;i++)ellipse(-8+i*4,-H-10+random(i)*4,4,3,'#ffffff')})}
// --- latar kumbung ---
function kumbung(t,o={}){
  g.fillStyle=gradient(0,0,0,560,[[0,'#3a2e22'],[1,'#4a3a2a']]);g.fillRect(-300,-300,1100,860);
  // dinding gedek: bilah bambu tegak + anyaman
  for(let c=-12;c<40;c++){const x=c*14;g.fillStyle=c%2?'#8a6c44':'#9a7a4e';g.fillRect(x,-300,13,860)}
  for(let r=-10;r<20;r++){const y=r*34;g.fillStyle='rgba(60,40,20,.25)';g.fillRect(-300,y,1100,3);for(let c=-12;c<40;c+=2)box(c*14+(r%2)*14,y+4,13,26,2,'rgba(190,160,110,.25)')}
  g.fillStyle='rgba(20,14,8,.45)';g.fillRect(-300,-300,1100,860);
  // celah cahaya & sinar
  for(const [x,w] of [[60,5],[250,4],[400,6]]){box(x,-300,w,860,0,'rgba(255,236,190,.6)');g.save();g.globalAlpha=.13;polygon([[x-4,-40],[x+w+4,-40],[x+w+150,560],[x-80,560]],'#fff0c0');g.restore()}
  // tiang bambu
  for(const x of [-14,225,464]){box(x-10,-300,20,860,7,'#c09a52');box(x-6,-300,5,860,3,'rgba(255,240,200,.35)');for(let k=0;k<8;k++)line([[x-10,-280+k*110],[x+10,-280+k*110]],'#8a6a2a',3)}
  // rak & baglog (2 lapis, besar)
  const rows=o.rows||[100,260,420];for(const ry of rows){box(-300,ry+40,1100,12,3,'#a8884a');box(-300,ry+40,1100,4,2,'rgba(255,240,200,.35)');
    for(let lay=1;lay>=0;lay--)for(let i=0;i<10;i++){const x=-10+i*52+(lay%2)*26,y=ry+18-lay*40;if(x>480)continue;ujungBaglog(x,y,24,{bad:o.bad&&random(i*7+lay+ry)>.55});
      const gr=o.grow!=null?o.grow:0;if(gr>0&&lay===0&&random(i+ry)>.25)rumpun(x,y-4,.62,clamp(gr-random(i+ry*3)*.2),i+ry)}}
  // lantai tanah basah
  g.fillStyle=gradient(0,556,0,900,[[0,'#3a2e20'],[1,'#22190f']]);g.fillRect(-300,556,1100,400);for(let i=0;i<6;i++)ellipse(40+i*80,620+random(i)*120,40,6,'rgba(160,190,210,.18)');
  // kabut
  if(o.mist){for(let i=0;i<60;i++){const px=(random(i)*600+t*12*(random(i+3)+.3))%600-80,py=60+random(i+7)*480+Math.sin(t+i)*6;ellipse(px,py,10+random(i)*16,6+random(i)*8,'rgba(235,240,245,'+(0.05+random(i+2)*.08)+')')}}
}
function drumKukus(t){sky(t,'day');g.fillStyle='#b8a888';g.fillRect(-300,330,1100,240);house(380,560,1.2,'day');
  g.fillStyle=gradient(0,556,0,900,[[0,'#c8b08a'],[1,'#a89070']]);g.fillRect(-300,556,1100,400);
  // tungku bata
  box(70,470,200,90,4,'#a8503a');for(let r=0;r<4;r++)for(let c=0;c<6;c++)box(72+c*33+(r%2)*16,472+r*22,30,19,2,'#b8604a');box(130,510,80,50,10,'#1a0e08');
  for(let i=0;i<5;i++){const f=Math.sin(t*14+i)*4;polygon([[140+i*14,560],[146+i*14,528+f],[152+i*14,560]],'#f08a24');polygon([[143+i*14,560],[146+i*14,540-f],[149+i*14,560]],'#ffd24a')}
  // drum
  g.fillStyle=gradient(90,0,250,0,[[0,'#5a6a78'],[.4,'#a8b4c0'],[.6,'#8a98a6'],[1,'#4a5664']]);g.fillRect(90,300,160,172);for(const yy of [330,400,450])box(88,yy,164,6,2,'#6a7682');ellipse(170,300,80,14,'#7a8692');ellipse(170,300,72,10,'#4a5664');
  // terpal tutup + uap
  ellipse(170,296,86,18,'#2a5a9a');for(let i=0;i<14;i++){const ph=(t*.35+i/14)%1;g.save();g.globalAlpha=(1-ph)*.55;ellipse(150+Math.sin(i*2.3+t)*30+ph*20,280-ph*200,14+ph*30,10+ph*20,'#f4f6f8');g.restore()}
  // termometer & jam
  at(330,260,1,()=>{box(-46,-60,92,120,14,'rgba(255,255,255,.92)');ellipse(-14,0,22,22,'#fff');g.lineWidth=3;g.strokeStyle='#333';g.beginPath();g.arc(-14,0,22,0,TAU);g.stroke();line([[-14,0],[-14,-15]],'#333',3);line([[-14,0],[-4,6]],'#c0392b',3);
    box(18,-38,10,60,5,'#eee');box(20,-20,6,40,3,'#e0302a');ellipse(23,26,8,8,'#e0302a');label('± 8 jam',0,44,13,'#333','center',900)})}

// ---------- Naskah (contoh) ----------
const SCRIPT=[
  ['Akhirnya, kumbungmu penuh bunga putih.','kumbung',1.0,1.06,225,380],
  ['Baglog sehat putih bersih. Yang gagal, hijau.','baglog',1.0,1.04,225,430],
  ['Panen saat tudung lebar, tapi tepinya belum menggulung.','jamur',1.0,1.08,225,400],
  ['Kukus cukup lama, jangan buru-buru.','drum',1.0,1.04,225,440]
];
const TIMES=null,WORDS=null,AUDIO_END=null;
const LINES=[];{
  let T=4.0;
  SCRIPT.forEach(([text],i)=>{
    let start,end;if(TIMES){[start,end]=TIMES[i]}else{const d=4;start=T;end=T+d;T=end+.6}
    const words=text.replace(/["“”]/g,'').split(/\s+/).filter(Boolean);
    const wt=words.map((w,k)=>[WORDS?WORDS[i][k]:start+(end-start)*k/words.length,w.replace(/[.,!?…:]+$/,'').replace(/^…/,'')]);
    LINES.push({start,end,words:wt})
  });
}
const LAST=Math.max(AUDIO_END??0,LINES[LINES.length-1].end),OUTRO=LAST+1.5,DURATION=OUTRO+3.0;
const KI=k=>SCRIPT.findIndex(r=>r[1]===k);
function audioEvents(){return [['suara/narasi.mp3',0,1]]}

// ---------- Adegan ----------
function paintScene(key,t,dt,len){
  const p=clamp(dt/Math.max(len,.01));
  const P=(id,x,y,s,o={})=>person(id,x,y,s,t,o);
  switch(key){
    case 'kumbung':kumbung(t,{grow:1,mist:true});P('kamu',300,Y,A,{mood:'happy',look:-1,handPos:{'-1':[-40,-110]}});
      at(300-40*A,Y-110*A,1,()=>{box(-12,-30,24,40,6,'#2a8ae6');box(-6,-38,12,10,3,'#e8e8f0')});for(let i=0;i<10;i++){const ph=(t*1.5+i/10)%1;g.save();g.globalAlpha=(1-ph)*.5;ellipse(300-40*A-20-ph*70,Y-110*A-30-ph*20+Math.sin(i)*14,4+ph*10,3+ph*6,'#eef4f8');g.restore()}break;
    case 'baglog':{g.fillStyle=gradient(0,0,0,800,[[0,'#2a2620'],[1,'#14120e']]);g.fillRect(-300,-300,1100,1400);glow(225,420,300,'rgba(255,230,180,.12)');
      box(40,520,370,16,4,'#6a4a2a');baglogBerdiri(140,520,1.15,.86,t);baglogBerdiri(310,520,1.15,.55,t,{bad:true});
      capText('SEHAT',140,560,24,'#7ae08a',6);capText('GAGAL',310,560,24,'#ff6a5a',6);iconCheck(140,270,t);crossOut(270,200,350,280,8);break}
    case 'jamur':{g.fillStyle=gradient(0,0,0,800,[[0,'#3a2e22'],[1,'#1e1610']]);g.fillRect(-300,-300,1100,1400);glow(225,360,260,'rgba(255,236,200,.16)');
      g.save();g.filter='blur(6px)';for(const [x,y] of [[40,200],[150,190],[300,200],[410,190],[60,700],[400,700]])ujungBaglog(x,y,46);g.restore();
      ujungBaglog(225,500,80);rumpun(208,470,1.7,clamp(.2+p*1.2),3);rumpun(262,488,1.25,clamp(.1+p*1.2),9);
      for(let i=0;i<30;i++){const px=(random(i)*600+t*8)%600-80,py=random(i+7)*800;ellipse(px,py,6+random(i)*10,4,'rgba(235,240,245,.06)')}break}
    case 'drum':drumKukus(t);P('kamu',360,Y,A,{mood:'calm',look:-1,handPos:{'-1':[-50,-60]}});at(360-50*A,Y-60*A,1,()=>{g.rotate(-.5);box(-30,-5,60,10,4,'#7a5030')});break;
  }
}
function camOverride(key,p){return null}
