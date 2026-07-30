import { createFileRoute, Link } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ClipboardList, Package2, Wrench, Monitor, ShieldAlert } from "lucide-react";
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
      icon: <ClipboardList className="h-8 w-8 text-primary" />,
      link: "/app/contagens",
      roles: ["admin", "gestor", "conferente", "contador"]
    },
    {
      title: "Cobre",
      description: "Gerencie barras, pedaços, saídas, devoluções e histórico de cobre.",
      icon: <Package2 className="h-8 w-8 text-primary" />,
      link: "/app/cobre",
      roles: ["admin", "gestor", "conferente"]
    },
    {
      title: "Ferramentaria",
      description: "Controle as ferramentas, localizações e histórico de empréstimos.",
      icon: <Wrench className="h-8 w-8 text-primary" />,
      link: "/app/ferramentas",
      roles: ["admin", "gestor", "conferente"]
    },
    {
      title: "Patrimônios",
      description: "Gestão completa de bens patrimoniais, ativos, inativos e relatórios.",
      icon: <Monitor className="h-8 w-8 text-primary" />,
      link: "/app/patrimonios",
      roles: ["admin", "gestor"]
    },
    {
      title: "Administração",
      description: "Gerencie empresas, usuários e audite as ações do sistema.",
      icon: <ShieldAlert className="h-8 w-8 text-primary" />,
      link: "/app/usuarios",
      roles: ["admin"]
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Welcome Section */}
      <div className="flex flex-col items-center justify-center text-center space-y-4 py-10 bg-card rounded-xl border shadow-sm relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
        <img src="/logo.jpg" alt="BCM Stock Logo" className="h-32 md:h-40 object-contain rounded-xl shadow-lg border bg-white relative z-10" />
        <div className="relative z-10">
          <h1 className="text-4xl font-bold tracking-tight text-primary mt-4">Bem-vindo ao BCM Stock</h1>
          <p className="text-lg text-muted-foreground mt-2 max-w-2xl mx-auto">
            O hub central para gerenciar seus estoques, ferramentas e patrimônios.
          </p>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-6">Módulos do Sistema</h2>
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {features
            .filter((f) => hasAnyRole(f.roles as any))
            .map((feature, idx) => (
              <Link key={idx} to={feature.link} className="block group">
                <Card className="h-full transition-all hover:shadow-md hover:border-primary">
                  <CardHeader>
                    <div className="mb-2 p-3 rounded-lg bg-primary/10 w-fit group-hover:bg-primary/20 transition-colors">
                      {feature.icon}
                    </div>
                    <CardTitle className="group-hover:text-primary transition-colors">{feature.title}</CardTitle>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardHeader>
                </Card>
              </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
