# Image Asset Strategy

## Phase 1: Placeholder Images

**Decision**: Use placeholder images during initial development and testing to avoid premature asset selection and licensing costs.

**Placeholder Service**: Use **placehold.co** (modern, fast, customizable)

---

### Placeholder Image Library

**Central Configuration** (`lib/placeholders.ts`):
```typescript
/**
 * Centralized placeholder image library for Phase 1 development
 *
 * USAGE RULE: When ANY component needs an image and no file path exists,
 * import this library and use the appropriate placeholder.
 *
 * Phase 2: Replace placeholder URLs with `/images/[category]/[name].webp`
 */

export const PLACEHOLDER_IMAGES = {
  // Hero Images (1200x800px - 3:2 aspect ratio)
  heroes: {
    'walk-in-shower': 'https://placehold.co/1200x800/4A90E2/FFFFFF/webp?text=Walk-In+Shower',
    'full-bathroom-remodel': 'https://placehold.co/1200x800/4A90E2/FFFFFF/webp?text=Bathroom+Remodel',
    'kitchen-remodel': 'https://placehold.co/1200x800/4A90E2/FFFFFF/webp?text=Kitchen+Remodel',
    'hvac-services': 'https://placehold.co/1200x800/4A90E2/FFFFFF/webp?text=HVAC+Services',
    'roofing-services': 'https://placehold.co/1200x800/4A90E2/FFFFFF/webp?text=Roofing+Services',
    'flooring-installation': 'https://placehold.co/1200x800/4A90E2/FFFFFF/webp?text=Flooring',
    'tile-work': 'https://placehold.co/1200x800/4A90E2/FFFFFF/webp?text=Tile+Work',
    'countertop-installation': 'https://placehold.co/1200x800/4A90E2/FFFFFF/webp?text=Countertops',
    'default': 'https://placehold.co/1200x800/4A90E2/FFFFFF/webp?text=Home+Services',
  },

  // Testimonial/Customer Photos (400x400px - 1:1 aspect ratio)
  testimonials: {
    'customer-1': 'https://placehold.co/400x400/6B7280/FFFFFF/webp?text=Customer+1',
    'customer-2': 'https://placehold.co/400x400/6B7280/FFFFFF/webp?text=Customer+2',
    'customer-3': 'https://placehold.co/400x400/6B7280/FFFFFF/webp?text=Customer+3',
    'customer-4': 'https://placehold.co/400x400/6B7280/FFFFFF/webp?text=Customer+4',
    'customer-5': 'https://placehold.co/400x400/6B7280/FFFFFF/webp?text=Customer+5',
    'default': 'https://placehold.co/400x400/6B7280/FFFFFF/webp?text=Customer',
  },

  // Trust Badges & Certifications (200x100px - 2:1 aspect ratio)
  badges: {
    'bbb-accredited': 'https://placehold.co/200x100/F7B731/0F172A/webp?text=BBB+A%2B',
    'licensed': 'https://placehold.co/200x100/059669/FFFFFF/webp?text=Licensed',
    'insured': 'https://placehold.co/200x100/059669/FFFFFF/webp?text=Insured',
    'warranty': 'https://placehold.co/200x100/3B82F6/FFFFFF/webp?text=Warranty',
    'certified': 'https://placehold.co/200x100/8B5CF6/FFFFFF/webp?text=Certified',
    'award': 'https://placehold.co/200x100/F59E0B/FFFFFF/webp?text=Award',
    'default': 'https://placehold.co/200x100/6B7280/FFFFFF/webp?text=Badge',
  },

  // Before/After Images (600x400px - 3:2 aspect ratio)
  beforeAfter: {
    'bathroom-before': 'https://placehold.co/600x400/DC2626/FFFFFF/webp?text=Before',
    'bathroom-after': 'https://placehold.co/600x400/059669/FFFFFF/webp?text=After',
    'kitchen-before': 'https://placehold.co/600x400/DC2626/FFFFFF/webp?text=Before',
    'kitchen-after': 'https://placehold.co/600x400/059669/FFFFFF/webp?text=After',
    'generic-before': 'https://placehold.co/600x400/DC2626/FFFFFF/webp?text=Before',
    'generic-after': 'https://placehold.co/600x400/059669/FFFFFF/webp?text=After',
  },

  // Process/Step Images (800x600px - 4:3 aspect ratio)
  process: {
    'consultation': 'https://placehold.co/800x600/4A90E2/FFFFFF/webp?text=Consultation',
    'design': 'https://placehold.co/800x600/4A90E2/FFFFFF/webp?text=Design',
    'installation': 'https://placehold.co/800x600/4A90E2/FFFFFF/webp?text=Installation',
    'completion': 'https://placehold.co/800x600/4A90E2/FFFFFF/webp?text=Completion',
    'step-1': 'https://placehold.co/800x600/4A90E2/FFFFFF/webp?text=Step+1',
    'step-2': 'https://placehold.co/800x600/4A90E2/FFFFFF/webp?text=Step+2',
    'step-3': 'https://placehold.co/800x600/4A90E2/FFFFFF/webp?text=Step+3',
    'step-4': 'https://placehold.co/800x600/4A90E2/FFFFFF/webp?text=Step+4',
  },

  // Team/Staff Photos (300x400px - 3:4 aspect ratio - portrait)
  team: {
    'team-member-1': 'https://placehold.co/300x400/6B7280/FFFFFF/webp?text=Team+1',
    'team-member-2': 'https://placehold.co/300x400/6B7280/FFFFFF/webp?text=Team+2',
    'team-member-3': 'https://placehold.co/300x400/6B7280/FFFFFF/webp?text=Team+3',
    'team-member-4': 'https://placehold.co/300x400/6B7280/FFFFFF/webp?text=Team+4',
    'default': 'https://placehold.co/300x400/6B7280/FFFFFF/webp?text=Team',
  },

  // Portfolio/Gallery Images (800x600px - 4:3 aspect ratio)
  portfolio: {
    'project-1': 'https://placehold.co/800x600/4A90E2/FFFFFF/webp?text=Project+1',
    'project-2': 'https://placehold.co/800x600/4A90E2/FFFFFF/webp?text=Project+2',
    'project-3': 'https://placehold.co/800x600/4A90E2/FFFFFF/webp?text=Project+3',
    'project-4': 'https://placehold.co/800x600/4A90E2/FFFFFF/webp?text=Project+4',
    'project-5': 'https://placehold.co/800x600/4A90E2/FFFFFF/webp?text=Project+5',
    'project-6': 'https://placehold.co/800x600/4A90E2/FFFFFF/webp?text=Project+6',
    'default': 'https://placehold.co/800x600/4A90E2/FFFFFF/webp?text=Portfolio',
  },

  // Feature Icons/Graphics (100x100px - 1:1 aspect ratio)
  icons: {
    'feature-1': 'https://placehold.co/100x100/3B82F6/FFFFFF/webp?text=1',
    'feature-2': 'https://placehold.co/100x100/3B82F6/FFFFFF/webp?text=2',
    'feature-3': 'https://placehold.co/100x100/3B82F6/FFFFFF/webp?text=3',
    'feature-4': 'https://placehold.co/100x100/3B82F6/FFFFFF/webp?text=4',
    'checkmark': 'https://placehold.co/100x100/059669/FFFFFF/webp?text=%E2%9C%93',
    'star': 'https://placehold.co/100x100/F59E0B/FFFFFF/webp?text=%E2%98%85',
    'default': 'https://placehold.co/100x100/6B7280/FFFFFF/webp?text=Icon',
  },

  // Logo Placeholder (300x100px - 3:1 aspect ratio)
  logo: {
    'company-logo': 'https://placehold.co/300x100/0F172A/FFFFFF/webp?text=Company+Logo',
    'partner-logo-1': 'https://placehold.co/200x100/6B7280/FFFFFF/webp?text=Partner+1',
    'partner-logo-2': 'https://placehold.co/200x100/6B7280/FFFFFF/webp?text=Partner+2',
    'partner-logo-3': 'https://placehold.co/200x100/6B7280/FFFFFF/webp?text=Partner+3',
  },

  // Fallback for unknown image types (800x600px)
  fallback: 'https://placehold.co/800x600/6B7280/FFFFFF/webp?text=Image+Placeholder',
};

// Helper function to get placeholder with fallback
export function getPlaceholder(
  category: keyof typeof PLACEHOLDER_IMAGES,
  key: string
): string {
  const categoryImages = PLACEHOLDER_IMAGES[category];

  if (typeof categoryImages === 'string') {
    return categoryImages;
  }

  if (categoryImages && key in categoryImages) {
    return categoryImages[key as keyof typeof categoryImages];
  }

  // Fallback to category default or global fallback
  return categoryImages?.['default' as keyof typeof categoryImages] || PLACEHOLDER_IMAGES.fallback;
}
```

