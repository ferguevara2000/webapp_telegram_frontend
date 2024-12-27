const sideLinks = document.querySelectorAll('.sidebar .side-menu li a:not(.logout)');

sideLinks.forEach(item => {
    const li = item.parentElement;
    item.addEventListener('click', () => {
        sideLinks.forEach(i => {
            i.parentElement.classList.remove('active');
        })
        li.classList.add('active');
    })
});

const menuBar = document.querySelector('.content nav .bx.bx-menu');
const sideBar = document.querySelector('.sidebar');

menuBar.addEventListener('click', () => {
    sideBar.classList.toggle('close');
});

const searchBtn = document.querySelector('.content nav form .form-input button');
const searchBtnIcon = document.querySelector('.content nav form .form-input button .bx');
const searchForm = document.querySelector('.content nav form');

searchBtn.addEventListener('click', function (e) {
    if (window.innerWidth < 576) {
        e.preventDefault;
        searchForm.classList.toggle('show');
        if (searchForm.classList.contains('show')) {
            searchBtnIcon.classList.replace('bx-search', 'bx-x');
        } else {
            searchBtnIcon.classList.replace('bx-x', 'bx-search');
        }
    }
});

window.addEventListener('resize', () => {
    if (window.innerWidth < 768) {
        sideBar.classList.add('close');
    } else {
        sideBar.classList.remove('close');
    }
    if (window.innerWidth > 576) {
        searchBtnIcon.classList.replace('bx-x', 'bx-search');
        searchForm.classList.remove('show');
    }
});

const toggler = document.getElementById('theme-toggle');

toggler.addEventListener('change', function () {
    if (this.checked) {
        document.body.classList.add('dark');
    } else {
        document.body.classList.remove('dark');
    }
});

// Cargar el tema al iniciar
window.addEventListener('DOMContentLoaded', () => {
    const darkMode = localStorage.getItem('darkMode') === 'true';
    if (darkMode) {
        document.body.classList.add('dark');
        toggler.checked = true;
    }
});

// Escuchar cambios en el toggler
toggler.addEventListener('change', function () {
    if (this.checked) {
        document.body.classList.add('dark');
        localStorage.setItem('darkMode', 'true');
    } else {
        document.body.classList.remove('dark');
        localStorage.setItem('darkMode', 'false');
    }
});

// URL de la API
const API_URL = "https://webapp-telegram-backend.onrender.com/users"; // Cambia esta URL a tu API real

// Selección del tbody donde se llenarán los datos
const tablaDatos = document.getElementById("tabla-datos");

// Función para cargar los datos desde la API
async function cargarDatos() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error("Error al obtener los datos de la API");
        const datos = await response.json();

        // Llenar la tabla con los datos recibidos
        tablaDatos.innerHTML = datos
            .map(dato => `
                <tr>
                    <td>${dato.user_id}</td>
                    <td>${dato.username}</td>
                    <td>${dato.expires_at}</td>
                    <td><img src="${dato.default_image_url}" alt="${dato.nombre}" /></td>
                    <td>${dato.image_id}</td>
                    <td>${dato.default_message}</td>
                    <td class="actions">
                        <i class='bx bx-edit btn-editar' data-id="${dato.user_id}"></i>
                        <i class='bx bx-trash btn-eliminar' data-id="${dato.user_id}"></i>
                    </td>
                </tr>
            `).join("");
            actualizarTotalUsuarios();
    } catch (error) {
        console.error("Error al cargar los datos:", error);
        tablaDatos.innerHTML = "<tr><td colspan='7'>Error al cargar los datos</td></tr>";
    }
}

// Obtener elementos del modal y formulario
const modal = document.getElementById("myModal");
const closeModal = document.querySelector(".close_modal");
const form = document.getElementById("userForm");

window.addEventListener('DOMContentLoaded', () => {
    modal.style.display = "none"; // Asegura que el modal esté cerrado al cargar la página
});

// Función para abrir el modal
function openModal() {
  modal.style.display = "flex"; // Mostrar el modal
}

// Función para cerrar el modal
function closeModalFunction() {
  modal.style.display = "none"; // Ocultar el modal
}

// Event listener para cerrar el modal cuando se hace clic en la X
closeModal.addEventListener("click", closeModalFunction);

// Cerrar el modal si el usuario hace clic fuera del contenido del modal
window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  }

