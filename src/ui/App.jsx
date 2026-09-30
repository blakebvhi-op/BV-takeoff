import { useMemo, useState } from "react";
import { FIELDS, emptyTakeoff } from "../core/fields.js";
import { parseEagleView } from "../core/ingest/eagleview.js";
import { runRules, formatQty, listAsText, listAsCsv } from "../core/engine.js";
import { PROFILE_GROUPS } from "../core/profiles.js";
import { useRules } from "./useRules.js";

const fmt = (n, d = 1) => Number(n || 0).toLocaleString(undefined, { maximumFractionDigits: d });

export default function App() {
  const [takeoff, setTakeoff] = useState(null);
  const [m, setM] = useState(null);
  const [tab, setTab] = useState("list");
  const [toast, setToast] = useState("");
  const [editing, setEditing] = useState(null); // {group, index}
  const R = useRules();
  const items = useMemo(() => (m ? runRules(m, R.rules) : []), [m, R.rules]);

  const say = (t) => { setToast(t); setTimeout(() => setToast(""), 1800); };
  const load = (t) => { setTakeoff(t); setM({ ...t.measurements }); setTab(t.source === "manual" ? "measure" : "list"); };
  async function readFile(file) {
    try { load(parseEagleView(JSON.parse(await file.text()))); say("Loaded " + file.name); }
    catch (e) { say(e.message || "That file didn't read as an EagleView export"); }
  }
  async function loadSample() { const r = await fetch(import.meta.env.BASE_URL + "sample-eagleview.json"); load(parseEagleView(await r.json())); }

  async function share() {
    const text = listAsText(takeoff, items);
    if (navigator.share) { try { await navigator.share({ title: "Material list", text }); return; } catch { /* cancelled */ } }
    try { await navigator.clipboard.writeText(text); say("Copied to clipboard"); } catch { say("Couldn't copy"); }
  }

  if (!takeoff) return <Start onFile={readFile} onSample={loadSample} onManual={() => load(emptyTakeoff("manual"))} />;

  const active = PROFILE_GROUPS.map((g) => g.profiles.find((p) => p.id === R.selection[g.key])?.label).filter(Boolean);

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-slab text-[#e6ebf0] px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="min-w-0 flex-1">
            <div className="font-cond font-bold text-[20px] leading-tight truncate">{takeoff.address || "Manual takeoff"}</div>
            <div className="text-[13px] text-[#9eaab6] truncate">{active.join(" · ")}</div>
          </div>
          <button className="btn btn-sm !bg-transparent !text-[#c6d0da] !border-[#3a4652]" onClick={() => { setTakeoff(null); setM(null); }}>New job</button>
        </div>
      </header>

      <main className="flex-1 pb-24 md:pb-8">
        {tab === "list" && <ListScreen items={items} m={m} onShare={share} onCsv={async () => { try { await navigator.clipboard.writeText(listAsCsv(items)); say("CSV copied"); } catch { say("Couldn't copy"); } }} onEdit={(sec, name) => setEditing(findRule(R, sec, name))} R={R} />}
        {tab === "measure" && <MeasureScreen m={m} base={takeoff.measurements} takeoff={takeoff} onChange={(k, v) => setM({ ...m, [k]: v })} onReset={() => setM({ ...takeoff.measurements })} />}
        {tab === "products" && <ProductsScreen R={R} onDone={() => setTab("list")} />}
      </main>

      <Tabs tab={tab} setTab={setTab} />
      {editing && <AdjustSheet R={R} target={editing} items={items} onClose={() => setEditing(null)} />}
      <div className={`fixed left-1/2 -translate-x-1/2 bottom-24 md:bottom-6 bg-slab text-[#e6ebf0] px-4 py-2.5 rounded-xl transition-opacity ${toast ? "opacity-100" : "opacity-0 pointer-events-none"}`}>{toast}</div>
    </div>
  );
}

function findRule(R, sec, name) {
  for (const g of PROFILE_GROUPS) {
    const { rules } = R.groupRules(g.key);
    const i = rules.findIndex((r) => r.sec === sec && r.name === name);
    if (i >= 0) return { group: g.key, index: i };
  }
  return null;
}

