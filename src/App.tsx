import { useState, useMemo, useEffect, FormEvent, MouseEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  ShoppingCart,
  Star,
  X,
  Plus,
  Minus,
  Check,
  Menu,
  Eye,
  Sparkles,
  Send,
  MapPin,
  Phone,
  Mail,
  Instagram,
  Twitter,
  Facebook,
  ArrowUpRight,
  User,
  ShoppingBag,
  Info,
  SlidersHorizontal,
  Lock,
  ChevronDown
} from 'lucide-react';
import { Product, CartItem, CategoryFilter, UserState } from './types';

// Import image assets
import HERO_IMAGE from './assets/images/hero_sneaker_1779458274854.png';
import SNEAKER_POP_1 from './assets/images/sneaker_popular_1_1779458300649.png';
import SNEAKER_POP_2 from './assets/images/sneaker_popular_2_1779458325115.png';
import SNEAKER_POP_3 from './assets/images/sneaker_popular_3_1779458353109.png';

const PRODUCTS: Product[] = [
  {
    id: "snk-01",
    name: "STRATTLES SNEAARS",
    price: 300.00,
    originalPrice: 350.00,
    description: "Engineered for maximum energetic rebound and extreme street aesthetic. Built with hyper-breathable engineered knit upper and our proprietary double-density shock absorption vulcanized sole. The raw energetic Volt Yellow laces set a bold streetwear trend.",
    image: SNEAKER_POP_1,
    rating: 4.9,
    reviewCount: 124,
    sizes: [7, 8, 9, 10, 11, 12],
    category: "Streetwear",
    colors: ["#111827", "#CCFF00", "#9CA3AF"]
  },
  {
    id: "snk-02",
    name: "STRATSTER + MAGANAL",
    price: 260.00,
    originalPrice: 310.00,
    description: "An explosive performance running shoe crafted using premium lightweight ripstop mesh, integrated sock collar, and strategic carbon-fiber sprint plates. High-contrast Neon layout lets you dominate both low-light running tracks and daytime concrete blocks.",
    image: SNEAKER_POP_2,
    rating: 4.8,
    reviewCount: 98,
    sizes: [8, 9, 10, 11],
    category: "Running",
    colors: ["#CCFF00", "#111827", "#3B82F6"]
  },
  {
    id: "snk-03",
    name: "FREETTLEY SNEAKER",
    price: 305.00,
    originalPrice: 380.00,
    description: "Sleek tactical stealth design meets raw energetic volt green interior spikes. Tailored from high-resistance TPU polymers and specialized high-traction rubber outsoles. Delivers supreme lock-down stability for intensive lateral movement training.",
    image: SNEAKER_POP_3,
    rating: 5.0,
    reviewCount: 162,
    sizes: [7, 8, 9, 10, 11, 12],
    category: "Training",
    colors: ["#111827", "#D1D5DB", "#CCFF00"]
  },
  {
    id: "snk-04",
    name: "SNEAKY ZOOM AIR",
    price: 280.00,
    originalPrice: 320.00,
    description: "The street flagship sneaker combining a vintage sportswear frame with highly advanced responsive cushioning. Styled with signature volt-green elements on a premium sandstone grey body. Perfect for 24/7 all-day comfort.",
    image: SNEAKER_POP_1,
    rating: 4.7,
    reviewCount: 84,
    sizes: [8, 9, 10, 11],
    category: "Streetwear",
    colors: ["#6B7280", "#CCFF00", "#FFFFFF"]
  },
  {
    id: "snk-05",
    name: "VIBE FORCE ONE",
    price: 320.00,
    originalPrice: 360.00,
    description: "Designed strictly for those who want their footwear to make a roaring statement. A high-top mesh and composite leather masterpiece drenched in electric volt yellow, offering unrivaled breathability and anatomical heel cushioning.",
    image: SNEAKER_POP_2,
    rating: 4.9,
    reviewCount: 205,
    sizes: [7, 8, 9, 10, 11, 12],
    category: "Training",
    colors: ["#CCFF00", "#1E3A8A", "#111827"]
  },
  {
    id: "snk-06",
    name: "HYPER STRIKE RUNNER",
    price: 290.00,
    originalPrice: 340.00,
    description: "Fusing aerodynamic engineering and minimalist profile aesthetics. Employs laser-cut ventilation ports throughout the sneaker and a hyper-resilient foam crash pad to transform impact force into powerful forward speed.",
    image: SNEAKER_POP_3,
    rating: 4.9,
    reviewCount: 110,
    sizes: [8, 9, 10, 11, 12],
    category: "Running",
    colors: ["#111827", "#F3F4F6", "#10B981"]
  }
];

