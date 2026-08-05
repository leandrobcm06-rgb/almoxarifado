import { createFileRoute, Link } from "@tanstack/react-router";
import { ClipboardList, Package2, Wrench, Monitor, ShieldAlert, ArrowRight } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/_authenticated/app/")({
  head: () => ({ meta: [{ title: "Boas Vindas | BCM Stock" }] }),
  component: WelcomePage,
});

function WelcomePage() {
  const { roles, hasAnyRole } = useAuth();

  const features = [
    {
      title: "Controle de Contagens",
      description: "Faça o balanço de estoque, realize rodadas cegas e analise divergências.",
      icon: <ClipboardList size={28} className="text-primary" />,
      link: "/app/contagens",
      roles: ["admin", "gestor", "conferente", "contador"]
    },
    {
      title: "Cobre",
      description: "Gerencie barras, pedaços, saídas, devoluções e histórico de cobre.",
      icon: <Package2 size={28} className="text-primary" />,
      link: "/app/cobre",
      roles: ["admin", "gestor", "conferente"]
    },
    {
      title: "Ferramentaria",
      description: "Controle as ferramentas, localizações e histórico de empréstimos.",
      icon: <Wrench size={28} className="text-primary" />,
      link: "/app/ferramentas",
      roles: ["admin", "gestor", "conferente"]
    },
    {
      title: "Patrimônios",
      description: "Gestão completa de bens patrimoniais, ativos, inativos e relatórios.",
      icon: <Monitor size={28} className="text-primary" />,
      link: "/app/patrimonios",
      roles: ["admin", "gestor"]
    },
    {
      title: "Administração",
      description: "Gerencie empresas, usuários e audite as ações do sistema.",
      icon: <ShieldAlert size={28} className="text-primary" />,
      link: "/app/usuarios",
      roles: ["admin"]
    }
  ];

  return (
    <div className="page-container animate-fade-in max-w-7xl mx-auto">
      <div className="page-header flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-none mb-4">
        <div className="page-title-area">
          <div className="page-title-text">
            <h1 className="page-title text-3xl font-bold tracking-tight">Boas Vindas</h1>
            <p className="page-subtitle text-lg">O hub central para gerenciar seus estoques, ferramentas e patrimônios.</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center py-10 mb-10 rounded-2xl border border-border/50 bg-gradient-to-b from-muted/30 to-background shadow-sm animate-scale-in">
        <img src="/Logo.jpeg" alt="BCM Stock Logo" className="h-28 md:h-36 object-contain rounded-2xl bg-white shadow-md p-2 transition-transform hover:scale-105 duration-300" />
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-6 text-foreground font-display tracking-tight flex items-center gap-2">
          Módulos do Sistema
        </h2>
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {features
            .filter((f) => hasAnyRole(f.roles as any))
            .map((feature, idx) => (
              <Link key={idx} to={feature.link} className="block group animate-fade-in-up" style={{ animationDelay: `${idx * 0.05}s` }}>
                <div className="h-full rounded-xl border border-border bg-card p-6 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:border-primary/50 group-hover:-translate-y-1 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-full -z-10 transition-transform group-hover:scale-125 duration-500"></div>
                  
                  <div className="mb-4 p-3.5 rounded-xl bg-primary/10 w-fit group-hover:bg-primary/20 transition-colors border border-primary/10">
                    {feature.icon}
                  </div>
                  
                  <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors font-display">
                    {feature.title}
                  </h3>
                  
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4 min-h-[40px]">
                    {feature.description}
                  </p>
                  
                  <div className="flex items-center text-xs font-semibold text-primary opacity-80 group-hover:opacity-100 transition-opacity mt-auto">
                    Acessar Módulo <ArrowRight size={14} className="ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
