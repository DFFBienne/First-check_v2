/* Application SBB - Logique formulaire, sauvegarde, circuits */
let currentLang = 'fr';

function setLang(lang) {
  currentLang = lang;
  // Update active button
  document.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.lang-btn').forEach(b => { if(b.textContent===lang.toUpperCase()) b.classList.add('active'); });
  applyLang();
  saveData();
}

function applyLang() {
  const T = I18N[currentLang];
  const s = (id, val) => { const e = document.getElementById(id); if(e) e.innerHTML = val; };
  const st = (id, val) => { const e = document.getElementById(id); if(e) e.textContent = val; };
  const sp = (id, val) => { const e = document.getElementById(id); if(e) e.placeholder = val; };

  s('hdr-title', T.hdrTitle);
  st('saveTxt', T.saveTxt);
  st('btn-save-lbl', T.btnSave);
  st('btn-pdf-lbl', T.btnPdf);
  st('btn-add-lbl', T.btnAdd);
  st('no-circuit-msg', T.noCircuit);

  st('sec-install-hd', T.secInstall);
  st('sec-mesures-hd', T.secMesures);
  st('sec-circuits-hd', T.secCircuits);
  st('sec-vc-hd', T.secVc);
  st('sec-rem-hd', T.secRem);
  st('sec-inst-hd', T.secInst);

  st('lbl-nom-install', T.lblNomInstall);
  st('lbl-num-tab', T.lblNumTab);
  st('lbl-page', T.lblPage);
  st('lbl-objet', T.lblObjet);
  st('lbl-compteur', T.lblCompteur);
  st('lbl-cc-gen', T.lblCcGen);
  st('lbl-cc-abo', T.lblCcAbo);
  st('lbl-tension', T.lblTension);
  st('lbl-instrument', T.lblInstrument);
  st('lbl-inventaire', T.lblInventaire);
  st('lbl-facteur', T.lblFacteur);
  st('lbl-val-facteur', T.lblValFacteur);
  st('lbl-rem', T.lblRem);
  st('lbl-nom-prenom', T.lblNomPrenom);
  st('lbl-lieu', T.lblLieu);
  st('lbl-date', T.lblDate);

  T.vcLabels.forEach((lbl, i) => st('vc-lbl-'+(i+1), lbl));
  st('lbl-sig', T.lblSig||'Signature');
  const ph=$('sig-placeholder');if(ph)ph.textContent=T.sigPlaceholder||'Appuyez pour signer...';

  // Update circuit sub-labels already rendered
  document.querySelectorAll('[data-lbl]').forEach(el => {
    const key = el.getAttribute('data-lbl');
    if(T[key]) el.textContent = T[key];
  });
  // Update circuit input placeholders
  document.querySelectorAll('[data-ph]').forEach(el => {
    const key = el.getAttribute('data-ph');
    if(T[key]) el.placeholder = T[key];
  });
}

// ═══════════════════════════════════════════════════════════
// UTILS
// ═══════════════════════════════════════════════════════════
const SKEY='sbb_proto_v3';
let circuitIds=[],nextId=1,autoTimer=null;
const $=id=>document.getElementById(id);
function gv(id){const e=$(id);if(!e)return'';return e.type==='checkbox'?e.checked:(e.value||'');}
function sv(id,v){const e=$(id);if(!e)return;e.type==='checkbox'?e.checked=!!v:e.value=v;}
function showToast(msg,dur=2200){const t=$('toast');t.textContent=msg;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),dur);}
function markUnsaved(){$('saveDot').className='dot unsaved';$('saveTxt').textContent=I18N[currentLang].unsaved;}
function markSaved(){$('saveDot').className='dot';$('saveTxt').textContent=I18N[currentLang].saved;}
document.addEventListener('input',()=>{markUnsaved();clearTimeout(autoTimer);autoTimer=setTimeout(saveData,1800);});
document.addEventListener('change',()=>{markUnsaved();clearTimeout(autoTimer);autoTimer=setTimeout(saveData,1800);});

