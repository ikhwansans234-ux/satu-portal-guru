/* Jurnal Mengajar: guru mengisi materi per kelas per hari; kepala/admin memantau */
var jrPre=null;
function jrMonths(){var m={};m[today.slice(0,7)]=1;JURNAL.forEach(function(e){m[e.d.slice(0,7)]=1});return Object.keys(m).sort().reverse()}
function jrFind(u,k,d){return JURNAL.filter(function(e){return e.u===u&&e.k===k&&e.d===d})[0]}
function jrPending(u){var out=[];for(var key in absen){var p=key.split("|");if(p[2]===u&&!jrFind(u,p[0],p[1]))out.push({k:p[0],d:p[1]})}
  out.sort(function(a,b){return b.d.localeCompare(a.d)});return out}
function jrMon(){return me.r!=="guru"}
function jrCanWrite(){return me.r!=="admin"&&CL().length>0}

V.jur=function(){var pre=jrPre;jrPre=null;var h='';
  if(jrCanWrite())h+='<div class="card" style="margin:0 0 14px;box-shadow:none"><b>Isi Jurnal Mengajar</b>'+
   '<p style="color:var(--muted);font-size:12.5px;margin:4px 0 10px">Satu jurnal per kelas per hari. Menyimpan lagi di hari dan kelas yang sama akan memperbarui jurnal sebelumnya.</p>'+
   '<div class="ctrl"><input type="date" id="jrtgl" max="'+today+'" value="'+(pre?pre.d:today)+'"><select id="jrk">'+opts(CL(),pre?pre.k:selK,"Kelas ")+'</select><span id="jrst"></span></div>'+
   '<textarea class="in" id="jrx" rows="3" placeholder="Materi atau topik yang diajarkan" style="margin-top:8px;resize:vertical"></textarea>'+
   '<input class="in" id="jrc" placeholder="Catatan atau tugas (opsional)" style="margin-top:8px">'+
   '<div style="margin-top:10px"><button class="btn g" id="jrsave">Simpan Jurnal</button></div><div id="jrpend" style="margin-top:12px"></div></div>';
  h+='<div class="ctrl"><select id="jrbln">'+jrMonths().map(function(m){return'<option value="'+m+'">'+blnLabel(m)+'</option>'}).join("")+'</select>'+
   (jrMon()?'<select id="jrguru"><option value="">Semua guru</option>'+GURU.filter(function(g){return g.r!=="admin"&&g.k&&g.k.length}).map(function(g){return'<option value="'+g.u+'">'+esc(g.n)+'</option>'}).join("")+'</select>':'')+
   '<select id="jrkelas"><option value="">Semua kelas</option>'+opts(jrMon()?KELAS:CL(),"","Kelas ")+'</select><button class="btn line" id="jrexp">Ekspor Excel</button></div>'+
   '<div class="sum" id="jrsum"></div><div class="tw"><table><thead><tr><th>Tanggal</th>'+(jrMon()?'<th>Guru</th>':'')+'<th>Kelas</th><th>Mapel</th><th>Materi</th><th>Catatan</th><th></th></tr></thead><tbody id="jrbody"></tbody></table></div>';
  if(jrMon())h+='<h3>Kelengkapan Jurnal</h3><p style="color:var(--muted);font-size:12.5px;margin:0 0 8px">Setiap sesi yang sudah diabsen seharusnya punya jurnal. Dihitung untuk bulan yang dipilih.</p><div class="tw"><table><thead><tr><th>Guru</th><th>Sesi diabsen</th><th>Jurnal terisi</th><th>Kelengkapan</th></tr></thead><tbody id="jrrekap"></tbody></table></div>';
  return h};
function jrList(){var ym=$("jrbln").value,gu=$("jrguru")?$("jrguru").value:"",kl=$("jrkelas").value;
  var scope=jrMon()?function(e){return!gu||e.u===gu}:function(e){return e.u===me.u};
  var r=JURNAL.filter(function(e){return e.d.slice(0,7)===ym&&scope(e)&&(!kl||e.k===kl)});
  r.sort(function(a,b){return b.d.localeCompare(a.d)||a.k.localeCompare(b.k)});return r}
