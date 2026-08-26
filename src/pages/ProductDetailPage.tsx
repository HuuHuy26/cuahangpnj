import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Heart, 
  ShoppingBag, 
  Share2, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  Sparkles, 
  Star, 
  Diamond, 
  Ruler, 
  Award, 
  Check, 
  FileText,
  MessageSquare,
  Send,
  AlertCircle
} from 'lucide-react';
import { ProductCard } from '../components/common/ProductCard';
import { RingSizeModal } from '../components/common/RingSizeModal';
import { DiamondStandardsModal } from '../components/common/DiamondStandardsModal';
import { Product, Review } from '../types';
import { apiService } from '../services/api';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { formatCurrency, formatDate, calculateDiscountPercentage } from '../utils/formatters';

export const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { addItem } = useCart();
  const { isFavorite, toggleFavorite } = useWishlist();
  const { user, isAuthenticated } = useAuth();
  const { showToast } = useToast();

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'desc' | 'specs' | 'policy' | 'reviews'>('desc');

  // Modals
  const [ringSizeModalOpen, setRingSizeModalOpen] = useState(false);
  const [standardsModalOpen, setStandardsModalOpen] = useState(false);
  const [certModalOpen, setCertModalOpen] = useState(false);

  // New review form
  const [ratingInput, setRatingInput] = useState(5);
  const [commentInput, setCommentInput] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  useEffect(() => {
    const fetchDetail = async () => {
      if (!id) return;
      try {
        const res = await apiService.products.getById(id);
        const currentProd = res.data;
        setProduct(currentProd);
        setSelectedImage(0);
        if (currentProd.availableSizes && currentProd.availableSizes.length > 0) {
          setSelectedSize(currentProd.availableSizes[0]);
        } else if (currentProd.size) {
          setSelectedSize(currentProd.size);
        }

        // Fetch related products
        const relRes = await apiService.products.getAll({
          category: currentProd.categoryId,
          limit: 4,
        });
        setRelatedProducts(relRes.data.filter((p) => p._id !== currentProd._id));

        // Fetch reviews
        const revRes = await apiService.reviews.getByProduct(currentProd._id);
        setReviews(revRes.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchDetail();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="w-12 h-12 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm text-gray-500 font-medium">Đang tải thông tin trang sức kim cương...</p>
      </div>
    );
  }

  const favorite = isFavorite(product._id);
  const discountPercent = calculateDiscountPercentage(product.price, product.salePrice);
  const availableSizes = product.availableSizes || (product.size ? [product.size] : ['9', '10', '11', '12', '13', '14']);

  const handleAddToCart = () => {
    addItem(product, quantity, selectedSize);
  };

  const handleBuyNow = () => {
    addItem(product, quantity, selectedSize);
    navigate('/checkout');
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast('Đã sao chép liên kết sản phẩm vào bộ nhớ tạm!', 'success');
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim()) {
      showToast('Vui lòng nhập nội dung đánh giá', 'error');
      return;
    }
    setIsSubmittingReview(true);
    try {
      const res = await apiService.reviews.addReview({
        productId: product._id,
        userId: user?._id || 'guest',
        userName: user?.name || 'Khách hàng ẩn danh',
        rating: ratingInput,
        comment: commentInput.trim(),
      });
      setReviews((prev) => [res.data, ...prev]);
      setCommentInput('');
      showToast('Cảm ơn bạn đã gửi đánh giá sản phẩm!', 'success');
    } catch (err: any) {
      showToast('Không thể gửi đánh giá', 'error');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  return (
    <div className="bg-[#FAF8F5] min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-xs text-gray-500">
          <Link to="/" className="hover:text-[#997A15]">Trang Chủ</Link>
          <span>/</span>
          <Link to={`/products?category=${product.categoryId}`} className="hover:text-[#997A15]">
            {product.categoryName}
          </Link>
          <span>/</span>
          <span className="text-gray-800 font-semibold truncate max-w-xs">{product.name}</span>
        </nav>

        {/* Top Product Hero Grid */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 lg:p-10 shadow-sm border border-[#E8E2D5] grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Gallery - Left (5 cols) */}
          <div className="lg:col-span-6 space-y-4">
            {/* Main Stage Image with Zoom & Badges */}
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-[#FAF8F5] border border-[#EAE5DC] group">
              <img
                src={product.images[selectedImage] || product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700 cursor-zoom-in"
              />

              {/* Discount / Best Seller Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-1.5">
                {discountPercent > 0 && (
                  <span className="bg-red-600 text-white text-xs font-bold px-2.5 py-1 rounded shadow-md">
                    Tiết kiệm {discountPercent}%
                  </span>
                )}
                {product.certificate && (
                  <span className="bg-[#0B192C] text-[#F4E8C1] border border-[#D4AF37]/50 text-xs font-semibold px-2.5 py-1 rounded-full shadow-md flex items-center gap-1">
                    <Diamond className="w-3.5 h-3.5 text-[#D4AF37]" />
                    {product.certificate} Certified
                  </span>
                )}
              </div>

              {/* Share & Wishlist overlay buttons */}
              <div className="absolute top-4 right-4 flex flex-col gap-2">
                <button
                  id="btn-detail-wishlist"
                  onClick={() => toggleFavorite(product)}
                  className={`p-2.5 rounded-full backdrop-blur-md transition-all shadow-md ${
                    favorite ? 'bg-red-50 text-red-600' : 'bg-white/80 text-gray-700 hover:text-red-500'
                  }`}
                  title="Yêu thích"
                >
                  <Heart className={`w-5 h-5 ${favorite ? 'fill-current' : ''}`} />
                </button>
                <button
                  id="btn-detail-share"
                  onClick={handleShare}
                  className="p-2.5 rounded-full bg-white/80 text-gray-700 hover:text-[#0B192C] backdrop-blur-md shadow-md transition-all"
                  title="Chia sẻ sản phẩm"
                >
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Thumbnail Carousel */}
            {product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`w-20 h-20 shrink-0 rounded-xl overflow-hidden border-2 transition-all ${
                      selectedImage === idx
                        ? 'border-[#D4AF37] ring-2 ring-[#D4AF37]/30 shadow-md'
                        : 'border-gray-200 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Purchase Actions - Right (7 cols) */}
          <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              
              {/* Category & SKU */}
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span className="font-semibold uppercase tracking-wider text-[#997A15]">
                  {product.categoryName}
                </span>
                <span className="font-mono bg-gray-100 px-2 py-0.5 rounded">Mã: {product.sku}</span>
              </div>

              {/* Title */}
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold font-serif text-[#0B192C] leading-snug">
                {product.name}
              </h1>

              {/* Rating & Stock Status */}
              <div className="flex items-center gap-3 text-xs">
                <div className="flex items-center text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < Math.round(product.rating) ? 'fill-current' : 'text-gray-300'}`}
                    />
                  ))}
                  <span className="ml-1.5 font-bold text-gray-900">{product.rating.toFixed(1)}</span>
                </div>
                <span className="text-gray-300">|</span>
                <span className="text-gray-500">{product.reviewCount} đánh giá xác thực</span>
                <span className="text-gray-300">|</span>
                <span className={`font-semibold ${product.stock > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                  {product.stock > 0 ? `Còn ${product.stock} sản phẩm` : 'Tạm hết hàng'}
                </span>
              </div>

              {/* Price Banner */}
              <div className="p-4 bg-[#FAF8F5] rounded-2xl border border-[#E8E2D5] flex items-baseline gap-4">
                <span className="text-2xl sm:text-3xl font-bold text-[#0B192C]">
                  {formatCurrency(product.salePrice || product.price)}
                </span>
                {product.salePrice && product.salePrice < product.price && (
                  <>
                    <span className="text-sm sm:text-base text-gray-400 line-through">
                      {formatCurrency(product.price)}
                    </span>
                    <span className="text-xs bg-red-600 text-white font-bold px-2 py-0.5 rounded">
                      -{discountPercent}%
                    </span>
                  </>
                )}
              </div>

              {/* Short summary description */}
              {product.shortDescription && (
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-light">
                  {product.shortDescription}
                </p>
              )}

              {/* 4C Diamond Summary Block */}
              {product.carat && (
                <div className="p-4 bg-[#0B192C] text-white rounded-2xl border border-[#D4AF37]/40 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-serif font-bold text-[#F4E8C1] flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                      Thông Số Kim Cương 4C
                    </span>
                    <button
                      onClick={() => setStandardsModalOpen(true)}
                      className="text-[11px] text-[#D4AF37] hover:underline"
                    >
                      Cẩm nang 4C →
                    </button>
                  </div>

                  <div className="grid grid-cols-4 gap-2 text-center text-xs">
                    <div className="p-2 bg-[#172A45] rounded-xl border border-gray-700">
                      <span className="text-[10px] text-gray-400 uppercase">Trọng lượng</span>
                      <div className="font-bold text-white mt-0.5">{product.carat}ct</div>
                    </div>
                    <div className="p-2 bg-[#172A45] rounded-xl border border-gray-700">
                      <span className="text-[10px] text-gray-400 uppercase">Nước màu</span>
                      <div className="font-bold text-white mt-0.5">Nước {product.color}</div>
                    </div>
                    <div className="p-2 bg-[#172A45] rounded-xl border border-gray-700">
                      <span className="text-[10px] text-gray-400 uppercase">Độ sạch</span>
                      <div className="font-bold text-white mt-0.5">{product.clarity}</div>
                    </div>
                    <div className="p-2 bg-[#172A45] rounded-xl border border-gray-700">
                      <span className="text-[10px] text-gray-400 uppercase">Giác cắt</span>
                      <div className="font-bold text-[#D4AF37] mt-0.5">{product.cut || '3X'}</div>
                    </div>
                  </div>

                  {product.certificateNumber && (
                    <div className="pt-2 flex items-center justify-between text-[11px] text-gray-300 border-t border-gray-800">
                      <span>Mã GIA: <strong className="text-[#F4E8C1]">{product.certificateNumber}</strong></span>
                      <button
                        onClick={() => setCertModalOpen(true)}
                        className="text-[#D4AF37] hover:underline font-semibold"
                      >
                        Xem giấy kiểm định gốc
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Material and Shape */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                  <span className="text-gray-500 block text-[11px]">Chất liệu chế tác:</span>
                  <span className="font-bold text-gray-800">{product.material}</span>
                </div>
                {product.diamondShape && (
                  <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                    <span className="text-gray-500 block text-[11px]">Hình dạng kim cương:</span>
                    <span className="font-bold text-gray-800">{product.diamondShape}</span>
                  </div>
                )}
              </div>

              {/* Ring Size Selector */}
              {availableSizes.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-800">Kích Thước (Size Nhẫn / Dây):</span>
                    <button
                      onClick={() => setRingSizeModalOpen(true)}
                      className="text-[11px] text-[#997A15] hover:underline flex items-center gap-1 font-semibold"
                    >
                      <Ruler className="w-3.5 h-3.5" />
                      Hướng dẫn đo size nhẫn
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {availableSizes.map((s) => (
                      <button
                        key={s}
                        onClick={() => setSelectedSize(s)}
                        className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all ${
                          selectedSize === s
                            ? 'bg-[#0B192C] text-[#F4E8C1] border-[#0B192C] shadow-sm'
                            : 'bg-white text-gray-700 border-gray-300 hover:border-[#D4AF37]'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity Selector */}
              <div className="flex items-center gap-4 pt-2">
                <span className="text-xs font-bold text-gray-800">Số lượng:</span>
                <div className="flex items-center border border-gray-300 rounded-xl overflow-hidden bg-white">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3.5 py-2 text-gray-600 hover:bg-gray-100 font-bold"
                  >
                    -
                  </button>
                  <span className="px-4 py-2 text-xs font-bold text-gray-900">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="px-3.5 py-2 text-gray-600 hover:bg-gray-100 font-bold"
                  >
                    +
                  </button>
                </div>
              </div>

            </div>

            {/* Bottom Actions Buttons */}
            <div className="space-y-3 pt-6 border-t border-gray-100">
              <div className="flex gap-3">
                <button
                  id="btn-add-to-cart-page"
                  onClick={handleAddToCart}
                  disabled={product.stock <= 0}
                  className="flex-1 py-3.5 bg-[#0B192C] hover:bg-[#1E3E62] text-[#F4E8C1] font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4 text-[#D4AF37]" />
                  Thêm vào giỏ hàng
                </button>

                <button
                  id="btn-buy-now-page"
                  onClick={handleBuyNow}
                  disabled={product.stock <= 0}
                  className="flex-1 py-3.5 bg-gradient-to-r from-[#D4AF37] to-[#AA771C] hover:brightness-110 text-[#0B192C] font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  Mua ngay
                </button>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-3 text-[11px] text-gray-500 text-center">
                <span className="flex items-center justify-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" /> GIA 100%
                </span>
                <span className="flex items-center justify-center gap-1">
                  <Truck className="w-3.5 h-3.5 text-[#D4AF37]" /> Miễn phí giao
                </span>
                <span className="flex items-center justify-center gap-1">
                  <RotateCcw className="w-3.5 h-3.5 text-[#D4AF37]" /> Thu đổi minh bạch
                </span>
              </div>
            </div>

          </div>

        </div>

        {/* Detailed Tabs (Mô Tả, Thông Số, Chính Sách, Đánh Giá) */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-[#E8E2D5]">
          
          {/* Tab Navigation */}
          <div className="flex border-b border-gray-200 gap-6 overflow-x-auto">
            {[
              { key: 'desc', label: 'Mô Tả Chi Tiết' },
              { key: 'specs', label: 'Thông Số Kỹ Thuật & 4C' },
              { key: 'policy', label: 'Bảo Hành & Đổi Trả' },
              { key: 'reviews', label: `Đánh Giá Từ Khách Hàng (${reviews.length})` },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`pb-4 text-xs sm:text-sm font-bold uppercase tracking-wider transition-all relative whitespace-nowrap ${
                  activeTab === tab.key
                    ? 'text-[#0B192C] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#D4AF37]'
                    : 'text-gray-400 hover:text-gray-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab 1: Description */}
          {activeTab === 'desc' && (
            <div className="py-6 space-y-4 text-xs sm:text-sm text-gray-700 leading-relaxed max-w-4xl">
              <p>{product.description}</p>
              <div className="p-4 bg-[#FAF8F5] rounded-2xl border border-[#E8E2D5] space-y-2 mt-4">
                <h4 className="font-bold text-[#0B192C] text-xs uppercase tracking-wider">
                  Đặc Điểm Nổi Bật Của Tuyệt Tác
                </h4>
                <ul className="list-disc pl-5 space-y-1.5 text-xs text-gray-600">
                  <li>Chế tác thủ công tinh xảo bởi các nghệ nhân kim hoàn bậc thầy trên 15 năm kinh nghiệm.</li>
                  <li>Sử dụng hợp kim vàng 18K / Bạch Kim 950 nguyên chất có độ bền màu vĩnh cửu.</li>
                  <li>Kim cương chủ đạt chuẩn huỳnh quang None (Không phát quang), đảm bảo độ trong suốt tuyệt đối.</li>
                  <li>Tặng kèm hộp đựng sơn mài sang trọng và bộ vệ sinh trang sức cao cấp.</li>
                </ul>
              </div>
            </div>
          )}

          {/* Tab 2: Specs */}
          {activeTab === 'specs' && (
            <div className="py-6 max-w-2xl">
              <table className="w-full text-xs text-left border border-gray-200 rounded-xl overflow-hidden">
                <tbody className="divide-y divide-gray-200">
                  <tr className="bg-[#FAF8F5]">
                    <td className="py-3 px-4 font-bold text-gray-600 w-1/3">Mã sản phẩm (SKU)</td>
                    <td className="py-3 px-4 font-mono text-gray-900">{product.sku}</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-bold text-gray-600">Loại sản phẩm</td>
                    <td className="py-3 px-4 text-gray-900">{product.categoryName}</td>
                  </tr>
                  <tr className="bg-[#FAF8F5]">
                    <td className="py-3 px-4 font-bold text-gray-600">Chất liệu kim loại</td>
                    <td className="py-3 px-4 text-gray-900">{product.material}</td>
                  </tr>
                  {product.carat && (
                    <>
                      <tr>
                        <td className="py-3 px-4 font-bold text-gray-600">Trọng lượng kim cương (Carat)</td>
                        <td className="py-3 px-4 text-gray-900 font-bold">{product.carat} ct</td>
                      </tr>
                      <tr className="bg-[#FAF8F5]">
                        <td className="py-3 px-4 font-bold text-gray-600">Hình dạng (Shape)</td>
                        <td className="py-3 px-4 text-gray-900">{product.diamondShape}</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4 font-bold text-gray-600">Nước màu (Color)</td>
                        <td className="py-3 px-4 text-gray-900">Nước {product.color}</td>
                      </tr>
                      <tr className="bg-[#FAF8F5]">
                        <td className="py-3 px-4 font-bold text-gray-600">Độ tinh khiết (Clarity)</td>
                        <td className="py-3 px-4 text-gray-900">{product.clarity}</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4 font-bold text-gray-600">Cấp độ giác cắt (Cut)</td>
                        <td className="py-3 px-4 text-gray-900">{product.cut}</td>
                      </tr>
                      <tr className="bg-[#FAF8F5]">
                        <td className="py-3 px-4 font-bold text-gray-600">Đơn vị kiểm định</td>
                        <td className="py-3 px-4 font-bold text-[#997A15]">{product.certificate} ({product.certificateNumber || 'Gốc kèm theo'})</td>
                      </tr>
                    </>
                  )}
                  <tr>
                    <td className="py-3 px-4 font-bold text-gray-600">Tình trạng bảo hành</td>
                    <td className="py-3 px-4 text-emerald-600 font-semibold">Bảo hành làm sạch & xi mới trọn đời</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {/* Tab 3: Policy */}
          {activeTab === 'policy' && (
            <div className="py-6 space-y-6 text-xs sm:text-sm text-gray-700 leading-relaxed">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-4 bg-[#FAF8F5] rounded-2xl border border-gray-200">
                  <h4 className="font-bold text-[#0B192C] mb-2 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-[#D4AF37]" /> Chính Sách Bảo Hành
                  </h4>
                  <p className="text-xs text-gray-600 leading-relaxed font-light">
                    Miễn phí siêu âm làm sáng, gắn lại kim cương tấm bị rơi và chỉnh size nhẫn trọn đời tại toàn bộ hệ thống showroom.
                  </p>
                </div>
                <div className="p-4 bg-[#FAF8F5] rounded-2xl border border-gray-200">
                  <h4 className="font-bold text-[#0B192C] mb-2 flex items-center gap-1.5">
                    <Truck className="w-4 h-4 text-[#D4AF37]" /> Vận Chuyển An Toàn
                  </h4>
                  <p className="text-xs text-gray-600 leading-relaxed font-light">
                    Miễn phí giao hàng hỏa tốc bảo hiểm 100%. Quý khách được kiểm tra giấy kiểm định GIA trước khi ký nhận.
                  </p>
                </div>
                <div className="p-4 bg-[#FAF8F5] rounded-2xl border border-gray-200">
                  <h4 className="font-bold text-[#0B192C] mb-2 flex items-center gap-1.5">
                    <RotateCcw className="w-4 h-4 text-[#D4AF37]" /> Quy Định Thu Đổi
                  </h4>
                  <p className="text-xs text-gray-600 leading-relaxed font-light">
                    Cam kết thu đổi kim cương viên lên đến 98% và trang sức theo biểu phí công khai minh bạch.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Tab 4: Reviews */}
          {activeTab === 'reviews' && (
            <div className="py-6 space-y-8">
              
              {/* Review Submit Form */}
              <div className="p-6 bg-[#FAF8F5] rounded-2xl border border-[#E8E2D5]">
                <h4 className="text-sm font-bold text-[#0B192C] uppercase tracking-wider mb-4 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-[#D4AF37]" />
                  Gửi Đánh Giá Của Quý Khách Về Sản Phẩm
                </h4>

                <form onSubmit={handleSubmitReview} className="space-y-4">
                  <div>
                    <span className="text-xs text-gray-600 block mb-1.5">Mức độ hài lòng:</span>
                    <div className="flex gap-1 text-amber-500">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          type="button"
                          key={star}
                          onClick={() => setRatingInput(star)}
                          className="p-1 hover:scale-110 transition-transform"
                        >
                          <Star className={`w-6 h-6 ${star <= ratingInput ? 'fill-current' : 'text-gray-300'}`} />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <textarea
                      rows={3}
                      placeholder="Chia sẻ cảm nhận chân thực của quý khách về độ lấp lánh, giác cắt, hộp quà..."
                      value={commentInput}
                      onChange={(e) => setCommentInput(e.target.value)}
                      required
                      className="w-full p-3 bg-white border border-gray-300 rounded-xl text-xs focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmittingReview}
                    className="px-6 py-2.5 bg-[#0B192C] hover:bg-[#1E3E62] text-white text-xs font-bold rounded-xl flex items-center gap-2 transition-colors"
                  >
                    <Send className="w-3.5 h-3.5" />
                    {isSubmittingReview ? 'Đang gửi...' : 'Gửi Đánh Giá'}
                  </button>
                </form>
              </div>

              {/* Reviews List */}
              <div className="space-y-4">
                {reviews.length > 0 ? (
                  reviews.map((rev) => (
                    <div key={rev._id} className="p-4 bg-white rounded-xl border border-gray-200 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={rev.userAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
                            alt={rev.userName}
                            className="w-8 h-8 rounded-full object-cover border border-[#D4AF37]"
                          />
                          <div>
                            <div className="text-xs font-bold text-[#0B192C]">{rev.userName}</div>
                            <span className="text-[10px] text-emerald-600 font-medium">✓ Đã mua hàng xác thực</span>
                          </div>
                        </div>
                        <div className="flex text-amber-500">
                          {[...Array(rev.rating)].map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-current" />
                          ))}
                        </div>
                      </div>

                      <p className="text-xs text-gray-700 leading-relaxed font-light pl-10">
                        {rev.comment}
                      </p>

                      <div className="text-[10px] text-gray-400 pl-10">
                        {formatDate(rev.createdAt)}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-gray-500 italic text-center py-4">
                    Chưa có đánh giá nào cho sản phẩm này. Hãy là người đầu tiên đánh giá!
                  </p>
                )}
              </div>

            </div>
          )}

        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="space-y-6 pt-4">
            <h2 className="text-xl sm:text-2xl font-bold font-serif text-[#0B192C]">
              Sản Phẩm Tương Tự Trong Bộ Sưu Tập
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          </div>
        )}

      </div>

      {/* GIA Certificate Modal */}
      {certModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden border border-[#D4AF37]">
            <div className="bg-[#0B192C] text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-[#D4AF37]" />
                <h3 className="text-sm font-bold font-serif text-[#F4E8C1]">Chứng Thư Giám Định GIA Gốc</h3>
              </div>
              <button onClick={() => setCertModalOpen(false)} className="text-gray-400 hover:text-white">
                ✕
              </button>
            </div>
            <div className="p-6 space-y-4 text-xs text-gray-700">
              <div className="text-center p-4 bg-[#FAF8F5] rounded-xl border border-gray-200">
                <Diamond className="w-8 h-8 text-[#D4AF37] mx-auto mb-2" />
                <div className="font-bold text-sm text-[#0B192C]">GIA DIAMOND DOSSIER</div>
                <div className="text-xs font-mono text-[#997A15] mt-1 font-bold">
                  Mã số: {product.certificateNumber || 'GIA-2487192031'}
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between border-b py-1.5">
                  <span className="text-gray-500">Trọng lượng (Carat Weight):</span>
                  <span className="font-bold">{product.carat} Carat</span>
                </div>
                <div className="flex justify-between border-b py-1.5">
                  <span className="text-gray-500">Cấp màu sắc (Color Grade):</span>
                  <span className="font-bold">Nước {product.color}</span>
                </div>
                <div className="flex justify-between border-b py-1.5">
                  <span className="text-gray-500">Độ tinh khiết (Clarity Grade):</span>
                  <span className="font-bold">{product.clarity}</span>
                </div>
                <div className="flex justify-between border-b py-1.5">
                  <span className="text-gray-500">Cấp giác cắt (Cut Grade):</span>
                  <span className="font-bold">{product.cut || 'Excellent'}</span>
                </div>
                <div className="flex justify-between border-b py-1.5">
                  <span className="text-gray-500">Khắc laser trên cạnh gờ:</span>
                  <span className="font-bold text-emerald-600">Đã khắc mã số GIA</span>
                </div>
              </div>
              <p className="text-[11px] text-gray-500 italic text-center">
                Chứng thư gốc được trao tận tay khách hàng kèm sản phẩm trong niêm phong bảo mật.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Ring Size Modal */}
      <RingSizeModal
        isOpen={ringSizeModalOpen}
        onClose={() => setRingSizeModalOpen(false)}
        onSelectSize={(size) => setSelectedSize(size)}
      />

      {/* 4C Standards Modal */}
      <DiamondStandardsModal
        isOpen={standardsModalOpen}
        onClose={() => setStandardsModalOpen(false)}
      />
    </div>
  );
};
