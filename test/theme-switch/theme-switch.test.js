// TODO: write tests!

import { fixture, expect } from '@open-wc/testing';
import '../../src/js/index.js'; // TODO: import component instead

describe('ThemeSwitch', () => {
  let element;

  beforeEach(async () => {
    element = await fixture(`<theme-switch></theme-switch>`);
  });

  it('test', () => {
    console.log(element);
    expect(true).to.equal(true);
  });
});
