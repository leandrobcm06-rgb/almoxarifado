import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Package } from "lucide-react";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [{ title: "Entrar | BCM Stock" }] }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nome, setNome] = useState("");
  const [tab, setTab] = useState<"login" | "signup">("login");

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/app" });
    });
  }, [navigate]);

  const getLoginEmail = (val: string) => val.includes('@') ? val : `${val}@bcmstock.local`;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const loginEmail = getLoginEmail(email);
    const { error } = await supabase.auth.signInWithPassword({ email: loginEmail, password });
    setLoading(false);
    if (error) toast.error(error.message);
    else {
      toast.success("Bem-vindo!");
      navigate({ to: "/app" });
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const loginEmail = getLoginEmail(email);
    const { error } = await supabase.auth.signUp({
      email: loginEmail,
      password,
      options: { data: { nome }, emailRedirectTo: `${window.location.origin}/app` },
    });
    setLoading(false);
    if (error) toast.error(error.message);
    else {
      toast.success("Conta criada! Você já pode acessar o sistema.");
      navigate({ to: "/app" });
    }
  };

  return (
    <div className="min-h-screen bg-muted/40 flex items-center justify-center p-4 animate-fade-in">
      <div className="w-full max-w-md">
        <div className="text-center mb-6 animate-scale-in">
          <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-white shadow-sm border border-border/50 mb-4">
            <img src="/Logo.jpeg" alt="BCM Eletricidade e Automação" className="h-14 w-auto object-contain" />
          </div>
          <h1 className="text-2xl font-bold font-display tracking-tight text-foreground">BCM Stock</h1>
          <p className="text-muted-foreground mt-1 text-sm">Controle de estoque corporativo</p>
        </div>

        <div className="glass-panel p-6 sm:p-8 rounded-2xl border-border shadow-lg">
          <div className="page-tabs mb-6 overflow-x-auto whitespace-nowrap pb-1">
            <button 
              className={`page-tab flex-1 flex-shrink-0 ${tab === 'login' ? 'page-tab--active' : ''}`}
              onClick={() => setTab('login')}
            >
              Entrar
            </button>
            <button 
              className={`page-tab flex-1 flex-shrink-0 ${tab === 'signup' ? 'page-tab--active' : ''}`}
              onClick={() => setTab('signup')}
            >
              Cadastrar
            </button>
          </div>

          {tab === "login" && (
            <form onSubmit={handleLogin} className="space-y-5 animate-fade-in-up">
              <div className="form-group">
                <label className="form-label">Usuário (ou Email)</label>
                <input 
                  type="text" 
                  required 
                  className="form-input" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value.toLowerCase().replace(/\s/g, ''))} 
                  placeholder="Ex: joao.silva"
                  autoFocus
                />
              </div>
              <div className="form-group">
                <label className="form-label">Senha (4 dígitos)</label>
                <input 
                  type="password" 
                  required 
                  minLength={4} 
                  maxLength={4} 
                  pattern="\d{4}" 
                  title="A senha deve conter exatamente 4 dígitos numéricos" 
                  className="form-input font-mono text-center tracking-[0.5em] text-lg py-2.5" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value.replace(/\D/g, ''))} 
                  placeholder="••••"
                  inputMode="numeric"
                />
              </div>
              <button type="submit" disabled={loading || !email || password.length !== 4} className="btn btn--primary w-full shadow-md shadow-primary/20 py-2.5 mt-2">
                {loading ? "Entrando..." : "Acessar Sistema"}
              </button>
            </form>
          )}

          {tab === "signup" && (
            <form onSubmit={handleSignup} className="space-y-4 animate-fade-in-up">
              <div className="form-group">
                <label className="form-label">Nome Completo</label>
                <input 
                  required 
                  className="form-input" 
                  value={nome} 
                  onChange={(e) => setNome(e.target.value)} 
                  placeholder="Ex: João da Silva"
                  autoFocus
                />
              </div>
              <div className="form-group">
                <label className="form-label">Nome de Usuário (para login)</label>
                <input 
                  type="text" 
                  required 
                  className="form-input" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value.toLowerCase().replace(/\s/g, ''))} 
                  placeholder="Ex: joao.silva"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Senha (4 dígitos)</label>
                <input 
                  type="password" 
                  required 
                  minLength={4} 
                  maxLength={4} 
                  pattern="\d{4}" 
                  title="A senha deve conter exatamente 4 dígitos numéricos" 
                  className="form-input font-mono text-center tracking-[0.5em] text-lg py-2.5" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value.replace(/\D/g, ''))} 
                  placeholder="••••"
                  inputMode="numeric"
                />
              </div>
              <button type="submit" disabled={loading || !nome || !email || password.length !== 4} className="btn btn--primary w-full shadow-md shadow-primary/20 py-2.5 mt-4">
                {loading ? "Criando..." : "Criar conta"}
              </button>
              <p className="text-[11px] text-muted-foreground text-center mt-4 bg-muted/30 p-2 rounded-md">
                O primeiro usuário cadastrado é admin. Os demais começam como contador e devem ser promovidos por um admin.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
