import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Sidebar from '../components/Sidebar'
import { SettingsProvider } from '@/contexts/SettingsContext';
import AuthProvider from '@/components/AuthProvider';

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'NutriScan',
  description: 'Scan barcodes and track your nutrition',
  icons: {
    icon: [
      {
        url: '/icon.svg',
        href: '/icon.svg',
      }
    ],
    apple: [
      {
        url: '/icon.svg',
        sizes: '180x180',
        type: 'image/svg+xml',
      }
    ],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <AuthProvider>
        <SettingsProvider>
          <body className={inter.className}>
            <div className="flex flex-col md:flex-row h-screen bg-gray-100">
              <Sidebar />
              <main className="flex-1 overflow-y-auto p-4 md:p-6">
                {children}
              </main>
            </div>
          </body>
        </SettingsProvider>
      </AuthProvider>
    </html>
  )
}

