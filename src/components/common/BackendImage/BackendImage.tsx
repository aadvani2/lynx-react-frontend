import React, { useState, useEffect } from 'react';
import { getBackendImageUrl } from '../../../utils/urlUtils';
import styles from './BackendImage.module.css';

/**
 * Props for the BackendImage component
 */
export interface BackendImageProps {
  /** Raw backend path or full URL */
  src?: string | null;
  /** Optional fallback image (used if primary image fails) */
  fallbackSrc?: string | null;
  /** Alt text for the image (required for accessibility) */
  alt: string;
  /** Native loading strategy for the image (default: lazy) */
  loading?: 'lazy' | 'eager';
  /** CSS class to apply to the image/placeholder (controls size/shape from parent) */
  className?: string;
  /** Whether to show placeholder on error (default: true) */
  showPlaceholderOnError?: boolean;
  /** Whether to use getBackendImageUrl to transform the src (default: true) */
  useBackendUrl?: boolean;
  /** Whether to use getBackendImageUrl to transform the fallback src (default: same as useBackendUrl) */
  fallbackUseBackendUrl?: boolean;
  /** Placeholder text to display (default: "No Image") */
  placeholderText?: string;
  /** Placeholder image/icon to display (can be a URL string or imported image) */
  placeholderImage?: string | React.ReactNode;
  /** Whether to remove the grey background from placeholder (default: false) */
  transparentBackground?: boolean;
  /** Image width for LCP optimization and preventing layout shift */
  width?: number;
  /** Image height for LCP optimization and preventing layout shift */
  height?: number;
  /** Fetch priority for LCP images (use 'high' for above-the-fold images) */
  fetchPriority?: 'high' | 'low' | 'auto';
  /** Responsive srcset for different screen sizes */
  srcSet?: string;
  /** Sizes attribute for responsive images */
  sizes?: string;
}

/**
 * Reusable component for rendering backend images with lazy loading and error handling.
 * 
 * Features:
 * - Automatically transforms backend image paths using getBackendImageUrl
 * - Lazy loads images by default
 * - Shows a responsive placeholder when image fails to load or is missing
 * - Adapts to different layouts/sizes via className prop
 * 
 * Usage:
 * ```tsx
 * <BackendImage
 *   src={subcategory.image}
 *   alt={subcategory.title}
 *   className={styles.cardImage}
 *   placeholderText="No Image"
 * />
 * ```
 */
const BackendImage: React.FC<BackendImageProps> = ({
  src,
  fallbackSrc,
  alt,
  loading = 'lazy',
  className = '',
  showPlaceholderOnError = true,
  useBackendUrl = true,
  fallbackUseBackendUrl,
  placeholderText = 'No Image',
  placeholderImage,
  transparentBackground = false,
  width,
  height,
  fetchPriority,
  srcSet,
  sizes,
}) => {
  const [hasError, setHasError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState<string>('');

  // Reset error state when src changes
  useEffect(() => {
    setHasError(false);
  }, [src]);

  // Transform the src URL if needed
  const finalSrc = src && useBackendUrl ? getBackendImageUrl(src) : (src || '');
  const finalFallbackSrc =
    fallbackSrc
      ? (fallbackUseBackendUrl ?? useBackendUrl)
        ? getBackendImageUrl(fallbackSrc)
        : fallbackSrc
      : '';

  // Keep currentSrc in sync with primary src
  useEffect(() => {
    setCurrentSrc(finalSrc || '');
  }, [finalSrc]);

  // Determine if we should show the image or placeholder
  const shouldShowImage = !!currentSrc && !hasError;
  const shouldShowPlaceholder = !shouldShowImage && showPlaceholderOnError;

  // Combine classNames
  const imageClassName = className ? `${styles.image} ${className}` : styles.image;
  const placeholderBaseClass = transparentBackground 
    ? styles.placeholderTransparent 
    : styles.placeholder;
  const placeholderClassName = className 
    ? `${placeholderBaseClass} ${className}` 
    : placeholderBaseClass;

  // Render placeholder content
  const renderPlaceholder = () => {
    if (!shouldShowPlaceholder) return null;

    // If placeholderImage is provided
    if (placeholderImage) {
      // Check if it's a React node (like imported image) or a string URL
      if (typeof placeholderImage === 'string') {
        return (
          <div className={placeholderClassName}>
            <img 
              src={placeholderImage} 
              alt={alt || 'Placeholder'} 
              className={styles.placeholderImage}
            />
            {placeholderText && <span className={styles.placeholderText}>{placeholderText}</span>}
          </div>
        );
      } else {
        // It's a React node (imported image)
        return (
          <div className={placeholderClassName}>
            {placeholderImage}
            {placeholderText && <span className={styles.placeholderText}>{placeholderText}</span>}
          </div>
        );
      }
    }

    // Default: show text only
    return (
      <div className={placeholderClassName}>
        {placeholderText}
      </div>
    );
  };

  return (
    <>
      {shouldShowImage ? (
        <img
          src={currentSrc}
          alt={alt}
          loading={loading}
          onError={() => {
            if (finalFallbackSrc && currentSrc !== finalFallbackSrc) {
              setHasError(false);
              setCurrentSrc(finalFallbackSrc);
              return;
            }
            setHasError(true);
          }}
          className={imageClassName}
          width={width}
          height={height}
          fetchPriority={fetchPriority}
          srcSet={srcSet}
          sizes={sizes}
        />
      ) : (
        renderPlaceholder()
      )}
    </>
  );
};

export default BackendImage;
