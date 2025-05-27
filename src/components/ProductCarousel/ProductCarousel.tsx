import React, { useState, useRef, useEffect } from "react";
import type { Product } from "../../types/chat.types";
import styles from "./ProductCarousel.module.css";
import { analyticsService } from "../../services/analytics/analyticsService";

interface ProductCarouselProps {
  products: Product[];
}

const ProductCarousel: React.FC<ProductCarouselProps> = ({ products }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const productsContainerRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Get all products to display, with duplicates for infinite scroll
  const allProducts = [...products, ...products, ...products];

  // Update carousel transform after index change
  useEffect(() => {
    if (!productsContainerRef.current) return;

    // Update the transform position based on the current index
    const slideWidth = 50; // Width as percentage
    const position = currentIndex * slideWidth;
    productsContainerRef.current.style.transform = `translateX(-${position}%)`;
  }, [currentIndex]);

  // Simple sliding - just update the index
  const handleNext = () => {
    if (isAnimating) return;
    setIsAnimating(true);

    // Always move one position forward
    const nextIndex = currentIndex + 1;

    // If we reach the end of one "round", we'll eventually need to reset
    // But we do that after sliding safely through the duplicated items
    if (nextIndex >= products.length * 2) {
      // Schedule a reset to the first round after animation completes
      setTimeout(() => {
        if (productsContainerRef.current) {
          setCurrentIndex(nextIndex % products.length);

          // Force reflow
          void productsContainerRef.current.offsetHeight;

          // Restore transition
          productsContainerRef.current.style.transition = "";
        }
      }, 300);
    }

    setCurrentIndex(nextIndex);

    setTimeout(() => {
      setIsAnimating(false);
    }, 300);
  };

  const handlePrevious = () => {
    if (isAnimating) return;
    setIsAnimating(true);

    // Always move one position backward
    const prevIndex = currentIndex - 1;

    // If we go before the first item of the first round, we need to reset
    if (prevIndex < 0) {
      // Schedule a reset to the last round after animation completes
      setTimeout(() => {
        if (productsContainerRef.current) {
          setCurrentIndex(products.length + prevIndex);

          // Force reflow
          void productsContainerRef.current.offsetHeight;

          // Restore transition
          productsContainerRef.current.style.transition = "";
        }
      }, 300);
    }

    setCurrentIndex(prevIndex);

    setTimeout(() => {
      setIsAnimating(false);
    }, 300);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd || isAnimating) return;

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
      eventType: "view_product",
      eventData: { productId: product.id, productTitle: product.title },
    });

    // Open link if provided
    if (product.link) {
      window.open(product.link, "_blank");
    }
  };

  // Track when products are shown
  useEffect(() => {
    if (products && products.length > 0) {
      const actualIndex = currentIndex % products.length;
      analyticsService.trackEvent({
        eventType: "view_product",
        eventData: {
          productId: products[actualIndex].id,
          productTitle: products[actualIndex].title,
          viewType: "carousel",
        },
      });
    }
  }, [currentIndex, products]);

  // Truncate product titles to ensure consistent height
  const truncateTitle = (title: string, maxLength = 40) => {
    return title.length > maxLength
      ? `${title.substring(0, maxLength)}...`
      : title;
  };

  if (!products || products.length === 0) {
    return null;
  }

  return (
    <div className={styles.carousel} ref={containerRef}>
      <div
        className={styles.carouselInner}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className={styles.productRow}>
          <div
            className={styles.productsContainer}
            ref={productsContainerRef}
            style={{
              transition: isAnimating ? "transform 0.3s ease !important" : "",
            }}
          >
            {allProducts.map((product, index) => (
              <div
                key={`${product.id}-${index}`}
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
                  <h3 className={styles.productTitle}>
                    {truncateTitle(product.title)}
                  </h3>
                  <p className={styles.productPrice}>{product.price}</p>
                </div>
              </div>
            ))}
          </div>

          {products.length > 1 && (
            <button
              className={styles.nextButton}
              onClick={handleNext}
              aria-label="Next product"
              disabled={isAnimating}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9 18l6-6-6-6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCarousel;
