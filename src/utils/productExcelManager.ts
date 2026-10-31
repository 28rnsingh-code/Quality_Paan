import * as XLSX from 'xlsx';
import JSZip from 'jszip';
import { Product, ProductCategory, CategoryItem, ProductVariant } from '../types';

export interface ZipParseResult {
  parsedRows: ParsedProductRow[];
  imagesMap: Map<string, string>;
  imageCount: number;
  excelFileName: string;
  matchedCount: number;
}

export interface ParsedProductRow {
  tempId: string;
  name: string;
  category: ProductCategory;
  subcategory: string;
  price: number;
  mrp: number;
  buyPrice: number;
  stock: number;
  imageFileName: string;
  resolvedImageUrl: string;
  shortDescription: string;
  description: string;
  ingredients: string[];
  variants: ProductVariant[];
  attributes: Record<string, string>;
  isTobaccoFree: boolean;
  isAgeRestricted: boolean;
  isBestseller: boolean;
  isFeatured: boolean;
  sheetSource: string;
  hasCustomImage: boolean;
}

// No stock/dummy photoshoot images; only user-provided images or empty
export const CATEGORY_DEFAULT_IMAGES: Record<string, string> = {
  hookah: '',
  flavours: '',
  flavours_herbal: '',
  smoking_pipes: '',
  bongs_glass: '',
  bongs_rolls: '',
  crushers_grinders: '',
  rolling_papers: '',
  lighters_ashtray: '',
  accessories: '',
  paan: '',
  fragrances: '',
  combos: '',
  gift_boxes: '',
  default: ''
};

export const DEFAULT_TEMPLATE_COLUMNS = [
  'Product Title *',
  'Category',
  'Subcategory',
  'Base Selling Price (₹) *',
  'MRP (₹)',
  'Buy / Cost Price (₹)',
  'Stock Quantity',
  'Image Filename or URL',
  'Short Description',
  'Full Description',
  'Pack Options / Sizes (Format: Size:Price:MRP:Stock, Size2:Price2:MRP2:Stock2)',
  'Ingredients (comma separated)',
  'Material / Specifications (Format: Key:Value, Key2:Value2)',
  '0% Tobacco Free (yes/no)',
  'Age 18+ Restricted (yes/no)',
  'Is Bestseller (yes/no)',
  'Featured on Homepage (yes/no)'
];

// Helper to normalize category slugs from sheet names
export function mapSheetNameToCategory(sheetName: string, availableCategories: CategoryItem[]): ProductCategory {
  const clean = sheetName.toLowerCase().trim();
  // Exact match with available category IDs
  const found = availableCategories.find(c => c.id.toLowerCase() === clean || c.name.toLowerCase() === clean || c.displayName.toLowerCase() === clean);
  if (found) return found.id;

  if (clean.includes('hookah') || clean.includes('shisha')) return 'hookah';
  if (clean.includes('flavour') || clean.includes('herbal') || clean.includes('molasses')) return 'flavours';
  if (clean.includes('bong') || clean.includes('roll') || clean.includes('paper') || clean.includes('crusher') || clean.includes('pipe')) return 'bongs_rolls';
  if (clean.includes('lighter') || clean.includes('ashtray') || clean.includes('charcoal') || clean.includes('torch')) return 'lighters_ashtray';
  if (clean.includes('paan') || clean.includes('mukhwas') || clean.includes('gulkand')) return 'paan';
  if (clean.includes('fragrance') || clean.includes('bakhoor') || clean.includes('perfume') || clean.includes('attar')) return 'fragrances';
  if (clean.includes('combo') || clean.includes('gift') || clean.includes('box')) return 'combos';

  return (availableCategories[0]?.id || 'hookah') as ProductCategory;
}

/**
 * 1. Export Blank Excel Template containing sheets for each category
 */
