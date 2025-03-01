document.addEventListener("DOMContentLoaded", async function () {
    const clientId = "TU_CLIENT_ID";
    const meetingNumber = "8593263341"; // ID de la reunión
    const role = 0; // 0 para asistentes, 1 para hosts

    // ⚡ Obtener el token desde el servidor de autenticación
    async function obtenerToken() {
        try {
            const response = await fetch("http://137.184.6.173:5000/api/zoom/generate-token", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ meetingNumber, role })
            });
            const data = await response.json();
            return data.token;
        } catch (error) {
            console.error("Error obteniendo token:", error);
            return null;
        }
    }

    // ⚡ Función para unirse a la reunión
    async function iniciarReunion() {
        const jwtToken = await obtenerToken();
        if (!jwtToken) {
            console.error("No se pudo obtener el token JWT.");
            return;
        }

        const client = ZoomMtgEmbedded.createClient();
        client.init({
            debug: true,
            zoomAppRoot: document.getElementById("zmmtg-root"),
            language: "es-ES"
        }).then(() => {
            client.join({
                apiKey: clientId,
                signature: jwtToken,
                meetingNumber: meetingNumber,
                userName: "Invitado",
                password: "", // Dejar vacío si no tiene pass
                success: () => console.log("✅ Conectado a la reunión"),
                error: (err) => console.error("❌ Error al entrar a la reunión:", err)
            });
        });
    }

    iniciarReunion();
});

