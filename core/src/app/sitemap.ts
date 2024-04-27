import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: process.env.NEXT_PUBLIC_APP_DOMAIN,
      lastModified: new Date(),
    },
    {
      url: process.env.NEXT_PUBLIC_APP_DOMAIN + '/api/auth/signin',
      lastModified: new Date(),
    },
    {
      url: process.env.NEXT_PUBLIC_APP_DOMAIN + '/to-do',
      lastModified: new Date(),
    },
  ];
}
