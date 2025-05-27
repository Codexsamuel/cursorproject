# Problèmes connus et améliorations

## Problèmes de typage

### FlashList et AnimatedFlashList Type Compatibility
**Statut**: En cours d'investigation
**Priorité**: Moyenne
**Fichiers concernés**:
- `mobile-app/src/components/common/AnimatedList.tsx`
- `mobile-app/src/types/flash-list.ts`

**Description**:
Il y a un problème de compatibilité de types entre `FlashList` et `AnimatedFlashList` dans le composant `AnimatedList`. Le problème spécifique concerne le typage du `renderItem` prop, où TypeScript ne peut pas correctement inférer les types génériques entre les deux composants.

**Erreur actuelle**:
```typescript
Type 'ListRenderItem<T>' is not assignable to type 'ListRenderItem<unknown> | SharedValue<ListRenderItem<unknown> | null | undefined> | null | undefined'.
Type 'unknown' is not assignable to type 'T'.
```

**Solutions potentielles à explorer**:
1. Créer un type wrapper personnalisé pour `AnimatedFlashList`
2. Utiliser une approche de type assertion plus spécifique
3. Modifier la structure du composant pour éviter le besoin de conversion de types
4. Mettre à jour vers une version plus récente de `@shopify/flash-list` qui pourrait avoir une meilleure gestion des types

**Impact**:
- Le code fonctionne en production mais avec des avertissements TypeScript
- Pas d'impact sur les fonctionnalités
- Peut causer des problèmes lors de l'utilisation de l'autocomplétion et de la vérification de types

## Améliorations futures

### Performance
- [ ] Optimiser le rendu des listes avec virtualisation
- [ ] Implémenter le lazy loading pour les images
- [ ] Ajouter la mise en cache des données

### UX/UI
- [ ] Améliorer les animations de transition
- [ ] Ajouter des états de chargement plus élégants
- [ ] Implémenter le mode hors ligne

### Architecture
- [ ] Refactoriser la gestion d'état globale
- [ ] Améliorer la gestion des erreurs
- [ ] Ajouter plus de tests unitaires et d'intégration 