import './globals.css'
import { Inter } from 'next/font/google'
import ContextWrapper from "../context/ContextWrapper"
import { Providers } from "@/redux/provider"

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Bookingカレンダー',
  description: '予約できるカレンダーです',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <ContextWrapper>
            {children}
          </ContextWrapper>
        </Providers>
      </body>
    </html>
  )
}
