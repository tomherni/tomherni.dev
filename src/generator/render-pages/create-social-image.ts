import path from 'path';
import url from 'url';
import puppeteer from 'puppeteer';
import { Post } from '../../../types/types';
import { SOCIAL_FILE_NAME } from '../constants';

export async function createSocialImage(
  post: Post,
  postFile: string,
): Promise<void> {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 600 });
  await page.goto(getTemplateFileUrl(), { waitUntil: 'networkidle0' });

  const template = await page.$('.card');
  if (!template) {
    throw new Error('Card elements not found');
  }

  // TODO: title: less padding-right, and perhaps smaller line-height.
  // TODO: tags: be careful not to overlap the image?
  await page.evaluate(({ title, tags }) => {
    const titleElement = document.querySelector('div.title') as HTMLElement;
    titleElement.innerText = title;

    const tagsElement = document.querySelector('ul.tags') as HTMLElement;
    if (tags) {
      tags.forEach((tag) => {
        const li = document.createElement('li');
        li.innerText = tag;
        tagsElement.append(li);
      });
    } else {
      tagsElement.remove();
    }
  }, post.meta);

  await template.screenshot({ path: getSaveFilePath(postFile) });

  await browser.close();
}

function getTemplateFileUrl(): string {
  const dirName = url.fileURLToPath(new URL('.', import.meta.url));
  const templatePath = path.join(dirName, 'template/template.html');
  return url.pathToFileURL(templatePath).href;
}

function getSaveFilePath(postFile: string): string {
  return path.join(path.dirname(postFile), SOCIAL_FILE_NAME);
}
