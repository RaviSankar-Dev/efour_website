
import https from 'https';

const data = JSON.stringify({
    mobile: "9346608305",
    location: "E4"
});

const options = {
    hostname: 'e3-e4-backend.ethree.in',
    path: '/api/auth/send-otp',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
    }
};

const req = https.request(options, (res) => {
    console.log(`Status: ${res.statusCode}`);
    console.log(`OK: ${res.statusCode >= 200 && res.statusCode < 300}`);

    let body = '';
    res.on('data', (d) => {
        body += d;
    });

    res.on('end', () => {
        console.log('Body:', body);
    });
});

req.on('error', (error) => {
    console.error(error);
});

req.write(data);
req.end();
