/**
 * Placeholder image utilities
 * Provides fallback images when Walrus uploads fail or blobs are unavailable
 */

/**
 * Get a placeholder image URL
 * Uses placeholder.com service for demo purposes
 * 
 * @param width - Image width in pixels
 * @param height - Image height in pixels
 * @param text - Optional text to display on placeholder
 * @returns Placeholder image URL
 */
export function getPlaceholderImageUrl(
  width: number = 400,
  height: number = 300,
  text: string = 'Image'
): string {
  // Using placeholder.com service
  // Format: https://via.placeholder.com/{width}x{height}/{bgcolor}/{textcolor}?text={text}
  const bgColor = 'E5E7EB'; // Gray-200
  const textColor = '9CA3AF'; // Gray-400
  const encodedText = encodeURIComponent(text);
  
  return `https://via.placeholder.com/${width}x${height}/${bgColor}/${textColor}?text=${encodedText}`;
}

/**
 * Get a placeholder profile picture URL
 */
export function getPlaceholderProfilePicUrl(initial: string = 'U'): string {
  return getPlaceholderImageUrl(200, 200, initial.toUpperCase());
}

/**
 * Get a placeholder post image URL
 */
export function getPlaceholderPostImageUrl(): string {
  return getPlaceholderImageUrl(800, 450, 'Post+Image');
}

/**
 * Check if an image URL is a Walrus blob URL
 */
export function isWalrusUrl(url: string): boolean {
  return url.includes('walrus-testnet.walrus.space') || url.includes('walrus.walrus.space');
}

/**
 * Get a fallback image URL
 * Returns placeholder if the URL is a Walrus URL (indicating it might fail)
 * Otherwise returns the original URL
 */
export function getFallbackImageUrl(
  originalUrl: string | null | undefined,
  placeholderType: 'profile' | 'post' | 'bottle' = 'post',
  initial?: string
): string {
  if (!originalUrl) {
    switch (placeholderType) {
      case 'profile':
        return getPlaceholderProfilePicUrl(initial);
      case 'bottle':
        return getPlaceholderImageUrl(400, 600, 'Wine+Bottle');
      default:
        return getPlaceholderPostImageUrl();
    }
  }

  // If it's a Walrus URL, we might want to use placeholder as fallback
  // But for now, we'll let the image component handle the error
  return originalUrl;
}

