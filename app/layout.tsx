import type {Metadata} from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/hooks/use-auth';
import { CartProvider } from '@/hooks/use-cart';
import { ErrorBoundary } from '@/components/error-boundary';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'Siong | Minimalist E-commerce',
  description: 'A fluid and minimalistic e-commerce experience.',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className={`${inter.variable}`}>
      <body suppressHydrationWarning className="antialiased font-sans">
        <ErrorBoundary>
          <AuthProvider>
            <CartProvider>
              {children}
            </CartProvider>
          </AuthProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
