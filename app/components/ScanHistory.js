export default function ScanHistory({ history }) {
    if (!history || history.length === 0) {
        return (
            <div className="glass-panel" style={{ height: '100%' }}>
                <div className="card-header">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                    </svg>
                    <h2>Scan History</h2>
                </div>
                <div className="empty-history">
                    No previous scans found.
                </div>
            </div>
        );
    }

    return (
        <div className="glass-panel" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div className="card-header">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                </svg>
                <h2>Scan History</h2>
                <span style={{ marginLeft: 'auto', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    {history.length} scans
                </span>
            </div>

            <div className="history-list">
                {history.map((scan) => {
                    const isHealthy = scan.result.toLowerCase() === 'disease-free';
                    const time = new Date(scan.timestamp).toLocaleTimeString([], {
                        hour: '2-digit', minute: '2-digit', second: '2-digit'
                    });
                    const confidence = Math.round((scan.confidence || 0) * 100);

                    return (
                        <div
                            key={scan.id}
                            className={`history-item ${isHealthy ? 'healthy' : 'diseased'} animate-fade-in`}
                        >
                            <img
                                src={scan.imageUrl || `data:image/jpeg;base64,${scan.image}`}
                                alt="Thumbnail"
                                className="history-thumb"
                            />
                            <div className="history-details">
                                <div className="history-status">
                                    {isHealthy ? 'Disease-Free' : scan.result}
                                </div>
                                <div className="history-meta">
                                    <span>{time}</span>
                                    <span>{confidence}% conf</span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
