import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
  // Routes qui ne nécessitent pas d'authentification
  publicRoutes: [
    "/",
    "/api/webhook",
    "/dl-style(.*)", // La boutique est accessible sans connexion
    "/dl-travel(.*)", // La billetterie est accessible sans connexion
    "/api/public(.*)", // APIs publiques
    "/novacore", // NovaCore
    "/novaworld", // NovaWorld
    "/dl-insurance", // DL Insurance
    "/dl-bookmaker", // DL Bookmaker
    "/erp", // ERP
    "/about", // À propos
    "/contact", // Contact
    "/services", // Services
    "/images(.*)", // Images publiques
    "/_next(.*)", // Assets Next.js
    "/favicon.ico"
  ],
  
  // Routes qui nécessitent une authentification
  ignoredRoutes: [
    "/api/public(.*)", // Ne pas vérifier l'auth pour les routes publiques
    "/_next(.*)", // Ne pas vérifier l'auth pour les assets Next.js
    "/favicon.ico",
    "/images(.*)" // Ne pas vérifier l'auth pour les images
  ],
});

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
}; 