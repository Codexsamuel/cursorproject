import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

describe('Database Tests', () => {
  // Nettoyer la base de données avant chaque test
  beforeEach(async () => {
    // Supprimer toutes les données de test
    await prisma.contactMessage.deleteMany();
    await prisma.notification.deleteMany();
    await prisma.bookingService.deleteMany();
    await prisma.service.deleteMany();
    await prisma.payment.deleteMany();
    await prisma.booking.deleteMany();
    await prisma.client.deleteMany();
    await prisma.user.deleteMany();
  });

  // Fermer la connexion après tous les tests
  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('User Operations', () => {
    it('should create a new user', async () => {
      const user = await prisma.user.create({
        data: {
          email: 'test@example.com',
          name: 'Test User',
          role: 'user',
          phone: '+237612345678',
        },
      });

      expect(user).toBeDefined();
      expect(user.email).toBe('test@example.com');
      expect(user.role).toBe('user');
    });

    it('should find a user by email', async () => {
      // Créer un utilisateur
      const createdUser = await prisma.user.create({
        data: {
          email: 'find@example.com',
          name: 'Find User',
          role: 'user',
        },
      });

      // Rechercher l'utilisateur
      const foundUser = await prisma.user.findUnique({
        where: { email: 'find@example.com' },
      });

      expect(foundUser).toBeDefined();
      expect(foundUser?.id).toBe(createdUser.id);
    });
  });

  describe('Client Operations', () => {
    it('should create a client with a user', async () => {
      // Créer d'abord un utilisateur
      const user = await prisma.user.create({
        data: {
          email: 'agent@example.com',
          name: 'Agent User',
          role: 'user',
        },
      });

      // Créer un client lié à cet utilisateur
      const client = await prisma.client.create({
        data: {
          name: 'Test Client',
          email: 'client@example.com',
          phone: '+237612345679',
          type: 'individual',
          userId: user.id,
        },
      });

      expect(client).toBeDefined();
      expect(client.userId).toBe(user.id);
      expect(client.type).toBe('individual');
    });
  });

  describe('Contact Message Operations', () => {
    it('should create a contact message', async () => {
      const message = await prisma.contactMessage.create({
        data: {
          name: 'John Doe',
          email: 'john@example.com',
          phone: '+237612345680',
          subject: 'Test Message',
          message: 'This is a test message',
          service: 'hotel',
        },
      });

      expect(message).toBeDefined();
      expect(message.status).toBe('new');
      expect(message.service).toBe('hotel');
    });
  });
}); 