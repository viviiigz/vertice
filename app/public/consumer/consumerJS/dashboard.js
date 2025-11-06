function displayUserName() {
    const username = localStorage.getItem("username");
    // 💡 AÑADIDO: Obtenemos el email para el menú desplegable
    const userEmail = localStorage.getItem("email") ; 
    const userType = localStorage.getItem("userType");
    
    console.log("🔍 DEBUG - Username:", username); // Para debug
    console.log("🔍 DEBUG - Email:", userEmail); // Para debug
    console.log("🔍 DEBUG - UserType:", userType); // Para debug
    
    if (username) {
        
        // 1. ACTUALIZAR NOMBRE EN EL TÍTULO GRANDE (Banner de Bienvenida - ID: username-display)
        const usernameDisplayBanner = document.getElementById('username-display');
        
        if (usernameDisplayBanner) {
            usernameDisplayBanner.textContent = `${username}`;
            console.log(`✅ Bienvenido ${username}`);
        }

        // 2. 💡 CÓDIGO AÑADIDO: ACTUALIZAR NOMBRE EN LA ESQUINA SUPERIOR DERECHA (ID: header-username-display)
        const usernameDisplayHeader = document.getElementById('header-username-display');
        if (usernameDisplayHeader) {
            usernameDisplayHeader.textContent = `${username}`;
        }

        const profileNameDisplay = document.getElementById('profile-name-display');
        const profileEmailDisplay = document.getElementById('profile-email-display');

        if (profileNameDisplay) {
            profileNameDisplay.textContent = username;
        }
        if (profileEmailDisplay) {
            profileEmailDisplay.textContent = userEmail;
        }

        // 3. 💡 CÓDIGO AÑADIDO: ACTUALIZAR CORREO EN EL MENÚ DESPLEGABLE
        const headerUserEmail = document.querySelector('.user-info-header p');
        if (headerUserEmail) {
            headerUserEmail.textContent = `Usuario: ${userEmail}`;
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
        
        // Manejar el caso del banner
        const usernameDisplayBanner = document.getElementById('username-display');
        if (usernameDisplayBanner) {
            usernameDisplayBanner.textContent = 'Usuario';
        }

        // 💡 AÑADIDO: Manejar el caso del header
        const usernameDisplayHeader = document.getElementById('header-username-display');
        if (usernameDisplayHeader) {
            usernameDisplayHeader.textContent = 'Invitado';
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