// Serve the repository root; import socialCover() in a browser and save its 1200x630 canvas.
import { drawShareQR } from '../dist/share-qr.js';
import { lifeFor } from '../dist/engine.js';
import { speciesArtwork } from '../dist/species-art.js';
export async function socialCover(){
 const keys=['marine-0','woodland-5','cretaceous-3','iceage-0','modern-0','modern-1'];
 const images=await Promise.all(keys.map(key=>new Promise((resolve,reject)=>{const image=new Image();image.onload=()=>resolve(image);image.onerror=reject;image.src=new URL('../dist/'+speciesArtwork(key).replace(/^\.\//,''),import.meta.url).href;})));
 await document.fonts.ready;
 const canvas=document.createElement('canvas');canvas.width=1200;canvas.height=630;const c=canvas.getContext('2d');
 c.fillStyle='#f5f6ef';c.fillRect(0,0,1200,630);
 for(let i=0;i<images.length;i++){const image=images[i],x=(i%3)*250,y=Math.floor(i/3)*315,scale=Math.min(238/image.naturalWidth,250/image.naturalHeight),w=image.naturalWidth*scale,h=image.naturalHeight*scale;c.drawImage(image,x+(250-w)/2,y+10+(250-h)/2,w,h);c.fillStyle='#264c43';let size=21;const name=lifeFor(keys[i]).species[0];do{c.font=`500 ${size}px system-ui`;if(c.measureText(name).width<=236)break;size--;}while(size>14);c.fillText(name,x+(250-c.measureText(name).width)/2,y+290);}
 c.fillStyle='#264c43';c.font='600 24px system-ui';c.fillText('OTHER LIFE',790,68);c.font='bold 42px system-ui';c.fillText('地球轉生所',790,144);c.font='600 32px system-ui';c.fillText('下一次，成為誰？',790,204);c.font='24px system-ui';c.fillStyle='#527168';c.fillText('掃碼，開啟你的生命故事',790,254);drawShareQR(c,'https://otherlife.icareu.tw/',840,282,240);c.fillStyle='#264c43';c.font='24px system-ui';c.fillText('otherlife.icareu.tw',790,588);return canvas;
}
