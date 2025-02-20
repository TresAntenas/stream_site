document.addEventListener("DOMContentLoaded", function () {
    const logoutLink = document.getElementById("logout-link");

    if (logoutLink) {
        logoutLink.addEventListener("click", function (e) {
            e.preventDefault(); // Evita que el enlace recargue la página
            logout();
        });
    }
});

function logout() {
    localStorage.removeItem("authToken"); // Borra el token
    alert("🚪 Has cerrado sesión.");
    window.location.href = "login.html"; // Redirige al login
}

