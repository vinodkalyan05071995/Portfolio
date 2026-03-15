// ── Auth ──
const TOKEN_KEY = 'vk-dash-token';

function getToken() { return sessionStorage.getItem(TOKEN_KEY); }

function authHeaders() {
    return { 'Authorization': 'Bearer ' + getToken(), 'Content-Type': 'application/json' };
}

async function handleLogin(e) {
    e.preventDefault();
    const pw = document.getElementById('login-password').value;
    try {
        const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password: pw }),
        });
        if (!res.ok) throw new Error();
        const { token } = await res.json();
        sessionStorage.setItem(TOKEN_KEY, token);
        showDashboard();
    } catch {
        document.getElementById('login-error').classList.remove('hidden');
        document.getElementById('login-password').value = '';
        document.getElementById('login-password').focus();
    }
}

function handleLogout() {
    sessionStorage.removeItem(TOKEN_KEY);
    location.reload();
}

function showDashboard() {
    document.getElementById('login-screen').classList.add('hidden');
    document.getElementById('dashboard-main').classList.remove('hidden');
    renderAll();
}

// ── Theme ──
function toggleTheme() {
    document.documentElement.classList.toggle('dark');
    localStorage.setItem('dashboard-theme', document.documentElement.classList.contains('dark') ? 'dark' : 'light');
}
(function() {
    if (localStorage.getItem('dashboard-theme') === 'light') document.documentElement.classList.remove('dark');
})();

// ── Sidebar ──
function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('-translate-x-full');
    document.getElementById('sidebar-overlay').classList.toggle('hidden');
}

document.querySelectorAll('.sidebar-link[data-section]').forEach(link => {
    link.addEventListener('click', e => {
        e.preventDefault();
        document.querySelectorAll('.sidebar-link').forEach(l => { l.classList.remove('active'); l.classList.add('text-gray-600', 'dark:text-gray-400'); });
        link.classList.add('active');
        link.classList.remove('text-gray-600', 'dark:text-gray-400');
        const target = document.getElementById(link.dataset.section);
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        if (window.innerWidth < 1024) toggleSidebar();
    });
});

// ── Helpers ──
function esc(str) { const d = document.createElement('div'); d.textContent = str; return d.innerHTML; }

function curr(amount, currency) {
    const sym = currency === 'USD' ? '$' : '₹';
    return sym + Number(amount).toLocaleString('en-IN');
}

function statusBadge(status) {
    const s = { paid:'bg-emerald-500/10 text-emerald-500', pending:'bg-amber-500/10 text-amber-500', overdue:'bg-red-500/10 text-red-500', partial:'bg-blue-500/10 text-blue-500' };
    return `<span class="px-2.5 py-1 rounded-full text-xs font-semibold ${s[status] || s.pending}">${status.charAt(0).toUpperCase() + status.slice(1)}</span>`;
}

function sourceBadge(source, platform) {
    if (!source || source === 'manual') return '<span class="text-xs text-gray-400">Manual</span>';
    const label = platform ? platform.charAt(0).toUpperCase() + platform.slice(1) : 'Import';
    return `<span class="px-2 py-0.5 rounded text-xs bg-accent/10 text-accent font-medium">${label}</span>`;
}

// ── API calls ──
async function apiFetch(url, opts = {}) {
    const res = await fetch(url, { ...opts, headers: { ...authHeaders(), ...opts.headers } });
    if (res.status === 401) { handleLogout(); return null; }
    return res.json();
}

// ── Modal ──
async function openModal(id) {
    const form = document.getElementById('billing-form');
    form.reset();
    document.getElementById('edit-id').value = '';
    document.getElementById('f-paid-amount').value = '0';
    document.getElementById('modal-title').textContent = 'New Billing';

    if (id) {
        const b = await apiFetch('/api/billings/' + id);
        if (b) {
            document.getElementById('modal-title').textContent = 'Edit Billing';
            document.getElementById('edit-id').value = id;
            document.getElementById('f-client').value = b.client;
            document.getElementById('f-project').value = b.project;
            document.getElementById('f-amount').value = b.amount;
            document.getElementById('f-paid-amount').value = b.paid_amount || 0;
            document.getElementById('f-currency').value = b.currency || 'INR';
            document.getElementById('f-status').value = b.status;
            document.getElementById('f-date').value = b.date;
            document.getElementById('f-notes').value = b.notes || '';
        }
    }
    document.getElementById('billing-modal').classList.remove('hidden');
}

