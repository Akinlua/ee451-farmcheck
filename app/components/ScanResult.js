export default function ScanResult({ scan }) {
    if (!scan) return null;

    const isHealthy = scan.result.toLowerCase() === 'disease-free';
    const confidence = Math.round((scan.confidence || 0) * 100);

    const statusClass = isHealthy ? 'healthy' : 'diseased';

    return (
        <div className={`result-card ${statusClass} animate-fade-in`}>
            <div className="result-info">
                <h3>Analysis Result</h3>
                <div className="diagnosis">
                    {isHealthy ? (
                        <>
                            <span>Disease-Free</span>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                <polyline points="22 4 12 14.01 9 11.01"></polyline>
                            </svg>
                        </>
                    ) : (
                        <>
                            <span>{scan.result}</span>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                                <line x1="12" y1="9" x2="12" y2="13"></line>
                                <line x1="12" y1="17" x2="12.01" y2="17"></line>
                            </svg>
                        </>
                    )}
                </div>
            </div>

            <div className="confidence-meter">
                <span className="confidence-value">{confidence}%</span>
                <div className="confidence-bar-bg">
                    <div
                        className="confidence-bar-fill"
                        style={{ width: `${confidence}%` }}
                    ></div>
                </div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Confidence</span>
            </div>
        </div>
    );
}
