/* Menyalin file aplikasi ke folder www/ (dipakai Capacitor untuk membuat APK).
   Jalankan:  npm run build:www                                              */
const fs = require("fs");
const path = require("path");
const root = path.join(__dirname, "..");
const out = path.join(root, "www");
const salin = ["index.html", "manifest.webmanifest", "sw.js", "css", "js", "icons"];

fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out, { recursive: true });
for (const n of salin) fs.cpSync(path.join(root, n), path.join(out, n), { recursive: true });
console.log("Folder www siap: " + out);
