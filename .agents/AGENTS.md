# Manual Completo de Design System & UI/UX

## 1. Regras Mandatórias e Filosofia Visual
- **Estética Corporativa Premium:** Foco em visual sóbrio, limpo, moderno e de alto contraste.
- **Proibido Efeitos "Neon":** Botões e elementos não utilizam sombras brilhantes/neon exageradas.
- **Consistência de Dark Mode / Light Mode:** É estritamente proibido injetar cores literais em Hexadecimal (#fff, #000) ou rgb() em inline-styles quando existir uma variável CSS global. Utilize sempre `var(--nome-da-variavel)`.
- **Padronização de Ícones:** Todos os ícones utilizam a biblioteca Lucide React com espessura padrão de traço `strokeWidth={1.5}` (forçado globalmente via CSS `.lucide`).

## 2. Tipografia
O sistema utiliza duas fontes modernas do Google Fonts:

| Uso | Família Tipográfica | Variável CSS | Pesos Utilizados |
| --- | --- | --- | --- |
| Corpo / Interface / Inputs | Inter | `var(--font-family)` | 300, 400, 500, 600, 700 |
| Títulos / Headers / Números | Outfit | `var(--font-display)`| 400, 600, 700 |

- **Letter-spacing padrão:** `-0.01em` no corpo do texto e `-0.02em` em títulos (`h1`-`h6`, `.page-title`).

## 3. Paleta de Cores e Tokens de Tema
O sistema opera com um tema base escuro (Dark) refinado com suporte ao tema claro (Light via `[data-theme="light"]`).

### 3.1 Fundos e Superfícies
| Token CSS | Dark Mode (Padrão) | Light Mode | Aplicação |
| --- | --- | --- | --- |
| `--bg-color` / `--bg-main` | `hsl(215, 30%, 6%)` | `#f1f5f9` (Slate-100) | Fundo da aplicação / tela |
| `--bg-paper` / `--bg-card` | `hsl(215, 30%, 10%)` | `#ffffff` | Fundo de cards, modais e containers |
| `--bg-elevated` | `oklch(0.235 0.018 255)` | `#f8fafc` | Superfícies elevadas e botões secundários |
| `--bg-hover` | `oklch(0.265 0.022 255)` | `#e2e8f0` | Estado de hover de itens/linhas/botões |
| `--bg-active` | `oklch(0.265 0.022 255)` | `#cbd5e1` | Cabeçalho de tabelas e itens ativos |
| `--bg-sidebar` | `hsl(215, 30%, 6%)` | `#ffffff` | Sidebar lateral |

### 3.2 Tipografia e Textos
| Token CSS | Dark Mode | Light Mode | Aplicação |
| --- | --- | --- | --- |
| `--text-main` | `oklch(0.92 0.005 240)` | `#0f172a` (Slate-900) | Textos principais, títulos e labels fortes |
| `--text-secondary` | `oklch(0.75 0.01 240)` | `#334155` (Slate-700) | Textos secundários, labels de formulário |
| `--text-muted` | `oklch(0.65 0.01 240)` | `#475569` (Slate-600) | Legendas, subtítulos e descrições |

### 3.3 Cores Primárias e Status
| Token | Dark Mode | Light Mode | Fundo Translúcido (-bg) | Borda Translúcida (-border) |
| --- | --- | --- | --- | --- |
| Primary (Azul) | `oklch(0.62 0.17 240)` | `#2563eb` | `var(--primary-bg)` | `var(--primary-ring)` |
| Success (Verde) | `#22c993` | `#10b981` | `var(--success-bg)` | `var(--success-border)` |
| Warning (Amarelo/Laranja) | `#f5a623` | `#f59e0b` | `var(--warning-bg)` | `var(--warning-border)` |
| Danger (Vermelho) | `oklch(0.65 0.22 25)` | `#ef4444` | `var(--danger-bg)` | `var(--danger-border)` |
| Info (Ciano) | `#17c5db` | `#06b6d4` | `var(--info-bg)` | — |
| Purple (Roxo) | `#b16cf7` | `#a855f7` | `var(--purple-bg)` | — |
| Orange (Laranja) | `#fb8332` | `#f97316` | `var(--orange-bg)` | — |

## 4. Bordas, Sombras e Glassmorphism
### 4.1 Arredondamento (Border Radius)
- `--radius-xs`: 6px (tags pequenas, tooltips, botões de ícone)
- `--radius-sm`: 8px (botões padrão, inputs, tabs)
- `--radius`: 0.65rem (~10.4px)
- `--radius-md`: 16px (cards médios)
- `--radius-lg`: 20px (modais, containers de tabelas)
- `--radius-xl`: 24px (painéis amplos)

### 4.2 Bordas
- `--border`: `oklch(0.32 0.018 255)` (Dark) / `#cbd5e1` (Light)
- `--border-light`: `oklch(0.35 0.018 255)` (Dark) / `#94a3b8` (Light)
- `--border-focus`: `var(--primary)`

### 4.3 Glassmorphism (Vidro Fosco)
```css
.glass-panel {
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  box-shadow: var(--glass-shadow);
  backdrop-filter: var(--glass-blur); /* blur(12px) */
}
```

## 5. Estrutura Padrão de Páginas (Layout Corporativo)
Toda nova página ou aba deve seguir rigorosamente a seguinte hierarquia visual:

```jsx
<div className="page-container animate-fade-in">
  {/* Cabeçalho da Página */}
  <div className="page-header">
    <div className="page-title-area">
      <div className="page-title-text">
        <h1 className="page-title">Título da Página</h1>
        <p className="page-subtitle">Subtítulo explicativo corporativo</p>
      </div>
    </div>
    
    {/* Ações / Botões à Direita */}
    <div className="page-actions" style={{ display: 'flex', gap: 12 }}>
      <button className="btn btn--secondary">
        <Download size={16} /> Exportar
      </button>
      <button className="btn btn--primary">
        <Plus size={16} /> Novo Registro
      </button>
    </div>
  </div>
  {/* Barra de Filtros (Opcional) */}
  <div className="filter-bar" style={{ margin: '0 32px 20px 32px' }}>
    <div className="filter-group">
      <span className="filter-label">Status:</span>
      <select className="form-input" style={{ width: 160 }}>
        <option value="">Todos</option>
      </select>
    </div>
  </div>
  {/* Conteúdo Principal */}
  <div style={{ padding: '0 32px' }}>
    {/* Tabelas, Cards ou Grids */}
  </div>
</div>
```
⚠️ **PROIBIÇÃO:** Nunca crie caixas de ícones coloridas ou gradientes chamativos ao lado do título da página (`page-title-icon`). O design foca exclusivamente na tipografia limpa.

## 6. Sistema de Subabas (`.page-tabs`)
Para páginas que alternam entre visões secundárias:

```jsx
<div className="page-tabs">
  <button 
    className={`page-tab ${abaAtiva === 'geral' ? 'page-tab--active' : ''}`}
    onClick={() => setAbaAtiva('geral')}
  >
    <LayoutGrid size={16} /> Visão Geral
  </button>
  <button 
    className={`page-tab ${abaAtiva === 'historico' ? 'page-tab--active' : ''}`}
    onClick={() => setAbaAtiva('historico')}
  >
    <History size={16} /> Histórico
  </button>
</div>
```

## 7. Padrão de Botões (`.btn`)
Os botões possuem transição física suave, raio de 8px e leve escala ao passar o mouse (`scale(1.02)` / `scale(0.98)` no clique).

```jsx
{/* Botão Primário (Ação Principal) */}
<button className="btn btn--primary">
  <Plus size={16} /> Criar Pedido
</button>
{/* Botão Secundário (Ação Neutra/Apoio) */}
<button className="btn btn--secondary">
  <Filter size={16} /> Filtrar
</button>
{/* Botão Destrutivo (Exclusão/Cancelar) */}
<button className="btn btn--danger">
  <Trash2 size={16} /> Excluir
</button>
{/* Botão Fantasma (Links / Ações Sutis) */}
<button className="btn btn--ghost">
  Cancelar
</button>
{/* Botão Outline */}
<button className="btn btn--outline">
  Detalhes
</button>
{/* Botão de Ícone Quadrado */}
<button className="btn-icon" title="Editar">
  <Edit3 size={16} />
</button>
```

## 8. Formulários e Inputs
- **Altura Padrão:** Todos os campos (`select`, `input`, `textarea`, `.form-input`) possuem altura mínima unificada de `40px` e padding de `0.6rem 0.85rem`.
- **Foco:** Borda na cor primária com halo suave (`box-shadow: 0 0 0 3px var(--primary-ring)`).

```jsx
<div className="form-group">
  <label className="form-label">Nome do Fornecedor *</label>
  <input 
    type="text" 
    className="form-input" 
    placeholder="Digite a razão social..." 
  />
</div>
<div className="form-actions">
  <button type="button" className="btn btn--ghost" onClick={onClose}>Cancelar</button>
  <button type="submit" className="btn btn--primary">Salvar Fornecedor</button>
</div>
```

## 9. Tabelas e DataGrids
- As tabelas devem estar sempre dentro de um contêiner `.table-responsive` com bordas arredondadas e sombra suave.
- O cabeçalho (`th`) utiliza fundo `--bg-active`, texto em caixa alta (uppercase), `letter-spacing: 0.05em` e `user-select: none`.
- Hover nas linhas é automático via `.table--hover` ou `.table tr:hover`.
- Para fixar o cabeçalho com efeito de vidro durante a rolagem, utilize a classe `glass-header`.

```jsx
<div className="table-responsive">
  <table className="table table--hover">
    <thead>
      <tr>
        <th className="glass-header">Código</th>
        <th className="glass-header">Descrição</th>
        <th className="glass-header">Valor Total</th>
        <th className="glass-header">Status</th>
        <th className="glass-header" style={{ width: 80 }}>Ações</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>#1024</td>
        <td>Chapa de Aço Inox 304</td>
        <td>R$ 4.500,00</td>
        <td><span className="badge badge--success">Concluído</span></td>
        <td>
          <button className="btn-icon"><Eye size={14} /></button>
        </td>
      </tr>
    </tbody>
  </table>
</div>
```

## 10. Componentes Globais Obrigatórios

### 10.1 Modal Oficial (`src/components/Modal/Modal.jsx`)
Sempre importe o componente oficial. Ele gerencia o portal para document.body, tecla Escape, backdrop com blur e física de mola (Framer Motion):

```jsx
import Modal from '../Modal/Modal';

<Modal 
  isOpen={modalAberto} 
  onClose={() => setModalAberto(false)} 
  title="Novo Registro de Compra"
  size="md" // 'sm' (420px) | 'md' (600px) | 'lg' (900px) | 'xl' (1200px) | 'full'
>
  <form onSubmit={handleSalvar}>
    <div className="form-group">
      <label className="form-label">Descrição</label>
      <input className="form-input" />
    </div>
    <div className="form-actions">
      <button type="button" className="btn btn--ghost" onClick={() => setModalAberto(false)}>Cancelar</button>
      <button type="submit" className="btn btn--primary">Salvar</button>
    </div>
  </form>
</Modal>
```

### 10.2 Estado Vazio (`src/components/UI/EmptyState.jsx`)
Quando não houver registros ou filtros retornarem vazio:

```jsx
import EmptyState from '../UI/EmptyState';
import { PackageX } from 'lucide-react';

<EmptyState 
  icon={PackageX} 
  title="Nenhum fornecedor encontrado" 
  description="Não há fornecedores cadastrados para a categoria selecionada."
  action={
    <button className="btn btn--primary" onClick={handleNovo}>
      Cadastrar Primeiro Fornecedor
    </button>
  }
/>
```

### 10.3 Carregamento Esqueleto (`src/components/UI/Skeleton.jsx`)
Em vez de spinners pontuais ou mensagens como "Carregando...", preveja o layout visual dos dados:

```jsx
import Skeleton from '../UI/Skeleton';

// Formato retangular para cards/linhas
<Skeleton height="40px" width="100%" />
// Formato circular para fotos/avatares
<Skeleton variant="circular" width="48px" height="48px" />
```

### 10.4 Avatar de Usuário (`src/components/UI/Avatar.jsx`)
Calcula automaticamente as iniciais e aplica a cor correspondente:

```jsx
import Avatar from '../UI/Avatar';
<Avatar user={usuarioLogado} size={36} />
```

## 11. Animações e Transições
O sistema possui classes utilitárias pré-configuradas para transições fluidas:
- `.animate-fade-in`: Fade suave na entrada da tela (0.4s).
- `.animate-fade-in-up`: Entrada subindo 16px.
- `.animate-slide-in-right`: Entrada deslizando 24px da direita.
- `.animate-scale-in`: Efeito de zoom suave (de 0.92 para 1.0).
- `.flash-highlight`: Pisca suavemente em verde (`--success-bg`) para confirmar que um registro foi alterado/adicionado.
- `[data-tooltip]`: Tooltip nativo em CSS com transição de mola.

## 12. Tabela de Proibições ("O que NÃO fazer")
| ❌ Proibido | ✅ Forma Correta |
| --- | --- |
| Criar `<div>` de modal absoluto do zero | Importar `<Modal>` de `src/components/Modal/Modal.jsx` |
| Escrever "Carregando..." ou apenas um spinner solto | Utilizar `<Skeleton>` de `src/components/UI/Skeleton.jsx` |
| Exibir parágrafos soltos como "Nenhum dado" | Utilizar `<EmptyState>` de `src/components/UI/EmptyState.jsx` |
| Injetar cores `#1e293b`, `rgb(37, 99, 235)` no inline-style | Utilizar variáveis CSS (`var(--bg-paper)`, `var(--primary)`) |
| Criar caixas de ícones coloridas ao lado do título da página | Deixar apenas o título e subtítulo com a tipografia padrão |
| Adicionar box-shadow com brilho de neon nos botões | Usar as classes `.btn--primary`, `.btn--secondary`, etc. |
| Alterar a espessura de ícones do Lucide para 2 ou 3 | Manter o padrão global `strokeWidth={1.5}` |
