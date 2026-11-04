/* Data Siswa dan Nilai */
V.sis=function(){
  return '<div class="ctrl"><input id="q" placeholder="Cari nama / NIS..."><select id="fk">'+opts(CL(),selK,"Kelas ")+'</select></div>'+(EDIT()?'<div class="ctrl" style="margin-top:10px"><input id="ni" placeholder="NIS (opsional)"><input id="nn" placeholder="Nama siswa baru"><select id="nk">'+opts(CL(),selK,"Kelas ")+'</select><button class="btn g" id="add">Tambah Siswa</button></div>':'')+'<div class="sum" id="ssum"></div><div class="tw"><table><thead><tr><th>NIS</th><th>Nama Siswa</th><th>Kelas</th><th>L/P</th><th>Nama Wali</th><th>HP Wali</th><th></th></tr></thead><tbody id="sb"></tbody></table></div>';
};
function sisRows(){
  var q=$("q").value.toLowerCase(),f=$("fk").value,n=0,h="";
  CL().forEach(function(k){if(f&&f!==k)return;R(k).forEach(function(s){if(q&&(s.nama+s.nis).toLowerCase().indexOf(q)<0)return;n++;
    h+='<tr><td>'+s.nis+'</td><td>'+esc(s.nama)+'</td><td>'+k+'</td><td>'+(s.jk||'-')+'</td><td>'+esc(s.wali||'-')+'</td><td>'+esc(s.hp||'-')+'</td><td style="white-space:nowrap">'+(EDIT()?'<button class="btn sm line" data-edit="'+s.nis+'" data-k="'+k+'">Edit</button> <button class="btn sm r" data-del="'+s.nis+'" data-k="'+k+'">Hapus</button>':'')+'</td></tr>'})});
  $("sb").innerHTML=h||'<tr><td colspan="7" style="color:var(--muted)">Tidak ada data.</td></tr>';$("ssum").innerHTML='<span class="chip">Menampilkan '+n+' siswa</span>';
}
V.nil=function(){
  return '<div class="ctrl"><select id="gk">'+opts(CL(),selK,"Kelas ")+'</select><select id="gm">'+opts([me.m],me.m)+'</select><button class="btn g" id="gsave">Simpan Nilai</button></div><div class="sum" id="gsum"></div><div class="tw"><table><thead><tr><th>No</th><th>Nama Siswa</th><th>Absensi (10%)</th><th>Harian (20%)</th><th>Tugas (20%)</th><th>UTS (20%)</th><th>UAS (30%)</th><th>Rata-rata</th><th>Predikat</th></tr></thead><tbody id="gb"></tbody></table></div><p style="color:var(--muted);font-size:12px">Nilai Absensi terisi otomatis dari persentase kehadiran siswa pada absensi yang sudah Anda simpan. Nilai Harian, Tugas, UTS, dan UAS diisi manual.</p>';
};
function pred(v){return v>=90?"A":v>=80?"B":v>=70?"C":v>0?"D":"-"}
function absPct(k,nis){var H=0,T=0;for(var key in absen){var p=key.split("|");if(p[0]===k&&p[2]===me.u&&absen[key][nis]){T++;if(absen[key][nis].s==="H")H++}}return T?Math.round(H/T*100):null}
function nilRows(){
  var k=$("gk").value,g=grades[k+"|"+$("gm").value]||{};
  $("gb").innerHTML=R(k).map(function(s,i){var v=g[s.nis]||{},ap=absPct(k,s.nis);
    return '<tr data-n="'+s.nis+'"><td>'+(i+1)+'</td><td>'+esc(s.nama)+'</td><td class="ab" data-ab="'+(ap===null?"":ap)+'">'+(ap===null?"-":ap)+'</td>'+["h","t","u","a"].map(function(f){return '<td><input class="cell num" type="number" min="0" max="100" data-f="'+f+'" value="'+(v[f]===undefined?"":v[f])+'"></td>'}).join("")+'<td class="avg"></td><td class="pr"></td></tr>'}).join("");
  nilCalc();
}
function nilCalc(){var sum=0,n=0,ok=0;
  document.querySelectorAll('#gb tr').forEach(function(tr){var x=function(f){return parseFloat(tr.querySelector('[data-f='+f+']').value)||0};
    var filled=[].some.call(tr.querySelectorAll("[data-f]"),function(i){return i.value!==""});
    var ab=parseFloat(tr.querySelector(".ab").dataset.ab)||0;
    var avg=filled?nilaiAkhir(ab,x("h"),x("t"),x("u"),x("a")):0;
    tr.querySelector(".avg").innerHTML='<b>'+avg+'</b>';tr.querySelector(".pr").innerHTML='<b class="'+(avg>=80?"h":avg>=70?"i":avg>0?"a":"")+'">'+pred(avg)+'</b>';
    n++;if(avg>0){sum+=avg;ok++}});
  $("gsum").innerHTML='<span class="chip">Rata-rata kelas: <b>'+(ok?Math.round(sum/ok*10)/10:0)+'</b></span><span class="chip">Sudah diisi: '+ok+'/'+n+'</span>'}
function nilSave(){var o={};document.querySelectorAll('#gb tr').forEach(function(tr){o[tr.dataset.n]={};tr.querySelectorAll("[data-f]").forEach(function(i){o[tr.dataset.n][i.dataset.f]=i.value})});
  grades[$("gk").value+"|"+$("gm").value]=o;logA("Simpan nilai "+$("gm").value+" kelas "+$("gk").value);toast("Nilai "+$("gm").value+" kelas "+$("gk").value+" tersimpan")}