/* ---------- Start ---------- */
function Start({ onFile, onSample, onManual }) {
  const [over, setOver] = useState(false);
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-slab text-[#e6ebf0] px-5 py-4"><div className="font-cond font-bold text-[22px]">BVHI Takeoff</div></header>
      <div className="flex-1 flex flex-col items-center justify-center p-5 gap-4 max-w-md w-full mx-auto">
        <label className={`w-full block border-2 border-dashed rounded-2xl bg-card p-8 text-center cursor-pointer ${over ? "border-steel bg-brassbg" : "border-rule"}`}
          onDragOver={(e) => { e.preventDefault(); setOver(true); }} onDragLeave={() => setOver(false)}
          onDrop={(e) => { e.preventDefault(); setOver(false); const f = e.dataTransfer.files[0]; if (f) onFile(f); }}>
          <div className="font-cond text-[26px] font-semibold leading-tight">Open an EagleView file</div>
          <div className="text-ink2 mt-2">The .json that comes with the report. Tap here to pick it.</div>
          <div className="btn btn-primary mt-5 w-full">Choose file</div>
          <input type="file" accept=".json,.JSON,application/json" className="hidden" onChange={(e) => e.target.files[0] && onFile(e.target.files[0])} />
        </label>
        <button className="btn w-full" onClick={onManual}>No report — type in measurements</button>
        <button className="text-ink3 text-[14px] underline mt-2" onClick={onSample}>Try the Germantown sample</button>
      </div>
    </div>
  );
}

/* ---------- Tabs ---------- */
function Tabs({ tab, setTab }) {
  const t = [["list", "Order list"], ["measure", "Measurements"], ["products", "Products"]];
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-rule flex md:static md:border-t-0 md:border-b md:order-first" style={{ paddingBottom: "env(safe-area-inset-bottom,0px)" }}>
      {t.map(([k, l]) => (
        <button key={k} onClick={() => setTab(k)} className={`flex-1 py-3.5 font-semibold text-[15px] md:flex-none md:px-6 border-t-[3px] md:border-t-0 md:border-b-[3px] ${tab === k ? "border-brass text-ink" : "border-transparent text-ink3"}`}>{l}</button>
      ))}
    </nav>
  );
}

/* ---------- Order list ---------- */
function ListScreen({ items, m, onShare, onCsv, onEdit }) {
  const [showHow, setShowHow] = useState(false);
  const visible = items.filter((i) => !i.off);
  const secs = [...new Set(visible.map((i) => i.sec))];
  return (
    <div className="max-w-2xl mx-auto p-4 flex flex-col gap-4">
      <div className="grid grid-cols-3 gap-2">
        {[["Roof", fmt(m.roofAreaNet / 100, 1) + " sq"], ["Siding", fmt(m.sidingAreaNet / 100, 1) + " sq"], ["Pitch", m.predominantPitch + "/12"]].map(([l, v]) => (
          <div key={l} className="panel px-3 py-2.5"><div className="font-cond text-[24px] font-bold num leading-none">{v}</div><div className="text-[13px] text-ink2 mt-1">{l}</div></div>
        ))}
      </div>
      <div className="flex gap-2">
        <button className="btn btn-primary flex-1" onClick={onShare}>Share list</button>
        <button className="btn" onClick={onCsv}>CSV</button>
        <button className={`btn ${showHow ? "border-steel" : ""}`} onClick={() => setShowHow((s) => !s)} title="Show how each number is figured">?</button>
      </div>
      {secs.map((sec) => (
        <div key={sec} className="panel">
          <div className="px-4 pt-3 pb-1 font-cond text-[19px] font-bold">{sec}</div>
          {visible.filter((i) => i.sec === sec).map((it) => (
            <button key={it.name} onClick={() => onEdit(it.sec, it.name)} className="w-full text-left grid items-center gap-3 px-4 py-3 border-t border-rule active:bg-paper" style={{ gridTemplateColumns: "72px 52px 1fr" }}>
              <div className={`font-cond text-[26px] font-bold num text-right ${it.qty ? "" : "text-ink3 font-medium"}`}>{it.err ? "—" : formatQty(it)}</div>
              <div className="text-ink2 text-[15px]">{it.unit}</div>
              <div>
                <div className="font-medium">{it.name}</div>
                {(showHow || it.err) && <div className={`text-[12.5px] ${it.err ? "text-warn" : "text-ink3"}`}>{it.err ? `Check this formula: ${it.f}` : <>{it.f}{it.raw != null && ` = ${fmt(it.raw, 1)}`}{it.waste ? ` +${it.waste}%` : ""}{it.basis ? ` · ${it.basis}` : ""}</>}</div>}
              </div>
            </button>
          ))}
        </div>
      ))}
      <p className="text-ink3 text-[13.5px] text-center px-4">Tap any line to change its waste, coverage, or turn it off. Tap ? to see how each number is figured.</p>
    </div>
  );
}

