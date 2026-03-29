# Analytics Copilot Demo

Assistant analytique NL2SQL construit avec Next.js, PostgreSQL et un endpoint LLM compatible OpenAI. Le projet transforme des questions en langage naturel en requetes SQL, execute ces requetes sur un dataset SaaS fictif puis restitue une reponse interpretee avec visualisation optionnelle.

## Pourquoi ce projet

- montrer un flux produit complet, de la question utilisateur jusqu'a l'insight exploitable
- combiner UX conversationnelle, generation SQL et visualisation de donnees
- proposer une base de demo realiste, mais entierement anonymisee

## Capacites

- chat analytique en francais
- generation SQL guidee par schema et modele semantique
- validation SQL avec tentative d'auto-correction
- graphiques automatiques pour les demandes de visualisation
- preview du dataset pour comprendre rapidement les tables exposees

## Stack

- Next.js 16
- React 19
- PostgreSQL 15
- OpenAI SDK sur endpoint LLM configurable
- Recharts
- Tailwind CSS 4
- Docker Compose

## Lancer le projet

1. Copier `.env.example` vers `.env`.
2. Renseigner `AI_API_KEY`.
3. Lancer `docker compose up --build`.
4. Ouvrir [http://localhost:3000](http://localhost:3000).

## Exemples de questions

- `Montre-moi la repartition du MRR par type d'offre sous forme de graphique.`
- `Quel est le MRR total actuel et sa croissance sur les 6 derniers mois ?`
- `Quels sont les 5 clients avec le MRR le plus eleve ?`
- `Liste les clients avec des factures en retard et le montant total du.`

## Structure

- [`next-app`](./next-app) : application Next.js
- [`db/init.sql`](./db/init.sql) : schema et jeu de donnees de demonstration
- [`metadata/semantic_model.yaml`](./metadata/semantic_model.yaml) : couche semantique utilisee dans les prompts
- [`terraform`](./terraform) : infrastructure d'exemple

## Notes

- Toutes les donnees presentes dans la base sont fictives.
- Le repo est prepare pour un usage public de demonstration.
- `AI_API_KEY` et `DATABASE_URL` sont les variables recommandees.
- `MISTRAL_API_KEY` et `DB_CONNEXION_STRING` restent acceptes en fallback pour compatibilite locale.
