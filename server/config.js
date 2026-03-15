require('dotenv').config();

module.exports = {
    PORT: process.env.PORT || 3000,
    AUTH_SECRET: process.env.AUTH_SECRET || 'change-this-secret',
    DASHBOARD_PASSWORD: process.env.DASHBOARD_PASSWORD || 'vinod2026',
    DB_PATH: process.env.DB_PATH || require('path').join(__dirname, 'db', 'billings.db'),
};
