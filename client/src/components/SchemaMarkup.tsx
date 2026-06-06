import { useEffect } from "react";

interface OrganizationSchema {
  name: string;
  url: string;
  logo: string;
  description: string;
  sameAs?: string[];
  email?: string;
  telephone?: string;
  address?: {
    addressCountry: string;
    addressLocality?: string;
    addressRegion?: string;
  };
  founder?: {
    name: string;
  };
}

interface PersonSchema {
  name: string;
  url?: string;
  image?: string;
  description?: string;
  jobTitle?: string;
  worksFor?: {
    name: string;
  };
  sameAs?: string[];
  address?: {
    addressCountry: string;
    addressLocality?: string;
  };
  knowsAbout?: string[];
  alumniOf?: string[];
}

interface CollectionPageSchema {
  name: string;
  url: string;
  description: string;
  itemList?: Array<{
    name: string;
    url: string;
    description?: string;
    image?: string;
  }>;
}

interface BreadcrumbSchema {
  items: Array<{
    name: string;
    url: string;
  }>;
}

interface FAQPageSchema {
  questions: Array<{
    question: string;
    answer: string;
  }>;
}

interface ReviewSchema {
  itemReviewed: string;
  reviewRating: number;
  bestRating: number;
  author: string;
  reviewBody: string;
  datePublished?: string;
}

interface ProductSchema {
  name: string;
  description: string;
  image?: string;
  brand?: string;
  offers?: {
    price?: number;
    priceCurrency?: string;
    availability?: string;
  };
  aggregateRating?: {
    ratingValue: number;
    reviewCount: number;
  };
}

interface ArticleSchema {
  headline: string;
  description: string;
  url: string;
  datePublished: string;
  dateModified?: string;
  author?: string;
  publisher?: string;
  image?: string;
  keywords?: string[];
}

type SchemaType =
  | { type: "Organization"; data: OrganizationSchema }
  | { type: "Person"; data: PersonSchema }
  | { type: "CollectionPage"; data: CollectionPageSchema }
  | { type: "BreadcrumbList"; data: BreadcrumbSchema }
  | { type: "FAQPage"; data: FAQPageSchema }
  | { type: "Review"; data: ReviewSchema }
  | { type: "Product"; data: ProductSchema }
  | { type: "Article"; data: ArticleSchema }
  | { type: "WebSite"; data: { name: string; url: string; description?: string } }
  | { type: "Service"; data: { name: string; description: string; provider: string | { name: string; url?: string }; areaServed?: string; offers?: Record<string, any> } }
  | { type: "ContactPage"; data: { name: string; description?: string; url?: string; contactPoint?: Record<string, any> } };

