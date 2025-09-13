// Dynamic footer year and last modified
document.getElementById('year').textContent = new Date().getFullYear();
document.getElementById('last-modified').textContent = document.lastModified;

// Hamburger menu toggle
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');

hamburger.addEventListener('click', () => {
    if (navMenu.style.display === 'flex') {
        navMenu.style.display = 'none';
        hamburger.textContent = '☰';
    } else {
        navMenu.style.display = 'flex';
        hamburger.textContent = '✖';
    }
});
