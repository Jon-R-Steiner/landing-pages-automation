// Placeholder image library for bathroom renovation categories
// Using placehold.co for high-quality placeholder images

export type ImageCategory =
  | 'walk-in-shower'
  | 'full-bathroom-remodel'
  | 'bathtub-installation'
  | 'shower-installation'
  | 'accessibility-bathroom'
  | 'luxury-bathroom'
  | 'small-bathroom'
  | 'master-bathroom';

interface PlaceholderConfig {
  width: number;
  height: number;
  text: string;
  bgColor: string;
  textColor: string;
}

function generatePlaceholderUrl(config: PlaceholderConfig): string {
  const { width, height, text, bgColor, textColor } = config;
  const encodedText = encodeURIComponent(text);
  return `https://placehold.co/${width}x${height}/${bgColor}/${textColor}?text=${encodedText}`;
}

export function getWalkInShowerPlaceholder(): string {
  return generatePlaceholderUrl({
    width: 1200,
    height: 600,
    text: 'Walk-In Shower Installation',
    bgColor: '3b82f6',
    textColor: 'ffffff',
  });
}

export function getFullBathroomRemodelPlaceholder(): string {
  return generatePlaceholderUrl({
    width: 1200,
    height: 600,
    text: 'Full Bathroom Remodel',
    bgColor: '8b5cf6',
    textColor: 'ffffff',
  });
}

export function getBathtubInstallationPlaceholder(): string {
  return generatePlaceholderUrl({
    width: 1200,
    height: 600,
    text: 'Bathtub Installation',
    bgColor: '10b981',
    textColor: 'ffffff',
  });
}

export function getShowerInstallationPlaceholder(): string {
  return generatePlaceholderUrl({
    width: 1200,
    height: 600,
    text: 'Shower Installation',
    bgColor: '06b6d4',
    textColor: 'ffffff',
  });
}

export function getAccessibilityBathroomPlaceholder(): string {
  return generatePlaceholderUrl({
    width: 1200,
    height: 600,
    text: 'Accessibility Bathroom',
    bgColor: 'f59e0b',
    textColor: 'ffffff',
  });
}

export function getLuxuryBathroomPlaceholder(): string {
  return generatePlaceholderUrl({
    width: 1200,
    height: 600,
    text: 'Luxury Bathroom',
    bgColor: 'ef4444',
    textColor: 'ffffff',
  });
}

export function getSmallBathroomPlaceholder(): string {
  return generatePlaceholderUrl({
    width: 1200,
    height: 600,
    text: 'Small Bathroom Remodel',
    bgColor: '84cc16',
    textColor: 'ffffff',
  });
}

export function getMasterBathroomPlaceholder(): string {
  return generatePlaceholderUrl({
    width: 1200,
    height: 600,
    text: 'Master Bathroom',
    bgColor: 'ec4899',
    textColor: 'ffffff',
  });
}

// Helper function to get placeholder by category
export function getPlaceholderByCategory(category: ImageCategory): string {
  switch (category) {
    case 'walk-in-shower':
      return getWalkInShowerPlaceholder();
    case 'full-bathroom-remodel':
      return getFullBathroomRemodelPlaceholder();
    case 'bathtub-installation':
      return getBathtubInstallationPlaceholder();
    case 'shower-installation':
      return getShowerInstallationPlaceholder();
    case 'accessibility-bathroom':
      return getAccessibilityBathroomPlaceholder();
    case 'luxury-bathroom':
      return getLuxuryBathroomPlaceholder();
    case 'small-bathroom':
      return getSmallBathroomPlaceholder();
    case 'master-bathroom':
      return getMasterBathroomPlaceholder();
    default:
      return getFullBathroomRemodelPlaceholder(); // fallback
  }
}
