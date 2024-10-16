---
title: Aria-activedescendant is not focus
tags: post
date: 2024-10-16
summary: "Who, what, when, where, and why is aria-activedescendant. Or: two focus outlines in a trenchcoat approach you in a dark alley and offer you a combobox."
---

For anyone who has not found themselves wading waist-deep through the nigh-unintelligible morass of accessible [combobox patterns](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/), `aria-activedescendant` might seem like yet another esoteric line item in the ARIA spec, or might be wholly unfamiliar. For those unfortunate souls who _have_ peered into the vortex of combobox accessibility long enough for their eyes to bleed and their ears to echo with the distant chanting of 1,000 cursèd `<div>`s, `aria-activedescendant` can feel a little magical.

This is an attribute that is entirely concerned with screen reader accessibility. Specifically, it allows certain scoped exceptions to the screen reader behavior of only enabling interaction with a single element at a time.

Even more specifically, you probably want to start reaching for `aria-activedescendant` whenever you want to provide a user with immediately relevant actions, autocomplete suggestions, or matching options while they are typing text.

For example: if the user's keyboard focus is on a text input, their screen reader will normally only pass along information and updates about that one text input. Any changes happening elsewhere on the page will not be communicated, with two notable exceptions:

1. Live regions. I'm not going to elaborate on these here, but I have [talked about them before](https://www.youtube.com/watch?v=W5YAaLLBKhQ&t=1497s).
2. If the focused element has an `aria-activedescendant` attribute: changes to the element referenced by that attribute, or changing which element is referenced by `aria-activedescendant`.

Diving more into the text input example, `aria-activedescendant` makes it possible to have screen readers expose both changes to the text input (e.g. the value, valid/invalid state, expand/collapse state, etc.) and also changes to one other associated element, usually in a popup. In other words, it is the primary mechanism that makes comboboxes work:

![image of an open combobox labeled best pet, with screaming hairy armadillo selected. The image is marked up: the input is highlighted and labeled as the focused element, and the screaming hairy armadillo option inside the open listbox popup is highlighted and labelled activedescendant](/writing/assets/combobox-focus-activedescendant.png)

Sometimes this causes people to think of the active descendant as a second focus, or talk about the associated `aria-activedescendant` element as "focused".

