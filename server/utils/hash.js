const crypto = require('crypto');
const invoiceHashes = new Set();

function generateInvoiceHash({ vendor, date, amount }) {
    const normalizedString = `${vendor}|${date}|${amount}`;
    return crypto.createHash('sha256').update(normalizedString).digest('hex');
}

function isDuplicate(hash) {
    return invoiceHashes.has(hash);
}

function addHash(hash) {
    invoiceHashes.add(hash);
}

module.exports = { generateInvoiceHash, isDuplicate, addHash };