export interface Product {
  id: string
  name: string
  description: string
  priceInCents: number
}

export const PRODUCTS: Product[] = [
  {
    id: 'batcomputer-ultimate',
    name: 'BatComputer Ultimate',
    description: 'Acesso completo ao BatComputer com Bat-IA, jogos DC, scanner bio-tecnológico e muito mais!',
    priceInCents: 499, // R$ 4,99
  },
]
