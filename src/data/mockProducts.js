// Mock product data for development
export const mockProducts = [
  {
    id: 1,
    name: 'Carbon Fiber Pickleball Paddle',
    slug: 'carbon-fiber-paddle',
    category: 'paddles',
    description: 'Professional grade carbon fiber paddle for advanced players with superior control and power',
    price: 89.99,
    originalPrice: 109.99,
    rating: 4.8,
    reviewCount: 126,
    badge: 'Best Seller',
    image: 'https://picsum.photos/seed/paddle1/400/300',
    images: [
      'https://picsum.photos/seed/paddle1/600/400',
      'https://picsum.photos/seed/paddle1a/600/400',
      'https://picsum.photos/seed/paddle1b/600/400'
    ],
    features: [
      'High-quality carbon fiber construction',
      'Lightweight design for quick maneuverability',
      'Ergonomic grip for comfortable play',
      'USAPA approved for tournament play',
      'Includes protective cover'
    ],
    specifications: {
      weight: '7.8 oz',
      gripSize: '4.25 inches',
      paddleFace: '16" x 8"',
      material: 'Carbon Fiber',
      coreType: 'Polymer Honeycomb'
    },
    stock: 25,
    isFeatured: true,
    isNew: false
  },
  {
    id: 2,
    name: 'Kids Pickleball Paddle Set',
    slug: 'kids-paddle-set',
    category: 'paddles',
    description: 'Lightweight paddle perfect for children aged 8-12, includes 2 paddles and 4 balls',
    price: 39.99,
    originalPrice: 49.99,
    rating: 4.2,
    reviewCount: 89,
    badge: 'New',
    image: 'https://picsum.photos/seed/paddle2/400/300',
    images: [
      'https://picsum.photos/seed/paddle2/600/400',
      'https://picsum.photos/seed/paddle2a/600/400'
    ],
    features: [
      'Lightweight design for young players',
      'Vibrant colors and fun graphics',
      'Cushioned grip for small hands',
      'Includes 2 paddles and 4 balls',
      'Carry bag included'
    ],
    specifications: {
      weight: '6.5 oz',
      gripSize: '3.75 inches',
      paddleFace: '15" x 7.5"',
      material: 'Composite',
      coreType: 'Polymer'
    },
    stock: 40,
    isFeatured: false,
    isNew: true
  },
  {
    id: 3,
    name: 'Professional Polymer Core Paddle',
    slug: 'polymer-core-paddle',
    category: 'paddles',
    description: 'Advanced polymer core technology provides exceptional control and reduced vibration',
    price: 119.99,
    originalPrice: 149.99,
    rating: 4.9,
    reviewCount: 234,
    badge: 'Hot',
    image: 'https://picsum.photos/seed/paddle3/400/300',
    images: [
      'https://picsum.photos/seed/paddle3/600/400',
      'https://picsum.photos/seed/paddle3a/600/400',
      'https://picsum.photos/seed/paddle3b/600/400'
    ],
    features: [
      'Advanced polymer honeycomb core',
      'Graphite face for precision shots',
      'Edge guard protection',
      'USAPA approved',
      'Premium cushioned grip'
    ],
    specifications: {
      weight: '8.0 oz',
      gripSize: '4.5 inches',
      paddleFace: '16.5" x 7.5"',
      material: 'Graphite',
      coreType: 'Polymer Honeycomb'
    },
    stock: 15,
    isFeatured: true,
    isNew: false
  },
  {
    id: 4,
    name: 'Pickleball Net System',
    slug: 'net-system',
    category: 'accessories',
    description: 'Portable net system for indoor and outdoor courts, easy setup and takedown',
    price: 129.99,
    originalPrice: 159.99,
    rating: 4.6,
    reviewCount: 92,
    badge: 'Sale',
    image: 'https://picsum.photos/seed/net1/400/300',
    images: [
      'https://picsum.photos/seed/net1/600/400',
      'https://picsum.photos/seed/net1a/600/400'
    ],
    features: [
      'Tournament-grade steel frame',
      'Weather-resistant net',
      'Quick assembly system',
      'Includes carry bag',
      'Official regulation height (34" center)'
    ],
    specifications: {
      width: '22 feet',
      height: '36" sides, 34" center',
      weight: '35 lbs',
      material: 'Steel frame, PE net',
      setup: '10 minutes'
    },
    stock: 12,
    isFeatured: false,
    isNew: false
  },
  {
    id: 5,
    name: 'Premium Pickleball Balls (12-pack)',
    slug: 'premium-balls-12pack',
    category: 'balls',
    description: 'Tournament quality outdoor pickleballs, USAPA approved, pack of 12',
    price: 24.99,
    originalPrice: null,
    rating: 4.7,
    reviewCount: 156,
    badge: null,
    image: 'https://picsum.photos/seed/balls1/400/300',
    images: [
      'https://picsum.photos/seed/balls1/600/400'
    ],
    features: [
      'USAPA approved for tournament play',
      'Consistent bounce and flight',
      'Durable seamless construction',
      '40 precision-drilled holes',
      'High visibility yellow color'
    ],
    specifications: {
      quantity: '12 balls',
      diameter: '2.87 inches',
      weight: '0.88 oz',
      holes: '40 holes',
      type: 'Outdoor'
    },
    stock: 80,
    isFeatured: false,
    isNew: false
  },
  {
    id: 6,
    name: 'Pickleball Paddle Bag',
    slug: 'paddle-bag',
    category: 'accessories',
    description: 'Durable bag with space for 4 paddles and accessories, multiple pockets',
    price: 54.99,
    originalPrice: 69.99,
    rating: 4.5,
    reviewCount: 78,
    badge: null,
    image: 'https://picsum.photos/seed/bag1/400/300',
    images: [
      'https://picsum.photos/seed/bag1/600/400',
      'https://picsum.photos/seed/bag1a/600/400'
    ],
    features: [
      'Holds up to 4 paddles',
      'Multiple storage compartments',
      'Adjustable shoulder strap',
      'Water-resistant material',
      'Ventilated shoe compartment'
    ],
    specifications: {
      capacity: '4 paddles',
      dimensions: '18" x 12" x 8"',
      material: 'Polyester',
      weight: '1.2 lbs',
      pockets: '5 compartments'
    },
    stock: 30,
    isFeatured: false,
    isNew: false
  }
]

// Mock categories
export const mockCategories = [
  { id: 'all', name: 'All Products', slug: 'all' },
  { id: 'paddles', name: 'Paddles', slug: 'paddles' },
  { id: 'balls', name: 'Balls', slug: 'balls' },
  { id: 'accessories', name: 'Accessories', slug: 'accessories' }
]

