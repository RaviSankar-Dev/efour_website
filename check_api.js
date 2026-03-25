
import https from 'https';

const urls = [
    'https://e3-e4-backend.ethree.in/api/products',
    'https://e3-e4-backend.ethree.in/api/e4/products',
    'https://e3-e4-backend.ethree.in/api/e4/bookings',
];

urls.forEach(url => {
    https.get(url, (res) => {
        console.log(`${url}: ${res.statusCode}`);
    }).on('error', (e) => {
        console.error(`${url}: Error ${e.message}`);
    });
});