---

### Usage Examples

**Testimonial Component**:
```typescript
import { PLACEHOLDER_IMAGES } from '@/lib/placeholders';

export function TestimonialCard({ name, quote }: Props) {
  return (
    <div>
      <Image
        src={PLACEHOLDER_IMAGES.testimonials['customer-1']}
        alt={`${name} - Customer testimonial`}
        width={400}
        height={400}
      />
      <p>{quote}</p>
      <cite>{name}</cite>
    </div>
  );
}
```

**Proof Section with Badges**:
```typescript
import { PLACEHOLDER_IMAGES, getPlaceholder } from '@/lib/placeholders';

export function ProofSection() {
  const badges = ['bbb-accredited', 'licensed', 'insured', 'warranty'];

  return (
    <section>
      <h2>Our Credentials</h2>
      <div className="badge-grid">
        {badges.map(badge => (
          <Image
            key={badge}
            src={getPlaceholder('badges', badge)}
            alt={badge.replace('-', ' ')}
            width={200}
            height={100}
          />
        ))}
      </div>
    </section>
  );
}
```

**Before/After Gallery**:
```typescript
import { PLACEHOLDER_IMAGES } from '@/lib/placeholders';

export function BeforeAfterGallery({ projectType }: Props) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <h3>Before</h3>
        <Image
          src={PLACEHOLDER_IMAGES.beforeAfter[`${projectType}-before`]}
          alt="Before renovation"
          width={600}
          height={400}
        />
      </div>
      <div>
        <h3>After</h3>
        <Image
          src={PLACEHOLDER_IMAGES.beforeAfter[`${projectType}-after`]}
          alt="After renovation"
          width={600}
          height={400}
        />
      </div>
    </div>
  );
}
```

