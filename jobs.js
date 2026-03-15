// ── User Profile Skills ──

const userSkills = [
    'React', 'JavaScript', 'Node.js', 'Shopify', 'Shopify Plus', 'Webflow',
    'HTML5', 'CSS3', 'SCSS', 'Tailwind', 'Bootstrap', 'jQuery', 'Express.js',
    'REST APIs', 'GSAP', 'Motion JS', 'Figma', 'Git', 'Responsive Design',
    'Liquid', 'Next.js'
];

// ── Mock Job Listings ──

// ── Platform Helpers ──

const platforms = {
    upwork: { name: 'Upwork', color: 'bg-green-500/10 text-green-600 dark:text-green-400', searchUrl: 'https://www.upwork.com/nx/search/jobs/?q=' },
    linkedin: { name: 'LinkedIn', color: 'bg-blue-600/10 text-blue-600 dark:text-blue-400', searchUrl: 'https://www.linkedin.com/jobs/search/?keywords=' },
    freelancer: { name: 'Freelancer', color: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400', searchUrl: 'https://www.freelancer.com/jobs/?keyword=' },
    toptal: { name: 'Toptal', color: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400', searchUrl: 'https://www.toptal.com/freelance-jobs/' },
    weworkremotely: { name: 'We Work Remotely', color: 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400', searchUrl: 'https://weworkremotely.com/remote-jobs/search?term=' },
    remoteok: { name: 'RemoteOK', color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400', searchUrl: 'https://remoteok.com/remote-' },
    indeed: { name: 'Indeed', color: 'bg-purple-500/10 text-purple-600 dark:text-purple-400', searchUrl: 'https://www.indeed.com/jobs?q=' },
    fiverr: { name: 'Fiverr', color: 'bg-teal-500/10 text-teal-600 dark:text-teal-400', searchUrl: 'https://www.fiverr.com/search/gigs?query=' }
};

function getApplyUrl(job) {
    const p = platforms[job.platform];
    if (!p) return '#';
    const query = encodeURIComponent(job.title);
    if (job.platform === 'remoteok') return p.searchUrl + query.toLowerCase().replace(/%20/g, '-') + '-jobs';
    if (job.platform === 'toptal') return p.searchUrl + query.toLowerCase().replace(/%20/g, '-');
    return p.searchUrl + query;
}

const jobs = [
    {
        id: 1, company: 'Stripe', title: 'Senior Frontend Engineer',
        category: 'frontend', type: 'remote', location: 'Remote (Global)',
        budget: '$70–90/hr', budgetValue: 80, budgetType: 'hourly',
        skills: ['React', 'JavaScript', 'Tailwind', 'REST APIs', 'Git'],
        description: 'Build and maintain payment UI components for Stripe Dashboard. Work with design systems and component libraries.',
        posted: '2 hours ago', postedOrder: 1, urgent: false,
        platform: 'linkedin'
    },
    {
        id: 2, company: 'Allbirds', title: 'Shopify Plus Theme Developer',
        category: 'shopify', type: 'contract', location: 'Remote (US/India)',
        budget: '$6,000–9,000', budgetValue: 7500, budgetType: 'fixed',
        skills: ['Shopify', 'Shopify Plus', 'Liquid', 'JavaScript', 'CSS3'],
        description: 'Custom Shopify Plus theme development for a major DTC brand. Must have experience with Liquid templating and storefront optimization.',
        posted: '5 hours ago', postedOrder: 2, urgent: true,
        platform: 'upwork'
    },
    {
        id: 3, company: 'Webflow Agency', title: 'Webflow Designer & Developer',
        category: 'webflow', type: 'remote', location: 'Remote (Worldwide)',
        budget: '$45–65/hr', budgetValue: 55, budgetType: 'hourly',
        skills: ['Webflow', 'CSS3', 'JavaScript', 'Figma', 'Responsive Design'],
        description: 'Design and develop pixel-perfect Webflow sites from Figma mockups. Strong eye for animation and micro-interactions.',
        posted: '1 day ago', postedOrder: 3, urgent: false,
        platform: 'freelancer'
    },
    {
        id: 4, company: 'TechCrunch', title: 'React + Tailwind UI Developer',
        category: 'frontend', type: 'contract', location: 'Remote',
        budget: '$5,000–7,500', budgetValue: 6250, budgetType: 'fixed',
        skills: ['React', 'Tailwind', 'JavaScript', 'REST APIs', 'Responsive Design'],
        description: 'Build a new editorial dashboard with React and Tailwind CSS. Must deliver pixel-perfect responsive layouts.',
        posted: '1 day ago', postedOrder: 4, urgent: false,
        platform: 'upwork'
    },
    {
        id: 5, company: 'Gymshark', title: 'Shopify Storefront Developer',
        category: 'shopify', type: 'contract', location: 'Hybrid — London/Remote',
        budget: '$8,000–12,000', budgetValue: 10000, budgetType: 'fixed',
        skills: ['Shopify Plus', 'Liquid', 'JavaScript', 'CSS3', 'REST APIs'],
        description: 'Optimize and develop new features for a high-traffic Shopify Plus storefront. Performance-focused role.',
        posted: '2 days ago', postedOrder: 5, urgent: true,
        platform: 'toptal'
    },
    {
        id: 6, company: 'Framer Studio', title: 'Motion & Animation Developer',
        category: 'frontend', type: 'remote', location: 'Remote (Global)',
        budget: '$55–75/hr', budgetValue: 65, budgetType: 'hourly',
        skills: ['GSAP', 'Motion JS', 'JavaScript', 'CSS3', 'React'],
        description: 'Create stunning web animations and transitions using GSAP and Motion JS. Work on marketing sites and product pages.',
        posted: '2 days ago', postedOrder: 6, urgent: false,
        platform: 'weworkremotely'
    },
    {
        id: 7, company: 'Notion', title: 'Full-Stack Engineer (React + Node)',
        category: 'fullstack', type: 'fulltime', location: 'San Francisco / Remote',
        budget: '$120,000–160,000/yr', budgetValue: 140000, budgetType: 'salary',
        skills: ['React', 'Node.js', 'Express.js', 'JavaScript', 'REST APIs', 'Git'],
        description: 'Join the Notion team to build collaborative productivity features. Strong React and Node.js skills required.',
        posted: '3 days ago', postedOrder: 7, urgent: false,
        platform: 'linkedin'
    },
    {
        id: 8, company: 'Figma', title: 'Design Systems Frontend Engineer',
        category: 'frontend', type: 'remote', location: 'Remote (US/Europe)',
        budget: '$80–100/hr', budgetValue: 90, budgetType: 'hourly',
        skills: ['React', 'JavaScript', 'CSS3', 'Figma', 'Tailwind', 'Git'],
        description: 'Build and maintain design system components. Bridge the gap between design and engineering teams.',
        posted: '3 days ago', postedOrder: 8, urgent: false,
        platform: 'remoteok'
    },
    {
        id: 9, company: 'Glossier', title: 'E-Commerce UI Developer',
        category: 'shopify', type: 'contract', location: 'Remote (US)',
        budget: '$4,500–6,500', budgetValue: 5500, budgetType: 'fixed',
        skills: ['Shopify', 'JavaScript', 'CSS3', 'HTML5', 'jQuery', 'Responsive Design'],
        description: 'Develop custom UI components for a beauty e-commerce brand on Shopify. Focus on mobile-first responsive design.',
        posted: '3 days ago', postedOrder: 9, urgent: false,
        platform: 'upwork'
    },
    {
        id: 10, company: 'Vercel', title: 'Next.js Frontend Developer',
        category: 'frontend', type: 'remote', location: 'Remote (Global)',
        budget: '$65–85/hr', budgetValue: 75, budgetType: 'hourly',
        skills: ['React', 'Next.js', 'JavaScript', 'Tailwind', 'REST APIs', 'Git'],
        description: 'Work on Vercel marketing site and documentation. Deep Next.js and React knowledge required.',
        posted: '4 days ago', postedOrder: 10, urgent: false,
        platform: 'weworkremotely'
    },
    {
        id: 11, company: 'Toptal Client', title: 'Webflow + GSAP Marketing Site',
        category: 'webflow', type: 'contract', location: 'Remote',
        budget: '$3,500–5,000', budgetValue: 4250, budgetType: 'fixed',
        skills: ['Webflow', 'GSAP', 'CSS3', 'JavaScript', 'Figma'],
        description: 'Build an animated marketing site in Webflow with custom GSAP interactions. Figma designs provided.',
        posted: '4 days ago', postedOrder: 11, urgent: false,
        platform: 'toptal'
    },
    {
        id: 12, company: 'Shopify', title: 'Theme Developer (Partner Program)',
        category: 'shopify', type: 'remote', location: 'Remote (Worldwide)',
        budget: '$50–70/hr', budgetValue: 60, budgetType: 'hourly',
        skills: ['Shopify', 'Shopify Plus', 'Liquid', 'JavaScript', 'CSS3', 'HTML5'],
        description: 'Join as a Shopify Partner to build custom themes for the Shopify Theme Store. Must have Shopify Plus experience.',
        posted: '5 days ago', postedOrder: 12, urgent: false,
        platform: 'indeed'
    },
    {
        id: 13, company: 'Linear', title: 'UI/UX Frontend Implement',
        category: 'uiux', type: 'remote', location: 'Remote',
        budget: '$70–90/hr', budgetValue: 80, budgetType: 'hourly',
        skills: ['React', 'CSS3', 'Tailwind', 'Figma', 'JavaScript', 'GSAP'],
        description: 'Implement pixel-perfect UI from Figma designs with smooth animations. Attention to detail is critical.',
        posted: '5 days ago', postedOrder: 13, urgent: false,
        platform: 'linkedin'
    },
    {
        id: 14, company: 'Startup (Stealth)', title: 'Full-Stack MVP Developer',
        category: 'fullstack', type: 'contract', location: 'Remote',
        budget: '$10,000–15,000', budgetValue: 12500, budgetType: 'fixed',
        skills: ['React', 'Node.js', 'Express.js', 'REST APIs', 'Tailwind', 'Git'],
        description: 'Build an MVP for a stealth-mode startup. React frontend + Node/Express backend. 6-week timeline.',
        posted: '5 days ago', postedOrder: 14, urgent: true,
        platform: 'freelancer'
    },
    {
        id: 15, company: 'Dribbble', title: 'Creative Frontend Developer',
        category: 'frontend', type: 'remote', location: 'Remote (Global)',
        budget: '$55–75/hr', budgetValue: 65, budgetType: 'hourly',
        skills: ['React', 'GSAP', 'CSS3', 'JavaScript', 'Figma', 'Motion JS'],
        description: 'Build creative, award-worthy web experiences. Strong animation skills with GSAP/Motion JS required.',
        posted: '6 days ago', postedOrder: 15, urgent: false,
        platform: 'remoteok'
    },
    {
        id: 16, company: 'MVMT Watches', title: 'Shopify Theme Customization',
        category: 'shopify', type: 'contract', location: 'Remote',
        budget: '$2,500–4,000', budgetValue: 3250, budgetType: 'fixed',
        skills: ['Shopify', 'Liquid', 'CSS3', 'JavaScript', 'jQuery'],
        description: 'Customize an existing Shopify theme with new sections, product filtering, and mobile UX improvements.',
        posted: '1 week ago', postedOrder: 16, urgent: false,
        platform: 'fiverr'
    },
    {
        id: 17, company: 'Webflow Inc', title: 'Webflow Enterprise Developer',
        category: 'webflow', type: 'fulltime', location: 'San Francisco / Remote',
        budget: '$100,000–140,000/yr', budgetValue: 120000, budgetType: 'salary',
        skills: ['Webflow', 'JavaScript', 'CSS3', 'HTML5', 'Figma', 'REST APIs'],
        description: 'Help enterprise clients build and scale their Webflow sites. Deep platform knowledge required.',
        posted: '1 week ago', postedOrder: 17, urgent: false,
        platform: 'linkedin'
    },
    {
        id: 18, company: 'Agency Partner', title: 'React Dashboard for SaaS',
        category: 'frontend', type: 'contract', location: 'Remote (India preferred)',
        budget: '$4,000–6,000', budgetValue: 5000, budgetType: 'fixed',
        skills: ['React', 'Tailwind', 'JavaScript', 'REST APIs', 'Responsive Design'],
        description: 'Build an analytics dashboard for a SaaS product. Charts, data tables, and responsive layout required.',
        posted: '1 week ago', postedOrder: 18, urgent: false,
        platform: 'upwork'
    },
    {
        id: 19, company: 'Loom', title: 'UI Engineer (Design to Code)',
        category: 'uiux', type: 'remote', location: 'Remote (US/India)',
        budget: '$60–80/hr', budgetValue: 70, budgetType: 'hourly',
        skills: ['React', 'CSS3', 'Figma', 'JavaScript', 'Tailwind', 'Responsive Design'],
        description: 'Convert Figma designs into production-ready React components. Must match designs pixel-for-pixel.',
        posted: '1 week ago', postedOrder: 19, urgent: false,
        platform: 'indeed'
    },
    {
        id: 20, company: 'Headless Commerce Co', title: 'Headless Shopify + React',
        category: 'shopify', type: 'contract', location: 'Remote',
        budget: '$8,000–12,000', budgetValue: 10000, budgetType: 'fixed',
        skills: ['React', 'Shopify', 'Shopify Plus', 'Node.js', 'REST APIs', 'Tailwind'],
        description: 'Build a headless commerce storefront with React frontend and Shopify Plus backend via Storefront API.',
        posted: '1 week ago', postedOrder: 20, urgent: false,
        platform: 'freelancer'
    }
];

// ── State ──

let savedJobs = JSON.parse(localStorage.getItem('savedJobs') || '[]');
let currentView = 'all';
let viewMode = 'grid';

// ── Theme ──

function toggleTheme() {
    document.documentElement.classList.toggle('dark');
    localStorage.setItem('jobs-theme', document.documentElement.classList.contains('dark') ? 'dark' : 'light');
}

(function initTheme() {
    const saved = localStorage.getItem('jobs-theme');
    if (saved === 'light') document.documentElement.classList.remove('dark');
})();

// ── Sidebar ──

function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    sidebar.classList.toggle('-translate-x-full');
    overlay.classList.toggle('hidden');
}

document.querySelectorAll('.sidebar-link[data-view]').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        document.querySelectorAll('.sidebar-link[data-view]').forEach(l => {
            l.classList.remove('active');
            l.classList.add('text-gray-600', 'dark:text-gray-400');
        });
        link.classList.add('active');
        link.classList.remove('text-gray-600', 'dark:text-gray-400');
        currentView = link.dataset.view;
        applyFilters();
        if (window.innerWidth < 1024) toggleSidebar();
    });
});

