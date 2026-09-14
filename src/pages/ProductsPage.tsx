import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Filter,
  Search,
  X,
  ChevronDown,
  SlidersHorizontal,
  RotateCcw,
  Sparkles,
  Diamond,
  Check
} from 'lucide-react';
import { ProductCard } from '../components/common/ProductCard';
import { QuickViewModal } from '../components/common/QuickViewModal';
import { Product, Category, DiamondShape, DiamondColor, DiamondClarity, JewelryMaterial } from '../types';
import { apiService } from '../services/api';
import { formatCurrency } from '../utils/formatters';

export const ProductsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  // Filter states
  const categoryParam = searchParams.get('category') || '';
  const searchParam = searchParams.get('search') || '';
  const sortParam = searchParams.get('sort') || 'newest';

  const [selectedCategory, setSelectedCategory] = useState<string>(categoryParam);
  const [searchQuery, setSearchQuery] = useState<string>(searchParam);
  const [selectedSort, setSelectedSort] = useState<string>(sortParam);
  const [selectedShape, setSelectedShape] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedClarity, setSelectedClarity] = useState<string>('');
  const [selectedMaterial, setSelectedMaterial] = useState<string>('');
  const [selectedCertificate, setSelectedCertificate] = useState<string>('');
  const [caratRange, setCaratRange] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<string>('all');
  const [onlyInStock, setOnlyInStock] = useState<boolean>(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    const loadCategories = async () => {
      const res = await apiService.categories.getAll();
      setCategories(res.data);
    };
    loadCategories();
  }, []);

  useEffect(() => {
    setSelectedCategory(searchParams.get('category') || '');
    setSearchQuery(searchParams.get('search') || '');
    setSelectedSort(searchParams.get('sort') || 'newest');
  }, [searchParams]);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);

      let caratMin: number | undefined;
      let caratMax: number | undefined;
      if (caratRange === '<0.5') { caratMax = 0.49; }
      else if (caratRange === '0.5-1.0') { caratMin = 0.5; caratMax = 0.99; }
      else if (caratRange === '1.0-2.0') { caratMin = 1.0; caratMax = 1.99; }
      else if (caratRange === '>2.0') { caratMin = 2.0; }

      let priceMin: number | undefined;
      let priceMax: number | undefined;
      if (priceRange === '<50m') { priceMax = 50000000; }
      else if (priceRange === '50-100m') { priceMin = 50000000; priceMax = 100000000; }
      else if (priceRange === '100-300m') { priceMin = 100000000; priceMax = 300000000; }
      else if (priceRange === '>300m') { priceMin = 300000000; }

      const res = await apiService.products.getAll({
        category: selectedCategory || undefined,
        search: searchQuery || undefined,
        shape: selectedShape || undefined,
        color: selectedColor || undefined,
        clarity: selectedClarity || undefined,
        material: selectedMaterial || undefined,
        certificate: selectedCertificate || undefined,
        caratMin,
        caratMax,
        priceMin,
        priceMax,
        inStock: onlyInStock || undefined,
        sort: selectedSort,
      });

      setProducts(res.data);
      setIsLoading(false);
      setCurrentPage(1);
    };

    fetchProducts();
  }, [
    selectedCategory,
    searchQuery,
    selectedSort,
    selectedShape,
    selectedColor,
    selectedClarity,
    selectedMaterial,
    selectedCertificate,
    caratRange,
    priceRange,
    onlyInStock,
  ]);

  const handleResetFilters = () => {
    setSelectedCategory('');
    setSearchQuery('');
    setSelectedShape('');
    setSelectedColor('');
    setSelectedClarity('');
    setSelectedMaterial('');
    setSelectedCertificate('');
    setCaratRange('all');
    setPriceRange('all');
    setOnlyInStock(false);
    setSelectedSort('newest');
    setSearchParams({});
  };

  const shapes: DiamondShape[] = ['Round', 'Princess', 'Emerald', 'Cushion', 'Oval', 'Pear', 'Marquise', 'Heart'];
  const colors: DiamondColor[] = ['D', 'E', 'F', 'G', 'H', 'I', 'J'];
  const clarities: DiamondClarity[] = ['FL', 'IF', 'VVS1', 'VVS2', 'VS1', 'VS2', 'SI1'];
  const materials: JewelryMaterial[] = ['Vàng Trắng 18K', 'Vàng Vàng 18K', 'Vàng Hồng 18K', 'Bạch Kim Platinum 950'];

  // Pagination calculation
  const totalPages = Math.ceil(products.length / itemsPerPage);
  const currentProducts = products.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const activeCategoryObject = categories.find((c) => c.slug === selectedCategory || c._id === selectedCategory);

  return (
    <div className="bg-[#FAF8F5] min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Breadcrumb & Title */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold font-serif text-[#0B192C]">
            {activeCategoryObject ? activeCategoryObject.name : 'Bộ Sưu Tập Kim Cương & Trang Sức'}
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            {activeCategoryObject
              ? activeCategoryObject.description
              : 'Tuyển tập những viên kim cương chuẩn kiểm định quốc tế GIA/IGI và tuyệt tác trang sức vàng 18K.'}
          </p>
        </div>

        {/* Filter Bar / Controls */}
        <div className="bg-white p-4 rounded-2xl shadow-xs border border-[#E8E2D5] mb-8 flex flex-wrap items-center justify-between gap-4">

          {/* Left search */}
          <div className="relative flex-1 min-w-[240px] max-w-md">
            <input
              type="text"
              placeholder="Tìm theo tên, mã SKU, chất liệu..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-2 bg-[#FAF8F5] border border-[#E5DFD5] rounded-xl text-xs focus:outline-none focus:border-[#D4AF37]"
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Right Mobile Filter Toggle & Sort Dropdown */}
          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
            <button
              id="btn-toggle-mobile-filter"
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden flex items-center gap-1.5 px-3 py-2 bg-[#FAF8F5] border border-[#E5DFD5] rounded-xl text-xs font-semibold text-gray-700 hover:border-[#D4AF37]"
            >
              <SlidersHorizontal className="w-4 h-4 text-[#D4AF37]" />
              Bộ lọc nâng cao
            </button>

            {/* Sort */}
            <div className="flex items-center gap-2 text-xs">
              <span className="text-gray-500 whitespace-nowrap hidden sm:inline">Sắp xếp theo:</span>
              <select
                id="select-sort"
                value={selectedSort}
                onChange={(e) => setSelectedSort(e.target.value)}
                className="px-3 py-2 bg-[#FAF8F5] border border-[#E5DFD5] rounded-xl text-xs font-medium text-gray-800 focus:outline-none focus:border-[#D4AF37]"
              >
                <option value="newest">Mới nhất</option>
                <option value="best_seller">Bán chạy nhất</option>
                <option value="price_asc">Giá tăng dần</option>
                <option value="price_desc">Giá giảm dần</option>
              </select>
            </div>
          </div>
        </div>

        {/* Main Content Layout (Sidebar Filter + Product Grid) */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

          {/* Desktop Filter Sidebar */}
          <div className="hidden lg:block space-y-6">
            <div className="bg-white p-5 rounded-2xl shadow-xs border border-[#E8E2D5] space-y-6">

              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <span className="text-xs font-bold uppercase tracking-wider text-[#0B192C] flex items-center gap-1.5">
                  <SlidersHorizontal className="w-4 h-4 text-[#D4AF37]" />
                  Bộ Lọc Tìm Kiếm
                </span>
                <button
                  id="btn-reset-filters-desktop"
                  onClick={handleResetFilters}
                  className="text-[11px] text-[#997A15] hover:underline flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  Đặt lại
                </button>
              </div>

              {/* Category Filter */}
              <div>
                <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider mb-2.5">
                  Danh Mục
                </h4>
                <div className="space-y-1.5">
                  <button
                    onClick={() => setSelectedCategory('')}
                    className={`w-full text-left text-xs px-2.5 py-1.5 rounded-lg transition-colors flex items-center justify-between ${selectedCategory === ''
                        ? 'bg-[#0B192C] text-[#F4E8C1] font-semibold'
                        : 'text-gray-600 hover:bg-gray-50'
                      }`}
                  >
                    <span>Tất cả sản phẩm</span>
                    {selectedCategory === '' && <Check className="w-3.5 h-3.5 text-[#D4AF37]" />}
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat._id}
                      onClick={() => setSelectedCategory(cat.slug)}
                      className={`w-full text-left text-xs px-2.5 py-1.5 rounded-lg transition-colors flex items-center justify-between ${selectedCategory === cat.slug || selectedCategory === cat._id
                          ? 'bg-[#0B192C] text-[#F4E8C1] font-semibold'
                          : 'text-gray-600 hover:bg-gray-50'
                        }`}
                    >
                      <span className="truncate">{cat.name}</span>
                      {(selectedCategory === cat.slug || selectedCategory === cat._id) && (
                        <Check className="w-3.5 h-3.5 text-[#D4AF37]" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Diamond Shapes */}
              <div>
                <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider mb-2.5">
                  Hình Dạng Kim Cương
                </h4>
                <div className="grid grid-cols-2 gap-1.5">
                  {shapes.map((shape) => (
                    <button
                      key={shape}
                      onClick={() => setSelectedShape(selectedShape === shape ? '' : shape)}
                      className={`px-2 py-1.5 text-xs rounded-lg border text-center transition-all ${selectedShape === shape
                          ? 'bg-[#0B192C] text-[#F4E8C1] border-[#0B192C] font-semibold'
                          : 'bg-white text-gray-600 border-gray-200 hover:border-[#D4AF37]'
                        }`}
                    >
                      {shape}
                    </button>
                  ))}
                </div>
              </div>

              {/* Diamond Carat Range */}
              <div>
                <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider mb-2.5">
                  Trọng Lượng (Carat)
                </h4>
                <div className="space-y-1 text-xs text-gray-600">
                  {[
                    { id: 'all', label: 'Tất cả trọng lượng' },
                    { id: '<0.5', label: 'Dưới 0.50 Carat' },
                    { id: '0.5-1.0', label: '0.50ct - 0.99ct' },
                    { id: '1.0-2.0', label: '1.00ct - 1.99ct' },
                    { id: '>2.0', label: 'Từ 2.00 Carat trở lên' },
                  ].map((r) => (
                    <label key={r.id} className="flex items-center gap-2 cursor-pointer py-1">
                      <input
                        type="radio"
                        name="caratRange"
                        checked={caratRange === r.id}
                        onChange={() => setCaratRange(r.id)}
                        className="accent-[#D4AF37]"
                      />
                      <span>{r.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Diamond Color */}
              <div>
                <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider mb-2.5">
                  Nước Màu (Color)
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {colors.map((c) => (
                    <button
                      key={c}
                      onClick={() => setSelectedColor(selectedColor === c ? '' : c)}
                      className={`w-8 h-8 rounded-lg border text-xs font-semibold flex items-center justify-center transition-all ${selectedColor === c
                          ? 'bg-[#0B192C] text-[#F4E8C1] border-[#0B192C]'
                          : 'bg-white text-gray-700 border-gray-200 hover:border-[#D4AF37]'
                        }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              {/* Diamond Clarity */}
              <div>
                <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider mb-2.5">
                  Độ Tinh Khiết (Clarity)
                </h4>
                <div className="grid grid-cols-3 gap-1.5">
                  {clarities.map((clarity) => (
                    <button
                      key={clarity}
                      onClick={() => setSelectedClarity(selectedClarity === clarity ? '' : clarity)}
                      className={`px-1.5 py-1 text-[11px] font-semibold rounded-lg border text-center transition-all ${selectedClarity === clarity
                          ? 'bg-[#0B192C] text-[#F4E8C1] border-[#0B192C]'
                          : 'bg-white text-gray-600 border-gray-200 hover:border-[#D4AF37]'
                        }`}
                    >
                      {clarity}
                    </button>
                  ))}
                </div>
              </div>

              {/* Certificate */}
              <div>
                <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider mb-2.5">
                  Chứng Nhận Quốc Tế
                </h4>
                <div className="flex gap-2">
                  {['GIA', 'IGI', 'PNJ Lab'].map((cert) => (
                    <button
                      key={cert}
                      onClick={() => setSelectedCertificate(selectedCertificate === cert ? '' : cert)}
                      className={`flex-1 py-1.5 text-xs font-bold rounded-lg border text-center transition-all ${selectedCertificate === cert
                          ? 'bg-[#0B192C] text-[#F4E8C1] border-[#0B192C]'
                          : 'bg-white text-gray-700 border-gray-200 hover:border-[#D4AF37]'
                        }`}
                    >
                      {cert}
                    </button>
                  ))}
                </div>
              </div>

              {/* Material */}
              <div>
                <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider mb-2.5">
                  Chất Liệu
                </h4>
                <div className="space-y-1.5">
                  {materials.map((m) => (
                    <button
                      key={m}
                      onClick={() => setSelectedMaterial(selectedMaterial === m ? '' : m)}
                      className={`w-full text-left text-xs px-2.5 py-1.5 rounded-lg border transition-all ${selectedMaterial === m
                          ? 'bg-[#FAF8F5] text-[#0B192C] border-[#D4AF37] font-semibold'
                          : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                        }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider mb-2.5">
                  Khoảng Giá
                </h4>
                <div className="space-y-1 text-xs text-gray-600">
                  {[
                    { id: 'all', label: 'Tất cả mức giá' },
                    { id: '<50m', label: 'Dưới 50 Triệu' },
                    { id: '50-100m', label: '50 - 100 Triệu' },
                    { id: '100-300m', label: '100 - 300 Triệu' },
                    { id: '>300m', label: 'Trên 300 Triệu' },
                  ].map((p) => (
                    <label key={p.id} className="flex items-center gap-2 cursor-pointer py-1">
                      <input
                        type="radio"
                        name="priceRange"
                        checked={priceRange === p.id}
                        onChange={() => setPriceRange(p.id)}
                        className="accent-[#D4AF37]"
                      />
                      <span>{p.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* In Stock only toggle */}
              <div className="pt-3 border-t border-gray-100">
                <label className="flex items-center gap-2 text-xs font-medium text-gray-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={onlyInStock}
                    onChange={(e) => setOnlyInStock(e.target.checked)}
                    className="w-4 h-4 rounded text-[#D4AF37] accent-[#D4AF37]"
                  />
                  <span>Chỉ hiện sản phẩm còn hàng</span>
                </label>
              </div>

            </div>
          </div>

          {/* Product Grid Area */}
          <div className="lg:col-span-3 space-y-6">

            {/* Active Filters Display Chips */}
            {(selectedCategory || selectedShape || selectedColor || selectedClarity || selectedMaterial || selectedCertificate || caratRange !== 'all' || priceRange !== 'all' || searchQuery) && (
              <div className="bg-white p-3.5 rounded-xl border border-[#E8E2D5] flex flex-wrap items-center gap-2 text-xs">
                <span className="text-gray-400 text-[11px] font-semibold">Đang lọc:</span>
                {selectedCategory && (
                  <span className="inline-flex items-center gap-1 bg-[#FAF8F5] border border-[#D4AF37] text-[#997A15] px-2.5 py-1 rounded-full text-xs font-medium">
                    Danh mục: {activeCategoryObject?.name || selectedCategory}
                    <button onClick={() => setSelectedCategory('')}><X className="w-3 h-3" /></button>
                  </span>
                )}
                {selectedShape && (
                  <span className="inline-flex items-center gap-1 bg-[#FAF8F5] border border-[#D4AF37] text-[#997A15] px-2.5 py-1 rounded-full text-xs font-medium">
                    Hình: {selectedShape}
                    <button onClick={() => setSelectedShape('')}><X className="w-3 h-3" /></button>
                  </span>
                )}
                {selectedColor && (
                  <span className="inline-flex items-center gap-1 bg-[#FAF8F5] border border-[#D4AF37] text-[#997A15] px-2.5 py-1 rounded-full text-xs font-medium">
                    Nước {selectedColor}
                    <button onClick={() => setSelectedColor('')}><X className="w-3 h-3" /></button>
                  </span>
                )}
                {selectedClarity && (
                  <span className="inline-flex items-center gap-1 bg-[#FAF8F5] border border-[#D4AF37] text-[#997A15] px-2.5 py-1 rounded-full text-xs font-medium">
                    Độ sạch: {selectedClarity}
                    <button onClick={() => setSelectedClarity('')}><X className="w-3 h-3" /></button>
                  </span>
                )}
                {selectedCertificate && (
                  <span className="inline-flex items-center gap-1 bg-[#FAF8F5] border border-[#D4AF37] text-[#997A15] px-2.5 py-1 rounded-full text-xs font-medium">
                    {selectedCertificate}
                    <button onClick={() => setSelectedCertificate('')}><X className="w-3 h-3" /></button>
                  </span>
                )}
                <button
                  id="btn-clear-all-filter-chips"
                  onClick={handleResetFilters}
                  className="text-xs text-red-600 hover:underline ml-auto font-medium"
                >
                  Xóa tất cả bộ lọc
                </button>
              </div>
            )}

            {/* Results Count */}
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>Tìm thấy <strong>{products.length}</strong> sản phẩm phù hợp</span>
              <span>Trang {currentPage} / {Math.max(1, totalPages)}</span>
            </div>

            {/* Product Cards Grid */}
            {isLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6 py-12">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white rounded-xl h-80 animate-pulse border border-gray-200 p-4" />
                ))}
              </div>
            ) : currentProducts.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                {currentProducts.map((product) => (
                  <ProductCard
                    key={product._id}
                    product={product}
                    onQuickView={(p) => setQuickViewProduct(p)}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white p-12 rounded-2xl border border-[#E8E2D5] text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#FAF8F5] border border-[#D4AF37] text-[#997A15] mx-auto flex items-center justify-center">
                  <Diamond className="w-8 h-8" />
                </div>
                <h3 className="text-base font-bold text-gray-800">Không tìm thấy sản phẩm phù hợp</h3>
                <p className="text-xs text-gray-500 max-w-md mx-auto">
                  Quý khách vui lòng thử tìm kiếm với từ khóa khác hoặc điều chỉnh lại các tiêu chí bộ lọc.
                </p>
                <button
                  id="btn-empty-state-reset"
                  onClick={handleResetFilters}
                  className="px-5 py-2.5 bg-[#0B192C] text-white text-xs font-semibold rounded-lg hover:bg-[#1E3E62] transition-colors"
                >
                  Xóa bộ lọc & Xem tất cả
                </button>
              </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="pt-6 flex justify-center items-center gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-3.5 py-2 rounded-lg border border-gray-300 text-xs font-semibold disabled:opacity-40 hover:border-[#D4AF37]"
                >
                  Trước
                </button>

                {[...Array(totalPages)].map((_, idx) => (
                  <button
                    key={idx + 1}
                    onClick={() => setCurrentPage(idx + 1)}
                    className={`w-9 h-9 rounded-lg text-xs font-bold transition-all ${currentPage === idx + 1
                        ? 'bg-[#0B192C] text-[#F4E8C1] border border-[#0B192C]'
                        : 'bg-white text-gray-700 border border-gray-300 hover:border-[#D4AF37]'
                      }`}
                  >
                    {idx + 1}
                  </button>
                ))}

                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3.5 py-2 rounded-lg border border-gray-300 text-xs font-semibold disabled:opacity-40 hover:border-[#D4AF37]"
                >
                  Sau
                </button>
              </div>
            )}

          </div>

        </div>

      </div>

      {/* Mobile Filter Modal */}
      {mobileFilterOpen && (
        <div className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex justify-end animate-in fade-in duration-200">
          <div className="bg-white w-4/5 max-w-md h-full shadow-2xl p-6 flex flex-col justify-between overflow-y-auto">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                <span className="font-bold text-sm text-[#0B192C] uppercase tracking-wider">
                  Bộ Lọc Nâng Cao
                </span>
                <button onClick={() => setMobileFilterOpen(false)}>
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* Category */}
              <div>
                <h4 className="text-xs font-bold text-gray-800 uppercase mb-2">Danh mục</h4>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full p-2 bg-[#FAF8F5] border border-gray-300 rounded-lg text-xs"
                >
                  <option value="">Tất cả danh mục</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat.slug}>{cat.name}</option>
                  ))}
                </select>
              </div>

              {/* Diamond Shapes */}
              <div>
                <h4 className="text-xs font-bold text-gray-800 uppercase mb-2">Hình dạng</h4>
                <div className="grid grid-cols-2 gap-1.5">
                  {shapes.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSelectedShape(selectedShape === s ? '' : s)}
                      className={`p-2 text-xs rounded border ${selectedShape === s ? 'bg-[#0B192C] text-[#F4E8C1]' : 'bg-white text-gray-700'
                        }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-200 flex gap-3">
              <button
                onClick={handleResetFilters}
                className="flex-1 py-2.5 border border-gray-300 text-gray-700 rounded-xl text-xs font-semibold"
              >
                Đặt lại
              </button>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="flex-1 py-2.5 bg-[#0B192C] text-white rounded-xl text-xs font-bold"
              >
                Áp dụng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        isOpen={!!quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />
    </div>
  );
};
