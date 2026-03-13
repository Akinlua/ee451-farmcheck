import { useWebSocket, CONNECTION_STATUS } from './WebSocketProvider';

export default function ConnectionStatus() {
    const { status } = useWebSocket();

    let statusText = 'Disconnected';
    if (status === CONNECTION_STATUS.CONNECTED) statusText = 'Connected to Scanner';
    if (status === CONNECTION_STATUS.CONNECTING) statusText = 'Connecting...';

    return (
        <div className="connection-badge">
            <div className={`status-dot ${status}`} />
            <span>{statusText}</span>
        </div>
    );
}
