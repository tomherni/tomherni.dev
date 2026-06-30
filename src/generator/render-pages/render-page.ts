import type { BasePageData, ImportedPageData, Page } from '@types';
import { createFile, getLayoutPath } from '../utils';

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
