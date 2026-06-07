import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ShoppingBag,
  Heart,
  User,
  Search,
  X,
  Menu,
  ChevronRight,
  TrendingUp,
  RotateCcw,
  Star,
  Check,
  Mail,
  HelpCircle,
  Clock,
  ArrowRight,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Percent,
  Settings,
  Gift
} from 'lucide-react';

import { Product, CartItem, Order, Address, LoyaltyPoints, TelemetryMetrics } from './types';
import {
  products as initialProducts,
  mockAddresses,
  mockOrders,
  initialLoyaltyPoints,
  initialTelemetryMetrics
} from './data';

import TrustBar from './components/TrustBar';
import AboutUs from './components/AboutUs';
import ContactFAQ from './components/ContactFAQ';
import AccountDashboard from './components/AccountDashboard';
import AdminTelemetry from './components/AdminTelemetry';
import ProductDetail from './components/ProductDetail';

export default function App() {
  // Navigation & Page routing state
  const [activePage, setActivePage] = useState<'home' | 'shop' | 'about' | 'contact' | 'account'>('home');

  // Interactive Catalog Filter states
  const [selectedCategory, setSelectedCategory] = useState<string>('Unisex');
  const [selectedCollection, setSelectedCollection] = useState<string>('All');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeStockOnly, setActiveStockOnly] = useState<boolean>(false);

  // Core E-Commerce State Management
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState<boolean>(false);
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [addresses, setAddresses] = useState<Address[]>(mockAddresses);
  const [loyalty, setLoyalty] = useState<LoyaltyPoints>(initialLoyaltyPoints);

  // Conversion Strategy Metrics Simulation state
  const [metrics, setMetrics] = useState<TelemetryMetrics>(initialTelemetryMetrics);
  const [adminPanelOpen, setAdminPanelOpen] = useState<boolean>(true); // Keeps metrics highly visible initially

  // Detail Modal Focus
  const [selectedDetailProduct, setSelectedDetailProduct] = useState<Product | null>(null);

  // Newsletter form states
  const [newsletterName, setNewsletterName] = useState<string>('');
  const [newsletterEmail, setNewsletterEmail] = useState<string>('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState<boolean>(false);

  // Checkout modal simulation
  const [showCheckoutModal, setShowCheckoutModal] = useState<boolean>(false);
  const [checkoutStep, setCheckoutStep] = useState<'address' | 'receipt'>('address');
  const [selectedCheckoutAddressIdx, setSelectedCheckoutAddressIdx] = useState<number>(0);
  const [latestReceiptOrder, setLatestReceiptOrder] = useState<Order | null>(null);

  // Promotional Banner Ticker
  const currentPromoMessage = "Complimentary Worldwide Express Delivery on orders over $150 • Double Points Active today";

  // Navigation handlers
  const handleFeaturedCategoryClick = (type: string) => {
    setSelectedType(type);
    setSelectedCategory('Unisex');
    setSelectedCollection('All');
    setActivePage('shop');
  };

  const handleHeroShopClick = (category: 'Men' | 'Women') => {
    setSelectedCategory(category);
    setSelectedType('All');
    setSelectedCollection('All');
    setActivePage('shop');
  };

  // Cart operations
  const handleAddToCart = (product: Product, size: string, color: { name: string; hex: string }) => {
    // Audit existing cart matching product, size, and color names
    const existingIndex = cart.findIndex(
      (item) =>
        item.product.id === product.id &&
        item.selectedSize === size &&
        item.selectedColor.name === color.name
    );

    if (existingIndex > -1) {
      const updated = [...cart];
      updated[existingIndex].quantity += 1;
      setCart(updated);
    } else {
      setCart([...cart, { product, selectedSize: size, selectedColor: color, quantity: 1 }]);
    }

    // Dynamic metrics tracker updates (Increases overall interest indicators)
    const newCartAbandons = metrics.cartAbandons + 1;
    setMetrics((prev) => ({
      ...prev,
      cartAbandons: newCartAbandons,
      cartAbandonRate: Number(((newCartAbandons / (prev.orders + newCartAbandons)) * 100).toFixed(1))
    }));
  };

  const handleRemoveFromCart = (index: number) => {
    const updated = cart.filter((_, idx) => idx !== index);
    setCart(updated);
  };

  const handleAdjustQuantity = (index: number, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveFromCart(index);
      return;
    }
    const updated = [...cart];
    updated[index].quantity = quantity;
    setCart(updated);
  };

  // Wishlist operations
  const handleAddToWishlist = (product: Product) => {
    if (wishlist.some((item) => item.id === product.id)) return;
    setWishlist([...wishlist, product]);
  };

  const handleRemoveFromWishlist = (product: Product) => {
    setWishlist(wishlist.filter((item) => item.id !== product.id));
  };

  // Buy Now direct flow
  const handleBuyNow = (product: Product, size: string, color: { name: string; hex: string }) => {
    handleAddToCart(product, size, color);
    setCartOpen(true);
  };

  // Newsletter signup with reward values
  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;

    setNewsletterSubscribed(true);

    // Reward user with loyalty points immediately to encourage repeat purchases!
    const updatedHistory = [
      {
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
        points: 50,
        description: 'Joined Atelier Lookbook Newsletter'
      },
      ...loyalty.history
    ];
    setLoyalty({
      balance: loyalty.balance + 50,
      tier: loyalty.tier,
      nextTierPoints: loyalty.nextTierPoints,
      history: updatedHistory
    });

    // Update Telemetry Metrics to reflect key marketing results
    const newSignups = metrics.emailSignups + 1;
    setMetrics((prev) => ({
      ...prev,
      emailSignups: newSignups,
      emailSignupRate: Number(((newSignups / prev.visits) * 100).toFixed(1))
    }));

    setTimeout(() => {
      setNewsletterName('');
      setNewsletterEmail('');
    }, 4000);
  };

  // Cart financial computations
  const cartSubtotal = cart.reduce((total, item) => total + item.product.price * item.quantity, 0);
  const freeShippingThreshold = 150;
  const shippingCost = cartSubtotal >= freeShippingThreshold || cartSubtotal === 0 ? 0 : 15;
  const estimatedTax = cartSubtotal * 0.08;
  const cartTotalTotal = cartSubtotal + shippingCost + estimatedTax;

  // Checkout process trigger
  const handleProcessCheckout = () => {
    if (cart.length === 0) return;
    setCheckoutStep('address');
    setShowCheckoutModal(true);
  };

  const handleCompleteOrder = () => {
    // Generate order history entry
    const orderItemsMapped = cart.map((item) => ({
      productName: item.product.name,
      price: item.product.price,
      size: item.selectedSize,
      color: item.selectedColor.name,
      quantity: item.quantity,
      image: item.product.images[0]
    }));

    const finalOrderPoints = Math.round(cartSubtotal);

    const newOrder: Order = {
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      items: orderItemsMapped,
      totalPrice: cartTotalTotal,
      status: 'Pending',
      trackingNumber: `TRK-${Math.floor(100000000 + Math.random() * 900000000)}-US`,
      loyaltyPointsEarned: finalOrderPoints
    };

    // Update local lists
    setLatestReceiptOrder(newOrder);
    setOrders([newOrder, ...orders]);
    setCart([]); // Reset Cart

    // Increment points & recalibrate progression tier
    const updatedPointsBalance = loyalty.balance + finalOrderPoints;
    let upgradedTier = loyalty.tier;
    if (updatedPointsBalance >= 500) {
      upgradedTier = 'Gold';
    } else if (updatedPointsBalance >= 200) {
      upgradedTier = 'Silver';
    }

    setLoyalty({
      balance: updatedPointsBalance,
      tier: upgradedTier,
      nextTierPoints: 500,
      history: [
        {
          date: newOrder.date,
          points: finalOrderPoints,
          description: `Accrued on ${newOrder.id}`
        },
        ...loyalty.history
      ]
    });

    // Update overall Conversion Indicators state
    const nextVisits = metrics.visits + 1; // site exposure
    const nextOrders = metrics.orders + 1;
    const nextRevenue = metrics.revenue + cartTotalTotal;
    const nextReturning = nextOrders > 0 ? metrics.returningCustomers + 1 : metrics.returningCustomers; // assume loyal buyer repeat

    // Recalculate metrics accurately
    const calculatedConv = Number(((nextOrders / nextVisits) * 100).toFixed(1));
    const calculatedAov = Number((nextRevenue / nextOrders).toFixed(2));
    const calculatedRpv = Number((nextRevenue / nextVisits).toFixed(2));
    // Cart abandonment recovery
    const activeAbandons = Math.max(0, metrics.cartAbandons - 1);
    const calculatedAbandon = Number(((activeAbandons / (nextOrders + activeAbandons)) * 100).toFixed(1));

    setMetrics((prev) => ({
      ...prev,
      visits: nextVisits,
      orders: nextOrders,
      revenue: nextRevenue,
      cartAbandons: activeAbandons,
      returningCustomers: nextReturning,
      conversionRate: calculatedConv,
      aov: calculatedAov,
      rpv: calculatedRpv,
      cartAbandonRate: calculatedAbandon,
      returningCustomerRate: Number(((nextReturning / nextOrders) * 100).toFixed(1)),
      clv: Number((calculatedAov * (1 + nextReturning / nextOrders)).toFixed(2))
    }));

    setCheckoutStep('receipt');
  };

  // Reset e-commerce simulator metrics
  const handleResetMetrics = () => {
    setMetrics(initialTelemetryMetrics);
  };

  // Search filter core logic (Sitemap Categories & Product Types filters)
  const filteredProducts = initialProducts.filter((product) => {
    // 1. Search Query filter
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        product.name.toLowerCase().includes(q) ||
        product.description.toLowerCase().includes(q) ||
        product.type.toLowerCase().includes(q);
      if (!matchesSearch) return false;
    }

    // 2. Category Gender filter (Men, Women, Unisex)
    if (selectedCategory !== 'All') {
      const matchesCategory =
        product.category === selectedCategory || product.category === 'Unisex';
      if (!matchesCategory) return false;
    }

    // 3. Collection filter
    if (selectedCollection !== 'All') {
      const matchesCollection = product.collections.includes(`${selectedCollection} Collection`);
      if (!matchesCollection) return false;
    }

    // 4. Product Type filter (Hoodies, Tees, etc)
    if (selectedType !== 'All') {
      const matchesType = product.type === selectedType;
      if (!matchesType) return false;
    }

    // 5. Stock option checking
    if (activeStockOnly) {
      const totalStock = Object.values(product.stock).reduce((a, b) => a + b, 0);
      if (totalStock === 0) return false;
    }

    return true;
  });

  return (
    <div id="application-container" className="min-h-screen bg-stone-50 font-sans flex flex-col antialiased">
      {/* 1. TOP MARGIN CAMPAIGN TICKER */}
      <div id="promotional-header-ticker" className="bg-stone-900 border-b border-stone-800 text-stone-300 py-2.5 text-[11px] font-mono tracking-widest text-center uppercase select-none flex items-center justify-center gap-1.5 overflow-hidden">
        <Sparkles className="h-3.5 w-3.5 text-orange-400 shrink-0" />
        {currentPromoMessage}
        <Sparkles className="h-3.5 w-3.5 text-orange-400 shrink-0" />
      </div>

      {/* 2. DYNAMIC NAVIGATION RAIL */}
      <header id="main-navigation-header" className="bg-[#faf9f6] border-b border-stone-200 sticky top-0 z-40">
        <div id="nav-inner" className="mx-auto max-w-7xl px-4 h-20 flex items-center justify-between gap-4">
          {/* Logo Brand Title */}
          <div
            id="brand-logo"
            onClick={() => setActivePage('home')}
            className="cursor-pointer font-sans font-black tracking-normal text-xl text-stone-950 flex items-center gap-1.5 select-none"
          >
            <span className="bg-stone-950 text-stone-50 px-2.5 py-1 rounded-sm uppercase text-sm tracking-widest font-black">
              STRT
            </span>
            <span className="font-semibold tracking-tight text-stone-900 text-lg uppercase uppercase text-xs">Atelier</span>
          </div>

          {/* Links Row */}
          <nav id="nav-items-row" className="hidden md:flex items-center gap-8 text-xs font-mono uppercase tracking-widest text-stone-600">
            <button
              type="button"
              id="link-home"
              onClick={() => setActivePage('home')}
              className={`hover:text-stone-950 tracking-widest font-medium transition-colors ${activePage === 'home' ? 'text-stone-950 font-bold border-b border-stone-900' : ''}`}
            >
              Home
            </button>
            <button
              type="button"
              id="link-shop"
              onClick={() => {
                setSelectedCategory('All');
                setSelectedCollection('All');
                setSelectedType('All');
                setActivePage('shop');
              }}
              className={`hover:text-stone-950 tracking-widest font-medium transition-colors ${activePage === 'shop' ? 'text-stone-950 font-bold border-b border-stone-900' : ''}`}
            >
              Shop Catalog
            </button>
            <button
              type="button"
              id="link-about"
              onClick={() => setActivePage('about')}
              className={`hover:text-stone-950 tracking-widest font-medium transition-colors ${activePage === 'about' ? 'text-stone-950 font-bold border-b border-stone-900' : ''}`}
            >
              About Atelier
            </button>
            <button
              type="button"
              id="link-contact"
              onClick={() => setActivePage('contact')}
              className={`hover:text-stone-950 tracking-widest font-medium transition-colors ${activePage === 'contact' ? 'text-stone-950 font-bold border-b border-stone-900' : ''}`}
            >
              Contact FAQ
            </button>
            <button
              type="button"
              id="link-account"
              onClick={() => setActivePage('account')}
              className={`hover:text-stone-950 tracking-widest font-medium transition-colors ${activePage === 'account' ? 'text-stone-950 font-bold border-b border-stone-900' : ''}`}
            >
              Account
            </button>
          </nav>

          {/* Nav Icons Side */}
          <div id="nav-icon-selectors" className="flex items-center gap-4">
            {/* Search filter in-navbar preview */}
            <div className="hidden sm:flex items-center bg-stone-100 border border-stone-200 rounded-lg px-2.5 py-1.5">
              <Search className="h-3.5 w-3.5 text-stone-400" />
              <input
                type="text"
                id="simple-search-input"
                placeholder="Find organic cotton..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (activePage !== 'shop') setActivePage('shop');
                }}
                className="bg-transparent border-none outline-none text-stone-900 placeholder:text-stone-400 text-xs ml-1.5 w-40 focus:w-56 transition-all"
              />
            </div>

            {/* Telegram Toggle indicator */}
            <button
              type="button"
              id="admin-telemetry-toggle-btn"
              onClick={() => setAdminPanelOpen(!adminPanelOpen)}
              className={`p-2 rounded-lg border flex items-center gap-1 text-[10px] font-mono transition-all uppercase cursor-pointer ${
                adminPanelOpen
                  ? 'bg-stone-900 text-stone-100 border-stone-900 shadow-sm'
                  : 'bg-white text-stone-600 border-stone-200 hover:border-stone-900 hover:bg-stone-50'
              }`}
            >
              <Settings className="h-4 w-4 shrink-0" />
              <span className="hidden lg:inline">{adminPanelOpen ? 'Hide Stats' : 'Admin Tool'}</span>
            </button>

            {/* Shopping cart trigger */}
            <button
              type="button"
              id="shopping-bag-trigger"
              onClick={() => setCartOpen(true)}
              className="p-2 bg-white hover:bg-stone-50 rounded-lg border border-stone-200 relative text-stone-850 hover:text-stone-950 transition-colors cursor-pointer"
            >
              <ShoppingBag className="h-4.5 w-4.5" />
              {cart.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-stone-950 text-[#faf9f6] text-[9px] font-mono font-bold h-4.5 w-4.5 rounded-full flex items-center justify-center animate-pulse">
                  {cart.reduce((sum, item) => sum + item.quantity, 0)}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* 3. DYNAMIC CONTENT RENDERING PAGE CONTROLLER */}
      <main className="flex-1">
        <AnimatePresence mode="wait">
          {/* A. HOMEPAGE VIEW */}
          {activePage === 'home' && (
            <motion.div
              key="homepage-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Homepage Section 1: Hero */}
              <div id="home-hero-showcase" className="relative h-[85vh] bg-stone-950 overflow-hidden flex items-center">
                {/* Background Styling image with extreme resolution visual aspect ratio 16:9 */}
                <div className="absolute inset-0 z-0">
                  <img
                    src="https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=1920"
                    alt="Streetwear group modeling session"
                    className="w-full h-full object-cover object-top opacity-35 filter grayscale contrast-110"
                    referrerPolicy="no-referrer"
                  />
                  {/* Bottom Vignette Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/20 to-transparent" />
                </div>

                <div className="relative z-10 mx-auto max-w-7xl px-4 w-full text-stone-50 text-left space-y-6">
                  <span className="inline-flex items-center gap-1.5 text-xs font-mono tracking-widest uppercase bg-stone-805/90 text-stone-300 p-2 border border-stone-800 rounded bg-[#1c1c1a]/80">
                    <Clock className="h-3.5 w-3.5 text-orange-400" />
                    PREMIUM SPRING/SUMMER LOOKBOOK DISPATCH
                  </span>
                  <h1 className="text-4xl sm:text-6xl font-sans font-extrabold tracking-tight text-white max-w-3xl leading-tight sm:leading-none">
                    Premium Streetwear Designed for Everyday Confidence
                  </h1>
                  <p className="text-sm sm:text-lg text-stone-300 max-w-xl leading-relaxed">
                    High-quality fabrics. Timeless fits. Fully carbon-neutral worldwide shipping.
                  </p>
                  <div className="flex flex-wrap items-center gap-4 pt-2">
                    <button
                      type="button"
                      id="hero-shop-men-btn"
                      onClick={() => handleHeroShopClick('Men')}
                      className="bg-[#faf9f6] text-stone-950 hover:bg-stone-200 font-sans font-bold text-xs uppercase tracking-widest px-7 py-4 rounded shadow-lg transition-all cursor-pointer flex items-center gap-2"
                    >
                      Shop Men Collection
                      <ArrowRight className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      id="hero-shop-women-btn"
                      onClick={() => handleHeroShopClick('Women')}
                      className="bg-transparent text-[#faf9f6] hover:bg-[#faf9f6]/10 border-2 border-[#faf9f6]/95 hover:border-white font-sans font-bold text-xs uppercase tracking-widest px-7 py-4 rounded shadow-lg transition-all cursor-pointer"
                    >
                      Shop Women
                    </button>
                  </div>
                </div>
              </div>

              {/* Homepage Section 2: Trust bar */}
              <TrustBar />

              {/* Homepage Section 3: Featured Categories (Hoodies, T-Shirts, Jackets, Accessories) */}
              <section id="featured-categories-cards" className="mx-auto max-w-7xl px-4 py-16">
                <div className="mb-10 text-center sm:text-left flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                  <div>
                    <span className="text-[10px] font-mono tracking-widest text-stone-500 uppercase block mb-1">
                      PORTUGUESE ATELIER SEPARATES
                    </span>
                    <h2 className="text-3xl font-sans font-bold tracking-tight text-stone-900">
                      Explore Segment Collections
                    </h2>
                  </div>
                  <button
                    type="button"
                    id="find-all-categories"
                    onClick={() => {
                      setSelectedType('All');
                      setActivePage('shop');
                    }}
                    className="text-stone-900 text-xs font-mono uppercase tracking-wider hover:underline flex items-center gap-1.5 self-center sm:self-auto"
                  >
                    View All Categories
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                  {/* Card 1: Hoodies */}
                  <div
                    id="cat-hoodies"
                    onClick={() => handleFeaturedCategoryClick('Hoodies')}
                    className="group relative aspect-[3/4] rounded-2xl overflow-hidden bg-stone-100 border border-stone-200 cursor-pointer shadow-xs hover:border-stone-900 transition-all"
                  >
                    <img
                      src="https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=600"
                      alt="Organic Cotton Hoodies"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-stone-950/20 to-transparent flex items-end p-5">
                      <div>
                        <span className="text-[9px] font-mono text-stone-300 uppercase">HEAVYWEIGHT 500GSM</span>
                        <h4 className="text-stone-50 font-sans font-bold text-lg mt-0.5">Premium Hoodies</h4>
                      </div>
                    </div>
                  </div>

                  {/* Card 2: T_Shirts */}
                  <div
                    id="cat-tshirts"
                    onClick={() => handleFeaturedCategoryClick('T-Shirts')}
                    className="group relative aspect-[3/4] rounded-2xl overflow-hidden bg-stone-100 border border-stone-200 cursor-pointer shadow-xs hover:border-stone-900 transition-all"
                  >
                    <img
                      src="https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=600"
                      alt="Organic T-Shirts"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-stone-950/20 to-transparent flex items-end p-5">
                      <div>
                        <span className="text-[9px] font-mono text-stone-300 uppercase">dense loop 280GSM</span>
                        <h4 className="text-stone-50 font-sans font-bold text-lg mt-0.5">Classic T-Shirts</h4>
                      </div>
                    </div>
                  </div>

                  {/* Card 3: Jackets */}
                  <div
                    id="cat-jackets"
                    onClick={() => handleFeaturedCategoryClick('Jackets')}
                    className="group relative aspect-[3/4] rounded-2xl overflow-hidden bg-stone-100 border border-stone-200 cursor-pointer shadow-xs hover:border-stone-900 transition-all"
                  >
                    <img
                      src="https://images.unsplash.com/photo-1544022613-e87ca75a784a?q=80&w=600"
                      alt="Taslan shell jackets"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-stone-950/20 to-transparent flex items-end p-5">
                      <div>
                        <span className="text-[9px] font-mono text-stone-300 uppercase">3-layer membrane tech</span>
                        <h4 className="text-stone-50 font-sans font-bold text-lg mt-0.5">Technical Jackets</h4>
                      </div>
                    </div>
                  </div>

                  {/* Card 4: Accessories */}
                  <div
                    id="cat-accessories"
                    onClick={() => handleFeaturedCategoryClick('Accessories')}
                    className="group relative aspect-[3/4] rounded-2xl overflow-hidden bg-stone-100 border border-stone-200 cursor-pointer shadow-xs hover:border-stone-900 transition-all"
                  >
                    <img
                      src="https://images.unsplash.com/photo-1576871337622-98d48d435353?q=80&w=600"
                      alt="Accessories & Equipment"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-stone-950/20 to-transparent flex items-end p-5">
                      <div>
                        <span className="text-[9px] font-mono text-stone-300 uppercase">Cordura & Merino Wool</span>
                        <h4 className="text-stone-50 font-sans font-bold text-lg mt-0.5">Accessories</h4>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Homepage Section 4: Best Sellers (Grid with ratings, price, Quick Add) */}
              <section id="bestsellers-grid-section" className="bg-stone-100 border-y border-stone-200 py-16">
                <div className="mx-auto max-w-7xl px-4">
                  <div className="text-center mb-12">
                    <span className="text-xs font-mono tracking-widest text-stone-500 uppercase block mb-1">
                      VERIFIED CUSTOMER ACCLAIM
                    </span>
                    <h2 className="text-3xl font-sans font-bold tracking-tight text-stone-900">
                      Trending Best Sellers
                    </h2>
                    <p className="text-xs text-stone-500 mt-2">
                      Loved most for drape thickness, organic enzyme textures, and lifetime lock collars.
                    </p>
                  </div>

                  {/* Product Grid */}
                  <div id="bestsellers-grid" className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {initialProducts
                      .filter((p) => p.isBestSeller)
                      .map((product) => {
                        const productTotalStock = Object.values(product.stock).reduce((a, b) => a + b, 0);
                        const isSoldOut = productTotalStock === 0;

                        return (
                          <div
                            key={product.id}
                            id={`bestseller-product-${product.name.replace(/\s+/g, '-').toLowerCase()}`}
                            className="bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-xs hover:border-stone-900 transition-colors group flex flex-col"
                          >
                            <div
                              onClick={() => setSelectedDetailProduct(product)}
                              className="relative aspect-[3/4] bg-stone-50 overflow-hidden cursor-pointer shrink-0"
                            >
                              <img
                                src={product.images[0]}
                                alt={product.name}
                                className="w-full h-full object-cover group-hover:scale-101 transition-transform duration-300"
                                referrerPolicy="no-referrer"
                              />
                              {product.originalPrice && (
                                <span className="absolute top-3 left-3 bg-red-650 text-white font-mono text-[9px] font-bold px-2.5 py-0.5 rounded uppercase">
                                  Sale Archive
                                </span>
                              )}
                              {isSoldOut && (
                                <div className="absolute inset-x-0 bottom-0 bg-stone-900/80 text-center text-stone-50 text-[10px] py-1.5 uppercase font-mono">
                                  Out of Stock
                                </div>
                              )}
                            </div>

                            <div className="p-4 flex-1 flex flex-col justify-between">
                              <div className="space-y-1">
                                <div className="flex items-center justify-between">
                                  <span className="text-[10px] font-mono text-stone-400 uppercase font-bold">
                                    {product.type} • {product.category}
                                  </span>
                                  <div className="flex items-center gap-0.5 text-xs text-amber-500 font-bold">
                                    <Star className="h-3 w-3 fill-amber-500" />
                                    <span>{product.rating}</span>
                                  </div>
                                </div>
                                <h3
                                  onClick={() => setSelectedDetailProduct(product)}
                                  className="font-sans font-bold text-stone-900 text-sm tracking-tight cursor-pointer hover:underline truncate"
                                >
                                  {product.name}
                                </h3>
                                <div className="flex items-baseline gap-2">
                                  <span className="text-sm font-sans font-extrabold text-stone-900">${product.price}</span>
                                  {product.originalPrice && (
                                    <span className="text-xs text-stone-400 line-through">${product.originalPrice}</span>
                                  )}
                                </div>
                              </div>

                              <button
                                type="button"
                                id={`quick-add-${product.id}`}
                                disabled={isSoldOut}
                                onClick={() => {
                                  // Quick add triggers standard size S or first size selection
                                  handleAddToCart(product, product.sizes[0] || 'M', product.colors[0]);
                                  alert(`[Quick Add] Added "${product.name}" (${product.sizes[0] || 'M'}) to cart drawer!`);
                                }}
                                className="w-full mt-4 bg-stone-900 hover:bg-stone-800 text-stone-50 text-xs font-sans font-medium py-2.5 rounded-lg transition-colors cursor-pointer disabled:bg-stone-100 disabled:text-stone-400"
                              >
                                Quick Add to Cart
                              </button>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              </section>

              {/* Lookbook Seasonal gallery & High conversion newsletter signup */}
              <section id="seasonal-lookbooks" className="mx-auto max-w-7xl px-4 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-stone-900 text-stone-100 rounded-3xl p-8 sm:p-14 overflow-hidden relative border border-stone-800">
                  {/* Abstract backdrop glow */}
                  <div className="absolute bottom-0 left-0 h-96 w-96 bg-[#cfc6b5]/10 rounded-full blur-3xl pointer-events-none"></div>

                  <div className="space-y-6">
                    <span className="text-xs font-mono tracking-widest text-[#cfc6b5] uppercase block">
                      JOIN THE ATELIER
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-sans font-extrabold text-stone-100 leading-tight">
                      Capture 10% Discount & 50 Member Points
                    </h2>
                    <p className="text-xs sm:text-sm text-stone-400 leading-relaxed max-w-sm">
                      Register to secure advanced order keys on Portugal catalog restocks, lookbook archives, and member birthday coupons.
                    </p>

                    <form onSubmit={handleNewsletterSubmit} className="space-y-3 max-w-md">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          required
                          placeholder="Your Premium Name"
                          value={newsletterName}
                          onChange={(e) => setNewsletterName(e.target.value)}
                          className="bg-stone-800 border-none rounded-lg p-3 text-xs placeholder:text-stone-500 text-stone-100 focus:outline-none focus:ring-1 focus:ring-[#cfc6b5] flex-1 max-w-[150px]"
                        />
                        <input
                          type="email"
                          required
                          placeholder="Email address"
                          value={newsletterEmail}
                          onChange={(e) => setNewsletterEmail(e.target.value)}
                          className="bg-stone-800 border-none rounded-lg p-3 text-xs placeholder:text-stone-500 text-stone-500 focus:outline-none focus:ring-1 focus:ring-[#cfc6b5] flex-1"
                        />
                      </div>
                      <button
                        type="submit"
                        id="newsletter-subscribe-submit"
                        className="w-full bg-[#faf9f6] hover:bg-stone-200 text-stone-900 font-sans font-bold text-xs py-3 rounded-lg transition-colors cursor-pointer uppercase tracking-widest"
                      >
                        Claim My Welcome Gift
                      </button>
                    </form>

                    {newsletterSubscribed && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-stone-80 w-full max-w-md text-stone-300 p-4 rounded-lg text-xs leading-relaxed border border-stone-800"
                      >
                        <strong>Welcome to the Collective!</strong> A premium 10% discount check coupon code has been dispatched. <strong>+50 points</strong> have been credited immediately into your Member Loyalty balance! Check your account.
                      </motion.div>
                    )}
                  </div>

                  {/* Lookbook Right-side lifestyle editorial stack */}
                  <div className="relative">
                    <img
                      src="https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=600"
                      alt="Sage vintage loop hoodie close up details"
                      className="w-full h-80 object-cover rounded-2xl filter grayscale brightness-90 shadow-2xl border border-stone-800"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute bottom-4 right-4 bg-stone-950 font-mono text-[9px] uppercase tracking-widest px-3 py-1 bg-stone-900/90 text-stone-300 p-2 border border-stone-800 rounded">
                      MEMBER EXCLUSIVE CAPTURE • PORTUGAL
                    </div>
                  </div>
                </div>
              </section>
            </motion.div>
          )}

          {/* B. SHOP CATALOG VIEW */}
          {activePage === 'shop' && (
            <motion.div
              key="shop-view"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.3 }}
              className="mx-auto max-w-7xl px-4 py-12"
            >
              {/* Shop Header */}
              <div id="shop-headline" className="text-center mb-10">
                <span className="text-xs font-mono tracking-widest text-[#cfc6b5] uppercase bg-[#cfc6b5]/15 text-stone-700 font-bold px-3 py-1 rounded">
                  PORTUGUESE KNITTING CORE
                </span>
                <h1 className="text-4xl font-sans font-black text-stone-900 tracking-tight mt-3">Style Catalog</h1>
                <p className="text-stone-500 text-xs sm:text-sm mt-2 max-w-lg mx-auto">
                  Sort by collection drops or product types to narrow down Portugal organic structures.
                </p>
              </div>

              {/* Filtering Controls Bento Block */}
              <div id="shop-filtering-layout" className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {/* Lateral filters Sidebar */}
                <div id="lateral-filters" className="space-y-6">
                  {/* Category Filter */}
                  <div className="space-y-2.5">
                    <h4 className="text-xs font-mono uppercase tracking-widest text-stone-500 font-bold">Gender Division</h4>
                    <div className="flex flex-col gap-1">
                      {['All', 'Men', 'Women', 'Unisex'].map((cat) => (
                        <button
                          key={cat}
                          type="button"
                          id={`filter-gender-${cat}`}
                          onClick={() => setSelectedCategory(cat)}
                          className={`w-full text-left text-xs font-sans px-3 py-2 rounded transition-colors ${
                            selectedCategory === cat
                              ? 'bg-stone-900 text-[#faf9f6] font-bold'
                              : 'text-stone-600 hover:bg-stone-100 hover:text-stone-950'
                          }`}
                        >
                          {cat === 'All' ? 'Cross-Division (All)' : cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Seasonal Drops Division */}
                  <div className="space-y-2.5">
                    <h4 className="text-xs font-mono uppercase tracking-widest text-stone-500 font-bold">Lookbook Seasonal Drops</h4>
                    <div className="flex flex-col gap-1">
                      {['All', 'Streetwear', 'Summer', 'Winter', 'Premium', 'Limited Edition'].map((coll) => (
                        <button
                          key={coll}
                          type="button"
                          id={`filter-collection-${coll}`}
                          onClick={() => setSelectedCollection(coll)}
                          className={`w-full text-left text-xs font-sans px-3 py-2 rounded transition-colors ${
                            selectedCollection === coll
                              ? 'bg-stone-900 text-[#faf9f6] font-semibold'
                              : 'text-stone-600 hover:bg-stone-100 hover:text-stone-950'
                          }`}
                        >
                          {coll === 'All' ? 'All Archive Drops' : `${coll} Drop`}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Product Type tags list */}
                  <div className="space-y-2.5">
                    <h4 className="text-xs font-mono uppercase tracking-widest text-stone-500 font-bold">Garment category types</h4>
                    <div className="flex flex-col gap-1">
                      {['All', 'T-Shirts', 'Hoodies', 'Jackets', 'Pants', 'Shorts', 'Accessories'].map((type) => (
                        <button
                          key={type}
                          type="button"
                          id={`filter-type-${type}`}
                          onClick={() => setSelectedType(type)}
                          className={`w-full text-left text-xs font-sans px-3 py-2 rounded transition-colors ${
                            selectedType === type
                              ? 'bg-stone-900 text-[#faf9f6] font-semibold'
                              : 'text-stone-600 hover:bg-stone-100 hover:text-stone-950'
                          }`}
                        >
                          {type === 'All' ? 'All Separates' : type}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Stock check box toggle */}
                  <div className="pt-2">
                    <label className="flex items-center gap-2 text-xs font-mono text-stone-600 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={activeStockOnly}
                        onChange={(e) => setActiveStockOnly(e.target.checked)}
                        className="rounded border-stone-200 text-stone-900 focus:ring-stone-900"
                      />
                      <span>In Stock Items only</span>
                    </label>
                  </div>
                </div>

                {/* Right side Grid catalog results */}
                <div id="catalog-results" className="md:col-span-3 space-y-6">
                  {/* Results summary indicators */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs text-stone-500 bg-stone-100 p-4 rounded-xl border border-stone-200">
                    <p>
                      Showing <strong>{filteredProducts.length}</strong> apparel works matching parameters
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[9px] uppercase">Active filter triggers:</span>
                      <span className="bg-stone-900 text-stone-100 px-2 py-0.5 rounded text-[10px]">
                        {selectedCategory === 'All' ? 'All Genders' : selectedCategory}
                      </span>
                      {selectedCollection !== 'All' && (
                        <span className="bg-stone-900 text-stone-100 px-2 py-0.5 rounded text-[10px]">
                          {selectedCollection} Drop
                        </span>
                      )}
                    </div>
                  </div>

                  {filteredProducts.length === 0 ? (
                    <div className="py-24 text-center select-none text-stone-400 bg-white border border-stone-250 rounded-2xl">
                      <Clock className="h-12 w-12 mx-auto text-stone-300 mb-4 animate-spin" style={{ animationDuration: '6s' }} />
                      <h3 className="font-sans font-bold text-stone-850">No lookbook elements match custom coordinates</h3>
                      <p className="text-xs text-stone-400 mt-1">Try resetting the side parameters to review Portugal stocks.</p>
                      <button
                        type="button"
                        id="reset-filters"
                        onClick={() => {
                          setSelectedCategory('All');
                          setSelectedCollection('All');
                          setSelectedType('All');
                          setSearchQuery('');
                        }}
                        className="mt-6 bg-stone-900 hover:bg-stone-800 text-stone-50 text-xs font-sans font-medium px-5 py-2.5 rounded-lg transition-colors"
                      >
                        Reset All Filters
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredProducts.map((product) => {
                        const totalProductStock = Object.values(product.stock).reduce((a, b) => a + b, 0);
                        const isSoldOut = totalProductStock === 0;

                        return (
                          <div
                            key={product.id}
                            id={`catalog-product-${product.id}`}
                            className="bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-xs hover:border-stone-900 transition-colors group flex flex-col justify-between"
                          >
                            <div
                              onClick={() => setSelectedDetailProduct(product)}
                              className="relative aspect-[3/4] bg-stone-50 overflow-hidden cursor-pointer"
                            >
                              <img
                                src={product.images[0]}
                                alt={product.name}
                                className="w-full h-full object-cover group-hover:scale-101 transition-transform duration-300"
                                referrerPolicy="no-referrer"
                              />
                              {isSoldOut && (
                                <div className="absolute inset-x-0 bottom-0 bg-stone-900/80 text-center text-stone-50 text-[10px] py-1.5 uppercase font-mono">
                                  Sold Out
                                </div>
                              )}
                              {product.isNewArrival && (
                                <span className="absolute top-3 left-3 bg-[#cfc6b5] text-stone-900 font-mono text-[9px] font-bold px-2.5 py-0.5 rounded uppercase">
                                  New Drop
                                </span>
                              )}
                            </div>

                            <div className="p-4 flex-1 flex flex-col justify-between">
                              <div className="space-y-1">
                                <div className="flex items-center justify-between">
                                  <span className="text-[10px] font-mono text-stone-400 font-medium">
                                    {product.type} / {product.category}
                                  </span>
                                  <div className="flex items-center gap-0.5 text-xs text-amber-500 font-bold">
                                    <Star className="h-3.5 w-3.5 fill-amber-500" />
                                    <span>{product.rating}</span>
                                  </div>
                                </div>
                                <h3
                                  onClick={() => setSelectedDetailProduct(product)}
                                  className="font-sans font-bold text-stone-900 text-sm hover:underline cursor-pointer truncate"
                                >
                                  {product.name}
                                </h3>
                                <div className="flex items-baseline gap-2">
                                  <span className="text-sm font-sans font-extrabold text-stone-900">${product.price}</span>
                                  {product.originalPrice && (
                                    <span className="text-xs text-stone-400 line-through">${product.originalPrice}</span>
                                  )}
                                </div>
                              </div>

                              <button
                                type="button"
                                id={`catalog-add-${product.id}`}
                                disabled={isSoldOut}
                                onClick={() => {
                                  handleAddToCart(product, product.sizes[0] || 'M', product.colors[0]);
                                  alert(`[Catalog Catalog] Added "${product.name}" to cart drawer!`);
                                }}
                                className="w-full mt-4 bg-stone-900 hover:bg-stone-800 text-stone-50 text-xs font-sans font-medium py-2.5 rounded-lg transition-colors cursor-pointer disabled:bg-stone-100 disabled:text-stone-400"
                              >
                                {isSoldOut ? 'Restocking soon' : 'Quick Add to Cart'}
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* C. ABOUT US VIEW */}
          {activePage === 'about' && <AboutUs />}

          {/* D. CONTACT US FAQ VIEW */}
          {activePage === 'contact' && <ContactFAQ />}

          {/* E. USER EXCLUSIVE MEMBER CONSOLE */}
          {activePage === 'account' && (
            <AccountDashboard
              orders={orders}
              onUpdateOrders={setOrders}
              addresses={addresses}
              onUpdateAddresses={setAddresses}
              wishlist={wishlist}
              onRemoveFromWishlist={handleRemoveFromWishlist}
              onAddToCart={handleAddToCart}
              loyaltyPoints={loyalty}
              onUpdateLoyalty={setLoyalty}
            />
          )}
        </AnimatePresence>
      </main>

      {/* 4. BUSINESS METRIC CONVERSION TELEMETRY COVER PANEL Drawer */}
      <AnimatePresence>
        {adminPanelOpen && (
          <motion.div
            id="admin-metrics-drawer"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="shrink-0"
          >
            <AdminTelemetry
              metrics={metrics}
              onUpdateMetrics={setMetrics}
              onResetMetrics={handleResetMetrics}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* 5. SLIDE-OUT SHOPPING CHECKOUT CAR SIDE PANEL */}
      <AnimatePresence>
        {cartOpen && (
          <div id="cart-sidebar-backdrop" className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex justify-end">
            {/* Click backdrop to exit */}
            <div className="absolute inset-0 cursor-pointer" onClick={() => setCartOpen(false)} />

            <motion.div
              id="cart-sidebar-drawer"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="relative w-full max-w-md bg-stone-50 h-full shadow-2xl flex flex-col justify-between"
            >
              {/* Header */}
              <div className="bg-[#faf9f6] border-b border-stone-200 p-5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="h-5 w-5 text-stone-900" />
                  <h3 className="font-sans font-bold text-stone-950 text-base">Your Active Checkout Cart</h3>
                </div>
                <button
                  type="button"
                  id="close-cart-sidebar-btn"
                  onClick={() => setCartOpen(false)}
                  className="p-1.5 text-stone-400 hover:text-stone-900 border border-stone-200 bg-white rounded-full transition-all cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Body: Items Loop with clean progressive indicators */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                {/* Free Shipping target progress! */}
                {cartSubtotal > 0 && (
                  <div className="bg-stone-900 text-stone-100 rounded-xl p-4 text-xs font-sans space-y-2 border border-stone-800">
                    {cartSubtotal >= freeShippingThreshold ? (
                      <p className="flex items-center gap-1.5 font-sans font-bold text-green-400 leading-none">
                        <Check className="h-4 w-4 text-green-400 shrink-0" />
                        Complimentary Worldwide Express shipping active!
                      </p>
                    ) : (
                      <div className="space-y-1">
                        <p className="text-stone-300">
                          Add <strong className="text-white">${freeShippingThreshold - cartSubtotal}</strong> more to triggers <strong>Complimentary Worldwide express shipping</strong>!
                        </p>
                        <div className="w-full bg-stone-850 h-1 rounded-full overflow-hidden">
                          <div
                            className="bg-orange-400 h-full rounded-full transition-all"
                            style={{ width: `${(cartSubtotal / freeShippingThreshold) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {cart.length === 0 ? (
                  <div className="py-24 text-center select-none text-stone-400 font-sans">
                    <ShoppingBag className="h-10 w-10 mx-auto text-stone-300 font-normal mb-3" />
                    <p className="text-sm font-medium">Your checkout drawer is currently vacant.</p>
                  </div>
                ) : (
                  <div className="divide-y divide-stone-200">
                    {cart.map((item, idx) => (
                      <div key={idx} id={`cart-row-${idx}`} className="flex items-start gap-4 py-3.5 first:pt-0">
                        <img
                          src={item.product.images[0]}
                          alt={item.product.name}
                          className="h-20 w-15 object-cover rounded-md border border-stone-200 shrink-0"
                          referrerPolicy="no-referrer"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-sans font-bold text-stone-900 text-xs sm:text-sm truncate leading-tight">
                            {item.product.name}
                          </h4>
                          <p className="text-[10px] font-mono text-stone-400 uppercase mt-1">
                            SIZE: <strong className="text-stone-850">{item.selectedSize}</strong> • PIN: <strong className="text-stone-850">{item.selectedColor.name}</strong>
                          </p>

                          {/* Adjusted Quantity Controls */}
                          <div className="flex items-center gap-2.5 mt-2.5">
                            <button
                              type="button"
                              id={`qty-decrease-${idx}`}
                              onClick={() => handleAdjustQuantity(idx, item.quantity - 1)}
                              className="h-6 w-6 rounded border border-stone-200 bg-white flex items-center justify-center text-stone-600 hover:bg-stone-50 transition-colors"
                            >
                              -
                            </button>
                            <span className="text-xs font-mono font-bold text-stone-800">{item.quantity}</span>
                            <button
                              type="button"
                              id={`qty-increase-${idx}`}
                              onClick={() => handleAdjustQuantity(idx, item.quantity + 1)}
                              className="h-6 w-6 rounded border border-stone-200 bg-white flex items-center justify-center text-stone-600 hover:bg-stone-50 transition-colors"
                            >
                              +
                            </button>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <p className="font-sans font-bold text-stone-950 text-sm">
                            ${(item.product.price * item.quantity).toFixed(2)}
                          </p>
                          <button
                            type="button"
                            id={`qty-delete-${idx}`}
                            onClick={() => handleRemoveFromCart(idx)}
                            className="mt-2 text-stone-400 hover:text-red-650 text-[10px] font-mono cursor-pointer"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Checkout Foot Pricing totals */}
              <div id="cart-footer-totals" className="bg-[#faf9f6] border-t border-stone-200 p-5 space-y-4 shrink-0">
                <div className="space-y-1 text-xs text-stone-500 font-sans">
                  <div className="flex items-center justify-between">
                    <span>Cart Subtotal</span>
                    <span className="font-mono text-stone-900">${cartSubtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Est. Worldwide Express</span>
                    <span className="font-mono text-stone-900">
                      {shippingCost === 0 ? 'COMPLIMENTARY' : `$${shippingCost.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Est. Tax Division (8%)</span>
                    <span className="font-mono text-stone-900">${estimatedTax.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between border-t border-stone-200 pt-2 text-[#0f0f10] font-sans font-bold text-sm sm:text-base">
                    <span>Total Checkout Pay</span>
                    <span className="font-mono text-stone-950">${cartTotalTotal.toFixed(2)}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    id="trigger-order-complete-checkout"
                    disabled={cart.length === 0}
                    onClick={handleProcessCheckout}
                    className="w-full bg-stone-900 hover:bg-stone-800 text-stone-50 text-xs sm:text-sm font-sans font-bold py-3.5 rounded-xl transition-all shadow-md cursor-pointer text-center uppercase tracking-widest disabled:bg-stone-200 disabled:text-stone-400 disabled:cursor-not-allowed"
                  >
                    Express Security Checkout
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 6. MODAL SIMULATED GATEWAY CHECKOUT DETAILS */}
      <AnimatePresence>
        {showCheckoutModal && (
          <div id="checkout-gateway-modal-backdrop" className="fixed inset-0 z-50 bg-stone-950/65 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              id="checkout-portal"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="w-full max-w-lg bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-2xl"
            >
              <div className="bg-stone-950 p-4 text-stone-50 flex items-center justify-between">
                <h4 className="text-sm font-sans font-bold flex items-center gap-1.5 uppercase tracking-wider">
                  <ShieldCheck className="h-4.5 w-4.5 text-green-400" />
                  Stripe SSL Secure Gateway Checkout
                </h4>
                <button
                  type="button"
                  id="checkout-abort-btn"
                  onClick={() => setShowCheckoutModal(false)}
                  className="text-stone-400 hover:text-stone-50"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {checkoutStep === 'address' ? (
                <div className="p-6 space-y-6">
                  <div>
                    <h3 className="text-base font-sans font-bold text-stone-900 mb-1">Confirm Delivery Coordinate</h3>
                    <p className="text-xs text-stone-500">Choose physical address below for expedited Portugal dispatch tracking.</p>
                  </div>

                  <div className="space-y-2">
                    {addresses.map((addr, idx) => (
                      <label
                        key={addr.id}
                        onClick={() => setSelectedCheckoutAddressIdx(idx)}
                        className={`block border rounded-xl p-3.5 text-xs text-stone-600 transition-colors cursor-pointer ${
                          selectedCheckoutAddressIdx === idx
                            ? 'border-stone-950 bg-stone-50 ring-1 ring-stone-900'
                            : 'border-stone-200 hover:border-stone-400 bg-white'
                        }`}
                      >
                        <div className="flex items-center justify-between font-bold mb-1">
                          <span className="text-stone-950 text-xs">{addr.fullName}</span>
                          <span className="font-mono text-[9px] uppercase bg-stone-100 px-1.5 py-0.5 rounded text-stone-500">
                            {addr.label}
                          </span>
                        </div>
                        <p>{addr.street}</p>
                        <p>{addr.city}, {addr.postalCode} • {addr.country}</p>
                      </label>
                    ))}
                  </div>

                  {/* Pricing brief */}
                  <div className="bg-stone-150 rounded-xl p-4 border border-stone-200 text-xs text-stone-700 space-y-1">
                    <div className="flex justify-between">
                      <span>Secure Subtotal</span>
                      <span className="font-mono font-bold">${cartSubtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-stone-900 font-bold text-sm border-t border-stone-200 pt-2">
                      <span>Final Ledger Pay</span>
                      <span className="font-mono">${cartTotalTotal.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      id="abort-checkout-total"
                      onClick={() => setShowCheckoutModal(false)}
                      className="flex-1 border border-stone-250 font-sans font-semibold text-xs py-3 rounded-lg hover:bg-stone-50 text-stone-600 transition-colors"
                    >
                      Refine Shopping Cart
                    </button>
                    <button
                      type="button"
                      id="complete-order-final-btn"
                      onClick={handleCompleteOrder}
                      className="flex-1 bg-stone-900 hover:bg-stone-850 text-stone-50 font-sans font-bold text-xs py-3 rounded-lg transition-colors shadow-md text-center cursor-pointer"
                    >
                      Authorize Transaction
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-6 text-center space-y-6">
                  <div className="h-12 w-12 rounded-full bg-green-50 text-green-700 flex items-center justify-center mx-auto border border-green-150">
                    <Check className="h-6 w-6" />
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-lg font-sans font-bold text-stone-900">Transaction Authorized</h3>
                    <p className="text-xs text-stone-500">Portuguese dispatch tracking metrics updated in account ledger.</p>
                  </div>

                  {latestReceiptOrder && (
                    <div className="border border-stone-200 rounded-xl p-4 bg-stone-50 text-left font-mono text-[11px] space-y-2">
                      <p className="font-bold text-stone-900 font-sans text-xs border-b border-stone-200 pb-2 flex items-center justify-between">
                        <span>RECEIPT DOCUMENTATION</span>
                        <span>{latestReceiptOrder.id}</span>
                      </p>
                      <div className="space-y-1 text-stone-500 pt-1">
                        <p>Date: {latestReceiptOrder.date}</p>
                        <p>Courier: DHL Air Freight Cargo Premium</p>
                        <p>Tracking: {latestReceiptOrder.trackingNumber}</p>
                        <p>Loyalty Balance Gained: {latestReceiptOrder.loyaltyPointsEarned} points</p>
                      </div>
                    </div>
                  )}

                  <p className="text-[11px] text-stone-400 leading-normal">
                    An authentic receipt invoice has been sent to your registered Gmail account. Track updates on your Account orders timeline page.
                  </p>

                  <button
                    type="button"
                    id="finish-receipt-btn"
                    onClick={() => {
                      setShowCheckoutModal(false);
                      setCartOpen(false);
                      setActivePage('account');
                    }}
                    className="w-full bg-stone-900 hover:bg-stone-800 text-stone-50 font-sans font-bold text-xs py-3 rounded-lg transition-colors shadow-sm cursor-pointer"
                  >
                    View Account Orders Logs
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 7. DETAILED PRODUCT CORE MODAL FOCUS VIEW */}
      <AnimatePresence>
        {selectedDetailProduct && (
          <ProductDetail
            product={selectedDetailProduct}
            onClose={() => setSelectedDetailProduct(null)}
            onAddToCart={handleAddToCart}
            onAddToWishlist={handleAddToWishlist}
            onBuyNow={handleBuyNow}
          />
        )}
      </AnimatePresence>

      {/* 8. FOOTER METADATA GRIDS */}
      <footer id="global-application-footer" className="bg-stone-900 text-stone-400 border-t border-stone-850 p-12">
        <div id="footer-inner" className="mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Column 1 */}
          <div className="space-y-4">
            <span className="bg-stone-100 text-stone-900 px-2.5 py-1 rounded-sm uppercase text-sm tracking-widest font-black inline-block select-none">
              STRT
            </span>
            <p className="text-xs text-stone-500 leading-relaxed max-w-xs">
              Streetwear designed with extreme Portuguese loopback density to reinforce quiet, sustainable everyday confidence.
            </p>
          </div>

          {/* Column 2 */}
          <div className="space-y-2">
            <h4 className="text-stone-50 font-sans font-bold text-xs uppercase tracking-wider mb-2">Lookbook Catalog</h4>
            <div className="flex flex-col gap-1.5 text-xs text-stone-400">
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory('Men');
                  setSelectedType('All');
                  setActivePage('shop');
                }}
                className="text-left hover:text-stone-100 transition-colors"
              >
                Men's Separates
              </button>
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory('Women');
                  setSelectedType('All');
                  setActivePage('shop');
                }}
                className="text-left hover:text-stone-100 transition-colors"
              >
                Women's Archives
              </button>
              <button
                type="button"
                onClick={() => {
                  setSelectedCollection('Limited Edition');
                  setActivePage('shop');
                }}
                className="text-left hover:text-stone-100 transition-colors text-orange-400 font-medium"
              >
                Limited Edition Collections Drop
              </button>
            </div>
          </div>

          {/* Column 3 */}
          <div className="space-y-2">
            <h4 className="text-stone-50 font-sans font-bold text-xs uppercase tracking-wider mb-2">Legal Divisions</h4>
            <div className="flex flex-col gap-1.5 text-xs text-stone-400">
              <button type="button" onClick={() => setActivePage('about')} className="text-left hover:text-stone-100 transition-colors">
                Lisbon Manufacturing Standards
              </button>
              <button type="button" onClick={() => setActivePage('contact')} className="text-left hover:text-stone-100 transition-colors">
                Atelier Returns Center FAQ
              </button>
              <span className="text-[10px] text-stone-600 font-mono">100% GOTS CARBON OFFSET VERIFIED</span>
            </div>
          </div>

          {/* Column 4 */}
          <div className="space-y-3">
            <h4 className="text-stone-50 font-sans font-bold text-xs uppercase tracking-wider mb-1">Developer Credentials</h4>
            <div className="space-y-1 text-[11px] font-mono text-stone-500 leading-snug">
              <p>Platform: Antigravity Container Instance</p>
              <p>State Persistence: GOTS Local Storage Engine</p>
              <p>Secure Node Port Active: 3000</p>
            </div>
            <div className="pt-2 border-t border-stone-850 flex items-center gap-1.5 text-[9px] font-mono text-stone-600">
              <span>DESIGNED BY ARTISANS</span>
              <span>•</span>
              <span>© 2026 STRT ATELIER</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
