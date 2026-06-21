---
title: "I'm Not Building DayPlan, So Here Are the Activities"
slug: im-not-building-dayplan-so-here-are-the-activities
content_type: lab
summary: "I started building a parent activity-planning app, decided the product shape probably did not make sense, and salvaged the useful bit: 200 free at-home activities."
date: 2026-06-21
draft: false
tags:
  - projects
  - parenting
  - agents
---

I made a couple of hundred at-home activities for children while building an app idea called DayPlan. I am probably not going to keep building the app, but the activities are still useful, so I have put them here:

[Browse the at-home activities](/activities/)

They are free, searchable, and do not need an account. You can filter by age, rough duration, and whether the activity is indoor or outdoor. Most have materials lists and illustrated steps.

The app they came from was much more ambitious than that. DayPlan was meant to help parents discover, plan, and schedule activities for their children. It had the beginnings of child profiles, calendars, materials, tickets and passes, local activity discovery, contributions, moderation, and generated at-home activities.

I still think there was something in the idea. I just do not think the product shape made sense for me to keep pursuing.

## The Original Shape

DayPlan started as an activity planner for parents.

The basic problem was familiar enough: you have children, a weekend or school holiday coming up, and a vague feeling that you should probably do something more deliberate than asking everyone what they want to do at 10am while the day is already slipping away.

The app was going to help with that. It was not just a static list of ideas. The plan included child profiles, age-appropriate activities, a calendar, materials you already had at home, tickets and passes, local day trips, scheduling constraints, and eventually a contribution and moderation system so other parents could add activities too.

Some of that existed. There was a database, authentication, activity browsing, generated at-home activities, materials, tickets, moderation, contribution flows, and the start of a calendar system. It was a proper app idea, not just a notes file.

That was also part of the problem.

## Why I Stopped

The more I built, the more it felt like DayPlan needed density to be good.

Local activity planning is only really useful if the data is broad, fresh, and trusted. If the app is going to recommend days out, it needs good coverage of venues, parks, events, opening times, ticket rules, seasonal changes, parking details, and all the small practical things parents care about. If it is going to have community submissions, it needs enough people using it to make those submissions worthwhile, and enough moderation to keep them useful.

That is not impossible, but it is a very different problem from building a neat planning tool. It starts becoming a local marketplace or community platform, and those usually need a level of engagement and market saturation that I did not think I was likely to create.

Without that density, the app risks being a polished shell around a small amount of manually maintained data. That is not useless, but it is not a great reason to keep adding product surface area.

There was another thing that made me less convinced by the product shape: agents are getting better.

The question DayPlan was trying to answer was something like: what should we do with the children today, given their ages, the weather, where we live, how far we want to travel, what we have already done, what tickets we own, how much energy everyone has, and what is actually open?

That is a fuzzy research and planning problem. A few years ago, it made more sense to imagine solving it with a deterministic app backed by a structured database. Now I am less sure. It feels like exactly the kind of thing an agent might be good at: search around, check constraints, compare options, explain the tradeoffs, and produce a plan for this specific day rather than asking me to maintain a whole planning system around it.

That does not mean an app could not work. It just made me less excited about being the person to keep building and operating it.

## The Part Worth Keeping

The at-home activities were different.

They did not need market density. They did not need fresh local data, venue opening times, ticket integrations, user submissions, or moderation. They were just useful bits of content: activities with materials, age ranges, rough timings, instructions, and illustrations.

That made them much easier to salvage.

I already had my personal site running on Hugo and Cloudflare Pages. A static activity archive fits that shape well. There is no database, no auth, no backend, and no product machinery. The activities can live as normal pages, with a little bit of client-side search and filtering on top.

So instead of letting the work sit in a repo for an app I was not going to finish, I moved the useful bit to the simplest place I could put it.

## A Smaller Ending

This is not DayPlan as I originally imagined it. There is no calendar. There are no child profiles. There are no tickets or passes or local recommendations. There is no clever scheduling engine trying to fill a school holiday.

It is just a searchable list of at-home activities.

That is probably the right ending for this version of the idea. The full app needed a level of adoption and maintenance that I did not think made sense. The static archive does not need any of that. It can just sit there and be useful when someone needs something to do with their children.

If that is you, here it is again:

[Browse the at-home activities](/activities/)
