import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/to-do/',
    },
    sitemap: process.env.NEXT_PUBLIC_APP_DOMAIN + '/sitemap.xml',
  };
}
