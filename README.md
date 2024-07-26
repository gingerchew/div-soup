# `<div>` Soup Calculator!

Ever wondered if your web page is up to snuff?

Worried you might be forcing your users to swim around in a bunch of `<div>`'s with no purpose or understanding of where they are?

## How to use:

Clone the repo, load into your browser as an unpacked extension, go to your webpage and click the extension icon. A score will be generated based on the rules below:

## ToDo:

- [ ] Add options to add custom rules and weights
- [ ] Add a button to reveal the true score (remove upper limit of 0)

## How do I get a score above 0?

**A `0` is a perfect score.**

This choice was made because of how content on the web works. A site that has an atrocious card component could get a really high score because the blog page has 10,000 `<p>`, `<span>`, `<i>`, `<strong>`, etc tags.

## The Rules:

- -0.5 points for every `div > div:not(:has( > div))` on the page.
- -1 point for every use of the `[ping]` attribute on the page.
- -1 point for every `div > div > div:not(:has( > div))` on the page.
- -10 points for every `div > div > div > div:not(:has( > div))` on the page.
- -100 points for every `div > div > div > div > div` on the page.
- -1000 points for every use of `[href^="javascript:"]` and `[onclick]:not(button,a,input)`
- +1 point for every `*:not(div,script,style,link,noscript,template,slot,source,datalist,option,optgroup,track)` in the body[^1]

### Tracked but not scored:

- Number of `<div>`'s used
- How many `<div>`'s are used compared to how many non-`<div>`'s are used[^2]


## Reasoning behind scoring:

Let's face it. Using a `<div>` here and there doesn't make you a bad developer. Using a `<div>` instead of a button, well, it at least makes you inconsiderate. The [cost of JavaScript](https://timkadlec.com/remembers/2020-04-21-the-cost-of-javascript-frameworks/) in comparison to HTML (essentially free!) may lead you to believe that excessive `<div>` soup is not a big deal. In fact, [a hefty DOM full of redundant elements can be very taxing](https://web.dev/articles/dom-size-and-interactivity).

This is why even though `<div>` soup tracks the number of total `<div>`'s used, it does *not* penalize you for using them. It only penalizes for repeated nesting. Take the following markup for example:

```html
<div>
    <div class="heading-2">An important article</div>
    <div class="summary-container">
        <div class="summary-content">
            <p>Lorem ipsum...</p>
        </div>
        <div class="summary-data">
            <div>Published on: xx/xx/xxxx</div>
            <div>Author: You!</div>
        </div>
    </div>
</div>
```

This could be written much more semantically. We know from the `.heading-2` element that this is an article. `<article>` seems like the perfect semantic element. Assuming that this is indeed a second level heading, we can swap our `.heading-2` `<div>` for a `<h2>` and *gain* semantics. The `.summary-content` and `.summary-data` wreak of unnecessary `<div>` soup due to too much component abstraction. I can see the JSX now:

```jsx
function Article({ article }) {
    return <div>
        <Heading level="2">{article.title}</Heading>
        <Summary content={article.summary} author={article.author} published={article.publishedOn} />
    </div>
}
```

I will give benefit of the doubt towards `.summary-container`, but the rest of the `.summary-*` classes could be replaced with semantic elements. `.summary-data` could easily be converted into a `<ul>`, and `.summary-content` doesn't need to exist as a wrapper. If it does, you may need to revisit your CSS. While we're at it, let's add a `<time>` element around that date.

```html
<article>
    <h2>An important article</h2>
    <div class="summary-container">
        <p>Lorem ipsum...</p>
        <ul>
            <li>Published on: <time datetime="xxxx-xx-xx">xx/xx/xxxx</time></li>
            <li>Author: You!</li>
        </ul>
    </div>
</article>
```

This brings the score from -21.5 to 0. Using the `<time>` makes our site machine readable, and maintaining a healthy heading order makes it easier to navigate for screen-readers.

### `[href^="javascript:"]`

The goal behind adding this selector was to decimate the score of any site that doesn't use a `<button>`. A dropdown menu? `<button>`! Triggering a popup? `<button>`! Clicking on a link that is styled to look like a button and is programmed to do button things? `<button>`!!

### `[onclick]:not(button, a, input)`

Stop adding click handlers to `<div>` and non-control type elements!



[^1]: The goal is to use semantic elements. `script`,`style`,`link`,`noscript`,`template`, and `slot` are excluded because they are used by the author, and hold no meaning for the user. `datalist`,`option`, and `optgroup` are excluded because they exist within controls and could lead to false positives. `source` and `track` are excluded because they are used in tandem with media elements `video`, `audio`, `img`, and `picture` and could lead to false positives.

[^2]: Ideally, there should be more semantic markup than non-semantic. Excluding deprecated and non-semantic/meta elements (see [^1]) there are 98 elements that hold semantic meaning.