function jrGuruNama(u){var g=GURU.filter(function(x){return x.u===u})[0];return g?g.n:u}
function jrRows(){var r=jrList(),mon=jrMon();
  $("jrbody").innerHTML=r.map(function(e){var mine=e.u===me.u;
    return'<tr><td style="white-space:nowrap">'+tglIndo(e.d)+'</td>'+(mon?'<td>'+esc(jrGuruNama(e.u))+'</td>':'')+'<td>'+e.k+'</td><td>'+esc(e.m||"")+'</td><td style="white-space:pre-wrap">'+esc(e.x)+'</td><td>'+esc(e.c||"-")+'</td><td style="white-space:nowrap">'+
    (mine?'<button class="btn sm line" data-jredit="'+e.id+'">Edit</button> ':'')+((mine||me.r==="admin")?'<button class="btn sm r" data-jrdel="'+e.id+'">Hapus</button>':'')+'</td></tr>'}).join("")||'<tr><td colspan="'+(mon?7:6)+'" style="color:var(--muted)">Belum ada jurnal pada periode ini.</td></tr>';
  $("jrsum").innerHTML='<span class="chip">'+r.length+' jurnal</span>';
  if($("jrpend")){var pd=jrPending(me.u);$("jrpend").innerHTML=pd.length?'<div style="font-size:12.5px;color:var(--muted);margin-bottom:6px">Sesi diabsen yang belum ada jurnalnya ('+pd.length+'):</div>'+pd.slice(0,8).map(function(x){return'<button class="btn sm line" style="margin:0 6px 6px 0" data-jrfill="'+x.k+'|'+x.d+'">Kelas '+x.k+' &middot; '+tglIndo(x.d)+'</button>'}).join(""):''}
  if(mon&&$("jrrekap")){var ym=$("jrbln").value;
    $("jrrekap").innerHTML=GURU.filter(function(g){return g.r!=="admin"&&!g.off&&g.k&&g.k.length}).map(function(g){var s=0,f=0;
      for(var key in absen){var p=key.split("|");if(p[2]!==g.u||p[1].slice(0,7)!==ym)continue;s++;if(jrFind(g.u,p[0],p[1]))f++}
      return{n:g.n,s:s,f:f}}).filter(function(x){return x.s>0}).sort(function(a,b){return(a.f/a.s)-(b.f/b.s)}).map(function(x){var pc=Math.round(x.f/x.s*100);
        return'<tr><td>'+esc(x.n)+'</td><td>'+x.s+'</td><td>'+x.f+'</td><td><b class="'+(pc>=80?"h":pc>=50?"i":"a")+'">'+pc+'%</b></td></tr>'}).join("")||'<tr><td colspan="4" style="color:var(--muted)">Belum ada absensi pada bulan ini.</td></tr>'}}
function jrLoad(){if(!$("jrtgl"))return;var e=jrFind(me.u,$("jrk").value,$("jrtgl").value);
  $("jrx").value=e?e.x:"";$("jrc").value=e?(e.c||""):"";
  $("jrst").innerHTML=e?'<span class="chip h">Sudah ada jurnal, menyimpan akan memperbarui</span>':''}
INIT.jur=function(){jrRows();if(jrCanWrite())jrLoad()};
function jrCsvText(list){var rows=[["Tanggal","Guru","Kelas","Mapel","Materi","Catatan"]].concat(list.map(function(e){return[e.d,jrGuruNama(e.u),e.k,e.m||"",e.x,e.c||""]}));
  return"sep=;\n"+rows.map(function(r){return r.map(cc).join(";")}).join("\n")}
function jrAsk(k,d){var o=modal('<b style="font-size:16px">Absensi tersimpan</b><p style="color:var(--muted);margin:6px 0 14px">Isi jurnal mengajar kelas '+k+' sekarang?</p><div style="display:flex;gap:8px"><button class="btn g" id="jrgo">Isi Jurnal</button><button class="btn line" id="jrlater">Nanti</button></div>');
  o.onclick=function(e){if(e.target.id==="jrgo"){o.remove();jrPre={k:k,d:d};go("jur")}else if(e.target.id==="jrlater"||e.target===o)o.remove()}}