export default function App() {
  // Navigation & Cart States
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('all');
  
  // Interactive Modals
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  
  // Interactive Customizer states for Quick View Modal
  const [selectedSizeInModal, setSelectedSizeInModal] = useState<number | null>(null);
  const [selectedColorInModal, setSelectedColorInModal] = useState<string | null>(null);
  
  // Account/User Simulation
  const [user, setUser] = useState<UserState>({ isAuthenticated: false, email: null });
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  
  // Tech Hotspot Explainer States 
  const [activeHotspot, setActiveHotspot] = useState<string | null>('sole');

  // Newsletter Email
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  // Dynamic Toast Alerts
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  // Auto-dismiss toast
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ message, type });
  };

  // Live filtered products
  const filteredProducts = useMemo(() => {
    if (activeCategory === 'all') return PRODUCTS;
    return PRODUCTS.filter(p => p.category === activeCategory);
  }, [activeCategory]);

  // Live search recommendations
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return PRODUCTS.filter(p => 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      p.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  // Calculation for Cart Totals
  const cartSubtotal = useMemo(() => {
    return cart.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  }, [cart]);

  const cartTotalItems = useMemo(() => {
    return cart.reduce((acc, item) => acc + item.quantity, 0);
  }, [cart]);

  // Handle Quick View Open 
  const handleOpenQuickView = (product: Product) => {
    setSelectedProduct(product);
    setSelectedSizeInModal(product.sizes[1] || product.sizes[0]);
    setSelectedColorInModal(product.colors[0]);
  };

  // Handle Add To Cart 
  const handleAddToCart = (product: Product, size: number, color: string, quantity: number = 1) => {
    setCart(prevCart => {
      // Check if exact shoe representation (id + size + color) already exists in cart
      const existingIndex = prevCart.findIndex(
        item => item.product.id === product.id && 
                item.selectedSize === size && 
                item.selectedColor === color
      );

      if (existingIndex > -1) {
        const updated = [...prevCart];
        updated[existingIndex].quantity += quantity;
        return updated;
      } else {
        return [...prevCart, { product, selectedSize: size, selectedColor: color, quantity }];
      }
    });

    showToast(`Added ${product.name} (Size US ${size}) to Cart!`, 'success');
  };

  // Modify Cart quantities
  const handleUpdateCartQuantity = (index: number, delta: number) => {
    setCart(prevCart => {
      const updated = [...prevCart];
      const newQuantity = updated[index].quantity + delta;
      if (newQuantity <= 0) {
        const removedName = updated[index].product.name;
        updated.splice(index, 1);
        showToast(`Removed ${removedName} from your cart.`, 'info');
      } else {
        updated[index].quantity = newQuantity;
      }
      return updated;
    });
  };

  // Handle smooth scroll navigation
  const handleScrollTo = (e: MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);

    if (targetId === '#') {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
      return;
    }

    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
      });
    }
  };

  // simulated OAuth or credentials Login
  const handleAuthSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!authEmail.trim() || !authPassword.trim()) {
      showToast("Please fill in all database credential entries.", "error");
      return;
    }
    
    if (authMode === 'login') {
      setUser({ isAuthenticated: true, email: authEmail });
      showToast(`Welcome back, ${authEmail}!`, 'success');
    } else {
      setUser({ isAuthenticated: true, email: authEmail });
      showToast(`Account successfully established for ${authEmail}! Welcome to Sneaky.`, 'success');
    }
    setAuthOpen(false);
    setAuthEmail('');
    setAuthPassword('');
  };

  const handleLogout = () => {
    setUser({ isAuthenticated: false, email: null });
    showToast("Successfully signed out.", "info");
  };

  // Newsletter Submit 
  const handleNewsletterSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;
    setNewsletterSubscribed(true);
    showToast("Access granted! Check your inbox for your 15% discount code: SNEAKY15", "success");
    setNewsletterEmail('');
  };

  // Simulate instant Checkout
  const handleCheckoutSimulate = () => {
    if (cart.length === 0) {
      showToast("Your shopping cart is currently empty.", 'error');
      return;
    }
    showToast("Processing secure sandbox transfer... Complete! Thank you for choosing Sneaky.", 'success');
    setCart([]);
    setCartOpen(false);
  };

  return (
    <div className="min-h-screen bg-brand-bg text-brand-charcoal font-sans antialiased selection:bg-brand-volt selection:text-brand-charcoal transition-colors duration-300">
      
      {/* BACKGROUND GRAPHIC GLOWS */}
      <div className="absolute top-0 right-0 w-[40vw] h-[40vw] bg-brand-volt/10 rounded-full blur-[150px] -z-10 pointer-events-none animate-pulse-subtle" />
      <div className="absolute top-[80vh] left-0 w-[30vw] h-[30vw] bg-brand-lime/10 rounded-full blur-[120px] -z-10 pointer-events-none" />
      <div className="absolute bottom-0 right-10 w-[50vw] h-[50vw] bg-brand-volt/5 rounded-full blur-[200px] -z-10 pointer-events-none animate-pulse-subtle" />

      {/* -------------------- DYNAMIC TOAST NOTIFICATION -------------------- */}
      <AnimatePresence>
        {toast && (
          <motion.div 
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            id="global-toast"
            className="fixed top-5 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-6 py-4 rounded-xl shadow-2xl glass-dark-effect text-white min-w-[320px] max-w-[90vw] justify-between border-l-4 border-l-brand-volt"
          >
            <div className="flex items-center gap-3">
              <span className="p-1 rounded-lg bg-brand-volt/20 text-brand-volt">
                <Sparkles size={18} />
              </span>
              <p className="text-sm font-medium tracking-wide font-display">{toast.message}</p>
            </div>
            <button 
              id="close-toast-btn"
              onClick={() => setToast(null)} 
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X size={16} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* -------------------- NAVIGATION BAR -------------------- */}
      <nav id="navbar-sneaky" className="sticky top-0 z-40 w-full bg-brand-bg/85 backdrop-blur-md border-b border-brand-charcoal/5 px-4 sm:px-8 py-4 transition-all duration-300">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* LOGO */}
          <div className="flex items-center gap-3">
            <a href="#" onClick={(e) => handleScrollTo(e, '#')} className="flex items-center gap-2 group">
              <div className="w-10 h-10 bg-brand-charcoal rounded-xl flex items-center justify-center relative overflow-hidden transition-transform duration-300 group-hover:scale-110">
                <div className="absolute inset-0 bg-brand-volt opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="font-display font-black text-2xl text-brand-volt group-hover:text-brand-charcoal relative z-10 transition-colors duration-300">S</span>
              </div>
              <span className="font-display font-extrabold text-2xl tracking-tighter -skew-x-6 text-brand-charcoal">
                SNEAKY
              </span>
            </a>
          </div>

          {/* DESKTOP NAV LINKS */}
          <div className="hidden md:flex items-center gap-8 font-display text-sm font-semibold tracking-wide uppercase text-brand-charcoal">
            <a href="#" onClick={(e) => handleScrollTo(e, '#')} className="hover:text-brand-lime transition-all duration-200">Home</a>
            <a href="#about-section" onClick={(e) => handleScrollTo(e, 'about-section')} className="hover:text-brand-lime transition-all duration-200">About us</a>
            <a href="#popular-section" onClick={(e) => handleScrollTo(e, 'popular-section')} className="hover:text-brand-lime transition-all duration-200 flex items-center gap-0.5">
              Shop <ChevronDown size={14} className="text-brand-charcoal/50" />
            </a>
            <a href="#tech-section" onClick={(e) => handleScrollTo(e, 'tech-section')} className="hover:text-brand-lime transition-all duration-200">Page</a>
            <a href="#footer-section" onClick={(e) => handleScrollTo(e, 'footer-section')} className="hover:text-brand-lime transition-all duration-200">Contact</a>
          </div>

          {/* RIGHT UTILITIES */}
          <div className="flex items-center gap-3 sm:gap-4">
            
            {/* Search Trigger */}
            <button 
              id="search-trigger-btn"
              onClick={() => setSearchOpen(true)}
              className="p-2 text-brand-charcoal/80 hover:text-brand-charcoal hover:bg-brand-charcoal/5 rounded-full transition-all"
              aria-label="Search items"
            >
              <Search size={22} />
            </button>

            {/* Shopping Cart Trigger */}
            <button 
              id="cart-trigger-btn"
              onClick={() => setCartOpen(true)}
              className="p-2 text-brand-charcoal/80 hover:text-brand-charcoal hover:bg-brand-charcoal/5 rounded-full relative transition-all"
              aria-label="Open Cart"
            >
              <ShoppingCart size={22} />
              {cartTotalItems > 0 && (
                <span className="absolute top-0 right-0 w-5 h-5 bg-brand-charcoal text-white border-2 border-brand-bg text-[10px] font-bold rounded-full flex items-center justify-center animate-bounce">
                  {cartTotalItems}
                </span>
              )}
            </button>

            {/* Sign in/up actions */}
            {user.isAuthenticated ? (
              <div className="hidden sm:flex items-center gap-3">
                <span className="text-xs font-mono font-medium max-w-[120px] truncate block text-brand-charcoal/70">
                  {user.email}
                </span>
                <button 
                  id="sign-out-btn"
                  onClick={handleLogout}
                  className="px-4 py-2 font-display text-xs font-bold uppercase tracking-wider text-brand-charcoal border border-brand-charcoal/20 rounded-full hover:bg-brand-charcoal hover:text-white transition-all transform hover:scale-105"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <button 
                  id="sign-up-trigger-btn"
                  onClick={() => { setAuthMode('register'); setAuthOpen(true); }}
                  className="px-4 py-2 font-display text-xs font-bold uppercase text-brand-charcoal hover:text-brand-lime transition-colors"
                >
                  Sign up
                </button>
                <button 
                  id="sign-in-trigger-btn"
                  onClick={() => { setAuthMode('login'); setAuthOpen(true); }}
                  className="px-5 py-2.5 font-display text-xs font-bold uppercase bg-brand-charcoal text-white rounded-full hover:bg-brand-charcoal/90 transition-all transform hover:scale-105 shadow-md shadow-brand-charcoal/20"
                >
                  Sign in
                </button>
              </div>
            )}

            {/* Mobile Hamburger */}
            <button 
              id="mobile-menu-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 md:hidden text-brand-charcoal/80 hover:text-brand-charcoal rounded-lg transition-colors"
              aria-label="Toggle mobile menu"
            >
              <Menu size={24} />
            </button>

          </div>
        </div>

        {/* MOBILE NAVIGATION DRAWER */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden overflow-hidden bg-brand-bg border-t border-brand-charcoal/5 mt-4"
            >
              <div className="flex flex-col gap-4 py-4 px-2 font-display uppercase tracking-wide text-sm font-extrabold text-brand-charcoal">
                <a href="#" onClick={(e) => handleScrollTo(e, '#')} className="py-2 hover:text-brand-lime border-b border-brand-charcoal/5">Home</a>
                <a href="#about-section" onClick={(e) => handleScrollTo(e, 'about-section')} className="py-2 hover:text-brand-lime border-b border-brand-charcoal/5">About us</a>
                <a href="#popular-section" onClick={(e) => handleScrollTo(e, 'popular-section')} className="py-2 hover:text-brand-lime border-b border-brand-charcoal/5">Shop</a>
                <a href="#tech-section" onClick={(e) => handleScrollTo(e, 'tech-section')} className="py-2 hover:text-brand-lime border-b border-brand-charcoal/5">Page</a>
                <a href="#footer-section" onClick={(e) => handleScrollTo(e, 'footer-section')} className="py-2 hover:text-brand-lime border-b border-brand-charcoal/5">Contact</a>
                
                {/* Mobile Auth options */}
                <div className="pt-4 flex flex-col gap-3">
                  {user.isAuthenticated ? (
                    <div className="flex flex-col gap-2">
                      <span className="text-xs font-mono lowercase truncate p-2 bg-brand-charcoal/5 rounded">
                        Logged as: {user.email}
                      </span>
                      <button 
                        id="mobile-sign-out-btn"
                        onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                        className="py-3 text-center rounded-xl border border-brand-charcoal/20 font-bold uppercase transition-colors"
                      >
                        Sign Out
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2">
                      <button 
                        id="mobile-sign-up-btn"
                        onClick={() => { setAuthMode('register'); setAuthOpen(true); setMobileMenuOpen(false); }}
                        className="py-3 text-center rounded-xl bg-brand-charcoal/5 font-bold uppercase transition-colors text-brand-charcoal"
                      >
                        Sign up
                      </button>
                      <button 
                        id="mobile-sign-in-btn"
                        onClick={() => { setAuthMode('login'); setAuthOpen(true); setMobileMenuOpen(false); }}
                        className="py-3 text-center rounded-xl bg-brand-charcoal text-white hover:bg-brand-charcoal/90 font-bold uppercase transition-all"
                      >
                        Sign in
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* -------------------- HERO SECTION -------------------- */}
      <header id="hero-section" className="relative overflow-hidden pt-4 pb-16 md:py-24 px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* LEFT CONTENT COLUMN (6 cols) */}
          <div className="lg:col-span-7 flex flex-col gap-6 z-10">
            
            {/* Minimalist Sub-badge */}
            <div className="inline-flex self-start items-center gap-2 px-3 py-1.5 bg-brand-charcoal text-brand-volt rounded-full border border-brand-volt/10 transition-transform duration-300 hover:scale-105">
              <span className="w-2 h-2 rounded-full bg-brand-volt animate-ping" />
              <span className="font-mono text-xs font-bold tracking-widest uppercase">
                WEAR WHAT FITS YOUR VIBE
              </span>
            </div>

            {/* Large Bold Skewed Title */}
            <div className="flex flex-col">
              <h1 className="font-display font-black text-5xl sm:text-7xl md:text-8xl leading-[0.9] text-brand-charcoal uppercase tracking-tighter select-none relative">
                <span className="block italic -skew-x-6 hover:text-brand-lime transition-all duration-300">FROM STREET</span>
                <span className="block text-stroke-neon italic -skew-x-6 text-transparent hover:translate-x-3 transition-transform duration-300">
                  TO SPORT
                </span>
              </h1>
            </div>

            {/* Description Paragraph */}
            <p className="text-brand-text-muted text-base sm:text-lg max-w-xl font-medium leading-relaxed">
              Express your unique motion. Sneaky combines raw streetwear designs with Olympic-level carbon speedtech to amplify your confidence on every single concrete step.
            </p>

            {/* Dual Actions CTA */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button 
                id="hero-shop-now-btn"
                onClick={() => {
                  const element = document.getElementById('popular-section');
                  element?.scrollIntoView({ behavior: 'smooth' });
                  showToast("Welcome to sneaker-grid! Hover on shoes to see detail quick-views.", "info");
                }}
                className="group flex items-center gap-2.5 px-7 py-4 bg-brand-volt text-brand-charcoal uppercase font-display font-extrabold text-sm tracking-wider rounded-full hover:bg-brand-volt-hover transition-all duration-300 transform hover:scale-[1.03] shadow-lg shadow-brand-volt/20 hover:shadow-brand-volt/40"
              >
                <ShoppingCart size={18} className="transition-transform group-hover:rotate-12" />
                <span>Shop Now</span>
              </button>
              
              <button 
                id="hero-our-details-btn"
                onClick={() => {
                  const element = document.getElementById('tech-section');
                  element?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="flex items-center gap-2 px-7 py-4 bg-brand-charcoal text-white hover:text-brand-volt uppercase font-display font-extrabold text-sm tracking-wider rounded-full hover:bg-brand-charcoal/90 transition-all duration-300 transform hover:scale-[1.03]"
              >
                <span>Our Details</span>
                <span className="p-0.5 rounded-full bg-white/10 text-white">
                  <ArrowUpRight size={14} />
                </span>
              </button>
            </div>

            {/* Minimalist Data Stats */}
            <div className="grid grid-cols-3 gap-6 sm:gap-8 border-t border-brand-charcoal/10 pt-8 mt-4">
              <div className="flex flex-col gap-1 transition-transform hover:-translate-y-1">
                <span className="font-display font-black text-3xl sm:text-4xl text-brand-charcoal tracking-tight">12K+</span>
                <span className="font-mono text-[10px] sm:text-xs text-brand-text-muted uppercase tracking-wider font-semibold">Products Sold</span>
              </div>
              <div className="flex flex-col gap-1 transition-transform hover:-translate-y-1">
                <span className="font-display font-black text-3xl sm:text-4xl text-brand-charcoal tracking-tight">213+</span>
                <span className="font-mono text-[10px] sm:text-xs text-brand-text-muted uppercase tracking-wider font-semibold">Brands Available</span>
              </div>
              <div className="flex flex-col gap-1 transition-transform hover:-translate-y-1">
                <span className="font-display font-black text-3xl sm:text-4xl text-brand-charcoal tracking-tight">8.5K+</span>
                <span className="font-mono text-[10px] sm:text-xs text-brand-text-muted uppercase tracking-wider font-semibold">Happy Customers</span>
              </div>
            </div>

          </div>

          {/* RIGHT VISUAL CENTERPIECE (5 cols) */}
          <div className="lg:col-span-5 relative flex items-center justify-center min-h-[420px] md:min-h-[500px]">
            
            {/* Spinning background badge or glow circle */}
            <div className="absolute w-[300px] h-[300px] sm:w-[380px] sm:h-[380px] rounded-full border-4 border-dashed border-brand-charcoal/5 animate-slow-spin z-0 pointer-events-none" />
            <div className="absolute w-[240px] h-[240px] sm:w-[300px] sm:h-[300px] rounded-full bg-gradient-to-tr from-brand-volt/40 to-brand-lime/10 blur-xl z-0 pointer-events-none" />
            
            {/* MAIN FLOATING SHOE IMAGE */}
            <div className="relative w-full max-w-[380px] sm:max-w-md z-10 transition-transform duration-500">
              <img 
                src={HERO_IMAGE} 
                alt="Sneaky Elite Flagship Floating" 
                referrerPolicy="no-referrer"
                className="w-full object-contain glow-volt animate-float-sneaker select-none drop-shadow-2xl inline-block"
              />
            </div>

            {/* OVERLAPPING FLOATING CARD 1: 5-STAR CLIENTS (Top Left) */}
            <motion.div 
              initial={{ opacity: 0, x: -30, y: -20 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="absolute top-4 left-0 sm:-left-6 z-20 glass-effect p-4 rounded-2xl shadow-xl max-w-[190px] text-xs flex flex-col gap-2 border border-white"
            >
              <div className="flex items-center gap-1 text-yellow-400">
                <Star size={12} fill="currentColor" />
                <Star size={12} fill="currentColor" />
                <Star size={12} fill="currentColor" />
                <Star size={12} fill="currentColor" />
                <Star size={12} fill="currentColor" />
                <span className="text-brand-charcoal font-bold ml-1 font-mono text-[10px] bg-brand-charcoal/5 px-1 py-0.5 rounded">5.0</span>
              </div>
              <h4 className="font-display font-extrabold text-brand-charcoal">5-Star Happy Clients</h4>
              
              {/* Overlapping User Avatars */}
              <div className="flex items-center -space-x-2">
                <img className="w-6 h-6 rounded-full border border-white" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100&auto=format&fit=crop" alt="client avatar" referrerPolicy="no-referrer" />
                <img className="w-6 h-6 rounded-full border border-white" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&auto=format&fit=crop" alt="client avatar" referrerPolicy="no-referrer" />
                <img className="w-6 h-6 rounded-full border border-white" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&auto=format&fit=crop" alt="client avatar" referrerPolicy="no-referrer" />
                <span className="w-6 h-6 rounded-full border border-white bg-brand-charcoal text-white text-[8px] font-bold flex items-center justify-center">+4k</span>
              </div>
              <p className="text-[10px] text-brand-text-muted leading-snug">"The cushion and style are next level. Literally feels like cloud walking."</p>
            </motion.div>

            {/* OVERLAPPING FLOATING CARD 2: DISC LABEL (Middle Left) */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8, type: 'spring' }}
              whileHover={{ scale: 1.15, rotate: 15 }}
              className="absolute top-1/2 left-2 sm:-left-12 -translate-y-1/2 z-20 w-16 h-16 sm:w-20 sm:h-20 bg-brand-charcoal text-white rounded-full flex flex-col items-center justify-center shadow-2xl border-2 border-brand-volt cursor-pointer"
            >
              <span className="font-mono text-[8px] tracking-widest text-brand-volt uppercase font-bold text-center leading-none">DISC OP</span>
              <span className="font-display font-black text-xs sm:text-sm tracking-tight leading-none text-center">TO 30%</span>
            </motion.div>

            {/* OVERLAPPING FLOATING CARD 3: HIGH-TECH DESCRIPTION (Bottom Right) */}
            <motion.div 
              initial={{ opacity: 0, y: 30, x: 20 }}
              animate={{ opacity: 1, y: 0, x: 0 }}
              transition={{ delay: 0.7, duration: 0.6 }}
              className="absolute bottom-4 right-0 sm:-right-6 z-20 bg-brand-charcoal text-white p-5 rounded-2xl shadow-xl max-w-[200px] border border-white/10"
            >
              <div className="w-6 h-6 rounded-full bg-brand-volt/20 text-brand-volt flex items-center justify-center mb-2">
                <Sparkles size={12} className="animate-pulse" />
              </div>
              <h5 className="font-display font-extrabold text-xs tracking-wide uppercase mb-1">LIGHTWEIGHT & BREATHABLE MATERIAL</h5>
              <p className="text-[10px] text-gray-400 leading-relaxed">
                Seamless matrix fiber knit wraps organically to vent hot air while securing full physical stride force support.
              </p>
            </motion.div>

          </div>

        </div>
      </header>

      {/* -------------------- RUNNING STRIP MARQUEE -------------------- */}
      <div className="w-full bg-brand-charcoal py-4 sm:py-6 overflow-hidden border-y-2 border-brand-volt relative select-none">
        <div className="flex whitespace-nowrap gap-12 text-white font-mono text-xs sm:text-sm font-semibold tracking-widest uppercase items-center animate-running-strip">
          <div className="flex gap-12 shrink-0 animate-marquee">
            <span className="flex items-center gap-2"><Sparkles size={14} className="text-brand-volt" /> SNEAKY ATHLETIC EXPERIMENT</span>
            <span className="text-brand-volt">•</span>
            <span>SHIPPED DIRECTLY WORLDWIDE</span>
            <span className="text-brand-volt">•</span>
            <span>OUTSTANDING REBOUND RESPONSE</span>
            <span className="text-brand-volt">•</span>
            <span>BUILT WITH PREMIUM CARBON CORE CORES</span>
            <span className="text-brand-volt">•</span>
            <span className="flex items-center gap-2"><Sparkles size={14} className="text-brand-volt" /> FROM STREET TO SPORT</span>
          </div>
          {/* Duplicate to fill space for seamless rendering */}
          <div className="flex gap-12 shrink-0 animate-marquee" aria-hidden="true">
            <span className="flex items-center gap-2"><Sparkles size={14} className="text-brand-volt" /> SNEAKY ATHLETIC EXPERIMENT</span>
            <span className="text-brand-volt">•</span>
            <span>SHIPPED DIRECTLY WORLDWIDE</span>
            <span className="text-brand-volt">•</span>
            <span>OUTSTANDING REBOUND RESPONSE</span>
            <span className="text-brand-volt">•</span>
            <span>BUILT WITH PREMIUM CARBON CORE CORES</span>
            <span className="text-brand-volt">•</span>
            <span className="flex items-center gap-2"><Sparkles size={14} className="text-brand-volt" /> FROM STREET TO SPORT</span>
          </div>
        </div>
      </div>

      {/* -------------------- MOST POPULAR PRODUCT GRID SHOWCASE -------------------- */}
      <section id="popular-section" className="py-20 px-4 sm:px-8 max-w-7xl mx-auto scroll-mt-10">
        
        {/* Title Header area */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="flex flex-col gap-3">
            <div className="inline-flex self-start px-2.5 py-1 bg-brand-lime/20 text-brand-charcoal/80 rounded font-mono text-xs font-bold tracking-wide uppercase">
              POPULAR RELEASES
            </div>
            <h2 className="font-michroma text-3xl sm:text-4xl text-brand-charcoal uppercase italic tracking-tight -skew-x-6">
              MOST POPULAR PRODUCT
            </h2>
            <p className="text-brand-text-muted text-sm sm:text-base max-w-xl font-medium">
              Curated by fashion directors, testing athletes, and streetwear veterans. Explore our premier sneakers that define high-octane physical aesthetics.
            </p>
          </div>

          {/* Interactive Filters Tab Panel */}
          <div className="flex flex-wrap items-center gap-2 bg-brand-charcoal/5 p-1 rounded-xl self-start">
            {(['all', 'Running', 'Streetwear', 'Training'] as const).map((cat) => (
              <button
                key={cat}
                id={`filter-btn-${cat}`}
                onClick={() => {
                  setActiveCategory(cat);
                  showToast(`Viewing ${cat === 'all' ? 'All' : cat} Products`, 'info');
                }}
                className={`px-4 py-2 rounded-lg font-display text-xs font-bold uppercase tracking-wide transition-all ${
                  activeCategory === cat 
                    ? 'bg-brand-charcoal text-brand-volt shadow-lg shadow-brand-charcoal/10' 
                    : 'text-brand-charcoal/60 hover:text-brand-charcoal hover:bg-brand-charcoal/5'
                }`}
              >
                {cat === 'all' ? 'All Active' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Sneaker GRID */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 md:gap-8">
          {filteredProducts.map((product) => {
            return (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
                className="group relative bg-white border border-brand-charcoal/5 rounded-2xl sm:rounded-3xl p-3 sm:p-6 shadow-sm hover:shadow-[0_20px_45px_rgba(17,24,39,0.06)] hover:border-brand-charcoal/15 transition-all duration-500 flex flex-col justify-between"
              >
                {/* Sale Badge if it has original price */}
                {product.originalPrice && (
                  <div className="absolute top-2 left-2 sm:top-4 sm:left-4 z-10 px-1.5 py-0.5 sm:px-3 sm:py-1 bg-brand-volt text-brand-charcoal font-mono text-[9px] sm:text-[10px] font-black uppercase rounded-md tracking-wider shadow-sm">
                    {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                  </div>
                )}

                {/* Stars and Rating */}
                <div className="flex items-center justify-between text-yellow-400 mb-2 sm:mb-4">
                  <div className="flex items-center gap-0.5">
                    <Star size={10} className="sm:size-3" fill="currentColor" />
                    <span className="text-[10px] sm:text-xs font-bold text-brand-charcoal ml-1">{product.rating}</span>
                  </div>
                  <span className="font-mono text-[9px] sm:text-[10px] text-brand-text-muted uppercase tracking-wider bg-brand-charcoal/5 px-1.5 py-0.5 sm:px-2 sm:py-0.5 rounded font-bold">
                    {product.category}
                  </span>
                </div>

                {/* Product Card Styled Centered Image container */}
                <div 
                  className="relative w-full h-[140px] sm:h-[220px] bg-brand-gray-light/50 rounded-xl sm:rounded-2xl overflow-hidden flex items-center justify-center cursor-pointer mb-3 sm:mb-6"
                  onClick={() => handleOpenQuickView(product)}
                >
                  {/* Hover background splash scale */}
                  <div className="absolute inset-0 bg-brand-volt/10 scale-0 group-hover:scale-100 transition-transform duration-500 rounded-2xl pointer-events-none" />
                  
                  {/* Real-time reflection block */}
                  <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/25 to-transparent pointer-events-none" />
                  
                  {/* Card Image */}
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    referrerPolicy="no-referrer"
                    className="w-[85%] h-[85%] object-contain transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6 drop-shadow-xl"
                  />
                  
                  {/* Floating Action overlay */}
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="inline-flex items-center gap-2 px-4 py-2 bg-brand-charcoal text-white rounded-full text-[10px] font-bold uppercase tracking-widest shadow-lg">
                      <Eye size={12} /> Quick View
                    </span>
                  </div>
                </div>

                {/* Titles and Bottom Row nested button */}
                <div>
                  <h3 className="font-display font-extrabold text-xs sm:text-lg text-brand-charcoal tracking-tight group-hover:text-brand-lime transition-colors line-clamp-1 sm:line-clamp-none">
                    {product.name}
                  </h3>
                  
                  {/* Subtle color indicators on cards */}
                  <div className="flex gap-1 mt-1 mb-2 sm:mt-2 sm:mb-4">
                    {product.colors.map((color) => (
                      <span 
                        key={color} 
                        className="w-2 h-2 sm:w-3 sm:h-3 rounded-full border border-black/10" 
                        style={{ backgroundColor: color }} 
                      />
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-1 sm:pt-2 border-t border-brand-charcoal/5">
                    <div className="flex flex-col sm:flex-row sm:items-baseline gap-0.5 sm:gap-2">
                      <span className="font-display font-black text-sm sm:text-xl text-brand-charcoal">
                        ${product.price.toFixed(2)}
                      </span>
                      {product.originalPrice && (
                        <span className="font-mono text-[9px] sm:text-xs text-brand-text-muted line-through">
                          ${product.originalPrice.toFixed(2)}
                        </span>
                      )}
                    </div>

                    {/* Quick Add To Cart using first size & color */}
                    <button
                      id={`add-cart-shortcut-${product.id}`}
                      onClick={() => handleAddToCart(product, product.sizes[1] || product.sizes[0], product.colors[0])}
                      className="w-8 h-8 sm:w-10 sm:h-10 bg-brand-volt text-brand-charcoal rounded-lg flex items-center justify-center transition-all duration-300 hover:bg-brand-charcoal hover:text-brand-volt transform hover:scale-105 active:scale-95 shadow-md shadow-brand-volt/10"
                      title="Add to Cart now"
                    >
                      <ShoppingCart size={14} className="sm:size-[18px]" />
                    </button>
                  </div>
                </div>

              </motion.div>
            );
          })}
        </div>

        {/* Bottom CTA Banner inside popular releases */}
        <div className="mt-16 text-center">
          <button 
            id="browse-collection-bottom-btn"
            onClick={() => {
              setActiveCategory('all');
              showToast("Displaying all 6 premium sneakers in stock.", "info");
            }}
            className="inline-flex items-center gap-2.5 px-8 py-4 bg-brand-charcoal text-white uppercase font-display font-black tracking-wider text-xs rounded-full hover:bg-brand-charcoal/90 transition-all shadow-xl hover:shadow-brand-charcoal/20"
          >
            <span>Shop All Popular Releases</span>
            <Plus size={16} className="text-brand-volt" />
          </button>
        </div>

      </section>

      {/* -------------------- INTERACTIVE HOTSPOT EXPLAINER SECTION -------------------- */}
      <section id="tech-section" className="py-20 px-4 sm:px-8 bg-brand-charcoal text-white rounded-[40px] m-4 md:m-8 overflow-hidden relative">
        <div className="absolute inset-0 bg-radial-gradient from-brand-volt/5 to-transparent pointer-events-none" />
        
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          
          {/* Left Explainer texts */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="inline-flex self-start px-2.5 py-1 bg-brand-volt/20 text-brand-volt rounded font-mono text-xs font-bold tracking-wide uppercase">
              SNEAKY LAB TECH
            </div>
            
            <h2 className="font-michroma text-3xl sm:text-4xl text-white uppercase italic tracking-tight -skew-x-6 animate-pulse-subtle">
              EXPLORE THE UNDER THE HOOD TECH
            </h2>
            
            <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
              We did not build another generic tennis shoe. Every seam, curve, foam, and stitch inside "Sneaky" series undergoes 500 hours of biomechanical sprint testing. Click the hot-pointer nodes on the sneaker to read exact engineering specs.
            </p>

            {/* Hotspot details panel */}
            <div className="mt-4 border-l-2 border-brand-volt pl-4 py-1 flex flex-col gap-2 min-h-[140px]">
              <AnimatePresence mode="wait">
                {activeHotspot === 'sole' && (
                  <motion.div
                    key="sole-info"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                  >
                    <h4 className="font-display font-bold text-brand-volt uppercase tracking-wide">Dynamic Dual-Density Sole</h4>
                    <p className="text-xs text-gray-300 mt-1">
                      Employs state-of-the-art carbon-fiber energy propulsion plate combined with gas-infused TPU cushioning. Rebounds 98% of landing force back into forward horizontal movement.
                    </p>
                  </motion.div>
                )}
                {activeHotspot === 'upper' && (
                  <motion.div
                    key="upper-info"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                  >
                    <h4 className="font-display font-bold text-brand-volt uppercase tracking-wide">Matrix 3D Knit Upper weave</h4>
                    <p className="text-xs text-gray-300 mt-1">
                      A custom composite seamless stitch allowing high-efficiency airflow to eliminate sweat buildup. Provides lightweight compression support that adapts to foot shape.
                    </p>
                  </motion.div>
                )}
                {activeHotspot === 'heel' && (
                  <motion.div
                    key="heel-info"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                  >
                    <h4 className="font-display font-bold text-brand-volt uppercase tracking-wide">Stabilized Heel-Lock Anchor</h4>
                    <p className="text-xs text-gray-300 mt-1">
                      Reinforced semi-rigid TPU heel counter which locks your tendon safely into position. Prevents hazardous slippage during speedy sudden cuts and lateral movements.
                    </p>
                  </motion.div>
                )}
                {activeHotspot === 'laces' && (
                  <motion.div
                    key="laces-info"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                  >
                    <h4 className="font-display font-bold text-brand-volt uppercase tracking-wide">Integrated Tensile Lock Lace system</h4>
                    <p className="text-xs text-gray-300 mt-1">
                      Custom design eyelets layout that redirects downward vertical pressure evenly. Uses low-friction nylon chords allowing perfect customized lock with single-hand tension pull.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="flex gap-2.5 mt-2">
              <button 
                onClick={() => setActiveHotspot('sole')} 
                className={`px-3 py-1 text-[10px] font-mono font-bold uppercase rounded ${activeHotspot === 'sole' ? 'bg-brand-volt text-brand-charcoal' : 'bg-white/10 text-white/70 hover:bg-white/20'}`}
              >
                1. Cushion Sole
              </button>
              <button 
                onClick={() => setActiveHotspot('upper')} 
                className={`px-3 py-1 text-[10px] font-mono font-bold uppercase rounded ${activeHotspot === 'upper' ? 'bg-brand-volt text-brand-charcoal' : 'bg-white/10 text-white/70 hover:bg-white/20'}`}
              >
                2. Knit Upper
              </button>
              <button 
                onClick={() => setActiveHotspot('heel')} 
                className={`px-3 py-1 text-[10px] font-mono font-bold uppercase rounded ${activeHotspot === 'heel' ? 'bg-brand-volt text-brand-charcoal' : 'bg-white/10 text-white/70 hover:bg-white/20'}`}
              >
                3. Heel Lock
              </button>
              <button 
                onClick={() => setActiveHotspot('laces')} 
                className={`px-3 py-1 text-[10px] font-mono font-bold uppercase rounded ${activeHotspot === 'laces' ? 'bg-brand-volt text-brand-charcoal' : 'bg-white/10 text-white/70 hover:bg-white/20'}`}
              >
                4. Tension Laces
              </button>
            </div>

          </div>

          {/* Right interactive Graphics canvas column */}
          <div className="lg:col-span-7 flex justify-center items-center relative h-[380px] sm:h-[420px] bg-black/30 rounded-3xl p-6 border border-white/5">
            <div className="absolute inset-0 bg-dotted-pattern opacity-10" />
            
            {/* Main Shoe graphic angled beautifully */}
            <div className="relative w-full max-w-[420px] sm:max-w-md z-10">
              <img 
                src={SNEAKER_POP_2} 
                alt="Sneaky Engineering showcase model" 
                referrerPolicy="no-referrer"
                className="w-full h-full object-contain -rotate-12 transform scale-110 select-none drop-shadow-[0_20px_50px_rgba(204,255,0,0.25)]"
              />

              {/* HOTSPOT TRIGGER NODES */}
              
              {/* NODE 1: SOLE */}
              <button 
                id="hotspot-sole-btn"
                onClick={() => setActiveHotspot('sole')}
                className="absolute bottom-6 left-[62%] -translate-x-1/2 -translate-y-1/2 z-20 flex items-center justify-center"
              >
                <span className={`absolute inline-flex h-8 w-8 rounded-full opacity-75 animate-ping ${activeHotspot === 'sole' ? 'bg-brand-volt' : 'bg-white'}`} />
                <span className={`relative flex items-center justify-center rounded-full h-6 w-6 border-2 font-mono text-[10px] font-bold ${activeHotspot === 'sole' ? 'bg-brand-volt text-brand-charcoal border-brand-volt' : 'bg-brand-charcoal text-white border-white'}`}>
                  1
                </span>
              </button>

              {/* NODE 2: UPPER */}
              <button 
                id="hotspot-upper-btn"
                onClick={() => setActiveHotspot('upper')}
                className="absolute top-1/4 left-1/3 -translate-x-1/2 -translate-y-1/2 z-20 flex items-center justify-center"
              >
                <span className={`absolute inline-flex h-8 w-8 rounded-full opacity-75 animate-ping ${activeHotspot === 'upper' ? 'bg-brand-volt' : 'bg-white'}`} />
                <span className={`relative flex items-center justify-center rounded-full h-6 w-6 border-2 font-mono text-[10px] font-bold ${activeHotspot === 'upper' ? 'bg-brand-volt text-brand-charcoal border-brand-volt' : 'bg-brand-charcoal text-white border-white'}`}>
                  2
                </span>
              </button>

              {/* NODE 3: HEEL */}
              <button 
                id="hotspot-heel-btn"
                onClick={() => setActiveHotspot('heel')}
                className="absolute top-1/3 left-[70%] -translate-x-1/2 -translate-y-1/2 z-20 flex items-center justify-center"
              >
                <span className={`absolute inline-flex h-8 w-8 rounded-full opacity-75 animate-ping ${activeHotspot === 'heel' ? 'bg-brand-volt' : 'bg-white'}`} />
                <span className={`relative flex items-center justify-center rounded-full h-6 w-6 border-2 font-mono text-[10px] font-bold ${activeHotspot === 'heel' ? 'bg-brand-volt text-brand-charcoal border-brand-volt' : 'bg-brand-charcoal text-white border-white'}`}>
                  3
                </span>
              </button>

              {/* NODE 4: LACES */}
              <button 
                id="hotspot-laces-btn"
                onClick={() => setActiveHotspot('laces')}
                className="absolute top-[48%] left-[45%] -translate-x-1/2 -translate-y-1/2 z-20 flex items-center justify-center"
              >
                <span className={`absolute inline-flex h-8 w-8 rounded-full opacity-75 animate-ping ${activeHotspot === 'laces' ? 'bg-brand-volt' : 'bg-white'}`} />
                <span className={`relative flex items-center justify-center rounded-full h-6 w-6 border-2 font-mono text-[10px] font-bold ${activeHotspot === 'laces' ? 'bg-brand-volt text-brand-charcoal border-brand-volt' : 'bg-brand-charcoal text-white border-white'}`}>
                  4
                </span>
              </button>

              {/* SVG connection indicators */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none z-0 hidden sm:block overflow-visible" stroke="rgba(255,255,255,0.15)" strokeWidth="1" fill="none">
                {activeHotspot === 'sole' && <path d="M 260,260 L 350,300" stroke="#CCFF00" strokeWidth="2" strokeDasharray="4" />}
                {activeHotspot === 'upper' && <path d="M 140,105 L 80,60" stroke="#CCFF00" strokeWidth="2" strokeDasharray="4" />}
                {activeHotspot === 'heel' && <path d="M 290,135 L 340,100" stroke="#CCFF00" strokeWidth="2" strokeDasharray="4" />}
                {activeHotspot === 'laces' && <path d="M 190,185 L 120,230" stroke="#CCFF00" strokeWidth="2" strokeDasharray="4" />}
              </svg>

            </div>
          </div>

        </div>
      </section>

      {/* -------------------- ABOUT BRAND / SNEAKY FAMILY SECTION -------------------- */}
      <section id="about-section" className="py-20 px-4 sm:px-8 max-w-7xl mx-auto scroll-mt-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Grid visual collage of athletic lifestyle */}
          <div className="grid grid-cols-2 gap-4 relative">
            <div className="absolute -top-6 -left-6 w-20 h-20 border-t-4 border-l-4 border-brand-volt pointer-events-none" />
            <div className="absolute -bottom-6 -right-6 w-20 h-20 border-b-4 border-r-4 border-brand-charcoal pointer-events-none" />
            
            <div className="space-y-4">
              <motion.div 
                className="rounded-3xl overflow-hidden h-48 sm:h-64 shadow-lg cursor-pointer group"
                whileHover={{ scale: 1.02 }}
              >
                <img 
                  src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=350&auto=format&fit=crop" 
                  alt="Sneaky street presentation red" 
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 group-hover:rotate-2"
                />
              </motion.div>
              <div className="bg-brand-volt p-6 sm:p-8 rounded-3xl text-brand-charcoal flex flex-col justify-end min-h-[160px] sm:min-h-[200px]">
                <h3 className="font-display font-black text-xl sm:text-2xl uppercase tracking-tight leading-none italic">ESTABLISHED</h3>
                <h4 className="font-display font-black text-3xl sm:text-5xl uppercase tracking-tighter leading-none italic">2026</h4>
                <p className="text-[10px] sm:text-xs text-brand-charcoal/80 font-mono font-bold tracking-widest mt-2">PARIS // TOKYO // NY</p>
              </div>
            </div>

            <div className="space-y-4 pt-8">
              <div className="bg-brand-charcoal text-white p-6 sm:p-8 rounded-3xl flex flex-col justify-between min-h-[160px] sm:min-h-[200px] border border-white/5">
                <ShoppingBag className="text-brand-volt" size={28} />
                <div>
                  <h4 className="font-display font-extrabold text-base tracking-wide uppercase">STRIDE INTEGRITY</h4>
                  <p className="text-[10px] sm:text-xs text-gray-400 mt-1 leading-snug">Every order shipped includes recyclable tech carrying pod boxes and custom neon branding laces.</p>
                </div>
              </div>
              
              <motion.div 
                className="rounded-3xl overflow-hidden h-48 sm:h-64 shadow-lg cursor-pointer group"
                whileHover={{ scale: 1.02 }}
              >
                <img 
                  src="https://images.unsplash.com/photo-1556906781-9a412961c28c?q=80&w=350&auto=format&fit=crop" 
                  alt="Streetwear running shoe in dynamic pose" 
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-2"
                />
              </motion.div>
            </div>

          </div>

          {/* About us description details */}
          <div className="flex flex-col gap-6 justify-center">
            <div className="inline-flex self-start px-2.5 py-1 bg-brand-charcoal text-brand-volt rounded font-mono text-xs font-bold tracking-wide uppercase">
              WHO WE ARE
            </div>
            
            <h2 className="font-michroma text-3xl sm:text-4xl text-brand-charcoal uppercase italic tracking-tight -skew-x-6">
              FUSING STREETWEAR SENSORY WITH SPEED ENGINEERING
            </h2>
            
            <p className="text-brand-text-muted text-sm sm:text-base leading-relaxed">
              At Sneaky, we believe your lifestyle and your athletic passion shouldn't live in separate closets. Born in urban sub-culture concrete corridors and refined in carbon racing research stations, we engineer premium footwear that thrives in high-pressure movement.
            </p>

            <p className="text-brand-text-muted text-sm sm:text-base leading-relaxed">
              Our core values align with transparency and supreme material comfort. Using premium bio-synthesizers for our soles and 100% recycled nylon weave for our laces, we are marching steadily toward a faster, carbon-neutral streetwear future.
            </p>

            {/* Core features listing */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              <div className="flex items-start gap-3">
                <span className="p-1.5 rounded-lg bg-brand-volt text-brand-charcoal shrink-0 mt-0.5">
                  <Check size={14} className="stroke-[3]" />
                </span>
                <div>
                  <h4 className="font-display font-bold text-sm text-brand-charcoal uppercase tracking-wide">Recycled Speed Matrix Fiber</h4>
                  <p className="text-[11px] text-brand-text-muted leading-relaxed">Guarantees zero stretch warp structural deformities.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="p-1.5 rounded-lg bg-brand-volt text-brand-charcoal shrink-0 mt-0.5">
                  <Check size={14} className="stroke-[3]" />
                </span>
                <div>
                  <h4 className="font-display font-bold text-sm text-brand-charcoal uppercase tracking-wide">Carbon fiber sprint plate</h4>
                  <p className="text-[11px] text-brand-text-muted leading-relaxed">Propels strides by storing kinetic energy instantly.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="p-1.5 rounded-lg bg-brand-volt text-brand-charcoal shrink-0 mt-0.5">
                  <Check size={14} className="stroke-[3]" />
                </span>
                <div>
                  <h4 className="font-display font-bold text-sm text-brand-charcoal uppercase tracking-wide">Dynamic high-vis patterns</h4>
                  <p className="text-[11px] text-brand-text-muted leading-relaxed">Stay distinct and reflective in low-lit night tracks.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="p-1.5 rounded-lg bg-brand-volt text-brand-charcoal shrink-0 mt-0.5">
                  <Check size={14} className="stroke-[3]" />
                </span>
                <div>
                  <h4 className="font-display font-bold text-sm text-brand-charcoal uppercase tracking-wide">Custom dual-intensity foam</h4>
                  <p className="text-[11px] text-brand-text-muted leading-relaxed">Absorbs 450lbs of lateral compression impact safely.</p>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* -------------------- TRUSTED BRANDS ACCENT BANNER -------------------- */}
      <section className="bg-brand-gray-light py-12 px-4 sm:px-8 border-y border-brand-charcoal/5">
        <div className="max-w-7xl mx-auto flex flex-col gap-6 items-center text-center">
          <span className="font-mono text-xs text-brand-text-muted tracking-widest uppercase font-bold">
            CURATING PREMIUM SNEAKER MASTERPIECES WITH
          </span>
          <div className="flex flex-wrap justify-center items-center gap-10 sm:gap-16 opacity-40 hover:opacity-80 transition-opacity duration-300">
            <span className="font-display font-black text-2xl sm:text-3xl tracking-tighter uppercase italic">VULCAN</span>
            <span className="font-display font-black text-2xl sm:text-3xl tracking-tighter uppercase italic">TPU CORE</span>
            <span className="font-display font-black text-2xl sm:text-3xl tracking-tighter uppercase italic">SPEED RUN</span>
            <span className="font-display font-black text-2xl sm:text-3xl tracking-tighter uppercase italic">CARBON GRIP</span>
            <span className="font-display font-black text-2xl sm:text-3xl tracking-tighter uppercase italic">STREET FORCE</span>
          </div>
        </div>
      </section>

      {/* -------------------- INTERACTIVE CART SIDE DRAWER -------------------- */}
      <AnimatePresence>
        {cartOpen && (
          <>
            {/* Backdrop element click closes drawer */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setCartOpen(false)}
              className="fixed inset-0 bg-brand-charcoal/60 backdrop-blur-sm z-50 cursor-pointer"
            />
            
            {/* Drawer body container */}
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              id="shopping-cart-drawer"
              className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-2xl z-50 p-6 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between pb-6 border-b border-brand-charcoal/10">
                  <div className="flex items-center gap-2">
                    <ShoppingBag className="text-brand-charcoal" />
                    <h3 className="font-display font-black text-2xl uppercase tracking-tight">Your Cart</h3>
                    <span className="bg-brand-charcoal text-brand-volt text-xs font-bold px-2 py-0.5 rounded-full font-mono">
                      {cartTotalItems}
                    </span>
                  </div>
                  <button 
                    id="close-cart-drawer-btn"
                    onClick={() => setCartOpen(false)}
                    className="p-2 hover:bg-brand-charcoal/5 rounded-full transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Cart list content */}
                {cart.length === 0 ? (
                  <div className="py-20 text-center flex flex-col items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-brand-gray-light flex items-center justify-center text-brand-text-muted mb-2">
                      <ShoppingBag size={28} />
                    </div>
                    <p className="font-display font-extrabold text-brand-charcoal uppercase">Your cart is empty</p>
                    <p className="text-xs text-brand-text-muted max-w-[260px]">Find a premium sneaker from our popular release list and add it to your selection!</p>
                    <button 
                      onClick={() => {
                        setCartOpen(false);
                        const element = document.getElementById('popular-section');
                        element?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="mt-2 px-5 py-2.5 bg-brand-volt text-brand-charcoal font-display text-xs font-bold uppercase tracking-wide rounded-full shadow hover:bg-brand-volt-hover transition-all"
                    >
                      Start Shopping
                    </button>
                  </div>
                ) : (
                  <div className="overflow-y-auto max-h-[60vh] py-4 division-y division-brand-charcoal/10 space-y-4">
                    {cart.map((item, index) => (
                      <div key={`${item.product.id}-${item.selectedSize}-${item.selectedColor}`} className="flex gap-4 p-3 bg-brand-gray-light/50 rounded-2xl border border-brand-charcoal/5">
                        <div className="w-20 h-20 bg-white rounded-xl flex items-center justify-center border border-brand-charcoal/5 scale-100 font-bold overflow-hidden">
                          <img src={item.product.image} alt={item.product.name} className="w-[85%] h-[85%] object-contain -rotate-6" referrerPolicy="no-referrer" />
                        </div>
                        <div className="flex-1 flex flex-col justify-between">
                          <div>
                            <h4 className="font-display font-extrabold text-sm text-brand-charcoal tracking-tight max-w-[200px] truncate">
                              {item.product.name}
                            </h4>
                            <div className="flex flex-wrap gap-x-2 text-[10px] text-brand-text-muted mt-0.5 font-mono">
                              <span>Size: <strong className="text-brand-charcoal">US {item.selectedSize}</strong></span>
                              <span>•</span>
                              <span className="flex items-center gap-1">Color: 
                                <span className="inline-block w-2.5 h-2.5 rounded-full border border-black/10" style={{ backgroundColor: item.selectedColor }} />
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between pt-1">
                            <span className="font-display font-black text-brand-charcoal">
                              ${(item.product.price * item.quantity).toFixed(2)}
                            </span>
                            
                            {/* Quantity Incrementor */}
                            <div className="flex items-center gap-1 bg-white border border-brand-charcoal/15 rounded-lg p-0.5">
                              <button 
                                onClick={() => handleUpdateCartQuantity(index, -1)}
                                className="p-1 hover:bg-brand-charcoal/5 text-brand-charcoal rounded transition-colors"
                              >
                                <Minus size={12} />
                              </button>
                              <span className="font-mono text-xs font-bold px-2 text-center min-w-[20px]">{item.quantity}</span>
                              <button 
                                onClick={() => handleUpdateCartQuantity(index, 1)}
                                className="p-1 hover:bg-brand-charcoal/5 text-brand-charcoal rounded transition-colors"
                              >
                                <Plus size={12} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Checkout subtotal drawer foot section */}
              {cart.length > 0 && (
                <div className="border-t border-brand-charcoal/10 pt-6 bg-white shrink-0">
                  <div className="space-y-2.5 mb-6 text-sm font-medium">
                    <div className="flex justify-between text-brand-text-muted">
                      <span>Subtotal</span>
                      <span className="font-mono font-semibold text-brand-charcoal">${cartSubtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-brand-text-muted">
                      <span>Express Shipping</span>
                      <span className="font-mono font-semibold text-brand-charcoal text-xs tracking-wider uppercase">FREE INTL</span>
                    </div>
                    <div className="flex justify-between text-brand-text-muted">
                      <span>Estimated Taxes</span>
                      <span className="font-mono font-semibold text-brand-charcoal">$0.00</span>
                    </div>
                    <div className="flex justify-between text-base font-bold border-t border-brand-charcoal/5 pt-3">
                      <span className="font-display text-brand-charcoal uppercase">Grand Total</span>
                      <span className="font-display text-lg text-brand-charcoal">${cartSubtotal.toFixed(2)}</span>
                    </div>
                  </div>

                  <button
                    id="simulate-checkout-btn"
                    onClick={handleCheckoutSimulate}
                    className="w-full py-4 bg-brand-volt hover:bg-brand-volt-hover text-brand-charcoal font-display font-black uppercase text-xs tracking-widest rounded-xl transition-all transform hover:scale-[1.02] active:scale-95 shadow-lg shadow-brand-volt/20"
                  >
                    Proceed to Simulated Checkout
                  </button>
                  <p className="text-[10px] text-center text-brand-text-muted uppercase tracking-wider font-mono font-bold mt-2.5">
                    🔐 100% Secure SSL Payment System
                  </p>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* -------------------- INTERACTIVE QUICK VIEW MODAL -------------------- */}
      <AnimatePresence>
        {selectedProduct && (
          <>
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProduct(null)}
              className="fixed inset-0 bg-brand-charcoal/80 backdrop-blur-md z-50 cursor-pointer"
            />
            
            {/* Modal Body Container */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.25 }}
              id="quick-view-modal"
              className="fixed inset-4 md:inset-x-12 md:inset-y-16 lg:inset-x-32 lg:inset-y-20 max-w-5xl mx-auto bg-white rounded-[32px] overflow-hidden shadow-2xl z-50 flex flex-col lg:flex-row border border-brand-charcoal/10"
            >
              
              {/* Left Column: Huge visual gallery container */}
              <div className="w-full lg:w-1/2 p-4 sm:p-8 bg-brand-gray-light flex flex-col justify-between items-center relative min-h-[260px] sm:min-h-[350px] lg:min-h-full">
                <div className="absolute top-4 left-4 inline-flex px-3 py-1 bg-brand-charcoal text-brand-volt rounded font-mono text-[10px] font-bold uppercase tracking-wider">
                  {selectedProduct.category}
                </div>
                
                {/* Close Button on mobile inside catalog */}
                <button 
                  onClick={() => setSelectedProduct(null)}
                  className="absolute top-4 right-4 p-2 bg-white text-brand-charcoal rounded-full hover:bg-brand-charcoal hover:text-white transition-colors lg:hidden z-10"
                >
                  <X size={18} />
                </button>

                {/* Main large visual product image (Floating/Rotating slight angle) */}
                <div className="flex-1 flex items-center justify-center w-full max-w-[340px] drop-shadow-2xl">
                  <motion.img 
                    initial={{ rotate: -15, scale: 0.9 }}
                    animate={{ rotate: -5, scale: 1.05 }}
                    transition={{ type: 'spring', stiffness: 100 }}
                    key={selectedColorInModal} // Trigger subtle animate refresh on color change
                    src={selectedProduct.image} 
                    alt={selectedProduct.name} 
                    referrerPolicy="no-referrer"
                    className="w-full h-auto object-contain glow-volt max-h-[320px] select-none"
                  />
                </div>

                {/* Rating bottom footer inside catalog view */}
                <div className="flex items-center gap-2 bg-white/60 backdrop-blur-sm py-2 px-4 rounded-xl text-xs font-semibold text-brand-charcoal">
                  <div className="flex items-center text-yellow-400">
                    <Star size={14} fill="currentColor" />
                    <Star size={14} fill="currentColor" />
                    <Star size={14} fill="currentColor" />
                    <Star size={14} fill="currentColor" />
                    <Star size={14} fill="currentColor" />
                  </div>
                  <span>{selectedProduct.rating} Rating</span>
                  <span className="text-gray-400">({selectedProduct.reviewCount} customer reviews)</span>
                </div>
              </div>

              {/* Right Column: Interactive control customizer inputs */}
              <div className="w-full lg:w-1/2 p-6 sm:p-8 overflow-y-auto flex flex-col justify-between max-h-[60vh] lg:max-h-full">
                
                {/* Header title close buttons */}
                <div>
                  <div className="hidden lg:flex items-center justify-between pb-4 border-b border-brand-charcoal/5">
                    <span className="font-mono text-xs uppercase tracking-wider font-bold text-brand-text-muted">SNEAKY SNEAKER CUSTOMIZATION</span>
                    <button 
                      onClick={() => setSelectedProduct(null)}
                      className="p-1.5 hover:bg-brand-charcoal/5 rounded-full text-brand-charcoal transition-colors"
                      id="close-quick-view-btn"
                    >
                      <X size={22} />
                    </button>
                  </div>

                  {/* Title & Price */}
                  <div className="py-4">
                    <h3 className="font-display font-black text-3xl sm:text-4xl uppercase tracking-tight text-brand-charcoal italic leading-none -skew-x-6">
                      {selectedProduct.name}
                    </h3>
                    <div className="flex items-baseline gap-3 mt-2">
                      <span className="font-display font-black text-2xl text-brand-charcoal">${selectedProduct.price.toFixed(2)}</span>
                      {selectedProduct.originalPrice && (
                        <span className="font-mono text-sm text-brand-text-muted line-through">${selectedProduct.originalPrice.toFixed(2)}</span>
                      )}
                    </div>
                  </div>

                  {/* Description long text */}
                  <p className="text-xs sm:text-sm text-brand-text-muted leading-relaxed font-semibold">
                    {selectedProduct.description}
                  </p>

                  {/* CUSTOMIZER OPTIONS AREA */}
                  <div className="space-y-6 py-6 border-t border-b border-brand-charcoal/5 mt-6">
                    
                    {/* OPTION 1: COLOR SELECTION */}
                    <div>
                      <h5 className="font-display font-extrabold text-xs tracking-wide uppercase text-brand-charcoal/70 mb-2.5">
                        Select Colors Accentway:
                      </h5>
                      <div className="flex items-center gap-3">
                        {selectedProduct.colors.map((color) => {
                          const isSelected = selectedColorInModal === color;
                          return (
                            <button
                              key={color}
                              onClick={() => {
                                setSelectedColorInModal(color);
                                showToast(`Accentway changed: ${color.toUpperCase()}`, 'info');
                              }}
                              className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${
                                isSelected ? 'border-brand-charcoal scale-110 shadow-md' : 'border-transparent hover:scale-105'
                              }`}
                              style={{ backgroundColor: color }}
                              title={color}
                            >
                              {isSelected && (
                                <Check size={14} className={color === '#FFFFFF' || color === '#CCFF00' ? 'text-black' : 'text-white'} />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* OPTION 2: SIZE SELECTION */}
                    <div>
                      <div className="flex justify-between items-center mb-2.5">
                        <h5 className="font-display font-extrabold text-xs tracking-wide uppercase text-brand-charcoal/70">
                          Select Size (US Men/Unisex):
                        </h5>
                        <span className="font-mono text-[10px] text-brand-volt bg-brand-charcoal px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">
                          True to size
                        </span>
                      </div>
                      <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                        {selectedProduct.sizes.map((size) => {
                          const isSelected = selectedSizeInModal === size;
                          return (
                            <button
                              key={size}
                              onClick={() => {
                                setSelectedSizeInModal(size);
                              }}
                              className={`py-2 rounded-lg font-mono text-xs font-bold border transition-all ${
                                isSelected 
                                  ? 'bg-brand-charcoal text-brand-volt border-brand-charcoal shadow-md shadow-brand-charcoal/10 transform scale-102' 
                                  : 'bg-white border-brand-charcoal/15 text-brand-charcoal hover:bg-brand-gray-light hover:border-brand-charcoal/30'
                              }`}
                            >
                              US {size}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                  </div>
                </div>

                {/* Submitting Quick View Form */}
                <div className="pt-6 shrink-0 flex flex-col sm:flex-row items-center gap-4">
                  <button
                    id="modal-add-to-cart-btn"
                    onClick={() => {
                      if (selectedSizeInModal && selectedColorInModal) {
                        handleAddToCart(
                          selectedProduct,
                          selectedSizeInModal,
                          selectedColorInModal
                        );
                        setSelectedProduct(null); // Close modal 
                        setCartOpen(true); // Open side drawer for validation!
                      }
                    }}
                    className="w-full sm:flex-1 py-4 bg-brand-volt hover:bg-brand-volt-hover text-brand-charcoal font-display font-black uppercase text-xs tracking-widest rounded-xl transition-all transform hover:scale-[1.02] active:scale-95 shadow-lg shadow-brand-volt/15 flex items-center justify-center gap-2"
                  >
                    <ShoppingCart size={16} />
                    <span>Add to Bag</span>
                  </button>
                  
                  <button
                    onClick={() => setSelectedProduct(null)}
                    className="w-full sm:w-auto px-6 py-4 border border-brand-charcoal/15 text-brand-charcoal/70 hover:text-brand-charcoal hover:border-brand-charcoal rounded-xl transition-all font-display text-xs font-bold uppercase tracking-wide"
                  >
                    Cancel
                  </button>
                </div>

              </div>

            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* -------------------- INSTANT LIVE SEARCH MODAL OVERLAY -------------------- */}
      <AnimatePresence>
        {searchOpen && (
          <>
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => { setSearchOpen(false); setSearchQuery(''); }}
              className="fixed inset-0 bg-brand-charcoal/80 backdrop-blur-md z-50 cursor-pointer"
            />

            {/* Panel */}
            <motion.div
              initial={{ opacity: 0, y: -40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed top-12 left-1/2 -translate-x-1/2 w-full max-w-2xl bg-white rounded-3xl p-6 shadow-2xl z-50 border border-brand-charcoal/10 mx-4 max-h-[80vh] flex flex-col justify-between overflow-hidden"
              id="live-search-panel"
            >
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-brand-charcoal/10 mb-4">
                  <div className="flex items-center gap-2 text-brand-charcoal">
                    <Search className="stroke-[2]" />
                    <span className="font-display font-extrabold text-lg uppercase">Live Sneaky Catalog finder</span>
                  </div>
                  <button 
                    id="close-search-panel-btn"
                    onClick={() => { setSearchOpen(false); setSearchQuery(''); }}
                    className="p-1.5 hover:bg-brand-charcoal/5 rounded-full transition-all"
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* Search Text Input */}
                <div className="relative mb-6">
                  <input 
                    type="text" 
                    placeholder="Search by model, style category (e.g. running, training)..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full p-4 pl-12 bg-brand-gray-light text-brand-charcoal font-medium rounded-xl border border-brand-charcoal/10 focus:outline-none focus:ring-2 focus:ring-brand-volt placeholder-brand-charcoal/40"
                    autoFocus
                  />
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-charcoal/40" size={18} />
                </div>

                {/* Search outputs */}
                <div>
                  {searchQuery.trim() === '' ? (
                    <div className="py-6">
                      <span className="font-mono text-[10px] text-brand-text-muted uppercase tracking-widest font-black block mb-3">
                        Suggested rapid searches
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {['Streetwear', 'Running', 'Training', 'STRATTLES', 'FREETTLEY'].map((term) => (
                          <button
                            key={term}
                            onClick={() => setSearchQuery(term)}
                            className="px-3.5 py-1.5 bg-brand-gray-light hover:bg-brand-volt/25 text-brand-charcoal font-display text-xs font-bold uppercase rounded-lg border border-brand-charcoal/5 transition-all"
                          >
                            {term}
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3 overflow-y-auto max-h-[40vh] py-2">
                      <span className="font-mono text-[10px] text-brand-text-muted uppercase tracking-widest font-black block mb-2">
                        Matching Results ({searchResults.length})
                      </span>
                      {searchResults.length === 0 ? (
                        <p className="text-xs text-brand-text-muted py-4">No premium sneakers matched your input. Refine spelling or search "running".</p>
                      ) : (
                        searchResults.map((product) => (
                          <div 
                            key={product.id}
                            onClick={() => {
                              handleOpenQuickView(product);
                              setSearchOpen(false);
                              setSearchQuery('');
                            }}
                            className="flex items-center justify-between p-3 bg-brand-gray-light hover:bg-brand-volt/15 rounded-xl cursor-pointer border border-brand-charcoal/5 transition-all transform hover:translate-x-1"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center border p-1 shrink-0 overflow-hidden">
                                <img src={product.image} alt={product.name} className="w-full h-full object-contain -rotate-6" referrerPolicy="no-referrer" />
                              </div>
                              <div>
                                <h4 className="font-display font-extrabold text-sm text-brand-charcoal">{product.name}</h4>
                                <span className="font-mono text-[9px] text-brand-text-muted uppercase font-bold tracking-wider">{product.category}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="font-display font-black text-brand-charcoal text-sm">${product.price.toFixed(2)}</span>
                              <ChevronDown size={14} className="-rotate-90 text-brand-charcoal/40" />
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* -------------------- SIGN IN / REGISTER AUTHENTICATION MODAL -------------------- */}
      <AnimatePresence>
        {authOpen && (
          <>
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setAuthOpen(false)}
              className="fixed inset-0 bg-brand-charcoal/80 backdrop-blur-md z-50 cursor-pointer"
            />

            {/* Box modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-[32px] p-8 shadow-2xl z-50 border border-brand-charcoal/10 mx-4"
              id="auth-credentials-modal"
            >
              <div className="flex items-center justify-between pb-4 border-b border-brand-charcoal/10 mb-6">
                <span className="font-display font-black text-xl uppercase italic tracking-tighter -skew-x-6 text-brand-charcoal">
                  {authMode === 'login' ? 'SIGN IN DECK' : 'CREATE ACCOUNT'}
                </span>
                <button 
                  id="close-auth-modal-btn"
                  onClick={() => setAuthOpen(false)}
                  className="p-1.5 hover:bg-brand-charcoal/5 rounded-full text-brand-charcoal transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Form trigger submission */}
              <form onSubmit={handleAuthSubmit} className="space-y-4">
                
                {/* Email inputs */}
                <div>
                  <label className="block text-xs font-mono font-black uppercase text-brand-text-muted mb-1">
                    Email Database Address:
                  </label>
                  <input 
                    type="email" 
                    placeholder="e.g. techgames@sneaky.com" 
                    value={authEmail}
                    onChange={(e) => setAuthEmail(e.target.value)}
                    required
                    className="w-full p-3.5 bg-brand-gray-light text-brand-charcoal font-medium text-sm rounded-xl border border-brand-charcoal/10 focus:outline-none focus:ring-2 focus:ring-brand-volt"
                  />
                </div>

                {/* Password inputs */}
                <div>
                  <label className="block text-xs font-mono font-black uppercase text-brand-text-muted mb-1">
                    Security lock Password:
                  </label>
                  <input 
                    type="password" 
                    placeholder="Minimum 6 characters" 
                    value={authPassword}
                    onChange={(e) => setAuthPassword(e.target.value)}
                    required
                    className="w-full p-3.5 bg-brand-gray-light text-brand-charcoal font-medium text-sm rounded-xl border border-brand-charcoal/10 focus:outline-none focus:ring-2 focus:ring-brand-volt"
                  />
                </div>

                <div className="flex items-center justify-between text-xs py-1">
                  <label className="flex items-center gap-1.5 cursor-pointer text-brand-charcoal/80">
                    <input type="checkbox" className="rounded accent-brand-volt" defaultChecked />
                    <span>Remember terminal</span>
                  </label>
                  <a href="#" onClick={(e) => e.preventDefault()} className="text-brand-lime font-semibold hover:underline">Forgot passcode?</a>
                </div>

                {/* Action button */}
                <button
                  type="submit"
                  id="auth-submit-btn"
                  className="w-full py-4 bg-brand-charcoal text-white hover:text-brand-volt font-display font-black uppercase text-xs tracking-widest rounded-xl transition-all transform hover:scale-[1.02] active:scale-95 shadow-lg shadow-brand-charcoal/15 mt-2"
                >
                  {authMode === 'login' ? 'Proceed with Sign In' : 'Establish Member Deck'}
                </button>

                {/* Mode switcher toggle */}
                <div className="text-center pt-4 border-t border-brand-charcoal/5 mt-4 text-xs font-semibold text-brand-text-muted">
                  {authMode === 'login' ? (
                    <p>
                      New to Sneaky premium clan?{' '}
                      <button 
                        type="button" 
                        onClick={() => setAuthMode('register')}
                        className="text-brand-lime hover:underline font-bold"
                      >
                        Create an account card
                      </button>
                    </p>
                  ) : (
                    <p>
                      Already listed on our terminal?{' '}
                      <button 
                        type="button" 
                        onClick={() => setAuthMode('login')}
                        className="text-brand-lime hover:underline font-bold"
                      >
                        Sign in now
                      </button>
                    </p>
                  )}
                </div>

              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* -------------------- BRAND HIGHLIGHT STORIES banner -------------------- */}
      <section className="py-16 bg-gradient-to-b from-brand-bg to-brand-gray-light border-t border-brand-charcoal/5 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          <div className="flex flex-col gap-3 p-6 bg-white rounded-3xl border border-brand-charcoal/5 shadow-sm hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-brand-volt/20 text-brand-charcoal rounded-2xl flex items-center justify-center font-display font-bold text-lg self-center md:self-start">01</div>
            <h3 className="font-display font-extrabold text-lg text-brand-charcoal uppercase tracking-tight">Express shipping</h3>
            <p className="text-xs text-brand-text-muted leading-relaxed font-semibold">Every sneaker order is curated in double-boxed premium protective pods, leaving our global centers within 24 hours.</p>
          </div>
          <div className="flex flex-col gap-3 p-6 bg-white rounded-3xl border border-brand-charcoal/5 shadow-sm hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-brand-volt/20 text-brand-charcoal rounded-2xl flex items-center justify-center font-display font-bold text-lg self-center md:self-start">02</div>
            <h3 className="font-display font-extrabold text-lg text-brand-charcoal uppercase tracking-tight">30-day trial</h3>
            <p className="text-xs text-brand-text-muted leading-relaxed font-semibold">Put them to the sprint trial. If the fit, lock-down tendon support, or spring bounce does not meet your expectations, send them back.</p>
          </div>
          <div className="flex flex-col gap-3 p-6 bg-white rounded-3xl border border-brand-charcoal/5 shadow-sm hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-brand-volt/20 text-brand-charcoal rounded-2xl flex items-center justify-center font-display font-bold text-lg self-center md:self-start">03</div>
            <h3 className="font-display font-extrabold text-lg text-brand-charcoal uppercase tracking-tight">VIP sneaker care</h3>
            <p className="text-xs text-brand-text-muted leading-relaxed font-semibold">Our premium membership program unlocks custom neon high-vis alternative laces and free tactical waterproof protective spray.</p>
          </div>
        </div>
      </section>

      {/* -------------------- HISTORIC SNEAKER NEWSLETTER ARCHIVE -------------------- */}
      <section className="py-20 px-4 sm:px-8 bg-brand-volt border-t-2 border-brand-charcoal relative overflow-hidden">
        {/* Abstract design vector grids in background */}
        <div className="absolute top-0 right-1/4 w-80 h-80 rounded-full bg-brand-lime opacity-30 blur-2xl pointer-events-none" />
        
        <div className="max-w-5xl mx-auto flex flex-col items-center text-center gap-6 relative z-10">
          <div className="inline-flex items-center gap-1 px-3 py-1 bg-brand-charcoal text-white rounded-full font-mono text-[10px] font-black tracking-widest uppercase">
            ⚡ GET 15% DISCOUNT RIGHT AWAY
          </div>
          
          <h2 className="font-display font-black text-4xl sm:text-6xl text-brand-charcoal uppercase italic tracking-tighter max-w-2xl leading-none -skew-x-6">
            JOIN THE BRAND MEMBERSHIP TERM
          </h2>
          
          <p className="text-brand-charcoal/80 text-sm sm:text-base max-w-lg font-semibold leading-relaxed">
            Subscribe your email into our active terminal today to unlock exclusive sneaker releases, private drop codes, and premium design insights.
          </p>

          <div className="w-full max-w-md mt-4">
            {newsletterSubscribed ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-brand-charcoal text-white p-6 rounded-2xl border border-brand-volt shadow-lg"
              >
                <h4 className="font-display font-extrabold text-brand-volt text-lg uppercase flex items-center justify-center gap-2">
                  <Sparkles size={18} /> SUBSCRIPTION ACCEPTED!
                </h4>
                <p className="text-xs text-gray-300 mt-2 font-mono uppercase">
                  USE YOUR SECRET TERMINAL PRIVILEGE PASSCODE AT CHECKOUT:
                </p>
                <div className="bg-white/10 p-3 rounded-lg border border-white/10 font-mono text-base font-black tracking-widest text-brand-volt select-all cursor-copy mt-3">
                  SNEAKY15
                </div>
                <p className="text-[10px] text-gray-400 mt-2 leading-none">Your 15% discount code can be combined with sandbox mock purchases immediately.</p>
              </motion.div>
            ) : (
              <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-2.5">
                <input 
                  type="email" 
                  placeholder="Decrypt your 15% VIP discount code..." 
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  required
                  className="flex-1 p-4 bg-brand-charcoal text-white rounded-xl placeholder-white/45 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-brand-volt shadow-inner"
                />
                <button
                  type="submit"
                  id="newsletter-subscribe-btn"
                  className="py-4 px-6 md:px-8 bg-brand-charcoal hover:bg-brand-charcoal/90 text-brand-volt font-display font-black uppercase text-xs tracking-widest rounded-xl transition-all transform active:scale-95 shadow-lg flex items-center justify-center gap-2 group"
                >
                  <Send size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  <span>Subscribe</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* -------------------- FOOTER -------------------- */}
      <footer id="footer-section" className="bg-brand-charcoal text-white pt-20 pb-10 px-4 sm:px-8 border-t border-white/5 relative">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 pb-16 border-b border-white/10">
          
          {/* Logo brand message */}
          <div className="flex flex-col gap-6">
            <a href="#" className="flex items-center gap-2 group self-start">
              <div className="w-10 h-10 bg-brand-volt rounded-xl flex items-center justify-center relative overflow-hidden transition-transform duration-300 group-hover:scale-105">
                <span className="font-display font-black text-2xl text-brand-charcoal">S</span>
              </div>
              <span className="font-display font-extrabold text-2xl tracking-tighter -skew-x-6 text-white text-brand-volt">
                SNEAKY
              </span>
            </a>
            <p className="text-xs text-gray-400 leading-relaxed font-semibold">
              Delivering high-visibility athletic streetwear designs built upon precision carbon energy return layers for movement pioneers.
            </p>
            
            {/* Social handles */}
            <div className="flex items-center gap-3">
              <a href="#" className="p-2.5 bg-white/5 rounded-xl text-brand-volt hover:bg-brand-volt hover:text-brand-charcoal transition-colors">
                <Instagram size={16} />
              </a>
              <a href="#" className="p-2.5 bg-white/5 rounded-xl text-brand-volt hover:bg-brand-volt hover:text-brand-charcoal transition-colors">
                <Twitter size={16} />
              </a>
              <a href="#" className="p-2.5 bg-white/5 rounded-xl text-brand-volt hover:bg-brand-volt hover:text-brand-charcoal transition-colors">
                <Facebook size={16} />
              </a>
            </div>
          </div>

          {/* Links 1 */}
          <div className="flex flex-col gap-4">
            <h4 className="font-display font-black text-xs uppercase tracking-widest text-brand-volt italic">Quick navigation</h4>
            <div className="flex flex-col gap-2.5 text-xs text-gray-400 font-semibold uppercase tracking-wide">
              <a href="#" className="hover:text-white transition-colors">Member Homepage</a>
              <a href="#about-section" className="hover:text-white transition-colors">Our core story</a>
              <a href="#popular-section" className="hover:text-white transition-colors">Store releases</a>
              <a href="#tech-section" className="hover:text-white transition-colors">Propulsion lab specs</a>
              <a href="#tech-section" className="hover:text-white transition-colors">VIP trial cards</a>
            </div>
          </div>

          {/* Links 2 */}
          <div className="flex flex-col gap-4">
            <h4 className="font-display font-black text-xs uppercase tracking-widest text-brand-volt italic">Support terminal</h4>
            <div className="flex flex-col gap-2.5 text-xs text-gray-400 font-semibold uppercase tracking-wide">
              <a href="#" className="hover:text-white transition-colors">Biomechanical fitting</a>
              <a href="#" className="hover:text-white transition-colors">Secure shipment returns</a>
              <a href="#" className="hover:text-white transition-colors">Pod packaging recyclability</a>
              <a href="#" className="hover:text-white transition-colors">Sandbox simulation questions</a>
              <a href="#" className="hover:text-white transition-colors">Active member portal</a>
            </div>
          </div>

          {/* Location details */}
          <div className="flex flex-col gap-4">
            <h4 className="font-display font-black text-xs uppercase tracking-widest text-brand-volt italic">Location anchor</h4>
            <div className="flex flex-col gap-3.5 text-xs text-gray-400 font-semibold">
              <div className="flex items-start gap-2.5">
                <MapPin size={16} className="text-brand-volt shrink-0 mt-0.5" />
                <span>842 Concrete Corridor, Sub-culture Block 49, Paris, France</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone size={16} className="text-brand-volt shrink-0" />
                <span>+33 (1) 423-7485</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail size={16} className="text-brand-volt shrink-0" />
                <span className="hover:text-white transition-colors">labs@sneaky.com</span>
              </div>
            </div>
          </div>

        </div>

        {/* Outer credit lines conforming to architecture guidelines: humble, literal, clean */}
        <div className="max-w-7xl mx-auto pt-10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-semibold text-gray-500 font-mono">
          <p>© 2026 SNEAKY ATHLETICS. ALL Sandbox mock rights applied.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">PASSCODE LOCKS</a>
            <a href="#" className="hover:text-white transition-colors">PRIVACY TERMINAL</a>
            <a href="#" className="hover:text-white transition-colors">TERMS OF MOTION</a>
          </div>
        </div>
      </footer>

    </div>
  );
}
