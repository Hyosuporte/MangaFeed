# Manga Feed

**Manga Feed** is an Obsidian plugin that automatically tracks your manga reading progress from a Markdown table.  
It connects to the manga websites using `puppeteer-core`, extracts the latest available chapter, and updates your `.md` file with the current reading status.

---

## Features

- Reads a Markdown table with your manga list.
- Uses `puppeteer-core` to visit manga websites.
- Detects the most recent chapter number.
- Updates the file with reading status:
  - ✅ **Daily** — you're up to date.
  - 🔴 **Overdue** — you have unread chapters.

---

## 📄 Expected Table Format

The plugin expects a Markdown table like this:

```markdown
| Name           | Read | Latest | Status | Link                        |
| -------------- | ---- | ------ | ------ | --------------------------- |
| One Piece      | 1099 |        |        | [Read](https://example.com) |
| Jujutsu Kaisen | 250  |        |        | [Read](https://example.com) |
```

Each row must follow this structure exactly for the plugin to parse and update it.

---

## Requirements

- Node.js
- `puppeteer-core`
- Obsidian (Developer mode enabled)

---

## Installation (Manual / Development)

1. Clone this repo into your Obsidian vault under:

   ```
   .obsidian/plugins/manga-feed
   ```

2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Build the plugin:

   ```bash
   pnpm run build
   ```

4. Enable the plugin from **Settings > Community Plugins > Installed Plugins**.

---

## 🔧 Configuration

The plugin currently uses a hardcoded path to the Markdown file:

```ts
const pathFile = 'F:/Obsidian/hyosuporte/Manga.md';
```

Make sure to replace it with the correct path to your manga tracking file inside your vault.

### Browser Path for Scraping

To fetch the latest chapters, Manga Feed uses puppeteer-core, which requires a valid browser path (Chromium or Firefox only).

Once the plugin is installed and enabled:

- Go to Settings > Plugin Options > Manga Feed.

- You’ll see a field labeled Browser Location like this:

- Paste the full path to your browser executable (Chrome or Firefox).

---

## 🛠️ Roadmap

Planned improvements:

- [ ] Allow configuration of the file path through the plugin settings.
- [ ] Support multiple manga sources.
- [ ] Add automatic scheduled updates.

---

## 📄 License

The plugin licensed under the GPL 3.0 License [See LICENSE for more information](https://github.com/Hyosuporte/MangaFeed/blob/main/LICENSE)
