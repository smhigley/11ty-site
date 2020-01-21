---
title: Roles and relationships
tags: post
date: 2020-01-21
summary: "Menus, trees, and grids, oh my! Debugging composite widget semantics with browser devtools."
---

Sometimes after dabbling in gateway ARIA semantics like `aria-current`, landmark roles, and link-button hybrids, a budding accessibility practitioner might find themselves experimenting with more serious roles like `menu`, `listbox`, or even `treegrid`. These are tantalizing, powerful patterns that allow you to create experiences that are not supported by only vanilla HTML. Unfortunately, they are also brittle; even small mistakes in using these roles can take a user on a very bad trip.

Talk to your kids about ARIA before it's too late.

## Basic vs. composite patterns

Composite widget patterns like trees and grids differ from basic controls in both expectations for keyboard behavior and semantic structure. Re: keyboard interaction, they generally contain multiple interactive elements, but are only one stop in the tab order. [Custom key handling](https://w3c.github.io/aria/#managingfocus) (primarily arrow keys) is required to provide access to all interactive descendants of the container widget.

Composite widgets also have much more rigid requirements for semantic structure. While a button or a checkbox will have rules regarding what ARIA states and properties they support, they function as single isolated interactive elements. A composite widget role will also determine the allowed roles, states, and properties of its descendants. For instance, a tablist must contain only tabs, and those tabs must be its direct children. In contrast, a set of links within a navigation region could be marked up with or without a list, or four levels deep in divs without interfering with parsing the semantics of either the navigation region or the links.

We're not going to spend any time here on when and why to use a composite widget role over a group of simple interactive elements, though that is certainly an important discussion to have. Instead, let's dive straight into the accessibility tree.

### The Accessibility tree: a quick definition

The accessibility tree is an internal browser construct that is used as an intermediate step between converting the DOM into the low-level [accessibility APIs](https://alistapart.com/article/semantics-to-screen-readers/) that screen readers (and potentially other assistive tech) consume. It is also currently distinct from the [Accessibility Object Model (AOM)](https://www.24a11y.com/2019/web-components-and-the-aom/), which is a proposed spec for an API similar to the DOM.

The per-browser instructions for inspecting the accessibility tree are below:
- [Chrome and Chromium Edge](https://developers.google.com/web/tools/chrome-devtools/accessibility/reference#pane)
- [Firefox](https://developer.mozilla.org/en-US/docs/Tools/Accessibility_inspector)
- [Safari](https://support.apple.com/guide/safari-developer/view-node-properties-for-a-dom-node-dev160f70435/mac)

Since the accessibility tree is an internal browser abstraction, there are some minor differences between browsers. For example, a plain `<div>` is represented as a `GenericContainer` in Chrome, and a `section` in Firefox. Still, the differences are minor and all implementations allow you to inspect which nodes exist in the accessibility tree, as well as check their calculated names, roles, values, states, and properties.

<figure>
  <img src="/writing/assets/chrome-a11ytools.png" alt="Chrome Elements inspector showing accessibility information about a list on a blog post on this site">
  <figcaption>Chrome shows a subset of the accessibility tree in the Elements pane when inspecting DOM nodes</figcaption>
</figure>

<figure>
  <img src="/writing/assets/firefox-a11ytools.png" alt="Firefox accessibility inspector pane showing the same list">
  <figcaption>Firefox has a separate devtools pane showing the entire accessibility tree</figcaption>
</figure>

I personally prefer the Firefox Accessibility inspector, since it allows you to pick nodes from the rendered page and walk the entire accessibility tree, much like inspecting the DOM in the Elements pane.

## Relationships between nodes

Composite widgets like listbox, grid, tree, etc. rely on strict parent/child and sibling relationships between accessibility nodes 
to communicate calculated information about those relationships to screen reader users. Information like item position within a list, column and row information in a table or grid, and level information in a tree may be missing or incorrect if node hierarchy is not properly defined. The practical impact varies based on browser and screen reader.

Inserting an extra `<div>` between a table element and a row, or a row and a table cell, can break screen reader shortcuts, column header/row header/cell association, and indexing of columns and rows. This is easy to debug by inspecting the table's generated accessibility tree in the Firefox devtools accessibility pane:

<figure>
  <img src="/writing/assets/table-incorrect-semantics.png" alt="accessibility pane in Firefox devtools showing a broken table structure">
  <figcaption>Grid and row nodes are separate by extra section nodes caused by <code>&lt;div&gt;</code> elements in the DOM</figcaption>
</figure>

<figure>
  <img src="/writing/assets/table-correct-semantics.png" alt="devtools accessibility tree showing a clean table structure">
  <figcaption>No non-grid roles are present between grid/row/cell roles</figcaption>
</figure>

### All composite widget roles
Here's a list of all roles that require specific parent/child relationships to function correctly (as of ARIA 1.2):
- `combobox` - `listbox` - `option` (this one is slightly different, see the [combobox post](https://sarahmhigley.com/writing/select-your-poison/) for specifics)
- `grid` - `caption` (optional, must be first child if used) / `rowgroup` (optional) - `row` - `gridcell` / `columnheader` / `rowheader`
- `listbox` - `group` (optional) - `option`
- `menu` / `menubar` - `group` (optional) - `menuitem` / `menuitemcheckbox` / `menuitemradio`
- `radiogroup` - `radio`
- `tablist` - `tab`
- `tree` - `group` (optional) - `treeitem`
- `treegrid` - `rowgroup` (optional) - `row` - `gridcell` / `columnheader` / `rowheader`

These document structure roles are not interactive, but also rely on a strict semantic hierarchy:
- `associationlist` - `associationlistitemkey` / `associationlistitemvalue`
- `feed` - `article`
- `figure` - `caption` (optional, must be first or last child)
- `list` - `listitem`
- `table` - `caption` (optional, must be first child if used) / `rowgroup` (optional) - `row` - `cell` / `columnheader` / `rowheader`

### Looking up correct semantics

The [ARIA spec](https://w3c.github.io/aria/) details which roles need specific parent or child relationships, though it's easy to miss. When looking up the documentation for a role, check for entries for [Required Owned Elements](https://w3c.github.io/aria/#mustContain) and [Required Context Role](https://w3c.github.io/aria/#scope) in the role's Characteristics table. If present, the role in question must be the direct child of a required context role, and its own children must have one of the roles in required owned elements.

For example, the entry for [grid](https://w3c.github.io/aria/#grid) notes that it can either have `row` or `rowgroup -> row` as required owned elements. Follow those links, and you can piece together what the role heirarchy should be:

- `grid`
  - optional: `caption`
  - optional: `rowgroup`
    - `row`
      - optional: `rowheader`
      - optional: `columnheader`
      - `gridcell`

## Fixing an incorrect accessibility tree

A few techniques for repairing accessibility tree issues, once found.

### 1. Fix the DOM hierarchy

No ARIA is always the best ARIA. If it's possible to make the DOM structure match the desired accessibility tree structure, that is always the best and most robust solution.

### 2. `role="presentation"` or `role="none"`

Sometimes it isn't possible to alter the DOM structure, whether because of styling needs, support requirements, or use of external UI libraries. In those cases, it can be possible to clean up the accessibility tree through the judicious use of `role="presentation/none".

For example, the following broken tree structure:

``` html
<ul role="tree">
  <div class="item-wrapper">
    <li role="treeitem">
      Item 1
      <div role="group">
        <ul class="sub-items">
          <li role="treeitem">Sub-Item 1</li>
          <li role="treeitem">Sub-Item 2</li>
        </ul>
      </div>
    </li>
    <li role="treeitem">Item 2</li>
    <li role="treeitem">Item 3</li>
  </div>
</ul>
```

Could be modified to work as follows:
``` html
<ul role="tree">
  <div class="item-wrapper" role="presentation">
    <li role="treeitem">
      Item 1
      <div role="group">
        <ul class="sub-items" role="presentation">
          <li role="treeitem">Sub-Item 1</li>
          <li role="treeitem">Sub-Item 2</li>
        </ul>
      </div>
    </li>
    <li role="treeitem">Item 2</li>
    <li role="treeitem">Item 3</li>
  </div>
</ul>
```

You can try inspecting both in the browser in [this JSFiddle](https://jsfiddle.net/3yd0guk8/).

Note that `role="presentation/none"` is only required on elements that come _between_ composite widget roles. It would not be necessary to add an extra role to a `<div>` that is a child of `treeitem`, or parent of `tree`.

The two roles, `presentation` and `none`, are synonyms. As of writing, `presentation` has better support, so is slightly preferable over `none`.

### 3. `aria-owns`

Using `aria-owns` to point to the `id` of another element entirely separated in the DOM will establish a programmatic parent/child relationship between the two nodes in the accessibility tree. 

### 4. `display: none` and `visibility: hidden`

CSS can sometimes affect the accessibility tree. Two examples are `display: none` and `visibility: hidden`, both of which will remove a node and all its descendents from the accessibility tree, hiding it from all users equally. If this is not desired, there are [CSS techniques to visually hide content](https://www.scottohara.me/blog/2017/04/14/inclusively-hidden.html) while keeping it accessible to screen readers.

## Common (ish) Misconceptions

1. `role="presentation"` is not `aria-hidden="true"`

Applying `aria-hidden` to an element will remove that element and all its descendants from the accessibility tree entirely, while `role="presentation/none"` will only remove the element's default role. Both `role="presentation/none"` and `aria-hidden="true"` will have the same effect on an `<img>` tag, but not on an element with content or children.

2. `aria-controls` is not `aria-owns`

Even though the combobox pattern has swapped out `aria-owns` for `aria-controls`, the two are not interchangeable elsewhere. `aria-owns` will establish a parent-child relationship between the root node and the referenced node (though reading order will still follow DOM order). `aria-controls` is a bit more abstract, and has little to no practical impact; only use it for comboboxes, or optionally when the ARIA spec explicitly says it should be used.