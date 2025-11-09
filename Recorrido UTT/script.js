// script.js — control simple del botón y visibilidad del header
const showNavbar = true; // poner false si se quiere ocultar el header para demo

document.addEventListener('DOMContentLoaded', () => {
  if (!showNavbar) {
    const header = document.querySelector('#navbarDemo');
    if (header) header.style.display = 'none';
  }

  const btn = document.querySelector('#btn-start');
  if (btn) {
    btn.addEventListener('click', e => {
      e.preventDefault();
      window.location.href = 'pwa/index.html'; // ruta de la PWA
    });
  }
});
