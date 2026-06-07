export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewsCount: number;
  images: string[]; // At least 2-3 angles/images
  videoUrl?: string; // Simulated video loop url
  category: 'Men' | 'Women' | 'Unisex';
  type: 'T-Shirts' | 'Hoodies' | 'Jackets' | 'Pants' | 'Shorts' | 'Accessories';
  collections: string[]; // e.g., 'Summer', 'Winter', 'Streetwear', 'Premium', 'Limited Edition'
  sizes: string[]; // XS, S, M, L, XL, XXL
  colors: { name: string; hex: string }[];
  description: string;
  fitGuide: string;
  material: string;
  sustainability: string;
  stock: { [size: string]: number }; // Size-specific stock
  isBestSeller?: boolean;
  isNewArrival?: boolean;
  isSale?: boolean;
}

export interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
  verified: boolean;
  sizePurchased: string;
  colorPurchased: string;
}

export interface CartItem {
  product: Product;
  selectedSize: string;
  selectedColor: { name: string; hex: string };
  quantity: number;
}

export interface Order {
  id: string;
  date: string;
  items: {
    productName: string;
    price: number;
    size: string;
    color: string;
    quantity: number;
    image: string;
  }[];
  totalPrice: number;
  status: 'Pending' | 'Shipped' | 'Delivered' | 'Returned';
  trackingNumber?: string;
  loyaltyPointsEarned: number;
}

export interface Address {
  id: string;
  label: string; // 'Home', 'Work'
  fullName: string;
  street: string;
  city: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

export interface LoyaltyPoints {
  balance: number;
  tier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
  nextTierPoints: number;
  history: {
    date: string;
    points: number;
    description: string;
  }[];
}

export interface TelemetryMetrics {
  visits: number;
  orders: number;
  revenue: number;
  cartAbandons: number;
  emailSignups: number;
  returningCustomers: number;
  // Computed metrics
  conversionRate: number; // percentage
  aov: number; // page-level
  rpv: number; // page-level
  cartAbandonRate: number; // percentage
  emailSignupRate: number; // percentage
  returningCustomerRate: number; // percentage
  clv: number; // Customer Lifetime Value estimate
}
