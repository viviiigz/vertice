// Archivo: /app/public/commerce/commerceJS/dashboardCommerce.js

// 🔑 CONFIGURACIÓN DE LA API
const API_BASE = "http://localhost:4000/api/commerce"; // Todas las rutas de comercio irán aquí

// --- DATOS GLOBALES (Serán cargados por fetch) ---
let productsData = [];
let ordersData = [];
let salesChartInstance = null;
let commerceMetricsData = {
    revenueToday: 0.00,
    activeOrders: 0,
    wasteReduced: 0, 
    upcomingPickups: 0,
    totalSalesMonth: 0.00,
    totalWasteAvoided: 0,
    // Estructura para Chart.js
    categories: ['F&V', 'Carnes', 'Lácteos', 'Panadería', 'Despensa', 'Bebidas'],
    salesData: [0, 0, 0, 0, 0, 0] 
};

// ----------------------------------------------------------------------
// CÓDIGO CORE (Navegación, Auth, Perfil - Mantenido de commerce.js)
// ----------------------------------------------------------------------

// Nota: Las funciones checkAuth(), logout(), displayCommerceInfo(), 
// initializeProfileTabs(), initializeCommerceMap() se mantienen intactas 
// y deben estar disponibles globalmente (en este archivo o importadas).

/**
 * Navegación modular (Adaptada para llamar a fetch/renderizado al cambiar de sección).
 */
function navigateToSection(sectionId) {
    document.querySelectorAll(".section").forEach(s => s.classList.remove("active"));
    const activeSection = document.getElementById(sectionId);
    if (activeSection) { activeSection.classList.add("active"); }
    
    document.querySelectorAll(".nav-btn-sidebar").forEach(btn => btn.classList.remove("active"));
    const activeBtn = document.querySelector(`.nav-btn-sidebar[data-section="${sectionId}"]`);
    if (activeBtn) activeBtn.classList.add("active");
    
    window.scrollTo(0, 0);

    // Lógica para cargar datos dinámicos al entrar a la sección
    if (sectionId === "analytics") {
        fetchMetricsData(); // Asegura que los datos de métricas se carguen
        renderAnalyticsCharts(); 
    }
    if (sectionId === "products") {
        fetchProducts();
    }
    if (sectionId === "orders") {
        fetchOrders();
    }
    // Si la pestaña es 'location' en Mi Comercio, el mapa se inicializa en toggleProfileTab
}


// ----------------------------------------------------------------------
// GESTIÓN DE LA API (FETCH DATA)
// ----------------------------------------------------------------------

/**
 * 🔑 Función PRINCIPAL para cargar todas las métricas y datos para Analytics.
 */
async function fetchMetricsData() {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE}/metrics`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (!response.ok) throw new Error('Error al cargar métricas.');
        
        const data = await response.json();
        // 💡 Asignar datos de la API a la estructura global
        commerceMetricsData = {
            ...commerceMetricsData,
            ...data.summary,
            salesData: data.salesByCategory.data,
            categories: data.salesByCategory.labels
        };
        loadDashboardMetrics(); // Actualiza el dashboard
        
    } catch (error) {
        console.error("Error en fetchMetricsData:", error);
    }
}

/**
 * Carga los productos del comercio desde la DB.
 */
async function fetchProducts() {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE}/products`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (!response.ok) throw new Error('No se pudieron cargar los productos.');
        
        productsData = await response.json();
        renderProductManagement(productsData);
    } catch (error) {
        console.error("Error al cargar productos:", error);
        document.getElementById('currentProductsList').innerHTML = 
            '<p class="empty-state text-danger">Error al cargar productos.</p>';
    }
}

/**
 * Carga los pedidos del comercio desde la DB.
 */
