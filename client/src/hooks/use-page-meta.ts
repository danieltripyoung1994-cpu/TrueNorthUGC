import { useEffect } from 'react';

interface PageMeta {
  title: string;
  description?: string;
  keywords?: string | string[];
  canonicalPath?: string;
  canonicalUrl?: string;
  ogImage?: string;
  ogType?: string;
}

export function usePageMeta({ 
  title, 
  description, 
  keywords,
  canonicalPath,
  canonicalUrl,
  ogImage,
  ogType = 'website'
}: PageMeta) {
  useEffect(() => {
    const fullTitle = title === 'TrueNorthUGC' 
      ? "TrueNorthUGC - Canada's Premier UGC Creator Marketplace | Find Canadian Creators"
      : `${title} | TrueNorthUGC - Canada's UGC Marketplace`;
    
    document.title = fullTitle;
    
    const resolvedKeywords = Array.isArray(keywords) ? keywords.join(', ') : keywords;
    const resolvedCanonical = canonicalUrl || (canonicalPath ? `https://www.truenorthugc.com${canonicalPath}` : null);

    if (description) {
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) metaDescription.setAttribute('content', description);
    }

    if (resolvedKeywords) {
      const metaKeywords = document.querySelector('meta[name="keywords"]');
      if (metaKeywords) metaKeywords.setAttribute('content', resolvedKeywords);
    }

    if (resolvedCanonical) {
      const canonicalLink = document.querySelector('link[rel="canonical"]');
      if (canonicalLink) canonicalLink.setAttribute('href', resolvedCanonical);
    }

    const ogTitleMeta = document.querySelector('meta[property="og:title"]');
    if (ogTitleMeta) ogTitleMeta.setAttribute('content', fullTitle);

    if (description) {
      const ogDescMeta = document.querySelector('meta[property="og:description"]');
      if (ogDescMeta) ogDescMeta.setAttribute('content', description);
    }

    if (resolvedCanonical) {
      const ogUrlMeta = document.querySelector('meta[property="og:url"]');
      if (ogUrlMeta) ogUrlMeta.setAttribute('href', resolvedCanonical);
    }

    if (ogType) {
      const ogTypeMeta = document.querySelector('meta[property="og:type"]');
      if (ogTypeMeta) ogTypeMeta.setAttribute('content', ogType);
    }

    const twitterTitleMeta = document.querySelector('meta[name="twitter:title"]');
    if (twitterTitleMeta) twitterTitleMeta.setAttribute('content', fullTitle);

    if (description) {
      const twitterDescMeta = document.querySelector('meta[name="twitter:description"]');
      if (twitterDescMeta) twitterDescMeta.setAttribute('content', description);
    }
    
    return () => {
      document.title = "TrueNorthUGC - Canada's Premier UGC Creator Marketplace | Find Canadian Creators";
    };
  }, [title, description, keywords, canonicalPath, canonicalUrl, ogImage, ogType]);
}
