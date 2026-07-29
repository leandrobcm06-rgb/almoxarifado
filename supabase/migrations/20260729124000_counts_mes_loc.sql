-- Migration to add mes and location bounds to counts
ALTER TABLE public.counts ADD COLUMN mes TEXT;
ALTER TABLE public.counts ADD COLUMN loc_start TEXT;
ALTER TABLE public.counts ADD COLUMN loc_end TEXT;
