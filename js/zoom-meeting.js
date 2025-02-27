document.addEventListener("DOMContentLoaded", async function () {
    const clientId = "2ezbinChQtWN90mIi0hVgw";
    const meetingNumber = "8593263341"; // ID de la reunión
    const role = 0; // 0 para asistentes, 1 para hosts
 window.client = ZoomMtgEmbedded.createClient(); // 🔹 Hacer accesible `client` en la consola

    // ⚡ Obtener el token desde el servidor de autenticación
    async function obtenerToken() {
        try {
            console.log("🔹 Solicitando token...");
            const response = await fetch("https://stream.tresantenas.cl/api/zoom/generate-token", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ meetingNumber, role })
            });

            if (!response.ok) {
                throw new Error(`HTTP Error ${response.status} - ${response.statusText}`);
            }

            const data = await response.json();
            console.log("✅ Token recibido:", data);
            return data.token;
        } catch (error) {
            console.error("🚨 Error obteniendo token:", error);
            return null;
        }
    }

    // ⚡ Función para unirse a la reunión con Zoom Web SDK 3.11.2
    async function iniciarReunion() {
        const jwtToken = await obtenerToken();
        if (!jwtToken) {
            console.error("❌ No se pudo obtener el token JWT.");
            return;
        }

        // Verificar si ZoomMtg está definido
        if (typeof ZoomMtgEmbedded === "undefined") {
            console.error("❌ ZoomMtgEmbedded no está definido. Revisa la carga del script en index2.html.");
            return;
        }

        const client = ZoomMtgEmbedded.createClient(); // 🔹 Inicializa el cliente correctamente

        client.init({
            debug: true,
            zoomAppRoot: document.getElementById("zmmtg-root"),
            language: "es-ES"
        }).then(() => {
            client.join({
                sdkKey: clientId,
                signature: jwtToken,
                meetingNumber: meetingNumber,
                userName: "Invitado",
                password: "F2Cr9J",
                success: () => console.log("✅ Conectado a la reunión"),
                error: (err) => console.error("❌ Error al entrar a la reunión:", err)
            });
        });
    }

    iniciarReunion();
});