/* ---------- Adjust one item (bottom sheet) ---------- */
function AdjustSheet({ R, target, onClose }) {
  const { rules, profile } = R.groupRules(target.group);
  const r = rules[target.index];
  const [adv, setAdv] = useState(false);
  if (!r) return null;
  const set = (f, v) => R.setGroupRules(target.group, rules.map((x, j) => (j === target.index ? { ...x, [f]: v } : x)));
  const on = r.enabled !== false;
  const coverLabel = r.per === 100 ? "One square is 100 sq ft" : `One ${r.unit} covers`;
  return (
    <div className="fixed inset-0 z-20 flex items-end md:items-center justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40" />
      <div className="relative bg-card rounded-t-2xl md:rounded-2xl w-full max-w-md p-5 flex flex-col gap-4" style={{ paddingBottom: "calc(20px + env(safe-area-inset-bottom,0px))" }} onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start gap-3">
          <div className="flex-1"><div className="font-cond text-[22px] font-bold leading-tight">{r.name}</div><div className="text-[13.5px] text-ink3">{profile.label}{r.basis ? ` · ${r.basis}` : ""}</div></div>
          <button className="btn btn-sm" onClick={onClose}>Done</button>
        </div>
        <label className="flex items-center justify-between gap-3 py-1"><span className="font-medium">Include on the list</span>
          <button role="switch" aria-checked={on} onClick={() => set("enabled", !on)} className={`w-14 h-8 rounded-full relative transition-colors ${on ? "bg-steel" : "bg-rule"}`}><span className={`absolute top-1 w-6 h-6 rounded-full bg-white transition-all ${on ? "left-7" : "left-1"}`} /></button>
        </label>
        <Num label="Waste to add" suffix="%" value={r.waste} onChange={(v) => set("waste", v)} step={1} />
        {r.per !== 100 && <Num label={coverLabel} suffix={r.unit === "sq" ? "sq ft" : "ft or sq ft"} value={r.per} onChange={(v) => set("per", v || 1)} step={0.5} />}
        <Num label="Round up to a multiple of" suffix={r.unit} value={r.pack} onChange={(v) => set("pack", v || 1)} step={1} />
        <button className="text-ink3 text-[14px] underline text-left" onClick={() => setAdv((a) => !a)}>{adv ? "Hide" : "Show"} advanced</button>
        {adv && (
          <div className="flex flex-col gap-2">
            <label className="text-[13.5px] text-ink2">Name<input className="field mt-1" value={r.name} onChange={(e) => set("name", e.target.value)} /></label>
            <label className="text-[13.5px] text-ink2">Formula (measurement fields, plain math)<input className="field mt-1 font-mono text-[14px]" value={r.f} onChange={(e) => set("f", e.target.value)} /></label>
            <div className="grid grid-cols-2 gap-2">
              <label className="text-[13.5px] text-ink2">Unit<input className="field mt-1" value={r.unit} onChange={(e) => set("unit", e.target.value)} /></label>
              <label className="text-[13.5px] text-ink2">Rounding<select className="field mt-1" value={r.round} onChange={(e) => set("round", e.target.value)}><option value="up">Up</option><option value="up2">Up to .1</option><option value="nearest">Nearest</option><option value="none">None</option></select></label>
            </div>
            <div className="flex gap-2 pt-1">
              <button className="btn btn-sm flex-1" onClick={() => R.setGroupRules(target.group, [...rules, { ...r, name: r.name + " (copy)" }])}>Duplicate</button>
              <button className="btn btn-sm flex-1 text-warn" onClick={() => { R.setGroupRules(target.group, rules.filter((_, j) => j !== target.index)); onClose(); }}>Delete</button>
              <button className="btn btn-sm flex-1" onClick={() => { R.resetGroup(target.group); onClose(); }}>Reset {profile.label}</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Num({ label, suffix, value, onChange, step }) {
  const v = Number(value) || 0;
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="font-medium">{label}</span>
      <div className="flex items-center gap-1">
        <button className="btn btn-sm w-11" onClick={() => onChange(Math.max(0, +(v - step).toFixed(2)))}>−</button>
        <input type="number" inputMode="decimal" step="any" value={value} onChange={(e) => onChange(parseFloat(e.target.value) || 0)} className="field !w-20 text-center !py-2 num" />
        <button className="btn btn-sm w-11" onClick={() => onChange(+(v + step).toFixed(2))}>+</button>
        <span className="text-ink3 text-[13.5px] w-14">{suffix}</span>
      </div>
    </div>
  );
}

/* ---------- Measurements ---------- */
function MeasureScreen({ m, base, takeoff, onChange, onReset }) {
  const [open, setOpen] = useState({ Roof: true, Walls: true, Openings: false });
  const groups = {}; FIELDS.forEach((f) => (groups[f[3]] = groups[f[3]] || []).push(f));
  const changed = Object.keys(m).filter((k) => m[k] !== base[k]).length;
  return (
    <div className="max-w-2xl mx-auto p-4 flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <p className="m-0 text-ink2 text-[14.5px] flex-1">{takeoff.source === "manual" ? "Type in what you measured. Leave what you don't need at zero." : "From the EagleView report. Change anything you know is different."}</p>
        {changed > 0 && <button className="btn btn-sm" onClick={onReset}>Undo {changed} change{changed > 1 ? "s" : ""}</button>}
      </div>
      {Object.keys(groups).map((g) => (
        <div key={g} className="panel">
          <button className="w-full flex items-center px-4 py-3 font-cond text-[19px] font-bold" onClick={() => setOpen({ ...open, [g]: !open[g] })}>{g}<span className="ml-auto text-ink3 text-[14px] font-sans font-normal">{open[g] ? "Hide" : "Show"}</span></button>
          {open[g] && groups[g].map(([k, l, u]) => (
            <label key={k} className="grid items-center gap-3 px-4 py-2 border-t border-rule" style={{ gridTemplateColumns: "1fr 110px" }}>
              <span className="text-[15px]">{l}<span className="text-ink3 text-[13px] ml-1.5">{u}</span></span>
              <input type="number" step="any" inputMode="decimal" value={m[k]} onChange={(e) => onChange(k, parseFloat(e.target.value) || 0)} className={`field !py-2 text-right num ${m[k] !== base[k] ? "text-warn border-warn" : ""}`} />
            </label>
          ))}
        </div>
      ))}
      {takeoff.walls?.length > 0 && <Elevations walls={takeoff.walls} />}
    </div>
  );
}

function Elevations({ walls }) {
  const [open, setOpen] = useState(false);
  const td = "px-3 py-1.5 border-b border-rule", tn = td + " text-right num";
  return (
    <div className="panel">
      <button className="w-full flex items-center px-4 py-3 font-cond text-[19px] font-bold" onClick={() => setOpen((o) => !o)}>By elevation<span className="ml-auto text-ink3 text-[14px] font-sans font-normal">{open ? "Hide" : "Show"}</span></button>
      {open && <div className="overflow-x-auto"><table className="w-full text-[14px] border-collapse">
        <thead><tr className="text-[13px] text-ink2 text-left"><th className={td}>Facing</th><th className={tn}>Siding</th><th className={tn}>Masonry</th><th className={tn}>Openings</th><th className={td}>Sizes</th></tr></thead>
        <tbody>{walls.map((w) => <tr key={w.id}><td className={td}>{w.direction}</td><td className={tn}>{fmt(w.siding, 0)}</td><td className={tn}>{fmt(w.masonry, 0)}</td><td className={tn}>{w.openings}</td><td className={td + " text-ink2"}>{w.openingsList.map((o) => o.dim).join(", ")}</td></tr>)}</tbody></table></div>}
    </div>
  );
}

/* ---------- Products ---------- */
function ProductsScreen({ R, onDone }) {
  return (
    <div className="max-w-2xl mx-auto p-4 flex flex-col gap-5">
      {PROFILE_GROUPS.map((g) => (
        <div key={g.key}>
          <div className="font-cond text-[20px] font-bold mb-2">{g.label}</div>
          <div className="grid gap-2 sm:grid-cols-2">
            {g.profiles.map((p) => {
              const sel = R.selection[g.key] === p.id;
              return (
                <button key={p.id} onClick={() => R.select(g.key, p.id)} className={`text-left rounded-2xl border-2 px-4 py-3 bg-card ${sel ? "border-brass bg-brassbg" : "border-rule"}`}>
                  <div className="font-semibold text-[16px]">{p.label}</div>
                  {p.desc && <div className="text-[13px] text-ink2 mt-0.5">{p.desc}</div>}
                </button>
              );
            })}
          </div>
        </div>
      ))}
      <button className="btn btn-primary" onClick={onDone}>See the list</button>
    </div>
  );
}
