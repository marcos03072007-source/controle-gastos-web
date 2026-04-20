import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Controle de Gastos',
  description: 'Controle suas despesas pessoais',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  )
}
