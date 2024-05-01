import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/layout/navbar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    default: process.env.NEXT_PUBLIC_APP_TITLE,
    template: '%s | ' + process.env.NEXT_PUBLIC_APP_TITLE,
  },
  description: process.env.NEXT_PUBLIC_APP_DESCRIPTION,
  keywords: ['app', 'next.js examples'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="dark">
      <body className={`${inter.className} min-h-screen`}>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
