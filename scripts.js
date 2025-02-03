// URL de Supabase y API Key
const supabaseUrl = 'https://fwujoibaczwmddsyaiur.supabase.co/rest/v1/rpc/get_all_images';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ3dWpvaWJhY3p3bWRkc3lhaXVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzcwODA3MjYsImV4cCI6MjA1MjY1NjcyNn0.2sl8tcb7YKLEWgrAo4B5JpvfkvhH5YqpodrcoOy_m4Y'; // Reemplaza con tu clave de Supabase

// Obtener el parámetro 'user_id' de la URL
const urlParams = new URLSearchParams(window.location.search);
const userId = urlParams.get('user_id');

// Elemento del DOM para la galería
const gallery = document.querySelector('.gallery');

// Intervalo de actualización (en milisegundos)
const updateInterval = 10000; // 10 segundos

// Función para obtener las imágenes desde Supabase
async function fetchImagesByUserId(userId) {
  try {
    const response = await fetch(supabaseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
      },
      body: JSON.stringify({ p_user_id: userId }), // Enviar el user_id como parámetro
    });

    if (!response.ok) {
      throw new Error('Error al obtener las imágenes');
    }

    // La respuesta es un array de imágenes
    const images = await response.json();

    // Limpiar la galería antes de agregar nuevas imágenes
    gallery.innerHTML = '';

    // Crear tarjetas para cada imagen
    images.forEach((image) => {
      const card = document.createElement('div');
      card.className = 'card';

      const imgElement = document.createElement('img');
      imgElement.src = `data:image/jpeg;base64,${image.image_data}`; // Convertir base64 a URL
      imgElement.alt = `Imagen ID: ${image.id}`;

      const timestampElement = document.createElement('p');
      timestampElement.className = 'timestamp';
      timestampElement.textContent = new Date(image.created_at).toLocaleString(); // Formatear fecha

      card.appendChild(imgElement);
      card.appendChild(timestampElement);
      gallery.appendChild(card);
    });
  } catch (error) {
    console.error('Error:', error.message);
    gallery.innerHTML = `<p class="error">${error.message}</p>`; // Mostrar error en la galería
  }
}

// Verificar si se proporcionó un user_id y configurar el intervalo de actualización
if (userId) {
  // Llamar la función inmediatamente
  fetchImagesByUserId(userId);

  // Configurar un intervalo para actualizar las imágenes automáticamente
  setInterval(() => fetchImagesByUserId(userId), updateInterval);
} else {
  gallery.innerHTML = '<p class="error">No se proporcionó un user_id en la URL.</p>';
}
