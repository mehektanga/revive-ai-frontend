import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ReviveAI — Autonomous AI Revenue Recovery Agent',
  description: 'AI Revenue Recovery Control Tower for merchants. Monitoring payment events, root-cause diagnosis, risk limits, and recovery execution.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
