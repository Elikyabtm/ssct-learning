import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Mission Santé-Sécurité',
  description: 'Un jeu interactif de prévention pour découvrir les définitions clés de la santé et de la sécurité au travail. Glisse les cartes, apprends, teste-toi.',
  generator: 'Développé pour la formation santé-sécurité',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
