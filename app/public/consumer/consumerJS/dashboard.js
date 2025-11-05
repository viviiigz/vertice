// Función para mostrar el nombre del usuario en el span
function displayUserName() {
    const username = localStorage.getItem("username");
    const userType = localStorage.getItem("userType");
    
    console.log("🔍 DEBUG - Username:", username); // Para debug
    console.log("🔍 DEBUG - UserType:", userType); // Para debug
    
    if (username) {
        // Actualizar SOLO el span con el username
        const usernameDisplay = document.getElementById('username-display');
        console.log("🔍 DEBUG - Elemento span:", usernameDisplay); // Para debug
        
        if (usernameDisplay) {
            usernameDisplay.textContent = `${username}`;
            console.log(`✅ Bienvenido ${username}`);
        }
        
        // Personalizar el subtítulo según el tipo de usuario
        const welcomeSubtitle = document.getElementById('welcome-subtitle');
        if (welcomeSubtitle) {
            let additionalText = '';
            switch(userType) {
                case 'User':
                    additionalText = '🍃 Reduce desperdicios, ahorra dinero';
                    break;
                case 'Comercio':
                    additionalText = '🛒 Vende excedentes, reduce pérdidas';
                    break;
                case 'Banco de Alimentos':
                    additionalText = '🏦 Gestiona donaciones de alimentos';
                    break;
                case 'Admin':
                    additionalText = '⚙️ Administra el sistema';
                    break;
                default:
                    additionalText = '🍃 Reduce desperdicios, ahorra dinero';
            }
            welcomeSubtitle.textContent = additionalText;
        }
    } else {
        console.log("❌ No se encontró usuario en localStorage");
        const usernameDisplay = document.getElementById('username-display');
        if (usernameDisplay) {
            usernameDisplay.textContent = 'Usuario';
        }
    }
}

// Verificar autenticación
function checkAuth() {
    const token = localStorage.getItem("token");
    if (!token) {
        alert("Debes iniciar sesión para acceder a esta página");
        window.location.href = "/";
        return false;
    }
    return true;
}