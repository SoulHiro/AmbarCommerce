interface NavColumn { title: string; items: string[] }
export interface NavCategory {
  label: string
  columns: NavColumn[]
  spotlight: { image: string; badge: string; title: string }
}

export const NAV_CATEGORIES: NavCategory[] = [
  {
    label: 'Novidades',
    columns: [
      { title: 'Roupas', items: ['Vestidos', 'Blusas', 'Calças', 'Saias', 'Jaquetas'] },
      { title: 'Calçados', items: ['Sandálias', 'Botas', 'Mocassins', 'Oxford'] },
      { title: 'Acessórios', items: ['Bolsas', 'Cintos', 'Bijuterias', 'Lenços'] },
    ],
    spotlight: { image: '/images/banner.webp', badge: 'Destaque', title: 'Coleção Outono 2025' },
  },
  {
    label: 'Férias',
    columns: [
      { title: 'Praia', items: ['Biquínis', 'Saídas de Praia', 'Camisas de Linho'] },
      { title: 'Cidade', items: ['Vestidos Leves', 'Sandálias Planas', 'Óculos de Sol'] },
      { title: 'Malas & Bolsas', items: ['Sacolas', 'Mochilas', 'Nécessaires'] },
    ],
    spotlight: { image: '/images/banner.webp', badge: 'Destaque', title: 'Verão que não acaba' },
  },
  {
    label: 'Outono',
    columns: [
      { title: 'Casacos', items: ['Trench Coats', 'Blazers', 'Cardigans', 'Parkas'] },
      { title: 'Malharia', items: ['Suéteres', 'Cachecóis', 'Luvas', 'Gorros'] },
      { title: 'Calçados', items: ['Botas de Cano Alto', 'Chelsea', 'Loafers'] },
    ],
    spotlight: { image: '/images/banner.webp', badge: 'Destaque', title: 'Lã, couro e cognac' },
  },
  {
    label: 'Básicos',
    columns: [
      { title: 'Feminino', items: ['Camisetas', 'Regatas', 'Calças Retas', 'Leggings'] },
      { title: 'Masculino', items: ['Polos', 'Camisetas Brancas', 'Chinos'] },
      { title: 'Unissex', items: ['Moletons', 'Jeans', 'Tênis Brancos'] },
    ],
    spotlight: { image: '/images/banner.webp', badge: 'Destaque', title: 'O armário que nunca erra' },
  },
  {
    label: 'Sale',
    columns: [
      { title: 'Até 30% off', items: ['Blusas', 'Saias', 'Acessórios'] },
      { title: 'Até 50% off', items: ['Jaquetas', 'Calçados', 'Bolsas'] },
      { title: 'Até 70% off', items: ['Peças únicas', 'Últimas unidades'] },
    ],
    spotlight: { image: '/images/banner.webp', badge: 'Destaque', title: 'Até 70% de desconto' },
  },
]

export const GENDER_LINKS = ['Mulher', 'Homem', 'Crianças']