export function generateBlankListingWorkbook(categories: CategoryItem[]): XLSX.WorkBook {
  const wb = XLSX.utils.book_new();

  // Template categories to create sheets for
  const templateSheets = categories.length > 0 ? categories : [
    { id: 'hookah', displayName: 'Hookahs & Shisha', sub: 'Egyptian Brass Hookahs' },
    { id: 'flavours', displayName: 'Herbal Flavours', sub: 'Herbal Molasses 50g' },
    { id: 'bongs_rolls', displayName: 'Bongs & Rolling Papers', sub: 'Glass Bongs & Cones' },
    { id: 'lighters_ashtray', displayName: 'Lighters & Charcoals', sub: 'Jet Torch Lighters' },
    { id: 'paan', displayName: 'Royal Paan & Mukhwas', sub: 'Shahi Meetha Paan' },
    { id: 'fragrances', displayName: 'Bakhoor & Fragrances', sub: 'Royal Oudh Incense' },
    { id: 'combos', displayName: 'Luxury Gift Sets & Combos', sub: 'Luxury Lounge Box' }
  ];

  // 1. First Sheet: Master All Categories Guide
  const masterGuideRows = [
    DEFAULT_TEMPLATE_COLUMNS,
    [
      '24K Gold Plated Egyptian Hookah',
      'hookah',
      'Imperial Brass Hookahs',
      2999,
      3999,
      1200,
      30,
      'royal_gold_hookah.jpg',
      'Exquisite solid brass Egyptian hookah with crystal carved base',
      'Experience royal lounge luxury with heavy brass stem, dual purge valve, and washable leather hose.',
      'Small (18 Inch):2499:3200:15, Medium (24 Inch):2999:3999:30, Jumbo (32 Inch):4499:5999:10',
      'Solid Brass, Bohemian Crystal Glass, Food-Grade Silicone',
      'Height: 24 Inch, Hose: 1 Included, Base: Heavy Crystal Glass',
      'yes',
      'yes',
      'yes',
      'yes'
    ],
    [
      'Brain Freeze Ice Blast Herbal Flavour (50g)',
      'flavours',
      'Herbal Molasses 0% Tobacco',
      199,
      250,
      75,
      100,
      'brain_freeze_flavour.png',
      'Chilled mint and icy menthol blast herbal paan flavour',
      '100% Herbal, Nicotine-Free and Tobacco-Free hookah molasses made from pure sugar cane extracts and natural mint oils.',
      '50g Pack:199:250:100, 250g Jar:799:999:40, 1kg Lounge Tub:2499:3200:15',
      'Sugar Cane Molasses, Menthol Crystals, Natural Mint Extracts, Vegetable Glycerine',
      'Weight: 50g, Type: 100% Herbal, Nicotine: 0.0%',
      'yes',
      'no',
      'yes',
      'yes'
    ],
    // Blank rows for merchants to fill
    ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '']
  ];

  const wsMaster = XLSX.utils.aoa_to_sheet(masterGuideRows);
  // Column widths
  wsMaster['!cols'] = [
    { wch: 32 }, // Title
    { wch: 16 }, // Category
    { wch: 22 }, // Subcategory
    { wch: 22 }, // Price
    { wch: 12 }, // MRP
    { wch: 18 }, // Buy Price
    { wch: 14 }, // Stock
    { wch: 24 }, // Image
    { wch: 36 }, // Short Desc
    { wch: 45 }, // Full Desc
    { wch: 40 }, // Variants
    { wch: 35 }, // Ingredients
    { wch: 35 }, // Specs
    { wch: 20 }, // Tobacco
    { wch: 22 }, // Age Restricted
    { wch: 18 }, // Bestseller
    { wch: 22 }  // Featured
  ];
  XLSX.utils.book_append_sheet(wb, wsMaster, 'All Categories Template');

  // 2. Individual Category Sheets
  templateSheets.forEach((cat: any) => {
    const sheetTitle = (cat.displayName || cat.name || cat.id).replace(/[\\/?*[\]]/g, '').slice(0, 30);
    const catRows = [
      DEFAULT_TEMPLATE_COLUMNS,
      [
        `Sample ${cat.displayName || cat.name} Item 1`,
        cat.id,
        cat.sub || 'Royal Collection',
        cat.id === 'hookah' ? 2499 : cat.id === 'flavours' ? 199 : 499,
        cat.id === 'hookah' ? 3299 : cat.id === 'flavours' ? 250 : 699,
        cat.id === 'hookah' ? 950 : cat.id === 'flavours' ? 70 : 180,
        50,
        `${cat.id}_item_photo.jpg`,
        `Premium quality handcrafted ${cat.displayName || cat.name}`,
        `Authentic luxury selection with finest craftsmanship and long lasting performance.`,
        'Standard:199:250:50, Large Pack:399:500:30',
        'Natural extracts, fine blend',
        'Quality: Premium Grade, Finish: Royal Matte',
        'yes',
        cat.id === 'hookah' ? 'yes' : 'no',
        'yes',
        'yes'
      ],
      // 10 Blank rows ready for merchant input
      ...Array.from({ length: 10 }, () => ['', cat.id, '', '', '', '', '', '', '', '', '', '', '', 'yes', 'no', 'no', 'no'])
    ];

    const ws = XLSX.utils.aoa_to_sheet(catRows);
    ws['!cols'] = wsMaster['!cols'];
    XLSX.utils.book_append_sheet(wb, ws, sheetTitle);
  });

  return wb;
}

