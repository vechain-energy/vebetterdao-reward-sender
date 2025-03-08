/**
 * Gets the correct URL for a token icon
 * 
 * If the icon path is a full HTTPS URL, it will be used directly.
 * Otherwise, it will be constructed from the VeChain token registry base URL
 * 
 * @param iconPath The icon path from the token data
 * @returns The complete URL to the token icon
 */
export const getTokenIconUrl = (iconPath: string): string => {
  // If it's already a full URL, use it directly
  if (iconPath && (iconPath.startsWith('https://') || iconPath.startsWith('http://'))) {
    return iconPath;
  }
  // Otherwise, construct the URL from the registry base
  return `https://vechain.github.io/token-registry/assets/${iconPath}`;
}; 