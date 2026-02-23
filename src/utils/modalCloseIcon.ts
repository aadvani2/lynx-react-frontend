/**
 * Utility for adding custom cross icon styling to modals
 * Based on SweetAlert2 close button styling
 */

export interface CloseIconOptions {
  className?: string;
  backgroundColor?: string;
  hoverBackgroundColor?: string;
  size?: number;
  fontSize?: number;
  top?: string;
  right?: string;
}

const defaultOptions: Required<CloseIconOptions> = {
  className: 'custom-modal-close',
  backgroundColor: 'rgba(0, 0, 0, 0.15)',
  hoverBackgroundColor: 'rgba(0, 0, 0, 0.25)',
  size: 1.8,
  fontSize: 1.2,
  top: '0.7rem',
  right: '0.7rem'
};

/**
 * Injects custom CSS for modal close button
 * @param options - Customization options for the close button
 * @returns Function to cleanup the injected styles
 */
export const addModalCloseIconStyles = (options: CloseIconOptions = {}): (() => void) => {
  const config = { ...defaultOptions, ...options };
  
  const style = document.createElement('style');
  style.textContent = `
    .${config.className} {
      font-family: "Unicons", "Arial", sans-serif !important;
      font-size: 0 !important;
      position: absolute !important;
      top: ${config.top} !important;
      right: ${config.right} !important;
      width: ${config.size}rem !important;
      height: ${config.size}rem !important;
      border: none !important;
      border-radius: 50% !important;
      background: ${config.backgroundColor} !important;
      color: #333 !important;
      display: flex !important;
      justify-content: center !important;
      align-items: center !important;
      cursor: pointer !important;
      transition: background 0.2s ease-in-out !important;
      z-index: 1055 !important;
    }
    .${config.className}:before {
      content: "×" !important;
      font-size: ${config.fontSize}rem !important;
      font-weight: bold !important;
      line-height: 1 !important;
    }
    .${config.className}:hover {
      background: ${config.hoverBackgroundColor} !important;
    }
  `;
  
  document.head.appendChild(style);
  
  // Return cleanup function
  return () => {
    if (document.head.contains(style)) {
      document.head.removeChild(style);
    }
  };
};

/**
 * Utility function for managing modal close icon styles
 * This should be used in React components with useEffect
 * @param isOpen - Whether the modal is open
 * @param options - Customization options for the close button
 */
export const getModalCloseIconCleanup = (isOpen: boolean, options: CloseIconOptions = {}) => {
  // This is a utility function that returns the cleanup function
  // The actual useEffect should be called in the React component
  if (isOpen) {
    return addModalCloseIconStyles(options);
  }
  return () => {}; // Return empty cleanup function if not open
};

/**
 * Predefined configurations for common modal types
 */
export const modalCloseIconConfigs = {
  // Default configuration (matches SweetAlert2)
  default: {},
  
  // Light background variant
  light: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    hoverBackgroundColor: 'rgba(255, 255, 255, 0.9)',
    color: '#333'
  },
  
  // Dark background variant
  dark: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    hoverBackgroundColor: 'rgba(0, 0, 0, 0.5)',
    color: '#fff'
  },
  
  // Small size variant
  small: {
    size: 1.4,
    fontSize: 1.0,
    top: '0.5rem',
    right: '0.5rem'
  },
  
  // Large size variant
  large: {
    size: 2.2,
    fontSize: 1.4,
    top: '1rem',
    right: '1rem'
  }
};
