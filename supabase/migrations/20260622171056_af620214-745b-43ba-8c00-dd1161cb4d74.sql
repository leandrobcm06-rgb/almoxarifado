
-- =========================================
-- ENUMS
-- =========================================
CREATE TYPE public.app_role AS ENUM ('admin', 'gestor', 'conferente', 'contador');
CREATE TYPE public.count_type AS ENUM ('geral', 'diaria');
CREATE TYPE public.count_status AS ENUM ('rascunho', 'em_contagem', 'aguardando_revisao', 'finalizada', 'cancelada');
CREATE TYPE public.round_status AS ENUM ('aberta', 'finalizada');
CREATE TYPE public.item_origin AS ENUM ('manual', 'foto');
CREATE TYPE public.ocr_status AS ENUM ('pendente', 'processando', 'concluido', 'erro');
CREATE TYPE public.divergence_status AS ENUM ('pendente', 'em_andamento', 'ajustado', 'ignorado');
CREATE TYPE public.snapshot_status AS ENUM ('rascunho', 'confirmado');

-- =========================================
-- PROFILES
-- =========================================
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  email TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- =========================================
-- USER ROLES
-- =========================================
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE OR REPLACE FUNCTION public.has_any_role(_user_id UUID, _roles public.app_role[])
RETURNS BOOLEAN
LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = ANY(_roles))
$$;

-- =========================================
-- TRIGGER FUNCTIONS
-- =========================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  is_first_user BOOLEAN;
BEGIN
  INSERT INTO public.profiles (id, nome, email)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'nome', split_part(NEW.email, '@', 1)), NEW.email);

  SELECT NOT EXISTS (SELECT 1 FROM public.user_roles) INTO is_first_user;
  IF is_first_user THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'admin');
  ELSE
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'contador');
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE OR REPLACE FUNCTION public.tg_set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public
AS $$ BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- Profiles policies
CREATE POLICY "Users view own profile or admins view all" ON public.profiles FOR SELECT TO authenticated
  USING (id = auth.uid() OR public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'gestor'));
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE TO authenticated
  USING (id = auth.uid()) WITH CHECK (id = auth.uid());

-- User roles policies
CREATE POLICY "Users view own roles" ON public.user_roles FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

-- =========================================
-- COMPANIES
-- =========================================
CREATE TABLE public.companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cnpj TEXT NOT NULL UNIQUE,
  nome TEXT NOT NULL,
  ativo BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.companies TO authenticated;
GRANT ALL ON public.companies TO service_role;
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated read companies" ON public.companies FOR SELECT TO authenticated USING (TRUE);
CREATE POLICY "Admins manage companies" ON public.companies FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- =========================================
-- PRODUCTS
-- =========================================
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  codigo TEXT NOT NULL UNIQUE,
  descricao TEXT NOT NULL,
  unidade TEXT NOT NULL DEFAULT 'UN',
  categoria TEXT,
  ativo BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.products TO authenticated;
GRANT ALL ON public.products TO service_role;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER products_updated_at BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();
CREATE POLICY "Authenticated read products" ON public.products FOR SELECT TO authenticated USING (TRUE);
CREATE POLICY "Admins/conferentes manage products" ON public.products FOR ALL TO authenticated
  USING (public.has_any_role(auth.uid(), ARRAY['admin','conferente']::public.app_role[]))
  WITH CHECK (public.has_any_role(auth.uid(), ARRAY['admin','conferente']::public.app_role[]));

CREATE INDEX idx_products_codigo ON public.products(codigo);
CREATE INDEX idx_products_descricao ON public.products USING gin (to_tsvector('portuguese', descricao));

-- =========================================
-- STOCK SNAPSHOTS
-- =========================================
CREATE TABLE public.stock_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  snapshot_date DATE NOT NULL DEFAULT CURRENT_DATE,
  status public.snapshot_status NOT NULL DEFAULT 'rascunho',
  created_by UUID REFERENCES auth.users(id),
  observacao TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  confirmed_at TIMESTAMPTZ
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.stock_snapshots TO authenticated;
GRANT ALL ON public.stock_snapshots TO service_role;
ALTER TABLE public.stock_snapshots ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated read snapshots" ON public.stock_snapshots FOR SELECT TO authenticated USING (TRUE);
CREATE POLICY "Admin/gestor/conferente manage snapshots" ON public.stock_snapshots FOR ALL TO authenticated
  USING (public.has_any_role(auth.uid(), ARRAY['admin','gestor','conferente']::public.app_role[]))
  WITH CHECK (public.has_any_role(auth.uid(), ARRAY['admin','gestor','conferente']::public.app_role[]));

