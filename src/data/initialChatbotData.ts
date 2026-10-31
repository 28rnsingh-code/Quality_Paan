import { KnowledgeDocument, ChatbotConfig } from '../types';

export const INITIAL_CHATBOT_CONFIG: ChatbotConfig = {
  enabled: true,
  botName: 'Royal AI Concierge',
  botTitle: 'Smart Commerce & Knowledge Assistant (RAG + LLM)',
  welcomeMessage: 'Hello! I am your Royal AI Concierge. How may I assist you today with our premium catalog, shipping, orders, or exclusive offers?',
  systemPersona: 'You are an elite, highly knowledgeable luxury e-commerce sales assistant and concierge for this store. You answer questions accurately using the provided store knowledge base, catalog details, order policies, and latest news documents. Always be courteous, precise, informative, and helpful. Mention relevant product prices in ₹ INR when recommending items.',
  tone: 'luxury_concierge',
  suggestedQuestions: [
    'What are the best-selling hookahs and sets?',
    'What herbal shisha flavours are 100% tobacco and nicotine free?',
    'What are the delivery charges and delivery times?',
    'How do I pay using UPI QR code or bank transfer?',
    "What's new in the store this week?"
  ],
  allowImageUploads: true,
  autoOpenOnFirstVisit: false,
  collectUserContact: true,
  fallbackEmail: 'support@qualitycommerce.com',
  whatsappSupportNumber: '+919876543210',
  ragTopK: 4,
  updatedAt: new Date().toISOString(),
};

