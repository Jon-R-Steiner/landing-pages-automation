import { notFound } from 'next/navigation';
import { PageType } from '@shared/types';
import { getPlaceholderByCategory } from '@/lib/placeholders';
import LandingPageHero from '@/components/LandingPageHero';

interface PageProps {
  params: {
    slug: string;
  };
}

// Valid page types for bathroom renovations
const validPageTypes: PageType[] = [
  'walk-in-shower',
  'full-bathroom-remodel',
  'bathtub-installation',
  'shower-installation',
  'accessibility-bathroom',
  'luxury-bathroom',
  'small-bathroom',
  'master-bathroom',
];

export default function LandingPage({ params }: PageProps) {
  const { slug } = params;

  // Validate slug matches our page types
  if (!validPageTypes.includes(slug as PageType)) {
    notFound();
  }

  const pageType = slug as PageType;
  const heroImage = getPlaceholderByCategory(pageType);

  // Convert slug to readable title
  const title = slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return (
    <main>
      <LandingPageHero
        title={`${title} Services`}
        subtitle="Professional bathroom renovation and installation"
        heroImage={heroImage}
        ctaText="Get Free Quote"
      />
      {/* Additional sections will be added in Stage 3 */}
    </main>
  );
}

// Generate static params for all valid page types
export async function generateStaticParams() {
  return validPageTypes.map((pageType) => ({
    slug: pageType,
  }));
}
