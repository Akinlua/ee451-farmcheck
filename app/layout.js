import './globals.css';

export const metadata = {
    title: 'FarmCheck Dashboard',
    description: 'Real-time poultry disease detection dashboard via Raspberry Pi',
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
            </head>
            <body>
                <div className="dashboard-container">
                    {children}
                </div>
            </body>
        </html>
    );
}
