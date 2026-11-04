/* Atur Jadwal Mengajar (khusus admin) */
var HARI6=["Senin","Selasa","Rabu","Kamis","Jumat","Sabtu"];
function tmin(t){var p=t.split(".");return(+p[0])*60+(+p[1]||0)}
function jOv(a,b){var x=a.split("-"),y=b.split("-");return tmin(x[0])<tmin(y[1])&&tmin(y[0])<tmin(x[1])}
function guruJadwal(){return GURU.filter(function(g){return g.r!=="admin"&&g.k&&g.k.length&&!g.off})}
function gNama(u){var g=GURU.filter(function(x){return x.u===u})[0];return g?g.n:u}

V.jad=function(){var gs=guruJadwal();
  return '<div class="card" style="margin:0 0 14px;box-shadow:none"><b>Tambah Jadwal Mengajar</b>'+
  '<p style="color:var(--muted);font-size:12.5px;margin:4px 0 10px">Pilih guru, hari, jam, dan kelas. Guru yang sudah diisi jadwalnya akan memakai jadwal ini. Guru yang belum diisi masih memakai jadwal otomatis sementara.</p>'+
  '<div class="ctrl"><select id="jg">'+gs.map(function(g){return'<option value="'+g.u+'">'+esc(g.n)+'</option>'}).join("")+'</select>'+
  '<select id="jd">'+opts(HARI6,"")+'</select>'+
  '<label style="margin:0;display:flex;gap:6px;align-items:center">Mulai <input type="time" id="j1"></label>'+
  '<label style="margin:0;display:flex;gap:6px;align-items:center">Selesai <input type="time" id="j2"></label>'+
  '<select id="jk">'+opts(KELAS,"","Kelas ")+'</select>'+
  '<input id="jm" placeholder="Mapel (kosong = mapel guru)">'+
  '<button class="btn g" id="jadd">Tambah</button></div></div>'+
  '<div class="ctrl"><select id="jf"><option value="">Semua guru</option>'+gs.map(function(g){return'<option value="'+g.u+'">'+esc(g.n)+'</option>'}).join("")+'</select><button class="btn sm r hide" id="jclr">Hapus semua jadwal guru ini</button></div>'+
  '<div class="sum"><span class="chip" id="jcnt"></span></div>'+
  '<div class="tw"><table><thead><tr><th>Hari</th><th>Jam</th><th>Guru</th><th>Mata Pelajaran</th><th>Kelas</th><th></th></tr></thead><tbody id="jtb"></tbody></table></div>'+
  '<p id="jauto" style="color:var(--muted);font-size:12.5px;margin-top:12px"></p>'};
function jadRows(){var f=$("jf").value,r=JADWAL.filter(function(x){return!f||x.u===f});
  r.sort(function(a,b){return HARI6.indexOf(a.d)-HARI6.indexOf(b.d)||a.t.localeCompare(b.t)});
  $("jtb").innerHTML=r.map(function(x){return'<tr><td>'+x.d+'</td><td>'+x.t+'</td><td>'+esc(gNama(x.u))+'</td><td>'+esc(x.m||"")+'</td><td>Kelas '+x.k+'</td><td><button class="btn sm r" data-jdel="'+x.id+'">Hapus</button></td></tr>'}).join("")||'<tr><td colspan="6" style="color:var(--muted)">Belum ada jadwal yang diinput.</td></tr>';
  $("jcnt").textContent="Total "+r.length+" sesi";
  $("jclr").classList.toggle("hide",!f||!r.length);
  var auto=guruJadwal().filter(function(g){return!JADWAL.some(function(x){return x.u===g.u})}).map(function(g){return g.n});
  $("jauto").textContent=auto.length?"Masih memakai jadwal otomatis ("+auto.length+" guru): "+auto.join(", "):"Semua guru sudah memakai jadwal yang Anda input."}
INIT.jad=jadRows;

view.addEventListener("change",function(e){if(e.target.id==="jf")jadRows()});
view.addEventListener("click",function(e){var t=e.target;
  if(t.id==="jadd"){
    var g=GURU.filter(function(x){return x.u===$("jg").value})[0],d=$("jd").value,a=$("j1").value,b=$("j2").value,k=$("jk").value;
    if(!g){toast("Pilih guru terlebih dahulu");return}
    if(!a||!b){toast("Isi jam mulai dan jam selesai");return}
    var tt=a.replace(":",".")+"-"+b.replace(":",".");
    if(tmin(b.replace(":","."))<=tmin(a.replace(":","."))){toast("Jam selesai harus setelah jam mulai");return}
    var bg=JADWAL.filter(function(x){return x.d===d&&x.u===g.u&&jOv(x.t,tt)})[0];
    if(bg){toast("Bentrok: "+g.n+" sudah mengajar "+bg.t+" kelas "+bg.k);return}
    var bk=JADWAL.filter(function(x){return x.d===d&&x.k===k&&jOv(x.t,tt)})[0];
    if(bk){toast("Bentrok: kelas "+k+" sudah diisi "+gNama(bk.u)+" ("+bk.t+")");return}
    JADWAL.push({id:Date.now().toString(36)+Math.random().toString(36).slice(2,6),u:g.u,d:d,t:tt,k:k,m:($("jm").value||"").trim()||g.m});
    if(g.k.indexOf(k)<0){g.k.push(k);g.k.sort()}
    persist();logA("Tambah jadwal "+g.n+" "+d+" "+tt+" kelas "+k);
    $("j1").value="";$("j2").value="";$("jm").value="";jadRows();toast("Jadwal ditambahkan")}
  else if(t.dataset.jdel){var id=t.dataset.jdel;JADWAL=JADWAL.filter(function(x){return x.id!==id});persist();logA("Hapus jadwal");jadRows();toast("Jadwal dihapus")}
  else if(t.id==="jclr"){var u=$("jf").value;if(u&&confirm("Hapus semua jadwal "+gNama(u)+"? Guru ini akan kembali memakai jadwal otomatis.")){JADWAL=JADWAL.filter(function(x){return x.u!==u});persist();logA("Hapus semua jadwal "+gNama(u));jadRows();toast("Jadwal guru dihapus")}}
});
