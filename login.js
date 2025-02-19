document.getElementById("loginForm").addEventListener("submit", async function (e) {
    e.preventDefault(); // Evita el envío tradicional del formulario

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        const response = await fetch("https://stream.tresantenas.cl:4000/api/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem("authToken", data.token); // Guardar el token
            alert("✅ Login exitoso");
            window.location.href = "index2.html"; // Redirigir después del login
        } else {
            alert("❌ Error: " + (data.error || "No se pudo autenticar"));
        }
    } catch (error) {
        console.error("🚨 Error en la conexión:", error);
        alert("⚠️ Error en la conexión al servidor.");
    }
});