// ═══════════════════════════════════════════════════════════
// CIRCUITS
// ═══════════════════════════════════════════════════════════
function addCircuit(data){
  if(!data && circuitIds.length>=18){
    showToast('Maximum 18 circuits');
    return;
  }
  const T=I18N[currentLang];
  const id=nextId++;circuitIds.push(id);
  const box=$('circuits-container');
  const p=box.querySelector('p');if(p)p.remove();
  const d=document.createElement('div');d.className='cc';d.id='cc-'+id;
  d.innerHTML=`
    <div class="cc-hdr">
      <div class="cc-groupe">
        <div style="font-size:9px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.3px;margin-bottom:2px;" data-lbl="lblGroupe">${T.lblGroupe}</div>
        <input type="text" id="groupe_${id}" data-ph="lblGroupe" placeholder="—" value="${(data&&data.groupe)||''}" style="border:1px solid var(--border);border-radius:6px;padding:5px 7px;font-size:13px;font-weight:700;background:#fff;color:var(--navy);width:100%;outline:none;text-align:center;"/>
      </div>
      <div class="cc-desig" style="flex:1;">
        <div style="font-size:9px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.3px;margin-bottom:2px;" data-lbl="lblDesig2">${T.lblDesig2||'Désignation'}</div>
        <input type="text" id="desig_${id}" data-ph="lblDesig" placeholder="${T.lblDesig}" value="${(data&&data.desig)||''}"/>
      </div>
      <button class="btn-del" onclick="removeCircuit(${id})">×</button>
    </div>
    <span class="sub-lbl" data-lbl="sublCana">${T.sublCana}</span>
    <div class="mg">
      <div class="mf"><label data-lbl="lblCtype">${T.lblCtype}</label><input type="text" id="ctype_${id}" value="${(data&&data.ctype)||''}" placeholder="NYM"/></div>
      <div class="mf"><label data-lbl="lblCsect">${T.lblCsect}</label><input type="text" id="csect_${id}" value="${(data&&data.csect)||''}" placeholder="3×2.5 mm²"/></div>
    </div>
    <span class="sub-lbl" data-lbl="sublCoupe">${T.sublCoupe}</span>
    <div class="mg">
      <div class="mf"><label data-lbl="lblCourbe">${T.lblCourbe}</label><input type="text" id="courbe_${id}" value="${(data&&data.courbe)||''}" placeholder="B/C/D..." list="courbe-list-${id}" autocomplete="off"/><datalist id="courbe-list-${id}"><option value="B"/><option value="C"/><option value="D"/><option value="K"/><option value="Z"/></datalist></div>
      <div class="mf"><label data-lbl="lblInom">${T.lblInom}</label><input type="text" id="inom_${id}" value="${(data&&data.inom)||''}" placeholder="16" list="inom-list-${id}" autocomplete="off"/><datalist id="inom-list-${id}"><option value="2 A"/><option value="4 A"/><option value="6 A"/><option value="10 A"/><option value="13 A"/><option value="16 A"/><option value="20 A"/><option value="25 A"/><option value="32 A"/><option value="40 A"/><option value="50 A"/><option value="63 A"/><option value="80 A"/><option value="100 A"/><option value="125 A"/></datalist></div>
    </div>
    <span class="sub-lbl" data-lbl="sublIcc">${T.sublIcc}</span>
    <div class="mg">
      <div class="mf"><label data-lbl="lblIccMaxLpe">${T.lblIccMaxLpe}</label><input type="number" id="icc_max_lpe_${id}" value="${(data&&data.icc_max_lpe)||''}"/></div>
      <div class="mf"><label data-lbl="lblIccMinLpe">${T.lblIccMinLpe}</label><input type="number" id="icc_min_lpe_${id}" value="${(data&&data.icc_min_lpe)||''}"/></div>
      <div class="mf"><label data-lbl="lblIccMaxLn">${T.lblIccMaxLn}</label><input type="number" id="icc_max_ln_${id}" value="${(data&&data.icc_max_ln)||''}"/></div>
      <div class="mf"><label data-lbl="lblIccMinLn">${T.lblIccMinLn}</label><input type="number" id="icc_min_ln_${id}" value="${(data&&data.icc_min_ln)||''}"/></div>
      <div class="mf"><label data-lbl="lblRiso">${T.lblRiso}</label><input type="number" step="0.01" id="riso_${id}" value="${(data&&data.riso)||''}"/></div>
      <div class="mf"><label data-lbl="lblRlo">${T.lblRlo}</label><input type="number" step="0.01" id="rlo_${id}" value="${(data&&data.rlo)||''}"/></div>
    </div>
    <span class="sub-lbl" data-lbl="sublDdr">${T.sublDdr}</span>
    <div class="mg">
      <div class="mf"><label data-lbl="lblDdrInom">${T.lblDdrInom}</label><input type="number" id="ddr_inom_${id}" value="${(data&&data.ddr_inom)||''}"/></div>
      <div class="mf"><label data-lbl="lblDdrIdelta">${T.lblDdrIdelta}</label><input type="text" id="ddr_idelta_${id}" value="${(data&&data.ddr_idelta)||''}" placeholder="mA" list="idelta-list-${id}" autocomplete="off"/><datalist id="idelta-list-${id}"><option value="10 mA"/><option value="15 mA"/><option value="30 mA"/><option value="300 mA"/></datalist></div>
      <div class="mf"><label data-lbl="lblDdrTemps">${T.lblDdrTemps}</label><input type="number" id="ddr_temps_${id}" value="${(data&&data.ddr_temps)||''}"/></div>
      <div class="mf"><label data-lbl="lblChamp">${T.lblChamp}</label><select id="champ_${id}"><option value="">—</option><option>OK</option><option>NOK</option><option>N/A</option></select></div>
      <div class="mf"><label data-lbl="lblChute">${T.lblChute}</label><input type="number" step="0.1" id="chute_${id}" value="${(data&&data.chute)||''}"/></div>
    </div>
    <span class="sub-lbl" data-lbl="sublRem">${T.sublRem||'Remarque'}</span>
    <textarea id="rem_${id}" rows="2" placeholder="${T.lblRemCircuit||'Remarque sur ce circuit...'}" style="border:1px solid var(--border);border-radius:8px;padding:8px 10px;font-size:13px;background:#fff;color:var(--text);width:100%;outline:none;resize:vertical;min-height:48px;">${(data&&data.rem)||''}</textarea>`;
  box.appendChild(d);
  if(data){if(data.courbe)$('courbe_'+id).value=data.courbe;if(data.ddr_idelta)$('ddr_idelta_'+id).value=data.ddr_idelta;if(data.champ)$('champ_'+id).value=data.champ;}
  updateBadge();
}
function removeCircuit(id){
  const el=$('cc-'+id);if(el)el.remove();
  circuitIds=circuitIds.filter(x=>x!==id);
  if(!circuitIds.length){const box=$('circuits-container');box.innerHTML=`<p id="no-circuit-msg" style="text-align:center;color:var(--muted);font-size:13px;padding:8px 0;">${I18N[currentLang].noCircuit}</p>`;}
  circuitIds.forEach((cid,i)=>{const b=$('cn-'+cid);if(b)b.textContent=i+1;});
  updateBadge();saveData();
}
function updateBadge(){$('cct').textContent=circuitIds.length;}

