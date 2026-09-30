import { FIELD_KEYS } from "./fields.js";

/**
 * A rule: { name, f, waste, per, pack, round, unit, basis, sec }
 *   f     formula over measurement fields (plain math)
 *   waste percent added to the formula result
 *   per   coverage of ONE unit (100 for a square, 10 for a 10-ft stick, 32 for a 4x8 sheet)
 *   pack  round up to a multiple (3 bundles per square)
 *   round "up" | "up2" (to a tenth) | "nearest" | "none"
 */
const cache = new Map();

export function compile(f) {
  const src = String(f == null ? "0" : f).trim() || "0";
  if (cache.has(src)) return cache.get(src);
  let fn = null;
  if (!/[^\w\s+\-*/().,]/.test(src)) {
    try { fn = new Function(...FIELD_KEYS, "Math", `return (${src});`); } catch { fn = null; }
  }
  cache.set(src, fn);
  return fn;
}

export function runRules(measurements, rules) {
  const args = FIELD_KEYS.map((k) => Number(measurements[k]) || 0);
  return rules.map((r) => {
    const fn = compile(r.f);
    let raw = null, err = null, qty = 0;
    if (!fn) err = "bad formula";
    else {
      try { raw = fn(...args, Math); if (!Number.isFinite(raw)) throw 0; } catch { err = "bad formula"; }
    }
    if (!err) {
      const w = raw * (1 + (Number(r.waste) || 0) / 100);
      let q = w / (Number(r.per) || 1);
      if (r.round === "up") q = Math.ceil(q - 1e-9);
      else if (r.round === "up2") q = Math.ceil(q * 10 - 1e-9) / 10;
      else if (r.round === "nearest") q = Math.round(q);
      else q = Math.round(q * 100) / 100;
      const pack = Number(r.pack) || 1;
      if (pack > 1) q = Math.ceil(q / pack - 1e-9) * pack;
      qty = Math.max(0, q);
    }
    if (r.enabled === false) qty = 0;
    return { ...r, raw, qty, err, off: r.enabled === false };
  });
}

export function formatQty(item) {
  const d = item.round === "up2" ? 1 : item.round === "none" ? 2 : 0;
  return Number(item.qty).toLocaleString(undefined, { maximumFractionDigits: d, minimumFractionDigits: 0 });
}

export function listAsText(takeoff, items) {
  let out = `${takeoff.address || "Manual takeoff"}\n`, sec = null;
  items.forEach((it) => {
    if (it.qty <= 0 || it.off) return;
    if (it.sec !== sec) { out += `\n${it.sec}\n`; sec = it.sec; }
    out += `  ${formatQty(it).padStart(7)} ${String(it.unit).padEnd(6)} ${it.name}\n`;
  });
  return out;
}

export function listAsCsv(items) {
  return "section,item,qty,unit,formula,waste_pct\n" +
    items.filter((i) => i.qty > 0 && !i.off).map((i) => [i.sec, i.name, i.qty, i.unit, `"${i.f}"`, i.waste].join(",")).join("\n");
}
