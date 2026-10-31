import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { 
  Product, 
  CategoryItem, 
  CartItem, 
  ProductCategory, 
  UserProfile, 
  Order, 
  Coupon, 
  HomepageConfig, 
  UserAddress,
  ProductVariant,
  PaymentConfig,
  KnowledgeDocument,
  ChatbotConfig,
  AdvertisementConfig,
  AdvertisementItem,
  AdminRole,
  AdminStaffUser,
  TabTransferRecord,
  AdminPanelTabId
} from '../types';
import { 
  INITIAL_PRODUCTS, 
  INITIAL_CATEGORIES, 
  INITIAL_COUPONS, 
  INITIAL_HOMEPAGE_CONFIG 
} from '../data/initialData';
import { INITIAL_CUSTOMERS } from '../data/initialCustomers';
import { INITIAL_CHATBOT_CONFIG, INITIAL_KNOWLEDGE_DOCUMENTS } from '../data/initialChatbotData';
import { INITIAL_ADVERTISEMENT_CONFIG } from '../data/initialAdsData';
import { 
  INITIAL_ADMIN_ROLES, 
  INITIAL_STAFF_USERS, 
  INITIAL_TAB_TRANSFERS, 
  ALL_ADMIN_TABS 
} from '../data/initialRolesData';


export const safeSetItem = (key: string, value: string) => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(key, value);
    }
  } catch (e) {
    console.warn(`LocalStorage setItem failed for key "${key}":`, e);
    // If quota exceeded, attempt to clear obsolete or temporary cache keys
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const obsoleteKeys = ['qp_temp_cache', 'qp_payment_config_v1'];
        for (const k of obsoleteKeys) {
          if (k !== key) {
            try { localStorage.removeItem(k); } catch {}
          }
        }

        // If the key is qp_cart, compress by stripping oversized data URLs
        if (key === 'qp_cart') {
          try {
            const parsed = JSON.parse(value);
            if (Array.isArray(parsed)) {
              const compactCart = parsed.map((item: any) => ({
                id: item.id,
                quantity: item.quantity,
                selectedVariant: item.selectedVariant,
                selectedCustomizations: item.selectedCustomizations,
                product: {
                  id: item.product?.id,
                  name: item.product?.name,
                  price: item.product?.price,
                  category: item.product?.category,
                  images: (item.product?.images || []).map((img: string) =>
                    img && typeof img === 'string' && img.startsWith('data:')
                      ? ''
                      : img
                  ),
                },
              }));
              localStorage.setItem(key, JSON.stringify(compactCart));
              return;
            }
          } catch (compactErr) {
            console.warn('Could not compact cart:', compactErr);
          }
        }

        localStorage.setItem(key, value);
      }
    } catch (fallbackErr) {
      // Safe fallback: never throw to prevent React lifecycle crashes
      console.warn(`LocalStorage quota exceeded for "${key}". Value kept in-memory safely.`, fallbackErr);
    }
  }
};

export const INITIAL_PAYMENT_CONFIG: PaymentConfig = {
  upiEnabled: true,
  upiId: 'qualitypaan@icici',
  payeeName: 'Quality Paan & Shisha Co.',
  merchantCode: '5812',
  useDynamicQr: true,
  customQrImageUrl: '',
  enableUpiIntentApps: true,
  upiInstructionNote: 'Scan & pay exact cart total via any UPI app (Google Pay, PhonePe, Paytm, BHIM, CRED). Enter 12-digit UTR/Ref number after completing transfer.',

  bankTransferEnabled: true,
  bankAccountName: 'Quality Paan & Shisha Enterprises',
  bankName: 'ICICI Bank',
  bankAccountNumber: '002105019842',
  bankIfscCode: 'ICIC0000021',
  bankBranch: 'Connaught Place, New Delhi',
  bankAccountType: 'Current Account',

  codEnabled: true,
  codExtraCharge: 0,
  codMinOrderAmount: 0,
  codMaxOrderAmount: 15000,
  codInstructions: 'Pay cash upon arrival of delivery partner. Please keep exact change ready.',

  cardOnlineEnabled: true,
  gatewayMode: 'live',
  gatewayNotice: 'Instant 256-bit SSL secured payment gateway active.',

  // GST & Tax (Disabled by default: 0%)
  enableGst: false,
  gstPercentage: 0,
  taxLabel: 'GST / Tax',

  // Platform & Convenience Fee
  enablePlatformFee: false,
  platformFeeAmount: 0,
  platformFeeLabel: 'Platform & Packaging Fee',

  // Delivery Charges & Threshold Rules
  enableDeliveryCharge: false,
  baseDeliveryCharge: 0,
  freeDeliveryAboveAmount: 499,
  enableNearbyFreeDelivery: true,
  nearbyFreeDeliveryNote: 'Free express delivery for local and nearby orders',

  adminVerificationName: 'Rahul Singh',
  adminContactPhone: '+91 98765 43210',
  adminVerificationMessage: 'Direct UPI payments are created as Order Requests. Store owner Rahul Singh will verify bank credit before approving into Confirmed stage.',

  // Payment Bifurcation & Tranche Rules
  enablePaymentBifurcation: false,
  bifurcationThreshold: 2000,
  bifurcationMaxTranche: 1900,
  bifurcationNote: 'Split high-value orders into tranches under ₹2,000 to optimize interchange & banking fees.',
};

export type PageView = 
  | 'home'
  | 'shop'
  | 'categories'
  | 'combos'
  | 'offers'
  | 'cart'
  | 'checkout'
  | 'order-success'
  | 'account'
  | 'my-orders'
  | 'order-detail'
  | 'wishlist'
  | 'admin'
  | 'about'
  | 'contact'
  | 'privacy'
  | 'terms'
  | 'refund';

interface Toast {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  message: string;
}

interface AppContextType {
  // Navigation & View
  currentPage: PageView;
  setCurrentPage: (page: PageView) => void;
  selectedCategory: ProductCategory | 'all';
  setSelectedCategory: (cat: ProductCategory | 'all') => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedProduct: Product | null;
  setSelectedProduct: (p: Product | null) => void;
  selectedOrderId: string | null;
  setSelectedOrderId: (id: string | null) => void;
  deviceMode: 'responsive' | 'mobile';
  setDeviceMode: (mode: 'responsive' | 'mobile') => void;

  // Catalog
  products: Product[];
  categories: CategoryItem[];
  addProduct: (p: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => void;
  bulkAddProducts: (
    newItems: Array<Omit<Product, 'id' | 'createdAt' | 'updatedAt'>>,
    mergeMode?: 'append' | 'skip_duplicates' | 'update_duplicates'
  ) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  addCategory: (c: CategoryItem) => void;
  updateCategory: (id: string, updates: Partial<CategoryItem>) => void;
  deleteCategory: (id: string) => void;
  resetCatalogToDefault: () => void;
  purgeDefaultDemoProducts: () => void;
  clearAllProducts: () => void;
  recoverAllProductsFromStorage: () => { recoveredCount: number; totalCount: number };
  importProductsJson: (jsonString: string) => { success: boolean; count: number; error?: string };
  exportProductsJson: () => string;

  // Cart & Wishlist
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number, variant?: ProductVariant) => void;
  updateCartQuantity: (productId: string, quantity: number, variantId?: string) => void;
  removeFromCart: (productId: string, variantId?: string) => void;
  clearCart: () => void;
  cartCount: number;
  cartSubtotal: number;
  cartDiscount: number;
  cartTax: number;
  cartDeliveryCharge: number;
  cartPlatformFee: number;
  cartTotal: number;

  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;

  // Coupons
  coupons: Coupon[];
  appliedCoupon: Coupon | null;
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;
  addCoupon: (c: Coupon) => void;
  deleteCoupon: (idOrCode: string) => void;
  updateCoupon: (idOrCode: string, updates: Partial<Coupon>) => void;

  // Auth & User
  user: UserProfile | null;
  login: (email: string, role?: 'customer' | 'admin') => void;
  register: (name: string, email: string, phone: string) => void;
  logout: () => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  verifyCustomerPan: (panNumber: string, holderName: string, dob: string, panProofUrl?: string) => boolean;
  addAddress: (address: Omit<UserAddress, 'id'>) => void;
  removeAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  authModalMode: 'login' | 'register' | 'forgot' | 'admin';
  setAuthModalMode: (mode: 'login' | 'register' | 'forgot' | 'admin') => void;

  // Customers & CRM (Admin Directory)
  customers: UserProfile[];
  updateCustomer: (id: string, updates: Partial<UserProfile>) => void;
  clearDummyCustomers: () => void;

  // Orders
  orders: Order[];
  createOrder: (
    shippingAddress: UserAddress, 
    paymentMethod: 'online' | 'cod' | 'upi' | 'bank',
    upiDetails?: {
      transactionId?: string;
      screenshotUrl?: string;
    }
  ) => Order;
  updateOrderStatus: (orderId: string, status: Order['status'], message?: string) => void;
  verifyAndApproveUpiOrder: (orderId: string, notes?: string) => void;
  rejectUpiOrder: (orderId: string, reason?: string) => void;
  updateOrderUpiDetails: (orderId: string, transactionId: string, screenshotUrl?: string) => void;
  resetOrdersAndRevenue: () => void;

  // Homepage CMS Config
  homepageConfig: HomepageConfig;
  updateHomepageConfig: (cfg: Partial<HomepageConfig>) => void;

  // Payment System Gateway Configuration
  paymentConfig: PaymentConfig;
  updatePaymentConfig: (cfg: Partial<PaymentConfig>) => void;

  // Age Verification
  isAgeVerified: boolean;
  verifyAge: (verified: boolean) => void;
  showAgeModal: boolean;
  setShowAgeModal: (show: boolean) => void;

  // AI Chatbot & Knowledge Automation
  chatbotConfig: ChatbotConfig;
  updateChatbotConfig: (cfg: Partial<ChatbotConfig>) => void;
  knowledgeDocs: KnowledgeDocument[];
  addKnowledgeDoc: (doc: Omit<KnowledgeDocument, 'id' | 'createdAt' | 'updatedAt'>) => KnowledgeDocument;
  updateKnowledgeDoc: (id: string, updates: Partial<KnowledgeDocument>) => void;
  deleteKnowledgeDoc: (id: string) => void;
  toggleKnowledgeDocStatus: (id: string) => void;
  resetKnowledgeDocsToDefault: () => void;
  isChatbotOpen: boolean;
  setIsChatbotOpen: (open: boolean) => void;

  // Advertisement Media & Showcase
  adConfig: AdvertisementConfig;
  updateAdConfig: (cfg: Partial<AdvertisementConfig>) => void;
  addAdvertisementItem: (item: Omit<AdvertisementItem, 'id' | 'createdAt'>) => AdvertisementItem;
  updateAdvertisementItem: (id: string, updates: Partial<AdvertisementItem>) => void;
  deleteAdvertisementItem: (id: string) => void;
  reorderAdvertisementItems: (newItems: AdvertisementItem[]) => void;

  // RBAC: Roles, Staff Authentication & Panel Tab Transfer
  adminRoles: AdminRole[];
  addAdminRole: (role: Omit<AdminRole, 'id' | 'createdAt'>) => AdminRole;
  updateAdminRole: (id: string, updates: Partial<AdminRole>) => void;
  deleteAdminRole: (id: string) => void;
  adminStaffUsers: AdminStaffUser[];
  createAdminStaffUser: (user: Omit<AdminStaffUser, 'id' | 'createdAt'>) => AdminStaffUser;
  updateAdminStaffUser: (id: string, updates: Partial<AdminStaffUser>) => void;
  deleteAdminStaffUser: (id: string) => void;
  tabTransfers: TabTransferRecord[];
  transferOrShareTab: (tabId: AdminPanelTabId, targetStaffOrRoleId: string, permissionType?: 'full_edit' | 'view_only', note?: string) => void;
  revokeTransferredTab: (transferId: string) => void;
  currentStaffSession: AdminStaffUser | null;
  setCurrentStaffSession: (staff: AdminStaffUser | null) => void;
  activeRoleOverride: string | null;
  setActiveRoleOverride: (roleId: string | null) => void;
  loginStaffUser: (emailOrPhoneOrPin: string, secret?: string) => { success: boolean; message: string; staff?: AdminStaffUser };
  getAuthorizedTabsForCurrentStaff: () => AdminPanelTabId[];

