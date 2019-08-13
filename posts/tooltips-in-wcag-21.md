---
title: Tooltips in the time of WCAG 2.1
tags: post
date: 2019-08-10
summary: "A review of the history and current state of tooltip accessibility. AKA: everything you need to know before making a tooltip"
---

TL;DR recommendation: Narrow down your definition of "tooltip," and jump to [the last section](#best-practices-summary).

Tooltips have been a reliable source of web accessibility woes from the very beginning; or at least from the beginning of graphical web browsers. They have gone by many names: "tooltip," "infotip," "toggle tip," "hint text," "balloon help," "info bubble," "inaccessible overlay of shame"... the list goes on. No matter the name, the same core issues just keep popping up:

* How do keyboard users access the content?
* How do non-mouse pointers (e.g. touchscreens and eye trackers) access the content?
* How do blind and low vision users even know the tooltip is there, let alone read it?
* If (Internet Lords forbid) there is interactive content inside, how does one access it without accidentally dismissing the tooltip?
* How does a user with magnification software move their field of view without dismissing the tooltip?

## So why do tooltips have so many problems?

The first hint of a graphical tooltip on the web came in an [early draft of HTML](https://www.w3.org/MarkUp/draft-ietf-iiir-html-01.txt) when "title" appeared as an optional attribute on links with the following note:

> The browser software may chose to display the title of the document as a preliminary to retrieving it, for example as a margin note or on a small box while the mouse is over the anchor, or during document fetch.

At the time that spec was written, graphical [screen readers had already existed for over four years](https://en.wikipedia.org/wiki/OutSpoken). Now, 26 years in the future, we're doing a little bit better. The same inaccessible mouse-based `title` behavior exists, but at least the [latest version of the HTML spec](https://html.spec.whatwg.org/multipage/dom.html#the-title-attribute) explicitly calls out the accessibility problems while warning against using it. Also, [WCAG](https://www.w3.org/TR/WCAG21/) is a thing now. But back in the earlier days of the web, it was open season on defining experiences solely for sighted mouse users.

The [image tag was first proposed](http://1997.webhistory.org/www.lists/www-talk.1993q1/0182.html) by a browser representative (from Mosaic, since this happened in 1993) as [more of a notice than a suggestion](https://thehistoryoftheweb.com/the-origin-of-the-img-tag/). Although the alt attribute was included in the `img` specification from the very start, [practical support was slow](http://jkorpela.fi/html/alt.html#old) and for years screen readers and text-only browsers had no good way of communicating a graphic.

If the history of the image tag seems like an odd digression for an article about tooltips, the reason lies in what happened next: browsers began to actually implement the alt attribute, but they chose to [visually display it as a tooltip](http://jkorpela.fi/html/altshow.html#tooltip) just like the `title` attribute on links. Although `alt` still functioned as a text alternative, the tooltip implementation changed how website authors wrote alt text content. There are articles written about the [harmful effect of the tooltip treatment](http://jkorpela.fi/html/alt.html#tooltip) as well a [compilation of hilarious examples](http://www.alanflavell.org.uk//alt/alt-text.html#howlers) of real live alt text from that time (imagine image after image with the alt text "Click here!").

Although alt text no longer gets the tooltip treatment in any modern browser, looking back at that era illustrates a deeper issue with the tooltip implementation. From the very beginning, the design of a native tooltip has made it easy to create content solely for mouse users with good vision while forgetting about other types of interaction. The alt text tooltip directly demonstrated how easily that type of design can degrade the experience for everyone else. The continuing problems caused by the title attribute's non-inclusive tooltip have also been thoroughly documented (try this wonderfully comprehensive [24a11y article by Scott O'Hara](https://www.24a11y.com/2017/the-trials-and-tribulations-of-the-title-attribute/) for a start).

## Beyond the title attribute: what are tooltips now?

Usually "use native controls" is the mantra of accessibility professionals, so if the native tooltip is flawed all the way down to its very design, where does that leave designers and developers? The short answer is out in the rain without a popup overlay (or "umbrella" for those who live in the real world) for shelter. 

Before diving into the details of how to implement a custom tooltip, let's take a moment to define what a tooltip really _is_. Conventionally the term has referred to a purely visual treatment: text that appears in a small overlay on demand, usually when hovering over the thing it describes. This presents a problem when trying to create a specification for a consistent, accessible experience, since visual patterns do not always have a one-to-one relationship with interaction patterns.

_(Wait. What?)_

A major pitfall of approaching web design as a visual medium is conflating _visual_ patterns with _functional_ or _interaction_ patterns. One classic example of this is that the word "menu" in web UI has acquired both a broad, generic meaning as well as a specific and technical one. In what passes for casual conversation among web professionals, the word "menu" might refer to a set of links used as site navigation, the file/edit/etc. bar of actions along the top of most applications, or a list of appetizers printed on paper at a restaurant.

Leaving off that last one, keyboard and assistive tech users expect a navigation menu and traditional application menu to function differently: a navigation menu is a list of links that is tabbed through, and an application menu is a collection of menu items that are controlled by arrow keys and often shortcuts. One visual pattern, multiple interaction patterns. To go further down that particular rabbit hole, try this shot: [inclusive-components.design/menus-menu-buttons](https://inclusive-components.design/menus-menu-buttons/) followed by this chaser: [github.com/w3c/aria-practices/issues/353](https://github.com/w3c/aria-practices/issues/353).

_(Back to tooltips)_

Much like "menu," the word "tooltip" has come to mean nearly any small, non-modal overlay. While the most traditional use is to provide simple hint text for UI controls (tips for tools, after all), the same visual pattern could be used to display a text alternative for an icon button, a form error message, rich text content (e.g. bold text or a list), or even interactive content. Although all of these use cases could share the same base implementation if visual presentation and mouse interaction were all that mattered, the differences are important for accessibility for the following reasons (in order):

1. Hint text is purely supplemental, and should not override the existing accessible name for a control.
2. The text alternative for an icon button is its accessible name, and should be associated with the button accordingly.
3. Rich text formatting can not be conveyed through the usual means of associating hint text with a control (namely `aria-describedby`).
4. Interactive content within a popup introduces a whole new set of requirements. It must be easily discoverable by screen readers, follow a logical tab order, be easy to access without dismissing the tooltip and without relying on fine motor control.

There is no single DOM structure or javascript implementation that could fill all the requirements of even the few use cases mentioned here, so for the purposes of arriving at some sort of concrete recommendation, popups with rich or interactive content are not considered tooltips. Those patterns would benefit from using a [disclosure button pattern](https://www.w3.org/TR/wai-aria-practices-1.1/#disclosure) under the hood. Similarly, a tooltip-style popup that is not tied to an existing interactive control would also benefit from the disclosure pattern. This would prevent it from spawning a useless button purely for the purpose of introducing a tab stop for keyboard access.

With those out of the way, let's take a stab at writing a visually-agnostic spec for a tooltip. The rest of the article, particularly the accessibility recommendations, will assume that a tooltip fits the following definition:

> A "tooltip" is a non-[modal](https://www.w3.org/TR/wai-aria-practices-1.1/#dialog_modal) (or non-blocking) overlay containing text-only content that provides supplemental information about an existing UI control. It is hidden by default, and becomes available on hover or focus of the control it describes.

That definition could even be narrowed down even further by saying tooltips must provide only descriptive text -- essentially defining it as a custom, accessible version of the title attribute -- but all of the same interaction requirements apply whether the tooltip is used to display a name, description, or error message even if the semantics differ slightly.

## The accessibility requirements of tooltips

Tooltips must be discoverable and readable with a mouse, other pointer devices, keyboard, screen reader, zoom software, and any other assistive technology. They should provide relevant information that may be helpful to learn the UI, but is not required to operate it. Tooltips also should not block a user from performing any other task on the screen.

Not so complicated, right? Let's dive into some of the specifics, broken down into semantics, interaction, and content.

### Semantics

Meaningful semantics form the backbone of good HTML structure, and help screen readers and other assistive tech provide so many helpful shortcuts for moving around an interface. Headings are headings, links are links, accordions let you know if they are expanded or collapsed, and tooltips are... what exactly?

As described in detail earlier, tooltips can be used for a number of purposes. Even in our stripped-down definition, they could function as a name or a description, and the semantics would be different for each. The trick is to first decide what purpose the tooltip text has, and then assign semantics accordingly.

#### Descriptive tooltip semantics

For the most canonical tooltip purpose -- hint text -- the only two semantic additions are:
1. associate the tooltip trigger with the tooltip via `aria-describedby` and `id`
2. ensure the tooltip is unreachable when hidden via `aria-hidden`

A full HTML snippet for a sample text field asking for a name, with hint text in a tooltip follows. This HTML snapshot assumes the tooltip is in an open state.

``` html
<label for="name">Full Name</label>
<input id="name" type="text" aria-describedby="name-hint">
<div id="name-hint" aria-hidden="false">
  Please enter your given name followed by your family name
</div>
```

#### Label tooltip semantics

Using a tooltip as the accessible name is similar; instead of `aria-describedby`, the association would be made with `aria-labelledby`, and the tooltip container would not need `aria-hidden`. When the tooltip provides the name, it is also possible to drop `aria-labelledby` entirely and have the tooltip text be a child of the control (at least for controls that support children). The main caveat for the name use case is that UI controls should always have some sort of label visible. This technique would not replace the need for a visible label next to an input, for example. A good use would be to add a text alternative for icon buttons.

#### Semantics to avoid

There are certain attributes that are missing in the above descriptions that the more ARIA-conscious may have already noticed. In no particular order, these are some accessibility-related attributes that may seem relevant, but are not currently recommended:

* `role="tooltip"`: the unloved child of roles, this omission is perhaps the weirdest in an article specifically about tooltips. While it's not a _bad_ idea to add it to the tooltip element, it doesn't seem to do much good either. The `tooltip` role does not appear to affect screen reader announcements in any meaningful way -- `aria-describedby` and `aria-labelledby` do all the heavy lifting. If you do decide to add it, use it only for descriptive tooltips along with `aria-describedby`. There is more context in this Github thread: [github.com/w3c/aria/issues/979](https://github.com/w3c/aria/issues/979)
* `aria-haspopup`: although a tooltip may visually look like a popup, this attribute is for more interactive popups -- specifically only menus, listboxes, trees, grids, and dialogs are allowed in conjunction with `aria-haspopup`. Using a generic value of `aria-haspopup="true"` will be interpreted as if it were `aria-haspopup="menu"`. Since tooltips are not intended to be interacted with or navigated to, `aria-haspopup` should not be used to indicate a tooltip.
* `aria-live`: as the ultimate fallback for communicating any sort of dynamic page change, `aria-live` can be a tempting solution to complaints of tooltip text not being read by screen readers. Live regions have some significant drawbacks for tooltip use: they can not be reliably re-read by a screen reader user, they may interrupt other content (e.g. announcing the name of the control on focus), and a screen reader user can't opt out of hearing them. It's true that `aria-describedby` may or may not be announced depending on a number of factors including user-selected verbosity settings, but that is the desired behavior for hint text.

### Interaction

The interaction support for displaying, hiding, and reading the tooltip content is the same regardless of whether the tooltip is used for a control's name or description.

#### Focus and hover

The first step is to ensure that the visual display can be controlled by either a keyboard or a mouse. To do this, the tooltip should open on focus or mouse over, and closes on blur or mouse out. Combining pointer and keyboard events should not create multiple tooltips or other buggy behavior. Since the UI control associated with the tooltip presumably has some sort of default action on click/enter or space/input, those interactions are not available for use in displaying or hiding the tooltip. If the UI control does not perform any actions or accept user input, it probably shouldn't have a tooltip at all.

#### Pointer (lack of) access

Now that phone browsing has taken over, providing touch access has become imperative. This also benefits other users of other non-mouse pointer device such as eye trackers. Unfortunately, one of the major drawbacks to tooltips is that they are inaccessible to touch devices when attached to buttons or links. This is because hover is also unavailable and it is impossible to focus a button or link without activating it on a touch device. The same goes for other pointer-controlled assistive tech like eye gaze. There is currently no workaround, although tooltips on form inputs will still work as expected.

#### WCAG 2.1: dismissable, hoverable, and persistent

One of the rules added in the Web Content Authoring Guildelines (WCAG) update from 2.0 to 2.1 is the [1.4.13: Content on Hover or Focus](https://www.w3.org/WAI/WCAG21/Understanding/content-on-hover-or-focus.html) criterion. This new guideline expands the work required to make a compliant tooltip, but should make overlays in general significantly more accessible and less disruptive. WCAG 2.1 requires any content appearing on hover or focus to be dismissable, hoverable, and persistent.

To achieve those, a tooltip should:

* Hide when a keyboard user presses "Escape" (unless the tooltip will never overlap other content).
* Allow a mouse or pointer user to hide the tooltip, ideally through a close button (unless the tooltip will never overlap other content). The tooltip should not re-appear on subsequent hovers -- think of a zoom user trying to center their view on a specific area without the tooltip present and obscuring content.
* Allow a mouse user to move their mouse over the tooltip content without dismissing the tooltip -- ideally in a manner that does not require laser focus and precision mouse control.
* Remain in view until the user actively dismisses it, or it is no longer valid (e.g. if a loading tooltip appeared, then it could disappear after the content loaded).

### Content

Tooltips should only ever contain non-essential content. The best approach to writing tooltip content is to always assume it may never be read. As mentioned above, touch devices and other alternative pointers can't reach tooltips on buttons or links, and screen readers sometimes ignore descriptive text by default. It should be possible to infer how to use the UI without reading any tooltips. If that is not the case, it would be best to move all necessary content out of tooltips and into an area with more robust access.

In addition to writing only supplemental content, the following should also be true:

* **Write concise tooltip text.** Imagine someone on a small screen or with high zoom needing to pan around just to read the tooltip.
* **Avoid rich content.** Formatting such as bold text, italics, headings, icons, etc. will not be conveyed through `aria-describedby` or `aria-labelledby`.
* **No interactive content.** Any interactive content such as links or buttons should not be placed within a tooltip.

## Best practices summary

* Only interactive elements should trigger tooltips
* Tooltips should directly describe the UI control that triggers them (i.e. do not create a control purely to trigger a tooltip)
* Use `aria-describedby` or `aria-labelledby` to associate the UI control with the tooltip. Avoid `aria-haspopup` and `aria-live`
* Do not use the `title` attribute to create a tooltip
* Do not put essential information in tooltips
* Provide a means to dismiss the tooltip with both keyboard and pointer
* Allow the mouse to easily move over the tooltip without dismissing it
* Do not use a timeout to hide the tooltip

If this article leaves you hungry for more tooltip drama and intrigue, never fear. You can continue your journey into tooltip mastery by perusing any of the links under "Further reading." Also: get involved! Comment on this [W3C tooltip issue](https://github.com/w3c/aria/issues/979) with thoughts, questions, and concerns to influence the future of expected tooltip behavior.

### Code samples

There is a simple [Codepen example](https://codepen.io/smhigley/pen/KjoerX), also viewable without the code editors as a [full page pen](https://s.codepen.io/smhigley/debug/KjoerX). Scott O'Hara also has a much more comprehensive, documented [example on github](https://github.com/scottaohara/a11y_tooltips).

## Further reading:
* [www.24a11y.com/2017/the-trials-and-tribulations-of-the-title-attribute](https://www.24a11y.com/2017/the-trials-and-tribulations-of-the-title-attribute/)
* [ebay.gitbook.io/mindpatterns/disclosure/tooltip](https://ebay.gitbook.io/mindpatterns/disclosure/tooltip)
* [inclusive-components.design/tooltips-toggletips](https://inclusive-components.design/tooltips-toggletips/)
* [a11yproject.com/posts/title-attributes](https://a11yproject.com/posts/title-attributes/)
* [developer.paciellogroup.com/blog/2013/01/using-the-html-title-attribute-updated](https://developer.paciellogroup.com/blog/2013/01/using-the-html-title-attribute-updated/)