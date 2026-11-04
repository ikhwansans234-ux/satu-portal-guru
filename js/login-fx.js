/* Efek halaman login: jam + sapaan sesuai waktu, indikator memuat pada tombol,
   dan gerakan halus mengikuti kursor (hanya di layar dengan mouse). */
(function(){
  var login=$("login"),g=$("greet"),c=$("clkT"),btn=$("go"),m=$("m");
  if(!login||!g||!c)return;
  var HR=["Minggu","Senin","Selasa","Rabu","Kamis","Jumat","Sabtu"],
      BL=["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];
  function p2(n){return(n<10?"0":"")+n}
  function sapa(h){return h<4?"Selamat malam":h<11?"Selamat pagi":h<15?"Selamat siang":h<18?"Selamat sore":"Selamat malam"}
  function tick(){
    if(login.classList.contains("hide"))return;           /* tidak perlu berjalan saat sudah masuk */
    var d=new Date();
    c.textContent=HR[d.getDay()]+", "+d.getDate()+" "+BL[d.getMonth()]+" "+d.getFullYear()+" \u00b7 "+p2(d.getHours())+":"+p2(d.getMinutes())+":"+p2(d.getSeconds());
    var t=sapa(d.getHours())+"! Silakan login untuk melanjutkan";
    if(g.textContent!==t)g.textContent=t;
  }
  tick();setInterval(tick,1000);

  /* tombol menampilkan putaran saat aplikasi menghubungi database */
  new MutationObserver(function(){btn.classList.toggle("busy",/Menghubungkan/.test(m.textContent))})
    .observe(m,{childList:true,characterData:true,subtree:true});

  /* gerakan halus mengikuti kursor */
  var fine=window.matchMedia&&matchMedia("(pointer:fine)").matches,
      calm=window.matchMedia&&matchMedia("(prefers-reduced-motion:reduce)").matches;
  if(fine&&!calm){
    var raf=0,x=0,y=0;
    login.addEventListener("mousemove",function(e){
      x=(e.clientX/innerWidth-.5)*2;y=(e.clientY/innerHeight-.5)*2;
      if(raf)return;
      raf=requestAnimationFrame(function(){raf=0;login.style.setProperty("--mx",x.toFixed(3));login.style.setProperty("--my",y.toFixed(3))});
    });
    login.addEventListener("mouseleave",function(){login.style.setProperty("--mx",0);login.style.setProperty("--my",0)});
  }
})();
