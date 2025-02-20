// auth.js

// 🔹 Verificar la autenticación lo antes posible (sin esperar el DOM)
(function() {
    const token = localStorage.getItem("authToken");
    if (!token) {
        alert("⚠️ Acceso denegado. Debes iniciar sesión.");
        // Redirigir inmediatamente a login.html
        window.location.href = "login.html";
    }
    // Si el token existe, se permite continuar.
})();

// 🔹 Cuando el DOM esté cargado, mostrar el contenido protegido
document.addEventListener("DOMContentLoaded", function() {
    const protectedContent = document.getElementById("protected-content");
    if (protectedContent) {
        protectedContent.style.display = "block";
    }
});

// 🔹 Función para cerrar sesión
function logout() {
    localStorage.removeItem("authToken");
    alert("🚪 Has cerrado sesión.");
    window.location.href = "login.html";
}

