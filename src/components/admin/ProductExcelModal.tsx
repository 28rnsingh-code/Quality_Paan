import React, { useState, useRef } from 'react';
import { 
  FileSpreadsheet, 
  Download, 
  Upload, 
  X, 
  Check, 
  CheckCircle2, 
  AlertCircle, 
  Image as ImageIcon, 
  FolderPlus, 
  Layers, 
  Package, 
  Sparkles, 
  Trash2, 
  Edit3, 
  Eye, 
  ArrowRight, 
  RefreshCw, 
  FileText,
  Table,
  HelpCircle,
  ChevronRight,
  Info
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Product, CategoryItem } from '../../types';
import { 
  generateBlankListingWorkbook, 
  generateLiveCatalogWorkbook, 
  downloadWorkbook, 
  parseProductFile, 
  parseProductZipPackage,
  ParsedProductRow,
  ZipParseResult,
  CATEGORY_DEFAULT_IMAGES
} from '../../utils/productExcelManager';
import * as XLSX from 'xlsx';

interface ProductExcelModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProductExcelModal: React.FC<ProductExcelModalProps> = ({ isOpen, onClose }) => {
  const { products, categories, bulkAddProducts, showToast } = useApp();

  const [activeTab, setActiveTab] = useState<'import' | 'export' | 'guide'>('import');
  
