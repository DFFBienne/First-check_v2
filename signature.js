/* Signature pad tactile */
// ═══════════════════════════════════════════════════════════
let sigData = null; // base64 PNG of signature

function openSigPad(){
  const modal = $('sig-modal');
  const canvas = $('sig-canvas');
  modal.style.display = 'flex';
  // Size canvas to actual pixel size
  const rect = canvas.getBoundingClientRect();
  canvas.width = rect.width * window.devicePixelRatio;
  canvas.height = rect.height * window.devicePixelRatio;
  const ctx = canvas.getContext('2d');
  ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
  ctx.clearRect(0,0,canvas.width,canvas.height);
  ctx.strokeStyle = '#1a1a2e';
  ctx.lineWidth = 2;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  let drawing = false, lastX = 0, lastY = 0;

  function getPos(e){
    const r = canvas.getBoundingClientRect();
    const src = e.touches ? e.touches[0] : e;
    return {x: src.clientX - r.left, y: src.clientY - r.top};
  }
  function start(e){ e.preventDefault(); drawing=true; const p=getPos(e); lastX=p.x; lastY=p.y; }
  function move(e){ e.preventDefault(); if(!drawing)return; const p=getPos(e); ctx.beginPath(); ctx.moveTo(lastX,lastY); ctx.lineTo(p.x,p.y); ctx.stroke(); lastX=p.x; lastY=p.y; }
  function stop(){ drawing=false; }

  // Remove old listeners by replacing canvas
  const newCanvas = canvas.cloneNode(true);
  canvas.parentNode.replaceChild(newCanvas, canvas);
  newCanvas.width = canvas.width; newCanvas.height = canvas.height;
  const ctx2 = newCanvas.getContext('2d');
  ctx2.scale(window.devicePixelRatio, window.devicePixelRatio);
  ctx2.strokeStyle = '#1a1a2e'; ctx2.lineWidth = 2; ctx2.lineCap = 'round'; ctx2.lineJoin = 'round';
  let drawing2=false, lx=0, ly=0;
  function getPos2(e){ const r=newCanvas.getBoundingClientRect(); const src=e.touches?e.touches[0]:e; return {x:src.clientX-r.left,y:src.clientY-r.top}; }
  newCanvas.addEventListener('mousedown', e=>{ e.preventDefault(); drawing2=true; const p=getPos2(e); lx=p.x; ly=p.y; });
  newCanvas.addEventListener('mousemove', e=>{ e.preventDefault(); if(!drawing2)return; const p=getPos2(e); ctx2.beginPath(); ctx2.moveTo(lx,ly); ctx2.lineTo(p.x,p.y); ctx2.stroke(); lx=p.x; ly=p.y; });
  newCanvas.addEventListener('mouseup', ()=>drawing2=false);
  newCanvas.addEventListener('touchstart', e=>{ e.preventDefault(); drawing2=true; const p=getPos2(e); lx=p.x; ly=p.y; }, {passive:false});
  newCanvas.addEventListener('touchmove', e=>{ e.preventDefault(); if(!drawing2)return; const p=getPos2(e); ctx2.beginPath(); ctx2.moveTo(lx,ly); ctx2.lineTo(p.x,p.y); ctx2.stroke(); lx=p.x; ly=p.y; }, {passive:false});
  newCanvas.addEventListener('touchend', ()=>drawing2=false);
}

function clearSigPad(){
  const c = $('sig-canvas') || document.querySelector('#sig-modal canvas');
  if(!c) return;
  const ctx = c.getContext('2d');
  ctx.clearRect(0,0,c.width,c.height);
}

function confirmSignature(){
  const c = $('sig-modal').querySelector('canvas');
  if(!c) return;
  sigData = c.toDataURL('image/png');
  // Copy to preview
  const preview = $('sig-preview');
  const pCtx = preview.getContext('2d');
  preview.width = preview.offsetWidth * window.devicePixelRatio;
  preview.height = preview.offsetHeight * window.devicePixelRatio;
  pCtx.scale(window.devicePixelRatio, window.devicePixelRatio);
  const img = new Image();
  img.onload = ()=>{ pCtx.clearRect(0,0,preview.width,preview.height); pCtx.drawImage(img,0,0,preview.offsetWidth,preview.offsetHeight); };
  img.src = sigData;
  $('sig-placeholder').style.display = 'none';
  $('sig-clear-btn').style.display = 'block';
  $('sig-modal').style.display = 'none';
  markUnsaved(); clearTimeout(autoTimer); autoTimer=setTimeout(saveData,1800);
}

function clearSignature(){
  sigData = null;
  const preview = $('sig-preview');
  const ctx = preview.getContext('2d');
  ctx.clearRect(0,0,preview.width,preview.height);
  $('sig-placeholder').style.display = 'flex';
  $('sig-clear-btn').style.display = 'none';
  markUnsaved();
}

// Close modal on backdrop click
document.addEventListener('click', e=>{ if(e.target.id==='sig-modal') $('sig-modal').style.display='none'; });
window.addEventListener('DOMContentLoaded',()=>{
  $('date_sig').value=new Date().toISOString().slice(0,10);
  loadData();
});
