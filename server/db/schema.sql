CREATE TABLE IF NOT EXISTS billings (
    id TEXT PRIMARY KEY,
    client TEXT NOT NULL,
    project TEXT NOT NULL,
    amount REAL NOT NULL,
    paid_amount REAL DEFAULT 0,
    currency TEXT DEFAULT 'INR' CHECK(currency IN ('INR','USD')),
    status TEXT NOT NULL CHECK(status IN ('paid','pending','overdue','partial')),
    date TEXT NOT NULL,
    notes TEXT DEFAULT '',
    source TEXT DEFAULT 'manual',
    platform TEXT DEFAULT '',
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
);