function closeModal() { document.getElementById('billing-modal').classList.add('hidden'); }

async function saveBilling(e) {
    e.preventDefault();
    const editId = document.getElementById('edit-id').value;
    const body = {
        client: document.getElementById('f-client').value.trim(),
        project: document.getElementById('f-project').value.trim(),
        amount: parseFloat(document.getElementById('f-amount').value),
        paid_amount: parseFloat(document.getElementById('f-paid-amount').value) || 0,
        currency: document.getElementById('f-currency').value,
        status: document.getElementById('f-status').value,
        date: document.getElementById('f-date').value,
        notes: document.getElementById('f-notes').value.trim(),
    };

    if (editId) {
        await apiFetch('/api/billings/' + editId, { method: 'PUT', body: JSON.stringify(body) });
    } else {
        await apiFetch('/api/billings', { method: 'POST', body: JSON.stringify(body) });
    }
    closeModal();
    renderAll();
}

// ── Delete ──
let deleteTargetId = null;
function askDelete(id) { deleteTargetId = id; document.getElementById('delete-modal').classList.remove('hidden'); }
function closeDeleteModal() { document.getElementById('delete-modal').classList.add('hidden'); deleteTargetId = null; }
async function confirmDelete() {
    if (!deleteTargetId) return;
    await apiFetch('/api/billings/' + deleteTargetId, { method: 'DELETE' });
    closeDeleteModal();
    renderAll();
}

// ── Import ──
function openImportModal() { document.getElementById('import-modal').classList.remove('hidden'); document.getElementById('import-result').classList.add('hidden'); }
function closeImportModal() { document.getElementById('import-modal').classList.add('hidden'); }

async function handleImport(e) {
    e.preventDefault();
    const file = document.getElementById('import-file').files[0];
    if (!file) return;

    const platform = document.getElementById('import-platform').value;
    const formData = new FormData();
    formData.append('file', file);

    const btn = document.getElementById('import-btn');
    btn.textContent = 'Importing...';
    btn.disabled = true;

    try {
        const res = await fetch(`/api/import/csv?platform=${platform}`, {
            method: 'POST',
            headers: { 'Authorization': 'Bearer ' + getToken() },
            body: formData,
        });
        const data = await res.json();
        const resultEl = document.getElementById('import-result');
        resultEl.classList.remove('hidden');

        if (data.imported > 0) {
            resultEl.className = 'text-sm p-3 rounded-lg bg-success/10 text-success';
            resultEl.textContent = `Imported ${data.imported} entries. ${data.skipped} skipped, ${data.errors} errors.`;
            renderAll();
        } else {
            resultEl.className = 'text-sm p-3 rounded-lg bg-warning/10 text-warning';
            resultEl.textContent = data.message || 'No entries imported. Check CSV format.';
        }
    } catch (err) {
        const resultEl = document.getElementById('import-result');
        resultEl.classList.remove('hidden');
        resultEl.className = 'text-sm p-3 rounded-lg bg-danger/10 text-danger';
        resultEl.textContent = 'Import failed. Check file format.';
    }

    btn.textContent = 'Import';
    btn.disabled = false;
}

