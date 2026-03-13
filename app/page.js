'use client';

import { WebSocketProvider, useWebSocket } from './components/WebSocketProvider';
import ConnectionStatus from './components/ConnectionStatus';
import ImageDisplay from './components/ImageDisplay';
import ScanResult from './components/ScanResult';
import ScanHistory from './components/ScanHistory';

function DashboardContent() {
    const { latestScan, scanHistory, isDemoMode, toggleDemo } = useWebSocket();

    return (
        <>
            <header>
                <div className="title-group">
                    <h1>Plant Health Scanner</h1>
                    <p>Real-time disease detection system powered by AI</p>
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
                {/* Left Column - Live Feed & current result */}
                <section className="live-feed-panel">
                    <div className="card-header glass-panel" style={{ borderBottomLeftRadius: 0, borderBottomRightRadius: 0, borderBottom: 'none' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span className="live-indicator"></span>
                            <h2>Live Camera Feed</h2>
                        </div>
                        <style jsx>{`
              .live-indicator {
                width: 8px;
                height: 8px;
                background-color: #ef4444;
                border-radius: 50%;
                box-shadow: 0 0 8px rgba(239, 68, 68, 0.8);
                animation: pulse 1.5s infinite;
              }
              @keyframes pulse {
                0% { opacity: 1; }
                50% { opacity: 0.5; }
                100% { opacity: 1; }
              }
            `}</style>
                    </div>

                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                        <ImageDisplay scan={latestScan} />
                    </div>

                    <ScanResult scan={latestScan} />
                </section>

                {/* Right Column - History Sidebar */}
                <aside>
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
