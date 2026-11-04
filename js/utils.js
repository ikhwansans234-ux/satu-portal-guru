/* Fungsi bantu: simpan, log, jadwal, toast, dll */
function persist(){try{localStorage.setItem(SK,JSON.stringify({g:GURU,s:SET,l:LOG.slice(-200),a:absen,r:roster,n:grades,j:JADWAL,i:INFO,jr:JURNAL}))}catch(e){}if(window.syncPush)syncPush()}
function logA(a){LOG.push({t:new Date().toLocaleString("id-ID"),w:me?me.n.replace(/,.*$/,""):"-",a:a});persist()}
function CL(){return(!me||me.r==="admin")?KELAS:me.k}
function EDIT(){return true}
function JD(g){g=g||me;var D=["Senin","Selasa","Rabu","Kamis","Jumat","Sabtu"],T=["07.00-07.35","07.35-08.10","08.30-09.05","09.05-09.40","10.00-10.35","10.35-11.10"],s=rnd(g.u),o={},r={};
  var man=JADWAL.filter(function(x){return x.u===g.u});
  if(man.length){D.forEach(function(d){var a=man.filter(function(x){return x.d===d}).sort(function(p,q){return p.t.localeCompare(q.t)});if(a.length)r[d]=a.map(function(x){return[x.t,x.m||g.m,x.k]})});return r}
  g.k.forEach(function(k,i){var d=D[(i+s)%6];(o[d]=o[d]||[]).push([T[s%6],g.m,k])});
  D.forEach(function(d){if(o[d])r[d]=o[d]});return r}
/* Bobot nilai akhir (jumlah = 1). Dipakai halaman Nilai. */
var BOBOT={ab:.1,h:.2,t:.2,u:.2,a:.3};
function nilaiAkhir(ab,h,t,u,a){return Math.round((ab*BOBOT.ab+h*BOBOT.h+t*BOBOT.t+u*BOBOT.u+a*BOBOT.a)*10)/10}
var esc=function(s){return String(s).replace(/[&<>"]/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]})};
function rnd(s){var x=0;for(var i=0;i<s.length;i++)x=(x*31+s.charCodeAt(i))%9973;return x}
function R(k){if(!roster[k]){var off=rnd(k)%20,a=[];for(var i=0;i<20;i++)a.push({nis:"2026"+(10+KELAS.indexOf(k))+String(i+1).padStart(3,"0"),nama:NAMES[(i+off)%20]});roster[k]=a}return roster[k]}
function toast(t){var e=$("toast");e.textContent=t;e.classList.remove("hide");setTimeout(function(){e.classList.add("hide")},2200)}
function opts(list,sel,pre){return list.map(function(k){return '<option value="'+k+'"'+(k===sel?" selected":"")+'>'+(pre||"")+k+'</option>'}).join("")}
var today=new Date().toISOString().slice(0,10);
var DAYS=["Minggu","Senin","Selasa","Rabu","Kamis","Jumat","Sabtu"];

