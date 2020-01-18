---
title: <select> your poison
tags: post
date: 2020-01-03
summary: "The omnibus guide to understanding and making select components and comboboxes"
---

I've been thinking, testing, and talking about custom select components and comboboxes a lot over the past year, and finally condensed all of it into a two-part series of articles written for [24 Accessibility](https://twitter.com/24accessibility). It covers both why this whole mess is so difficult and what patterns are out there, including the new ARIA 1.2 pattern in part 1, and then goes into the results of usability testing and concrete implementation recommendations in part 2.

1. Part 1: [24a11y.com/2019/select-your-poison](https://www.24a11y.com/2019/select-your-poison/)
2. Part 2: [24a11y.com/2019/select-your-poison-part-2](https://www.24a11y.com/2019/select-your-poison-part-2/)

The end result is a set of three recommended implementations for a select-only or read-only `<select>` variant, an editable combobox, and an editable multiselect combobox. While I highly recommend reading the recommendations in the context of the second article to get the nuances of why choices were made and what other options there are, here's the quick cheat sheet:

The links each go to a github repository of web components written using [StencilJS](https://stenciljs.com/) and Typescript. There is a [Codepen implementation](https://codepen.io/smhigley/pen/gObMVzv) with all three implementations written in vanilla JS.

1. [Select-only combobox](https://github.com/microsoft/sonder-ui/tree/master/src/components/select)
2. [Editable combobox](https://github.com/microsoft/sonder-ui/tree/master/src/components/combobox)
3. [Multi-select](https://github.com/microsoft/sonder-ui/tree/master/src/components/multiselect)

## More Links

For anyone who would like to play around with all the select component variations tested for this article, they can be found in three separate codepens here:

1. [All select-only variations](https://codepen.io/smhigley/pen/JjoKgxb)
2. [All editable combobox variations](https://codepen.io/smhigley/pen/BayzXbO)
3. [All multi-select variations](https://codepen.io/smhigley/pen/GRgjRVN)

Finally, the environments for the two usability studies that were run with disabled participants are available here:
1. [Main combobox study](https://select-study-epxfpuejic.now.sh/studies/combobox)
2. [Additional mini ARIA 1.2 study](https://select-study-epxfpuejic.now.sh/studies/combobox-apg)