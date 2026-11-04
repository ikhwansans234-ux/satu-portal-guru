/* Beranda, Absensi, Jadwal Mengajar, Rekap Absensi */
/* ---------- views ---------- */
var V={};
V.home=function(){
  var total=0;CL().forEach(function(k){total+=R(k).length});
  var hari=DAYS[new Date().getDay()],j=JD()[hari]||[],h=0,t=0;
  var d=absen[selK+"|"+today];if(d){for(var n in d){t++;if(d[n].s==="H")h++}}
  return '<div class="stats"><div class="stat"><small>Total Siswa</small><b>'+total+'</b></div><div class="stat"><small>Jumlah Kelas</small><b>'+CL().length+'</b></div><div class="stat"><small>Jam Mengajar Hari Ini</small><b>'+j.length+'</b></div><div class="stat"><small>Kelas Sudah Diabsen Hari Ini</small><b>'+Object.keys(absen).filter(function(x){return x.split("|")[1]===today}).length+'</b></div></div>'+
  '<h3>Jadwal Hari Ini ('+hari+')</h3>'+(j.length?'<div class="tw"><table><thead><tr><th>Jam</th><th>Mapel</th><th>Kelas</th><th></th></tr></thead><tbody>'+j.map(function(x){return '<tr><td>'+x[0]+'</td><td>'+x[1]+'</td><td>'+x[2]+'</td><td><button class="btn sm" data-go="'+x[2]+'">Absen</button></td></tr>'}).join("")+'</tbody></table></div>':'<p style="color:var(--muted)">Tidak ada jadwal mengajar hari ini.</p>');
};
V.abs=function(){
  return '<div class="ctrl"><select id="kelas">'+opts(CL(),selK,"Kelas ")+'</select><input type="date" id="tgl" value="'+today+'"><button class="btn o" id="allh">Semua Hadir</button><button class="btn g" id="save">Simpan</button></div><div id="lk"></div><div class="sum" id="sum"></div><div class="tw"><table><thead><tr><th>No</th><th>NIS</th><th>Nama Siswa</th><th>Kelas</th><th>Kehadiran</th><th>Keterangan</th></tr></thead><tbody id="tb"></tbody></table></div>';
};
function absRows(){
  var k=$("kelas").value,d=absen[AK()]||{},locked=!!absen[AK()];
  $("tb").innerHTML=R(k).map(function(s,i){var v=d[s.nis]||{s:"H",k:""};
    return '<tr><td>'+(i+1)+'</td><td>'+s.nis+'</td><td>'+esc(s.nama)+'</td><td>'+k+'</td><td class="st">'+["H","S","I","A"].map(function(c){return '<label><input type="radio" name="r'+s.nis+'" value="'+c+'" data-n="'+s.nis+'"'+(v.s===c?" checked":"")+(locked?" disabled":"")+'>'+c+'</label>'}).join("")+'</td><td><input class="cell" data-k="'+s.nis+'" value="'+esc(v.k)+'" placeholder="Opsional"'+(locked?" disabled":"")+'></td></tr>'}).join("");
  absSum();armed=false;if(!locked&&!started[AK()])started[AK()]=hm();
  $("save").classList.toggle("hide",locked);$("allh").classList.toggle("hide",locked);
  $("lk").innerHTML=locked?'<p class="chip h" style="display:inline-block;margin:12px 0 0">\u2713 Absensi sudah dikirim ('+esc(absen[AK()]._t||"")+') dan tidak dapat diubah.</p>':'';
}
function hm(){return new Date().toLocaleTimeString("id-ID",{hour:"2-digit",minute:"2-digit"})}
function AK(){return $("kelas").value+"|"+$("tgl").value+"|"+me.u}
function absSum(){var c={H:0,S:0,I:0,A:0};document.querySelectorAll('#tb input[type=radio]:checked').forEach(function(r){c[r.value]++});
  $("sum").innerHTML='<span class="chip">Total: '+(c.H+c.S+c.I+c.A)+'</span><span class="chip h">Hadir: '+c.H+'</span><span class="chip s">Sakit: '+c.S+'</span><span class="chip i">Izin: '+c.I+'</span><span class="chip a">Alpa: '+c.A+'</span>'}
function absSave(){if(absen[AK()]){toast("Absensi sudah dikirim dan tidak dapat diubah");return}
  if(!armed){armed=true;toast("Absensi tidak dapat diubah setelah disimpan. Klik Simpan sekali lagi untuk konfirmasi.");return}
  var o={};document.querySelectorAll('#tb input[type=radio]:checked').forEach(function(r){o[r.dataset.n]={s:r.value,k:""}});
  document.querySelectorAll('#tb input.cell').forEach(function(i){if(o[i.dataset.k])o[i.dataset.k].k=i.value});
  o._t=new Date().toLocaleString("id-ID");o._m=started[AK()]||hm();o._s=hm();absen[AK()]=o;armed=false;logA("Simpan absensi kelas "+$("kelas").value+" ("+$("tgl").value+")");toast("Absensi kelas "+$("kelas").value+" tersimpan dan dikunci");absRows()}
