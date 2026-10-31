export type ProductCategory = 
  | 'hookah'
  | 'flavours'
  | 'bongs_rolls'
  | 'lighters_ashtray'
  | 'fragrances'
  | 'combos'
  | 'offers'
  | string;

export interface ProductVariant {
  id: string;
  name: string;
  price: number;
  mrp: number;
  stock: number;
  buyPrice?: number;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  slug?: string;
  category: ProductCategory;
  subcategory?: string;
  description: string;
  shortDescription: string;
  images: string[];
  price: number; // Selling price
  mrp: number; // Maximum retail price
  buyPrice?: number; // Cost / Wholesale purchase price
  discountPercent: number;
  stock: number;
  isBestseller?: boolean;
  isFeatured?: boolean;
  isOffer?: boolean;
  isTobaccoFree?: boolean;
  rating: number;
  reviewCount: number;
  attributes?: Record<string, string>;
  isAgeRestricted?: boolean;
  variants?: ProductVariant[];
  ingredients?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CategoryItem {
  id: ProductCategory;
  name: string;
  displayName: string;
  image: string;
  itemCount: number;
  iconName: string;
  description: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedVariant?: ProductVariant;
}

export interface UserAddress {
  id: string;
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  landmark?: string;
  isDefault: boolean;
  type: 'home' | 'work' | 'other';
  liveLocation?: {
    latitude: number;
    longitude: number;
    accuracy?: number;
    mapUrl?: string;
    detectedAddress?: string;
  };
  gpsLocation?: {
    latitude: number;
    longitude: number;
    accuracy?: number;
    mapUrl?: string;
    detectedAddress?: string;
  };
  locationUploadDoc?: string; // Image or receipt upload for landmark/gate/location proof
}

export interface OrderItem {
  productId: string;
  productName: string;
  productImage: string;
  price: number;
  quantity: number;
  variantName?: string;
}

export type OrderStatus = 
  | 'payment_verification'
  | 'pending'
  | 'confirmed'
  | 'packed'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled';

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  couponCode?: string;
  deliveryCharge: number;
  tax: number;
  platformFee?: number;
  total: number;
  status: OrderStatus;
  shippingAddress: UserAddress;
  paymentMethod: 'online' | 'cod' | 'upi' | 'bank';
  paymentStatus: 'pending' | 'pending_verification' | 'completed' | 'refunded' | 'rejected';
  createdAt: string;
  deliveryEstimate: string;
  trackingUpdates: {
    status: OrderStatus;
    timestamp: string;
    message: string;
  }[];
  // Direct UPI Verification & Approval Tracking
  upiTransactionId?: string;
  upiScreenshotUrl?: string;
  upiVerifiedByAdmin?: boolean;
  upiVerifiedAt?: string;
  upiVerifiedBy?: string;
  upiVerificationNotes?: string;
  isOrderRequest?: boolean;
}

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  phone: string;
  role: 'customer' | 'admin' | 'superadmin';
  addresses: UserAddress[];
  isAgeVerified: boolean;
  avatarUrl?: string;
  createdAt: string;
  // 18+ Government PAN Card Verification & Photo Document for Age Proof
  panNumber?: string;
  panHolderName?: string;
  panDob?: string;
  panVerified?: boolean;
  panVerifiedAt?: string;
  panProofUrl?: string; // Uploaded PAN Card Image / Photo for Age Proof
  profileCompleted?: boolean;
  // Admin & CRM analytics
  customerType?: 'new' | 'old';
  totalOrdersCount?: number;
  totalSpent?: number;
  // Security & Password Credentials
  password?: string;
  lastPasswordChangedAt?: string;
}

export type CouponEligibility = 'all' | 'new_user_only' | 'referral_only';
export type CouponUsageLimitType = 'unlimited' | 'once_per_user' | 'once_per_month' | 'custom_limit';
export type CouponAppliesToType = 'all' | 'specific_product' | 'specific_category';

export interface Coupon {
  id?: string;
  code: string;
  discountPercent?: number;
  discountAmount?: number;
  maxDiscountCap?: number; // e.g. Maximum discount cap in ₹
  minOrderValue: number;
  description: string;
  isActive: boolean;
  
