// Added by hyesr, 2026, as part of the neon-noir restyle. Apache-2.0.
// Square corner marks for a popup. Its root needs .relative().
import { div } from "gpui-kit";

export function corners(t) {
  const mark = () => div().absolute().size(14).border_color(t.working);
  return [
    mark().top(0).left(0).border_t(2).border_l(2),
    mark().top(0).right(0).border_t(2).border_r(2),
    mark().bottom(0).left(0).border_b(2).border_l(2),
    mark().bottom(0).right(0).border_b(2).border_r(2),
  ];
}
