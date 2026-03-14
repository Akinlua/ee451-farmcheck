'use client';

import { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';

const WebSocketContext = createContext(null);

export const CONNECTION_STATUS = {
    CONNECTING: 'connecting',
    CONNECTED: 'connected',
    DISCONNECTED: 'disconnected',
};

export function WebSocketProvider({ children }) {
    const [status, setStatus] = useState(CONNECTION_STATUS.DISCONNECTED);
    const [latestScan, setLatestScan] = useState(null);
    const [scanHistory, setScanHistory] = useState([]);
    const [isDemoMode, setIsDemoMode] = useState(false);

    const wsRef = useRef(null);
    const demoIntervalRef = useRef(null);
    const DEFAULT_WS_URL = 'ws://localhost:8765';

    // Fetch initial history from DB on mount
    useEffect(() => {
        fetch('/api/history')
            .then(r => r.json())
            .then(data => {
                if (data.history && data.history.length > 0) {
                    // Normalise DB records: they use `disease`, WS messages use `result`
                    const normalised = data.history.map(s => ({
                        ...s,
                        result: s.disease ?? s.result,
                    }));
                    setScanHistory(normalised);
                    setLatestScan(normalised[0]);
                }
            })
            .catch(err => console.error('Failed to load history:', err));
    }, []);

    const connect = useCallback((url = DEFAULT_WS_URL) => {
        if (wsRef.current?.readyState === WebSocket.OPEN) return;

        if (!isDemoMode) setStatus(CONNECTION_STATUS.CONNECTING);

        try {
            const ws = new WebSocket(url);

            ws.onopen = () => {
                if (!isDemoMode) setStatus(CONNECTION_STATUS.CONNECTED);
                console.log('WebSocket Connected to:', url);
            };

            ws.onmessage = (event) => {
                if (isDemoMode) return;

                try {
                    const data = JSON.parse(event.data);

                    // Normalise: DB records use `disease`, demo uses `result`
                    const scanData = {
                        ...data,
                        result: data.disease ?? data.result,
                        id: data.id ?? Date.now().toString(),
                        timestamp: data.timestamp ?? new Date().toISOString(),
                    };

                    setLatestScan(scanData);
                    setScanHistory(prev => [scanData, ...prev].slice(0, 50));
                } catch (error) {
                    console.error('Error parsing WebSocket message:', error);
                }
            };

            ws.onclose = () => {
                if (!isDemoMode) setStatus(CONNECTION_STATUS.DISCONNECTED);
                setTimeout(() => connect(url), 3000);
            };

            ws.onerror = (error) => {
                console.error('WebSocket error:', error);
                ws.close();
            };

            wsRef.current = ws;
        } catch (error) {
            console.error('Failed to connect to WebSocket:', error);
            if (!isDemoMode) setStatus(CONNECTION_STATUS.DISCONNECTED);
            setTimeout(() => connect(url), 3000);
        }
    }, [isDemoMode]);

    useEffect(() => {
        connect();
        return () => {
            if (wsRef.current) wsRef.current.close();
        };
    }, [connect]);

    // Demo Mode Logic
    useEffect(() => {
        if (isDemoMode) {
            const demoImages = [
                { url: 'https://plus.unsplash.com/premium_photo-1680322474521-60fcadf0a416?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', result: 'disease-free' },
                { url: 'https://media.istockphoto.com/id/2192677464/photo/close-up-of-farmer-holding-potato-at-farm.jpg?s=1024x1024&w=is&k=20&c=DmPG0rWl5Y5XhAHkYemQXKxxbJZRD06hJp-ZBZUQgcE=', result: 'Leaf Spot' },
                { url: 'https://images.unsplash.com/photo-1591216720574-ade558cb83ea?q=80&w=1673&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', result: 'disease-free' },
                { url: 'https://images.unsplash.com/photo-1522579479806-486feddb6d25?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', result: 'Powdery Mildew' },
                { url: 'https://media.istockphoto.com/id/2224302331/photo/ripe-organic-broccoli-growing-in-the-vegetable-garden.jpg?s=1024x1024&w=is&k=20&c=tUQ5balvHoa4BHfwSPK-lAHDSREPFTottcsukfl5YOA=', result: 'disease-free' },
                { url: 'https://plus.unsplash.com/premium_photo-1670909649532-d1d68ee475cd?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', result: 'Late Blight' },
            ];

            let index = 0;
            setStatus(CONNECTION_STATUS.CONNECTED);

            const simulateScan = () => {
                const item = demoImages[index % demoImages.length];
                const isHealthy = item.result === 'Healthy';
                const confidence = isHealthy ? 0.92 + Math.random() * 0.07 : 0.70 + Math.random() * 0.25;

                const scanData = {
                    imageUrl: item.url,
                    image: null,
                    result: item.result,
                    disease: item.result,
                    confidence,
                    id: Date.now().toString(),
                    timestamp: new Date().toISOString(),
                };

                setLatestScan(scanData);
                setScanHistory(prev => [scanData, ...prev].slice(0, 50));
                index++;
            };

            simulateScan();
            demoIntervalRef.current = setInterval(simulateScan, 4000);
        } else {
            if (demoIntervalRef.current) clearInterval(demoIntervalRef.current);
            if (wsRef.current?.readyState === WebSocket.OPEN) {
                setStatus(CONNECTION_STATUS.CONNECTED);
            } else {
                setStatus(CONNECTION_STATUS.DISCONNECTED);
            }
        }

        return () => {
            if (demoIntervalRef.current) clearInterval(demoIntervalRef.current);
        };
    }, [isDemoMode]);

    const toggleDemo = useCallback(() => setIsDemoMode(prev => !prev), []);
    const clearHistory = useCallback(() => {
        setScanHistory([]);
        setLatestScan(null);
    }, []);

    return (
        <WebSocketContext.Provider value={{ status, latestScan, scanHistory, clearHistory, isDemoMode, toggleDemo }}>
            {children}
        </WebSocketContext.Provider>
    );
}

export function useWebSocket() {
    const context = useContext(WebSocketContext);
    if (!context) throw new Error('useWebSocket must be used within a WebSocketProvider');
    return context;
}