  // Product & Category Specific Offers (e.g. First Buy on specific hookah/flavour)
  appliesToType?: CouponAppliesToType; // 'all' | 'specific_product' | 'specific_category'
  applicableProductIds?: string[]; // Specific product ID(s)
  applicableCategoryIds?: string[]; // Specific category ID(s)
  targetProductName?: string; // Friendly product title
  targetCategoryName?: string; // Friendly category title

  // Authorization & Eligibility Limits
  eligibility: CouponEligibility; // Who can use: all, new users only (First Buy), referral only, etc.
  firstBuyOnly?: boolean; // Explicit First Buy flag
  usageLimitType: CouponUsageLimitType; // Frequency: unlimited, once ever, once a month, or custom limit
  maxUsagePerUser?: number; // e.g. 1, 2, 3 times
  maxTotalUsageLimit?: number; // e.g. first 100 overall customers
  usedCount?: number; // current redemption count
  expiryDate?: string; // YYYY-MM-DD
  startDate?: string; // YYYY-MM-DD
  referralCode?: string; // Optional referral tag
  referrerBonusAmount?: number; // Bonus credit given to referring user
}

export interface HeroSlide {
  id: string;
  image: string;
  tagline: string;
  ctaText: string;
  announcement: string;
}

export interface HomepageConfig {
  heroTitle: string;
  heroSubtitle: string;
  heroTagline: string;
  heroCtaText: string;
  heroImage: string;
  announcementText: string;
  slides?: HeroSlide[];
  enableDiscreetPackagingBadge: boolean;
  footerPhone: string;
  footerEmail: string;
  footerAddress: string;
}

export interface PaymentConfig {
  // Master UPI Configuration
  upiEnabled: boolean;
  upiId: string;
  payeeName: string;
  merchantCode?: string;
  customQrImageUrl?: string;
  useDynamicQr: boolean;
  enableUpiIntentApps: boolean;
  upiInstructionNote?: string;

  // Direct Bank Transfer (NEFT/RTGS/IMPS)
  bankTransferEnabled: boolean;
  bankAccountName: string;
  bankName: string;
  bankAccountNumber: string;
  bankIfscCode: string;
  bankBranch: string;
  bankAccountType: string;

  // Cash on Delivery (COD)
  codEnabled: boolean;
  codExtraCharge: number;
  codMinOrderAmount: number;
  codMaxOrderAmount: number;
  codInstructions?: string;

  // Cards / NetBanking / Gateway
  cardOnlineEnabled: boolean;
  gatewayMode: 'live' | 'test' | 'maintenance';
  gatewayNotice?: string;

  // GST & Government Tax Configuration (Default: Disabled / 0%)
  enableGst: boolean;
  gstPercentage: number;
  taxLabel?: string;

  // Platform & Convenience Fee
  enablePlatformFee: boolean;
  platformFeeAmount: number;
  platformFeeLabel?: string;

  // Delivery Charges & Threshold Rules
  enableDeliveryCharge: boolean;
  baseDeliveryCharge: number;
  freeDeliveryAboveAmount: number;
  enableNearbyFreeDelivery: boolean;
  nearbyFreeDeliveryNote?: string;

  // Admin Verification Policy & Support
  adminVerificationName: string;
  adminContactPhone: string;
  adminVerificationMessage: string;

  // Payment Bifurcation & Split Tranche Configuration (To bypass high-ticket transaction fees)
  enablePaymentBifurcation?: boolean;
  bifurcationThreshold?: number; // Minimum cart amount to enable tranche splitting (e.g. ₹2000)
  bifurcationMaxTranche?: number; // Maximum limit per tranche (e.g. ₹1900 to stay under ₹2000 threshold)
  bifurcationNote?: string;
}

export type KnowledgeDocType = 'pdf' | 'text' | 'document' | 'image' | 'whats_new' | 'faq';

