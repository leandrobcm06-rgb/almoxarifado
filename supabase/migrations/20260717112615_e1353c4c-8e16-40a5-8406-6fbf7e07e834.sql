ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS cod_auxiliar text,
  ADD COLUMN IF NOT EXISTS fabricante text,
  ADD COLUMN IF NOT EXISTS localizacao text;
CREATE INDEX IF NOT EXISTS idx_products_cod_auxiliar ON public.products(cod_auxiliar);