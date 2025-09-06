import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Lang, supportedLanguages } from '@/utils/language';

interface SEOHeadProps {
  title: string;
  description: string;
  url: string;
  lang: Lang;
  alternateLanguages?: { lang: Lang; url: string }[];
  jsonLd?: object;
  ogImage?: string;
}

export const SEOHead: React.FC<SEOHeadProps> = ({
  title,
  description,
  url,
  lang,
  alternateLanguages = [],
  jsonLd,
  ogImage = '/tma-official-logo.png'
}) => {
  const langConfig = supportedLanguages[lang];
  const siteName = 'TMA Academy';
  const fullTitle = `${title} - ${siteName}`;
  
  // Truncate description to 160 characters
  const truncatedDescription = description.length > 160 
    ? description.substring(0, 157) + '...'
    : description;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <html lang={lang} dir={langConfig?.direction || 'ltr'} />
      <title>{fullTitle}</title>
      <meta name="description" content={truncatedDescription} />
      <meta name="keywords" content={`${title}, leadership, management, TMA Academy, ${langConfig?.name}`} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={url} />
      
      {/* Hreflang Tags */}
      {alternateLanguages.map(({ lang: altLang, url: altUrl }) => (
        <link
          key={altLang}
          rel="alternate"
          hrefLang={altLang}
          href={altUrl}
        />
      ))}
      
      {/* Open Graph */}
      <meta property="og:type" content="article" />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={truncatedDescription} />
      <meta property="og:url" content={url} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:locale" content={lang} />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={truncatedDescription} />
      <meta name="twitter:image" content={ogImage} />
      
      {/* JSON-LD Structured Data */}
      {jsonLd && (
        <script type="application/ld+json">
          {JSON.stringify(jsonLd)}
        </script>
      )}
      
      {/* Additional SEO Meta */}
      <meta name="robots" content="index, follow" />
      <meta name="author" content="TMA Academy" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    </Helmet>
  );
};