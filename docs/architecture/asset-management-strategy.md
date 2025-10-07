# Asset Management Strategy

## Hero Image Approach

**Strategy**: Pre-selected hero images mapped to specific page types. Each landing page type (e.g., "Walk In Shower", "Full Bathroom Remodel") has a dedicated hero image.

**Important**: NO AI-generated images. All hero images are pre-selected, high-quality photos stored in the project.

## Asset Folder Structure

```
apps/web/public/images/
├── heroes/
│   ├── walk-in-shower.webp
│   ├── full-bathroom-remodel.webp
│   ├── kitchen-remodel.webp
│   ├── flooring-installation.webp
│   ├── tile-work.webp
│   ├── countertop-installation.webp
│   ├── plumbing-services.webp
│   ├── general-contractor.webp
│   └── default.webp
│
├── icons/
│   ├── save-money.svg
│   ├── clock-fast.svg
│   ├── shield-check.svg
│   ├── chart-growth.svg
│   └── [other feature icons]
│
└── trust/
    ├── guarantee-badge.svg
    ├── bbb-accredited.svg
    └── 5-star-rating.svg
```

## Hero Image Mapping Logic

**Airtable Formula** (in Landing Pages table):

```javascript
// hero_image field (Formula type)
SWITCH({page_type},
  "Walk In Shower", "/images/heroes/walk-in-shower.webp",
  "Full Bathroom Remodel", "/images/heroes/full-bathroom-remodel.webp",
  "Kitchen Remodel", "/images/heroes/kitchen-remodel.webp",
  "Flooring Installation", "/images/heroes/flooring-installation.webp",
  "Tile Work", "/images/heroes/tile-work.webp",
  "Countertop Installation", "/images/heroes/countertop-installation.webp",
  "Plumbing Services", "/images/heroes/plumbing-services.webp",
  "General Contractor", "/images/heroes/general-contractor.webp",
  "/images/heroes/default.webp"  // fallback
)

// hero_image_alt field (Formula type)
CONCATENATE({page_type}, " - Professional Services")
```

## Hero Image Component Pattern

```typescript
// components/LandingPageHero.tsx

import Image from 'next/image';

interface HeroProps {
  pageType: string;
  heroImage: string;
  heroImageAlt: string;
  title: string;
}

export function LandingPageHero({ pageType, heroImage, heroImageAlt, title }: HeroProps) {
  return (
    <div className="relative h-[60vh] min-h-[400px]">
      <Image
        src={heroImage}
        alt={heroImageAlt}
        fill
        priority
        quality={85}
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30">
        <div className="container mx-auto h-full flex items-center">
          <div className="text-white max-w-2xl">
            <h1 className="text-5xl font-bold mb-4">{title}</h1>
            <p className="text-xl mb-8">Professional {pageType} Services</p>
            {/* Multi-step form component here */}
          </div>
        </div>
      </div>
    </div>
  );
}
```

## Image Optimization Specifications

```yaml
hero_images:
  format: WebP (Next.js auto-generates)
  dimensions: 1920x1080
  quality: 85
  loading: priority (above-fold)
  optimization: Next.js Image component (automatic)

icons:
  format: SVG
  dimensions: 24x24 base
  optimization: SVGO compressed

trust_badges:
  format: SVG or WebP
  dimensions: 120x40
  placement: Above fold, near form
```

## Workflow

1. **Stakeholder creates landing page** in Airtable
2. **Sets `page_type`** to "Walk In Shower"
3. **Airtable formula auto-populates `hero_image`** = "/images/heroes/walk-in-shower.webp"
4. **Make.com triggers** content generation
5. **Claude generates page copy** (NO image generation)
6. **Next.js renders page** using pre-assigned hero image via Image component

## Benefits

- ✅ **Predictable**: Same page type always uses same hero image
- ✅ **Brand Consistent**: Professional, high-quality photos
- ✅ **No AI Randomness**: Human-selected images only
- ✅ **SEO Optimized**: Consistent alt text per page type
- ✅ **Fast Loading**: Next.js auto-optimizes (WebP, responsive, lazy load)
- ✅ **Easy Management**: Add page type = add one image + Airtable option

---
