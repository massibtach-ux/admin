import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Star,
  Check,
  Truck,
  RotateCcw,
  Sparkles,
  Maximize2,
  Bookmark,
  ChevronRight,
  Info,
  User,
  ExternalLink,
  ShoppingBag
} from 'lucide-react';
import { Product, Review } from '../types';
import { products, reviewsData } from '../data';

interface ProductDetailProps {
  product: Product;
  onClose: () => void;
  onAddToCart: (product: Product, size: string, color: { name: string; hex: string }) => void;
  onAddToWishlist: (product: Product) => void;
  onBuyNow: (product: Product, size: string, color: { name: string; hex: string }) => void;
}

export default function ProductDetail({
  product,
  onClose,
  onAddToCart,
  onAddToWishlist,
  onBuyNow,
  ...props
}: ProductDetailProps) {
  // Angle slider state
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [viewVideo, setViewVideo] = useState(false);

  // Zoom states
  const [zoomStyle, setZoomStyle] = useState({ display: 'none', backgroundPosition: '0% 0%' });

  // Customizer state
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes[0] || 'M');
  const [selectedColor, setSelectedColor] = useState<{ name: string; hex: string }>(product.colors[0]);

  // Review states
  const [localReviews, setLocalReviews] = useState<Review[]>(reviewsData);
  const [rating, setRating] = useState(5);
  const [reviewerName, setReviewerName] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [showReviewSuccess, setShowReviewSuccess] = useState(false);

  // Guide and Shipping tab toggles
  const [activeInfoTab, setActiveInfoTab] = useState<'details' | 'shipping' | 'returns'>('details');
  const [showSizeGuide, setShowSizeGuide] = useState(false);

  const handlePostReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewerName || !reviewComment) return;

    const newRev: Review = {
      id: `rev-${Date.now()}`,
      userName: reviewerName,
      rating,
      comment: reviewComment,
      date: 'Just now',
      verified: true,
      sizePurchased: selectedSize,
      colorPurchased: selectedColor.name
    };

    setLocalReviews([newRev, ...localReviews]);
    setReviewerName('');
    setReviewComment('');
    setRating(5);
    setShowReviewSuccess(true);
    setTimeout(() => {
      setShowReviewSuccess(false);
    }, 5000);
  };

  const currentSizeStock = product.stock[selectedSize] ?? 0;

  // Zoom handler
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomStyle({
      display: 'block',
      backgroundPosition: `${x}% ${y}%`
    });
  };

  const handleMouseLeave = () => {
    setZoomStyle({ display: 'none', backgroundPosition: '0% 0%' });
  };

  // Filter related items in local mock database
  const relatedItems = products
    .filter(p => p.id !== product.id && (p.category === product.category || p.type === product.type))
    .slice(0, 3);

  return (
    <motion.div
      id="product-detail-backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6"
    >
      <motion.div
        id="product-detail-modal"
        initial={{ opacity: 0, scale: 0.98, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.98, y: 15 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-6xl bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-2xl relative flex flex-col md:max-h-[90vh]"
      >
        {/* Sticky Header inside modal */}
        <div className="bg-stone-50 border-b border-stone-200 px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono tracking-widest text-stone-400 uppercase font-bold">ATELIER CATALOG</span>
            <ChevronRight className="h-3 w-3 text-stone-300" />
            <span className="text-xs font-sans font-semibold text-stone-700">{product.name}</span>
          </div>
          <button
            type="button"
            id="close-detail-modal-btn"
            onClick={onClose}
            className="text-stone-400 hover:text-stone-900 border border-stone-200 bg-white p-1.5 rounded-full transition-all cursor-pointer shadow-xs"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 lg:p-8 space-y-12">
          {/* Main Visual Customizer Grid */}
          <div id="visual-customizer-grid" className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-start">
            {/* Left Column: Visual Showcase (Images + Video loop selector) */}
            <div id="showcase-images-column" className="space-y-4 sticky md:top-0">
              <div
                id="main-image-viewport"
                className="relative bg-stone-100 aspect-[3/4] rounded-2xl overflow-hidden border border-stone-200 group cursor-zoom-in"
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
              >
                {!viewVideo ? (
                  <>
                    <img
                      src={product.images[activeImageIdx]}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-300"
                      referrerPolicy="no-referrer"
                    />
                    {/* Zoom preview lens */}
                    <div
                      id="zoom-lens-overlay"
                      className="absolute inset-0 pointer-events-none hidden group-hover:block border border-stone-300"
                      style={{
                        ...zoomStyle,
                        backgroundImage: `url(${product.images[activeImageIdx]})`,
                        backgroundSize: '200%',
                        backgroundRepeat: 'no-repeat'
                      }}
                    />
                    <div className="absolute bottom-4 left-4 right-4 bg-stone-900/60 backdrop-blur-xs text-center text-stone-50 text-[10px] py-1 rounded">
                      HOVER OVER CLOTH TO ZOOM CLOSE-UP Detail
                    </div>
                  </>
                ) : (
                  <div className="w-full h-full bg-stone-950 flex items-center justify-center relative">
                    {product.videoUrl ? (
                      <video
                        src={product.videoUrl}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="w-full h-full object-cover"
                      ></video>
                    ) : (
                      <p className="text-xs text-stone-500 font-mono">Video stream coming soon...</p>
                    )}
                    <div className="absolute top-4 left-4 bg-stone-900/85 text-stone-50 font-mono text-[9px] px-2.5 py-1 rounded font-bold uppercase">
                      Atelier Lifestyle Showcase
                    </div>
                  </div>
                )}
              </div>

              {/* Angle thumbnails + Video Tab */}
              <div id="visual-thumbnails-deck" className="flex items-center gap-3">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setActiveImageIdx(idx);
                      setViewVideo(false);
                    }}
                    className={`h-20 w-16 rounded-lg border-2 overflow-hidden bg-stone-50 transition-colors ${
                      activeImageIdx === idx && !viewVideo ? 'border-stone-900' : 'border-stone-200 hover:border-stone-400'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </button>
                ))}

                {product.videoUrl && (
                  <button
                    type="button"
                    onClick={() => setViewVideo(true)}
                    className={`h-20 w-16 rounded-lg border-2 flex flex-col items-center justify-center text-center p-1 bg-stone-900 text-stone-100 transition-colors ${
                      viewVideo ? 'border-white ring-2 ring-stone-900' : 'border-stone-200 hover:bg-stone-850'
                    }`}
                  >
                    <Star className="h-4 w-4 text-orange-400 shrink-0 mb-1 animate-bounce" />
                    <span className="text-[8px] font-mono uppercase font-bold tracking-tight">STREET VIDEO</span>
                  </button>
                )}
              </div>
            </div>

            {/* Right Column: Customizer purchase deck */}
            <div id="purchase-customizer-deck" className="space-y-6">
              {/* Product Info Block */}
              <div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mb-2.5">
                  <span className="text-xs font-mono tracking-wider bg-stone-100 text-stone-600 px-2.5 py-0.5 rounded-full font-bold">
                    {product.type} / {product.category}
                  </span>
                  <div className="flex items-center gap-1 text-amber-500 font-semibold text-xs">
                    <Star className="h-3 w-3 fill-amber-500" />
                    <span>{product.rating}</span>
                    <span className="text-stone-400 font-normal">({localReviews.length} reviews)</span>
                  </div>
                </div>

                <h1 className="text-3xl font-sans font-bold text-stone-900 tracking-tight">{product.name}</h1>

                <div className="mt-3 flex items-baseline gap-3">
                  <span className="text-2xl font-sans font-extrabold text-stone-900">${product.price}</span>
                  {product.originalPrice && (
                    <span className="text-sm font-sans text-stone-400 line-through font-medium">
                      ${product.originalPrice}
                    </span>
                  )}
                </div>
              </div>

              {/* Brief Description */}
              <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">{product.description}</p>

              {/* Customizer Section 1: Color Selectors */}
              <div id="color-selector" className="space-y-2.5">
                <span className="block text-[11px] font-mono text-stone-400 uppercase tracking-widest font-bold">
                  SELECT PATTERN: <span className="text-stone-900 font-bold">{selectedColor.name}</span>
                </span>
                <div className="flex items-center gap-3">
                  {product.colors.map((color, idx) => (
                    <button
                      key={idx}
                      type="button"
                      id={`color-option-${idx}`}
                      onClick={() => setSelectedColor(color)}
                      className={`h-8 w-8 rounded-full border-2 p-0.5 flex items-center justify-center transition-all ${
                        selectedColor.name === color.name ? 'border-stone-900 scale-105' : 'border-stone-200 hover:border-stone-400'
                      }`}
                      style={{ backgroundColor: color.hex }}
                      title={color.name}
                    >
                      {selectedColor.name === color.name && (
                        <div
                          className="h-2 w-2 rounded-full"
                          style={{ backgroundColor: color.hex === '#faf7f2' || color.hex === '#ede6da' ? '#000000' : '#ffffff' }}
                        />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Customizer Section 2: Size Selectors + Size recommendation meter */}
              <div id="size-selector" className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="block text-[11px] font-mono text-stone-400 uppercase tracking-widest font-bold">
                    SELECT SIZE INDICATOR: <span className="text-stone-900 font-bold">{selectedSize}</span>
                  </span>
                  <button
                    type="button"
                    id="trigger-size-guide-modal"
                    onClick={() => setShowSizeGuide(!showSizeGuide)}
                    className="text-stone-500 hover:text-stone-900 underline font-mono text-[10px]"
                  >
                    Size Guide (Inches)
                  </button>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {product.sizes.map((sz, idx) => {
                    const sizeStock = product.stock[sz] ?? 0;
                    const isOutOfStock = sizeStock === 0;
                    return (
                      <button
                        key={idx}
                        type="button"
                        id={`size-choice-${sz}`}
                        disabled={isOutOfStock}
                        onClick={() => setSelectedSize(sz)}
                        className={`h-11 min-w-[50px] border px-4 font-mono text-xs font-bold transition-all ${
                          isOutOfStock
                            ? 'bg-stone-50 border-stone-200 text-stone-300 line-through cursor-not-allowed'
                            : selectedSize === sz
                            ? 'bg-stone-900 border-stone-900 text-stone-50 font-bold shadow-sm scale-102'
                            : 'bg-white border-stone-200 text-stone-800 hover:border-stone-400'
                        }`}
                      >
                        {sz}
                      </button>
                    );
                  })}
                </div>

                {/* Sizing description recommendation meter */}
                <div className="p-3 border border-stone-100 rounded-lg bg-stone-50 flex items-center justify-between gap-4 text-xs text-stone-500">
                  <span className="font-sans font-bold text-stone-900">Recommended Fit:</span>
                  <div className="flex items-center gap-1 bg-stone-900 text-stone-100 text-[9px] font-bold font-mono px-2 py-0.5 rounded">
                    OVERSIZED
                  </div>
                  <span className="text-stone-400 text-[10px] font-mono">STOUT SHELL CUT</span>
                </div>
              </div>

              {/* Dynamic size-dependent Stock Indicators */}
              <div id="stock-warning">
                {currentSizeStock === 0 ? (
                  <p className="text-xs text-red-500 font-mono font-bold flex items-center gap-1.5 leading-none">
                    <span className="h-2.5 w-2.5 rounded-full bg-red-500"></span>
                    Size {selectedSize} is OUT OF STOCK. Restocking soon!
                  </p>
                ) : currentSizeStock <= 4 ? (
                  <p className="text-xs text-orange-600 font-mono font-bold flex items-center gap-1.5 leading-none animate-pulse">
                    <span className="h-2.5 w-2.5 rounded-full bg-orange-500"></span>
                    Only {currentSizeStock} left in Size {selectedSize}! Order before lookbook sells out.
                  </p>
                ) : (
                  <p className="text-xs text-green-700 font-mono font-medium flex items-center gap-1.5 leading-none">
                    <span className="h-2.5 w-2.5 rounded-full bg-green-500"></span>
                    Size {selectedSize} is active & in stock (Portugal warehouse)
                  </p>
                )}
              </div>

              {/* Action Buttons: Add to Cart & Buy Now */}
              <div id="checkout-actions-deck" className="space-y-3 pt-3">
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    id="add-to-cart-btn"
                    disabled={currentSizeStock === 0}
                    onClick={() => onAddToCart(product, selectedSize, selectedColor)}
                    className="w-full bg-white hover:bg-stone-50 text-stone-900 border-2 border-stone-900 font-sans font-bold text-xs sm:text-sm py-4 rounded-xl transition-all shadow-sm shrink-0 cursor-pointer disabled:bg-stone-50 disabled:text-stone-300 disabled:border-stone-200"
                  >
                    Add To Cart Drawer
                  </button>

                  <button
                    type="button"
                    id="buy-now-btn"
                    disabled={currentSizeStock === 0}
                    onClick={() => onBuyNow(product, selectedSize, selectedColor)}
                    className="w-full bg-stone-900 hover:bg-stone-800 text-stone-50 font-sans font-bold text-xs sm:text-sm py-4 rounded-xl transition-all shadow-md cursor-pointer disabled:bg-stone-100 disabled:text-stone-400 disabled:cursor-not-allowed"
                  >
                    Instant Buy Now
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    id="save-to-wishlist"
                    onClick={() => {
                      onAddToWishlist(product);
                      alert(`[Wishlist] Saved "${product.name}" to your lookbook collection!`);
                    }}
                    className="w-full border border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-700 text-xs py-2.5 rounded-lg flex items-center justify-center gap-1 font-sans font-medium transition-colors cursor-pointer"
                  >
                    <Bookmark className="h-3.5 w-3.5" />
                    Save To Wishlist
                  </button>
                  <div className="text-center font-mono text-[9px] text-stone-400 flex items-center justify-center leading-tight">
                    GET 10% BACK IN LOYALTY POINTS
                  </div>
                </div>
              </div>

              {/* Accordion Info tabs (Materials, Shipping, Returns) */}
              <div id="accordion-tabs" className="border-t border-stone-200 pt-6 space-y-4">
                <div className="flex border-b border-stone-250 text-xs">
                  <button
                    type="button"
                    onClick={() => setActiveInfoTab('details')}
                    className={`py-2 px-3 border-b-2 font-mono uppercase font-bold tracking-tight ${
                      activeInfoTab === 'details' ? 'border-stone-900 text-stone-900' : 'border-transparent text-stone-400'
                    }`}
                  >
                    Materials
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveInfoTab('shipping')}
                    className={`py-2 px-3 border-b-2 font-mono uppercase font-bold tracking-tight ${
                      activeInfoTab === 'shipping' ? 'border-stone-900 text-stone-900' : 'border-transparent text-stone-400'
                    }`}
                  >
                    Shipping Policy
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveInfoTab('returns')}
                    className={`py-2 px-3 border-b-2 font-mono uppercase font-bold tracking-tight ${
                      activeInfoTab === 'returns' ? 'border-stone-900 text-stone-900' : 'border-transparent text-stone-400'
                    }`}
                  >
                    Returns Guide
                  </button>
                </div>

                <div className="text-xs text-stone-600 leading-relaxed min-h-[60px]">
                  {activeInfoTab === 'details' && (
                    <div className="space-y-2">
                      <p><strong>Fabric detail:</strong> {product.material}</p>
                      <p><strong>Ethical manufacturing:</strong> {product.sustainability}</p>
                      <p><strong>Care guide:</strong> Wash separately on delicate cold water. Dry flat to preserve weight fibers.</p>
                    </div>
                  )}

                  {activeInfoTab === 'shipping' && (
                    <div className="space-y-1.5">
                      <p>• Expedited worldwide cargo tracking dispatched via DHL Express.</p>
                      <p>• Complimentary postage boundaries applied on checkout values larger than $150.</p>
                      <p>• Custom duty offsets covered completely inside local checkout tariffs.</p>
                    </div>
                  )}

                  {activeInfoTab === 'returns' && (
                    <div className="space-y-1.5">
                      <p>• Hassle-free return window: 30 days post delivery scan.</p>
                      <p>• Prepaid shipping QR labels downloaded directly in the Member Account order history sheet.</p>
                      <p>• Original secure labels and eco hanging wrap must be fully active on fabric core.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Size Guide Modal (Collapsible inset) */}
          <AnimatePresence>
            {showSizeGuide && (
              <motion.div
                id="size-guide-modal"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="border border-stone-200 bg-stone-50 rounded-xl p-5 overflow-hidden text-xs"
              >
                <div className="flex items-center justify-between mb-3.5">
                  <h4 className="font-sans font-bold text-stone-900 uppercase tracking-tight text-sm">Measurement Matrix & Dimensions</h4>
                  <button type="button" onClick={() => setShowSizeGuide(false)} className="text-stone-400 hover:text-stone-900">
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
                <table className="w-full text-left border-collapse font-mono text-[11px]">
                  <thead>
                    <tr className="border-b border-stone-200 text-stone-400">
                      <th className="py-2">SIZE</th>
                      <th className="py-2">CHEST BRACKET (IN)</th>
                      <th className="py-2">BODY LENGTH (IN)</th>
                      <th className="py-2">SLEEVE ARC (IN)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-150 text-stone-700">
                    <tr>
                      <td className="py-2 font-bold text-stone-950">S</td>
                      <td className="py-2">38 - 40</td>
                      <td className="py-2">26.0</td>
                      <td className="py-2">23.5</td>
                    </tr>
                    <tr className="bg-stone-100">
                      <td className="py-2 font-bold text-stone-950">M</td>
                      <td className="py-2">41 - 43</td>
                      <td className="py-2">27.0</td>
                      <td className="py-2">24.5</td>
                    </tr>
                    <tr>
                      <td className="py-2 font-bold text-stone-950">L</td>
                      <td className="py-2">44 - 46</td>
                      <td className="py-2">28.0</td>
                      <td className="py-2">25.5</td>
                    </tr>
                    <tr className="bg-stone-100">
                      <td className="py-2 font-bold text-stone-950">XL</td>
                      <td className="py-2">47 - 49</td>
                      <td className="py-2">29.0</td>
                      <td className="py-2">26.5</td>
                    </tr>
                    <tr>
                      <td className="py-2 font-bold text-stone-950">XXL</td>
                      <td className="py-2">50 - 52</td>
                      <td className="py-2">30.0</td>
                      <td className="py-2">27.5</td>
                    </tr>
                  </tbody>
                </table>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Related Products Carousel */}
          <div id="related-products" className="border-t border-stone-200 pt-10">
            <h3 className="text-base font-mono uppercase tracking-widest text-stone-400 mb-6 font-bold">Related Style Companions</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {relatedItems.map((item) => (
                <div
                  key={item.id}
                  id={`related-card-${item.id}`}
                  className="group cursor-pointer border border-stone-100 p-3 rounded-xl bg-stone-50 hover:bg-white hover:border-stone-200 shadow-xs transition-all flex gap-3 h-28 items-center"
                  onClick={() => {
                    // Quick modal swap! Beautiful!
                    // Reset modal state for the next item
                    setActiveImageIdx(0);
                    setViewVideo(false);
                    setSelectedSize(item.sizes[0] || 'M');
                    setSelectedColor(item.colors[0]);
                    // Update pointer references
                    Object.assign(product, item);
                    setLocalReviews(reviewsData);
                  }}
                >
                  <img src={item.images[0]} alt="" className="h-20 w-15 object-cover rounded-lg border border-stone-200" referrerPolicy="no-referrer" />
                  <div className="min-w-0">
                    <h4 className="font-sans font-bold text-stone-900 text-xs truncate group-hover:underline">{item.name}</h4>
                    <p className="font-sans text-stone-9s0 text-xs font-bold mt-1">${item.price}</p>
                    <span className="text-[9px] font-mono text-stone-400 block mt-1 uppercase font-bold">{item.category} / {item.type}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Customer Reviews Deck (Sitemap Section 2 requirement) */}
          <div id="customer-reviews-section" className="border-t border-stone-200 pt-10">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Reviews Summary Column */}
              <div className="lg:col-span-1 space-y-4">
                <span className="block text-[10px] font-mono text-stone-400 uppercase tracking-widest font-bold">COMMUNITY OPINION</span>
                <h3 className="text-2xl font-sans font-bold text-stone-900 tracking-tight">Atelier Collective Feedback</h3>

                <div className="flex items-center gap-2">
                  <div className="flex items-center text-amber-500 text-sm">
                    {[1, 2, 3, 4, 5].map(n => (
                      <Star key={n} className={`h-4 w-4 ${n <= Math.round(product.rating) ? 'fill-amber-500' : 'text-stone-200'}`} />
                    ))}
                  </div>
                  <span className="text-stone-950 font-bold text-sm">{product.rating} Weighted Average</span>
                </div>
                <p className="text-xs text-stone-500 leading-relaxed">
                  Collected reviews are verified using cryptographic parcel data to confirm actual Portuguese factory shipments before tracking submissions.
                </p>

                {/* Submit New Review Form */}
                <form onSubmit={handlePostReview} className="border border-stone-200 bg-stone-50 rounded-xl p-4 space-y-3.5">
                  <h4 className="text-xs font-mono font-bold uppercase text-stone-850">Submit Verification Review</h4>

                  <div>
                    <label className="block text-[9px] font-mono text-stone-400 uppercase mb-0.5">Rating stars</label>
                    <div className="flex gap-1.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          className={`text-sm shrink-0 ${rating >= star ? 'text-amber-500' : 'text-stone-200'}`}
                        >
                          ★
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[9px] font-mono text-stone-400 uppercase mb-1">Your Tag/Handle</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Zack V."
                      value={reviewerName}
                      onChange={(e) => setReviewerName(e.target.value)}
                      className="w-full text-xs font-sans text-stone-900 border border-stone-200 bg-white focus:outline-none rounded p-2"
                    />
                  </div>

                  <div>
                    <label className="block text-[9px] font-mono text-stone-400 uppercase mb-1">Feedback review</label>
                    <textarea
                      required
                      rows={3}
                      placeholder="Share details of the drape, seam patterns, or enzyme fabric..."
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      className="w-full text-xs font-sans text-stone-950 border border-stone-200 bg-white focus:outline-none rounded p-2 resize-none"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    id="submit-review-deck-btn"
                    className="w-full bg-stone-900 hover:bg-stone-800 text-stone-50 text-[10px] font-mono uppercase font-bold py-2 rounded shadow-xs"
                  >
                    Post Certified Feedback
                  </button>
                </form>

                {showReviewSuccess && (
                  <div className="p-3 bg-green-50 border border-green-150 rounded text-green-800 text-[11px]">
                    <strong>Feedback cataloged!</strong> Thank you for validating Portuguese manufacturing standards.
                  </div>
                )}
              </div>

              {/* Reviews Feed Column */}
              <div className="lg:col-span-2 space-y-4">
                {localReviews.map((rev) => (
                  <div
                    key={rev.id}
                    id={`review-message-${rev.id}`}
                    className="border border-stone-150 p-5 rounded-xl bg-white space-y-2 relative"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-sans font-bold text-stone-900 text-sm">{rev.userName}</span>
                        {rev.verified && (
                          <span className="text-[9px] font-mono bg-green-50 text-green-700 px-2 py-0.5 rounded font-bold border border-green-150 flex items-center gap-0.5">
                            <Check className="h-2 w-2" />
                            VERIFIED COURIER
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] font-mono text-stone-400">{rev.date}</span>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-amber-500">
                      {[1, 2, 3, 4, 5].map(n => (
                        <span key={n}>
                          {n <= rev.rating ? '★' : '☆'}
                        </span>
                      ))}
                    </div>

                    <p className="text-xs text-stone-600 leading-relaxed font-sans">{rev.comment}</p>

                    <div className="flex gap-4 text-[10px] text-stone-400 font-mono pt-1">
                      <span>SIZE PURCHASED: <strong className="text-stone-700">{rev.sizePurchased}</strong></span>
                      <span>PATTERN: <strong className="text-stone-700">{rev.colorPurchased}</strong></span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
