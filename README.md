# Manga Feed

**Manga Feed** is an Obsidian plugin that tracks your manga reading progress from a table inside a note.  
It scrapes manga websites using `puppeteer-core` to detect the latest chapter and updates your table accordingly.

---


## Features

- Reads a Markdown table with your manga list.
- Uses `puppeteer-core` to visit manga websites.
- Detects the most recent chapter number.
- Updates the file with reading status:
  - ✅ **Up to Date** — you're caught up.
  - 🔴 **Overdue** — you have unread chapters.

## 📄 Markdown Table Format

The plugin expects a Markdown table like this:

```markdown
| Name           | Read | Latest | Status | Link                        |
| -------------- | ---- | ------ | ------ | --------------------------- |
| One Piece      | 1099 |        |        | [Read](https://example.com) |
| Jujutsu Kaisen | 250  |        |        | [Read](https://example.com) |
```

Each row must follow this structure exactly for the plugin to parse and update it.


## Requirements

- Node.js
- `puppeteer-core`
- Obsidian (Developer mode enabled)


## 📦 Installation (Manual / Development)

1. Clone the repository into your Obsidian vault under `.obsidian/plugins/manga-feed`.

   ```
   .obsidian/plugins/manga-feed
   ```

2. Open a terminal in the plugin directory and install dependencies:  

   ```bash
   pnpm install
   ```

3. Build the plugin:

   ```bash
   pnpm run build
   ```

4. Open Obsidian, go to Settings > Community Plugins, and enable "Manga Feed".


## 🚀 How It Works

Once the plugin is enabled:

  

## 🔧 Plugin Configuration

The plugin currently uses a path to the Markdown file:

![Settings_path_notes](https://github.com/user-attachments/assets/2407cbeb-b9ee-40ee-9c0a-0439ba3700f7)

Make sure to replace it with the correct path to your manga tracking file inside your vault.

### 🌐 Browser Path for Scraping

To fetch the latest chapters, Manga Feed uses puppeteer-core, which requires a valid browser path (Chromium or Firefox only).

Once the plugin is installed and enabled:

1. Go to Settings > Plugin Options > Manga Feed.

2. You’ll see a field labeled Browser Location like this:

3. Paste the full path to your browser executable (Chrome or Firefox).

![Settings_path_browser](https://github.com/user-attachments/assets/121735db-636c-4996-a40a-0621cc8b475f)


## 🛠️ Roadmap

Planned improvements:

- [ ] Allow configuration of the file path through the plugin settings.
- [ ] Support multiple manga sources.
- [ ] Add automatic scheduled updates.

---

## 📄 License

This plugin is licensed under the GPL 3.0 License.  [See LICENSE for more information](https://github.com/Hyosuporte/MangaFeed/blob/main/LICENSE)
