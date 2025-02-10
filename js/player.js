document.addEventListener("DOMContentLoaded", function () {
    var video = document.getElementById('video');
    var poster = document.getElementById('poster-image');
    var streamURL = "https://stream.tresantenas.cl/hls/stream.m3u8"; // URL completa

    var estaConectado = false; // 🔹 Controla si el stream está activo
    var intervaloReintento = null; // 🔹 Guarda el intervalo de reintentos

    function mostrarPoster() {
        if (estaConectado) {
            console.warn("⚠️ Señal perdida. Mostrando póster.");
            poster.style.display = "block";
            video.style.visibility = "hidden";
            estaConectado = false; // Marca que la señal está caída
            iniciarReintento(); // 🔹 Inicia reintento solo si la señal se perdió
        }
    }

    function ocultarPoster() {
        if (!estaConectado) {
            console.log("✅ Señal detectada. Ocultando póster.");
            poster.style.display = "none";
            video.style.visibility = "visible";
            estaConectado = true; // Marca que la señal está activa
            detenerReintento(); // 🔹 Detiene reintentos innecesarios
        }
    }

    function iniciarHLS() {
        if (Hls.isSupported()) {
            console.log("🎥 HLS soportado, intentando cargar transmisión...");
            var hls = new Hls();
            hls.loadSource(streamURL);
            hls.attachMedia(video);

            hls.on(Hls.Events.MANIFEST_PARSED, function () {
                console.log("📜 MANIFEST PARSED: Intentando reproducir...");
                video.play().then(ocultarPoster).catch(function (error) {
                    console.error("❌ Error al intentar reproducir:", error);
                    mostrarPoster();
                });
            });

            hls.on(Hls.Events.ERROR, function (event, data) {
                console.error("⚠️ Error en HLS:", data);
                if (data.fatal) {
                    mostrarPoster();
                    iniciarReintento();
                }
            });

        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
            console.log("🎥 Usando reproducción nativa HLS.");
            video.src = streamURL;
            video.play().then(ocultarPoster).catch(mostrarPoster);

            video.addEventListener('loadeddata', function () {
                console.log("✅ Video cargado correctamente.");
                ocultarPoster();
            });

            video.addEventListener('error', function () {
                console.error("❌ Error en la reproducción del video.");
                mostrarPoster();
                iniciarReintento();
            });

        } else {
            console.error("❌ Tu navegador no soporta HLS.");
            mostrarPoster();
            iniciarReintento();
        }
    }

    function verificarStream() {
        console.log("🔄 Verificando si el stream está disponible...");
        fetch(streamURL, { method: "HEAD", cache: "no-cache" })
            .then(response => {
                if (response.ok && !estaConectado) {
                    console.log("✅ Stream disponible, iniciando reproducción.");
                    iniciarHLS();
                } else if (!response.ok && estaConectado) {
                    console.warn("⚠️ Stream perdido. Mostrando póster.");
                    mostrarPoster();
                }
            })
            .catch(() => {
                console.warn("❌ Error al verificar el stream.");
                mostrarPoster();
            });
    }

    function iniciarReintento() {
        if (!intervaloReintento) {
            console.warn("🔄 Iniciando reintentos de conexión cada 5 segundos...");
            intervaloReintento = setInterval(verificarStream, 5000);
        }
    }

    function detenerReintento() {
        if (intervaloReintento) {
            console.log("✅ Deteniendo reintentos de conexión.");
            clearInterval(intervaloReintento);
            intervaloReintento = null;
        }
    }

    // Iniciar la verificación de stream solo si la página se carga sin señal
    verificarStream();

    // Si el video deja de recibir señal, mostrar póster pero evitar reintentos innecesarios
    video.addEventListener('stalled', mostrarPoster);
    video.addEventListener('waiting', mostrarPoster);
    video.addEventListener('error', mostrarPoster);

    video.addEventListener('playing', function () {
        console.log("🎬 Video en reproducción.");
        ocultarPoster();
    });
});
