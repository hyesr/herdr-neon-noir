// Added by hyesr, 2026, as part of the neon-noir restyle. Apache-2.0.
// An agent's status as three signal bars, animated natively (no timers).
import { div } from "gpui-kit";

const bar = (color, height) => div().w(3).h(height).flex_none().bg(color);

export function signal(status, color, size = 12) {
  const bars = div().flex().flex_row().items_end().gap(2).h(size).flex_none();
  const low = Math.round(size / 4), mid = Math.round(size * 0.6);
  if (status === "working") {
    return bars.children([700, 520, 860].map((period) => bar(color, low).loop("height", { from: low, to: size, period })));
  }
  if (status === "idle") return bars.children([low, low, low].map((h) => bar(color, h)));
  const full = bars.children([low, mid, size].map((h) => bar(color, h)));
  return status === "blocked" ? full.loop("opacity", { from: 0.3, to: 1, period: 900 }) : full;
}
