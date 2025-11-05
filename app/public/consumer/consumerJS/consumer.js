// Datos de ejemplo
const products = [
  {
    id: 1,
    name: "Mix de Frutas Frescas",
    store: "Supermercado Central",
    category: "frutas",
    originalPrice: 12.99,
    discountPrice: 5.99,
    distance: 0.8,
    image: "/fresh-fruit-mix.png",
  },
  {
    id: 2,
    name: "Pan Artesanal del Día",
    store: "Panadería La Esquina",
    category: "panaderia",
    originalPrice: 8.5,
    discountPrice: 3.5,
    distance: 1.2,
    image: "/artisan-bread.png",
  },
  {
    id: 3,
    name: "Verduras Orgánicas",
    store: "Verdulería Verde",
    category: "verduras",
    originalPrice: 15.0,
    discountPrice: 7.0,
    distance: 2.5,
    image: "/organic-vegetables-display.png",
  },
  {
    id: 4,
    name: "Lácteos Variados",
    store: "Supermercado Central",
    category: "lacteos",
    originalPrice: 10.99,
    discountPrice: 4.99,
    distance: 0.8,
    image: "/assorted-dairy.png",
  },
  {
    id: 5,
    name: "Ensalada Fresca",
    store: "Verdulería Verde",
    category: "verduras",
    originalPrice: 6.5,
    discountPrice: 2.5,
    distance: 2.5,
    image: "/fresh-salad.png",
  },
  {
    id: 6,
    name: "Bollería Dulce",
    store: "Panadería La Esquina",
    category: "panaderia",
    originalPrice: 9.99,
    discountPrice: 4.5,
    distance: 1.2,
    image: "/sweet-pastries.jpg",
  },
]

const stores = [
  { id: 1, name: "Supermercado Central", type: "supermercado", x: 20, y: 30 },
  { id: 2, name: "Panadería La Esquina", type: "panaderia", x: 60, y: 50 },
  { id: 3, name: "Verdulería Verde", type: "verduleria", x: 40, y: 70 },
  { id: 4, name: "Panadería Artesanal", type: "panaderia", x: 75, y: 25 },
  { id: 5, name: "Supermercado Norte", type: "supermercado", x: 30, y: 80 },
]

const pickupPoints = [
  {
    id: 1,
    name: "Centro Comunal Villa Luz",
    address: "Av. Siempre Viva 123",
    lat: -34.6037,
    lng: -58.3816,
    hours: "Lun-Vie: 9:00-18:00, Sáb: 9:00-13:00",
    contact: "+54 11 1234-5678",
  },
  {
    id: 2,
    name: "Plaza Central Shopping",
    address: "Calle Falsa 456",
    lat: -34.6097,
    lng: -58.3756,
    hours: "Lun-Dom: 10:00-22:00",
    contact: "+54 11 8765-4321",
  },
  {
    id: 3,
    name: "Estación de Servicio Shell",
    address: "Ruta 40 km 25",
    lat: -34.5987,
    lng: -58.3896,
    hours: "24 horas",
    contact: "+54 11 5555-6666",
  },
]

let map = null
let userMarker = null
let userLocation = null
const cart = []

// Import Leaflet library
const L = window.L

// Navegación actualizada para navbar lateral
function navigateToSection(sectionId) {
  document.querySelectorAll(".section").forEach((section) => {
    section.classList.remove("active")
  })

  document.getElementById(sectionId).classList.add("active")

  document.querySelectorAll(".nav-btn-sidebar").forEach((btn) => {
    btn.classList.remove("active")
  })

  const activeBtn = document.querySelector(`.nav-btn-sidebar[data-section="${sectionId}"]`)
  if (activeBtn) {
    activeBtn.classList.add("active")
  }

  window.scrollTo(0, 0)

  if (sectionId === "reservations" && !map) {
    initializeMap()
  }
}

document.querySelectorAll(".nav-btn-sidebar").forEach((btn) => {
  btn.addEventListener("click", () => {
    const section = btn.getAttribute("data-section")
    navigateToSection(section)
  })
})

// Carrusel
function scrollCarousel(direction) {
  const carousel = document.getElementById("carousel")
  const scrollAmount = 300
  carousel.scrollBy({
    left: direction * scrollAmount,
    behavior: "smooth",
  })
}

