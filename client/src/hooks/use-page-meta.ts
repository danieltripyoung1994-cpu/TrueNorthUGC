import { useEffect } from 'react';

interface PageMeta {
  title: string;
  description?: string;
}

export function usePageMeta({ title, description }: PageMeta) {
  useEffect(() => {
    const fullTitle = title === 'TrueNorthUGC' 
      ? "TrueNorthUGC - Canada's Premier Creator Marketplace"
      : `${title} | TrueNorthUGC`;
    
    document.title = fullTitle;
    
    if (description) {
      let metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', description);
      }
    }
    
    return () => {
      document.title = "TrueNorthUGC - Canada's Premier Creator Marketplace";
    };
  }, [title, description]);
}