export interface KnowledgeDocument {
  id: string;
  title: string;
  type: KnowledgeDocType;
  content: string; // Extracted / formatted text for RAG retrieval
  summary?: string;
  category?: string;
  tags?: string[];
  fileName?: string;
  fileSize?: number;
  fileUrl?: string; // If image or pdf preview
  imageData?: string; // Base64 if image uploaded
  createdAt: string;
  updatedAt: string;
  active: boolean;
}

export interface ChatbotConfig {
  enabled: boolean;
  botName: string;
  botTitle: string;
  welcomeMessage: string;
  systemPersona: string;
  tone: 'professional' | 'friendly' | 'luxury_concierge' | 'support_assistant';
  suggestedQuestions: string[];
  allowImageUploads: boolean;
  autoOpenOnFirstVisit: boolean;
  collectUserContact: boolean;
  fallbackEmail: string;
  whatsappSupportNumber: string;
  ragTopK: number; // Number of relevant chunks retrieved
  updatedAt: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot' | 'system';
  text: string;
  timestamp: string;
  sources?: {
    title: string;
    type: KnowledgeDocType;
    snippet: string;
  }[];
  suggestedActions?: string[];
  productCards?: {
    id: string;
    name: string;
    price: number;
    image: string;
    category: string;
  }[];
}

// ==========================================
// ADVERTISEMENT MEDIA & SHOWCASE TYPES
// ==========================================
export type AdMediaType = 'video' | 'gif' | 'image';

export interface AdvertisementItem {
  id: string;
  title: string;
  subtitle: string;
  badgeText?: string;
  badgeColor?: 'gold' | 'rose' | 'emerald' | 'cyan' | 'purple' | 'amber';
  mediaType: AdMediaType;
  mediaUrl: string; // Direct MP4 / WebM / GIF URL or data: URL
  thumbnailUrl?: string;
  linkUrl?: string; // Target page e.g. 'shop', 'combos', 'hookah', 'flavours' or custom URL
  ctaText?: string; // e.g. 'Explore Collection', 'Claim 50% Off', 'Watch Reel'
  isActive: boolean;
  autoplay?: boolean;
  loop?: boolean;
  muted?: boolean;
  displayOrder: number;
  tagline?: string;
  likesCount?: number;
  createdAt: string;
}

export interface AdvertisementConfig {
  enabled: boolean;
  sectionTitle: string;
  sectionSubtitle: string;
  bannerBadge: string;
  layoutStyle: 'grid_cards' | 'featured_cinematic' | 'reels_story' | 'split_showcase';
  autoRotateSeconds?: number;
  items: AdvertisementItem[];
}

// ==========================================
// ROLE-BASED ACCESS CONTROL (RBAC) & PANEL TRANSFER TYPES
// ==========================================
export type AdminPanelTabId = 
  | 'orders' 
  | 'products' 
  | 'combos' 
  | 'customers' 
  | 'inventory' 
  | 'categories' 
  | 'analytics' 
  | 'coupons' 
  | 'payments' 
  | 'chatbot' 
  | 'ads' 
  | 'roles' 
  | 'cms';

export interface TabPermission {
  tabId: AdminPanelTabId;
  canView: boolean;
  canEdit: boolean;
}

export interface AdminRole {
  id: string;
  name: string;
  description: string;
  color: 'amber' | 'emerald' | 'blue' | 'purple' | 'rose' | 'indigo';
  isSystemDefault?: boolean; // Master Super Admin cannot be removed
  accessibleTabs: AdminPanelTabId[];
  permissions?: Record<AdminPanelTabId, { canView: boolean; canEdit: boolean }>;
  createdAt: string;
  updatedAt?: string;
}

export interface AdminStaffUser {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  roleId: string; // Associated role id
  password?: string; // Staff login credential
  accessPin?: string; // Quick 4-6 digit login PIN
  isActive: boolean;
  createdAt: string;
  lastLoginAt?: string;
  delegatedTabs?: AdminPanelTabId[]; // Directly transferred/shared panel tabs
  notes?: string;
}

export interface TabTransferRecord {
  id: string;
  tabId: AdminPanelTabId;
  sourceRoleOrAdmin: string;
  targetStaffOrRoleId: string;
  targetName: string;
  transferredAt: string;
  permissionType: 'full_edit' | 'view_only';
  note?: string;
}


