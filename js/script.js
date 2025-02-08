// js/script.js
var video = document.getElementById('video');
if (Hls.isSupported()) {
  var hls = new Hls();
  hls.loadSource('/stream/hls/stream.m3u8');
  hls.attachMedia(video);
  hls.on(Hls.Events.MANIFEST_PARSED, function() {
    video.play();
  });
} else if (video.canPlayType('application/vnd.apple.mpegurl')) {
  video.src = '/stream/index.m3u8';
  video.addEventListener('loadedmetadata', function() {
    video.play();
  });
}

