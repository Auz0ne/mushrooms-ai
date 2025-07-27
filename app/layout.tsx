import React from 'react'
import type { Metadata } from 'next'
import { Inter, Open_Sans } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
})

const openSans = Open_Sans({ 
  subsets: ['latin'],
  variable: '--font-opensans',
})

export const metadata: Metadata = {
  title: 'Lyceum - Premium Mushroom Supplements',
  description: 'Discover premium mushroom supplements with AI-powered recommendations',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${openSans.variable} font-opensans`}>
        <Toaster />
        {children}
      </body>
    </html>
  )
} 