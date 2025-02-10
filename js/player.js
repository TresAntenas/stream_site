document.addEventListener("DOMContentLoaded", function () {
    var video = document.getElementById('video');
    var poster = document.getElementById('poster-image');
    var streamURL = "https://stream.tresantenas.cl/hls/stream.m3u8"; 

    var hls = null;
    var estaConectado = false;
    var intervaloReintento = null;

    function obtenerURLStream() {
        return streamURL + "?nocache=" + new Date().getTime();
    }

    function mostrarPoster() {
        console.warn("⚠️ Señal perdida. Mostrando póster.");
        poster.style.display = "block";
        video.style.visibility = "hidden";
        estaConectado = false;
        iniciarReintento();
        
    }

    function ocultarPoster() {
        console.log("✅ Señal detectada. Ocultando póster.");
        poster.style.display = "none";
        video.style.visibility = "visible";
        estaConectado = true;
        detenerReintento();
    }

    function iniciarHLS() {
        if (hls) {
            hls.destroy();
            hls = null;
        }

        hls = new Hls();
        hls.loadSource(obtenerURLStream());
        hls.attachMedia(video);

        hls.on(Hls.Events.MANIFEST_PARSED, function () {
            console.log("📜 MANIFEST PARSED: Intentando reproducir...");
            video.play().then(ocultarPoster).catch(() => {
                console.warn("🚨 No se pudo iniciar la reproducción. Mostrando póster.");
                mostrarPoster();
            });
        });

        hls.on(Hls.Events.BUFFER_STALLED_ERROR, function () {
            console.warn("⏳ Buffer estancado. Esperando que se recupere...");
        });

        hls.on(Hls.Events.ERROR, function (event, data) {
            console.error("⚠️ Error en HLS:", data);
            if (data.fatal) {
                console.warn("♻️ Error fatal en HLS. Intentando reconectar...");
                mostrarPoster();
                iniciarReintento();
            }
        });

        video.oncanplay = function () {
            console.log("🎬 Video listo para reproducirse.");
            ocultarPoster();
        };
    }

    function verificarStream() {
        console.log("🔄 Verificando si el stream está disponible...");
        fetch(obtenerURLStream(), { method: "HEAD", cache: "no-cache" })
            .then(response => {
                if (response.status === 404) {
                    console.warn("❌ Stream no encontrado (404). Mostrando póster.");
                    mostrarPoster();
                } else if (response.ok && !estaConectado) {
                    console.log("✅ Stream disponible, activando video.");
                    iniciarHLS();
                }
            })
            .catch(() => {
                console.warn("❌ Error al verificar el stream. Mostrando póster.");
                mostrarPoster();
            });
    }

    function iniciarReintento() {
        if (!intervaloReintento) {
            console.warn("🔄 Reintentando conectar cada 10 segundos...");
            intervaloReintento = setInterval(verificarStream, 10000);
        }
    }

    function detenerReintento() {
        if (intervaloReintento) {
            console.log("✅ Deteniendo reintentos.");
            clearInterval(intervaloReintento);
            intervaloReintento = null;
        }
    }

    verificarStream();
});
