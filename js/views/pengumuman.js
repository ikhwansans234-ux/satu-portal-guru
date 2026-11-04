/* Pengumuman sekolah: admin menulis, semua pengguna membaca di Beranda */
function tglIndo(d){return new Date(d+"T00:00:00").toLocaleDateString("id-ID",{day:"numeric",month:"long",year:"numeric"})}
function infoHTML(){var a=INFO.slice().sort(function(x,y){return y.d.localeCompare(x.d)}).slice(0,3);if(!a.length)return"";
  return'<div class="card" style="margin:0 0 16px;box-shadow:none;border-left:4px solid var(--amber)"><b>Pengumuman</b>'+a.map(function(x){
    return'<div style="margin-top:10px"><div style="font-weight:600">'+esc(x.t)+' <small style="color:var(--muted);font-weight:400">&middot; '+tglIndo(x.d)+'</small></div><div style="white-space:pre-wrap">'+esc(x.x)+'</div></div>'}).join("")+'</div>'}
var oHomeInfo=V.home;V.home=function(){return infoHTML()+oHomeInfo()};
V.info=function(){return'<div class="card" style="margin:0 0 14px;box-shadow:none"><b>Tulis Pengumuman</b><p style="color:var(--muted);font-size:12.5px;margin:4px 0 10px">Pengumuman tampil di Beranda semua guru dan kepala madrasah (3 terbaru).</p>'+
  '<input class="in" id="it" placeholder="Judul, misalnya: Libur Maulid Nabi"><textarea class="in" id="ix" rows="3" placeholder="Isi pengumuman" style="margin-top:8px;resize:vertical"></textarea>'+
  '<div style="margin-top:10px"><button class="btn g" id="iadd">Terbitkan</button></div></div>'+
  '<div class="tw"><table><thead><tr><th>Tanggal</th><th>Judul</th><th>Isi</th><th></th></tr></thead><tbody id="ib"></tbody></table></div>'};
function infoRows(){$("ib").innerHTML=INFO.slice().sort(function(x,y){return y.d.localeCompare(x.d)}).map(function(x){
  return'<tr><td style="white-space:nowrap">'+tglIndo(x.d)+'</td><td>'+esc(x.t)+'</td><td style="white-space:pre-wrap">'+esc(x.x)+'</td><td><button class="btn sm r" data-idel="'+x.id+'">Hapus</button></td></tr>'}).join("")||'<tr><td colspan="4" style="color:var(--muted)">Belum ada pengumuman.</td></tr>'}
INIT.info=infoRows;
view.addEventListener("click",function(e){var t=e.target;
  if(t.id==="iadd"){var jd=$("it").value.trim(),isi=$("ix").value.trim();if(!jd||!isi){toast("Isi judul dan isi pengumuman");return}
    INFO.push({id:Date.now().toString(36)+Math.random().toString(36).slice(2,5),t:jd,x:isi,d:today,by:me.n});
    persist();logA("Terbitkan pengumuman: "+jd);$("it").value="";$("ix").value="";infoRows();toast("Pengumuman diterbitkan")}
  else if(t.dataset.idel){var id=t.dataset.idel;INFO=INFO.filter(function(x){return x.id!==id});persist();logA("Hapus pengumuman");infoRows();toast("Pengumuman dihapus")}});
