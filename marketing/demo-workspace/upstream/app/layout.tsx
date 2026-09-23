import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Everglade Logistics: Workspace Preview',
  description:
    'A Discord-inspired Slack and Teams workspace preview for Everglade Logistics.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
