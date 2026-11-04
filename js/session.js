/* Sesi login: pengguna tetap masuk saat halaman di-refresh atau aplikasi dibuka lagi,
   sampai menekan tombol Keluar. Yang disimpan hanya username dan halaman terakhir
   (tanpa password). Dimuat paling akhir agar menu bawah HP (mobile.js) sudah siap. */
var SESS_KEY="satu_sess";
function sessSave(v){if(!me)return;try{localStorage.setItem(SESS_KEY,JSON.stringify({u:me.u,v:v||cur,t:Date.now()}))}catch(e){}}
function sessClear(){try{localStorage.removeItem(SESS_KEY)}catch(e){}}
(function(){
  var s=null;try{s=JSON.parse(localStorage.getItem(SESS_KEY)||"null")}catch(e){}
  if(!s||!s.u)return;
  var g=GURU.filter(function(x){return x.u===s.u})[0];
  if(!g||g.off){sessClear();return}
  /* halaman Absensi butuh kelas yang dipilih dari Jadwal, jadi kembali ke Jadwal */
  var v=s.v==="abs"?"jdw":s.v;
  if(typeof V[v]!=="function"||(MENU[v]&&MENU[v][1].indexOf(g.r)<0))v="home";
  enter(g,v);
  /* setelah data online selesai ditarik: segarkan halaman, atau keluarkan jika akun dihapus/dinonaktifkan */
  (window.bootPull||Promise.resolve()).then(function(){
    if(!me)return;
    var f=GURU.filter(function(x){return x.u===me.u})[0];
    if(!f||f.off){$("out").click();return}
    var a=document.activeElement;
    if(a&&/^(INPUT|TEXTAREA|SELECT)$/.test(a.tagName)&&$("view").contains(a))return;
    if(["abs","nil","acc"].indexOf(cur)<0)go(cur);
  });
})();
