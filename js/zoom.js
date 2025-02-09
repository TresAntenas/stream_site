import { ZoomMtg } from "@zoomus/websdk";

// Configurar Zoom Web SDK
ZoomMtg.setZoomJSLib("https://source.zoom.us/2.17.0/lib", "/av");
ZoomMtg.preLoadWasm();
ZoomMtg.prepareWebSDK();

// Datos de la reunión
const meetingNumber = "123456789"; // Reemplázalo con el Meeting ID real
const userName = "Usuario";
const userRole = 0; // 0 para participante, 1 para host
const userPassword = "12345"; // Si la reunión tiene contraseña

// Obtener firma desde el servidor y unirse a Zoom
async function startMeeting() {
    const response = await fetch("https://TU_SERVIDOR:4000/generateSignature", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ meetingNumber, role: userRole })
    });

    const { signature } = await response.json();

    ZoomMtg.init({
        leaveUrl: "https://tusitio.com/",
        disableInvite: true,
        isSupportAV: true,
        success: () => {
            ZoomMtg.join({
                sdkKey: "TU_API_KEY",
                signature: signature,
                meetingNumber: meetingNumber,
                userName: userName,
                password: userPassword,
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

document.getElementById("join-meeting").addEventListener("click", startMeeting);
