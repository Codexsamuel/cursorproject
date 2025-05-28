const nextJest = require('next/jest');

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './',
});

// Add any custom config to be passed to Jest
const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  // Configuration pour les tests de base de données
  testMatch: [
    '**/__tests__/**/*.test.[jt]s?(x)',
  ],
  // Utiliser l'environnement node pour les tests de base de données
  testEnvironmentOptions: {
    customExportConditions: ['node', 'node-addons'],
  },
  // Ignorer les tests de base de données dans l'environnement jsdom
  testPathIgnorePatterns: [
    '/node_modules/',
    '/.next/',
    '/src/__tests__/database/',
  ],
};

// Configuration spécifique pour les tests de base de données
const databaseJestConfig = {
  ...customJestConfig,
  testEnvironment: 'jest-environment-node',
  testMatch: [
    '**/__tests__/database/**/*.test.[jt]s?(x)',
  ],
};

// Exporter les deux configurations
module.exports = {
  ...createJestConfig(customJestConfig),
  projects: [
    createJestConfig(customJestConfig),
    createJestConfig(databaseJestConfig),
  ],
}; 