import https from 'https';

const base = 'https://e3-e4-backend.ethree.in/api';
// List of potential endpoints to check
const relativeGroups = [
    '/e4/bookings',
    '/bookings'
];

relativeGroups.forEach(rel => {
    const url = `${base}${rel}`;
    https.get(url, (res) => {
        console.log(`${rel}: ${res.statusCode}`);
    }).on('error', (e) => {
        console.error(`${rel}: Error ${e.message}`);
    });
});