function generateSchema(schema: SchemaType): object {
  const base = { "@context": "https://schema.org" };

  switch (schema.type) {
    case "Organization":
      return {
        ...base,
        "@type": "Organization",
        name: schema.data.name,
        url: schema.data.url,
        logo: schema.data.logo,
        description: schema.data.description,
        sameAs: schema.data.sameAs || [],
        email: schema.data.email,
        telephone: schema.data.telephone,
        address: schema.data.address
          ? {
              "@type": "PostalAddress",
              ...schema.data.address,
            }
          : undefined,
        founder: schema.data.founder
          ? {
              "@type": "Person",
              name: schema.data.founder.name,
            }
          : undefined,
      };

    case "Person":
      return {
        ...base,
        "@type": "Person",
        name: schema.data.name,
        url: schema.data.url,
        image: schema.data.image,
        description: schema.data.description,
        jobTitle: schema.data.jobTitle,
        worksFor: schema.data.worksFor
          ? {
              "@type": "Organization",
              name: schema.data.worksFor.name,
            }
          : undefined,
        sameAs: schema.data.sameAs || [],
        address: schema.data.address
          ? {
              "@type": "PostalAddress",
              ...schema.data.address,
            }
          : undefined,
        knowsAbout: schema.data.knowsAbout,
        alumniOf: schema.data.alumniOf,
      };

    case "CollectionPage":
      return {
        ...base,
        "@type": "CollectionPage",
        name: schema.data.name,
        url: schema.data.url,
        description: schema.data.description,
        mainEntity: schema.data.itemList
          ? {
              "@type": "ItemList",
              itemListElement: schema.data.itemList.map((item, idx) => ({
                "@type": "ListItem",
                position: idx + 1,
                name: item.name,
                url: item.url,
                item: {
                  "@type": "Thing",
                  name: item.name,
                  description: item.description,
                  image: item.image,
                },
              })),
            }
          : undefined,
      };

    case "BreadcrumbList":
      return {
        ...base,
        "@type": "BreadcrumbList",
        itemListElement: schema.data.items.map((item, idx) => ({
          "@type": "ListItem",
          position: idx + 1,
          name: item.name,
          item: item.url,
        })),
      };

    case "FAQPage":
      return {
        ...base,
        "@type": "FAQPage",
        mainEntity: schema.data.questions.map((q) => ({
          "@type": "Question",
          name: q.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: q.answer,
          },
        })),
      };

    case "Review":
      return {
        ...base,
        "@type": "Review",
        itemReviewed: {
          "@type": "Person",
          name: schema.data.itemReviewed,
        },
        reviewRating: {
          "@type": "Rating",
          ratingValue: schema.data.reviewRating,
          bestRating: schema.data.bestRating,
        },
        author: {
          "@type": "Person",
          name: schema.data.author,
        },
        reviewBody: schema.data.reviewBody,
        datePublished: schema.data.datePublished,
      };

    case "Product":
      return {
        ...base,
        "@type": "Product",
        name: schema.data.name,
        description: schema.data.description,
        image: schema.data.image,
        brand: schema.data.brand
          ? {
              "@type": "Organization",
              name: schema.data.brand,
            }
          : undefined,
        offers: schema.data.offers
          ? {
              "@type": "Offer",
              ...schema.data.offers,
            }
          : undefined,
        aggregateRating: schema.data.aggregateRating
          ? {
              "@type": "AggregateRating",
              ...schema.data.aggregateRating,
            }
          : undefined,
      };

    case "Article":
      return {
        ...base,
        "@type": "Article",
        headline: schema.data.headline,
        description: schema.data.description,
        url: schema.data.url,
        datePublished: schema.data.datePublished,
        dateModified: schema.data.dateModified || schema.data.datePublished,
        author: {
          "@type": "Organization",
          name: schema.data.author || "TrueNorthUGC",
        },
        publisher: {
          "@type": "Organization",
          name: schema.data.publisher || "TrueNorthUGC",
          logo: {
            "@type": "ImageObject",
            url: "https://www.truenorthugc.com/logo.png",
          },
        },
        image: schema.data.image,
        keywords: schema.data.keywords?.join(", "),
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": schema.data.url,
        },
      };

    case "WebSite":
      return {
        ...base,
        "@type": "WebSite",
        name: schema.data.name,
        url: schema.data.url,
        description: schema.data.description,
      };

    case "Service": {
      const provider = typeof schema.data.provider === "string"
        ? { "@type": "Organization", name: schema.data.provider }
        : { "@type": "Organization", name: schema.data.provider.name, url: schema.data.provider.url };
      return {
        ...base,
        "@type": "Service",
        name: schema.data.name,
        description: schema.data.description,
        provider,
        areaServed: schema.data.areaServed
          ? {
              "@type": "Country",
              name: schema.data.areaServed,
            }
          : undefined,
        offers: schema.data.offers,
      };
    }

    case "ContactPage":
      return {
        ...base,
        "@type": "ContactPage",
        name: schema.data.name,
        description: schema.data.description,
        url: schema.data.url,
        contactPoint: schema.data.contactPoint,
      };

    default:
      return base;
  }
}

export function SchemaMarkup({ schema }: { schema: SchemaType }) {
  const jsonLd = JSON.stringify(generateSchema(schema));

  useEffect(() => {
    const id = `schema-${schema.type}`;
    let script = document.getElementById(id) as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement("script");
      script.id = id;
      script.type = "application/ld+json";
      document.head.appendChild(script);
    }
    script.textContent = jsonLd;

    return () => {
      script?.remove();
    };
  }, [jsonLd, schema.type]);

  return null;
}

export function useSchemaMarkup(schema: SchemaType) {
  const jsonLd = JSON.stringify(generateSchema(schema));

  useEffect(() => {
    const id = `schema-${schema.type}`;
    let script = document.getElementById(id) as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement("script");
      script.id = id;
      script.type = "application/ld+json";
      document.head.appendChild(script);
    }
    script.textContent = jsonLd;

    return () => {
      script?.remove();
    };
  }, [jsonLd, schema.type]);
}

export type { SchemaType, OrganizationSchema, PersonSchema, CollectionPageSchema, BreadcrumbSchema, FAQPageSchema, ReviewSchema };
