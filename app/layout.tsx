import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
    title: 'Caloriv Admin',
    description: 'Admin panel for Caloriv fitness app',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body>{children}</body>
        </html>
    )
}
