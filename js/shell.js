/* ---------- shell ---------- */
$("burger").onclick=function(){var s=$("side");s.classList.toggle(innerWidth<=700?"on":"off")};
$("theme").onclick=function(){var r=document.documentElement,d=r.dataset.theme==="dark"||(!r.dataset.theme&&matchMedia("(prefers-color-scheme:dark)").matches);r.dataset.theme=d?"light":"dark"};
function enter(g,v){me=g;selK=CL()[0];$("m").textContent="";$("school").textContent=SET.sch.toUpperCase();
  $("nm").textContent=g.n.replace(/,.*$/,"");$("nip").textContent=g.j+(g.m!=="-"?" \u00b7 "+g.m:"");
  $("ava").textContent=(g.n.replace(/,.*$/,"").replace(/^Dr\.\s*/,"").match(/\b\w/g)||["G"]).slice(0,2).join("").toUpperCase();
  $("nav").innerHTML=Object.keys(MENU).filter(function(k){return k!=="abs"&&MENU[k][1].indexOf(g.r)>=0}).map(function(k){return '<a data-v="'+k+'"><i></i>'+MENU[k][0]+'</a>'}).join("");
  $("login").classList.add("hide");$("app").classList.remove("hide");go(v||"home")}
function login0(){var u=$("u").value.trim().toLowerCase(),p=$("p").value;
  var g=GURU.filter(function(x){return x.u===u&&x.h===HP(u,p)})[0];
  if(!g){$("m").textContent="Username atau password salah.";return}
  if(g.off){$("m").textContent="Akun dinonaktifkan. Hubungi Tata Usaha.";return}
  enter(g,"home");logA("Login");if(window.sessSave)sessSave("home")}
$("go").onclick=function(){login()};$("p").onkeydown=function(e){if(e.key==="Enter")login()};
$("out").onclick=function(){$("app").classList.add("hide");$("login").classList.remove("hide");$("p").value="";$("u").value="";logA("Logout");me=null;if(window.sessClear)sessClear()};

(function(){var p=document.getElementById("p"),e=document.getElementById("eye"),c=document.getElementById("caps");
e.onclick=function(){var h=p.type==="password";p.type=h?"text":"password";e.style.color=h?"var(--primary)":"";p.focus()};
function k(ev){c.style.display=ev.getModifierState&&ev.getModifierState("CapsLock")?"block":"none"}
p.addEventListener("keyup",k);p.addEventListener("keydown",k);p.addEventListener("blur",function(){c.style.display="none"});
document.getElementById("u").addEventListener("keydown",function(ev){if(ev.key==="Enter")p.focus()})})();

