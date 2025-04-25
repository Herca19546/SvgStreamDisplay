import DOMPurify from 'dompurify';

/**
 * Sanitizes SVG content to prevent XSS attacks
 */
export function sanitizeSvg(content: string): string {
  // Configure DOMPurify specifically for SVG
  DOMPurify.addHook('afterSanitizeAttributes', function(node) {
    // If it's an SVG element
    if (node.nodeName.toLowerCase() === 'svg') {
      // Ensure the SVG has proper viewBox attribute if missing
      if (!node.getAttribute('viewBox') && node.getAttribute('width') && node.getAttribute('height')) {
        node.setAttribute('viewBox', `0 0 ${node.getAttribute('width')} ${node.getAttribute('height')}`);
      }
    }
  });

  // Set specific config for SVG content
  const config = {
    ADD_TAGS: ['svg', 'path', 'circle', 'rect', 'line', 'polyline', 'polygon', 'g', 'text', 'tspan'],
    ADD_ATTR: ['viewBox', 'preserveAspectRatio', 'xmlns', 'd', 'r', 'cx', 'cy', 'x', 'y', 'width', 'height', 'fill', 'stroke', 'stroke-width', 'stroke-linecap', 'stroke-linejoin', 'points', 'transform', 'text-anchor', 'font-size', 'font-family']
  };

  return DOMPurify.sanitize(content, {
    ...config,
    USE_PROFILES: { svg: true }
  });
}

/**
 * Extracts metadata from SVG content
 */
export function extractSvgMetadata(content: string) {
  const parser = new DOMParser();
  const svgDoc = parser.parseFromString(content, 'image/svg+xml');
  const svgElement = svgDoc.documentElement;

  // Get dimensions
  const width = svgElement.getAttribute('width');
  const height = svgElement.getAttribute('height');
  
  // Count elements
  const elementCount = svgDoc.querySelectorAll('*').length;
  
  // Calculate size
  const size = content.length;

  return {
    width: width ? parseInt(width, 10) : undefined,
    height: height ? parseInt(height, 10) : undefined,
    elementCount,
    size
  };
}

/**
 * Validates if string is a valid SVG
 */
export function isValidSvg(content: string): boolean {
  if (!content.trim()) return false;
  
  const trimmedContent = content.trim();
  if (!trimmedContent.startsWith('<svg') || !trimmedContent.endsWith('</svg>')) {
    return false;
  }
  
  // Check if it parses correctly
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(trimmedContent, 'image/svg+xml');
    
    // Check for parsing errors
    const errorNode = doc.querySelector('parsererror');
    return !errorNode;
  } catch (e) {
    return false;
  }
}
