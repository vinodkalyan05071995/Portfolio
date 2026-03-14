// ── Custom Cursor ──
const cursor = document.querySelector('.cursor');
const cursorOutline = document.querySelector('.cursor-outline');
let mouseX = 0, mouseY = 0, outlineX = 0, outlineY = 0;

document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.transform = `translate(${mouseX - 4}px, ${mouseY - 4}px)`;
});

function animateOutline() {
    outlineX += (mouseX - outlineX) * 0.15;
    outlineY += (mouseY - outlineY) * 0.15;
    cursorOutline.style.transform = `translate(${outlineX - 18}px, ${outlineY - 18}px)`;
    requestAnimationFrame(animateOutline);
}
animateOutline();

// Cursor grow on hover
document.querySelectorAll('a, button, .portfolio-card, .skill-card').forEach(el => {
    el.addEventListener('mouseenter', () => {
        cursor.classList.add('cursor-hover');
        cursorOutline.classList.add('cursor-hover');
    });
    el.addEventListener('mouseleave', () => {
        cursor.classList.remove('cursor-hover');
        cursorOutline.classList.remove('cursor-hover');
    });
});

// ── Scroll Progress Bar ──
const progressBar = document.querySelector('.scroll-progress');
window.addEventListener('scroll', () => {
    const scrolled = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
    progressBar.style.width = scrolled + '%';
});

// ── Nav shrink on scroll ──
const nav = document.querySelector('nav');
window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
        nav.classList.add('nav-scrolled');
    } else {
        nav.classList.remove('nav-scrolled');
    }
});

// ── Typing Animation for Terminal ──
function typeTerminal() {
    const lines = document.querySelectorAll('.card-terminal .type-line');
    lines.forEach((line, i) => {
        const text = line.dataset.text;
        line.textContent = '';
        let charIndex = 0;
        setTimeout(() => {
            const interval = setInterval(() => {
                line.textContent += text[charIndex];
                charIndex++;
                if (charIndex >= text.length) clearInterval(interval);
            }, 35);
        }, i * 600);
    });
}

// Run typing once hero is visible
const heroObserver = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
        setTimeout(typeTerminal, 500);
        heroObserver.disconnect();
    }
}, { threshold: 0.3 });
heroObserver.observe(document.querySelector('.hero'));

// ── Mouse Glow on Cards ──
document.querySelectorAll('.portfolio-card, .skill-card').forEach(card => {
    card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty('--glow-x', x + 'px');
        card.style.setProperty('--glow-y', y + 'px');
    });
});

// ── Counter Animation ──
function animateCounters() {
    document.querySelectorAll('.stat-number').forEach(el => {
        const target = parseInt(el.dataset.target);
        const suffix = el.dataset.suffix || '';
        let current = 0;
        const increment = target / 40;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            el.textContent = Math.floor(current) + suffix;
        }, 30);
    });
}

const statsObserver = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
        animateCounters();
        statsObserver.disconnect();
    }
}, { threshold: 0.5 });
const statsSection = document.querySelector('.stats-strip');
if (statsSection) statsObserver.observe(statsSection);

// ── Scroll-triggered animations with stagger ──
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.animate-in').forEach((el, i) => {
    // Add stagger delay to grid children
    if (el.closest('.portfolio-grid') || el.closest('.skills-grid')) {
        const siblings = Array.from(el.parentElement.children);
        const index = siblings.indexOf(el);
        el.style.transitionDelay = (index * 0.1) + 's';
    }
    observer.observe(el);
});

// ── Smooth nav active states ──
const sections = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
    const scrollY = window.scrollY + 120;
    sections.forEach(s => {
        const link = document.querySelector(`.nav-links a[href="#${s.id}"]`);
        if (!link) return;
        if (scrollY >= s.offsetTop && scrollY < s.offsetTop + s.offsetHeight) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
});

// ── Mobile Hamburger Menu ──
const hamburger = document.querySelector('.hamburger');
const mobileMenu = document.querySelector('.nav-links');
if (hamburger) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('open');
        mobileMenu.classList.toggle('mobile-open');
    });
    // Close on link click
    mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('open');
            mobileMenu.classList.remove('mobile-open');
        });
    });
}

// ── Parallax hero glow on scroll ──
window.addEventListener('scroll', () => {
    const glow = document.querySelector('.hero-glow');
    if (glow) {
        glow.style.transform = `translate(-50%, calc(-50% + ${window.scrollY * 0.3}px))`;
    }
});

// ── Tilt effect on hero card ──
const heroCard = document.querySelector('.hero-card');
if (heroCard) {
    heroCard.addEventListener('mousemove', e => {
        const rect = heroCard.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        heroCard.style.transform = `perspective(800px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg)`;
    });
    heroCard.addEventListener('mouseleave', () => {
        heroCard.style.transform = 'perspective(800px) rotateY(0) rotateX(0)';
    });
}

// ── Smooth scroll for anchor links ──
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
        const target = document.querySelector(anchor.getAttribute('href'));
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});