![Merry and Pippin ask you: we've had one, yes, but what about second focus?](/writing/assets/second-focus.jpg)

While keyboard focus and `aria-activedescendant` are quite similar -- maybe even more similar than you might think -- they are still distinct in a number of ways that are important for web developers to be able to identify.

## What is focus?

This is the easy one, and most developers are probably already familiar with it. A document may have exactly one focused element at a time, and that element can be queried using the `document.activeElement` DOM attribute.

The focused element of the active document will be the target of any keyboard events, which makes it particularly important when creating custom keyboard interactions.

A screen reader cursor is [not the same as keyboard focus](https://tink.uk/the-difference-between-keyboard-and-screen-reader-navigation/), although screen readers will also usually have their cursor follow any changes in the focused element. Those changes can occur either through user interaction (e.g. tabbing) or programmatic focus changes (e.g. calling `element.focus()` to move focus back to the triggering button when closing a dialog). However, certain screen readers will sometimes ignore programmatic focus changes in favor of their own internal heuristics about where the screen reader cursor should go (side-eye at VoiceOver intensifies).

Identifying the currently focused element can get a little more tricky in the case of multiple documents in nested iframes, or custom web components with shadow roots.

For example, if focus enters a button within an iframe, querying the top-level document's `activeElement` will return the `iframe` and not the focused element within it. Similarly, if focus is within the shadow root of a web component, `document.activeElement` will return the web component's host node. You would then need to query the iframe's `document.activeElement`, or host node's `shadowRoot.activeElement` to find the specific element that has focus.

There are of course other nuances to tracking focus changes that also have the potential to cause premature hair loss in developers:
- If `document.activeElement` is queried in a blur event handler, it will return `document.body`.
- Pressing the tab key does not always move focus starting from `document.activeElement`. There are times when the [sequential focus navigation starting point](https://sarahmhigley.com/writing/focus-navigation-start-point/) diverges from the currently focused element.
- When navigating the web using a keyboard paired with an iOS device, the web page receives focus events, but _no keyboard or pointer events_. Someday I will write 5000 words about the focus-handling implications for this that will never be published because of all the swearing.
- Some other weird edge case that I either can't remember or blissfully have yet to encounter.

As with many things, focus is simple right up until it isn't.

## What is an active descendant?

It's the element identified by `aria-activedescendant`, of course.

![A very young child holds a camera backwards, staring confidently into the lens instead of the viewfinder. The caption says Nailed It.](/writing/assets/nailed-it.jpg)

There's actually the smallest hint of something useful in that tautology, which is that an active descendant on the web only exists with the help of ARIA; there is no way to create one using only HTML or Javascript (apart from literally using JS to set `element.ariaActiveDescendant`).

{% note %}
OK fine, [`<datalist>`](https://adrianroselli.com/2023/06/under-engineered-comboboxen.html) technically also has an active descendant, but it is a cursed control of which we do not speak. I only include it because leaving out known but irrelevant edge cases is physically painful. This is a personal failing.
{% endnote %}

This means that we can look at the [ARIA spec](https://w3c.github.io/aria/#aria-activedescendant) to tell us the allowed uses and limitations of `aria-activedescendant` -- what roles it can be used in, authoring requirements, and other limitations.

Distilling the information in the spec, there are two patterns that support `aria-activedescendant`:

1. Patterns similar to a combobox, where focus remains on an editable region to enable typing while `aria-activedescendant` points to a related item, often an option in a popup listbox:

![screenshot of the Slack chat input with the text Help I'm writing about comboboxes again @, with a popup showing two matching people, Eric Bailey and Adrian Roselli, triggered by the at-symbol.](/writing/assets/chat-combobox.png)

2. [Composite widgets](https://sarahmhigley.com/writing/roles-and-relationships#basic-vs.-composite-patterns) like `tree` or `grid` can accept focus on their parent node, and have `aria-activedescendant` point to child `treeitem` or `gridcell` elements instead of managing focus between those child elements directly.

![Screenshot of a generic tree with placeholder item labels like level 2, item 1. The tree has a thick black focus outline around the entire thing, and one tree item is highlighted with a dark blue background and white text.](/writing/assets/tree-with-activedescendant.png)

I still have no idea why someone would choose to use `aria-activedescendant` for #2 in practice, but the important thing is that you _can_, I guess.

## How to use aria-activedescendant

The value of `aria-activedescendant` must point to the id of an element that is either:

1. a descendant of the composite widget that has `aria-activedescendant`:

```html
<div role="listbox" tabindex="0" aria-activedescendant="opt2">
  <div role="option" id="opt1">Otter</div>
  <!-- this is a descendant of the listbox, so it is OK -->
  <div role="option" id="opt2">Opossum</div>
  <div role="option" id="opt3">Ocelot</div>
</div>
```

2. a descendant of a composite widget that is ponted to via `aria-controls` on a `combobox`, `textbox`, or `searchbox` with `aria-activedescendant`:

```html
<input type="text" aria-controls="listbox" aria-activedescendant="opt2">
<div role="listbox" id="listbox">
  <div role="option" id="opt1">Otter</div>
  <!-- this is a descendant of the listbox, which is pointed to by aria-controls, so it is OK -->
  <div role="option" id="opt2">Opossum</div>
  <div role="option" id="opt3">Ocelot</div>
</div>
```

The value of `aria-activedescendant` should not point to some random element on the page, even when it is defined on a role that supports it:

```html
<!-- DON'T DO THIS -->
<input type="text" aria-activedescendant="button">
<!-- this is a random button, what is even going on here -->
<button id="button">nope</button>
```

Knowing that `aria-activedescendant` is an ARIA construct is helpful in one additional way: we can look at the [Core AAM spec](https://w3c.github.io/core-aam/#ariaActiveDescendant) (the accessibility API mapping spec for ARIA) to determine what is going on under the hood.

Since `aria-activedescendant` exists for the benefit of screen reader users, and accessibility APIs mediate most of the DOM-to-screen reader translation, looking at the API mapping can tell us a lot about the intended functionality of `aria-activedescendant`.

One small side note -- while `aria-activedescendant` is specifically for screen reader users, this is not true of all ARIA attributes, and also not true for all accessibility API mappings.

The mappings:
<div class="table-wrapper">
  <table class="table">
    <tbody>
      <tr>
        <th><abbr title="Microsoft Active Accessibility">MSAA</abbr> + IAccessible2 </th>
        <td>
          See <a href="https://w3c.github.io/core-aam/#focus_state_event_table">Focus Changes</a>.
        </td>
      </tr>
      <tr>
        <th><abbr title="User Interface Automation">UIA</abbr></th>
        <td>
          See <a href="https://w3c.github.io/core-aam/#focus_state_event_table">Focus Changes</a>.
        </td>
      </tr>
      <tr>
        <th><abbr title="Accessibility Toolkit">ATK</abbr>/<abbr title="Assistive Technology-Service Provider Interface">AT-SPI</abbr></th>
        <td>
          See <a href="https://w3c.github.io/core-aam/#focus_state_event_table">Focus Changes</a>.
        </td>
      </tr>
      <tr>
        <th><abbr title="macOS Accessibility Protocol">AX API</abbr></th>
        <td>
          See <a href="https://w3c.github.io/core-aam/#focus_state_event_table">Focus Changes</a>.<br>
          <span class="property">Property: <code>AXSelectedRows</code>: pointer to active descendant node</span>
        </td>
      </tr>
    </tbody>
  </table>
</div>

...

So, uh, about that second focus thing...

![A two-frame still of Pippin getting hit in the head with an apple after asking for second breakfast](/writing/assets/second-focus-hits.jpg)

Much like Pippin, those expecting a true second focus will still be disappointed.

## Why use focus vs. aria-activedescendant

The thing about ARIA is that it does not affect browser behavior or functionality -- only semantics and accessibility API mappings. All keyboard events will still fire on the true focused element, and there are no DOM methods to query the currently relevant active descendant in the manner of `document.activeElement`. The only context in which the active descendant behaves like a second focus is when it comes to a screen reader's virtual cursor.

Even for screen readers, `aria-activedescendant` is not entirely the same as a second focus. As an example, let's look at what happens if a Windows screen reader users toggles between [browse mode and forms mode](https://tink.uk/understanding-screen-reader-interaction-modes/) after navigating through elements using `aria-activedescendant` vs. focus:

- With factory settings, NVDA, Narrator, and JAWS all update keyboard focus to follow their virtual cursor when moving over focusable elements. This means that switching between browse mode and forms mode will usually keep you in the same place.
- Using NVDA or Narrator, the element identified through `aria-activedescendant` will not update to match the screen reader's cursor location. Switching between browse mode and forms mode may cause unintended side effects.
- JAWS is the one Windows screen reader to handle mode switching with `aria-activedescendant` gracefully.

Syncing the screen reader cursor and page focus is a little more complicated than even this list would imply, but in ways that are not directly relevant here.

### Automatic mode switching

One way in which `aria-activedescendant` is similar to focus is that the `role` of an active descendant will cause Windows screen readers to switch modes in exactly the same way that the `role` of a focused element does. For example, if you are using NVDA and are interacting with an input in forms mode, tabbing to a button will switch you to browse mode (unless you've disabled this behavior in user settings). By the same mechanism, if we bring back this cursed code:

```html
<input type="text" aria-activedescendant="button">
<button id="button">nope</button>
```

Updating `aria-activedescendant` to point to that button will also switch the user to browse mode. Subsequent keyboard interactions will thereafter be handled by NVDA instead of by the page, at which point the script updating `aria-activedescendant` in response to keyboard events will stop doing anything. This is the primary reason to avoid having `aria-activedescendant` point to elements that are not part of a composite widget like options in a listbox.

<figure>
  <img src="/writing/assets/combobox-load-more.png" alt="A screenshot of an open combobox with two options, group one and group two. Below the two options in the popup is a highlighted option with the text Load all results.">
  <figcaption>If your combobox's popup listbox has actions in addition to selectable options, you should still mark up the actions with <code>role="option"</code> to prevent unhelpful mode switching.</figcaption>
</figure>

Mobile screen readers will essentially ignore `aria-activedescendant`, since they move their cursor through the accessibility tree in response to touch input (simplifying a little here; mobile screen readers also support other types of input). This means that an iOS VoiceOver or Android Talkback user will generally swipe through all the options without the `aria-activedescendant` value changing at all. In some cases, this might be an issue for scrolling if items are also not focusable. If items are focusable, they will generally gain focus when the VoiceOver or Talkback cursor lands on them, natively triggering scroll when needed.

Also VoiceOver on Safari on macOS will ignore `aria-activedescendant` if you so much as look at it funny.

## When to use aria-activedescendant

Comboboxes.

![Once again: a very young child holds a camera backwards, staring confidently into the lens instead of the viewfinder. The caption says Nailed It.](/writing/assets/nailed-it.jpg)

OK but really -- I have not found a real-world use case for `aria-activedescendant` that does not also involve editing text.

Even in complex use cases of giant virtualized trees, data tables, tree grids, and SVG charts and graphs, managing keyboard focus ends up being simpler to implement and more robust. If anyone has a good example for needing `aria-activedescendant` outside of a combobox/editing scenario, I'd love to hear about it. I'm sure it exists in theory out there somewhere, presumably right next to a perfectly accessible combobox full of tooltips.

There are a few text editing use cases for `aria-activedescendant` beyond just comboboxes, however. Some examples include:

- Freeform search inputs that expand a popup of suggestions. I'd generally recommend against putting a `role=combobox` on a site-wide search for two reasons: comboboxes generally do not imply freeform input, and using that role might make the searchbox harder to find for screen reader users explicitly looking for edit boxes.
- @-mentions inside a chat input. This usually involves a floating listbox or menu anchored to your text insertion cursor. Focus remains in the chat input to enable continued typing, and `aria-activedescendant` makes the popup accessible. The entire pattern is very similar to a combobox, but without the combobox role.
- Any floating suggestions in a document canvas editing experience (not sure what to call this exactly). Think Google Docs, Word Online, website creation canvases, etc. You might have something like a spelling or grammar suggestions popup appear without pulling the user's focus away from where they currently are in the document.

Generally the theme is to consider `aria-activedescendant` in any use case where you need to some sort of immediately relevant supplemental actions related to current user text input.

## Where to use aria-activedescendant

The `aria-activedescendant` attribute must be defined directly on the element that has keyboard focus for the active descendant to be picked up by screen readers.

I know this was already covered in an earlier section, but I wasn't sure how else to shoehorn in a section on "Where".

## Who is aria-activedescendant

Truly we are all `aria-activedescendant`, at least in our hearts.

I'm not sure where I was going with this. I think this article might be losing focus.

---

Many thanks and apologies to [Eric Bailey](https://ericwbailey.design/) and [Adrian Roselli](https://adrianroselli.com/) for being kind enough to review this article ages ago when I first wrote it.