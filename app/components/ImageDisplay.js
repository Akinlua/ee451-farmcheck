export default function ImageDisplay({ scan, status }) {
    const isHealthy = scan?.result?.toLowerCase() === 'disease-free';
    const hasImage = !!scan?.image || !!scan?.imageUrl;

    let statusClass = 'idle';
    if (hasImage) {
        statusClass = isHealthy ? 'healthy' : 'diseased';
    }

    const imageSrc = scan?.imageUrl || (scan?.image ? `data:image/jpeg;base64,${scan.image}` : null);

    return (
        <div className="glass-panel image-container">
            <div className={`status-glow ${statusClass}`}></div>
            <div className="image-wrapper">
                {hasImage && imageSrc ? (
                    <img
                        src={imageSrc}
                        alt="Latest Plant Scan"
                    />
                ) : (
                    <div className="no-image-placeholder">
                        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                            <circle cx="8.5" cy="8.5" r="1.5" />
                            <polyline points="21 15 16 10 5 21" />
                        </svg>
                        <p>Waiting for live feed from Raspberry Pi...</p>
                    </div>
                )}
            </div>
        </div>
    );
}
