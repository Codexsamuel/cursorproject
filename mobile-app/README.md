# NovaCore CRM Mobile

Application mobile de gestion de la relation client (CRM) développée avec Expo et React Native.

## Fonctionnalités

- 🔐 Authentification sécurisée
- 👥 Gestion des contacts
- 📝 Notes et suivi
- ⚙️ Paramètres personnalisables
- 🌙 Thème clair/sombre
- 🔔 Notifications

## Prérequis

- Node.js (v18 ou supérieur)
- npm ou yarn
- Expo CLI
- iOS Simulator (pour Mac) ou Android Studio (pour le développement Android)

## Installation

1. Cloner le dépôt :
```bash
git clone [URL_DU_REPO]
cd mobile-app
```

2. Installer les dépendances :
```bash
npm install
# ou
yarn install
```

3. Configurer l'environnement :
- Copier `.env.example` vers `.env`
- Remplir les variables d'environnement nécessaires

4. Lancer l'application :
```bash
npm start
# ou
yarn start
```

## Scripts disponibles

- `npm start` : Lance le serveur de développement Expo
- `npm run android` : Lance l'application sur un émulateur Android
- `npm run ios` : Lance l'application sur un simulateur iOS
- `npm run lint` : Vérifie le code avec ESLint
- `npm run type-check` : Vérifie les types TypeScript

## Structure du projet

```
mobile-app/
├── src/
│   ├── components/     # Composants réutilisables
│   ├── contexts/       # Contextes React
│   ├── navigation/     # Configuration de la navigation
│   ├── screens/        # Écrans de l'application
│   ├── services/       # Services (API, etc.)
│   ├── theme/          # Thème et styles
│   └── types/          # Types TypeScript
├── assets/            # Images et ressources
└── ...
```

## Contribution

1. Fork le projet
2. Créer une branche pour votre fonctionnalité
3. Commiter vos changements
4. Pousser vers la branche
5. Ouvrir une Pull Request

## Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails. 