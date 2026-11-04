/* Mendaftarkan service worker agar aplikasi bisa dipasang di HP dan tetap terbuka saat offline */
if ("serviceWorker" in navigator && /^https?:$/.test(location.protocol)) {
  window.addEventListener("load", function () { navigator.serviceWorker.register("sw.js").catch(function () {}); });
}
