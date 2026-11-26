
// ---------- Tokoh "Puyuh Rizal" ----------
Object.assign(people,{
  rizal:{skin:['#d8a37a','#b07552','#845438'],shirt:['#3a8a5a','#2a6e46','#1a4e30'],pants:'#2e4a6e',kind:'hair',hair:'#16120e',cap:['#8a5a32','#6a4020','#4a2a10']}
});
const HOOK=['300 PUYUH…','TELURNYA NOL'],HOOK_HL='TELURNYA NOL',EP_TITLE='300 Puyuh, Telurnya Nol';
// --- gaya paper-cut: lapisan dengan bayangan lembut ---
function kertas(fn,dy=5,a=.32){g.save();g.shadowColor='rgba(70,40,15,'+a+')';g.shadowBlur=10;g.shadowOffsetY=dy;fn();g.restore()}
function butirKertas(){g.save();g.globalAlpha=.07;for(let i=0;i<900;i++){const x=random(i)*450,y=random(i+3)*800;g.fillStyle=i%2?'#000':'#fff';g.fillRect(x,y,1.2,1.2)}g.restore()}
// --- puyuh tampak samping (kepala ke kiri) ---
function puyuh(x,y,s,t,o={}){at(x,y,s,()=>{if(o.flip)g.scale(-1,1);const sd=o.seed||0,peck=o.peck?Math.max(0,Math.sin(t*4+sd))**6:0,bob=Math.sin(t*3+sd)*1.2,sh=o.shake?Math.sin(t*40)*2*o.shake:0;
  g.translate(sh,bob);
  // ekor
  polygon([[22,-6],[34,-10],[33,-2],[22,2]],'#6a4a2a');
  // badan
  g.beginPath();g.ellipse(0,0,26,18,0,0,TAU);g.fillStyle=gradient(0,-18,0,18,[[0,'#8a6038'],[.55,'#b08458'],[1,'#d8b888']]);g.fill();
  g.save();g.clip();for(let r=0;r<4;r++)for(let c=0;c<6;c++){const px=-18+c*8+(r%2)*4,py=-12+r*6;g.beginPath();g.arc(px,py,4,0,Math.PI);g.strokeStyle='rgba(60,36,16,.55)';g.lineWidth=1.2;g.stroke();line([[px,py-3],[px+2,py+3]],'rgba(250,235,200,.7)',1)}g.restore();
  // sayap
  g.beginPath();g.ellipse(6,-2,15,10,-.15,0,TAU);g.fillStyle='rgba(110,72,38,.55)';g.fill();for(let k=0;k<3;k++)line([[-4+k*6,-8],[2+k*6,6]],'rgba(250,235,200,.6)',1.2);
  // kepala (bisa mematuk)
  at(-22,-12+peck*14,1,()=>{g.rotate(peck*.6);g.beginPath();g.ellipse(0,0,10,9,0,0,TAU);g.fillStyle='#7a5430';g.fill();
    line([[-8,-3],[6,-6]],'#f4ead8',2.2);ellipse(-4,0,3.2,4,'#3a2a1a');ellipse(-4.5,-.6,2,2,'#111');ellipse(-5,-1.2,.7,.7,'#fff');
    polygon([[-9,1],[-15,3],[-9,5]],'#5a5048');if(o.male)ellipse(-2,6,6,4,'#c8643a')});
  if(o.sick){ellipse(-30,-14,4,2,'rgba(255,255,255,.6)')}})}
// --- telur puyuh ---
function telur(x,y,s,seed=0){at(x,y,s,()=>{g.beginPath();g.ellipse(0,0,6,8,0,0,TAU);g.fillStyle=gradient(-6,-8,6,8,[[0,'#f6efdc'],[1,'#d8ccb0']]);g.fill();
  g.save();g.clip();for(let i=0;i<7;i++){const px=(random(i+seed)-.5)*10,py=(random(i+seed+3)-.5)*14,r=.8+random(i+seed+6)*2.4;ellipse(px,py,r,r*.8,i%3?'#5a3a22':'#1e1a16')}g.restore();ellipse(-2,-3,1.6,2.4,'rgba(255,255,255,.6)')})}
