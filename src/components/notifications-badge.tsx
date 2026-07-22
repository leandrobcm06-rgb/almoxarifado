import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Bell, AlertTriangle, HardHat, Package2, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { format, isBefore } from "date-fns";
import { Link } from "@tanstack/react-router";

export function NotificationsBadge() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadNotifications() {
      try {
        const newNotifications = [];
        
        // 1. Ferramentas Atrasadas
        const today = new Date().toISOString();
        const { data: delayedLoans } = await supabase
          .from("tool_loans")
          .select("*, tool:tools(name)")
          .eq("status", "ativo")
          .lt("expected_return_date", today);
        
        if (delayedLoans && delayedLoans.length > 0) {
          delayedLoans.forEach(loan => {
            newNotifications.push({
              id: `loan-${loan.id}`,
              type: "atraso",
              title: "Devolução Atrasada",
              message: `A ferramenta ${loan.tool?.name} não foi devolvida por ${loan.employee}.`,
              link: "/app/ferramentas/emprestimos",
              icon: HardHat,
              color: "text-red-500"
            });
          });
        }

        // 2. Ferramentas em Manutenção/Danificadas
        const { data: brokenTools } = await supabase
          .from("tools")
          .select("*")
          .in("status", ["manutencao", "danificada"]);
          
        if (brokenTools && brokenTools.length > 0) {
          brokenTools.forEach(tool => {
            newNotifications.push({
              id: `tool-${tool.id}`,
              type: "manutencao",
              title: "Ferramenta Inoperante",
              message: `${tool.name} está ${tool.status}.`,
              link: "/app/ferramentas/lista",
              icon: Wrench,
              color: "text-orange-500"
            });
          });
        }

        // 3. Cobre - Baixo Estoque
        const { data: bars } = await supabase.from("copper_bars").select("*, pieces:copper_pieces(current_length_mm, status)");
        if (bars) {
          bars.forEach(bar => {
            const availablePieces = bar.pieces.filter((p: any) => p.status === 'disponivel');
            const totalMm = availablePieces.reduce((acc: number, p: any) => acc + Number(p.current_length_mm), 0);
            
            if (totalMm === 0) {
              newNotifications.push({
                id: `bar-zero-${bar.id}`,
                type: "cobre-zero",
                title: "Cobre Esgotado",
                message: `A barra ${bar.name} não possui saldo disponível.`,
                link: "/app/cobre/barras",
                icon: Package2,
                color: "text-red-500"
              });
              } else if (totalMm < 1000) { // Configurable limit (1000mm)
                newNotifications.push({
                  id: `bar-low-${bar.id}`,
                  type: "cobre-baixo",
                  title: "Cobre Acabando",
                  message: `A barra ${bar.name} está com saldo baixo (${(totalMm / 1000).toFixed(2)} m).`,
                  link: "/app/cobre/barras",
                  icon: Package2,
                color: "text-orange-500"
              });
            }
          });
        }

        setNotifications(newNotifications);
      } catch (error) {
        console.error("Erro ao carregar notificações", error);
      } finally {
        setLoading(false);
      }
    }

    loadNotifications();
    // Poll every 5 minutes
    const interval = setInterval(loadNotifications, 300000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <Button variant="ghost" size="icon" className="relative"><Bell className="h-5 w-5 opacity-50" /></Button>;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {notifications.length > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 rounded-full bg-red-500 text-white border-2 border-background">
              {notifications.length > 9 ? "9+" : notifications.length}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 max-h-96 overflow-y-auto">
        <div className="flex items-center justify-between px-4 py-2 border-b">
          <span className="font-semibold">Notificações</span>
          <Badge variant="secondary">{notifications.length}</Badge>
        </div>
        {notifications.length === 0 ? (
          <div className="p-4 text-center text-sm text-muted-foreground">
            Tudo certo por aqui! Nenhuma pendência.
          </div>
        ) : (
          <div className="py-2">
            {notifications.map((notif) => {
              const Icon = notif.icon;
              return (
                <DropdownMenuItem key={notif.id} asChild className="p-3 cursor-pointer items-start gap-3 border-b last:border-0">
                  <Link to={notif.link as any} className="flex w-full">
                    <Icon className={`h-5 w-5 mt-0.5 shrink-0 ${notif.color}`} />
                    <div className="flex flex-col gap-1">
                      <span className="text-sm font-medium leading-none">{notif.title}</span>
                      <span className="text-xs text-muted-foreground line-clamp-2">{notif.message}</span>
                    </div>
                  </Link>
                </DropdownMenuItem>
              );
            })}
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
