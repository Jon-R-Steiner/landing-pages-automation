'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface MarketingData {
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmTerm?: string;
  utmContent?: string;
  gclid?: string;
  fbclid?: string;
}

interface MarketingContextType {
  marketingData: MarketingData;
}

const MarketingContext = createContext<MarketingContextType | undefined>(undefined);

export function MarketingProvider({ children }: { children: ReactNode }) {
  const [marketingData, setMarketingData] = useState<MarketingData>({});

  useEffect(() => {
    // Read marketing data from cookies (set by middleware)
    const getCookie = (name: string): string | undefined => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) {
        return parts.pop()?.split(';').shift();
      }
      return undefined;
    };

    setMarketingData({
      utmSource: getCookie('utm_source'),
      utmMedium: getCookie('utm_medium'),
      utmCampaign: getCookie('utm_campaign'),
      utmTerm: getCookie('utm_term'),
      utmContent: getCookie('utm_content'),
      gclid: getCookie('gclid'),
      fbclid: getCookie('fbclid'),
    });
  }, []);

  return (
    <MarketingContext.Provider value={{ marketingData }}>
      {children}
    </MarketingContext.Provider>
  );
}

export function useMarketing() {
  const context = useContext(MarketingContext);
  if (!context) {
    throw new Error('useMarketing must be used within a MarketingProvider');
  }
  return context;
}
