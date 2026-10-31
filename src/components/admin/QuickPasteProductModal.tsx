import React, { useState } from 'react';
import { 
  Sparkles, 
  X, 
  Check, 
  Upload, 
  AlertCircle, 
  FileText, 
  Package, 
  Layers, 
  CheckCircle2,
  HelpCircle
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ProductCategory, Product } from '../../types';
import { CATEGORY_DEFAULT_IMAGES } from '../../utils/productExcelManager';

interface QuickPasteProductModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ParsedQuickItem {
  id: string;
  name: string;
  category: ProductCategory;
  subcategory: string;
  price: number;
  mrp: number;
  stock: number;
  shortDescription: string;
  description: string;
  image: string;
}

export const QuickPasteProductModal: React.FC<QuickPasteProductModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { bulkAddProducts, categories, showToast } = useApp();
  const [rawText, setRawText] = useState('');
  const [parsedItems, setParsedItems] = useState<ParsedQuickItem[]>([]);
  const [parseError, setParseError] = useState<string | null>(null);

  if (!isOpen) return null;

  // Function to normalize category
  const detectCategory = (catStr: string): ProductCategory => {
    const clean = (catStr || '').toLowerCase().trim();
    if (clean.includes('shisha') || clean.includes('hookah')) return 'hookah';
    if (clean.includes('flavour') || clean.includes('flavor') || clean.includes('molasses') || clean.includes('taste')) return 'flavours';
    if (clean.includes('bong') || clean.includes('roll') || clean.includes('paper') || clean.includes('crush') || clean.includes('cone')) return 'bongs_rolls';
    if (clean.includes('lighter') || clean.includes('ashtray') || clean.includes('torch') || clean.includes('flame')) return 'lighters_ashtray';
    if (clean.includes('fragrance') || clean.includes('bakhoor') || clean.includes('mist') || clean.includes('spray') || clean.includes('perfume') || clean.includes('oud')) return 'fragrances';
    if (clean.includes('combo') || clean.includes('gift') || clean.includes('box') || clean.includes('set')) return 'combos';
    if (clean.includes('paan')) return 'hookah';
    return 'hookah';
  };

  const handleParse = (textToParse: string) => {
    const text = textToParse.trim();
    if (!text) {
      setParsedItems([]);
      setParseError(null);
      return;
    }

    try {
      // 1. Try parsing as JSON first
      if (text.startsWith('[') || text.startsWith('{')) {
        const json = JSON.parse(text);
        const list = Array.isArray(json) ? json : json.products || [json];
        const items: ParsedQuickItem[] = list.map((item: any, idx: number) => {
          const category = detectCategory(item.category || item.categoryName || 'hookah');
          const price = Number(item.price) || 299;
          const mrp = Number(item.mrp) || Math.round(price * 1.25);
          return {
            id: `temp-${Date.now()}-${idx}`,
            name: String(item.name || item.title || `Custom Product ${idx + 1}`),
            category,
            subcategory: item.subcategory || 'Premium Edition',
            price,
            mrp,
            stock: Number(item.stock) || 25,
            shortDescription: item.shortDescription || item.description || `Luxury handcrafted ${item.name || 'product'}.`,
            description: item.description || item.shortDescription || `Premium grade product carefully inspected for superior experience.`,
            image: (item.images && item.images[0]) || item.image || CATEGORY_DEFAULT_IMAGES[category] || CATEGORY_DEFAULT_IMAGES.default,
          };
        });
        setParsedItems(items);
        setParseError(null);
        return;
      }

      // 2. Parse line by line (Supports CSV, Tab-Delimited, or "Name - Price - Category")
      const lines = text.split('\n').map((l) => l.trim()).filter((l) => l.length > 0);
      const items: ParsedQuickItem[] = [];

      lines.forEach((line, idx) => {
        // Skip header lines
        if (idx === 0 && (line.toLowerCase().includes('product') || line.toLowerCase().includes('name') || line.toLowerCase().includes('price'))) {
          if (lines.length > 1) return;
        }

        let delimiter = ',';
        if (line.includes('\t')) delimiter = '\t';
        else if (line.includes('|')) delimiter = '|';
        else if (line.includes(' - ')) delimiter = ' - ';

        const parts = line.split(delimiter).map((p) => p.trim());
        if (parts.length === 0 || !parts[0]) return;

        const name = parts[0];
        let price = 299;
        let category: ProductCategory = 'hookah';
        let desc = '';

        if (parts.length >= 2) {
          const cleanP = parts[1].replace(/[^0-9.]/g, '');
          if (cleanP && !isNaN(Number(cleanP))) {
            price = Number(cleanP);
          } else {
            category = detectCategory(parts[1]);
          }
        }

        if (parts.length >= 3) {
          if (parts[2].match(/^[0-9.]+$/)) {
            price = Number(parts[2]);
          } else {
            category = detectCategory(parts[2]);
          }
        }

        if (parts.length >= 4) {
          desc = parts.slice(3).join(', ');
        }

        // Auto-detect category from product name if category wasn't explicit
        if (parts.length < 3) {
          category = detectCategory(name);
        }

        const mrp = Math.round(price * 1.25);
        items.push({
          id: `temp-${Date.now()}-${idx}`,
          name,
          category,
          subcategory: 'Artisan Collection',
          price,
          mrp,
          stock: 30,
          shortDescription: desc || `Authentic ${name} crafted for premium smoking and lounge experience.`,
          description: desc || `Top-rated choice at Quality Paan. Includes complete seal and quality packaging.`,
          image: CATEGORY_DEFAULT_IMAGES[category] || CATEGORY_DEFAULT_IMAGES.default,
        });
      });

      if (items.length === 0) {
        setParseError('No products recognized. Please format each line with Name and Price.');
      } else {
        setParsedItems(items);
        setParseError(null);
      }
    } catch (e: any) {
      setParseError(`Parse error: ${e.message}`);
    }
  };

  const handleUploadAll = () => {
    if (parsedItems.length === 0) {
      showToast('No items to upload.', 'warning');
      return;
    }

    const newProducts: Array<Omit<Product, 'id' | 'createdAt' | 'updatedAt'>> = parsedItems.map((item) => ({
      name: item.name,
      category: item.category,
      subcategory: item.subcategory,
      shortDescription: item.shortDescription,
      description: item.description,
      price: item.price,
      mrp: item.mrp,
      buyPrice: Math.round(item.price * 0.5),
      stock: item.stock,
      images: [item.image],
      isTobaccoFree: true,
      isAgeRestricted: true,
      rating: 4.8,
      reviewCount: Math.floor(Math.random() * 20) + 5,
    }));

    bulkAddProducts(newProducts, 'append');
    showToast(`Successfully uploaded ${newProducts.length} morning products to catalog!`, 'success');
    setRawText('');
    setParsedItems([]);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="bg-[#121212] border-2 border-[#D4AF37]/50 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-[#252525] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[#2A1E06] border border-[#D4AF37]/50 text-[#E5C158] flex items-center justify-center">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-royal text-xl font-bold text-[#E5C158] flex items-center gap-2">
                <span>Quick Paste &amp; Upload 7 AM Products</span>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-[#162A17] text-[#2ECC71] border border-[#2ECC71]/40">
                  Instant Importer
                </span>
              </h2>
              <p className="text-xs text-gray-400">
                Paste raw product names, prices, and details to instantly upload and restore your morning catalog
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-[#202020] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Instructions Box */}
        <div className="p-3.5 rounded-xl bg-[#1A1810] border border-[#D4AF37]/30 text-xs text-gray-300 space-y-1">
          <p className="font-semibold text-[#E5C158] flex items-center gap-1.5">
            <HelpCircle className="w-4 h-4 text-[#D4AF37]" /> Supported Paste Formats:
          </p>
          <ul className="list-disc list-inside text-gray-400 space-y-0.5 pl-1 text-[11px]">
            <li><strong>Line format:</strong> <code className="text-[#E5C158]">Product Name, Price, Category, Short Description</code></li>
            <li><strong>Copied from Excel / Google Sheets:</strong> Simply copy the columns and paste directly here!</li>
            <li><strong>JSON Array:</strong> <code className="text-[#E5C158]">[&#123;&quot;name&quot;: &quot;Shisha Flavour&quot;, &quot;price&quot;: 199&#125;]</code></li>
          </ul>
        </div>

        {/* Text Input Area */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-300 block">
            Paste Products Here (One item per line or JSON):
          </label>
          <textarea
            value={rawText}
            onChange={(e) => {
              setRawText(e.target.value);
              handleParse(e.target.value);
            }}
            placeholder={`Example:
Brain Freeze Flavour 50g, 199, flavours, Refreshing mint chill
24K Royal Gold Hookah, 3499, hookah, Handcrafted brass hookah set
RAW King Size Slim Papers, 120, bongs_rolls, Organic hemp paper
Windproof Quad Jet Torch, 499, lighters_ashtray, Heavy duty refillable`}
            rows={7}
            className="w-full bg-[#161616] border border-[#333] focus:border-[#D4AF37] rounded-xl p-3 text-xs text-gray-100 font-mono focus:outline-none"
          />
        </div>

        {parseError && (
          <div className="p-3 rounded-lg bg-red-950/40 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
            <span>{parseError}</span>
          </div>
        )}

        {/* Live Parsed Preview */}
        {parsedItems.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#E5C158] flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Parsed {parsedItems.length} Products Ready to Upload:
              </span>
              <span className="text-[11px] text-gray-400">
                Default high-res image assigned automatically
              </span>
            </div>

            <div className="max-h-48 overflow-y-auto space-y-2 pr-1 border border-[#252525] p-2 rounded-xl bg-[#0D0D0D]">
              {parsedItems.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-[#151515] border border-[#262626] text-xs">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-8 h-8 rounded object-cover border border-[#444]"
                    />
                    <div>
                      <p className="font-bold text-gray-200">{item.name}</p>
                      <p className="text-[10px] text-gray-400 capitalize">{item.category.replace('_', ' ')} &bull; {item.shortDescription}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-royal font-bold text-[#E5C158]">₹{item.price}</span>
                    <span className="text-[10px] text-gray-500 block line-through">₹{item.mrp}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#252525]">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-gray-700 text-gray-300 hover:text-white hover:bg-gray-800 text-xs font-semibold"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleUploadAll}
            disabled={parsedItems.length === 0}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#F3D079] via-[#D4AF37] to-[#B38C1B] text-black font-royal font-bold text-xs flex items-center gap-2 hover:brightness-110 shadow-lg transition-all disabled:opacity-50 active:scale-95 cursor-pointer"
          >
            <Upload className="w-4 h-4" />
            <span>Upload {parsedItems.length} Products to Store</span>
          </button>
        </div>
      </div>
    </div>
  );
};