// Crear tarjeta de producto
function createProductCard(product) {
  return `
    <div class="product-card">
      <img src="${product.image}" alt="${product.name}" class="product-image">
      <h3 class="product-name">${product.name}</h3>
      <p class="product-store">${product.store}</p>
      <p class="product-distance">📍 ${product.distance} km</p>
      <div class="product-prices">
        <span class="price-original">€${product.originalPrice.toFixed(2)}</span>
        <span class="price-discount">€${product.discountPrice.toFixed(2)}</span>
      </div>
      <div style="display: flex; gap: 0.5rem;">
        <button class="product-btn" style="flex: 1;" onclick="addToCart(${product.id})">Agregar</button>
        <button class="product-btn" style="flex: 1;" onclick="openReservationModal(${product.id})">Reservar</button>
      </div>
    </div>
  `
}

// Renderizar productos en carrusel
function renderCarousel() {
  const carousel = document.getElementById("carousel")
  carousel.innerHTML = products.slice(0, 4).map(createProductCard).join("")
}

// Renderizar productos en grid
function renderProductsGrid(filteredProducts = products) {
  const grid = document.getElementById("productsGrid")
  if (filteredProducts.length === 0) {
    grid.innerHTML = '<p class="empty-state">No se encontraron productos</p>'
  } else {
    grid.innerHTML = filteredProducts.map(createProductCard).join("")
  }
}

// Aplicar filtros
function applyFilters() {
  const searchTerm = document.getElementById("searchInput").value.toLowerCase()
  const categoryFilterElement = document.querySelector('.category-btn.active[data-category]')
  const category = categoryFilterElement ? categoryFilterElement.getAttribute('data-category') : ''
  const distance = Number.parseFloat(document.getElementById("distanceFilter").value)
  const maxPrice = Number.parseFloat(document.getElementById("priceFilter").value)

  const filtered = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm) || product.store.toLowerCase().includes(searchTerm)
    const matchesCategory = !category || product.category === category
    const matchesDistance = !distance || product.distance <= distance
    const matchesPrice = !maxPrice || product.discountPrice <= maxPrice

    return matchesSearch && matchesCategory && matchesDistance && matchesPrice
  })

  renderProductsGrid(filtered)
}

document.querySelectorAll(".category-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".category-btn").forEach((b) => b.classList.remove("active"))
    btn.classList.add("active")

    const category = btn.getAttribute("data-category")
    filterByCategory(category)
  })
})

function filterByCategory(category) {
  const searchTerm = document.getElementById("searchInput").value.toLowerCase()
  const distance = Number.parseFloat(document.getElementById("distanceFilter").value)
  const maxPrice = Number.parseFloat(document.getElementById("priceFilter").value)

  const filtered = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm) || product.store.toLowerCase().includes(searchTerm)
    const matchesCategory = !category || product.category === category
    const matchesDistance = !distance || product.distance <= distance
    const matchesPrice = !maxPrice || product.discountPrice <= maxPrice

    return matchesSearch && matchesCategory && matchesDistance && matchesPrice
  })

  renderProductsGrid(filtered)
}

// Event listener para búsqueda en tiempo real
document.getElementById("searchInput")?.addEventListener("input", applyFilters)

// Mapa (Nota: La función 'renderMap' y lógica de 'showStorePopup' no se usan ya que la sección 'reservations' usa Leaflet, pero se mantienen por si se necesitan)

// Modal de reserva
let currentProduct = null

function openReservationModal(productId) {
  currentProduct = products.find((p) => p.id === productId)
  const modal = document.getElementById("reservationModal")
  const productInfo = document.getElementById("modalProductInfo")

  productInfo.innerHTML = `
        <div style="display: flex; gap: 1rem; margin-bottom: 1.5rem;">
            <img src="${currentProduct.image}" alt="${currentProduct.name}" 
                 style="width: 100px; height: 100px; object-fit: cover; border-radius: 8px;">
            <div>
                <h4 style="color: var(--primary-purple); margin-bottom: 0.5rem;">${currentProduct.name}</h4>
                <p style="color: var(--text-light); margin-bottom: 0.5rem;">${currentProduct.store}</p>
                <p style="font-size: 1.5rem; font-weight: 700; color: var(--secondary-green);">
                    €${currentProduct.discountPrice.toFixed(2)}
                </p>
            </div>
        </div>
    `

  modal.classList.add("active")

  // Event listeners para opciones de retiro
  document.querySelectorAll('input[name="pickup"]').forEach((radio) => {
    radio.addEventListener("change", (e) => {
      const pickupMap = document.getElementById("pickupPointsMap")
      if (e.target.value === "punto") {
        pickupMap.style.display = "block"
      } else {
        pickupMap.style.display = "none"
      }
    })
  })
}

