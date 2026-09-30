import { useCallback, useMemo, useState } from "react";
import { DEFAULT_SELECTION, PROFILE_GROUPS, findProfile } from "../core/profiles.js";

// Swap this for Supabase later — the shape stays the same.
const KEY = "bvhi.takeoff.v2";
function read() { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch { return {}; } }
function write(v) { try { localStorage.setItem(KEY, JSON.stringify(v)); } catch { /* ignore */ } }

export function useRules() {
  const [store, setStore] = useState(() => ({ selection: { ...DEFAULT_SELECTION }, overrides: {}, ...read() }));
  const save = useCallback((next) => { setStore(next); write(next); }, []);

  const select = (group, id) => save({ ...store, selection: { ...store.selection, [group]: id } });

  // Rules for the active profile in each group, with user overrides applied.
  const rules = useMemo(() => PROFILE_GROUPS.flatMap((g) => {
    const p = findProfile(g.key, store.selection[g.key]);
    return store.overrides[p.id] ? store.overrides[p.id] : p.rules;
  }), [store]);

  const groupRules = (group) => {
    const p = findProfile(group, store.selection[group]);
    return { profile: p, rules: store.overrides[p.id] || p.rules, edited: !!store.overrides[p.id] };
  };
  const setGroupRules = (group, next) => {
    const p = findProfile(group, store.selection[group]);
    save({ ...store, overrides: { ...store.overrides, [p.id]: next } });
  };
  const resetGroup = (group) => {
    const p = findProfile(group, store.selection[group]);
    const o = { ...store.overrides }; delete o[p.id];
    save({ ...store, overrides: o });
  };

  return { selection: store.selection, select, rules, groupRules, setGroupRules, resetGroup };
}
