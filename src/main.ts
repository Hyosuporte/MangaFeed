import { Plugin, Notice } from 'obsidian';
import { getManga, searchChapter, updateMarkdown } from './manga-utils';
import puppeteer from 'puppeteer-core';
import { executablePath } from 'puppeteer';

export default class ExamplePlugin extends Plugin {
  async onload() {
    this.addRibbonIcon('file-check', 'update manga', async () => {
      const { mangas, content } = await getManga();
      try {
        const browser = await puppeteer.launch({
          headless: true,
          executablePath: executablePath(),
          args: ['--no-sandbox', '--disable-gpu', '--disable-webgl'],
        });

        const page = await browser.newPage();

        for (const manga of mangas) {
          new Notice(`🔍 Buscando capítulo para: ${manga.name}`);
          const last = await searchChapter(page, manga.url);
          if (last !== null) manga.lastChapter = last;
        }

        await updateMarkdown(mangas, content);
        await browser.close();

        new Notice('📄 ¡Archivo Obsidian actualizado con éxito!');
      } catch (err) {
        console.error('❌ Error al actualizar manga:', err);
        new Notice('❌ Error al actualizar manga. Revisa la consola.');
      }
    });
  }
  async onunload() {
    console.log('unloading plugin');
  }
}