// ── Skill Matching ──

function getMatchPercent(jobSkills) {
    const matched = jobSkills.filter(s => userSkills.includes(s));
    return Math.round((matched.length / jobSkills.length) * 100);
}

// ── Filtering & Sorting ──

function applyFilters() {
    const category = document.getElementById('filter-category').value;
    const type = document.getElementById('filter-type').value;
    const budget = document.getElementById('filter-budget').value;
    const platform = document.getElementById('filter-platform').value;
    const sort = document.getElementById('sort-by').value;
    const search = document.getElementById('search-input').value.toLowerCase();

    let filtered = [...jobs];

    // View filter
    if (currentView === 'saved') {
        filtered = filtered.filter(j => savedJobs.includes(j.id));
    }

    // Category
    if (category !== 'all') filtered = filtered.filter(j => j.category === category);

    // Type
    if (type !== 'all') {
        if (type === 'fulltime') filtered = filtered.filter(j => j.type === 'fulltime');
        else filtered = filtered.filter(j => j.type === type);
    }

    // Budget
    if (budget !== 'all') {
        if (budget === 'hourly') filtered = filtered.filter(j => j.budgetType === 'hourly');
        else if (budget === 'low') filtered = filtered.filter(j => j.budgetType === 'fixed' && j.budgetValue < 3000);
        else if (budget === 'mid') filtered = filtered.filter(j => j.budgetType === 'fixed' && j.budgetValue >= 3000 && j.budgetValue <= 8000);
        else if (budget === 'high') filtered = filtered.filter(j => j.budgetType === 'fixed' && j.budgetValue > 8000);
    }

    // Platform
    if (platform !== 'all') filtered = filtered.filter(j => j.platform === platform);

    // Search
    if (search) {
        filtered = filtered.filter(j =>
            j.title.toLowerCase().includes(search) ||
            j.company.toLowerCase().includes(search) ||
            j.skills.some(s => s.toLowerCase().includes(search)) ||
            j.description.toLowerCase().includes(search)
        );
    }

    // Sort
    if (sort === 'match') {
        filtered.sort((a, b) => getMatchPercent(b.skills) - getMatchPercent(a.skills));
    } else if (sort === 'newest') {
        filtered.sort((a, b) => a.postedOrder - b.postedOrder);
    } else if (sort === 'budget-high') {
        filtered.sort((a, b) => b.budgetValue - a.budgetValue);
    } else if (sort === 'budget-low') {
        filtered.sort((a, b) => a.budgetValue - b.budgetValue);
    }

    renderJobs(filtered);
}

