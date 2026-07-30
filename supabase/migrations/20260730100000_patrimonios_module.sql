-- Módulo de Patrimônios

CREATE TABLE assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    description TEXT NOT NULL,
    model TEXT,
    brand TEXT,
    asset_number TEXT NOT NULL UNIQUE,
    serial_number TEXT,
    responsible TEXT,
    location TEXT,
    condition TEXT NOT NULL, -- Ruim, Regular, Bom, Ótimo
    acquisition_date DATE,
    notes TEXT,
    status TEXT NOT NULL DEFAULT 'disponivel', -- disponivel, emprestado
    is_active BOOLEAN NOT NULL DEFAULT true,
    deactivation_reason TEXT,
    deactivation_date TIMESTAMP WITH TIME ZONE,
    deactivation_user TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE asset_loans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    asset_id UUID REFERENCES assets(id) ON DELETE CASCADE,
    withdrawn_by TEXT NOT NULL,
    destination TEXT NOT NULL,
    authorized_by TEXT NOT NULL,
    loan_date TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    expected_return_date DATE NOT NULL,
    actual_return_date TIMESTAMP WITH TIME ZONE,
    reason TEXT NOT NULL,
    notes TEXT,
    status TEXT NOT NULL DEFAULT 'em aberto', -- em aberto, devolvido, atrasado, cancelado
    returned_by TEXT,
    received_by TEXT,
    return_condition TEXT,
    return_notes TEXT,
    return_damages TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE asset_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    asset_id UUID REFERENCES assets(id) ON DELETE CASCADE,
    action TEXT NOT NULL, -- Cadastro, Edição, Empréstimo, Devolução, Ativação, Desativação, etc.
    description TEXT NOT NULL,
    user_name TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS (Row Level Security)
ALTER TABLE assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE asset_loans ENABLE ROW LEVEL SECURITY;
ALTER TABLE asset_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Acesso total assets" ON assets FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "Acesso total asset_loans" ON asset_loans FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "Acesso total asset_history" ON asset_history FOR ALL USING (auth.uid() IS NOT NULL);
