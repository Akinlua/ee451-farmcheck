const WebSocket = require('ws');
const fs = require('fs');

const wss = new WebSocket.Server({ port: 8765 });

// A nice gradient image to act as a placeholder
const mockBase64Image = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';

// More realistic list of potential plant diseases
const diseases = [
    'disease-free', // We want this to happen more often
    'disease-free',
    'disease-free',
    'Late Blight',
    'Early Blight',
    'Powdery Mildew',
    'Rust',
    'Leaf Spot'
];

console.log('Test WebSocket Server running on ws://localhost:8765');
console.log('Sending mock scan data every 5 seconds...\n');

wss.on('connection', function connection(ws) {
    console.log('✅ Client connected to test server');

    const intervalId = setInterval(() => {
        const isHealthy = Math.random() > 0.4;

        // Select disease or healthy
        const resultIdx = isHealthy ? 0 : Math.floor(Math.random() * (diseases.length - 1)) + 1;
        const result = diseases[resultIdx];

        // Confidence higher when healthy usually
        const confidence = isHealthy
            ? 0.85 + (Math.random() * 0.14)
            : 0.65 + (Math.random() * 0.30);

        const payload = {
            image: mockBase64Image,
            result: result,
            confidence: confidence
        };

        console.log(`Sending scan: ${result} (${(confidence * 100).toFixed(1)}%)`);
        ws.send(JSON.stringify(payload));
    }, 5000); // send every 5 seconds

    ws.on('close', () => {
        console.log('❌ Client disconnected');
        clearInterval(intervalId);
    });
});
