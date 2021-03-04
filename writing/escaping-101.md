---
title: Escaping 101
tags: post
date: 2019-10-11
summary: "Did you ever want to escape from the humdrum confines of daily life, but weren't sure how? Focus on this article, and learn how to escape a whole plethora of situations! (results not guaranteed, may have unintended side effects)"
---

Earlier this week when filling out an expense report -- a tedious chore that nearly everyone wishes would be over roughly five minutes before starting -- I got about halfway through before inadvertently deleting all my progress and forcing myself to start over.

Why? I had used the escape key to collapse a select menu, and ended up closing the modal dialog containing the entire expense form instead. This happened because the select menu really should have been a `<select>`, but wasn't. Instead it was a custom dropdown, and whoever made it remembered that dropdowns should dismiss on escape, but didn't test that behavior in context. So of course, being an a11y-focused developer, my immediate response was to put off finishing the expense report and start writing a blog post about the escape key instead.

## Why escape?

When starting out on the long, pothole-ridden journey to better keyboard accessibility, the three most common pit stops along the road (the Shell, BP, and Chevron, if you will) are Enter/Space, arrow keys, and escape. There are other keys, of course -- Home, End, PageUp, PageDown all make appearances as the occasional drive-through coffee stand or 2am IHOP.

Then there are [accesskeys](https://webaim.org/techniques/keyboard/accesskey), the weird roadside attractions of accessibility: you periodically see signs for them, but almost never actually visit. In the general run of things, however, a developer working on custom keyboard handling for the web will generally spend the most time on these keys:

* [Enter or Space](https://marcysutton.com/links-vs-buttons-in-modern-web-applications): perform the primary action of the control.
* Arrow keys: move focus to the previous or next control, when appropriate.
* Escape: exit the current context.

Enter, Space, and arrow keys are all fairly predictable. By that I mean it is very rare to encounter uncertainty from either the developer or the user around what should happen when the spacebar is pressed.

...and please don't come at me with your split buttons or selectable editable tree items, write your own article ;)

This is a slight oversimplification, but: some combination of enter and space perform the primary action of the currently focused control, and arrow keys shift focus in one or two dimensions.

Escape, on the other hand, is a little trickier. It has become an all-purpose "get me out of here!" key; something like `array.pop()` but for UI contexts.

## When should you escape?
(Or: what do I mean when I say "UI context"?)

### Part 1: Overlays

In its simplest incarnation, a new context is created when an overlay opens and fully or partially covers some other stuff (technical term) in the same window. When this happens, escape should allow the user to return to their previously un-obscured view. Almost all of the definitions of escape-based interactions in the [Aria Authoring Practices](https://www.w3.org/TR/wai-aria-practices-1.1/) fall in this bucket:

* [Combobox](https://www.w3.org/TR/wai-aria-practices-1.1/#combobox)
* [Modal dialog](https://www.w3.org/TR/wai-aria-practices-1.1/#dialog_modal)
* [Menu](https://www.w3.org/TR/wai-aria-practices-1.1/#menubutton)
* [Tooltip](https://www.w3.org/TR/wai-aria-practices-1.1/#tooltip)

A few more overlays you may find yourself needing to escape from:

* Slidepanes
* Non-modal dialogs (e.g. [disclosure buttons with popups](https://www.w3.org/TR/wai-aria-practices-1.1/examples/disclosure/disclosure-navigation.html))
* Custom context menus

Generally overlays are pretty easy to recognize. Anything that appears on top of the regular flow of the document, whether [modal or non-modal](https://www.nngroup.com/articles/modal-nonmodal-dialog/), interactive or not, counts as an overlay and should be easy to dismiss. See the [WCAG 2.1 content on hover or focus](https://www.w3.org/WAI/WCAG21/Understanding/content-on-hover-or-focus.html) criterion, or my earlier [long tooltip ~~ant~~ article](https://sarahmhigley.com/writing/tooltips-in-wcag-21/) for more context on why.

### Part 2: Tab traps

 The most common example of a tab trap was already covered in the previous section -- the modal dialog. However, there are other examples of UI elements that block tabbing without visually breaking the page flow:

* A rich text editor or code editor: tabbing within these inserts an actual tab character, so there needs to be another way of exiting and moving past them.
* Too many tab stops: counter-intuitively, too many focusable items can also effectively block keyboard navigation. Imagine a table with 50 rows and a few interactive items per row; it would take a lot of patience to get through 100+ tab stops. A [skip link](https://a11yproject.com/posts/skip-nav-links/) at the beginning would help someone who wants to bypass the table entirely, but not someone who wants to browse through the table's data and then either return to the beginning of the table (maybe there are filters or other controls there), or skip past remaining rows.

### Part 3: Cancel changes

This category of escapable contexts has nothing to do with page navigation, and everything to do with editing content. Any interface that allows the user to switch between reading and editing (like a cell within an editable grid) should provide the option to cancel all changes and return to the read mode at any point when editing.

If edit mode vs. read mode is a full page change (for example, the github gist editor), then a cancel button makes more sense than escape for switching back to read mode. However, for in-place edits (for example, changing a single cell within an editable grid) it makes sense to allow the user to hit escape to cancel and return to read mode.

## So you've escaped. Now what?
(Or: where should focus go next?)

Some popups like combobox menus and tooltips never take focus, so no active focus handling needs to occur when they are dismissed.

Other popups should take focus when opened -- modal dialogs, modal slidepanes, some menus -- and should send focus back to the element that originally opened the popup when closed. If that element no longer exists, it gets a bit trickier. The ARIA Authoring Practices Guide has a [long note on focus handling when closing modals](https://www.w3.org/TR/wai-aria-practices-1.1/#h-note-7). The short version is: take a second to think about where the user would expect to be, and send focus there.

> ![still frame of the nope octopus meme](/writing/assets/nope-octopus.jpg)
> Start by putting yourself in your users' frame of mind

It's also possible to put focus in different places depending on how a modal is closed: for example, a modal form that creates a new table row may move focus to that row when submitted. Even if this type of logic exists, closing via escape should take the user back to the original trigger button.

Our third category, non-modal tab traps, are a little harder. Escape should jump the user out of the tab trap but there's no obvious place to put focus, and the user shouldn't end up immediately re-entering the tab trap on the next tab or shift + tab. There's no way of knowing whether the user intends to move forwards or backwards after exiting, so you can't simply place focus before or after the trap. Combining escape with a skip link can be a powerful workaround, which is what this [grid example](https://www-nzgzcsougj.now.sh/studies/grid/simple-actions) does.

## Handling conflicts when escaping
(stopPropagation: Just Do It™)

When handling escape key event listeners within an application, it's important to always stop the event from propagating. This prevents multiple nested components from all trying to respond to the same escape, so a user trying to dismiss a toolitp or combobox menu within a modal won't accidentally close the modal (thus bringing us back to the original modal that kicked all this off). A well-placed `event.stopPropagation()` would have prevented that original bug.

A good rule of thumb when coding UI components is if you ever write a listener for a key event and do anything at all in response to the escape key, then also stop event propagation.

Example:
```javascript
myCombobox.addEventListener('keydown', function(event) {
  if (event.key === 'Escape') {
    myCombobox.close();
    event.stopPropagation();
  }
});
```

### External conflicts

It's uncommon for web apps or websites to ever run into a situation where custom escape handling might interfere with native platform behavior, but when testing with Windows screen readers it's good to know that the first escape press might cause a switch from [application mode to browse mode](https://tink.uk/understanding-screen-reader-interaction-modes/). If this happens, the event may or may not be sent to the DOM as well -- NVDA does not send a keyboard event to the DOM when switching modes, but JAWS does. This is worth remembering, since it is entirely possible for a JAWS user to accidentally dismiss a popup when intending to switch modes. The only real workaround to this is to make escaped contexts easily recoverable -- modals and dropdowns can be re-opened, and tab traps can be re-entered. Ideally something like a modal form would either save user input if closed and re-opened or, even better, live within its own separate page.

## Final Thoughts

Escape has been used to do some weird things in native applications. In Internet Explorer, escape will clear a text input; same in Microsoft Outlook for Windows and File Explorer. Browser URL bars in Windows and MacOS will not only clear input but also restore the current URL on escape. On Windows, escape lets you exit the application menu and takes you back to whatever last had focus. Pressing escape in the chat window of Microsoft Teams jumps you to the most recent message. And there are certainly more escape oddities out there, waiting to be discovered.

While many of those seem uninituitive to me, they may make sense to someone else. When venturing off the beaten path of documented patterns and simple escape behavior, the ultimate test is always a well-rounded usability study and real-world feedback.

In the meantime, check out [the grid example page](https://www-nzgzcsougj.now.sh/studies/grid/simple-actions) for a practical example containing several different uses of escape.

Now to finish that expense report...