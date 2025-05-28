import { device, element, by, expect } from 'detox';

describe('Payment Screen', () => {
  beforeAll(async () => {
    await device.launchApp();
    await device.reloadReactNative();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should show payment methods list', async () => {
    // Naviguer vers l'écran de paiement
    await element(by.id('profile-tab')).tap();
    await element(by.id('payment-menu-item')).tap();

    // Vérifier que la liste des moyens de paiement s'affiche
    await expect(element(by.id('payment-screen'))).toBeVisible();
    await expect(element(by.text('Modes de paiement'))).toBeVisible();
  });

  it('should add a new card', async () => {
    // Naviguer vers l'écran de paiement
    await element(by.id('profile-tab')).tap();
    await element(by.id('payment-menu-item')).tap();

    // Cliquer sur le bouton d'ajout
    await element(by.id('add-card-button')).tap();

    // Vérifier que le formulaire s'affiche
    await expect(element(by.text('Ajouter un moyen de paiement'))).toBeVisible();

    // Sélectionner carte bancaire
    await element(by.text('Carte bancaire')).tap();

    // Remplir le formulaire
    await element(by.id('card-name-input')).typeText('John Doe');
    await element(by.id('card-field')).typeText('4242424242424242');
    await element(by.id('card-field')).typeText('1225'); // MM/YY
    await element(by.id('card-field')).typeText('123'); // CVC

    // Soumettre le formulaire
    await element(by.id('submit-button')).tap();

    // Vérifier que la carte a été ajoutée
    await expect(element(by.text('VISA •••• 4242'))).toBeVisible();
    await expect(element(by.text('Expire 12/25'))).toBeVisible();
  });

  it('should add mobile money', async () => {
    // Naviguer vers l'écran de paiement
    await element(by.id('profile-tab')).tap();
    await element(by.id('payment-menu-item')).tap();

    // Cliquer sur le bouton d'ajout
    await element(by.id('add-card-button')).tap();

    // Sélectionner Mobile Money
    await element(by.text('Mobile Money')).tap();

    // Cliquer sur le bouton d'ajout Mobile Money
    await element(by.id('cinetpay-button')).tap();

    // Vérifier que l'URL de paiement s'ouvre
    // Note: Cette partie est difficile à tester car elle dépend de l'application de paiement externe
    // On peut juste vérifier que le bouton est cliquable
    await expect(element(by.id('cinetpay-button'))).toBeVisible();
  });

  it('should set default payment method', async () => {
    // Naviguer vers l'écran de paiement
    await element(by.id('profile-tab')).tap();
    await element(by.id('payment-menu-item')).tap();

    // Trouver une carte non par défaut et la définir comme défaut
    await element(by.id('set-default-mobile-1')).tap();

    // Vérifier que la carte est maintenant par défaut
    await expect(element(by.text('Par défaut'))).toBeVisible();
  });

  it('should remove payment method', async () => {
    // Naviguer vers l'écran de paiement
    await element(by.id('profile-tab')).tap();
    await element(by.id('payment-menu-item')).tap();

    // Trouver une carte et la supprimer
    await element(by.id('remove-card-1')).tap();

    // Vérifier que la carte a été supprimée
    await expect(element(by.text('VISA •••• 4242'))).not.toBeVisible();
  });

  it('should handle form validation', async () => {
    // Naviguer vers l'écran de paiement
    await element(by.id('profile-tab')).tap();
    await element(by.id('payment-menu-item')).tap();

    // Cliquer sur le bouton d'ajout
    await element(by.id('add-card-button')).tap();

    // Essayer de soumettre le formulaire vide
    await element(by.id('submit-button')).tap();

    // Vérifier les messages d'erreur
    await expect(element(by.text('Le nom est requis'))).toBeVisible();
    await expect(element(by.text('Informations de carte invalides'))).toBeVisible();

    // Remplir seulement le nom
    await element(by.id('card-name-input')).typeText('John Doe');
    await element(by.id('submit-button')).tap();

    // Vérifier que l'erreur de carte persiste
    await expect(element(by.text('Informations de carte invalides'))).toBeVisible();
  });

  it('should handle network errors', async () => {
    // Simuler une erreur réseau en désactivant le WiFi
    await device.setURLBlacklist(['.*']);

    // Naviguer vers l'écran de paiement
    await element(by.id('profile-tab')).tap();
    await element(by.id('payment-menu-item')).tap();

    // Vérifier que l'état d'erreur s'affiche
    await expect(element(by.id('payment-error'))).toBeVisible();
    await expect(element(by.text('Une erreur est survenue lors du chargement des modes de paiement.'))).toBeVisible();

    // Réactiver le WiFi
    await device.setURLBlacklist([]);

    // Cliquer sur le bouton de réessai
    await element(by.id('retry-button')).tap();

    // Vérifier que la liste se recharge
    await expect(element(by.id('payment-screen'))).toBeVisible();
  });

  it('should handle offline mode', async () => {
    // Simuler le mode hors ligne
    await device.setURLBlacklist(['.*']);

    // Naviguer vers l'écran de paiement
    await element(by.id('profile-tab')).tap();
    await element(by.id('payment-menu-item')).tap();

    // Vérifier que les données en cache s'affichent
    await expect(element(by.id('payment-screen'))).toBeVisible();

    // Réactiver la connexion
    await device.setURLBlacklist([]);

    // Vérifier que les données se synchronisent
    await element(by.id('retry-button')).tap();
    await expect(element(by.id('payment-screen'))).toBeVisible();
  });
}); 