/* ---------- tambahan: ekspor, cetak, cadangan ---------- */
var ph=document.createElement("div");ph.id="ph";document.body.insertBefore(ph,$("toast"));
function dl(n,t,m){var a=document.createElement("a");a.href=URL.createObjectURL(new Blob([t],{type:m||"text/csv;charset=utf-8"}));a.download=n;document.body.appendChild(a);a.click();setTimeout(function(){URL.revokeObjectURL(a.href);a.remove()},500)}
function cc(v){v=String(v).replace(/\s+/g," ").trim();return/[;"]/.test(v)?'"'+v.replace(/"/g,'""')+'"':v}
function exportTable(nm){var t=document.querySelector("#view table");if(!t){toast("Tidak ada tabel untuk diekspor");return}
  var hs=[].map.call(t.querySelectorAll("thead th"),function(h){return h.textContent}),keep=hs.map(function(h){return h.trim()!==""});
  var rows=[hs].concat([].map.call(t.querySelectorAll("tbody tr"),function(tr){return[].map.call(tr.children,function(td){var i=td.querySelector("input.cell");return i?i.value:td.textContent})}));
  var sel=document.querySelector("#view select"),k=sel?sel.value:"";
  var txt="sep=;\n"+rows.map(function(r){return r.filter(function(c,i){return keep[i]}).map(cc).join(";")}).join("\n");
  dl(nm+(k?"-kelas"+k:"")+(document.getElementById("rbl")&&document.getElementById("rbl").value?"-"+document.getElementById("rbl").value:"")+"-"+today+".csv","\ufeff"+txt);logA("Ekspor "+nm);toast("File Excel (CSV) diunduh")}
function doPrint(){var sel=document.querySelector("#view select");
  ph.innerHTML="<b>"+esc(SET.sch)+"</b> &middot; TP "+esc(SET.tp)+"<br>"+esc($("crumb").textContent)+(sel?" &middot; Kelas "+esc(sel.value):"")+" &middot; "+new Date().toLocaleDateString("id-ID");window.print()}
function tbar(nm){return'<div class="tb"><button class="btn sm g" data-x="'+nm+'">Ekspor Excel</button></div>'}
[["rkp","rekap-absensi"],["sis","data-siswa"],["nil","nilai"]].forEach(function(p){var o=V[p[0]];V[p[0]]=function(){return tbar(p[1])+o()}});
var oSet=V.set;V.set=function(){return oSet()+'<h3>Cadangan Data</h3><p style="color:var(--muted);font-size:13px">Unduh cadangan berkala. Berkas berisi akun, absensi, nilai, dan siswa, jadi simpan di tempat aman.</p><div class="ctrl"><button class="btn g" data-x="backup">Unduh Cadangan</button><label class="btn o" style="margin:0;cursor:pointer;display:inline-block">Pulihkan dari File<input type="file" id="rst" accept=".json" class="hide"></label></div>'};
view.addEventListener("click",function(e){var t=e.target,x=t.dataset.x;
  if(x==="print")doPrint();else if(x==="backup"){dl("cadangan-satu-"+today+".json",JSON.stringify({g:GURU,s:SET,l:LOG,a:absen,r:roster,n:grades,j:JADWAL,i:INFO,jr:JURNAL}),"application/json");logA("Unduh cadangan");toast("Cadangan diunduh")}
  else if(x)exportTable(x);
  if(t.id==="add"||t.dataset.del)persist()});
view.addEventListener("change",function(e){if(e.target.id!=="rst"||!e.target.files[0])return;var r=new FileReader();
  r.onload=function(){try{var d=JSON.parse(r.result);if(!d.g||!d.s)throw 0;if(!confirm("Semua data saat ini akan diganti dengan isi cadangan. Lanjutkan?"))return;
    GURU=d.g;mig();SET=d.s;LOG=d.l||[];absen=d.a||{};roster=d.r||{};grades=d.n||{};JADWAL=d.j||[];INFO=d.i||[];JURNAL=d.jr||[];persist();toast("Data dipulihkan, memuat ulang...");setTimeout(function(){location.reload()},900)}catch(er){toast("File cadangan tidak valid")}};r.readAsText(e.target.files[0])});

