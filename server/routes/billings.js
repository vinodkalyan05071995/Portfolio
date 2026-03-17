const express = require('express');
const storage = require('../services/storage');
const auth = require('../middleware/auth');

const router = express.Router();
router.use(auth);

router.get('/', async (req, res) => {
    const { status, search } = req.query;
    res.json(await storage.getAllBillings({ status, search }));
});

router.get('/summary', async (req, res) => {
    res.json(await storage.getSummary());
});

router.get('/:id', async (req, res) => {
    const billing = await storage.getBillingById(req.params.id);
    if (!billing) return res.status(404).json({ error: 'Not found' });
    res.json(billing);
});

router.post('/', async (req, res) => {
    const { client, project, amount, paid_amount, currency, status, date, notes } = req.body;
    if (!client || !project || !amount || !status || !date) {
        return res.status(400).json({ error: 'Missing required fields' });
    }
    const billing = await storage.createBilling({
        client, project,
        amount: parseFloat(amount),
        paid_amount: parseFloat(paid_amount) || 0,
        currency: currency || 'INR',
        status, date, notes,
    });
    res.status(201).json(billing);
});

router.put('/:id', async (req, res) => {
    const existing = await storage.getBillingById(req.params.id);
    if (!existing) return res.status(404).json({ error: 'Not found' });

    const { client, project, amount, paid_amount, currency, status, date, notes } = req.body;
    const updated = await storage.updateBilling(req.params.id, {
        client: client || existing.client,
        project: project || existing.project,
        amount: amount ? parseFloat(amount) : existing.amount,
        paid_amount: paid_amount !== undefined ? parseFloat(paid_amount) : existing.paid_amount,
        currency: currency || existing.currency,
        status: status || existing.status,
        date: date || existing.date,
        notes: notes !== undefined ? notes : existing.notes,
    });
    res.json(updated);
});

router.delete('/:id', async (req, res) => {
    const existing = await storage.getBillingById(req.params.id);
    if (!existing) return res.status(404).json({ error: 'Not found' });
    await storage.deleteBilling(req.params.id);
    res.json({ success: true });
});

module.exports = router;
