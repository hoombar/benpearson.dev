---
title: "Copying Text Out Of Remote OpenCode In tmux"
slug: copying-text-from-remote-opencode-tmux
content_type: lab
summary: "The small clipboard fix that made text copy from OpenCode on minibot, through tmux and SSH, back to my Mac."
date: 2026-06-17
draft: false
tags:
  - opencode
  - tmux
  - ssh
  - tools
---

I had one annoying gap left in the minibot setup.

In [Stop Carrying the Agent Around](/writing/stop-carrying-the-agent-around/) I wrote about moving my agent workflow off my laptop and onto a little remote machine: [OpenCode](https://opencode.ai/) running on `minibot`, usually reached from my Mac over SSH, inside `tmux`, with some glue like [`cc-clip`](https://github.com/ShunmeiCho/cc-clip) for pasting images in the other direction.

That setup was working well, but copying text back out of OpenCode was still awkward.

Plain SSH was fine. A normal `tmux` pane in Warp was fine. I could drag over terminal text, copy it, and paste it into a Mac app like I expected.

But inside `opencode attach`, the same gesture did not work. I would drag across text in the OpenCode TUI, switch back to the Mac, paste, and get either nothing useful or whatever had already been on the clipboard.

## The Cause

The important clue was that copy worked in plain SSH and `tmux`, then stopped only once OpenCode's TUI was involved.

OpenCode has mouse support. I wanted to keep that enabled because mouse scrolling inside the interface is useful:

```json
"mouse": true
```

The issue was that the TUI was receiving the mouse events before Warp could treat them as terminal selection. My drag was going to the full-screen terminal app, not to the terminal emulator.

So I did not need one clipboard bridge to solve everything. I needed two paths: one for rough terminal-grid selection, and one for OpenCode-aware copying.

## Two Copy Paths

For quick terminal selection, hold `SHIFT` while dragging.

Warp treats that as a bypass for mouse reporting, so the mouse event goes to Warp instead of the full-screen app. That means I can leave mouse reporting enabled and still do a normal terminal selection when I need it.

The limitation is that this is just terminal selection. It does not understand OpenCode's layout. If OpenCode is showing a two-column diff, a dragged selection can copy across both sides because Warp is selecting cells on the terminal grid, not a semantic chunk from OpenCode.

For OpenCode-aware copying, I use OpenCode's own `messages_copy` action.

My binding in `/home/ben/.config/opencode/tui.json` is:

```json
"messages_copy": ["<leader>y", "ctrl+shift+c"]
```

With the default leader key, `<leader>y` means:

```text
ctrl+x
y
```

That path is the one I use when I want OpenCode to decide what should be copied from the current message or focused part of the conversation, rather than asking Warp to copy whatever cells happen to be visible under my cursor.

## The tmux Bit

OpenCode's TUI copy path can use OSC 52, which is the terminal escape sequence route for writing text to the local clipboard. In this setup the path looks like this:

```text
OpenCode on minibot
  -> OSC 52 clipboard sequence
  -> tmux passthrough
  -> SSH session
  -> Warp on my Mac
  -> macOS clipboard
```

If OpenCode says `Copied to clipboard` but the text does not appear on the Mac clipboard, `tmux` is the next place to check. The terminal escape sequence has to be allowed through the `tmux` layer.

On `minibot` I needed this in `~/.tmux.conf`:

```tmux
set -g allow-passthrough on
```

To apply it immediately in the existing `tmux` server, I also ran:

```bash
tmux set-option -g allow-passthrough on
```

After that, OpenCode's copy action could get text back to the Mac clipboard.

## Warp Settings

I left Warp's mouse reporting and scroll reporting enabled.

In the UI that is:

```text
Settings > Features > Terminal > Enable Mouse Reporting
Settings > Features > Terminal > Enable Scroll Reporting
```

In Warp's `settings.toml`, those correspond to:

```toml
mouse_reporting_enabled = true
scroll_reporting_enabled = true
```

That is the bit that made this easy to misdiagnose. Turning mouse support off might have made drag selection simpler, but it would also have made the remote TUI worse to use. The better fix was to keep the normal interactive behaviour and choose the right copy path for the thing I was copying.

For me the rules are now:

```text
Normal OpenCode use:
  keep mouse reporting on

Quick terminal-grid selection:
  hold SHIFT while dragging

OpenCode-aware message copy:
  use messages_copy

If OpenCode says copied but the Mac clipboard stays unchanged:
  check tmux allow-passthrough
```

## What This Does Not Replace

This is only for copying text from `minibot` and OpenCode back to my Mac.

I am still keeping `cc-clip` for the opposite direction: pasting images from the Mac into the remote agent workflow. That problem is different because terminal clipboard paths are good at text and much less useful for rich clipboard contents like screenshots.

So the setup now has two small pieces:

```text
Mac -> minibot image paste:
  cc-clip

minibot/OpenCode -> Mac text copy:
  OpenCode messages_copy + OSC 52 + tmux passthrough
```

That feels like the right split for this setup. Text copy can stay on the normal terminal path, and image paste can keep using the tool that was built for getting richer clipboard contents into a remote session.
