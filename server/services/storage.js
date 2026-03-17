const { createClient } = require('@libsql/client');
const fs = require('fs');
const path = require('path');
const config = require('../config');

const db = createClient({
    url: config.TURSO_URL,
    authToken: config.TURSO_AUTH_TOKEN,
});

// Initialize schema
async function init() {
    const schema = fs.readFileSync(path.join(__dirname, '..', 'db', 'schema.sql'), 'utf8');
    await db.execute(schema);
}

init().catch(err => {
    console.error('Failed to initialize database:', err.message);
    process.exit(1);
});

module.exports = {
    async getAllBillings({ status, search } = {}) {
        let sql = 'SELECT * FROM billings WHERE 1=1';
        const args = [];

        if (status && status !== 'all') {
            sql += ' AND status = ?';
            args.push(status);
        }
        if (search) {
            sql += ' AND (client LIKE ? OR project LIKE ?)';
            args.push(`%${search}%`, `%${search}%`);
        }

        sql += ' ORDER BY date DESC, created_at DESC';
        const result = await db.execute({ sql, args });
        return result.rows;
    },

    async getBillingById(id) {
        const result = await db.execute({ sql: 'SELECT * FROM billings WHERE id = ?', args: [id] });
        return result.rows[0] || null;
    },

    async createBilling(entry) {
        const id = entry.id || Date.now().toString();
        await db.execute({
            sql: `INSERT INTO billings (id, client, project, amount, paid_amount, currency, status, date, notes, source, platform)
                  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            args: [id, entry.client, entry.project, entry.amount, entry.paid_amount || 0, entry.currency || 'INR', entry.status, entry.date, entry.notes || '', entry.source || 'manual', entry.platform || '']
        });
        return this.getBillingById(id);
    },

    async updateBilling(id, entry) {
        await db.execute({
            sql: `UPDATE billings SET client=?, project=?, amount=?, paid_amount=?, currency=?, status=?, date=?, notes=?, updated_at=datetime('now')
                  WHERE id=?`,
            args: [entry.client, entry.project, entry.amount, entry.paid_amount || 0, entry.currency || 'INR', entry.status, entry.date, entry.notes || '', id]
        });
        return this.getBillingById(id);
    },

    async deleteBilling(id) {
        await db.execute({ sql: 'DELETE FROM billings WHERE id = ?', args: [id] });
    },

    async bulkInsert(entries) {
        let imported = 0;
        const batch = entries.map(e => {
            const id = e.id || `${e.platform || 'import'}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
            return {
                sql: `INSERT OR IGNORE INTO billings (id, client, project, amount, paid_amount, currency, status, date, notes, source, platform)
                      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                args: [id, e.client, e.project, e.amount, e.paid_amount || 0, e.currency || 'USD', e.status || 'paid', e.date, e.notes || '', e.source || 'csv', e.platform || '']
            };
        });

        const results = await db.batch(batch, 'write');
        for (const r of results) {
            if (r.rowsAffected > 0) imported++;
        }

        return { imported, total: entries.length, skipped: entries.length - imported };
    },

    async getSummary() {
        const result = await db.execute(`
            SELECT
                COALESCE(SUM(amount), 0) as total,
                COALESCE(SUM(paid_amount), 0) as total_paid_amount,
                COALESCE(SUM(CASE WHEN status='paid' THEN amount ELSE 0 END), 0) as paid,
                COALESCE(SUM(CASE WHEN status='pending' THEN amount ELSE 0 END), 0) as pending,
                COALESCE(SUM(CASE WHEN status='overdue' THEN amount ELSE 0 END), 0) as overdue,
                COALESCE(SUM(CASE WHEN status='partial' THEN amount ELSE 0 END), 0) as partial,
                COALESCE(SUM(CASE WHEN status='partial' THEN paid_amount ELSE 0 END), 0) as partial_paid,
                COUNT(*) as count
            FROM billings
        `);
        return result.rows[0];
    },
};
