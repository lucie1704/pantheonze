# PanthéOnze

**Votre pâtisserie artisanale du 11ème arrondissement de Paris**

Commandez vos pâtisseries artisanales en ligne et récupérez-les dans notre boutique selon vos créneaux. Savourez la gourmandise à la 11e !

## Concept

PanthéOnze est une plateforme e-commerce moderne pour une pâtisserie artisanale parisienne. Les clients peuvent :

- **Parcourir** un catalogue de pâtisseries artisanales
- **Filtrer** selon leurs préférences alimentaires (végétarien, vegan, sans gluten, etc.)
- **Commander** en ligne avec un système de panier
- **Choisir** leur créneau de retrait
- **Gérer** leurs préférences alimentaires via leur profil

## Stack technique

### Backend
- **Node.js** avec **Express.js**
- **TypeScript**
- **Prisma** ORM avec **MongoDB**

### Frontend
- **Vue.js 3** 
- **TypeScript** 
- **PrimeVue** librairie de composants UI
- **Pinia**
- **Vue Router**
- **Vite**

## Installation

### Backend
```bash
cd backend
docker compose up -d
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Fixtures & Comptes de test

| Prénom | Nom | Email | Mot de passe | Rôle | Préférences |
|--------|-----|-------|--------------|------|-------------|
| Jérôme | BOUCHET | `admin@demo.com` | `P@nt3h0nz3_2025!` | Admin | - |
| Andrée | FAIRE | `andree.faire@demo.com` | `P@nt3h0nz3_2025!` | Gérant | - |
| Marie | JACQUES | `marie.jacques@demo.com` | `P@nt3h0nz3_2025!` | Client | Vegan + Sans Gluten |
| Pierre | LAROCHE | `pierre.laroche@demo.com` | `P@nt3h0nz3_2025!` | Client | Sans Sucre + Sans Lactose |
| Sophie | OLIVIER | `sophie.olivier@demo.com` | `P@nt3h0nz3_2025!` | Client | Aucune |

### Données de test
- **25+ pâtisseries** artisanales avec images
- **5 catégories** : Viennoiseries, Pâtisseries, Gâteaux, Petits gâteaux, Tartes
- **5 régimes alimentaires** : Végétarien, Vegan, Sans Gluten, Sans Lactose, Sans Sucre

## Fonctionnalités

### Gestion des utilisateurs
- Inscription/Connexion sécurisée
- Profils utilisateurs avec préférences alimentaires
- Rôles : Client, Gérant, Administrateur

### Système de commande
- Panier dynamique
- Filtrage par préférences alimentaires
- Système de retrait par créneaux
- Historique des commandes

### Interface responsive
- Design adaptatif mobile/desktop
- Composants PrimeVue modernes
- Navigation intuitive
- États de chargement et gestion d'erreurs
