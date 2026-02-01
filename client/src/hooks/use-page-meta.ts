import { useEffect } from 'react';

interface PageMeta {
  title: string;
  description?: string;
  keywords?: string;
  canonicalPath?: string;
  ogImage?: string;
  ogType?: string;
}

export function usePageMeta({ 
  title, 
  description, 
  keywords,
  canonicalPath,
  ogImage,
  ogType = 'website'
}: PageMeta) {
  useEffect(() => {
    const fullTitle = title === 'TrueNorthUGC' 
      ? "TrueNorthUGC - Canada's Premier UGC Creator Marketplace | Find Canadian Creators"
      : `${title} | TrueNorthUGC - Canada's UGC Marketplace`;
    
    document.title = fullTitle;
    
    // Update meta description
    if (description) {
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', description);
      }
    }

    // Update keywords
    if (keywords) {
      let metaKeywords = document.querySelector('meta[name="keywords"]');
      if (metaKeywords) {
        metaKeywords.setAttribute('content', keywords);
      }
    }

    // Update canonical URL
    if (canonicalPath) {
      let canonicalLink = document.querySelector('link[rel="canonical"]');
      if (canonicalLink) {
        canonicalLink.setAttribute('href', `https://www.truenorthugc.com${canonicalPath}`);
      }
    }

    // Update Open Graph tags
    const ogTitleMeta = document.querySelector('meta[property="og:title"]');
    if (ogTitleMeta) {
      ogTitleMeta.setAttribute('content', fullTitle);
    }

    if (description) {
      const ogDescMeta = document.querySelector('meta[property="og:description"]');
      if (ogDescMeta) {
        ogDescMeta.setAttribute('content', description);
      }
    }

    if (canonicalPath) {
      const ogUrlMeta = document.querySelector('meta[property="og:url"]');
      if (ogUrlMeta) {
        ogUrlMeta.setAttribute('href', `https://www.truenorthugc.com${canonicalPath}`);
      }
    }

    if (ogType) {
      const ogTypeMeta = document.querySelector('meta[property="og:type"]');
      if (ogTypeMeta) {
        ogTypeMeta.setAttribute('content', ogType);
      }
    }

    // Update Twitter tags
    const twitterTitleMeta = document.querySelector('meta[name="twitter:title"]');
    if (twitterTitleMeta) {
      twitterTitleMeta.setAttribute('content', fullTitle);
    }

    if (description) {
      const twitterDescMeta = document.querySelector('meta[name="twitter:description"]');
      if (twitterDescMeta) {
        twitterDescMeta.setAttribute('content', description);
      }
    }
    
    return () => {
      document.title = "TrueNorthUGC - Canada's Premier UGC Creator Marketplace | Find Canadian Creators";
    };
  }, [title, description, keywords, canonicalPath, ogImage, ogType]);
}
