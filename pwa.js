// Web-app support: service worker + "install app" button
(function () {
  if ('serviceWorker' in navigator) addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => {}));
  var btn = document.getElementById('installBtn'), hint = document.getElementById('installHint'), deferred = null;
  var standalone = matchMedia('(display-mode: standalone), (display-mode: fullscreen)').matches || navigator.standalone;
  var ios = /iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  if (standalone || !btn) return;
  addEventListener('beforeinstallprompt', function (e) { e.preventDefault(); deferred = e; btn.style.display = 'block'; });
  addEventListener('appinstalled', function () { btn.style.display = 'none'; deferred = null; });
  if (ios) btn.style.display = 'block';
  btn.addEventListener('pointerdown', function (e) {
    e.preventDefault(); e.stopPropagation();
    if (deferred) { deferred.prompt(); deferred.userChoice.finally(function () { deferred = null; }); }
    else if (hint) { hint.classList.add('show'); setTimeout(function () { hint.classList.remove('show'); }, 6000); }
  });
  if (hint) hint.addEventListener('pointerdown', function (e) { e.stopPropagation(); hint.classList.remove('show'); });
})();
