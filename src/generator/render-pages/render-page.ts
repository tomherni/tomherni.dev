import type {
  BaseLayoutPostData,
  BaseLayoutTagData,
  BasePageData,
  ImportedPageData,
  Page,
} from '@types';
import { createFile, getLayoutPath, resolveUrl } from '../utils';

export async function renderPage(
  source: string,
  target: string,
  data?: BaseLayoutPostData | BaseLayoutTagData,
): Promise<ImportedPageData> {
  const _data = preparePageData(data, target);
  return render(source, target, _data);
}

function preparePageData<
  T extends BaseLayoutPostData | BaseLayoutTagData | undefined,
>(data: T, target: string): T & BasePageData {
  return { ...data, url: resolveUrl(target) };
}

async function render(
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

    return render(layoutPath, target, {
      ...data,
      config: { ...('config' in data ? data.config : {}), ..._config },
      content,
    });
  }

  createFile(target, content);
  return { ...data, content, config: (data as ImportedPageData).config };
}
