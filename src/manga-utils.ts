import { Page } from 'puppeteer-core';
import fs from 'fs/promises';
import { PathLike } from 'fs';

let rowPattern: RegExp;

type Manga = {
  name: string;
  read: number;
  lastChapter?: number | null;
  state?: string | null;
  url: string;
};

export async function getManga(pathFile: PathLike, tagName: string) {
  const content = (await fs.readFile(pathFile, 'utf-8')).split('\n');
  const mangas = [];

  rowPattern = new RegExp(
    `^\\|\\s*(.+?)\\s*\\|\\s*(\\d+)\\s*\\|\\s*(\\d+)?\\s*\\|\\s*(.+?)\\s*\\|\\s*\\[${tagName}\\]\\((https?:\\/\\/.*?)\\)\\s*\\|$`,
  );

  for (const line of content) {
    const match = rowPattern.exec(line);
    if (match) {
      const [_, name, read, lastChapter, state, url] = match;
      mangas.push({
        name: name.trim(),
        read: parseInt(read),
        lastChapter: lastChapter ? parseInt(lastChapter) : null,
        state: state?.trim() || null,
        url: url.trim(),
      });
    }
  }

  return { mangas, content };
}

/**
 * Busca el número de capítulo en el contenido de una página usando un patrón regex.
 *
 * @param page - Instancia de Puppeteer `Page` para interactuar con el navegador.
 * @param url - URL del manga donde se va a buscar el capítulo.
 * @returns Promesa que resuelve con el número de capítulo encontrado o `null` si no se encuentra.
 */
export async function searchChapter(
  page: Page,
  url: string,
): Promise<number | null> {
  try {
    let lastChapter: number = 0;
    await page.goto(url, { waitUntil: 'domcontentloaded' });

    await page.waitForFunction(
      () => {
        const pattern = /(?:Cap[ií]tulo|Chapter)\s*[:\s]*([\d,]+)(?=\D|$)/gi;
        return pattern.test(document.body.innerText);
      },
      { timeout: 8200 },
    );

    const text = await page.evaluate(() => {
      const body = document.body.cloneNode(true);
      body
        .querySelectorAll('.bg-comments-background')
        .forEach((el) => el.remove());

      return body.innerText;
    });

    const match = text.matchAll(
      /(?:Cap[ií]tulo|Chapter)\s*[:\s]*([\d,]+)(?=\D|$)/gi,
    );

    if (match) {
      let index = 0;
      for (const item of match) {
        index++;
        const chapter = parseInt(item[1].replace(',', ''));
        if (lastChapter === null || chapter > lastChapter) {
          lastChapter = chapter;
        }
        if (index > 2) break;
      }
      return lastChapter;
    }
  } catch (error) {
    console.log(`Error when searching for chapter in ${url}:`, error);
  }
  return null;
}

/**
 * Actualiza el contenido de un archivo Markdown con la información más reciente de los mangas.
 *
 * Recorre las líneas del archivo buscando filas de una tabla, extrae los datos, compara el capítulo leído con el último disponible
 * y actualiza el estado del manga (✅ Daily o 🔴 Overdue). Luego escribe el contenido actualizado en el archivo.
 *
 * @param mangas - Lista de objetos `Manga`, cada uno con su nombre, capítulo leído y último capítulo disponible.
 * @param content - Contenido actual del archivo Markdown, línea por línea.
 * @returns Una promesa que se resuelve cuando se ha escrito el nuevo contenido en el archivo.
 */
export async function updateMarkdown(
  pathFile: PathLike,
  mangas: Manga[],
  content: string[],
  tagName: string,
): Promise<void> {
  const updatedLines: string[] = [];

  for (const line of content) {
    const match = rowPattern.exec(line);
    if (match) {
      const [_, name, read, , , url] = match;
      const manga = mangas.find((m) => m.name == name);
      const last = manga?.lastChapter;
      const state = last && manga.read == last ? '✅ Daily' : '🔴 Overdue';

      const newLine = `| ${name} | ${read} | ${last} | ${state} | [${tagName}](${url}) |`;

      updatedLines.push(newLine);
    } else {
      updatedLines.push(line);
    }
  }

  await fs.writeFile(pathFile, updatedLines.join('\n'), 'utf-8');
}

export function getPercentage(total: number, currentChapter: number) {
  return (currentChapter * 100) / total;
}
