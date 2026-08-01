import type { Post } from '#types';
import path from 'node:path';
import { createFile } from '../../utils/node.js';
import { DESCRIPTION, TITLE } from '../../config.js';
import { DIR_DIST } from '../../constants.js';

const FILE_NAME = 'llms.txt';

export async function createLlmsTxt(posts: Post[]): Promise<void> {
  // It is important there is no whitespace before the H1.
  const contents = `# ${TITLE}

> ${DESCRIPTION}

## Blog posts

${posts.map(({ meta }) => `- [${meta.title}](${meta.url}): ${meta.description}`).join('\n')}
`;

  await createFile(path.join(DIR_DIST, FILE_NAME), contents);
}