function closeModal() {
  document.getElementById("reservationModal").classList.remove("active")
  currentProduct = null
}

function confirmReservation() {
  const pickupType = document.querySelector('input[name="pickup"]:checked').value
  const timeSlot = document.querySelector(".time-select").value

  alert(
    `¡Reserva confirmada!\n\nProducto: ${currentProduct.name}\nRetiro: ${pickupType === "tienda" ? "En tienda" : "Punto de recogida"}\nHorario: ${timeSlot}`,
  )

  // Agregar a reservas activas (la función addReservation necesita que exista un elemento con id="reservationsList")
  const reservationsListSection = document.getElementById("reservationsList");
  if (!reservationsListSection) {
     // Si la sección no existe (por si el HTML se modifica), se usa un alert alternativo
    console.log("No se pudo agregar al DOM de reservas. Reserva confirmada en consola.");
  } else {
    addReservation(currentProduct, pickupType, timeSlot);
  }

  closeModal()
  navigateToSection("profile")
}

// Chatbot
const chatResponses = {
  "¿Cómo reservo alimentos?":
    "Para reservar alimentos, simplemente haz clic en el botón 'Reservar' en cualquier oferta. Luego selecciona tu método de retiro preferido (en tienda o punto de recogida) y el horario que mejor te convenga. ¡Es muy fácil!",
  "¿Dónde retiro mi pedido?":
    "Puedes retirar tu pedido directamente en la tienda del comercio o en uno de nuestros puntos de recogida designados. Al reservar, podrás ver todas las opciones disponibles en el mapa con sus direcciones y distancias.",
  "Política de cancelación":
    "Puedes cancelar tu reserva hasta 2 horas antes del horario de retiro seleccionado sin ningún cargo. Después de ese tiempo, se aplicará una penalización del 50% del valor del producto para compensar al comercio.",
}

function sendFAQ(question) {
  const chatMessages = document.getElementById("chatbotMessages")

  // Agregar pregunta del usuario
  const userBubble = document.createElement("div")
  userBubble.className = "chat-bubble user"
  userBubble.innerHTML = `<p>${question}</p>`
  chatMessages.appendChild(userBubble)

  // Agregar respuesta del bot
  setTimeout(() => {
    const botBubble = document.createElement("div")
    botBubble.className = "chat-bubble bot"
    botBubble.innerHTML = `<p>${chatResponses[question]}</p>`
    chatMessages.appendChild(botBubble)
    chatMessages.scrollTop = chatMessages.scrollHeight
  }, 500)

  chatMessages.scrollTop = chatMessages.scrollHeight
}

function sendChatbotMessage() {
  const input = document.getElementById("chatbotInput")
  const message = input.value.trim()

  if (message === "") return

  const chatMessages = document.getElementById("chatbotMessages")

  // Agregar mensaje del usuario
  const userBubble = document.createElement("div")
  userBubble.className = "chat-bubble user"
  userBubble.innerHTML = `<p>${message}</p>`
  chatMessages.appendChild(userBubble)

  input.value = ""

  // Respuesta automática del bot
  setTimeout(() => {
    const botBubble = document.createElement("div")
    botBubble.className = "chat-bubble bot"
    botBubble.innerHTML = `<p>Gracias por tu mensaje. Un agente te responderá pronto. Mientras tanto, puedes revisar nuestras preguntas frecuentes arriba.</p>`
    chatMessages.appendChild(botBubble)
    chatMessages.scrollTop = chatMessages.scrollHeight
  }, 1000)

  chatMessages.scrollTop = chatMessages.scrollHeight
}

// Event listener para Enter en chat
document.getElementById("chatbotInput")?.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    sendChatbotMessage()
  }
})

// Perfil - Pestañas
document.querySelectorAll(".profile-tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    const tabName = tab.getAttribute("data-tab")

    // Actualizar pestañas activas
    document.querySelectorAll(".profile-tab").forEach((t) => t.classList.remove("active"))
    tab.classList.add("active")

    // Mostrar contenido correspondiente
    document.querySelectorAll(".tab-content").forEach((content) => {
      content.classList.remove("active")
    })
    document.getElementById(tabName).classList.add("active")
  })
})