(function(){var o=absSave;absSave=function(){var kk=$("kelas")&&$("kelas").value,dd=$("tgl")&&$("tgl").value,had=!!absen[AK()];o();if(!had&&absen[AK()]&&me.r!=="admin")jrAsk(kk,dd)}})();
var oHomeJr=V.home;V.home=function(){var h=oHomeJr();if(me.r==="admin")return h;var n=jrPending(me.u).length;
  return(n?'<div class="card" style="margin:0 0 14px;box-shadow:none;border-left:4px solid var(--primary)"><b>Jurnal mengajar</b><p style="margin:4px 0 10px;color:var(--muted)">'+n+' sesi yang sudah diabsen belum ada jurnalnya.</p><button class="btn sm g" data-jrgo="1">Isi Jurnal</button></div>':'')+h};
view.addEventListener("change",function(e){var id=e.target.id;if(id==="jrbln"||id==="jrguru"||id==="jrkelas")jrRows();else if(id==="jrtgl"||id==="jrk")jrLoad()});
view.addEventListener("click",function(e){var t=e.target;
  if(t.dataset.jrgo){go("jur")}
  else if(t.id==="jrsave"){var k=$("jrk").value,d=$("jrtgl").value,x=$("jrx").value.trim();
    if(!d||d>today){toast("Tanggal tidak boleh kosong atau melewati hari ini");return}
    if(!x){toast("Isi materi yang diajarkan");return}
    var o=jrFind(me.u,k,d),c=$("jrc").value.trim();
    if(o){o.x=x;o.c=c;o.m=me.m}else JURNAL.push({id:Date.now().toString(36)+Math.random().toString(36).slice(2,5),u:me.u,k:k,d:d,m:me.m,x:x,c:c});
    persist();logA("Jurnal kelas "+k+" ("+d+")");var bl=$("jrbln");if(bl&&bl.value!==d.slice(0,7)&&[].some.call(bl.options,function(op){return op.value===d.slice(0,7)}))bl.value=d.slice(0,7);
    jrRows();jrLoad();toast(o?"Jurnal diperbarui":"Jurnal disimpan")}
  else if(t.dataset.jredit){var e2=JURNAL.filter(function(x){return x.id===t.dataset.jredit})[0];if(!e2||!$("jrtgl"))return;$("jrtgl").value=e2.d;$("jrk").value=e2.k;jrLoad();$("jrx").focus();$("jrx").scrollIntoView({block:"center"})}
  else if(t.dataset.jrdel){var id=t.dataset.jrdel;if(!confirm("Hapus jurnal ini?"))return;JURNAL=JURNAL.filter(function(x){return x.id!==id});persist();logA("Hapus jurnal");jrRows();toast("Jurnal dihapus")}
  else if(t.dataset.jrfill){var q=t.dataset.jrfill.split("|");$("jrtgl").value=q[1];$("jrk").value=q[0];jrLoad();$("jrx").focus();$("jrx").scrollIntoView({block:"center"})}
  else if(t.id==="jrexp"){var l=jrList();if(!l.length){toast("Tidak ada jurnal untuk diekspor");return}dl("jurnal-mengajar-"+$("jrbln").value+".csv","\ufeff"+jrCsvText(l));toast("File Excel (CSV) diunduh")}});

/* Tombol jurnal di halaman absensi yang sudah terkirim (kapan pun dibuka) */
(function(){var o=absRows;absRows=function(){o();var lk=$("lk");if(!lk||!lk.innerHTML||me.r==="admin")return;
  var k=$("kelas").value,d=$("tgl").value,ada=jrFind(me.u,k,d);
  lk.innerHTML+='<div style="margin-top:10px"><button class="btn '+(ada?'line':'g')+'" data-jrpre="'+k+'|'+d+'">'+(ada?'Lihat / Ubah Jurnal':'Isi Jurnal Mengajar')+'</button></div>'};
  INIT.abs=absRows})();
view.addEventListener("click",function(e){var q=e.target.dataset.jrpre;if(q){q=q.split("|");jrPre={k:q[0],d:q[1]};go("jur")}});