**Dynamic Fallback Example**:
```typescript
import { getPlaceholder } from '@/lib/placeholders';

export function DynamicImage({ category, name, alt }: Props) {
  // Safely get placeholder even if category/name doesn't exist
  const src = getPlaceholder(category as any, name);

  return <Image src={src} alt={alt} width={800} height={600} />;
}
```

---

### Phase 2: Production Asset Migration

**File Structure**:
```
apps/frontend/public/images/
├── heroes/                          # Hero section images (1200x800px)
│   ├── walk-in-shower.webp
│   ├── full-bathroom-remodel.webp
│   ├── kitchen-remodel.webp
│   ├── hvac-services.webp
│   ├── roofing-services.webp
│   ├── flooring-installation.webp
│   ├── tile-work.webp
│   ├── countertop-installation.webp
│   └── default.webp
├── testimonials/                    # Customer photos (400x400px)
│   ├── customer-1.webp
│   ├── customer-2.webp
│   ├── customer-3.webp
│   ├── customer-4.webp
│   ├── customer-5.webp
│   └── default.webp
├── badges/                          # Trust badges (200x100px)
│   ├── bbb-accredited.webp
│   ├── licensed.webp
│   ├── insured.webp
│   ├── warranty.webp
│   ├── certified.webp
│   ├── award.webp
│   └── default.webp
├── before-after/                    # Transformation photos (600x400px)
│   ├── bathroom-before.webp
│   ├── bathroom-after.webp
│   ├── kitchen-before.webp
│   ├── kitchen-after.webp
│   ├── generic-before.webp
│   └── generic-after.webp
├── process/                         # Process step images (800x600px)
│   ├── consultation.webp
│   ├── design.webp
│   ├── installation.webp
│   ├── completion.webp
│   ├── step-1.webp
│   ├── step-2.webp
│   ├── step-3.webp
│   └── step-4.webp
├── team/                            # Staff photos (300x400px portrait)
│   ├── team-member-1.webp
│   ├── team-member-2.webp
│   ├── team-member-3.webp
│   ├── team-member-4.webp
│   └── default.webp
├── portfolio/                       # Project gallery (800x600px)
│   ├── project-1.webp
│   ├── project-2.webp
│   ├── project-3.webp
│   ├── project-4.webp
│   ├── project-5.webp
│   ├── project-6.webp
│   └── default.webp
├── icons/                           # Feature icons (100x100px)
│   ├── feature-1.webp
│   ├── feature-2.webp
│   ├── feature-3.webp
│   ├── feature-4.webp
│   ├── checkmark.webp
│   ├── star.webp
│   └── default.webp
└── logos/                           # Company/partner logos (300x100px)
    ├── company-logo.webp
    ├── partner-logo-1.webp
    ├── partner-logo-2.webp
    └── partner-logo-3.webp
```

