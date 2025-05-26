# DL Solutions - Écosystème Digital Africain

## Vision

DL Solutions est un écosystème digital complet visant à devenir la référence en Afrique pour la transformation numérique des entreprises et des services.

## Modules

- **NovaCore** : Plateforme IA SaaS (CRM + Assistant + Studio Dev)
- **NovaWorld** : Réseau pro B2B intelligent
- **DL Style** : Boutique e-commerce haut de gamme
- **DL Travel** : Agence de billetterie connectée
- **DL Insurance** : Produit d'assurance digitalisé
- **DL Bookmaker** : Système de paris sportifs avec IA
- **DL ERP** : Système interne centralisé

## Technologies

- Framework : Next.js 15 App Router
- Style : Tailwind CSS
- Backend & Auth : Supabase + Clerk
- IA : OpenAI GPT-4, OptimizeAI
- Paiement : Stripe + CinetPay
- Media : Cloudinary

## Installation

```bash
# Installation des dépendances
npm install

# Démarrage en développement
npm run dev

# Build pour production
npm run build
```

## Structure du projet

```
/
├── src/
│   ├── app/
│   ├── components/
│   ├── lib/
│   └── styles/
└── apps/
    ├── dl-vitrine/
    ├── novacore/
    ├── novaworld/
    ├── dl-style/
    ├── dl-travel/
    ├── dl-bookmaker/
    ├── dl-insurance/
    └── erp/
```

## Configuration requise

- Node.js 18+
- NPM 8+
- Clés API pour :
  - Clerk (Auth)
  - Supabase
  - OpenAI
  - Stripe
  - CinetPay
  - Cloudinary

## Contribution

1. Fork le projet
2. Créer une branche (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## License

Propriétaire - DL Solutions © 2024 