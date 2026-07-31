-- Adiciona Categoria e Valor aos Patrimônios
ALTER TABLE assets
ADD COLUMN category TEXT,
ADD COLUMN initial_value DECIMAL(12, 2);
