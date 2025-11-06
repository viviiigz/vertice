// Archivo: /app/public/commerce/commerceJS/commerce.js

// Importante: Asumiendo que 'navigateToSection' y 'logout' están en el alcance global o aquí.
// NOTA: Todas las funciones que se llaman directamente desde el HTML (onclick="...")
// DEBEN estar en el nivel superior (global) del archivo.

/**
 * 1. FUNCIÓN PRINCIPAL DE NAVEGACIÓN (DEBE SER GLOBAL)
 * Esta es la función que llama todos los botones de la barra lateral y del header.
 */
function navigateToSection(sectionId) {
    // 1. Ocultar todas las secciones (.section)
    document.querySelectorAll(".section").forEach(s => s.classList.remove("active"));
    
    // 2. Mostrar la sección correspondiente
    const activeSection = document.getElementById(sectionId);
    if (activeSection) { activeSection.classList.add("active"); }
    
    // 3. Actualizar el estado 'active' en la barra lateral (visual)
    document.querySelectorAll(".nav-btn-sidebar").forEach(btn => btn.classList.remove("active"));
    const activeBtn = document.querySelector(`.nav-btn-sidebar[data-section="${sectionId}"]`);
    if (activeBtn) activeBtn.classList.add("active");
    
    window.scrollTo(0, 0);

    // 4. Lógica de carga de datos (Llama a funciones definidas en dashboardCommerce.js)
    if (typeof fetchProducts === 'function' && sectionId === "products") {
        fetchProducts(); 
    }
    if (typeof fetchOrders === 'function' && sectionId === "orders") {
        fetchOrders(); 
    }
    if (typeof renderAnalyticsCharts === 'function' && sectionId === "analytics") {
        renderAnalyticsCharts(); 
    }
}

/**
 * 2. FUNCIÓN DE INICIALIZACIÓN GLOBAL (Ejecutada al cargar la página)
 * Llama a la carga inicial de datos.
 */
function initializeApp() {
    if (typeof checkAuth === 'function' && checkAuth()) {
        if (typeof displayCommerceInfo === 'function') {
            displayCommerceInfo();
        }
        
        // Llamada de carga inicial (si loadDashboardMetrics está definida)
        if (typeof loadDashboardMetrics === 'function') {
             loadDashboardMetrics();
        }
        
        // Navegación por defecto: VAMOS AL DASHBOARD
        navigateToSection('dashboard');
    }
}

// 3. FUNCIÓN DE PESTAÑAS (DEBE SER GLOBAL para los onclicks)
function toggleProfileTab(tabName) {
    // ... (Tu código de pestañas) ...
    document.querySelectorAll("#commerce-profile .profile-tabs .profile-tab").forEach(t => t.classList.remove("active"));
    document.querySelector(`#commerce-profile .profile-tabs .profile-tab[data-tab="${tabName}"]`).classList.add("active");

    document.querySelectorAll("#commerce-profile .profile-content .tab-content").forEach(content => {
        content.classList.remove("active");
    });
    document.getElementById(tabName).classList.add("active");
    
    if (tabName === 'location' && typeof initializeCommerceMap === 'function') {
        initializeCommerceMap();
    }
}


/**
 * Navega a una sección específica y actualiza la barra lateral.
 * @param {string} sectionId - ID de la sección a mostrar (ej: 'dashboard', 'products').
 */
function navigateToSection(sectionId) {
    document.querySelectorAll(".section").forEach(s => s.classList.remove("active"));
    
    const activeSection = document.getElementById(sectionId);
    if (activeSection) {
        activeSection.classList.add("active");
    }
    
    // Actualizar el estado 'active' en la barra lateral
    document.querySelectorAll(".nav-btn-sidebar").forEach(btn => btn.classList.remove("active"));
    const activeBtn = document.querySelector(`.nav-btn-sidebar[data-section="${sectionId}"]`);
    if (activeBtn) activeBtn.classList.add("active");
    
    window.scrollTo(0, 0);

    // Si navegamos a Analytics, inicializar si es necesario
    if (sectionId === "analytics") {
        // Llama a una función para renderizar gráficos
        renderAnalyticsCharts(); 
    }
}

/**
 * Función para cerrar la sesión del comercio.
 */
function logout() {
    // Elimina las credenciales almacenadas
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("email");
    localStorage.removeItem("userType");
    
    // Redirige al login o landing page
    alert("Sesión cerrada correctamente.");
    window.location.href = "/landing/vertice.html"; 
}

/**
 * Verifica la autenticación (Reutilizada del consumer).
 */
