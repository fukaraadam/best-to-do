import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: process.env.NEXT_PUBLIC_APP_DOMAIN,
      lastModified: new Date(),
    },
    {
      url: process.env.NEXT_PUBLIC_APP_DOMAIN + '/login',
      lastModified: new Date(),
    },
  ];
}