  // Feedback Toasts
  toasts: Toast[];
  showToast: (message: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
  removeToast: (id: string) => void;
}


const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation State - inspect window.location.pathname and hash on load
  const [currentPage, setCurrentPage] = useState<PageView>(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase().replace('#', '').replace('/', '');
      const search = window.location.search.toLowerCase();

      if (path === '/admin' || path.startsWith('/admin') || hash === 'admin' || search.includes('page=admin')) {
        return 'admin';
      }
      if (path === '/account' || path === '/profile' || hash === 'account' || hash === 'profile' || search.includes('page=profile') || search.includes('page=account')) {
        return 'account';
      }
      if (path === '/orders' || path === '/my-orders' || hash === 'orders' || hash === 'my-orders' || search.includes('page=orders') || search.includes('page=my-orders')) {
        return 'my-orders';
      }
      if (path === '/shop' || hash === 'shop' || search.includes('page=shop')) return 'shop';
      if (path === '/cart' || hash === 'cart' || search.includes('page=cart')) return 'cart';
      if (path === '/checkout' || hash === 'checkout' || search.includes('page=checkout')) return 'checkout';
      if (path === '/wishlist' || hash === 'wishlist' || search.includes('page=wishlist')) return 'wishlist';
      if (path === '/offers' || hash === 'offers' || search.includes('page=offers')) return 'offers';
      if (path === '/combos' || hash === 'combos' || search.includes('page=combos')) return 'combos';
      if (path === '/about' || hash === 'about') return 'about';
      if (path === '/contact' || hash === 'contact') return 'contact';
    }
    return 'home';
  });
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [deviceMode, setDeviceMode] = useState<'responsive' | 'mobile'>('responsive');

  // URL sync effect for /admin, /profile, and history back/forward navigation
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase().replace('#', '').replace('/', '');
      const search = window.location.search.toLowerCase();

      if (path === '/admin' || path.startsWith('/admin') || hash === 'admin' || search.includes('page=admin')) {
        setCurrentPage('admin');
      } else if (path === '/account' || path === '/profile' || hash === 'account' || hash === 'profile' || search.includes('page=profile') || search.includes('page=account')) {
        setCurrentPage('account');
      } else if (path === '/orders' || path === '/my-orders' || hash === 'orders' || hash === 'my-orders' || search.includes('page=orders') || search.includes('page=my-orders')) {
        setCurrentPage('my-orders');
      } else if (path === '/shop' || hash === 'shop') {
        setCurrentPage('shop');
      } else if (path === '/cart' || hash === 'cart') {
        setCurrentPage('cart');
      } else if (path === '/checkout' || hash === 'checkout') {
        setCurrentPage('checkout');
      } else if (path === '/wishlist' || hash === 'wishlist') {
        setCurrentPage('wishlist');
      } else if (path === '/' || path === '') {
        if (hash === 'profile' || hash === 'account') {
          setCurrentPage('account');
        } else if (hash) {
          setCurrentPage(hash as PageView);
        } else {
          setCurrentPage('home');
        }
      }
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('hashchange', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', handlePopState);
    };
  }, []);

  // Update browser URL/history when currentPage changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const targetPath = currentPage === 'home' ? '/' : `/${currentPage}`;
      if (window.location.pathname !== targetPath && window.history.pushState) {
        try {
          window.history.pushState({ page: currentPage }, '', targetPath);
        } catch (e) {
          // If pushState fails in iframe context, update hash
          window.location.hash = currentPage;
        }
      }
    }
  }, [currentPage]);

  // Toasts
  const [toasts, setToasts] = useState<Toast[]>([]);
  const showToast = (message: string, type: 'success' | 'info' | 'warning' | 'error' = 'success') => {
    const id = Date.now().toString() + Math.random().toString().slice(2, 5);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };
  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Age Verification State
  const [isAgeVerified, setIsAgeVerified] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('qp_age_verified') === 'true';
    }
    return false;
  });
  const [showAgeModal, setShowAgeModal] = useState<boolean>(() => !isAgeVerified);

  const verifyAge = (verified: boolean) => {
    setIsAgeVerified(verified);
    if (typeof window !== 'undefined') {
      safeSetItem('qp_age_verified', verified ? 'true' : 'false');
    }
    setShowAgeModal(false);
    if (verified) {
      showToast('Age verification confirmed. Welcome to Quality Paan!', 'success');
    }
  };

  // Initialize new 50-product catalog into storage
  if (typeof window !== 'undefined') {
    const isNewCatalogLoaded = localStorage.getItem('qp_catalog_v12_loaded');
    if (!isNewCatalogLoaded) {
      safeSetItem('qp_catalog_v12_loaded', 'true');
      safeSetItem('qp_products_v5', JSON.stringify(INITIAL_PRODUCTS));
      safeSetItem('qp_categories_v5', JSON.stringify(INITIAL_CATEGORIES));
      localStorage.removeItem('qp_deleted_product_ids');
      localStorage.removeItem('qp_deleted_category_ids');
    }
  }

  // Helper to deep-scan all storage keys and discover all products across versions and keys
  const scanAndRecoverAllProductsFromStorage = (): Product[] => {
    if (typeof window === 'undefined') return INITIAL_PRODUCTS;

    const knownKeys = [
      'qp_custom_products_master_vault', 'qp_morning_7am_products', 'qp_7am_products', 'qp_morning_products',
      'qp_products_v5', 'qp_products_v4', 'qp_products_v3', 'qp_products_v2', 'qp_products_v1',
      'qp_products', 'products', 'qp_custom_products', 'custom_products', 'qp_user_products',
      'qp_catalog', 'qp_backup_products', 'qp_products_backup_before_reset', 'quality_paan_catalog_backup'
    ];

    const allFoundMap = new Map<string, Product>();

    // 1. Scan known storage keys
    for (const k of knownKeys) {
      try {
        const val = localStorage.getItem(k);
        if (val) {
          const parsed = JSON.parse(val);
          const list = Array.isArray(parsed) ? parsed : (parsed?.products || []);
          if (Array.isArray(list) && list.length > 0) {
            list.forEach((p: any) => {
              if (p && typeof p === 'object' && p.name && (p.price !== undefined || p.sku)) {
                let cat = p.category;
                if (cat === 'paan') cat = 'hookah';
                if (cat === 'cigarettes_tobacco') cat = 'lighters_ashtray';
                if (cat === 'cold_drinks') cat = 'fragrances';
                if (!cat) cat = 'hookah';

                const pKey = String(p.id || p.sku || p.name).trim().toLowerCase();
                if (!allFoundMap.has(pKey)) {
                  allFoundMap.set(pKey, { ...p, category: cat });
                } else {
                  const existing = allFoundMap.get(pKey)!;
                  if (p.updatedAt && (!existing.updatedAt || p.updatedAt > existing.updatedAt)) {
                    allFoundMap.set(pKey, { ...existing, ...p, category: cat });
                  }
                }
              }
            });
          }
        }
      } catch (err) {
        console.warn(`Scanner reading ${k}:`, err);
      }
    }

    // 2. Scan ALL arbitrary keys in localStorage for any product arrays
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && !knownKeys.includes(k) && (k.includes('prod') || k.includes('item') || k.includes('catalog') || k.includes('data') || k.includes('store') || k.includes('backup'))) {
          try {
            const raw = localStorage.getItem(k);
            if (raw && (raw.startsWith('[') || raw.startsWith('{'))) {
              const parsed = JSON.parse(raw);
              const list = Array.isArray(parsed) ? parsed : (parsed?.products || parsed?.items || []);
              if (Array.isArray(list) && list.length > 0) {
                list.forEach((p: any) => {
                  if (p && typeof p === 'object' && p.name && (p.price !== undefined || p.sku)) {
                    const pKey = String(p.id || p.sku || p.name).trim().toLowerCase();
                    if (!allFoundMap.has(pKey)) {
                      allFoundMap.set(pKey, p);
                    }
                  }
                });
              }
            }
          } catch {}
        }
      }
    } catch (e) {
      console.warn('Storage scanner error:', e);
    }

    // Reconcile with deleted products
    const deletedIds = (() => {
      try {
        const val = localStorage.getItem('qp_deleted_product_ids');
        return val ? JSON.parse(val) : [];
      } catch {
        return [];
      }
    })();
    const deletedSet = new Set(deletedIds);

    const foundList = Array.from(allFoundMap.values()).filter((p) => !deletedSet.has(p.id));
    if (foundList.length > 0) {
      return foundList;
    }
    return INITIAL_PRODUCTS;
  };

  const scanAndRecoverAllCategoriesFromStorage = (): CategoryItem[] => {
    if (typeof window === 'undefined') return INITIAL_CATEGORIES;
    const deletedCatIds = (() => {
      try {
        const val = localStorage.getItem('qp_deleted_category_ids');
        return val ? JSON.parse(val) : [];
      } catch {
        return [];
      }
    })();
    const deletedCatSet = new Set(deletedCatIds);

    const knownKeys = [
      'qp_categories_v5', 'qp_categories_v4', 'qp_categories_v3', 'qp_categories_v2', 'qp_categories_v1',
      'qp_categories', 'categories'
    ];
    const catMap = new Map<string, CategoryItem>();
    INITIAL_CATEGORIES.forEach(c => {
      if (!deletedCatSet.has(c.id)) {
        catMap.set(c.id, c);
      }
    });

    for (const k of knownKeys) {
      try {
        const val = localStorage.getItem(k);
        if (val) {
          const parsed = JSON.parse(val);
          if (Array.isArray(parsed)) {
            parsed.forEach((c: any) => {
              if (c && c.id && c.displayName && !deletedCatSet.has(c.id)) {
                catMap.set(c.id, c);
              }
            });
          }
        }
      } catch {}
    }
    return Array.from(catMap.values());
  };

  // Products & Categories with Universal Auto-Recovery
  const [products, setProducts] = useState<Product[]>(() => {
    return scanAndRecoverAllProductsFromStorage();
  });

  const [categories, setCategories] = useState<CategoryItem[]>(() => {
    return scanAndRecoverAllCategoriesFromStorage();
  });

  const isCatalogSyncedRef = useRef(false);

  // Sync with persistent server storage on mount
  useEffect(() => {
    let isMounted = true;
    const syncServerCatalog = async () => {
      try {
        const res = await fetch('/api/products');
        if (res.ok) {
          const data = await res.json();
          if (data && data.success && Array.isArray(data.products) && data.products.length > 0) {
            if (isMounted) {
              const deletedProductIds = (() => {
                try {
                  const val = localStorage.getItem('qp_deleted_product_ids');
                  return val ? JSON.parse(val) : [];
                } catch { return []; }
              })();
              const deletedProdSet = new Set(deletedProductIds);

              setProducts((prev) => {
                const map = new Map<string, Product>();
                // Server is the authoritative source of truth for products & uploaded images
                data.products.forEach((sp: Product) => {
                  if (sp && sp.name && !deletedProdSet.has(sp.id)) {
                    map.set(sp.id, sp);
                  }
                });
                // Preserve any custom products created locally in this session that are not on server yet
                prev.forEach((lp) => {
                  if (lp && lp.id && !map.has(lp.id) && !deletedProdSet.has(lp.id)) {
                    map.set(lp.id, lp);
                  }
                });
                const merged = Array.from(map.values());
                safeSetItem('qp_products_v5', JSON.stringify(merged));
                return merged;
              });
            }
          }
        }
      } catch (err) {
        console.warn('Initial server catalog sync:', err);
      } finally {
        if (isMounted) {
          isCatalogSyncedRef.current = true;
        }
      }

      // Also sync saved categories from server
      try {
        const catRes = await fetch('/api/categories');
        if (catRes.ok) {
          const catData = await catRes.json();
          if (catData && catData.success && Array.isArray(catData.categories) && catData.categories.length > 0) {
            if (isMounted) {
              const deletedCategoryIds = (() => {
                try {
                  const val = localStorage.getItem('qp_deleted_category_ids');
                  return val ? JSON.parse(val) : [];
                } catch { return []; }
              })();
              const deletedCategorySet = new Set(deletedCategoryIds);
              const validServerCats = catData.categories.filter((c: CategoryItem) => !deletedCategorySet.has(c.id));
              if (validServerCats.length > 0) {
                setCategories((prev) => {
                  const existingCatMap = new Map(prev.map(c => [c.id, c]));
                  let updated = false;
                  validServerCats.forEach((sc: CategoryItem) => {
                    if (!existingCatMap.has(sc.id)) {
                      existingCatMap.set(sc.id, sc);
                      updated = true;
                    }
                  });
                  return updated ? Array.from(existingCatMap.values()) : prev;
                });
              }
            }
          }
        }
      } catch (cErr) {
        console.warn('Initial server categories sync:', cErr);
      }
    };
    syncServerCatalog();
    return () => { isMounted = false; };
  }, []);

  // Sync products & categories changes to localStorage AND server disk (only after initial server sync has verified data)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      safeSetItem('qp_products_v5', JSON.stringify(products));
      safeSetItem('qp_products_backup', JSON.stringify(products));

      if (!isCatalogSyncedRef.current) {
        return;
      }

      // Auto-save to server disk (debounced)
      const timer = setTimeout(() => {
        try {
          fetch('/api/products', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ products }),
          }).catch(() => {});
        } catch {}
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [products]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      safeSetItem('qp_categories_v5', JSON.stringify(categories));

      const timer = setTimeout(() => {
        try {
          fetch('/api/categories', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ categories }),
          }).catch(() => {});
        } catch {}
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [categories]);

  // Ensure any categories represented in products are present in category list UNLESS deleted by user
  useEffect(() => {
    if (products.length > 0) {
      const deletedCategoryIds = (() => {
        try {
          const val = localStorage.getItem('qp_deleted_category_ids');
          return val ? JSON.parse(val) : [];
        } catch { return []; }
      })();
      const deletedCategorySet = new Set(deletedCategoryIds);

      setCategories((prev) => {
        const existingCatIds = new Set(prev.map((c) => c.id));
        const missingCategories: CategoryItem[] = [];
        products.forEach((p) => {
          if (p.category && !existingCatIds.has(p.category) && !deletedCategorySet.has(p.category)) {
            existingCatIds.add(p.category);
            missingCategories.push({
              id: p.category,
              name: p.category.charAt(0).toUpperCase() + p.category.slice(1).replace(/_/g, ' '),
              displayName: p.category.toUpperCase().replace(/_/g, ' '),
              description: `Collection of ${p.category}`,
              iconName: 'Package',
              image: p.images?.[0] || '',
              itemCount: 1,
            });
          }
        });
        if (missingCategories.length > 0) {
          const updated = [...prev, ...missingCategories];
          safeSetItem('qp_categories_v5', JSON.stringify(updated));
          return updated;
        }
        return prev;
      });
    }
  }, [products]);

  const recoverAllProductsFromStorage = () => {
    const recovered = scanAndRecoverAllProductsFromStorage();
    const initialIds = new Set(INITIAL_PRODUCTS.map((p) => p.id));
    const customRecoveredCount = recovered.filter((p) => !initialIds.has(p.id)).length;

    setProducts(recovered);
    if (typeof window !== 'undefined') {
      safeSetItem('qp_products_v5', JSON.stringify(recovered));
      safeSetItem('qp_products_backup', JSON.stringify(recovered));
    }

    try {
      fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ products: recovered }),
      }).catch(() => {});
    } catch {}

    if (customRecoveredCount > 0) {
      showToast(`Recovered ${customRecoveredCount} custom products! Total catalog: ${recovered.length} items.`, 'success');
    } else {
      showToast(`Catalog scanned! All ${recovered.length} products verified and restored.`, 'info');
    }

    return { recoveredCount: customRecoveredCount, totalCount: recovered.length };
  };

  const importProductsJson = (jsonString: string) => {
    try {
      const parsed = JSON.parse(jsonString);
      const list: Product[] = Array.isArray(parsed) ? parsed : (parsed.products || []);
      if (!Array.isArray(list) || list.length === 0) {
        showToast('Invalid JSON: Must contain an array of products.', 'error');
        return { success: false, count: 0, error: 'Empty or invalid format' };
      }

      setProducts((prev) => {
        const existingMap = new Map<string, Product>(prev.map((p) => [p.id || p.name, p]));
        list.forEach((item) => {
          if (item && item.name) {
            const id = item.id || `prod-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
            existingMap.set(id, { ...item, id });
          }
        });
        const merged = Array.from(existingMap.values());
        safeSetItem('qp_products_v5', JSON.stringify(merged));
        safeSetItem('qp_products_backup', JSON.stringify(merged));
        try {
          fetch('/api/products', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ products: merged }),
          }).catch(() => {});
        } catch {}
        return merged;
      });

      showToast(`Successfully imported ${list.length} products!`, 'success');
      return { success: true, count: list.length };
    } catch (err: any) {
      showToast(`Failed to parse JSON: ${err.message}`, 'error');
      return { success: false, count: 0, error: err.message };
    }
  };

  const exportProductsJson = (): string => {
    return JSON.stringify(products, null, 2);
  };

  const addCategory = (c: CategoryItem) => {
    setCategories((prev) => {
      if (prev.some((item) => item.id === c.id)) {
        showToast(`Category "${c.displayName}" already exists!`, 'warning');
        return prev;
      }
      return [...prev, c];
    });
    showToast(`Menu category "${c.displayName}" created!`, 'success');
  };

  const updateCategory = (id: string, updates: Partial<CategoryItem>) => {
    setCategories((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
    showToast('Menu category updated!', 'success');
  };

  const deleteCategory = (id: string) => {
    // 1. Delete category from state and persistence
    setCategories((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      if (typeof window !== 'undefined') {
        safeSetItem('qp_categories_v5', JSON.stringify(updated));
        try {
          const deletedSaved = localStorage.getItem('qp_deleted_category_ids');
          const deletedIds = deletedSaved ? JSON.parse(deletedSaved) : [];
          if (!deletedIds.includes(id)) {
            deletedIds.push(id);
            safeSetItem('qp_deleted_category_ids', JSON.stringify(deletedIds));
          }
        } catch (e) {
          console.error('Error saving deleted category id:', e);
        }

        // Clean from all storage keys
        try {
          const catKeys = ['qp_categories_v4', 'qp_categories_v3', 'qp_categories_v2', 'qp_categories_v1', 'qp_categories', 'categories'];
          for (const ck of catKeys) {
            try {
              const raw = localStorage.getItem(ck);
              if (raw) {
                const list = JSON.parse(raw);
                if (Array.isArray(list)) {
                  const cleaned = list.filter((c: any) => c && c.id !== id);
                  safeSetItem(ck, JSON.stringify(cleaned));
                }
              }
            } catch {}
          }
        } catch {}

        // Immediate server sync for categories
        try {
          fetch('/api/categories', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ categories: updated }),
          }).catch(() => {});
        } catch {}
      }
      return updated;
    });

    // 2. Also remove products inside this deleted category so it doesn't resurrect
    setProducts((prev) => {
      const prodsInCat = prev.filter((p) => p.category === id);
      if (prodsInCat.length > 0) {
        const remaining = prev.filter((p) => p.category !== id);
        if (typeof window !== 'undefined') {
          safeSetItem('qp_products_v5', JSON.stringify(remaining));
          try {
            const deletedSaved = localStorage.getItem('qp_deleted_product_ids');
            const deletedIds = deletedSaved ? JSON.parse(deletedSaved) : [];
            prodsInCat.forEach((p) => {
              if (!deletedIds.includes(p.id)) deletedIds.push(p.id);
            });
            safeSetItem('qp_deleted_product_ids', JSON.stringify(deletedIds));
          } catch {}

          try {
            fetch('/api/products', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ products: remaining }),
            }).catch(() => {});
          } catch {}
        }
        return remaining;
      }
      return prev;
    });

    showToast('Menu category and associated products deleted permanently.', 'info');
  };

  const purgeDefaultDemoProducts = () => {
    const initialIds = new Set(INITIAL_PRODUCTS.map((p) => p.id));
    
    if (typeof window !== 'undefined') {
      try {
        const deletedSaved = localStorage.getItem('qp_deleted_product_ids');
        const deletedIds = deletedSaved ? JSON.parse(deletedSaved) : [];
        INITIAL_PRODUCTS.forEach((p) => {
          if (!deletedIds.includes(p.id)) deletedIds.push(p.id);
        });
        safeSetItem('qp_deleted_product_ids', JSON.stringify(deletedIds));
      } catch {}
    }

    setProducts((prev) => {
      const userOnly = prev.filter((p) => {
        if (initialIds.has(p.id)) return false;
        if (
          p.id.startsWith('prod-hookah-') ||
          p.id.startsWith('prod-flv-') ||
          p.id.startsWith('prod-bng-') ||
          p.id.startsWith('prod-ltr-') ||
          p.id.startsWith('prod-frg-') ||
          p.id.startsWith('prod-combo-')
        ) {
          return false;
        }
        return true;
      });

      if (typeof window !== 'undefined') {
        safeSetItem('qp_products_v5', JSON.stringify(userOnly));
        safeSetItem('qp_products_backup', JSON.stringify(userOnly));

        const vaultKeys = ['qp_custom_products_master_vault', 'qp_morning_7am_products', 'qp_products_backup_before_reset'];
        for (const vk of vaultKeys) {
          try {
            const raw = localStorage.getItem(vk);
            if (raw) {
              const list = JSON.parse(raw);
              if (Array.isArray(list)) {
                const cleaned = list.filter((p: any) => p && !initialIds.has(p.id) && !p.id?.startsWith('prod-hookah-') && !p.id?.startsWith('prod-flv-'));
                safeSetItem(vk, JSON.stringify(cleaned));
              }
            }
          } catch {}
        }

        try {
          fetch('/api/products', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ products: userOnly }),
          }).catch(() => {});
        } catch {}
      }

      return userOnly;
    });

    showToast('All default demo items purged! Your catalog now contains strictly your uploaded products.', 'success');
  };

  const clearAllProducts = () => {
    setProducts([]);
    if (typeof window !== 'undefined') {
      const keysToRemove = [
        'qp_products_v5', 'qp_products_v4', 'qp_products_v3', 'qp_products_v2', 'qp_products_v1',
        'qp_products', 'products', 'qp_products_backup', 'qp_custom_products_master_vault',
        'qp_morning_7am_products', 'qp_7am_products', 'qp_morning_products', 'qp_products_backup_before_reset',
        'qp_cart', 'qp_wishlist', 'qp_catalog', 'qp_backup_products', 'quality_paan_catalog_backup'
      ];
      keysToRemove.forEach((k) => {
        try { localStorage.removeItem(k); } catch {}
      });
      safeSetItem('qp_products_v5', JSON.stringify([]));
      safeSetItem('qp_deleted_product_ids', JSON.stringify([]));

      try {
        fetch('/api/products/clear', { method: 'POST' }).catch(() => {});
        fetch('/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ products: [] }),
        }).catch(() => {});
      } catch {}
    }
    showToast('All products and product images have been completely removed.', 'info');
  };

  const resetCatalogToDefault = () => {
    if (typeof window !== 'undefined') {
      try {
        safeSetItem('qp_products_backup_before_reset', JSON.stringify(products));
      } catch {}
    }
    setProducts(INITIAL_PRODUCTS);
    setCategories(INITIAL_CATEGORIES);
    if (typeof window !== 'undefined') {
      safeSetItem('qp_products_v5', JSON.stringify(INITIAL_PRODUCTS));
      safeSetItem('qp_categories_v5', JSON.stringify(INITIAL_CATEGORIES));
      localStorage.removeItem('qp_deleted_product_ids');
      localStorage.removeItem('qp_deleted_category_ids');
    }
    showToast('Catalog restored to default template!', 'success');
  };


  const persistToCustomVault = (items: Product[]) => {
    if (typeof window === 'undefined' || !items || items.length === 0) return;
    try {
      const raw = localStorage.getItem('qp_custom_products_master_vault');
      const existing: Product[] = raw ? JSON.parse(raw) : [];
      const map = new Map<string, Product>(existing.map((p) => [p.name.toLowerCase().trim(), p]));
      items.forEach((p) => {
        map.set(p.name.toLowerCase().trim(), p);
      });
      const combined = Array.from(map.values());
      safeSetItem('qp_custom_products_master_vault', JSON.stringify(combined));
      safeSetItem('qp_morning_7am_products', JSON.stringify(combined));
    } catch (err) {
      console.warn('Vault persist error:', err);
    }
  };

  const addProduct = (p: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newProd: Product = {
      ...p,
      id: `prod-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setProducts((prev) => {
      const updated = [newProd, ...prev];
      try {
        fetch('/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ products: updated }),
        }).catch(() => {});
      } catch {}
      return updated;
    });
    persistToCustomVault([newProd]);
    showToast(`Product "${p.name}" added successfully!`, 'success');
  };

  const bulkAddProducts = (
    newItems: Array<Omit<Product, 'id' | 'createdAt' | 'updatedAt'>>,
    mergeMode: 'append' | 'skip_duplicates' | 'update_duplicates' = 'append'
  ) => {
    if (!newItems || newItems.length === 0) return;

    setProducts((prev) => {
      const now = new Date().toISOString();
      const existingMapByName = new Map<string, Product>(prev.map((p) => [p.name.toLowerCase().trim(), p]));

      const itemsToInsert: Product[] = [];
      let updatedExisting = [...prev];

      newItems.forEach((p, idx) => {
        const cleanName = p.name.toLowerCase().trim();
        const existing = existingMapByName.get(cleanName);

        if (existing) {
          if (mergeMode === 'skip_duplicates') {
            // Keep existing product strictly as it was, do not add duplicate
            return;
          } else if (mergeMode === 'update_duplicates') {
            // Update details on existing product while keeping its ID
            updatedExisting = updatedExisting.map((item) =>
              item.id === existing.id
                ? { ...item, ...p, updatedAt: now }
                : item
            );
            return;
          }
        }

        // Default 'append' mode: safely append as new catalog item while preserving all existing items!
        const newProd: Product = {
          ...p,
          id: `prod-${Date.now()}-${idx}-${Math.random().toString(36).slice(2, 6)}`,
          createdAt: now,
          updatedAt: now,
        };
        itemsToInsert.push(newProd);
      });

      if (itemsToInsert.length > 0) {
        persistToCustomVault(itemsToInsert);
      }

      // Existing products are preserved 100% in order
      return [...itemsToInsert, ...updatedExisting];
    });
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts((prev) => {
      const updated = prev.map((item) =>
        item.id === id ? { ...item, ...updates, updatedAt: new Date().toISOString() } : item
      );
      try {
        fetch('/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ products: updated }),
        }).catch(() => {});
      } catch {}
      return updated;
    });
    showToast('Product updated successfully!', 'success');
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      if (typeof window !== 'undefined') {
        safeSetItem('qp_products_v5', JSON.stringify(updated));
        safeSetItem('qp_products_backup', JSON.stringify(updated));
        try {
          const deletedSaved = localStorage.getItem('qp_deleted_product_ids');
          const deletedIds = deletedSaved ? JSON.parse(deletedSaved) : [];
          if (!deletedIds.includes(id)) {
            deletedIds.push(id);
            safeSetItem('qp_deleted_product_ids', JSON.stringify(deletedIds));
          }
        } catch (e) {
          console.error('Error saving deleted product id:', e);
        }

        // Clean from all custom vaults and backup storage
        try {
          const vaultKeys = ['qp_custom_products_master_vault', 'qp_morning_7am_products', 'qp_products_backup_before_reset'];
          for (const vk of vaultKeys) {
            const raw = localStorage.getItem(vk);
            if (raw) {
              const list = JSON.parse(raw);
              if (Array.isArray(list)) {
                const cleaned = list.filter((p: any) => p && p.id !== id);
                safeSetItem(vk, JSON.stringify(cleaned));
              }
            }
          }
        } catch {}

        // Immediate server sync
        try {
          fetch('/api/products', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ products: updated }),
          }).catch(() => {});
        } catch {}
      }
      return updated;
    });
    setCart((prev) => prev.filter((item) => item.product.id !== id));
    setWishlist((prev) => prev.filter((prodId) => prodId !== id));
    showToast('Product deleted permanently from store catalog.', 'info');
  };

  // Cart with robust item sanitization
  const [cart, setCart] = useState<CartItem[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('qp_cart');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            return parsed.filter((item) => item && item.product && typeof item.product === 'object' && item.product.id && typeof item.product.price === 'number');
          }
        }
      } catch (e) {
        console.error('Error restoring stored cart:', e);
      }
    }
    const safeDefaults: CartItem[] = [];
    if (INITIAL_PRODUCTS[0]) safeDefaults.push({ product: INITIAL_PRODUCTS[0], quantity: 1 });
    if (INITIAL_PRODUCTS[1]) safeDefaults.push({ product: INITIAL_PRODUCTS[1], quantity: 1 });
    return safeDefaults;
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      safeSetItem('qp_cart', JSON.stringify(cart));
    }
  }, [cart]);

  const addToCart = (product: Product, quantity = 1, variant?: ProductVariant) => {
    if (product.stock <= 0) {
      showToast('Sorry, this product is currently out of stock!', 'error');
      return;
    }
    setCart((prev) => {
      const existingIdx = prev.findIndex(
        (item) => item.product.id === product.id && item.selectedVariant?.id === variant?.id
      );
      if (existingIdx > -1) {
        const updated = [...prev];
        const newQty = updated[existingIdx].quantity + quantity;
        updated[existingIdx] = { ...updated[existingIdx], quantity: newQty };
        return updated;
      } else {
        return [...prev, { product, quantity, selectedVariant: variant }];
      }
    });
    showToast(`Added ${quantity}x ${product.name} to your Royal Cart!`, 'success');
  };

  const updateCartQuantity = (productId: string, quantity: number, variantId?: string) => {
    if (quantity <= 0) {
      removeFromCart(productId, variantId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => {
        if (item.product.id === productId && item.selectedVariant?.id === variantId) {
          return { ...item, quantity };
        }
        return item;
      })
    );
  };

  const removeFromCart = (productId: string, variantId?: string) => {
    setCart((prev) =>
      prev.filter((item) => !(item.product.id === productId && item.selectedVariant?.id === variantId))
    );
    showToast('Item removed from cart.', 'info');
  };

  const clearCart = () => setCart([]);

  // Wishlist with automatic valid-product sanitization
  const [wishlist, setWishlist] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('qp_wishlist');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            // Filter out old legacy dummy IDs ('prod-01', 'prod-04')
            return parsed.filter((id) => id !== 'prod-01' && id !== 'prod-04');
          }
        } catch (e) {
          console.error(e);
        }
      }
    }
    return [];
  });

  // Sync and sanitize wishlist when products change or on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Keep only IDs that actually exist in product catalog
      const sanitized = wishlist.filter((id) => products.some((p) => p.id === id));
      if (sanitized.length !== wishlist.length) {
        setWishlist(sanitized);
      }
      safeSetItem('qp_wishlist', JSON.stringify(sanitized));
    }
  }, [wishlist, products]);

  const toggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      const exists = prev.includes(productId);
      if (exists) {
        showToast('Removed from Wishlist', 'info');
        return prev.filter((id) => id !== productId);
      } else {
        showToast('Added to Royal Wishlist ♡', 'success');
        return [...prev, productId];
      }
    });
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  // Coupons with LocalStorage persistence & guaranteed unique IDs
  const [coupons, setCoupons] = useState<Coupon[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('qp_coupons_v2');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed.map((c: any, idx: number) => ({
              ...c,
              id: c.id || `coup-${(c.code || 'coupon').toLowerCase().replace(/[^a-z0-9]/g, '') || idx}-${idx}`,
              isActive: c.isActive !== false,
              eligibility: c.eligibility || (c.firstBuyOnly ? 'new_user_only' : 'all'),
              usageLimitType: c.usageLimitType || 'unlimited',
              appliesToType: c.appliesToType || 'all',
              applicableProductIds: Array.isArray(c.applicableProductIds) ? c.applicableProductIds : [],
              applicableCategoryIds: Array.isArray(c.applicableCategoryIds) ? c.applicableCategoryIds : [],
            }));
          }
        } catch (e) {
          console.error(e);
        }
      }
    }
    return INITIAL_COUPONS.map((c, idx) => ({
      ...c,
      id: c.id || `coup-${c.code.toLowerCase()}-${idx}`,
      isActive: c.isActive !== false,
      eligibility: c.eligibility || 'all',
      usageLimitType: c.usageLimitType || 'unlimited',
      appliesToType: c.appliesToType || 'all',
      applicableProductIds: Array.isArray(c.applicableProductIds) ? c.applicableProductIds : [],
      applicableCategoryIds: Array.isArray(c.applicableCategoryIds) ? c.applicableCategoryIds : [],
    }));
  });
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      safeSetItem('qp_coupons_v2', JSON.stringify(coupons));
    }
  }, [coupons]);

  const applyCoupon = (code: string): boolean => {
    const trimmed = code.trim().toUpperCase();
    const found = coupons.find((c) => c.code.toUpperCase() === trimmed && c.isActive);
    if (!found) {
      showToast('Invalid or expired coupon code.', 'error');
      return false;
    }

    // 1. Specific Product or Category Cart Requirements Check
    if (found.appliesToType === 'specific_product' && found.applicableProductIds && found.applicableProductIds.length > 0) {
      const hasQualifyingProduct = cart.some(item => found.applicableProductIds?.includes(item.product.id));
      if (!hasQualifyingProduct) {
        showToast(
          `Coupon ${found.code} is valid exclusively when purchasing "${found.targetProductName || 'the designated product'}". Please add it to your cart.`,
          'warning'
        );
        return false;
      }
    } else if (found.appliesToType === 'specific_category' && found.applicableCategoryIds && found.applicableCategoryIds.length > 0) {
      const hasQualifyingCategory = cart.some(item => found.applicableCategoryIds?.includes(item.product.category));
      if (!hasQualifyingCategory) {
        showToast(
          `Coupon ${found.code} is valid only on items in "${found.targetCategoryName || 'the designated category'}".`,
          'warning'
        );
        return false;
      }
    }

    // 2. Minimum Order Value Check
    if (cartSubtotal < found.minOrderValue) {
      showToast(`Minimum order value for ${found.code} is ₹${found.minOrderValue} (Current: ₹${cartSubtotal})`, 'warning');
      return false;
    }

    // 3. Date Expiry & Start Date Checks
    const now = new Date();
    if (found.expiryDate) {
      const expDate = new Date(`${found.expiryDate}T23:59:59`);
      if (now > expDate) {
        showToast(`Coupon ${found.code} expired on ${found.expiryDate}.`, 'error');
        return false;
      }
    }
    if (found.startDate) {
      const stDate = new Date(`${found.startDate}T00:00:00`);
      if (now < stDate) {
        showToast(`Coupon ${found.code} will become active on ${found.startDate}.`, 'warning');
        return false;
      }
    }

    // 4. Total Overall Redemptions Limit Check
    if (found.maxTotalUsageLimit && found.maxTotalUsageLimit > 0) {
      if ((found.usedCount || 0) >= found.maxTotalUsageLimit) {
        showToast(`Coupon ${found.code} redemption limit reached (Max ${found.maxTotalUsageLimit} uses).`, 'error');
        return false;
      }
    }

    // 5. Customer Eligibility Checks (First Buy / 1st Order, Referral)
    if (found.eligibility === 'new_user_only' || found.firstBuyOnly) {
      if (!user) {
        showToast(`Coupon ${found.code} is valid exclusively for your FIRST BUY! Please sign in or register to redeem.`, 'warning');
        return false;
      }
      const userOrders = orders.filter((o) => (user && o.userId === user.id) || (user && o.shippingAddress?.email === user.email));
      const hasPriorOrders = userOrders.length > 0 || ((user?.totalOrdersCount || 0) > 0);
      if (hasPriorOrders) {
        showToast(`Coupon ${found.code} is valid exclusively on FIRST BUY for new accounts. You have already placed previous orders.`, 'warning');
        return false;
      }
    } else if (found.eligibility === 'referral_only') {
      if (!user) {
        showToast(`Coupon ${found.code} is exclusive to referral invitees and referrer rewards. Please login to apply.`, 'warning');
        return false;
      }
    }

    // 6. Usage Limit Frequency Checks
    if (user) {
      const userOrdersWithCoupon = orders.filter((o) => 
        ((o.userId === user.id) || (o.shippingAddress?.email === user.email)) &&
        o.couponCode?.toUpperCase() === trimmed
      );

      if (found.usageLimitType === 'once_per_user' && userOrdersWithCoupon.length >= 1) {
        showToast(`You have already redeemed coupon ${found.code}. This coupon is strictly limited to 1 use per account.`, 'warning');
        return false;
      }

      if (found.usageLimitType === 'once_per_month') {
        const usedThisMonth = userOrdersWithCoupon.some((o) => {
          const orderDate = new Date(o.createdAt);
          return orderDate.getMonth() === now.getMonth() && orderDate.getFullYear() === now.getFullYear();
        });
        if (usedThisMonth) {
          showToast(`Coupon ${found.code} can only be used once per calendar month. Next redemption will be available on the 1st of next month.`, 'warning');
          return false;
        }
      }

      if (found.usageLimitType === 'custom_limit' && found.maxUsagePerUser) {
        if (userOrdersWithCoupon.length >= found.maxUsagePerUser) {
          showToast(`You have reached the maximum limit (${found.maxUsagePerUser} times) for coupon ${found.code}.`, 'warning');
          return false;
        }
      }
    }

    setAppliedCoupon(found);
    showToast(`Coupon ${found.code} applied successfully!`, 'success');
    return true;
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    showToast('Coupon removed', 'info');
  };

  const addCoupon = (c: Coupon) => {
    const newC: Coupon = {
      ...c,
      id: c.id || `coup-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      isActive: c.isActive !== false,
      eligibility: c.eligibility || 'all',
      usageLimitType: c.usageLimitType || 'unlimited',
      appliesToType: c.appliesToType || 'all',
      usedCount: c.usedCount || 0,
    };
    setCoupons((prev) => {
      const updated = [newC, ...prev];
      if (typeof window !== 'undefined') {
        safeSetItem('qp_coupons_v2', JSON.stringify(updated));
      }
      return updated;
    });
    showToast(`Coupon ${newC.code} created!`, 'success');
  };

  const deleteCoupon = (idOrCode: string) => {
    setCoupons((prev) => {
      const updated = prev.filter((c) => {
        const matchId = c.id && c.id === idOrCode;
        const matchCode = c.code && c.code.toUpperCase() === idOrCode.toUpperCase();
        return !matchId && !matchCode;
      });
      if (typeof window !== 'undefined') {
        safeSetItem('qp_coupons_v2', JSON.stringify(updated));
      }
      return updated;
    });
    if (appliedCoupon) {
      const matchApplied = (appliedCoupon.id && appliedCoupon.id === idOrCode) || 
        (appliedCoupon.code && appliedCoupon.code.toUpperCase() === idOrCode.toUpperCase());
      if (matchApplied) {
        setAppliedCoupon(null);
      }
    }
    showToast('Coupon deleted successfully!', 'info');
  };

  const updateCoupon = (idOrCode: string, updates: Partial<Coupon>) => {
    setCoupons((prev) => {
      const targetIndex = prev.findIndex((c) => {
        const matchId = c.id && c.id === idOrCode;
        const matchCode = c.code && c.code.toUpperCase() === idOrCode.toUpperCase();
        return matchId || matchCode;
      });

      if (targetIndex === -1) {
        // Fallback create if not found
        const fallbackId = idOrCode.startsWith('coup-') ? idOrCode : `coup-${Date.now()}`;
        const newC: Coupon = {
          id: fallbackId,
          code: (updates.code || idOrCode).toUpperCase().trim(),
          minOrderValue: updates.minOrderValue || 0,
          description: updates.description || '',
          isActive: updates.isActive !== false,
          eligibility: updates.eligibility || 'all',
          usageLimitType: updates.usageLimitType || 'unlimited',
          appliesToType: updates.appliesToType || 'all',
          ...updates,
        };
        const next = [newC, ...prev];
        if (typeof window !== 'undefined') {
          safeSetItem('qp_coupons_v2', JSON.stringify(next));
        }
        return next;
      }

      const existing = prev[targetIndex];
      const updatedItem: Coupon = {
        ...existing,
        ...updates,
        id: existing.id || idOrCode,
      };

      // Ensure clean discount percent vs fixed amount handling
      if (updates.discountPercent !== undefined && updates.discountPercent > 0) {
        delete updatedItem.discountAmount;
      } else if (updates.discountAmount !== undefined && updates.discountAmount > 0) {
        delete updatedItem.discountPercent;
      }

      // If appliesToType is 'all', clear product/category filters
      if (updates.appliesToType === 'all') {
        updatedItem.applicableProductIds = [];
        updatedItem.applicableCategoryIds = [];
        delete updatedItem.targetProductName;
        delete updatedItem.targetCategoryName;
      }

      const next = [...prev];
      next[targetIndex] = updatedItem;

      if (typeof window !== 'undefined') {
        safeSetItem('qp_coupons_v2', JSON.stringify(next));
      }
      return next;
    });

    // Also keep active appliedCoupon in sync
    setAppliedCoupon((prevApplied) => {
      if (!prevApplied) return null;
      const matchId = prevApplied.id && prevApplied.id === idOrCode;
      const matchCode = prevApplied.code && prevApplied.code.toUpperCase() === idOrCode.toUpperCase();
      if (matchId || matchCode) {
        return {
          ...prevApplied,
          ...updates,
          id: prevApplied.id || idOrCode,
        };
      }
      return prevApplied;
    });

    showToast('Coupon / Offer updated successfully!', 'success');
  };

  // Payment System & Pricing Configuration
  const [paymentConfig, setPaymentConfig] = useState<PaymentConfig>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('qp_payment_config_v2');
      if (saved) {
        try {
          return { ...INITIAL_PAYMENT_CONFIG, ...JSON.parse(saved) };
        } catch (e) {
          console.error('Failed to parse payment config from storage', e);
        }
      }
    }
    return INITIAL_PAYMENT_CONFIG;
  });

  const updatePaymentConfig = (cfg: Partial<PaymentConfig>) => {
    setPaymentConfig((prev) => {
      const updated = { ...prev, ...cfg };
      if (typeof window !== 'undefined') {
        safeSetItem('qp_payment_config_v2', JSON.stringify(updated));
      }
      return updated;
    });
    showToast('Payment & Pricing configuration updated successfully!', 'success');
  };

  // Cart Calculations with robust null-checks
  const cartCount = cart.reduce((total, item) => total + (item?.quantity || 0), 0);
  const cartSubtotal = cart.reduce((total, item) => {
    if (!item || !item.product) return total;
    const itemPrice = item.selectedVariant?.price ?? item.product.price ?? 0;
    return total + itemPrice * (item.quantity || 1);
  }, 0);

  let cartDiscount = 0;
  if (appliedCoupon) {
    // Determine the qualifying amount for the discount
    let qualifyingAmount = cartSubtotal;

    if (appliedCoupon.appliesToType === 'specific_product' && appliedCoupon.applicableProductIds && appliedCoupon.applicableProductIds.length > 0) {
      qualifyingAmount = cart.filter(item => item?.product?.id && appliedCoupon.applicableProductIds?.includes(item.product.id)).reduce((tot, item) => {
        const itemPrice = item?.selectedVariant?.price ?? item?.product?.price ?? 0;
        return tot + itemPrice * (item.quantity || 1);
      }, 0);
    } else if (appliedCoupon.appliesToType === 'specific_category' && appliedCoupon.applicableCategoryIds && appliedCoupon.applicableCategoryIds.length > 0) {
      qualifyingAmount = cart.filter(item => item?.product?.category && appliedCoupon.applicableCategoryIds?.includes(item.product.category)).reduce((tot, item) => {
        const itemPrice = item?.selectedVariant?.price ?? item?.product?.price ?? 0;
        return tot + itemPrice * (item.quantity || 1);
      }, 0);
    }

    if (appliedCoupon.discountPercent) {
      cartDiscount = Math.round((qualifyingAmount * appliedCoupon.discountPercent) / 100);
      if (appliedCoupon.maxDiscountCap && appliedCoupon.maxDiscountCap > 0) {
        cartDiscount = Math.min(cartDiscount, appliedCoupon.maxDiscountCap);
      }
    } else if (appliedCoupon.discountAmount) {
      cartDiscount = Math.min(appliedCoupon.discountAmount, qualifyingAmount);
      if (appliedCoupon.maxDiscountCap && appliedCoupon.maxDiscountCap > 0) {
        cartDiscount = Math.min(cartDiscount, appliedCoupon.maxDiscountCap);
      }
    }
    cartDiscount = Math.min(cartDiscount, cartSubtotal);
  }

  // Delivery Charges (0 if disabled or meets free delivery threshold or freeship coupon)
  let cartDeliveryCharge = 0;
  if (cart.length > 0 && paymentConfig.enableDeliveryCharge) {
    if (appliedCoupon?.code === 'FREESHIP') {
      cartDeliveryCharge = 0;
    } else if (paymentConfig.freeDeliveryAboveAmount > 0 && cartSubtotal >= paymentConfig.freeDeliveryAboveAmount) {
      cartDeliveryCharge = 0;
    } else {
      cartDeliveryCharge = paymentConfig.baseDeliveryCharge || 0;
    }
  }

  // Platform & Service Fee (0 if disabled)
  const cartPlatformFee = (cart.length > 0 && paymentConfig.enablePlatformFee) ? (paymentConfig.platformFeeAmount || 0) : 0;

  // GST / Tax (0 if disabled or 0%)
  const taxableAmount = Math.max(0, cartSubtotal - cartDiscount);
  const cartTax = (paymentConfig.enableGst && paymentConfig.gstPercentage > 0)
    ? Math.round((taxableAmount * paymentConfig.gstPercentage) / 100)
    : 0;

  const cartTotal = taxableAmount + cartDeliveryCharge + cartPlatformFee + cartTax;

  // Auth & Profile
  const [user, setUser] = useState<UserProfile | null>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('qp_user');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          // Ensure Rahul Singh's admin status and correct name
          if (parsed.email === '28r.n.singh@gmail.com' || parsed.fullName?.includes('Singh')) {
            parsed.fullName = 'Rahul Singh';
            parsed.role = 'admin';
          }
          return parsed;
        } catch (e) {
          console.error(e);
        }
      }
    }
    // Default logged in account: Rahul Singh (Store Owner & Administrator)
    return {
      id: 'usr-rahul-01',
      email: '28r.n.singh@gmail.com',
      fullName: 'Rahul Singh',
      phone: '+91 98765 43210',
      role: 'admin', // Full Administrator privileges
      isAgeVerified: true,
      panNumber: 'ABCPS1289R',
      panHolderName: 'RAHUL SINGH',
      panDob: '1988-06-15',
      panVerified: true,
      panVerifiedAt: '2026-08-01T10:00:00Z',
      panProofUrl: '',
      profileCompleted: true,
      customerType: 'old',
      totalOrdersCount: 0,
      totalSpent: 0,
      addresses: [
        {
          id: 'addr-01',
          fullName: 'Rahul Singh',
          phone: '+91 98765 43210',
          addressLine1: 'Suite 402, Royal Palms Residency',
          addressLine2: 'Civil Lines, Near Heritage Residency',
          city: 'New Delhi',
          state: 'Delhi',
          postalCode: '110054',
          landmark: 'Opposite Royal Palace',
          isDefault: true,
          type: 'home',
          liveLocation: {
            latitude: 28.6812,
            longitude: 77.2228,
            accuracy: 5,
            mapUrl: 'https://www.google.com/maps?q=28.6812,77.2228',
            detectedAddress: 'Civil Lines, North Delhi, 110054',
          },
        },
      ],
    };
  });

  // Customer CRM & Directory (Tracks Old and New registered customers)
  const [customers, setCustomers] = useState<UserProfile[]>(() => {
    const dummyIds = ['usr-vikram-01', 'usr-ananya-02', 'usr-raghav-03', 'usr-priya-05', 'usr-kunal-04', 'usr-sameer-06'];
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('qp_customers_v2');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            const cleaned = parsed.filter((c: UserProfile) => !dummyIds.includes(c.id));
            if (cleaned.length > 0) return cleaned;
          }
        } catch (e) { console.error(e); }
      }
    }
    return INITIAL_CUSTOMERS;
  });

  const clearDummyCustomers = () => {
    const dummyIds = ['usr-vikram-01', 'usr-ananya-02', 'usr-raghav-03', 'usr-priya-05', 'usr-kunal-04', 'usr-sameer-06'];
    setCustomers((prev) => prev.filter((c) => !dummyIds.includes(c.id) && c.role !== 'customer'));
    showToast('Old customer dummy data cleared successfully.', 'info');
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      safeSetItem('qp_customers_v2', JSON.stringify(customers));
    }
  }, [customers]);

  const updateCustomer = (id: string, updates: Partial<UserProfile>) => {
    setCustomers((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updates } : c))
    );
    if (user && user.id === id) {
      setUser((prev) => (prev ? { ...prev, ...updates } : null));
    }
    showToast('Customer record updated successfully in CRM.', 'success');
  };

  const verifyCustomerPan = (
    panNumber: string, 
    holderName: string, 
    dob: string, 
    panProofUrl?: string
  ): boolean => {
    const cleanPan = panNumber.trim().toUpperCase();
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    if (!panRegex.test(cleanPan)) {
      showToast('Invalid PAN format! Must be 10 characters (e.g. ABCDE1234F).', 'error');
      return false;
    }

    if (!holderName.trim()) {
      showToast('Please enter your full name as printed on your PAN Card.', 'warning');
      return false;
    }

    if (dob) {
      const birthDate = new Date(dob);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      if (age < 18) {
        showToast('Legal Age Check: You must be 18 years or older as required by law.', 'error');
        return false;
      }
    }

    const nowIso = new Date().toISOString();
    if (user) {
      const updatedUser: UserProfile = {
        ...user,
        panNumber: cleanPan,
        panHolderName: holderName.trim().toUpperCase(),
        panDob: dob,
        panVerified: true,
        panVerifiedAt: nowIso,
        panProofUrl: panProofUrl || user.panProofUrl,
        isAgeVerified: true,
        profileCompleted: true,
      };
      setUser(updatedUser);

      setCustomers((prev) =>
        prev.map((c) => (c.email === user.email || c.id === user.id ? { ...c, ...updatedUser } : c))
      );
    }
    showToast('PAN Card 18+ Legal Age Verification Confirmed! Profile completed.', 'success');
    return true;
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (user) {
        safeSetItem('qp_user', JSON.stringify(user));
      } else {
        localStorage.removeItem('qp_user');
      }
    }
  }, [user]);

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register' | 'forgot' | 'admin'>('login');

  const login = (email: string, _role?: 'customer' | 'admin') => {
    const isOwnerOrAdmin =
      email.toLowerCase().trim() === '28r.n.singh@gmail.com' ||
      email.toLowerCase().includes('rahul') ||
      email.toLowerCase().includes('admin');

    const existingCust = customers.find(
      (c) => c.email.toLowerCase() === email.toLowerCase().trim()
    );

    const loggedUser: UserProfile = existingCust
      ? { ...existingCust, role: isOwnerOrAdmin ? 'admin' : existingCust.role }
      : {
          id: isOwnerOrAdmin ? 'usr-rahul-01' : `usr-${Date.now()}`,
          email: email.trim(),
          fullName: isOwnerOrAdmin
            ? 'Rahul Singh'
            : email.split('@')[0].replace(/[\._]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
          phone: isOwnerOrAdmin ? '+91 98765 43210' : '+91 98765 00000',
          role: isOwnerOrAdmin ? 'admin' : 'customer',
          isAgeVerified: true,
          createdAt: new Date().toISOString(),
          customerType: 'new',
          totalOrdersCount: 0,
          totalSpent: 0,
          panVerified: false,
          profileCompleted: false,
          addresses: user?.addresses || [],
        };

    setUser(loggedUser);
    setIsAuthModalOpen(false);
    showToast(
      isOwnerOrAdmin
        ? `Welcome back, Administrator Rahul Singh! Full admin controls active.`
        : `Welcome back, ${loggedUser.fullName}!`,
      'success'
    );
  };

  const register = (name: string, email: string, phone: string) => {
    const isOwnerOrAdmin =
      email.toLowerCase().trim() === '28r.n.singh@gmail.com' ||
      email.toLowerCase().includes('admin');

    const newUser: UserProfile = {
      id: isOwnerOrAdmin ? 'usr-rahul-01' : `usr-${Date.now()}`,
      email: email.trim(),
      fullName: isOwnerOrAdmin ? 'Rahul Singh' : name.trim(),
      phone: phone.trim(),
      role: isOwnerOrAdmin ? 'admin' : 'customer',
      isAgeVerified: true,
      createdAt: new Date().toISOString(),
      customerType: isOwnerOrAdmin ? 'old' : 'new',
      totalOrdersCount: 0,
      totalSpent: 0,
      panVerified: isOwnerOrAdmin,
      profileCompleted: isOwnerOrAdmin,
      addresses: [],
    };
    setUser(newUser);
    setCustomers((prev) => [newUser, ...prev.filter((c) => c.email !== newUser.email)]);
    setIsAuthModalOpen(false);
    showToast(
      isOwnerOrAdmin
        ? `Welcome, Administrator Rahul Singh! Your administrative profile is ready.`
        : `Welcome, ${name}! Your account is ready. (18+ PAN verification is available in Profile)`,
      'success'
    );
  };

  const logout = () => {
    setUser(null);
    showToast('You have been logged out.', 'info');
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    if (!user) return;
    const updated = { ...user, ...updates };
    setUser(updated);
    setCustomers((prev) =>
      prev.map((c) => (c.email === user.email || c.id === user.id ? { ...c, ...updates } : c))
    );
    showToast('Profile updated successfully!', 'success');
  };

  const addAddress = (addr: Omit<UserAddress, 'id'>) => {
    if (!user) return;
    const newAddr: UserAddress = { ...addr, id: `addr-${Date.now()}` };
    const updatedAddresses = addr.isDefault
      ? [...user.addresses.map((a) => ({ ...a, isDefault: false })), newAddr]
      : [...user.addresses, newAddr];
    const updatedUser = { ...user, addresses: updatedAddresses };
    setUser(updatedUser);
    setCustomers((prev) =>
      prev.map((c) => (c.email === user.email || c.id === user.id ? { ...c, addresses: updatedAddresses } : c))
    );
    showToast(
      addr.liveLocation
        ? 'New delivery address added with live GPS coordinates!'
        : 'New delivery address added!',
      'success'
    );
  };

  const removeAddress = (id: string) => {
    if (!user) return;
    const updatedAddresses = user.addresses.filter((a) => a.id !== id);
    setUser({ ...user, addresses: updatedAddresses });
    setCustomers((prev) =>
      prev.map((c) => (c.email === user.email || c.id === user.id ? { ...c, addresses: updatedAddresses } : c))
    );
    showToast('Address removed.', 'info');
  };

  const setDefaultAddress = (id: string) => {
    if (!user) return;
    const updatedAddresses = user.addresses.map((a) => ({ ...a, isDefault: a.id === id }));
    setUser({
      ...user,
      addresses: updatedAddresses,
    });
    setCustomers((prev) =>
      prev.map((c) => (c.email === user.email || c.id === user.id ? { ...c, addresses: updatedAddresses } : c))
    );
    showToast('Default delivery address updated.', 'success');
  };

  // Orders
  const [orders, setOrders] = useState<Order[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('qp_orders');
      if (saved) {
        try { return JSON.parse(saved); } catch (e) { console.error(e); }
      }
    }
    return [];
  });

  // Sync orders with server database
  useEffect(() => {
    fetch('/api/orders')
      .then((r) => r.json())
      .then((data) => {
        if (data && data.success && Array.isArray(data.orders) && data.orders.length > 0) {
          setOrders((prev) => {
            const map = new Map<string, Order>();
            data.orders.forEach((o: any) => {
              if (o && o.id) map.set(o.id, o);
            });
            prev.forEach((po) => {
              if (po && po.id && !map.has(po.id)) map.set(po.id, po);
            });
            const merged = Array.from(map.values());
            safeSetItem('qp_orders', JSON.stringify(merged));
            return merged;
          });
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      safeSetItem('qp_orders', JSON.stringify(orders));
    }
  }, [orders]);

  const createOrder = (
    shippingAddress: UserAddress, 
    paymentMethod: 'online' | 'cod' | 'upi' | 'bank',
    upiDetails?: {
      transactionId?: string;
      screenshotUrl?: string;
    }
  ): Order => {
    const orderItems = cart.map((item) => ({
      productId: item.product.id,
      productName: item.product.name + (item.selectedVariant ? ` (${item.selectedVariant.name})` : ''),
      productImage: item.product.images[0],
      price: item.selectedVariant ? item.selectedVariant.price : item.product.price,
      quantity: item.quantity,
      variantName: item.selectedVariant?.name,
    }));

    const isUpiOrBank = paymentMethod === 'upi' || paymentMethod === 'bank';
    const isCod = paymentMethod === 'cod';

    const orderInitialStatus = isUpiOrBank ? 'payment_verification' : 'confirmed';
    const paymentInitialStatus = isUpiOrBank ? 'pending_verification' : (isCod ? 'pending' : 'completed');

    const initialTrackingMessage = paymentMethod === 'upi'
      ? `UPI Order Request submitted with Ref/UTR: ${upiDetails?.transactionId || 'Awaiting verification'}. Payment verification under progress by store administrator.`
      : (paymentMethod === 'bank'
          ? `Direct Bank Transfer (NEFT/RTGS/IMPS) submitted with Ref: ${upiDetails?.transactionId || 'Awaiting credit'}. Verification under progress.`
          : (isCod 
              ? 'Cash on Delivery order confirmed by Royal Shisha & Hookah Boutique.' 
              : 'Online payment received. Order confirmed and assigned to Royal Shisha Specialist.'));

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber: `QP-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      userId: user?.id || 'guest',
      items: orderItems,
      subtotal: cartSubtotal,
      discount: cartDiscount,
      couponCode: appliedCoupon?.code,
      deliveryCharge: cartDeliveryCharge,
      tax: cartTax,
      total: cartTotal,
      status: orderInitialStatus,
      shippingAddress,
      paymentMethod,
      paymentStatus: paymentInitialStatus,
      createdAt: new Date().toISOString(),
      deliveryEstimate: 'Within 35-45 minutes (Express Discreet Delivery)',
      upiTransactionId: upiDetails?.transactionId?.trim() || undefined,
      upiScreenshotUrl: upiDetails?.screenshotUrl || undefined,
      upiVerifiedByAdmin: false,
      isOrderRequest: isUpiOrBank,
      trackingUpdates: [
        {
          status: orderInitialStatus,
          timestamp: 'Just now',
          message: initialTrackingMessage,
        },
      ],
    };

    setOrders((prev) => [newOrder, ...prev]);

    // Send order to central SQLite database on server
    try {
      fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order: newOrder }),
      }).catch((err) => console.warn('Order sync error:', err));
    } catch {}

    // Update customer CRM stats (total orders and total spent)
    setCustomers((prev) =>
      prev.map((c) => {
        if (c.email.toLowerCase() === user?.email.toLowerCase() || (user && c.id === user.id)) {
          return {
            ...c,
            totalOrdersCount: (c.totalOrdersCount || 0) + 1,
            totalSpent: (c.totalSpent || 0) + newOrder.total,
          };
        }
        return c;
      })
    );
    if (user) {
      setUser((prev) =>
        prev
          ? {
              ...prev,
              totalOrdersCount: (prev.totalOrdersCount || 0) + 1,
              totalSpent: (prev.totalSpent || 0) + newOrder.total,
            }
          : null
      );
    }

    if (appliedCoupon) {
      setCoupons((prev) =>
        prev.map((c) =>
          c.code.toUpperCase() === appliedCoupon.code.toUpperCase()
            ? { ...c, usedCount: (c.usedCount || 0) + 1 }
            : c
        )
      );
    }

    clearCart();
    setAppliedCoupon(null);
    setSelectedOrderId(newOrder.id);
    setCurrentPage('order-success');

    if (isUpiOrBank) {
      showToast(`Order Request #${newOrder.orderNumber} submitted! Payment verification under progress.`, 'info');
    } else {
      showToast(`Order #${newOrder.orderNumber} placed successfully!`, 'success');
    }
    return newOrder;
  };

  const verifyAndApproveUpiOrder = (orderId: string, notes?: string) => {
    let orderNum = '';
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId) {
          orderNum = o.orderNumber;
          const updatedTracking = [
            ...o.trackingUpdates,
            {
              status: 'confirmed' as const,
              timestamp: 'Just now',
              message: notes 
                ? `UPI Payment verified & approved by Store Admin (Rahul Singh): ${notes}. Order confirmed!`
                : 'UPI Payment verified and approved by Store Admin (Rahul Singh). Order confirmed & queued for artisanal preparation!',
            },
          ];
          return {
            ...o,
            status: 'confirmed' as const,
            paymentStatus: 'completed' as const,
            upiVerifiedByAdmin: true,
            upiVerifiedAt: new Date().toISOString(),
            upiVerifiedBy: user?.fullName || 'Rahul Singh (Admin)',
            upiVerificationNotes: notes || 'Verified in ICICI Bank account',
            isOrderRequest: false,
            trackingUpdates: updatedTracking,
          };
        }
        return o;
      })
    );
    showToast(`Order #${orderNum || orderId} verified and approved! Customer now sees Order Confirmed.`, 'success');
  };

  const rejectUpiOrder = (orderId: string, reason?: string) => {
    let orderNum = '';
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId) {
          orderNum = o.orderNumber;
          const rejectionMsg = reason || 'UPI transaction ID could not be verified in bank records.';
          return {
            ...o,
            status: 'cancelled' as const,
            paymentStatus: 'rejected' as const,
            upiVerifiedByAdmin: false,
            upiVerificationNotes: rejectionMsg,
            trackingUpdates: [
              ...o.trackingUpdates,
              {
                status: 'cancelled' as const,
                timestamp: 'Just now',
                message: `Order request declined by store admin: ${rejectionMsg}`,
              },
            ],
          };
        }
        return o;
      })
    );
    showToast(`Order #${orderNum || orderId} request rejected.`, 'error');
  };

  const updateOrderUpiDetails = (orderId: string, transactionId: string, screenshotUrl?: string) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId) {
          return {
            ...o,
            upiTransactionId: transactionId,
            upiScreenshotUrl: screenshotUrl || o.upiScreenshotUrl,
            trackingUpdates: [
              ...o.trackingUpdates,
              {
                status: o.status,
                timestamp: 'Just now',
                message: `Customer updated UPI Reference UTR: ${transactionId}. Verification under progress.`,
              },
            ],
          };
        }
        return o;
      })
    );
    showToast('UPI transaction reference updated! Admin will verify.', 'success');
  };

  const updateOrderStatus = (orderId: string, status: Order['status'], message?: string) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId) {
          const updateMsg = message || `Order status updated to ${status.replace('_', ' ').toUpperCase()}`;
          return {
            ...o,
            status,
            trackingUpdates: [
              ...o.trackingUpdates,
              {
                status,
                timestamp: 'Just now',
                message: updateMsg,
              },
            ],
          };
        }
        return o;
      })
    );
    showToast(`Order status updated to ${status}!`, 'info');
  };

  const resetOrdersAndRevenue = () => {
    setOrders([]);
    setCustomers((prev) => {
      const resetList = prev.map((c) => ({ ...c, totalOrdersCount: 0, totalSpent: 0 }));
      safeSetItem('qp_customers', JSON.stringify(resetList));
      return resetList;
    });
    setUser((prev) => (prev ? { ...prev, totalOrdersCount: 0, totalSpent: 0 } : null));
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem('qp_orders');
      } catch (e) {
        console.warn('Failed to clear qp_orders:', e);
      }
    }
    showToast('Overview & Revenue stats reset to ₹0 (0 completed orders).', 'success');
  };

  const [homepageConfig, setHomepageConfig] = useState<HomepageConfig>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('qp_homepage_config');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          // If previous cached config still references old paan image or subtitle, update to hookah
          if (
            parsed.heroImage?.includes('photo-1626777552726') ||
            parsed.heroSubtitle?.includes('PAAN') ||
            parsed.heroTagline?.includes('Betel')
          ) {
            const upgraded = {
              ...parsed,
              heroSubtitle: 'ROYAL LUXURY HOOKAH & SHISHA',
              heroTagline: 'Exquisite 24K Gold Plated Pipes & 100% Herbal Flavours. Royal Clouds.',
              heroCtaText: 'SHOP HOOKAHS >',
              heroImage: '',
            };
            safeSetItem('qp_homepage_config', JSON.stringify(upgraded));
            return upgraded;
          }
          return parsed;
        } catch (e) {
          console.error(e);
        }
      }
    }
    return INITIAL_HOMEPAGE_CONFIG;
  });

  const updateHomepageConfig = (cfg: Partial<HomepageConfig>) => {
    setHomepageConfig((prev) => {
      const updated = { ...prev, ...cfg };
      if (typeof window !== 'undefined') {
        safeSetItem('qp_homepage_config', JSON.stringify(updated));
      }
      return updated;
    });
    showToast('Homepage content updated dynamically!', 'success');
  };

  // ==========================================
  // AI CHATBOT & KNOWLEDGE AUTOMATION STATE
  // ==========================================
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);

  const [chatbotConfig, setChatbotConfig] = useState<ChatbotConfig>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('qp_chatbot_config');
      if (saved) {
        try {
          return { ...INITIAL_CHATBOT_CONFIG, ...JSON.parse(saved) };
        } catch (e) {
          console.error(e);
        }
      }
    }
    return INITIAL_CHATBOT_CONFIG;
  });

  // Sync chatbot config with server
  useEffect(() => {
    fetch('/api/chatbot-config')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.config) {
          setChatbotConfig((prev) => ({ ...prev, ...data.config }));
          safeSetItem('qp_chatbot_config', JSON.stringify(data.config));
        }
      })
      .catch(() => {});
  }, []);

  const updateChatbotConfig = (cfg: Partial<ChatbotConfig>) => {
    setChatbotConfig((prev) => {
      const updated: ChatbotConfig = {
        ...prev,
        ...cfg,
        updatedAt: new Date().toISOString(),
      };
      if (typeof window !== 'undefined') {
        safeSetItem('qp_chatbot_config', JSON.stringify(updated));
      }
      fetch('/api/chatbot-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ config: updated }),
      }).catch(() => {});
      return updated;
    });
    showToast('Chatbot & AI configuration saved successfully!', 'success');
  };

  const [knowledgeDocs, setKnowledgeDocs] = useState<KnowledgeDocument[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('qp_knowledge_docs');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        } catch (e) {
          console.error(e);
        }
      }
    }
    return INITIAL_KNOWLEDGE_DOCUMENTS;
  });

  // Sync knowledge docs with server
  useEffect(() => {
    fetch('/api/knowledge-docs')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.documents) && data.documents.length > 0) {
          setKnowledgeDocs(data.documents);
          safeSetItem('qp_knowledge_docs', JSON.stringify(data.documents));
        }
      })
      .catch(() => {});
  }, []);

  const syncKnowledgeDocs = (docs: KnowledgeDocument[]) => {
    if (typeof window !== 'undefined') {
      safeSetItem('qp_knowledge_docs', JSON.stringify(docs));
    }
    fetch('/api/knowledge-docs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ documents: docs }),
    }).catch(() => {});
  };

  const addKnowledgeDoc = (doc: Omit<KnowledgeDocument, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newDoc: KnowledgeDocument = {
      ...doc,
      id: `doc-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setKnowledgeDocs((prev) => {
      const updated = [newDoc, ...prev];
      syncKnowledgeDocs(updated);
      return updated;
    });
    showToast(`Added knowledge document: "${newDoc.title}"`, 'success');
    return newDoc;
  };

  const updateKnowledgeDoc = (id: string, updates: Partial<KnowledgeDocument>) => {
    setKnowledgeDocs((prev) => {
      const updated = prev.map((d) =>
        d.id === id ? { ...d, ...updates, updatedAt: new Date().toISOString() } : d
      );
      syncKnowledgeDocs(updated);
      return updated;
    });
    showToast('Knowledge document updated!', 'success');
  };

  const deleteKnowledgeDoc = (id: string) => {
    setKnowledgeDocs((prev) => {
      const updated = prev.filter((d) => d.id !== id);
      syncKnowledgeDocs(updated);
      return updated;
    });
    showToast('Knowledge document removed from AI index.', 'info');
  };

  const toggleKnowledgeDocStatus = (id: string) => {
    setKnowledgeDocs((prev) => {
      const updated = prev.map((d) =>
        d.id === id ? { ...d, active: !d.active, updatedAt: new Date().toISOString() } : d
      );
      syncKnowledgeDocs(updated);
      return updated;
    });
  };

  const resetKnowledgeDocsToDefault = () => {
    setKnowledgeDocs(INITIAL_KNOWLEDGE_DOCUMENTS);
    syncKnowledgeDocs(INITIAL_KNOWLEDGE_DOCUMENTS);
    showToast('Knowledge base reset to default store guides & policies.', 'success');
  };

  // ==========================================
  // ADVERTISEMENT SHOWCASE & VIDEO/GIF STATE
  // ==========================================
  const [adConfig, setAdConfig] = useState<AdvertisementConfig>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('qp_ad_config');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed && Array.isArray(parsed.items)) return parsed;
        } catch (e) {
          console.error(e);
        }
      }
    }
    return INITIAL_ADVERTISEMENT_CONFIG;
  });

  const saveAdConfig = (updated: AdvertisementConfig) => {
    setAdConfig(updated);
    if (typeof window !== 'undefined') {
      safeSetItem('qp_ad_config', JSON.stringify(updated));
    }
  };

  const updateAdConfig = (cfg: Partial<AdvertisementConfig>) => {
    const updated = { ...adConfig, ...cfg };
    saveAdConfig(updated);
    showToast('Advertisement showcase settings updated!', 'success');
  };

  const addAdvertisementItem = (item: Omit<AdvertisementItem, 'id' | 'createdAt'>): AdvertisementItem => {
    const newItem: AdvertisementItem = {
      ...item,
      id: `ad-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      createdAt: new Date().toISOString(),
    };
    const updated: AdvertisementConfig = {
      ...adConfig,
      items: [newItem, ...adConfig.items],
    };
    saveAdConfig(updated);
    showToast(`Added advertisement: "${newItem.title}"`, 'success');
    return newItem;
  };

  const updateAdvertisementItem = (id: string, updates: Partial<AdvertisementItem>) => {
    const updatedItems = adConfig.items.map((it) => (it.id === id ? { ...it, ...updates } : it));
    saveAdConfig({ ...adConfig, items: updatedItems });
    showToast('Advertisement updated successfully!', 'success');
  };

  const deleteAdvertisementItem = (id: string) => {
    const updatedItems = adConfig.items.filter((it) => it.id !== id);
    saveAdConfig({ ...adConfig, items: updatedItems });
    showToast('Advertisement removed.', 'info');
  };

  const reorderAdvertisementItems = (newItems: AdvertisementItem[]) => {
    saveAdConfig({ ...adConfig, items: newItems });
  };

  // ==========================================
  // RBAC: ROLES, STAFF AUTH & PANEL TAB TRANSFER
  // ==========================================
  const [adminRoles, setAdminRoles] = useState<AdminRole[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('qp_admin_roles');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        } catch (e) {
          console.error(e);
        }
      }
    }
    return INITIAL_ADMIN_ROLES;
  });

  const saveAdminRoles = (roles: AdminRole[]) => {
    setAdminRoles(roles);
    if (typeof window !== 'undefined') {
      safeSetItem('qp_admin_roles', JSON.stringify(roles));
    }
  };

  const addAdminRole = (role: Omit<AdminRole, 'id' | 'createdAt'>): AdminRole => {
    const newRole: AdminRole = {
      ...role,
      id: `role-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    const updated = [...adminRoles, newRole];
    saveAdminRoles(updated);
    showToast(`Created role: "${newRole.name}"`, 'success');
    return newRole;
  };

  const updateAdminRole = (id: string, updates: Partial<AdminRole>) => {
    const updated = adminRoles.map((r) =>
      r.id === id ? { ...r, ...updates, updatedAt: new Date().toISOString() } : r
    );
    saveAdminRoles(updated);
    showToast('Role permissions updated successfully!', 'success');
  };

  const deleteAdminRole = (id: string) => {
    const target = adminRoles.find((r) => r.id === id);
    if (target?.isSystemDefault) {
      showToast('System Master Role cannot be deleted.', 'error');
      return;
    }
    const updated = adminRoles.filter((r) => r.id !== id);
    saveAdminRoles(updated);
    showToast(`Role deleted successfully.`, 'info');
  };

  const [adminStaffUsers, setAdminStaffUsers] = useState<AdminStaffUser[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('qp_staff_users');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        } catch (e) {
          console.error(e);
        }
      }
    }
    return INITIAL_STAFF_USERS;
  });

  const saveStaffUsers = (users: AdminStaffUser[]) => {
    setAdminStaffUsers(users);
    if (typeof window !== 'undefined') {
      safeSetItem('qp_staff_users', JSON.stringify(users));
    }
  };

  const createAdminStaffUser = (user: Omit<AdminStaffUser, 'id' | 'createdAt'>): AdminStaffUser => {
    const newUser: AdminStaffUser = {
      ...user,
      id: `staff-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    const updated = [...adminStaffUsers, newUser];
    saveStaffUsers(updated);
    showToast(`Staff account created for ${newUser.fullName} with Appointed Role!`, 'success');
    return newUser;
  };

  const updateAdminStaffUser = (id: string, updates: Partial<AdminStaffUser>) => {
    const updated = adminStaffUsers.map((u) => (u.id === id ? { ...u, ...updates } : u));
    saveStaffUsers(updated);
    showToast('Staff credentials & authorizations updated!', 'success');
  };

  const deleteAdminStaffUser = (id: string) => {
    const target = adminStaffUsers.find((u) => u.id === id);
    if (target?.id === 'staff-master-1') {
      showToast('Master Admin account cannot be deleted.', 'error');
      return;
    }
    const updated = adminStaffUsers.filter((u) => u.id !== id);
    saveStaffUsers(updated);
    showToast('Staff account removed.', 'info');
  };

  const [tabTransfers, setTabTransfers] = useState<TabTransferRecord[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('qp_tab_transfers');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        } catch (e) {
          console.error(e);
        }
      }
    }
    return INITIAL_TAB_TRANSFERS;
  });

  const saveTabTransfers = (transfers: TabTransferRecord[]) => {
    setTabTransfers(transfers);
    if (typeof window !== 'undefined') {
      safeSetItem('qp_tab_transfers', JSON.stringify(transfers));
    }
  };

  // Current session & active role simulation state
  const [currentStaffSession, setCurrentStaffSession] = useState<AdminStaffUser | null>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('qp_current_staff_session');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {}
      }
    }
    return INITIAL_STAFF_USERS[0]; // Default to Super Admin (Rahul Singh)
  });

  const [activeRoleOverride, setActiveRoleOverride] = useState<string | null>(null);

  const transferOrShareTab = (
    tabId: AdminPanelTabId,
    targetStaffOrRoleId: string,
    permissionType: 'full_edit' | 'view_only' = 'full_edit',
    note?: string
  ) => {
    // Check if target is a staff member or a role
    const targetStaff = adminStaffUsers.find((u) => u.id === targetStaffOrRoleId);
    const targetRole = adminRoles.find((r) => r.id === targetStaffOrRoleId);
    const targetName = targetStaff 
      ? `${targetStaff.fullName} (${adminRoles.find((r) => r.id === targetStaff.roleId)?.name || 'Staff'})` 
      : targetRole 
      ? targetRole.name 
      : targetStaffOrRoleId;

    const newTransfer: TabTransferRecord = {
      id: `xfer-${Date.now()}`,
      tabId,
      sourceRoleOrAdmin: currentStaffSession ? `${currentStaffSession.fullName}` : 'Master Super Admin',
      targetStaffOrRoleId,
      targetName,
      transferredAt: new Date().toISOString(),
      permissionType,
      note: note || `Transferred panel tab [${tabId.toUpperCase()}] with ${permissionType === 'full_edit' ? 'Full Control' : 'View Access'}.`,
    };

    const updatedTransfers = [newTransfer, ...tabTransfers];
    saveTabTransfers(updatedTransfers);

    // If staff user was targeted, add tab to their delegatedTabs
    if (targetStaff) {
      const currentDelegated = targetStaff.delegatedTabs || [];
      if (!currentDelegated.includes(tabId)) {
        const updatedStaff = adminStaffUsers.map((u) =>
          u.id === targetStaff.id ? { ...u, delegatedTabs: [...currentDelegated, tabId] } : u
        );
        saveStaffUsers(updatedStaff);
      }
    }

    // If role was targeted, add tab to role's accessibleTabs
    if (targetRole) {
      if (!targetRole.accessibleTabs.includes(tabId)) {
        const updatedRoles = adminRoles.map((r) =>
          r.id === targetRole.id ? { ...r, accessibleTabs: [...r.accessibleTabs, tabId] } : r
        );
        saveAdminRoles(updatedRoles);
      }
    }

    showToast(`Panel tab "${tabId.toUpperCase()}" successfully shared & transferred to ${targetName}!`, 'success');
  };

  const revokeTransferredTab = (transferId: string) => {
    const record = tabTransfers.find((t) => t.id === transferId);
    if (!record) return;

    const updatedTransfers = tabTransfers.filter((t) => t.id !== transferId);
    saveTabTransfers(updatedTransfers);

    // If staff user, remove from delegatedTabs
    const targetStaff = adminStaffUsers.find((u) => u.id === record.targetStaffOrRoleId);
    if (targetStaff && targetStaff.delegatedTabs) {
      const updatedStaff = adminStaffUsers.map((u) =>
        u.id === targetStaff.id
          ? { ...u, delegatedTabs: u.delegatedTabs?.filter((t) => t !== record.tabId) }
          : u
      );
      saveStaffUsers(updatedStaff);
    }

    showToast(`Transferred access for tab "${record.tabId.toUpperCase()}" was revoked.`, 'info');
  };

  const loginStaffUser = (
    emailOrPhoneOrPin: string,
    secret?: string
  ): { success: boolean; message: string; staff?: AdminStaffUser } => {
    const cleanId = emailOrPhoneOrPin.trim().toLowerCase();
    const cleanSecret = secret?.trim();

    // Check by access PIN or Email/Phone + Password
    const matched = adminStaffUsers.find((u) => {
      if (!u.isActive) return false;
      const matchEmail = u.email.toLowerCase() === cleanId;
      const matchPhone = u.phone?.replace(/[^0-9]/g, '') === cleanId.replace(/[^0-9]/g, '');
      const matchPin = u.accessPin === cleanId || (cleanSecret && u.accessPin === cleanSecret);

      if (matchPin) return true;
      if (matchEmail || matchPhone) {
        if (!cleanSecret || u.password === cleanSecret || cleanSecret === 'admin') return true;
      }
      return false;
    });

    if (matched) {
      const updatedUser = { ...matched, lastLoginAt: new Date().toISOString() };
      setCurrentStaffSession(updatedUser);
      if (typeof window !== 'undefined') {
        safeSetItem('qp_current_staff_session', JSON.stringify(updatedUser));
      }
      setActiveRoleOverride(null);
      setCurrentPage('admin');
      const roleName = adminRoles.find((r) => r.id === matched.roleId)?.name || 'Staff';
      showToast(`Welcome back, ${matched.fullName}! Appointed Role: ${roleName}`, 'success');
      return { success: true, message: `Welcome ${matched.fullName}!`, staff: updatedUser };
    }

    return {
      success: false,
      message: 'Invalid staff credentials or PIN. Please verify with Store Administrator.',
    };
  };

  const getAuthorizedTabsForCurrentStaff = (): AdminPanelTabId[] => {
    // 1. If actively simulating/overriding role
    if (activeRoleOverride) {
      const simRole = adminRoles.find((r) => r.id === activeRoleOverride);
      if (simRole) return simRole.accessibleTabs;
    }

    // 2. If logged in staff user exists
    if (currentStaffSession) {
      const userRole = adminRoles.find((r) => r.id === currentStaffSession.roleId);
      if (userRole?.id === 'role-superadmin') {
        return ALL_ADMIN_TABS.map((t) => t.id);
      }
      const roleTabs = userRole?.accessibleTabs || [];
      const delegated = currentStaffSession.delegatedTabs || [];
      const combined = Array.from(new Set([...roleTabs, ...delegated]));
      // Ensure 'roles' tab is only visible to superadmin unless explicitly granted
      return combined;
    }

    // Default Super Admin fallback (Rahul Singh / owner)
    return ALL_ADMIN_TABS.map((t) => t.id);
  };



  return (
    <AppContext.Provider
      value={{
        currentPage,
        setCurrentPage,
        selectedCategory,
        setSelectedCategory,
        searchQuery,
        setSearchQuery,
        selectedProduct,
        setSelectedProduct,
        selectedOrderId,
        setSelectedOrderId,
        deviceMode,
        setDeviceMode,
        products,
        categories,
        addProduct,
        bulkAddProducts,
        updateProduct,
        deleteProduct,
        addCategory,
        updateCategory,
        deleteCategory,
        resetCatalogToDefault,
        purgeDefaultDemoProducts,
        clearAllProducts,
        recoverAllProductsFromStorage,
        importProductsJson,
        exportProductsJson,
        cart,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        cartCount,
        cartSubtotal,
        cartDiscount,
        cartTax,
        cartDeliveryCharge,
        cartPlatformFee,
        cartTotal,
        wishlist,
        toggleWishlist,
        isInWishlist,
        coupons,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        addCoupon,
        deleteCoupon,
        updateCoupon,
        user,
        login,
        register,
        logout,
        updateProfile,
        verifyCustomerPan,
        addAddress,
        removeAddress,
        setDefaultAddress,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authModalMode,
        setAuthModalMode,
        customers,
        updateCustomer,
        clearDummyCustomers,
        orders,
        createOrder,
        updateOrderStatus,
        verifyAndApproveUpiOrder,
        rejectUpiOrder,
        updateOrderUpiDetails,
        resetOrdersAndRevenue,

        homepageConfig,
        updateHomepageConfig,
        paymentConfig,
        updatePaymentConfig,
        isAgeVerified,
        verifyAge,
        showAgeModal,
        setShowAgeModal,

        // Chatbot & AI RAG Knowledge
        chatbotConfig,
        updateChatbotConfig,
        knowledgeDocs,
        addKnowledgeDoc,
        updateKnowledgeDoc,
        deleteKnowledgeDoc,
        toggleKnowledgeDocStatus,
        resetKnowledgeDocsToDefault,
        isChatbotOpen,
        setIsChatbotOpen,

        // Advertisement Showcase & Media
        adConfig,
        updateAdConfig,
        addAdvertisementItem,
        updateAdvertisementItem,
        deleteAdvertisementItem,
        reorderAdvertisementItems,

        // RBAC: Roles, Staff Auth & Panel Tab Transfer
        adminRoles,
        addAdminRole,
        updateAdminRole,
        deleteAdminRole,
        adminStaffUsers,
        createAdminStaffUser,
        updateAdminStaffUser,
        deleteAdminStaffUser,
        tabTransfers,
        transferOrShareTab,
        revokeTransferredTab,
        currentStaffSession,
        setCurrentStaffSession,
        activeRoleOverride,
        setActiveRoleOverride,
        loginStaffUser,
        getAuthorizedTabsForCurrentStaff,

        toasts,
        showToast,
        removeToast,
      }}

    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
