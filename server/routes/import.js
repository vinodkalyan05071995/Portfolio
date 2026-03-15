const express = require('express');
const multer = require('multer');
const { parseCSV } = require('../services/csv-parser');
const storage = require('../services/storage');
const auth = require('../middleware/auth');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });

router.use(auth);

// POST /api/import/csv?platform=upwork
router.post('/csv', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    const platform = req.query.platform || 'generic';
    const csvContent = req.file.buffer.toString('utf8');

    try {
        const { entries, errors, totalRows } = parseCSV(csvContent, platform);

        if (entries.length === 0) {
            return res.json({
                imported: 0,
                skipped: 0,
                errors: errors.length,
                totalRows,
                message: 'No valid entries found. Check your CSV format and platform selection.',
            });
        }

        const result = storage.bulkInsert(entries);

        res.json({
            imported: result.imported,
            skipped: result.skipped,
            errors: errors.length,
            totalRows,
            message: `Successfully imported ${result.imported} billing entries from ${platform}.`,
        });
    } catch (err) {
        res.status(400).json({ error: 'Failed to parse CSV: ' + err.message });
    }
});

module.exports = router;
