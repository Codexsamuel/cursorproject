# Composants Communs

Ce dossier contient les composants réutilisables de l'application mobile. Chaque composant est optimisé pour les performances et inclut des tests unitaires et d'intégration.

## OptimizedImage

Un composant d'image optimisé avec mise en cache et gestion des erreurs.

### Props

```typescript
interface OptimizedImageProps extends Omit<ImageProps, 'source'> {
  uri: string;                    // URL de l'image à charger
  fallbackUri?: string;           // URL de l'image de fallback en cas d'erreur
  priority?: 'low' | 'normal' | 'high';  // Priorité de chargement
  showLoadingIndicator?: boolean; // Afficher l'indicateur de chargement
  onLoadStart?: () => void;       // Callback au début du chargement
  onLoadEnd?: () => void;         // Callback à la fin du chargement
  onError?: (error: any) => void; // Callback en cas d'erreur
}
```

### Exemple d'utilisation

```tsx
<OptimizedImage
  uri="https://example.com/image.jpg"
  fallbackUri="https://example.com/fallback.jpg"
  priority="high"
  style={{ width: 200, height: 200 }}
  onError={(error) => console.error('Erreur de chargement:', error)}
/>
```

## AnimatedList

Une liste performante avec animations et gestion des états de chargement.

### Props

```typescript
interface AnimatedListProps<T> extends FlashListProps<T> {
  containerStyle?: ViewStyle;     // Style du conteneur
  loading?: boolean;              // État de chargement
  error?: string | null;          // Message d'erreur
  emptyMessage?: string;          // Message quand la liste est vide
  onRetry?: () => void;          // Callback pour réessayer
  ListHeaderComponent?: React.ComponentType<any> | React.ReactElement | null;
  ListFooterComponent?: React.ComponentType<any> | React.ReactElement | null;
  ListEmptyComponent?: React.ComponentType<any> | React.ReactElement | null;
}
```

### Exemple d'utilisation

```tsx
<AnimatedList
  data={items}
  renderItem={({ item }) => (
    <View>
      <Text>{item.title}</Text>
    </View>
  )}
  loading={isLoading}
  error={error}
  onRetry={handleRetry}
  emptyMessage="Aucun élément à afficher"
/>
```

## PageTransition

Un composant pour gérer les transitions de page avec différentes animations.

### Props

```typescript
interface PageTransitionProps {
  children: React.ReactNode;      // Contenu à animer
  type?: 'fade' | 'slide' | 'scale' | 'none';  // Type de transition
  duration?: number;              // Durée de la transition en ms
  style?: ViewStyle;              // Style personnalisé
  onTransitionEnd?: () => void;   // Callback à la fin de la transition
  testID?: string;                // ID pour les tests
}
```

### Exemple d'utilisation

```tsx
<PageTransition
  type="slide"
  duration={300}
  onTransitionEnd={() => console.log('Transition terminée')}
>
  <View>
    <Text>Contenu de la page</Text>
  </View>
</PageTransition>
```

## Performances

Les composants sont optimisés pour les performances avec :

- Mise en cache des images
- Recyclage des éléments de liste
- Animations fluides
- Gestion efficace de la mémoire
- Support du mode hors ligne

### Tests de Performance

Les tests de performance vérifient :

- Temps de rendu des listes (objectif : < 1000ms)
- Temps de changement de thème (objectif : < 100ms)
- Temps de chargement des images (objectif : < 200ms)
- Temps de mise à jour des listes (objectif : < 100ms)
- Utilisation de la mémoire (objectif : < 50MB)

## Tests

Chaque composant inclut :

- Tests unitaires
- Tests d'intégration
- Tests de performance
- Tests de thème
- Tests de gestion d'erreurs

Pour exécuter les tests :

```bash
npm test
```

Pour les tests de performance :

```bash
npm run test:performance
```

## Bonnes Pratiques

1. Utilisez toujours `OptimizedImage` au lieu de `Image` pour les images
2. Préférez `AnimatedList` à `FlatList` pour les listes longues
3. Utilisez `PageTransition` pour les transitions de page
4. Gérez toujours les états de chargement et d'erreur
5. Utilisez les props `testID` pour les tests
6. Respectez les limites de performance définies
7. Testez sur différents appareils et tailles d'écran 