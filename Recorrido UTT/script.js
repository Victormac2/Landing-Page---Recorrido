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
//codigo original del navbar
document.addEventListener("DOMContentLoaded", () => {
    const navLinks = document.querySelectorAll("nav a");
  
    const updateActiveLink = () => {
      const currentPath = window.location.pathname.split("/").pop() || "index.php"; // Considera "index.php" por defecto si la ruta estÃ¡ vacÃ­a.
  
      navLinks.forEach((link) => {
        link.classList.remove("active");
  
        // Solo considerar enlaces internos
        if (link.href.startsWith(window.location.origin)) {
          const hrefArray = link.href.split("/");
          const thisPath = hrefArray[hrefArray.length - 1];
  
          if (currentPath === thisPath) {
            link.classList.add("active");
          }
        }
      });
    };
  
    navLinks.forEach((link) => {
      link.addEventListener("click", (event) => {
        navLinks.forEach((navLink) => navLink.classList.remove("active"));
        link.classList.add("active");
      });
    });
  
    // Inicializa el enlace activo basado en la URL actual
    updateActiveLink();
  });