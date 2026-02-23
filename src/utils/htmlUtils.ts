/**
 * HTML utility functions for HTML string manipulation
 */

/**
 * Strips HTML tags from a string and returns plain text
 * Also decodes HTML entities and normalizes whitespace
 * 
 * @param html - The HTML string to strip
 * @returns Plain text without HTML tags
 * 
 * @example
 * stripHtml('<p>Hello <strong>world</strong>!</p>') // Returns: "Hello world!"
 * stripHtml('&lt;p&gt;Text&lt;/p&gt;') // Returns: "Text"
 */
export const stripHtml = (html: string): string => {
  if (!html) return '';
  
  // Create a temporary DOM element to parse HTML
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  
  // Get text content (automatically strips HTML tags)
  let text = tmp.textContent || tmp.innerText || '';
  
  // Trim whitespace and replace multiple spaces with single space
  text = text.trim().replace(/\s+/g, ' ');
  
  return text;
};

