---
title: "Debugging My Garmin Battery Life With Home Assistant"
slug: garmin-battery-life-home-assistant
content_type: post
summary: "How Home Assistant history helped me work out why my Garmin Venu 3 battery life was worse than expected, even while I was away from home."
date: 2026-05-27
draft: false
tags:
  - home-assistant
  - garmin
  - wearables
  - observability
---

## 52% To 4% In Less Than Three Days

The first number that made me stop guessing was `52% -> 4%` over 64.8 hours.

That was my Garmin Venu 3, in normal smartwatch use, dropping nearly half its battery in less than three days. Garmin quotes around 14 days in smartwatch mode, which works out at roughly `0.298%/hr`. This window was `0.741%/hr`, or about two and a half times worse than that.

It was still usable, which is part of why the problem was annoying rather than obvious. I would glance at the battery percentage and think it looked lower than it should, but then I would wonder whether I had used GPS, changed a watch face, slept with SpO2 enabled, synced something, or just started noticing the number because I was paying attention.

The useful bit was that the watch battery was already in Home Assistant as `sensor.garmin_device_battery_level`, and Home Assistant was keeping history for it. That changed the problem from a vague sense that the battery was bad into a slope I could compare before and after each change.

Once I had the history, the question became much simpler: what changed the rate?

## Turning A Feeling Into A Baseline

The calculation was deliberately basic: battery percentage drop divided by hours elapsed.

The first few Home Assistant windows looked like this:

| Period | Battery Drop | Duration | Drain Rate | Projected Life |
|---|---:|---:|---:|---:|
| Mar 29-31 | 52% to 4% | 64.8h | 0.741%/hr | 5.6 days |
| Mar 31-Apr 1 | 81% to 71% | 20.8h | 0.482%/hr | 8.6 days |
| Apr 1-5 | 100% to 49% | 88.3h | 0.578%/hr | 7.2 days |

That confirmed two things.

First, I was not imagining it. The watch was consistently worse than the headline spec, even allowing for the fact that real life never matches a clean manufacturer estimate.

Second, the drain was mostly smooth. I was not seeing a cliff where the battery suddenly fell after one activity or one sync. It looked more like a persistent background cost, which made settings, watch faces, and Connect IQ behaviour more interesting suspects than a single bad workout.

The data was not perfect. Garmin battery percentages are coarse, and short windows can be misleading if the percentage has just ticked down. But it was good enough to stop debugging from memory.

## The Part I Could Do From A Yurt

The slightly fun part is that I kept doing this while I was away, including while staying in a yurt on holiday.

That made the setup feel much more useful than a spreadsheet exercise. I did not need to be at home, and I did not need physical access to the Home Assistant box. The watch kept reporting its battery level, Home Assistant kept storing the history, and I could check the current state and recent trend remotely.

The loop was simple:

1. Change one thing on the watch.
2. Let normal life happen.
3. Check the Home Assistant history.
4. Compare the new slope with the old one.
5. Keep the change, revert it, or test the next suspect.

I was not trying to create a perfect lab test. I wanted a practical answer for my actual watch, with my actual settings, while I was using it normally.

## Spotify And Wi-Fi Were The First Big Win

Spotify was installed on the watch, although I was not actively using it. Wi-Fi was also enabled, even though I had thought it was off.

That combination was suspicious enough to test. There are reports of Garmin music apps and sync behaviour creating background drain, sometimes involving Wi-Fi, but I could not prove the internal mechanism from the outside. What I could test was whether removing Spotify and turning Wi-Fi off changed the slope.

On 5 April, with the battery at 49%, I uninstalled Spotify. About ten minutes later I turned Wi-Fi off as well. Because those two changes happened together, I do not want to claim Spotify alone was proven as the culprit. The paired change was still useful.

Before the change, a recent window was draining at about `1.09%/hr`. Afterwards it dropped to about `0.64%/hr`.

That was roughly a 40% improvement from the high-drain window. It did not fix everything, but it removed a large unwanted cost and made the rest of the problem easier to reason about.

## SpO2 Was A Cost I Could Choose

After the Spotify and Wi-Fi change, the overnight numbers became more understandable.

One overnight window with sleep tracking and SpO2 active settled around `0.53%/hr` over 7.5 hours, projecting to about 7.8 days. That is not amazing, but it is close to Garmin's 8-day always-on-display figure, even though I was not using the always-on display.

That did not make SpO2 bad. It made the cost visible.

