import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  RotateCcw, 
  Download, 
  Upload, 
  HardDrive, 
  Database, 
  X, 
  CheckCircle2, 
  AlertTriangle, 
  FileText, 
  Sparkles,
  ExternalLink,
  Copy,
  RefreshCw
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Product } from '../../types';

interface ProductRecoveryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface DiscoveredKeyInfo {
  key: string;
  itemCount: number;
  previewNames: string[];
}

export const ProductRecoveryModal: React.FC<ProductRecoveryModalProps> = ({ isOpen, onClose }) => {
  const { 
    products, 
    recoverAllProductsFromStorage, 
    importProductsJson, 
    exportProductsJson, 
    showToast 
  } = useApp();

  const [discoveredKeys, setDiscoveredKeys] = useState<DiscoveredKeyInfo[]>([]);
  const [totalDiscoveredProducts, setTotalDiscoveredProducts] = useState(0);
  const [serverProductCount, setServerProductCount] = useState<number | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [jsonInput, setJsonInput] = useState('');
  const [showJsonInput, setShowJsonInput] = useState(false);

  // Scan localStorage for any product lists
  const scanStorage = () => {
    setIsScanning(true);
    if (typeof window === 'undefined') {
      setIsScanning(false);
      return;
    }

    const found: DiscoveredKeyInfo[] = [];
    const allUniqueNames = new Set<string>();

    const targetKeys = [
      'qp_products_v5', 'qp_products_v4', 'qp_products_v3', 'qp_products_v2', 'qp_products_v1',
      'qp_products', 'products', 'qp_custom_products', 'custom_products', 'qp_user_products',
      'qp_catalog', 'qp_backup_products', 'qp_products_backup_before_reset', 'catalog'
    ];

    // Check specific keys
    for (const key of targetKeys) {
      try {
        const val = localStorage.getItem(key);
        if (val) {
          const parsed = JSON.parse(val);
          const list = Array.isArray(parsed) ? parsed : (parsed?.products || []);
          if (Array.isArray(list) && list.length > 0) {
            const valid = list.filter((p: any) => p && typeof p === 'object' && p.name);
            if (valid.length > 0) {
              valid.forEach((p: any) => allUniqueNames.add(p.name));
              found.push({
                key,
                itemCount: valid.length,
                previewNames: valid.slice(0, 3).map((p: any) => p.name)
              });
            }
          }
        }
      } catch {}
    }

    // Check any other key in localStorage
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && !targetKeys.includes(k)) {
          try {
            const raw = localStorage.getItem(k);
            if (raw && (raw.startsWith('[') || raw.startsWith('{'))) {
              const parsed = JSON.parse(raw);
              const list = Array.isArray(parsed) ? parsed : (parsed?.products || parsed?.items || []);
              if (Array.isArray(list) && list.length > 0) {
                const valid = list.filter((p: any) => p && typeof p === 'object' && p.name && (p.price !== undefined || p.sku));
                if (valid.length > 0) {
                  valid.forEach((p: any) => allUniqueNames.add(p.name));
                  found.push({
                    key: k,
                    itemCount: valid.length,
                    previewNames: valid.slice(0, 3).map((p: any) => p.name)
                  });
                }
              }
            }
          } catch {}
        }
      }
    } catch {}

    setDiscoveredKeys(found);
    setTotalDiscoveredProducts(allUniqueNames.size);

    // Also check server disk
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        if (data && data.success && Array.isArray(data.products)) {
          setServerProductCount(data.products.length);
        } else {
          setServerProductCount(0);
        }
      })
      .catch(() => setServerProductCount(0))
      .finally(() => setIsScanning(false));
  };

  useEffect(() => {
    if (isOpen) {
      scanStorage();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleRecover = () => {
    const res = recoverAllProductsAllKeys();
    scanStorage();
  };

  const recoverAllProductsAllKeys = () => {
    return recoverAllProductsFromStorage();
  };

  const handleDownloadBackup = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(exportProductsJson());
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `quality_paan_catalog_backup_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Catalog backup JSON downloaded to your computer!', 'success');
  };

  const handleCopyBackup = () => {
    navigator.clipboard.writeText(exportProductsJson());
    showToast('Catalog backup JSON copied to clipboard!', 'success');
  };

  const handleImportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!jsonInput.trim()) {
      showToast('Please paste valid JSON product data.', 'warning');
      return;
    }
    const res = importProductsJson(jsonInput.trim());
    if (res.success) {
      setJsonInput('');
      setShowJsonInput(false);
      scanStorage();
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const res = importProductsJson(content);
        if (res.success) {
          scanStorage();
        }
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="bg-[#121212] border-2 border-[#D4AF37]/50 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl space-y-6 p-6">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-[#252525] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[#2A1E06] border border-[#D4AF37]/50 text-[#E5C158] flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-royal text-xl font-bold text-[#E5C158] flex items-center gap-2">
                <span>Product Recovery &amp; Data Safeguard</span>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-[#162A17] text-[#2ECC71] border border-[#2ECC71]/40">
                  Universal Scanner
                </span>
              </h2>
              <p className="text-xs text-gray-400">
                Instantly scan and recover products created across any storage key, session, or device
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

        {/* Current Status Box */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-4 rounded-xl bg-[#181818] border border-[#2D2D2D] space-y-1">
            <span className="text-gray-400 block">Active Store Catalog</span>
            <span className="font-royal text-xl font-bold text-white">{products.length} products</span>
            <span className="text-[10px] text-emerald-400 block">Currently loaded in app</span>
          </div>

          <div className="p-4 rounded-xl bg-[#181818] border border-[#2D2D2D] space-y-1">
            <span className="text-gray-400 block">Browser Storage Keys</span>
            <span className="font-royal text-xl font-bold text-[#E5C158]">{discoveredKeys.length} sources found</span>
            <span className="text-[10px] text-gray-300 block">{totalDiscoveredProducts} unique items detected</span>
          </div>

          <div className="p-4 rounded-xl bg-[#181818] border border-[#2D2D2D] space-y-1">
            <span className="text-gray-400 block">Server Disk Backup</span>
            <span className="font-royal text-xl font-bold text-[#3498DB]">
              {serverProductCount !== null ? `${serverProductCount} items` : 'Checking...'}
            </span>
            <span className="text-[10px] text-gray-300 block">Permanent server file</span>
          </div>
        </div>

        {/* Action 1: One-Click Deep Storage Recovery */}
        <div className="p-5 rounded-xl bg-gradient-to-r from-[#17140B] via-[#1A160A] to-[#121212] border border-[#D4AF37]/50 space-y-3 shadow-lg">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-royal text-sm font-bold text-[#E5C158] flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                1-Click Deep Storage Recovery &amp; Re-Merge
              </h3>
              <p className="text-xs text-gray-300 mt-0.5">
                Scans all local storage versions (v1 through v5, backups, and custom keys) and merges all products.
              </p>
            </div>

            <button
              onClick={handleRecover}
              disabled={isScanning}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#F3D079] via-[#D4AF37] to-[#B38C1B] text-black font-royal font-bold text-xs flex items-center justify-center gap-2 hover:brightness-110 shadow-lg cursor-pointer transition-all active:scale-95 disabled:opacity-50"
            >
              <RotateCcw className={`w-4 h-4 ${isScanning ? 'animate-spin' : ''}`} />
              <span>{isScanning ? 'Scanning Storage...' : 'Recover All Products Now'}</span>
            </button>
          </div>

          {/* List of discovered storage sources */}
          {discoveredKeys.length > 0 && (
            <div className="pt-2 border-t border-[#333]/60 space-y-1.5">
              <span className="text-[11px] text-gray-400 font-semibold block">Detected Storage Locations in this browser:</span>
              <div className="space-y-1 max-h-36 overflow-y-auto pr-1">
                {discoveredKeys.map((dk) => (
                  <div key={dk.key} className="flex items-center justify-between p-2 rounded-lg bg-[#0F0F0F] border border-[#252525] text-[11px]">
                    <div className="flex items-center gap-2">
                      <HardDrive className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span className="font-mono text-gray-200">{dk.key}</span>
                      <span className="text-gray-400">({dk.itemCount} items)</span>
                    </div>
                    <span className="text-gray-400 text-[10px] truncate max-w-[200px]">
                      e.g. {dk.previewNames.join(', ')}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Action 2: Cross-URL Transfer Notice */}
        <div className="p-4 rounded-xl bg-[#141E28] border border-cyan-500/30 text-xs space-y-2">
          <div className="flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-cyan-200">
                Important: Listed products on a different URL or browser profile?
              </p>
              <p className="text-gray-300 text-[11px] mt-1 leading-relaxed">
                Web browsers keep local storage strictly separate between different URLs (for example, between the Development App URL and Shared App URL). If you spent time adding products on the Shared Preview URL:
              </p>
              <ol className="list-decimal list-inside text-gray-300 text-[11px] mt-1 space-y-1 pl-1">
                <li>Open the URL where you originally listed the products.</li>
                <li>Click <strong>&quot;Export Full Backup (JSON)&quot;</strong> below or copy the catalog.</li>
                <li>Open this screen and click <strong>&quot;Import Products JSON&quot;</strong> to instantly transfer all products.</li>
              </ol>
            </div>
          </div>
        </div>

        {/* Action 3: JSON Import & Export Tools */}
        <div className="space-y-3">
          <h3 className="font-royal text-sm font-bold text-white flex items-center gap-2">
            <Database className="w-4 h-4 text-[#D4AF37]" />
            Universal Backup, Import &amp; Export
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              onClick={handleDownloadBackup}
              className="p-3.5 rounded-xl bg-[#181818] border border-[#333] hover:border-[#D4AF37] text-left space-y-1 transition-all group"
            >
              <div className="flex items-center gap-2 text-[#E5C158] font-royal font-bold text-xs">
                <Download className="w-4 h-4 text-[#D4AF37] group-hover:-translate-y-0.5 transition-transform" />
                <span>Download JSON File</span>
              </div>
              <p className="text-[11px] text-gray-400">Save a copy to your computer disk</p>
            </button>

            <button
              onClick={handleCopyBackup}
              className="p-3.5 rounded-xl bg-[#181818] border border-[#333] hover:border-[#D4AF37] text-left space-y-1 transition-all group"
            >
              <div className="flex items-center gap-2 text-[#E5C158] font-royal font-bold text-xs">
                <Copy className="w-4 h-4 text-[#D4AF37] group-hover:scale-110 transition-transform" />
                <span>Copy JSON to Clipboard</span>
              </div>
              <p className="text-[11px] text-gray-400">Quickly transfer between windows</p>
            </button>

            <label className="p-3.5 rounded-xl bg-[#181818] border border-[#333] hover:border-[#D4AF37] text-left space-y-1 transition-all group cursor-pointer block">
              <div className="flex items-center gap-2 text-[#2ECC71] font-royal font-bold text-xs">
                <Upload className="w-4 h-4 text-[#2ECC71] group-hover:-translate-y-0.5 transition-transform" />
                <span>Upload JSON Backup</span>
              </div>
              <p className="text-[11px] text-gray-400">Select .json file from your PC</p>
              <input
                type="file"
                accept=".json,application/json"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>

          {/* Paste JSON manually */}
          <div className="pt-2">
            {!showJsonInput ? (
              <button
                type="button"
                onClick={() => setShowJsonInput(true)}
                className="text-xs text-[#E5C158] hover:underline flex items-center gap-1.5"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Or paste raw JSON product backup text manually</span>
              </button>
            ) : (
              <form onSubmit={handleImportSubmit} className="space-y-2 pt-1">
                <textarea
                  value={jsonInput}
                  onChange={(e) => setJsonInput(e.target.value)}
                  placeholder="Paste your exported product JSON array here..."
                  rows={4}
                  className="w-full bg-[#181818] border border-[#3A3A3A] rounded-xl p-3 text-xs font-mono text-white focus:outline-none focus:border-[#D4AF37]"
                />
                <div className="flex items-center gap-2">
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-[#D4AF37] text-black font-royal font-bold text-xs hover:brightness-110"
                  >
                    Import &amp; Restore Products
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setJsonInput('');
                      setShowJsonInput(false);
                    }}
                    className="px-3 py-2 rounded-xl bg-[#222] text-gray-300 text-xs hover:bg-[#333]"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-[#252525] text-xs">
          <span className="text-gray-400 text-[11px]">
            Continuous server auto-sync active on every product edit &bull; No data lost
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#222] hover:bg-[#333] text-white font-royal font-bold text-xs transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
