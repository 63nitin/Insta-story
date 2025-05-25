import type {Metadata} from 'next';
import { Geist, Geist_Mono } from 'next/font/google'; // Corrected import for Geist fonts
import './globals.css';
import { Toaster } from '@/components/ui/toaster'; // Added Toaster

const geistSans = Geist({ // Corrected instantiation
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({ // Corrected instantiation
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'StoryFlow',
  description: 'View and share engaging stories.',
  icons: {
    icon: '/templete.png', // Path to your favicon in the public folder
    // You can also add other types:
    // apple: '/apple-touch-icon.png', // For Apple devices
    // shortcut: '/favicon-16x16.png', // For shortcut icon
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