This was one of the more useful shifts in the debugging process. Some battery drain is unwanted background behaviour. Some of it is the price of a feature I actually chose. Once I could see the difference, the decision became less frustrating.

## Gesture Wake And Timeout Mattered More Than I Expected

The next useful test was gesture wake.

When I turned gesture wake off during the day, the drain dropped to about `0.38%/hr`, projecting roughly 10 days of battery life. Compared with the `1.09%/hr` starting point, that was a 65% total reduction.

I had mentally filed gesture wake under normal watch behaviour, not under something that could materially change the battery budget. The Home Assistant history made it harder to ignore.

The more practical follow-up was not to leave the watch in an artificially minimal state forever. I turned gestures back on, kept a short timeout, and restarted the watch to clear any cached or stuck processes. The early result stayed around `0.38%/hr`, which suggested the short timeout was doing useful work.

That is exactly the sort of thing I would not trust from memory. The watch would still have felt normal either way, but the slope told me the setting mattered.

## Watch Faces Were Less Obvious Than They Looked

The watch-face testing was the most interesting part because my first intuition was too simple.

I assumed a visually busy face would be expensive and a simpler face would be cheap. That was not quite right. What seemed to matter more was whether the face had animated seconds, how often it updated, and how aggressively it polled data.

Orbit II, with data polling and animation, measured around `0.73%/hr` in one short test. That was nearly double the `0.38%/hr` I saw with a minimal face, although the short window meant I did not want to over-trust the exact number.

Segment 34 MK2 was more interesting. It was still a data-rich face, but without seconds. An early reading looked extremely good at about `0.27%/hr`, but that was too short to trust. Over 6 to 9 hours it settled closer to `0.44-0.50%/hr`, and a later retained Home Assistant history window gave a cleaner real-world result.

That longer window showed the watch going from `87%` to `3%` between 10 April and 17 April: 7 days, 12 hours, 6 minutes. That works out at about `0.466%/hr`, or roughly 8 days and 16 hours from 100% to 3%.

That still was not Garmin's 14-day headline number, but it was much better than where I started. More importantly, it was explainable. Spotify and Wi-Fi were no longer part of the test. The timeout was short. SpO2 still had a cost. The face still had data polling, but it was not constantly animating seconds.

Later trials kept the same pattern. Phoenix 8 v3 started around `0.47%/hr` over 19 hours, moved to `0.53%/hr` after 43 hours, and reached `0.58%/hr` after 81.5 hours. Orbit 2 then measured around `0.55%/hr` over its first 18.3 hours. Both were usable, but both were behind the Segment 34 MK2 baseline.

The useful lesson was not "never use third-party watch faces". It was more specific: seconds, animation, polling behaviour, and implementation details matter more than how complicated the face looks at a glance.

## What I Actually Changed

The configuration I ended up trusting was not extreme:

- Spotify uninstalled.
- Wi-Fi off.
- Short display timeout.
- A watch face without animated seconds.
- Overnight SpO2 kept on, with the battery cost accepted rather than hidden.

That got the watch into a roughly 8.5 to 10 day real-world range depending on the face and measurement window. I could probably get more by turning off more health features, but at some point that becomes a worse watch for me. I bought the thing because I wanted some of those features.

The better outcome was that I understood the budget.

Spotify and Wi-Fi looked like an unwanted background cost, though I changed them too close together to separate them cleanly. Gesture wake and timeout were a usability tradeoff. SpO2 was an overnight health-data tradeoff. Watch faces were a design and polling tradeoff. Once those were separated, I could choose the bits I cared about instead of treating the battery as a mystery.

## Home Assistant Was Just Enough Observability

Home Assistant was not doing anything especially clever here. That is partly why I liked it.

It collected a state value over time, kept enough history to compare windows, and let me inspect it remotely. That was enough to avoid the usual consumer-device debugging pattern where I change three settings at once, wait a day, forget what I changed, and then decide based on whether the battery feels better.

The limitations still matter. Whole-percentage battery readings make short tests noisy. Normal life gets in the way: a swim, a GPS activity, a firmware update, a sync, or a busy day can all affect the slope. Some variables were still not perfectly isolated.

But the history made those limits visible. I could see when a short result was probably premature, wait for a longer window, and avoid overreacting to one percentage tick.

That is the part I keep coming back to with Home Assistant. The automations are useful, but the history is often just as valuable. Sometimes the smart home does not need to do anything. It just needs to remember what happened clearly enough that I can stop guessing.
