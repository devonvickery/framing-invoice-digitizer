const express = require('express');
const cors = require('cors');

const { normalizeVendor } = require('./utils/vendor');
const { generateInvoiceHash, isDuplicate, addHash } = require('./utils/hash');
const { addInvoice, getInvoices, exportInvoicesCSV } = require('./services/invoiceService');

const PORT = 3001;
const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Server is running! :)');
});

app.get('/api/invoices', (req, res) => {
    res.json({ invoices: getInvoices() });
});

app.post('/api/invoices', (req, res) => {
    let { vendor, amount, date } = req.body;

    if (amount == null || typeof amount !== 'number') {
        return res.status(400).json({ error: 'Amount is required and must be a number.' });
    }

    vendor = normalizeVendor(vendor);

    const hash = generateInvoiceHash({ vendor, date, amount });
    if (isDuplicate(hash)) {
        return res.status(400).json({
            error: "Duplicate invoice detected",
            detail: "This vendor, date, and amount combination already exists"
        });
    }

    addHash(hash);
    addInvoice({ vendor, amount, date, status: 'new' });

    res.json({ 
        message: 'Invoice saved!', 
        invoice: { vendor, amount, date, status: 'new' },
    });
});

app.get('/api/csv-export', async (req, res) => {
    try {
        const filePath = await exportInvoicesCSV();
        res.download(filePath, 'invoices.csv');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error :(');
    }
});

app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
})