// Archivo: /app/public/shared/global.js

// -------------------------------------------------------------------
// 1. CHATBOT: Lógica Funcional Global (Mantenida de tu código)
// -------------------------------------------------------------------

const chatResponses = {
  "¿Cómo reservo alimentos?":
    "Para reservar alimentos, simplemente haz clic en el botón 'Reservar' en cualquier oferta. Luego selecciona tu método de retiro preferido (en tienda o punto de recogida) y el horario que mejor te convenga. ¡Es muy fácil!",
  "¿Dónde retiro mi pedido?":
    "Puedes retirar tu pedido directamente en la tienda del comercio o en uno de nuestros puntos de recogida designados. Al reservar, podrás ver todas las opciones disponibles en el mapa con sus direcciones y distancias.",
  "Política de cancelación":
    "Puedes cancelar tu reserva hasta 2 horas antes del horario de retiro seleccionado sin ningún cargo. Después de ese tiempo, se aplicará una penalización del 50% del valor del producto para compensar al comercio.",
}

window.toggleChatbot = function() {
    const chatbotWindow = document.getElementById("chatbotWindow");
    chatbotWindow.classList.toggle("active");
}

window.sendFAQ = function(question) { 
    // ... (Lógica completa de sendFAQ) 
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

window.sendChatbotMessage = function() { 
    // ... (Lógica completa de sendChatbotMessage) 
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
        window.sendChatbotMessage();
    }
});


// -------------------------------------------------------------------
// 2. AUTH Y CORE: Lógica Global (Mantenida)
// -------------------------------------------------------------------

window.checkAuth = function() {
    const token = localStorage.getItem("token");
    const userType = localStorage.getItem("userType");
    
    // Aquí puedes implementar la lógica para forzar la redirección si el rol no es el esperado
    // Por ejemplo, si un Consumidor accede a la vista de Comercio.
    // if (!token || userType !== expectedRole) { window.location.href = "/login.html"; return false; }
    
    if (!token) {
        window.location.href = "/landing/vertice.html"; 
        return false;
    }
    return true;
}

window.logout = function() {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("email");
    localStorage.removeItem("userType");
    alert("Sesión cerrada correctamente.");
    window.location.href = "/landing/vertice.html"; 
}