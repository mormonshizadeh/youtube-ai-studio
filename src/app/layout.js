import './globals.css';

export const metadata = {
  title: 'YouTube Studio AI — Free VidIQ & TubeBuddy Alternative',
  description: 'AI-Powered YouTube SEO, Competitor Outlier Radar, Viral Title & Hook Generator, and Hidden Tag Extractor.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="bg-glow-container">
          <div className="glow-spot-1" />
          <div className="glow-spot-2" />
          <div className="glow-spot-3" />
        </div>
        <div style={{ position: 'relative', zIndex: 1 }}>
          {children}
        </div>
      </body>
    </html>
  );
}