/**
 * 2. Export Live Products to Excel (Multi-Sheet by Category + All Products Sheet)
 */
export function generateLiveCatalogWorkbook(products: Product[], categories: CategoryItem[]): XLSX.WorkBook {
  const wb = XLSX.utils.book_new();

  const convertProductToRow = (p: Product) => {
    const variantsStr = (p.variants || [])
      .map(v => `${v.name}:${v.price}:${v.mrp || v.price}:${v.stock || 50}`)
      .join(', ');

    const ingredientsStr = (p.ingredients || []).join(', ');

    const specsStr = p.attributes 
      ? Object.entries(p.attributes).map(([k, v]) => `${k}: ${v}`).join(', ')
      : '';

    const imageStr = (p.images && p.images.length > 0) ? p.images.join(' | ') : '';

    return [
      p.name,
      p.category,
      p.subcategory || '',
      p.price,
      p.mrp || p.price,
      p.buyPrice || Math.round(p.price * 0.4),
      p.stock || 0,
      imageStr,
      p.shortDescription || '',
      p.description || '',
      variantsStr,
      ingredientsStr,
      specsStr,
      p.isTobaccoFree !== false ? 'yes' : 'no',
      p.isAgeRestricted ? 'yes' : 'no',
      p.isBestseller ? 'yes' : 'no',
      p.isFeatured ? 'yes' : 'no'
    ];
  };

  // 1. All Products Master Sheet
  const allRows = [
    DEFAULT_TEMPLATE_COLUMNS,
    ...products.map(convertProductToRow)
  ];
  const wsAll = XLSX.utils.aoa_to_sheet(allRows);
  wsAll['!cols'] = [
    { wch: 32 }, { wch: 16 }, { wch: 22 }, { wch: 22 }, { wch: 12 },
    { wch: 18 }, { wch: 14 }, { wch: 35 }, { wch: 36 }, { wch: 45 },
    { wch: 40 }, { wch: 35 }, { wch: 35 }, { wch: 20 }, { wch: 22 },
    { wch: 18 }, { wch: 22 }
  ];
  XLSX.utils.book_append_sheet(wb, wsAll, 'All Store Products');

  // 2. Individual Category Sheets
  const catMap = new Map<string, Product[]>();
  products.forEach(p => {
    const cat = p.category || 'other';
    if (!catMap.has(cat)) catMap.set(cat, []);
    catMap.get(cat)!.push(p);
  });

  catMap.forEach((catProds, catId) => {
    const foundCat = categories.find(c => c.id === catId);
    const sheetTitle = (foundCat?.displayName || foundCat?.name || catId).replace(/[\\/?*[\]]/g, '').slice(0, 30);
    const catRows = [
      DEFAULT_TEMPLATE_COLUMNS,
      ...catProds.map(convertProductToRow)
    ];
    const ws = XLSX.utils.aoa_to_sheet(catRows);
    ws['!cols'] = wsAll['!cols'];
    XLSX.utils.book_append_sheet(wb, ws, sheetTitle);
  });

  return wb;
}

