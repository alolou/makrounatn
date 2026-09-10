import { HeadContent, Scripts, createRootRoute } from '@tanstack/react-router'
import '../styles.css'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'Makrouna Tounsia | Livraison de pâtes tunisiennes',
      },
      {
        name: 'description',
        content:
          'Commandez des pâtes tunisiennes maison au thon, poulpe, fruits de mer, anguille ou bœuf, livrées chez vous.',
      },
      {
        name: 'theme-color',
        content: '#110e0d',
      },
    ],
    links: [{ rel: 'icon', href: '/images/makrouna-tounsia.png' }],
  }),
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  )
}