export const INITIAL_KNOWLEDGE_DOCUMENTS: KnowledgeDocument[] = [
  {
    id: 'doc-whats-new-1',
    title: "What's New: Festive Luxury Edition & 100% Herbal Blends",
    type: 'whats_new',
    category: "What's New & Announcements",
    summary: 'New arrival of Egyptian hand-carved pipes, organic sugarcane molasses flavours, and weekend discounts.',
    content: `
WHAT'S NEW & LATEST STORE UPDATES:
1. Fresh Batch of Egyptian Hand-Carved Brass Hookahs has arrived:
   - Includes the 24K Gold Plated Pharaoh Masterpiece (₹12,499) and Cairo Artisan Brass Shisha (₹5,999).
   - All hookahs now ship with a complimentary heat management device (HMD) and silicone washable hose.
2. 100% Herbal & Nicotine-Free Shisha Molasses:
   - Zero tobacco, zero nicotine, crafted from organic Indian sugarcane molasses and natural fruit extracts.
   - Top trending flavours: Brain Freeze Arctic Ice (₹199), Double Apple Arabian (₹199), and Paan Raas Royal Sweet Supreme (₹249).
3. Super-Fast Discreet Packaging:
   - Orders delivered within 45 to 90 minutes locally, and 2-3 business days nationwide.
   - Plain unmarked boxes with zero mention of smoke/shisha on outer packaging for 100% privacy.
4. Promotional Code:
   - Use coupon code ROYAL20 for 20% OFF on orders over ₹499.
   - Use coupon code FESTIVE100 for ₹100 flat discount on orders over ₹999.
`,
    tags: ["what's new", 'new arrivals', 'hookahs', 'flavours', 'coupons'],
    createdAt: '2026-10-10T10:00:00Z',
    updatedAt: '2026-10-10T10:00:00Z',
    active: true,
  },
  {
    id: 'doc-shipping-policy',
    title: 'Shipping, Delivery Timelines & Discreet Packaging Policy',
    type: 'document',
    category: 'Logistics & Delivery',
    summary: 'Details on delivery fees, local express delivery, nationwide shipping, and private packaging.',
    content: `
SHIPPING & DELIVERY GUIDE:
- Delivery Hours: 7:00 AM to 11:30 PM, 7 days a week.
- Hyperlocal Express Delivery: Delivered within 45 to 60 minutes for locations within 12 km radius.
- Standard Shipping: Delivered within 24 to 48 hours in metro cities; 2-4 business days rest of India.
- Free Delivery Threshold: Free shipping on all cart orders above ₹499. For orders below ₹499, a nominal delivery charge of ₹49 applies.
- 100% Discreet Packaging: Every parcel is sealed in tamper-evident, completely unbranded opaque craft boxes or bubble mailers. The exterior shipping label simply mentions "QC Lifestyle Essentials" with no product descriptions or sensitive keywords.
- Order Tracking: Customers receive live SMS/WhatsApp tracking updates as their order transitions through Packed, Dispatched, and Out for Delivery.
`,
    tags: ['shipping', 'delivery', 'charges', 'discreet packaging', 'tracking', 'timelines'],
    createdAt: '2026-10-08T09:00:00Z',
    updatedAt: '2026-10-08T09:00:00Z',
    active: true,
  },
  {
    id: 'doc-payment-guide',
    title: 'Payment Methods, UPI QR Settlement & COD Instructions',
    type: 'document',
    category: 'Billing & Payments',
    summary: 'Payment options including Instant UPI QR, NetBanking, Cards, Bank Wire, and Cash on Delivery.',
    content: `
PAYMENT & CHECKOUT GUIDELINES:
1. Instant UPI QR Code (Fastest & Zero Surcharge):
   - At checkout, select "UPI QR". A dynamic merchant QR code is generated with the exact order total.
   - Scan with Google Pay, PhonePe, Paytm, BHIM, or any banking UPI app.
   - Enter your 12-digit UTR / UPI Transaction Reference Number or upload payment screenshot.
   - Instant automated/admin approval confirms the order within minutes.
2. Credit / Debit Cards & NetBanking:
   - Direct online gateway support for Visa, MasterCard, RuPay, and NetBanking across all major banks.
3. Direct IMPS / NEFT Bank Transfer:
   - Available for wholesale, high-ticket lounge boxes, and orders above ₹5,000.
   - Bank details provided at checkout with zero convenience fee.
4. Cash on Delivery (COD):
   - Available on selected cart values. Verified via SMS/WhatsApp confirmation before dispatch.
   - Cash or delivery agent UPI QR accepted at customer doorstep.
`,
    tags: ['payments', 'upi', 'qr code', 'cod', 'cash on delivery', 'cards', 'bank transfer'],
    createdAt: '2026-10-05T12:00:00Z',
    updatedAt: '2026-10-05T12:00:00Z',
    active: true,
  },
  {
    id: 'doc-returns-quality',
    title: 'Quality Guarantee, Replacements & Customer Support',
    type: 'document',
    category: 'Returns & Policies',
    summary: 'Policy on damaged goods transit replacements, authentic glassware, and contact channels.',
    content: `
QUALITY ASSURANCE & REPLACEMENT POLICY:
- 100% Transit Breakage Guarantee: All glassware, bohemian crystal vases, ceramic bowls, and torch lighters are triple-layered in heavy shockproof air-cushion wrap. In the rare event of transit damage, share an unboxing video or photo within 24 hours via WhatsApp for an immediate free replacement dispatch.
- 100% Herbal Molasses Certification: All shisha molasses sold are strictly tobacco-free, nicotine-free, tar-free, and tested for food-grade flavor safety.
- Customer Care Support:
  - WhatsApp Support: Instant concierge chat available directly on the website.
  - Email: support@qualitycommerce.com
  - Operating Hours: 7:00 AM - 11:30 PM everyday.
`,
    tags: ['guarantee', 'replacement', 'damaged', 'support', 'contact', 'quality'],
    createdAt: '2026-10-04T14:00:00Z',
    updatedAt: '2026-10-04T14:00:00Z',
    active: true,
  },
  {
    id: 'doc-catalog-summary',
    title: 'Product Catalog Overview & Categories Guide',
    type: 'pdf',
    category: 'Product Catalog',
    summary: 'Summary of store departments: Hookahs, Herbal Flavours, Bongs & Rolls, Lighters & Ashtrays, Ambient Fragrances, and Curated Combos.',
    content: `
PRODUCT CATALOG & DEPARTMENTS:
1. Hookahs & Shishas:
   - Authentic Egyptian brass shishas, modern aerospace-grade aluminum pipes, portable acrylic travel hookahs, and 24K gold-plated showpieces.
   - Price range: ₹1,499 to ₹12,499.
2. 100% Herbal Flavours (Zero Tobacco & Nicotine):
   - Available in 50g, 250g, and 1kg tins.
   - Flavours include Mint Ice, Double Apple, Pan Raas, Blueberry Blast, Watermelon Freeze, Magic Love, Mango Tango, and Spring Water.
   - Price: ₹199 to ₹2,499.
3. Bongs, Glassware & Organic Rolls:
   - Borosilicate glass beakers, percolator bongs, pure organic hemp rolling papers, filter tips, and herb crushers.
   - Price: ₹99 to ₹3,499.
4. Quad-Torch Lighters & Ashtrays:
   - Windproof jet flame torches, metallic cigar lighters, crystal cut ashtrays, and butane canisters.
   - Price: ₹249 to ₹1,899.
5. Ambient Fragrances & Bakhoor:
   - Cambodian royal oud, sandalwood room mists, luxury charcoal burners, and odor-eliminating diffusers.
   - Price: ₹399 to ₹2,999.
6. Curated Gift Combos & Lounge Starter Boxes:
   - Everything-included bundles (Pipe + 2x Flavours + Charcoal + Torch Lighter) with up to 35% discount.
   - Best seller: "The Imperial Sultan Lounge Box" at ₹3,999 (MRP ₹5,499).
`,
    tags: ['catalog', 'products', 'categories', 'hookahs', 'flavours', 'bongs', 'combos'],
    createdAt: '2026-10-02T10:00:00Z',
    updatedAt: '2026-10-02T10:00:00Z',
    active: true,
  }
];
