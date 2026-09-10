# Makrouna Tounsia

Site de commande en ligne pour une cuisine tunisienne spécialisée dans les pâtes au thon, poulpe, fruits de mer, anguille et bœuf. Les clients composent leur panier, indiquent leurs coordonnées et reçoivent une confirmation après l’enregistrement de leur commande.

## Technologies

- TanStack Start, React 19 et TypeScript
- Tailwind CSS avec une identité visuelle personnalisée
- Netlify Database et Drizzle ORM pour les clients, commandes et points fidélité
- Netlify Forms pour transmettre les nouvelles commandes aux notifications du projet
- Netlify pour le déploiement et l’exécution serveur

## Fonctionnalités

- Carte complète avec prix en dinars tunisiens
- Panier responsive et formulaire de livraison
- Paiement à la livraison avec confirmation téléphonique
- Fidélité automatique par numéro de téléphone
- Dessert offert à chaque dixième commande
- Enregistrement persistant des commandes
- Notification Netlify Forms contenant le détail de chaque commande

## Développement local

```bash
pnpm install
pnpm dev
```

Le site est disponible sur le port indiqué par Vite. Pour émuler les services Netlify localement, utiliser `netlify dev --port 8889`.

## Notifications de commande

Le formulaire `nouvelle-commande` est activé. Dans Netlify, ajouter l’adresse du restaurateur dans **Project configuration → Notifications → Emails and webhooks → Form submission notifications** afin de recevoir un email à chaque commande.

## Données

Le schéma se trouve dans `db/schema.ts`. Les migrations générées sont stockées dans `netlify/database/migrations/` et sont appliquées automatiquement au déploiement.
