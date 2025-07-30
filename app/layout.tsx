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
  title: 'Mushrooms AI - Premium Mushroom Supplements',
  description: 'Discover premium mushroom supplements with AI-powered recommendations',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        <meta name="theme-color" content="#1a1a1a" />
      </head>
      <body className={`${inter.variable} ${openSans.variable} font-opensans`}>
        <Toaster />
        {children}
      </body>
    </html>
  )
} 