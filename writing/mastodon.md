---
title: An oversimplified guide to setting up Mastodon
tags: post
date: 2022-11-12
summary: "A very simple step-by-step guide to creating a Mastodon account, with a focus on accessibility."
---

This is a guide for anyone who, like me, is casting about for alternatives to Twitter and would like an absolute minimum, bare-bones walkthrough for getting started with Mastodon. No evangelizing or attempted explanations of the "fediverse" will be involved.

> **Disclaimer:** although I made an account years ago, I never used it until now. I'm not interesting in convincing anyone to use Mastodon, or to leave Twitter. Do what works for you, in this hellscape of the 2020s.

## Getting started

I will do my best to fully describe the steps with semantic accuracy for anyone using a screen reader, or anyone struggling with some of the contrast issues present on the site. If you run into any specific issues creating an account that are not covered here and want to share info, DM me.

### Step 1: Pick a server

This can sound daunting, since there are so many options. Don't overthink it -- you can move your account later without losing followers. You can also follow anyone on any server, and search for people across all servers.

Here are four options, primarily geared towards folks in the web accessibility or disability communities:

1. A big general server like [mastodon.social](https://mastodon.social/explore) or [mas.to](https://mas.to/explore): these are large enough and old enough to be reliable. The drawback is they're so large that the server-specific "Local" feed isn't going to be helpful.
2. [toot.cafe](https://toot.cafe/explore): a number of web and accessibility people are on here. Slightly smaller, and as of writing is not accepting new users (though that may easily change, it's a weird time right now).
3. [a11y.info](https://a11y.info/explore): a very small server with almost exclusively web accessibility folks. Run by [Michael Spellacy](https://a11y.info/@spellacy).
4. [dragonscave.space](https://dragonscave.space/explore): another very small server, run by a blind admin ([Talon](https://dragonscave.space/@talon)). Lots of blind folks and accessibility experts on here. If you're looking for advice on using Mastodon with a screen reader, there are almost certainly people who can help on this instance.

If you're not happy with those, you can browse a list of servers on [joinmastodon.org](https://joinmastodon.org/servers) or, I dunno, ask someone else for recommendations.

### Step 2: Sign up

If you're already using an app, you can probably sign up through there. If not, go to the `/about` path of the server you've picked, or use one of the following links for the servers I listed earlier:
- [mastodon.social signup](https://mastodon.social/about) (not accepting new users as of writing)
- [mas.to signup](https://mas.to/about)
- [toot.cafe signup](https://toot.cafe/about) (not accepting new users as of writing)
- [a11y.info signup](https://a11y.info/about)
- [dragonscave.space signup](https://dragonscave.space/about/)

When you do this on a server accepting new users, you will encounter one of a two things:

1. A page with a heading for the name of the server, immediately followed by a form with four fields and a checkbox.

![The Dragon's Cave signup page linked above, with a heading of the server name, to the left immediately after the heading is the signup form described below; to the right is a login form, followed by a brief text description of the server.](/writing/assets/mastodon-account-form.png)

The fields are:
- Username
- Email address
- Password
- Confirm password
- A checkbox to confirm that you agree to server rules and terms of service (the exact wording can vary by server)

Some servers may have additional custom fields. There is a large button with the text like "Sign up" or "Request an invite" immediately following the checkbox.

> Warning for people using screen readers: when a server is not accepting new users, the fields in the sign up form are not disabled. Before you begin filling out the form, verify that the submit button has a label like "sign up" or request an invite", and not "X server is not accepting new members".

2. Some servers ask you to agree to terms and conditions before signing up. For these servers, you might not reach the form directly. Look for a "Create account" link. It is in different places on desktop vs. mobile:

![Screenshot of the desktop version of the mas.to signup page linked above, with a presentational banner image of the mas.to logo above a heading of the server name. The Create Account button is in the left sidebar under the sign in button. It is effectively at the end of the page and not under any headings.](/writing/assets/mastodon-create-account-btn.png)

![Screenshot of the mobile version of the mas.to signup page. The button is in the site header immediately after an image link to mastodon and the sign in button. It is the third interactive element on the page.](/writing/assets/mastodon-create-account-mobile.png)

After agreeing to any server-specific terms, you should reach the same form described earlier.

### Step 3: Email confirmation

After submitting the form, you should receive an email with a title like "Mastodon: Confirmation instructions for [server name]".

Follow the "Verify email address" link, and you should get to your new profile.

### Step 4: You have an account, and can follow people!

You can use the very low-contrast search field to find people across all of Mastodon (not just your server) It's at the top of the left sidebar on desktop, or under an magnifying glass icon button labelled "Search" on mobile.

![Screenshot of the left sidebar on the web client at a desktop width. The input has a label of Search, and is the first form field on the page. Below it are links for your profile and the textarea to create a new post, with the label, What's on your mind](/writing/assets/mastodon-search.png)

Here's a list of web a11y people I think are worth following to start out (not comprehensive, I haven't been here long myself and I'll probably keep adding to it, if I remember). Eric Eggert has a longer and better-curated list in his very good [article on accessibility in the fediverse](https://yatil.net/blog/accessibility-in-the-fediverse-and-mastodon).

In no particular order:
- Me! I'm here :) [@codingchaos@vis.social](https://vis.social/@codingchaos)
- Frank Elavsky [@frankelavsky@vis.social](https://vis.social/web/@frankelavsky)
- Léonie Watson [@tink@front-end.social](https://front-end.social/@tink)
- Scott O'Hara [@scottohara@mastodon.social](https://mastodon.social/@scottohara)
- Adrian Roselli [@aardrian@toot.cafe](https://vis.social/web/@aardrian@toot.cafe)
- Eric Bailey [@ericwbailey@front-end.social](https://front-end.social/@ericwbailey)
- Sam Kapila [@samkap@front-end.social](https://vis.social/web/@samkap@front-end.social)
- Sara Soueidan [@SaraSoueidan@front-end.social](https://front-end.social/@SaraSoueidan)
- Alice Boxhall [@sundress@mastodon.social](https://mastodon.social/@sundress)
- Eric Wright [@ewaccess@mastodon.social](https://mastodon.social/@ewaccess)
- Chancey Fleet [@ChanceyFleet@mas.to](https://mas.to/@ChanceyFleet)
- Doug Schepers [@shepazu@mastodon.social](https://mastodon.social/@shepazu)
- Crystal Preston-Watson [@ScopicEngineer@mstdn.social](https://mstdn.social/@ScopicEngineer)

### Step 5 (optional): Find an app

There is an official Mastodon app available for Apple and Android, with links to both in the [JoinMastodon apps page](https://joinmastodon.org/apps). There is also a list of alternative apps further down the same page, under the "Browse third-party apps" header.

I have no personal recommendations, but have anecdotally heard good things about Toot! (paid), and that some blind folks have been able to use [Tweesecake](https://tweesecake.app/) on Windows and macOS.

If I find out more info, especially on clients with good contrast, distraction-related settings, and animation prevention, I'll update here.

## Coda: some resources
- [Fedi.tips](https://fedi.tips/): an unofficial and non-technical guide to using Mastodon. Has some really good tips, and some basic accessibility info.
- [Eric Eggert's Mastodon a11y post](https://yatil.net/blog/accessibility-in-the-fediverse-and-mastodon): includes a long list of web accessibility people to follow
- [A screen reader guide to Mastodon](https://www.starshipchangeling.net/mastodon/): note -- this may have some info that is out of date, at least regarding the web interface.
- [How Mastodon search works](https://midrange.tedium.co/issues/how-mastodon-search-works/) -- also goes into why it works the way it does, despite seeming unclear when coming from Twitter
- There are some good tips in [this twitter thread](https://twitter.com/LFLegal/status/1586876400262414339?s=20&t=sRhxsBY66HV7a9NrvQlk8Q) from Lainey Feingold, and the [original tweet from Haben Girma](https://twitter.com/HabenGirma/status/1586829640827404288)

---

That's it! I'll probably keep my account on twitter till the bitter end, but I hope the wonderful people who have stitched together a community on the bluebird hellsite will still have a place to gather in the coming years, on Mastodon or elsewhere.


