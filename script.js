// Scroll-triggered animations
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.animate-in').forEach(el => observer.observe(el));

// Smooth nav active states
const sections = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
    const scrollY = window.scrollY + 120;
    sections.forEach(s => {
        const link = document.querySelector(`.nav-links a[href="#${s.id}"]`);
        if (!link) return;
        if (scrollY >= s.offsetTop && scrollY < s.offsetTop + s.offsetHeight) {
            link.style.color = 'var(--accent)';
        } else {
            link.style.color = '';
        }
    });
});