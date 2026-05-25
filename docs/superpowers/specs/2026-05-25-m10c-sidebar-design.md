# m10c Sidebar Redesign

## Goal

Adapt the site toward the m10c visual model: a persistent profile sidebar with black/orange Ember Noir identity and a readable content pane that supports light, dark, and system theme choices.

## Layout

Desktop uses a two-column shell. The left sidebar contains the profile image, name, short description, primary navigation, social links, and theme selector. The right pane contains writing lists and articles. Mobile collapses into a stacked header so content remains easy to read on narrow screens.

## Palette

The sidebar stays black/orange in all modes to keep the site identity stable. The content pane changes with the theme toggle: warm off-white in light mode, soft Ember Noir dark in dark mode, and system preference by default.

## Profile And Social Links

The sidebar links to GitHub (`https://github.com/hoombar`) and LinkedIn (`https://www.linkedin.com/in/ben-pearson-2a320a75/`). LinkedIn profile image retrieval may be blocked without authentication, so the implementation can use the public GitHub avatar as the local profile image if LinkedIn does not provide a fetchable image.
