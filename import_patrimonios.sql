-- Inserção de dados do Patrimônio

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00001', 'MONITOR', 'ISRAEL', 'ARQUIVO MORTO', 'LG FLATRON E22411940S - PN', 'LG', '1098PPB31416', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00002', 'MONITOR', 'BCM - ADM', 'ARQUIVO MORTO', 'B2030N', 'SAMSUNG', 'LS20PUYKFMZD', 'Bom', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00004', 'MOUSE', 'BCM - ADM', 'ESCRITÓRIO ENGENHARIA ', 'HP GARNING M260', 'HP', 'B1M260ELO3002172', 'Bom', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00005', 'CALCULADORA PROCALC', 'SÉRGIO', 'HUB DE ESTRATÉGIA E GESTÃO', 'PR5000T', 'PROCALC', '1750001598', 'Bom', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00006', 'GABINETE', 'BCM - ADM', 'ARQUIVO MORTO', 'SONY MOD.WSCV 2151/2307', 'SONY', 'GPDD0077LK006007', 'Bom', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00007', 'MONITOR', 'IGOR', 'CONTROLE - GALPÃO', '22IEL', 'PHILIPS', 'FX1A1145051338', 'Bom', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00008', 'COMPUTADOR ', 'SÉRGIO', 'HUB DE ESTRATÉGIA E GESTÃO', 'GABINETE ', 'MATX 130', '130GSX211001030', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00009', 'MOUSE', 'HENRIQUE', 'HUB DE ESTRATÉGIA E GESTÃO', 'GAMING MOUSE M160', 'M160', 'B9M160EL1105314', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00010', 'TECLADO', 'PEDRO', 'HUB DE ESTRATÉGIA E GESTÃO', 'WIRELESS KEYBOARD 3000 V2,0', 'DELL', 'CCAJ17LPA1F0T0', 'Bom', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00011', 'NOBREAK', 'HENRIQUE', 'HUB DE ESTRATÉGIA E GESTÃO', 'STATION', 'SMS', '273950340230', 'Bom', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00012', 'FONE DE OUVIDO', 'HENRIQUE', 'HUB DE ESTRATÉGIA E GESTÃO', NULL, 'JBL', '-', 'Bom', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00014', 'MONITOR', 'IGOR', 'CONTROLE - GALPÃO', '22IEL', 'PHILIPS', 'FX1A1145051370', 'Bom', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00015', 'MONITOR', 'BCM - ADM', 'ARQUIVO MORTO', 'FLATRON W2043S', 'LG', 'FX3A1142053228', 'Bom', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00016', 'COMPUTADOR', 'BCM - ADM', 'ARQUIVO MORTO', 'GABINETE  GM06T7BN0C10N0X', NULL, '8170605001027', 'Bom', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00017', 'COMPUTADOR', 'ISRAEL', 'ALMOXARIFADO', 'GABINETE', 'LG', '89488', 'Bom', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00018', 'MOUSE', 'BCM - ADM', 'ALMOXARIFADO', 'WS568', NULL, '26011100147936', 'Bom', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00019', 'MOUSE', 'BCM - ADM', 'ESCRITÓRIO ENGENHARIA', 'NT', NULL, '-', 'Bom', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00020', 'TECLADO', 'BCM - ADM', 'ESCRITÓRIO ENGENHARIA', 'HARDLINE', NULL, '-', 'Ruim', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00022', 'TELEFONE ', 'BCM - ADM', 'ALMOXARIFADO', 'INTELBRAS PLENO', NULL, '107896637609296', 'Bom', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00023', 'ESTABILIZADOR ', 'EDUARDO', 'ALMOXARIFADO', 'TS SHARA', NULL, '15748', 'Bom', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00024', 'MONITOR', 'BCM - ADM', 'ARQUIVO MORTO', 'FLATRON E1940', 'LG', '104SPGS0S775', 'Bom', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00025', 'MONITOR', 'BCM - ADM', 'HUB DE ESTRATÉGIA E GESTÃO', NULL, 'PCFORT', '-', 'Bom', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00026', 'MONITOR', 'BCM - ADM', 'HUB DE ESTRATÉGIA E GESTÃO', NULL, 'PCFORT', '-', 'Bom', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00027', 'CPU', 'EDUARDO', 'ALMOXARIFADO', 'UPA 01.870', 'VISION', '-', 'Bom', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00028', 'NOBREAK', 'KARINA', 'ESCRITÓRIO ADM', NULL, 'SMS', '-', 'Bom', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00029', 'TECLADO', 'BCM - ADM', 'ESCRITÓRIO ENGENHARIA', NULL, 'C3TECH', '-', 'Ruim', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00030', 'MOUSE', 'SÁVIO', 'HOME OFFICE', 'GAMING MOUSE M260', 'HP', '-', 'Bom', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00031', 'CELULAR', 'HENRIQUE', 'HUB DE ESTRATÉGIA E GESTÃO', 'SM-J610G', 'SAMSUNG', '-', 'Bom', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00032', 'TELEFONE INTELBRAS', 'KARINA', 'HUB DE ESTRATÉGIA E GESTÃO', 'TC500', 'INTELBRAS', 'TG10112600394', 'Bom', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00033', 'COMPUTADOR', 'PEDRO', 'HUB DE ESTRATÉGIA E GESTÃO', 'LENOVO -MT - M 5/864 -BQ2  S/N L1BTZAA', 'LENOVO', 'IS5864BQ2L1BB0XC', 'Regular', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00034', 'MONITOR ', 'BCM - ADM', 'ARQUIVO MORTO', 'PHILIPS 202EL', 'PHILIPS', 'FXA1145052621', 'Bom', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00035', 'MOUSE ', 'BCM - ADM', 'ESCRITÓRIO ENGENHARIA', 'DX -120 GM-150008 - GENIUS', NULL, 'S/N: X6H93006902786', 'Bom', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00036', 'TECLADO ', 'BCM - ADM', 'HUB DE ESTRATÉGIA E GESTÃO', NULL, 'C3TECH', '123835', 'Bom', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00037', 'ESTABILIZADOR ', 'BCM - ADM', 'ARQUIVO MORTO', 'SMS', 'SMS', '165111181741', 'Bom', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00038', 'MONITOR  ', 'BCM - ADM', 'ARQUIVO MORTO', 'PHILIPS 191EL', 'PHILIPS', 'FX1A1121056399', 'Bom', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00039', 'CELULAR', 'SÉRGIO', 'HUB DE ESTRATÉGIA E GESTÃO', 'GALAXY A02s', NULL, 'R9XR602K8ML', 'Bom', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00040', 'NOTEBOOK', 'LUIZ', 'ESCRITÓRIO ENGENHARIA', 'INSPIRON 5548 ', 'DELL', 'B6GRB92', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00041', 'MONITOR', 'TOMÁS', 'LÓGICA', 'P2419H ', 'DELL', 'BR-01XCG2-TVB00-19L-3R7B-A10', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00042', 'MONITOR', 'TOMÁS', 'LÓGICA', 'P2419H ', 'DELL', 'BR-01XCG2-TVB00-19L-3R7B-A10', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00043', 'MOUSE', 'BCM - ADM', 'ALMOXARIFADO', NULL, 'DELL', 'CN-0PRDV9-LO300-94H-OFEX', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00044', 'TECLADO', 'BCM - ADM', 'ALMOXARIFADO', 'GK-20BK C3', 'TECH', '72029394003002900', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00047', 'MONITOR', 'EDGARD', 'LÓGICA', 'P2319H ', 'DELL', 'BR-0PDKON-TVB00-948-43BL-A04', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00048', 'MONITOR', 'EDGARD', 'LÓGICA', 'P2319H ', 'DELL', 'BR-0PDKON-TVB00-948-43BL-A04', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00049', 'DOCKSTATION', 'MARCELO', 'HUB DE ESTRATÉGIA E GESTÃO', 'WD19S ', 'DELL', 'CN-04JXDM-CMC00-19M-1674-A00', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00050', 'NOTEBOOK', 'KELLEN', 'HUB DE ESTRATÉGIA E GESTÃO', 'INSPIRON 15 P70F DELL', 'DELL', '7DMX9X2', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00051', 'TECLADO ', 'GUILHERME', 'LÓGICA', 'TECLADO ', 'DELL', 'CN-09J99W-LO300-95R-0CHE-AO3', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00052', 'MOUSE', 'GUILHERME', 'LÓGICA', 'MOUSE HP M260', 'HP', 'B1M260EL03002399', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00053', 'HEADSET', 'TOMÁS', 'LÓGICA', 'Quantum 100', 'JBL', 'CM0073-HL0755362', 'Regular', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00054', 'NOTEBOOK', 'CLAUDIO M.', 'HUB DE ESTRATÉGIA E GESTÃO', 'VOSTRO 15 5510', 'DELL', '00355-60688-62735-AAOEM', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00055', 'MONITOR', 'CLAUDIO M.', 'HUB DE ESTRATÉGIA E GESTÃO', NULL, 'SAMSUNG', 'Y45KHX5W301777A', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00056', 'MONITOR', 'CLAUDIO M.', 'HUB DE ESTRATÉGIA E GESTÃO', NULL, 'SAMSUNG', 'Y45KHX5W303850X', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00057', 'DOCK STATION', 'CLAUDIO M.', 'HUB DE ESTRATÉGIA E GESTÃO', NULL, 'DELL', '33162932487', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00058', 'NOBREAK', 'CLAUDIO M.', 'HUB DE ESTRATÉGIA E GESTÃO', NULL, 'SMS', '273950340249', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00059', 'NOTEBOOK', 'LEANDRO', 'ALMOXARIFADO ', NULL, 'DELL', '14675695273', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00060', 'TELEFONE', 'MARCELO', 'HUB DE ESTRATÉGIA E GESTÃO', NULL, 'NKS', '-', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00061', 'MONITOR', 'BCM - ADM', 'ESCRITÓRIO ENGENHARIA', NULL, 'PHILIPS', '-', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00062', 'TECLADO', 'MARCELO', 'HUB DE ESTRATÉGIA E GESTÃO', 'TGK305', NULL, 'RD20091100522', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00063', 'FONE DE OUVIDO', 'MARCELO', 'HUB DE ESTRATÉGIA E GESTÃO', NULL, 'WARRIOR', '-', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00064', 'MOUSE', 'MARCELO', 'HUB DE ESTRATÉGIA E GESTÃO', NULL, 'WARRIOR', 'M0267', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00065', 'MOUSE', 'CLAUDIO M.', 'HUB DE ESTRATÉGIA E GESTÃO', NULL, 'DELL', '203T17814', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00066', 'TECLADO', 'CLAUDIO M.', 'HUB DE ESTRATÉGIA E GESTÃO', NULL, 'PHILIPS', 'G413200101619', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00067', 'TELEFONE INTELBRAS', 'CLAUDIO M.', 'HUB DE ESTRATÉGIA E GESTÃO', 'TC500', 'INTELBRAS', 'TG10112600393', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00068', 'NOBREAK', 'SÉRGIO', 'ESCRITÓRIO ADM', NULL, 'POWEREST', '201066227', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00070', 'IMPRESSORA BROTHER', 'LUIZ', 'CONTROLE - GALPÃO', 'DCP-8157DN', 'BROTHER', 'U63264M4N946888', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00071', 'IMPRESSORA EPSON L3250', 'BCM - ADM', 'HUB DE ESTRATÉGIA E GESTÃO', 'C634H', 'EPSON', 'XAAB232223', 'Bom', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00072', 'CABEÇOTE FURADOR HIDRÁULICO', 'BCM - PRODUÇÃO', 'GALPÃO ', NULL, 'LUKMA', '-', 'Bom', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00073', 'CABEÇOTE DE DOBRAR BARRA HIDRÁULICO', 'BCM - PRODUÇÃO', 'GALPÃO ', NULL, 'LUKMA', '-', 'Bom', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00074', 'CABEÇOTE DE CORTAR HIDRÁULICO ', 'BCM - PRODUÇÃO', 'GALPÃO ', NULL, 'LUKMA', '-', 'Bom', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00075', 'UNIDADE HIDRÁULICA', 'BCM - PRODUÇÃO', 'GALPÃO ', NULL, 'LUKMA', '-', 'Bom', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00076', 'MORÇA DE BANCADA', 'BCM - PRODUÇÃO', 'GALPÃO ', NULL, 'POLAR', '-', 'Bom', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00077', 'MORÇA DE FURADOR DE BANCADA', 'BCM - ADM', 'ALMOXARIFADO 2', NULL, 'SEM MARCA', '-', 'Bom', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00078', 'FURADOR DE BANCADA', 'BCM - ADM', 'ALMOXARIFADO 2', NULL, 'MOTO MIL', '-', 'Bom', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00079', 'SERRA MEIO ESQUADRIA', 'BCM - PRODUÇÃO', 'GALPÃO ', NULL, 'MAKITA', '-', 'Bom', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00080', 'GUILHOTINA PARA TRILHO', 'BCM - PRODUÇÃO', 'GALPÃO ', NULL, 'SEM MARCA', '-', 'Bom', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00081', 'DOBRADEIRA HIDRÁULICA', 'BCM - PRODUÇÃO', 'GALPÃO ', NULL, 'SEM MARCA', '-', 'Bom', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00082', 'ASPIRADOR DE PÓ', 'BCM - PRODUÇÃO', 'FERRAMENTA GALPÃO', NULL, 'ELECTROLUX', '-', 'Bom', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00083', 'PLATAFORMA ELEVATÓRIA 800KG', 'BCM - PRODUÇÃO', 'GALPÃO ', NULL, 'TRANSLIFT', '-', 'Bom', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00084', 'TRANSFORMADOR 220/380/440', 'BCM - PRODUÇÃO', 'GALPÃO ', NULL, 'SEM MARCA', '-', 'Bom', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00086', 'VARA DE MANOBRA', 'BCM - ADM', 'ALMOXARIFADO ', NULL, 'RITZ', '-', 'Bom', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00087', 'ATERRAMENTO TEMPORÁRIO', 'BCM - ADM', 'ALMOXARIFADO', NULL, 'RITZ', '-', 'Bom', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00088', 'MÁQUINA DE SOLDA', 'BCM - ADM', 'ALMOXARIFADO', NULL, 'ESAB', '-', 'Bom', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00089', 'LIXADEIRA 4 POLEGADAS', 'BCM - ADM', 'ALMOXARIFADO', NULL, 'MILWAUKEE', '-', 'Bom', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00090', 'LIXADEIRA 4 POLEGADAS', 'BCM - ADM', 'ALMOXARIFADO', NULL, 'BOSH', '-', 'Bom', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00091', 'LIXADEIRA 4 POLEGADAS', 'BCM - PRODUÇÃO', 'FERRAMENTA GALPÃO', NULL, 'BOSH', '-', 'Bom', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00092', 'LIXADEIRAS 4 POLEGADAS', 'BCM - PRODUÇÃO', 'FERRAMENTA GALPÃO', NULL, 'MAKITA', '-', 'Bom', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00093', 'ALICATE DE CORTAR CABO GRANDE', 'BCM - PRODUÇÃO', 'FERRAMENTA GALPÃO', NULL, 'SEM MARCA', '-', 'Bom', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00094', 'PRENSA TEMINAL HIDRÁULICA', 'BCM - PRODUÇÃO', 'FERRAMENTA GALPÃO', NULL, 'SEM MARCA', '-', 'Bom', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00095', 'ARREBITADOR GRANDE', 'BCM - ADM', 'ALMOXARIFADO', NULL, 'SRC', '-', 'Bom', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00097', 'SOPRADOR TÉRMICO', 'BCM - PRODUÇÃO', 'GALPÃO ', NULL, 'SKIL', '-', 'Bom', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00098', 'SOPRADOR TÉRMICO', 'BCM - PRODUÇÃO', 'GALPÃO ', NULL, 'VONDER', '-', 'Bom', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00099', 'MALETA DE SOQUETE DE 1/2', 'BCM - PRODUÇÃO', 'GALPÃO ', NULL, 'CORNETA', '-', 'Bom', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00100', 'PRENSA TEMINAL HIDRÁULICA', 'BCM - ADM', 'ALMOXARIFADO', NULL, 'YQK', '-', 'Bom', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00101', 'PRENSA TEMINAL HIDRÁULICA', 'BCM - ADM', 'ALMOXARIFADO', NULL, 'SEM MARCA', '-', 'Bom', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00102', 'PRENSA TERMINAL GRANDE', 'BCM - PRODUÇÃO', 'GALPÃO ', NULL, 'SEM MARCA', '-', 'Bom', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00103', 'MARTELETE', 'BCM - PRODUÇÃO', 'FERRAMENTA GALPÃO', NULL, 'MILWAUKEE', '-', 'Bom', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00104', 'FURADOR DE CHAPA HIDRÁULICO', 'BCM - ADM', 'ALMOXARIFADO', NULL, 'NAGANO', '-', 'Bom', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00106', 'FURADOR DE CHAPA HIDRÁULICO', 'BCM - ADM', 'ALMOXARIFADO', NULL, 'SEM MARCA', '-', 'Bom', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00108', 'MÁQUINA DE MEDIR FIOS/CABOS', 'BCM - ADM', 'ALMOXARIFADO 2', 'ERBRAI FIO ESPECIAL', 'ERBRA', '000.925/OUTUBRO DE 2023', 'Bom', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00109', 'MOTO ESMERIL ', 'BCM - PRODUÇÃO', 'GALPÃO ', NULL, 'SOMAR', '-', 'Bom', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00110', 'NOTEBOOK', 'BRENO', 'HUB DE ENGENHARIA E INOVAÇÃO', 'INSPIRON 5590 ', 'DELL', '1R8NN33', 'Bom', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00111', 'MONITOR', 'SÁVIO', 'LÓGICA', 'P2419HC ', 'DELL', '725HF83', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00112', 'MONITOR', 'SÁVIO', 'LÓGICA', 'P2419HC ', 'DELL', '7V9JF83', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00114', 'NOBREAK', 'BRENO', 'HUB DE ENGENHARIA E INOVAÇÃO', 'Station ST600BI', 'SMS', '273950468679', 'Bom', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00115', 'MONITOR 22"', 'LUIZ', 'CONTROLE - GALPÃO', '221EL2SB/78', 'PHILIPS', 'FX1A1145051483', 'Bom', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00116', 'MONITOR 22"', 'LUIZ', 'ESCRITÓRIO GALPÃO', '221EL2SB/78', 'PHILIPS', 'FX1A1145051502', 'Bom', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00117', 'COMPUTADOR ', 'MÁRCIO', 'LÓGICA', 'STRIKE X', NULL, 'K31C0002M', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00118', 'NOBREAK 600VA', 'BRUNO', 'LÓGICA', 'SMS STATION II ST600BI', 'SMS', '273950340260', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00119', 'HEADSET JBL', 'BRUNO', 'LÓGICA', 'QUANTUM 100', 'JBL', '-', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00120', 'WEBCAM', 'MÁRCIO', 'LÓGICA', 'LG AN-VC500', 'LG', '502LKHT00193', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00121', 'CELULAR', 'BRUNO', 'ESCRITÓRIO GALPÃO', 'NUBIA NX591J', NULL, 'A0000056B7F0C2', 'Bom', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00122', 'SMARTPHONE', 'SÁVIO', 'LÓGICA', 'GALAXY A52', NULL, 'RX8T20978YD', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00123', 'TECLADO SEM FIO', 'BRUNO', 'LÓGICA', 'WK636p', 'DELL', 'C-15073', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00124', 'MOUSE SEM FIO', 'BRUNO', 'LÓGICA', 'LOGITECH M-510', NULL, '2048LZD06EL8', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00125', 'MOCHILA DELL', 'SÁVIO', 'HOME OFFICE', '-', 'DELL', '-', 'Bom', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00126', 'NOTEBOOK', 'LUIZ', 'GALPÃO ', 'XPS', 'DELL', '1:7L10Y1', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00127', 'NOTEBOOK', 'BCM - ADM', 'ALMOXARIFADO', 'HP PAVILION', 'HP', '4CA9356KCW', 'Regular', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00128', 'CELULAR', 'PEDRO', 'HUB DE ESTRATÉGIA E GESTÃO', 'MOTOROLA', 'XT1925-3', '7111800330', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00129', 'NOTEBOOK', 'LUIZ', 'CONTROLE - GALPÃO', 'NE56R22b', 'GATEWAY', 'NXY28AL012338308E89501', 'Regular', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00131', 'MULTIMETRO', 'BCM - PRODUÇÃO', 'CONTROLE - GALPÃO', 'FLUKE83', 'FLUKE', 'C1270411', 'Bom', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00132', 'TESTADOR CABO DE REDE', 'BCM - PRODUÇÃO', 'GALPÃO ', 'VONDER', 'VONDER', '-', 'Bom', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00133', 'DETECTOR DE TENSAO POR APROXIMACAO', 'BCM - ADM', 'ALMOXARIFADO ', 'RITZ', 'DMU-25', '2067070025', 'Bom', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00135', 'TRENA A LASAER', 'BCM - ADM', 'ESCRITÓRIO ENGENHARIA', 'BOSCH', 'GLM30', '409 408590', 'Bom', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00136', 'CAMERA TERMOGRAFICA', 'DANIEL', 'ESCRITÓRIO ENGENHARIA', 'FLIR', 'C5', '89401-0202', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00137', 'CELULAR', 'HENRIQUE', 'HUB DE ESTRATÉGIA E GESTÃO', 'REDMI', 'M2003J6A1G', '86529059867765', 'Bom', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00139', 'IMPRESSORA', 'BCM - ADM', 'ALMOXARIFADO', 'LASERJETP1102W', 'HP', 'BRBSBCJ9T', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00140', 'RADIO COMUNICADOR', 'BCM - PRODUÇÃO', 'CONTROLE - GALPÃO', 'MOTOROLA', 'LAH65KDC9AA2ANS000', '018NNM4LTP', 'Bom', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00141', 'RADIO COMUNICADOR', 'BCM - PRODUÇÃO', 'CONTROLE - GALPÃO', 'MOTOROLA', 'LAH65KDC9AA2ANS000', '018NPR494C', 'Bom', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00142', 'RADIO COMUNICADOR', 'BCM - PRODUÇÃO', 'CONTROLE - GALPÃO', 'MOTOROLA', 'LAH65KDC9AA2ANS000', '018NPV43SG', 'Bom', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00143', 'RADIO COMUNICADOR', 'BCM - PRODUÇÃO', 'CONTROLE - GALPÃO', 'MOTOROLA', 'LAH65KDC9AA2ANS000', '-', 'Bom', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00144', 'CLIMATIZADOR', 'BCM - PRODUÇÃO', 'GALPÃO', 'CLI70PRO', 'VENTISOL', '-', 'Bom', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00145', 'CLIMATIZADOR', 'BCM - PRODUÇÃO', 'GALPÃO ', 'CLI70PRO', 'VENTISOL', '-', 'Bom', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00146', 'GELADEIRA CONSUL FACILITE FROS FREE', 'BCM - ADM', 'RECARGA', 'CBR36ABANA50', 'CONSUL', 'JA3790271', 'Bom', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00147', 'MICROONDAS ELECTROLUX ', 'BCM - ADM', 'RECARGA', 'MEF41', 'ELECTROLUX', '25117730', 'Bom', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00148', 'PURIFICADOR MAXIFILTER', 'BCM - ADM', 'RECARGA', 'MAXICE', 'MAXIFILTER', '-', 'Bom', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00150', 'NOTEBOOK', 'TOMÁS', 'LÓGICA', 'INSPIRON 7580', 'DELL', '7DMV9X2', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00151', 'DOCKSTATION', 'SÁVIO', 'HOME OFFICE', 'D6000', 'DELL', '0M4TJG-BLK00-9AP-46VC-A04', 'Bom', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00152', 'TECLADO SEM FIO', 'SÁVIO', 'HOME OFFICE', 'WK636T', 'DELL', 'C-20960', 'Bom', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00154', 'HD EXTERNO ADATA  1 TB', 'SÁVIO', 'HOME OFFICE', 'HV100', NULL, '1F2120108178', 'Bom', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00157', 'ALICATE AMPERÍMETRO
', 'BCM - PRODUÇÃO', 'CONTROLE - GALPÃO', '325', 'FLUKE', '54991623MV', 'Bom', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00158', 'TERROMETRO
', 'BCM - PRODUÇÃO', 'CONTROLE - GALPÃO', 'MTR 1520', 'MINIPA', '-', 'Bom', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00159', 'TERROMETRO DIGITAL
', 'BCM - PRODUÇÃO', 'CONTROLE - GALPÃO', 'MTD 20KWe', 'MEGABRAS', 'OL 7205 I', 'Bom', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00160', 'MEGOMETRO
', 'BCM - PRODUÇÃO', 'CONTROLE - GALPÃO', 'MI 2551', 'MINIPA', '-', 'Bom', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00161', 'MEGOMETRO DIGITAL
', 'BCM - PRODUÇÃO', 'CONTROLE - GALPÃO', 'MD 5060X', 'MEGABRAS', 'MC4165 C', 'Bom', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00162', 'RELÓGIO TERMO-HIGRÔMETRO', 'BCM - PRODUÇÃO', 'CONTROLE - GALPÃO', 'MT-241', 'MINIPA', '3413513', 'Bom', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00163', 'MONITOR CONCORDIA INFORMATICA', 'EDGARD', 'CONTROLE - GALPÃO', 'H238F75', 'CONCORDIA 23.8"', 'OWH238F752304080311', 'Bom', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00164', 'MONITOR CONCORDIA INFORMATICA', 'EDGARD', 'CONTROLE - GALPÃO', 'H238F75', 'CONCORDIA 23.8"', 'OWH238F752304080244', 'Bom', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00166', 'CONTAMETRO (MÁQUINA DE MEDIR CABOS)', 'BCM - ADM', 'ALMOXARIFADO 2', '166936-901', 'VEEDER ROOT', '-', 'Bom', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00167', 'REGISTRADOR DIGITAL(ANALISADOR)', 'BCM - PRODUÇÃO', 'CONTROLE - GALPÃO', 'MARH-21', 'RMS', '99200149', 'Bom', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00168', 'CELULAR', 'KELLEN', 'HUB DE ESTRATÉGIA E GESTÃO', 'MOTO E 22', 'MOTOROLA', '08786-20-00330', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00169', 'KIT MOUSE E TECLADO', 'KARINA', 'HUB DE ESTRATÉGIA E GESTÃO', 'MK235', 'LOGITECH', '2334CE40F8A9', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00170', 'KIT MOUSE E TECLADO', 'TOMÁS', 'LÓGICA', 'MK235', 'LOGITECH', '2234CE40F9B9', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00171', 'KIT MOUSE E TECLADO', 'EDGARD', 'CONTROLE - GALPÃO', 'MK235', 'LOGITECH', '2334CE40FD09', 'Bom', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00172', 'KIT MOUSE E TECLADO', 'MÁRCIO', 'LÓGICA', 'MK235', 'LOGITECH', '2334CE40FE09', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00173', 'NOTEBOOK', 'SÁVIO', 'HOME OFFICE', 'G15-5530', 'DELL', '116WH04', 'Bom', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00174', 'NOTEBOOK', 'GUILHERME', 'LÓGICA', 'G15-5530', 'DELL', '316WH04', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00175', 'NOTEBOOK ', 'BRUNO ', 'LÓGICA', 'G15-5530', 'DELL', '216WH04', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00176', 'NOTEBOOK ', 'EDGARD', 'CONTROLE - GALPÃO', 'G15-5530', 'DELL', '416WH04', 'Bom', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00177', 'KIT MOUSE E TECLADO', 'SÉRGIO', 'HUB DE ESTRATÉGIA E GESTÃO', NULL, 'LOGITECH', '2336CE2E3DA9', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00178', 'KIT MOUSE E TECLADO', 'LUIZ', 'ESCRITÓRIO GALPÃO', NULL, 'LOGITECH', '2336CE2E3D99', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00179', 'MOUSE', 'BCM - ADM', 'ALMOXARIFADO', 'HP M260', 'HP', 'B1M260EL03002166', 'Bom', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00180', 'FONTE 24V 4,5A (PARA TESTES)', 'TOMÁS', 'LÓGICA', NULL, 'JNG', '121704963', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00181', 'BOMBA MANUAL (PRENSA HIDRÁULICA)', 'BCM - PRODUÇÃO', 'FERRAMENTA GALPÃO', 'HID.LK-SY-8B', 'LUKMA', '-', 'Bom', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00182', 'BOMBA MANUAL (PRENSA HIDRÁULICA)', 'BCM - PRODUÇÃO', 'GALPÃO', 'HID.LK-SY-8B', 'LUKMA', '-', 'Bom', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00183', 'SOPRADOR', 'BCM - PRODUÇÃO', 'GALPÃO', 'UB1103', 'MAKITA', '394572', 'Bom', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00186', 'PARAFUSADEIRA ', 'BCM - PRODUÇÃO', 'GALPÃO', 'HP1640', 'MAKITA', '1773667', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00187', 'PARAFUSADEIRA ', 'BCM - ADM', 'ALMOXARIFADO', 'HP1640', 'MAKITA', '1586260', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00188', 'PEN DRIVE', 'TOMÁS', 'LÓGICA', '64 GB', 'KINGSTON', '-', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00189', 'PEN DRIVE', 'GUILHERME', 'LÓGICA', '64 GB', 'KINGSTON', '-', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00190', 'PEN DRIVE', 'SÁVIO', 'HOME OFFICE', '64 GB', 'KINGSTON', '-', 'Bom', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00191', 'MICRO SD', 'TOMÁS', 'LÓGICA', '16 GB', 'SAN DISK', '-', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00194', 'MICRO ONDAS', 'BCM - PRODUÇÃO', 'GALPÃO ', 'CMS46ABANA', 'CONSUL ', 'MM3281843', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00195', 'PAQUÍMETRO DIGITAL CALIPER', 'BCM - PRODUÇÃO', 'CONTROLE - GALPÃO', 'STAINLESS HARDENED', 'MTX', '-', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00196', 'CHAVE DE FENDA 1/8 X 6', 'BCM - ADM', 'ALMOXARIFADO', '1/8 X 6', 'TRAMONTINA', '-', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00197', 'CHAVE DE FENDA 5/16 X 8', 'BCM - ADM', 'ALMOXARIFADO', ' 5/16 X 8', 'TRAMONTINA', '-', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00198', 'CHAVE DE FENDA 1/8 X 3', 'BCM - ADM', 'ALMOXARIFADO', '1/8 X 3', 'TRAMONTINA', '-', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00200', 'CHAVE PHILIPS 3/16 X 6', 'BCM - ADM', 'ALMOXARIFADO', '3/16 X 6', 'TRAMONTINA', '-', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00211', 'CHAVE AJUSTÁVEL ', 'BCM - ADM', 'ALMOXARIFADO', '8"', 'TRAMONTINA', '-', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00212', 'ALICATE BICO MEIA CANA', 'BCM - ADM', 'ALMOXARIFADO', '6"', 'TRAMONTINA', '-', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00214', 'PARAFUSADEIRA ', 'BCM - ADM', 'ALMOXARIFADO', 'TE-CD 18-2 LI-I 2B', 'EINHELL', '490YFBN', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00215', 'ALICATE CRIMPAR', 'LUIZ', 'ESCRITÓRIO ENGENHARIA', 'BM347', 'B-MAX', '-', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00217', 'MONITOR 24"', 'EDUARDO', 'ALMOXARIFADO', '2403 - LED', '3 GREEN', '-', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00218', 'MONITOR 24"', 'EDUARDO', 'ALMOXARIFADO', '2403 - LED', '3 GREEN', '-', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00219', 'CAIXA DE FERRAMENTAS COMPLETA', 'MÁRCIO O.', 'GALPÃO', '5 GAVETAS ', 'CENFER', '-', 'Regular', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00230', 'FURADEIRA DE IMPACTO ', 'BCM - ADM', 'ALMOXARIFADO', 'DWD502', 'DEWALT ', '-', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00248', 'CAIXA DE FERRAMENTAS COMPLETA', 'VINÍCIUS', 'GALPÃO', '5 GAVETAS ', 'CENFER', '-', 'Regular', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00250', 'ALICATE AMPERÍMETRO DIGITAL
', 'BCM - ADM', 'ALMOXARIFADO', 'HÁ-266', 'HIKARI', '-', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00252', 'VIRA MACHO ', 'BCM - ADM', 'ALMOXARIFADO', 'W1/16-1/2', NULL, '-', 'Bom', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00254', 'ALICATE DECAPAR ', 'LINDEMBERG', 'GALPÃO', 'CR02-B', 'CRIMPER', '-', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00260', 'ESMERILHADEIRA', 'LAUDIVANO', 'CAMPO', '37260', 'BLACK + DECKER', '2023 02-HF', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00261', 'MONITOR 24"', 'LEANDRO', 'ALMOXARIFADO', 'T35F', 'SANSUNG', '-', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00262', 'MONITOR 24"', 'LEANDRO', 'ALMOXARIFADO', 'T35F', 'SANSUNG', '-', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00263', 'SMARTPHONE REDMI NOTE 13 PRO', 'BRUNO', 'LÓGICA', '8 RAM - 256 GB', 'XIAOMI', '-', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00264', 'RADIO COMUNICADOR', 'BCM - PRODUÇÃO', 'GALPÃO', 'WPLN4137', 'MOTOROLA', '-', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00265', 'RADIO COMUNICADOR', 'BCM - PRODUÇÃO', 'GALPÃO', 'WPLN4137', 'MOTOROLA', '-', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00266', 'RADIO COMUNICADOR', 'BCM - PRODUÇÃO', 'GALPÃO', 'WPLN4137', 'MOTOROLA', '-', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00267', 'CLIMATIZADOR', 'BCM - PRODUÇÃO', 'GALPÃO', 'CLI70PRO', 'VENTISOL', '-', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00268', 'CLIMATIZADOR', 'BCM - PRODUÇÃO', 'GALPÃO', 'CLI70PRO', 'VENTISOL', '-', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00269', 'ESCADA DE ALUMÍNIO  3 DEGRAUS', 'BCM - ADM', 'ALMOXARIFADO', 'ESC0062', 'BTF', '1161754', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00270', 'ESCADA DE ALUMÍNIO  3 DEGRAUS', 'BCM - ADM', 'ALMOXARIFADO', 'ESC0062', 'BTF', '1161754', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00271', 'ESCADA DE ALUMÍNIO  4 DEGRAUS', 'BCM - ADM', 'ALMOXARIFADO', 'ESC 0063', 'BTF', '-', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00273', 'TECLADO SEM FIO', 'HENRIQUE ', 'HUB DE ESTRATÉGIA E GESTÃO', 'Y-R0036', 'LOGITECH', 'MK235', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00274', 'ESCADA DE ALUMINIO 4 DEGRAUS ', 'BCM - ADM', 'ALMOXARIFADO', NULL, 'REAL', '-', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00275', 'CALIBRADOR GERADOR DE SINAL', 'BCM - PRODUÇÃO', 'CONTROLE - GALPÃO', 'SG-003A', 'FNIRSI', '-', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00277', 'MÁQUINA DE CONTAR CÉDULAS', 'BCM - ADM', 'QUARTINHO RECEPÇÃO', 'BC2088', 'C E ROHS', '-', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00278', 'ESMERILHADEIRA', 'BCM - ADM', 'ALMOXARIFADO', NULL, NULL, '-', 'Bom', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00279', 'ESMERILHADEIRA', 'MÁRCIO O.', 'ALMOXARIFADO', 'G650-B2', 'BLACK + DECKER', '-', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00281', 'SWITCH DE MESA COM 8 PORTAS ', 'TOMÁS', 'ESCRITÓRIO ENGENHARIA ', 'LS1008G', 'TP-LINK', '223C2A2000124', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00282', 'SWITCH DE MESA COM 8 PORTAS ', 'TOMÁS', 'LÓGICA', 'LS1008G', 'TP-LINK', '223C2A2004102', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00285', 'ADAPTADOR USB RJ45', 'EDGARD', 'CONTROLE - GALPÃO', 'UE300C', 'TP-LINK', '22434W9000521', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00286', 'ADAPTADOR USB RJ45', 'GUILHERME ', 'LÓGICA', 'UE300C', 'TP-LINK', '22371M1006847', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00289', 'ADAPTADOR USB RJ45', 'LUIZ', 'ENGENHARIA', 'UE300C', 'TP-LINK', '.2239681006514', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00290', 'ADAPTADOR USB RJ45', 'LUIZ', 'ENGENHARIA', 'UE300C', 'TP-LINK', '.2239681005380', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00291', 'MÁQUINA DE LAVAR CHÃO', 'BCM - PRODUÇÃO', 'GALPÃO', 'K3.30', 'KARCHER', '-', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00292', 'GIROFLEX 24 V', 'BCM - PRODUÇÃO', 'GALPÃO ', 'DNI 4289', 'DNI AUTOMATIVE', 'H21', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00293', 'GIROFLEX 24 V', 'BCM - PRODUÇÃO', 'GALPÃO ', 'DNI 4289', 'DNI AUTOMATIVE', 'H21', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00294', 'GIROFLEX 24 V', 'BCM - PRODUÇÃO', 'GALPÃO ', 'DNI 4289', 'DNI AUTOMATIVE', 'H21', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00296', 'IMPRESSORA ZD230', 'BCM - ADM', 'ALMOXARIFADO', 'ZD230', 'ZEBRA', '-', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00297', 'GELADEIRA ELETROLUX ', 'BCM - PRODUÇÃO', 'GALPÃO', NULL, 'ELETROLUX', '-', 'Bom', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00298', 'MONITOR ', 'BCM - ADM', 'ARQUIVO MORTO', '202EL2SB/78', 'PHILIPS', '-', 'Bom', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00299', 'TECLADO', 'BCM - ADM', 'ALMOXARIFADO', 'KB1-2BK', 'C3TECH', '-', 'Bom', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00300', 'TELEFONE INTERFONE', 'BCM - ADM', 'ALMOXARIFADO', 'TS 5121', 'INTELBRAS', 'U15L5202076BO', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00301', 'SWITCH ', 'EDUARDO', 'ALMOXARIFADO', NULL, 'TPLINK', '-', 'Bom', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00302', 'ESTABILIZADOR ', 'TOMÁS', 'LÓGICA', '201006227', 'TS SHARA', '-', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00303', 'TELEFONE INTELBRAS', 'SÉRGIO', 'HUB DE ESTRATÉGIA E GESTÃO', NULL, 'INTELBRAS PLENO', '-', 'Bom', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00304', 'TELEFONE INTERFONE', 'BCM - ADM', 'HUB DE ESTRATÉGIA E GESTÃO', NULL, 'INTELBRAS', '-', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00305', 'NOTEBOOK ', 'DANIEL', 'HUB DE ESTRATÉGIA E GESTÃO', 'ASUS VIVOBOOK', 'INTEL I5', '-', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00306', 'DOOCK STATION', 'DANIEL', 'HUB DE ESTRATÉGIA E GESTÃO', 'DELL 6000', 'DELL', '-', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00307', 'TELEFONE', 'BCM - ADM', 'ENERGIA', NULL, 'INTELBRAS', '24MI450028303', 'Bom', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00308', 'TELEFONE INTELBRAS', 'PEDRO ', 'HUB DE ESTRATÉGIA E GESTÃO', NULL, 'INTELBRAS PLENO', '-', 'Bom', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00309', 'BEBEDOURO', 'BCM - PRODUÇÃO', 'GALPÃO', 'PLATINUM NEW', 'TOPLIFE', '-', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00311', 'IMPRESSORA ', 'BCM - PRODUÇÃO', 'GALPÃO', 'BPE 300', 'ELESYS', '-', 'Bom', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00312', 'MOUSE ', 'BCM - PRODUÇÃO', 'GALPÃO', 'M90', 'LOGITECH', '-', 'Bom', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00314', 'MONTOR ', 'LUIZ', 'GALPÃO', 'T89MMSNO6W ALONE', 'AOC', '-', 'Bom', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00315', 'GABINETE', 'BCM - PRODUÇÃO', 'GALPÃO', NULL, NULL, '-', 'Bom', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00316', 'ESTABILIZADOR ', 'BCM - PRODUÇÃO', 'GALPÃO', NULL, NULL, '-', 'Bom', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00317', 'CONECTOR HDMI', 'TOMÁS', 'LÓGICA', NULL, 'KAPBCM', '-', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00318', 'HUB USB HDMI', 'GUILHERME', 'LÓGICA', NULL, 'BASEUS', '-', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00319', 'TECLADO ', 'SÁVIO', 'LÓGICA', NULL, 'DELL', '-', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00320', 'MOUSE ', 'SÁVIO', 'LÓGICA', NULL, 'DELL', '-', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00321', 'HUB USB HDMI', 'BRUNO', 'LÓGICA', NULL, 'BASEUS', '-', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00324', 'ALICATE CORTE DIAGONAL', 'BCM - ADM', 'ALMOXARIFADO', '6"', 'TRAMONTINA', '-', 'Bom', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00325', 'FONE DE OUVIDO', 'KELLEN', 'HUB DE ESTRATÉGIA E GESTÃO', 'QUANTUM 100', 'JBL', '-', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00326', 'FONE DE OUVIDO', 'SÉRGIO', 'ESCRITÓRIO ADM', 'QUANTUM 100', 'JBL', '-', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00327', 'ESMERILHADEIRA', 'BCM - ADM', 'ALMOXARIFADO', 'GWS 7-115', 'BOSCH', '-', 'Regular', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00328', 'ESMERILHADEIRA', 'BCM - ADM', 'ALMOXARIFADO', 'GWS 7-115', 'BOSCH', '-', 'Regular', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00329', 'ESMERILHADEIRA', 'BCM - ADM', 'ALMOXARIFADO', 'GWS 8-115', 'BOSCH', '-', 'Regular', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00330', 'ESMERILHADEIRA', 'BCM - ADM', 'ALMOXARIFADO', 'GWS 8-115', 'BOSCH', '-', 'Regular', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00331', 'ESMERILHADEIRA', 'BCM - ADM', 'ALMOXARIFADO', 'GWS 7-115', 'BOSCH', '-', 'Regular', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00332', 'ESMERILHADEIRA', 'BCM - ADM', 'ALMOXARIFADO', 'PA6-GF30', 'MAKITA', '-', 'Regular', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00333', 'FURADEIRA ', 'BCM - ADM', 'ALMOXARIFADO', 'PA6-GF35+SEBS', 'BOSCH', '-', 'Regular', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00334', 'FURADEIRA ', 'BCM - ADM', 'ALMOXARIFADO', 'PA6-GF30', 'MAKITA', '-', 'Regular', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00335', 'ALICATE STRIPAX P/CORTAR E DECAPAR', 'MIGUEL', 'GALPÃO', 'STRIPAX', 'WEIDMULLER', '-', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00336', 'ALICATE STRIPAX P/CORTAR E DECAPAR', 'BCM - ADM', 'ALMOXARIFADO', 'STRIPAX', 'WEIDMULLER', '-', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00339', 'ALICATE STRIPAX P/CORTAR E DECAPAR', 'BCM - ADM', 'ALMOXARIFADO', 'STRIPAX', 'WEIDMULLER', '-', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00343', 'ALICATE STRIPAX P/CORTAR E DECAPAR', 'EDGARD', 'GALPÃO', 'STRIPAX', 'WEIDMULLER', '-', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00344', 'ALICATE STRIPAX P/CORTAR E DECAPAR', 'IGOR', 'GALPÃO', 'STRIPAX', 'WEIDMULLER', '-', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00345', 'BOLSA FERRAMENTAS 18 POL 32 BOLSOS VERMELHO ', 'BCM - PRODUÇÃO', 'GALPÃO', '460X280X305', 'MTX', '902569', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00346', 'AFIADOR DE BROCAS 3-10MM ', 'BCM - PRODUÇÃO', 'GALPÃO', '95W 220V  AMARELO', 'VONDER', 'ABV0952403007', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00347', 'GUILHOTINA CORTADOR DE PAPEL A4', 'BCM - ADM', 'LÓGICA', 'PAPEL A4', 'TUDOPRAFOTO', '-', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00355', 'ALICATE SMARTWIRE - DT', 'BCM - PRODUÇÃO', 'GALPÃO', NULL, NULL, '519586-8', 'Bom', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00356', 'ALICATE SMARTWIRE - DT', 'BCM - PRODUÇÃO', 'GALPÃO', NULL, NULL, '-', 'Bom', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00357', 'MILLI-OHMÍMETRO DIGITAL', 'BCM - PRODUÇÃO', 'GALPÃO', 'MILLIOHM 1', 'INSTRUM', 'MP 0025', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00358', 'MOUSE', 'BCM - ADM', 'ALMOXARIFADO', 'NT', 'C3TECH', '-', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00359', 'CAIXA DE FERRAMENTAS COMPLETA', 'LAUDIVANO', 'GALPÃO', 'COMPLETA', '-', '-', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00360', 'TV BOX', 'BCM - ADM', 'RECEPÇÃO', 'STV-3000PLUS', 'AQUÁRIO', '-', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00361', 'SERRA COPO', 'BCM - ADM', 'ALMOXARIFADO', '110 MM', 'LR SUPER ABRASIVOS', '-', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00362', 'IMPRESSORA DE ETIQUETAS PORTÁTIL', 'BCM - PRODUÇÃO', 'CONTROLE - GALPÃO', 'PT-M95', 'BROTHER', '-', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00363', 'ALICATE EZ CRIMP CAT 7 MULTIFUNÇÃO 2 EM 1', 'BCM - PRODUÇÃO', 'CONTROLE - GALPÃO', 'FRM-ACN702', 'EXBOM', '-', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00364', 'ALICATE EZ CRIMP CAT 7 MULTIFUNÇÃO 2 EM 1', 'BCM - PRODUÇÃO', 'CONTROLE - GALPÃO', 'FRM-ACN702', 'EXBOM', '-', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00365', 'TESTADOR DE CABO DE REDE RJ45+RJ11', 'BCM - PRODUÇÃO', 'GALPÃO', 'FEPRO-TR270', 'EXBOM', '-', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00366', 'TESTADOR DE CABO DE REDE RJ45+RJ11', 'BCM - PRODUÇÃO', 'GALPÃO', 'FEPRO-TR270', 'EXBOM', '-', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00367', 'TORQUÍMETRO 2mm A 24mm', 'BCM - PRODUÇÃO', 'CONTROLE - GALPÃO', 'NO24061792', 'TORQUE WRENCH', 'QS 30', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00368', 'ALICATE STRIPAX P/CORTAR E DECAPAR', 'BCM - ADM', 'ALMOXARIFADO', 'STRIPAX', 'WEIDMULLER', '-', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00369', 'ALICATE STRIPAX P/CORTAR E DECAPAR', 'LINDEMBERG', 'GALPÃO', 'STRIPAX', 'WEIDMULLER', '-', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00370', 'ALICATE STRIPAX P/CORTAR E DECAPAR', 'BCM - ADM', 'ALMOXARIFADO', 'STRIPAX', 'WEIDMULLER', '-', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00371', 'MONITOR ', 'MARCELO', 'CASA MARCELO', '243V5QHABA/57', 'PHILIPS', 'AF0A1739052077', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00372', 'TELEFONE INTELBRAS', 'HENRIQUE', 'HUB DE ESTRATÉGIA E GESTÃO', 'PLENO', 'INTELBRAS', '107896637609296', 'Regular', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00373', 'CELULAR', 'EDUARDO', 'ALMOXARIFADO', 'VERNE MODEL X', NULL, ' K605D1701230009954', 'Bom', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00374', 'TRENA EMBORRACHADA ', 'BCM - ADM', 'ALMOXARIFADO', '5 MTS ', 'AQUA TOOLS', '14450', 'Bom', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00375', 'Sem descrição', 'BCM - PRODUÇÃO', 'GALPÃO', 'ACV300', 'VONDER', '-', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00376', 'AIR FRYER ', 'BCM - ADM', 'RECARGA', 'AFON-12L-BI', 'MONDIAL', '24625147-0424', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00377', 'MISTEIRA ', 'BCM - ADM', 'RECARGA', 'JGD-HF219', 'COIBEL', '-', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00378', 'MISTEIRA ', 'BCM - PRODUÇÃO', 'COZINHA GALPÃO', 'JGD-HF219', 'COIBEL', '-', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00379', 'ADAPTADOR DISPLAYPORT P/VGA', 'LEANDRO', 'ALMOXARIFADO', 'V002409', 'ASTECH', '-', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00380', 'GERADOR SINAIS CALIBRADOR PORTATIL SG-004A', 'BCM - ADM', 'ESCRITÓRIO ENGENHARIA ', 'SG-004A', 'FNIRSI', '-', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00381', 'CELULAR - 8GB RAM - 256GB', 'LUIZ', 'CONTROLE - GALPÃO', 'REDMI NOTE 14S', 'XIAOMI', '2502FRA65G', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00382', 'TORQUÍMETRO DE ESTALO', 'BCM - PRODUÇÃO', 'GALPÃO', 'BTT1200', 'THE BLACK TOOLS', '-', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00383', 'TORQUIMETRO', 'BCM - ADM', 'ESCRITÓRIO ENGENHARIA ', 'KD230102059', 'TORQUE WRENCH', '-', 'Bom', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00384', 'TORQUÍMETRO DE ESTALO', 'BCM - ADM', 'ESCRITÓRIO ENGENHARIA ', 'R68900100', 'GEDORE', 'QS 30', 'Bom', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00385', 'AIR FRYER FORNO', 'BCM - PRODUÇÃO', 'COZINHA GALPÃO', 'AI551', 'PHILIPS', '-', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00386', 'MOUSE', 'PEDRO ', 'HUB DE ESTRATÉGIA E GESTÃO', 'M170', 'LOGITECH', '810-010445', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00387', 'CELULAR - 8GB RAM - 256GB', 'KARINA', 'HUB DE ESTRATÉGIA E GESTÃO', 'GALAXY A17', 'SAMSUNG', 'SM-A175F/DS', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00388', 'CELULAR - 8GB RAM - 256GB ', 'IGOR', 'LÓGICA', 'GALAXY A17', 'SAMSUNG', 'SM-A175F/DS', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00389', 'CELULAR - 8GB RAM  - 256GB', 'EDUARDO', 'ALMOXARIFADO', 'REDMI 15', 'XIAOMI', '25062RN2DL', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00390', 'CELULAR - 8GB RAM  - 256GB', 'TOMÁS', 'LÓGICA', 'REDMI 15', 'XIAOMI', '-', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00391', 'KIT MOUSE E TECLADO ', 'IGOR', 'CONTROLE - GALPÃO', 'MK235', 'LOGITECH', '2537CE01WW89', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00392', 'FONE DE OUVIDO', 'IGOR', 'CONTROLE - GALPÃO', 'QUANTUM 100 M2', 'JBL', '-', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00393', 'FONE DE OUVIDO', 'PEDRO', 'HUB DE ESTRATÉGIA E GESTÃO', 'QUANTUM 100 M2', 'JBL', '-', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00394', 'MONITOR ', 'MARCELO', 'CASA MARCELO', '20M37AA', 'LG', '911SPWQ1F425', 'Bom', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00395', 'NOTEBOOK', 'TOMÁS', 'LÓGICA', '83NS0001BR', 'LENOVO', 'PE9015C28113', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00396', 'NOTEBOOK', 'MARCELO', 'HUB DE ESTRATÉGIA E GESTÃO', '83NS0001BR', 'LENOVO', 'PE9015929328', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00397', 'CADEIRA ERGONOMICA', 'LEANDRO', 'ALMOXARIFADO', '2005242', 'COMFY', '-', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00398', 'CADEIRA ERGONOMICA', 'EDUARDO', 'ALMOXARIFADO', '2005242', 'COMFY', '-', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00399', 'CADEIRA ERGONOMICA', 'ISRAEL', 'ALMOXARIFADO', '2005242', 'COMFY', '-', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00400', 'CADEIRA ERGONOMICA', 'BCM - ADM', 'CAPASITOR ', '2005328', 'SUPER OFFICE', '-', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00401', 'CADEIRA ERGONOMICA', 'BCM - ADM', 'CAPASITOR ', '2005328', 'SUPER OFFICE', '-', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00402', 'CADEIRA ERGONOMICA', 'BCM - ADM', 'CAPASITOR ', '2005328', 'SUPER OFFICE', '-', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00403', 'CADEIRA ERGONOMICA', 'BCM - ADM', 'CAPASITOR ', '2005328', 'SUPER OFFICE', '-', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00404', 'CADEIRA ERGONOMICA', 'BCM - ADM', 'CAPASITOR ', '2005328', 'SUPER OFFICE', '-', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00405', 'CADEIRA ERGONOMICA', 'BCM - ADM', 'CAPASITOR ', '2005328', 'SUPER OFFICE', '-', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00406', 'CADEIRA ERGONOMICA', 'BCM - ADM', 'CAPASITOR ', '2005328', 'SUPER OFFICE', '-', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00407', 'CADEIRA ERGONOMICA', 'BCM - ADM', 'CAPASITOR ', '2005328', 'SUPER OFFICE', '-', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00408', 'TELEVISÃO', 'BCM - ADM', 'CAPASITOR ', 'U8600F', 'SAMSUNG', '-', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00409', 'CAFETEIRA ', 'BCM - ADM', 'CAPASITOR ', '20038999', 'TRÊS CORAÇÕES', '-', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00410', 'FRIGOBAR', 'BCM - ADM', 'CAPASITOR ', 'BRA08HEANA', 'BRASTEMP', '-', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00411', 'TELEVISÃO', 'BCM - ADM', 'ENERGIA', 'U8600F', 'SAMSUNG', '-', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00412', 'FRIGOBAR', 'BCM - ADM', 'ENERGIA', NULL, 'ELECTROLUX', '-', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00413', 'CADEIRA ERGONOMICA', 'BCM - ADM', 'CONEXÃO', 'CES000211M', 'MOVESCAN', '-', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00414', 'CADEIRA ERGONOMICA', 'BCM - ADM', 'CONEXÃO', 'CES000211M', 'MOVESCAN', '-', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00415', 'CADEIRA ERGONOMICA', 'BCM - ADM', 'CONEXÃO', 'CES000211M', 'MOVESCAN', '-', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00416', 'CADEIRA ERGONOMICA', 'BCM - ADM', 'CONEXÃO', 'CES000211M', 'MOVESCAN', '-', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00417', 'CADEIRA ERGONOMICA', 'BCM - ADM', 'CONEXÃO', 'CES000211M', 'MOVESCAN', '-', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00418', 'CADEIRA ERGONOMICA', 'BCM - ADM', 'CONEXÃO', 'CES000211M', 'MOVESCAN', '-', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00419', 'CADEIRA ERGONOMICA', 'BCM - ADM', 'CONEXÃO', 'CES000211M', 'MOVESCAN', '-', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00420', 'CADEIRA ERGONOMICA', 'BCM - ADM', 'CONEXÃO', 'CES000211M', 'MOVESCAN', '-', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00421', 'TELEVISÃO', 'BCM - ADM', 'CONEXÃO', 'U8600F', 'SAMSUNG', '-', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00422', 'TELEVISÃO', 'BCM - ADM', 'CONEXÃO', 'U8600F', 'SAMSUNG', '-', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00423', 'TELEVISÃO', 'BCM - ADM', 'CONEXÃO', 'U8600F', 'SAMSUNG', '-', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00424', 'CAFETEIRA ', 'BCM - ADM', 'CONEXÃO', '8720389055546', 'PHILIPS', '-', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00425', 'ALEXA ', 'BCM - ADM', 'CONEXÃO', 'ECHO DOT', 'AMAZON', '-', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00426', 'FRIGOBAR', 'BCM - ADM', 'CONEXÃO', 'B206957', 'EOS', '-', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00427', 'CADEIRA ERGONOMICA', 'BCM - ADM', 'LÓGICA', '2005242', 'COMFY', '-', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00428', 'CADEIRA ERGONOMICA', 'GUILHERME', 'LÓGICA', '2005242', 'COMFY', '-', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00429', 'CADEIRA ERGONOMICA', 'TOMÁS', 'LÓGICA', '2005242', 'COMFY', '-', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00430', 'CADEIRA ERGONOMICA', 'SÁVIO', 'LÓGICA', '2005242', 'COMFY', '-', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00431', 'CADEIRA ERGONOMICA', 'BCM - ADM', 'LÓGICA', '2005242', 'COMFY', '-', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00432', 'CADEIRA ERGONOMICA', 'EDGARD', 'LÓGICA', '2005242', 'COMFY', '-', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00433', 'CADEIRA ERGONOMICA', 'MÁRCIO', 'LÓGICA', '2005242', 'COMFY', '-', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00434', 'CADEIRA ERGONOMICA', 'BRUNO', 'LÓGICA', '2005242', 'COMFY', '-', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00435', 'MONITOR ', 'BCM - ADM', 'LÓGICA', 'T2422', 'PC FORT', '-', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00436', 'MONITOR ', 'BCM - ADM', 'LÓGICA', 'T2422', 'PC FORT', '-', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00437', 'MONITOR ', 'BRUNO', 'LÓGICA', 'T2422', 'PC FORT', '-', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00438', 'MONITOR', 'BRUNO', 'LÓGICA', 'T2422', 'PC FORT', '-', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00439', 'MONITOR', 'BCM - ADM', 'LÓGICA', 'T2422', 'PC FORT', '-', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00440', 'MONITOR', 'BCM - ADM', 'LÓGICA', 'T2422', 'PC FORT', '-', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00441', 'MONITOR', 'EDGARD', 'LÓGICA', 'T2422', 'PC FORT', '-', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00442', 'MONITOR', 'EDGARD', 'LÓGICA', 'T2422', 'PC FORT', '-', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00443', 'MONITOR', 'MÁRCIO', 'LÓGICA', 'T2422', 'PC FORT', '-', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00444', 'MONITOR', 'MÁRCIO', 'LÓGICA', 'T2422', 'PC FORT', '-', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00445', 'HUB 13 EM 1', 'TOMÁS', 'LÓGICA', 'BS0H119', 'BASEUS', '-', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00446', 'TELEVISÃO', 'BCM - ADM', 'LÓGICA', 'U8600F', 'SAMSUNG', '-', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00447', 'HUB 8 EM 1', 'SÁVIO', 'LÓGICA', 'DS0H101', 'BASEUS', '-', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00448', 'FURADOR DE PAPEL', 'BCM - ADM', 'LÓGICA', NULL, 'EXCENTRIX', '-', 'Bom', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00449', 'CADEIRA ERGONOMICA', 'BCM - ADM', 'HUB DE ESTRATÉGIA E GESTÃO', '2005242', 'COMFY', '-', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00450', 'CADEIRA ERGONOMICA', 'SÉRGIO', 'HUB DE ESTRATÉGIA E GESTÃO', '2005242', 'COMFY', '-', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00451', 'CADEIRA ERGONOMICA', 'KELLEN', 'HUB DE ESTRATÉGIA E GESTÃO', '2005242', 'COMFY', '-', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00452', 'CADEIRA ERGONOMICA', 'DANIEL', 'HUB DE ESTRATÉGIA E GESTÃO', '2005242', 'COMFY', '-', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00453', 'CADEIRA ERGONOMICA', 'PEDRO', 'HUB DE ESTRATÉGIA E GESTÃO', '2005242', 'COMFY', '-', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00454', 'CADEIRA ERGONOMICA', 'HENRIQUE', 'HUB DE ESTRATÉGIA E GESTÃO', '2005242', 'COMFY', '-', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00455', 'CADEIRA ERGONOMICA', 'KARINA', 'HUB DE ESTRATÉGIA E GESTÃO', '2005242', 'COMFY', '-', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00456', 'MONITOR', 'DANIEL', 'HUB DE ESTRATÉGIA E GESTÃO', 'T2422', 'PC FORT', '-', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00457', 'MONITOR', 'SÉRGIO', 'HUB DE ESTRATÉGIA E GESTÃO', 'T2422', 'PC FORT', '-', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00458', 'MONITOR', 'SÉRGIO', 'HUB DE ESTRATÉGIA E GESTÃO', 'T2422', 'PC FORT', '-', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00459', 'MONITOR', 'KELLEN', 'HUB DE ESTRATÉGIA E GESTÃO', 'T2422', 'PC FORT', '-', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00460', 'MONITOR', 'KARINA', 'HUB DE ESTRATÉGIA E GESTÃO', 'T2422', 'PC FORT', '-', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00461', 'MONITOR ', 'PEDRO', 'HUB DE ESTRATÉGIA E GESTÃO', 'T2422', 'PC FORT', '-', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00462', 'MONITOR ', 'PEDRO', 'HUB DE ESTRATÉGIA E GESTÃO', 'T2422', 'PC FORT', '-', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00463', 'MONITOR', 'HENRIQUE', 'HUB DE ESTRATÉGIA E GESTÃO', 'T2422', 'PC FORT', '-', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00464', 'MONITOR ', 'HENRIQUE', 'HUB DE ESTRATÉGIA E GESTÃO', 'T2422', 'PC FORT', '-', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00465', 'MONITOR', 'KARINA', 'HUB DE ESTRATÉGIA E GESTÃO', 'T2422', 'PC FORT', '-', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00466', 'MONITOR', 'KARINA', 'HUB DE ESTRATÉGIA E GESTÃO', 'T2422', 'PC FORT', '-', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00467', 'MONITOR', 'MARCELO', 'HUB DE ESTRATÉGIA E GESTÃO', 'T2422', 'PC FORT', '-', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00468', 'MONITOR', 'MARCELO', 'HUB DE ESTRATÉGIA E GESTÃO', 'T2422', 'PC FORT', '-', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00469', 'CADEIRA ERGONOMICA', 'MARCELO', 'HUB DE ESTRATÉGIA E GESTÃO', '2005242', 'COMFY', '-', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00470', 'IMPRESSORA', 'BCM - ADM', 'HUB DE ESTRATÉGIA E GESTÃO', 'DCP-L5652DN', 'BROTHER', '-', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00471', 'HUB 8 EM 1', 'BCM - ADM', 'HUB DE ESTRATÉGIA E GESTÃO', 'DS0H101', 'BASEUS', '-', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00472', 'COMPUTADOR ', 'PEDRO', 'HUB DE ESTRATÉGIA E GESTÃO', NULL, 'C3TECH', '-', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00473', 'HUB 8 EM 1', 'HENRIQUE', 'HUB DE ESTRATÉGIA E GESTÃO', 'DS0H101', 'BASEUS', '-', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00474', 'HUB 13 EM 1', 'KARINA', 'HUB DE ESTRATÉGIA E GESTÃO', 'BS0H119', 'BASEUS', '-', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00475', 'NOTEBOOK', 'HENRIQUE', 'HUB DE ESTRATÉGIA E GESTÃO', NULL, 'LENOVO', '-', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00476', 'MOUSE', 'HENRIQUE ', 'HUB DE ESTRATÉGIA E GESTÃO', 'M-R0060', 'LOGITECH', 'MK235', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00477', 'TELEVISÃO', 'CLAUDIO M.', 'HUB DE ESTRATÉGIA E GESTÃO', 'U8600F', 'SAMSUNG', '-', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00478', 'CADEIRA ERGONOMICA', 'CLAUDIO M.', 'HUB DE ESTRATÉGIA E GESTÃO', '2005242', 'COMFY', '-', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00479', 'CAFETEIRA ', 'CLAUDIO M.', 'HUB DE ESTRATÉGIA E GESTÃO', '20038999', 'TRÊS CORAÇÕES', '-', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00480', 'FRIGOBAR', 'CLAUDIO M.', 'HUB DE ESTRATÉGIA E GESTÃO', 'BRA08HEANA', 'BRASTEMP', '-', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00481', 'CAFETEIRA ', 'BCM - ADM', 'RECEPÇÃO', 'S24 MIMO', 'TRÊS CORAÇÕES', 'S240001', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00482', 'PRENSA HIDRÁULICO', 'BCM - ADM', 'ALMOXARIFADO', 'YQK-300', NULL, '-', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00483', 'ESMERILHADEIRA ANGULAR', 'BCM - ADM', 'ALMOXARIFADO', 'ES230-2000PRO', 'FERRARI', '-', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00484', 'CADEIRA ERGONOMICA', 'BRENO', 'HUB DE ENGENHARIA E INOVAÇÃO', '2005242', 'COMFY', '-', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00485', 'FRIGOBAR', 'BRENO', 'HUB DE ENGENHARIA E INOVAÇÃO', 'BRA08HEANA', 'BRASTEMP', '-', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00486', 'CAFETEIRA ', 'BRENO', 'HUB DE ENGENHARIA E INOVAÇÃO', '20038999', 'TRÊS CORAÇÕES', '-', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00487', 'TELEVISÃO', 'BRENO', 'HUB DE ENGENHARIA E INOVAÇÃO', 'U8600F', 'SAMSUNG', '-', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00488', 'DOCKSTATION', 'LEANDRO', 'ALMOXARIFADO', 'D6000', 'DELL', '9CEBE8D1B8CC', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00489', 'FRIGOBAR', 'MARCELO', 'HUB DE ESTRATÉGIA E GESTÃO', 'BRA08HEANA', 'BRASTEMP', '-', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00490', 'BALANÇA ', 'BCM - ADM', 'ALMOXARIFADO', 'QUICK-33', 'BALMAK QUICK', '22016', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00491', 'MÁQUINA DE PONTOS ', 'BCM - PRODUÇÃO', 'QUARTINHO COZINHA - GALPÃO', 'C900', 'CÉU', '-', 'Bom', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00492', 'TECLADO', 'BCM - PRODUÇÃO', 'QUARTINHO COZINHA - GALPÃO', 'TCPRO2-USB', 'POTOP', '-', 'Bom', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00493', 'GANCHO HIDRAULICO ', 'BCM - PRODUÇÃO', 'GALPÃO', '2000KG ', 'SEM MARCA ', '-', 'Bom', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00494', 'PALETEIRA ', 'BCM - PRODUÇÃO', 'GALPÃO', 'TM2500', 'TRANSPALETE', '6254182', 'Bom', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00495', 'HUB 13 EM 1', 'IGOR ', 'CONTROLE - GALPÃO', 'BS0H119', 'BASEUS', '-', 'Bom', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00496', 'HUB 8 EM 1', 'IGOR ', 'CONTROLE - GALPÃO', 'DS0H101', 'BASEUS', '-', 'Bom', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00497', 'DOCKSTATION', 'LUIZ', 'CONTROLE - GALPÃO', 'D6000S', 'DELL', '0C3796511EBB', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00498', 'SWITCH DE MESA COM 8 PORTAS ', 'EDGARD', 'CONTROLE - GALPÃO', 'LS1008G', 'TP-LINK', '223C2A2000870', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00499', 'SWITCH DE MESA COM 8 PORTAS ', 'LUIZ', 'CONTROLE - GALPÃO', 'SF 800 VLAN', 'INTELBRAS', '638J0706898WX', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00500', 'ALICATE STRIPAX P/CORTAR E DECAPAR', 'LUIZ', 'CONTROLE - GALPÃO', 'STRIPAX', 'WEIDMULLER', '-', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00501', 'MAQUINA DOBRADEIRA BARRAMENTO DERIVAÇÃO ', 'BCM - PRODUÇÃO', 'CONTROLE - GALPÃO', '-', '-', '-', 'Bom', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00502', 'CAIXA DE FERRAMENTAS SEMI COMPLETA', 'BCM - ADM', 'ALMOXARIFADO', '5 GAVETAS ', 'CENFER', '-', 'Bom', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00503', 'CADEIRA ALLEGRA NUDE', 'BRENO', 'HUB DE ENGENHARIA E INOVAÇÃO', 'FD2110NU', '-', '-', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00504', 'CADEIRA ALLEGRA NUDE', 'BRENO', 'HUB DE ENGENHARIA E INOVAÇÃO', 'FD2110NU', '-', '-', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00505', 'CADEIRA ALLEGRA NUDE', 'BRENO', 'HUB DE ENGENHARIA E INOVAÇÃO', 'FD2110NU', '-', '-', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00506', 'CADEIRA ALLEGRA NUDE', 'BRENO', 'HUB DE ENGENHARIA E INOVAÇÃO', 'FD2110NU', '-', '-', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00507', 'CADEIRA ALLEGRA NUDE', 'BRENO', 'HUB DE ENGENHARIA E INOVAÇÃO', 'FD2110NU', '-', '-', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00508', 'CADEIRA ALLEGRA NUDE', 'BRENO', 'HUB DE ENGENHARIA E INOVAÇÃO', 'FD2110NU', '-', '-', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00509', 'CADEIRA ALLEGRA NUDE', 'CLAUDIO M.', 'HUB DE ESTRATÉGIA E GESTÃO', 'FD2110NU', '-', '-', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00510', 'CADEIRA ALLEGRA NUDE', 'CLAUDIO M.', 'HUB DE ESTRATÉGIA E GESTÃO', 'FD2110NU', '-', '-', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00511', 'CADEIRA ALLEGRA NUDE', 'CLAUDIO M.', 'HUB DE ESTRATÉGIA E GESTÃO', 'FD2110NU', '-', '-', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00512', 'CADEIRA ALLEGRA NUDE', 'CLAUDIO M.', 'HUB DE ESTRATÉGIA E GESTÃO', 'FD2110NU', '-', '-', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00513', 'CADEIRA ALLEGRA NUDE', 'CLAUDIO M.', 'HUB DE ESTRATÉGIA E GESTÃO', 'FD2110NU', '-', '-', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00514', 'CADEIRA ALLEGRA NUDE', 'CLAUDIO M.', 'HUB DE ESTRATÉGIA E GESTÃO', 'FD2110NU', '-', '-', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00515', 'CADEIRA ALLEGRA NUDE', 'KARINA', 'HUB DE ESTRATÉGIA E GESTÃO', 'FD2110NU', '-', '-', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00516', 'CADEIRA ALLEGRA NUDE', 'MARCELO', 'HUB DE ESTRATÉGIA E GESTÃO', 'FD2110NU', '-', '-', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00517', 'CADEIRA ALLEGRA NUDE', 'MARCELO', 'HUB DE ESTRATÉGIA E GESTÃO', 'FD2110NU', '-', '-', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00518', 'CADEIRA ALLEGRA NUDE', 'BCM - ADM', 'ÁREA DE ESPERA - ESCADA', 'FD2110NU', '-', '-', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00519', 'CADEIRA ALLEGRA NUDE', 'BCM - ADM', 'ÁREA DE ESPERA - ESCADA', 'FD2110NU', '-', '-', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00520', 'CADEIRA ALLEGRA NUDE', 'BCM - ADM', 'ÁREA DE ESPERA - ESCADA', 'FD2110NU', '-', '-', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00521', 'FONTE CHAVEADA 100W 24VCC - 100/240VCA - 4,5A', 'LUIZ ', 'CONTROLE - GALPÃO', 'ABL2REM24045K', 'SCHNEIDER', '-', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00522', 'ALICATE STRIPAX P/CORTAR E DECAPAR', 'DANILO ', 'GALPÃO', 'STRIPAX', 'WEIDMULLER', '-', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00523', 'NOTEBOOK', 'IGOR', 'CONTROLE - GALPÃO', 'LATITUDE 3550', 'DELL', 'P170G003', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00524', 'KIT MOUSE E TECLADO ', 'LEANDRO', 'ALMOXARIFADO', 'WIRELESS KEYBOARD 3000 V2,0', 'DELL', 'CCAJ17LPA1F0T0', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00525', 'CAIXA DE FERRAMENTAS COMPLETA', 'REMULO', 'GALPÃO', '5 GAVETAS ', 'FERCAR', '-', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00526', 'MONITOR', 'DANIEL', 'HUB ESTRATÉGIA E GESTÃO', 'T2422', 'PC FORT', '-', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00527', 'TELEFONE COM FIO PLENO', 'TOMÁS', 'LÓGICA', 'NZRA17932', 'INTELBRAS', 'BUY0007369197', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00528', 'TELEFONE COM FIO PLENO', 'BRUNO', 'LÓGICA', 'NZRA17932', 'INTELBRAS', 'BGN0007370031', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00529', 'TELEFONE COM FIO PLENO', 'SÁVIO', 'LÓGICA', 'NZRA17932', 'INTELBRAS', 'BFP0007369998', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00530', 'TELEFONE COM FIO PLENO', 'MÁRCIO', 'LÓGICA', 'NZRA17932', 'INTELBRAS', 'BND0007370005', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00531', 'TELEFONE COM FIO PLENO', 'BRENO', 'HUB DE ENGENHARIA E INOVAÇÃO', 'NZRA17932', 'INTELBRAS', 'BUM007369992', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00532', 'TELEFONE COM FIO PLENO', 'KELLEN', 'HUB ESTRATÉGIA E GESTÃO', 'NZRA17932', 'INTELBRAS', 'BAE0007370035', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00533', 'TELEFONE COM FIO PLENO', 'DANIEL', 'ALMOXARIFADO', 'NZRA17932', 'INTELBRAS', 'BEB0007368922', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00534', 'KIT MOUSE E TECLADO ', 'BCM - ADM', 'LÓGICA', 'MK235', 'LOGITECH', '2507ZEWDE98', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00535', 'Sem descrição', 'DANIEL', 'HUB DE ESTRATÉGIA E GESTÃO', 'MK235', 'LOGITECH', NULL, 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00536', 'Sem descrição', 'DANIEL', 'HUB DE ESTRATÉGIA E GESTÃO', NULL, NULL, NULL, 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00537', ' HEADSET', 'DANIEL', 'HUB DE ESTRATÉGIA E GESTÃO', 'QUANTUM 100 M2', 'JBL', '-', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00538', 'KIT MOUSE E TECLADO ', 'KELLEN', 'HUB DE ESTRATÉGIA E GESTÃO', 'MK235', 'LOGITECH', 'MR20796', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00539', 'CAIXA ORGANIZADORA ', 'VINÍCIUS', 'GALPÃO', '-', '-', '-', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00540', 'CAIXA ORGANIZADORA ', 'LUIZ ', 'GALPÃO', '-', '-', '-', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00541', 'CAIXA ORGANIZADORA ', 'WANDERSON ', 'GALPÃO', '-', '-', '-', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00542', 'MALETA DE FERRAMENTAS SEMI COMPLETA', 'PEDRO', 'HUB DE ESTRATÉGIA E GESTÃO', 'ZRF NOBIL', 'TOOL BAG', '-', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00543', 'TECLADO ', 'IGOR ', 'CONTROLE - GALPÃO', 'PEBBLE KEYS 2 K380S', 'LOGITECH', 'YR0091', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00544', 'BOLSA PARA NOTEBOOK', 'IGOR', 'CONTROLE - GALPÃO', '-', 'HWJ', '-', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00545', 'TABLET', 'IGOR', 'CONTROLE - GALPÃO', 'ACTIVE 10 PRO', 'BLACKVIEW', 'ACTIVE10PNEU0100344', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00546', 'MOUSE ', 'IGOR', 'CONTROLE - GALPÃO', 'BA-MOU394', 'BASIKE', '-', 'Ótimo', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00547', 'Sem descrição', NULL, NULL, NULL, NULL, NULL, 'Bom', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00548', 'Sem descrição', NULL, NULL, NULL, NULL, NULL, 'Bom', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00549', 'Sem descrição', NULL, NULL, NULL, NULL, NULL, 'Bom', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00550', 'Sem descrição', NULL, NULL, NULL, NULL, NULL, 'Bom', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00551', 'Sem descrição', NULL, NULL, NULL, NULL, NULL, 'Bom', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00552', 'Sem descrição', NULL, NULL, NULL, NULL, NULL, 'Bom', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00553', 'Sem descrição', NULL, NULL, NULL, NULL, NULL, 'Bom', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00554', 'Sem descrição', NULL, NULL, NULL, NULL, NULL, 'Bom', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00555', 'Sem descrição', NULL, NULL, NULL, NULL, NULL, 'Bom', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00556', 'Sem descrição', NULL, NULL, NULL, NULL, NULL, 'Bom', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00557', 'Sem descrição', NULL, NULL, NULL, NULL, NULL, 'Bom', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00558', 'Sem descrição', NULL, NULL, NULL, NULL, NULL, 'Bom', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00559', 'Sem descrição', NULL, NULL, NULL, NULL, NULL, 'Bom', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00560', 'Sem descrição', NULL, NULL, NULL, NULL, NULL, 'Bom', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00561', 'Sem descrição', NULL, NULL, NULL, NULL, NULL, 'Bom', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00562', 'Sem descrição', NULL, NULL, NULL, NULL, NULL, 'Bom', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00563', 'Sem descrição', NULL, NULL, NULL, NULL, NULL, 'Bom', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00564', 'Sem descrição', NULL, NULL, NULL, NULL, NULL, 'Bom', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00565', 'Sem descrição', NULL, NULL, NULL, NULL, NULL, 'Bom', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00566', 'Sem descrição', NULL, NULL, NULL, NULL, NULL, 'Bom', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00567', 'Sem descrição', NULL, NULL, NULL, NULL, NULL, 'Bom', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00568', 'Sem descrição', NULL, NULL, NULL, NULL, NULL, 'Bom', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00569', 'Sem descrição', NULL, NULL, NULL, NULL, NULL, 'Bom', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00570', 'Sem descrição', NULL, NULL, NULL, NULL, NULL, 'Bom', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00571', 'Sem descrição', NULL, NULL, NULL, NULL, NULL, 'Bom', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00572', 'Sem descrição', NULL, NULL, NULL, NULL, NULL, 'Bom', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00573', 'Sem descrição', NULL, NULL, NULL, NULL, NULL, 'Bom', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00574', 'Sem descrição', NULL, NULL, NULL, NULL, NULL, 'Bom', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00575', 'Sem descrição', NULL, NULL, NULL, NULL, NULL, 'Bom', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00576', 'Sem descrição', NULL, NULL, NULL, NULL, NULL, 'Bom', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00577', 'Sem descrição', NULL, NULL, NULL, NULL, NULL, 'Bom', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00578', 'Sem descrição', NULL, NULL, NULL, NULL, NULL, 'Bom', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00579', 'Sem descrição', NULL, NULL, NULL, NULL, NULL, 'Bom', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00580', 'Sem descrição', NULL, NULL, NULL, NULL, NULL, 'Bom', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00581', 'Sem descrição', NULL, NULL, NULL, NULL, NULL, 'Bom', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00582', 'Sem descrição', NULL, NULL, NULL, NULL, NULL, 'Bom', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00583', 'Sem descrição', NULL, NULL, NULL, NULL, NULL, 'Bom', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00584', 'Sem descrição', NULL, NULL, NULL, NULL, NULL, 'Bom', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00585', 'Sem descrição', NULL, NULL, NULL, NULL, NULL, 'Bom', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00586', 'Sem descrição', NULL, NULL, NULL, NULL, NULL, 'Bom', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00587', 'Sem descrição', NULL, NULL, NULL, NULL, NULL, 'Bom', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00588', 'Sem descrição', NULL, NULL, NULL, NULL, NULL, 'Bom', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00589', 'Sem descrição', NULL, NULL, NULL, NULL, NULL, 'Bom', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00590', 'Sem descrição', NULL, NULL, NULL, NULL, NULL, 'Bom', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00591', 'Sem descrição', NULL, NULL, NULL, NULL, NULL, 'Bom', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00592', 'Sem descrição', NULL, NULL, NULL, NULL, NULL, 'Bom', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00593', 'Sem descrição', NULL, NULL, NULL, NULL, NULL, 'Bom', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00594', 'Sem descrição', NULL, NULL, NULL, NULL, NULL, 'Bom', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00595', 'Sem descrição', NULL, NULL, NULL, NULL, NULL, 'Bom', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00596', 'Sem descrição', NULL, NULL, NULL, NULL, NULL, 'Bom', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00597', 'Sem descrição', NULL, NULL, NULL, NULL, NULL, 'Bom', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00598', 'Sem descrição', NULL, NULL, NULL, NULL, NULL, 'Bom', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00599', 'Sem descrição', NULL, NULL, NULL, NULL, NULL, 'Bom', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00600', 'Sem descrição', NULL, NULL, NULL, NULL, NULL, 'Bom', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00601', 'Sem descrição', NULL, NULL, NULL, NULL, NULL, 'Bom', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00602', 'Sem descrição', NULL, NULL, NULL, NULL, NULL, 'Bom', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00603', 'Sem descrição', NULL, NULL, NULL, NULL, NULL, 'Bom', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00604', 'Sem descrição', NULL, NULL, NULL, NULL, NULL, 'Bom', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00605', 'Sem descrição', NULL, NULL, NULL, NULL, NULL, 'Bom', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00606', 'Sem descrição', NULL, NULL, NULL, NULL, NULL, 'Bom', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00607', 'Sem descrição', NULL, NULL, NULL, NULL, NULL, 'Bom', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00608', 'Sem descrição', NULL, NULL, NULL, NULL, NULL, 'Bom', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00609', 'Sem descrição', NULL, NULL, NULL, NULL, NULL, 'Bom', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00610', 'Sem descrição', NULL, NULL, NULL, NULL, NULL, 'Bom', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('BCM-00611', 'Sem descrição', NULL, NULL, NULL, NULL, NULL, 'Bom', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status)
VALUES ('TOTAL', 'Sem descrição', NULL, NULL, NULL, NULL, '111453.62999999992', 'Bom', true, 'disponivel')
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status, deactivation_reason, deactivation_date)
VALUES ('BCM-00130', 'MONITOR', 'EDGARD', 'ESCRITÓRIO GALPÃO', 'PHILIPS', 'PHILIPS', 'FXAA1120054852', 'Ruim', false, 'disponivel', 'DESCARTADO', NOW())
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status, deactivation_reason, deactivation_date)
VALUES ('BCM-00184', 'IMPRESSORA', NULL, 'FABRICANTE', 'BPE - 300', 'GDX', 'M422100009', 'Ótimo', false, 'disponivel', 'DEVOLVIDO', NOW())
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status, deactivation_reason, deactivation_date)
VALUES ('BCM-00229', 'NÍVEL DE MÃO ', 'EDUARDO', 'ALMOXARIFADO', 'COM IMÃ ', 'FERTAK TOOLS', '6312', 'Ótimo', false, 'disponivel', 'TROCA DE PATRIMONIO', NOW())
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status, deactivation_reason, deactivation_date)
VALUES ('BCM-00239', 'ALICATE CORTE DIAGONAL', 'EDUARDO', 'ALMOXARIFADO', '6"', 'TRAMONTINA', NULL, 'Bom', false, 'disponivel', 'TROCA DE PATRIMONIO', NOW())
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status, deactivation_reason, deactivation_date)
VALUES ('BCM-00251', 'ESQUADRO NÍVEL', 'EDUARDO', 'ALMOXARIFADO', '12 POL -300MM', 'GORILLAZ', NULL, 'Ótimo', false, 'disponivel', 'TROCA DE PATRIMONIO', NOW())
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status, deactivation_reason, deactivation_date)
VALUES ('BCM-00220', 'ALICATE PRENSA TERMINAL', 'EDUARDO', 'ALMOXARIFADO', '0,5 - 0,16MM', ' MANUKS ', 'LS-0516GF', 'Ótimo', false, 'disponivel', 'TROCA DE PATRIMONIO', NOW())
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status, deactivation_reason, deactivation_date)
VALUES ('BCM-00221', 'ALICATE UNIVERSAL', 'EDUARDO', 'ALMOXARIFADO', '8"', 'BELZER', '219022-1BBR', 'Ótimo', false, 'disponivel', 'TROCA DE PATRIMONIO', NOW())
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status, deactivation_reason, deactivation_date)
VALUES ('BCM-00222', 'ALICATE CORTE DIAGONAL', 'EDUARDO', 'ALMOXARIFADO', '6"', 'TRAMONTINA PRO', NULL, 'Ótimo', false, 'disponivel', 'TROCA DE PATRIMONIO', NOW())
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status, deactivation_reason, deactivation_date)
VALUES ('BCM-00235', 'ESTILETE ', 'EDUARDO', 'ALMOXARIFADO', 'AUTO LOCK', 'CARBOGRAFITE', NULL, 'Ótimo', false, 'disponivel', 'TROCA DE PATRIMONIO', NOW())
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status, deactivation_reason, deactivation_date)
VALUES ('BCM-00237', 'ALICATE AMPERÍMETRO DIGITAL
', 'LINDEMBERG', 'GALPÃO', 'ET-3200', 'MINIPA', NULL, 'Ótimo', false, 'disponivel', 'VENDIDO PARA O LINDEMBERG', NOW())
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status, deactivation_reason, deactivation_date)
VALUES ('BCM-00238', 'ESQUADRO NÍVEL', 'LINDEMBERG', 'GALPÃO ', '12 POL -300MM', 'GORILLAZ', NULL, 'Ótimo', false, 'disponivel', 'VENDIDO PARA O LINDEMBERG', NOW())
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status, deactivation_reason, deactivation_date)
VALUES ('BCM-00228', 'TRENA EMBORRACHADA ', 'ELIOENAI', 'GALPÃO ', '5 MTS ', 'AQUA TOOLS', '14450', 'Ótimo', false, 'disponivel', 'FERRAMENTA FOI PERDIDA, ELIOENAI FEZ A REPOSIÇÃO COM UMA TRENA NOVA DE PATRIMÔNIO 353.', NOW())
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status, deactivation_reason, deactivation_date)
VALUES ('BCM-00243', 'CHAVE DE FENDA ', 'ELIOENAI', 'GALPÃO ', '3/16X6', 'TRAMONTINA', NULL, 'Regular', false, 'disponivel', 'FERRAMENTA FOI PERDIDA, ELIOENAI FEZ A REPOSIÇÃO COM UMA TRENA NOVA DE PATRIMÔNIO 354.', NOW())
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status, deactivation_reason, deactivation_date)
VALUES ('BCM-00276', 'TORQUÍMETRO 2mm A 24mm', 'BRUNO', 'FERRAMENTA GALPÃO', 'NO24061792', 'TORQUE WRENCH', 'QS 30', 'Ótimo', false, 'disponivel', 'TROCA DE PATRIMONIO', NOW())
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status, deactivation_reason, deactivation_date)
VALUES ('BCM-00280', 'TORQUÍMETRO 2mm A 24mm', 'BRUNO', 'FERRAMENTA GALPÃO', 'KD230102059', 'TORQUE WRENCH', 'QS 30', 'Ótimo', false, 'disponivel', 'DUPLICADO', NOW())
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status, deactivation_reason, deactivation_date)
VALUES ('BCM-00338', 'ALICATE STRIPAX P/CORTAR E DECAPAR', 'JOSÉ', 'GALPÃO', 'STRIPAX', 'WEIDMULLER', '-', 'Ótimo', false, 'disponivel', 'TROCA DE PATRIMONIO', NOW())
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status, deactivation_reason, deactivation_date)
VALUES ('BCM-00340', 'ALICATE STRIPAX P/CORTAR E DECAPAR', 'EDUARDO', 'ALMOXARIFADO', 'STRIPAX', 'WEIDMULLER', '-', 'Ótimo', false, 'disponivel', 'TROCA DE PATRIMONIO', NOW())
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status, deactivation_reason, deactivation_date)
VALUES ('BCM-00342', 'ALICATE STRIPAX P/CORTAR E DECAPAR', 'LINDEMBERG', 'GALPÃO', 'STRIPAX', 'WEIDMULLER', '-', 'Ótimo', false, 'disponivel', 'TROCA DE PATRIMONIO', NOW())
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status, deactivation_reason, deactivation_date)
VALUES ('BCM-00046', 'HEADSET', 'FLAVIANE', 'ESCRITÓRIO RH', 'Quantum 100', 'JBL', 'CM0073-HL0759749', 'Ótimo', false, 'disponivel', 'QUEBROU', NOW())
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status, deactivation_reason, deactivation_date)
VALUES ('BCM-00069', 'TELEFONE', 'SÉRGIO', 'ESCRITÓRIO ADM', 'PLENO', 'INTELBRAS', '107896637609296', 'Ruim', false, 'disponivel', 'TROCA DE PATRIMONIO', NOW())
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status, deactivation_reason, deactivation_date)
VALUES ('BCM-00013', 'CELULAR', 'HENRIQUE', 'ESCRITÓRIO ADM', 'VERNE MODEL X', NULL, ' K605D1701230009954', 'Bom', false, 'disponivel', 'TROCA DE PATRIMONIO', NOW())
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status, deactivation_reason, deactivation_date)
VALUES ('BCM-00225', 'TRENA EMBORRACHADA ', 'LINDEMBERG', 'GALPÃO ', '5 MTS ', 'AQUA TOOLS', '14450', 'Bom', false, 'disponivel', 'TROCA DE PATRIMONIO', NOW())
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status, deactivation_reason, deactivation_date)
VALUES ('BCM-00185', 'PARAFUSADEIRA ', 'EDUARDO', 'ALMOXARIFADO', 'HP1640', 'MAKITA', '1682597', 'Ruim', false, 'disponivel', 'VENDIDO PARA IGOR', NOW())
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status, deactivation_reason, deactivation_date)
VALUES ('BCM-00213', 'FACA RETA DESENCAPADORA', 'EDUARDO', 'ALMOXARIFADO', '44345/007', 'TRAMONTINA', '233050 - 703', 'Ruim', false, 'disponivel', 'VENDIDO PARA IGOR', NOW())
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status, deactivation_reason, deactivation_date)
VALUES ('BCM-00257', 'CHAVE PHILLIPS ', 'EDUARDO', 'ALMOXARIFADO', '1/8X6', 'GEDORE ', NULL, 'Ruim', false, 'disponivel', 'VENDIDO PARA IGOR', NOW())
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status, deactivation_reason, deactivation_date)
VALUES ('BCM-00258', 'CHAVE DE FENDA ', 'EDUARDO', 'ALMOXARIFADO', '1/8x6', 'GEDORE ', NULL, 'Ruim', false, 'disponivel', 'VENDIDO PARA IGOR', NOW())
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status, deactivation_reason, deactivation_date)
VALUES ('BCM-00259', 'CHAVE DE FENDA ', 'EDUARDO', 'ALMOXARIFADO', '1/8X6', 'GEDORE ', NULL, 'Ruim', false, 'disponivel', 'VENDIDO PARA IGOR', NOW())
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status, deactivation_reason, deactivation_date)
VALUES ('BCM-00096', 'SOPRADOR AIR FREE', 'EDGARD', 'FERRAMENTA GALPÃO', NULL, 'MAKITA', NULL, 'Ruim', false, 'disponivel', 'QUEBROU', NOW())
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status, deactivation_reason, deactivation_date)
VALUES ('BCM-00310', 'GELADEIRA PANASONIC', 'LUIZ', 'GALPÃO', 'FROST FREE', 'PANASONIC', NULL, 'Ruim', false, 'disponivel', 'ITEM BRENO', NOW())
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status, deactivation_reason, deactivation_date)
VALUES ('BCM-00149', 'ARMARIO COZINHA', 'GERAL', 'COZINHA', NULL, NULL, NULL, 'Ruim', false, 'disponivel', 'Desativado', NOW())
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status, deactivation_reason, deactivation_date)
VALUES ('BCM-00085', 'TRANSFORMADOR220/380/440', 'EDGARD', 'FERRAMENTA GALPÃO', NULL, 'SEM MARCA', NULL, 'Ruim', false, 'disponivel', 'DESCARTADO', NOW())
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status, deactivation_reason, deactivation_date)
VALUES ('BCM-00153', 'MOUSE SEM FIO', 'SÁVIO', 'HOME OFFICE', 'WM116T', 'DELL', '0J5J4H-LO300-89J-M0TI-A00', 'Ruim', false, 'disponivel', 'ESTRAGADO', NOW())
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status, deactivation_reason, deactivation_date)
VALUES ('BCM-00155', 'HEADSET JBL', 'SÁVIO', 'HOME OFFICE', 'QUANTUM 100', 'JBL', '-', 'Ruim', false, 'disponivel', 'ESTRAGADO', NOW())
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status, deactivation_reason, deactivation_date)
VALUES ('BCM-00156', 'CALIBRADOR MULTIFUNÇÃO', 'BRUNO', 'FERRAMENTA GALPÃO', '237', 'HOMIS', '11330187', 'Ruim', false, 'disponivel', 'QUEBROU', NOW())
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status, deactivation_reason, deactivation_date)
VALUES ('BCM-00134', 'TORQUIMETRO', 'BRUNO', 'ESCRITÓRIO ENGENHARIA ', 'GEDORE', 'R68900100', NULL, 'Ótimo', false, 'disponivel', 'TROCA DE PATRIMONIO', NOW())
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status, deactivation_reason, deactivation_date)
VALUES ('BCM-00165', 'TORQUÍMETRO DE ESTALO', 'EDGARD', 'ESCRITÓRIO ENGENHARIA ', 'KD230102059', 'TORQUE WRENCH', 'QS 30', 'Ótimo', false, 'disponivel', 'TROCA DE PATRIMONIO', NOW())
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status, deactivation_reason, deactivation_date)
VALUES ('BCM-00272', 'MOUSE', 'HENRIQUE ', 'ESCRITÓRIO ADM', 'M-R0060', 'LOGITECH', 'MK235', 'Ótimo', false, 'disponivel', 'TROCA DE PATRIMONIO', NOW())
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status, deactivation_reason, deactivation_date)
VALUES ('BCM-00353', 'TRENA EMBORRACHADA ', 'EDUARDO', 'ALMOXARIFADO', '5 MTS ', 'AQUA TOOLS', '14450', 'Bom', false, 'disponivel', 'PATRIMÔNIO DESCARTADO ', NOW())
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status, deactivation_reason, deactivation_date)
VALUES ('BCM-00231', 'CHAVE DE FENDA ', 'EDUARDO', 'ALMOXARIFADO', '3/16X6', 'GEDORE ', NULL, 'Ótimo', false, 'disponivel', 'PATRIMÔNIO DESCARTADO ', NOW())
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status, deactivation_reason, deactivation_date)
VALUES ('BCM-00233', 'CHAVE DE FENDA ', 'EDUARDO', 'ALMOXARIFADO', '1/4X6', 'GEDORE ', NULL, 'Ótimo', false, 'disponivel', 'PATRIMÔNIO DESCARTADO ', NOW())
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status, deactivation_reason, deactivation_date)
VALUES ('BCM-00223', 'CHAVE DE FENDA ', 'EDUARDO', 'ALMOXARIFADO', '1/8x6', 'GEDORE ', NULL, 'Ótimo', false, 'disponivel', 'PATRIMÔNIO DESCARTADO ', NOW())
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status, deactivation_reason, deactivation_date)
VALUES ('BCM-00232', 'CHAVE PHILLIPS ', 'EDUARDO', 'ALMOXARIFADO', '5/16X6', 'GEDORE ', NULL, 'Ótimo', false, 'disponivel', 'PATRIMÔNIO DESCARTADO ', NOW())
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status, deactivation_reason, deactivation_date)
VALUES ('BCM-00234', 'CHAVE PHILLIPS ', 'EDUARDO', 'ALMOXARIFADO', '3/16X4', 'GEDORE ', NULL, 'Ótimo', false, 'disponivel', 'PATRIMÔNIO DESCARTADO ', NOW())
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status, deactivation_reason, deactivation_date)
VALUES ('BCM-00113', 'DOCK STATION', 'BRENO', 'ESCRITÓRIO GALPÃO', 'D6000 ', 'DELL', 'M4TJG', 'Ótimo', false, 'disponivel', 'PATRIMÔNIO DESCARTADO ', NOW())
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status, deactivation_reason, deactivation_date)
VALUES ('BCM-00224', 'CHAVE PHILLIPS ', 'EDUARDO', 'ALMOXARIFADO', '1/8x6', 'GEDORE ', NULL, 'Ótimo', false, 'disponivel', 'PATRIMÔNIO DESCARTADO ', NOW())
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status, deactivation_reason, deactivation_date)
VALUES ('BCM-00247', 'ALICATE CRIMPAR', 'EDUARDO', 'ALMOXARIFADO', '84-223', 'STANLEY', NULL, 'Bom', false, 'disponivel', 'PATRIMÔNIO DESCARTADO ', NOW())
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status, deactivation_reason, deactivation_date)
VALUES ('BCM-00350', 'ALICATE UNIVERSAL', 'EDUARDO', 'ALMOXARIFADO', '8"', NULL, NULL, 'Bom', false, 'disponivel', 'PATRIMÔNIO DESCARTADO ', NOW())
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status, deactivation_reason, deactivation_date)
VALUES ('BCM-00322', 'ESQUADRO NÍVEL', 'MÁRCIO ', 'GALPÃO', '6"', 'TRAMONTINA', NULL, 'Bom', false, 'disponivel', 'INSTANLEI', NOW())
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status, deactivation_reason, deactivation_date)
VALUES ('BCM-00226', 'NÍVEL DE MÃO ', 'EDUARDO', 'ALMOXARIFADO', 'COM IMÃ ', 'FERTAK TOOLS', '6312', 'Ótimo', false, 'disponivel', 'PATRIMÔNIO DESCARTADO ', NOW())
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status, deactivation_reason, deactivation_date)
VALUES ('BCM-00349', 'ALICATE PRENSA TERMINAL', 'EDUARDO', 'ALMOXARIFADO', '0,5 - 0,16MM', ' MANUKS ', 'LS-0516GF', 'Bom', false, 'disponivel', 'PATRIMÔNIO DESCARTADO ', NOW())
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status, deactivation_reason, deactivation_date)
VALUES ('BCM-00227', 'FURADEIRA DE IMPACTO ', 'EDUARDO', 'ALMOXARIFADO', 'DWD502', 'DEWALT ', NULL, 'Ótimo', false, 'disponivel', 'PATRIMÔNIO DESCARTADO ', NOW())
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status, deactivation_reason, deactivation_date)
VALUES ('BCM-00351', 'Sem descrição', NULL, NULL, NULL, NULL, NULL, 'Ótimo', false, 'disponivel', 'PATRIMÔNIO DESCARTADO ', NOW())
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status, deactivation_reason, deactivation_date)
VALUES ('BCM-00245', 'CHAVE DE FENDA ', 'EDUARDO', 'ALMOXARIFADO', '1/8x6', 'TRAMONTINA', NULL, 'Ótimo', false, 'disponivel', 'PATRIMÔNIO DESCARTADO ', NOW())
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status, deactivation_reason, deactivation_date)
VALUES ('BCM-00244', 'CHAVE PHILLIPS ', 'EDUARDO', 'ALMOXARIFADO', '5/16X6', 'FOXLUX', NULL, 'Ótimo', false, 'disponivel', 'PATRIMÔNIO DESCARTADO ', NOW())
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status, deactivation_reason, deactivation_date)
VALUES ('BCM-00246', 'CHAVE PHILLIPS ', 'EDUARDO', 'ALMOXARIFADO', '3/16X4', 'GEDORE ', NULL, 'Ótimo', false, 'disponivel', 'PATRIMÔNIO DESCARTADO ', NOW())
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status, deactivation_reason, deactivation_date)
VALUES ('BCM-00354', 'CHAVE DE FENDA ', 'LINDEMBERG', 'GALPÃO ', '3/16X6', 'GEDORE ', NULL, 'Ótimo', false, 'disponivel', 'PATRIMÔNIO DESCARTADO ', NOW())
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status, deactivation_reason, deactivation_date)
VALUES ('BCM-00201', 'CHAVE PHILIPS 1/8 X 6', 'EDUARDO', 'ALMOXARIFADO', '1/8 X 6', 'TRAMONTINA', NULL, 'Ótimo', false, 'disponivel', 'PATRIMÔNIO DESCARTADO ', NOW())
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status, deactivation_reason, deactivation_date)
VALUES ('BCM-00249', 'LIMA CHATA', 'EDUARDO', 'ALMOXARIFADO', NULL, NULL, NULL, 'Regular', false, 'disponivel', 'PATRIMÔNIO DESCARTADO ', NOW())
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status, deactivation_reason, deactivation_date)
VALUES ('BCM-00253', 'ALICATE UNIVERSAL', 'EDUARDO', 'ALMOXARIFADO', '8"', 'TRAMONTINA', NULL, 'Ótimo', false, 'disponivel', 'PATRIMÔNIO DESCARTADO ', NOW())
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status, deactivation_reason, deactivation_date)
VALUES ('BCM-00209', 'ALICATE CORTE DIAGONAL', 'EDUARDO', 'ALMOXARIFADO', '6 "', 'TRAMONTINA', NULL, 'Ótimo', false, 'disponivel', 'PATRIMÔNIO DESCARTADO ', NOW())
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status, deactivation_reason, deactivation_date)
VALUES ('BCM-00323', 'NÍVEL DE MÃO ', 'EDUARDO', 'ALMOXARIFADO', 'COM IMÃ ', 'FERTAK TOOLS', '6312', 'Ótimo', false, 'disponivel', 'PATRIMÔNIO DESCARTADO ', NOW())
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status, deactivation_reason, deactivation_date)
VALUES ('BCM-00192', 'MICRO SD', 'EDGARD', 'ESCRITÓRIO GALPÃO', '16 GB', 'SAN DISK', NULL, 'Ótimo', false, 'disponivel', 'PATRIMÔNIO DESCARTADO ', NOW())
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status, deactivation_reason, deactivation_date)
VALUES ('BCM-00337', 'ALICATE STRIPAX P/CORTAR E DECAPAR', 'LUIZ', 'GALPÃO', 'STRIPAX', 'WEIDMULLER', NULL, 'Ótimo', false, 'disponivel', 'PATRIMÔNIO DESCARTADO ', NOW())
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status, deactivation_reason, deactivation_date)
VALUES ('BCM-00284', 'SWITCH DE MESA COM 8 PORTAS ', 'EDGARD', 'ENGENHARIA', 'LS1008G', 'TP-LINK', '223C2A2000870', 'Ótimo', false, 'disponivel', 'PATRIMÔNIO DESCARTADO ', NOW())
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status, deactivation_reason, deactivation_date)
VALUES ('BCM-00313', 'TECLADO', 'LUIZ', 'GALPÃO', 'KEY-669', 'PCTOP', NULL, 'Bom', false, 'disponivel', 'PATRIMÔNIO DESCARTADO ', NOW())
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status, deactivation_reason, deactivation_date)
VALUES ('BCM-00341', 'ALICATE STRIPAX P/CORTAR E DECAPAR', 'DANILO', 'GALPÃO', 'STRIPAX', 'WEIDMULLER', NULL, 'Ótimo', false, 'disponivel', 'PATRIMÔNIO DESCARTADO ', NOW())
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status, deactivation_reason, deactivation_date)
VALUES ('BCM-00348', 'NOTEBOOK', 'IGOR', 'GALPÃO', 'LATITUDE 3550', 'DELL', 'P170G003', 'Ótimo', false, 'disponivel', 'PATRIMÔNIO DESCARTADO ', NOW())
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status, deactivation_reason, deactivation_date)
VALUES ('BCM-00003', 'TECLADO', 'ESTOQUE', 'ESCRITÓRIO ENGENHARIA', 'N3 COMPUTER SMART KEYBOARD', 'SMART', 'P/N:KB-750/TEC.01.015', 'Ruim', false, 'disponivel', 'PATRIMÔNIO DESCARTADO ', NOW())
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status, deactivation_reason, deactivation_date)
VALUES ('BCM-00021', 'TECLADO ', 'HENRIQUE', 'ALMOXARIFADO', 'N3', NULL, 'KB750PS2623908267', 'Ruim', false, 'disponivel', 'PATRIMÔNIO DESCARTADO ', NOW())
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status, deactivation_reason, deactivation_date)
VALUES ('BCM-00045', 'DOCKSTATION', 'TOMÁS', 'ESCRITÓRIO ENGENHARIA', 'D600 ', 'DELL', 'M4TJG-CN-OM4TJG-BLK00-94K-64E3-A03', 'Ruim', false, 'disponivel', 'PATRIMÔNIO DESCARTADO ', NOW())
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status, deactivation_reason, deactivation_date)
VALUES ('BCM-00105', 'FURADOR DE CHAPA HIDRÁULICO', 'EDGARD', 'FERRAMENTA GALPÃO', NULL, 'NAGANO', NULL, 'Ruim', false, 'disponivel', 'PATRIMÔNIO DESCARTADO ', NOW())
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status, deactivation_reason, deactivation_date)
VALUES ('BCM-00107', 'FURADOR DE CHAPA HIDRÁULICO', 'EDGARD', 'FERRAMENTA GALPÃO', NULL, 'SEM MARCA', NULL, 'Ruim', false, 'disponivel', 'PATRIMÔNIO DESCARTADO ', NOW())
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status, deactivation_reason, deactivation_date)
VALUES ('BCM-00138', 'IMPRESSORA', 'SÉRGIO', 'ESCRITÓRIO ADM', 'LASEJET M1212nfMFP', 'HP', 'BRGSD810FC', 'Ruim', false, 'disponivel', 'PATRIMÔNIO DESCARTADO ', NOW())
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status, deactivation_reason, deactivation_date)
VALUES ('BCM-00193', 'MICRO SD', 'ESTOQUE', 'ESCRITÓRIO ENGENHARIA', '16 GB', 'SAN DISK', NULL, 'Ruim', false, 'disponivel', 'PATRIMÔNIO DESCARTADO ', NOW())
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status, deactivation_reason, deactivation_date)
VALUES ('BCM-00203', 'CHAVE CANHÃO 11', 'BCM - ADM', 'ALMOXARIFADO', '11 MM', 'TRAMONTINA', NULL, 'Ótimo', false, 'disponivel', 'PATRIMÔNIO DESCARTADO ', NOW())
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status, deactivation_reason, deactivation_date)
VALUES ('BCM-00204', 'CHAVE CANHÃO 13', 'BCM - ADM', 'ALMOXARIFADO', '13 MM', 'TRAMONTINA', NULL, 'Ótimo', false, 'disponivel', 'PATRIMÔNIO DESCARTADO ', NOW())
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status, deactivation_reason, deactivation_date)
VALUES ('BCM-00205', 'CHAVE CANHÃO 10', 'BCM - ADM', 'ALMOXARIFADO', '10 MM', 'TRAMONTINA', NULL, 'Ótimo', false, 'disponivel', 'PATRIMÔNIO DESCARTADO ', NOW())
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status, deactivation_reason, deactivation_date)
VALUES ('BCM-00206', 'CHAVE CANHÃO 6', 'BCM - ADM', 'ALMOXARIFADO', '6 MM', 'TRAMONTINA', NULL, 'Ótimo', false, 'disponivel', 'PATRIMÔNIO DESCARTADO ', NOW())
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status, deactivation_reason, deactivation_date)
VALUES ('BCM-00207', 'CHAVE CANHÃO 8', 'BCM - ADM', 'ALMOXARIFADO', '8 MM', 'TRAMONTINA', NULL, 'Ótimo', false, 'disponivel', 'PATRIMÔNIO DESCARTADO ', NOW())
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status, deactivation_reason, deactivation_date)
VALUES ('BCM-00208', 'CHAVE CANHÃO 7', 'BCM - ADM', 'ALMOXARIFADO', '7 MM', 'TRAMONTINA', NULL, 'Ótimo', false, 'disponivel', 'PATRIMÔNIO DESCARTADO ', NOW())
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status, deactivation_reason, deactivation_date)
VALUES ('BCM-00287', 'ADAPTADOR USB RJ45', 'TOMÁS', 'ESCRITÓRIO ENGENHARIA ', 'UE300C', 'TP-LINK', '.223968106811', 'Ótimo', false, 'disponivel', 'PATRIMÔNIO DESCARTADO ', NOW())
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status, deactivation_reason, deactivation_date)
VALUES ('BCM-00288', 'ADAPTADOR USB RJ45', 'TOMÁS', 'ESCRITÓRIO ENGENHARIA ', 'UE300C', 'TP-LINK', '.2239681005094', 'Ótimo', false, 'disponivel', 'PATRIMÔNIO DESCARTADO ', NOW())
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status, deactivation_reason, deactivation_date)
VALUES ('BCM-00352', 'Sem descrição', NULL, NULL, NULL, NULL, NULL, 'Ruim', false, 'disponivel', 'PATRIMÔNIO DESCARTADO ', NOW())
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status, deactivation_reason, deactivation_date)
VALUES ('BCM-00283', 'SWITCH DE MESA COM 8 PORTAS ', 'LUIZ', 'ENGENHARIA', 'LS1008G', 'TP-LINK', '223C2A2004116', 'Ótimo', false, 'disponivel', 'PATRIMÔNIO DESCARTADO ', NOW())
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status, deactivation_reason, deactivation_date)
VALUES ('BCM-00216', 'ALICATE CRIMPAR', 'BCM - ADM', 'ALMOXARIFADO', 'BM347', 'B-MAX', NULL, 'Ótimo', false, 'disponivel', 'PATRIMÔNIO DESCARTADO ', NOW())
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status, deactivation_reason, deactivation_date)
VALUES ('BCM-00210', 'ALICATE UNIVERSAL', 'BCM - ADM', 'ALMOXARIFADO', '8"', 'TRAMONTINA', NULL, 'Ótimo', false, 'disponivel', 'PATRIMÔNIO DESCARTADO ', NOW())
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status, deactivation_reason, deactivation_date)
VALUES ('BCM-00241', 'CHAVE DE FENDA ', 'BCM - ADM', 'ALMOXARIFADO', '1/4X6', 'GEDORE ', NULL, 'Bom', false, 'disponivel', 'PATRIMÔNIO DESCARTADO ', NOW())
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status, deactivation_reason, deactivation_date)
VALUES ('BCM-00202', 'CHAVE PHILIPS 5/16 X 8', 'BCM - ADM', 'ALMOXARIFADO', '5/16 X 8', 'TRAMONTINA', NULL, 'Ótimo', false, 'disponivel', 'PATRIMÔNIO DESCARTADO ', NOW())
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status, deactivation_reason, deactivation_date)
VALUES ('BCM-00256', 'CHAVE PHILLIPS ', 'BCM - ADM', 'ALMOXARIFADO', '3/16X4', 'TRAMONTINA', NULL, 'Ótimo', false, 'disponivel', 'PATRIMÔNIO DESCARTADO ', NOW())
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status, deactivation_reason, deactivation_date)
VALUES ('BCM-00199', 'CHAVE DE FENDA 3/16 X 6', 'BCM - ADM', 'ALMOXARIFADO', '3/16 X 6', 'TRAMONTINA', NULL, 'Ótimo', false, 'disponivel', 'PATRIMÔNIO DESCARTADO ', NOW())
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status, deactivation_reason, deactivation_date)
VALUES ('BCM-00255', 'CHAVE PHILLIPS ', 'BCM - ADM', 'ALMOXARIFADO', '3/16X4', 'TRAMONTINA', NULL, 'Ótimo', false, 'disponivel', 'PATRIMÔNIO DESCARTADO ', NOW())
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status, deactivation_reason, deactivation_date)
VALUES ('BCM-00240', 'ALICATE PRENSA TREMIAL ', 'BCM - ADM', 'ALMOXARIFADO', 'LK-04W', 'LUKMA', NULL, 'Bom', false, 'disponivel', 'PATRIMÔNIO DESCARTADO ', NOW())
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status, deactivation_reason, deactivation_date)
VALUES ('BCM-00236', 'VIRA MACHO ', 'BCM - ADM', 'ALMOXARIFADO', 'N° 1', 'ADES', NULL, 'Bom', false, 'disponivel', 'PATRIMÔNIO DESCARTADO ', NOW())
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status, deactivation_reason, deactivation_date)
VALUES ('BCM-00242', 'CHAVE PHILLIPS ', 'BCM - ADM', 'ALMOXARIFADO', '1/8x6', 'GEDORE ', NULL, 'Ótimo', false, 'disponivel', 'PATRIMÔNIO DESCARTADO ', NOW())
ON CONFLICT (asset_number) DO NOTHING;

INSERT INTO assets (asset_number, description, responsible, location, model, brand, serial_number, condition, is_active, status, deactivation_reason, deactivation_date)
VALUES ('BCM-00295', 'MONITOR 24"', 'BCM - ADM', 'ARQUIVO MORTO', 'F24T350FHLMZD', 'SAMSUNG', 'F24T350FH', 'Ótimo', false, 'disponivel', 'PATRIMÔNIO DESCARTADO ', NOW())
ON CONFLICT (asset_number) DO NOTHING;