  // Import State
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isParsing, setIsParsing] = useState(false);
  const [parsedRows, setParsedRows] = useState<ParsedProductRow[]>([]);
  const [uploadedImagesMap, setUploadedImagesMap] = useState<Map<string, string>>(new Map());
  const [uploadedImagesCount, setUploadedImagesCount] = useState(0);
  const [selectedSheetFilter, setSelectedSheetFilter] = useState<string>('all');
  const [isImporting, setIsImporting] = useState(false);
  const [editingRowId, setEditingRowId] = useState<string | null>(null);
  const [mergeMode, setMergeMode] = useState<'append' | 'skip_duplicates' | 'update_duplicates'>('append');
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [zipInfo, setZipInfo] = useState<{
    fileName: string;
    excelFileName: string;
    imageCount: number;
    matchedCount: number;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const zipInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);
  const imageFilesInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // Process ZIP package containing Excel + Photos
  const handleZipFile = async (file: File) => {
    if (!file) return;
    setSelectedFile(file);
    setIsParsing(true);
    try {
      const res = await parseProductZipPackage(file, categories);
      setParsedRows(res.parsedRows);
      setUploadedImagesMap(res.imagesMap);
      setUploadedImagesCount(res.imageCount);
      setZipInfo({
        fileName: file.name,
        excelFileName: res.excelFileName || 'QualityPaan Excel Template',
        imageCount: res.imageCount,
        matchedCount: res.matchedCount
      });
      setIsParsing(false);

      if (res.parsedRows.length > 0) {
        showToast(
          `🎉 Extracted ${res.parsedRows.length} products from ${res.excelFileName || file.name}! Auto-matched ${res.matchedCount} photos.`,
          'success'
        );
      } else if (res.imageCount > 0) {
        showToast(`Loaded ${res.imageCount} product photos from ZIP! Please also select your Excel template file.`, 'info');
      } else {
        showToast('ZIP file opened, but no .xlsx, .xls, or photos were found inside.', 'warning');
      }
    } catch (err: any) {
      console.error(err);
      setIsParsing(false);
      showToast(`Failed to parse ZIP archive: ${err.message || 'Invalid format'}`, 'error');
    }
  };

  // Handle Excel/CSV/ZIP File Upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.name.toLowerCase().endsWith('.zip') || file.type.includes('zip')) {
      await handleZipFile(file);
      return;
    }

    setSelectedFile(file);
    setIsParsing(true);

    try {
      const items = await parseProductFile(file, categories, uploadedImagesMap);
      setParsedRows(items);
      setIsParsing(false);
      if (items.length > 0) {
        showToast(`Successfully parsed ${items.length} products from ${file.name}!`, 'success');
      } else {
        showToast(`No product rows found in file. Please ensure data is entered below the header row.`, 'warning');
      }
    } catch (err: any) {
      console.error(err);
      setIsParsing(false);
      showToast(`Failed to parse file: ${err.message || 'Invalid format'}`, 'error');
    }
  };

  // Drag and Drop Handler
  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(false);
    const files = e.dataTransfer.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    if (file.name.toLowerCase().endsWith('.zip') || file.type.includes('zip')) {
      await handleZipFile(file);
    } else if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls') || file.name.endsWith('.csv')) {
      setSelectedFile(file);
      setIsParsing(true);
      try {
        const items = await parseProductFile(file, categories, uploadedImagesMap);
        setParsedRows(items);
        setIsParsing(false);
        showToast(`Parsed ${items.length} products from ${file.name}!`, 'success');
      } catch (err: any) {
        setIsParsing(false);
        showToast(`Failed to parse file: ${err.message}`, 'error');
      }
    } else {
      showToast('Please drop a .zip, .xlsx, or .csv file.', 'warning');
    }
  };

  // Load OT MYA Demo Preset
  const handleLoadOtMyaSample = () => {
    const sampleItem: ParsedProductRow = {
      tempId: `tmp-sample-${Date.now()}`,
      name: 'OT MYA (QT Mya Portable Brass Shisha)',
      category: 'hookah',
      subcategory: 'Mya Hookahs',
      price: 2499,
      mrp: 3299,
      buyPrice: 1100,
      stock: 45,
      imageFileName: 'QT-mya02',
      resolvedImageUrl: '',
      shortDescription: 'World-renowned QT Mya heavy solid brass compact hookah with cage carrier.',
      description: 'The iconic QT Mya hookah engineered with solid brass stem, frosted glass vase, ceramic bowl, and wire carrying cage. Renowned for dense smoke, whisper-quiet purge, and supreme portability.',
      ingredients: ['Solid Brass', 'Frosted Crystal Glass', 'Washable Silicone Hose'],
      variants: [
        { id: `v-1`, name: 'Silver Chrome', price: 2499, mrp: 3299, stock: 25 },
        { id: `v-2`, name: 'Royal Gold', price: 2799, mrp: 3699, stock: 20 }
      ],
      attributes: { 'Brand': 'Mya Saray', 'Model': 'QT-mya02', 'Height': '14 Inch', 'Includes': 'Cage Carrier & Hose' },
      isTobaccoFree: true,
      isAgeRestricted: true,
      isBestseller: true,
      isFeatured: true,
      sheetSource: 'Hookahs & Shisha',
      hasCustomImage: true
    };
    setParsedRows([sampleItem]);
    showToast('Loaded sample row: "OT MYA" linked to "QT-mya02"! Click Import below to list it.', 'info');
  };

  // Handle Bulk Image Folder / Multi-File Selection
  const handleBulkImagesUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newMap = new Map(uploadedImagesMap);
    let addedCount = 0;

    Array.from(files).forEach((f: any) => {
      if (f.type && f.type.startsWith('image/')) {
        const objectUrl = URL.createObjectURL(f);
        const cleanName = (f.name || '').toLowerCase().trim();
        newMap.set(cleanName, objectUrl);
        // Also add without extension
        const baseName = cleanName.replace(/\.[^/.]+$/, '');
        newMap.set(baseName, objectUrl);
        addedCount++;
      }
    });

    setUploadedImagesMap(newMap);
    setUploadedImagesCount(prev => prev + addedCount);

    // Re-bind images to currently parsed rows
    if (parsedRows.length > 0) {
      const updated = parsedRows.map(row => {
        if (row.hasCustomImage && row.resolvedImageUrl.startsWith('http')) return row;
        if (row.imageFileName) {
          const cleanName = row.imageFileName.toLowerCase().trim();
          const baseName = cleanName.replace(/\.[^/.]+$/, '');
          const found = newMap.get(cleanName) || newMap.get(baseName);
          if (found) {
            return {
              ...row,
              resolvedImageUrl: found,
              hasCustomImage: true
            };
          }
        }
        return row;
      });
      setParsedRows(updated);
    }

    showToast(`Loaded ${addedCount} product photos into image matcher!`, 'success');
  };

  // Final Ingestion: Add all parsed products into AppContext / Storefront
  const handleConfirmImport = () => {
    if (parsedRows.length === 0) {
      showToast('No products to import.', 'warning');
      return;
    }

    setIsImporting(true);

    try {
      const itemsToImport = parsedRows.map((row, idx) => {
        const price = Number(row.price) || 199;
        const mrp = Number(row.mrp) || Math.round(price * 1.25);
        const buyPrice = Number(row.buyPrice) || Math.round(price * 0.45);
        const discountPercent = mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0;

        return {
          name: row.name || `Imported Item ${idx + 1}`,
          sku: `QP-${Date.now().toString().slice(-6)}-${idx + 1}`,
          slug: (row.name || 'imported-item').toLowerCase().replace(/[^a-z0-9]+/g, '-') + `-${idx + 1}`,
          category: row.category,
          subcategory: row.subcategory || 'Royal Selection',
          price,
          mrp,
          buyPrice,
          discountPercent,
          stock: Number(row.stock) || 50,
          images: [row.resolvedImageUrl || CATEGORY_DEFAULT_IMAGES[row.category] || CATEGORY_DEFAULT_IMAGES.default],
          description: row.description || 'Premium royal luxury selection handcrafted with finest materials.',
          shortDescription: row.shortDescription || 'Fresh premium royal quality.',
          ingredients: row.ingredients || [],
          variants: row.variants || [],
          attributes: row.attributes || {},
          isBestseller: !!row.isBestseller,
          isFeatured: row.isFeatured !== false,
          isTobaccoFree: row.isTobaccoFree !== false,
          isAgeRestricted: !!row.isAgeRestricted,
          rating: 5.0,
          reviewCount: 1,
        };
      });

      bulkAddProducts(itemsToImport, mergeMode);

      setIsImporting(false);
      showToast(
        `🎉 Successfully listed ${itemsToImport.length} products! All ${products.length} existing catalog products remain safely preserved.`,
        'success'
      );
      onClose();
    } catch (err: any) {
      console.error(err);
      setIsImporting(false);
      showToast(`Error during import: ${err.message}`, 'error');
    }
  };

  // Export Blank Listing Template (.xlsx)
  const handleExportBlankXlsx = () => {
    try {
      const wb = generateBlankListingWorkbook(categories);
      downloadWorkbook(wb, `QualityPaan_Blank_Product_Listing_Template_${new Date().toISOString().slice(0, 10)}.xlsx`);
      showToast('Blank multi-category Excel template downloaded! Fill details and upload.', 'success');
    } catch (err: any) {
      showToast(`Export error: ${err.message}`, 'error');
    }
  };

  // Export Blank CSV Template
  const handleExportBlankCsv = () => {
    try {
      const wb = generateBlankListingWorkbook(categories);
      // Export the first master sheet as CSV
      const masterSheet = wb.Sheets['All Categories Template'];
      const csvData = XLSX.utils.sheet_to_csv(masterSheet);
      const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `QualityPaan_Product_Listing_Template.csv`;
      a.click();
      URL.revokeObjectURL(url);
      showToast('Blank CSV template downloaded!', 'success');
    } catch (err: any) {
      showToast(`Export error: ${err.message}`, 'error');
    }
  };

  // Export Live Products Catalog (.xlsx)
  const handleExportLiveCatalogXlsx = () => {
    try {
      const wb = generateLiveCatalogWorkbook(products, categories);
      downloadWorkbook(wb, `QualityPaan_Live_Store_Products_${new Date().toISOString().slice(0, 10)}.xlsx`);
      showToast(`Exported ${products.length} live products into categorized Excel workbook!`, 'success');
    } catch (err: any) {
      showToast(`Export error: ${err.message}`, 'error');
    }
  };

  // Export Live Products Catalog (.csv)
  const handleExportLiveCatalogCsv = () => {
    try {
      const wb = generateLiveCatalogWorkbook(products, categories);
      const masterSheet = wb.Sheets['All Store Products'];
      const csvData = XLSX.utils.sheet_to_csv(masterSheet);
      const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `QualityPaan_Live_Store_Products_${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      showToast(`Exported ${products.length} live products to CSV!`, 'success');
    } catch (err: any) {
      showToast(`Export error: ${err.message}`, 'error');
    }
  };

  // Filter parsed rows by sheet
  const uniqueSheets = Array.from(new Set(parsedRows.map(r => r.sheetSource)));
  const filteredRows = parsedRows.filter(r => selectedSheetFilter === 'all' || r.sheetSource === selectedSheetFilter);

  // Update specific row cell
  const handleUpdateRowCell = (tempId: string, field: keyof ParsedProductRow, value: any) => {
    setParsedRows(prev => prev.map(r => r.tempId === tempId ? { ...r, [field]: value } : r));
  };

  // Delete single row from preview
  const handleDeleteParsedRow = (tempId: string) => {
    setParsedRows(prev => prev.filter(r => r.tempId !== tempId));
  };

  return (
    <div 
      onDragOver={(e) => { e.preventDefault(); setIsDraggingOver(true); }}
      onDragLeave={() => setIsDraggingOver(false)}
      onDrop={handleDrop}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto animate-fadeIn"
    >
      <div className={`relative w-full max-w-5xl bg-[#121212] rounded-3xl border ${isDraggingOver ? 'border-[#2ECC71] shadow-[0_0_50px_rgba(46,204,113,0.4)]' : 'border-[#D4AF37]/50 shadow-[0_20px_60px_rgba(0,0,0,0.95)]'} flex flex-col max-h-[92vh] overflow-hidden transition-all`}>
        
        {/* Top Header */}
        <div className="flex items-center justify-between p-5 sm:p-6 border-b border-[#252525] bg-gradient-to-r from-[#1A160A] via-[#141208] to-[#121212]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center text-[#E5C158] shadow">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-royal text-base sm:text-lg font-bold text-[#E5C158] flex items-center gap-2">
                <span>Excel &amp; CSV Bulk Product Listing Suite</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#D4AF37] text-black uppercase">
                  Multi-Category Sheets
                </span>
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">
                Export blank templates, import multi-category Excel sheets, auto-match folder images, and export live store catalog.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-[#1F1F1F] hover:bg-[#333] text-gray-400 hover:text-white flex items-center justify-center border border-[#333] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Sub-Tabs */}
        <div className="flex items-center gap-2 px-6 pt-3 pb-2 bg-[#161616] border-b border-[#252525] overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('import')}
            className={`px-4 py-2 rounded-xl text-xs font-royal font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'import'
                ? 'bg-[#D4AF37] text-black shadow-md'
                : 'bg-[#1F1F1F] text-gray-400 hover:text-white border border-[#2E2E2E]'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>1. Import Excel / CSV to List Products</span>
            {parsedRows.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-black text-[#D4AF37] font-bold">
                {parsedRows.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('export')}
            className={`px-4 py-2 rounded-xl text-xs font-royal font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'export'
                ? 'bg-[#D4AF37] text-black shadow-md'
                : 'bg-[#1F1F1F] text-gray-400 hover:text-white border border-[#2E2E2E]'
            }`}
          >
            <Download className="w-3.5 h-3.5" />
            <span>2. Export Blank Templates &amp; Live Catalog</span>
          </button>

          <button
            onClick={() => setActiveTab('guide')}
            className={`px-4 py-2 rounded-xl text-xs font-royal font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'guide'
                ? 'bg-[#D4AF37] text-black shadow-md'
                : 'bg-[#1F1F1F] text-gray-400 hover:text-white border border-[#2E2E2E]'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Excel Format &amp; Image Guide</span>
          </button>
        </div>

        {/* Main Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">

          {/* ========================================================================= */}
          {/* TAB 1: IMPORT EXCEL / CSV / ZIP TO LIST PRODUCTS */}
          {/* ========================================================================= */}
          {activeTab === 'import' && (
            <div className="space-y-6">

              {/* All-in-One ZIP Package Uploader Card */}
              <div 
                className={`p-5 rounded-2xl bg-gradient-to-r from-[#1E1908] via-[#161307] to-[#121212] border-2 border-dashed ${
                  isDraggingOver ? 'border-[#2ECC71] bg-[#142618]' : 'border-[#D4AF37] hover:border-[#F3CE65]'
                } transition-all space-y-3 shadow-[0_4px_30px_rgba(212,175,55,0.18)]`}
              >
                <input
                  ref={zipInputRef}
                  type="file"
                  accept=".zip,application/zip,application/x-zip-compressed"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) handleZipFile(f);
                  }}
                  className="hidden"
                />

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-[#D4AF37]/20 border border-[#D4AF37]/50 flex items-center justify-center text-[#E5C158] flex-shrink-0 shadow-lg">
                      <Package className="w-6 h-6 text-[#D4AF37]" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-royal text-sm sm:text-base font-bold text-white">
                          ⭐ Instant ZIP Package Uploader (Recommended)
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-[#D4AF37] text-black uppercase tracking-wider">
                          Excel + Photos All-in-One
                        </span>
                      </div>
                      <p className="text-xs text-gray-300 mt-1 max-w-2xl leading-relaxed">
                        Upload or drop your <span className="text-[#E5C158] font-semibold">.ZIP file</span> containing your multi-sheet Excel file (<span className="text-white font-mono text-[11px]">QualityPaan_Blank_Product_Listing_Template_2026-10-07.xlsx</span>) and product photos (<span className="text-[#E5C158] font-mono text-[11px]">QT-mya02</span> for <span className="text-white font-semibold">OT MYA</span>, etc.). Auto-extracts and matches everything in seconds!
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      type="button"
                      onClick={() => zipInputRef.current?.click()}
                      className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] via-[#E5C158] to-[#C59B27] hover:brightness-110 text-black text-xs font-royal font-extrabold flex items-center gap-2 shadow-xl transition-all cursor-pointer hover:scale-[1.02]"
                    >
                      <Upload className="w-4 h-4" />
                      <span>Choose .ZIP File</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleLoadOtMyaSample}
                      className="px-3 py-2.5 rounded-xl bg-[#222] hover:bg-[#333] text-gray-200 border border-[#444] text-[11px] font-royal font-medium flex items-center gap-1.5 transition-all cursor-pointer"
                      title="Load a sample showing OT MYA with QT-mya02"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>Try OT MYA Preset</span>
                    </button>
                  </div>
                </div>

                {zipInfo && (
                  <div className="p-3 rounded-xl bg-[#0D2112] border border-[#2ECC71]/50 flex items-center justify-between text-xs text-[#2ECC71] flex-wrap gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <CheckCircle2 className="w-4 h-4 text-[#2ECC71] flex-shrink-0" />
                      <span className="font-bold text-white">ZIP Unpacked:</span>
                      <span className="font-mono text-gray-200">{zipInfo.fileName}</span>
                      <span className="text-gray-500">•</span>
                      <span>Workbook: <strong className="text-white">{zipInfo.excelFileName}</strong></span>
                      <span className="text-gray-500">•</span>
                      <span>Photos Extracted: <strong className="text-white">{zipInfo.imageCount}</strong></span>
                      <span className="text-gray-500">•</span>
                      <span>Photos Auto-Matched: <strong className="text-[#2ECC71]">{zipInfo.matchedCount}</strong></span>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-[#2ECC71]/20 font-bold border border-[#2ECC71]/30">
                      Ready to Import ✓
                    </span>
                  </div>
                )}
              </div>

              {/* Step 1 & 2 Upload Grid (Separate Files) */}
              <div className="text-[11px] text-gray-400 font-royal uppercase tracking-wider flex items-center gap-2 before:h-px before:flex-1 before:bg-[#2A2A2A] after:h-px after:flex-1 after:bg-[#2A2A2A]">
                <span>Or Upload Excel &amp; Photos Separately</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* 1. Upload Excel / CSV File */}
                <div className="p-5 rounded-2xl bg-[#171717] border border-[#2F2F2F] hover:border-[#D4AF37]/40 transition-all space-y-3 shadow-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-royal font-bold text-[#E5C158] flex items-center gap-2">
                      <FileSpreadsheet className="w-4 h-4 text-[#D4AF37]" />
                      Step 1: Upload Excel (.xlsx) or CSV File *
                    </span>
                    {selectedFile && (
                      <span className="text-[10px] px-2 py-0.5 rounded bg-[#2ECC71]/20 text-[#2ECC71] border border-[#2ECC71]/40 font-semibold">
                        Loaded ✓
                      </span>
                    )}
                  </div>

                  <p className="text-[11px] text-gray-400">
                    Upload your filled multi-sheet Excel file or CSV. Categories are automatically detected from sheet names or category column.
                  </p>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".xlsx,.xls,.csv,.zip"
                    onChange={handleFileUpload}
                    className="hidden"
                  />

                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="p-4 rounded-xl border-2 border-dashed border-[#444] hover:border-[#D4AF37] bg-[#111] flex flex-col items-center justify-center text-center cursor-pointer transition-all hover:bg-[#1A180E] group"
                  >
                    <Upload className="w-7 h-7 text-[#D4AF37] mb-2 group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-bold text-white group-hover:text-[#E5C158]">
                      {selectedFile ? selectedFile.name : 'Click to Select Excel / CSV / ZIP File'}
                    </span>
                    <span className="text-[10px] text-gray-500 mt-0.5">
                      Supports .zip (all-in-one package), .xlsx (with multiple category sheets), .xls, and .csv
                    </span>
                  </div>
                </div>

                {/* 2. Bulk Image Upload / Folder Matcher */}
                <div className="p-5 rounded-2xl bg-[#171717] border border-[#2F2F2F] hover:border-[#D4AF37]/40 transition-all space-y-3 shadow-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-royal font-bold text-[#E5C158] flex items-center gap-2">
                      <ImageIcon className="w-4 h-4 text-[#D4AF37]" />
                      Step 2: Upload Product Photos / Images (Optional)
                    </span>
                    {uploadedImagesCount > 0 && (
                      <span className="text-[10px] px-2 py-0.5 rounded bg-[#2ECC71]/20 text-[#2ECC71] border border-[#2ECC71]/40 font-semibold">
                        {uploadedImagesCount} Photos Loaded ✓
                      </span>
                    )}
                  </div>

                  <p className="text-[11px] text-gray-400">
                    Select images from your computer or folder. Filenames matching the Excel image column (e.g. <code>hookah_gold.jpg</code>) will auto-link!
                  </p>

                  <input
                    ref={imageFilesInputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleBulkImagesUpload}
                    className="hidden"
                  />

                  <input
                    ref={folderInputRef}
                    type="file"
                    // @ts-ignore
                    webkitdirectory=""
                    // @ts-ignore
                    directory=""
                    multiple
                    onChange={handleBulkImagesUpload}
                    className="hidden"
                  />

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => imageFilesInputRef.current?.click()}
                      className="p-3 rounded-xl border border-[#3A3A3A] hover:border-[#D4AF37] bg-[#111] flex flex-col items-center justify-center text-center cursor-pointer transition-all hover:bg-[#1A180E]"
                    >
                      <ImageIcon className="w-5 h-5 text-[#D4AF37] mb-1" />
                      <span className="text-[11px] font-bold text-white">Select Images Files</span>
                      <span className="text-[9px] text-gray-500">Pick multiple photos</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => folderInputRef.current?.click()}
                      className="p-3 rounded-xl border border-[#3A3A3A] hover:border-[#D4AF37] bg-[#111] flex flex-col items-center justify-center text-center cursor-pointer transition-all hover:bg-[#1A180E]"
                    >
                      <FolderPlus className="w-5 h-5 text-[#D4AF37] mb-1" />
                      <span className="text-[11px] font-bold text-white">Select Image Folder</span>
                      <span className="text-[9px] text-gray-500">Upload entire photo folder</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Parsing Progress / Loading Spinner */}
              {isParsing && (
                <div className="p-8 rounded-2xl bg-[#151515] border border-[#333] flex items-center justify-center gap-3 text-sm text-[#E5C158] animate-pulse">
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  <span>Reading and parsing Excel category sheets &amp; product rows...</span>
                </div>
              )}

              {/* Interactive Inspection Table */}
              {parsedRows.length > 0 && !isParsing && (
                <div className="space-y-4">

                  {/* Non-Destructive Catalog Protection Banner & Merge Policy */}
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-[#0D1F12] via-[#112316] to-[#141E15] border border-[#2ECC71]/50 shadow-lg space-y-3">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                      <div className="flex items-start sm:items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-[#2ECC71]/20 border border-[#2ECC71]/40 flex items-center justify-center text-[#2ECC71] flex-shrink-0">
                          <CheckCircle2 className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-royal text-xs sm:text-sm font-bold text-white flex items-center gap-1.5 flex-wrap">
                            <span>🛡️ Safe Import Guarantee:</span>
                            <span className="text-[#2ECC71] font-extrabold">All {products.length} Existing Products will NOT be replaced</span>
                          </h4>
                          <p className="text-[11px] text-gray-300">
                            Products already present in your store will remain exactly as they are. Choose your listing merge mode:
                          </p>
                        </div>
                      </div>

                      {/* Merge Mode Radio Selector */}
                      <div className="flex items-center gap-1.5 bg-[#0C170E] p-1.5 rounded-xl border border-[#2ECC71]/30 flex-wrap">
                        <button
                          type="button"
                          onClick={() => setMergeMode('append')}
                          className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                            mergeMode === 'append'
                              ? 'bg-[#2ECC71] text-black shadow font-extrabold'
                              : 'text-gray-300 hover:text-white'
                          }`}
                          title="Add all products from Excel, keeping all existing store items untouched"
                        >
                          🛡️ Append &amp; Keep All
                        </button>

                        <button
                          type="button"
                          onClick={() => setMergeMode('skip_duplicates')}
                          className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                            mergeMode === 'skip_duplicates'
                              ? 'bg-[#D4AF37] text-black shadow font-extrabold'
                              : 'text-gray-300 hover:text-white'
                          }`}
                          title="Only add new products; if a product title already exists in store, leave it untouched"
                        >
                          🔍 Skip Existing
                        </button>

                        <button
                          type="button"
                          onClick={() => setMergeMode('update_duplicates')}
                          className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                            mergeMode === 'update_duplicates'
                              ? 'bg-blue-500 text-black shadow font-extrabold'
                              : 'text-gray-300 hover:text-white'
                          }`}
                          title="Update details of existing matching items, without touching any other items"
                        >
                          🔄 Update Existing
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Category Sheet Filter & Summary Bar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-gradient-to-r from-[#1B180A] to-[#121212] border border-[#D4AF37]/40 shadow-xl">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-royal font-bold text-white">Filter by Sheet / Category:</span>
                      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                        <button
                          type="button"
                          onClick={() => setSelectedSheetFilter('all')}
                          className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                            selectedSheetFilter === 'all'
                              ? 'bg-[#D4AF37] text-black'
                              : 'bg-[#1C1C1C] text-gray-300 hover:text-white border border-[#333]'
                          }`}
                        >
                          All Sheets ({parsedRows.length})
                        </button>
                        {uniqueSheets.map(sheet => (
                          <button
                            key={sheet}
                            type="button"
                            onClick={() => setSelectedSheetFilter(sheet)}
                            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                              selectedSheetFilter === sheet
                                ? 'bg-[#D4AF37] text-black'
                                : 'bg-[#1C1C1C] text-gray-300 hover:text-white border border-[#333]'
                            }`}
                          >
                            {sheet} ({parsedRows.filter(r => r.sheetSource === sheet).length})
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleConfirmImport}
                        disabled={isImporting}
                        className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#2ECC71] to-[#27AE60] hover:brightness-110 text-black font-royal font-bold text-xs flex items-center gap-2 shadow-lg cursor-pointer transition-all active:scale-95"
                      >
                        {isImporting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                        <span>Confirm &amp; List All {parsedRows.length} Products &rarr;</span>
                      </button>
                    </div>
                  </div>

                  {/* Products Preview Table */}
                  <div className="rounded-2xl bg-[#121212] border border-[#2B2B2B] overflow-hidden shadow-2xl">
                    <div className="overflow-x-auto max-h-[420px]">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-[#181818] border-b border-[#2A2A2A] text-[#A89050] uppercase text-[10px] tracking-wider sticky top-0 z-10 shadow-sm">
                          <tr>
                            <th className="py-3 px-3">Photo &amp; Match</th>
                            <th className="py-3 px-3">Product Title &amp; Catalog Status</th>
                            <th className="py-3 px-3">Category / Sheet</th>
                            <th className="py-3 px-3">Selling Price (₹)</th>
                            <th className="py-3 px-3">MRP / Cost</th>
                            <th className="py-3 px-3">Stock</th>
                            <th className="py-3 px-3">Pack Options</th>
                            <th className="py-3 px-3 text-right">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#1F1F1F]">
                          {filteredRows.map((row) => {
                            const isAlreadyInCatalog = products.some(
                              p => p.name.toLowerCase().trim() === row.name.toLowerCase().trim()
                            );

                            return (
                            <tr key={row.tempId} className="hover:bg-[#171717] transition-colors">
                              {/* Photo Preview & Match status */}
                              <td className="py-3 px-3">
                                <div className="flex items-center gap-2">
                                  <div className="relative group">
                                    <img 
                                      src={row.resolvedImageUrl} 
                                      alt={row.name} 
                                      className="w-11 h-11 rounded-lg object-cover bg-black border border-[#333]" 
                                    />
                                    {row.hasCustomImage ? (
                                      <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-[#2ECC71] text-black flex items-center justify-center text-[8px] font-bold" title="Matched to uploaded image">
                                        ✓
                                      </span>
                                    ) : (
                                      <span className="absolute -top-1 -right-1 px-1 py-0.2 rounded bg-amber-500 text-black text-[7px] font-bold" title="Using category fallback image">
                                        AUTO
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </td>

                              {/* Title & Status Badge */}
                              <td className="py-3 px-3">
                                <div className="flex items-center gap-1.5 mb-1">
                                  {isAlreadyInCatalog ? (
                                    <span className="px-2 py-0.2 rounded-full text-[9px] font-bold bg-[#182535] text-[#3498DB] border border-[#3498DB]/40 font-mono">
                                      ✓ ALREADY IN STORE (PRESERVED)
                                    </span>
                                  ) : (
                                    <span className="px-2 py-0.2 rounded-full text-[9px] font-bold bg-[#142A16] text-[#2ECC71] border border-[#2ECC71]/40 font-mono">
                                      + NEW PRODUCT
                                    </span>
                                  )}
                                </div>
                                <input
                                  type="text"
                                  value={row.name}
                                  onChange={(e) => handleUpdateRowCell(row.tempId, 'name', e.target.value)}
                                  className="w-full bg-[#181818] px-2.5 py-1 rounded border border-[#333] text-white text-xs font-semibold focus:border-[#D4AF37]"
                                />
                                <span className="text-[10px] text-gray-500 truncate block mt-0.5 max-w-[220px]">
                                  {row.shortDescription}
                                </span>
                              </td>

                              {/* Category */}
                              <td className="py-3 px-3">
                                <select
                                  value={row.category}
                                  onChange={(e) => handleUpdateRowCell(row.tempId, 'category', e.target.value)}
                                  className="bg-[#181818] px-2 py-1 rounded border border-[#333] text-[#E5C158] text-[11px] font-semibold"
                                >
                                  {categories.map(c => (
                                    <option key={c.id} value={c.id}>{c.displayName}</option>
                                  ))}
                                </select>
                                <span className="text-[9px] text-gray-400 block mt-0.5">Sheet: {row.sheetSource}</span>
                              </td>

                              {/* Selling Price */}
                              <td className="py-3 px-3">
                                <div className="relative w-24">
                                  <span className="absolute left-2 top-1 text-gray-500">₹</span>
                                  <input
                                    type="number"
                                    value={row.price}
                                    onChange={(e) => handleUpdateRowCell(row.tempId, 'price', Number(e.target.value))}
                                    className="w-full bg-[#181818] pl-5 pr-1 py-1 rounded border border-[#333] text-[#2ECC71] text-xs font-bold"
                                  />
                                </div>
                              </td>

                              {/* MRP & Cost */}
                              <td className="py-3 px-3 text-[11px]">
                                <div className="space-y-0.5">
                                  <span className="text-gray-400 block">MRP: ₹{row.mrp}</span>
                                  <span className="text-amber-400 block">Cost: ₹{row.buyPrice}</span>
                                </div>
                              </td>

                              {/* Stock */}
                              <td className="py-3 px-3">
                                <input
                                  type="number"
                                  value={row.stock}
                                  onChange={(e) => handleUpdateRowCell(row.tempId, 'stock', Number(e.target.value))}
                                  className="w-16 bg-[#181818] px-2 py-1 rounded border border-[#333] text-white text-xs text-center"
                                />
                              </td>

                              {/* Pack Options */}
                              <td className="py-3 px-3">
                                {row.variants && row.variants.length > 0 ? (
                                  <span className="px-2 py-0.5 rounded bg-[#1F1F1F] text-gray-300 border border-[#333] text-[10px]">
                                    {row.variants.length} Sizes ({row.variants[0].name})
                                  </span>
                                ) : (
                                  <span className="text-[10px] text-gray-500">Single Pack</span>
                                )}
                              </td>

                              {/* Delete Row */}
                              <td className="py-3 px-3 text-right">
                                <button
                                  type="button"
                                  onClick={() => handleDeleteParsedRow(row.tempId)}
                                  className="p-1.5 text-gray-500 hover:text-red-400 hover:bg-[#252525] rounded transition-colors cursor-pointer"
                                  title="Remove from import"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
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
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 2: EXPORT BLANK TEMPLATES & LIVE CATALOG */}
          {/* ========================================================================= */}
          {activeTab === 'export' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* 1. Blank Excel Template (.xlsx) */}
                <div className="p-6 rounded-2xl bg-[#171717] border border-[#333] hover:border-[#D4AF37]/50 transition-all space-y-4 shadow-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center text-[#E5C158]">
                      <FileSpreadsheet className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-royal text-sm font-bold text-[#E5C158]">
                        Blank Excel Listing Template (.xlsx)
                      </h4>
                      <p className="text-[11px] text-gray-400">
                        Contains separate categorized sheets for each product category with pre-built column headers.
                      </p>
                    </div>
                  </div>

                  <ul className="space-y-1.5 text-xs text-gray-300 bg-[#111] p-3.5 rounded-xl border border-[#262626]">
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-[#2ECC71]" />
                      <span>Individual sheets: Hookahs, Flavours, Bongs, Papers, Paan, etc.</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-[#2ECC71]" />
                      <span>Ready formatted columns with sample guide rows</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-[#2ECC71]" />
                      <span>Fill in your details in blank rows and upload</span>
                    </li>
                  </ul>

                  <button
                    type="button"
                    onClick={handleExportBlankXlsx}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#F3D079] via-[#D4AF37] to-[#B38C1B] text-black font-royal font-bold text-xs flex items-center justify-center gap-2 shadow-lg hover:brightness-110 cursor-pointer transition-all active:scale-95"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Blank Excel (.xlsx) Template</span>
                  </button>
                </div>

                {/* 2. Blank CSV Template (.csv) */}
                <div className="p-6 rounded-2xl bg-[#171717] border border-[#333] hover:border-[#D4AF37]/50 transition-all space-y-4 shadow-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#2ECC71]/20 border border-[#2ECC71]/40 flex items-center justify-center text-[#2ECC71]">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-royal text-sm font-bold text-white">
                        Blank CSV Master Template (.csv)
                      </h4>
                      <p className="text-[11px] text-gray-400">
                        Single universal CSV spreadsheet suitable for Google Sheets or Excel single-sheet upload.
                      </p>
                    </div>
                  </div>

                  <ul className="space-y-1.5 text-xs text-gray-300 bg-[#111] p-3.5 rounded-xl border border-[#262626]">
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-[#2ECC71]" />
                      <span>Standard UTF-8 comma-separated format</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-[#2ECC71]" />
                      <span>Supports all products in a single unified table</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-[#2ECC71]" />
                      <span>Compatible with any spreadsheet editor</span>
                    </li>
                  </ul>

                  <button
                    type="button"
                    onClick={handleExportBlankCsv}
                    className="w-full py-2.5 rounded-xl bg-[#222] hover:bg-[#D4AF37] text-[#E5C158] hover:text-black border border-[#D4AF37]/50 font-royal font-bold text-xs flex items-center justify-center gap-2 shadow cursor-pointer transition-all"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Blank CSV Template</span>
                  </button>
                </div>

                {/* 3. Export Live Storefront Catalog (.xlsx) */}
                <div className="p-6 rounded-2xl bg-[#171717] border border-[#333] hover:border-[#D4AF37]/50 transition-all space-y-4 shadow-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                      <Layers className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-royal text-sm font-bold text-[#E5C158]">
                        Export Live Catalog (.xlsx)
                      </h4>
                      <p className="text-[11px] text-gray-400">
                        Download all current {products.length} active products categorized into sheets with live prices &amp; inventory.
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleExportLiveCatalogXlsx}
                    className="w-full py-2.5 rounded-xl bg-[#2A200B] hover:bg-[#D4AF37] text-[#E5C158] hover:text-black border border-[#D4AF37]/50 font-royal font-bold text-xs flex items-center justify-center gap-2 shadow cursor-pointer transition-all"
                  >
                    <Download className="w-4 h-4" />
                    <span>Export Live Products Workbook ({products.length} Items)</span>
                  </button>
                </div>

                {/* 4. Export Live Storefront Catalog (.csv) */}
                <div className="p-6 rounded-2xl bg-[#171717] border border-[#333] hover:border-[#D4AF37]/50 transition-all space-y-4 shadow-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
                      <Table className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-royal text-sm font-bold text-white">
                        Export Live Catalog (.csv)
                      </h4>
                      <p className="text-[11px] text-gray-400">
                        Universal single-file CSV archive of all {products.length} products.
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleExportLiveCatalogCsv}
                    className="w-full py-2.5 rounded-xl bg-[#161D26] hover:bg-blue-500 text-blue-300 hover:text-black border border-blue-500/40 font-royal font-bold text-xs flex items-center justify-center gap-2 shadow cursor-pointer transition-all"
                  >
                    <Download className="w-4 h-4" />
                    <span>Export Live Products CSV</span>
                  </button>
                </div>

              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 3: EXCEL FORMAT & IMAGE GUIDE */}
          {/* ========================================================================= */}
          {activeTab === 'guide' && (
            <div className="space-y-6 text-xs text-gray-300">
              <div className="p-5 rounded-2xl bg-[#171717] border border-[#2E2E2E] space-y-3">
                <h4 className="font-royal text-sm font-bold text-[#E5C158] flex items-center gap-2">
                  <Info className="w-4 h-4 text-[#D4AF37]" />
                  Relaxed &amp; Flexible Import Rules (No Strict Restrictions)
                </h4>
                <p>
                  You do not need to worry about rigid format rules or mandatory fields blocking your upload. If any optional field is empty, the system automatically fills sensible defaults:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-2">
                  <div className="p-3 rounded-xl bg-[#111] border border-[#222]">
                    <strong className="text-white block mb-0.5">Missing Category</strong>
                    <span className="text-gray-400">Detected from sheet name or assigned to default.</span>
                  </div>
                  <div className="p-3 rounded-xl bg-[#111] border border-[#222]">
                    <strong className="text-white block mb-0.5">Missing Images</strong>
                    <span className="text-gray-400">Assigned high-res category aesthetic default photo.</span>
                  </div>
                  <div className="p-3 rounded-xl bg-[#111] border border-[#222]">
                    <strong className="text-white block mb-0.5">Missing SKU / IDs</strong>
                    <span className="text-gray-400">Auto-generated with unique royal SKU format.</span>
                  </div>
                </div>
              </div>

              {/* Column Descriptions Table */}
              <div className="p-5 rounded-2xl bg-[#171717] border border-[#2E2E2E] space-y-3">
                <h4 className="font-royal text-sm font-bold text-[#E5C158]">
                  Excel Sheet Columns &amp; Syntax Reference
                </h4>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#111] text-gray-400 uppercase text-[10px]">
                      <tr>
                        <th className="p-2.5">Column Name</th>
                        <th className="p-2.5">Example Value</th>
                        <th className="p-2.5">Description &amp; Behavior</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#222]">
                      <tr>
                        <td className="p-2.5 font-bold text-white">Product Title</td>
                        <td className="p-2.5 font-mono text-[#D4AF37]">24K Gold Egyptian Hookah</td>
                        <td className="p-2.5 text-gray-400">Main title displayed in the storefront catalog.</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-bold text-white">Base Selling Price</td>
                        <td className="p-2.5 font-mono text-[#2ECC71]">2499</td>
                        <td className="p-2.5 text-gray-400">The selling price in ₹ (currency symbols auto-stripped).</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-bold text-white">Image Filename or URL</td>
                        <td className="p-2.5 font-mono text-blue-400">hookah_gold.jpg</td>
                        <td className="p-2.5 text-gray-400">Filename of photo in your image folder, or full web URL.</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-bold text-white">Pack Options / Sizes</td>
                        <td className="p-2.5 font-mono text-amber-300">Small:1999:2500:20, Medium:2499:3200:30</td>
                        <td className="p-2.5 text-gray-400">Syntax: <code>OptionName:Price:MRP:Stock</code> (comma separated).</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-bold text-white">Ingredients</td>
                        <td className="p-2.5 font-mono text-gray-300">Rose Gulkand, Calcutta Leaf, Kesar</td>
                        <td className="p-2.5 text-gray-400">Comma-separated ingredients for Paan and herbal flavours.</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between p-4 px-6 border-t border-[#252525] bg-[#141414]">
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <Sparkles className="w-4 h-4 text-[#D4AF37]" />
            <span>Storefront Catalog Active Items: <strong className="text-white">{products.length} Products</strong></span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#222] hover:bg-[#333] text-gray-300 hover:text-white text-xs font-semibold cursor-pointer transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
