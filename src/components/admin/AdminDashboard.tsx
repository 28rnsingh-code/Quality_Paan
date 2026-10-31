import React, { useState, useEffect, useRef } from 'react';
import { 
  BarChart3, 
  Package, 
  ShoppingBag, 
  Tag, 
  Settings, 
  Plus, 
  Edit, 
  Trash2, 
  X, 
  Search, 
  ArrowUpRight, 
  Save, 
  RotateCcw, 
  Sparkles, 
  Layers, 
  Leaf, 
  Flame, 
  FileText, 
  Zap, 
  CheckCircle2, 
  ListPlus, 
  Sliders, 
  Image as ImageIcon, 
  DollarSign, 
  Calculator, 
  TrendingUp, 
  Coins,
  ChevronLeft,
  ChevronRight,
  Crown,
  Calendar,
  Check,
  ExternalLink,
  Users,
  Clock,
  AlertTriangle,
  AlertCircle,
  Eye,
  Copy,
  QrCode,
  ShieldCheck,
  Truck,
  Box,
  MessageSquare,
  ArrowLeft,
  CreditCard,
  Info,
  FileSpreadsheet,
  Download,
  Upload,
  Film,
  Share2,
  Key
} from 'lucide-react';
import { 
  Product, 
  ProductCategory, 
  Order, 
  ProductVariant, 
  CategoryItem, 
  Coupon, 
  HeroSlide,
  HomepageConfig,
  CouponEligibility,
  CouponUsageLimitType,
  AdminPanelTabId
} from '../../types';
import { QualityPaanLogo } from '../brand/Logo';
import { AdminCustomerCRM } from './AdminCustomerCRM';
import { AdminPaymentConfigSection } from './AdminPaymentConfigSection';
import { ImageUploadField } from './ImageUploadField';
import { ProductExcelModal } from './ProductExcelModal';
import { ProductRecoveryModal } from './ProductRecoveryModal';
import { QuickPasteProductModal } from './QuickPasteProductModal';
import { ChatbotAdminPanel } from './ChatbotAdminPanel';
import { AdsAdminPanel } from './AdsAdminPanel';
import { RolesAndPermissionsPanel } from './RolesAndPermissionsPanel';
import { ConfirmModal } from '../common/ConfirmModal';
import { useApp } from '../../context/AppContext';


