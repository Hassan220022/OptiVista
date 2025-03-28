import React, { useEffect, useRef, useState } from 'react';
import Product from '../../types/product';
import useUnityAR from '../../hooks/useUnityAR';

interface ARViewerProps {
  product: Product;
  onClose: () => void;
}

/**
 * ARViewerComponent
 * 
 * This component provides AR visualization for virtual eyewear try-on
 * It uses platform-specific AR (ARKit on iOS, ARCore on Android)
 * with Unity AR as a rendering engine
 */
const ARViewerComponent: React.FC<ARViewerProps> = ({ product, onClose }) => {
  const arContainerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isARSupported, setIsARSupported] = useState(true);
  
  // Use Unity AR hook for handling AR functionality
  const {
    isLoaded,
    isLoading,
    reload,
    controls
  } = useUnityAR({
    modelUrl: product.modelUrl || '',
    containerRef: arContainerRef,
    onLoad: () => {
      console.log('Unity AR loaded successfully');
      setError(null);
    },
    onError: (errorMessage) => {
      console.error('Unity AR error:', errorMessage);
      setError(errorMessage);
    }
  });
  
  // Detect device capabilities on component mount
  useEffect(() => {
    const checkARSupport = async () => {
      try {
        // Check if device supports AR (simplified check, would be more complex in production)
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
        const isAndroid = /Android/.test(navigator.userAgent);
        
        if (!isIOS && !isAndroid) {
          setIsARSupported(false);
          setError("AR is only supported on iOS and Android devices");
          return;
        }
        
        // For iOS, check ARKit support
        if (isIOS) {
          // In a real implementation, we would check for ARKit support
          // using native bridge APIs
          console.log("iOS device detected, assuming ARKit support");
        }
        
        // For Android, check ARCore support
        if (isAndroid) {
          // In a real implementation, we would check for ARCore support
          // using native bridge APIs
          console.log("Android device detected, assuming ARCore support");
        }
        
        // Check if the product has a 3D model
        if (!product.modelUrl) {
          setError("This product doesn't have a 3D model for AR visualization");
          return;
        }
      } catch (err) {
        console.error("Failed to initialize AR:", err);
        setError("Failed to initialize AR. Please ensure your device supports AR and try again.");
      }
    };
    
    checkARSupport();
  }, [product]);
  
  // Handle camera permission request
  const requestCameraPermission = async () => {
    try {
      // Request camera access
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      
      // Stop the stream immediately as we just needed the permission
      stream.getTracks().forEach(track => track.stop());
      
      // Reload Unity AR
      reload();
    } catch (err) {
      console.error("Camera permission denied:", err);
      setError("Camera access is required for AR functionality.");
    }
  };
  
  // Handle zoom in
  const handleZoomIn = () => {
    controls.adjustScale(1.1); // Increase scale by 10%
  };
  
  // Handle zoom out
  const handleZoomOut = () => {
    controls.adjustScale(0.9); // Decrease scale by 10%
  };
  
  // Handle rotation
  const handleRotate = () => {
    controls.adjustRotation(0, 10, 0); // Rotate 10 degrees on Y axis
  };
  
  // Handle capture
  const handleCapture = () => {
    controls.captureScreenshot();
    alert('Screenshot captured! In a real implementation, this would save or share the image.');
  };
  
  // Handle share
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Try-on of ${product.name}`,
        text: `Check out how ${product.name} looks on me!`,
        url: window.location.href,
      })
      .catch((error) => console.error('Error sharing:', error));
    } else {
      alert('Web Share API not supported on this browser.');
    }
  };
  
  if (!isARSupported) {
    return (
      <div className="ar-viewer-container">
        <div className="ar-not-supported">
          <h3>AR Not Supported</h3>
          <p>This feature requires an iOS or Android device with AR capabilities.</p>
          <p>You can still view product images in the gallery.</p>
          <button onClick={onClose} className="primary-button">
            Back to Product
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="ar-viewer-container">
      <div className="ar-viewer-header">
        <h3>Virtual Try-On: {product.name}</h3>
        <button onClick={onClose} className="close-button">
          ×
        </button>
      </div>
      
      {isLoading && (
        <div className="ar-loading">
          <div className="spinner"></div>
          <p>Initializing AR experience...</p>
        </div>
      )}
      
      {error && (
        <div className="ar-error">
          <p>{error}</p>
          <div className="ar-error-actions">
            <button onClick={reload} className="retry-button">
              Retry
            </button>
            <button onClick={requestCameraPermission} className="permission-button">
              Grant Camera Access
            </button>
            <button onClick={onClose} className="secondary-button">
              Cancel
            </button>
          </div>
        </div>
      )}
      
      {/* AR View Container */}
      <div 
        ref={arContainerRef} 
        className="ar-view"
        style={{ 
          display: isLoading || error ? 'none' : 'block',
          width: '100%',
          height: '80vh',
          backgroundColor: '#000'
        }}
      >
        {/* AR content rendered by Unity/ARKit/ARCore will be attached here */}
        {isLoaded && !error && (
          <div className="ar-overlay-info">
            <p>Try moving your head to see different angles</p>
          </div>
        )}
      </div>
      
      {/* AR Controls */}
      {isLoaded && !error && (
        <div className="ar-controls">
          <button className="control-button zoom-in" onClick={handleZoomIn}>
            Zoom In
          </button>
          <button className="control-button zoom-out" onClick={handleZoomOut}>
            Zoom Out
          </button>
          <button className="control-button rotate" onClick={handleRotate}>
            Rotate
          </button>
          <button className="control-button capture" onClick={handleCapture}>
            Capture
          </button>
          <button className="control-button share" onClick={handleShare}>
            Share
          </button>
        </div>
      )}
      
      {/* Product Details Overlay */}
      {isLoaded && !error && (
        <div className="product-info-overlay">
          <h4>{product.name}</h4>
          <p className="price">${product.price.toFixed(2)}</p>
          <button className="add-to-cart-button" onClick={() => alert('Product would be added to cart')}>
            Add to Cart
          </button>
        </div>
      )}
    </div>
  );
};

export default ARViewerComponent; 