/**
 * Download workbook to file
 */
export function downloadWorkbook(wb: XLSX.WorkBook, filename: string) {
  XLSX.writeFile(wb, filename);
}

/**
 * Intelligent Image Matcher for Excel rows and image files
 * Matches exact name, lowercase, without extension, hyphens vs underscores, and product name keywords
 * Handles cases like: "product name: OT MYA", "image file: QT-mya02" -> matches "QT-mya02.jpg", "qt-mya02.png", etc.
 */
export function findMatchingImage(
  rawImage: string,
  productTitle: string,
  uploadedImagesMap: Map<string, string>
): { url: string; matchedKey: string } | null {
  if (!uploadedImagesMap || uploadedImagesMap.size === 0) return null;

  const rawClean = (rawImage || '').trim();
  if (rawClean.startsWith('http://') || rawClean.startsWith('https://') || rawClean.startsWith('data:')) {
    return { url: rawClean, matchedKey: rawClean };
  }

  // 1. Exact match
  if (rawClean && uploadedImagesMap.has(rawClean)) {
    return { url: uploadedImagesMap.get(rawClean)!, matchedKey: rawClean };
  }

  // 2. Case-insensitive & without extension
  const cleanLower = rawClean.toLowerCase();
  const withoutExt = cleanLower.replace(/\.[^/.]+$/, '');
  const stripped = withoutExt.replace(/[^a-z0-9]/g, '');

  if (cleanLower && uploadedImagesMap.has(cleanLower)) {
    return { url: uploadedImagesMap.get(cleanLower)!, matchedKey: cleanLower };
  }
  if (withoutExt && uploadedImagesMap.has(withoutExt)) {
    return { url: uploadedImagesMap.get(withoutExt)!, matchedKey: withoutExt };
  }

  // 3. Scan all entries in map for normalized / slug / dash-underscore equivalence
  for (const [key, url] of uploadedImagesMap.entries()) {
    const keyLower = key.toLowerCase();
    const keyWithoutExt = keyLower.replace(/\.[^/.]+$/, '');
    const keyStripped = keyWithoutExt.replace(/[^a-z0-9]/g, '');

    // E.g. "qt-mya02" matches "qt_mya02" or "qtmya02" or "QT-MYA02"
    if (stripped && (keyStripped === stripped || keyStripped.includes(stripped) || stripped.includes(keyStripped))) {
      return { url, matchedKey: key };
    }

    if (withoutExt && (keyWithoutExt.includes(withoutExt) || withoutExt.includes(keyWithoutExt))) {
      return { url, matchedKey: key };
    }
  }

  // 4. Product Name Fallback (e.g. title: "OT MYA" or "QT MYA", image in zip: "QT-mya02")
  if (productTitle) {
    const titleClean = productTitle.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
    const titleWords = titleClean.split(/\s+/).filter(w => w.length >= 2);

    for (const [key, url] of uploadedImagesMap.entries()) {
      const keyClean = key.toLowerCase().replace(/[^a-z0-9]+/g, ' ');
      // If image filename matches key distinctive brand words (like "mya")
      const matchesWord = titleWords.some(w => (w === 'mya' || w === 'hookah' || w === 'afzal') && keyClean.includes(w));
      if (matchesWord) {
        return { url, matchedKey: key };
      }
    }
  }

  return null;
}

/**
 * 3. Parse Product Workbook Buffer (ArrayBuffer or Uint8Array)
 */
