-- Criação da função de gatilho genérica para auditoria
CREATE OR REPLACE FUNCTION public.tg_audit_log_v2()
RETURNS TRIGGER AS $$
DECLARE
    v_user_id UUID;
    v_acao TEXT;
    v_dados JSONB;
    v_entidade_id UUID;
BEGIN
    -- Obter o ID do usuário logado através do auth.uid() do Supabase
    v_user_id := auth.uid();
    
    -- Definir os valores dependendo do tipo de operação
    IF TG_OP = 'INSERT' THEN
        v_acao := 'Criação';
        v_dados := row_to_json(NEW)::jsonb;
        v_entidade_id := NEW.id;
    ELSIF TG_OP = 'UPDATE' THEN
        v_acao := 'Edição';
        v_dados := jsonb_build_object('antes', row_to_json(OLD)::jsonb, 'depois', row_to_json(NEW)::jsonb);
        v_entidade_id := NEW.id;
    ELSIF TG_OP = 'DELETE' THEN
        v_acao := 'Exclusão';
        v_dados := row_to_json(OLD)::jsonb;
        v_entidade_id := OLD.id;
    END IF;

    -- Inserir na tabela de auditoria (permitindo user_id nulo caso seja uma alteração por sistema)
    INSERT INTO public.audit_log (user_id, acao, entidade, entidade_id, dados)
    VALUES (v_user_id, v_acao, TG_TABLE_NAME, v_entidade_id, v_dados);

    -- Retornar o registro apropriado
    IF TG_OP = 'DELETE' THEN
        RETURN OLD;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Anexar a trigger nas tabelas principais
DO $$ 
DECLARE
    t TEXT;
    tabelas TEXT[] := ARRAY[
        'assets', 'asset_loans', 
        'tools', 'tool_loans', 'tool_locations',
        'copper_bars', 'copper_pieces', 'copper_movements',
        'counts', 'count_items', 'divergence_items',
        'profiles', 'user_roles'
    ];
BEGIN
    FOREACH t IN ARRAY tabelas
    LOOP
        EXECUTE format('
            DROP TRIGGER IF EXISTS trg_audit_%1$s ON public.%1$s;
            CREATE TRIGGER trg_audit_%1$s
            AFTER INSERT OR UPDATE OR DELETE ON public.%1$s
            FOR EACH ROW EXECUTE FUNCTION public.tg_audit_log_v2();
        ', t);
    END LOOP;
END $$;
