import './globals.css'
import { Source_Sans_3 } from 'next/font/google'

const sourceSans = Source_Sans_3({ subsets: ['latin'] })

export const metadata = {
  title: 'Stories',
  description: 'Make sense of the world',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={sourceSans.className}>{children}</body>
    </html>
  )
}
