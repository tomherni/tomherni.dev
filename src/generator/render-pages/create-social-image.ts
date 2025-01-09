import fs from 'fs';
import path from 'path';
import url from 'url';
import {
  CanvasRenderingContext2D,
  createCanvas,
  loadImage,
  registerFont,
} from 'canvas';
import { Post } from '../../../types/types';
import { SOCIAL_FILE_NAME, SOCIAL_MIME_TYPE } from '../constants';

const WIDTH = 1200;
const HEIGHT = 600;
const PADDING = 100;

let fontsRegistered = false;

export async function createSocialImage(post: Post, postFile: string) {
  registerFonts();

  const canvas = createCanvas(WIDTH, HEIGHT);
  const ctx = canvas.getContext('2d');

  // Create background and top border.
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, WIDTH, HEIGHT);
  ctx.fillStyle = '#E8422C';
  ctx.fillRect(0, 0, WIDTH, 24);

  // Write "tomherni.dev".
  ctx.fillStyle = '#272626';
  ctx.font = '44px "Source Sans 3 Bold"';
  ctx.fillText('tomherni', PADDING, 114);
  ctx.fillStyle = '#E8422C';
  ctx.font = '44px "Source Sans 3 Bold"';
  ctx.fillText('.dev', PADDING + ctx.measureText('tomherni').width, 114);

  // Write the title that wraps when necessary.
  ctx.fillStyle = '#272626';
  ctx.font = '72px "Source Sans 3 Bold"';
  writeWrappingTitle(post.meta.title, ctx);

  // Insert the profile picture.
  const dirName = url.fileURLToPath(new URL('.', import.meta.url));
  const pictureUri = 'resources-social-image/picture.png';
  const image = await loadImage(path.join(dirName, pictureUri));
  ctx.drawImage(image, 948, 348, 180, 180);

  // Save the social image.
  const buffer = canvas.toBuffer(SOCIAL_MIME_TYPE);
  const foo = path.join(path.dirname(postFile), SOCIAL_FILE_NAME);
  fs.writeFileSync(foo, buffer);
}

function registerFonts() {
  if (!fontsRegistered) {
    fontsRegistered = true;
    const dirName = url.fileURLToPath(new URL('.', import.meta.url));
    const fontUri = 'resources-social-image/source-sans-3-bold.ttf';
    registerFont(path.join(dirName, fontUri), { family: 'Source Sans 3 Bold' });
  }
}

function writeWrappingTitle(title: string, ctx: CanvasRenderingContext2D) {
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
