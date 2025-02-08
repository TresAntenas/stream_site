document.addEventListener("DOMContentLoaded", function () {
    ZoomMtg.setZoomJSLib('https://source.zoom.us/2.13.0/lib', '/av');
    ZoomMtg.preLoadWasm();
    ZoomMtg.prepareJssdk();

    fetch("https://stream.tresantenas.cl/create_meeting.php")
        .then(response => response.json())
        .then(meetingData => {
            const meetingConfig = {
                sdkKey: "TU_SDK_KEY_AQUI",
                meetingNumber: meetingData.id,
                passWord: meetingData.password,
                role: 0,
                userName: "Invitado",
                userEmail: "",
                leaveUrl: "https://stream.tresantenas.cl",
            };

            // Obtener firma antes de entrar
            return fetch(`https://stream.tresantenas.cl/generate_signature.php?meetingNumber=${meetingConfig.meetingNumber}&role=${meetingConfig.role}`)
                .then(response => response.json())
                .then(signatureData => {
                    meetingConfig.signature = signatureData.signature;

                    ZoomMtg.init({
                        leaveUrl: meetingConfig.leaveUrl,
                        isSupportAV: true,
                        success: function () {
                            ZoomMtg.join({
                                meetingNumber: meetingConfig.meetingNumber,
                                userName: meetingConfig.userName,
                                signature: meetingConfig.signature,
                                apiKey: meetingConfig.sdkKey,
                                passWord: meetingConfig.passWord,
                                success: function () {
                                    console.log("✅ Conectado a la reunión.");
                                },
                                error: function (error) {
                                    console.error("❌ Error al unirse:", error);
                                }
                            });
                        }
                    });
                });
        })
        .catch(error => console.error("❌ Error en Zoom.js:", error));
});

