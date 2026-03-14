'use client';

import { WebSocketProvider, useWebSocket } from './components/WebSocketProvider';
import ConnectionStatus from './components/ConnectionStatus';
import LiveFeed from './components/LiveFeed';
import LatestScan from './components/LatestScan';
import ScanHistory from './components/ScanHistory';

function DashboardContent() {
    const { latestScan, scanHistory, isDemoMode, toggleDemo } = useWebSocket();

    return (
        <>
            <header>
                <div className="title-group">
                    <h1>FarmCheck Dashboard</h1>
                    <p>Real-time poultry disease detection powered by AI</p>
                </div>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <button
                        className={`demo-btn ${isDemoMode ? 'active' : ''}`}
                        onClick={toggleDemo}
                    >
                        {isDemoMode ? 'Stop Demo' : 'Run Demo'}
                    </button>
                    <ConnectionStatus />
                </div>
            </header>

            <main className="main-content">
                {/* Left column: Live feed + Latest scan stacked */}
                <div className="left-col">
                    <LiveFeed />
                    <LatestScan scan={latestScan} />
                </div>

                {/* Right column: History sidebar */}
                <aside className="history-col">
                    <ScanHistory history={scanHistory} />
                </aside>
            </main>
        </>
    );
}

export default function Dashboard() {
    return (
        <WebSocketProvider>
            <DashboardContent />
        </WebSocketProvider>
    );
}
