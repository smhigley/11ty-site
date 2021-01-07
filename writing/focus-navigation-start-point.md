---
title: Focus management still matters
tags: post
date: 2020-02-27
summary: "A look at sequential-focus-navigation-starting-point and what it means for focus handling"
---

The most difficult challenges in programming are:

1. Debating framework choices with a dogmatic fan, and
2. Naming things

There is seemingly no solution for the first problem; you must accept it, adopt a zen-like calm when faced with invocations of bundle sizes and performance benchmarks, and silently plan your backup career doing literally anything else.

For the second problem, naming things, it's generally best to just pick something and move on. After all, any name is better than wasting hours agonizing over whether `toggleMenuItemSelection` is adequately understandable, descriptive, and concise.

And then, as a counterpoint, we have sequential-focus-navigation-starting-point.

_You_ try saying "sequential focus navigation starting point" five times over the course of two minutes, while also trying to explain to someone exactly why they still need to handle focus after closing their dropdown, even though "tabbing works in Chrome." To prove my point, here is a brief list of names I would much rather use in said calls:
* focus-start-point
* focus-bookmark
* starty-focus-party
* fast-focus
* 2-focus-2-furious
* fate-of-the-focus

<figure>
  <img src="/writing/assets/focus-party-parrot.gif" alt="The party parrot meme, with overlaid text: starty focus party">
  <figcaption>Thank you for reviewing my application to name all future HTML features</figcaption>
</figure>

## Why are we talking about Something Focus Something Point?

The sequential focus navigation starting point is a browser feature that enables three types of interaction that were not possible without it:

1. You can follow an internal link to a section or heading, and then start tabbing from that section/heading
2. You can click anywhere on the page, and begin tabbing from that point
3. You can hide an element with focus, e.g. by removing it from the DOM or applying `display: none`, without breaking tabbing.

All three behaviors enhance user experience, but the last one in particular has sometimes lured developers into a false sense of security about not handling focus when closing their popups, dropdown menus, or accordions. Although tabbing seems to work fine in these cases, the sequenced-focus-starts-somewhere-around-here-point is only a bandaid; manual focus handling is still necessary for robust accessibility.

## Where did Sequential Focus Whatever come from?

