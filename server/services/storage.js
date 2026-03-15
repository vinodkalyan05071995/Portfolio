const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');
const config = require('../config');

const dbDir = path.dirname(config.DB_PATH);
if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir, { recursive: true });

const db = new Database(config.DB_PATH);
db.pragma('journal_mode = WAL');

const schema = fs.readFileSync(path.join(__dirname, '..', 'db', 'schema.sql'), 'utf8');
db.exec(schema);

module.exports = {
    getAllBillings({ status, search } = {}) {
        let sql = 'SELECT * FROM billings WHERE 1=1';
        const params = [];

        if (status && status !== 'all') {
            sql += ' AND status = ?';
            params.push(status);
        }
        if (search) {
            sql += ' AND (client LIKE ? OR project LIKE ?)';
            params.push(`%${search}%`, `%${search}%`);
        }

        sql += ' ORDER BY date DESC, created_at DESC';
        return db.prepare(sql).all(...params);
    },

    getBillingById(id) {
        return db.prepare('SELECT * FROM billings WHERE id = ?').get(id);
    },

    createBilling(entry) {
        const id = entry.id || Date.now().toString();
        const stmt = db.prepare(`
            INSERT INTO billings (id, client, project, amount, paid_amount, currency, status, date, notes, source, platform)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);
        stmt.run(id, entry.client, entry.project, entry.amount, entry.paid_amount || 0, entry.currency || 'INR', entry.status, entry.date, entry.notes || '', entry.source || 'manual', entry.platform || '');
        return this.getBillingById(id);
    },

    updateBilling(id, entry) {
        const stmt = db.prepare(`
            UPDATE billings SET client=?, project=?, amount=?, paid_amount=?, currency=?, status=?, date=?, notes=?, updated_at=datetime('now')
            WHERE id=?
        `);
        stmt.run(entry.client, entry.project, entry.amount, entry.paid_amount || 0, entry.currency || 'INR', entry.status, entry.date, entry.notes || '', id);
        return this.getBillingById(id);
    },

    deleteBilling(id) {
        db.prepare('DELETE FROM billings WHERE id = ?').run(id);
    },

    bulkInsert(entries) {
        const insert = db.prepare(`
            INSERT OR IGNORE INTO billings (id, client, project, amount, paid_amount, currency, status, date, notes, source, platform)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);

        let imported = 0;
        const tx = db.transaction((rows) => {
            for (const e of rows) {
                const id = e.id || `${e.platform || 'import'}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
                const result = insert.run(id, e.client, e.project, e.amount, e.paid_amount || 0, e.currency || 'USD', e.status || 'paid', e.date, e.notes || '', e.source || 'csv', e.platform || '');
                if (result.changes > 0) imported++;
            }
        });

        tx(entries);
        return { imported, total: entries.length, skipped: entries.length - imported };
    },

    getSummary() {
        return db.prepare(`
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
        `).get();
    },
};
