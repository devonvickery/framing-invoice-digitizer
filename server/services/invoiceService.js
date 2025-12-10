const path = require('path');
const { createObjectCsvWriter } = require('csv-writer');

const invoices = [];

const csvHeaders = [
    {id: 'date', title: 'Date' },
    {id: 'vendor', title: 'Vendor' },
    {id: 'amount', title: 'Amount' },
    {id: 'status', title: 'Status' },
];

function addInvoice(invoice) {
    invoices.push(invoice);
}

function getInvoices() {
    return invoices;
}

async function exportInvoicesCSV() {
    const csvWriter = createObjectCsvWriter({
        path: path.join(__dirname, '../invoices.csv'),
        header: csvHeaders,
    });
    await csvWriter.writeRecords(invoices);
    return path.join(__dirname, '../invoices.csv');
}

module.exports = { addInvoice, getInvoices, exportInvoicesCSV };