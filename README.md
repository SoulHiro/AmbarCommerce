<div align="center">

<br />

# 🛍 Âmbar E-commerce

**Ecommerce de moda editorial — curadoria acima de volume.**

<br />

![Next.js](https://img.shields.io/badge/Next.js_16-000000?style=flat&logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React_19-61DAFB?style=flat&logo=react&logoColor=1a1f36)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_v4-0EA5E9?style=flat&logo=tailwindcss&logoColor=white)
![Drizzle ORM](https://img.shields.io/badge/Drizzle_ORM-C5F74F?style=flat&logo=drizzle&logoColor=1a1a1a)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-336791?style=flat&logo=postgresql&logoColor=white)
![better-auth](https://img.shields.io/badge/better--auth-7C3AED?style=flat&logoColor=white)
![nuqs](https://img.shields.io/badge/nuqs_2-E94560?style=flat&logoColor=white)
![Status](https://img.shields.io/badge/status-em_desenvolvimento-166534?style=flat)
![License](https://img.shields.io/badge/license-All_Rights_Reserved-red?style=flat)

<br />

[🌐 Ver Demo em Produção](#) · [📋 Roadmap](#-roadmap) · [🐛 Reportar Bug](#) · [💡 Sugerir Feature](#)

</div>

---

## 📋 Índice

1. [Sobre o projeto](#-sobre-o-projeto)
2. [Funcionalidades implementadas](#-funcionalidades-implementadas)
3. [Stack tecnológica](#️-stack-tecnológica)
4. [Arquitetura de pastas](#-arquitetura-de-pastas)
5. [Como executar](#-como-executar)
6. [Banco de dados](#️-banco-de-dados)
7. [Roadmap](#-roadmap)
8. [Autor](#-autor)

---

## 🏛 Sobre o projeto

**Âmbar** é um ecommerce de moda com curadoria editorial — não vende tudo para todos, mas sim peças escolhidas com critério, apresentadas com cuidado. O projeto é uma implementação full-stack em **Next.js 16 App Router** com foco em performance, UX refinada e arquitetura limpa.

O público-alvo são mulheres e homens entre 30–50 anos, classes A/B, que valorizam curadoria acima de volume. A identidade visual segue princípios editoriais: imagem acima de tudo, elegância sem ostentação e a temperatura emocional do âmbar.

> **Arquitetura:** Este repositório é o frontend + BFF completo do projeto. Não há backend separado — todas as mutações passam por _Server Actions_ tipadas e o acesso a dados é feito diretamente no servidor Next.js via Drizzle ORM + PostgreSQL.

---

## ✅ Funcionalidades implementadas

### 🔐 Autenticação

| Feature           | Descrição                                                                           |
| ----------------- | ----------------------------------------------------------------------------------- |
| **Email + Senha** | Cadastro e login com validação Zod + react-hook-form. Feedback imediato via Sonner. |
| **Google OAuth**  | Login social com account linking — associa a conta Google a um email já cadastrado. |
| **Sessão segura** | better-auth com cookies HttpOnly. Rotas protegidas por redirect no servidor.        |

### 🗂 Catálogo

| Feature                  | Descrição                                                                                                 |
| ------------------------ | --------------------------------------------------------------------------------------------------------- |
| **Páginas de categoria** | Grid de produtos com slug dinâmico. 6 categorias seedadas (24 produtos, 106+ variantes).                  |
| **Filtro por gênero**    | Páginas `/gender/[feminino\|masculino\|unissex]` com query direta no banco por enum.                      |
| **Filtros avançados**    | Cor, faixa de preço e avaliação mínima via **nuqs**. Sem botão "Aplicar" — debounce de 500ms.             |
| **Paginação**            | 12 produtos por página. Navegação preserva todos os filtros ativos na URL.                                |
| **Busca live**           | Dropdown no header com debounce 300ms, ILIKE em nome e descrição, navegação por teclado (`↑↓ Enter Esc`). |
| **Ordenação**            | Relevância, menor/maior preço, mais recentes — estado na URL, sem reload.                                 |

### 📦 Página de produto

| Feature                   | Descrição                                                                                        |
| ------------------------- | ------------------------------------------------------------------------------------------------ |
| **Galeria de imagens**    | Miniaturas verticais à esquerda + imagem principal. Sincronizada com cor selecionada.            |
| **Zoom lens (lupa)**      | Lupa 180px com fator 2.8×. Manipulação DOM direta via `useRef` — zero re-renders no `mousemove`. |
| **Seletor de variantes**  | Swatches de cor + pills de tamanho. Estado sincronizado com URL via nuqs.                        |
| **Produtos relacionados** | 4 produtos da mesma categoria, excluindo o atual.                                                |

### 🛒 Carrinho & Wishlist

| Feature                  | Descrição                                                                         |
| ------------------------ | --------------------------------------------------------------------------------- |
| **Carrinho slide-over**  | Sheet lateral com itens, controle de quantidade, remoção e total calculado.       |
| **Wishlist / Favoritos** | Toggle com UI otimista. Página `/account/wishlist` com remoção inline sem reload. |

### 🎨 UI & Experiência

| Feature               | Descrição                                                                             |
| --------------------- | ------------------------------------------------------------------------------------- |
| **Responsivo**        | Mobile-first. Header simplificado no mobile com sheet navigation e drawer de filtros. |
| **Dark / Light mode** | `next-themes` com toggle. Variáveis CSS semânticas sem hardcode de cores.             |
| **Mega menu desktop** | Menu hover com subcategorias e fechamento suave ao sair da área do header.            |

---

## ⚙️ Stack tecnológica

| Camada           | Tecnologia                      | Versão  | Papel                                                 |
| ---------------- | ------------------------------- | ------- | ----------------------------------------------------- |
| **Framework**    | Next.js (App Router)            | `16.2`  | SSR, RSC, Server Actions, file-based routing          |
| **UI**           | React                           | `19.2`  | Client components, hooks, transitions otimistas       |
| **Estilo**       | Tailwind CSS                    | `v4`    | CSS-first config, design tokens, variáveis semânticas |
| **Componentes**  | shadcn/ui + Radix UI            | latest  | Primitivos headless — Sheet, Popover, Form, Toast…    |
| **Ícones**       | Lucide React                    | `1.24`  | Ícones SVG stroke-based consistentes                  |
| **ORM**          | Drizzle ORM                     | `0.45`  | Schema type-safe, migrations, query builder           |
| **Banco**        | PostgreSQL                      | 17+     | Banco relacional principal via driver `pg`            |
| **Auth**         | better-auth                     | `1.6`   | Email/senha + Google OAuth + account linking          |
| **URL State**    | nuqs                            | `2.9`   | Search params tipados e sincronizados com RSC         |
| **Server State** | TanStack Query                  | `5`     | Cache client-side, mutations otimistas                |
| **Forms**        | react-hook-form + Zod           | v7 + v4 | Validação de formulários com schema type-safe         |
| **Toasts**       | Sonner                          | `2.0`   | Notificações não-obstrutivas                          |
| **Git**          | Commitizen + Commitlint + Husky | —       | Conventional Commits enforçados, lint-staged          |
| **Linting**      | ESLint + Prettier               | —       | `prettier-plugin-tailwindcss`, `simple-import-sort`   |
| **Linguagem**    | TypeScript                      | `5.x`   | Strict mode ativado em todo o projeto                 |

---

## 📁 Arquitetura de pastas

```
src/
├── actions/              # Server Actions ('use server') com schema Zod
│   ├── add-cart-product/     # Adiciona variante ao carrinho (cria se não existir)
│   ├── get-cart/             # Busca carrinho completo com itens e variantes
│   ├── get-wishlist/         # Wishlist completa com produto + variantes
│   ├── get-wishlist-ids/     # Só IDs — leve, usado para estado do ícone coração
│   ├── remove-cart-item/
│   ├── search-products/      # ILIKE em nome e descrição, limit 6
│   ├── toggle-wishlist/      # Adiciona ou remove; retorna { favorited }
│   └── update-cart-item/
│
├── app/                  # App Router (Next.js 16)
│   ├── (auth)/               # Route group — layout de autenticação
│   │   └── auth/sign-in|sign-up/
│   ├── account/wishlist/     # Rota protegida — redirect se não autenticado
│   ├── api/auth/[...all]/    # better-auth catch-all handler
│   ├── category/[slug]/      # Listagem por categoria com filtros + paginação
│   ├── gender/[gender]/      # Listagem por gênero (feminino/masculino/unissex)
│   ├── products/[slug]/      # Página de produto individual
│   ├── layout.tsx            # Root layout: fontes, NuqsAdapter, QueryProvider
│   └── page.tsx              # Home: hero banner + bento grid editorial
│
├── components/
│   ├── auth/                 # Formulários RHF + Zod
│   ├── brand/                # Logo SVG (icon + text + composite)
│   ├── cart/                 # Controles de quantidade e remoção
│   ├── category/             # FilterSidebar + MobileFilterDrawer (nuqs)
│   ├── common/               # Header, Footer, Cart, MegaMenu, SearchDropdown…
│   ├── product/              # ProductGallery (zoom lens), VariantSelector, AddCartButton
│   ├── ui/                   # shadcn/ui primitives
│   └── wishlist/             # WishlistGrid + WishlistItem
│
├── data/
│   ├── colors.ts             # COLOR_HEX — nomes canônicos de cor → hex
│   └── navigation.ts         # NAV_CATEGORIES + GENDER_LINKS
│
├── db/
│   ├── index.ts              # Drizzle client (pg pool)
│   ├── schema.ts             # Todas as tabelas + relations declaradas
│   └── seed.ts               # 6 categorias, 24 produtos, 106+ variantes
│
├── helpers/
│   ├── cart.ts               # Cálculo de totais do carrinho
│   ├── money.ts              # formatCentsToBRL()
│   └── pagination.ts         # paginate() — slice + currentPage/totalPages
│
├── lib/
│   ├── auth-client.ts        # better-auth client (browser)
│   ├── auth.ts               # better-auth server config + Google OAuth
│   └── utils.ts              # cn() — tailwind-merge + clsx
│
└── providers/
    └── react-query.tsx       # QueryClientProvider wrapper
```

---

## 🚀 Contexto técnico

> O projeto está disponível em produção — para avaliar a aplicação, acesse o [demo em produção](#).
> As instruções abaixo documentam a stack de desenvolvimento para referência técnica.

### Pré-requisitos

- **Node.js** ≥ 20
- **pnpm** — obrigatório (enforçado via `only-allow`)
- **PostgreSQL** ≥ 15 rodando localmente ou em nuvem
- Conta Google Cloud com OAuth 2.0 configurado (para login social)

### 1. Clone e instale

```bash
git clone https://github.com/SoulHiro/AmbarCommerce.git
cd AmbarCommerce
pnpm install
```

### 2. Configure as variáveis de ambiente

```bash
cp .env.example .env
```

Preencha o `.env` com suas credenciais:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/wearcommerce"
BETTER_AUTH_URL="http://localhost:3000"
BETTER_AUTH_SECRET="gere-uma-chave-aleatoria-longa-aqui"
GOOGLE_CLIENT_ID="seu-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="seu-google-client-secret"
```

### 3. Configure o banco de dados

```bash
# Aplicar schema ao banco
pnpm drizzle-kit push

# Popular com dados de exemplo (6 categorias, 24 produtos)
pnpm tsx --env-file=.env src/db/seed.ts
```

### 4. Inicie o servidor de desenvolvimento

```bash
pnpm dev
# Acesse: http://localhost:3000
```

### Build de produção

```bash
pnpm build && pnpm start
```

---

## 🗄️ Banco de dados

Schema gerenciado com **Drizzle ORM**. Todas as tabelas possuem relations declaradas explicitamente — sem magic strings.

### Tabelas do domínio

| Tabela             | Campos principais                                                               |
| ------------------ | ------------------------------------------------------------------------------- |
| `category`         | `id`, `name`, `slug`, `createdAt`                                               |
| `product`          | `id`, `categoryId`, `gender` (enum), `name`, `slug`, `description`, `createdAt` |
| `product_variant`  | `id`, `productId`, `name`, `color`, `size?`, `priceInCents`, `imageUrl`         |
| `wishlist`         | `id`, `userId`, `productId` — unique `(userId, productId)`                      |
| `cart`             | `id`, `userId`, `shippingAddressId?`                                            |
| `cart_item`        | `id`, `cartId`, `productVariantId`, `quantity`                                  |
| `shipping_address` | `id`, `userId`, `email`, `phone`, `recipientName`, campos de endereço…          |

### Tabelas de autenticação (better-auth)

| Tabela         | Campos principais                                      |
| -------------- | ------------------------------------------------------ |
| `user`         | `id`, `name`, `email`, `emailVerified`, `image`        |
| `session`      | `id`, `token`, `userId`, `expiresAt`, `ipAddress`      |
| `account`      | `id`, `providerId`, `userId`, tokens OAuth, `password` |
| `verification` | `id`, `identifier`, `value`, `expiresAt`               |

### Comandos Drizzle

```bash
pnpm drizzle-kit generate   # gera migration SQL após alterar schema.ts
pnpm drizzle-kit push       # aplica no banco
pnpm drizzle-kit studio     # abre UI visual do banco em localhost
```

---

## 🗺 Roadmap

### ✅ Concluído

- [x] Autenticação — email/senha + Google OAuth com account linking
- [x] Home page — hero banner editorial + bento grid de produtos em destaque
- [x] Catálogo por categoria com filtros avançados (nuqs) + paginação
- [x] Catálogo por gênero (feminino / masculino / unissex)
- [x] Busca live com dropdown — debounce + navegação por teclado
- [x] Página de produto — galeria + zoom lens + seletor de cor e tamanho
- [x] Carrinho — slide-over, controle de quantidade, remoção, total
- [x] Wishlist / Favoritos — toggle otimista + página `/account/wishlist`
- [x] Produtos relacionados (mesma categoria)
- [x] Dark/light mode + design responsivo (mobile e desktop)
- [x] Mega menu desktop + sheet navigation mobile

### 🔲 Próximas entregas

- [ ] Checkout flow — seleção de endereço, resumo do pedido
- [ ] Integração de pagamento (Stripe ou Pagar.me)
- [ ] Gerenciamento de endereços em `/account/addresses`
- [ ] Histórico de pedidos em `/account/orders`
- [ ] Página de perfil (`/profile`) com edição de dados
- [ ] Rating e reviews por produto

### 💡 Futuro

- [ ] Painel administrativo — gestão de produtos, pedidos, estoque
- [ ] Notificações por email (confirmação de pedido, envio, entrega)
- [ ] Busca semântica com embeddings (produtos similares por imagem)
- [ ] Recomendações personalizadas por histórico de navegação
- [ ] Testes E2E com Playwright
- [ ] PWA — instalação como app no mobile

---

## 👤 Autor

**Victor**
Full-Stack Developer · Next.js · TypeScript · PostgreSQL

[![GitHub](https://img.shields.io/badge/GitHub-@seu--usuario-181717?style=flat&logo=github)](https://github.com/SoulHiro)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-seu--perfil-0077B5?style=flat&logo=linkedin)](https://linkedin.com/in/victormts)

---

<div align="center">

© 2026 Victor · Todos os direitos reservados · Disponível apenas para visualização

</div>
