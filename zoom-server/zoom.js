import { ZoomMtg } from "@zoomus/websdk";

// Configurar la URL base del SDK de Zoom
ZoomMtg.setZoomJSLib("https://source.zoom.us/2.17.0/lib", "/av");
ZoomMtg.preLoadWasm();
ZoomMtg.prepareWebSDK();

// Configurar la reunión
const meetingConfig = {
    meetingNumber: "859 326 3341", // Reemplázalo con el Meeting ID real
    userName: "Tres Antenas Comms", // Nombre del participante
    userRole: 0, // 0 = participante, 1 = host
    userEmail: "tresantenascomms@gmail.com", // Opcional
    passWord: "", // Si la reunión tiene contraseña
    leaveUrl: "https://stream.tresantenas.cl/" // URL de salida cuando termina la reunión
};

// Obtener la firma desde el servidor
async function getSignature() {
    try {
        const response = await fetch("https://tu-servidor.com:4000/generateSignature", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ meetingNumber: meetingConfig.meetingNumber, role: meetingConfig.userRole })
        });

        const { signature } = await response.json();
        return signature;
    } catch (error) {
        console.error("Error al obtener la firma:", error);
    }
}

// Función para unirse a la reunión
async function startMeeting() {
    const signature = await getSignature();

    if (!signature) {
        console.error("No se pudo obtener la firma.");
        return;
    }

    ZoomMtg.init({
        leaveUrl: meetingConfig.leaveUrl,
        disableInvite: true,
        isSupportAV: true,
        success: () => {
            ZoomMtg.join({
                sdkKey: "TU_API_KEY", // Reemplázalo con tu Zoom API Key
                signature: signature,
                meetingNumber: meetingConfig.meetingNumber,
                userName: meetingConfig.userName,
                userEmail: meetingConfig.userEmail,
                passWord: meetingConfig.passWord,
                success: () => {
                    console.log("Unido a la reunión con éxito.");
                },
                error: (err) => {
                    console.error("Error al unirse a la reunión:", err);
                }
            });
        },
        error: (err) => {
            console.error("Error al inicializar Zoom SDK:", err);
        }
    });
}

// Agregar evento al botón para iniciar la reunión
document.getElementById("join-meeting").addEventListener("click", startMeeting);
