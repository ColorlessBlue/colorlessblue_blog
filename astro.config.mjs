import { defineConfig } from 'astro/config';
import { unified } from '@astrojs/markdown-remark';

export default defineConfig({
  site: 'https://colorlessblue.github.io',
  base: '/colorlessblue_blog/',
  compressHTML: true,
  i18n: {
    locales: ['zh-CN', 'en'],
    defaultLocale: 'zh-CN',
    routing: {
      prefixDefaultLocale: false,
    },
  },
  markdown: {
    processor: unified(),
    shikiConfig: {
      theme: 'github-light',
    },
  },
});
