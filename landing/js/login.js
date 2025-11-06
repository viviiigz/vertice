const login = async (event) => {
  event.preventDefault();
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  
  try {
    const req = await fetch("/api/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
      headers: { "Content-type": "application/json" },
    });
    
    const res = await req.json();
    
    if (req.ok) {
      alert(res.message);
      localStorage.setItem("token", res.token);
      localStorage.setItem("userType", res.userType); // Guardar tipo de usuario
      localStorage.setItem("username", res.username); 
      localStorage.setItem("email", res.email);
      
      // Redirección según tipo de usuario
      switch(res.userType) {
        case 'User':
          window.location.href = "/app/public/consumer/inicioConsumer.html";
          break; // ✅ AGREGAR BREAK
        case 'Comercio':
          window.location.href = "/app/public/commerce/inicioCommerce.html"; // ✅ Corregí la ruta
          break;
        case 'Banco de Alimentos':
          window.location.href = "/app/public/bank/inicioBank.html"; // ✅ Corregí la ruta
          break;
        case 'Admin':
          window.location.href = "/app/public/admin/inicioAdmin.html";
          break;
        default:
          alert("Tipo de usuario no reconocido");
      
      }
    } else {
      alert(res.message);
    }
  } catch (error) {
    console.log(error);
    alert("Ocurrió un error al iniciar sesión");
  }
};