// Agregar reserva
function addReservation(product, pickupType, timeSlot) {
  const reservationsList = document.getElementById("reservationsList") || document.getElementById("historial") // Usa historial si no encuentra el ID, por si se quiere ver en el historial

  const emptyState = reservationsList.querySelector(".empty-state")
  if (emptyState) {
    emptyState.remove()
  }

  const reservationCard = document.createElement("div")
  reservationCard.className = "reservation-card"
  reservationCard.innerHTML = `
        <div class="reservation-info">
            <h4>${product.name}</h4>
            <p>📍 ${product.store}</p>
            <p>🚶 Retiro: ${pickupType === "tienda" ? "En tienda" : "Punto de recogida"}</p>
            <p>🕐 Horario: ${timeSlot}</p>
        </div>
        <div class="reservation-status">Activa</div>
    `
  reservationsList.appendChild(reservationCard)
}

function addToCart(productId) {
  const product = products.find((p) => p.id === productId)
  if (!product) return

  const existingItem = cart.find((item) => item.id === productId)
  if (existingItem) {
    alert("Este producto ya está en tu carrito")
    return
  }

  cart.push({ ...product })
  updateCartBadge()
  renderCart()
  alert(`${product.name} agregado al carrito`)
}

function removeFromCart(productId) {
  const index = cart.findIndex((item) => item.id === productId)
  if (index > -1) {
    cart.splice(index, 1)
    updateCartBadge()
    renderCart()
  }
}

function updateCartBadge() {
  const badge = document.getElementById("cartBadge")
  badge.textContent = cart.length
}

function renderCart() {
  const cartItems = document.getElementById("cartItems")
  const cartSummary = document.getElementById("cartSummary")

  if (cart.length === 0) {
    cartItems.innerHTML = '<p class="empty-state">Tu carrito está vacío</p>'
    cartSummary.style.display = "none"
    return
  }

  cartSummary.style.display = "block"

  cartItems.innerHTML = cart
    .map(
      (item) => `
    <div class="cart-item">
      <img src="${item.image}" alt="${item.name}" class="cart-item-image">
      <div class="cart-item-info">
        <h4 class="cart-item-name">${item.name}</h4>
        <p class="cart-item-store">${item.store}</p>
        <p class="cart-item-price">€${item.discountPrice.toFixed(2)}</p>
      </div>
      <button class="cart-item-remove" onclick="removeFromCart(${item.id})">Eliminar</button>
    </div>
  `,
    )
    .join("")

  // Calcular totales
  const subtotal = cart.reduce((sum, item) => sum + item.originalPrice, 0)
  const total = cart.reduce((sum, item) => sum + item.discountPrice, 0)
  const discount = subtotal - total

  document.getElementById("subtotal").textContent = `€${subtotal.toFixed(2)}`
  document.getElementById("discount").textContent = `-€${discount.toFixed(2)}`
  document.getElementById("total").textContent = `€${total.toFixed(2)}`
}

function proceedToPickup() {
  if (cart.length === 0) return
  alert("Redirigiendo a selección de punto de retiro...")
  navigateToSection("reservations")
}

function toggleChatbot() {
  const chatbotWindow = document.getElementById("chatbotWindow")
  chatbotWindow.classList.toggle("active")
}

function searchFromHome() {
  const searchTerm = document.getElementById("homeSearchInput").value
  // Navega a la sección de búsqueda y actualiza el campo de búsqueda
  navigateToSection("search")
  document.getElementById("searchInput").value = searchTerm
  // Se necesitan aplicar los filtros después de actualizar el input
  applyFilters()
}

function searchByCategory(category) {
  navigateToSection("search")
  
  // Activa el botón de categoría en la sección de búsqueda
  document.querySelectorAll('#search .category-btn').forEach((btn) => {
    btn.classList.remove("active")
    if (btn.getAttribute("data-category") === category) {
      btn.classList.add("active")
    } else if (category === '' && btn.getAttribute("data-category") === '') {
        btn.classList.add("active")
    }
  })

  // Asegura que el input de búsqueda esté vacío o se mantenga si es necesario
  document.getElementById("searchInput").value = ""
  
  filterByCategory(category)
}