The idea of a sequential focus navigation starting point began with the need to make same-page anchors work with keyboard navigation. Although same-page linking has been available for as long as `<a>` elements, keyboard support has often [lagged behind visual mouse support](https://sarahmhigley.com/writing/tooltips-in-wcag-21/), even at a platform level. So although sighted users would immediately have access to the linked section via scroll and could then interact with it using a mouse, keyboard users would have a different experience. As soon as an internal link was activated, focus would jump to the top of the document, and the next tab press would bring you back to the first focusable element in the page.

To fix this, browsers ([possibly starting with IE5](https://www.dhs.state.il.us/IITAA/IITAAWebImplementationGuidelines.html#web9.4)) began to send focus to the link target when following a same-page link. This only works if the target is focusable, though. Thus began the long period of recommending `tabindex="-1"` be added to to every heading, named anchor, or other static element targeted by an internal link.

The problem is, the visual behavior of internal links still works when the link target isn't focusable, and -- let's be honest -- that's all most developers test for. There was still an opportunity for browsers to improve the keyboard accessibility of this common built-in feature.

Firefox had a solution for this in place [as early as 2013](https://bugs.chromium.org/p/chromium/issues/detail?id=262171), which implemented starting-something-focus-whatsit-navigation-point in all but name. Although keyboard focus would still reset to `<body>` after activating a link with an unfocusable target, the next tab press would move focus as if the link target had been the active element.

[Internet Explorer was the only other browser](https://www.w3.org/Bugs/Public/show_bug.cgi?id=26907#c0) that handled non-focusable link targets, though it took a different approach and simply forced the target element to receive keyboard focus even if it was otherwise unfocusable.

Chrome took a bit longer (read: three years) to come around, but did [finally implement the same focus behavior](https://chromium.googlesource.com/chromium/src/+/8870612f01ca55a123efbd7bf7024b236d6c12a6) as Firefox in February 2016, with one addition:

> If the element pointed by sequential focus navigation starting point is removed from the document tree, a point where there was the element at would be the starting point.

To summarize: when Chrome fixed tab order for internal links, they also used the same mechanism to save the location of the last focused item, if that item was removed from the page.

Around the same time, Rob Dodson wrote what is still the most thorough, reader-friendly explanation of sequential focus navigation starting point: [Removing Headaches from Focus Management](https://developers.google.com/web/updates/2016/03/focus-start-point), in which he also mentioned that side benefit of gracefully handling focus when active element was hidden.

Incidentally, the phrase "sequential focus navigation why is this so long starting point" first appeared in the HTML specification in [November 2014](https://github.com/whatwg/html/commit/7456ed7a11c5e205eb795fba0e1583d5939761ab), where it was defined as an optional user agent behavior.

## How SFNSP works today

The [HTML spec for starting focus sequentially point](https://html.spec.whatwg.org/multipage/interaction.html#sequential-focus-navigation-starting-point) still notes that it is optional, but if it exists it does the following (simplified slightly):

* Is set to the position of a user's click (or more broadly "when the user indicates that it should be moved")
* Is used to determine which element should get focus when the user presses the tab key
* When a user navigates to a fragment (e.g. by clicking on a same-page link, or visiting a URL with a "#" identifier), the start point is set to the target element.

There is no mention in the spec of using focus-nav-start-point to handle keyboard navigation when the currently focused element is hidden or removed from the DOM. Despite the lack of official sanction, this behavior seems to be increasingly relied upon by web developers when closing open dialogs, dropdowns, accordions, or any other toggleable region. This conflicts with the prevailing wisdom that when removing a focused element from the DOM, an author must manually set focus on another (logical) node. However, if browsers save focus-navigation-starts-here-point where the removed element used to be, keyboard navigation seems to work fine even if focus is not handled.

As of writing, the following browsers match Chrome's behavior and set the sequential focus navigation starting point when the currently focused element is removed or hidden:
* Chrome
* Safari
* Firefox
* Edge (Chromium)

Of all the browsers on Windows and Mac that I have access to, only Internet Explorer and Edge (pre-Chromium) do not do this. You can try it out now by [jumping to the next section](#assistive-tech-support) and then hitting tab.

Overall, this is a win for accessibility. For someone relying on keyboard navigation (or any other assistive tech that navigates via focus, like switch devices), getting sent back to the top of the page every single time a developer forgot to handle focus is an enormous pain. The drawback comes when developers don't fully understand exactly what sequential-focus-belaboring-the-point does and doesn't do, or they don't notice focus bugs when keyboard testing.

Focus navigation starting point is not the same as actual keyboard focus. When focus is lost, through following an internal link or hiding a dialog, keyboard focus moves to the `<body>` tag. If you query `document.activeElement` in either of these cases, you can observe this. Alternatively, paste the following snippet into your browser console, [jump to the next section](#assistive-tech-support) and watch every focus update in real time:

``` javascript
document.addEventListener('focusin', () => {
   console.log('Focus moved to:', document.activeElement);
});
```

That difference is extremely important when using assistive tech, since screen readers (for example) do not pay attention to the internal browser concept of focus-starts-here-point. While testing with a keyboard alone may make everything seem fine, trying the same interaction while running a screen reader exposes some rough edges.

## Assistive Tech support

Tests were run against this (extremely simple and not otherwise very accessible) example that contains a few accordions and a dialog, only one of which handles focus on dismissal: https://jsfiddle.net/eo8x3pcu/show.

### Results

<div class="table-wrapper">
  <table class="table support-table">
<thead>
<tr>
<th>Screen Reader/AT</th>
<th>Browser</th>
<th>Tab Support</th>
<th>Virtual cursor/browse mode</th>
<th>Context change feedback</th>
</tr>
</thead>
<tbody>
<tr>
<td>NVDA</td>
<td>Firefox</td>
<td class="true">Yes</td>
<td class="true">Yes</td>
<td class="false">No</td>
</tr>
<tr>
<td>NVDA</td>
<td>Chrome</td>
<td class="true">Yes</td>
<td class="false">No</td>
<td class="false">No</td>
</tr>
<tr>
<td>NVDA</td>
<td>Edge</td>
<td class="true">Yes</td>
<td class="false">No</td>
<td class="false">No</td>
</tr>
<tr>
<td>JAWS</td>
<td>All</td>
<td class="true">Yes</td>
<td class="false">No</td>
<td class="false">No</td>
</tr>
<tr>
<td>Narrator</td>
<td>Edge</td>
<td class="true">Yes</td>
<td class="false">No</td>
<td class="false">No</td>
</tr>
<tr>
<td>Narrator</td>
<td>Edge (pre-Chromium)</td>
<td class="false">No</td>
<td class="true">Yes</td>
<td class="false">No</td>
</tr>
<tr>
<td>VoiceOver</td>
<td>iOS Safari</td>
<td>-</td>
<td class="false">No</td>
<td class="false">No</td>
</tr>
<tr>
<td>VoiceOver</td>
<td>macOS Safari</td>
<td class="true">Yes</td>
<td class="true">Yes</td>
<td class="true">Yes</td>
</tr>
<tr>
<td>Talkback</td>
<td>Chrome</td>
<td>-</td>
<td class="false">No</td>
<td class="false">No</td>
</tr>
<tr>
<td>ZoomText</td>
<td>All</td>
<td class="true">Yes</td>
<td>N/A</td>
<td class="false">No</td>
</tr>
</tbody>
</table>
</div>

### Detailed Notes:
* NVDA + Firefox: both tab and cursor navigation work from the start point, but nothing was announced on close.
* NVDA + Chrome: tab works from the start point; scan mode is flaky, and seems to start from whatever is nearest the last (x, y) position of the dismissed focused element. Nothing is announced on close.
* NVDA + Edge Chromium: tab works, but NVDA reads "document" when focus is lost.
* Narrator + Edge (pre-Chromium): tab starts again from the top, though cursor navigation starts from where the hidden content used to be. Nothing is announced on close
* Narrator + Edge Chromium: tab works, but Narrator reads "document" when focus is lost and cursor navigation starts over from the top of the page
* JAWS with all Windows browsers: tab works, but the virtual cursor starts over from the top of the page. JAWS with Firefox reads "frame" when focus is lost, and was silent with other browsers.
* VoiceOver + Safari on iOS: the VoiceOver cursor jumps somewhere weird and inconsistent (seems to track (x, y) position on screen like NVDA and Chrome), and immediately begins reading from that point. The example that handled focus works as expected.
* VoiceOver + Safari on macOS: both tab and the VoiceOver cursor both start where they should, from where focus was lost.
* Talkback on Android: the screen reader cursor jumps to the top of the page, and begins reading it from the start.
* ZoomText (without a screen reader): When focus is lost, the screen does not re-center on the correct place (most noticeable with the dialog). It works correctly when focus is actively managed.

As is (hopefully) clear, there is absolutely no consistency in how screen readers handle lost focus. At worst, the user gets no feedback about the change of context on close, and then the screen reader starts over from the top of the page. ZoomText (and potentially other assistive tech that wasn't tested) is also affected, with the screen failing to re-center somewhere useful to the user.

Scott O'hara also has support results for [testing skip link focus and virtual cursor](https://scottaohara.github.io/testing/skip-link/testing.html).

## Solutions
The fix is easy: always manage focus when you remove the active element from the DOM!

Supplemental links:
- https://html.spec.whatwg.org/multipage/interaction.html#sequential-focus-navigation-starting-point
- https://developers.google.com/web/updates/2016/03/focus-start-point

___ 

> sequential focus navigation starting point
> sequential focus navigation starting point
> sequential focus navigation starting point
> sequential foction navigatus starting point
> sequential focusing navigation start point
> sequential focal navigation startus point
> sequential fo-cat nappigation flop point

<img src="/writing/assets/cat-flop.jpg" alt="kitten flopped over, face down, sleeping">