// ═══════════════════════════════════════════════════════════
// SAVE / LOAD
// ═══════════════════════════════════════════════════════════
const FIELDS=['nom_installation','num_tableau','page','objet','num_compteur','cc_general','cc_abonne','tension','instrument','num_inventaire','facteur_icc','valeur_facteur','vc1','vc2','vc3','vc4','vc5','vc6','vc7','vc8','remarques','nom_prenom','lieu','date_sig'];
function saveData(){
  const d={lang:currentLang};
  FIELDS.forEach(f=>d[f]=gv(f));
  d.sigData=sigData;
  d.circuits=circuitIds.filter(id=>!!$('cc-'+id)).map(id=>({groupe:gv('groupe_'+id),desig:gv('desig_'+id),ctype:gv('ctype_'+id),csect:gv('csect_'+id),courbe:gv('courbe_'+id),inom:gv('inom_'+id),icc_max_lpe:gv('icc_max_lpe_'+id),icc_min_lpe:gv('icc_min_lpe_'+id),icc_max_ln:gv('icc_max_ln_'+id),icc_min_ln:gv('icc_min_ln_'+id),riso:gv('riso_'+id),rlo:gv('rlo_'+id),ddr_inom:gv('ddr_inom_'+id),ddr_idelta:gv('ddr_idelta_'+id),ddr_temps:gv('ddr_temps_'+id),champ:gv('champ_'+id),chute:gv('chute_'+id),rem:gv('rem_'+id)}));
  d.sigData=sigData;
  try{localStorage.setItem(SKEY,JSON.stringify(d));markSaved();}catch(e){showToast('Erreur sauvegarde');}
}
function loadData(){
  try{
    const raw=localStorage.getItem(SKEY);if(!raw)return;
    const d=JSON.parse(raw);
    if(d.lang && I18N[d.lang]){
      currentLang=d.lang;
      document.querySelectorAll('.lang-btn').forEach(b=>{b.classList.remove('active');if(b.textContent===d.lang.toUpperCase())b.classList.add('active');});
      applyLang();
    }
    FIELDS.forEach(f=>sv(f,d[f]));
    if(d.circuits&&d.circuits.length)d.circuits.forEach(c=>addCircuit(c));
    if(d.sigData){sigData=d.sigData;const prev=$('sig-preview');const ctx=prev.getContext('2d');prev.width=prev.offsetWidth*window.devicePixelRatio;prev.height=prev.offsetHeight*window.devicePixelRatio;ctx.scale(window.devicePixelRatio,window.devicePixelRatio);const img=new Image();img.onload=()=>{ctx.drawImage(img,0,0,prev.offsetWidth,prev.offsetHeight);};img.src=sigData;$('sig-placeholder').style.display='none';$('sig-clear-btn').style.display='block';}
    markSaved();showToast(I18N[currentLang].restored);
  }catch(e){console.error(e);}
}
function clearData(){if(!confirm(I18N[currentLang].confirmClear))return;localStorage.removeItem(SKEY);location.reload();}

