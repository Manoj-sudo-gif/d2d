import React, { useState, useMemo } from 'react';
import {
  X,
  Search,
  Download,
  Copy,
  ExternalLink,
  Check,
  Maximize2,
  Minimize2,
  FileSpreadsheet,
  Filter,
  Eye,
} from 'lucide-react';
import {
  D2D_EAN_CODES,
  D2D_PRODUCT_DATA,
  D2D_IMAGE_DATA,
  D2D_PHOTO_TEAM_DATA,
  D2D_CREATIVE_DATA,
} from '../data/d2dSheetsData';

export type SheetTabId = 'ean' | 'inventory' | 'image' | 'photo' | 'creative';

interface D2DSheetModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: SheetTabId;
  customExternalUrl?: string;
}

export const D2DSheetModal: React.FC<D2DSheetModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'ean',
  customExternalUrl,
}) => {
  const [activeTab, setActiveTab] = useState<SheetTabId>(initialTab);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [selectedPreviewImage, setSelectedPreviewImage] = useState<string | null>(null);
  const [isMaximized, setIsMaximized] = useState(true);

  // Sync initialTab when modal opens
  React.useEffect(() => {
    if (isOpen && initialTab) {
      setActiveTab(initialTab);
      setSearchQuery('');
    }
  }, [isOpen, initialTab]);

  if (!isOpen) return null;

  // Filtered EAN Data
  const filteredEan = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return D2D_EAN_CODES.filter((code) => !q || code.toLowerCase().includes(q));
  }, [searchQuery]);

  // Filtered Product Data
  const filteredProducts = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return D2D_PRODUCT_DATA.filter((p) => {
      if (!q) return true;
      return (
        p.ean.toLowerCase().includes(q) ||
        p.productName.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.colour.toLowerCase().includes(q) ||
        p.toonLabel.toLowerCase().includes(q) ||
        p.size.toLowerCase().includes(q)
      );
    });
  }, [searchQuery]);

  // Filtered Image Data
  const filteredImages = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return D2D_IMAGE_DATA.filter((img) => {
      if (!q) return true;
      return (
        img.ean.toLowerCase().includes(q) ||
        img.productName.toLowerCase().includes(q) ||
        img.toonLabel.toLowerCase().includes(q) ||
        img.brand.toLowerCase().includes(q) ||
        img.color.toLowerCase().includes(q) ||
        img.photoStatus.toLowerCase().includes(q) ||
        img.itStatus.toLowerCase().includes(q)
      );
    });
  }, [searchQuery]);

  // Filtered Photo Team Data
  const filteredPhotoTeam = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return D2D_PHOTO_TEAM_DATA.filter((pt) => {
      if (!q) return true;
      return (
        pt.ean.toLowerCase().includes(q) ||
        pt.productName.toLowerCase().includes(q) ||
        pt.toonLabel.toLowerCase().includes(q) ||
        pt.brand.toLowerCase().includes(q) ||
        pt.color.toLowerCase().includes(q) ||
        pt.itStatus.toLowerCase().includes(q)
      );
    });
  }, [searchQuery]);

  // Filtered Creative Data
  const filteredCreative = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return D2D_CREATIVE_DATA.filter((c) => {
      if (!q) return true;
      return (
        c.ean.toLowerCase().includes(q) ||
        c.styleNo.toLowerCase().includes(q) ||
        c.productName.toLowerCase().includes(q) ||
        c.brand.toLowerCase().includes(q) ||
        c.color.toLowerCase().includes(q)
      );
    });
  }, [searchQuery]);

  // Tab configurations
  const tabs: { id: SheetTabId; label: string; count: number; color: string }[] = [
    { id: 'ean', label: 'EAN Code', count: D2D_EAN_CODES.length, color: 'bg-emerald-600' },
    { id: 'inventory', label: 'Product Data', count: D2D_PRODUCT_DATA.length, color: 'bg-blue-600' },
    { id: 'image', label: 'Image Data', count: D2D_IMAGE_DATA.length, color: 'bg-purple-600' },
    { id: 'photo', label: 'Photo Team', count: D2D_PHOTO_TEAM_DATA.length, color: 'bg-amber-600' },
    { id: 'creative', label: 'Creative Dept', count: D2D_CREATIVE_DATA.length, color: 'bg-pink-600' },
  ];

  // Export current tab to CSV
  const handleExportCSV = () => {
    let csvContent = '';
    let filename = `D2D_${activeTab}_data.csv`;

    if (activeTab === 'ean') {
      csvContent = 'S.No,EAN Code\n' + filteredEan.map((c, i) => `${i + 1},${c}`).join('\n');
    } else if (activeTab === 'inventory') {
      const headers = [
        'EAN',
        'Product Name',
        'Brand',
        'Colour',
        'Size',
        'Toon Label',
        'Selling Price',
        'Total Stock',
        'Stores Count',
        'GM FASHIONS WAREHOUSE',
        'KARUR',
        'KOOTTAPPALLI',
        'KUMBAKONAM',
        'MALLUR',
        'NAMAKKAL',
        'SALEM',
        'TIRUVANNAMALAI',
        'WHOLESALE SHOWROOM',
        'Breakdown',
      ];
      csvContent =
        headers.join(',') +
        '\n' +
        filteredProducts
          .map((p) =>
            [
              p.ean,
              `"${p.productName}"`,
              p.brand,
              p.colour,
              p.size,
              p.toonLabel,
              p.sellingPrice,
              p.totalStock,
              p.storesCount,
              p.warehouseStock,
              p.karurStock,
              p.koottappalliStock,
              p.kumbakonamStock,
              p.mallurStock,
              p.namakkalStock,
              p.salemStock,
              p.tiruvannamalaiStock,
              p.wholesaleStock,
              `"${p.breakdown}"`,
            ].join(',')
          )
          .join('\n');
    } else if (activeTab === 'image') {
      const headers = [
        'OUT DATE',
        'IN DATE',
        'Product Name',
        'EAN',
        'TOON LABEL',
        'BRAND',
        'SIZE',
        'COLOR',
        'Product Count',
        'Photo Status',
        'IT Status',
        'Front Image',
        'Back Image',
        'Side Image',
        'Texture Image',
      ];
      csvContent =
        headers.join(',') +
        '\n' +
        filteredImages
          .map((m) =>
            [
              m.outDate,
              m.inDate,
              `"${m.productName}"`,
              m.ean,
              m.toonLabel,
              m.brand,
              m.size,
              m.color,
              m.productCount,
              m.photoStatus,
              m.itStatus,
              m.imageFront,
              m.imageBack,
              m.imageSide,
              m.imageTexture,
            ].join(',')
          )
          .join('\n');
    } else if (activeTab === 'photo') {
      const headers = [
        'Product Name',
        'EAN',
        'TOON LABEL',
        'BRAND',
        'SIZE',
        'COLOR',
        'PRODUCT COUNT',
        'PHOTO TEAM STATUS',
        'IT TEAM STATUS',
        'OUT DATE',
        'IN DATE',
      ];
      csvContent =
        headers.join(',') +
        '\n' +
        filteredPhotoTeam
          .map((pt) =>
            [
              `"${pt.productName}"`,
              pt.ean,
              pt.toonLabel,
              pt.brand,
              pt.size,
              pt.color,
              pt.productCount,
              pt.photoStatus,
              pt.itStatus,
              pt.outDate,
              pt.inDate,
            ].join(',')
          )
          .join('\n');
    } else {
      const headers = ['EAN CODE', 'STYLE NO', 'Product Name', 'Brand', 'Color', 'Size', 'Status'];
      csvContent =
        headers.join(',') +
        '\n' +
        filteredCreative
          .map((c) =>
            [c.ean, c.styleNo, `"${c.productName}"`, c.brand, c.color, c.size, `"${c.status}"`].join(',')
          )
          .join('\n');
    }

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Copy table to clipboard in tab-delimited format (ready to paste directly into Google Sheets)
  const handleCopyTable = () => {
    let tsv = '';
    if (activeTab === 'ean') {
      tsv = ['S.No', 'EAN Code'].join('\t') + '\n' + filteredEan.map((c, i) => `${i + 1}\t${c}`).join('\n');
    } else if (activeTab === 'inventory') {
      const headers = ['EAN', 'Product Name', 'Brand', 'Colour', 'Size', 'Toon Label', 'Price', 'Total Stock'];
      tsv =
        headers.join('\t') +
        '\n' +
        filteredProducts
          .map((p) => [p.ean, p.productName, p.brand, p.colour, p.size, p.toonLabel, p.sellingPrice, p.totalStock].join('\t'))
          .join('\n');
    } else if (activeTab === 'image') {
      const headers = ['EAN', 'Product Name', 'Brand', 'Color', 'Size', 'Photo Status', 'IT Status', 'Front Image'];
      tsv =
        headers.join('\t') +
        '\n' +
        filteredImages
          .map((m) => [m.ean, m.productName, m.brand, m.color, m.size, m.photoStatus, m.itStatus, m.imageFront].join('\t'))
          .join('\n');
    } else if (activeTab === 'photo') {
      const headers = ['Product Name', 'EAN', 'Brand', 'Color', 'Size', 'IT Status', 'Out Date', 'In Date'];
      tsv =
        headers.join('\t') +
        '\n' +
        filteredPhotoTeam
          .map((pt) => [pt.productName, pt.ean, pt.brand, pt.color, pt.size, pt.itStatus, pt.outDate, pt.inDate].join('\t'))
          .join('\n');
    } else {
      const headers = ['EAN CODE', 'STYLE NO', 'Product Name', 'Brand', 'Color', 'Size'];
      tsv =
        headers.join('\t') +
        '\n' +
        filteredCreative.map((c) => [c.ean, c.styleNo, c.productName, c.brand, c.color, c.size].join('\t')).join('\n');
    }

    navigator.clipboard.writeText(tsv);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  // Open in Google Sheets
  const handleOpenInGoogleDocs = () => {
    if (customExternalUrl && customExternalUrl.trim() && !customExternalUrl.includes('1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms')) {
      window.open(customExternalUrl, '_blank', 'noopener,noreferrer');
    } else {
      window.open('https://docs.google.com/spreadsheets/create', '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div
      id="d2d-sheets-viewer-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div
        className={`bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden transition-all duration-300 ${
          isMaximized ? 'w-full h-full max-w-[98vw] max-h-[96vh]' : 'w-full max-w-5xl h-[85vh]'
        }`}
      >
        {/* Google Sheets Style Green Navigation Bar */}
        <div className="bg-[#0f9d58] text-white px-4 py-3 flex items-center justify-between shadow-md shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-white/15 flex items-center justify-center text-white">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold tracking-tight">D2D GM Fashions Master Sheets</h2>
                <span className="text-[11px] bg-white/20 px-2 py-0.5 rounded font-mono font-medium">
                  Permanent Data
                </span>
              </div>
              <p className="text-[11px] text-emerald-100 hidden sm:block">
                Synchronized across all systems & devices • No example sheets
              </p>
            </div>
          </div>

          {/* Action Buttons on Green Header */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={handleCopyTable}
              className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-white/15 hover:bg-white/25 transition cursor-pointer text-white"
              title="Copy table to paste directly into Google Sheets (Ctrl+V)"
            >
              {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
              <span className="hidden md:inline">{isCopied ? 'Copied!' : 'Copy Table'}</span>
            </button>

            <button
              onClick={handleExportCSV}
              className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-white/15 hover:bg-white/25 transition cursor-pointer text-white"
              title="Download table as CSV file"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Export CSV</span>
            </button>

            <button
              onClick={handleOpenInGoogleDocs}
              className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-white text-[#0f9d58] hover:bg-emerald-50 transition cursor-pointer shadow-sm"
              title="Open Google Sheets in new tab"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Google Sheets</span>
            </button>

            <button
              onClick={() => setIsMaximized(!isMaximized)}
              className="text-white/80 hover:text-white p-1.5 rounded-lg hover:bg-white/15 transition cursor-pointer hidden sm:block"
              title={isMaximized ? 'Restore' : 'Maximize'}
            >
              {isMaximized ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            <button
              onClick={onClose}
              className="text-white hover:bg-white/20 p-1.5 rounded-lg transition cursor-pointer"
              title="Close Sheet Viewer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Selection Bar & Search Bar */}
        <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2 shrink-0">
          {/* Department Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto py-1">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                      isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Quick Search in Active Sheet */}
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search in this sheet..."
              className="w-full pl-8 pr-7 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0f9d58] transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
              >
                ×
              </button>
            )}
          </div>
        </div>

        {/* Spreadsheet Data Grid View */}
        <div className="flex-1 overflow-auto bg-slate-100/60 font-sans text-xs">
          {/* EAN Code Sheet */}
          {activeTab === 'ean' && (
            <div className="p-3">
              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-100 text-slate-600 uppercase font-mono text-[10px] tracking-wider border-b border-slate-200 sticky top-0 z-10 shadow-2xs">
                      <th className="py-2.5 px-3 w-14 text-center border-r border-slate-200">#</th>
                      <th className="py-2.5 px-4 font-bold border-r border-slate-200">EAN Code (13 Digits)</th>
                      <th className="py-2.5 px-4 font-bold border-r border-slate-200">Category</th>
                      <th className="py-2.5 px-4 font-bold">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono">
                    {filteredEan.map((code, idx) => (
                      <tr key={code} className="hover:bg-emerald-50/50 transition group">
                        <td className="py-2 px-3 text-center text-slate-400 bg-slate-50/50 border-r border-slate-200 text-[11px]">
                          {idx + 1}
                        </td>
                        <td className="py-2 px-4 font-bold text-slate-900 border-r border-slate-100 tracking-wider">
                          {code}
                        </td>
                        <td className="py-2 px-4 text-slate-600 border-r border-slate-100 font-sans">
                          Mens Wear / Focus & Prime
                        </td>
                        <td className="py-2 px-4">
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(code);
                              setIsCopied(true);
                              setTimeout(() => setIsCopied(false), 1500);
                            }}
                            className="text-[11px] font-sans font-semibold text-emerald-700 hover:text-emerald-900 bg-emerald-50 hover:bg-emerald-100 px-2 py-0.5 rounded transition cursor-pointer"
                          >
                            Copy EAN
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Product Data Sheet */}
          {activeTab === 'inventory' && (
            <div className="p-3">
              <div className="bg-white rounded-xl border border-slate-200 overflow-x-auto shadow-xs">
                <table className="w-full text-left border-collapse whitespace-nowrap">
                  <thead>
                    <tr className="bg-slate-100 text-slate-600 uppercase font-mono text-[10px] tracking-wider border-b border-slate-200 sticky top-0 z-10 shadow-2xs">
                      <th className="py-2.5 px-2.5 w-12 text-center border-r border-slate-200">#</th>
                      <th className="py-2.5 px-3 font-bold border-r border-slate-200">EAN</th>
                      <th className="py-2.5 px-3 font-bold border-r border-slate-200">Product Name</th>
                      <th className="py-2.5 px-3 font-bold border-r border-slate-200">Brand</th>
                      <th className="py-2.5 px-3 font-bold border-r border-slate-200">Color</th>
                      <th className="py-2.5 px-3 font-bold border-r border-slate-200">Size</th>
                      <th className="py-2.5 px-3 font-bold border-r border-slate-200">Toon Label</th>
                      <th className="py-2.5 px-3 font-bold border-r border-slate-200">Price</th>
                      <th className="py-2.5 px-3 font-bold border-r border-slate-200 bg-emerald-50 text-emerald-800">Total Stock</th>
                      <th className="py-2.5 px-3 font-bold border-r border-slate-200">Stores</th>
                      <th className="py-2.5 px-3 font-bold">Store Breakdown</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredProducts.map((p, idx) => (
                      <tr key={p.ean + idx} className="hover:bg-blue-50/40 transition">
                        <td className="py-2 px-2.5 text-center text-slate-400 bg-slate-50/50 border-r border-slate-200 font-mono text-[11px]">
                          {idx + 1}
                        </td>
                        <td className="py-2 px-3 font-mono font-bold text-slate-900 border-r border-slate-100">
                          {p.ean}
                        </td>
                        <td className="py-2 px-3 font-semibold text-slate-800 border-r border-slate-100">
                          {p.productName}
                        </td>
                        <td className="py-2 px-3 text-slate-600 border-r border-slate-100 font-medium">
                          {p.brand}
                        </td>
                        <td className="py-2 px-3 text-slate-700 border-r border-slate-100 font-medium">
                          <span className="inline-block w-2.5 h-2.5 rounded-full bg-slate-400 mr-1.5 align-middle" />
                          {p.colour}
                        </td>
                        <td className="py-2 px-3 text-slate-700 border-r border-slate-100 font-mono font-bold">
                          {p.size}
                        </td>
                        <td className="py-2 px-3 font-mono text-slate-500 border-r border-slate-100">
                          {p.toonLabel}
                        </td>
                        <td className="py-2 px-3 font-mono font-bold text-slate-900 border-r border-slate-100">
                          ₹{p.sellingPrice}
                        </td>
                        <td className="py-2 px-3 font-mono font-black text-emerald-700 bg-emerald-50/40 border-r border-slate-100 text-center">
                          {p.totalStock}
                        </td>
                        <td className="py-2 px-3 font-mono text-slate-600 border-r border-slate-100 text-center">
                          {p.storesCount}
                        </td>
                        <td className="py-2 px-3 text-slate-500 text-[11px] max-w-xs truncate" title={p.breakdown}>
                          {p.breakdown}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Image Data Sheet */}
          {activeTab === 'image' && (
            <div className="p-3">
              <div className="bg-white rounded-xl border border-slate-200 overflow-x-auto shadow-xs">
                <table className="w-full text-left border-collapse whitespace-nowrap">
                  <thead>
                    <tr className="bg-slate-100 text-slate-600 uppercase font-mono text-[10px] tracking-wider border-b border-slate-200 sticky top-0 z-10 shadow-2xs">
                      <th className="py-2.5 px-2.5 w-12 text-center border-r border-slate-200">#</th>
                      <th className="py-2.5 px-3 font-bold border-r border-slate-200">EAN</th>
                      <th className="py-2.5 px-3 font-bold border-r border-slate-200">Product Name</th>
                      <th className="py-2.5 px-3 font-bold border-r border-slate-200">Toon Label</th>
                      <th className="py-2.5 px-3 font-bold border-r border-slate-200">Brand</th>
                      <th className="py-2.5 px-3 font-bold border-r border-slate-200">Color</th>
                      <th className="py-2.5 px-3 font-bold border-r border-slate-200">Photo Status</th>
                      <th className="py-2.5 px-3 font-bold border-r border-slate-200">IT Status</th>
                      <th className="py-2.5 px-3 font-bold border-r border-slate-200">Front</th>
                      <th className="py-2.5 px-3 font-bold border-r border-slate-200">Back</th>
                      <th className="py-2.5 px-3 font-bold border-r border-slate-200">Side</th>
                      <th className="py-2.5 px-3 font-bold">Texture</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredImages.map((img, idx) => (
                      <tr key={img.ean + idx} className="hover:bg-purple-50/30 transition">
                        <td className="py-2 px-2.5 text-center text-slate-400 bg-slate-50/50 border-r border-slate-200 font-mono text-[11px]">
                          {idx + 1}
                        </td>
                        <td className="py-2 px-3 font-mono font-bold text-slate-900 border-r border-slate-100">
                          {img.ean}
                        </td>
                        <td className="py-2 px-3 font-semibold text-slate-800 border-r border-slate-100">
                          {img.productName}
                        </td>
                        <td className="py-2 px-3 font-mono text-slate-500 border-r border-slate-100">
                          {img.toonLabel}
                        </td>
                        <td className="py-2 px-3 text-slate-600 border-r border-slate-100">{img.brand}</td>
                        <td className="py-2 px-3 text-slate-700 border-r border-slate-100">{img.color}</td>
                        <td className="py-2 px-3 border-r border-slate-100">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                              img.photoStatus === 'done'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {img.photoStatus || 'pending'}
                          </span>
                        </td>
                        <td className="py-2 px-3 border-r border-slate-100">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                              img.itStatus.toLowerCase() === 'done'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {img.itStatus || 'pending'}
                          </span>
                        </td>

                        {/* Image Preview Cells */}
                        {[
                          { url: img.imageFront, label: 'Front' },
                          { url: img.imageBack, label: 'Back' },
                          { url: img.imageSide, label: 'Side' },
                          { url: img.imageTexture, label: 'Texture' },
                        ].map((pic, pIdx) => (
                          <td key={pIdx} className="py-1 px-2 border-r border-slate-100 text-center">
                            {pic.url ? (
                              <button
                                onClick={() => setSelectedPreviewImage(pic.url)}
                                className="inline-flex items-center gap-1 group/img hover:opacity-80 transition cursor-pointer"
                                title={`Click to preview ${pic.label} image`}
                              >
                                <img
                                  src={pic.url}
                                  alt={pic.label}
                                  className="w-8 h-8 rounded object-cover border border-slate-200"
                                  referrerPolicy="no-referrer"
                                />
                                <Eye className="w-3 h-3 text-slate-400 group-hover/img:text-indigo-600" />
                              </button>
                            ) : (
                              <span className="text-[10px] text-slate-300 font-mono">—</span>
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Photo Team Sheet */}
          {activeTab === 'photo' && (
            <div className="p-3">
              <div className="bg-white rounded-xl border border-slate-200 overflow-x-auto shadow-xs">
                <table className="w-full text-left border-collapse whitespace-nowrap">
                  <thead>
                    <tr className="bg-slate-100 text-slate-600 uppercase font-mono text-[10px] tracking-wider border-b border-slate-200 sticky top-0 z-10 shadow-2xs">
                      <th className="py-2.5 px-2.5 w-12 text-center border-r border-slate-200">#</th>
                      <th className="py-2.5 px-3 font-bold border-r border-slate-200">Product Name</th>
                      <th className="py-2.5 px-3 font-bold border-r border-slate-200">EAN</th>
                      <th className="py-2.5 px-3 font-bold border-r border-slate-200">Toon Label</th>
                      <th className="py-2.5 px-3 font-bold border-r border-slate-200">Brand</th>
                      <th className="py-2.5 px-3 font-bold border-r border-slate-200">Size</th>
                      <th className="py-2.5 px-3 font-bold border-r border-slate-200">Color</th>
                      <th className="py-2.5 px-3 font-bold border-r border-slate-200 text-center">Count</th>
                      <th className="py-2.5 px-3 font-bold border-r border-slate-200">Photo Team Status</th>
                      <th className="py-2.5 px-3 font-bold border-r border-slate-200">IT Status</th>
                      <th className="py-2.5 px-3 font-bold border-r border-slate-200">Out Date</th>
                      <th className="py-2.5 px-3 font-bold">In Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredPhotoTeam.map((pt, idx) => (
                      <tr key={pt.ean + idx} className="hover:bg-amber-50/40 transition">
                        <td className="py-2 px-2.5 text-center text-slate-400 bg-slate-50/50 border-r border-slate-200 font-mono text-[11px]">
                          {idx + 1}
                        </td>
                        <td className="py-2 px-3 font-semibold text-slate-800 border-r border-slate-100">
                          {pt.productName}
                        </td>
                        <td className="py-2 px-3 font-mono font-bold text-slate-900 border-r border-slate-100">
                          {pt.ean}
                        </td>
                        <td className="py-2 px-3 font-mono text-slate-500 border-r border-slate-100">
                          {pt.toonLabel}
                        </td>
                        <td className="py-2 px-3 text-slate-600 border-r border-slate-100">{pt.brand}</td>
                        <td className="py-2 px-3 font-mono text-slate-700 border-r border-slate-100">{pt.size}</td>
                        <td className="py-2 px-3 text-slate-700 border-r border-slate-100">{pt.color}</td>
                        <td className="py-2 px-3 font-mono text-center text-slate-900 border-r border-slate-100">
                          {pt.productCount}
                        </td>
                        <td className="py-2 px-3 border-r border-slate-100">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-slate-100 text-slate-600">
                            {pt.photoStatus || 'Waiting'}
                          </span>
                        </td>
                        <td className="py-2 px-3 border-r border-slate-100">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                              pt.itStatus === 'OK' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'
                            }`}
                          >
                            {pt.itStatus || 'Pending'}
                          </span>
                        </td>
                        <td className="py-2 px-3 font-mono text-slate-600 border-r border-slate-100">
                          {pt.outDate || '—'}
                        </td>
                        <td className="py-2 px-3 font-mono text-slate-600">{pt.inDate || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Creative Department Sheet */}
          {activeTab === 'creative' && (
            <div className="p-3">
              <div className="bg-white rounded-xl border border-slate-200 overflow-x-auto shadow-xs">
                <table className="w-full text-left border-collapse whitespace-nowrap">
                  <thead>
                    <tr className="bg-slate-100 text-slate-600 uppercase font-mono text-[10px] tracking-wider border-b border-slate-200 sticky top-0 z-10 shadow-2xs">
                      <th className="py-2.5 px-2.5 w-12 text-center border-r border-slate-200">#</th>
                      <th className="py-2.5 px-4 font-bold border-r border-slate-200">EAN Code</th>
                      <th className="py-2.5 px-4 font-bold border-r border-slate-200">Style No (Toon Label)</th>
                      <th className="py-2.5 px-4 font-bold border-r border-slate-200">Product Name</th>
                      <th className="py-2.5 px-4 font-bold border-r border-slate-200">Brand</th>
                      <th className="py-2.5 px-4 font-bold border-r border-slate-200">Color</th>
                      <th className="py-2.5 px-4 font-bold border-r border-slate-200">Size</th>
                      <th className="py-2.5 px-4 font-bold">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredCreative.map((c, idx) => (
                      <tr key={c.ean + idx} className="hover:bg-pink-50/40 transition">
                        <td className="py-2 px-2.5 text-center text-slate-400 bg-slate-50/50 border-r border-slate-200 font-mono text-[11px]">
                          {idx + 1}
                        </td>
                        <td className="py-2 px-4 font-mono font-bold text-slate-900 border-r border-slate-100">
                          {c.ean}
                        </td>
                        <td className="py-2 px-4 font-mono font-semibold text-indigo-700 border-r border-slate-100">
                          {c.styleNo}
                        </td>
                        <td className="py-2 px-4 font-semibold text-slate-800 border-r border-slate-100">
                          {c.productName}
                        </td>
                        <td className="py-2 px-4 text-slate-600 border-r border-slate-100">{c.brand}</td>
                        <td className="py-2 px-4 text-slate-700 border-r border-slate-100">{c.color}</td>
                        <td className="py-2 px-4 font-mono text-slate-700 border-r border-slate-100">{c.size}</td>
                        <td className="py-2 px-4">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-pink-100 text-pink-800">
                            {c.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Footer info bar */}
        <div className="px-4 py-2 bg-white border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700">D2D GM Fashions</span>
            <span>•</span>
            <span>Showing active items in this view</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[11px] text-slate-400">Google Sheets Format Ready</span>
            <button
              onClick={onClose}
              className="text-slate-600 hover:text-slate-900 font-bold text-xs px-3 py-1 rounded bg-slate-100 hover:bg-slate-200 transition cursor-pointer"
            >
              Done / Close
            </button>
          </div>
        </div>
      </div>

      {/* Image Zoom Lightbox Popup */}
      {selectedPreviewImage && (
        <div
          className="fixed inset-0 z-60 bg-black/80 flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setSelectedPreviewImage(null)}
        >
          <div className="relative max-w-lg max-h-[85vh] bg-white p-2 rounded-2xl shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <img
              src={selectedPreviewImage}
              alt="High resolution preview"
              className="w-full h-auto max-h-[75vh] object-contain rounded-xl"
              referrerPolicy="no-referrer"
            />
            <div className="p-3 flex items-center justify-between">
              <span className="text-xs font-mono text-slate-500 truncate max-w-xs">{selectedPreviewImage}</span>
              <button
                onClick={() => setSelectedPreviewImage(null)}
                className="px-3 py-1 bg-slate-900 text-white rounded-lg text-xs font-bold hover:bg-slate-800 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
