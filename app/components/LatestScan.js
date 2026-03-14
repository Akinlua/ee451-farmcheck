'use client';

export default function LatestScan({ scan }) {
    if (!scan) {
        return (
            <div className="glass-panel latest-scan-card">
                <div className="card-header">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                    <h2>Latest Scan Result</h2>
                </div>
                <div className="latest-scan-empty">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.4 }}>
                        <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
                        <circle cx="12" cy="13" r="3" />
                    </svg>
                    <p>Waiting for first scan…</p>
                </div>
            </div>
        );
    }

    const isHealthy = (scan.disease ?? scan.result)?.toLowerCase() === 'healthy' || (scan.disease ?? scan.result)?.toLowerCase() === 'disease-free';
    const label = scan.disease ?? scan.result;
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

    const ts = scan.timestamp ? new Date(scan.timestamp).toLocaleTimeString([], {
        hour: '2-digit', minute: '2-digit', second: '2-digit'
    }) : '';

    return (
        <div className={`glass-panel latest-scan-card animate-fade-in ${isHealthy ? 'healthy' : 'diseased'}`}>
            <div className="card-header">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <h2>Latest Scan Result</h2>
                {ts && <span className="scan-ts">{ts}</span>}
            </div>

            <div className="latest-scan-body">
                {imageSrc && (
                    <div className={`latest-scan-img-wrap ${isHealthy ? 'healthy' : 'diseased'}`}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={imageSrc} alt="Scanned feces sample" className="latest-scan-img" />
                    </div>
                )}

                <div className="latest-scan-info">
                    <div className="diagnosis-badge" style={{
                        background: isHealthy ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.12)',
                        border: `1px solid ${isHealthy ? 'var(--accent-healthy)' : 'var(--accent-diseased)'}`,
                        color: isHealthy ? 'var(--accent-healthy)' : 'var(--accent-diseased)',
                    }}>
                        {isHealthy ? (
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
                            </svg>
                        ) : (
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                                <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
                            </svg>
                        )}
                        <span>{isHealthy ? 'Healthy' : label}</span>
                    </div>

                    <div className="confidence-section">
                        <span className="conf-label">Confidence</span>
                        <span className="conf-value">{confidence}%</span>
                        <div className="conf-bar-bg">
                            <div
                                className={`conf-bar-fill ${isHealthy ? 'healthy' : 'diseased'}`}
                                style={{ width: `${confidence}%` }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
