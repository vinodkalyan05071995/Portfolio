require('dotenv').config();

module.exports = {
    PORT: process.env.PORT || 3000,
    AUTH_SECRET: process.env.AUTH_SECRET || 'change-this-secret',
    DASHBOARD_PASSWORD: process.env.DASHBOARD_PASSWORD || 'vinod2026',
    TURSO_URL: process.env.TURSO_URL || 'file:server/db/billings.db',
    TURSO_AUTH_TOKEN: process.env.TURSO_AUTH_TOKEN || '',
};
