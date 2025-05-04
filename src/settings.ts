import test from 'node:test';
import MangaFeedPlugin from './main';
import { App, PluginSettingTab, Setting } from 'obsidian';

export class MangaFeedSettingTab extends PluginSettingTab {
  plugin: MangaFeedPlugin;

  constructor(app: App, plugin: MangaFeedPlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    let { containerEl } = this;

    containerEl.empty();

    new Setting(containerEl)
      .setName('Browser Location')
      .setDesc('Specify the browser path for manga scraping.')
      .addText((browser) =>
        browser
          .setPlaceholder('C:\\Program Files\\Zen Browser\\zen.exe')
          .setValue(this.plugin.settings.browserPath)
          .onChange(async (value) => {
            this.plugin.settings.browserPath = value;
            await this.plugin.saveSettings();
          })
      );

    new Setting(containerEl)
      .setName('Note Location')
      .setDesc('Test')
      .addText((notion) =>
        notion
          .setPlaceholder('C:\\Obsidian\\Manga.md')
          .setValue(this.plugin.settings.notionPath)
          .onChange(async (value) => {
            this.plugin.settings.notionPath = value;
            await this.plugin.saveSettings();
          })
      );
  }
}

export const puppeterConfig = {
  headless: true,
  executablePath: '',
  args: [
    '--no-sandbox',
    '--disable-gpu',
    '--disable-webgl',
    '--disable-setuid-sandbox',
  ],
};