function initializeMap() {
  // Centro de Buenos Aires como punto inicial
  map = L.map("leafletMap").setView([-34.6037, -58.3816], 13)

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap contributors",
    maxZoom: 19,
  }).addTo(map)

  // Agregar marcadores de puntos de encuentro
  pickupPoints.forEach((point) => {
    const marker = L.marker([point.lat, point.lng], {
      icon: L.divIcon({
        className: "custom-marker",
        html: '<div style="background-color: #2e8b57; width: 30px; height: 30px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3);"></div>',
        iconSize: [30, 30],
      }),
    }).addTo(map)

    marker.bindPopup(`
      <div style="padding: 0.5rem;">
        <h4 style="color: #3d2e7c; margin-bottom: 0.5rem; font-size: 0.95rem;">${point.name}</h4>
        <p style="font-size: 0.8rem; color: #666; margin-bottom: 0.25rem;">📍 ${point.address}</p>
        <p style="font-size: 0.8rem; color: #666; margin-bottom: 0.25rem;">🕐 ${point.hours}</p>
        <p style="font-size: 0.8rem; color: #666;">📞 ${point.contact}</p>
      </div>
    `)
  })

  // Intentar obtener geolocalización del usuario
  getUserLocation()

  // Renderizar lista de puntos
  renderPickupPointsList()
}

function getUserLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        userLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        }

        // Agregar marcador del usuario
        userMarker = L.marker([userLocation.lat, userLocation.lng], {
          icon: L.divIcon({
            className: "user-marker",
            html: '<div style="background-color: #8fd14f; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3);"></div>',
            iconSize: [20, 20],
          }),
        }).addTo(map)

        userMarker.bindPopup("Tu ubicación")

        // Centrar mapa en usuario
        map.setView([userLocation.lat, userLocation.lng], 14)

        // Actualizar distancias en la lista
        renderPickupPointsList()
      },
      (error) => {
        console.log("[v0] No se pudo obtener la geolocalización:", error)
      },
    )
  }
}

function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371 // Radio de la Tierra en km
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLon = ((lon2 - lon1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

function renderPickupPointsList() {
  const container = document.getElementById("pickupPointsList")

  const pointsWithDistance = pickupPoints.map((point) => {
    let distance = null
    if (userLocation) {
      distance = calculateDistance(userLocation.lat, userLocation.lng, point.lat, point.lng)
    }
    return { ...point, distance }
  })

  // Ordenar por distancia si está disponible
  if (userLocation) {
    pointsWithDistance.sort((a, b) => a.distance - b.distance)
  }

  container.innerHTML = pointsWithDistance
    .map(
      (point) => `
    <div class="pickup-point-card" onclick="focusOnPoint(${point.lat}, ${point.lng})">
      <h4>${point.name}</h4>
      <p>📍 ${point.address}</p>
      <p>🕐 ${point.hours}</p>
      <p>📞 ${point.contact}</p>
      ${point.distance ? `<p class="pickup-point-distance">📏 ${point.distance.toFixed(1)} km de distancia</p>` : ""}
    </div>
  `,
    )
    .join("")
}

function focusOnPoint(lat, lng) {
  if (map) {
    map.setView([lat, lng], 16)
  }
}

document.querySelectorAll(".distance-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".distance-btn").forEach((b) => b.classList.remove("active"))
    btn.classList.add("active")

    const maxDistance = btn.getAttribute("data-distance")
    filterPointsByDistance(maxDistance)
  })
})

function filterPointsByDistance(maxDistance) {
  if (!userLocation || maxDistance === "all") {
    renderPickupPointsList()
    return
  }

  const filtered = pickupPoints.filter((point) => {
    const distance = calculateDistance(userLocation.lat, userLocation.lng, point.lat, point.lng)
    return distance <= Number.parseFloat(maxDistance)
  })

  const container = document.getElementById("pickupPointsList")
  if (filtered.length === 0) {
    container.innerHTML = '<p class="empty-state">No hay puntos de encuentro en este rango de distancia</p>'
  } else {
    container.innerHTML = filtered
      .map((point) => {
        const distance = calculateDistance(userLocation.lat, userLocation.lng, point.lat, point.lng)
        return `
        <div class="pickup-point-card" onclick="focusOnPoint(${point.lat}, ${point.lng})">
          <h4>${point.name}</h4>
          <p>📍 ${point.address}</p>
          <p>🕐 ${point.hours}</p>
          <p>📞 ${point.contact}</p>
          <p class="pickup-point-distance">📏 ${distance.toFixed(1)} km de distancia</p>
        </div>
      `
      })
      .join("")
  }
}

// Actualizar inicialización
document.addEventListener("DOMContentLoaded", () => {
  renderCarousel()
  renderProductsGrid()
  updateCartBadge()

  // Inicializa el listener para los filtros avanzados después de que el DOM esté cargado
  document.getElementById("searchInput")?.addEventListener("input", applyFilters)
  document.getElementById("distanceFilter")?.addEventListener("change", applyFilters)
  document.getElementById("priceFilter")?.addEventListener("input", applyFilters)

  console.log("[v0] Aplicación Vértice inicializada correctamente")
})