import { Product, Review, Order, Address, LoyaltyPoints, TelemetryMetrics } from './types';

export const products: Product[] = [
  {
    id: 'prod-01',
    name: 'Over-Dyed Boxy Hoodie',
    price: 110,
    originalPrice: 140,
    rating: 4.8,
    reviewsCount: 142,
    images: [
      'https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=800',
      'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=800',
    ],
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-man-dancing-in-streetwear-44335-large.mp4',
    category: 'Unisex',
    type: 'Hoodies',
    collections: ['Streetwear Collection', 'Winter Collection', 'Premium Collection'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Carbon Black', hex: '#11100f' },
      { name: 'Sable Olive', hex: '#3e4136' },
      { name: 'Acid Washed Grey', hex: '#636569' }
    ],
    description: 'Constructed from a bespoke 500GSM ultra-heavyweight cotton fleece loopback, this hoodie features a dropped shoulder profile and cropped body length for the perfect relaxed slouch. Specially washed to yield a unique vintage, soft-hand feel.',
    fitGuide: 'Relatively oversized with structured boxy frame. Drop shoulder. Purchase your normal size for the standard streetwear look, or size down for a more fitted silhouette.',
    material: '100% GOTS Certified Organic Heavyweight Cotton Fleece. Ribbed cuffs: 95% Organic Cotton, 5% Elastane.',
    sustainability: 'Ethically manufactured in Portugal with recycled water systems and non-toxic enzyme washes.',
    stock: { 'S': 8, 'M': 15, 'L': 4, 'XL': 0, 'XXL': 6 },
    isBestSeller: true,
    isNewArrival: false,
    isSale: true
  },
  {
    id: 'prod-02',
    name: 'Tech Shell Waterproof Parka',
    price: 245,
    rating: 4.9,
    reviewsCount: 78,
    images: [
      'https://images.unsplash.com/photo-1544022613-e87ca75a784a?q=80&w=800',
      'https://images.unsplash.com/photo-1548883354-7622d03aca27?q=80&w=800'
    ],
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-gloved-hand-reaching-forward-under-cold-light-48766-large.mp4',
    category: 'Unisex',
    type: 'Jackets',
    collections: ['Winter Collection', 'Limited Edition Collection', 'Premium Collection'],
    sizes: ['M', 'L', 'XL'],
    colors: [
      { name: 'Cyber Onyx', hex: '#0f0f10' },
      { name: 'Storm Grey', hex: '#4f555e' }
    ],
    description: 'An architectural piece combining extreme weather utility and metropolitan aesthetics. Comprises triple-layer breathable laminated tech fabric with full-taped construction. Fidlock® magnetic front closure and multi-zip storm pockets.',
    fitGuide: 'Relaxed technical styling. Designed with articulated sleeves to layer easily over heavyweight hoodies.',
    material: '3L Taslan Nylon Membrane with DWR coating. 20,000mm hydrostatic head rating / 15,000 g/m²/24h breathability.',
    sustainability: 'Made using recycled marine nylon polymers. Fluorocarbon-free (PFC-free) water repellent coating.',
    stock: { 'M': 3, 'L': 5, 'XL': 1 },
    isBestSeller: false,
    isNewArrival: true,
    isSale: false
  },
  {
    id: 'prod-03',
    name: 'Heavyweight Merch Tee',
    price: 55,
    rating: 4.7,
    reviewsCount: 198,
    images: [
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=800',
      'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=800'
    ],
    category: 'Men',
    type: 'T-Shirts',
    collections: ['Streetwear Collection', 'Summer Collection'],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Bone White', hex: '#faf7f2' },
      { name: 'Midnight Charcoal', hex: '#262626' },
      { name: 'Pistachio Sage', hex: '#8ea297' }
    ],
    description: 'Knitted from premium long-staple dense combed yarn, this tee stands at an impressive 280GSM. Custom high collar, chunky single-needle seams, and an exceptionally architectural drape that resists warping after infinite cycles of washing.',
    fitGuide: 'Oversized and boxy. Drop sleeve down design. Size down if you prefer a standard casual fit.',
    material: '100% GOTS Certified Premium Combed Organic Cotton.',
    sustainability: 'Spun in carbon-neutral mills using clean electrical solar energy grids and zero-waste logistics.',
    stock: { 'XS': 12, 'S': 24, 'M': 45, 'L': 38, 'XL': 19, 'XXL': 8 },
    isBestSeller: true,
    isNewArrival: false,
    isSale: false
  },
  {
    id: 'prod-04',
    name: 'Cargo Utility Pants',
    price: 135,
    rating: 4.6,
    reviewsCount: 89,
    images: [
      'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=800',
      'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=800'
    ],
    category: 'Men',
    type: 'Pants',
    collections: ['Streetwear Collection', 'Winter Collection'],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Dry Sage', hex: '#5b6359' },
      { name: 'Muted Sand', hex: '#cfc6b5' }
    ],
    description: 'Engineered from cotton-ripstop with rugged reinforced panels. Articulated knees ensure a supreme dynamic range of movement. Features six double-entry pockets with Japanese metal press studs. Drawcord adjustable cuffs allow structural styling options.',
    fitGuide: 'Straight-leg profile. Drawcord hem can be cinched to create a sharp balloon streetwear pants style.',
    material: '80% Ripstop Cotton / 20% Military grade durable Cordura Nylon composite.',
    sustainability: 'Treated with waterless eco-dyeing protocols reducing traditional pigment runoff chemical loads by 90%.',
    stock: { 'S': 14, 'M': 20, 'L': 0, 'XL': 3 },
    isBestSeller: false,
    isNewArrival: false,
    isSale: false
  },
  {
    id: 'prod-05',
    name: 'Women Cropped Thermal Tee',
    price: 48,
    originalPrice: 60,
    rating: 4.5,
    reviewsCount: 52,
    images: [
      'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=800',
      'https://images.unsplash.com/photo-1562157873-818bc0726f68?q=80&w=800'
    ],
    category: 'Women',
    type: 'T-Shirts',
    collections: ['Streetwear Collection', 'Summer Collection'],
    sizes: ['XS', 'S', 'M', 'L'],
    colors: [
      { name: 'Desert Clay', hex: '#c58d7c' },
      { name: 'Warm Charcoal', hex: '#37323e' }
    ],
    description: 'Woven with an authentic vintage waffle structure, this premium thermal cropped long sleeve delivers a soft feel on skin. Accented with subtle flatlock seams and structured thumbhole cuffs.',
    fitGuide: 'Form-fitting, cropped silhouette. True to size. Take a size up for a more relaxed, slouchy look.',
    material: '92% Ring-Spun Supima Cotton, 8% Modal Rib.',
    sustainability: 'Supima Cotton sourced strictly from certified California family co-ops focused on eco-tillage practices.',
    stock: { 'XS': 5, 'S': 9, 'M': 12, 'L': 2 },
    isBestSeller: false,
    isNewArrival: false,
    isSale: true
  },
  {
    id: 'prod-06',
    name: 'Acid Wash Heavy Shorts',
    price: 75,
    rating: 4.8,
    reviewsCount: 110,
    images: [
      'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?q=80&w=800',
      'https://images.unsplash.com/photo-1539185441755-769473a23570?q=80&w=800'
    ],
    category: 'Unisex',
    type: 'Shorts',
    collections: ['Streetwear Collection', 'Summer Collection'],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Washed Slate', hex: '#434449' },
      { name: 'Oatmeal Milk', hex: '#ede6da' }
    ],
    description: 'Perfect for active summers. Fully double-lined, 420GSM luxury French Terry shorts. Designed with a wide relaxed thigh contour, heavy ribbed elastic waistband, and internal thick off-white drawstrings. Distressed details at hem.',
    fitGuide: 'Relaxed thigh, sits just above the knee. Fits true to waist sizing indices.',
    material: '100% Luxury French Terry Organic Cotton.',
    sustainability: 'Utilizes certified biological dyes and local supply chains in Porto reducing high-emission oceanic freight.',
    stock: { 'S': 16, 'M': 21, 'L': 14, 'XL': 9 },
    isBestSeller: false,
    isNewArrival: true,
    isSale: false
  },
  {
    id: 'prod-07',
    name: 'Nylon Ribbed Beanie',
    price: 35,
    rating: 4.7,
    reviewsCount: 220,
    images: [
      'https://images.unsplash.com/photo-1576871337622-98d48d435353?q=80&w=800',
      'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?q=80&w=800'
    ],
    category: 'Unisex',
    type: 'Accessories',
    collections: ['Streetwear Collection', 'Winter Collection', 'Premium Collection'],
    sizes: ['O/S'],
    colors: [
      { name: 'Dry Charcoal', hex: '#232526' },
      { name: 'Acid Lime', hex: '#cedf43' },
      { name: 'Safety Crimson', hex: '#db3d2a' }
    ],
    description: 'A close-fitting watch hat designed with absolute warmth in mind. Features a thick, chunky double-fold structure, heavy rib knit, and premium rubber-injected minimalist branding patch at the front. Stretches to fit cleanly without bagging out.',
    fitGuide: 'One size fits all (O/S). Stretches cleanly.',
    material: '50% Merino Wool, 50% Recycled Nylon fiber composite.',
    sustainability: 'Engineered entirely using GRS (Global Recycled Standard) certified post-consumer PET bottles and cruelty-free wool.',
    stock: { 'O/S': 48 },
    isBestSeller: true,
    isNewArrival: false,
    isSale: false
  },
  {
    id: 'prod-08',
    name: 'Modular Chest Rig Sack',
    price: 95,
    rating: 4.9,
    reviewsCount: 34,
    images: [
      'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?q=80&w=800',
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=800'
    ],
    category: 'Unisex',
    type: 'Accessories',
    collections: ['Streetwear Collection', 'Premium Collection', 'Limited Edition Collection'],
    sizes: ['O/S'],
    colors: [
      { name: 'Stealth Black', hex: '#0e0e0e' },
      { name: 'Military Olive', hex: '#42453a' }
    ],
    description: 'The ultimate utility equipment for active commuters. Multi-compartment modular chest bag crafted with absolute ballistic performance in mind. Tactile Duraflex buckles, heavy-grade webbing, adjustable back-plate mesh for absolute temperature dispersion.',
    fitGuide: 'Highly adjustable custom chest straps to fit any torso width safely.',
    material: '1000D Cordura® Ballistic Weave underlay. Waterproof polyurethane interior sealant.',
    sustainability: 'Extremely high design longevity. Guaranteed lifetime warranty to prevent modern consumer landfill waste.',
    stock: { 'O/S': 5 },
    isBestSeller: false,
    isNewArrival: true,
    isSale: false
  }
];

