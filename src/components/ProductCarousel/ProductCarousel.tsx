import React, { useState, useRef, useEffect } from 'react';
import type { Product } from '../../types/chat.types';
import styles from './ProductCarousel.module.css';
import { analyticsService } from '../../services/analytics/analyticsService';

interface ProductCarouselProps {
  products: Product[];
}

const ProductCarousel: React.FC<ProductCarouselProps> = ({ products }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const carouselRef = useRef<HTMLDivElement>(null);

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? products.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === products.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;
    
    if (isLeftSwipe) {
      handleNext();
    } else if (isRightSwipe) {
      handlePrevious();
    }
    
    setTouchStart(null);
    setTouchEnd(null);
  };

  const handleProductClick = (product: Product) => {
    // Track product click
    analyticsService.trackEvent({
      eventType: 'view_product',
      eventData: { productId: product.id, productTitle: product.title }
    });
    
    // Open link if provided
    if (product.link) {
      window.open(product.link, '_blank');
    }
  };

  // Track when products are shown
  useEffect(() => {
    if (products && products.length > 0) {
      analyticsService.trackEvent({
        eventType: 'view_product',
        eventData: { 
          productId: products[currentIndex].id,
          productTitle: products[currentIndex].title,
          viewType: 'carousel'
        }
      });
    }
  }, [currentIndex, products]);

  if (!products || products.length === 0) {
    return null;
  }

  // Only show two products at a time in the carousel
  const displayProducts = products.length > 1 
    ? [products[currentIndex], products[(currentIndex + 1) % products.length]]
    : [products[currentIndex]];

  return (
    <div className={styles.carousel} ref={carouselRef}>
      <div 
        className={styles.carouselInner}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className={styles.productRow}>
          {displayProducts.map((product) => (
            <div
              key={product.id}
              className={styles.productCard}
              onClick={() => handleProductClick(product)}
            >
              {product.image && (
                <div className={styles.productImageContainer}>
                  <img
                    src={product.image}
                    alt={product.title}
                    className={styles.productImage}
                  />
                </div>
              )}
              <div className={styles.productInfo}>
                <h3 className={styles.productTitle}>{product.title}</h3>
                <p className={styles.productPrice}>{product.price}</p>
              </div>
            </div>
          ))}
          {products.length > 2 && (
            <button 
              className={styles.nextButton}
              onClick={handleNext}
              aria-label="Next product"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          )}
        </div>
      </div>
      
      {products.length > 1 && (
        <div className={styles.carouselDots}>
          {products.map((_, index) => (
            <button
              key={index}
              className={`${styles.carouselDot} ${
                Math.floor(index / 2) === Math.floor(currentIndex / 2) ? styles.activeDot : ''
              }`}
              onClick={() => setCurrentIndex(index)}
              aria-label={`Go to product ${index + 1}`}
            />
          ))}
        </div>
      )}
      
      <div className={styles.carouselFooter}>
        <p className={styles.productQuestion}>Is there anything else I can help you with?</p>
      </div>
    </div>
  );
};

export default ProductCarousel; 