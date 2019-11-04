---
title: Playing with state
tags: post
date: 2019-11-01
summary: ""
---

**(a closer look at play/pause buttons)**

In an effort to convince everyone (who reads these blog posts) that I don't only obsess over tooltips, let's talk about another seemingly simple concept and make it unexpectedly complex. This time, we're tackling the play/pause toggle button.

By a play/pause toggle, I mean this thing:

![Screenshot of the youtube player with the play button highlighted. Maru is staring at a box in the backgroud.](https://user-images.githubusercontent.com/3819570/67927236-ff256480-fbaf-11e9-8aec-55a4353bfe5b.jpg)

i.e. that thing you click on (or key press/touch/switch/etc) to get your daily cute cat fix. You press it, it switches from a play icon to a pause icon, Maru jumps into a box, and bliss ensues.

That's where I barge in and ask about that middle part -- switching from play to pause -- and ruin it all (sorry Maru). The thing is, a play/pause button is effectively a [toggle button](https://inclusive-components.design/toggle-button/), by which I mean it switches between two binary states based on user interaction. The established pattern for accomplishing this is by updating the `aria-pressed` state attribute, which accepts a true/false value.

![two side by side bookmark buttons, one grey with aria-pressed set to false, and one blue with aria-pressed set to true](https://user-images.githubusercontent.com/3819570/67974752-ded6c380-fc0a-11e9-98a4-5024af40d294.png)

Play/pause buttons (and by extension, start/stop buttons) are the black sheep of the toggle button pantheon. They generally do not have any `aria-pressed` on/off state defined, and instead change their accessible name from "play" to "pause" when activated. When I say "generally," I mean this was true for the following sites, chosen for no other reason than that I happened to know they would contain media players:

* [Youtube](https://www.youtube.com/): dynamically changes `aria-label`
* [Mixer](https://mixer.com/): dynamically changes `aria-label`
* [Vimeo](https://vimeo.com/): dynamically changes name from contents (by swapping out labelled graphics)
* [Soundcloud](https://soundcloud.com/): dynamically changes both text content and the `title` attribute
* [WAI carousel tutorial](https://www.w3.org/WAI/tutorials/carousels/working-example/): dynamically changes text content
* ~~Twitter's media player~~: Twitter's media player actually has no accessible name and no state defined for its play button. Whoops.

So why does this matter? Traditional toggle buttons switch `aria-pressed` from true to false, and play/pause buttons change the calculated name from "play" to "pause." No big deal?

## Property vs. State

Most dynamic changes to a UI component (at least, changes that happen while a user is interacting with it) are communicated through state changes rather than property changes. The aria spec has this to say about [states vs. properties](https://www.w3.org/WAI/PF/aria/states_and_properties#statevsprop):

>  One major difference is that the values of properties (such as aria-labelledby) are often less likely to change throughout the application life-cycle than the values of states (such as aria-checked) which may change frequently due to user interaction. Note that the frequency of change difference is not a rule; a few properties, such as aria-activedescendant, aria-valuenow, and aria-valuetext are expected to change often.

This comes across as fairly similar to the use of states vs. properties in javascript application frameworks as well -- a common convention is that a change in application state will trigger a re-render, while a change to a property will not (unless manually triggered).

It might therefore seem reasonable to also expect a screen reader to pick up and announce state changes but not property changes. However, as with many things to do with aria, it is not that simple.

Some properties such as `aria-activedescendant`, `aria-valuenow`, and `aria-valuetext` can be expected to be announced by screen readers when changed (support issues aside). Some state changes (such as `aria-disabled`) are not consistently announced when changed. However, as a general non-binding rule of thumb, it is safer to assume that a change in state will be communicated than a change in property (and please never change a role during a user interaction).

Side note: when I say changes are announced by screen readers, I mean that a change to the element that currently has focus causes some sort of screen reader-generated feedback without the user moving focus.

Most screen readers nowadays rely on [Accessibility API](https://alistapart.com/article/semantics-to-screen-readers/) events to get notified of changes to the DOM. So for example, when `aria-pressed` updates from `true` to `false` a `PropertyChangedEvent` will fire, allowing a screen reader to listen to that event and react to it. Each platform's Accessibility API handles this slightly differently (`PropertyChangedEvent` is specific to [UIA](https://docs.microsoft.com/en-us/windows/win32/winauto/entry-uiauto-win32) on Windows), but the principal is roughly the same. This [list of state and property change events](https://w3c.github.io/core-aam/#mapping_events_state-change) details which states and properties should raise API events when changed. Not all of those states and properties will necessarily be communicated by all screen readers, but these are the ones that at least have a mechanism to do so.

All this is relevant since `aria-pressed` is a state, and the accessible name is a property.

## Name Changes

The conventional wisdom is to not change the name of a control while the user is interacting with it. It turns out this is pretty good conventional wisdom: upon testing, it turns out that while a name change is sometimes announced, it is not nearly consistent enough to be relied upon.

Using this [button code sample](https://jsfiddle.net/czsnj9xp/show), I tested whether name changes and `aria-pressed` changes were announced using the following screen reader/browser combinations, and using a few different methods of defining the accessible name:

<table class="support-table">
  <thead>
    <tr>
      <th></th>
      <th scope="col"><code>aria-label</code></th>
      <th scope="col"><code>aria-labelledby</code></th>
      <th scope="col">content</th>
      <th scope="col"><code>aria-pressed</code></th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">NVDA + Firefox</th>
      <td class="true">yes</td>
      <td class="false">no</td>
      <td class="false">no</td>
      <td class="true">yes</td>
    </tr>
    <tr>
      <th scope="row">NVDA + Chrome</th>
      <td class="true">yes</td>
      <td class="true">yes</td>
      <td class="false">no</td>
      <td class="true">yes</td>
    </tr>
    <tr>
      <th scope="row">NVDA + Edge</th>
      <td class="true">yes</td>
      <td class="true">yes</td>
      <td class="true">yes</td>
      <td class="true">yes</td>
    </tr>
    <tr>
      <th scope="row">JAWS + Firefox</th>
      <td class="false">no</td>
      <td class="false">no</td>
      <td class="false">no</td>
      <td class="true">yes</td>
    </tr>
    <tr>
      <th scope="row">JAWS + Chrome</th>
      <td class="false">no</td>
      <td class="false">no</td>
      <td class="false">no</td>
      <td class="true">yes</td>
    </tr>
    <tr>
      <th scope="row">JAWS + Edge</th>
      <td class="false">no</td>
      <td class="false">no</td>
      <td class="false">no</td>
      <td class="true">yes</td>
    </tr>
    <tr>
      <th scope="row">JAWS + IE 11</th>
      <td class="true">yes</td>
      <td class="true">yes</td>
      <td class="true">yes</td>
      <td class="true">yes</td>
    </tr>
    <tr>
      <th scope="row">Narrator + Edge</th>
      <td class="true">yes</td>
      <td class="true">yes</td>
      <td class="true">yes</td>
      <td class="true">yes</td>
    </tr>
    <tr>
      <th scope="row">iOS VoiceOver + Safari</th>
      <td class="true">yes</td>
      <td class="true">yes</td>
      <td class="true">yes</td>
      <td class="true">yes</td>
    </tr>
    <tr>
      <th scope="row">macOS VoiceOver + Safari</th>
      <td class="true">yes</td>
      <td class="true">yes</td>
      <td class="true">yes</td>
      <td class="true">yes</td>
    </tr>
    <tr>
      <th scope="row">Talkback + Chrome</th>
      <td class="false">no</td>
      <td class="false">no</td>
      <td class="false">no</td>
      <td class="true">yes</td>
    </tr>
  </tbody>
</table>

Side note: NVDA, you drunk?

## Actual Recommendations

You made it this far, congratulations! Time for some concrete recommendations. The big takeaway should be this:

**Change the name, but not the state, of play/pause buttons. Use state for all other toggle buttons.**

Why? First, because the mechanics of a play/pause (or start/stop) button are so well understood by now that immediate state change feedback is not critical.

This is combined with the fact that using `aria-pressed="false"` for a pause button would result in some variation of "play button off" to be read by screen readers, which is not particularly reflective of a visual pause icon. Creating a difference between the programmatic label and visual text (or icon) can cause issues for speech control users, sighted screen reader users, and effective communication between blind screen reader users and visual users (e.g. during a support call).

This one edge case does not take away the general recommendation to change the `aria-pressed` state, and not the name, for other toggle buttons. Toggle buttons that are part of less well-known interfaces would benefit more from providing immediate feedback, and the only reliable cross-screen-reader cross-browser way to do that is to use `aria-pressed`.

As a final note, never change both the name and `aria-pressed` state in tandem. That way, confusion lies. Just imagine trying to parse the meaning of "play button, on" vs. "pause button, off".

## Further Reading
* [Styled Toggle Buttons](https://scottaohara.github.io/a11y_styled_form_controls/src/toggle-button-switch/) from Scott O'Hara
* [Building Inclusive Toggle Buttons](https://www.smashingmagazine.com/2017/09/building-inclusive-toggle-buttons/) from Heydon Pickering
* [UWP Toggle Switch description](https://docs.microsoft.com/en-us/windows/uwp/design/controls-and-patterns/toggles): a Windows desktop toggle pattern, for reference