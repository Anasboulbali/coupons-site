// scripts/generate-sitemap.js
const fs = require('fs');
const path = require('path');

const baseUrl = 'https://dealz-couponsite.netlify.app';
const currentDate = new Date().toISOString().split('T')[0];

const generateSitemap = () => {
  const pages = [
    { url: '/', priority: '1.0', changefreq: 'daily' },
    { url: '/store/aliexpress', priority: '0.8', changefreq: 'daily' },
    { url: '/store/amazon', priority: '0.8', changefreq: 'daily' },
    // Add more pages
  ];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${pages.map(page => `
        <url>
          <loc>${baseUrl}${page.url}</loc>
          <lastmod>${currentDate}</lastmod>
          <changefreq>${page.changefreq}</changefreq>
          <priority>${page.priority}</priority>
        </url>
      `).join('')}
    </urlset>`;

  fs.writeFileSync(
    path.resolve(__dirname, '../public/sitemap.xml'),
    sitemap.trim()
  );
};

generateSitemap();
