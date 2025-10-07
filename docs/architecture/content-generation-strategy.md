# Content Generation Strategy

AI-generated landing page content must adhere to the comprehensive **Brand Voice & Content Strategy** documented in `front-end-spec.md` (Version 1.1+).

## Key Content Requirements

**Reading Level & Structure**:
- **Target Reading Level**: 3rd grade (Flesch-Kincaid score)
- **Sentence Length**: Average 12-15 words
- **Paragraph Length**: 2-3 sentences maximum
- **Active Voice**: 90%+ of sentences

**Core Voice Attributes**:
1. **Trustworthy**: Established, reliable, proven results with specific numbers
2. **Approachable**: Friendly but professional, conversational without slang
3. **Value-Focused**: Emphasize savings and ROI, lead with benefits not features
4. **Action-Oriented**: Clear next steps, urgency without pressure
5. **Expert**: Knowledgeable without being condescending

**Content Structure Formulas**:

**H1 Headline Formula**:
```
[Action Verb] + [Benefit] + [Product/Service] + [Urgency]
```
Example: "Claim Your Exclusive 40% Discount on Bathroom Remodeling Today"

**Page Title Formula**:
```
[Offer] + [Product/Service] + [Territory] | [Brand] Deals
```
Example: "Save 40% on Bathroom Remodeling in Boston | HomeServices Deals"

**Introduction Paragraph (4-Sentence Structure)**:
1. Problem Statement (one sentence acknowledging user need)
2. Solution Bridge (how we solve it)
3. Value Statement (what they save/gain)
4. Trust Signal (why choose us)

**CTA Button Text Standards**:
- ❌ Never use: "Submit", "Click here"
- ✅ Always use descriptive action language:
  - "Claim Your [X]% Discount" (percentage offers)
  - "Get My Free Quote" (free quote offers)
  - "Start Saving Now" (generic savings)
  - "See My Savings" (ZIP code entry step)
  - "Get Your Deal" (final submission)

**Territory Customization Requirements**:
- Greeting: "Serving [territory] homeowners since [year]"
- Trust Signal: "Trusted by [X] [territory] families"
- Local Proof: "[X] projects completed in [city]"
- Regional Phone: Display territory-specific phone number

**Required Trust Signals** (include 2-3 per page):
- "Trusted by [X] homeowners"
- "[X] years serving [territory] homeowners"
- "[X]% customer satisfaction rate"
- "Money-back satisfaction guarantee"
- "Licensed and insured contractors"
- "No hidden fees or surprises"
- "Free project quotes"

**Prohibited Content** (never use):
- ❌ Superlatives without proof ("best", "greatest", "#1")
- ❌ Fake urgency or false scarcity
- ❌ Misleading comparisons or competitor bashing
- ❌ Complex industry jargon without explanation
- ❌ Passive voice constructions
- ❌ Sentences over 20 words
- ❌ Paragraphs over 3 sentences
- ❌ Multiple exclamation points or ALL CAPS text

## Content Quality Validation Checklist

Before publishing any AI-generated content, verify:
- [ ] Reading level is 3rd grade or below (use readability tool)
- [ ] All claims have specific numbers or proof points
- [ ] CTAs clearly state what happens next (no "Submit")
- [ ] No grammar or spelling errors
- [ ] Territory is correctly referenced throughout
- [ ] Offer details match source data (Airtable)
- [ ] 2-3 trust signals included and prominently placed
- [ ] Urgency is genuine (not false scarcity)
- [ ] Benefits outweigh features at 3:1 ratio minimum
- [ ] Customer problem is addressed in opening paragraph
- [ ] Every section has clear next step or CTA
- [ ] Mobile text is minimum 16px (prevents iOS zoom)

**Reference Document**: `docs/front-end-spec.md` Section: "Brand Voice & Content Strategy"

---