// ═══════════════════════════════════════════════════════════
// EXPORT / IMPORT
// ═══════════════════════════════════════════════════════════
function collectAll(){
  const d={lang:currentLang, _version:1, _app:'SBB_Protocole'};
  FIELDS.forEach(f=>d[f]=gv(f));
  d.sigData=sigData;
  d.circuits=circuitIds.filter(id=>!!$('cc-'+id)).map(id=>({
    groupe:gv('groupe_'+id),desig:gv('desig_'+id),ctype:gv('ctype_'+id),csect:gv('csect_'+id),
    courbe:gv('courbe_'+id),inom:gv('inom_'+id),
    icc_max_lpe:gv('icc_max_lpe_'+id),icc_min_lpe:gv('icc_min_lpe_'+id),
    icc_max_ln:gv('icc_max_ln_'+id),icc_min_ln:gv('icc_min_ln_'+id),
    riso:gv('riso_'+id),rlo:gv('rlo_'+id),
    ddr_inom:gv('ddr_inom_'+id),ddr_idelta:gv('ddr_idelta_'+id),
    ddr_temps:gv('ddr_temps_'+id),champ:gv('champ_'+id),chute:gv('chute_'+id),
    rem:gv('rem_'+id)
  }));
  return d;
}

function exportData(){
  const d=collectAll();
  const json=JSON.stringify(d,null,2);
  const blob=new Blob([json],{type:'application/json'});
  const url=URL.createObjectURL(blob);
  const a=document.createElement('a');
  const tab=(d.num_tableau||'T00').replace(/[\s/\\]/g,'_');
  const date=d.date_sig||new Date().toISOString().slice(0,10);
  a.href=url; a.download='SBB_Protocole_'+tab+'_'+date+'.json';
  document.body.appendChild(a);a.click();document.body.removeChild(a);
  setTimeout(()=>URL.revokeObjectURL(url),1000);
  showToast('Export téléchargé ✓');
}

// ── Import pending data (stored while modal is open) ──────────────────
let _importPending = null;

function importData(evt){
  const file=evt.target.files[0]; if(!file)return;
  const reader=new FileReader();
  reader.onload=e=>{
    try{
      const d=JSON.parse(e.target.result);
      if(!d._app||d._app!=='SBB_Protocole') throw new Error('Fichier non reconnu');
      _importPending = d;
      $('import-modal').style.display='flex';
    }catch(err){
      showToast('Erreur import: '+err.message, 4000);
    }
    evt.target.value='';
  };
  reader.readAsText(file);
}

function closeImportModal(){
  $('import-modal').style.display='none';
  _importPending = null;
}

function doImport(mode){
  $('import-modal').style.display='none';
  const d = _importPending;
  _importPending = null;
  if(!d) return;

  if(mode === 'replace'){
    // ── Mode remplacement total ──────────────────────────────
    circuitIds=[]; nextId=1;
    $('circuits-container').innerHTML=`<p id="no-circuit-msg" style="text-align:center;color:var(--muted);font-size:13px;padding:8px 0;">${I18N[currentLang].noCircuit}</p>`;
    if(d.lang&&I18N[d.lang]){
      currentLang=d.lang;
      document.querySelectorAll('.lang-btn').forEach(b=>{b.classList.remove('active');if(b.textContent===d.lang.toUpperCase())b.classList.add('active');});
      applyLang();
    }
    FIELDS.forEach(f=>sv(f,d[f]));
    if(d.circuits&&d.circuits.length) d.circuits.forEach(c=>addCircuit(c));
    if(d.sigData){ sigData=d.sigData; }
    localStorage.setItem(SKEY,JSON.stringify(d));
    markSaved(); updateBadge();
    showToast('Import complet ✓');

  } else if(mode === 'merge'){
    // ── Mode fusion — ajoute uniquement les circuits absents ──
    if(!d.circuits||!d.circuits.length){
      showToast('Aucun circuit à ajouter');
      return;
    }
    // Collect existing designations to detect duplicates
    const existingDesigs = new Set(
      circuitIds
        .filter(id=>!!$('cc-'+id))
        .map(id=>gv('groupe_'+id)+'|'+gv('desig_'+id))
    );
    let added = 0;
    d.circuits.forEach(c=>{
      const key = (c.groupe||'')+'|'+(c.desig||'');
      if(!existingDesigs.has(key)){
        if(circuitIds.length < 18){
          addCircuit(c);
          added++;
        }
      }
    });
    saveData();
    showToast(added > 0 ? `${added} circuit(s) ajouté(s) ✓` : 'Aucun nouveau circuit à ajouter');
  }
}
