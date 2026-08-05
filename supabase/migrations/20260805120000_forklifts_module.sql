CREATE TABLE forklift_companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE forklift_clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE forklift_pcos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE forklift_services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE forklift_usages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id UUID REFERENCES forklift_services(id),
  service_other TEXT,
  client_id UUID REFERENCES forklift_clients(id),
  client_other TEXT,
  pco_id UUID REFERENCES forklift_pcos(id),
  pco_other TEXT,
  date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  total_hours NUMERIC(10,2) NOT NULL,
  company_id UUID REFERENCES forklift_companies(id) NOT NULL,
  observations TEXT,
  status_payment TEXT NOT NULL CHECK (status_payment IN ('Pendente', 'Faturado', 'Pago')) DEFAULT 'Pendente',
  billable BOOLEAN NOT NULL DEFAULT TRUE,
  user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- RLS
GRANT SELECT, INSERT, UPDATE, DELETE ON forklift_companies TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON forklift_clients TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON forklift_pcos TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON forklift_services TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON forklift_usages TO authenticated;

-- Disable RLS for now or enable it simply
ALTER TABLE forklift_companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE forklift_clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE forklift_pcos ENABLE ROW LEVEL SECURITY;
ALTER TABLE forklift_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE forklift_usages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read and write forklift_companies" ON forklift_companies FOR ALL TO authenticated USING (TRUE) WITH CHECK (TRUE);
CREATE POLICY "Authenticated users can read and write forklift_clients" ON forklift_clients FOR ALL TO authenticated USING (TRUE) WITH CHECK (TRUE);
CREATE POLICY "Authenticated users can read and write forklift_pcos" ON forklift_pcos FOR ALL TO authenticated USING (TRUE) WITH CHECK (TRUE);
CREATE POLICY "Authenticated users can read and write forklift_services" ON forklift_services FOR ALL TO authenticated USING (TRUE) WITH CHECK (TRUE);
CREATE POLICY "Authenticated users can read and write forklift_usages" ON forklift_usages FOR ALL TO authenticated USING (TRUE) WITH CHECK (TRUE);

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION set_updated_at_forklift_usages()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_set_updated_at_forklift_usages
BEFORE UPDATE ON forklift_usages
FOR EACH ROW
EXECUTE FUNCTION set_updated_at_forklift_usages();

-- Audit trigger
CREATE TRIGGER audit_forklift_usages
  AFTER INSERT OR UPDATE OR DELETE ON forklift_usages
  FOR EACH ROW EXECUTE FUNCTION public.audit_trigger_func();