export async function parseProductWorkbookBuffer(
  data: ArrayBuffer,
  availableCategories: CategoryItem[],
  uploadedImagesMap: Map<string, string>
): Promise<ParsedProductRow[]> {
  const wb = XLSX.read(data, { type: 'array' });
  const parsedItems: ParsedProductRow[] = [];

  wb.SheetNames.forEach((sheetName) => {
    const ws = wb.Sheets[sheetName];
    if (!ws) return;

    // Convert sheet to array of objects
    const rawRows = XLSX.utils.sheet_to_json<Record<string, any>>(ws, { defval: '', header: 1 }) as any[][];
    if (rawRows.length < 2) return;

    // Find header row (first row)
    const headers = (rawRows[0] || []).map(h => String(h || '').toLowerCase().trim());

    // Helper to find column index by multiple synonyms
    const findColIdx = (synonyms: string[]): number => {
      return headers.findIndex(h => synonyms.some(syn => h.includes(syn)));
    };

    const titleIdx = findColIdx(['product title', 'title', 'product name', 'item name', 'name', 'item']);
    const catIdx = findColIdx(['category', 'cat', 'menu category', 'type']);
    const subcatIdx = findColIdx(['subcategory', 'sub-category', 'sub category', 'tag']);
    const priceIdx = findColIdx(['selling price', 'base selling price', 'price', 'rate', 'retail price', 'mrp selling']);
    const mrpIdx = findColIdx(['mrp', 'maximum retail price', 'original price']);
    const buyPriceIdx = findColIdx(['buy', 'cost price', 'cost', 'purchase price', 'wholesale']);
    const stockIdx = findColIdx(['stock', 'quantity', 'qty', 'inventory', 'units']);
    const imageIdx = findColIdx(['image filename', 'image', 'photo', 'picture', 'img', 'filename', 'image file']);
    const shortDescIdx = findColIdx(['short description', 'tagline', 'short desc', 'summary']);
    const fullDescIdx = findColIdx(['full description', 'description', 'details', 'about']);
    const variantsIdx = findColIdx(['pack options', 'sizes', 'variants', 'options', 'size']);
    const ingredientsIdx = findColIdx(['ingredients', 'flavours blend', 'materials used']);
    const specsIdx = findColIdx(['material', 'specifications', 'specs', 'attributes']);
    const tobaccoIdx = findColIdx(['tobacco', '0% tobacco', 'tobacco free', 'herbal']);
    const ageIdx = findColIdx(['age', '18+', 'restricted', 'legal']);
    const bestsellerIdx = findColIdx(['bestseller', 'best seller', 'popular']);
    const featuredIdx = findColIdx(['featured', 'trending', 'homepage']);

    // Default category based on Sheet Name
    const sheetDefaultCategory = mapSheetNameToCategory(sheetName, availableCategories);

    // Process rows (starting line 1)
    for (let r = 1; r < rawRows.length; r++) {
      const row = rawRows[r];
      if (!row || row.length === 0) continue;

      const rawTitle = String(row[titleIdx >= 0 ? titleIdx : 0] || '').trim();
      
      // If the row has no title and no price, skip blank guide rows
      const rawPriceStr = priceIdx >= 0 ? String(row[priceIdx] || '').trim() : '';
      if (!rawTitle && !rawPriceStr) continue;

      const title = rawTitle || `Royal Item ${parsedItems.length + 1}`;

      // Category extraction
      let rowCategory = row[catIdx] ? String(row[catIdx]).trim().toLowerCase() : '';
      if (!rowCategory || rowCategory === 'all' || rowCategory === '') {
        rowCategory = sheetDefaultCategory;
      }
      const matchedCategory = mapSheetNameToCategory(rowCategory, availableCategories);

      // Price handling
      const parseCleanNumber = (val: any, fallback = 0): number => {
        if (typeof val === 'number') return val;
        const cleaned = String(val || '').replace(/[^0-9.]/g, '');
        const num = parseFloat(cleaned);
        return isNaN(num) ? fallback : num;
      };

      const price = parseCleanNumber(row[priceIdx], matchedCategory === 'hookah' ? 2499 : 299);
      const mrp = parseCleanNumber(row[mrpIdx], Math.round(price * 1.3));
      const buyPrice = parseCleanNumber(row[buyPriceIdx], Math.round(price * 0.45));
      const stock = parseCleanNumber(row[stockIdx], 50);

      const subcategory = subcatIdx >= 0 && row[subcatIdx] ? String(row[subcatIdx]).trim() : 'Royal Selection';
      const shortDesc = shortDescIdx >= 0 && row[shortDescIdx] ? String(row[shortDescIdx]).trim() : 'Premium quality royal selection.';
      const fullDesc = fullDescIdx >= 0 && row[fullDescIdx] ? String(row[fullDescIdx]).trim() : `${title} crafted for authentic connoisseur luxury with superior aroma and finish.`;

      // Parse Image filename or URL
      const rawImage = imageIdx >= 0 && row[imageIdx] ? String(row[imageIdx]).trim() : '';
      let resolvedImage = '';
      let hasCustomImage = false;

      const matchedImg = findMatchingImage(rawImage, title, uploadedImagesMap);
      if (matchedImg) {
        resolvedImage = matchedImg.url;
        hasCustomImage = true;
      }

      // If no image bound yet, set category default
      if (!resolvedImage) {
        resolvedImage = CATEGORY_DEFAULT_IMAGES[matchedCategory] || CATEGORY_DEFAULT_IMAGES.default;
      }

      // Parse Variants / Pack Options
      const variants: ProductVariant[] = [];
      const rawVariantsStr = variantsIdx >= 0 && row[variantsIdx] ? String(row[variantsIdx]).trim() : '';
      if (rawVariantsStr) {
        const optionParts = rawVariantsStr.split(/[,;|]/);
        optionParts.forEach((part, idx) => {
          const segs = part.split(':').map(s => s.trim());
          if (segs.length >= 1 && segs[0]) {
            const vName = segs[0];
            const vPrice = parseCleanNumber(segs[1], price);
            const vMrp = parseCleanNumber(segs[2], Math.round(vPrice * 1.25));
            const vStock = parseCleanNumber(segs[3], stock);
            variants.push({
              id: `v-imp-${Date.now()}-${idx}-${Math.random().toString(36).slice(2, 6)}`,
              name: vName,
              price: vPrice,
              mrp: vMrp,
              stock: vStock
            });
          }
        });
      }

      // Parse Ingredients
      const rawIngStr = ingredientsIdx >= 0 && row[ingredientsIdx] ? String(row[ingredientsIdx]).trim() : '';
      const ingredients = rawIngStr 
        ? rawIngStr.split(/[,;|]/).map(s => s.trim()).filter(Boolean)
        : [];

      // Parse Specifications / Attributes
      const attributes: Record<string, string> = {};
      const rawSpecsStr = specsIdx >= 0 && row[specsIdx] ? String(row[specsIdx]).trim() : '';
      if (rawSpecsStr) {
        const specParts = rawSpecsStr.split(/[,;]/);
        specParts.forEach(sp => {
          const [k, v] = sp.split(':').map(s => s.trim());
          if (k && v) {
            attributes[k] = v;
          }
        });
      }

      // Boolean parsing helper
      const parseBool = (val: any, defaultVal: boolean): boolean => {
        if (val === undefined || val === null || val === '') return defaultVal;
        const s = String(val).toLowerCase().trim();
        return s === 'yes' || s === 'true' || s === '1' || s === 'y';
      };

      const isTobaccoFree = parseBool(row[tobaccoIdx], true);
      const isAgeRestricted = parseBool(row[ageIdx], matchedCategory === 'hookah' || matchedCategory === 'bongs_rolls');
      const isBestseller = parseBool(row[bestsellerIdx], false);
      const isFeatured = parseBool(row[featuredIdx], true);

      parsedItems.push({
        tempId: `tmp-${Date.now()}-${r}-${Math.random().toString(36).slice(2, 6)}`,
        name: title,
        category: matchedCategory,
        subcategory,
        price,
        mrp,
        buyPrice,
        stock,
        imageFileName: rawImage,
        resolvedImageUrl: resolvedImage,
        shortDescription: shortDesc,
        description: fullDesc,
        ingredients,
        variants,
        attributes,
        isTobaccoFree,
        isAgeRestricted,
        isBestseller,
        isFeatured,
        sheetSource: sheetName,
        hasCustomImage
      });
    }
  });

  return parsedItems;
}

