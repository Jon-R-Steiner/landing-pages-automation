import { notFound } from 'next/navigation';
import { PageType } from '@shared/types';
import { getPlaceholderByCategory } from '@/lib/placeholders';
import LandingPageHero from '@/components/LandingPageHero';
import MultiStepForm from '@/components/MultiStepForm';

interface PageProps {
  params: {
    location: string;
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

export default function LocationLandingPage({ params }: PageProps) {
  const { location, slug } = params;

  // Validate slug matches our page types
  if (!validPageTypes.includes(slug as PageType)) {
    notFound();
  }

  const pageType = slug as PageType;
  const heroImage = getPlaceholderByCategory(pageType);

  // Convert slug and location to readable text
  const title = slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  const locationName = location
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return (
    <main>
      <LandingPageHero
        title={`${title} in ${locationName}`}
        subtitle={`Professional bathroom renovation services in ${locationName}`}
        heroImage={heroImage}
        ctaText="Get Free Quote"
      />

      {/* Multi-Step Form */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <MultiStepForm pageType={pageType} location={location} />
        </div>
      </section>
    </main>
  );
}

// Note: generateStaticParams not used for location pages
// These will be generated dynamically based on Airtable data in Stage 4
