// ── Animated Dot Grid Background ──
const canvas = document.getElementById('grid-canvas');
const ctx = canvas.getContext('2d');
let gridMouseX = 0, gridMouseY = 0;
const dots = [];
const SPACING = 40;

function initGrid() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    dots.length = 0;
    for (let x = 0; x < canvas.width; x += SPACING) {
        for (let y = 0; y < canvas.height; y += SPACING) {
            dots.push({ x, y });
        }
    }
}

function drawGrid() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    dots.forEach(dot => {
        const dx = gridMouseX - dot.x;
        const dy = gridMouseY - dot.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const maxDist = 150;
        const size = dist < maxDist ? 1.5 + (1 - dist / maxDist) * 2 : 1;
        const alpha = dist < maxDist ? 0.15 + (1 - dist / maxDist) * 0.35 : 0.08;

        ctx.beginPath();
        ctx.arc(dot.x, dot.y, size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(249, 115, 22, ${alpha})`;
        ctx.fill();
    });
    requestAnimationFrame(drawGrid);
}

initGrid();
drawGrid();
window.addEventListener('resize', initGrid);

// ── Custom Cursor ──
const cursor = document.querySelector('.cursor');
const cursorOutline = document.querySelector('.cursor-outline');
let mouseX = 0, mouseY = 0, outlineX = 0, outlineY = 0;

document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    gridMouseX = e.clientX;
    gridMouseY = e.clientY;
    cursor.style.transform = `translate(${mouseX - 4}px, ${mouseY - 4}px)`;
});

function animateOutline() {
    outlineX += (mouseX - outlineX) * 0.12;
    outlineY += (mouseY - outlineY) * 0.12;
    cursorOutline.style.transform = `translate(${outlineX - 18}px, ${outlineY - 18}px)`;
    requestAnimationFrame(animateOutline);
}
animateOutline();

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

// ── Magnetic Buttons ──
document.querySelectorAll('.magnetic').forEach(btn => {
    btn.addEventListener('mousemove', e => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
    });
    btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
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
    nav.classList.toggle('nav-scrolled', window.scrollY > 60);
});

// ── Typing Animation ──
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
            }, 30);
        }, i * 500);
    });
}

const heroObserver = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
        setTimeout(typeTerminal, 600);
        heroObserver.disconnect();
    }
}, { threshold: 0.3 });
heroObserver.observe(document.querySelector('.hero'));

// ── Mouse Glow on Cards ──
document.querySelectorAll('.portfolio-card, .skill-card').forEach(card => {
    card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        card.style.setProperty('--glow-x', (e.clientX - rect.left) + 'px');
        card.style.setProperty('--glow-y', (e.clientY - rect.top) + 'px');
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
            if (current >= target) { current = target; clearInterval(timer); }
            el.textContent = Math.floor(current) + suffix;
        }, 30);
    });
}

const statsObserver = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) { animateCounters(); statsObserver.disconnect(); }
}, { threshold: 0.5 });
const statsEl = document.querySelector('.stats-strip');
if (statsEl) statsObserver.observe(statsEl);

// ── Scroll-triggered animations with stagger ──
const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('visible');
    });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.animate-in').forEach(el => {
    if (el.closest('.portfolio-grid') || el.closest('.skills-grid') || el.closest('.stats-grid')) {
        const siblings = Array.from(el.parentElement.children);
        el.style.transitionDelay = (siblings.indexOf(el) * 0.08) + 's';
    }
    observer.observe(el);
});

// ── Nav active states ──
const sections = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
    const scrollY = window.scrollY + 120;
    sections.forEach(s => {
        const link = document.querySelector(`.nav-links a[href="#${s.id}"]`);
        if (!link) return;
        link.classList.toggle('active', scrollY >= s.offsetTop && scrollY < s.offsetTop + s.offsetHeight);
    });
});

// ── Mobile Hamburger ──
const hamburger = document.querySelector('.hamburger');
const mobileMenu = document.querySelector('.nav-links');
if (hamburger) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('open');
        mobileMenu.classList.toggle('mobile-open');
    });
    mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('open');
            mobileMenu.classList.remove('mobile-open');
        });
    });
}

// ── Tilt on hero card ──
const heroCard = document.querySelector('.hero-card');
if (heroCard) {
    heroCard.addEventListener('mousemove', e => {
        const rect = heroCard.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        heroCard.style.transform = `perspective(800px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg)`;
    });
    heroCard.addEventListener('mouseleave', () => {
        heroCard.style.transform = '';
    });
}

// ── Smooth anchor scroll ──
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
        const target = document.querySelector(anchor.getAttribute('href'));
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});