export const reviewsData: Review[] = [
  {
    id: 'rev-01',
    userName: 'Marcus K.',
    rating: 5,
    comment: 'The premium 500GSM weight is insane. Heavy enough to stand on its own but extremely soft inside. Boxy fit aligns exactly with high-end designer hoods.',
    date: 'May 12, 2026',
    verified: true,
    sizePurchased: 'L',
    colorPurchased: 'Carbon Black'
  },
  {
    id: 'rev-02',
    userName: 'Chantal L.',
    rating: 5,
    comment: 'Was skeptical about the price, but the drop-shoulder layout is stunning. It falls beautifully. Buying the Pistachio Tee next immediately.',
    date: 'April 28, 2026',
    verified: true,
    sizePurchased: 'M',
    colorPurchased: 'Bone White'
  },
  {
    id: 'rev-03',
    userName: 'Elias H.',
    rating: 4,
    comment: 'Washed it 10 times already, collar is still incredibly snug and hasn\'t sagged whatsoever. Easily outclasses hoodies double the price.',
    date: 'May 20, 2026',
    verified: true,
    sizePurchased: 'XL',
    colorPurchased: 'Sable Olive'
  }
];

export const faqList = [
  {
    question: 'How do your GOTS organic cotton garments fit?',
    answer: 'Most products in our core Streetwear line are engineered for an intentional oversized, boxy aesthetic. We recommend purchasing your normal size for a relaxed slouch drape, or sizing down once if you prefer a slim, standard retail profile. Please consult the interactive "Fit Guide" on each product page.'
  },
  {
    question: 'What is your shipping & delivery timeline?',
    answer: 'We provide complimentary carbon-neutral shipping on all worldwide orders over $150. Domestic orders take 2-4 business days via expedited express delivery. International order timelines fluctuate between 5-9 days depending on customized destination portals. Live tracking updates are emailed immediately upon parcel pickup.'
  },
  {
    question: 'Tell me about the sustainable Lisbon factory.',
    answer: 'Our main Portuguese manufacturing partners are 100% GOTS certified and employ clean closed-loop water recycled systems. Our wash houses recycle 100% of their chemical waste, keeping harmful sizing agents and toxic heavy metal pigments safely out of local biological waterways.'
  },
  {
    question: 'How do returned orders affect my loyalty points?',
    answer: 'If you initiate a returns cycle on elements of an order, the loyalty points harvested from those specific returned items are automatically deducted from your account balance. Your overall premium customer tier status will be recalculated immediately upon warehouse parcel inspection.'
  }
];

