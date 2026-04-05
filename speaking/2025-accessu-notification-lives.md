---
title: The Many Lives of a Notification
tags: talk
date: 2025-05-13
conf: Access U
slides: https://smhigley.github.io/slides/have-a-notification/#/
video: 
url: https://knowbility.org/programs/john-slatin-accessu-2025/the-many-lives-of-a-notification
---

Live regions are one of the most powerful tools for improving screen reader accessibility in web applications. Still, when used incorrectly, they can turn an otherwise good experience into a completely unusable mess. They are fragile and full of undocumented nuances and gotchas, intimidating for the initiated and frustrating for those who regularly deal with them.

How do you make toast notifications work for people using screen magnification software? Why does this one error message stubbornly refuse to work with VoiceOver, even though it's fine with NVDA? How can you tell if you made a mistake, or the browser or screen reader did?

We’ll examine when and why to use or not use notifications, how to build robust live region implementations, and how to debug them. We’ll also review some specific examples, including form errors, loading updates, and announcements in a simple chat application.