V.jdw=function(){
  return '<div class="tw"><table><thead><tr><th>Hari</th><th>Jam</th><th>Mata Pelajaran</th><th>Kelas</th><th></th></tr></thead><tbody>'+
  Object.keys(JD()).map(function(h){return JD()[h].map(function(x,i){return '<tr'+(DAYS[new Date().getDay()]===h?' style="background:var(--sel)"':'')+'><td>'+(i?"":"<b>"+h+"</b>")+'</td><td>'+x[0]+'</td><td>'+x[1]+'</td><td>'+x[2]+'</td><td><button class="btn sm" data-go="'+x[2]+'">Absen</button></td></tr>'}).join("")}).join("")+'</tbody></table></div>';
};
V.rkp=function(){
  return '<div class="ctrl"><select id="rk">'+opts(CL(),selK,"Kelas ")+'</select><select id="rbl"></select>'+
  '<label style="margin:0;display:flex;gap:6px;align-items:center">Perhatian jika Alpa &ge; <input type="number" id="rth1" min="1" value="3" style="width:64px"></label>'+
  '<label style="margin:0;display:flex;gap:6px;align-items:center">atau Hadir &lt; <input type="number" id="rth2" min="1" max="100" value="75" style="width:70px">%</label></div>'+
  '<div class="sum" id="rsum"></div><div class="tw"><table><thead><tr><th>No</th><th>Nama Siswa</th><th>Hadir</th><th>Sakit</th><th>Izin</th><th>Alpa</th><th>% Kehadiran</th></tr></thead><tbody id="rb"></tbody></table></div>'+
  '<h3>Siswa yang Perlu Diperhatikan</h3><div id="ratt"></div>'+
  '<h3>Rekap Per Bulan</h3><div class="tw"><table><thead><tr><th>Bulan</th><th>Hadir</th><th>Sakit</th><th>Izin</th><th>Alpa</th><th>% Kehadiran</th></tr></thead><tbody id="rmo"></tbody></table></div>'+
  '<p style="color:var(--muted);font-size:12px">Rekap dihitung dari absensi yang sudah disimpan. Setiap pertemuan yang diabsen dihitung satu kali.</p>';
};
var BLN=["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];
function blnLabel(ym){var p=ym.split("-");return BLN[+p[1]-1]+" "+p[0]}
function rkpMonths(k){var m={};for(var key in absen){var p=key.split("|");if(p[0]===k&&p[1])m[p[1].slice(0,7)]=1}return Object.keys(m).sort().reverse()}
function rkpCount(k,nis,ym){var o={H:0,S:0,I:0,A:0};for(var key in absen){var p=key.split("|");if(p[0]!==k||!absen[key][nis])continue;if(ym&&p[1].slice(0,7)!==ym)continue;var c=absen[key][nis].s;if(o[c]!==undefined)o[c]++}return o}
function rkpRows(){
  var k=$("rk").value,sb=$("rbl");
  if(sb.dataset.k!==k){var ms=rkpMonths(k);sb.innerHTML='<option value="">Semua bulan</option>'+ms.map(function(m){return'<option value="'+m+'">'+blnLabel(m)+'</option>'}).join("");sb.dataset.k=k}
  var ym=sb.value,tH=0,tT=0,t1=parseInt($("rth1").value)||0,t2=parseInt($("rth2").value)||0,att=[];
  $("rb").innerHTML=R(k).map(function(s,i){
    var c=rkpCount(k,s.nis,ym),H=c.H,S=c.S,I=c.I,A=c.A;
    var tot=H+S+I+A,p=tot?Math.round(H/tot*100):0;tH+=H;tT+=tot;
    var why=[];if(t1&&A>=t1)why.push("Alpa "+A+" kali");if(tot&&t2&&p<t2)why.push("Kehadiran "+p+"%");
    if(why.length)att.push({n:s.nama,A:A,p:p,w:why.join(", ")});
    return '<tr><td>'+(i+1)+'</td><td>'+esc(s.nama)+'</td><td class="h">'+H+'</td><td class="s">'+S+'</td><td class="i">'+I+'</td><td class="a">'+A+'</td><td><div style="display:flex;gap:8px;align-items:center"><div class="bar2"><i style="width:'+p+'%"></i></div><b>'+p+'%</b></div></td></tr>'}).join("");
  $("rsum").innerHTML='<span class="chip">Rata-rata kehadiran kelas '+k+(ym?' ('+blnLabel(ym)+')':'')+': <b class="h">'+(tT?Math.round(tH/tT*100):0)+'%</b></span>';
  att.sort(function(a,b){return b.A-a.A||a.p-b.p});
  $("ratt").innerHTML=att.length?'<div class="tw"><table><thead><tr><th>Nama Siswa</th><th>Alpa</th><th>% Kehadiran</th><th>Keterangan</th></tr></thead><tbody>'+att.map(function(x){return'<tr><td>'+esc(x.n)+'</td><td class="a"><b>'+x.A+'</b></td><td>'+x.p+'%</td><td>'+x.w+'</td></tr>'}).join("")+'</tbody></table></div>':'<p style="color:var(--muted)">Tidak ada siswa yang melewati batas pada periode ini.</p>';
  var ms2=rkpMonths(k);
  $("rmo").innerHTML=ms2.map(function(m){var H=0,S=0,I=0,A=0;R(k).forEach(function(s){var c=rkpCount(k,s.nis,m);H+=c.H;S+=c.S;I+=c.I;A+=c.A});var tt=H+S+I+A;
    return'<tr><td>'+blnLabel(m)+'</td><td class="h">'+H+'</td><td class="s">'+S+'</td><td class="i">'+I+'</td><td class="a">'+A+'</td><td><b>'+(tt?Math.round(H/tt*100):0)+'%</b></td></tr>'}).join("")||'<tr><td colspan="6" style="color:var(--muted)">Belum ada absensi tersimpan.</td></tr>';
}

