import { Plugin, Notice } from 'obsidian';
import { getManga, searchChapter, updateMarkdown } from './manga-utils';
import puppeteer from 'puppeteer-core';
import { MangaFeedSettingTab, puppeterConfig } from './settings';

interface MangeFeedPluginSettings {
  browserPath: string;
  notionPath: string;
  tagName: string;
}

const DEFAULT_SETTINGS: Partial<MangeFeedPluginSettings> = {
  browserPath: '',
  notionPath: '',
  tagName: '',
};

export default class MangaFeedPlugin extends Plugin {
  settings!: MangeFeedPluginSettings;

  async onload() {
    await this.loadSettings();

    this.addSettingTab(new MangaFeedSettingTab(this.app, this));

    this.addRibbonIcon('file-check', 'Update Chapter Manga', async () => {
      const { mangas, content } = await getManga(
        this.settings.notionPath,
        this.settings.tagName
      );

      try {
        puppeterConfig.executablePath = this.settings.browserPath;

        const browser = await puppeteer.launch(puppeterConfig);
        const page = await browser.newPage();

        for (const manga of mangas) {
          new Notice(`🔍 Seeking chapter for: ${manga.name}`);
          const last = await searchChapter(page, manga.url);
          if (last !== null) manga.lastChapter = last;
        }

        await updateMarkdown(
          this.settings.notionPath,
          mangas,
          content,
          this.settings.tagName
        );
        await browser.close();

        new Notice('Succes tracking');
      } catch (err) {
        console.error('❌ Error updating manga:', err);
        new Notice('❌ Error updating manga. Check console.');
      }
    });
  }

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }
}