/**
 * 4. Parse Uploaded Excel/CSV File
 */
export async function parseProductFile(
  file: File,
  availableCategories: CategoryItem[],
  uploadedImagesMap: Map<string, string>
): Promise<ParsedProductRow[]> {
  const data = await file.arrayBuffer();
  return parseProductWorkbookBuffer(data, availableCategories, uploadedImagesMap);
}

/**
 * 5. Parse Complete ZIP Package containing Excel file + Photos
 * Extracts Excel sheet (e.g. QualityPaan_Blank_Product_Listing_Template_2026-10-07.xlsx) and all product photos (QT-mya02, etc.)
 */
export async function parseProductZipPackage(
  zipFile: File | Blob,
  availableCategories: CategoryItem[]
): Promise<ZipParseResult> {
  const zip = await JSZip.loadAsync(zipFile);
  const imagesMap = new Map<string, string>();
  let excelFileEntry: JSZip.JSZipObject | null = null;
  let excelFileName = '';

  const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg', '.jfif', '.bmp'];
  const excelExtensions = ['.xlsx', '.xls', '.csv'];

  const fileEntries: JSZip.JSZipObject[] = [];
  zip.forEach((relativePath, file) => {
    if (!file.dir && !relativePath.includes('__MACOSX') && !relativePath.startsWith('.')) {
      fileEntries.push(file);
    }
  });

  // Extract all images first into ObjectURLs
  for (const file of fileEntries) {
    const name = file.name;
    const lowerName = name.toLowerCase();
    const isImage = imageExtensions.some(ext => lowerName.endsWith(ext));
    const isExcel = excelExtensions.some(ext => lowerName.endsWith(ext));

    if (isImage) {
      const blob = await file.async('blob');
      const blobUrl = URL.createObjectURL(blob);
      const baseFilename = name.split('/').pop() || name;
      const lowerBase = baseFilename.toLowerCase();
      const withoutExt = lowerBase.replace(/\.[^/.]+$/, '');
      const stripped = withoutExt.replace(/[^a-z0-9]/g, '');

      imagesMap.set(baseFilename, blobUrl);
      imagesMap.set(lowerBase, blobUrl);
      imagesMap.set(withoutExt, blobUrl);
      imagesMap.set(stripped, blobUrl);
      imagesMap.set(lowerName, blobUrl);
    } else if (isExcel && !excelFileEntry) {
      excelFileEntry = file;
      excelFileName = name.split('/').pop() || name;
    } else if (isExcel && excelFileEntry) {
      // Prefer template or qualitypaan in name
      if (lowerName.includes('qualitypaan') || lowerName.includes('template') || lowerName.includes('product')) {
        excelFileEntry = file;
        excelFileName = name.split('/').pop() || name;
      }
    }
  }

  if (!excelFileEntry) {
    return {
      parsedRows: [],
      imagesMap,
      imageCount: Math.round(imagesMap.size / 5),
      excelFileName: '',
      matchedCount: 0
    };
  }

  const excelBuffer = await excelFileEntry.async('arraybuffer');
  const parsedRows = await parseProductWorkbookBuffer(excelBuffer, availableCategories, imagesMap);
  const matchedCount = parsedRows.filter(r => r.hasCustomImage).length;

  return {
    parsedRows,
    imagesMap,
    imageCount: Math.round(imagesMap.size / 5),
    excelFileName,
    matchedCount
  };
}
