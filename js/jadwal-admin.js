/* ---------- jadwal mengajar semua guru (dashboard admin) ---------- */
var HR=["Senin","Selasa","Rabu","Kamis","Jumat","Sabtu"];
function admJadwal(q,d){var r=[];q=(q||"").toLowerCase();
  GURU.forEach(function(g){if(!g.k||!g.k.length||g.off)return;var j=JD(g);
    HR.forEach(function(h){(j[h]||[]).forEach(function(x){r.push({n:g.n,m:g.m,d:h,t:x[0],k:x[2]})})})});
  r=r.filter(function(x){return(!d||x.d===d)&&(!q||(x.n+" "+x.m+" "+x.k).toLowerCase().indexOf(q)>=0)});
  r.sort(function(a,b){return HR.indexOf(a.d)-HR.indexOf(b.d)||a.t.localeCompare(b.t)||a.n.localeCompare(b.n)});
  return{n:r.length,h:r.map(function(x){return'<tr><td>'+x.d+'</td><td>'+x.t+'</td><td>'+esc(x.n)+'</td><td>'+esc(x.m)+'</td><td>Kelas '+x.k+'</td></tr>'}).join("")||'<tr><td colspan="5" style="color:var(--muted)">Tidak ada jadwal.</td></tr>'}}
var oHome=V.home;V.home=function(){var h=oHome();if(me.r!=="admin")return h;var a=admJadwal("","");
  return h+'<h3>Jadwal Mengajar Semua Guru</h3><div class="ctrl"><input id="jq" placeholder="Cari guru / mapel / kelas..."><select id="jh"><option value="">Semua Hari</option>'+opts(HR,"")+'</select></div><div class="sum"><span class="chip" id="jn">Total '+a.n+' sesi</span></div><div class="tw"><table><thead><tr><th>Hari</th><th>Jam</th><th>Guru</th><th>Mata Pelajaran</th><th>Kelas</th></tr></thead><tbody id="jb">'+a.h+'</tbody></table></div>'};
function admFilter(){var a=admJadwal($("jq").value,$("jh").value);$("jb").innerHTML=a.h;$("jn").textContent="Total "+a.n+" sesi"}
view.addEventListener("input",function(e){if(e.target.id==="jq")admFilter()});
view.addEventListener("change",function(e){if(e.target.id==="jh")admFilter()});

/* absensi dibuka dari Jadwal Mengajar */
var oAbs=V.abs;V.abs=function(){return'<div style="margin-bottom:10px"><button class="btn sm line" data-back="1">Kembali ke Jadwal</button></div>'+oAbs()};
view.addEventListener("click",function(e){if(e.target.dataset.back)go("jdw")});