**Migration Process**:
1. **Asset Acquisition**:
   - Purchase stock photos from Shutterstock, Adobe Stock, or Unsplash (commercial license)
   - Commission custom photography if budget allows
   - Ensure all images have proper licensing for commercial use

2. **Image Optimization**:
   - Convert to WebP format (Next.js Image component handles this automatically)
   - Maintain aspect ratios specified in placeholder library
   - Target file sizes: < 100KB for heroes, < 30KB for thumbnails
   - Use 85% quality for optimal balance

3. **Update Placeholder Library**:
   ```typescript
   // lib/placeholders.ts - Phase 2 update
   export const PLACEHOLDER_IMAGES = {
     heroes: {
       'walk-in-shower': '/images/heroes/walk-in-shower.webp', // Changed from placehold.co
       'full-bathroom-remodel': '/images/heroes/full-bathroom-remodel.webp',
       // ... etc
     },
     testimonials: {
       'customer-1': '/images/testimonials/customer-1.webp',
       // ... etc
     },
     // ... all other categories
   };
   ```

4. **Validation**:
   - Run Lighthouse audit (LCP should remain <2.0s)
   - Verify all images load correctly across all pages
   - Check responsive behavior at all breakpoints
   - Validate alt text for accessibility

**Implementation Requirements**:
- ✅ All placeholder images use Next.js `<Image>` component
- ✅ Include proper `alt` text for accessibility (WCAG 2.1 Level AA)
- ✅ Use `priority` prop for hero images (LCP optimization)
- ✅ Maintain exact aspect ratios specified in placeholder library
- ✅ All images served via Next.js Image optimization (automatic WebP/AVIF)
- ✅ Lazy loading by default (except `priority` images)

**Fallback Strategy** (if image missing in Phase 2):
```typescript
// Component example with fallback
import { PLACEHOLDER_IMAGES, getPlaceholder } from '@/lib/placeholders';

export function SafeImage({ category, name, alt }: Props) {
  const [src, setSrc] = useState(getPlaceholder(category, name));

  return (
    <Image
      src={src}
      alt={alt}
      onError={() => {
        // Fallback to placeholder if production image fails
        console.warn(`Image failed to load: ${category}/${name}`);
        setSrc(PLACEHOLDER_IMAGES.fallback);
      }}
      width={800}
      height={600}
    />
  );
}
```

**Rationale**: Placeholder images allow:
- ✅ Immediate development start without asset procurement delays
- ✅ Testing of image loading performance and Core Web Vitals
- ✅ Validation of responsive image behavior across breakpoints
- ✅ Easy production asset swapping via simple URL updates
- ✅ **Zero developer confusion** - clear usage for any image scenario
- ✅ Type-safe image references with centralized library
- ✅ Graceful fallback handling for missing images

---