function checkAuth() {
    const token = localStorage.getItem("token");
    if (!token || localStorage.getItem("userType") !== 'Comercio') {
        alert("Acceso denegado. Debes iniciar sesión como Comercio.");
        window.location.href = "/landing/vertice.html"; // Redirigir a la landing/login
        return false;
    }
    return true;
}


/**
 * Función para mostrar el nombre y email del comercio en el dashboard.
 */
function displayCommerceInfo() {
    const commerceName = localStorage.getItem("username");
    const commerceEmail = localStorage.getItem("email") || 'sin.correo@comercio.com';
    const userType = localStorage.getItem("userType");
    
    // Actualizar nombre en Header Superior
    const headerNameDisplay = document.getElementById('header-username-display');
    if (headerNameDisplay) {
        headerNameDisplay.textContent = commerceName || 'Comercio';
    }

    // Actualizar nombre en el Banner de Bienvenida
    const welcomeNameDisplay = document.getElementById('username-display');
    if (welcomeNameDisplay) {
        welcomeNameDisplay.textContent = commerceName || 'Comercio';
    }

    // Actualizar Banner Subtítulo
    const welcomeSubtitle = document.getElementById('welcome-subtitle');
    if (welcomeSubtitle && userType === 'Comercio') {
        welcomeSubtitle.textContent = '🛒 Vende excedentes, impacta positivamente el ambiente.';
    }

    // Actualizar Sección Mi Comercio (Profile)
    const profileNameDisplay = document.getElementById('profile-name-display');
    const profileEmailDisplay = document.getElementById('profile-email-display');
    if (profileNameDisplay) {
        profileNameDisplay.textContent = commerceName || 'Mi Comercio';
    }
    if (profileEmailDisplay) {
        profileEmailDisplay.textContent = commerceEmail;
    }

    // Actualizar menú desplegable de perfil
    const headerUserEmail = document.querySelector('.user-info-header p');
    if (headerUserEmail) {
        headerUserEmail.textContent = `Email: ${commerceEmail}`;
    }
}

// Inicialización de las funciones al cargar el DOM
document.addEventListener('DOMContentLoaded', function() {
    if (checkAuth()) {
        displayCommerceInfo();
        // Cargar el dashboard por defecto
        navigateToSection('dashboard');
        
        // Inicializar listeners de pestañas (reutilizado del consumer, si tienes JS para eso)
        initializeProfileTabs();
        
        // Cargar datos iniciales del Dashboard
        loadDashboardMetrics();
    }
});

/**
 * Inicializa los listeners para las pestañas de la sección Mi Comercio (Profile).
 */
function initializeProfileTabs() {
    document.querySelectorAll(".profile-tab").forEach((tab) => {
        tab.addEventListener("click", () => {
            const tabName = tab.getAttribute("data-tab");

            document.querySelectorAll(".profile-tabs .profile-tab").forEach((t) => t.classList.remove("active"));
            tab.classList.add("active");

            document.querySelectorAll("#profile .tab-content").forEach((content) => {
                content.classList.remove("active");
            });
            document.getElementById(tabName).classList.add("active");
            
            // Si la pestaña es 'location', inicializar o centrar el mapa (usando Leaflet)
            if (tabName === 'location') {
                initializeCommerceMap();
            }
        });
    });
}

/**
 * Inicializa el mapa de ubicación del comercio (simulado).
 */
let commerceMapInstance = null;
function initializeCommerceMap() {
    if (commerceMapInstance) {
        commerceMapInstance.invalidateSize(); // Asegura que el mapa se renderice correctamente en la pestaña
        return;
    }

    // Coordenadas simuladas de la tienda
    const commerceLat = -26.178; 
    const commerceLng = -58.175; 

    commerceMapInstance = L.map("commerceMap").setView([commerceLat, commerceLng], 15);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
        maxZoom: 19,
    }).addTo(commerceMapInstance);

    L.marker([commerceLat, commerceLng]).addTo(commerceMapInstance)
        .bindPopup("Ubicación de tu Comercio")
        .openPopup();
}

// Placeholder para la función de editar perfil
function editCommerceProfile() {
    alert("Función de edición de perfil del comercio en desarrollo.");
    // Aquí iría la lógica para abrir un modal de edición o navegar a una página de formulario.
}

// Placeholder para la función de subir producto
function openProductModal() {
    alert("Modal para subir/editar producto en desarrollo.");
    // Aquí iría la lógica para abrir un modal de formulario de subida
    // O navegar a una sección de formulario de creación/edición.
}