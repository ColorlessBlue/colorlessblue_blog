import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://colorlessblue.github.io',
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
