/**
 * Root Layout Component
 * Steal a Brainrot Frontend
 */

import './globals.css';

export const metadata = {
  title: 'Steal a Brainrot',
  description: 'Discover all brainrots from the Roblox game Steal a Brainrot',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}

