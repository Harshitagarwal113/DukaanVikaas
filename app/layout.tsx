import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Providers } from '@/components/Providers';

export const metadata: Metadata = {
  title: 'DukaanVikaas | दुकान विकास - Kirana Store Inventory & Sales Manager',
  description:
    'Simple, mobile-friendly offline inventory and sales billing app for Indian kirana shops and small retailers. Works 100% in-browser with IndexedDB and JSON backups.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#d97706',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full bg-stone-100">
      <body className="min-h-full flex flex-col font-sans text-stone-900 bg-stone-50 antialiased selection:bg-amber-200">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
