/* Tampilan HP: label sel tabel (untuk kartu), menu bawah, penutup menu samping */
(function(){
  /* 1. Beri atribut data-label pada sel agar tabel bisa tampil sebagai kartu di HP */
  function labelTables(){document.querySelectorAll("#view table").forEach(function(t){
    var hs=[].map.call(t.querySelectorAll("thead th"),function(h){return h.textContent.trim()});
    t.querySelectorAll("tbody tr").forEach(function(tr){[].forEach.call(tr.children,function(td,i){
      if(td.colSpan>1)return;if(hs[i]&&td.getAttribute("data-label")!==hs[i])td.setAttribute("data-label",hs[i])})})})}
  var raf=0;
  new MutationObserver(function(){if(raf)return;raf=requestAnimationFrame(function(){raf=0;labelTables()})})
    .observe($("view"),{childList:true,subtree:true});

  /* 2. Menu bawah */
  var IC={
    home:'<path d="M3 11l9-8 9 8"/><path d="M5 10v10h14V10"/>',
    jdw:'<rect x="3" y="4" width="18" height="17" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
    jur:'<path d="M4 4h12a4 4 0 0 1 4 4v12H8a4 4 0 0 1-4-4z"/><path d="M8 9h8M8 13h5"/>',
    nil:'<path d="M3 3v18h18"/><path d="M7 15l4-4 3 3 5-6"/>',
    stt:'<circle cx="12" cy="12" r="9"/><path d="M8 12l3 3 5-6"/>',
    jad:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    info:'<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10 21h4"/>',
    menu:'<path d="M4 6h16M4 12h16M4 18h16"/>'};
  var SHORT={home:"Beranda",jdw:"Jadwal",jur:"Jurnal",nil:"Nilai",stt:"Absensi",jad:"Atur Jadwal",info:"Info"};
  var bn=document.createElement("nav");bn.id="bnav";bn.setAttribute("aria-label","Menu utama");
  $("app").insertAdjacentElement("afterend",bn);
  var sc=document.createElement("div");sc.id="scrim";$("app").appendChild(sc);
  function svg(k){return'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">'+IC[k]+'</svg>'}
  function build(){if(!me||bn.dataset.u===me.u)return;bn.dataset.u=me.u;
    var want=me.r==="admin"?["home","stt","jad","info"]:["home","jdw","jur","nil"];
    bn.innerHTML=want.filter(function(k){return MENU[k]&&MENU[k][1].indexOf(me.r)>=0}).map(function(k){return'<a data-b="'+k+'">'+svg(k)+SHORT[k]+'</a>'}).join("")+'<a data-b="menu">'+svg("menu")+'Menu</a>'}
  function mark(){[].forEach.call(bn.children,function(a){a.classList.toggle("act",a.dataset.b===cur||(cur==="abs"&&a.dataset.b==="jdw"))})}
  var oGo=go;go=function(v){oGo(v);build();mark();window.scrollTo(0,0)};
  bn.addEventListener("click",function(e){var a=e.target.closest("a");if(!a)return;
    if(a.dataset.b==="menu")$("side").classList.add("on");else go(a.dataset.b)});

  /* 3. Menu samping menutup saat memilih menu atau menyentuh area gelap */
  sc.addEventListener("click",function(){$("side").classList.remove("on")});
  $("nav").addEventListener("click",function(){if(innerWidth<=700)$("side").classList.remove("on")});
})();
