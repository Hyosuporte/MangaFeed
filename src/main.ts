import { Plugin, Notice } from 'obsidian';
import {
  getManga,
  searchChapter,
  updateMarkdown,
  getPercentage,
} from './manga-utils';
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

        const alertInfo = new Notice('', 0);

        for (let i = 0; i < mangas.length; i++) {
          alertInfo.setMessage(
            `🔍 ${getPercentage(mangas.length, i + 1).toFixed(0)}% | ${
              mangas[i].name
            }`
          );

          const last = await searchChapter(page, mangas[i].url);
          if (last !== null) mangas[i].lastChapter = last;
          await sleep(700);
        }

        await browser.close();

        await updateMarkdown(
          this.settings.notionPath,
          mangas,
          content,
          this.settings.tagName
        );

        alertInfo.setMessage('✅ Succes tracking');
        await sleep(700);
        alertInfo.hide();
      } catch (err) {
        console.error('❌ Error updating manga:', err);
        new Notice('❌ Error updating manga. Check console.', 2000);
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
