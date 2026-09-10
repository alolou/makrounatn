export type MenuCategory = 'Pâtes' | 'Accompagnements'

export interface Product {
  id: string
  name: string
  description: string
  price: number
  category: MenuCategory
  badge?: string
  available?: boolean
  icon: string
}

const products: Product[] = [
  {
    id: 'spaghetti-thon',
    name: 'Spaghetti au thon tranché',
    description: 'Thon généreux, sauce tomate tunisienne et pointe de harissa.',
    price: 15,
    category: 'Pâtes',
    badge: 'Populaire',
    icon: '🐟',
  },
  {
    id: 'spaghetti-poulpe',
    name: 'Spaghetti au poulpe',
    description: 'Poulpe tendre mijoté dans une sauce rouge parfumée.',
    price: 25,
    category: 'Pâtes',
    badge: 'Signature',
    icon: '🐙',
  },
  {
    id: 'spaghetti-fruits-mer',
    name: 'Spaghetti fruits de mer',
    description: 'Un goût marin relevé aux épices de chez nous.',
    price: 15,
    category: 'Pâtes',
    icon: '🦐',
  },
  {
    id: 'spaghetti-anguille',
    name: 'Spaghetti anguille Hanshaa',
    description: "Une spécialité rare, proposée selon l'arrivage du jour.",
    price: 20,
    category: 'Pâtes',
    badge: 'Selon arrivage',
    icon: '🌊',
  },
  {
    id: 'spaghetti-bolognaise',
    name: 'Spaghetti bœuf bolognaise',
    description: 'Viande hachée de bœuf, sauce maison riche et fondante.',
    price: 20,
    category: 'Pâtes',
    icon: '🥩',
  },
  {
    id: 'salade-mechouia',
    name: 'Salade méchouia',
    description: 'Poivrons et tomates grillés, assaisonnement tunisien.',
    price: 3,
    category: 'Accompagnements',
    icon: '🌶️',
  },
  {
    id: 'brick-thon',
    name: 'Brick au thon',
    description: 'Fine, croustillante et préparée à la commande.',
    price: 2,
    category: 'Accompagnements',
    icon: '🔺',
  },
]

export default products
