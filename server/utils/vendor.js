const stringSimilarity = require('string-similarity');

const KNOWN_VENDORS = [
    "Home Depot",
    "RONA",
    "Lowe's",
    "Canadian Tire",
    "Castle",
    "Windsor Plywood",
];

function normalizeVendor(input) {
    if (!input) return input;
    const cleanInput = input.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();

    const matches = KNOWN_VENDORS.map(vendor => {
        const cleanVendor = vendor.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
        return { vendor, score: stringSimilarity.compareTwoStrings(cleanInput, cleanVendor) };
    });

    const bestMatch = matches.reduce((prev, current) => (current.score > prev.score ? current : prev), { score: 0 });
    return bestMatch.score >= 0.5 ? bestMatch.vendor : input;
}

module.exports = { normalizeVendor };