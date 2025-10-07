import Image from 'next/image';

interface LandingPageHeroProps {
  title: string;
  subtitle: string;
  heroImage: string;
  ctaText: string;
}

export default function LandingPageHero({
  title,
  subtitle,
  heroImage,
  ctaText,
}: LandingPageHeroProps) {
  return (
    <section className="relative h-[600px] w-full overflow-hidden">
      {/* Hero Image */}
      <div className="absolute inset-0">
        <Image
          src={heroImage}
          alt={title}
          fill
          className="object-cover"
          priority
        />
        {/* Overlay for better text contrast */}
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center text-white">
        <h1 className="mb-4 text-4xl font-bold md:text-5xl lg:text-6xl">
          {title}
        </h1>
        <p className="mb-8 max-w-2xl text-lg md:text-xl lg:text-2xl">
          {subtitle}
        </p>
        <button className="rounded-lg bg-brand-primary px-8 py-4 text-lg font-semibold text-white transition-colors hover:bg-brand-secondary focus:outline-none focus:ring-4 focus:ring-brand-primary/50">
          {ctaText}
        </button>
      </div>
    </section>
  );
}
