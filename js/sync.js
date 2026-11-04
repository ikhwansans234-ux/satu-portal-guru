/* Sinkronisasi database online (Supabase) */
var SB=window.SATU_SB||{url:"",key:""};
SB.on=!!(SB.url&&SB.key);SB.url=(SB.url||"").replace(/\/+$/,"");
var synced={},pulled=false,pushT=null,delKeys=[];
function syncDelete(k){delKeys.push(k);delete synced[k];syncPush()}
function setSt(t,c){var e=document.getElementById("sync");if(e){e.textContent=t;e.dataset.s=c||""}}
function snap(){var m={guru:GURU,set:SET,log:LOG.slice(-200),jadwal:JADWAL,info:INFO};
  var jm={};JURNAL.forEach(function(e){var ym=e.d.slice(0,7);(jm[ym]=jm[ym]||[]).push(e)});Object.keys(jm).forEach(function(ym){m["jurnal:"+ym]=jm[ym]});
  Object.keys(synced).forEach(function(k){if(k.indexOf("jurnal:")===0&&!m[k])m[k]=[]});
  Object.keys(roster).forEach(function(k){m["roster:"+k]=roster[k]});
  Object.keys(absen).forEach(function(k){m["absen:"+k]=absen[k]});
  Object.keys(grades).forEach(function(k){m["nilai:"+k]=grades[k]});return m}
function applyRow(k,v){if(k==="guru")GURU=v;else if(k==="set")SET=v;else if(k==="log")LOG=v;else if(k==="jadwal")JADWAL=v;else if(k==="info")INFO=v;else if(k.indexOf("jurnal:")===0){var ym=k.slice(7);JURNAL=JURNAL.filter(function(e){return e.d.slice(0,7)!==ym}).concat(v)}
  else{var i=k.indexOf(":"),t=k.slice(0,i),n=k.slice(i+1);(t==="roster"?roster:t==="absen"?absen:grades)[n]=v}}
function sbh(x){var h={apikey:SB.key,Authorization:"Bearer "+SB.key,"Content-Type":"application/json"};for(var k in x)h[k]=x[k];return h}
function syncPush(){if(!SB.on||!pulled)return;clearTimeout(pushT);pushT=setTimeout(doPush,700)}
function doPush(){var m=snap(),rows=[];for(var k in m){var j=JSON.stringify(m[k]);if(synced[k]!==j)rows.push({k:k,v:m[k],j:j})}
  var dels=delKeys.splice(0);
  if(!rows.length&&!dels.length)return Promise.resolve();setSt("Menyimpan...","w");
  var delP=dels.map(function(k){return fetch(SB.url+"/rest/v1/satu_data?k=eq."+encodeURIComponent(k),{method:"DELETE",headers:sbh()}).then(function(r){if(!r.ok)throw 0}).catch(function(){delKeys.push(k)})});
  if(!rows.length)return Promise.all(delP).then(function(){setSt(delKeys.length?"Offline, tersimpan di perangkat":"Tersinkron",delKeys.length?"err":"ok")});
  return fetch(SB.url+"/rest/v1/satu_data?on_conflict=k",{method:"POST",headers:sbh({Prefer:"resolution=merge-duplicates,return=minimal"}),body:JSON.stringify(rows.map(function(r){return{k:r.k,v:r.v}}))})
    .then(function(r){if(!r.ok)throw 0;rows.forEach(function(r){synced[r.k]=r.j});setSt("Tersinkron","ok")})
    .catch(function(){setSt("Offline, tersimpan di perangkat","err")})}
function pull(){if(!SB.on)return Promise.resolve();setSt("Menyinkronkan...","w");var all=[];
  function page(o){return fetch(SB.url+"/rest/v1/satu_data?select=k,v&order=k&limit=1000&offset="+o,{headers:sbh()}).then(function(r){if(!r.ok)throw 0;return r.json()}).then(function(a){all=all.concat(a);return a.length===1000?page(o+1000):all})}
  return page(0).then(function(rows){var m=snap();
    var remote={};rows.forEach(function(r){remote[r.k]=1;if(delKeys.indexOf(r.k)>=0)return;var j=JSON.stringify(r.v),dirty=synced[r.k]!==undefined&&m[r.k]!==undefined&&JSON.stringify(m[r.k])!==synced[r.k];
      if(!dirty){applyRow(r.k,r.v);synced[r.k]=j}});
    Object.keys(absen).forEach(function(n){var k="absen:"+n;if(synced[k]!==undefined&&!remote[k]){delete absen[n];delete synced[k]}});
    mig();if(me){var f=GURU.filter(function(x){return x.u===me.u})[0];if(f)me=f}
    try{localStorage.setItem(SK,JSON.stringify({g:GURU,s:SET,l:LOG.slice(-200),a:absen,r:roster,n:grades,j:JADWAL,i:INFO,jr:JURNAL}))}catch(e){}
    pulled=true;return doPush()})
  .catch(function(){pulled=pulled||false;setSt("Offline, tersimpan di perangkat","err")})}
function login(){if(!SB.on)return login0();
  $("m").textContent="Menghubungkan ke database...";pull().then(function(){$("m").textContent="";login0()})}
if(SB.on){window.bootPull=pull();setInterval(function(){if(me)pull()},45000)}else setSt("Mode lokal","");
$("sync").onclick=function(){if(!SB.on){toast("Database online belum diisi. Data tersimpan di perangkat ini saja.");return}pull().then(function(){if(["abs","nil","acc"].indexOf(cur)<0&&me)go(cur);toast("Data diperbarui")})};
