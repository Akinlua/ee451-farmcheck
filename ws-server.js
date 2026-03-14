const WebSocket = require('ws');
const http = require('http');

console.log('Starting Test WebSocket Server + HTTP Broadcast endpoint...');

// Create an HTTP server so our Next.js API route can easily POST scan data to us
const server = http.createServer((req, res) => {
    // Only accept POST to /broadcast
    if (req.method === 'POST' && req.url === '/broadcast') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', () => {
            try {
                // We assume payload is fully formed JSON from the API
                const data = JSON.parse(body);
                console.log(`[HTTP] Received scan from API: ${data.disease} (${data.confidence * 100}%)`);

                // Broadcast this scan to any connected WebSocket clients (the Next.js frontend)
                wss.clients.forEach(client => {
                    if (client.readyState === WebSocket.OPEN) {
                        client.send(JSON.stringify(data));
                    }
                });

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true, count: wss.clients.size }));
            } catch (err) {
                console.error('Failed to parse broadcast payload', err);
                res.writeHead(500);
                res.end('Server Error');
            }
        });
    } else {
        res.writeHead(404);
        res.end('Not Found');
    }
});

// Attach the WebSocket server to the same HTTP server port
const wss = new WebSocket.Server({ server });

wss.on('connection', function connection(ws) {
    console.log('✅ Client connected to WebSocket server');

    ws.on('close', () => {
        console.log('❌ Client disconnected');
    });
});

// We listen on 8765, which matches our `ws://localhost:8765` frontend connection
const PORT = 8765;
server.listen(PORT, () => {
    console.log(`🚀 WebSocket server running on ws://localhost:${PORT}`);
    console.log(`📡 HTTP Broadcast endpoint listening on http://localhost:${PORT}/broadcast`);
});
