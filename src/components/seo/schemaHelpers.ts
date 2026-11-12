/**
 * JSON-LD Structured Data Schema Generators for Luminosoft
 * Validated against Schema.org standards
 */

export const BASE_URL = 'https://luminosoft.in';
export const DEFAULT_LOGO = 'https://luminosoft.in/images/luminosoft-logo.png';

export function createOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${BASE_URL}/#organization`,
    name: 'Luminosoft',
    alternateName: [
      'Lumino Soft',
      'Luminosoft India',
      'Luminosoft Software Company',
      'Luminosoft Official Website',
      'Luminosoft Technologies'
    ],
    url: BASE_URL,
    logo: {
      '@type': 'ImageObject',
      url: DEFAULT_LOGO,
      caption: 'Luminosoft Official Logo'
    },
    image: DEFAULT_LOGO,
    description: 'Luminosoft is an Indian software and web development company engineering high-performance websites, custom software, Android mobile applications, and CRM solutions.',
    founder: {
      '@type': 'Person',
      name: 'Samir Pathan'
    },
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Badnapur',
      addressLocality: 'Jalna',
      addressRegion: 'Maharashtra',
      postalCode: '431202',
      addressCountry: 'IN'
    },
    areaServed: [
      {
        '@type': 'Country',
        name: 'India'
      },
      {
        '@type': 'AdministrativeArea',
        name: 'Maharashtra'
      },
      {
        '@type': 'City',
        name: 'Chhatrapati Sambhajinagar'
      },
      {
        '@type': 'City',
        name: 'Aurangabad'
      },
      {
        '@type': 'City',
        name: 'Jalna'
      },
      {
        '@type': 'City',
        name: 'Badnapur'
      }
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+91-7822886909',
      contactType: 'customer support',
      email: 'contact@luminosoft.in',
      availableLanguage: ['English', 'Hindi', 'Marathi']
    },
    sameAs: [
      'https://github.com/spathan1862-prog',
      'https://youtube.com/@luminosoft'
    ]
  };
}

export function createWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${BASE_URL}/#website`,
    url: BASE_URL,
    name: 'Luminosoft',
    alternateName: 'Lumino Soft',
    description: 'Official website of Luminosoft – Website Development, Custom Software Engineering & Android Apps.',
    publisher: {
      '@id': `${BASE_URL}/#organization`
    },
    inLanguage: 'en-IN'
  };
}

export function createLocalBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    '@id': `${BASE_URL}/#localbusiness`,
    name: 'Luminosoft – Software & Website Development Company',
    image: DEFAULT_LOGO,
    url: BASE_URL,
    telephone: '+91-7822886909',
    priceRange: '₹₹',
    email: 'contact@luminosoft.in',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Badnapur',
      addressLocality: 'Jalna',
      addressRegion: 'Maharashtra',
      postalCode: '431202',
      addressCountry: 'IN'
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: '19.8695',
      longitude: '75.9529'
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: [
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday',
          'Saturday'
        ],
        opens: '09:00',
        closes: '19:00'
      }
    ]
  };
}

export function createBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${BASE_URL}${item.url}`
    }))
  };
}

export function createSoftwareApplicationSchema({
  name,
  operatingSystem,
  applicationCategory,
  description,
  downloadUrl,
  fileSize,
  softwareVersion,
  price = '0',
  priceCurrency = 'INR',
}: {
  name: string;
  operatingSystem: string;
  applicationCategory: string;
  description: string;
  downloadUrl?: string;
  fileSize?: string;
  softwareVersion?: string;
  price?: string;
  priceCurrency?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name,
    operatingSystem,
    applicationCategory,
    description,
    softwareVersion: softwareVersion || '1.0.0',
    fileSize: fileSize || undefined,
    downloadUrl: downloadUrl || undefined,
    offers: {
      '@type': 'Offer',
      price,
      priceCurrency,
      availability: 'https://schema.org/InStock'
    },
    author: {
      '@type': 'Organization',
      name: 'Luminosoft',
      url: BASE_URL
    }
  };
}

export function createServiceSchema({
  name,
  description,
  serviceType,
  url,
}: {
  name: string;
  description: string;
  serviceType: string;
  url: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name,
    description,
    serviceType,
    url: url.startsWith('http') ? url : `${BASE_URL}${url}`,
    provider: {
      '@type': 'Organization',
      name: 'Luminosoft',
      url: BASE_URL
    },
    areaServed: {
      '@type': 'Country',
      name: 'India'
    }
  };
}

