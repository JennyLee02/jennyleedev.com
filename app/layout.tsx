import type React from "react"
import { Inter } from "next/font/google"
import "./globals.css"
import { Providers } from "@/components/providers"
import type { Metadata, Viewport } from 'next'

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: 'Jenny Lee | Developer Portfolio',
  description: 'Personal developer website showcasing projects, LeetCode solutions, and monthly retrospectives',
  generator: 'Next.js',
  applicationName: 'Jenny Lee Portfolio',
  keywords: ['developer', 'portfolio', 'projects', 'leetcode', 'blog'],
  authors: [{ name: 'Jenny Lee' }],
  creator: 'Jenny Lee',
  publisher: 'Jenny Lee',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
}

export const viewport: Viewport = {
  colorScheme: 'dark light',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' }
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}