CREATE TABLE public.stock_snapshot_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  snapshot_id UUID NOT NULL REFERENCES public.stock_snapshots(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id),
  company_id UUID NOT NULL REFERENCES public.companies(id),
  qty NUMERIC(14,3) NOT NULL DEFAULT 0,
  UNIQUE (snapshot_id, product_id, company_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.stock_snapshot_items TO authenticated;
GRANT ALL ON public.stock_snapshot_items TO service_role;
ALTER TABLE public.stock_snapshot_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated read snapshot items" ON public.stock_snapshot_items FOR SELECT TO authenticated USING (TRUE);
CREATE POLICY "Admin/gestor/conferente manage snapshot items" ON public.stock_snapshot_items FOR ALL TO authenticated
  USING (public.has_any_role(auth.uid(), ARRAY['admin','gestor','conferente']::public.app_role[]))
  WITH CHECK (public.has_any_role(auth.uid(), ARRAY['admin','gestor','conferente']::public.app_role[]));

CREATE INDEX idx_snapshot_items_product ON public.stock_snapshot_items(product_id);
CREATE INDEX idx_snapshot_items_snapshot ON public.stock_snapshot_items(snapshot_id);

-- =========================================
-- COUNTS
-- =========================================
CREATE TABLE public.counts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  tipo public.count_type NOT NULL,
  status public.count_status NOT NULL DEFAULT 'rascunho',
  snapshot_id UUID REFERENCES public.stock_snapshots(id),
  criado_por UUID REFERENCES auth.users(id),
  observacao TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  finalizado_em TIMESTAMPTZ
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.counts TO authenticated;
GRANT ALL ON public.counts TO service_role;
ALTER TABLE public.counts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated read counts" ON public.counts FOR SELECT TO authenticated USING (TRUE);
CREATE POLICY "Admin/gestor/conferente manage counts" ON public.counts FOR ALL TO authenticated
  USING (public.has_any_role(auth.uid(), ARRAY['admin','gestor','conferente']::public.app_role[]))
  WITH CHECK (public.has_any_role(auth.uid(), ARRAY['admin','gestor','conferente']::public.app_role[]));

CREATE TABLE public.count_rounds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  count_id UUID NOT NULL REFERENCES public.counts(id) ON DELETE CASCADE,
  rodada SMALLINT NOT NULL,
  status public.round_status NOT NULL DEFAULT 'aberta',
  contador_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  finalizado_em TIMESTAMPTZ,
  UNIQUE(count_id, rodada)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.count_rounds TO authenticated;
GRANT ALL ON public.count_rounds TO service_role;
ALTER TABLE public.count_rounds ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated read rounds" ON public.count_rounds FOR SELECT TO authenticated USING (TRUE);
CREATE POLICY "Roles manage rounds" ON public.count_rounds FOR ALL TO authenticated
  USING (public.has_any_role(auth.uid(), ARRAY['admin','gestor','conferente','contador']::public.app_role[]))
  WITH CHECK (public.has_any_role(auth.uid(), ARRAY['admin','gestor','conferente','contador']::public.app_role[]));

CREATE TABLE public.count_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  round_id UUID NOT NULL REFERENCES public.count_rounds(id) ON DELETE CASCADE,
  storage_path TEXT NOT NULL,
  ocr_status public.ocr_status NOT NULL DEFAULT 'pendente',
  ocr_result JSONB,
  uploaded_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.count_photos TO authenticated;
GRANT ALL ON public.count_photos TO service_role;
ALTER TABLE public.count_photos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated read photos" ON public.count_photos FOR SELECT TO authenticated USING (TRUE);
CREATE POLICY "Roles manage photos" ON public.count_photos FOR ALL TO authenticated
  USING (public.has_any_role(auth.uid(), ARRAY['admin','gestor','conferente','contador']::public.app_role[]))
  WITH CHECK (public.has_any_role(auth.uid(), ARRAY['admin','gestor','conferente','contador']::public.app_role[]));

CREATE TABLE public.count_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  round_id UUID NOT NULL REFERENCES public.count_rounds(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id),
  qty_contada NUMERIC(14,3) NOT NULL DEFAULT 0,
  origem public.item_origin NOT NULL DEFAULT 'manual',
  photo_id UUID REFERENCES public.count_photos(id),
  observacao TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(round_id, product_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.count_items TO authenticated;
GRANT ALL ON public.count_items TO service_role;
ALTER TABLE public.count_items ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER count_items_updated_at BEFORE UPDATE ON public.count_items FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();
CREATE POLICY "Authenticated read count items" ON public.count_items FOR SELECT TO authenticated USING (TRUE);
CREATE POLICY "Roles manage count items" ON public.count_items FOR ALL TO authenticated
  USING (public.has_any_role(auth.uid(), ARRAY['admin','gestor','conferente','contador']::public.app_role[]))
  WITH CHECK (public.has_any_role(auth.uid(), ARRAY['admin','gestor','conferente','contador']::public.app_role[]));

CREATE INDEX idx_count_items_round ON public.count_items(round_id);

-- =========================================
-- DIVERGENCE REPORTS
-- =========================================
CREATE TABLE public.divergence_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  count_id UUID NOT NULL REFERENCES public.counts(id) ON DELETE CASCADE,
  snapshot_id UUID NOT NULL REFERENCES public.stock_snapshots(id),
  gerado_por UUID REFERENCES auth.users(id),
  gerado_em TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.divergence_reports TO authenticated;
GRANT ALL ON public.divergence_reports TO service_role;
ALTER TABLE public.divergence_reports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated read reports" ON public.divergence_reports FOR SELECT TO authenticated USING (TRUE);
CREATE POLICY "Roles manage reports" ON public.divergence_reports FOR ALL TO authenticated
  USING (public.has_any_role(auth.uid(), ARRAY['admin','gestor','conferente']::public.app_role[]))
  WITH CHECK (public.has_any_role(auth.uid(), ARRAY['admin','gestor','conferente']::public.app_role[]));

CREATE TABLE public.divergence_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id UUID NOT NULL REFERENCES public.divergence_reports(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id),
  company_id UUID NOT NULL REFERENCES public.companies(id),
  saldo_sistema NUMERIC(14,3) NOT NULL DEFAULT 0,
  qty_contada NUMERIC(14,3) NOT NULL DEFAULT 0,
  diferenca NUMERIC(14,3) NOT NULL DEFAULT 0,
  ajuste_sugerido NUMERIC(14,3) NOT NULL DEFAULT 0,
  status public.divergence_status NOT NULL DEFAULT 'pendente',
  ajustado_por UUID REFERENCES auth.users(id),
  ajustado_em TIMESTAMPTZ,
  observacao TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.divergence_items TO authenticated;
GRANT ALL ON public.divergence_items TO service_role;
ALTER TABLE public.divergence_items ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER divergence_items_updated_at BEFORE UPDATE ON public.divergence_items FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();
CREATE POLICY "Authenticated read divergence items" ON public.divergence_items FOR SELECT TO authenticated USING (TRUE);
CREATE POLICY "Roles manage divergence items" ON public.divergence_items FOR ALL TO authenticated
  USING (public.has_any_role(auth.uid(), ARRAY['admin','gestor','conferente']::public.app_role[]))
  WITH CHECK (public.has_any_role(auth.uid(), ARRAY['admin','gestor','conferente']::public.app_role[]));

CREATE INDEX idx_div_items_report ON public.divergence_items(report_id);
CREATE INDEX idx_div_items_status ON public.divergence_items(status);

-- =========================================
-- AUDIT LOG
-- =========================================
CREATE TABLE public.audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  acao TEXT NOT NULL,
  entidade TEXT NOT NULL,
  entidade_id UUID,
  dados JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.audit_log TO authenticated;
GRANT ALL ON public.audit_log TO service_role;
ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admin/gestor read audit" ON public.audit_log FOR SELECT TO authenticated
  USING (public.has_any_role(auth.uid(), ARRAY['admin','gestor']::public.app_role[]));
CREATE POLICY "Authenticated insert audit" ON public.audit_log FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());

CREATE INDEX idx_audit_entity ON public.audit_log(entidade, entidade_id);
CREATE INDEX idx_audit_created ON public.audit_log(created_at DESC);

-- =========================================
-- STORAGE POLICIES for count-photos bucket
-- =========================================
CREATE POLICY "Authenticated upload count-photos" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'count-photos');
CREATE POLICY "Authenticated read count-photos" ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'count-photos');
CREATE POLICY "Authenticated delete count-photos" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'count-photos' AND public.has_any_role(auth.uid(), ARRAY['admin','gestor','conferente']::public.app_role[]));
