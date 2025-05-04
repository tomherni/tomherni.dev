import type { Post } from '@types';
import {
  type CanvasRenderingContext2D,
  createCanvas,
  loadImage,
  registerFont,
} from 'canvas';
import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';
import { SOCIAL_FILE_NAME, SOCIAL_MIME_TYPE } from '../constants';

const WIDTH = 1200;
const HEIGHT = 600;
const PADDING = 100;

const COLOR_WHITE = '#ffffff';
const COLOR_DARK_GRAY = '#272626';
const COLOR_RED = '#e8422c';
const FONT_FAMILY = 'Source Sans 3 Bold';

let fontsRegistered = false;

/**
 * Create an image for social platforms that show page thumbnails.
 */
export async function createSocialImage(post: Post, postFile: string) {
  registerFonts();

  const canvas = createCanvas(WIDTH, HEIGHT);
  const ctx = canvas.getContext('2d');

  // Create background and top border.
  ctx.fillStyle = COLOR_WHITE;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);
  ctx.fillStyle = COLOR_RED;
  ctx.fillRect(0, 0, WIDTH, 24);

  // Draw "tomherni.dev".
  ctx.fillStyle = COLOR_DARK_GRAY;
  ctx.font = `44px "${FONT_FAMILY}"`;
  ctx.fillText('tomherni', PADDING, 114);
  ctx.fillStyle = COLOR_RED;
  ctx.font = `44px "${FONT_FAMILY}"`;
  ctx.fillText('.dev', PADDING + ctx.measureText('tomherni').width, 114);

  // Draw the page title.
  ctx.fillStyle = COLOR_DARK_GRAY;
  ctx.font = `72px "${FONT_FAMILY}"`;
  drawTitle(post.meta.title, ctx);

  // Insert the profile picture.
  const dirName = url.fileURLToPath(new URL('.', import.meta.url));
  const image = await loadImage(path.join(dirName, 'resources/picture.png'));
  ctx.drawImage(image, 948, 348, 180, 180);

  // Save the social image.
  const buffer = canvas.toBuffer(SOCIAL_MIME_TYPE);
  const filePath = path.join(path.dirname(postFile), SOCIAL_FILE_NAME);
  fs.writeFileSync(filePath, buffer);
}

/**
 * Draw the title with word wrapping.
 */
function drawTitle(title: string, ctx: CanvasRenderingContext2D) {
  const words = title.split(' ');
  let line = '';
  let offsetTop = 225;

  for (const word of words) {
    const lineWithLatestWord = line + ' ' + word;

    if (ctx.measureText(lineWithLatestWord).width > WIDTH - PADDING) {
      ctx.fillText(line.trim(), PADDING, offsetTop);
      line = word;
      offsetTop = offsetTop + 80;
    } else {
      line = lineWithLatestWord;
    }
  }

  ctx.fillText(line.trim(), PADDING, offsetTop);
}

function registerFonts() {
  if (!fontsRegistered) {
    const dirName = url.fileURLToPath(new URL('.', import.meta.url));
    const filePath = path.join(dirName, 'resources/source-sans-3-bold.ttf');
    registerFont(filePath, { family: FONT_FAMILY });
    fontsRegistered = true;
  }
}
