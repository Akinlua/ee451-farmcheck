import './globals.css';

export const metadata = {
    title: 'Plant Health Scanner',
    description: 'Real-time plant disease detection dashboard via Raspberry Pi',
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
