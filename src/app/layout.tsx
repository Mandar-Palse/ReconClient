// frontend/app/layout.tsx
import './globals.css';
import * as React from 'react';
import type { Metadata } from 'next';
import AuthProvider from './components/AuthProvider';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';

export const metadata: Metadata = {
  title: 'Paysis Recon',
  description: 'Register, Login, Dashboard'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <AppRouterCacheProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
