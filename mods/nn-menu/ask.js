// Added by hyesr, 2026, as part of the neon-noir restyle. Apache-2.0.
// Neon Noir versions of the app's own "Rename" and "Close?" dialogs.
// Only the dialog passes confirmed: true, and only after the person accepts.
// If the target can't be found, the plain command runs and the app asks instead.
import { run, spaces, openOverlay } from "herdr";

const findSpace = (id) => spaces().find((s) => (id ? s.id === id : s.active));
const findTab = (id) => {
  for (const s of spaces()) {
    const t = (s.tabs ?? []).find((x) => (id ? x.id === id : s.active && x.active));
    if (t) return { s, t };
  }
  return null;
};
const confirm = (title, detail, name, id) => openOverlay({ mod: "nn-confirm", kind: "dialog", frame: "none", width: 420, height: 170,
  props: { title, detail, command: { name, args: { id, confirmed: true } } } });
const prompt = (title, value, hint, name, id) => openOverlay({ mod: "nn-prompt", kind: "dialog", frame: "none", width: 400, height: 240,
  props: { title, value, hint, command: { name, args: { id } } } });

export function closeSpace(id) {
  const s = findSpace(id);
  if (!s) return run("space.close", id ? { id } : {});
  confirm("Close space?", `"${s.name}" and every terminal in it will end.`, "space.close", s.id);
}
export function closeTab(id) {
  const f = findTab(id);
  if (!f) return run("tab.close", id ? { id } : {});
  if (f.s.tabs.length > 1) return run("tab.close", { id: f.t.id });
  confirm("Close space?", `This is the last tab, so "${f.s.name}" and its terminals will end.`, "tab.close", f.t.id);
}
export function renameSpace(id) {
  const s = findSpace(id);
  if (!s) return run("space.rename", id ? { id } : {});
  prompt("Rename space", s.named ? s.name : "", "Empty: named after its folder", "space.rename", s.id);
}
export function renameTab(id) {
  const f = findTab(id);
  if (!f) return run("tab.rename", id ? { id } : {});
  prompt("Rename tab", f.t.named ? f.t.name : "", "Empty: called by its number", "tab.rename", f.t.id);
}
