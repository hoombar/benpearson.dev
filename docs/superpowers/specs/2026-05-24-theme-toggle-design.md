# Theme Toggle Design

## Goal

Add an accessible light/dark/system theme choice to the Hugo site while keeping the dark palette aligned with the Ember Noir terminal theme and the light palette comfortable for readers who do not want a terminal feel.

## Behavior

The site defaults to `system`, which follows `prefers-color-scheme`. The user can choose `Light`, `Dark`, or `System` from a header control. The explicit choice is stored in `localStorage` because this is a static site and the preference does not need to be sent to the server.

When the user chooses `light` or `dark`, the script sets `data-theme` on `<html>`. When the user chooses `system`, the script removes `data-theme` and lets CSS media queries decide.

## Accessibility

The control is a labelled native `<select>`, so it works with keyboard and assistive technology without custom ARIA behavior. CSS palettes keep strong text/background contrast in both modes.

## Flash Avoidance

A tiny inline head script applies the stored explicit theme before the stylesheet loads. The larger behavior script runs with `defer` after parsing.
