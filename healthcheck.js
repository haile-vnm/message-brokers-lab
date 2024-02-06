const http = require('http');

const req = http.get(process.argv[2], (res) => {
    process.exit(res.statusCode !== 200 ? 1 : 0);
});

req.on('error', () => {
    process.exit(1);
});
