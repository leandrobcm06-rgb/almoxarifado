CREATE TABLE public.tool_locations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.tool_locations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Acesso total tool_locations" ON public.tool_locations FOR ALL USING (auth.uid() IS NOT NULL);

ALTER TABLE public.tools ADD COLUMN location_id UUID REFERENCES public.tool_locations(id) ON DELETE RESTRICT;
