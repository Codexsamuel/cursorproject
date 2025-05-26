import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/nextjs";
import MainLayout from "@/components/layout/MainLayout";

export default function NovaCoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SignedIn>
        <MainLayout>
          <div className="flex min-h-screen">
            {/* Sidebar NovaCore */}
            <aside className="w-64 bg-white shadow-sm">
              <nav className="px-4 py-6">
                <div className="space-y-1">
                  <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    CRM
                  </h2>
                  <a href="/novacore/crm/contacts" className="nav-link block py-2">
                    Contacts
                  </a>
                  <a href="/novacore/crm/deals" className="nav-link block py-2">
                    Opportunités
                  </a>
                  <a href="/novacore/crm/tasks" className="nav-link block py-2">
                    Tâches
                  </a>
                </div>

                <div className="mt-8 space-y-1">
                  <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Assistant IA
                  </h2>
                  <a href="/novacore/ai/chat" className="nav-link block py-2">
                    Chat IA
                  </a>
                  <a href="/novacore/ai/templates" className="nav-link block py-2">
                    Templates
                  </a>
                  <a href="/novacore/ai/history" className="nav-link block py-2">
                    Historique
                  </a>
                </div>

                <div className="mt-8 space-y-1">
                  <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Studio Dev
                  </h2>
                  <a href="/novacore/dev/scripts" className="nav-link block py-2">
                    Scripts
                  </a>
                  <a href="/novacore/dev/playground" className="nav-link block py-2">
                    Playground
                  </a>
                  <a href="/novacore/dev/docs" className="nav-link block py-2">
                    Documentation
                  </a>
                </div>
              </nav>
            </aside>

            {/* Contenu principal */}
            <main className="flex-1 bg-gray-50 p-6">
              {children}
            </main>
          </div>
        </MainLayout>
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
} 