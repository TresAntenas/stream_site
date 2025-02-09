document.addEventListener("DOMContentLoaded", function () {
    var video = document.getElementById('video');
    var streamURL = "https://stream.tresantenas.cl/hls/stream.m3u8"; // URL completa
  
    if (Hls.isSupported()) {
        var hls = new Hls();
        hls.loadSource(streamURL);
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED, function() {
            video.play();
        });
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = streamURL;
        video.play();
    } else {
        console.error("Tu navegador no soporta HLS.");
    }
  });
  