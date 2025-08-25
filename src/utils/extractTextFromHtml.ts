/**
 * Extracts plain text from HTML/Markdown content for text-to-speech
 * Preserves paragraph breaks and adds pauses for better speech flow
 */
export const extractTextFromHtml = (htmlContent: string): string => {
  // Create a temporary DOM element to parse HTML
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = htmlContent;

  // Remove script and style elements
  const scriptsAndStyles = tempDiv.querySelectorAll('script, style');
  scriptsAndStyles.forEach(el => el.remove());

  // Process different elements with appropriate pauses
  const processNode = (node: Node): string => {
    if (node.nodeType === Node.TEXT_NODE) {
      return node.textContent?.trim() || '';
    }

    if (node.nodeType === Node.ELEMENT_NODE) {
      const element = node as Element;
      const tagName = element.tagName.toLowerCase();
      
      // Skip certain elements
      if (['script', 'style', 'noscript'].includes(tagName)) {
        return '';
      }

      // Get text content from children
      let text = Array.from(node.childNodes)
        .map(child => processNode(child))
        .filter(text => text.length > 0)
        .join(' ');

      // Add pauses after certain elements for better speech flow
      if (['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(tagName)) {
        text += '. '; // Add pause after headings
      } else if (['p', 'div', 'li', 'blockquote'].includes(tagName)) {
        text += '. '; // Add pause after paragraphs and list items
      } else if (['br'].includes(tagName)) {
        text += '. '; // Convert line breaks to pauses
      }

      return text;
    }

    return '';
  };

  let text = processNode(tempDiv);

  // Clean up the text
  text = text
    // Remove extra whitespace
    .replace(/\s+/g, ' ')
    // Remove multiple periods
    .replace(/\.{2,}/g, '. ')
    // Remove period before punctuation
    .replace(/\.\s*([,;:!?])/g, '$1')
    // Ensure proper spacing after punctuation
    .replace(/([.!?])\s*([A-Z])/g, '$1 $2')
    // Clean up common markdown artifacts
    .replace(/\*\*([^*]+)\*\*/g, '$1') // Bold
    .replace(/\*([^*]+)\*/g, '$1') // Italic
    .replace(/`([^`]+)`/g, '$1') // Code
    .replace(/#{1,6}\s*/g, '') // Headers
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Links
    // Fix numbered lists
    .replace(/^\d+\.\s*/gm, '')
    // Fix bullet points
    .replace(/^[-*•]\s*/gm, '')
    // Clean up extra spaces and periods
    .replace(/\s*\.\s*\./g, '.')
    .replace(/\.\s*,/g, ',')
    .trim();

  return text;
};

/**
 * Formats time in milliseconds to MM:SS format
 */
export const formatTime = (ms: number): string => {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

/**
 * Detects if the content is primarily in a specific language
 * This is a simple heuristic - could be enhanced with proper language detection
 */
export const detectLanguage = (text: string): 'en' | 'ar' | 'fa' => {
  // Arabic script detection
  if (/[\u0600-\u06FF]/.test(text)) {
    return 'ar';
  }
  
  // Persian/Farsi script detection (includes Arabic script + Persian-specific characters)
  if (/[\u06A9\u06AF\u06C0\u06CC\u067E\u0686\u0698\u06A9]/.test(text)) {
    return 'fa';  
  }
  
  // Default to English for any other text
  return 'en';
};