export const mockAddresses: Address[] = [
  {
    id: 'addr-1',
    label: 'Home Delivery',
    fullName: 'Alex Vance',
    street: '742 Cyberpunk Boulevard, Suite B',
    city: 'New York',
    postalCode: '10001',
    country: 'United States',
    isDefault: true
  },
  {
    id: 'addr-2',
    label: 'Studio Workspace',
    fullName: 'Alex Vance (C/O Design Hub)',
    street: '12 Creative Wharf, Docklands',
    city: 'London',
    postalCode: 'E14 2AA',
    country: 'United Kingdom',
    isDefault: false
  }
];

export const mockOrders: Order[] = [
  {
    id: 'ORD-9841',
    date: 'May 04, 2026',
    items: [
      {
        productName: 'Over-Dyed Boxy Hoodie',
        price: 110,
        size: 'L',
        color: 'Carbon Black',
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=800'
      }
    ],
    totalPrice: 110,
    status: 'Delivered',
    trackingNumber: 'TRK-983192039-US',
    loyaltyPointsEarned: 110
  },
  {
    id: 'ORD-1093',
    date: 'April 10, 2026',
    items: [
      {
        productName: 'Nylon Ribbed Beanie',
        price: 35,
        size: 'O/S',
        color: 'Acid Lime',
        quantity: 2,
        image: 'https://images.unsplash.com/photo-1576871337622-98d48d435353?q=80&w=800'
      }
    ],
    totalPrice: 70,
    status: 'Delivered',
    trackingNumber: 'TRK-102949182-US',
    loyaltyPointsEarned: 70
  }
];

export const initialLoyaltyPoints: LoyaltyPoints = {
  balance: 180,
  tier: 'Silver',
  nextTierPoints: 500,
  history: [
    { date: 'May 04, 2026', points: 110, description: 'Accrued on ORD-9841' },
    { date: 'April 10, 2026', points: 70, description: 'Accrued on ORD-1093' }
  ]
};

// Realistic initial metrics matching our conversion-centric goals
export const initialTelemetryMetrics: TelemetryMetrics = {
  visits: 12450,
  orders: 412,
  revenue: 48940,
  cartAbandons: 980,
  emailSignups: 1680,
  returningCustomers: 275,
  // Computed (initially)
  conversionRate: 3.3, // 412 / 12450 * 100
  aov: 118.78, // 48940 / 412
  rpv: 3.93, // 48940 / 12450
  cartAbandonRate: 70.4, // 980 / (980 + 412) * 100
  emailSignupRate: 13.5, // 1680 / 12450 * 100
  returningCustomerRate: 66.7, // 275 / 412 * 100
  clv: 345.50
};
