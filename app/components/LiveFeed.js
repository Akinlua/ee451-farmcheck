'use client';

import { useState } from 'react';

const DEFAULT_FEED_URL = process.env.NEXT_PUBLIC_FEED_URL || 'http://localhost:5000';

export default function LiveFeed() {
    const [baseUrl, setBaseUrl] = useState(DEFAULT_FEED_URL);
    const [inputUrl, setInputUrl] = useState(DEFAULT_FEED_URL);
    const [imgError, setImgError] = useState(false);

    const feedUrl = `${baseUrl}/video`;

    const handleConnect = (e) => {
        e.preventDefault();
        setImgError(false);
        setBaseUrl(inputUrl.trim());
    };

    return (
        <div className="glass-panel live-feed-card">
            <div className="card-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className="live-dot"></span>
                    <h2>Live Camera Feed</h2>
                </div>
                <form onSubmit={handleConnect} className="pi-ip-form">
                    <input
                        type="text"
                        value={inputUrl}
                        onChange={e => setInputUrl(e.target.value)}
                        placeholder="Camera Feed URL (e.g. http://localhost:5000)"
                        className="pi-ip-input"
                    />
                    <button type="submit" className="pi-connect-btn">Connect</button>
                </form>
            </div>

            <div className="live-feed-wrapper">
                {imgError ? (
                    <div className="feed-offline">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M23 7l-7 5 7 5V7z" /><rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
                            <line x1="1" y1="1" x2="23" y2="23" />
                        </svg>
                        <p>Camera offline</p>
                        <span>Enter Feed URL above and click Connect</span>
                    </div>
                ) : (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                        src={feedUrl}
                        alt="Live Raspberry Pi MJPEG stream"
                        className="live-feed-img"
                        onError={() => setImgError(true)}
                    />
                )}
            </div>
        </div>
    );
}
