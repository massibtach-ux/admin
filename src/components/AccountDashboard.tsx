import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  User,
  ShoppingBag,
  MapPin,
  Heart,
  Gift,
  RefreshCcw,
  Check,
  ChevronRight,
  Plus,
  Trash2,
  FileText,
  Truck
} from 'lucide-react';
import { Product, Order, Address, LoyaltyPoints } from '../types';

interface AccountDashboardProps {
  orders: Order[];
  onUpdateOrders: (orders: Order[]) => void;
  addresses: Address[];
  onUpdateAddresses: (addresses: Address[]) => void;
  wishlist: Product[];
  onRemoveFromWishlist: (product: Product) => void;
  onAddToCart: (product: Product, size: string, color: { name: string; hex: string }) => void;
  loyaltyPoints: LoyaltyPoints;
  onUpdateLoyalty: (points: LoyaltyPoints) => void;
}

export default function AccountDashboard({
  orders,
  onUpdateOrders,
  addresses,
  onUpdateAddresses,
  wishlist,
  onRemoveFromWishlist,
  onAddToCart,
  loyaltyPoints,
  onUpdateLoyalty
}: AccountDashboardProps) {
  const [activeTab, setActiveTab] = useState<'orders' | 'addresses' | 'wishlist' | 'loyalty' | 'returns'>('orders');

  // Address Form States
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [label, setLabel] = useState('Home');
  const [fullName, setFullName] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('United States');

  // Returns management form
  const [selectedOrderReturn, setSelectedOrderReturn] = useState<string>('');
  const [returnReason, setReturnReason] = useState('Size was too large');
  const [showReturnConfirm, setShowReturnConfirm] = useState(false);
  const [activeReturnSuccessMsg, setActiveReturnSuccessMsg] = useState('');

  const handleAddNewAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !street || !city || !postalCode) return;

    const newAddr: Address = {
      id: `addr-${Date.now()}`,
      label,
      fullName,
      street,
      city,
      postalCode,
      country,
      isDefault: addresses.length === 0,
    };

    onUpdateAddresses([...addresses, newAddr]);
    // Reset Form
    setFullName('');
    setStreet('');
    setCity('');
    setPostalCode('');
    setLabel('Home');
    setShowAddressForm(false);
  };

  const handleDeleteAddress = (id: string) => {
    onUpdateAddresses(addresses.filter(addr => addr.id !== id));
  };

  const handleInitiateReturn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrderReturn) return;

    const targetOrder = orders.find(o => o.id === selectedOrderReturn);
    if (!targetOrder) return;

    // Update order status to Pending Return or Returned
    const updated = orders.map(o => {
      if (o.id === selectedOrderReturn) {
        return { ...o, status: 'Returned' as const };
      }
      return o;
    });
    onUpdateOrders(updated);

    // Deduct loyalty points
    const pointsDeducted = targetOrder.loyaltyPointsEarned;
    const newBalance = Math.max(0, loyaltyPoints.balance - pointsDeducted);
    onUpdateLoyalty({
      ...loyaltyPoints,
      balance: newBalance,
      history: [
        {
          date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
          points: -pointsDeducted,
          description: `Deducted for return: ${targetOrder.id}`
        },
        ...loyaltyPoints.history
      ]
    });

    setActiveReturnSuccessMsg(`Return request processed. A printable prepaid DHL return shipping label has been dispatched for order ${selectedOrderReturn}. Your balance has been updated.`);
    setSelectedOrderReturn('');
    setTimeout(() => {
      setActiveReturnSuccessMsg('');
    }, 6000);
  };

  return (
    <div id="account-dashboard-wrapper" className="mx-auto max-w-7xl px-4 py-12">
      {/* Upper Bio Strip */}
      <div id="account-header-strip" className="border-b border-stone-200 pb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-10">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-stone-900 flex items-center justify-center text-stone-50 select-none">
            <User className="h-8 w-8" />
          </div>
          <div>
            <h2 className="text-2xl font-sans font-semibold tracking-tight text-stone-900">Alex Vance</h2>
            <p className="text-xs font-mono text-stone-500 uppercase mt-1">
              Atelier Member since Dec 2025 • <span className="text-stone-900 font-bold">{loyaltyPoints.tier} Tier</span>
            </p>
          </div>
        </div>
        <div className="flex items-center gap-6 bg-stone-50 border border-stone-200 rounded-xl px-5 py-4 shrink-0">
          <div>
            <span className="block text-[10px] font-mono text-stone-400 uppercase">PURCHASING POWER</span>
            <span className="block font-sans font-bold text-stone-900 text-lg mt-0.5">{loyaltyPoints.balance} Points</span>
          </div>
          <div className="h-8 w-[1px] bg-stone-200"></div>
          <div>
            <span className="block text-[10px] font-mono text-stone-400 uppercase">TIER STATUS</span>
            <span className="block font-sans font-bold text-stone-900 text-lg mt-0.5">Silver Member</span>
          </div>
        </div>
      </div>

      <div id="dashboard-content-layout" className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Navigation Sidebar */}
        <div id="dashboard-sidebar-menu" className="md:col-span-1 space-y-1">
          <button
            type="button"
            id="nav-orders-btn"
            onClick={() => setActiveTab('orders')}
            className={`w-full flex items-center justify-between text-left text-sm font-sans font-medium px-4 py-3 rounded-lg transition-colors ${
              activeTab === 'orders' ? 'bg-stone-900 text-stone-50' : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
            }`}
          >
            <span className="flex items-center gap-2.5">
              <ShoppingBag className="h-4 w-4" />
              Order History
            </span>
            <ChevronRight className="h-4 w-4 font-normal" />
          </button>

          <button
            type="button"
            id="nav-addresses-btn"
            onClick={() => setActiveTab('addresses')}
            className={`w-full flex items-center justify-between text-left text-sm font-sans font-medium px-4 py-3 rounded-lg transition-colors ${
              activeTab === 'addresses' ? 'bg-stone-900 text-stone-50' : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
            }`}
          >
            <span className="flex items-center gap-2.5">
              <MapPin className="h-4 w-4" />
              Saved Addresses
            </span>
            <ChevronRight className="h-4 w-4 font-normal" />
          </button>

          <button
            type="button"
            id="nav-wishlist-btn"
            onClick={() => setActiveTab('wishlist')}
            className={`w-full flex items-center justify-between text-left text-sm font-sans font-medium px-4 py-3 rounded-lg transition-colors ${
              activeTab === 'wishlist' ? 'bg-stone-900 text-stone-50' : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
            }`}
          >
            <span className="flex items-center gap-2.5">
              <Heart className="h-4 w-4" />
              Your Wishlist ({wishlist.length})
            </span>
            <ChevronRight className="h-4 w-4 font-normal" />
          </button>

          <button
            type="button"
            id="nav-loyalty-btn"
            onClick={() => setActiveTab('loyalty')}
            className={`w-full flex items-center justify-between text-left text-sm font-sans font-medium px-4 py-3 rounded-lg transition-colors ${
              activeTab === 'loyalty' ? 'bg-stone-900 text-stone-50' : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
            }`}
          >
            <span className="flex items-center gap-2.5">
              <Gift className="h-4 w-4" />
              Atelier Club Points
            </span>
            <ChevronRight className="h-4 w-4 font-normal" />
          </button>

          <button
            type="button"
            id="nav-returns-btn"
            onClick={() => setActiveTab('returns')}
            className={`w-full flex items-center justify-between text-left text-sm font-sans font-medium px-4 py-3 rounded-lg transition-colors ${
              activeTab === 'returns' ? 'bg-stone-900 text-stone-50' : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
            }`}
          >
            <span className="flex items-center gap-2.5">
              <RefreshCcw className="h-4 w-4" />
              Returns Center
            </span>
            <ChevronRight className="h-4 w-4 font-normal" />
          </button>
        </div>

        {/* Dynamic Display Panel */}
        <div id="dashboard-main-view" className="md:col-span-3 bg-white border border-stone-200 rounded-2xl p-6 sm:p-8 min-h-[400px] shadow-sm">
          <AnimatePresence mode="wait">
            {/* 1. ORDER HISTORY */}
            {activeTab === 'orders' && (
              <motion.div
                key="orders"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 5 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="text-lg font-sans font-bold text-stone-900">Your Complete Order Log</h3>
                  <p className="text-xs text-stone-500">Track shipments, verify delivery, download digital invoices instantly.</p>
                </div>

                {orders.length === 0 ? (
                  <div className="py-20 text-center select-none text-stone-400">
                    <ShoppingBag className="h-10 w-10 mx-auto text-stone-300 stroke-[1.5] mb-3" />
                    <p className="text-sm font-medium">You haven’t ordered from our collections yet.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div
                        key={order.id}
                        id={`order-block-${order.id}`}
                        className="border border-stone-200 rounded-xl overflow-hidden shadow-sm"
                      >
                        {/* Order Header */}
                        <div className="bg-stone-50 border-b border-stone-200 p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5 text-xs">
                          <div className="flex flex-wrap items-center gap-x-6 gap-y-1 text-stone-500">
                            <div>
                              <span className="block font-mono uppercase text-[9px] text-stone-400">ORDER NO.</span>
                              <span className="font-sans font-bold text-stone-900">{order.id}</span>
                            </div>
                            <div>
                              <span className="block font-mono uppercase text-[9px] text-stone-400">PLACED ON</span>
                              <span className="font-sans font-medium text-stone-800">{order.date}</span>
                            </div>
                            <div>
                              <span className="block font-mono uppercase text-[9px] text-stone-400">TOTAL PAID</span>
                              <span className="font-sans font-bold text-stone-900">${order.totalPrice.toFixed(2)}</span>
                            </div>
                          </div>
                          <div>
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-sans font-semibold text-[10px] ${
                              order.status === 'Delivered'
                                ? 'bg-green-50 text-green-700 border border-green-200'
                                : order.status === 'Returned'
                                ? 'bg-red-50 text-red-700 border border-red-200'
                                : 'bg-brand-orange-50 text-orange-700 border border-orange-200 animate-pulse'
                            }`}>
                              {order.status === 'Delivered' && <Check className="h-3 w-3" />}
                              {order.status === 'Returned' && <RefreshCcw className="h-3 w-3" />}
                              {!['Delivered', 'Returned'].includes(order.status) && <Truck className="h-3 w-3" />}
                              {order.status}
                            </span>
                          </div>
                        </div>

                        {/* Order Items */}
                        <div className="p-4 divide-y divide-stone-100">
                          {order.items.map((item, idx) => (
                            <div key={idx} id={`order-item-${idx}`} className="flex items-center gap-4 py-3 first:pt-0 last:pb-0">
                              <img
                                src={item.image}
                                alt={item.productName}
                                className="h-16 w-12 object-cover rounded border border-stone-200"
                                referrerPolicy="no-referrer"
                              />
                              <div className="flex-1">
                                <h4 className="font-sans font-bold text-stone-900 text-xs sm:text-sm">{item.productName}</h4>
                                <div className="flex gap-4 text-[10px] text-stone-400 font-mono uppercase mt-1">
                                  <span>SIZE: <span className="text-stone-700 font-bold">{item.size}</span></span>
                                  <span>COLOR: <span className="text-stone-700 font-bold">{item.color}</span></span>
                                  <span>QTY: <span className="text-stone-700 font-bold">{item.quantity}</span></span>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="font-sans font-bold text-stone-900 text-sm">${item.price.toFixed(2)}</p>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Order Footer Actions */}
                        <div className="bg-stone-50 border-t border-stone-200 p-4 flex flex-wrap items-center justify-between gap-3 text-xs">
                          {order.trackingNumber && (
                            <p className="text-xs text-stone-500 font-mono">
                              TRACKING ID: <span className="font-sans font-bold text-stone-700">{order.trackingNumber}</span>
                            </p>
                          )}
                          <div className="flex items-center gap-3">
                            <button
                              type="button"
                              id={`invoice-btn-${order.id}`}
                              onClick={() => {
                                alert(`[Streetwear Portal] Digital invoice generated for order ${order.id}. Printable slip downloaded.`);
                              }}
                              className="text-stone-600 hover:text-stone-900 border border-stone-200 bg-white hover:bg-stone-50 font-sans font-medium px-3 py-1.5 rounded-md transition-colors"
                            >
                              Get Invoice (PDF)
                            </button>
                            {order.status === 'Delivered' && (
                              <button
                                type="button"
                                id={`return-trigger-${order.id}`}
                                onClick={() => {
                                  setSelectedOrderReturn(order.id);
                                  setActiveTab('returns');
                                }}
                                className="text-stone-50 bg-stone-900 hover:bg-stone-800 font-sans font-medium px-3 py-1.5 rounded-md transition-colors"
                              >
                                Return Item
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* 2. SAVED ADDRESS COORDINATES */}
            {activeTab === 'addresses' && (
              <motion.div
                key="addresses"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 5 }}
                className="space-y-6"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-sans font-bold text-stone-900">Delivery Address Protocols</h3>
                    <p className="text-xs text-stone-500">Edit or expand your secure checkout shipping details.</p>
                  </div>
                  {!showAddressForm && (
                    <button
                      type="button"
                      id="show-address-form-btn"
                      onClick={() => setShowAddressForm(true)}
                      className="inline-flex items-center gap-1.5 bg-stone-900 hover:bg-stone-800 text-stone-50 font-sans font-medium text-xs px-4 py-2.5 rounded-lg transition-colors shadow-sm"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      Add Address
                    </button>
                  )}
                </div>

                {showAddressForm && (
                  <motion.form
                    id="address-entry-form"
                    onSubmit={handleAddNewAddress}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="border border-stone-200 rounded-xl p-5 bg-stone-50 space-y-4"
                  >
                    <h4 className="text-sm font-sans font-bold text-stone-900">Add New Shipping Protocol</h4>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-mono text-stone-400 uppercase mb-1">Coordinates Label</label>
                        <select
                          id="address-label"
                          value={label}
                          onChange={(e) => setLabel(e.target.value)}
                          className="w-full text-xs text-stone-900 border border-stone-200 bg-white focus:outline-none rounded p-2"
                        >
                          <option value="Home">Home Delivery</option>
                          <option value="Work">Work Atelier</option>
                          <option value="Billing">Primary Billing</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] font-mono text-stone-400 uppercase mb-1">Full Addressee Name</label>
                        <input
                          type="text"
                          id="address-fullname"
                          required
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="e.g. Alex Vance"
                          className="w-full text-xs text-stone-900 border border-stone-200 bg-white focus:outline-none rounded p-2"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono text-stone-400 uppercase mb-1">Street Address</label>
                      <input
                        type="text"
                        id="address-street"
                        required
                        value={street}
                        onChange={(e) => setStreet(e.target.value)}
                        placeholder="742 Evergreen Terrace"
                        className="w-full text-xs text-stone-900 border border-stone-200 bg-white focus:outline-none rounded p-2"
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-[10px] font-mono text-stone-400 uppercase mb-1">City</label>
                        <input
                          type="text"
                          id="address-city"
                          required
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          placeholder="NYC"
                          className="w-full text-xs text-stone-900 border border-stone-200 bg-white focus:outline-none rounded p-2"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono text-stone-400 uppercase mb-1">Postal/Zip Code</label>
                        <input
                          type="text"
                          id="address-postal"
                          required
                          value={postalCode}
                          onChange={(e) => setPostalCode(e.target.value)}
                          placeholder="10001"
                          className="w-full text-xs text-stone-900 border border-stone-200 bg-white focus:outline-none rounded p-2"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono text-stone-400 uppercase mb-1">Country</label>
                        <input
                          type="text"
                          id="address-country"
                          required
                          value={country}
                          onChange={(e) => setCountry(e.target.value)}
                          placeholder="United States"
                          className="w-full text-xs text-stone-900 border border-stone-200 bg-white focus:outline-none rounded p-2"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                      <button
                        type="button"
                        id="cancel-address-btn"
                        onClick={() => setShowAddressForm(false)}
                        className="text-stone-500 hover:text-stone-800 text-xs font-sans font-medium px-3 py-1.5"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        id="submit-address-btn"
                        className="bg-stone-900 hover:bg-stone-800 text-stone-50 font-sans font-medium text-xs px-4 py-1.5 rounded"
                      >
                        Save Dynamic Address
                      </button>
                    </div>
                  </motion.form>
                )}

                <div id="addresses-grid" className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {addresses.map((addr) => (
                    <div
                      key={addr.id}
                      id={`address-box-${addr.id}`}
                      className="border border-stone-200 p-5 rounded-xl hover:border-stone-900 transition-colors relative"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-mono text-[10px] uppercase bg-stone-100 text-stone-600 px-2.5 py-0.5 rounded-full font-bold">
                          {addr.label}
                        </span>
                        {addr.isDefault && (
                          <span className="text-[10px] font-sans font-semibold text-green-700">DEFAULT</span>
                        )}
                      </div>

                      <div className="text-xs text-stone-600 space-y-1">
                        <p className="font-bold text-stone-900 text-sm">{addr.fullName}</p>
                        <p>{addr.street}</p>
                        <p>{addr.city}, {addr.postalCode}</p>
                        <p>{addr.country}</p>
                      </div>

                      <button
                        type="button"
                        id={`delete-addr-${addr.id}`}
                        onClick={() => handleDeleteAddress(addr.id)}
                        className="absolute bottom-5 right-5 text-stone-400 hover:text-red-600 transition-colors cursor-pointer"
                        title="Delete Address"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* 3. YOUR WISHLIST */}
            {activeTab === 'wishlist' && (
              <motion.div
                key="wishlist"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 5 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="text-lg font-sans font-bold text-stone-900">Your Saved Lookbook Elements</h3>
                  <p className="text-xs text-stone-500">Products saved for quick purchasing before seasonal inventory sells out.</p>
                </div>

                {wishlist.length === 0 ? (
                  <div className="py-20 text-center select-none text-stone-400">
                    <Heart className="h-10 w-10 mx-auto text-stone-300 stroke-[1.5] mb-3" />
                    <p className="text-sm font-medium">Your wishlist is currently clear.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {wishlist.map((item) => (
                      <div
                        key={item.id}
                        id={`wishlist-row-${item.id}`}
                        className="flex items-center gap-4 border border-stone-200 rounded-xl p-4 hover:border-stone-400 transition-colors"
                      >
                        <img
                          src={item.images[0]}
                          alt={item.name}
                          className="h-20 w-16 object-cover rounded-lg border border-stone-100"
                          referrerPolicy="no-referrer"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-sans font-bold text-stone-900 text-sm truncate">{item.name}</h4>
                          <p className="font-sans text-stone-900 font-bold mt-1 text-sm">${item.price}</p>
                          <div className="flex gap-2 mt-2">
                            <button
                              type="button"
                              id={`wish-to-cart-${item.id}`}
                              onClick={() => {
                                onAddToCart(item, item.sizes[0] || 'M', item.colors[0]);
                                alert(`[Wishlist] Added ${item.name} to checkout cart!`);
                              }}
                              className="bg-stone-900 hover:bg-stone-800 text-stone-50 text-[10px] font-mono uppercase font-bold tracking-tight px-3 py-1.5 rounded transition-colors"
                            >
                              Add To Cart
                            </button>
                            <button
                              type="button"
                              id={`remove-wish-list-${item.id}`}
                              onClick={() => onRemoveFromWishlist(item)}
                              className="text-stone-400 hover:text-red-600 border border-stone-200 hover:border-red-100 p-1.5 rounded transition-colors"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* 4. ATELIER POINTS */}
            {activeTab === 'loyalty' && (
              <motion.div
                key="loyalty"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 5 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="text-lg font-sans font-bold text-stone-900">Atelier Loyalty System</h3>
                  <p className="text-xs text-stone-500">Every dollar spent earns 1 points towards high-tier member lookbook perks.</p>
                </div>

                {/* Progress Wheel */}
                <div id="loyalty-progress-container" className="bg-stone-900 text-stone-100 p-6 sm:p-8 rounded-2xl relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-6">
                  {/* Backdrop accents */}
                  <div className="absolute top-0 right-0 h-40 w-40 bg-stone-800/50 rounded-full blur-3xl pointer-events-none"></div>

                  <div className="space-y-4">
                    <div>
                      <span className="text-[10px] font-mono tracking-widest text-stone-400 uppercase">TIER LEVEL</span>
                      <h4 className="text-2xl font-sans font-black text-stone-100 mt-1">{loyaltyPoints.tier} Member</h4>
                    </div>
                    <div className="w-56 bg-stone-800 h-2 rounded-full overflow-hidden">
                      <div
                        id="loyalty-prog-bar"
                        className="bg-stone-50 h-full rounded-full transition-all duration-700"
                        style={{ width: `${(loyaltyPoints.balance / loyaltyPoints.nextTierPoints) * 100}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-stone-400 leading-normal">
                      Accrued <strong>{loyaltyPoints.balance}</strong> of <strong>{loyaltyPoints.nextTierPoints}</strong> points for Gold lookbook access.
                    </p>
                  </div>

                  <div className="text-center sm:text-right space-y-1">
                    <span className="block text-[10px] font-mono text-stone-400 uppercase">TIER REBATES</span>
                    <span className="block font-sans font-extrabold text-stone-50 text-3xl">15% Savings</span>
                    <span className="block text-[9px] font-mono text-stone-300">TRIGGERED ON GOLD PROGRESSION</span>
                  </div>
                </div>

                {/* Points Ledger */}
                <div>
                  <h4 className="text-sm font-sans font-bold text-stone-900 mb-3">Loyalty Ledger</h4>
                  <div className="border border-stone-200 rounded-xl overflow-hidden divide-y divide-stone-100 bg-stone-50">
                    {loyaltyPoints.history.map((record, idx) => (
                      <div key={idx} id={`ledger-row-${idx}`} className="p-4 flex items-center justify-between text-xs">
                        <div>
                          <p className="font-sans font-bold text-stone-900">{record.description}</p>
                          <span className="text-[10px] font-mono text-stone-500">{record.date}</span>
                        </div>
                        <div className="text-right">
                          <span className={`font-sans font-extrabold text-sm ${record.points >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                            {record.points >= 0 ? `+${record.points}` : record.points} PTS
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* 5. RETURNS MANAGEMENT */}
            {activeTab === 'returns' && (
              <motion.div
                key="returns"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 5 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="text-lg font-sans font-bold text-stone-900">Returns Management Center</h3>
                  <p className="text-xs text-stone-500">Initiate returns, print pre-paid parcel labels quickly and without fuss.</p>
                </div>

                {activeReturnSuccessMsg && (
                  <div className="p-4 bg-green-50 text-green-800 border border-green-150 rounded-lg text-xs leading-relaxed">
                    <strong>Return initiated!</strong> {activeReturnSuccessMsg}
                  </div>
                )}

                <form onSubmit={handleInitiateReturn} className="border border-stone-200 rounded-xl p-5 bg-stone-50 space-y-4">
                  <div>
                    <label className="block text-xs font-mono text-stone-500 uppercase mb-1">Select Order to Return</label>
                    <select
                      id="return-order-select"
                      value={selectedOrderReturn}
                      onChange={(e) => setSelectedOrderReturn(e.target.value)}
                      className="w-full text-xs text-stone-900 border border-stone-200 bg-white focus:outline-none rounded-lg p-2.5"
                    >
                      <option value="">-- Choose eligible order --</option>
                      {orders
                        .filter(o => o.status === 'Delivered')
                        .map(o => (
                          <option key={o.id} value={o.id}>
                            Order {o.id} - Placed {o.date} (${o.totalPrice.toFixed(2)})
                          </option>
                        ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-stone-500 uppercase mb-1">Reason for Return</label>
                    <select
                      id="return-reason"
                      value={returnReason}
                      onChange={(e) => setReturnReason(e.target.value)}
                      className="w-full text-xs text-stone-900 border border-stone-200 bg-white focus:outline-none rounded-lg p-[9px]"
                    >
                      <option value="Size was too large">Sizing Issues: Too Oversized</option>
                      <option value="Size was too small">Sizing Issues: Too Small</option>
                      <option value="Does not fit style">Aesthetic style: Did not match expectations</option>
                      <option value="Changed mind">Consumer decision: Changed my mind</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    id="confirm-return-btn"
                    disabled={!selectedOrderReturn}
                    className={`w-full font-sans font-medium text-xs py-2.5 rounded-lg transition-all shadow-sm ${
                      selectedOrderReturn
                        ? 'bg-stone-900 hover:bg-stone-800 text-stone-50 cursor-pointer'
                        : 'bg-stone-200 text-stone-400 cursor-not-allowed'
                    }`}
                  >
                    Generate Prepaid DHL Return Label & QR
                  </button>
                </form>

                <div className="bg-stone-100 rounded-xl p-4 text-xs text-stone-600 space-y-2 leading-relaxed">
                  <h4 className="font-sans font-bold text-stone-950 flex items-center gap-1.5">
                    <FileText className="h-4 w-4 text-stone-600" />
                    Transparent Return Guarantees
                  </h4>
                  <p>
                    All items must be in absolute un-worn pristine conditions with protective hanging sleeves fully attached. Your financial card will be fully refunded within 48 hours of warehouse scan verification in Porto.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
