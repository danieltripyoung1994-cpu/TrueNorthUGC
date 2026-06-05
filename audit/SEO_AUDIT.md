# SEO Audit — TrueNorthUGC

## Date: 2026-06-05

## Strengths
- Basic meta tags in index.html (title, description, keywords, robots, OG, Twitter)
- JSON-LD Organization + WebSite + Service schema on homepage
- usePageMeta hook for dynamic page-level metadata
- Canonical URLs on all pages
- Google Analytics 4 installed (G-CEJ9WCLV23)
- Static sitemap.xml exists
- DNS prefetch + preconnect for performance
- Geo tags for Canada
- Lazy loading via React.lazy + Suspense

## Weaknesses

### Critical
1. **No JSON-LD schema on individual pages** — Only homepage has schema. Directory, Profile, Campaign, Brand pages have zero schema.
2. **Profile pages have no SEO metadata at all** — usePageMeta not used on Profile.tsx.
3. **No dynamic sitemap generation** — Static sitemap is outdated (lastmod 2026-02-01), missing /brands, /campaigns, /contact, and all profile URLs.
4. **No robots.txt** — Missing entirely.
5. **No structured data for reviews** — Reviews exist but no Review schema markup.
6. **No FAQ schema** — FAQ sections exist but not marked up.

### High Priority
7. **Missing programmatic SEO pages** — No /ugc-creators-[city] or /hire-[niche]-ugc-creators pages.
8. **Missing schema on listing pages** — Directory (creators), Campaigns, Brands should have CollectionPage schema.
9. **No BreadcrumbList schema** — Breadcrumbs exist visually but no structured data.
10. **No Person schema on creator profiles** — Creator profiles are the most indexable asset but lack schema.
11. **No Article schema** — No blog exists, but if FAQ is present, FAQPage schema needed.

### Medium Priority
12. **No internal linking engine** — No "related creators" or "similar campaigns" links.
13. **No programmatic SEO content** — Missing city + niche landing pages.
14. **Meta descriptions are generic** — Could be more benefit-driven and CTR-optimized.
15. **No social proof signals in meta** — Missing testimonials, stats, ratings in descriptions.

### Low Priority
16. **No hreflang tags** — Only English content, but geo-targeting for Canada.
17. **No AMP consideration** — Not needed for this marketplace.
18. **No ImageObject schema** — Creator images could be marked up.

## Recommendations
1. Add SchemaMarkup component for all pages
2. Implement dynamic sitemap generation from database
3. Create robots.txt
4. Add programmatic SEO pages for top cities and niches
5. SEO-optimize profile pages with Person schema
6. Add FAQPage schema to FAQ sections
7. Add Review schema to reviews
8. Implement breadcrumb structured data
9. Create internal linking (related creators, related campaigns)
