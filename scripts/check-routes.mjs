import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { sep } from 'node:path';
import test from 'node:test';
import config from '../astro.config.mjs';

const pages = new URL('../src/pages/', import.meta.url);
const dist = new URL('../dist/', import.meta.url);
const base = config.base;
const site = new URL(config.site);
const pageFiles = readdirSync(pages, { recursive: true })
  .filter((file) => /\.(astro|md)$/.test(file));

test('withdrawn teaching page', () => {
  assert.ok(!existsSync(new URL('teaching/index.html', dist)));
});

function outputFile(url) {
  assert.ok(url.pathname.startsWith(base), `Missing deployment base: ${url.pathname}`);
  const path = decodeURIComponent(url.pathname.slice(base.length));
  const file = new URL(path, dist);
  return /\.[^/]+$/.test(path) ? file : new URL(`${path.replace(/\/$/, '')}/index.html`.replace(/^\//, ''), dist);
}

for (const file of pageFiles) {
  const route = file.split(sep).join('/').replace(/\.(astro|md)$/, '').replace(/(^|\/)index$/, '');
  const url = new URL(base + route, site);
  const language = route.startsWith('en/') || route === 'en' ? 'en' : 'zh-CN';

  test(url.pathname, () => {
    const html = readFileSync(outputFile(url), 'utf8');
    assert.ok(html.includes(`<html lang="${language}"`), 'Incorrect page language');
    assert.ok(/<title>[^<]+<\/title>/.test(html), 'Missing page title');
    assert.ok(/<h1\b[^>]*>[\s\S]+?<\/h1>/.test(html), 'Missing heading');

    for (const [, value] of html.matchAll(/\b(?:href|src)="([^"]+)"/g)) {
      const target = new URL(value.replaceAll('&amp;', '&'), url);
      if (target.origin !== site.origin) continue;
      assert.ok(existsSync(outputFile(target)), `Broken internal link: ${value}`);
    }

    const switchTag = html.match(/<a\b[^>]*class="lang-switch"[^>]*>/)?.[0];
    assert.ok(switchTag, 'Missing language switch');
    const switchUrl = new URL(switchTag.match(/href="([^"]+)"/)[1], url);
    const translated = readFileSync(outputFile(switchUrl), 'utf8');
    const otherLanguage = language === 'en' ? 'zh-CN' : 'en';
    assert.ok(translated.includes(`<html lang="${otherLanguage}"`), 'Incorrect switch destination');
  });
}

for (const file of readdirSync(new URL('../public/', import.meta.url)).filter((file) => file.endsWith('.pdf'))) {
  test(`CV: ${file}`, () => {
    const source = readFileSync(new URL(`../public/${file}`, import.meta.url));
    const output = readFileSync(new URL(file, dist));
    assert.equal(output.subarray(0, 5).toString(), '%PDF-');
    assert.ok(source.equals(output), 'CV changed during build');
  });
}
