import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/nextjs";
import Link from "next/link";
import { usePathname } from "next/navigation";
import MainLayout from "@/components/layout/MainLayout";
import { 
  Users, 
  Briefcase, 
  CheckSquare, 
  MessageSquare, 
  FileText, 
  History, 
  Code, 
  PlayCircle, 
  BookOpen 
} from 'lucide-react';

const NavLink = ({ href, children, icon: Icon }: { href: string; children: React.ReactNode; icon: any }) => {
  const pathname = usePathname();
  const isActive = pathname === href;
  
  return (
    <Link 
      href={href}
      className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
        isActive 
          ? 'bg-blue-50 text-blue-600' 
          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
      }`}
    >
      <Icon className="w-5 h-5" />
      {children}
    </Link>
  );
};

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
            <aside className="w-64 bg-white border-r border-gray-200">
              <nav className="p-4 space-y-6">
                <div className="space-y-2">
                  <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3">
                    CRM
                  </h2>
                  <NavLink href="/novacore/crm/contacts" icon={Users}>
                    Contacts
                  </NavLink>
                  <NavLink href="/novacore/crm/deals" icon={Briefcase}>
                    Opportunités
                  </NavLink>
                  <NavLink href="/novacore/crm/tasks" icon={CheckSquare}>
                    Tâches
                  </NavLink>
                </div>

                <div className="space-y-2">
                  <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3">
                    Assistant IA
                  </h2>
                  <NavLink href="/novacore/ai/chat" icon={MessageSquare}>
                    Chat IA
                  </NavLink>
                  <NavLink href="/novacore/ai/templates" icon={FileText}>
                    Templates
                  </NavLink>
                  <NavLink href="/novacore/ai/history" icon={History}>
                    Historique
                  </NavLink>
                </div>

                <div className="space-y-2">
                  <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3">
                    Studio Dev
                  </h2>
                  <NavLink href="/novacore/dev/scripts" icon={Code}>
                    Scripts
                  </NavLink>
                  <NavLink href="/novacore/dev/playground" icon={PlayCircle}>
                    Playground
                  </NavLink>
                  <NavLink href="/novacore/dev/docs" icon={BookOpen}>
                    Documentation
                  </NavLink>
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