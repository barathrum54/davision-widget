import React, { useState } from 'react';
import type { Product } from '../../types/chat.types';
import styles from './ProductCarousel.module.css';

interface ProductCarouselProps {
  products: Product[];
}

const ProductCarousel: React.FC<ProductCarouselProps> = ({ products }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

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

  if (!products || products.length === 0) {
    return null;
  }

  return (
    <div className={styles.carousel}>
      <div className={styles.carouselInner}>
        {products.map((product, index) => (
          <div
            key={product.id}
            className={`${styles.carouselItem} ${
              index === currentIndex ? styles.active : ''
            }`}
            aria-hidden={index !== currentIndex}
          >
            <div className={styles.productCard}>
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
          </div>
        ))}
      </div>

      {products.length > 1 && (
        <div className={styles.carouselControls}>
          <button
            className={styles.carouselControl}
            onClick={handlePrevious}
            aria-label="Previous product"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M15.41 7.41L14 6L8 12L14 18L15.41 16.59L10.83 12L15.41 7.41Z"
                fill="currentColor"
              />
            </svg>
          </button>
          <div className={styles.carouselDots}>
            {products.map((_, index) => (
              <button
                key={index}
                className={`${styles.carouselDot} ${
                  index === currentIndex ? styles.activeDot : ''
                }`}
                onClick={() => setCurrentIndex(index)}
                aria-label={`Go to product ${index + 1}`}
              />
            ))}
          </div>
          <button
            className={styles.carouselControl}
            onClick={handleNext}
            aria-label="Next product"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10 6L8.59 7.41L13.17 12L8.59 16.59L10 18L16 12L10 6Z"
                fill="currentColor"
              />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductCarousel; 