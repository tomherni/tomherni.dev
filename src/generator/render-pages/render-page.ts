import type { BasePageData, ImportedPageData, Page } from '@types';
import fs from 'node:fs';
import path from 'node:path';
import { createFile } from '../../utils/node';
import { DIR_SRC_LAYOUTS } from '../../constants';

export async function renderPage(
  source: string,
  target: string,
  data: BasePageData | ImportedPageData,
): Promise<ImportedPageData> {
  const page: Page = (await import(source)).default;
  const content = page.content(data);
  const config = page.config?.(data);

  if (config?.layout) {
    const { layout, ..._config } = config;
    const layoutPath = getLayoutPath(layout);

    return renderPage(layoutPath, target, {
      ...data,
      config: { ...('config' in data ? data.config : {}), ..._config },
      content,
    });
  }

  createFile(target, content);
  return { ...data, content, config: (data as ImportedPageData).config };
}

export function getLayoutPath(layout: string): string {
  const layoutPath = path.join(DIR_SRC_LAYOUTS, `${layout}.ts`);

  if (!fs.existsSync(layoutPath)) {
    throw new Error('Layout does not exist');
  }
  return layoutPath;
}