// Event listener para enviar el formulario
form.addEventListener("submit", function (event) {
  event.preventDefault(); // Prevenir el comportamiento predeterminado del formulario

  // Recoger los datos del formulario
  const formData = {
    user_id: +document.querySelector(".user_id").value,
    username: document.querySelector(".username").value,
    expires_at: document.querySelector(".expires_at").value + "T00:00:00", // Aseguramos que la fecha sea de las 0 horas
    image_id: document.querySelector(".image_id").value,
    default_image_url: document.querySelector(".default_image_url").value,
    default_message: document.querySelector(".default_message").value,
  };

  const action = form.dataset.action;
  const userId = form.dataset.userId;

  if (action === "edit") {
    // Editar un usuario existente
    fetch(`https://webapp-telegram-backend.onrender.com/users/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData), // Convertir el objeto a JSON
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Usuario editado con éxito:", data);
        alert("Usuario editado con éxito!");
        cargarDatos(); // Recargar los datos
        actualizarTotalUsuarios(); // Actualizar el total de usuarios
        closeModalFunction(); // Cerrar el modal
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("Hubo un error al editar los datos.");
      });
  } else {
    // Crear un nuevo usuario
    fetch("https://webapp-telegram-backend.onrender.com/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData), // Convertir el objeto a JSON
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Usuario añadido con éxito:", data);
        alert("Usuario añadido con éxito!");
        cargarDatos(); // Recargar los datos
        actualizarTotalUsuarios(); // Actualizar el total de usuarios
        closeModalFunction(); // Cerrar el modal
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("Hubo un error al guardar los datos.");
      });
  }
});


// Función para abrir el modal cuando sea necesario
// (Puedes usar esto cuando des clic en un botón, por ejemplo)
document.getElementById("openFormButton").addEventListener("click", openModal);

// Delegación de eventos: detectar clics en los botones de eliminación
tablaDatos.addEventListener('click', function(event) {
  if (event.target.classList.contains('btn-eliminar')) {
    const userId = event.target.getAttribute('data-id');
    
    // Confirmar si el usuario realmente quiere eliminar
    const confirmDelete = confirm("¿Estás seguro de que deseas eliminar este usuario?");
    
    if (confirmDelete) {
      // Llamamos a la función para eliminar al usuario
      deleteUser(userId);
    }
  }
});

// Función para eliminar el usuario
async function deleteUser(userId) {
  try {
    // Realizamos una solicitud DELETE a la API
    const response = await fetch(`https://webapp-telegram-backend.onrender.com/users/${userId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        // Añade aquí otros encabezados si es necesario, como el token de autenticación
      },
    });

    if (response.ok) {
      // Si la respuesta es exitosa, mostramos un mensaje y actualizamos la UI
      alert('Usuario eliminado correctamente');
      
      // Recargar los datos después de eliminar el usuario
      cargarDatos();
      actualizarTotalUsuarios();
    } else {
      throw new Error('Error al eliminar el usuario');
    }
  } catch (error) {
    console.error(error);
    alert('Hubo un error al intentar eliminar el usuario');
  }
}

// Función para actualizar el total de usuarios
function actualizarTotalUsuarios() {
    // Obtener todas las filas de la tabla (excepto el encabezado, si es necesario)
    const filas = document.querySelectorAll('#tabla-datos tr');
    
    // Contar la cantidad de filas
    const totalUsuarios = filas.length;

    // Actualizar el contenido de <h3> con el total de usuarios
    document.getElementById('totalUsuarios').textContent = totalUsuarios;
}

// Llamar a la función para actualizar el total al cargar la página
window.addEventListener('DOMContentLoaded', actualizarTotalUsuarios);

tablaDatos.addEventListener('click', function(event) {
  if (event.target.classList.contains('btn-editar')) {
    const userId = event.target.getAttribute('data-id');
    openModal(); // Abrir el modal
    cargarDatosUsuario(userId); // Cargar los datos del usuario en el formulario
  }
});

async function cargarDatosUsuario(userId) {
  try {
    const response = await fetch(`https://webapp-telegram-backend.onrender.com/users/${userId}`);
    if (!response.ok) throw new Error("Error al obtener los datos del usuario");
    const usuario = await response.json();

    //Convertir fecha a formato adecuado
    const expiresAt = new Date(usuario.expires_at);
    expiresAt.setHours(0, 0, 0, 0); // Establecer la hora a las 00:00:00

    // Asignar los datos al formulario del modal
    document.querySelector(".user_id").value = usuario.user_id;
    document.querySelector(".username").value = usuario.username;
    document.querySelector(".expires_at").value = expiresAt.toISOString().split('T')[0]; // Formato YYYY-MM-DD
    document.querySelector(".image_id").value = usuario.image_id;
    document.querySelector(".default_image_url").value = usuario.default_image_url;
    document.querySelector(".default_message").value = usuario.default_message;
    
    // Cambiar el título del modal a "Editar Usuario" (opcional)
    document.getElementById("myModalTitle").textContent = "Editar Usuario";
    // Puedes agregar una clase de "editar" o "nuevo" para diferenciar entre crear y editar si lo necesitas.
    form.dataset.action = "edit"; // Usamos data-action para diferenciar entre crear y editar
    form.dataset.userId = userId; // Guardar el ID del usuario en el formulario
  } catch (error) {
    console.error("Error al cargar los datos del usuario:", error);
    alert("Hubo un error al cargar los datos del usuario.");
  }
}


// Llamar a la función para cargar los datos al cargar la página
cargarDatos();