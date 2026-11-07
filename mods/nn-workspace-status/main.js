// Modified by hyesr, 2026: neon-noir restyle of Herdr's workspace-status mod.
// See CHANGES.md. Original licensed under Apache-2.0 (see LICENSE).
import { View, div, svg } from "gpui-kit";
import { h_flex } from "gpui-base";
import { spaces, agents, theme, run, window, keys, exec } from "herdr";

export default class WorkspaceStatus extends View {
  init(_props, cx) {
    cx.timer.every(30000, (cx) => cx.notify());
    if (window()?.platform !== "macos") return;
    this.readStats(cx);
    this.readNet(cx);
    cx.timer.every(15000, (cx) => this.readStats(cx));
    cx.timer.every(60000, (cx) => this.readNet(cx));
  }

  // Memory in use and CPU across all cores. A failed read hides the label.
  readStats(cx) {
    cx.spawn(async (cx) => {
      try {
        const r = await exec("sh", ["-c", "memory_pressure -Q | tail -1; ps -A -o %cpu= | awk '{s+=$1} END {print s}'; sysctl -n hw.ncpu"]);
        const [memory, used, cores] = r.stdout.trim().split("\n");
        const free = parseInt(memory.match(/(\d+)%/)?.[1], 10);
        const cpu = Math.round(parseFloat(used) / parseInt(cores, 10));
        this.stats = r.code === 0 && Number.isFinite(free) && Number.isFinite(cpu) ? { ram: 100 - free, cpu } : null;
      } catch {
        this.stats = null;
      }
      cx.notify();
    });
  }

  // One ping to a public resolver: online means a route out and a reply back.
  readNet(cx) {
    cx.spawn(async (cx) => {
      try {
        this.online = (await exec("ping", ["-c", "1", "-t", "2", "1.1.1.1"])).code === 0;
      } catch {
        this.online = null;
      }
      cx.notify();
    });
  }

  // The palette key as actually bound, not a hardcoded one; without a
  // binding the hint stays useful ("commands") instead of lying.
  hint(t) {
    const mac = window()?.platform === "macos";
    const mod = { cmd: mac ? "⌘" : "Ctrl+", ctrl: mac ? "⌃" : "Ctrl+", shift: mac ? "⇧" : "Shift+", alt: mac ? "⌥" : "Alt+", option: mac ? "⌥" : "Alt+" };
    const b = keys().find((k) => k.section === "global" && k.action === "app.palette");
    const parts = b && b.keys.endsWith("--") ? [...b.keys.slice(0, -2).split("-"), "-"] : b?.keys.split("-");
    const key = parts && parts.map((p) => mod[p.toLowerCase()] ?? p.toUpperCase()).join("");
    return key ? `${key}  COMMANDS` : "COMMANDS";
  }

  render() {
    const t = theme();
    const space = spaces().find(s => s.active);
    const list = agents();
    const needs = list.filter(a => a.status === "blocked").length;
    const clock = new Date();
    const pad = (n) => String(n).padStart(2, "0");
    const working = list.filter(a => a.status === "working").length;
    // Five ticks, most urgent first; an empty tick is a free slot.
    const order = ["blocked", "done", "working", "idle"];
    const ranked = [...list].sort((a, b) => order.indexOf(a.status) - order.indexOf(b.status));
    const ticks = [0, 1, 2, 3, 4].map(i => div().w(4).h(11).flex_none().bg(ranked[i] ? (t[ranked[i].status] ?? t.dim) : t.border));
    const label = (icon, text) => h_flex().gap(6).items_center().child(svg(`mods/workspace-chrome/${icon}.svg`).size(13)).child(text);
    return h_flex().size_full().px(14).gap(16).items_center().bg(t.chrome).border_t(1).border_color(t.border).text_size(11.8).text_color(t.muted)
      .child(label(space?.machine ? "server" : "monitor", `NODE:${(space?.machine ?? "local").toUpperCase()}`))
      .when(Boolean(space?.branch), el => el.child(label("branch", space.branch)))
      .child(h_flex().gap(6).items_center().child("SIGNAL").child(h_flex().gap(2).items_center().children(ticks)).child(`${working}/${list.length}`)
        .when(needs > 0, el => el.child(div().text_color(t.blocked).child(`· ${needs} NEEDS YOU`))))
      .child(div().flex_1())
      .when(Boolean(this.stats), el => el.child(h_flex().flex_none().gap(4).text_color(t.dim)
        .child(div().when(this.stats?.ram >= 85, s => s.text_color(t.working)).child(`RAM ${this.stats?.ram}%`))
        .child("·")
        .child(div().when(this.stats?.cpu >= 85, s => s.text_color(t.working)).child(`CPU ${this.stats?.cpu}%`))))
      .when(this.online === true || this.online === false, el => el.child(h_flex().flex_none().gap(5).items_center().text_color(t.dim)
        .child("NET").child(div().size(6).bg(this.online ? t.done : t.blocked))))
      .child(div().flex_none().text_color(t.muted).child(`${pad(clock.getHours())}:${pad(clock.getMinutes())}`))
      .child(div().id("palette").text_color(t.dim).on_click(() => run("mod.open", { name: "nn-palette" })).child(this.hint(t)));
  }
}
