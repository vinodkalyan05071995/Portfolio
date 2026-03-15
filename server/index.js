const express = require('express');
const path = require('path');
const config = require('./config');

const app = express();

// Body parsing
app.use(express.json());

// Serve static files from project root
app.use(express.static(path.join(__dirname, '..')));

// API routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/billings', require('./routes/billings'));
app.use('/api/import', require('./routes/import'));

// Start
app.listen(config.PORT, () => {
    console.log(`Dashboard server running at http://localhost:${config.PORT}`);
    console.log(`Portfolio: http://localhost:${config.PORT}/index.html`);
    console.log(`Dashboard: http://localhost:${config.PORT}/dashboard.html`);
});
