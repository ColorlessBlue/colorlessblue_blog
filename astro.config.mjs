import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://colorlessblue.github.io',
  base: '/colorlessblue_blog/',
  i18n: {
    locales: ['zh-CN', 'en'],
    defaultLocale: 'zh-CN',
    routing: {
      prefixDefaultLocale: false,
    },
  },
  markdown: {
    shikiConfig: {
      theme: 'github-light',
    },
  },
});
