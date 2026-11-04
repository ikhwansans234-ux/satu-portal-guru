/* Edit data siswa: NIS, nama, L/P, nama wali, HP wali */
function modal(html){var o=document.createElement("div");o.id="mdl";
  o.style.cssText="position:fixed;inset:0;background:rgba(0,0,0,.45);z-index:20;display:grid;place-items:center;padding:16px;overflow:auto";
  o.innerHTML='<div style="background:var(--card);color:var(--text);border-radius:10px;padding:22px;max-width:420px;width:100%;box-shadow:0 20px 50px rgba(0,0,0,.3)">'+html+'</div>';
  document.body.appendChild(o);return o}
function nisDipakai(nis,exceptObj){return Object.keys(roster).some(function(k){return roster[k].some(function(s){return s!==exceptObj&&s.nis===nis})})}
function pindahNis(k,lama,baru){
  for(var key in absen){if(key.split("|")[0]===k&&absen[key][lama]){absen[key][baru]=absen[key][lama];delete absen[key][lama]}}
  for(var g in grades){if(g.split("|")[0]===k&&grades[g][lama]){grades[g][baru]=grades[g][lama];delete grades[g][lama]}}}
function editSiswa(k,nis){var s=R(k).filter(function(x){return x.nis===nis})[0];if(!s)return;
  var o=modal('<b style="font-size:16px">Edit Data Siswa</b><p style="color:var(--muted);margin:4px 0 12px;font-size:12.5px">Kelas '+k+'. Jika NIS diubah, absensi dan nilai siswa ini ikut dipindahkan.</p>'+
   '<label>NIS</label><input class="in" id="enis" value="'+esc(s.nis)+'"><label>Nama Siswa</label><input class="in" id="enama" value="'+esc(s.nama)+'">'+
   '<label>Jenis Kelamin</label><select class="in" id="ejk"><option value="">-</option><option value="L"'+(s.jk==="L"?" selected":"")+'>Laki-laki (L)</option><option value="P"'+(s.jk==="P"?" selected":"")+'>Perempuan (P)</option></select>'+
   '<label>Nama Wali</label><input class="in" id="ewali" value="'+esc(s.wali||"")+'"><label>No. HP Wali</label><input class="in" id="ehp" inputmode="tel" value="'+esc(s.hp||"")+'">'+
   '<div style="display:flex;gap:8px;margin-top:16px"><button class="btn g" id="esave">Simpan</button><button class="btn line" id="ecancel">Batal</button></div>');
  o.onclick=function(e){if(e.target===o||e.target.id==="ecancel")o.remove();
    else if(e.target.id==="esave"){var nama=$("enama").value.trim(),nn=$("enis").value.trim();
      if(!nama||!nn){toast("NIS dan nama wajib diisi");return}
      if(nn!==s.nis&&nisDipakai(nn,s)){toast("NIS "+nn+" sudah dipakai siswa lain");return}
      if(nn!==s.nis){pindahNis(k,s.nis,nn);s.nis=nn}
      s.nama=nama;s.jk=$("ejk").value;s.wali=$("ewali").value.trim();s.hp=$("ehp").value.trim();
      persist();logA("Edit siswa "+nama+" (kelas "+k+")");o.remove();sisRows();toast("Data siswa disimpan")}}}
view.addEventListener("click",function(e){var t=e.target;if(t.dataset.edit)editSiswa(t.dataset.k,t.dataset.edit)});
