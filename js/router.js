/* ---------- router ---------- */
var TITLE={home:"Beranda",abs:"Absensi Siswa",jdw:"Jadwal Mengajar",jad:"Atur Jadwal",jur:"Jurnal Mengajar",info:"Pengumuman",rkp:"Rekap Absensi",sis:"Data Siswa",nil:"Nilai",gur:"Daftar Guru",stt:"Status Absensi",acc:"Kelola Akun",log:"Log Aktivitas",set:"Pengaturan Sekolah",pro:"Akun Saya"};
var INIT={abs:absRows,rkp:rkpRows,sis:sisRows,nil:nilRows,gur:gurRows,stt:sttRows};
function go(v){cur=v;$("view").innerHTML=V[v]();$("crumb").textContent=TITLE[v]+" \u00b7 TP "+SET.tp;
  document.querySelectorAll("#nav a").forEach(function(a){a.classList.toggle("act",a.dataset.v===v||(v==="abs"&&a.dataset.v==="jdw"))});
  if(INIT[v])INIT[v]();if(innerWidth<=700)$("side").classList.remove("on");window.scrollTo(0,0);if(window.sessSave)sessSave(v)}
$("nav").onclick=function(e){var a=e.target.closest("a");if(a)go(a.dataset.v)};
var view=$("view");
view.addEventListener("click",function(e){var t=e.target;
  if(t.dataset.go){selK=t.dataset.go;go("abs")}
  else if(t.id==="allh"){document.querySelectorAll('#tb input[value=H]').forEach(function(r){r.checked=true});absSum()}
  else if(t.id==="save")absSave();
  else if(t.id==="gsave")nilSave();else if(admClick(t)){}
  else if(t.id==="add"){var n=$("nn").value.trim();if(!n){toast("Isi nama siswa dulu");return}var k=$("nk").value,a=R(k);
    var ni=($("ni").value||"").trim(),used={};Object.keys(roster).forEach(function(kk){roster[kk].forEach(function(x){used[x.nis]=1})});if(ni&&used[ni]){toast("NIS "+ni+" sudah dipakai");return}if(!ni){var i=a.length+1;do{ni="2026"+(10+KELAS.indexOf(k))+String(i++).padStart(3,"0")}while(used[ni])}a.push({nis:ni,nama:n});$("nn").value="";$("ni").value="";sisRows();toast(n+" ditambahkan ke kelas "+k)}
  else if(t.dataset.del){var a2=R(t.dataset.k);roster[t.dataset.k]=a2.filter(function(s){return s.nis!==t.dataset.del});sisRows();toast("Siswa dihapus")}});
view.addEventListener("change",function(e){var id=e.target.id;
  if(id==="kelas"){selK=e.target.value;absRows()}else if(id==="tgl")absRows();
  else if(id==="rk"){selK=e.target.value;rkpRows()}else if(id==="rbl"||id==="rth1"||id==="rth2")rkpRows();else if(id==="fk")sisRows();else if(id==="st2")sttRows();
  else if(id==="gk"||id==="gm"){selK=$("gk").value;nilRows()}
  else if(e.target.type==="radio")absSum()});
view.addEventListener("input",function(e){if(e.target.id==="q")sisRows();if(e.target.id==="gq")gurRows();if(e.target.dataset.f)nilCalc()});

