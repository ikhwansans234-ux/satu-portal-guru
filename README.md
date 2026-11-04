# SATU - Portal Guru MI Sa'adatuddarain II

Aplikasi absensi, nilai, dan data siswa berbasis HTML, CSS, dan JavaScript biasa
(tanpa framework, tanpa proses build). Bisa langsung diedit dari VS Code.

## Cara menjalankan di VS Code

Buka folder ini di VS Code (File > Open Folder), lalu pilih salah satu:

**A. Live Server (paling mudah)**
1. Pasang ekstensi **Live Server** (VS Code akan menawarkannya otomatis).
2. Klik kanan `index.html` > **Open with Live Server**.
3. Browser terbuka di `http://localhost:5500` dan otomatis refresh saat file disimpan.

**B. Server bawaan (butuh Node.js)**
- Terminal VS Code (Ctrl+`) lalu ketik: `npm start`
- Atau tekan **Ctrl+Shift+B** untuk menjalankan task "Jalankan server SATU".
- Buka `http://localhost:5500`.

**C. Tanpa server:** klik dua kali `index.html`. Semua fitur lokal tetap jalan.

Akun awal admin: username `admin`, password `admin123`. Segera ganti lewat menu Akun Saya.

## Struktur folder

```
index.html            kerangka halaman (login + aplikasi)
server.js             server lokal tanpa dependensi (npm start)
supabase.sql          perintah SQL untuk database online
css/
  base.css            gaya dasar, tabel, tombol, form
  login.css           halaman login
  tools.css           toolbar dan gaya cetak
  theme.css           tema hijau madrasah + mode gelap (warna diatur di :root)
  mobile.css          tampilan HP (layar <= 700px): tabel jadi kartu, menu bawah
js/
  config.js           ISI URL dan KEY Supabase di sini
  data.js             data awal guru, menu, state, pemuatan localStorage
  utils.js            fungsi bantu (simpan, log, jadwal, toast)
  views/
    beranda-absensi.js  Beranda, Absensi, Jadwal Mengajar, Rekap Absensi
    siswa-nilai.js      Data Siswa dan Nilai (bobot nilai ada di nilCalc)
    admin.js            Daftar Guru, Kelola Akun, Pengaturan, Log, Status Absensi
  router.js           perpindahan halaman dan event utama
  shell.js            login, keluar, tema gelap/terang
  export-backup.js    ekspor Excel dan cadangan data
  import-siswa.js     impor siswa dari Excel/CSV
  jadwal-admin.js     tabel jadwal semua guru di dashboard admin
  views/jadwal-input.js  menu Atur Jadwal (admin menginput jadwal mengajar)
  views/siswa-edit.js    edit data siswa (NIS, nama, L/P, wali, HP wali)
  views/pengumuman.js    pengumuman sekolah (admin menulis, semua membaca di Beranda)
  views/jurnal.js        jurnal mengajar (guru mengisi, kepala/admin memantau)
  auth.js             hash password (SHA-256)
  sync.js             sinkronisasi database online
  mobile.js           menu bawah dan label tabel untuk tampilan HP
  pwa.js              mendaftarkan service worker (aplikasi bisa dipasang dan tetap terbuka saat offline)
manifest.webmanifest  data aplikasi untuk dipasang di HP
sw.js                 service worker (jaringan dulu, cache sebagai cadangan)
icons/                ikon aplikasi
scripts/build-www.js  menyalin file ke folder www untuk dibuat APK
capacitor.config.json pengaturan pembungkus Android (Capacitor)
.github/workflows/    build-apk.yml: membuat APK otomatis di GitHub
```

File dimuat berurutan lewat tag `<script>` di `index.html`. Urutannya penting,
jadi kalau menambah file baru, letakkan setelah file yang dipakainya.

## Yang sering diedit

| Ingin mengubah | Buka |
|---|---|
| Warna dan tampilan | `css/theme.css` (variabel di bagian atas) |
| Daftar guru awal, nama siswa contoh | `js/data.js` |
| Bobot nilai (Absensi 10, Harian 20, Tugas 20, UTS 20, UAS 30) | `js/utils.js`, objek `BOBOT` (juga ubah judul kolom di `V.nil`) |
| Jadwal mengajar | menu **Atur Jadwal** di akun admin (jadwal otomatis di `js/utils.js`, fungsi `JD`, hanya cadangan) |
| Menu dan hak akses per peran | `js/data.js`, objek `MENU` |
| Nama sekolah dan tahun pelajaran | menu Pengaturan Sekolah di aplikasi |

## Database online (agar data dipakai bersama semua guru)

1. Buat proyek gratis di supabase.com.
2. Buka **SQL Editor**, tempel isi `supabase.sql`, klik Run.
3. Buka **Project Settings > API**, salin **Project URL** dan **anon public key**.
4. Isi keduanya di `js/config.js`.
5. Login sebagai admin dari perangkat yang datanya paling lengkap. Data itu menjadi data awal di database.

Tanpa isian di `config.js`, aplikasi berjalan dalam mode lokal (data di browser).

**Catatan keamanan:** kunci di `config.js` terlihat oleh siapa pun yang membuka
aplikasi, dan kebijakan di `supabase.sql` membolehkan akses terbuka. Jangan
bagikan alamat aplikasi ke publik. Untuk keamanan penuh, langkah berikutnya
adalah login lewat Supabase Auth.

Password disimpan sebagai hash SHA-256, bukan teks biasa.

## Memasang di HP / membuat APK

Ada tiga cara. Cara 1 paling mudah dan tidak butuh APK.

**1. Pasang dari browser (PWA, disarankan)**
1. Unggah folder proyek ini ke hosting statis (Netlify, Cloudflare Pages, atau GitHub Pages). Alamatnya harus `https://`.
2. Buka alamat itu di Chrome HP, lalu pilih menu titik tiga > **Pasang aplikasi** (Install app) atau **Tambahkan ke layar utama**.
3. Ikon SATU muncul di layar utama, terbuka layar penuh seperti aplikasi, dan tetap bisa dibuka saat internet mati.
Setiap kali file di hosting diperbarui, aplikasi di HP ikut terbarui.

**2. APK otomatis lewat GitHub (tanpa Android Studio)**
1. Buat repositori di github.com dan unggah seluruh isi folder ini.
2. Buka tab **Actions** > **Build APK** > **Run workflow**.
3. Tunggu sekitar 5 menit, lalu unduh `SATU-apk` di bagian **Artifacts**. Isinya `app-debug.apk`.
4. Kirim APK ke HP, buka, dan izinkan "pasang dari sumber tidak dikenal".

**3. APK dari komputer sendiri (butuh Node.js, JDK 17, dan Android Studio)**
```
npm install
npm run android:add
npm run android:open     # membuka Android Studio, lalu Build > Build APK(s)
```
Setelah mengedit kode, jalankan `npm run android:sync` untuk menyalin perubahan ke proyek Android.

Catatan: APK yang dihasilkan adalah versi debug, cukup untuk dipasang langsung di HP guru.
Untuk diunggah ke Google Play perlu APK/AAB bertanda tangan (release) dan akun developer Play.
