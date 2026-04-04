import React from "react"
import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/next'
import { IBM_Plex_Mono, Noto_Sans_SC, Noto_Serif_SC } from 'next/font/google'
import './globals.css'

const notoSans = Noto_Sans_SC({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-sans-ui',
});

const notoSerif = Noto_Serif_SC({
  subsets: ['latin'],
  weight: ['700'],
  variable: '--font-serif-display',
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['500'],
  variable: '--font-mono-ui',
});

export const metadata: Metadata = {
  title: '美工图片调整系统 - AI智能图片处理工具',
  description: '为美团和淘宝闪购平台商家提供AI智能图片处理，支持产品图、头像、店招、海报的智能修改与尺寸适配',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="zh-CN">
      <body className={`${notoSans.variable} ${notoSerif.variable} ${ibmPlexMono.variable} font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
