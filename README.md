# AGFA Frontend

Application React (SPA) pour la gestion financière de l'amicale **CERTT-UADB**. Elle consomme l'API REST Django documentée dans `../API_CONTRACT.md` et `../AGFA_FRONTEND_SKILL.md`.

## Stack

- React 19 + TypeScript (strict)
- Vite
- React Router 6
- TanStack Query 5
- Axios (JWT + refresh automatique)
- Tailwind CSS 3 + composants style shadcn/ui
- React Hook Form + Zod
- Sonner (toasts)

## Démarrage

```bash
cd frontend
cp .env.example .env   # si besoin
npm install
npm run dev
```

L'application est disponible sur [http://localhost:5173](http://localhost:5173).

## Configuration

Variable d'environnement dans `.env` :

```env
VITE_API_BASE_URL=http://localhost:8000
```

Le proxy Vite redirige `/api` vers le backend en développement.

## Backend

Démarrez l'API Django sur le port 8000 avec CORS activé pour `http://localhost:5173`.

## Fonctionnalités

| Module | Routes |
|--------|--------|
| Authentification JWT | `/login` |
| Tableau de bord | `/` |
| Membres (PR/TR) | `/membres` |
| Paiements (espèces + Wave) | `/paiements` |
| Dépenses | `/depenses` |
| Arriérés | `/arrieres` |
| Rapports mensuels | `/rapports` |
| Paramètres (PR/TR) | `/parametres` |
| Logs d'audit (PR/TR) | `/logs` |
| Profil | `/profil` |

Les écrans et permissions suivent la matrice définie dans `AGFA_FRONTEND_SKILL.md`.

## Build production

```bash
npm run build
npm run preview
```
