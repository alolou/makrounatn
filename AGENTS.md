# AGENTS.md

## Projet

Makrouna Tounsia est une boutique de livraison de plats tunisiens construite avec TanStack Start et déployée sur Netlify. Le parcours principal est une page unique: découverte du menu, ajout au panier, saisie des coordonnées et confirmation de commande.

## Architecture

- `src/routes/index.tsx`: page boutique, panier, formulaire et soumission des commandes.
- `src/routes/api.orders.ts`: endpoint serveur validant les prix, enregistrant la commande et mettant à jour la fidélité.
- `src/data/products.ts`: source unique du catalogue et des prix.
- `src/styles.css`: identité visuelle et responsive design.
- `db/schema.ts`: tables Drizzle `customers` et `orders`.
- `db/index.ts`: client Netlify Database.
- `netlify/database/migrations/`: migrations appliquées au déploiement.
- `public/__forms.html`: squelette statique requis pour la détection Netlify Forms.
- `public/images/`: visuels de marque utilisés par le site.

## Conventions

- Utiliser TypeScript strict et des noms explicites.
- Conserver les prix côté serveur dans `src/data/products.ts`; ne jamais accepter un prix envoyé par le navigateur.
- Stocker les montants en dinars entiers tant que le catalogue ne contient pas de millimes.
- Utiliser le numéro de téléphone normalisé comme identifiant de fidélité.
- Garder les textes clients en français, avec des touches tunisiennes pertinentes.
- Respecter les variables de couleurs définies dans `src/styles.css`.
- Utiliser des composants React en PascalCase et des fonctions en camelCase.

## Décisions importantes

La commande est d’abord enregistrée dans Netlify Database. Une soumission Netlify Forms est ensuite envoyée pour déclencher les notifications configurées par le propriétaire. Une panne de notification ne supprime donc jamais une commande déjà enregistrée. La disponibilité de l’anguille, de l’espadon, les frais de livraison et les desserts du jour sont confirmés par téléphone.

## Commandes

- `pnpm dev`: développement local.
- `pnpm build`: compilation de production.
- `pnpm exec drizzle-kit generate --name <nom>`: génération d’une migration après toute modification du schéma.
