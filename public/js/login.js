// public/js/login.js

document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {

    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const formData = new FormData(loginForm);
      const data = {
        username: formData.get('username'),
        password: formData.get('password'),
      };

      try {
        const response = await fetch('/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });

        const result = await response.json();
        
        if (response.ok && result.success) {
          Swal.fire({
            icon: 'success',
            title: '¡Bienvenido!',
            text: `Hola, ${data.username}. Has iniciado sesión correctamente.`,
          }).then(() => {
            window.location.href = result.redirectUrl;
          });
        } else if (response.status === 403) {
          Swal.fire({
            icon: 'warning',
            title: 'Acceso denegado',
            text: result.error || 'No tienes permisos para acceder a esta aplicación.',
          });
        } else if (response.status === 401) {
          Swal.fire({
            icon: 'error',
            title: 'Error de autenticación',
            text: result.error || 'Credenciales incorrectas',
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error inesperado',
            text: result.error || 'Ocurrió un error al intentar iniciar sesión. Por favor, inténtalo de nuevo.',
          });
        }
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error inesperado',
          text: 'Ocurrió un error al intentar iniciar sesión. Por favor, inténtalo de nuevo.',
        });
      }
    });
  }
});