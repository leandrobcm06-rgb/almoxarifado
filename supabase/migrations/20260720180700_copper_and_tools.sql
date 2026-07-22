-- Módulo de Cobre

CREATE TABLE copper_bars (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    auxiliary_code TEXT NOT NULL,
    material TEXT NOT NULL,
    original_length_mm NUMERIC NOT NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE copper_pieces (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    bar_id UUID REFERENCES copper_bars(id) ON DELETE CASCADE,
    current_length_mm NUMERIC NOT NULL,
    status TEXT NOT NULL DEFAULT 'disponivel', -- disponivel, encerrado
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE copper_movements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    piece_id UUID REFERENCES copper_pieces(id) ON DELETE CASCADE,
    bar_id UUID REFERENCES copper_bars(id) ON DELETE CASCADE,
    type TEXT NOT NULL, -- entrada, saida, devolucao
    length_mm NUMERIC NOT NULL,
    client TEXT,
    pco TEXT,
    responsible TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Módulo de Ferramentas

CREATE TABLE tools (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    brand TEXT NOT NULL,
    model TEXT,
    specifications TEXT,
    patrimony_number TEXT,
    serial_number TEXT,
    status TEXT NOT NULL DEFAULT 'disponivel', -- disponivel, emprestada, manutencao, danificada
    condition TEXT NOT NULL, -- nova, boa, regular, ruim, danificada
    acquisition_date DATE,
    value NUMERIC,
    notes TEXT,
    photo_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE tool_loans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tool_id UUID REFERENCES tools(id) ON DELETE CASCADE,
    employee TEXT NOT NULL,
    client TEXT,
    pco TEXT,
    loan_date TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    expected_return_date DATE,
    actual_return_date TIMESTAMP WITH TIME ZONE,
    status TEXT NOT NULL DEFAULT 'ativo', -- ativo, devolvido
    proof_image_url TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE tool_movements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tool_id UUID REFERENCES tools(id) ON DELETE CASCADE,
    type TEXT NOT NULL, -- emprestimo, devolucao, manutencao, cadastro
    employee TEXT,
    client TEXT,
    pco TEXT,
    condition TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS (Row Level Security)

ALTER TABLE copper_bars ENABLE ROW LEVEL SECURITY;
ALTER TABLE copper_pieces ENABLE ROW LEVEL SECURITY;
ALTER TABLE copper_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE tool_loans ENABLE ROW LEVEL SECURITY;
ALTER TABLE tool_movements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Acesso total copper_bars" ON copper_bars FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "Acesso total copper_pieces" ON copper_pieces FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "Acesso total copper_movements" ON copper_movements FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "Acesso total tools" ON tools FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "Acesso total tool_loans" ON tool_loans FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "Acesso total tool_movements" ON tool_movements FOR ALL USING (auth.uid() IS NOT NULL);

-- Storage buckets para fotos e comprovantes
insert into storage.buckets (id, name, public) values ('tool-photos', 'tool-photos', true) on conflict do nothing;
insert into storage.buckets (id, name, public) values ('loan-receipts', 'loan-receipts', true) on conflict do nothing;

create policy "Upload para fotos de ferramentas logado" on storage.objects for insert to authenticated with check ( bucket_id = 'tool-photos' );
create policy "Update para fotos de ferramentas logado" on storage.objects for update to authenticated using ( bucket_id = 'tool-photos' );
create policy "Acesso publico para fotos de ferramentas" on storage.objects for select using ( bucket_id = 'tool-photos' );

create policy "Upload para comprovantes logado" on storage.objects for insert to authenticated with check ( bucket_id = 'loan-receipts' );
create policy "Acesso publico para comprovantes" on storage.objects for select using ( bucket_id = 'loan-receipts' );
