const http = require('http');
const middleware = require('./index');

async function runTests() {
    console.log("Starting tests...");

    // Mock server for countryAPI
    const server = http.createServer((req, res) => {
        if (req.method === 'POST') {
            let body = '';
            req.on('data', chunk => {
                body += chunk.toString();
            });
            req.on('end', () => {
                const data = JSON.parse(body);
                if (data.ip === '1.2.3.4') {
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ country: 'IN' }));
                } else {
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ country: 'US' }));
                }
            });
        } else {
            res.writeHead(404);
            res.end();
        }
    });

    const port = 3001;
    server.listen(port);
    const countryAPI = `http://localhost:${port}`;
    process.env.countryAPI = countryAPI;

    const mockRes = {};

    // Test Case 1: IP present and countryAPI set
    const req1 = {
        headers: { 'x-forwarded-for': '1.2.3.4' },
        socket: {}
    };
    await new Promise(resolve => {
        middleware(req1, mockRes, () => {
            console.log('Test Case 1 (IP 1.2.3.4):');
            console.log('  req.clientIP:', req1.clientIP);
            console.log('  req.country:', req1.country);
            if (req1.clientIP === '1.2.3.4' && req1.country === 'IN') {
                console.log('  PASSED');
            } else {
                console.log('  FAILED');
            }
            resolve();
        });
    });

    // Test Case 2: Different IP
    const req2 = {
        headers: { 'x-forwarded-for': '8.8.8.8' },
        socket: {}
    };
    await new Promise(resolve => {
        middleware(req2, mockRes, () => {
            console.log('Test Case 2 (IP 8.8.8.8):');
            console.log('  req.clientIP:', req2.clientIP);
            console.log('  req.country:', req2.country);
            if (req2.clientIP === '8.8.8.8' && req2.country === 'US') {
                console.log('  PASSED');
            } else {
                console.log('  FAILED');
            }
            resolve();
        });
    });

    // Test Case 3: countryAPI NOT set
    delete process.env.countryAPI;
    const req3 = {
        headers: { 'x-forwarded-for': '1.2.3.4' },
        socket: {}
    };
    await new Promise(resolve => {
        middleware(req3, mockRes, () => {
            console.log('Test Case 3 (countryAPI NOT set):');
            console.log('  req.clientIP:', req3.clientIP);
            console.log('  req.country:', req3.country);
            if (req3.clientIP === '1.2.3.4' && req3.country === undefined) {
                console.log('  PASSED');
            } else {
                console.log('  FAILED');
            }
            resolve();
        });
    });

    server.close();
    console.log("Tests finished.");
}

runTests().catch(err => {
    console.error("Test execution failed:", err);
    process.exit(1);
});