async function fetchOrders() {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE}/orders`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (!response.ok) throw new Error('No se pudieron cargar los pedidos.');
        
        ordersData = await response.json();
        // Recalcular el badge aquí, o esperar a loadDashboardMetrics
        loadDashboardMetrics();
        renderOrdersList('pending'); // Renderizar pendientes por defecto
        
    } catch (error) {
        console.error("Error al cargar pedidos:", error);
    }
}

// ----------------------------------------------------------------------
// RENDERIZADO VISUAL
// ----------------------------------------------------------------------

/**
 * Actualiza las tarjetas del Dashboard con los datos cargados.
 */
function loadDashboardMetrics() {
    // 1. Dashboard de Resumen
    document.getElementById('revenueToday').textContent = `€ ${commerceMetricsData.revenueToday.toFixed(2)}`;
    document.getElementById('wasteReduced').textContent = `${commerceMetricsData.wasteReduced} kg`;
    document.getElementById('activeOrders').textContent = commerceMetricsData.activeOrders;
    document.getElementById('upcomingPickups').textContent = commerceMetricsData.upcomingPickups;
    document.getElementById('orderBadge').textContent = commerceMetricsData.activeOrders; // Badge de la sidebar

    // 2. Dashboard de Analytics (Alto Nivel)
    document.getElementById('totalSalesMonth').textContent = `€ ${commerceMetricsData.totalSalesMonth.toFixed(2)}`;
    document.getElementById('totalWasteAvoided').textContent = `${commerceMetricsData.totalWasteAvoided} kg`;
    
    // Aquí se actualizarían los porcentajes de trend (Ej: trendWaste.textContent = ...)
    
    // 3. Actualizar contadores de botones de Pedidos (usando ordersData)
    // 💡 Esta lógica debe ser implementada después de fetchOrders, pero se omite para brevedad.
}

/**
 * Renderiza la lista de productos para gestión (Sección #products).
 */
function renderProductManagement(products) {
    const container = document.getElementById('currentProductsList');
    if (products.length === 0) {
        container.innerHTML = '<p class="empty-state">No hay productos publicados. ¡Sube el primero!</p>';
        return;
    }
    
    // Ejemplo de renderizado de tarjeta de gestión
    container.innerHTML = products.map(p => `
        <div class="product-management-card">
            <img src="${p.imageUrl || 'placeholder.png'}" alt="${p.name}" class="product-image-small">
            <div>
                <h4>${p.name}</h4>
                <p>Categoría: ${p.category}</p>
                <p>Stock: ${p.stockQuantity} | Precio: € ${p.discountPrice.toFixed(2)}</p>
            </div>
            <div class="product-actions">
                <button class="btn-secondary" onclick="openProductModal(${p._id})">Editar</button>
                <button class="btn-logout" onclick="deleteProduct(${p._id})">Eliminar</button>
            </div>
        </div>
    `).join('');
}


/**
 * Renderiza la lista de pedidos activos (Sección #orders).
 */
function renderOrdersList(statusFilter = 'pending') {
    const container = document.getElementById('activeOrdersList');
    
    const filteredOrders = ordersData.filter(order => order.status.toLowerCase() === statusFilter);

    // Lógica para actualizar el botón activo
    document.querySelectorAll('#orderFilters .category-btn').forEach(btn => btn.classList.remove('active'));
    const activeButton = document.querySelector(`#orderFilters [data-status="${statusFilter}"]`);
    if(activeButton) activeButton.classList.add('active');


    if (filteredOrders.length === 0) {
        container.innerHTML = '<p class="empty-state">No hay pedidos en este estado actualmente.</p>';
        return;
    }
    
    // Generar cards de pedidos
    container.innerHTML = filteredOrders.map(order => `
        <div class="order-card">
            <h4>Pedido #${order._id.slice(-4)} - Cliente: ${order.customerName}</h4>
            <p>Retiro: ${order.pickupTime}</p>
            <p>Total: €${order.totalPaid.toFixed(2)}</p>
            ${statusFilter === 'pending' ? 
                `<button class="btn-primary" onclick="updateOrderStatus(${order._id}, 'Ready')">Marcar Listo</button>` :
                `<button class="btn-secondary" onclick="updateOrderStatus(${order._id}, 'Completed')">Confirmar Retiro</button>`
            }
        </div>
    `).join('');
}


// ----------------------------------------------------------------------
// GESTIÓN DE ANALYTICS (Chart.js)
// ----------------------------------------------------------------------

/**
 * Inicializa el gráfico de Chart.js para la sección de Analytics.
 */
function renderAnalyticsCharts() {
    // 💡 Se asume que fetchMetricsData() ya ha cargado los datos en commerceMetricsData
    const ctx = document.getElementById('salesChart');
    
    if (salesChartInstance) {
        salesChartInstance.destroy();
    }
    
    salesChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: commerceMetricsData.categories,
            datasets: [{
                label: 'Ventas (€)',
                data: commerceMetricsData.salesData,
                backgroundColor: 'rgba(46, 139, 87, 0.8)', // secondary-green
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false, 
            scales: { y: { beginAtZero: true } },
            plugins: {
                legend: { display: false },
                title: { display: true, text: 'Distribución de Ventas por Categoría' }
            }
        }
    });
}