// ── Rendering ──
async function renderAll() {
    const status = document.getElementById('status-filter')?.value || 'all';
    const search = document.getElementById('global-search')?.value || '';

    const [billings, summary] = await Promise.all([
        apiFetch(`/api/billings?status=${status}&search=${encodeURIComponent(search)}`),
        apiFetch('/api/billings/summary'),
    ]);

    if (!billings || !summary) return;

    // Summary
    document.getElementById('total-billed').textContent = '₹' + Number(summary.total).toLocaleString('en-IN');
    document.getElementById('total-received').textContent = '₹' + Number(summary.paid + summary.total_paid_amount).toLocaleString('en-IN');
    document.getElementById('total-pending').textContent = '₹' + Number(summary.pending + summary.partial).toLocaleString('en-IN');
    document.getElementById('total-overdue').textContent = '₹' + Number(summary.overdue).toLocaleString('en-IN');

    // Table
    const tbody = document.getElementById('billing-body');
    const empty = document.getElementById('empty-state');

    if (billings.length === 0) {
        tbody.innerHTML = '';
        empty.classList.remove('hidden');
    } else {
        empty.classList.add('hidden');
        tbody.innerHTML = billings.map(b => `
            <tr class="hover:bg-gray-50 dark:hover:bg-surface-800/50 transition-colors">
                <td class="px-5 py-3.5 font-medium">${esc(b.client)}</td>
                <td class="px-5 py-3.5 text-gray-600 dark:text-gray-400">${esc(b.project)}</td>
                <td class="px-5 py-3.5 font-semibold">${curr(b.amount, b.currency)}</td>
                <td class="px-5 py-3.5 ${b.paid_amount > 0 ? 'text-success font-medium' : 'text-gray-400'}">${b.paid_amount > 0 ? curr(b.paid_amount, b.currency) : '—'}</td>
                <td class="px-5 py-3.5">${statusBadge(b.status)}</td>
                <td class="px-5 py-3.5 text-gray-500 font-mono text-xs">${new Date(b.date).toLocaleDateString('en-US', { month:'short', day:'numeric', year:'numeric' })}</td>
                <td class="px-5 py-3.5">${sourceBadge(b.source, b.platform)}</td>
                <td class="px-5 py-3.5">
                    <div class="flex gap-1">
                        <button onclick="openModal('${b.id}')" class="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-surface-800 text-gray-400 hover:text-accent" title="Edit">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                        </button>
                        <button onclick="askDelete('${b.id}')" class="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-surface-800 text-gray-400 hover:text-danger" title="Delete">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    // Pending cards
    const pendingBillings = billings.filter(b => b.status === 'pending' || b.status === 'overdue' || b.status === 'partial');
    const container = document.getElementById('pending-cards');
    const noPending = document.getElementById('no-pending');
    document.getElementById('pending-count').textContent = pendingBillings.length;

    if (pendingBillings.length === 0) {
        container.innerHTML = '';
        noPending.classList.remove('hidden');
    } else {
        noPending.classList.add('hidden');
        container.innerHTML = pendingBillings.map(b => {
            const isOverdue = b.status === 'overdue';
            const border = isOverdue ? 'border-red-500/30' : 'border-gray-200 dark:border-surface-700';
            const bg = isOverdue ? 'bg-red-500/5' : 'bg-white dark:bg-surface-900';
            const balance = b.amount - (b.paid_amount || 0);

            return `
            <div class="${bg} border ${border} rounded-xl p-5 hover:border-accent/30 transition-colors">
                <div class="flex items-start justify-between mb-2">
                    <div>
                        <h3 class="font-semibold">${esc(b.client)}</h3>
                        <p class="text-xs text-gray-500">${esc(b.project)}</p>
                    </div>
                    ${statusBadge(b.status)}
                </div>
                <div class="flex items-end justify-between mt-3">
                    <div>
                        <div class="text-xl font-display font-bold">${curr(b.amount, b.currency)}</div>
                        ${b.paid_amount > 0 ? `<div class="text-xs text-success mt-1">Paid: ${curr(b.paid_amount, b.currency)} &middot; Balance: ${curr(balance, b.currency)}</div>` : ''}
                    </div>
                    <span class="text-xs text-gray-400 font-mono">${new Date(b.date).toLocaleDateString('en-US', { month:'short', day:'numeric' })}</span>
                </div>
                ${b.notes ? `<p class="text-xs text-gray-400 mt-2">${esc(b.notes)}</p>` : ''}
                ${isOverdue ? '<div class="mt-2 text-xs text-red-400 flex items-center gap-1"><svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01"/></svg> Overdue — follow up required</div>' : ''}
            </div>`;
        }).join('');
    }
}

// ── Init ──
document.addEventListener('DOMContentLoaded', () => {
    if (getToken()) showDashboard();
});