export const AdminDashboard: React.FC = () => {
  const {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    categories,
    addCategory,
    updateCategory,
    deleteCategory,
    resetCatalogToDefault,
    purgeDefaultDemoProducts,
    clearAllProducts,
    orders,
    updateOrderStatus,
    verifyAndApproveUpiOrder,
    rejectUpiOrder,
    coupons,
    addCoupon,
    deleteCoupon,
    updateCoupon,
    homepageConfig,
    updateHomepageConfig,
    customers,
    resetOrdersAndRevenue,
    setCurrentPage,
    showToast,
    currentStaffSession,
    activeRoleOverride,
    setActiveRoleOverride,
    getAuthorizedTabsForCurrentStaff,
    adminRoles,
  } = useApp();

  // Orders tab is default priority #1 tab
  const [activeTab, setActiveTab] = useState<AdminPanelTabId>('orders');
  
  const authorizedTabs = getAuthorizedTabsForCurrentStaff();

  // Auto switch if currently selected tab is not authorized
  useEffect(() => {
    if (authorizedTabs.length > 0 && !authorizedTabs.includes(activeTab)) {
      setActiveTab(authorizedTabs[0]);
    }
  }, [authorizedTabs, activeTab]);
  
  // Orders Filter & UPI Verification State
  const [orderFilter, setOrderFilter] = useState<'all' | 'payment_verification' | 'confirmed' | 'packed' | 'out_for_delivery' | 'delivered' | 'cancelled'>('all');
  const [verificationNotesMap, setVerificationNotesMap] = useState<Record<string, string>>({});
  const [dispatchNotesMap, setDispatchNotesMap] = useState<Record<string, string>>({});
  const [previewScreenshotUrl, setPreviewScreenshotUrl] = useState<string | null>(null);

  const pendingUpiOrdersCount = orders.filter(
    (o) => o.status === 'payment_verification' || (o.paymentMethod === 'upi' && !o.upiVerifiedByAdmin && o.status !== 'cancelled')
  ).length;
  
  // Tab scroll ref for Main Admin Tabs
  const tabsRef = useRef<HTMLDivElement>(null);

  const scrollTabs = (direction: 'left' | 'right') => {
    if (tabsRef.current) {
      tabsRef.current.scrollBy({
        left: direction === 'left' ? -280 : 280,
        behavior: 'smooth'
      });
    }
  };

  // Orders Stage Pills Scroll Ref
  const orderStagesTabsRef = useRef<HTMLDivElement>(null);
  const scrollOrderStages = (direction: 'left' | 'right') => {
    if (orderStagesTabsRef.current) {
      orderStagesTabsRef.current.scrollBy({
        left: direction === 'left' ? -240 : 240,
        behavior: 'smooth'
      });
    }
  };

  // Orders Date Range Filter (Default: Last 24 Hours / Live Stream) & Search State
  const [orderTimeRange, setOrderTimeRange] = useState<'24h' | 'today' | 'yesterday' | '7d' | '30d' | 'custom' | 'all'>('24h');
  const [orderCustomStartDate, setOrderCustomStartDate] = useState('');
  const [orderCustomEndDate, setOrderCustomEndDate] = useState('');
  const [orderSearchQuery, setOrderSearchQuery] = useState('');


  // Product Edit/Add State
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isExcelModalOpen, setIsExcelModalOpen] = useState(false);
  const [isRecoveryModalOpen, setIsRecoveryModalOpen] = useState(false);
  const [isQuickPasteModalOpen, setIsQuickPasteModalOpen] = useState(false);
  const [productSearch, setProductSearch] = useState('');
  const [selectedCatFilter, setSelectedCatFilter] = useState<string>('all');

  // Ingredient input for the modal
  const [newIngredientInput, setNewIngredientInput] = useState('');
  
  // Variant input helper
  const [newVariantName, setNewVariantName] = useState('');
  const [newVariantPrice, setNewVariantPrice] = useState<number>(180);
  const [newVariantMrp, setNewVariantMrp] = useState<number>(220);
  const [newVariantBuyPrice, setNewVariantBuyPrice] = useState<number>(65);
  const [newVariantStock, setNewVariantStock] = useState<number>(50);

  // Quick Inventory inline edit state (productId -> { buyPrice, price, stock })
  const [inlineInventoryChanges, setInlineInventoryChanges] = useState<Record<string, { buyPrice?: number; price?: number; stock?: number }>>({});

  // Attribute input helper
  const [newAttrKey, setNewAttrKey] = useState('');
  const [newAttrVal, setNewAttrVal] = useState('');
  // Dedicated Combo Editor State
  const [editingComboItem, setEditingComboItem] = useState<Partial<Product> | null>(null);
  const [isComboModalOpen, setIsComboModalOpen] = useState(false);
  const [comboSearchQuery, setComboSearchQuery] = useState('');
  const [newComboIncludedItemInput, setNewComboIncludedItemInput] = useState('');

  const combosList = products.filter(
    (p) =>
      p.category === 'combos' ||
      p.subcategory?.toLowerCase().includes('combo') ||
      p.subcategory?.toLowerCase().includes('gift') ||
      p.subcategory?.toLowerCase().includes('set') ||
      p.subcategory?.toLowerCase().includes('box') ||
      p.subcategory?.toLowerCase().includes('bundle') ||
      p.name.toLowerCase().includes('combo') ||
      p.name.toLowerCase().includes('gift') ||
      p.name.toLowerCase().includes('set') ||
      p.name.toLowerCase().includes('bundle') ||
      p.id.includes('combo')
  );

  const handleOpenComboModal = (combo?: Partial<Product>) => {
    if (combo) {
      setEditingComboItem({
        ...combo,
        ingredients:
          combo.ingredients && Array.isArray(combo.ingredients) && combo.ingredients.length > 0
            ? [...combo.ingredients]
            : [
                '1x 24K Gold Plated Hookah Set',
                '2x Herbal Shisha Molasses (50g)',
                '1x Quad-Torch Lighter',
                '1x Premium Charcoal Pack',
              ],
      });
    } else {
      setEditingComboItem({
        id: `prod-combo-${Date.now()}`,
        name: '',
        sku: `QP-CMB-${Math.floor(100 + Math.random() * 900)}`,
        category: 'combos',
        subcategory: 'Luxury Lounge Box',
        shortDescription: 'Luxury curated shisha, herbal flavour, and accessories bundle.',
        description: 'Exclusive artisanal combo package curated for connoisseurs. Includes handcrafted items, premium herbal molasses, and essential lounge accessories.',
        images: [],
        price: 2499,
        mrp: 3200,
        buyPrice: 1100,
        discountPercent: 22,
        stock: 25,
        isBestseller: true,
        isFeatured: true,
        isOffer: true,
        isTobaccoFree: true,
        ingredients: ['1x 24K Gold Plated Hookah', '2x Herbal Shisha Molasses (50g)', '1x Quad-Torch Lighter', '1x Quick-Lite Charcoal Pack'],
        rating: 4.9,
        reviewCount: 38,
      });
    }
    setIsComboModalOpen(true);
  };

  const handleSaveCombo = () => {
    if (!editingComboItem || !editingComboItem.name?.trim()) {
      showToast('Please enter a valid combo name.', 'error');
      return;
    }

    const price = Number(editingComboItem.price) || 0;
    const mrp = Number(editingComboItem.mrp) || price;
    const buyPrice = Number(editingComboItem.buyPrice) || 0;
    const discountPercent = mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0;

    const updatedCombo: Product = {
      id: editingComboItem.id || `prod-combo-${Date.now()}`,
      name: editingComboItem.name.trim(),
      sku: editingComboItem.sku || `QP-CMB-${Math.floor(100 + Math.random() * 900)}`,
      category: editingComboItem.category || 'combos',
      subcategory: editingComboItem.subcategory || 'Luxury Lounge Box',
      shortDescription: editingComboItem.shortDescription || '',
      description: editingComboItem.description || '',
      images: editingComboItem.images && editingComboItem.images.length > 0 ? editingComboItem.images : [],
      price,
      mrp,
      buyPrice,
      discountPercent,
      stock: Number(editingComboItem.stock) || 0,
      isBestseller: !!editingComboItem.isBestseller,
      isFeatured: !!editingComboItem.isFeatured,
      isOffer: !!editingComboItem.isOffer,
      isTobaccoFree: !!editingComboItem.isTobaccoFree,
      isAgeRestricted: editingComboItem.isAgeRestricted !== false,
      ingredients: editingComboItem.ingredients || [],
      rating: editingComboItem.rating || 4.9,
      reviewCount: editingComboItem.reviewCount || 12,
      createdAt: editingComboItem.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const exists = products.some((p) => p.id === updatedCombo.id);
    if (exists) {
      updateProduct(updatedCombo.id, updatedCombo);
      showToast(`Combo "${updatedCombo.name}" updated successfully!`, 'success');
    } else {
      addProduct(updatedCombo);
      showToast(`New Combo "${updatedCombo.name}" created successfully!`, 'success');
    }

    setIsComboModalOpen(false);
    setEditingComboItem(null);
  };

  // Category Edit/Add State
  const [editingCategory, setEditingCategory] = useState<Partial<CategoryItem> | null>(null);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

  // New Coupon Form State
  const [couponCode, setCouponCode] = useState('');
  const [couponDiscountType, setCouponDiscountType] = useState<'percent' | 'fixed'>('percent');
  const [couponDiscountVal, setCouponDiscountVal] = useState(20);
  const [couponMaxCap, setCouponMaxCap] = useState(500);
  const [couponMinSpend, setCouponMinSpend] = useState(499);
  const [couponDesc, setCouponDesc] = useState('');
  const [couponEligibility, setCouponEligibility] = useState<CouponEligibility>('all');
  const [couponFirstBuyOnly, setCouponFirstBuyOnly] = useState(false);
  const [couponAppliesToType, setCouponAppliesToType] = useState<'all' | 'specific_product' | 'specific_category'>('all');
  const [couponSelectedProductId, setCouponSelectedProductId] = useState('');
  const [couponSelectedCategoryId, setCouponSelectedCategoryId] = useState('');
  const [couponUsageLimitType, setCouponUsageLimitType] = useState<CouponUsageLimitType>('unlimited');
  const [couponMaxUsagePerUser, setCouponMaxUsagePerUser] = useState(1);
  const [couponMaxTotalLimit, setCouponMaxTotalLimit] = useState(500);
  const [couponExpiryDate, setCouponExpiryDate] = useState('');
  const [couponStartDate, setCouponStartDate] = useState('');
  const [couponReferralCode, setCouponReferralCode] = useState('');
  const [couponReferrerBonus, setCouponReferrerBonus] = useState(100);

  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [editingCouponOriginalId, setEditingCouponOriginalId] = useState<string>('');
  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
  const [couponToDelete, setCouponToDelete] = useState<Coupon | null>(null);

  // Reusable Confirmation Modal State
  const [confirmModalConfig, setConfirmModalConfig] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    confirmText?: string;
    variant?: 'danger' | 'warning' | 'info';
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });

  // CMS Slides State
  const [cmsSlides, setCmsSlides] = useState<HeroSlide[]>(
    homepageConfig.slides && homepageConfig.slides.length > 0
      ? homepageConfig.slides
      : [
          {
            id: 'slide-1',
            image: homepageConfig.heroImage || '',
            tagline: homepageConfig.heroTagline || '',
            ctaText: homepageConfig.heroCtaText || 'SHOP HOOKAHS >',
            announcement: homepageConfig.announcementText || '',
          }
        ]
  );

  // CMS Form State
  const [cmsHeroSubtitle, setCmsHeroSubtitle] = useState(homepageConfig.heroSubtitle);
  const [cmsHeroTagline, setCmsHeroTagline] = useState(homepageConfig.heroTagline);
  const [cmsHeroImage, setCmsHeroImage] = useState(homepageConfig.heroImage);
  const [cmsAnnouncement, setCmsAnnouncement] = useState(homepageConfig.announcementText);
  const [cmsPhone, setCmsPhone] = useState(homepageConfig.footerPhone);
  const [cmsEmail, setCmsEmail] = useState(homepageConfig.footerEmail);
  const [cmsAddress, setCmsAddress] = useState(homepageConfig.footerAddress);
  const [confirmResetRevenue, setConfirmResetRevenue] = useState(false);

  // Analytics Metrics (Reset cleanly to ₹0 and 0 completed orders)
  const completedOrdersList = orders.filter(o => o.paymentStatus === 'completed' || o.status === 'delivered');
  const totalRevenue = completedOrdersList.reduce((acc, o) => acc + o.total, 0);
  const totalOrdersCount = completedOrdersList.length;
  const activeProductsCount = products.length;
  const lowStockCount = products.filter(p => p.stock < 15).length;

  const quickPaanIngredientSuggestions = [
    '24K Gold Electroplated',
    'Heavy Crystal Glass Base',
    'Russian Matte Finish',
    'Phunnel Ceramic Vortex Bowl',
    'Pro Washable Silicone Hose',
    '100% Herbal & Nicotine-free',
    'Raw Organic Hemp Paper',
    'Quad-Jet Windproof Torch',
    'Smoke-Eliminating Formula',
    'Natural Premium Charcoal'
  ];

  useEffect(() => {
    if (homepageConfig) {
      setCmsHeroSubtitle(homepageConfig.heroSubtitle || 'ROYAL LUXURY HOOKAH & SHISHA');
      setCmsHeroTagline(homepageConfig.heroTagline || '');
      setCmsHeroImage(homepageConfig.heroImage || '');
      setCmsAnnouncement(homepageConfig.announcementText || '');
      setCmsPhone(homepageConfig.footerPhone || '+91 98765 43210');
      setCmsEmail(homepageConfig.footerEmail || 'care@qualityshisha.com');
      setCmsAddress(homepageConfig.footerAddress || 'Plot 42, Connaught Place, New Delhi');
      if (homepageConfig.slides && homepageConfig.slides.length > 0) {
        setCmsSlides(homepageConfig.slides);
      }
    }
  }, [homepageConfig]);

  const [isCmsSavedRecently, setIsCmsSavedRecently] = useState(false);

  const handleSaveCMS = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    const primarySlide = cmsSlides && cmsSlides.length > 0 ? cmsSlides[0] : null;

    const newConfig: Partial<HomepageConfig> = {
      heroSubtitle: cmsHeroSubtitle || 'ROYAL LUXURY HOOKAH & SHISHA',
      heroTagline: primarySlide?.tagline || cmsHeroTagline || 'Exquisite 24K Gold Plated Pipes & 100% Herbal Flavours.',
      heroImage: primarySlide?.image || cmsHeroImage || '',
      announcementText: primarySlide?.announcement || cmsAnnouncement || '✓ 100% Herbal & Nicotine-Free Shisha',
      heroCtaText: primarySlide?.ctaText || 'SHOP HOOKAHS >',
      slides: cmsSlides,
      footerPhone: cmsPhone,
      footerEmail: cmsEmail,
      footerAddress: cmsAddress,
    };

    updateHomepageConfig(newConfig);
    setIsCmsSavedRecently(true);
    showToast('Storefront Homepage CMS & Sliding Banners Saved Successfully!', 'success');

    setTimeout(() => {
      setIsCmsSavedRecently(false);
    }, 3000);
  };

  const handleOpenNewProduct = () => {
    setEditingProduct({
      name: '',
      category: 'hookah',
      subcategory: 'Luxury Hookahs',
      price: 2499,
      mrp: 3299,
      buyPrice: 1100,
      stock: 25,
      isTobaccoFree: true,
      isBestseller: true,
      isAgeRestricted: true,
      images: [],
      description: 'Crafted with royal elegance for connoisseur lounge experiences.',
      shortDescription: 'Exquisite shisha craftsmanship and royal aesthetic.',
      ingredients: [],
      variants: [],
      attributes: {
        'Material': 'Solid Brass & Glass',
        'Type': 'Imperial Hookah Set',
      },
    });
    setIsProductModalOpen(true);
  };

  const handleDuplicateProduct = (sourceProduct: Product) => {
    // Deep clone product properties, generating a new SKU and slug, and omitting ID so it creates a brand new product
    const clonedVariants = (sourceProduct.variants || []).map((v) => ({
      ...v,
      id: `v-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    }));

    setEditingProduct({
      name: `${sourceProduct.name} (Copy)`,
      sku: `QP-${Date.now().toString().slice(-6)}`,
      slug: `${sourceProduct.slug}-copy-${Date.now().toString().slice(-4)}`,
      category: sourceProduct.category,
      subcategory: sourceProduct.subcategory,
      price: sourceProduct.price,
      mrp: sourceProduct.mrp,
      buyPrice: sourceProduct.buyPrice,
      discountPercent: sourceProduct.discountPercent,
      stock: sourceProduct.stock,
      images: [...(sourceProduct.images || [])],
      description: sourceProduct.description,
      shortDescription: sourceProduct.shortDescription,
      ingredients: [...(sourceProduct.ingredients || [])],
      variants: clonedVariants,
      attributes: { ...(sourceProduct.attributes || {}) },
      isBestseller: !!sourceProduct.isBestseller,
      isFeatured: !!sourceProduct.isFeatured,
      isTobaccoFree: sourceProduct.isTobaccoFree !== false,
      isAgeRestricted: !!sourceProduct.isAgeRestricted,
      rating: 5.0,
      reviewCount: 1,
    });
    setIsProductModalOpen(true);
    showToast(`Product template cloned from "${sourceProduct.name}"! Update size, image or price and click Save.`, 'info');
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct?.name || !editingProduct?.price) {
      showToast('Please enter a product title and price.', 'error');
      return;
    }

    const price = Number(editingProduct.price) || 0;
    const mrp = Number(editingProduct.mrp) || price;
    const buyPrice = Number(editingProduct.buyPrice) || Math.round(price * 0.4);
    const discountPercent = mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0;

    if (editingProduct.id) {
      updateProduct(editingProduct.id, {
        ...editingProduct,
        price,
        mrp,
        buyPrice,
        discountPercent,
        stock: Number(editingProduct.stock) || 0,
        ingredients: editingProduct.ingredients || [],
        variants: editingProduct.variants || [],
        attributes: editingProduct.attributes || {},
      });
    } else {
      addProduct({
        name: editingProduct.name,
        sku: editingProduct.sku || `QP-${Date.now().toString().slice(-6)}`,
        slug: (editingProduct.name).toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        category: (editingProduct.category || 'hookah') as ProductCategory,
        subcategory: editingProduct.subcategory || 'Royal Selection',
        price,
        mrp,
        buyPrice,
        discountPercent,
        stock: Number(editingProduct.stock) || 50,
        images: editingProduct.images && editingProduct.images.length > 0 
          ? editingProduct.images 
          : [],
        description: editingProduct.description || 'Royal artisanal selection.',
        shortDescription: editingProduct.shortDescription || 'Fresh premium quality.',
        ingredients: editingProduct.ingredients || [],
        variants: editingProduct.variants || [],
        attributes: editingProduct.attributes || {},
        isBestseller: !!editingProduct.isBestseller,
        isFeatured: !!editingProduct.isFeatured,
        isTobaccoFree: editingProduct.isTobaccoFree !== false,
        isAgeRestricted: !!editingProduct.isAgeRestricted,
        rating: 5.0,
        reviewCount: 1,
      });
    }

    setIsProductModalOpen(false);
    setEditingProduct(null);
  };

  const handleAddIngredient = (item: string) => {
    const val = item.trim();
    if (!val || !editingProduct) return;
    const current = editingProduct.ingredients || [];
    if (!current.includes(val)) {
      setEditingProduct({
        ...editingProduct,
        ingredients: [...current, val],
      });
    }
    setNewIngredientInput('');
  };

  const handleRemoveIngredient = (idx: number) => {
    if (!editingProduct) return;
    const updated = (editingProduct.ingredients || []).filter((_, i) => i !== idx);
    setEditingProduct({ ...editingProduct, ingredients: updated });
  };

  const handleAddVariant = () => {
    if (!newVariantName || !editingProduct) return;
    const newV: ProductVariant = {
      id: `v-${Date.now()}`,
      name: newVariantName,
      price: newVariantPrice,
      mrp: newVariantMrp,
      buyPrice: newVariantBuyPrice,
      stock: newVariantStock,
    };
    setEditingProduct({
      ...editingProduct,
      variants: [...(editingProduct.variants || []), newV],
    });
    setNewVariantName('');
    setNewVariantPrice(180);
    setNewVariantMrp(220);
    setNewVariantBuyPrice(65);
    setNewVariantStock(50);
  };

  const handleRemoveVariant = (id: string) => {
    if (!editingProduct) return;
    setEditingProduct({
      ...editingProduct,
      variants: (editingProduct.variants || []).filter(v => v.id !== id),
    });
  };

  const handleAddAttribute = () => {
    if (!newAttrKey.trim() || !newAttrVal.trim() || !editingProduct) return;
    setEditingProduct({
      ...editingProduct,
      attributes: {
        ...(editingProduct.attributes || {}),
        [newAttrKey.trim()]: newAttrVal.trim(),
      },
    });
    setNewAttrKey('');
    setNewAttrVal('');
  };

  const handleRemoveAttribute = (key: string) => {
    if (!editingProduct || !editingProduct.attributes) return;
    const copy = { ...editingProduct.attributes };
    delete copy[key];
    setEditingProduct({ ...editingProduct, attributes: copy });
  };

  // Category save
  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory?.displayName?.trim()) return;

    const trimmedName = editingCategory.displayName.trim();
    const existingCategory = editingCategory.id ? categories.find(c => c.id === editingCategory.id) : null;

    if (existingCategory) {
      updateCategory(existingCategory.id, {
        displayName: trimmedName,
        name: editingCategory.name?.trim() || trimmedName,
        image: editingCategory.image || existingCategory.image,
        description: editingCategory.description || '',
        iconName: editingCategory.iconName || existingCategory.iconName || 'Leaf',
        itemCount: editingCategory.itemCount || existingCategory.itemCount || 10,
      });
    } else {
      const generatedId = (editingCategory.id || trimmedName.toLowerCase().replace(/[^a-z0-9]+/g, '_')) as ProductCategory;
      addCategory({
        id: generatedId,
        name: editingCategory.name?.trim() || trimmedName,
        displayName: trimmedName.toUpperCase(),
        image: editingCategory.image || '',
        description: editingCategory.description || 'Royal curated items.',
        iconName: editingCategory.iconName || 'Sparkles',
        itemCount: 12,
      });
    }
    setIsCategoryModalOpen(false);
    setEditingCategory(null);
  };


  const handleAddCouponSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode) return;

    const targetProd = couponAppliesToType === 'specific_product' && couponSelectedProductId 
      ? products.find(p => p.id === couponSelectedProductId)
      : undefined;
    const targetCat = couponAppliesToType === 'specific_category' && couponSelectedCategoryId 
      ? categories.find(c => c.id === couponSelectedCategoryId)
      : undefined;

    const isFirstBuy = couponFirstBuyOnly || couponEligibility === 'new_user_only';

    // Auto-generate clean description if user didn't enter custom one
    let autoDesc = couponDesc;
    if (!autoDesc) {
      const discountText = couponDiscountType === 'percent' ? `${couponDiscountVal}% OFF` : `₹${couponDiscountVal} OFF`;
      if (couponAppliesToType === 'specific_product' && targetProd) {
        autoDesc = isFirstBuy 
          ? `First Buy Offer: ${discountText} on "${targetProd.name}" (1st Order)` 
          : `${discountText} on "${targetProd.name}"`;
      } else if (couponAppliesToType === 'specific_category' && targetCat) {
        autoDesc = isFirstBuy 
          ? `First Buy Offer: ${discountText} on ${targetCat.displayName} (1st Order)` 
          : `${discountText} on all ${targetCat.displayName}`;
      } else {
        autoDesc = isFirstBuy 
          ? `First Buy Special: ${discountText} on your 1st royal order` 
          : `${discountText} on royal orders`;
      }
    }

    const newC: Coupon = {
      id: `coup-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      code: couponCode.toUpperCase().trim(),
      discountPercent: couponDiscountType === 'percent' ? couponDiscountVal : undefined,
      discountAmount: couponDiscountType === 'fixed' ? couponDiscountVal : undefined,
      maxDiscountCap: couponMaxCap > 0 ? couponMaxCap : undefined,
      minOrderValue: couponMinSpend || 0,
      description: autoDesc,
      isActive: true,
      appliesToType: couponAppliesToType,
      applicableProductIds: couponAppliesToType === 'specific_product' && couponSelectedProductId ? [couponSelectedProductId] : [],
      applicableCategoryIds: couponAppliesToType === 'specific_category' && couponSelectedCategoryId ? [couponSelectedCategoryId] : [],
      targetProductName: targetProd?.name,
      targetCategoryName: targetCat?.displayName,
      eligibility: isFirstBuy ? 'new_user_only' : couponEligibility,
      firstBuyOnly: isFirstBuy,
      usageLimitType: isFirstBuy ? 'once_per_user' : couponUsageLimitType,
      maxUsagePerUser: isFirstBuy ? 1 : (couponUsageLimitType === 'once_per_user' || couponUsageLimitType === 'once_per_month' ? 1 : (couponMaxUsagePerUser || 1)),
      maxTotalUsageLimit: couponMaxTotalLimit > 0 ? couponMaxTotalLimit : undefined,
      expiryDate: couponExpiryDate || undefined,
      startDate: couponStartDate || undefined,
      referralCode: couponReferralCode || undefined,
      referrerBonusAmount: couponReferrerBonus > 0 ? couponReferrerBonus : undefined,
      usedCount: 0,
    };

    addCoupon(newC);
    setCouponCode('');
    setCouponDesc('');
    setCouponExpiryDate('');
    setCouponStartDate('');
    setCouponReferralCode('');
    setCouponFirstBuyOnly(false);
    setCouponAppliesToType('all');
    setCouponSelectedProductId('');
    setCouponSelectedCategoryId('');
  };

  const handleSaveCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCoupon) return;

    const targetProd = editingCoupon.appliesToType === 'specific_product' && editingCoupon.applicableProductIds?.[0]
      ? products.find(p => p.id === editingCoupon.applicableProductIds?.[0])
      : undefined;
    const targetCat = editingCoupon.appliesToType === 'specific_category' && editingCoupon.applicableCategoryIds?.[0]
      ? categories.find(c => c.id === editingCoupon.applicableCategoryIds?.[0])
      : undefined;

    const isFirstBuy = editingCoupon.eligibility === 'new_user_only' || !!editingCoupon.firstBuyOnly;

    const payload: Partial<Coupon> = {
      code: editingCoupon.code.toUpperCase().trim(),
      discountPercent: editingCoupon.discountPercent,
      discountAmount: editingCoupon.discountAmount,
      maxDiscountCap: editingCoupon.maxDiscountCap,
      minOrderValue: editingCoupon.minOrderValue || 0,
      description: editingCoupon.description || '',
      isActive: editingCoupon.isActive,
      appliesToType: editingCoupon.appliesToType || 'all',
      applicableProductIds: editingCoupon.appliesToType === 'specific_product' ? (editingCoupon.applicableProductIds || []) : [],
      applicableCategoryIds: editingCoupon.appliesToType === 'specific_category' ? (editingCoupon.applicableCategoryIds || []) : [],
      targetProductName: targetProd ? targetProd.name : (editingCoupon.appliesToType === 'specific_product' ? editingCoupon.targetProductName : undefined),
      targetCategoryName: targetCat ? targetCat.displayName : (editingCoupon.appliesToType === 'specific_category' ? editingCoupon.targetCategoryName : undefined),
      eligibility: isFirstBuy ? 'new_user_only' : (editingCoupon.eligibility || 'all'),
      firstBuyOnly: isFirstBuy,
      usageLimitType: isFirstBuy ? 'once_per_user' : (editingCoupon.usageLimitType || 'unlimited'),
      maxUsagePerUser: isFirstBuy ? 1 : (editingCoupon.maxUsagePerUser || 1),
      maxTotalUsageLimit: editingCoupon.maxTotalUsageLimit,
      expiryDate: editingCoupon.expiryDate || undefined,
      startDate: editingCoupon.startDate || undefined,
      referralCode: editingCoupon.referralCode || undefined,
      referrerBonusAmount: editingCoupon.referrerBonusAmount,
    };

    updateCoupon(editingCouponOriginalId || editingCoupon.id || editingCoupon.code, payload);
    setIsCouponModalOpen(false);
    setEditingCoupon(null);
    setEditingCouponOriginalId('');
  };

  // Order Action Modal State (for Move Backward & Reject with mandatory comment/reason)
  const [orderActionModal, setOrderActionModal] = useState<{
    isOpen: boolean;
    order: Order | null;
    actionType: 'reject' | 'backward';
    targetStatus?: Order['status'];
    targetStageName?: string;
    comment: string;
  }>({
    isOpen: false,
    order: null,
    actionType: 'reject',
    targetStatus: 'cancelled',
    targetStageName: 'Cancelled / Rejected',
    comment: '',
  });

  const openRejectModal = (order: Order) => {
    setOrderActionModal({
      isOpen: true,
      order,
      actionType: 'reject',
      targetStatus: 'cancelled',
      targetStageName: 'Cancelled / Rejected',
      comment: '',
    });
  };

  const openBackwardModal = (order: Order, targetStatus: Order['status'], targetStageName: string) => {
    setOrderActionModal({
      isOpen: true,
      order,
      actionType: 'backward',
      targetStatus,
      targetStageName,
      comment: '',
    });
  };

  const handleConfirmOrderAction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderActionModal.order) return;
    const { order, actionType, targetStatus, targetStageName, comment } = orderActionModal;
    const finalComment = comment.trim() || (actionType === 'reject' ? 'Order cancelled by store management' : `Delayed due to operational conditions`);

    if (actionType === 'reject') {
      if (order.status === 'payment_verification' || (order.paymentMethod === 'upi' && !order.upiVerifiedByAdmin)) {
        rejectUpiOrder(order.id, finalComment);
      } else {
        updateOrderStatus(order.id, 'cancelled', `Order rejected / cancelled by admin: ${finalComment}`);
      }
      setOrderFilter('all');
      showToast(`Order #${order.orderNumber} rejected & cancelled. Reason: ${finalComment}`, 'error');
    } else {
      updateOrderStatus(order.id, targetStatus || 'pending', `Order moved backward to ${targetStageName || 'previous stage'}. Reason: ${finalComment}`);
      setOrderFilter('all');
      showToast(`Order #${order.orderNumber} moved backward to ${targetStageName}. Reason: ${finalComment}`, 'warning');
    }

    setOrderActionModal({
      isOpen: false,
      order: null,
      actionType: 'reject',
      targetStatus: 'cancelled',
      targetStageName: '',
      comment: '',
    });
  };

  const handleDropdownStatusChange = (order: Order, newStatus: Order['status']) => {
    if (newStatus === order.status) return;
    if (newStatus === 'cancelled') {
      openRejectModal(order);
      return;
    }
    
    const stageOrder: Record<Order['status'], number> = {
      payment_verification: 0,
      pending: 1,
      confirmed: 2,
      packed: 3,
      out_for_delivery: 4,
      delivered: 5,
      cancelled: 6,
    };
    
    const stageLabels: Record<Order['status'], string> = {
      payment_verification: 'Payment Verification',
      pending: 'Pending / Received',
      confirmed: 'Confirmed',
      packed: 'Freshly Packed',
      out_for_delivery: 'Out for Delivery',
      delivered: 'Delivered',
      cancelled: 'Cancelled / Rejected',
    };

    if (stageOrder[newStatus] < stageOrder[order.status]) {
      openBackwardModal(order, newStatus, stageLabels[newStatus] || newStatus);
    } else {
      updateOrderStatus(order.id, newStatus, `Order status advanced to ${stageLabels[newStatus] || newStatus} by store admin`);
      showToast(`Order #${order.orderNumber} status changed to ${stageLabels[newStatus] || newStatus}!`, 'info');
    }
  };

  const handleAddCmsSlide = () => {
    setCmsSlides([
      ...cmsSlides,
      {
        id: `slide-${Date.now()}`,
        image: '',
        tagline: 'Exquisite 24K Gold Plated Pipes & Herbal Flavours',
        ctaText: 'SHOP HOOKAHS >',
        announcement: '✓ 100% Herbal & Nicotine-Free Shisha',
      },
    ]);
  };

  const handleRemoveCmsSlide = (index: number) => {
    if (cmsSlides.length <= 1) {
      showToast('You must keep at least one slide in the hero banner.', 'error');
      return;
    }
    setCmsSlides(cmsSlides.filter((_, i) => i !== index));
  };

  const handleUpdateCmsSlide = (index: number, updates: Partial<HeroSlide>) => {
    const updated = [...cmsSlides];
    updated[index] = { ...updated[index], ...updates };
    setCmsSlides(updated);
  };

  // Filter products
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(productSearch.toLowerCase()) || 
                          p.subcategory?.toLowerCase().includes(productSearch.toLowerCase());
    const matchesCat = selectedCatFilter === 'all' || p.category === selectedCatFilter;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#F3EFE0] p-4 sm:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Admin Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-[#121212] border border-[#C59B27]/40 shadow-2xl">
          <div className="flex items-center gap-4">
            <QualityPaanLogo size="sm" variant="icon-only" />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-royal text-xl sm:text-2xl font-black text-[#E5C158]">
                  QUALITY PAAN ADMIN DASHBOARD
                </h1>
                <span className="bg-[#2ECC71]/20 text-[#2ECC71] border border-[#2ECC71]/40 text-[10px] font-bold px-2 py-0.5 rounded">
                  LIVE CATALOG
                </span>
              </div>
              <p className="text-xs text-gray-400 font-serif-luxury italic">
                Manage Hookah/Shisha, Flavours, Bongs & Rolls, Lighters & Ashtrays, Fragrances & menu categories
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setConfirmModalConfig({
                  isOpen: true,
                  title: 'Restore Default Catalog',
                  message: 'Are you sure you want to reset products and categories back to default Hookah/Shisha, Flavours, Bongs & Rolls, Lighters & Ashtrays, and Fragrances?',
                  confirmText: 'Yes, Restore Defaults',
                  variant: 'warning',
                  onConfirm: () => resetCatalogToDefault(),
                });
              }}
              className="px-3.5 py-2 rounded-lg bg-[#1F190B] text-xs font-semibold text-[#E5C158] hover:bg-[#D4AF37] hover:text-black border border-[#D4AF37]/50 flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Reset products to default authentic Hookah & Shisha catalogue"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Restore Default Catalog
            </button>
            <button
              onClick={() => setCurrentPage('home')}
              className="px-4 py-2 rounded-lg bg-[#1F1F1F] text-xs font-semibold text-gray-300 hover:text-white border border-[#333] hover:border-[#D4AF37]"
            >
              Back to Storefront
            </button>
          </div>
        </div>

        {/* Appointed Role Status & Quick Switcher Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-[#141414] rounded-xl border border-white/10 text-xs">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-lg bg-[#C59B27]/20 text-[#E5C158]">
              <ShieldCheck className="w-4 h-4" />
            </span>
            <span className="text-gray-400 font-royal">Active Authorization Clearance:</span>
            <span className="px-2.5 py-0.5 rounded-full font-royal font-bold bg-[#C59B27]/20 text-[#E5C158] border border-[#C59B27]/40">
              {activeRoleOverride
                ? `${adminRoles.find((r) => r.id === activeRoleOverride)?.name || 'Custom Role'} (Simulated)`
                : currentStaffSession
                ? `${currentStaffSession.fullName} • ${adminRoles.find((r) => r.id === currentStaffSession.roleId)?.name || 'Admin'}`
                : 'Master Root Administrator'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-gray-400 font-royal text-[11px]">Preview Appointed Dashboard:</span>
            <select
              value={activeRoleOverride || 'all'}
              onChange={(e) => setActiveRoleOverride(e.target.value === 'all' ? null : e.target.value)}
              className="px-2.5 py-1 bg-black/70 border border-white/15 rounded-lg text-xs text-[#E5C158] font-royal focus:outline-none"
            >
              <option value="all">👑 Master Super Admin (All 13 Tabs)</option>
              {adminRoles
                .filter((r) => !r.isSystemDefault)
                .map((r) => (
                  <option key={r.id} value={r.id}>
                    🔒 {r.name} ({r.accessibleTabs.length} Tabs)
                  </option>
                ))}
            </select>
            {activeRoleOverride && (
              <button
                onClick={() => setActiveRoleOverride(null)}
                className="px-2 py-1 rounded bg-red-500/20 text-red-300 border border-red-500/40 text-[10px] font-royal font-bold"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        {/* Tab Navigation with Left/Right Arrow Navigation Controls */}
        <div className="relative flex items-center gap-2 w-full">
          {/* Scroll Left Arrow Button */}
          <button
            type="button"
            onClick={() => scrollTabs('left')}
            className="flex-shrink-0 p-2 sm:p-2.5 rounded-xl bg-[#161616] border border-[#C59B27]/40 hover:border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black transition-all shadow-lg active:scale-95 flex items-center justify-center z-10"
            title="Scroll tabs left"
            aria-label="Scroll tabs left"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          {/* Scrollable Tabs Row */}
          <div 
            ref={tabsRef}
            className="flex gap-2 overflow-x-auto no-scrollbar scroll-smooth flex-1 py-1"
          >
            {/* 1. ORDERS & DISPATCH (PRIORITY #1 FIRST TAB) */}
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-4 py-2.5 rounded-xl font-royal text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap shadow-sm ${
                activeTab === 'orders'
                  ? 'bg-gradient-to-r from-[#D4AF37] to-[#E5C158] text-black shadow-md ring-2 ring-[#D4AF37]/50'
                  : 'bg-[#141414] text-gray-300 border border-[#252525] hover:border-[#C59B27]/50'
              }`}
            >
              <ShoppingBag className="w-4 h-4 text-black" /> 
              <span>Orders &amp; Dispatch ({orders.length})</span>
              {pendingUpiOrdersCount > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-black animate-pulse flex items-center gap-1 shadow">
                  <Clock className="w-3 h-3 text-black" />
                  <span>{pendingUpiOrdersCount} UPI Pending</span>
                </span>
              )}
            </button>

            {/* 2. CATALOG & PRODUCTS */}
            <button
              onClick={() => setActiveTab('products')}
              className={`px-4 py-2.5 rounded-xl font-royal text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'products'
                  ? 'bg-[#D4AF37] text-black shadow-md'
                  : 'bg-[#141414] text-gray-300 border border-[#252525] hover:border-[#C59B27]/50'
              }`}
            >
              <Package className="w-4 h-4" /> Royal Catalog &amp; Products ({products.length})
            </button>

            {/* COMBOS & GIFT SETS */}
            <button
              onClick={() => setActiveTab('combos')}
              className={`px-4 py-2.5 rounded-xl font-royal text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                activeTab === 'combos'
                  ? 'bg-gradient-to-r from-amber-400 via-amber-500 to-[#D4AF37] text-black shadow-md ring-2 ring-[#D4AF37]/50'
                  : 'bg-[#141414] text-gray-300 border border-[#252525] hover:border-[#C59B27]/50'
              }`}
            >
              <Sparkles className="w-4 h-4 text-[#E5C158]" /> Combos &amp; Gift Sets ({combosList.length})
            </button>

            {/* 3. CUSTOMERS */}
            <button
              onClick={() => setActiveTab('customers')}
              className={`px-4 py-2.5 rounded-xl font-royal text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'customers'
                  ? 'bg-[#D4AF37] text-black shadow-md'
                  : 'bg-[#141414] text-gray-300 border border-[#252525] hover:border-[#C59B27]/50'
              }`}
            >
              <Users className="w-4 h-4 text-[#D4AF37]" /> Customers &amp; 18+ PAN Card ({customers.length})
            </button>


            {/* 5. INVENTORY & PROFIT */}
            <button
              onClick={() => setActiveTab('inventory')}
              className={`px-4 py-2.5 rounded-xl font-royal text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'inventory'
                  ? 'bg-[#D4AF37] text-black shadow-md'
                  : 'bg-[#141414] text-gray-300 border border-[#252525] hover:border-[#C59B27]/50'
              }`}
            >
              <Calculator className="w-4 h-4" /> Inventory &amp; Profit Margin
            </button>

            {/* 6. CATEGORIES */}
            <button
              onClick={() => setActiveTab('categories')}
              className={`px-4 py-2.5 rounded-xl font-royal text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'categories'
                  ? 'bg-[#D4AF37] text-black shadow-md'
                  : 'bg-[#141414] text-gray-300 border border-[#252525] hover:border-[#C59B27]/50'
              }`}
            >
              <Layers className="w-4 h-4" /> Menu Categories ({categories.length})
            </button>

            {/* 7. COUPONS */}
            <button
              onClick={() => setActiveTab('coupons')}
              className={`px-4 py-2.5 rounded-xl font-royal text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'coupons'
                  ? 'bg-[#D4AF37] text-black shadow-md'
                  : 'bg-[#141414] text-gray-300 border border-[#252525] hover:border-[#C59B27]/50'
              }`}
            >
              <Tag className="w-4 h-4" /> Coupons &amp; Discounts ({coupons.length})
            </button>

            {/* 8. PAYMENT CONFIGURATION & GATEWAYS */}
            {(authorizedTabs.includes('payments') || activeRoleOverride === null) && (
              <button
                onClick={() => setActiveTab('payments')}
                className={`px-4 py-2.5 rounded-xl font-royal text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                  activeTab === 'payments'
                    ? 'bg-gradient-to-r from-[#D4AF37] to-[#E5C158] text-black shadow-md ring-2 ring-[#D4AF37]/50'
                    : 'bg-[#141414] text-gray-300 border border-[#252525] hover:border-[#C59B27]/50'
                }`}
              >
                <CreditCard className="w-4 h-4 text-[#D4AF37]" />
                <span>Payment Gateway &amp; UPI Setup</span>
              </button>
            )}

            {/* 9. AI CHATBOT & RAG KNOWLEDGE AUTOMATION */}
            {(authorizedTabs.includes('chatbot') || activeRoleOverride === null) && (
              <button
                onClick={() => setActiveTab('chatbot')}
                className={`px-4 py-2.5 rounded-xl font-royal text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                  activeTab === 'chatbot'
                    ? 'bg-gradient-to-r from-[#D4AF37] via-[#F3D079] to-[#E5C158] text-black shadow-lg ring-2 ring-[#D4AF37]/60'
                    : 'bg-[#161309] text-[#E5C158] border border-[#D4AF37]/40 hover:border-[#D4AF37]'
                }`}
              >
                <Sparkles className="w-4 h-4 text-[#D4AF37] animate-pulse" />
                <span>🤖 AI Chatbot &amp; RAG Knowledge</span>
              </button>
            )}

            {/* 10. HOMEPAGE VIDEO ADS & PLAYFUL GIF SHOWCASE */}
            {(authorizedTabs.includes('ads') || activeRoleOverride === null) && (
              <button
                onClick={() => setActiveTab('ads')}
                className={`px-4 py-2.5 rounded-xl font-royal text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                  activeTab === 'ads'
                    ? 'bg-gradient-to-r from-rose-500 via-amber-500 to-[#D4AF37] text-black shadow-lg ring-2 ring-rose-400/60'
                    : 'bg-[#181315] text-rose-300 border border-rose-500/30 hover:border-rose-400'
                }`}
              >
                <Film className="w-4 h-4 text-rose-400" />
                <span>🎬 Ads &amp; Video Reels Showcase</span>
              </button>
            )}

            {/* 11. ROLES, APPOINTED STAFF AUTH & TAB TRANSFER */}
            {(authorizedTabs.includes('roles') || activeRoleOverride === null) && (
              <button
                onClick={() => setActiveTab('roles')}
                className={`px-4 py-2.5 rounded-xl font-royal text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                  activeTab === 'roles'
                    ? 'bg-gradient-to-r from-purple-500 via-indigo-400 to-[#D4AF37] text-black shadow-lg ring-2 ring-purple-400/60'
                    : 'bg-[#141219] text-purple-300 border border-purple-500/30 hover:border-purple-400'
                }`}
              >
                <ShieldCheck className="w-4 h-4 text-purple-400" />
                <span>🛡️ Roles &amp; Staff Tab RBAC</span>
              </button>
            )}

            {/* 12. OVERVIEW & ANALYTICS */}
            {(authorizedTabs.includes('analytics') || activeRoleOverride === null) && (
              <button
                onClick={() => setActiveTab('analytics')}
                className={`px-4 py-2.5 rounded-xl font-royal text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                  activeTab === 'analytics'
                    ? 'bg-[#D4AF37] text-black shadow-md'
                    : 'bg-[#141414] text-gray-300 border border-[#252525] hover:border-[#C59B27]/50'
                }`}
              >
                <BarChart3 className="w-4 h-4" /> Overview &amp; Revenue
              </button>
            )}

            {/* 13. CMS */}
            {(authorizedTabs.includes('cms') || activeRoleOverride === null) && (
              <button
                onClick={() => setActiveTab('cms')}
                className={`px-4 py-2.5 rounded-xl font-royal text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                  activeTab === 'cms'
                    ? 'bg-[#D4AF37] text-black shadow-md'
                    : 'bg-[#141414] text-gray-300 border border-[#252525] hover:border-[#C59B27]/50'
                }`}
              >
                <Settings className="w-4 h-4" /> Store CMS &amp; Hero
              </button>
            )}
          </div>


          {/* Scroll Right Arrow Button */}
          <button
            type="button"
            onClick={() => scrollTabs('right')}
            className="flex-shrink-0 p-2 sm:p-2.5 rounded-xl bg-[#161616] border border-[#C59B27]/40 hover:border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black transition-all shadow-lg active:scale-95 flex items-center justify-center z-10"
            title="Scroll tabs right"
            aria-label="Scroll tabs right"
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        {/* TAB: PRODUCTS MANAGEMENT */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            {/* MORNING 7 AM PRODUCTS & CATALOG RESTORE BANNER */}
            <div className="relative overflow-hidden p-5 rounded-2xl bg-gradient-to-r from-[#1E1706] via-[#2A1E06] to-[#14120B] border-2 border-[#D4AF37]/60 shadow-2xl">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <div className="w-12 h-12 rounded-xl bg-[#3D2C0C] border border-[#D4AF37] text-[#E5C158] flex items-center justify-center flex-shrink-0 shadow-lg">
                    <Sparkles className="w-6 h-6 animate-pulse text-[#F3D079]" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-royal text-base font-bold text-[#E5C158]">
                        🌅 Morning 7 AM Products &amp; Catalog Restore Center
                      </h3>
                      <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-[#162A17] text-[#2ECC71] border border-[#2ECC71]/40 font-bold">
                        1-Click Restore
                      </span>
                    </div>
                    <p className="text-xs text-gray-300 mt-1 max-w-2xl leading-relaxed">
                      Need your morning 7 AM products or template listing? Upload your <strong className="text-white">.ZIP package</strong> (Excel + photos like <span className="text-[#E5C158] font-mono">QT-mya02</span> for <span className="text-white">OT MYA</span>), use Quick Paste, or run 1-Click Scan to restore any cached browser listings.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 flex-wrap">
                  <button
                    type="button"
                    onClick={() => setIsExcelModalOpen(true)}
                    className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#F3D079] via-[#D4AF37] to-[#B38C1B] text-black font-royal font-extrabold text-xs flex items-center gap-2 hover:brightness-110 shadow-lg active:scale-95 cursor-pointer transition-all"
                  >
                    <Package className="w-4 h-4 text-black" />
                    <span>📦 Upload ZIP Package / Excel</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsRecoveryModalOpen(true)}
                    className="px-4 py-2.5 rounded-xl bg-[#1C1C1C] hover:bg-[#2A2A2A] text-gray-200 border border-[#444] font-royal font-bold text-xs flex items-center gap-2 shadow-md active:scale-95 cursor-pointer transition-all"
                  >
                    <ShieldCheck className="w-4 h-4 text-[#2ECC71]" />
                    <span>🛡️ 1-Click Storage Scan</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsQuickPasteModalOpen(true)}
                    className="px-4 py-2.5 rounded-xl bg-[#221C0A] hover:bg-[#30260E] text-[#E5C158] border border-[#D4AF37]/50 font-royal font-bold text-xs flex items-center gap-2 shadow-md active:scale-95 cursor-pointer transition-all"
                  >
                    <FileText className="w-4 h-4 text-[#D4AF37]" />
                    <span>⚡ Quick Paste</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#121212] p-4 rounded-2xl border border-[#C59B27]/30">
              {/* Search & Category Filter */}
              <div className="flex flex-wrap items-center gap-3 flex-1">
                <div className="relative flex-1 min-w-[200px] max-w-md">
                  <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    placeholder="Search by product name, flavor, SKU, or category..."
                    className="w-full bg-[#1A1A1A] text-xs pl-9 pr-3 py-2 rounded-lg border border-[#333] text-white focus:border-[#D4AF37]"
                  />
                </div>

                <select
                  value={selectedCatFilter}
                  onChange={(e) => setSelectedCatFilter(e.target.value)}
                  className="bg-[#1A1A1A] text-xs px-3 py-2 rounded-lg border border-[#333] text-[#E5C158] font-semibold focus:border-[#D4AF37]"
                >
                  <option value="all">All Categories ({products.length})</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.displayName} ({products.filter(p => p.category === c.id).length})
                    </option>
                  ))}
                </select>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 flex-wrap">
                {/* Excel & CSV Bulk Suite Button */}
                <button
                  type="button"
                  onClick={() => setIsExcelModalOpen(true)}
                  className="px-4 py-2.5 rounded-xl bg-[#162619] hover:bg-[#1D3622] text-[#2ECC71] border border-[#2ECC71]/50 font-royal font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md active:scale-95 cursor-pointer"
                  title="Bulk Excel Import/Export with Multi-Category Sheets & Blank Templates"
                >
                  <FileSpreadsheet className="w-4 h-4 text-[#2ECC71]" />
                  <span>📊 Excel Import / Export</span>
                </button>

                {/* Quick Paste 7 AM Products Button */}
                <button
                  type="button"
                  onClick={() => setIsQuickPasteModalOpen(true)}
                  className="px-4 py-2.5 rounded-xl bg-[#221C0A] hover:bg-[#30260E] text-[#E5C158] border border-[#D4AF37]/50 font-royal font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md active:scale-95 cursor-pointer"
                  title="Quick paste raw product list or JSON"
                >
                  <FileText className="w-4 h-4 text-[#D4AF37]" />
                  <span>⚡ Quick Paste</span>
                </button>

                {/* Universal Product Recovery & Data Protection Button */}
                <button
                  type="button"
                  onClick={() => setIsRecoveryModalOpen(true)}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#2A1E08] to-[#1F1706] hover:from-[#3D2C0C] hover:to-[#2B2008] text-[#E5C158] border border-[#D4AF37]/60 font-royal font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md active:scale-95 cursor-pointer animate-pulse"
                  title="Scan and recover all products created across any storage key or backup"
                >
                  <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
                  <span>🛡️ Recover My Products</span>
                </button>

                {/* Quick Clone Dropdown */}
                {products.length > 0 && (
                  <div className="relative">
                    <select
                      onChange={(e) => {
                        const targetId = e.target.value;
                        if (!targetId) return;
                        const source = products.find(prod => prod.id === targetId);
                        if (source) {
                          handleDuplicateProduct(source);
                        }
                        e.target.value = '';
                      }}
                      defaultValue=""
                      className="bg-[#1C1708] text-xs px-3 py-2.5 rounded-xl border border-[#D4AF37]/50 text-[#E5C158] font-royal font-bold hover:bg-[#251E0A] transition-all cursor-pointer shadow"
                      title="Select an existing product to copy its details, size, and image"
                    >
                      <option value="" disabled>📋 Clone Existing Product...</option>
                      {products.map(prod => (
                        <option key={prod.id} value={prod.id}>
                          Copy &bull; {prod.name} (₹{prod.price})
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <button
                  onClick={() => {
                    setConfirmModalConfig({
                      isOpen: true,
                      title: 'Delete All Products & Empty Catalog',
                      message: 'Are you sure you want to completely delete EVERY product and all product images from the database and website? The catalog will be completely empty.',
                      confirmText: 'Yes, Delete All Products',
                      variant: 'danger',
                      onConfirm: () => clearAllProducts(),
                    });
                  }}
                  className="px-4 py-2.5 rounded-xl bg-red-950/90 hover:bg-red-900 text-red-200 border border-red-500/50 font-royal font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
                  title="Wipe out all products and product images completely"
                >
                  <Trash2 className="w-4 h-4 text-red-400" /> Delete All Products
                </button>

                <button
                  onClick={() => {
                    setConfirmModalConfig({
                      isOpen: true,
                      title: 'Purge All Default Demo Products',
                      message: 'Are you sure you want to purge all initial default demo items? Your catalog will keep ONLY products uploaded by you, and default items will NEVER reappear on refresh.',
                      confirmText: 'Yes, Purge Default Demo Items',
                      variant: 'danger',
                      onConfirm: () => purgeDefaultDemoProducts(),
                    });
                  }}
                  className="px-4 py-2.5 rounded-xl bg-rose-950/80 hover:bg-rose-900 text-rose-300 border border-rose-500/40 font-royal font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
                  title="Remove default template items and keep strictly your uploaded products"
                >
                  <Trash2 className="w-4 h-4 text-rose-400" /> Purge Default Demo Items
                </button>

                <button
                  onClick={handleOpenNewProduct}
                  id="admin-add-product-btn"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#F3D079] via-[#D4AF37] to-[#9B7817] text-black font-royal font-bold text-xs flex items-center justify-center gap-2 hover:brightness-110 shadow-lg cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> + Add New Product / Accessory
                </button>
              </div>
            </div>

            {/* Products Table */}
            <div className="rounded-2xl bg-[#121212] border border-[#C59B27]/30 overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#181818] border-b border-[#252525] text-[#A89050] uppercase text-[10px] tracking-wider">
                    <tr>
                      <th className="py-3 px-4">Item &amp; Ingredients Details</th>
                      <th className="py-3 px-3">Menu Category</th>
                      <th className="py-3 px-3">Price / MRP</th>
                      <th className="py-3 px-3">Pack Options</th>
                      <th className="py-3 px-3">Stock</th>
                      <th className="py-3 px-3">Type</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#202020]">
                    {filteredProducts.map((p) => (
                      <tr key={p.id} className="hover:bg-[#171717] transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="flex items-start gap-3">
                            <img
                              src={p.images[0]}
                              alt={p.name}
                              className="w-12 h-12 rounded-lg object-cover bg-black border border-[#C59B27]/30 flex-shrink-0"
                              referrerPolicy="no-referrer"
                            />
                            <div className="space-y-1">
                              <p className="font-royal font-bold text-gray-100 text-sm">{p.name}</p>
                              <p className="text-[11px] text-gray-400 line-clamp-1">{p.shortDescription}</p>
                              {p.ingredients && p.ingredients.length > 0 && (
                                <div className="flex flex-wrap gap-1 pt-0.5">
                                  {p.ingredients.slice(0, 3).map((ing, i) => (
                                    <span key={i} className="text-[9px] bg-[#1F190B] text-[#D4AF37] px-1.5 py-0.2 rounded border border-[#D4AF37]/30">
                                      {ing}
                                    </span>
                                  ))}
                                  {p.ingredients.length > 3 && (
                                    <span className="text-[9px] text-gray-400">+{p.ingredients.length - 3} more</span>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-3">
                          <span className="uppercase text-[10px] font-bold text-[#E5C158] bg-[#221B0B] px-2 py-0.5 rounded border border-[#C59B27]/30">
                            {p.category.replace('_', ' ')}
                          </span>
                          <p className="text-[10px] text-gray-400 mt-1">{p.subcategory}</p>
                        </td>
                        <td className="py-3 px-3">
                          <div className="font-royal font-bold text-[#E5C158] text-sm">₹{p.price}</div>
                          {p.mrp > p.price && (
                            <div className="text-gray-500 line-through text-[10px]">₹{p.mrp}</div>
                          )}
                        </td>
                        <td className="py-3 px-3">
                          {p.variants && p.variants.length > 0 ? (
                            <span className="text-[10px] text-gray-300 font-semibold bg-[#1C1C1C] px-2 py-1 rounded border border-[#333]">
                              {p.variants.length} Options (e.g. {p.variants[0].name})
                            </span>
                          ) : (
                            <span className="text-[10px] text-gray-500">Standard Single</span>
                          )}
                        </td>
                        <td className="py-3 px-3">
                          <span className={`font-bold text-xs ${p.stock < 15 ? 'text-amber-400' : 'text-[#2ECC71]'}`}>
                            {p.stock} in stock
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          {p.isTobaccoFree ? (
                            <span className="text-[9px] bg-[#162916] text-[#2ECC71] px-2 py-0.5 rounded font-bold border border-[#2ECC71]/30">
                              0% Tobacco
                            </span>
                          ) : (
                            <span className="text-[9px] bg-[#2A1515] text-amber-400 px-2 py-0.5 rounded font-bold border border-amber-800/30">
                              Age 18+
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="inline-flex items-center gap-1.5 justify-end">
                            {/* Copy & Add Button */}
                            <button
                              onClick={() => handleDuplicateProduct(p)}
                              className="px-2.5 py-1.5 bg-[#201A09] hover:bg-[#D4AF37] text-[#E5C158] hover:text-black border border-[#D4AF37]/50 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm active:scale-95 cursor-pointer"
                              title={`Copy & Duplicate "${p.name}" (modify size, image & price)`}
                            >
                              <Copy className="w-3.5 h-3.5" />
                              <span className="hidden sm:inline font-royal font-bold text-[11px]">Copy &amp; Add</span>
                            </button>
                            <button
                              onClick={() => {
                                setEditingProduct({ ...p });
                                setIsProductModalOpen(true);
                              }}
                              className="p-1.5 text-gray-300 hover:text-[#D4AF37] hover:bg-[#252525] rounded transition-colors cursor-pointer"
                              title="Edit product details & ingredients"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                setConfirmModalConfig({
                                  isOpen: true,
                                  title: 'Delete Product',
                                  message: `Are you sure you want to permanently delete "${p.name}"? This item will be removed from your catalog instantly.`,
                                  confirmText: 'Yes, Delete Product',
                                  variant: 'danger',
                                  onConfirm: () => deleteProduct(p.id),
                                });
                              }}
                              className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-[#252525] rounded transition-colors cursor-pointer"
                              title="Delete product"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB: DEDICATED COMBOS & GIFT SETS EDIT/UPDATE PANEL */}
        {activeTab === 'combos' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Header & Quick Action Bar */}
            <div className="p-6 rounded-2xl bg-[#121212] border border-[#C59B27]/40 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#E5C158]" />
                  <h2 className="font-royal text-xl sm:text-2xl font-black text-[#E5C158] uppercase tracking-wider">
                    COMBOS &amp; GIFT SETS CONFIGURATION PANEL
                  </h2>
                </div>
                <p className="text-xs text-gray-400 font-serif-luxury italic">
                  Create, edit, price, and update luxury bundle packages, lounge gift boxes, and special promotional combos.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="relative">
                  <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Search combo packages..."
                    value={comboSearchQuery}
                    onChange={(e) => setComboSearchQuery(e.target.value)}
                    className="pl-9 pr-4 py-2 rounded-xl bg-[#1C1C1C] border border-[#333] text-xs text-white focus:border-[#D4AF37] w-48 sm:w-64"
                  />
                </div>
                <button
                  onClick={() => handleOpenComboModal()}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-[#D4AF37] text-black font-royal font-bold text-xs flex items-center gap-2 hover:brightness-110 shadow-lg cursor-pointer transition-all active:scale-95"
                >
                  <Plus className="w-4 h-4 text-black" />
                  <span>+ Create New Combo Package</span>
                </button>
              </div>
            </div>

            {/* Combos Grid */}
            {combosList.filter(c => !comboSearchQuery || c.name.toLowerCase().includes(comboSearchQuery.toLowerCase()) || c.description.toLowerCase().includes(comboSearchQuery.toLowerCase())).length === 0 ? (
              <div className="text-center py-16 px-4 bg-[#121212] rounded-2xl border border-[#252525] space-y-3">
                <Sparkles className="w-12 h-12 text-[#D4AF37] mx-auto opacity-50" />
                <h3 className="font-royal text-base font-bold text-gray-200">No Combo Packages Found</h3>
                <p className="text-xs text-gray-400 max-w-sm mx-auto">
                  Click the button below to build your first artisanal shisha &amp; lounge combo deal.
                </p>
                <button
                  onClick={() => handleOpenComboModal()}
                  className="px-5 py-2 rounded-xl bg-[#201A0B] text-[#D4AF37] border border-[#D4AF37]/50 font-royal font-bold text-xs inline-flex items-center gap-2 hover:bg-[#D4AF37] hover:text-black transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> Create First Combo
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {combosList
                  .filter(c => !comboSearchQuery || c.name.toLowerCase().includes(comboSearchQuery.toLowerCase()) || c.description.toLowerCase().includes(comboSearchQuery.toLowerCase()))
                  .map((combo) => {
                    const savingsAmount = (combo.mrp || combo.price) - combo.price;
                    const profitMargin = combo.buyPrice ? combo.price - combo.buyPrice : null;

                    return (
                      <div
                        key={combo.id}
                        className="group relative bg-[#121212] rounded-2xl border border-[#C59B27]/40 hover:border-[#D4AF37] p-5 shadow-xl transition-all duration-300 hover:shadow-[0_8px_30px_rgba(212,175,55,0.15)] flex flex-col justify-between"
                      >
                        <div className="space-y-4">
                          {/* Image & Badges */}
                          <div className="relative aspect-[16/10] rounded-xl overflow-hidden bg-black border border-[#252525]">
                            <img
                              src={combo.images[0]}
                              alt={combo.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              onError={(e) => {
                                const target = e.currentTarget;
                                if (target.src && target.src.startsWith('data:image')) return;
                                target.onerror = null;
                                target.style.display = 'none';
                              }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />

                            <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1 z-10">
                              {combo.discountPercent > 0 && (
                                <span className="bg-[#2ECC71] text-black text-[10px] font-black px-2 py-0.5 rounded shadow">
                                  {combo.discountPercent}% OFF
                                </span>
                              )}
                              {combo.isBestseller && (
                                <span className="bg-[#D4AF37] text-black text-[9px] font-bold px-1.5 py-0.5 rounded shadow flex items-center gap-0.5">
                                  <Sparkles className="w-2.5 h-2.5" /> Best Seller
                                </span>
                              )}
                            </div>

                            <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-[10px] text-gray-300 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-lg border border-[#333]">
                              <span className="font-mono text-[#D4AF37]">SKU: {combo.sku}</span>
                              <span className="text-emerald-400 font-bold">Stock: {combo.stock} pcs</span>
                            </div>
                          </div>

                          {/* Combo Details */}
                          <div className="space-y-2">
                            <h3 className="font-royal text-base font-bold text-gray-100 group-hover:text-[#E5C158] transition-colors leading-snug">
                              {combo.name}
                            </h3>
                            <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
                              {combo.shortDescription || combo.description}
                            </p>
                          </div>

                          {/* Included Bundled Items Tags */}
                          {combo.ingredients && combo.ingredients.length > 0 && (
                            <div className="space-y-1.5 pt-1 border-t border-[#202020]">
                              <p className="text-[10px] text-[#A89050] font-bold uppercase tracking-wider">
                                Included Bundle Items ({combo.ingredients.length}):
                              </p>
                              <div className="flex flex-wrap gap-1.5">
                                {combo.ingredients.map((item, idx) => (
                                  <span
                                    key={idx}
                                    className="text-[10px] bg-[#1A1608] text-[#E5C158] px-2 py-0.5 rounded-md border border-[#D4AF37]/30 font-medium"
                                  >
                                    ✓ {item}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Financials & Pricing Box */}
                          <div className="p-3 rounded-xl bg-[#181818] border border-[#2A2A2A] space-y-1.5 text-xs">
                            <div className="flex items-center justify-between">
                              <span className="text-gray-400 text-[11px]">Special Combo Price:</span>
                              <div className="flex items-baseline gap-2">
                                {combo.mrp > combo.price && (
                                  <span className="text-gray-500 line-through text-xs font-mono">
                                    ₹{combo.mrp}
                                  </span>
                                )}
                                <span className="font-royal font-black text-lg text-[#E5C158]">
                                  ₹{combo.price}
                                </span>
                              </div>
                            </div>

                            {savingsAmount > 0 && (
                              <div className="flex items-center justify-between text-[11px] text-emerald-400 font-semibold border-t border-[#222] pt-1">
                                <span>Customer Savings:</span>
                                <span>Save ₹{savingsAmount} ({combo.discountPercent}% OFF)</span>
                              </div>
                            )}

                            {profitMargin !== null && (
                              <div className="flex items-center justify-between text-[10px] text-amber-300 font-mono border-t border-[#222] pt-1">
                                <span>Buy Price: ₹{combo.buyPrice}</span>
                                <span className="text-emerald-300 font-bold">Est. Margin: +₹{profitMargin}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-2 pt-4 border-t border-[#222] mt-4">
                          <button
                            onClick={() => handleOpenComboModal(combo)}
                            className="flex-1 py-2 rounded-xl bg-[#201A0B] hover:bg-[#D4AF37] text-[#E5C158] hover:text-black border border-[#D4AF37]/50 font-royal font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-95"
                          >
                            <Edit className="w-3.5 h-3.5" /> Edit Combo
                          </button>
                          <button
                            onClick={() => handleDuplicateProduct(combo)}
                            className="p-2 rounded-xl bg-[#1C1C1C] hover:bg-[#333] text-gray-300 hover:text-white border border-[#333] transition-all cursor-pointer"
                            title="Duplicate Combo Template"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              setConfirmModalConfig({
                                isOpen: true,
                                title: 'Delete Combo Deal',
                                message: `Are you sure you want to delete combo package "${combo.name}"? It will be removed from storefront combos section.`,
                                confirmText: 'Yes, Delete Combo',
                                variant: 'danger',
                                onConfirm: () => deleteProduct(combo.id),
                              });
                            }}
                            className="p-2 rounded-xl bg-[#2A1515] hover:bg-red-900/50 text-red-400 hover:text-red-300 border border-red-800/30 transition-all cursor-pointer"
                            title="Delete Combo"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>
        )}

        {/* TAB: INVENTORY, BUY PRICE & PROFIT MARGIN CALCULATOR */}
        {activeTab === 'inventory' && (
          <div className="space-y-6">
            {/* Header / Summary Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {(() => {
                const totalStock = products.reduce((acc, p) => acc + (p.stock || 0), 0);
                const totalCostValuation = products.reduce((acc, p) => acc + ((p.buyPrice || Math.round(p.price * 0.4)) * (p.stock || 0)), 0);
                const totalRetailValuation = products.reduce((acc, p) => acc + (p.price * (p.stock || 0)), 0);
                const potentialProfit = totalRetailValuation - totalCostValuation;
                const overallMargin = totalRetailValuation > 0 ? Math.round((potentialProfit / totalRetailValuation) * 100) : 0;

                return (
                  <>
                    <div className="p-4 rounded-xl bg-[#141414] border border-[#2B2B2B]">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-400 font-semibold">Total Stock Units</span>
                        <Package className="w-4 h-4 text-[#D4AF37]" />
                      </div>
                      <p className="font-royal text-2xl font-bold text-white mt-2">{totalStock} Units</p>
                      <span className="text-[10px] text-gray-400 mt-1 block">Across {products.length} catalog items</span>
                    </div>

                    <div className="p-4 rounded-xl bg-[#141414] border border-[#2B2B2B]">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-400 font-semibold">Inventory Cost (Buy Value)</span>
                        <DollarSign className="w-4 h-4 text-[#2ECC71]" />
                      </div>
                      <p className="font-royal text-2xl font-bold text-[#2ECC71] mt-2">₹{totalCostValuation.toLocaleString()}</p>
                      <span className="text-[10px] text-gray-400 mt-1 block">Total invested procurement cost</span>
                    </div>

                    <div className="p-4 rounded-xl bg-[#141414] border border-[#2B2B2B]">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-400 font-semibold">Retail Value (Sell Value)</span>
                        <Coins className="w-4 h-4 text-[#E5C158]" />
                      </div>
                      <p className="font-royal text-2xl font-bold text-[#E5C158] mt-2">₹{totalRetailValuation.toLocaleString()}</p>
                      <span className="text-[10px] text-gray-400 mt-1 block">Gross realization on full sell-out</span>
                    </div>

                    <div className="p-4 rounded-xl bg-[#141414] border border-[#D4AF37]/30 bg-gradient-to-br from-[#1A1608] to-[#121212]">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-[#E5C158] font-bold">Estimated Net Margin</span>
                        <TrendingUp className="w-4 h-4 text-[#D4AF37]" />
                      </div>
                      <p className="font-royal text-2xl font-bold text-white mt-2">₹{potentialProfit.toLocaleString()}</p>
                      <span className="text-[10px] text-[#2ECC71] font-semibold mt-1 block">
                        {overallMargin}% Projected Gross Margin
                      </span>
                    </div>
                  </>
                );
              })()}
            </div>

            {/* Inventory Calculator & Price Manager Table */}
            <div className="rounded-2xl bg-[#121212] border border-[#C59B27]/30 overflow-hidden shadow-xl p-4 sm:p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#222]">
                <div>
                  <h3 className="font-royal text-base font-bold text-[#E5C158] flex items-center gap-2">
                    <Calculator className="w-4 h-4 text-[#D4AF37]" /> Live Inventory, Buy Cost & Selling Price Manager
                  </h3>
                  <p className="text-xs text-gray-400">
                    Adjust Buy Price (Cost), Selling Price (Retail), and Stock in real-time to compute unit profit and profit margins automatically.
                  </p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#181818] border-b border-[#252525] text-[#A89050] uppercase text-[10px] tracking-wider">
                    <tr>
                      <th className="py-3 px-4">Item Name</th>
                      <th className="py-3 px-3">Category</th>
                      <th className="py-3 px-3 text-center">Stock (Units)</th>
                      <th className="py-3 px-3">Buy Price (₹)</th>
                      <th className="py-3 px-3">Selling Price (₹)</th>
                      <th className="py-3 px-3">Unit Profit</th>
                      <th className="py-3 px-3">Margin %</th>
                      <th className="py-3 px-3">Total Holding Cost</th>
                      <th className="py-3 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#202020]">
                    {products.map((p) => {
                      const changes = inlineInventoryChanges[p.id] || {};
                      const currentBuyPrice = changes.buyPrice !== undefined ? changes.buyPrice : (p.buyPrice !== undefined ? p.buyPrice : Math.round(p.price * 0.4));
                      const currentPrice = changes.price !== undefined ? changes.price : p.price;
                      const currentStock = changes.stock !== undefined ? changes.stock : (p.stock || 0);

                      const unitProfit = currentPrice - currentBuyPrice;
                      const marginPercent = currentPrice > 0 ? Math.round((unitProfit / currentPrice) * 100) : 0;
                      const totalHoldingCost = currentBuyPrice * currentStock;
                      const isChanged = changes.buyPrice !== undefined || changes.price !== undefined || changes.stock !== undefined;

                      return (
                        <tr key={p.id} className="hover:bg-[#161616] transition-colors">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2.5">
                              <img
                                src={p.images[0]}
                                alt={p.name}
                                className="w-9 h-9 rounded object-cover border border-[#333] flex-shrink-0"
                                referrerPolicy="no-referrer"
                              />
                              <div>
                                <span className="font-bold text-gray-200 block truncate max-w-[180px]">{p.name}</span>
                                <span className="text-[10px] text-gray-400 font-mono">SKU: {p.sku || p.id}</span>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-3">
                            <span className="uppercase text-[9px] font-bold text-[#E5C158] bg-[#1E1909] px-2 py-0.5 rounded border border-[#C59B27]/20">
                              {p.category}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-center">
                            <input
                              type="number"
                              value={currentStock}
                              onChange={(e) => {
                                const val = Number(e.target.value);
                                setInlineInventoryChanges(prev => ({
                                  ...prev,
                                  [p.id]: { ...prev[p.id], stock: val }
                                }));
                              }}
                              className="w-16 text-center bg-[#1B1B1B] text-white py-1 px-1.5 rounded border border-[#333] focus:border-[#D4AF37]"
                            />
                          </td>
                          <td className="py-3 px-3">
                            <div className="relative">
                              <span className="absolute left-2 top-1.5 text-gray-500 text-xs">₹</span>
                              <input
                                type="number"
                                value={currentBuyPrice}
                                onChange={(e) => {
                                  const val = Number(e.target.value);
                                  setInlineInventoryChanges(prev => ({
                                    ...prev,
                                    [p.id]: { ...prev[p.id], buyPrice: val }
                                  }));
                                }}
                                className="w-20 pl-5 pr-1.5 py-1 bg-[#1B1B1B] text-[#2ECC71] font-bold rounded border border-[#333] focus:border-[#2ECC71]"
                              />
                            </div>
                          </td>
                          <td className="py-3 px-3">
                            <div className="relative">
                              <span className="absolute left-2 top-1.5 text-gray-500 text-xs">₹</span>
                              <input
                                type="number"
                                value={currentPrice}
                                onChange={(e) => {
                                  const val = Number(e.target.value);
                                  setInlineInventoryChanges(prev => ({
                                    ...prev,
                                    [p.id]: { ...prev[p.id], price: val }
                                  }));
                                }}
                                className="w-20 pl-5 pr-1.5 py-1 bg-[#1B1B1B] text-[#E5C158] font-bold rounded border border-[#333] focus:border-[#D4AF37]"
                              />
                            </div>
                          </td>
                          <td className="py-3 px-3">
                            <span className={`font-bold ${unitProfit >= 0 ? 'text-[#2ECC71]' : 'text-red-400'}`}>
                              ₹{unitProfit}
                            </span>
                          </td>
                          <td className="py-3 px-3">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              marginPercent >= 50 
                                ? 'bg-[#162916] text-[#2ECC71] border border-[#2ECC71]/30' 
                                : marginPercent >= 25 
                                ? 'bg-[#292211] text-[#E5C158] border border-[#D4AF37]/30' 
                                : 'bg-[#2B1515] text-amber-400 border border-amber-500/30'
                            }`}>
                              {marginPercent}%
                            </span>
                          </td>
                          <td className="py-3 px-3 text-gray-300 font-mono">
                            ₹{totalHoldingCost.toLocaleString()}
                          </td>
                          <td className="py-3 px-4 text-right">
                            {isChanged ? (
                              <button
                                onClick={() => {
                                  updateProduct(p.id, {
                                    buyPrice: currentBuyPrice,
                                    price: currentPrice,
                                    stock: currentStock,
                                  });
                                  setInlineInventoryChanges(prev => {
                                    const next = { ...prev };
                                    delete next[p.id];
                                    return next;
                                  });
                                  showToast(`Saved pricing & stock for ${p.name}!`, 'success');
                                }}
                                className="px-3 py-1 bg-[#D4AF37] text-black font-royal font-bold text-[10px] rounded hover:brightness-110 shadow"
                              >
                                Save
                              </button>
                            ) : (
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() => handleDuplicateProduct(p)}
                                  className="text-amber-400 hover:text-white text-[11px] font-semibold flex items-center gap-1 cursor-pointer bg-[#221B0A] hover:bg-[#D4AF37] hover:text-black px-2 py-0.5 rounded border border-[#D4AF37]/30 transition-all"
                                  title="Duplicate & copy product"
                                >
                                  <Copy className="w-3 h-3" />
                                  <span>Copy</span>
                                </button>
                                <button
                                  onClick={() => {
                                    setEditingProduct({ ...p });
                                    setIsProductModalOpen(true);
                                  }}
                                  className="text-gray-400 hover:text-[#D4AF37] text-[11px] underline cursor-pointer"
                                >
                                  Full Edit
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB: MENU & CATEGORIES MANAGEMENT */}
        {activeTab === 'categories' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#121212] p-4 rounded-2xl border border-[#C59B27]/30">
              <div>
                <h2 className="font-royal text-lg font-bold text-[#E5C158]">Store Menu & Category Sections</h2>
                <p className="text-xs text-gray-400">Configure storefront categories, banners, descriptions, and icon badges</p>
              </div>
              <button
                onClick={() => {
                  setEditingCategory({
                    id: '',
                    displayName: '',
                    name: '',
                    image: '',
                    description: '',
                    iconName: 'Sparkles',
                    itemCount: 10,
                  });
                  setIsCategoryModalOpen(true);
                }}
                className="px-5 py-2.5 rounded-xl bg-[#D4AF37] text-black font-royal font-bold text-xs flex items-center gap-2 hover:brightness-110 shadow"
              >
                <Plus className="w-4 h-4" /> + Add New Menu Category
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {categories.map((cat) => (
                <div
                  key={cat.id}
                  className="rounded-2xl overflow-hidden bg-[#121212] border border-[#C59B27]/40 p-4 flex flex-col justify-between space-y-4 hover:border-[#D4AF37] transition-all"
                >
                  <div className="space-y-3">
                    <div className="relative aspect-video rounded-xl overflow-hidden bg-black border border-[#333]">
                      <img
                        src={cat.image}
                        alt={cat.displayName}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute top-2 right-2 bg-black/80 px-2 py-0.5 rounded text-[10px] font-bold text-[#D4AF37] border border-[#D4AF37]/30">
                        {products.filter(p => p.category === cat.id).length} Products
                      </div>
                    </div>

                    <div>
                      <h3 className="font-royal text-base font-bold text-[#E5C158] uppercase tracking-wider">
                        {cat.displayName}
                      </h3>
                      <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                        {cat.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-[#222]">
                    <span className="text-[10px] text-gray-500 font-mono">ID: {cat.id}</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setEditingCategory({ ...cat });
                          setIsCategoryModalOpen(true);
                        }}
                        className="px-3 py-1.5 rounded bg-[#1F1F1F] text-xs text-gray-300 hover:text-[#D4AF37] border border-[#333]"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          setConfirmModalConfig({
                            isOpen: true,
                            title: 'Remove Category',
                            message: `Are you sure you want to remove category "${cat.displayName}"? Items in this category will remain in your catalog but lose their category tag.`,
                            confirmText: 'Yes, Remove Category',
                            variant: 'danger',
                            onConfirm: () => deleteCategory(cat.id),
                          });
                        }}
                        className="px-3 py-1.5 rounded bg-[#2A1515] text-xs text-red-400 hover:text-red-300 border border-red-800/30 cursor-pointer"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB: CUSTOMERS CRM & 18+ VERIFICATION */}
        {activeTab === 'customers' && (
          <AdminCustomerCRM />
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-[#17140B] via-[#1A160A] to-[#121212] border border-[#D4AF37]/40 shadow-xl">
              <div>
                <h2 className="font-royal text-lg font-bold text-[#E5C158] flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-[#D4AF37]" />
                  Overview &amp; Revenue Analytics
                </h2>
                <p className="text-xs text-gray-400 mt-1">
                  Real-time sales revenue, verified orders, inventory levels, and store performance metrics.
                </p>
              </div>

              <div className="flex items-center gap-2">
                {confirmResetRevenue ? (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        resetOrdersAndRevenue();
                        setConfirmResetRevenue(false);
                      }}
                      className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-royal font-bold text-xs flex items-center gap-1.5 shadow-lg animate-pulse cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Confirm Reset to ₹0 (Zero)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmResetRevenue(false)}
                      className="px-3 py-2 rounded-xl bg-[#222] hover:bg-[#333] text-gray-300 text-xs font-bold"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setConfirmResetRevenue(true);
                      setTimeout(() => setConfirmResetRevenue(false), 5000);
                    }}
                    className="px-4 py-2 rounded-xl bg-red-950/60 hover:bg-red-900 border border-red-500/40 text-red-300 font-royal font-bold text-xs flex items-center gap-1.5 transition-all self-start sm:self-auto cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Reset Revenue &amp; Orders to 0</span>
                  </button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-[#121212] border border-[#C59B27]/30 space-y-1">
                <span className="text-xs text-gray-400">Total Store Sales</span>
                <h3 className="font-royal text-2xl sm:text-3xl font-extrabold text-[#E5C158]">
                  ₹{totalRevenue.toLocaleString()}
                </h3>
                <span className="text-[11px] text-gray-400 font-semibold">
                  {completedOrdersList.length} verified order{completedOrdersList.length === 1 ? '' : 's'}
                </span>
              </div>

              <div className="p-5 rounded-2xl bg-[#121212] border border-[#C59B27]/30 space-y-1">
                <span className="text-xs text-gray-400">Total Completed Orders</span>
                <h3 className="font-royal text-2xl sm:text-3xl font-extrabold text-[#F3EFE0]">
                  {totalOrdersCount}
                </h3>
                <span className="text-[11px] text-[#2ECC71] flex items-center gap-1 font-semibold">
                  Real completed transactions
                </span>
              </div>

              <div className="p-5 rounded-2xl bg-[#121212] border border-[#C59B27]/30 space-y-1">
                <span className="text-xs text-gray-400">Active Live Products</span>
                <h3 className="font-royal text-2xl sm:text-3xl font-extrabold text-[#D4AF37]">
                  {activeProductsCount}
                </h3>
                <span className="text-[11px] text-gray-400">Across {categories.length} menu categories</span>
              </div>

              <div className="p-5 rounded-2xl bg-[#121212] border border-[#C59B27]/30 space-y-1">
                <span className="text-xs text-gray-400">Low Stock Warnings</span>
                <h3 className="font-royal text-2xl sm:text-3xl font-extrabold text-amber-400">
                  {lowStockCount}
                </h3>
                <span className="text-[11px] text-amber-300 font-semibold">Items under 15 units</span>
              </div>
            </div>
          </div>
        )}

        {/* TAB: ORDERS MANAGEMENT & UPI PAYMENT VERIFICATION */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            {/* Orders Header Banner */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-[#17140B] via-[#1A160A] to-[#121212] border border-[#D4AF37]/40 shadow-xl">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-royal text-lg font-bold text-[#E5C158]">Live Orders &amp; Dispatch Center</h2>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#162916] text-[#2ECC71] border border-[#2ECC71]/40 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-[#2ECC71] animate-ping" />
                    Live 24h Stream
                  </span>
                </div>
                <p className="text-xs text-gray-300 mt-1 max-w-2xl">
                  By default, recent active orders from the last 24 hours are shown here. Access older order history anytime using the date &amp; time selector or search bar below.
                </p>
              </div>

              {pendingUpiOrdersCount > 0 && (
                <div className="px-4 py-2.5 rounded-xl bg-amber-500/15 border border-amber-500/50 flex items-center gap-2.5">
                  <Clock className="w-4 h-4 text-amber-400 animate-pulse" />
                  <span className="text-xs text-amber-300 font-bold">
                    {pendingUpiOrdersCount} UPI Order Request{pendingUpiOrdersCount > 1 ? 's' : ''} awaiting verification
                  </span>
                </div>
              )}
            </div>

            {/* Date & Time Range Selector + Search Filter Bar */}
            <div className="p-4 rounded-2xl bg-[#121212] border border-[#C59B27]/30 space-y-3 shadow-lg">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                {/* Search Bar */}
                <div className="md:col-span-6 relative">
                  <input
                    type="text"
                    value={orderSearchQuery}
                    onChange={(e) => setOrderSearchQuery(e.target.value)}
                    placeholder="Search by Order # (e.g. QP-2026), Name, Phone, Item, or Ref UTR..."
                    className="w-full bg-[#181818] text-xs px-3.5 py-2.5 rounded-xl border border-[#3A3A3A] focus:border-[#D4AF37] text-white pl-9 pr-8"
                  />
                  <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  {orderSearchQuery && (
                    <button
                      type="button"
                      onClick={() => setOrderSearchQuery('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white text-xs cursor-pointer p-1"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Date / Time Range Selector */}
                <div className="md:col-span-6 flex flex-wrap sm:flex-nowrap items-center gap-2">
                  <div className="flex-1 min-w-[200px]">
                    <div className="relative">
                      <select
                        value={orderTimeRange}
                        onChange={(e) => setOrderTimeRange(e.target.value as any)}
                        className="w-full bg-[#181818] text-xs px-3.5 py-2.5 rounded-xl border border-[#3A3A3A] focus:border-[#D4AF37] text-white font-semibold cursor-pointer pl-9"
                      >
                        <option value="24h">⚡ Last 24 Hours (Active Live Stream)</option>
                        <option value="today">📅 Today Only</option>
                        <option value="yesterday">⏪ Yesterday</option>
                        <option value="7d">📊 Last 7 Days</option>
                        <option value="30d">🗓️ Last 30 Days</option>
                        <option value="custom">⚙️ Custom Date &amp; Time Range</option>
                        <option value="all">📂 All-Time Order History ({orders.length} Total)</option>
                      </select>
                      <Calendar className="w-4 h-4 text-[#D4AF37] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>

                  {orderTimeRange !== '24h' && (
                    <button
                      type="button"
                      onClick={() => setOrderTimeRange('24h')}
                      className="px-3 py-2.5 rounded-xl bg-[#221B0B] border border-[#D4AF37]/40 text-[#E5C158] hover:bg-[#D4AF37] hover:text-black text-xs font-bold transition-all cursor-pointer whitespace-nowrap"
                    >
                      Reset to 24h
                    </button>
                  )}
                </div>
              </div>

              {/* Custom Date Range Inputs */}
              {orderTimeRange === 'custom' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-[#222]">
                  <div>
                    <label className="text-[11px] text-gray-400 block mb-1 font-semibold">Start Date &amp; Time</label>
                    <input
                      type="datetime-local"
                      value={orderCustomStartDate}
                      onChange={(e) => setOrderCustomStartDate(e.target.value)}
                      className="w-full bg-[#1A1A1A] text-xs px-3 py-2 rounded-xl border border-[#3A3A3A] text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-gray-400 block mb-1 font-semibold">End Date &amp; Time</label>
                    <input
                      type="datetime-local"
                      value={orderCustomEndDate}
                      onChange={(e) => setOrderCustomEndDate(e.target.value)}
                      className="w-full bg-[#1A1A1A] text-xs px-3 py-2 rounded-xl border border-[#3A3A3A] text-white"
                    />
                  </div>
                </div>
              )}

              {/* Active Stream Info Banner */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-[11px] text-gray-400">
                <span className="flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-[#D4AF37]" />
                  {orderTimeRange === '24h' && (
                    <span>Auto 24h filter active: Older orders automatically moved to Order History to prevent long lists.</span>
                  )}
                  {orderTimeRange === 'all' && (
                    <span className="text-[#E5C158]">Showing complete all-time order history archive ({orders.length} orders).</span>
                  )}
                  {orderTimeRange !== '24h' && orderTimeRange !== 'all' && (
                    <span>Filtered by selected date &amp; time range.</span>
                  )}
                </span>

                {orderTimeRange === '24h' && (
                  <button
                    type="button"
                    onClick={() => setOrderTimeRange('all')}
                    className="text-[#E5C158] hover:underline font-semibold cursor-pointer"
                  >
                    View All-Time History &rarr;
                  </button>
                )}
              </div>
            </div>

            {/* Order Stage Filter Pills with Scroll Chevrons */}
            <div className="relative flex items-center gap-1.5 w-full border-b border-[#252525] pb-3">
              {/* Scroll Left Button */}
              <button
                type="button"
                onClick={() => scrollOrderStages('left')}
                className="flex-shrink-0 p-2 rounded-xl bg-[#161616] border border-[#C59B27]/40 hover:border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black transition-all shadow-md active:scale-95 flex items-center justify-center cursor-pointer z-10"
                title="Scroll stage filters left"
                aria-label="Scroll stage filters left"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {/* Scrollable Stage Pills */}
              <div 
                ref={orderStagesTabsRef}
                className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth flex-1 py-0.5"
              >
                <button
                  type="button"
                  onClick={() => setOrderFilter('all')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-royal font-bold transition-all whitespace-nowrap cursor-pointer ${
                    orderFilter === 'all'
                      ? 'bg-[#D4AF37] text-black shadow'
                      : 'bg-[#161616] text-gray-300 hover:text-white border border-[#333]'
                  }`}
                >
                  All Orders ({orders.length})
                </button>
                <button
                  type="button"
                  onClick={() => setOrderFilter('payment_verification')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-royal font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                    orderFilter === 'payment_verification'
                      ? 'bg-amber-400 text-black shadow-[0_0_10px_rgba(245,158,11,0.5)]'
                      : 'bg-[#231A05] text-amber-300 border border-amber-500/40 hover:bg-amber-950/60'
                  }`}
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span>Pending UPI Verification ({pendingUpiOrdersCount})</span>
                </button>
                <button
                  type="button"
                  onClick={() => setOrderFilter('confirmed')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-royal font-bold transition-all whitespace-nowrap cursor-pointer ${
                    orderFilter === 'confirmed'
                      ? 'bg-[#D4AF37] text-black shadow'
                      : 'bg-[#161616] text-gray-300 hover:text-white border border-[#333]'
                  }`}
                >
                  Confirmed ({orders.filter(o => o.status === 'confirmed').length})
                </button>
                <button
                  type="button"
                  onClick={() => setOrderFilter('packed')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-royal font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                    orderFilter === 'packed'
                      ? 'bg-[#D4AF37] text-black shadow'
                      : 'bg-[#161616] text-gray-300 hover:text-white border border-[#333]'
                  }`}
                >
                  <Box className="w-3.5 h-3.5" />
                  <span>Order Packing ({orders.filter(o => o.status === 'packed').length})</span>
                </button>
                <button
                  type="button"
                  onClick={() => setOrderFilter('out_for_delivery')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-royal font-bold transition-all whitespace-nowrap cursor-pointer ${
                    orderFilter === 'out_for_delivery'
                      ? 'bg-[#D4AF37] text-black shadow'
                      : 'bg-[#161616] text-gray-300 hover:text-white border border-[#333]'
                  }`}
                >
                  Out for Delivery ({orders.filter(o => o.status === 'out_for_delivery').length})
                </button>
                <button
                  type="button"
                  onClick={() => setOrderFilter('delivered')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-royal font-bold transition-all whitespace-nowrap cursor-pointer ${
                    orderFilter === 'delivered'
                      ? 'bg-[#D4AF37] text-black shadow'
                      : 'bg-[#161616] text-gray-300 hover:text-white border border-[#333]'
                  }`}
                >
                  Delivered ({orders.filter(o => o.status === 'delivered').length})
                </button>
                <button
                  type="button"
                  onClick={() => setOrderFilter('cancelled')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-royal font-bold transition-all whitespace-nowrap cursor-pointer ${
                    orderFilter === 'cancelled'
                      ? 'bg-red-600 text-white shadow'
                      : 'bg-[#161616] text-gray-300 hover:text-white border border-[#333]'
                  }`}
                >
                  Cancelled / Rejected ({orders.filter(o => o.status === 'cancelled').length})
                </button>
              </div>

              {/* Scroll Right Button */}
              <button
                type="button"
                onClick={() => scrollOrderStages('right')}
                className="flex-shrink-0 p-2 rounded-xl bg-[#161616] border border-[#C59B27]/40 hover:border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black transition-all shadow-md active:scale-95 flex items-center justify-center cursor-pointer z-10"
                title="Scroll stage filters right"
                aria-label="Scroll stage filters right"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {(() => {
              const now = Date.now();
              const filteredOrders = orders.filter((o) => {
                // 1. Stage status filter
                let matchesStage = true;
                if (orderFilter === 'payment_verification') {
                  matchesStage = o.status === 'payment_verification' || (o.paymentMethod === 'upi' && !o.upiVerifiedByAdmin && o.status !== 'cancelled');
                } else if (orderFilter !== 'all') {
                  matchesStage = o.status === orderFilter;
                }
                if (!matchesStage) return false;

                // 2. Date & Time Range filter
                const orderTime = new Date(o.createdAt).getTime();
                if (orderTimeRange === '24h') {
                  if (orderTime < now - 24 * 60 * 60 * 1000) return false;
                } else if (orderTimeRange === 'today') {
                  const isToday = new Date(o.createdAt).toDateString() === new Date().toDateString();
                  if (!isToday) return false;
                } else if (orderTimeRange === 'yesterday') {
                  const isYesterday = new Date(o.createdAt).toDateString() === new Date(now - 86400000).toDateString();
                  if (!isYesterday) return false;
                } else if (orderTimeRange === '7d') {
                  if (orderTime < now - 7 * 86400000) return false;
                } else if (orderTimeRange === '30d') {
                  if (orderTime < now - 30 * 86400000) return false;
                } else if (orderTimeRange === 'custom') {
                  if (orderCustomStartDate && new Date(o.createdAt) < new Date(orderCustomStartDate)) return false;
                  if (orderCustomEndDate && new Date(o.createdAt) > new Date(orderCustomEndDate)) return false;
                }

                // 3. Search query filter
                if (orderSearchQuery.trim()) {
                  const q = orderSearchQuery.toLowerCase().trim();
                  const matchOrderNum = o.orderNumber?.toLowerCase().includes(q);
                  const matchId = o.id?.toLowerCase().includes(q);
                  const matchName = o.shippingAddress?.fullName?.toLowerCase().includes(q);
                  const matchPhone = o.shippingAddress?.phone?.toLowerCase().includes(q);
                  const matchCity = o.shippingAddress?.city?.toLowerCase().includes(q);
                  const matchUtr = o.upiTransactionId?.toLowerCase().includes(q);
                  const matchItems = o.items?.some((it) => it.productName?.toLowerCase().includes(q));
                  if (!matchOrderNum && !matchId && !matchName && !matchPhone && !matchCity && !matchUtr && !matchItems) {
                    return false;
                  }
                }

                return true;
              });

              if (filteredOrders.length === 0) {
                return (
                  <div className="p-12 text-center bg-[#121212] rounded-2xl border border-[#C59B27]/30 text-gray-400 space-y-3 shadow-xl">
                    <p className="font-royal font-bold text-sm text-[#E5C158]">No orders found for current filter &amp; date criteria</p>
                    <p className="text-xs text-gray-500">
                      {orderTimeRange === '24h' 
                        ? 'No orders placed in the last 24 hours. Older orders are archived in Order History.' 
                        : 'Try adjusting your search query or selecting a different date range.'}
                    </p>
                    {orderTimeRange === '24h' && orders.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setOrderTimeRange('all')}
                        className="px-4 py-2 rounded-xl bg-[#D4AF37] text-black font-royal font-bold text-xs hover:brightness-110 cursor-pointer"
                      >
                        Show All-Time Order History ({orders.length})
                      </button>
                    )}
                  </div>
                );
              }

              return (
                <div className="space-y-4">
                  {filteredOrders.map((order) => {
                    const isPendingUpi = order.status === 'payment_verification' || 
                      (order.paymentMethod === 'upi' && !order.upiVerifiedByAdmin && order.status !== 'cancelled');

                    return (
                      <div
                        key={order.id}
                        className={`p-5 rounded-2xl border space-y-4 transition-all ${
                          isPendingUpi
                            ? 'bg-[#181303] border-[#E5C158] shadow-[0_0_20px_rgba(229,193,88,0.2)]'
                            : 'bg-[#121212] border-[#C59B27]/30'
                        }`}
                      >
                        {/* Order Request Top Header */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#252525]">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-royal text-base font-bold text-[#E5C158]">
                                {order.orderNumber}
                              </span>
                              {isPendingUpi && (
                                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-black animate-pulse flex items-center gap-1 shadow">
                                  <Clock className="w-3 h-3" />
                                  <span>ORDER REQUEST &bull; PAYMENT UNDER PROGRESS</span>
                                </span>
                              )}
                              <span className="text-[10px] text-gray-400 font-mono bg-black/60 px-2 py-0.5 rounded border border-[#333]">
                                Method: {order.paymentMethod === 'upi' ? 'Direct UPI Transfer' : order.paymentMethod}
                              </span>
                            </div>
                            <p className="text-xs text-gray-300">
                              Customer: <strong className="text-white">{order.shippingAddress.fullName}</strong> (📞 {order.shippingAddress.phone}) &bull; {order.shippingAddress.city}, {order.shippingAddress.state}
                            </p>
                            <p className="text-[11px] text-gray-500">
                              Placed: {order.createdAt ? new Date(order.createdAt).toLocaleString('en-IN') : 'Recent'}
                            </p>
                          </div>

                          <div className="flex items-center gap-3 self-start sm:self-center">
                            <div className="text-right">
                              <span className="text-xs text-gray-400 block">Total Amount</span>
                              <span className="text-base font-royal font-bold text-[#2ECC71]">₹{order.total}</span>
                            </div>
                            <select
                              value={order.status}
                              onChange={(e) => handleDropdownStatusChange(order, e.target.value as Order['status'])}
                              className="bg-[#1A1A1A] text-xs font-bold text-[#E5C158] px-3 py-1.5 rounded-lg border border-[#C59B27]/40 cursor-pointer"
                            >
                              <option value="payment_verification">Payment Verification (Under Progress)</option>
                              <option value="pending">Pending</option>
                              <option value="confirmed">Confirmed</option>
                              <option value="packed">Freshly Packed</option>
                              <option value="out_for_delivery">Out for Delivery</option>
                              <option value="delivered">Delivered</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                          </div>
                        </div>

                        {/* PROMINENT UPI VERIFICATION ACTION PANEL */}
                        {isPendingUpi && (
                          <div className="p-4 rounded-xl bg-gradient-to-r from-[#241A04] via-[#1E1603] to-[#161102] border-2 border-[#D4AF37] space-y-3">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                              <div className="flex items-center gap-2">
                                <AlertCircle className="w-5 h-5 text-[#E5C158] flex-shrink-0 animate-pulse" />
                                <div>
                                  <h4 className="font-royal text-xs font-extrabold text-[#E5C158] uppercase tracking-wide">
                                    Awaiting Bank Credit Verification
                                  </h4>
                                  <p className="text-[11px] text-gray-300">
                                    Verify that ₹{order.total} has credited into ICICI Bank (Rahul Singh) before approving.
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-center gap-2">
                                {order.upiScreenshotUrl && (
                                  <button
                                    onClick={() => setPreviewScreenshotUrl(order.upiScreenshotUrl || null)}
                                    className="px-3 py-1.5 rounded-lg bg-[#2A2005] hover:bg-[#3D2D06] text-[#E5C158] border border-[#D4AF37]/50 text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow transition-all"
                                  >
                                    <Eye className="w-3.5 h-3.5" />
                                    <span>View Receipt</span>
                                  </button>
                                )}
                              </div>
                            </div>

                            {/* UTR reference display */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 rounded-lg bg-black/60 border border-[#444] text-xs">
                              <div>
                                <span className="text-gray-400 block text-[10px] uppercase font-semibold">
                                  Customer Submitted UTR:
                                </span>
                                <div className="flex items-center gap-2 mt-0.5">
                                  <span className="font-mono text-sm font-bold text-[#E5C158] select-all">
                                    {order.upiTransactionId || 'No UTR specified'}
                                  </span>
                                  {order.upiTransactionId && (
                                    <button
                                      onClick={() => {
                                        navigator.clipboard.writeText(order.upiTransactionId || '');
                                        showToast('UTR reference copied to clipboard!', 'info');
                                      }}
                                      className="p-1 text-gray-400 hover:text-white"
                                      title="Copy UTR"
                                    >
                                      <Copy className="w-3.5 h-3.5" />
                                    </button>
                                  )}
                                </div>
                              </div>

                              <div>
                                <span className="text-gray-400 block text-[10px] uppercase font-semibold">
                                  Credited Amount to Check:
                                </span>
                                <span className="font-royal text-base font-extrabold text-[#2ECC71]">
                                  ₹{order.total}
                                </span>
                              </div>

                              <div>
                                <span className="text-gray-400 block text-[10px] uppercase font-semibold">
                                  Current User View Status:
                                </span>
                                <span className="text-amber-400 font-bold flex items-center gap-1">
                                  <Clock className="w-3 h-3" /> Under Progress
                                </span>
                              </div>
                            </div>

                            {/* Admin Notes & Action Buttons */}
                            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
                              <input
                                type="text"
                                placeholder="Verification note (e.g. Credited at 2:45 PM in ICICI app)"
                                value={verificationNotesMap[order.id] || ''}
                                onChange={(e) =>
                                  setVerificationNotesMap({
                                    ...verificationNotesMap,
                                    [order.id]: e.target.value,
                                  })
                                }
                                className="flex-1 bg-black/80 px-3 py-2 rounded-lg border border-[#444] text-xs text-white placeholder-gray-500 focus:border-[#D4AF37]"
                              />

                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() =>
                                    verifyAndApproveUpiOrder(
                                      order.id,
                                      verificationNotesMap[order.id] || 'Verified in bank account by Rahul Singh'
                                    )
                                  }
                                  className="flex-1 sm:flex-initial px-4 py-2 rounded-lg bg-[#2ECC71] hover:bg-[#27AE60] text-black font-royal font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg hover:shadow-[0_0_15px_rgba(46,204,113,0.5)] transition-all cursor-pointer"
                                >
                                  <Check className="w-4 h-4" />
                                  <span>VERIFY & APPROVE ORDER</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => openRejectModal(order)}
                                  className="px-3 py-2 rounded-lg bg-[#2A1010] hover:bg-red-950 text-red-300 border border-red-800/60 font-royal font-bold text-xs flex items-center justify-center gap-1 cursor-pointer transition-all"
                                >
                                  <X className="w-3.5 h-3.5" />
                                  <span>Reject</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* If already verified by admin */}
                        {order.upiVerifiedByAdmin && (
                          <div className="p-3 rounded-lg bg-[#142614] border border-[#2ECC71]/40 flex items-center justify-between text-xs text-[#2ECC71]">
                            <div className="flex items-center gap-2">
                              <ShieldCheck className="w-4 h-4 text-[#2ECC71]" />
                              <span>
                                Payment verified by <strong>{order.upiVerifiedBy || 'Rahul Singh'}</strong> on{' '}
                                {order.upiVerifiedAt ? new Date(order.upiVerifiedAt).toLocaleString('en-IN') : 'Recent'}
                                {order.upiVerificationNotes && ` &bull; "${order.upiVerificationNotes}"`}
                              </span>
                            </div>
                            {order.upiTransactionId && (
                              <span className="font-mono text-gray-300 text-[11px]">UTR: {order.upiTransactionId}</span>
                            )}
                          </div>
                        )}

                        {/* ========================================================================= */}
                        {/* 1. VISUAL 5-STEP LIFECYCLE PIPELINE */}
                        {/* ========================================================================= */}
                        <div className="p-3.5 rounded-xl bg-black/70 border border-[#2A2A2A] space-y-2">
                          <div className="flex items-center justify-between text-[11px] font-royal font-bold">
                            <span className="text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                              <span>Fulfillment Lifecycle:</span>
                            </span>
                            <span className={`px-2.5 py-0.5 rounded text-[10px] uppercase font-bold tracking-wide ${
                              order.status === 'delivered'
                                ? 'bg-[#2ECC71]/20 text-[#2ECC71] border border-[#2ECC71]/40'
                                : order.status === 'out_for_delivery'
                                ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40 animate-pulse'
                                : order.status === 'packed'
                                ? 'bg-[#E5C158]/20 text-[#E5C158] border border-[#E5C158]/40 animate-pulse'
                                : order.status === 'confirmed'
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                                : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                            }`}>
                              Stage: {order.status.replace('_', ' ').toUpperCase()}
                            </span>
                          </div>

                          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1 text-xs">
                            {/* Step 1: Received */}
                            <div className="p-2 rounded-lg bg-[#141414] border border-[#2ECC71]/40 flex items-center gap-2">
                              <CheckCircle2 className="w-4 h-4 text-[#2ECC71] flex-shrink-0" />
                              <div className="truncate">
                                <p className="font-bold text-gray-200 text-[11px] truncate">1. Placed</p>
                                <p className="text-[10px] text-gray-500 truncate">Received</p>
                              </div>
                            </div>

                            {/* Step 2: Confirmed */}
                            <div className={`p-2 rounded-lg border flex items-center gap-2 truncate ${
                              ['confirmed', 'packed', 'out_for_delivery', 'delivered'].includes(order.status)
                                ? 'bg-[#141414] border-[#2ECC71]/40 text-gray-200'
                                : 'bg-[#181303] border-amber-500/50 text-amber-300'
                            }`}>
                              {['confirmed', 'packed', 'out_for_delivery', 'delivered'].includes(order.status) ? (
                                <CheckCircle2 className="w-4 h-4 text-[#2ECC71] flex-shrink-0" />
                              ) : (
                                <Clock className="w-4 h-4 text-amber-400 flex-shrink-0 animate-pulse" />
                              )}
                              <div className="truncate">
                                <p className="font-bold text-[11px] truncate">2. Confirmed</p>
                                <p className="text-[10px] text-gray-400 truncate">
                                  {['confirmed', 'packed', 'out_for_delivery', 'delivered'].includes(order.status) ? 'Approved' : 'Pending Check'}
                                </p>
                              </div>
                            </div>

                            {/* Step 3: Packing */}
                            <div className={`p-2 rounded-lg border flex items-center gap-2 truncate ${
                              order.status === 'packed'
                                ? 'bg-[#261E08] border-[#D4AF37] text-[#E5C158] ring-1 ring-[#D4AF37]'
                                : ['out_for_delivery', 'delivered'].includes(order.status)
                                ? 'bg-[#141414] border-[#2ECC71]/40 text-gray-200'
                                : 'bg-[#101010] border-[#262626] text-gray-500 opacity-60'
                            }`}>
                              {['out_for_delivery', 'delivered'].includes(order.status) ? (
                                <CheckCircle2 className="w-4 h-4 text-[#2ECC71] flex-shrink-0" />
                              ) : order.status === 'packed' ? (
                                <Box className="w-4 h-4 text-[#E5C158] flex-shrink-0 animate-bounce" />
                              ) : (
                                <Box className="w-4 h-4 text-gray-500 flex-shrink-0" />
                              )}
                              <div className="truncate">
                                <p className="font-bold text-[11px] truncate">3. Packing</p>
                                <p className="text-[10px] text-gray-400 truncate">
                                  {['out_for_delivery', 'delivered'].includes(order.status)
                                    ? 'Vault Packed'
                                    : order.status === 'packed'
                                    ? 'In Progress'
                                    : 'Queued'}
                                </p>
                              </div>
                            </div>

                            {/* Step 4: Out for Delivery */}
                            <div className={`p-2 rounded-lg border flex items-center gap-2 truncate ${
                              order.status === 'out_for_delivery'
                                ? 'bg-[#0E1C2B] border-blue-500 text-blue-300 ring-1 ring-blue-500'
                                : order.status === 'delivered'
                                ? 'bg-[#141414] border-[#2ECC71]/40 text-gray-200'
                                : 'bg-[#101010] border-[#262626] text-gray-500 opacity-60'
                            }`}>
                              {order.status === 'delivered' ? (
                                <CheckCircle2 className="w-4 h-4 text-[#2ECC71] flex-shrink-0" />
                              ) : order.status === 'out_for_delivery' ? (
                                <Truck className="w-4 h-4 text-blue-400 flex-shrink-0 animate-pulse" />
                              ) : (
                                <Truck className="w-4 h-4 text-gray-500 flex-shrink-0" />
                              )}
                              <div className="truncate">
                                <p className="font-bold text-[11px] truncate">4. Dispatch</p>
                                <p className="text-[10px] text-gray-400 truncate">
                                  {order.status === 'delivered'
                                    ? 'Delivered'
                                    : order.status === 'out_for_delivery'
                                    ? 'On Route'
                                    : 'Pending'}
                                </p>
                              </div>
                            </div>

                            {/* Step 5: Delivered */}
                            <div className={`p-2 rounded-lg border flex items-center gap-2 truncate ${
                              order.status === 'delivered'
                                ? 'bg-[#132A13] border-[#2ECC71] text-[#2ECC71] ring-1 ring-[#2ECC71]'
                                : 'bg-[#101010] border-[#262626] text-gray-500 opacity-60'
                            }`}>
                              <CheckCircle2 className={`w-4 h-4 flex-shrink-0 ${order.status === 'delivered' ? 'text-[#2ECC71]' : 'text-gray-500'}`} />
                              <div className="truncate">
                                <p className="font-bold text-[11px] truncate">5. Delivered</p>
                                <p className="text-[10px] text-gray-400 truncate">
                                  {order.status === 'delivered' ? 'Completed' : 'Final Step'}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* ========================================================================= */}
                        {/* 2. CONTEXTUAL ACTION CONTROLLER BAR (THE ORDER MARKING SYSTEM) */}
                        {/* ========================================================================= */}
                        <div className="space-y-3">
                          {/* Case 1: Order is Pending (non-UPI or COD) -> APPROVE & CONFIRM OR REJECT */}
                          {(order.status === 'pending' || (order.status === 'payment_verification' && !isPendingUpi)) && (
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#1C1605] p-3.5 rounded-xl border border-amber-500/50">
                              <div className="flex items-center gap-2.5">
                                <Clock className="w-5 h-5 text-amber-400 flex-shrink-0" />
                                <div>
                                  <h5 className="font-royal text-xs font-bold text-amber-200">
                                    New Order Received &bull; Awaiting Confirmation
                                  </h5>
                                  <p className="text-[11px] text-gray-300">
                                    Approve this order to advance status to Confirmed, or reject with a comment.
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 flex-wrap justify-end">
                                <button
                                  type="button"
                                  onClick={() => openRejectModal(order)}
                                  className="px-3.5 py-2 rounded-xl bg-[#2A1010] hover:bg-red-950 text-red-300 border border-red-800/60 font-royal font-bold text-xs flex items-center gap-1 cursor-pointer transition-all"
                                >
                                  <X className="w-3.5 h-3.5" />
                                  <span>Reject Order</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    updateOrderStatus(
                                      order.id,
                                      'confirmed',
                                      'Order has been approved & confirmed by Store Admin. Queued for royal vault packing.'
                                    );
                                    showToast(`Order #${order.orderNumber} is now CONFIRMED!`, 'success');
                                  }}
                                  className="px-5 py-2.5 rounded-xl font-royal font-bold text-xs text-black bg-gradient-to-r from-[#2ECC71] to-[#27AE60] hover:brightness-110 shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-all"
                                >
                                  <CheckCircle2 className="w-4 h-4" />
                                  <span>APPROVE &amp; CONFIRM ORDER &rarr;</span>
                                </button>
                              </div>
                            </div>
                          )}

                          {/* Case 2: Order is Confirmed */}
                          {order.status === 'confirmed' && (
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gradient-to-r from-[#241A04] via-[#1E1603] to-[#161102] p-3.5 rounded-xl border-2 border-[#D4AF37] shadow-lg">
                              <div className="flex items-center gap-2.5">
                                <Box className="w-6 h-6 text-[#E5C158] flex-shrink-0 animate-bounce" />
                                <div>
                                  <h5 className="font-royal text-xs font-bold text-[#FFF7D6] flex items-center gap-2">
                                    <span>ORDER CONFIRMED</span>
                                    <span className="text-[9px] bg-[#2ECC71]/20 text-[#2ECC71] px-2 py-0.5 rounded font-mono font-bold">READY TO PACK</span>
                                  </h5>
                                  <p className="text-[11px] text-gray-300">
                                    Click &ldquo;MARK AS PACKING&rdquo; or move backward if needed.
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-center gap-2 flex-wrap justify-end">
                                <button
                                  type="button"
                                  onClick={() => openBackwardModal(order, 'pending', 'Pending / Received')}
                                  className="px-3 py-2 rounded-xl bg-[#222] hover:bg-[#333] text-gray-300 border border-[#444] font-royal font-bold text-xs cursor-pointer flex items-center gap-1"
                                  title="Move backward to Pending"
                                >
                                  <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
                                  <span>Move Backward</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => openRejectModal(order)}
                                  className="px-3.5 py-2 rounded-xl bg-[#2A1010] hover:bg-red-950 text-red-300 border border-red-800/60 font-royal font-bold text-xs flex items-center gap-1 cursor-pointer"
                                  title="Cancel / Reject order with reason"
                                >
                                  <X className="w-3.5 h-3.5" />
                                  <span>Cancel / Reject</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    updateOrderStatus(
                                      order.id,
                                      'packed',
                                      'Order confirmed. Handcrafted items are being freshly packed in the royal vault with aroma-seal protection.'
                                    );
                                    showToast(`Order #${order.orderNumber} is now marked as PACKING!`, 'success');
                                  }}
                                  className="px-4 py-2 rounded-xl font-royal font-extrabold text-xs text-black bg-gradient-to-r from-[#F3D079] via-[#D4AF37] to-[#B38C1B] hover:brightness-110 shadow flex items-center gap-1 cursor-pointer"
                                >
                                  <Box className="w-4 h-4" />
                                  <span>MARK AS PACKING &rarr;</span>
                                </button>
                              </div>
                            </div>
                          )}

                          {/* Case 3: Order is Packed */}
                          {order.status === 'packed' && (
                            <div className="space-y-3 bg-[#0A1624] p-3.5 rounded-xl border-2 border-blue-500/60 shadow-lg">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2.5">
                                  <Truck className="w-6 h-6 text-blue-400 flex-shrink-0 animate-pulse" />
                                  <div>
                                    <h5 className="font-royal text-xs font-bold text-blue-200 flex items-center gap-2">
                                      <span>ORDER PACKED IN ROYAL VAULT</span>
                                      <span className="text-[9px] bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded font-mono font-bold">READY TO DISPATCH</span>
                                    </h5>
                                    <p className="text-[11px] text-gray-300">
                                      Packaging complete. Dispatch or move backward if needed.
                                    </p>
                                  </div>
                                </div>
                              </div>

                              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-1">
                                <input
                                  type="text"
                                  placeholder="Rider / Courier details (e.g. Rahul Singh Express #402)"
                                  value={dispatchNotesMap[order.id] || ''}
                                  onChange={(e) => setDispatchNotesMap({ ...dispatchNotesMap, [order.id]: e.target.value })}
                                  className="flex-1 bg-black/80 text-xs text-white px-3 py-2 rounded-lg border border-[#444] focus:border-blue-400"
                                />

                                <div className="flex items-center gap-2 flex-wrap">
                                  <button
                                    type="button"
                                    onClick={() => openBackwardModal(order, 'confirmed', 'Confirmed')}
                                    className="px-3 py-2 rounded-xl bg-[#222] hover:bg-[#333] text-gray-300 border border-[#444] font-royal font-bold text-xs cursor-pointer flex items-center gap-1"
                                  >
                                    <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
                                    <span>Backward</span>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => openRejectModal(order)}
                                    className="px-3.5 py-2 rounded-xl bg-[#2A1010] hover:bg-red-950 text-red-300 border border-red-800/60 font-royal font-bold text-xs flex items-center gap-1 cursor-pointer"
                                  >
                                    <X className="w-3.5 h-3.5" /> Reject
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const riderNote = dispatchNotesMap[order.id] || 'Express Delivery Rider Assigned';
                                      updateOrderStatus(
                                        order.id,
                                        'out_for_delivery',
                                        `Dispatched from Royal Vault! ${riderNote} is on route for express doorstep delivery.`
                                      );
                                      showToast(`Order #${order.orderNumber} is now OUT FOR DELIVERY!`, 'success');
                                    }}
                                    className="px-4 py-2 rounded-xl font-royal font-extrabold text-xs text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:brightness-110 shadow flex items-center gap-1 cursor-pointer whitespace-nowrap"
                                  >
                                    <Truck className="w-4 h-4" />
                                    <span>DISPATCH &rarr;</span>
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Case 4: Order is Out for Delivery */}
                          {order.status === 'out_for_delivery' && (
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#0D2214] p-3.5 rounded-xl border-2 border-[#2ECC71]/70 shadow-lg">
                              <div className="flex items-center gap-2.5">
                                <Truck className="w-6 h-6 text-[#2ECC71] flex-shrink-0 animate-pulse" />
                                <div>
                                  <h5 className="font-royal text-xs font-bold text-[#E5F7ED] flex items-center gap-2">
                                    <span>ORDER OUT FOR EXPRESS DELIVERY</span>
                                    <span className="text-[9px] bg-[#2ECC71]/20 text-[#2ECC71] px-2 py-0.5 rounded font-mono font-bold">ON ROUTE</span>
                                  </h5>
                                  <p className="text-[11px] text-gray-300">
                                    Delivering to {order.shippingAddress.fullName}.
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-center gap-2 flex-wrap justify-end">
                                <button
                                  type="button"
                                  onClick={() => openBackwardModal(order, 'packed', 'Freshly Packed')}
                                  className="px-3 py-2 rounded-xl bg-[#222] hover:bg-[#333] text-gray-300 border border-[#444] font-royal font-bold text-xs cursor-pointer flex items-center gap-1"
                                  title="Move backward due to address not found / climatic condition"
                                >
                                  <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
                                  <span>Move Backward</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => openRejectModal(order)}
                                  className="px-3.5 py-2 rounded-xl bg-[#2A1010] hover:bg-red-950 text-red-300 border border-red-800/60 font-royal font-bold text-xs flex items-center gap-1 cursor-pointer"
                                >
                                  <X className="w-3.5 h-3.5" /> Reject
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    updateOrderStatus(
                                      order.id,
                                      'delivered',
                                      'Order successfully delivered to customer. Thank you for choosing Quality Paan & Shisha.'
                                    );
                                    showToast(`Order #${order.orderNumber} marked as DELIVERED!`, 'success');
                                  }}
                                  className="px-4 py-2 rounded-xl font-royal font-extrabold text-xs text-black bg-gradient-to-r from-[#2ECC71] to-[#27AE60] hover:brightness-110 shadow flex items-center gap-1 cursor-pointer"
                                >
                                  <CheckCircle2 className="w-4 h-4" />
                                  <span>MARK DELIVERED</span>
                                </button>
                              </div>
                            </div>
                          )}

                          {/* Case 5: Order is Delivered */}
                          {order.status === 'delivered' && (
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-xl bg-[#112411] border border-[#2ECC71]/50 text-xs gap-3">
                              <div className="flex items-center gap-2 text-[#2ECC71]">
                                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                                <span className="font-bold">
                                  Order Successfully Completed &amp; Delivered to {order.shippingAddress.fullName}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => openBackwardModal(order, 'out_for_delivery', 'Out for Delivery')}
                                  className="px-3 py-1.5 rounded-lg bg-[#222] hover:bg-[#333] text-gray-300 border border-[#444] font-royal font-bold text-[11px] cursor-pointer flex items-center gap-1"
                                  title="Move backward if delivery issue occurred"
                                >
                                  <RotateCcw className="w-3 h-3 text-amber-400" />
                                  <span>Move Backward</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => openRejectModal(order)}
                                  className="px-2.5 py-1.5 rounded-lg bg-[#2A1010] hover:bg-red-950 text-red-300 border border-red-800/60 font-royal font-bold text-[11px] cursor-pointer flex items-center gap-1"
                                >
                                  <X className="w-3 h-3" /> Reject / Return
                                </button>
                                <span className="text-[10px] bg-[#2ECC71]/20 text-[#2ECC71] px-2.5 py-1 rounded font-mono font-bold">
                                  FULFILLED
                                </span>
                              </div>
                            </div>
                          )}

                          {/* Case 6: Order is Cancelled */}
                          {order.status === 'cancelled' && (
                            <div className="p-3 rounded-xl bg-red-950/30 border border-red-800/40 text-xs text-red-300 flex items-center gap-2">
                              <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0" />
                              <span>This order has been cancelled or declined by store management.</span>
                            </div>
                          )}
                        </div>

                        {/* Order items listing */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                          {order.items.map((item, i) => (
                            <div key={i} className="flex items-center gap-3 bg-[#181818] p-2.5 rounded-lg border border-[#252525]">
                              <img src={item.productImage} alt={item.productName} className="w-10 h-10 rounded object-cover" referrerPolicy="no-referrer" />
                              <div className="text-xs">
                                <p className="font-bold text-gray-200">{item.productName}</p>
                                <p className="text-gray-400">{item.quantity}x &bull; ₹{item.price} {item.variantName ? `(${item.variantName})` : ''}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })()}

            {/* SCREENSHOT PREVIEW MODAL */}
            {previewScreenshotUrl && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
                <div className="relative max-w-lg w-full bg-[#161616] rounded-2xl border border-[#C59B27]/50 p-5 space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-[#333]">
                    <h3 className="font-royal text-sm font-bold text-[#E5C158] flex items-center gap-2">
                      <Eye className="w-4 h-4 text-[#D4AF37]" />
                      <span>Customer Uploaded Payment Receipt</span>
                    </h3>
                    <button
                      onClick={() => setPreviewScreenshotUrl(null)}
                      className="w-7 h-7 rounded-full bg-[#222] text-gray-400 hover:text-white flex items-center justify-center"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="rounded-xl overflow-hidden bg-black border border-[#333] max-h-[70vh] flex items-center justify-center">
                    <img
                      src={previewScreenshotUrl}
                      alt="Payment Receipt"
                      className="max-h-[65vh] w-auto object-contain"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="flex justify-end">
                    <button
                      onClick={() => setPreviewScreenshotUrl(null)}
                      className="px-4 py-1.5 rounded-lg bg-[#D4AF37] text-black font-royal font-bold text-xs"
                    >
                      Close Preview
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB: COUPONS & DISCOUNT AUTHORIZATION */}
        {activeTab === 'coupons' && (
          <div className="space-y-6">
            {/* Create Coupon Form */}
            <form onSubmit={handleAddCouponSubmit} className="p-6 rounded-2xl bg-[#121212] border border-[#C59B27]/40 space-y-5 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#252525]">
                <div>
                  <h3 className="font-royal text-base font-bold text-[#E5C158] flex items-center gap-2">
                    <Tag className="w-4 h-4 text-[#D4AF37]" />
                    Create Discount Coupon &amp; Authorization Limits
                  </h3>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Configure customer eligibility (new users only, subscribers, referral codes), usage frequency limits, and caps
                  </p>
                </div>
                <span className="text-[10px] bg-[#1C180C] text-[#E5C158] border border-[#D4AF37]/40 px-2.5 py-1 rounded-full font-bold self-start sm:self-auto">
                  Smart Authorization Engine
                </span>
              </div>

              {/* Row 1: Code, Type & Value, Max Cap */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                <div className="sm:col-span-4">
                  <label className="text-xs text-[#E5C158] font-bold block mb-1">Coupon Code *</label>
                  <input
                    type="text"
                    required
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    placeholder="e.g. WELCOME100, ROYAL20"
                    className="w-full bg-[#1A1A1A] text-xs px-3.5 py-2.5 rounded-xl border border-[#3A3A3A] text-white focus:border-[#D4AF37] uppercase font-bold font-mono"
                  />
                </div>

                <div className="sm:col-span-4">
                  <label className="text-xs text-gray-300 font-bold block mb-1">Discount Type &amp; Value *</label>
                  <div className="flex gap-2">
                    <select
                      value={couponDiscountType}
                      onChange={(e) => setCouponDiscountType(e.target.value as 'percent' | 'fixed')}
                      className="bg-[#1A1A1A] text-xs px-2.5 py-2.5 rounded-xl border border-[#3A3A3A] text-white focus:border-[#D4AF37]"
                    >
                      <option value="percent">% Percentage</option>
                      <option value="fixed">₹ Fixed Flat</option>
                    </select>
                    <input
                      type="number"
                      min="1"
                      required
                      value={couponDiscountVal}
                      onChange={(e) => setCouponDiscountVal(Number(e.target.value))}
                      className="flex-1 bg-[#1A1A1A] text-xs px-3 py-2.5 rounded-xl border border-[#3A3A3A] text-white focus:border-[#D4AF37]"
                    />
                  </div>
                </div>

                <div className="sm:col-span-4">
                  <label className="text-xs text-gray-300 font-bold block mb-1">
                    Max Discount Cap (₹) {couponDiscountType === 'percent' && <span className="text-amber-400 font-normal">(Capped)</span>}
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={couponMaxCap}
                    onChange={(e) => setCouponMaxCap(Number(e.target.value))}
                    placeholder="0 for unlimited"
                    className="w-full bg-[#1A1A1A] text-xs px-3.5 py-2.5 rounded-xl border border-[#3A3A3A] text-white focus:border-[#D4AF37]"
                  />
                  <span className="text-[10px] text-gray-500 block mt-0.5">Maximum ₹ discount allowed</span>
                </div>
              </div>

              {/* Row 2: Offer Scope / Specific Item Target */}
              <div className="p-4 rounded-xl bg-[#161616] border border-[#2B2B2B] space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                  <div className="sm:col-span-4">
                    <label className="text-xs text-[#E5C158] font-bold block mb-1">
                      Offer Target / Item Scope *
                    </label>
                    <select
                      value={couponAppliesToType}
                      onChange={(e) => {
                        const val = e.target.value as 'all' | 'specific_product' | 'specific_category';
                        setCouponAppliesToType(val);
                        if (val === 'specific_product' && !couponSelectedProductId && products.length > 0) {
                          setCouponSelectedProductId(products[0].id);
                        } else if (val === 'specific_category' && !couponSelectedCategoryId && categories.length > 0) {
                          setCouponSelectedCategoryId(categories[0].id);
                        }
                      }}
                      className="w-full bg-[#1F1F1F] text-xs px-3 py-2.5 rounded-xl border border-[#3A3A3A] text-white focus:border-[#D4AF37]"
                    >
                      <option value="all">🌐 Storewide (All Products & Shisha)</option>
                      <option value="specific_product">🛍️ Specific Item / Shisha Product</option>
                      <option value="specific_category">📁 Specific Product Category</option>
                    </select>
                  </div>

                  {couponAppliesToType === 'specific_product' && (
                    <div className="sm:col-span-8">
                      <label className="text-xs text-[#E5C158] font-bold block mb-1">
                        Select Targeted Item / Product *
                      </label>
                      <select
                        value={couponSelectedProductId}
                        onChange={(e) => setCouponSelectedProductId(e.target.value)}
                        className="w-full bg-[#1F1F1F] text-xs px-3 py-2.5 rounded-xl border border-[#3A3A3A] text-white focus:border-[#D4AF37]"
                      >
                        {products.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.name} — ₹{p.price} ({p.category.toUpperCase()})
                          </option>
                        ))}
                      </select>
                      <span className="text-[10px] text-gray-400 mt-1 block">
                        ✓ Discount applies when customer adds this exact product to cart
                      </span>
                    </div>
                  )}

                  {couponAppliesToType === 'specific_category' && (
                    <div className="sm:col-span-8">
                      <label className="text-xs text-[#E5C158] font-bold block mb-1">
                        Select Targeted Category *
                      </label>
                      <select
                        value={couponSelectedCategoryId}
                        onChange={(e) => setCouponSelectedCategoryId(e.target.value)}
                        className="w-full bg-[#1F1F1F] text-xs px-3 py-2.5 rounded-xl border border-[#3A3A3A] text-white focus:border-[#D4AF37]"
                      >
                        {categories.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.displayName} ({c.id})
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>

                {/* First Buy Quick Toggle */}
                <div className="pt-2 border-t border-[#252525] flex items-center justify-between">
                  <label className="flex items-center gap-2.5 cursor-pointer text-xs font-bold text-[#E5C158]">
                    <input
                      type="checkbox"
                      checked={couponFirstBuyOnly || couponEligibility === 'new_user_only'}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        setCouponFirstBuyOnly(checked);
                        if (checked) {
                          setCouponEligibility('new_user_only');
                          setCouponUsageLimitType('once_per_user');
                        } else {
                          setCouponEligibility('all');
                        }
                      }}
                      className="w-4 h-4 rounded accent-[#D4AF37] cursor-pointer"
                    />
                    <span>⭐ First Buy Offer (Valid ONLY on customer&apos;s 1st order after signup)</span>
                  </label>
                  <span className="text-[10px] text-amber-400/90 font-mono">
                    {couponFirstBuyOnly || couponEligibility === 'new_user_only' ? '✓ First Order Exclusive' : 'Standard Offer'}
                  </span>
                </div>
              </div>

              {/* Row 3: Customer Eligibility & Usage Frequency Limit */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-xl bg-[#161616] border border-[#262626]">
                <div>
                  <label className="text-xs text-[#E5C158] font-bold block mb-1">
                    Customer Eligibility Restriction *
                  </label>
                  <select
                    value={couponEligibility}
                    onChange={(e) => {
                      const val = e.target.value as CouponEligibility;
                      setCouponEligibility(val);
                      if (val === 'new_user_only') setCouponFirstBuyOnly(true);
                      else setCouponFirstBuyOnly(false);
                    }}
                    className="w-full bg-[#1F1F1F] text-xs px-3 py-2.5 rounded-xl border border-[#3A3A3A] text-white focus:border-[#D4AF37]"
                  >
                    <option value="all">All Customers (Public)</option>
                    <option value="new_user_only">New Users Only (1st Order Account)</option>
                    <option value="referral_only">Referral Invitees Only</option>
                  </select>
                  <span className="text-[10px] text-gray-400 mt-1 block">
                    {couponEligibility === 'new_user_only' ? '✓ Can only be used on 1st order after account creation' : 'Restricts who can redeem'}
                  </span>
                </div>

                <div>
                  <label className="text-xs text-[#E5C158] font-bold block mb-1">
                    Usage Frequency Limit *
                  </label>
                  <select
                    value={couponUsageLimitType}
                    onChange={(e) => setCouponUsageLimitType(e.target.value as CouponUsageLimitType)}
                    className="w-full bg-[#1F1F1F] text-xs px-3 py-2.5 rounded-xl border border-[#3A3A3A] text-white focus:border-[#D4AF37]"
                  >
                    <option value="unlimited">Unlimited Redemptions</option>
                    <option value="once_per_user">Once Ever Per Customer (1-Time)</option>
                    <option value="once_per_month">Once Per Customer Per Month</option>
                    <option value="custom_limit">Custom Times Per Customer</option>
                  </select>
                  <span className="text-[10px] text-gray-400 mt-1 block">
                    {couponUsageLimitType === 'once_per_month' ? '✓ Customer can reuse once every 30 days' : 'Controls per-account frequency'}
                  </span>
                </div>

                <div>
                  <label className="text-xs text-gray-300 font-bold block mb-1">
                    Min Order Spend (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={couponMinSpend}
                    onChange={(e) => setCouponMinSpend(Number(e.target.value))}
                    className="w-full bg-[#1F1F1F] text-xs px-3 py-2.5 rounded-xl border border-[#3A3A3A] text-white focus:border-[#D4AF37]"
                  />
                  <span className="text-[10px] text-gray-500 mt-1 block">Minimum cart subtotal to activate</span>
                </div>
              </div>

              {/* Row 3: Advanced Options (Custom usage, Expiry, Referral) */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                {couponUsageLimitType === 'custom_limit' && (
                  <div>
                    <label className="text-xs text-gray-300 font-bold block mb-1">Max Uses Per User</label>
                    <input
                      type="number"
                      min="1"
                      value={couponMaxUsagePerUser}
                      onChange={(e) => setCouponMaxUsagePerUser(Number(e.target.value))}
                      className="w-full bg-[#1A1A1A] text-xs px-3 py-2 rounded-xl border border-[#333] text-white"
                    />
                  </div>
                )}

                <div>
                  <label className="text-xs text-gray-300 font-bold block mb-1">Total Overall Redemptions Cap</label>
                  <input
                    type="number"
                    min="0"
                    value={couponMaxTotalLimit}
                    onChange={(e) => setCouponMaxTotalLimit(Number(e.target.value))}
                    placeholder="e.g. 500"
                    className="w-full bg-[#1A1A1A] text-xs px-3 py-2 rounded-xl border border-[#333] text-white"
                  />
                  <span className="text-[10px] text-gray-500">First X users total</span>
                </div>

                <div>
                  <label className="text-xs text-gray-300 font-bold block mb-1">Expiry Date (Optional)</label>
                  <input
                    type="date"
                    value={couponExpiryDate}
                    onChange={(e) => setCouponExpiryDate(e.target.value)}
                    className="w-full bg-[#1A1A1A] text-xs px-3 py-2 rounded-xl border border-[#333] text-white"
                  />
                </div>

                {couponEligibility === 'referral_only' && (
                  <div>
                    <label className="text-xs text-cyan-300 font-bold block mb-1">Referral Code Tag</label>
                    <input
                      type="text"
                      value={couponReferralCode}
                      onChange={(e) => setCouponReferralCode(e.target.value.toUpperCase())}
                      placeholder="e.g. RAHUL-REF"
                      className="w-full bg-[#1A1A1A] text-xs px-3 py-2 rounded-xl border border-cyan-500/40 text-white uppercase"
                    />
                  </div>
                )}

                <div className={couponEligibility === 'referral_only' ? 'sm:col-span-1' : 'sm:col-span-2'}>
                  <label className="text-xs text-gray-300 font-bold block mb-1">Offer Tagline / Terms Description</label>
                  <input
                    type="text"
                    value={couponDesc}
                    onChange={(e) => setCouponDesc(e.target.value)}
                    placeholder="e.g. ₹100 Flat discount on first order for new accounts"
                    className="w-full bg-[#1A1A1A] text-xs px-3 py-2 rounded-xl border border-[#333] text-white"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#F3D079] via-[#D4AF37] to-[#B38C1B] text-black font-royal font-bold text-xs hover:brightness-110 shadow-lg transition-all cursor-pointer flex items-center gap-2 active:scale-95"
                >
                  <Tag className="w-3.5 h-3.5" />
                  <span>Create Authorized Coupon</span>
                </button>
              </div>
            </form>

            {/* Active Coupons Grid */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-royal text-sm font-bold text-[#E5C158] flex items-center gap-2">
                  <Tag className="w-4 h-4 text-[#D4AF37]" />
                  Active Coupons &amp; Discount Offers ({coupons.length})
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {coupons.map((c) => (
                  <div key={c.id || c.code} className="p-5 rounded-2xl bg-[#121212] border border-[#C59B27]/40 space-y-3 relative group shadow-xl hover:border-[#D4AF37] transition-all">
                    {/* Header */}
                    <div className="flex items-center justify-between pb-2 border-b border-[#222]">
                      <div>
                        <span className="font-mono text-sm font-extrabold text-[#E5C158] tracking-wider bg-black/60 px-2.5 py-1 rounded-lg border border-[#D4AF37]/30">
                          {c.code}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-1.5">
                        <span className={`text-[10px] px-2 py-0.5 rounded font-bold border ${c.isActive ? 'bg-[#162916] text-[#2ECC71] border-[#2ECC71]/30' : 'bg-red-950 text-red-300 border-red-700/30'}`}>
                          {c.isActive ? 'ACTIVE' : 'PAUSED'}
                        </span>

                        <button
                          type="button"
                          onClick={() => {
                            setEditingCoupon({ ...c });
                            setEditingCouponOriginalId(c.id || c.code);
                            setIsCouponModalOpen(true);
                          }}
                          className="p-1.5 rounded-lg bg-[#2A2005] hover:bg-[#3D2D06] text-[#E5C158] hover:text-white transition-colors cursor-pointer flex items-center gap-1 text-[11px] border border-[#D4AF37]/40"
                          title="Edit coupon"
                        >
                          <Edit className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setCouponToDelete(c)}
                          className="p-1.5 rounded-lg bg-[#2A1010] hover:bg-red-900 text-red-300 hover:text-white transition-colors cursor-pointer flex items-center gap-1 text-[11px] border border-red-500/30"
                          title="Delete coupon"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-xs text-gray-300 leading-relaxed min-h-[32px]">{c.description}</p>

                    {/* Item Targeting & Eligibility Badges */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {/* Item/Category Scope Badge */}
                      {c.appliesToType === 'specific_product' && (
                        <span className="text-[10px] bg-[#221C00] text-[#E5C158] border border-[#D4AF37]/50 px-2 py-0.5 rounded font-bold font-mono">
                          🛍️ ITEM: {c.targetProductName || 'Selected Product'}
                        </span>
                      )}
                      {c.appliesToType === 'specific_category' && (
                        <span className="text-[10px] bg-[#17202A] text-blue-300 border border-blue-500/40 px-2 py-0.5 rounded font-semibold font-mono">
                          📁 CAT: {c.targetCategoryName || 'Category'}
                        </span>
                      )}

                      {/* Eligibility Badge */}
                      {(c.eligibility === 'new_user_only' || c.firstBuyOnly) && (
                        <span className="text-[10px] bg-amber-950/80 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded font-semibold">
                          ⭐ First Buy (1st Order)
                        </span>
                      )}
                      {c.eligibility === 'referral_only' && (
                        <span className="text-[10px] bg-cyan-950/80 text-cyan-300 border border-cyan-500/30 px-2 py-0.5 rounded font-semibold">
                          🤝 Referral Exclusive
                        </span>
                      )}
                      {(!c.eligibility || c.eligibility === 'all') && !c.firstBuyOnly && (
                        <span className="text-[10px] bg-[#1E1E1E] text-gray-300 border border-[#333] px-2 py-0.5 rounded">
                          👥 All Customers
                        </span>
                      )}

                      {/* Usage Frequency Badge */}
                      {c.usageLimitType === 'once_per_user' && (
                        <span className="text-[10px] bg-blue-950/80 text-blue-300 border border-blue-500/30 px-2 py-0.5 rounded font-semibold">
                          1-Time Redemption
                        </span>
                      )}
                      {c.usageLimitType === 'once_per_month' && (
                        <span className="text-[10px] bg-emerald-950/80 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded font-semibold">
                          🔄 1x Per Month
                        </span>
                      )}
                      {c.usageLimitType === 'unlimited' && (
                        <span className="text-[10px] bg-[#1E1E1E] text-gray-400 border border-[#333] px-2 py-0.5 rounded">
                          ∞ Unlimited Uses
                        </span>
                      )}
                    </div>

                    {/* Financial & Limits Details */}
                    <div className="pt-2 border-t border-[#222] flex items-center justify-between text-xs">
                      <div>
                        <span className="text-[11px] text-gray-400 block">Min Spend: ₹{c.minOrderValue}</span>
                        {c.maxDiscountCap && c.maxDiscountCap > 0 ? (
                          <span className="text-[10px] text-amber-400 font-mono font-bold">Cap: ₹{c.maxDiscountCap}</span>
                        ) : null}
                      </div>

                      <div className="text-right">
                        <span className="font-royal text-sm font-bold text-[#E5C158] block">
                          {c.discountPercent ? `${c.discountPercent}% OFF` : `₹${c.discountAmount} FLAT`}
                        </span>
                        <span className="text-[10px] text-gray-400 font-mono">
                          Used: {c.usedCount || 0}{c.maxTotalUsageLimit ? ` / ${c.maxTotalUsageLimit}` : ''}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB: PAYMENT SYSTEM & GATEWAY CONFIGURATION */}
        {activeTab === 'payments' && (
          <AdminPaymentConfigSection />
        )}

        {/* TAB: AI CHATBOT & AUTONOMOUS RAG KNOWLEDGE AUTOMATION */}
        {activeTab === 'chatbot' && (
          <ChatbotAdminPanel />
        )}

        {/* TAB: HOMEPAGE VIDEO ADS & PLAYFUL GIF SHOWCASE */}
        {activeTab === 'ads' && (
          <AdsAdminPanel />
        )}

        {/* TAB: ROLES, APPOINTED STAFF & PANEL TAB TRANSFER */}
        {activeTab === 'roles' && (
          <RolesAndPermissionsPanel />
        )}


        {/* TAB: CMS */}
        {activeTab === 'cms' && (
          <form onSubmit={handleSaveCMS} className="p-6 rounded-2xl bg-[#121212] border border-[#C59B27]/30 space-y-6">
            <h3 className="font-royal text-base font-bold text-[#E5C158]">Storefront Homepage Sliding Banners & Contact Settings</h3>
            
            {/* Sliding Hero Banners Manager */}
            <div className="space-y-4 bg-[#161616] p-4 rounded-xl border border-[#333]">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-royal text-sm font-bold text-[#D4AF37]">Hero Sliding Banner Slides ({cmsSlides.length})</h4>
                  <p className="text-[11px] text-gray-400">Manage sliding hero banner images, rotating taglines, CTA buttons, and announcements.</p>
                </div>
                <button
                  type="button"
                  onClick={handleAddCmsSlide}
                  className="px-3 py-1.5 rounded-lg bg-[#2A2005] text-[#E5C158] border border-[#D4AF37]/40 text-xs font-semibold hover:bg-[#D4AF37] hover:text-black transition-all"
                >
                  + Add Slide
                </button>
              </div>

              <div className="space-y-4">
                {cmsSlides.map((slide, idx) => (
                  <div key={slide.id || idx} className="p-4 rounded-xl bg-[#101010] border border-[#2A2A2A] space-y-3 relative group">
                    <div className="flex items-center justify-between">
                      <span className="font-royal text-xs font-bold text-[#E5C158]">Slide #{idx + 1}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveCmsSlide(idx)}
                        className="text-red-400 hover:text-red-300 text-xs flex items-center gap-1 bg-red-950/40 px-2 py-0.5 rounded border border-red-900/50"
                      >
                        <Trash2 className="w-3 h-3" /> Remove Slide
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div>
                        <label className="text-gray-400 block mb-1">Slide Tagline *</label>
                        <input
                          type="text"
                          value={slide.tagline}
                          onChange={(e) => handleUpdateCmsSlide(idx, { tagline: e.target.value })}
                          className="w-full bg-[#1A1A1A] px-3 py-2 rounded border border-[#333] text-white"
                        />
                      </div>
                      <div>
                        <label className="text-gray-400 block mb-1">Button CTA Text *</label>
                        <input
                          type="text"
                          value={slide.ctaText}
                          onChange={(e) => handleUpdateCmsSlide(idx, { ctaText: e.target.value })}
                          className="w-full bg-[#1A1A1A] px-3 py-2 rounded border border-[#333] text-white"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="text-gray-400 block mb-1">Announcement Banner Text</label>
                        <input
                          type="text"
                          value={slide.announcement || ''}
                          onChange={(e) => handleUpdateCmsSlide(idx, { announcement: e.target.value })}
                          className="w-full bg-[#1A1A1A] px-3 py-2 rounded border border-[#333] text-white"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <ImageUploadField
                          label={`Slide #${idx + 1} Image`}
                          value={slide.image}
                          onChange={(url) => handleUpdateCmsSlide(idx, { image: url })}
                          folder="hero"
                          aspectRatio="banner"
                          helperText="Upload slide banner image directly from your device."
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="text-gray-400 block mb-1">Hero Subtitle</label>
                <input
                  type="text"
                  value={cmsHeroSubtitle}
                  onChange={(e) => setCmsHeroSubtitle(e.target.value)}
                  className="w-full bg-[#1A1A1A] px-3 py-2 rounded border border-[#333] text-white focus:border-[#D4AF37]"
                />
              </div>

              <div>
                <label className="text-gray-400 block mb-1">Store Phone</label>
                <input
                  type="text"
                  value={cmsPhone}
                  onChange={(e) => setCmsPhone(e.target.value)}
                  className="w-full bg-[#1A1A1A] px-3 py-2 rounded border border-[#333] text-white focus:border-[#D4AF37]"
                />
              </div>

              <div>
                <label className="text-gray-400 block mb-1">Store Email</label>
                <input
                  type="text"
                  value={cmsEmail}
                  onChange={(e) => setCmsEmail(e.target.value)}
                  className="w-full bg-[#1A1A1A] px-3 py-2 rounded border border-[#333] text-white focus:border-[#D4AF37]"
                />
              </div>

              <div>
                <label className="text-gray-400 block mb-1">Store Address</label>
                <input
                  type="text"
                  value={cmsAddress}
                  onChange={(e) => setCmsAddress(e.target.value)}
                  className="w-full bg-[#1A1A1A] px-3 py-2 rounded border border-[#333] text-white focus:border-[#D4AF37]"
                />
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end border-t border-[#222]">
              <button
                type="button"
                onClick={handleSaveCMS}
                className={`px-8 py-3 rounded-xl font-royal font-bold text-xs text-black transition-all active:scale-95 shadow-lg flex items-center gap-2 cursor-pointer ${
                  isCmsSavedRecently
                    ? 'bg-gradient-to-r from-emerald-400 to-green-500 text-black ring-2 ring-emerald-300'
                    : 'bg-gradient-to-r from-[#F3D079] via-[#D4AF37] to-[#B38C1B] hover:brightness-110'
                }`}
              >
                {isCmsSavedRecently ? <Check className="w-4 h-4 text-black stroke-[3]" /> : <Save className="w-4 h-4" />}
                <span>{isCmsSavedRecently ? 'STOREFRONT CMS & BANNERS SAVED ✓' : 'SAVE STOREFRONT CMS & SLIDING BANNERS'}</span>
              </button>
            </div>
          </form>
        )}

        {/* MODAL: ADD / EDIT PRODUCT WITH INGREDIENTS & OPTIONS BUILDER */}
        {isProductModalOpen && editingProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
            <div className="relative w-full max-w-3xl bg-[#121212] rounded-2xl border border-[#C59B27]/50 p-5 sm:p-7 shadow-[0_16px_50px_rgba(0,0,0,0.9)] space-y-5 my-auto max-h-[92vh] overflow-y-auto">
              
              <div className="flex items-center justify-between pb-3 border-b border-[#252525]">
                <div className="flex flex-wrap items-center gap-2">
                  <Leaf className="w-5 h-5 text-[#E5C158]" />
                  <h3 className="font-royal text-base sm:text-lg font-bold text-[#E5C158]">
                    {editingProduct.id 
                      ? `Edit ${editingProduct.name}` 
                      : editingProduct.name?.includes('(Copy)') 
                      ? 'Duplicate & Add Product' 
                      : 'Add New Shisha / Product'}
                  </h3>
                  {!editingProduct.id && editingProduct.name?.includes('(Copy)') && (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#E5C158] text-black uppercase font-royal flex items-center gap-1 shadow">
                      <Copy className="w-3 h-3 text-black" /> Cloned Template
                    </span>
                  )}
                </div>
                <button
                  onClick={() => setIsProductModalOpen(false)}
                  className="w-8 h-8 rounded-full bg-[#1F1F1F] text-gray-400 hover:text-white flex items-center justify-center border border-[#333] cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Cloned Template Helper Banner */}
              {!editingProduct.id && editingProduct.name?.includes('(Copy)') && (
                <div className="p-3.5 rounded-xl bg-gradient-to-r from-[#201A09] via-[#1B1506] to-[#121212] border border-[#D4AF37]/50 flex items-start gap-3 shadow-md">
                  <Sparkles className="w-5 h-5 text-[#E5C158] flex-shrink-0 mt-0.5" />
                  <div className="text-xs text-gray-300 space-y-0.5">
                    <p className="font-royal font-bold text-[#E5C158]">
                      Product Details Pre-Filled from Template
                    </p>
                    <p>
                      All attributes, description, and ingredients were copied. Simply update the <strong>Title</strong>, <strong>Size / Options</strong>, <strong>Price</strong>, or <strong>Product Images</strong> below and click <strong>&quot;Save &amp; Add to Catalog&quot;</strong>.
                    </p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSaveProduct} className="space-y-6 text-xs">
                {/* SECTION 1: Basic Information */}
                <div className="space-y-3 bg-[#171717] p-4 rounded-xl border border-[#282828]">
                  <h4 className="font-royal text-xs font-bold text-[#D4AF37] uppercase tracking-wider flex items-center gap-1.5">
                    <Package className="w-3.5 h-3.5" /> 1. Basic Information
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <label className="text-gray-300 block mb-1 font-semibold">Product Title / Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. 24K Gold Egyptian Hookah, Brain Freeze Flavour, RAW Rolling Papers"
                        value={editingProduct.name || ''}
                        onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                        className="w-full bg-[#1A1A1A] px-3 py-2 rounded-lg border border-[#333] text-white focus:border-[#D4AF37]"
                      />
                    </div>

                    <div>
                      <label className="text-gray-300 block mb-1 font-semibold">Menu Category *</label>
                      <select
                        value={editingProduct.category || 'hookah'}
                        onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value as ProductCategory })}
                        className="w-full bg-[#1A1A1A] px-3 py-2 rounded-lg border border-[#333] text-white focus:border-[#D4AF37]"
                      >
                        {categories.map((c) => (
                          <option key={c.id} value={c.id}>{c.displayName}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-gray-300 block mb-1 font-semibold">Subcategory / Tag</label>
                      <input
                        type="text"
                        placeholder="e.g. Luxury Hookahs, Herbal Molasses, Glass Bongs, Torch Lighters, Bakhoor"
                        value={editingProduct.subcategory || ''}
                        onChange={(e) => setEditingProduct({ ...editingProduct, subcategory: e.target.value })}
                        className="w-full bg-[#1A1A1A] px-3 py-2 rounded-lg border border-[#333] text-white focus:border-[#D4AF37]"
                      />
                    </div>

                    <div>
                      <label className="text-gray-300 block mb-1 font-semibold">Buy / Cost Price (₹)</label>
                      <input
                        type="number"
                        placeholder="Cost to produce or procure"
                        value={editingProduct.buyPrice !== undefined ? editingProduct.buyPrice : ''}
                        onChange={(e) => setEditingProduct({ ...editingProduct, buyPrice: Number(e.target.value) })}
                        className="w-full bg-[#1A1A1A] px-3 py-2 rounded-lg border border-[#333] text-[#2ECC71] font-bold focus:border-[#2ECC71]"
                      />
                      <span className="text-[10px] text-gray-400 mt-0.5 block">
                        Profit margin: ₹{(Number(editingProduct.price) || 0) - (Number(editingProduct.buyPrice) || 0)} per unit
                        {Number(editingProduct.price) ? ` (${Math.round((((Number(editingProduct.price) || 0) - (Number(editingProduct.buyPrice) || 0)) / (Number(editingProduct.price) || 1)) * 100)}% margin)` : ''}
                      </span>
                    </div>

                    <div>
                      <label className="text-gray-300 block mb-1 font-semibold">Base Selling Price (₹) *</label>
                      <input
                        type="number"
                        required
                        value={editingProduct.price || 0}
                        onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                        className="w-full bg-[#1A1A1A] px-3 py-2 rounded-lg border border-[#333] text-[#E5C158] font-bold focus:border-[#D4AF37]"
                      />
                    </div>

                    <div>
                      <label className="text-gray-300 block mb-1 font-semibold">MRP Price (₹)</label>
                      <input
                        type="number"
                        value={editingProduct.mrp || 0}
                        onChange={(e) => setEditingProduct({ ...editingProduct, mrp: Number(e.target.value) })}
                        className="w-full bg-[#1A1A1A] px-3 py-2 rounded-lg border border-[#333] text-gray-300 focus:border-[#D4AF37]"
                      />
                    </div>

                    <div>
                      <label className="text-gray-300 block mb-1 font-semibold">Stock Quantity (Units)</label>
                      <input
                        type="number"
                        value={editingProduct.stock || 0}
                        onChange={(e) => setEditingProduct({ ...editingProduct, stock: Number(e.target.value) })}
                        className="w-full bg-[#1A1A1A] px-3 py-2 rounded-lg border border-[#333] text-white focus:border-[#D4AF37]"
                      />
                    </div>

                    <div className="sm:col-span-2 space-y-3">
                      <ImageUploadField
                        label="Primary Product Image"
                        value={editingProduct.images?.[0] || ''}
                        onChange={(url) => {
                          const gallery = (editingProduct.images || []).slice(1);
                          setEditingProduct({ ...editingProduct, images: [url, ...gallery] });
                        }}
                        folder="products"
                        aspectRatio="square"
                        helperText="Directly upload the product image from your device. It automatically saves to /public/uploads/products/ and takes the path directly on the website and mobile app."
                      />

                      {/* Additional Gallery Photos Section */}
                      <div className="pt-2 border-t border-[#262626] space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-gray-300 uppercase tracking-wider">
                            Additional Gallery Photos ({(editingProduct.images || []).length > 1 ? (editingProduct.images || []).length - 1 : 0})
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              const imgs = [...(editingProduct.images || [''])];
                              imgs.push('');
                              setEditingProduct({ ...editingProduct, images: imgs });
                            }}
                            className="text-xs text-[#D4AF37] hover:underline flex items-center gap-1 font-semibold"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Add Photo Slot</span>
                          </button>
                        </div>

                        {(editingProduct.images || []).slice(1).map((galleryUrl, idx) => (
                          <div key={idx} className="p-2.5 rounded-xl bg-[#141414] border border-[#2A2A2A] space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-[11px] font-bold text-[#E5C158]">
                                Gallery Image #{idx + 2}
                              </span>
                              <button
                                type="button"
                                onClick={() => {
                                  const imgs = [...(editingProduct.images || [])];
                                  imgs.splice(idx + 1, 1);
                                  setEditingProduct({ ...editingProduct, images: imgs });
                                }}
                                className="text-[11px] text-red-400 hover:text-red-300 font-semibold flex items-center gap-1"
                              >
                                <X className="w-3 h-3" /> Remove
                              </button>
                            </div>
                            <ImageUploadField
                              label={`Gallery Image #${idx + 2}`}
                              value={galleryUrl}
                              onChange={(url) => {
                                const imgs = [...(editingProduct.images || [])];
                                imgs[idx + 1] = url;
                                setEditingProduct({ ...editingProduct, images: imgs });
                              }}
                              folder="products"
                              aspectRatio="square"
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="text-gray-300 block mb-1 font-semibold">Short Summary / Tagline</label>
                      <input
                        type="text"
                        value={editingProduct.shortDescription || ''}
                        onChange={(e) => setEditingProduct({ ...editingProduct, shortDescription: e.target.value })}
                        className="w-full bg-[#1A1A1A] px-3 py-2 rounded-lg border border-[#333] text-white focus:border-[#D4AF37]"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="text-gray-300 block mb-1 font-semibold">Detailed Description</label>
                      <textarea
                        rows={2}
                        value={editingProduct.description || ''}
                        onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                        className="w-full bg-[#1A1A1A] px-3 py-2 rounded-lg border border-[#333] text-white focus:border-[#D4AF37]"
                      />
                    </div>
                  </div>
                </div>

                {/* SECTION 2: PRODUCT FEATURES & INCLUSIONS */}
                <div className="space-y-3 bg-[#171717] p-4 rounded-xl border border-[#C59B27]/40 shadow-inner">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-royal text-xs font-bold text-[#E5C158] uppercase tracking-wider flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-[#E5C158]" /> 2. &ldquo;Product Features, Botanicals &amp; Inclusions&rdquo;
                      </h4>
                      <p className="text-[11px] text-gray-400">
                        Add the precise botanicals, ingredients &amp; crafted features included in this item (shown prominently on customer storefront)
                      </p>
                    </div>
                    <span className="text-[11px] font-bold text-[#D4AF37] bg-[#2A2005] px-2 py-0.5 rounded border border-[#C59B27]/30">
                      {(editingProduct.ingredients || []).length} Ingredients
                    </span>
                  </div>

                  {/* Current Ingredients Chips */}
                  <div className="flex flex-wrap gap-2 p-2.5 rounded-lg bg-[#111] border border-[#282828] min-h-[44px]">
                    {(editingProduct.ingredients || []).map((ing, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1.5 bg-[#1F190B] text-[#F3EFE0] px-2.5 py-1 rounded-full text-xs border border-[#C59B27]/40"
                      >
                        <span>{ing}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveIngredient(idx)}
                          className="w-4 h-4 rounded-full bg-black/50 text-gray-400 hover:text-red-400 flex items-center justify-center"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                    {(editingProduct.ingredients || []).length === 0 && (
                      <span className="text-gray-500 text-xs italic">No ingredients added yet. Type below or pick quick suggestions!</span>
                    )}
                  </div>

                  {/* Add Ingredient Input */}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newIngredientInput}
                      onChange={(e) => setNewIngredientInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddIngredient(newIngredientInput);
                        }
                      }}
                      placeholder="Type custom ingredient (e.g. Ashwagandha Root Extract, Kesar, Almonds, Chandi Vark)..."
                      className="flex-1 bg-[#1A1A1A] px-3 py-2 rounded-lg border border-[#333] text-white focus:border-[#D4AF37]"
                    />
                    <button
                      type="button"
                      onClick={() => handleAddIngredient(newIngredientInput)}
                      className="px-4 py-2 rounded-lg bg-[#D4AF37] text-black font-royal font-bold flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add
                    </button>
                  </div>

                  {/* Quick Suggestions */}
                  <div>
                    <span className="text-[10px] text-gray-400 block mb-1.5 font-semibold uppercase tracking-wider">
                      Quick Click to Add Specifications:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {quickPaanIngredientSuggestions.map((sug, i) => (
                        <button
                          type="button"
                          key={i}
                          onClick={() => handleAddIngredient(sug)}
                          className="text-[10px] bg-[#1F1F1F] text-gray-300 hover:text-[#E5C158] hover:border-[#D4AF37] px-2 py-0.5 rounded-full border border-[#333] transition-colors"
                        >
                          + {sug}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* SECTION 3: PRODUCT OPTIONS & PACK VARIANTS */}
                <div className="space-y-3 bg-[#171717] p-4 rounded-xl border border-[#282828]">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-royal text-xs font-bold text-[#D4AF37] uppercase tracking-wider flex items-center gap-1.5">
                        <ListPlus className="w-3.5 h-3.5" /> 3. Product Options & Pack Sizes (Variants)
                      </h4>
                      <p className="text-[11px] text-gray-400">
                        Allow customers to choose between Pack of 2, Gift Box of 5, Tin of 10, or Flavour Sizes
                      </p>
                    </div>
                  </div>

                  {/* Existing Variants List */}
                  <div className="space-y-2">
                    {(editingProduct.variants || []).map((v) => (
                      <div
                        key={v.id}
                        className="flex items-center justify-between bg-[#111] px-3 py-2 rounded-lg border border-[#282828]"
                      >
                        <div className="flex items-center gap-3">
                          <span className="font-bold text-gray-200">{v.name}</span>
                          <span className="text-[#E5C158] font-royal font-bold">Sell: ₹{v.price}</span>
                          <span className="text-[#2ECC71] text-xs font-semibold">Buy: ₹{v.buyPrice || Math.round(v.price * 0.4)}</span>
                          {v.mrp > v.price && <span className="text-gray-500 line-through text-[10px]">MRP: ₹{v.mrp}</span>}
                          <span className="text-[10px] text-gray-400 font-mono">Stock: {v.stock}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveVariant(v.id)}
                          className="text-gray-400 hover:text-red-400"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Add New Variant Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 pt-1">
                    <input
                      type="text"
                      placeholder="Option Name (e.g. Box of 5)"
                      value={newVariantName}
                      onChange={(e) => setNewVariantName(e.target.value)}
                      className="bg-[#1A1A1A] px-2.5 py-1.5 rounded border border-[#333] text-white text-xs"
                    />
                    <input
                      type="number"
                      placeholder="Sell Price (₹)"
                      value={newVariantPrice}
                      onChange={(e) => setNewVariantPrice(Number(e.target.value))}
                      className="bg-[#1A1A1A] px-2.5 py-1.5 rounded border border-[#333] text-[#E5C158] font-bold text-xs"
                    />
                    <input
                      type="number"
                      placeholder="Buy Cost (₹)"
                      value={newVariantBuyPrice}
                      onChange={(e) => setNewVariantBuyPrice(Number(e.target.value))}
                      className="bg-[#1A1A1A] px-2.5 py-1.5 rounded border border-[#333] text-[#2ECC71] font-bold text-xs"
                    />
                    <input
                      type="number"
                      placeholder="MRP (₹)"
                      value={newVariantMrp}
                      onChange={(e) => setNewVariantMrp(Number(e.target.value))}
                      className="bg-[#1A1A1A] px-2.5 py-1.5 rounded border border-[#333] text-gray-300 text-xs"
                    />
                    <button
                      type="button"
                      onClick={handleAddVariant}
                      className="px-3 py-1.5 rounded bg-[#1F190B] text-[#E5C158] border border-[#D4AF37]/40 hover:bg-[#D4AF37] hover:text-black font-bold transition-colors text-xs"
                    >
                      + Add Option
                    </button>
                  </div>
                </div>

                {/* SECTION 4: ATTRIBUTES & BADGES */}
                <div className="space-y-3 bg-[#171717] p-4 rounded-xl border border-[#282828]">
                  <h4 className="font-royal text-xs font-bold text-[#D4AF37] uppercase tracking-wider flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5" /> 4. Custom Specifications & Badges
                  </h4>

                  {/* Key-Value Attributes */}
                  <div className="space-y-2">
                    {editingProduct.attributes && Object.entries(editingProduct.attributes).map(([k, v]) => (
                      <div key={k} className="flex items-center justify-between bg-[#111] px-3 py-1.5 rounded border border-[#282828]">
                        <span className="text-gray-400 font-semibold">{k}: <strong className="text-gray-200">{v}</strong></span>
                        <button type="button" onClick={() => handleRemoveAttribute(k)} className="text-gray-400 hover:text-red-400">
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Key (e.g. Flavor Profile, Shelf Life)"
                      value={newAttrKey}
                      onChange={(e) => setNewAttrKey(e.target.value)}
                      className="flex-1 bg-[#1A1A1A] px-2.5 py-1.5 rounded border border-[#333] text-white"
                    />
                    <input
                      type="text"
                      placeholder="Value (e.g. Sweet Rose & Mint, 48h Chilled)"
                      value={newAttrVal}
                      onChange={(e) => setNewAttrVal(e.target.value)}
                      className="flex-1 bg-[#1A1A1A] px-2.5 py-1.5 rounded border border-[#333] text-white"
                    />
                    <button
                      type="button"
                      onClick={handleAddAttribute}
                      className="px-3 py-1.5 rounded bg-[#222] text-gray-200 border border-[#444] hover:bg-[#333]"
                    >
                      + Add
                    </button>
                  </div>

                  {/* Toggles */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 border-t border-[#252525]">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={editingProduct.isTobaccoFree !== false}
                        onChange={(e) => setEditingProduct({ ...editingProduct, isTobaccoFree: e.target.checked })}
                        className="accent-[#2ECC71] w-4 h-4"
                      />
                      <span className="text-gray-300">100% Tobacco-Free</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={!!editingProduct.isBestseller}
                        onChange={(e) => setEditingProduct({ ...editingProduct, isBestseller: e.target.checked })}
                        className="accent-[#D4AF37] w-4 h-4"
                      />
                      <span className="text-gray-300">Best Seller Badge</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={!!editingProduct.isAgeRestricted}
                        onChange={(e) => setEditingProduct({ ...editingProduct, isAgeRestricted: e.target.checked })}
                        className="accent-amber-500 w-4 h-4"
                      />
                      <span className="text-gray-300">Age Restricted (18+)</span>
                    </label>
                  </div>
                </div>

                {/* Submit & Cancel */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-3 border-t border-[#252525]">
                  <div>
                    {editingProduct.id && (
                      <button
                        type="button"
                        onClick={() => {
                          const p = products.find(prod => prod.id === editingProduct.id);
                          if (p) {
                            handleDuplicateProduct(p);
                          }
                        }}
                        className="px-4 py-2 rounded-xl bg-[#201A09] hover:bg-[#D4AF37] text-[#E5C158] hover:text-black border border-[#D4AF37]/50 font-royal font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow cursor-pointer active:scale-95"
                        title="Clone this item as a new product template with new SKU"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        <span>Duplicate as New Product</span>
                      </button>
                    )}
                  </div>

                  <div className="flex items-center justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setIsProductModalOpen(false)}
                      className="px-5 py-2.5 rounded-xl bg-[#222] text-gray-300 hover:text-white cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-7 py-2.5 rounded-xl bg-gradient-to-r from-[#F3D079] via-[#D4AF37] to-[#9B7817] text-black font-royal font-bold shadow-lg hover:brightness-110 flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Save className="w-4 h-4" />
                      <span>{editingProduct.id ? 'Save Product Details' : 'Save & Add Product to Catalog'}</span>
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL: ADD / EDIT CATEGORY */}
        {isCategoryModalOpen && editingCategory && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
            <div className="relative w-full max-w-lg bg-[#121212] rounded-2xl border border-[#C59B27]/50 p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#252525]">
                <h3 className="font-royal text-base font-bold text-[#E5C158]">
                  {editingCategory.id ? 'Edit Menu Category' : 'Add New Menu Category'}
                </h3>
                <button onClick={() => setIsCategoryModalOpen(false)} className="text-gray-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveCategory} className="space-y-4 text-xs">
                <div>
                  <label className="text-gray-300 block mb-1 font-semibold">Category Display Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. HOOKAH / SHISHA, SHISHA FLAVOURS, BONGS & ROLLS"
                    value={editingCategory.displayName || ''}
                    onChange={(e) => setEditingCategory({ ...editingCategory, displayName: e.target.value, name: e.target.value })}
                    className="w-full bg-[#1A1A1A] px-3 py-2 rounded-lg border border-[#333] text-white focus:border-[#D4AF37] uppercase"
                  />
                </div>

                <div>
                  <ImageUploadField
                    label="Category Card & Banner Image"
                    value={editingCategory.image || ''}
                    onChange={(url) => setEditingCategory({ ...editingCategory, image: url })}
                    folder="categories"
                    aspectRatio="video"
                    helperText="Upload category card banner. Saved automatically to /public/uploads/categories/ and takes the path directly on the website and mobile app."
                  />
                </div>

                <div>
                  <label className="text-gray-300 block mb-1 font-semibold">Description</label>
                  <textarea
                    rows={2}
                    placeholder="Brief description shown under category card..."
                    value={editingCategory.description || ''}
                    onChange={(e) => setEditingCategory({ ...editingCategory, description: e.target.value })}
                    className="w-full bg-[#1A1A1A] px-3 py-2 rounded-lg border border-[#333] text-white focus:border-[#D4AF37]"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-3 border-t border-[#252525]">
                  <button
                    type="button"
                    onClick={() => setIsCategoryModalOpen(false)}
                    className="px-4 py-2 rounded-lg bg-[#222] text-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 rounded-lg bg-[#D4AF37] text-black font-royal font-bold"
                  >
                    Save Category
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}


        {/* MODAL: EDIT COUPON WITH FULL AUTHORIZATION & LIMITS */}
        {isCouponModalOpen && editingCoupon && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
            <div className="relative max-w-2xl w-full bg-[#141414] rounded-2xl border border-[#C59B27]/50 p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-3 border-b border-[#2A2A2A]">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#2A2005] border border-[#D4AF37]/40 flex items-center justify-center text-[#E5C158]">
                    <Edit className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-royal text-sm font-bold text-[#E5C158]">
                      Edit Coupon &amp; Authorization Limits
                    </h3>
                    <p className="text-[11px] text-gray-400">Configure discount value, usage rules, and customer eligibility</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => { setIsCouponModalOpen(false); setEditingCoupon(null); }}
                  className="w-7 h-7 rounded-full bg-[#222] text-gray-400 hover:text-white flex items-center justify-center cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSaveCoupon} className="space-y-4 text-xs">
                {/* Row 1: Code & Status */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-gray-300 font-bold block mb-1">Coupon Code *</label>
                    <input
                      type="text"
                      required
                      value={editingCoupon.code}
                      onChange={(e) => setEditingCoupon({ ...editingCoupon, code: e.target.value.toUpperCase().trim() })}
                      className="w-full bg-[#1E1E1E] px-3.5 py-2.5 rounded-xl border border-[#3A3A3A] text-white uppercase font-bold font-mono focus:border-[#D4AF37]"
                    />
                  </div>
                  <div>
                    <label className="text-gray-300 font-bold block mb-1">Coupon Status</label>
                    <select
                      value={editingCoupon.isActive ? 'active' : 'paused'}
                      onChange={(e) => setEditingCoupon({ ...editingCoupon, isActive: e.target.value === 'active' })}
                      className="w-full bg-[#1E1E1E] px-3.5 py-2.5 rounded-xl border border-[#3A3A3A] text-white focus:border-[#D4AF37]"
                    >
                      <option value="active">Active (Available for checkout)</option>
                      <option value="paused">Paused (Temporarily disabled)</option>
                    </select>
                  </div>
                </div>

                {/* Row 2: Discount Type & Cap */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-gray-300 font-bold block mb-1">Discount Type</label>
                    <select
                      value={editingCoupon.discountPercent !== undefined ? 'percent' : 'fixed'}
                      onChange={(e) => {
                        if (e.target.value === 'percent') {
                          setEditingCoupon({
                            ...editingCoupon,
                            discountPercent: editingCoupon.discountPercent || 15,
                            discountAmount: undefined,
                          });
                        } else {
                          setEditingCoupon({
                            ...editingCoupon,
                            discountAmount: editingCoupon.discountAmount || 100,
                            discountPercent: undefined,
                          });
                        }
                      }}
                      className="w-full bg-[#1E1E1E] px-3 py-2 rounded-xl border border-[#3A3A3A] text-white"
                    >
                      <option value="percent">% Percentage</option>
                      <option value="fixed">₹ Fixed Flat</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-gray-300 font-bold block mb-1">
                      {editingCoupon.discountPercent !== undefined ? 'Discount Percentage (%)' : 'Discount Amount (₹)'} *
                    </label>
                    <input
                      type="number"
                      min="1"
                      required
                      value={editingCoupon.discountPercent !== undefined ? editingCoupon.discountPercent : (editingCoupon.discountAmount || 0)}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        if (editingCoupon.discountPercent !== undefined) {
                          setEditingCoupon({ ...editingCoupon, discountPercent: val });
                        } else {
                          setEditingCoupon({ ...editingCoupon, discountAmount: val });
                        }
                      }}
                      className="w-full bg-[#1E1E1E] px-3 py-2 rounded-xl border border-[#3A3A3A] text-white"
                    />
                  </div>

                  <div>
                    <label className="text-gray-300 font-bold block mb-1">Max Cap (₹)</label>
                    <input
                      type="number"
                      min="0"
                      value={editingCoupon.maxDiscountCap || 0}
                      onChange={(e) => setEditingCoupon({ ...editingCoupon, maxDiscountCap: Number(e.target.value) || undefined })}
                      placeholder="0 for unlimited"
                      className="w-full bg-[#1E1E1E] px-3 py-2 rounded-xl border border-[#3A3A3A] text-white"
                    />
                  </div>
                </div>

                {/* Item Scope / Target Selection in Edit Modal */}
                <div className="p-4 rounded-xl bg-[#1A1A1A] border border-[#2E2E2E] space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                    <div className="sm:col-span-4">
                      <label className="text-[#E5C158] font-bold block mb-1">Offer Target Scope</label>
                      <select
                        value={editingCoupon.appliesToType || 'all'}
                        onChange={(e) => {
                          const val = e.target.value as 'all' | 'specific_product' | 'specific_category';
                          setEditingCoupon({
                            ...editingCoupon,
                            appliesToType: val,
                            applicableProductIds: val === 'specific_product' ? (editingCoupon.applicableProductIds?.length ? editingCoupon.applicableProductIds : (products.length ? [products[0].id] : [])) : [],
                            applicableCategoryIds: val === 'specific_category' ? (editingCoupon.applicableCategoryIds?.length ? editingCoupon.applicableCategoryIds : (categories.length ? [categories[0].id] : [])) : [],
                          });
                        }}
                        className="w-full bg-[#242424] px-3 py-2 rounded-xl border border-[#3E3E3E] text-white"
                      >
                        <option value="all">🌐 Storewide (All Products & Shisha)</option>
                        <option value="specific_product">🛍️ Specific Item / Shisha Product</option>
                        <option value="specific_category">📁 Specific Category</option>
                      </select>
                    </div>

                    {editingCoupon.appliesToType === 'specific_product' && (
                      <div className="sm:col-span-8">
                        <label className="text-[#E5C158] font-bold block mb-1">Targeted Item / Product *</label>
                        <select
                          value={editingCoupon.applicableProductIds?.[0] || ''}
                          onChange={(e) => {
                            const selectedId = e.target.value;
                            const foundP = products.find(p => p.id === selectedId);
                            setEditingCoupon({
                              ...editingCoupon,
                              applicableProductIds: [selectedId],
                              targetProductName: foundP?.name,
                            });
                          }}
                          className="w-full bg-[#242424] px-3 py-2 rounded-xl border border-[#3E3E3E] text-white"
                        >
                          {products.map((p) => (
                            <option key={p.id} value={p.id}>
                              {p.name} — ₹{p.price} ({p.category.toUpperCase()})
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    {editingCoupon.appliesToType === 'specific_category' && (
                      <div className="sm:col-span-8">
                        <label className="text-[#E5C158] font-bold block mb-1">Targeted Category *</label>
                        <select
                          value={editingCoupon.applicableCategoryIds?.[0] || ''}
                          onChange={(e) => {
                            const selectedCat = e.target.value;
                            const foundC = categories.find(c => c.id === selectedCat);
                            setEditingCoupon({
                              ...editingCoupon,
                              applicableCategoryIds: [selectedCat],
                              targetCategoryName: foundC?.displayName,
                            });
                          }}
                          className="w-full bg-[#242424] px-3 py-2 rounded-xl border border-[#3E3E3E] text-white"
                        >
                          {categories.map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.displayName} ({c.id})
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>

                  <div className="pt-2 border-t border-[#2A2A2A] flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-[#E5C158]">
                      <input
                        type="checkbox"
                        checked={editingCoupon.eligibility === 'new_user_only' || !!editingCoupon.firstBuyOnly}
                        onChange={(e) => {
                          const checked = e.target.checked;
                          setEditingCoupon({
                            ...editingCoupon,
                            firstBuyOnly: checked,
                            eligibility: checked ? 'new_user_only' : 'all',
                            usageLimitType: checked ? 'once_per_user' : editingCoupon.usageLimitType,
                          });
                        }}
                        className="w-4 h-4 rounded accent-[#D4AF37] cursor-pointer"
                      />
                      <span>⭐ First Buy Offer (Valid ONLY on customer&apos;s 1st order after signup)</span>
                    </label>
                  </div>
                </div>

                {/* Row 3: Customer Eligibility & Usage Frequency Limit */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-[#1A1A1A] border border-[#2E2E2E]">
                  <div>
                    <label className="text-[#E5C158] font-bold block mb-1">Customer Eligibility Restriction *</label>
                    <select
                      value={editingCoupon.eligibility || 'all'}
                      onChange={(e) => {
                        const val = e.target.value as CouponEligibility;
                        setEditingCoupon({
                          ...editingCoupon,
                          eligibility: val,
                          firstBuyOnly: val === 'new_user_only',
                        });
                      }}
                      className="w-full bg-[#242424] px-3 py-2.5 rounded-xl border border-[#3E3E3E] text-white focus:border-[#D4AF37]"
                    >
                      <option value="all">All Customers (Public)</option>
                      <option value="new_user_only">New Users Only (1st Order Account)</option>
                      <option value="referral_only">Referral Exclusive (Invitees & Referrers)</option>
                    </select>
                    <span className="text-[10px] text-gray-400 mt-1 block">
                      {editingCoupon.eligibility === 'new_user_only' && '✓ Valid only on customer\'s first order after signup'}
                      {editingCoupon.eligibility === 'referral_only' && '✓ Valid for referred customers & referrer credit'}
                      {editingCoupon.eligibility === 'all' && '✓ Anyone can apply this coupon'}
                    </span>
                  </div>

                  <div>
                    <label className="text-[#E5C158] font-bold block mb-1">Usage Frequency Limit *</label>
                    <select
                      value={editingCoupon.usageLimitType || 'unlimited'}
                      onChange={(e) => setEditingCoupon({ ...editingCoupon, usageLimitType: e.target.value as CouponUsageLimitType })}
                      className="w-full bg-[#242424] px-3 py-2.5 rounded-xl border border-[#3E3E3E] text-white focus:border-[#D4AF37]"
                    >
                      <option value="unlimited">Unlimited Redemptions</option>
                      <option value="once_per_user">Once Ever Per Customer (1-Time)</option>
                      <option value="once_per_month">Once Per Customer Per Month</option>
                      <option value="custom_limit">Custom Times Per Customer</option>
                    </select>
                    <span className="text-[10px] text-gray-400 mt-1 block">
                      {editingCoupon.usageLimitType === 'once_per_month' && '✓ Automatically allows reuse every 30 days'}
                      {editingCoupon.usageLimitType === 'once_per_user' && '✓ Locked after 1st redemption'}
                      {editingCoupon.usageLimitType === 'unlimited' && '✓ Can be used multiple times by same customer'}
                    </span>
                  </div>
                </div>

                {/* Row 4: Advanced Limits & Conditions */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-gray-300 font-bold block mb-1">Min Order Value (₹)</label>
                    <input
                      type="number"
                      min="0"
                      value={editingCoupon.minOrderValue || 0}
                      onChange={(e) => setEditingCoupon({ ...editingCoupon, minOrderValue: Number(e.target.value) })}
                      className="w-full bg-[#1E1E1E] px-3 py-2 rounded-xl border border-[#3A3A3A] text-white"
                    />
                  </div>

                  <div>
                    <label className="text-gray-300 font-bold block mb-1">Total Overall Cap</label>
                    <input
                      type="number"
                      min="0"
                      value={editingCoupon.maxTotalUsageLimit || 0}
                      onChange={(e) => setEditingCoupon({ ...editingCoupon, maxTotalUsageLimit: Number(e.target.value) || undefined })}
                      placeholder="e.g. 100"
                      className="w-full bg-[#1E1E1E] px-3 py-2 rounded-xl border border-[#3A3A3A] text-white"
                    />
                    <span className="text-[10px] text-gray-500">First X users total</span>
                  </div>

                  <div>
                    <label className="text-gray-300 font-bold block mb-1">Expiry Date (Optional)</label>
                    <input
                      type="date"
                      value={editingCoupon.expiryDate || ''}
                      onChange={(e) => setEditingCoupon({ ...editingCoupon, expiryDate: e.target.value || undefined })}
                      className="w-full bg-[#1E1E1E] px-3 py-2 rounded-xl border border-[#3A3A3A] text-white"
                    />
                  </div>
                </div>

                {editingCoupon.eligibility === 'referral_only' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 rounded-xl bg-cyan-950/30 border border-cyan-500/30">
                    <div>
                      <label className="text-cyan-300 font-bold block mb-1">Referral Code Tag</label>
                      <input
                        type="text"
                        value={editingCoupon.referralCode || ''}
                        onChange={(e) => setEditingCoupon({ ...editingCoupon, referralCode: e.target.value.toUpperCase() })}
                        placeholder="e.g. RAHUL-REF"
                        className="w-full bg-[#1E1E1E] px-3 py-2 rounded-xl border border-cyan-500/50 text-white uppercase"
                      />
                    </div>
                    <div>
                      <label className="text-cyan-300 font-bold block mb-1">Referrer Bonus (₹)</label>
                      <input
                        type="number"
                        min="0"
                        value={editingCoupon.referrerBonusAmount || 0}
                        onChange={(e) => setEditingCoupon({ ...editingCoupon, referrerBonusAmount: Number(e.target.value) || undefined })}
                        placeholder="e.g. 50"
                        className="w-full bg-[#1E1E1E] px-3 py-2 rounded-xl border border-cyan-500/50 text-white"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="text-gray-300 font-bold block mb-1">Offer Tagline / Terms Description</label>
                  <input
                    type="text"
                    value={editingCoupon.description || ''}
                    onChange={(e) => setEditingCoupon({ ...editingCoupon, description: e.target.value })}
                    placeholder="e.g. ₹100 Flat discount on first order for new accounts"
                    className="w-full bg-[#1E1E1E] px-3.5 py-2.5 rounded-xl border border-[#3A3A3A] text-white"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-3 border-t border-[#2A2A2A]">
                  <button
                    type="button"
                    onClick={() => { setIsCouponModalOpen(false); setEditingCoupon(null); }}
                    className="px-4 py-2 bg-[#222] text-gray-300 rounded-xl hover:text-white cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-gradient-to-r from-[#F3D079] via-[#D4AF37] to-[#B38C1B] text-black font-royal font-bold rounded-xl hover:brightness-110 shadow-lg cursor-pointer flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Coupon &amp; Authorization</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL: DELETE COUPON CONFIRMATION */}
        {couponToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
            <div className="relative max-w-md w-full bg-[#161616] rounded-2xl border border-red-500/50 p-6 space-y-4 shadow-2xl">
              <div className="flex items-center gap-3 pb-3 border-b border-[#2A2A2A]">
                <div className="w-10 h-10 rounded-xl bg-red-950/80 border border-red-500/40 flex items-center justify-center text-red-400">
                  <Trash2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-royal text-sm font-bold text-white">Delete Coupon Offer?</h3>
                  <p className="text-xs text-gray-400">This coupon will be removed immediately from checkout.</p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#1F1414] border border-red-900/40 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-400">Coupon Code:</span>
                  <span className="font-mono font-bold text-amber-300">{couponToDelete.code}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Discount:</span>
                  <span className="text-white font-bold">
                    {couponToDelete.discountPercent ? `${couponToDelete.discountPercent}% OFF` : `₹${couponToDelete.discountAmount} OFF`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Eligibility:</span>
                  <span className="text-gray-300 capitalize">{couponToDelete.eligibility?.replace(/_/g, ' ') || 'All customers'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Usage Limit:</span>
                  <span className="text-gray-300 capitalize">{couponToDelete.usageLimitType?.replace(/_/g, ' ') || 'Unlimited'}</span>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setCouponToDelete(null)}
                  className="px-4 py-2 rounded-xl bg-[#222] text-gray-300 hover:text-white text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    deleteCoupon(couponToDelete.id || couponToDelete.code);
                    setCouponToDelete(null);
                  }}
                  className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold font-royal flex items-center gap-1.5 shadow-lg cursor-pointer active:scale-95 transition-all"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Coupon</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL: ORDER ACTION (REJECT & MOVE BACKWARD WITH COMMENT & REASONS) */}
        {orderActionModal.isOpen && orderActionModal.order && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
            <div className="relative max-w-lg w-full bg-[#161616] rounded-2xl border border-[#C59B27]/50 p-6 space-y-5 shadow-2xl shadow-black/90">
              {/* Modal Header */}
              <div className="flex items-center justify-between pb-3 border-b border-[#333]">
                <div className="flex items-center gap-2.5">
                  {orderActionModal.actionType === 'reject' ? (
                    <div className="w-9 h-9 rounded-xl bg-red-500/20 border border-red-500/40 flex items-center justify-center">
                      <AlertTriangle className="w-5 h-5 text-red-400" />
                    </div>
                  ) : (
                    <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center">
                      <RotateCcw className="w-5 h-5 text-amber-400" />
                    </div>
                  )}
                  <div>
                    <h3 className="font-royal text-sm font-bold text-white">
                      {orderActionModal.actionType === 'reject'
                        ? `Reject & Cancel Order #${orderActionModal.order.orderNumber}`
                        : `Move Order #${orderActionModal.order.orderNumber} Backward`}
                    </h3>
                    <p className="text-[11px] text-gray-400">
                      {orderActionModal.actionType === 'reject'
                        ? 'Provide a mandatory reason/comment for cancelling this order'
                        : `Moving backward to: ${orderActionModal.targetStageName}`}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setOrderActionModal({
                      isOpen: false,
                      order: null,
                      actionType: 'reject',
                      targetStatus: 'cancelled',
                      targetStageName: '',
                      comment: '',
                    })
                  }
                  className="w-8 h-8 rounded-full bg-[#222] text-gray-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Order Quick Context Summary */}
              <div className="bg-[#0F0F0F] p-3.5 rounded-xl border border-[#2A2A2A] text-xs space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Customer:</span>
                  <span className="font-bold text-white">
                    {orderActionModal.order.shippingAddress.fullName} ({orderActionModal.order.shippingAddress.phone})
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Current Status:</span>
                  <span className="font-mono text-amber-300 font-bold uppercase text-[11px]">
                    {orderActionModal.order.status.replace('_', ' ')}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Total Value:</span>
                  <span className="font-royal font-bold text-[#E5C158]">₹{orderActionModal.order.total}</span>
                </div>
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-gray-400">Delivery Address:</span>
                  <span className="text-gray-300 truncate max-w-[240px]">
                    {orderActionModal.order.shippingAddress.addressLine1}, {orderActionModal.order.shippingAddress.city}
                  </span>
                </div>
              </div>

              {/* Form with Preset Reasons & Comment Textarea */}
              <form onSubmit={handleConfirmOrderAction} className="space-y-4 text-xs">
                <div>
                  <label className="text-gray-300 font-semibold block mb-1.5 flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>Select Quick Reason Preset or Type Below:</span>
                  </label>
                  
                  {/* Preset Quick Chips */}
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {orderActionModal.actionType === 'reject' ? (
                      <>
                        {[
                          'Customer requested order cancellation',
                          'Delivery location unreachable / out of delivery zone',
                          'Fresh ingredients unavailable / Out of stock',
                          'Suspected invalid UPI / payment unverified',
                          'Duplicate order placed by customer',
                          'Order accepted by mistake (error rectification)',
                        ].map((preset, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setOrderActionModal({ ...orderActionModal, comment: preset })}
                            className={`px-2.5 py-1 rounded-lg text-[10px] border transition-all text-left ${
                              orderActionModal.comment === preset
                                ? 'bg-red-500/20 text-red-200 border-red-500/60 font-bold'
                                : 'bg-[#1A1A1A] text-gray-400 hover:text-white border-[#333] hover:border-gray-500'
                            }`}
                          >
                            {preset}
                          </button>
                        ))}
                      </>
                    ) : (
                      <>
                        {[
                          'Severe weather / Climatic rain & storm delay',
                          'Customer address not found / Customer phone unreachable',
                          'Express delivery vehicle breakdown / Courier delay',
                          'Order rectification (accepted by mistake)',
                          'Quality check re-inspection & vault re-packaging',
                          'Customer requested delayed delivery time slot',
                        ].map((preset, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setOrderActionModal({ ...orderActionModal, comment: preset })}
                            className={`px-2.5 py-1 rounded-lg text-[10px] border transition-all text-left ${
                              orderActionModal.comment === preset
                                ? 'bg-amber-500/20 text-amber-200 border-amber-500/60 font-bold'
                                : 'bg-[#1A1A1A] text-gray-400 hover:text-white border-[#333] hover:border-gray-500'
                            }`}
                          >
                            {preset}
                          </button>
                        ))}
                      </>
                    )}
                  </div>

                  <textarea
                    required
                    rows={3}
                    value={orderActionModal.comment}
                    onChange={(e) => setOrderActionModal({ ...orderActionModal, comment: e.target.value })}
                    placeholder={
                      orderActionModal.actionType === 'reject'
                        ? 'e.g., Customer called to cancel order, or unserviceable pin code...'
                        : 'e.g., Heavy rain storm in South Delhi causing 45-min transit delay, or address not found...'
                    }
                    className="w-full bg-[#1A1A1A] px-3.5 py-2.5 rounded-xl border border-[#3A3A3A] focus:border-[#D4AF37] text-white text-xs placeholder:text-gray-500 outline-none"
                  />
                  <p className="text-[10px] text-gray-400 mt-1 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-[#D4AF37]" />
                    <span>This comment will be recorded in customer Live Order Tracking &amp; timeline logs.</span>
                  </p>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3 pt-3 border-t border-[#333]">
                  <button
                    type="button"
                    onClick={() =>
                      setOrderActionModal({
                        isOpen: false,
                        order: null,
                        actionType: 'reject',
                        targetStatus: 'cancelled',
                        targetStageName: '',
                        comment: '',
                      })
                    }
                    className="px-4 py-2 bg-[#222] text-gray-300 rounded-xl hover:text-white font-royal text-xs transition-colors cursor-pointer"
                  >
                    Dismiss / Keep As Is
                  </button>
                  <button
                    type="submit"
                    className={`px-5 py-2 rounded-xl font-royal font-bold text-xs flex items-center gap-2 cursor-pointer transition-all shadow-lg ${
                      orderActionModal.actionType === 'reject'
                        ? 'bg-red-600 hover:bg-red-500 text-white shadow-red-900/40'
                        : 'bg-gradient-to-r from-[#D4AF37] to-[#B38C1B] hover:brightness-110 text-black shadow-amber-900/40'
                    }`}
                  >
                    {orderActionModal.actionType === 'reject' ? (
                      <>
                        <X className="w-4 h-4" />
                        <span>Confirm Order Rejection</span>
                      </>
                    ) : (
                      <>
                        <RotateCcw className="w-4 h-4" />
                        <span>Confirm Move Backward</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL: DEDICATED COMBO PACKAGE EDITOR */}
        {isComboModalOpen && editingComboItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in">
            <div className="relative w-full max-w-2xl bg-[#121212] rounded-2xl border border-[#D4AF37]/50 shadow-[0_16px_50px_rgba(0,0,0,0.95)] overflow-hidden my-auto max-h-[90vh] flex flex-col">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-5 bg-[#181818] border-b border-[#252525]">
                <div className="flex items-center gap-2.5">
                  <Sparkles className="w-5 h-5 text-[#E5C158]" />
                  <h3 className="font-royal text-lg font-bold text-white uppercase tracking-wider">
                    {products.some((p) => p.id === editingComboItem.id) ? 'Edit Combo Package' : 'Create New Combo Package'}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setIsComboModalOpen(false);
                    setEditingComboItem(null);
                  }}
                  className="text-gray-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 overflow-y-auto space-y-5 text-xs">
                {/* Row 1: Combo Name & SKU */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2">
                    <label className="text-gray-300 font-bold block mb-1">
                      Combo Package Title *
                    </label>
                    <input
                      type="text"
                      value={editingComboItem.name || ''}
                      onChange={(e) => setEditingComboItem({ ...editingComboItem, name: e.target.value })}
                      placeholder="e.g. The Royal Sovereign Shisha Set"
                      className="w-full bg-[#1A1A1A] text-xs px-3.5 py-2.5 rounded-xl border border-[#3A3A3A] text-white focus:border-[#D4AF37]"
                    />
                  </div>
                  <div>
                    <label className="text-gray-300 font-bold block mb-1">
                      SKU Code
                    </label>
                    <input
                      type="text"
                      value={editingComboItem.sku || ''}
                      onChange={(e) => setEditingComboItem({ ...editingComboItem, sku: e.target.value.toUpperCase() })}
                      placeholder="e.g. QP-CMB-001"
                      className="w-full bg-[#1A1A1A] text-xs px-3 py-2.5 rounded-xl border border-[#3A3A3A] text-white uppercase focus:border-[#D4AF37]"
                    />
                  </div>
                </div>

                {/* Row 2: Category & Subcategory */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-gray-300 font-bold block mb-1">
                      Primary Category
                    </label>
                    <select
                      value={editingComboItem.category || 'combos'}
                      onChange={(e) => setEditingComboItem({ ...editingComboItem, category: e.target.value as any })}
                      className="w-full bg-[#1A1A1A] text-xs px-3 py-2.5 rounded-xl border border-[#3A3A3A] text-white focus:border-[#D4AF37]"
                    >
                      <option value="combos">Combos &amp; Gift Sets</option>
                      <option value="hookah">Hookahs</option>
                      <option value="flavours">Flavours</option>
                      <option value="bongs_rolls">Bongs &amp; Rolls</option>
                      <option value="lighters_ashtray">Lighters &amp; Ashtrays</option>
                      <option value="fragrances">Fragrances</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-gray-300 font-bold block mb-1">
                      Subcategory Tag
                    </label>
                    <input
                      type="text"
                      value={editingComboItem.subcategory || ''}
                      onChange={(e) => setEditingComboItem({ ...editingComboItem, subcategory: e.target.value })}
                      placeholder="e.g. Luxury Lounge Box, Starter Kit"
                      className="w-full bg-[#1A1A1A] text-xs px-3 py-2.5 rounded-xl border border-[#3A3A3A] text-white focus:border-[#D4AF37]"
                    />
                  </div>
                </div>

                {/* Row 3: Cover Image Upload */}
                <div>
                  <ImageUploadField
                    label="Combo Cover Banner Image"
                    value={editingComboItem.images && editingComboItem.images[0] ? editingComboItem.images[0] : ''}
                    onChange={(url) => setEditingComboItem({ ...editingComboItem, images: [url] })}
                    folder="products"
                    aspectRatio="video"
                    helperText="Upload custom photo or paste image URL for this combo deal"
                  />
                </div>

                {/* Row 4: Short Description */}
                <div>
                  <label className="text-gray-300 font-bold block mb-1">
                    Short Subtitle (Shows on Card)
                  </label>
                  <input
                    type="text"
                    value={editingComboItem.shortDescription || ''}
                    onChange={(e) => setEditingComboItem({ ...editingComboItem, shortDescription: e.target.value })}
                    placeholder="e.g. Complete 24K Gold Hookah set + 2x Herbal Molasses + Coal + Lighter"
                    className="w-full bg-[#1A1A1A] text-xs px-3.5 py-2.5 rounded-xl border border-[#3A3A3A] text-white focus:border-[#D4AF37]"
                  />
                </div>

                {/* Row 5: Included Bundled Items List */}
                <div className="p-4 rounded-xl bg-[#181818] border border-[#2B2B2A] space-y-3">
                  <label className="text-[#E5C158] font-royal font-bold text-xs block">
                    Bundled Included Items List ({editingComboItem.ingredients?.length || 0})
                  </label>
                  
                  <div className="flex gap-2">
                    <input
                      id="combo-bundled-item-input"
                      type="text"
                      value={newComboIncludedItemInput}
                      onChange={(e) => setNewComboIncludedItemInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          e.stopPropagation();
                          if (newComboIncludedItemInput.trim()) {
                            const current = editingComboItem.ingredients || [];
                            const newItem = newComboIncludedItemInput.trim();
                            setEditingComboItem({
                              ...editingComboItem,
                              ingredients: [...current, newItem],
                            });
                            setNewComboIncludedItemInput('');
                            showToast(`Added: "${newItem}" to the bundle list!`, 'success');
                          } else {
                            showToast('Please type an item name first in the text box!', 'warning');
                          }
                        }
                      }}
                      placeholder="e.g. 1x 24K Gold Plated Hookah Set (press Enter)"
                      className="flex-1 bg-[#121212] text-xs px-3 py-2 rounded-xl border border-[#3A3A3A] text-white focus:border-[#D4AF37]"
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (newComboIncludedItemInput.trim()) {
                          const current = editingComboItem.ingredients || [];
                          const newItem = newComboIncludedItemInput.trim();
                          setEditingComboItem({
                            ...editingComboItem,
                            ingredients: [...current, newItem],
                          });
                          setNewComboIncludedItemInput('');
                          showToast(`Added: "${newItem}" to the bundle list!`, 'success');
                          // Refocus the input for excellent UX
                          document.getElementById('combo-bundled-item-input')?.focus();
                        } else {
                          showToast('Please type an item name first in the text box!', 'warning');
                        }
                      }}
                      className="px-4 py-2 rounded-xl bg-[#201A0B] text-[#D4AF37] border border-[#D4AF37]/50 font-bold text-xs hover:bg-[#D4AF37] hover:text-black cursor-pointer transition-all"
                    >
                      + Add Item
                    </button>
                  </div>

                  {editingComboItem.ingredients && editingComboItem.ingredients.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-1">
                      {editingComboItem.ingredients.map((item, idx) => (
                        <span
                          key={idx}
                          className="text-xs bg-[#222] text-gray-200 px-2.5 py-1 rounded-lg border border-[#333] flex items-center gap-1.5"
                        >
                          <span>✓ {item}</span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              const updated = editingComboItem.ingredients?.filter((_, i) => i !== idx);
                              setEditingComboItem({ ...editingComboItem, ingredients: updated });
                              showToast('Item removed from bundle list.', 'info');
                            }}
                            className="text-gray-400 hover:text-red-400 transition-colors cursor-pointer"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Row 6: Pricing & Inventory */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-[#181818] border border-[#2B2B2A]">
                  <div>
                    <label className="text-gray-300 font-bold block mb-1">
                      Combo Selling Price (₹) *
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={editingComboItem.price || 0}
                      onChange={(e) => setEditingComboItem({ ...editingComboItem, price: Number(e.target.value) })}
                      className="w-full bg-[#121212] text-xs px-3 py-2 rounded-xl border border-[#3A3A3A] text-amber-300 font-bold focus:border-[#D4AF37]"
                    />
                  </div>
                  <div>
                    <label className="text-gray-300 font-bold block mb-1">
                      Original Total MRP (₹)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={editingComboItem.mrp || 0}
                      onChange={(e) => setEditingComboItem({ ...editingComboItem, mrp: Number(e.target.value) })}
                      className="w-full bg-[#121212] text-xs px-3 py-2 rounded-xl border border-[#3A3A3A] text-white focus:border-[#D4AF37]"
                    />
                  </div>
                  <div>
                    <label className="text-gray-300 font-bold block mb-1">
                      Cost / Buy Price (₹)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={editingComboItem.buyPrice || 0}
                      onChange={(e) => setEditingComboItem({ ...editingComboItem, buyPrice: Number(e.target.value) })}
                      className="w-full bg-[#121212] text-xs px-3 py-2 rounded-xl border border-[#3A3A3A] text-white focus:border-[#D4AF37]"
                    />
                  </div>
                  <div>
                    <label className="text-gray-300 font-bold block mb-1">
                      Stock Quantity
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={editingComboItem.stock || 0}
                      onChange={(e) => setEditingComboItem({ ...editingComboItem, stock: Number(e.target.value) })}
                      className="w-full bg-[#121212] text-xs px-3 py-2 rounded-xl border border-[#3A3A3A] text-emerald-400 font-bold focus:border-[#D4AF37]"
                    />
                  </div>
                </div>

                {/* Row 7: Flags & Toggles */}
                <div className="flex flex-wrap items-center gap-4 pt-1">
                  <label className="flex items-center gap-2 text-xs text-gray-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={!!editingComboItem.isBestseller}
                      onChange={(e) => setEditingComboItem({ ...editingComboItem, isBestseller: e.target.checked })}
                      className="w-4 h-4 accent-[#D4AF37]"
                    />
                    <span>Mark as Best Seller</span>
                  </label>

                  <label className="flex items-center gap-2 text-xs text-gray-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={!!editingComboItem.isFeatured}
                      onChange={(e) => setEditingComboItem({ ...editingComboItem, isFeatured: e.target.checked })}
                      className="w-4 h-4 accent-[#D4AF37]"
                    />
                    <span>Featured on Home Banner</span>
                  </label>

                  <label className="flex items-center gap-2 text-xs text-gray-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={!!editingComboItem.isOffer}
                      onChange={(e) => setEditingComboItem({ ...editingComboItem, isOffer: e.target.checked })}
                      className="w-4 h-4 accent-[#D4AF37]"
                    />
                    <span>Special Promotional Deal</span>
                  </label>

                  <label className="flex items-center gap-2 text-xs text-[#2ECC71] font-semibold cursor-pointer">
                    <input
                      type="checkbox"
                      checked={!!editingComboItem.isTobaccoFree}
                      onChange={(e) => setEditingComboItem({ ...editingComboItem, isTobaccoFree: e.target.checked })}
                      className="w-4 h-4 accent-[#2ECC71]"
                    />
                    <span>100% Herbal &amp; Nicotine-Free</span>
                  </label>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-4 bg-[#181818] border-t border-[#252525] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsComboModalOpen(false);
                    setEditingComboItem(null);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-[#222] text-gray-300 hover:text-white font-medium text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveCombo}
                  className="px-7 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-[#D4AF37] text-black font-royal font-bold text-xs shadow-lg hover:brightness-110 active:scale-95 cursor-pointer transition-all flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>SAVE &amp; UPDATE COMBO</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL: EXCEL & CSV BULK IMPORT / EXPORT SUITE */}
        <ProductExcelModal
          isOpen={isExcelModalOpen}
          onClose={() => setIsExcelModalOpen(false)}
        />

        {/* MODAL: UNIVERSAL PRODUCT RECOVERY & DATA PROTECTION */}
        <ProductRecoveryModal
          isOpen={isRecoveryModalOpen}
          onClose={() => setIsRecoveryModalOpen(false)}
        />

        {/* MODAL: QUICK PASTE 7 AM PRODUCTS */}
        <QuickPasteProductModal
          isOpen={isQuickPasteModalOpen}
          onClose={() => setIsQuickPasteModalOpen(false)}
        />

        {/* REUSABLE CONFIRMATION MODAL */}
        <ConfirmModal
          isOpen={confirmModalConfig.isOpen}
          title={confirmModalConfig.title}
          message={confirmModalConfig.message}
          confirmText={confirmModalConfig.confirmText}
          variant={confirmModalConfig.variant}
          onConfirm={confirmModalConfig.onConfirm}
          onClose={() => setConfirmModalConfig((prev) => ({ ...prev, isOpen: false }))}
        />

      </div>
    </div>
  );
};
