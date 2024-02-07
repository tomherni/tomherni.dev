---
title: The Specificity Of ::slotted()
date: 2024-02-08 16:30:00
tags:
  - css
  - shadow dom
  - web components
---

The `::slotted()` pseudo-element allows you to style elements that are slotted into your web component. But, there is something that may catch you off guard: styles applied with `::slotted()` lose to global styles.

Imagine a website with the following markup:

```html
<style>
  p { color: blue } /* (0, 0, 1) */
</style>

<my-element>
  <p>Hello world</p>
</my-element>
```

Where `<my-element>` is a web component that adds the following styles:

```css
:host ::slotted(p) { /* (0, 1, 2) */
  color: red;
}
```

The website's global styles will win, and the text will be **blue**. Even though the specificity of `:host ::slotted(p)` (0, 1, 2) is higher than `p` (0, 0, 1).

The web component cannot set any CSS properties on a slotted element that are already set by global styles.

This becomes an even bigger issue when global styles include a "reset" stylesheet (like Normalize.css). Reset stylesheets touch the styling of many HTML elements, making it even less likely for slotted styles to be applied.

And in case you were wondering, increasing the argument's specificity of `::slotted()` will also not help you win from global styles.

```css
/* Still loses to global styles */
::slotted(p#foo) {
  color: red;
}
```

## Encapsulation contexts

This behavior is not a bug. When explaining how declarations are sorted by the cascade, the spec says the following about [cascade contexts](https://www.w3.org/TR/css-cascade-5/#cascade-context):

> "When comparing two declarations that are sourced from different encapsulation contexts, then for normal rules the declaration from the outer context wins, and for important rules the declaration from the inner context wins."

This essentially means that, without `!important`, a web component's `::slotted()` rules are overridden by the outer context (global styles). Specificity pretty much goes out the window.

The next part is also worth mentioning:

> "This effectively means that normal declarations belonging to an encapsulation context can set defaults that are easily overridden by the outer context, while important declarations belonging to an encapsulation context can enforce requirements that cannot be overridden by the outer context."

Using `!important` seems to be the official way to enforce slotted styles.

## Making slotted rules important

As we now know, the only way to make `::slotted()` win is to make rules important. It's not pretty, but considering it's the only way, I suppose this is a case where using `!important` is justified.

```css
/* Wins from global styles */
::slotted(p) {
  color: red !important;
}
```

However, consumers may not appreciate their slotted elements being styled with `!important`. Slotted elements are _their_ elements in _their_ DOM. And if they want to set a property that is already set with `!important`, then they now need to do the same to win the specificity battle.

## Why this behavior is tricky

It's likely that most developers would not anticipate this behavior. They would likely assume that styles set with `::slotted()` compete with the specificity of global styles.

Additionally, when a web component is developed and tested in an environment without (conflicting) global styles, then this issue is easy to miss before it makes its way to production.

The purpose of `::slotted()` is to set default styles that can be easily overridden. But consumers can have reset stylesheets, or import stylesheets over which they have no control (particularly in larger corporate environments). In those cases, slotted styles are overridden _too_ easily (i.e. unintentionally).

## How to proceed

Slotted styles without `!important` may not end up being applied as expected. If this is an issue for your web component, then it's time to make a decision:

1. Set important slotted styles with `!important` to enforce them. Document the reason behind this decision and what consumers would have to do to override those styles if necessary.

2. Steer clear of `::slotted()` altogether. Instead, document which styles consumers are recommended to set when slotting elements. Argument could be made that consumers should remain solely responsible for styling their elements.

Choose an approach that aligns with your philosophy. Make a conscious decision that you can stand behind—and be consistent.
