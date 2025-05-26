import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
  // Routes qui ne nécessitent pas d'authentification
  publicRoutes: [
    "/",
    "/api/webhook",
    "/dl-style(.*)", // La boutique est accessible sans connexion
    "/dl-travel(.*)", // La billetterie est accessible sans connexion
    "/api/public(.*)" // APIs publiques
  ],
  
  // Routes qui nécessitent une authentification
  ignoredRoutes: [
    "/api/public(.*)", // Ne pas vérifier l'auth pour les routes publiques
    "/_next(.*)", // Ne pas vérifier l'auth pour les assets Next.js
    "/favicon.ico"
  ],
});

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
}; 