// URL del backend
const backendUrl = 'https://webapp-telegram-backend.onrender.com';

// Obtener el parámetro 'id' de la URL
const urlParams = new URLSearchParams(window.location.search);
const imageId = urlParams.get('id');

// Elementos del DOM
const imageElement = document.getElementById('image');
const messageElement = document.getElementById('message');

// Intervalo de actualización (en milisegundos)
const updateInterval = 10000; // 10 segundos

// Función para obtener la imagen desde el backend
async function fetchImageById(id) {
  try {
    const response = await fetch(`${backendUrl}/images/${id}`);

    if (!response.ok) {
      throw new Error('Imagen no encontrada');
    }

    const image = await response.json();

    // Actualizar la imagen y mensaje
    imageElement.src = image.url;
    imageElement.alt = `Imagen ID: ${id}`;
    messageElement.textContent = ''; // Limpia cualquier mensaje de error
  } catch (error) {
    // Mostrar error en el mensaje
    imageElement.src = ''; // Limpia la imagen si hay un error
    imageElement.alt = 'Error al cargar la imagen';
    messageElement.textContent = error.message;
  }
}

// Verificar si se proporcionó un ID y configurar el intervalo de actualización
if (imageId) {
  // Llamar la función inmediatamente
  fetchImageById(imageId);

  // Configurar un intervalo para actualizar la imagen automáticamente
  setInterval(() => fetchImageById(imageId), updateInterval);
} else {
  messageElement.textContent = 'No se proporcionó un ID en la URL.';
}
