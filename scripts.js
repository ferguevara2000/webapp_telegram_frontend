// URL de Supabase y API Key
const supabaseUrl = 'https://fwujoibaczwmddsyaiur.supabase.co/rest/v1/rpc/get_image_by_id';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ3dWpvaWJhY3p3bWRkc3lhaXVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzcwODA3MjYsImV4cCI6MjA1MjY1NjcyNn0.2sl8tcb7YKLEWgrAo4B5JpvfkvhH5YqpodrcoOy_m4Y'; // Reemplaza con tu clave de Supabase

// Obtener el parámetro 'id' de la URL
const urlParams = new URLSearchParams(window.location.search);
const imageId = urlParams.get('id');

// Elementos del DOM
const imageElement = document.getElementById('image');
const messageElement = document.getElementById('message');

// Intervalo de actualización (en milisegundos)
const updateInterval = 10000; // 10 segundos

// Función para obtener la imagen desde Supabase
async function fetchImageById(id) {
  try {
    const response = await fetch(supabaseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`
      },
      body: JSON.stringify({ image_id: id })
    });

    if (!response.ok) {
      throw new Error('Imagen no encontrada');
    }

    // La respuesta contiene los datos de la imagen en base64
    const imageData = await response.text();

    // Crear una URL de objeto a partir de los datos base64
    const imageUrl = `data:image/jpeg;base64,${imageData}`;

    // Actualizar la imagen y mensaje
    imageElement.src = imageUrl;
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
