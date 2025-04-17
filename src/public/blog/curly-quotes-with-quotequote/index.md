---
title: Curly Quotes with QuoteQuote
date: 2025-04-17 10:16:53
tags:
  - quote-quote
  - github
  - npm
---

I'm pleased to announce the first stable release of QuoteQuote—a library that converts boring, straight quotes to beautiful, typographically correct curly quotes, also known as _smart quotes_.

QuoteQuote is available on [GitHub](https://github.com/tomherni/quote-quote) and [npm](https://www.npmjs.com/package/quote-quote). Feel free to download it using your favorite package manager, such as npm, pnpm, or yarn.

```sh
npm install quote-quote
```

I've also launched a [website](https://quote-quote.tomherni.dev/) where you can convert text online.

## Lightweight and modern

The library is lightweight, modern, tree-shakeable, and supports both ESM and CJS. At the time of writing, it only exports `convert()`, which does the most important thing: convert straight quotes to curly quotes.

I have plans for additional features, such as support for Markdown and the DOM. Development for these features will begin soon and will be added to the library in accordance with SemVer (Semantic Versioning).

## Why QuoteQuote is necessary

There are similar libraries out there, but they all have different issues. Some haven't been updated in years and have open bugs that are fixable. Others don't support ESM or CJS, lack TypeScript support, or are simply outdated. Issues and pull requests are mostly met with silence.

Also, using curly quotes manually is just too difficult. Keyboards typically offer straight quotes, and only allow curly quotes if you happen to know the right key combinations (for example, `Alt + 0147`	on Windows and `Option + [` on macOS for just one specific quotation mark).

## Why curly quotes

"Curly quotes are the quotation marks used in good typography." says Matthew Butterick in [Practical Typography](https://practicaltypography.com/straight-and-curly-quotes.html)—and I must say, I agree. Curly quotes are more legible and flow better with the content. They are a _must_ for blog posts, articles, and professional writing in general.

---

Give QuoteQuote a try and let me know what you think! I welcome all feedback, as well as issues and pull requests on [GitHub](https://github.com/tomherni/quote-quote). And if you'd like to support the library, feel free to star the repository.