// ── Render ──

function renderProfileSkills() {
    const container = document.getElementById('profile-skills');
    container.innerHTML = userSkills.slice(0, 10).map(s =>
        `<span class="px-2.5 py-1 rounded-full text-xs font-medium bg-accent/10 text-accent">${s}</span>`
    ).join('');
}

function renderJobs(filteredJobs) {
    const grid = document.getElementById('jobs-grid');
    const empty = document.getElementById('empty-state');

    document.getElementById('match-count').textContent = filteredJobs.length;
    document.getElementById('results-info').textContent = `Showing ${filteredJobs.length} job${filteredJobs.length !== 1 ? 's' : ''}`;
    document.getElementById('saved-count').textContent = savedJobs.length;

    if (filteredJobs.length === 0) {
        grid.classList.add('hidden');
        empty.classList.remove('hidden');
        return;
    }

    grid.classList.remove('hidden');
    empty.classList.add('hidden');

    if (viewMode === 'list') {
        grid.className = 'grid grid-cols-1 gap-3 animate-fade-up stagger-3';
    } else {
        grid.className = 'grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-up stagger-3';
    }

    grid.innerHTML = filteredJobs.map(job => {
        const match = getMatchPercent(job.skills);
        const isSaved = savedJobs.includes(job.id);
        const typeBadge = {
            remote: 'bg-blue-500/10 text-blue-500',
            hybrid: 'bg-purple-500/10 text-purple-500',
            contract: 'bg-amber-500/10 text-amber-500',
            fulltime: 'bg-emerald-500/10 text-emerald-500'
        }[job.type] || 'bg-gray-500/10 text-gray-500';
        const typeLabel = { remote: 'Remote', hybrid: 'Hybrid', contract: 'Contract', fulltime: 'Full-time' }[job.type];

        return `
        <div class="bg-white dark:bg-surface-900 border border-gray-200 dark:border-surface-700 rounded-xl p-5 hover:border-accent/30 transition-all group ${job.urgent ? 'ring-1 ring-accent/20' : ''}">
            <!-- Header -->
            <div class="flex items-start justify-between mb-3">
                <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-xl bg-gray-100 dark:bg-surface-800 flex items-center justify-center text-sm font-display font-bold text-gray-500 dark:text-gray-400">${job.company.charAt(0)}</div>
                    <div>
                        <div class="text-sm font-semibold text-gray-500 dark:text-gray-400">${job.company}</div>
                        <h3 class="font-display font-bold text-base leading-tight">${job.title}</h3>
                    </div>
                </div>
                <div class="flex items-center gap-2">
                    ${job.urgent ? '<span class="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-danger/10 text-danger">Urgent</span>' : ''}
                    <!-- Match Ring -->
                    <div class="relative w-10 h-10 flex items-center justify-center">
                        <div class="match-ring absolute inset-0 rounded-full" style="--match: ${match}"></div>
                        <div class="absolute inset-[3px] rounded-full bg-white dark:bg-surface-900"></div>
                        <span class="relative text-[10px] font-bold ${match >= 80 ? 'text-accent' : match >= 50 ? 'text-gray-600 dark:text-gray-300' : 'text-gray-400'}">${match}%</span>
                    </div>
                </div>
            </div>

            <!-- Platform Badge -->
            <div class="mb-3">
                <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wide ${platforms[job.platform].color}">
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
                    ${platforms[job.platform].name}
                </span>
            </div>

            <!-- Description -->
            <p class="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-3 line-clamp-2">${job.description}</p>

            <!-- Skills -->
            <div class="flex flex-wrap gap-1.5 mb-4">
                ${job.skills.map(s => {
                    const isMatch = userSkills.includes(s);
                    return `<span class="px-2 py-0.5 rounded-md text-xs font-medium ${isMatch ? 'bg-success/10 text-success' : 'bg-gray-100 dark:bg-surface-800 text-gray-500 dark:text-gray-400'}">${s}</span>`;
                }).join('')}
            </div>

            <!-- Meta -->
            <div class="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-400 mb-4">
                <span class="flex items-center gap-1">
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                    ${job.location}
                </span>
                <span class="flex items-center gap-1">
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                    ${job.posted}
                </span>
            </div>

            <!-- Footer -->
            <div class="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-surface-700">
                <div class="flex items-center gap-3">
                    <span class="font-display font-bold text-sm">${job.budget}</span>
                    <span class="px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase ${typeBadge}">${typeLabel}</span>
                </div>
                <div class="flex items-center gap-2">
                    <button onclick="toggleSave(${job.id})" class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-surface-800 transition-colors" title="${isSaved ? 'Unsave' : 'Save'} job">
                        <svg class="w-4 h-4 ${isSaved ? 'text-accent fill-accent' : 'text-gray-400'}" fill="${isSaved ? 'currentColor' : 'none'}" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/></svg>
                    </button>
                    <a href="${getApplyUrl(job)}" target="_blank" rel="noopener noreferrer" class="px-4 py-2 text-xs font-semibold rounded-lg bg-accent text-white hover:bg-accent-light transition-colors">Apply on ${platforms[job.platform].name}</a>
                </div>
            </div>
        </div>`;
    }).join('');
}

// ── Bookmark ──

function toggleSave(jobId) {
    if (savedJobs.includes(jobId)) {
        savedJobs = savedJobs.filter(id => id !== jobId);
    } else {
        savedJobs.push(jobId);
    }
    localStorage.setItem('savedJobs', JSON.stringify(savedJobs));
    applyFilters();
}

// ── View Toggle ──

function setView(mode) {
    viewMode = mode;
    document.getElementById('view-grid').className = `p-2 rounded-lg transition-colors ${mode === 'grid' ? 'bg-accent/10 text-accent' : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-surface-800'}`;
    document.getElementById('view-list').className = `p-2 rounded-lg transition-colors ${mode === 'list' ? 'bg-accent/10 text-accent' : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-surface-800'}`;
    applyFilters();
}

// ── Init ──

document.addEventListener('DOMContentLoaded', () => {
    renderProfileSkills();
    applyFilters();
});