// --- nampan telur (egg tray) ---
function nampan(x,y,s,n,seed=0){at(x,y,s,()=>{box(-70,-24,140,48,6,'#c8a878');for(let r=0;r<3;r++)for(let c=0;c<6;c++){const px=-55+c*22,py=-14+r*14;ellipse(px,py,8,5,'#a8885a');if(r*6+c<n)telur(px,py-4,.9,seed+r*6+c)}})}
// --- kandang baterai kayu bertingkat, tampak depan ---
function kandangBaterai(x,y,w,tiers,t,o={}){const th=o.th||108;
  for(let k=0;k<tiers;k++){const ty=y+k*th;
    kertas(()=>{box(x,ty,w,th-8,4,'#3a2c1e')});
    // puyuh di dalam
    const n=o.full?Math.floor(w/34):Math.floor(w/52);for(let i=0;i<n;i++){const px=x+34+i*(w-60)/Math.max(1,n-1)+Math.sin(t*.7+i*2+k)*(o.full?1:5),py=ty+th-36;puyuh(px,py,o.full?.85:.95,t,{seed:i+k*7,peck:!o.scared,shake:o.scared?1:0,flip:i%3===0})}
    // kawat depan
    for(let gx=x;gx<=x+w;gx+=12)line([[gx,ty],[gx,ty+th-8]],'rgba(210,210,210,.3)',1);for(let gy=ty;gy<=ty+th-8;gy+=12)line([[x,gy],[x+w,gy]],'rgba(210,210,210,.2)',1);
    // talang pakan & penampung telur miring
    kertas(()=>{box(x-6,ty+th-14,w+12,10,3,'#d8b060')},3,.25);for(let i=0;i<w/8;i++)ellipse(x+4+i*8,ty+th-12,2,1.6,'#a86a2a');
    kertas(()=>{polygon([[x-8,ty+th-4],[x+w+8,ty+th-4],[x+w+14,ty+th+6],[x-14,ty+th+6]],'#e8d8b8')},2,.2);
    const ne=o.eggs!=null?o.eggs:4;for(let i=0;i<ne;i++)telur(x+10+random(i+k*9)*(w-20),ty+th+1,.55,i+k*9)}
  // rangka kayu
  kertas(()=>{box(x-12,y-10,12,tiers*th+20,3,'#a8743a');box(x+w,y-10,12,tiers*th+20,3,'#a8743a');box(x-12,y-14,w+24,10,3,'#c08a48')})}
function gudang(t,o={}){
  g.fillStyle=gradient(0,0,0,600,[[0,'#f2dcb4'],[1,'#e4c48e']]);g.fillRect(-300,-300,1100,900);
  // dinding papan kayu
  for(let i=-6;i<18;i++)kertas(()=>{box(i*34,-300,32,860,2,i%2?'#e8cca0':'#e0c090')},2,.12);
  // jendela & sinar
  kertas(()=>{box(320,80,100,80,6,'#9ad0e8')});line([[370,80],[370,160]],'#a8743a',5);g.save();g.globalAlpha=.18;polygon([[320,160],[420,160],[460,560],[260,560]],'#fff6d8');g.restore();
  // lampu
  line([[225,-300],[225,40]],'#4a3a2a',2);kertas(()=>{polygon([[205,40],[245,40],[238,58],[212,58]],'#c0582a')});glow(225,70,160,'rgba(255,214,120,.35)');ellipse(225,62,8,6,'#fff2b0');
  // lantai
  g.fillStyle=gradient(0,556,0,900,[[0,'#c89860'],[1,'#a87840']]);g.fillRect(-300,556,1100,400);for(let i=0;i<10;i++)ellipse(random(i)*450,600+random(i+2)*200,30,4,'rgba(120,80,40,.15)')}
function jalanDesa(t){g.fillStyle=gradient(0,-300,0,330,[[0,'#f8d8a0'],[1,'#f6e6c4']]);g.fillRect(-300,-300,1100,640);kertas(()=>{ellipse(360,80,40,40,'#fff2c0')});
  kertas(()=>{g.beginPath();g.moveTo(-300,330);for(let x=-300;x<=800;x+=20)g.lineTo(x,250+Math.sin(x*.012)*40+Math.sin(x*.03)*12);g.lineTo(800,330);g.closePath();g.fillStyle='#9ab868';g.fill()},4,.2);
  for(const hx of [60,300])kertas(()=>{box(hx-50,250,100,70,3,'#f0dcb8');polygon([[hx-62,252],[hx,212],[hx+62,252]],'#c0582a');box(hx-12,280,24,40,2,'#7a5030')},4,.25);for(const tx of [170,420])kertas(()=>{line([[tx,330],[tx,270]],'#7a5030',6);ellipse(tx,250,34,30,'#6aa84a')},4,.2);
  kertas(()=>{box(-300,320,1100,240,0,'#d8c090')},3,.2);kertas(()=>{box(-300,556,1100,60,0,'#6a6a72')},3,.25);for(let i=0;i<8;i++)box(i*70-40+((t*80)%70),584,36,5,2,'#e8e8e8');
  kertas(()=>{box(-300,616,1100,300,0,'#c8a878')},-3,.2)}
