export default function ScanHistory({ history }) {
    if (!history || history.length === 0) {
        return (
            <div className="glass-panel" style={{ height: '100%' }}>
                <div className="card-header">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                    </svg>
                    <h2>Scan History</h2>
                </div>
                <div className="empty-history">No previous scans found.</div>
            </div>
        );
    }

    return (
        <div className="glass-panel" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div className="card-header">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                </svg>
                <h2>Scan History</h2>
                <span style={{ marginLeft: 'auto', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    {history.length} scans
                </span>
            </div>

            <div className="history-list">
                {history.map((scan) => {
                    const label = scan.result ?? scan.disease ?? '';
                    const isHealthy = label.toLowerCase() === 'healthy' || label.toLowerCase() === 'disease-free';
                    const time = scan.timestamp
                        ? new Date(scan.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
                        : '';
                    const confidence = Math.round((scan.confidence || 0) * 100);

                    // Robust image source determination
                    let imageSrc = scan.imageUrl || null;
                    if (!imageSrc && scan.image) {
                        if (scan.image.startsWith('data:') || scan.image.startsWith('http')) {
                            imageSrc = scan.image;
                        } else {
                            imageSrc = `data:image/jpeg;base64,${scan.image}`;
                        }
                    }

                    return (
                        <div
                            key={scan.id}
                            className={`history-item ${isHealthy ? 'healthy' : 'diseased'} animate-fade-in`}
                        >
                            {imageSrc ? (
                                /* eslint-disable-next-line @next/next/no-img-element */
                                <img src={imageSrc} alt="Thumbnail" className="history-thumb" />
                            ) : (
                                <div className="history-thumb history-thumb-placeholder">
                                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3z" />
                                        <circle cx="12" cy="13" r="3" />
                                    </svg>
                                </div>
                            )}
                            <div className="history-details">
                                <div className="history-status">
                                    {isHealthy ? 'Healthy' : label}
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
