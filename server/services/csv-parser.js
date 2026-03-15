const { parse } = require('csv-parse/sync');

// Platform-specific CSV column mappings
const PROFILES = {
    upwork: {
        // Upwork transaction history CSV columns
        mapRow(row) {
            const desc = row['Description'] || row['description'] || '';
            const amount = parseFloat((row['Amount'] || row['amount'] || '0').replace(/[^0-9.-]/g, ''));
            const date = normalizeDate(row['Date'] || row['date'] || '');
            // Skip fee rows and negative amounts
            if (amount <= 0) return null;
            return {
                client: extractClient(desc),
                project: desc.substring(0, 100),
                amount,
                status: 'paid',
                date,
                notes: `Imported from Upwork`,
                source: 'upwork_csv',
                platform: 'upwork',
            };
        }
    },

    fiverr: {
        mapRow(row) {
            const amount = parseFloat((row['Amount'] || row['Earning'] || row['earning'] || '0').replace(/[^0-9.-]/g, ''));
            const date = normalizeDate(row['Date'] || row['date'] || row['Order Date'] || '');
            if (amount <= 0) return null;
            return {
                client: row['Buyer'] || row['buyer'] || row['Client'] || 'Fiverr Client',
                project: row['Gig'] || row['gig'] || row['Description'] || row['description'] || 'Fiverr Order',
                amount,
                status: 'paid',
                date,
                notes: 'Imported from Fiverr',
                source: 'fiverr_csv',
                platform: 'fiverr',
            };
        }
    },

    freelancer: {
        mapRow(row) {
            const amount = parseFloat((row['Amount'] || row['amount'] || row['Price'] || '0').replace(/[^0-9.-]/g, ''));
            const date = normalizeDate(row['Date'] || row['date'] || row['Award Date'] || '');
            if (amount <= 0) return null;
            return {
                client: row['Employer'] || row['employer'] || row['Client'] || 'Freelancer Client',
                project: row['Project'] || row['project'] || row['Title'] || 'Freelancer Project',
                amount,
                status: 'paid',
                date,
                notes: 'Imported from Freelancer.com',
                source: 'freelancer_csv',
                platform: 'freelancer',
            };
        }
    },

    paypal: {
        mapRow(row) {
            const amount = parseFloat((row['Gross'] || row['Amount'] || row['Net'] || '0').replace(/[^0-9.-]/g, ''));
            const date = normalizeDate(row['Date'] || row['date'] || '');
            const type = (row['Type'] || row['type'] || '').toLowerCase();
            // Only import received payments
            if (amount <= 0 || type.includes('payment sent')) return null;
            return {
                client: row['Name'] || row['From Email Address'] || 'PayPal Client',
                project: row['Subject'] || row['Item Title'] || 'PayPal Payment',
                amount,
                status: 'paid',
                date,
                notes: 'Imported from PayPal',
                source: 'paypal_csv',
                platform: 'paypal',
            };
        }
    },

    generic: {
        mapRow(row) {
            // Try to auto-detect common column names
            const client = row['Client'] || row['client'] || row['Customer'] || row['customer'] || row['Name'] || row['name'] || 'Unknown Client';
            const project = row['Project'] || row['project'] || row['Description'] || row['description'] || row['Item'] || 'Imported Entry';
            const amountRaw = row['Amount'] || row['amount'] || row['Total'] || row['total'] || row['Price'] || row['price'] || '0';
            const amount = parseFloat(amountRaw.toString().replace(/[^0-9.-]/g, ''));
            const date = normalizeDate(row['Date'] || row['date'] || row['Due Date'] || row['Invoice Date'] || '');
            const status = (row['Status'] || row['status'] || 'paid').toLowerCase();

            if (amount <= 0 || !date) return null;

            return {
                client: client.substring(0, 100),
                project: project.substring(0, 200),
                amount,
                status: ['paid', 'pending', 'overdue'].includes(status) ? status : 'paid',
                date,
                notes: 'Imported from CSV',
                source: 'generic_csv',
                platform: 'other',
            };
        }
    },
};

function normalizeDate(dateStr) {
    if (!dateStr) return new Date().toISOString().split('T')[0];
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return new Date().toISOString().split('T')[0];
    return d.toISOString().split('T')[0];
}

function extractClient(description) {
    // Try to extract client name from Upwork descriptions like "Invoice for Contract #xxx with ClientName"
    const match = description.match(/with\s+(.+?)(?:\s*-|\s*$)/i);
    return match ? match[1].trim() : description.substring(0, 50);
}

function parseCSV(csvContent, platform = 'generic') {
    const profile = PROFILES[platform] || PROFILES.generic;

    const records = parse(csvContent, {
        columns: true,
        skip_empty_lines: true,
        trim: true,
        relax_column_count: true,
    });

    const results = [];
    const errors = [];

    for (let i = 0; i < records.length; i++) {
        try {
            const entry = profile.mapRow(records[i]);
            if (entry) results.push(entry);
        } catch (err) {
            errors.push({ row: i + 2, error: err.message });
        }
    }

    return { entries: results, errors, totalRows: records.length };
}

module.exports = { parseCSV };
