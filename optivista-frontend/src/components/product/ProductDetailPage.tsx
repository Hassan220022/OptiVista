import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import productService from '../../services/productService';
import Product, { ProductVariant } from '../../types/product';
import ARViewerComponent from '../ar/ARViewerComponent';

/**
 * ProductDetailPage
 * 
 * Displays detailed information about a product, including images, specs,
 * pricing, and provides AR try-on functionality
 */
const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showARViewer, setShowARViewer] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  
  // Fetch product data from MySQL database via API
  useEffect(() => {
    const fetchProductData = async () => {
      if (!id) {
        setError('Product ID is missing');
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        const productData = await productService.getProductById(id);
        setProduct(productData);
        
        // Set default variant if available
        if (productData.variants && productData.variants.length > 0) {
          setSelectedVariant(productData.variants[0].id);
        }
      } catch (err) {
        console.error('Failed to fetch product:', err);
        setError('Failed to load product data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProductData();
  }, [id]);
  
  // Handle try-on button click
  const handleTryOn = () => {
    // Only show AR viewer if product has a 3D model
    if (product && product.modelUrl) {
      setShowARViewer(true);
    } else {
      alert('AR try-on is not available for this product');
    }
  };
  
  // Handle variant selection
  const handleVariantChange = (variantId: string) => {
    setSelectedVariant(variantId);
  };
  
  // Handle quantity change
  const handleQuantityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setQuantity(parseInt(e.target.value, 10));
  };
  
  // Handle add to cart
  const handleAddToCart = () => {
    if (!product) return;
    
    // In a real implementation, this would add the product to the cart
    // through a cart service or context
    alert(`Added ${quantity} ${product.name} to cart`);
  };
  
  // Handle buy now
  const handleBuyNow = () => {
    if (!product) return;
    
    // In a real implementation, this would add the product to the cart
    // and navigate to checkout
    alert(`Proceeding to checkout with ${quantity} ${product.name}`);
    navigate('/checkout');
  };
  
  if (loading) {
    return (
      <div className="product-detail-container">
        <div className="loading-spinner"></div>
        <p>Loading product details...</p>
      </div>
    );
  }
  
  if (error || !product) {
    return (
      <div className="product-detail-container error">
        <h2>Error</h2>
        <p>{error || 'Product not found'}</p>
        <button onClick={() => navigate('/products')} className="back-button">
          Back to Products
        </button>
      </div>
    );
  }
  
  return (
    <div className="product-detail-container">
      {showARViewer ? (
        <ARViewerComponent 
          product={product} 
          onClose={() => setShowARViewer(false)} 
        />
      ) : (
        <>
          <div className="product-detail-grid">
            {/* Product Image Section */}
            <div className="product-image-section">
              <img 
                src={product.imageUrl || '/placeholder-image.jpg'} 
                alt={product.name} 
                className="product-main-image" 
              />
              
              {/* Try-on button */}
              <div className="ar-try-on-section">
                <button 
                  className={`try-on-button ${!product.modelUrl ? 'disabled' : ''}`}
                  onClick={handleTryOn}
                  disabled={!product.modelUrl}
                >
                  <span className="ar-icon">👓</span> 
                  Try On with AR
                </button>
                {!product.modelUrl && (
                  <p className="ar-unavailable-text">
                    AR try-on is not available for this product
                  </p>
                )}
              </div>
            </div>
            
            {/* Product Info Section */}
            <div className="product-info-section">
              <h1 className="product-name">{product.name}</h1>
              
              <div className="product-price-section">
                <span className="product-price">${product.price.toFixed(2)}</span>
                {product.discount && (
                  <span className="product-discount">
                    ${(product.price * (1 - product.discount)).toFixed(2)}
                  </span>
                )}
              </div>
              
              {/* Rating section */}
              {product.rating && (
                <div className="product-rating">
                  <div className="stars" style={{ width: `${product.rating * 20}%` }}></div>
                  <span className="rating-value">({product.rating.toFixed(1)})</span>
                </div>
              )}
              
              {/* Product variants */}
              {product.variants && product.variants.length > 0 && (
                <div className="product-variants">
                  <h3>Colors</h3>
                  <div className="variant-options">
                    {product.variants.map((variant: ProductVariant) => (
                      <div 
                        key={variant.id}
                        className={`variant-option ${selectedVariant === variant.id ? 'selected' : ''}`}
                        style={{ backgroundColor: variant.color }}
                        onClick={() => handleVariantChange(variant.id)}
                        title={variant.name}
                      />
                    ))}
                  </div>
                </div>
              )}
              
              {/* Quantity selector */}
              <div className="quantity-selector">
                <label htmlFor="quantity">Quantity:</label>
                <select 
                  id="quantity" 
                  value={quantity} 
                  onChange={handleQuantityChange}
                >
                  {Array.from({ length: 10 }, (_, i) => i + 1).map(num => (
                    <option key={num} value={num}>{num}</option>
                  ))}
                </select>
              </div>
              
              {/* Stock status */}
              <p className={`stock-status ${product.inStock ? 'in-stock' : 'out-of-stock'}`}>
                {product.inStock ? 'In Stock' : 'Out of Stock'}
                {product.inStock && product.stockQuantity < 10 && (
                  <span className="low-stock-warning">
                    Only {product.stockQuantity} left!
                  </span>
                )}
              </p>
              
              {/* Action buttons */}
              <div className="product-actions">
                <button 
                  className="add-to-cart-button"
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                >
                  Add to Cart
                </button>
                <button 
                  className="buy-now-button"
                  onClick={handleBuyNow}
                  disabled={!product.inStock}
                >
                  Buy Now
                </button>
              </div>
            </div>
          </div>
          
          {/* Product Details Tabs */}
          <div className="product-details-tabs">
            <div className="tabs-header">
              <div className="tab active">Description</div>
              <div className="tab">Specifications</div>
              <div className="tab">Reviews</div>
            </div>
            
            <div className="tabs-content">
              <div className="tab-pane active">
                <h3>Product Description</h3>
                <p>{product.description}</p>
              </div>
            </div>
          </div>
          
          {/* Product Specs */}
          <div className="product-specifications">
            <h3>Specifications</h3>
            <table className="specs-table">
              <tbody>
                <tr>
                  <td>Style</td>
                  <td>{product.style}</td>
                </tr>
                <tr>
                  <td>Material</td>
                  <td>{product.material}</td>
                </tr>
                <tr>
                  <td>Gender</td>
                  <td>{product.gender}</td>
                </tr>
                <tr>
                  <td>Size</td>
                  <td>{product.size}</td>
                </tr>
                <tr>
                  <td>Color</td>
                  <td>{product.color}</td>
                </tr>
                <tr>
                  <td>Weight</td>
                  <td>{product.weight}g</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          {/* Related Products (placeholders) */}
          <div className="related-products">
            <h3>You might also like</h3>
            <div className="related-products-grid">
              {/* This would be populated with actual related products from API */}
              <div className="related-product-placeholder"></div>
              <div className="related-product-placeholder"></div>
              <div className="related-product-placeholder"></div>
              <div className="related-product-placeholder"></div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ProductDetailPage; 