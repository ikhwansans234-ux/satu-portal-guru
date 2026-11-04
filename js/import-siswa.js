/* ---------- impor siswa dari Excel/CSV ---------- */
function parseCSV(t){t=t.replace(/^\ufeff/,"").replace(/^sep=.\r?\n/i,"");var l=t.split(/\r?\n/)[0]||"",d=(l.match(/;/g)||[]).length>=(l.match(/,/g)||[]).length&&l.indexOf(";")>=0?";":l.indexOf("\t")>=0?"\t":",";
  var rows=[],r=[],c="",q=false;for(var i=0;i<t.length;i++){var ch=t[i];
    if(q){if(ch==='"'){if(t[i+1]==='"'){c+='"';i++}else q=false}else c+=ch}
    else if(ch==='"')q=true;else if(ch===d){r.push(c);c=""}else if(ch==="\n"||ch==="\r"){if(ch==="\r"&&t[i+1]==="\n")i++;r.push(c);c="";rows.push(r);r=[]}else c+=ch}
  if(c||r.length){r.push(c);rows.push(r)}return rows.filter(function(x){return x.join("").trim()!==""})}
function askRep(msg,cb){var o=document.createElement("div");o.style.cssText="position:fixed;inset:0;background:rgba(0,0,0,.45);z-index:20;display:grid;place-items:center;padding:16px";
  o.innerHTML='<div style="background:var(--card);color:var(--text);border-radius:16px;padding:22px;max-width:380px;width:100%;box-shadow:0 20px 50px rgba(0,0,0,.3)"><b style="font-size:16px">Ganti data siswa?</b><p style="color:var(--muted);line-height:1.5;margin:8px 0 16px">'+msg+'</p><div style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn sm r" data-a="y">Ya</button><button class="btn sm g" data-a="n">Tidak</button><button class="btn sm line" data-a="c">Batal</button></div></div>';
  o.onclick=function(e){var a=e.target.dataset.a;if(e.target===o||a==="c")o.remove();else if(a){o.remove();cb(a==="y")}};document.body.appendChild(o)}
function impApply(rows){
  var h=rows[0].map(function(x){return String(x).toLowerCase()}),ci={nis:-1,nama:-1,kelas:-1};
  h.forEach(function(x,i){if(/nis/.test(x))ci.nis=i;else if(/nama/.test(x))ci.nama=i;else if(/kelas/.test(x))ci.kelas=i});
  if(ci.nama>=0)rows=rows.slice(1);else ci={nis:0,nama:1,kelas:2};
  if(ci.kelas<0){toast("Kolom Kelas tidak ditemukan di file");return}
  var ok=[],bad=0,out=0;
  rows.forEach(function(r){var n=String(r[ci.nama]==null?"":r[ci.nama]).trim(),k=(String(r[ci.kelas]==null?"":r[ci.kelas]).match(/[1-6]/)||[])[0];
    if(!n||!k){if(r.join("").trim())bad++;return}
    if(CL().indexOf(k)<0){out++;return}
    ok.push({n:n,k:k,nis:ci.nis>=0&&r[ci.nis]!=null?String(r[ci.nis]).trim().replace(/\.0+$/,""):""})});
  if(!ok.length){toast(out?"Semua baris untuk kelas yang bukan kelas Anda ("+CL().join(", ")+")":"Tidak ada baris valid. Pastikan kolom: NIS, Nama, Kelas (1-6)");return}
  var ks=[];ok.forEach(function(o){if(ks.indexOf(o.k)<0)ks.push(o.k)});ks.sort();
  askRep("Ditemukan <b>"+ok.length+"</b> siswa untuk kelas "+ks.join(", ")+".<br>Ganti data siswa lama di kelas tersebut dengan data dari file ini?",function(rep){
  if(rep)ks.forEach(function(k){roster[k]=[]});
  var add=0,dup=0,used={};
  Object.keys(roster).forEach(function(k){roster[k].forEach(function(s){used[s.nis]=1})});
  ok.forEach(function(o){var a=R(o.k);
    if(a.some(function(s){return s.nama.toLowerCase()===o.n.toLowerCase()})||(o.nis&&used[o.nis])){dup++;return}
    var nis=o.nis;if(!nis){var i=a.length+1;do{nis="2026"+(10+KELAS.indexOf(o.k))+String(i++).padStart(3,"0")}while(used[nis])}
    used[nis]=1;a.push({nis:nis,nama:o.n});add++});
  persist();logA("Impor siswa: "+add+" ditambah");go("sis");
  toast(add+" siswa ditambahkan"+(dup?", "+dup+" dilewati (duplikat)":"")+(bad?", "+bad+" baris tidak valid":"")+(out?", "+out+" baris dilewati (bukan kelas Anda)":""))})}
function impFile(file){var n=file.name.toLowerCase();
  if(/\.(csv|txt)$/.test(n)){var r=new FileReader();r.onload=function(){impApply(parseCSV(r.result))};r.readAsText(file);return}
  if(!/\.xlsx?$/.test(n)){toast("Gunakan file .xlsx, .xls, atau .csv");return}
  var run=function(){var r=new FileReader();r.onload=function(){try{var wb=XLSX.read(r.result,{type:"array"}),rows=XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]],{header:1,defval:""}).filter(function(x){return x.join("").trim()!==""});impApply(rows)}catch(e){toast("File Excel tidak bisa dibaca")}};r.readAsArrayBuffer(file)};
  if(window.XLSX)return run();
  toast("Memuat pembaca Excel...");var sc=document.createElement("script");sc.src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js";sc.onload=run;sc.onerror=function(){toast("Gagal memuat pembaca Excel (butuh internet). Simpan sebagai CSV lalu impor ulang")};document.head.appendChild(sc)}
var oSis=V.sis;V.sis=function(){return(EDIT()?'<div class="card" style="margin:0 0 12px;box-shadow:none;border:1px dashed var(--line)"><b>Impor Siswa dari Excel</b><p style="color:var(--muted);font-size:12px;margin:4px 0 10px">Kolom: <b>NIS</b> (boleh kosong), <b>Nama</b>, <b>Kelas</b> (1-6). Format .xlsx, .xls, atau .csv. Anda hanya bisa mengimpor untuk kelas yang Anda ajar.</p><div class="ctrl"><label class="btn o" style="margin:0;cursor:pointer;display:inline-block">Pilih File Excel<input type="file" id="imp" accept=".xlsx,.xls,.csv" class="hide"></label></div></div>':"")+oSis()};
view.addEventListener("change",function(e){if(e.target.id==="imp"&&e.target.files[0]){impFile(e.target.files[0]);e.target.value=""}});

