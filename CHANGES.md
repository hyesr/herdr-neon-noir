# Changes from Herdr

These files are derived from Herdr app 0.1.13 and were changed in November
2026. Modified JavaScript files carry a header comment. JSON files can't hold comments, so this list covers them.

## Across all modified mods

- Corners squared
- Labels and headings changed to uppercase, some with a `//` prefix
- Cyan accent bars and borders added
- Spinners and status dots replaced by signal bars
- Mod paths and overlay names changed to the `nn-` clones
- `mod.json`: `cloned_from` added, and `frame: "none"` for popups

## Files by origin

| File | Derived from | Other changes |
|---|---|---|
| `layouts/neon-noir.json` | `main` layout | New colours, fonts and pane style; uses the `nn-` mods |
| `mods/nn-agents` | `agents` | Peek opens a custom window instead of `terminal.peek` |
| `mods/nn-changes` | `changes` | Cyan commit button; file list layout from Herdr 0.1.14 (fills the panel, scrolls to every file) |
| `mods/nn-confirm` | `confirm` | Used for close prompts |
| `mods/nn-files` | `files` | Styling only |
| `mods/nn-machine-add` | `machine-add` | Styling only |
| `mods/nn-menu` | `menu` | Opens the `nn-` dialogs for close and rename |
| `mods/nn-new-menu` | `new-menu` | Opens `nn-worktree` |
| `mods/nn-palette` | app `frame/palette` | Opens the `nn-` dialogs and screens; Settings stays Herdr's own |
| `mods/nn-pane` | `pane` | Focus marker and signal bars added |
| `mods/nn-peek` | `peek` | Close uses a saved window id; signal bars added |
| `mods/nn-picker` | `picker` | Deleting a tab goes through `nn-confirm`; signal bars added |
| `mods/nn-prompt` | `prompt` | Used for rename prompts |
| `mods/nn-spaces` | `spaces` | Opens `nn-menu`; adds status notches, changed-file and upstream labels, and a 30-second git refresh |
| `mods/nn-tabs` | `tabs` | Opens the `nn-` menus and dialogs; handles this layout's keys; shows `CH.01` for automatic tab numbers |
| `mods/nn-workspace-chrome` | `workspace-chrome` | Logo replaced by a text mark with a still cursor; opens the `nn-` screens |
| `mods/nn-workspace-status` | `workspace-status` | Opens `nn-palette`; adds `NODE:LOCAL`, the `SIGNAL` meter, a clock, and on macOS `RAM`, `CPU` and `NET` |
| `mods/nn-worktree` | `worktree` | Styling; `git add` and `remove` use the 10-minute `exec` timeout from Herdr 0.1.14 |

## New files

- `mods/nn-menu/ask.js`, `mods/nn-palette/ask.js`, `mods/nn-picker/ask.js`
  and `mods/nn-tabs/ask.js`: open the styled rename and close dialogs
- `mods/nn-*/signal.js`: agent status as three animated bars
- `mods/nn-*/hud.js`: corner marks for popups
- `themes/neon-noir.json`: terminal colours
- `keys.json`: this layout's key bindings
- `layouts/neon-noir.svg`: the layout's Settings picture
