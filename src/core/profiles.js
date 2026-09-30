// Material profiles. Pick one per section; its rules feed the engine.
// Coverage numbers are common product specs — edit them in the app to match what you actually order.

const R = (sec) => (name, f, waste, per, pack, round, unit, basis) => ({ sec, name, f, waste, per, pack, round, unit, basis });

// ---------- SIDING ----------
const S = R("Siding");

const vinylAccessories = (jExtra = "") => [
  S("House wrap", "wallAreaNet", 10, 900, 1, "up", "roll", "9 x 100 ft roll"),
  S("Outside corner posts", "outsideCornerLen", 5, 10, 1, "up", "stick", "10 ft"),
  S("Inside corner posts", "insideCornerLen", 5, 10, 1, "up", "stick", "10 ft"),
  S("J-channel", "openingsPerimeter + rakeLen + eaveLen" + jExtra, 10, 12.5, 1, "up", "stick", "12.5 ft — around openings, under rakes and eaves"),
  S("Starter strip", "bottomSidingLen", 5, 10, 1, "up", "stick", "10 ft"),
  S("Utility trim", "topSidingLen + openingsPerimeter/4", 10, 12.5, 1, "up", "stick", "12.5 ft — top course and under windows"),
  S("Siding nails", "sidingAreaNet/100 * 2", 0, 1, 1, "up", "lb", "2 lb per square"),
];

export const SIDING_PROFILES = [
  {
    id: "vinyl-d4", label: "Vinyl D4", desc: "Double 4 in. lap, 12 ft 6 in. panels, 2 sq per box",
    rules: [
      S("Vinyl D4 siding", "sidingAreaNet", 10, 100, 1, "up2", "sq"),
      S("Vinyl D4 boxes", "sidingAreaNet", 10, 200, 1, "up", "box", "2 sq per box"),
      ...vinylAccessories(),
    ],
  },
  {
    id: "vinyl-d5", label: "Vinyl D5", desc: "Double 5 in. lap, 12 ft 6 in. panels, 2 sq per box",
    rules: [
      S("Vinyl D5 siding", "sidingAreaNet", 10, 100, 1, "up2", "sq"),
      S("Vinyl D5 boxes", "sidingAreaNet", 10, 200, 1, "up", "box", "2 sq per box"),
      ...vinylAccessories(),
    ],
  },
  {
    id: "vinyl-dutch", label: "Vinyl Dutch lap D4.5", desc: "Double 4.5 in. Dutch lap, 2 sq per box",
    rules: [
      S("Vinyl Dutch lap siding", "sidingAreaNet", 10, 100, 1, "up2", "sq"),
      S("Vinyl Dutch lap boxes", "sidingAreaNet", 10, 200, 1, "up", "box", "2 sq per box"),
      ...vinylAccessories(),
    ],
  },
  {
    id: "vinyl-bb", label: "Vinyl board & batten", desc: "Vertical 7 in. board & batten panels, 10 ft, 2 sq per box",
    rules: [
      S("Vinyl B&B siding", "sidingAreaNet", 12, 100, 1, "up2", "sq", "vertical — extra cutting waste"),
      S("Vinyl B&B boxes", "sidingAreaNet", 12, 200, 1, "up", "box", "2 sq per box"),
      S("House wrap", "wallAreaNet", 10, 900, 1, "up", "roll", "9 x 100 ft roll"),
      S("Outside corner posts", "outsideCornerLen", 5, 10, 1, "up", "stick", "10 ft"),
      S("Inside corner posts", "insideCornerLen", 5, 10, 1, "up", "stick", "10 ft"),
      S("J-channel", "openingsPerimeter + rakeLen + eaveLen + bottomSidingLen", 10, 12.5, 1, "up", "stick", "12.5 ft — openings, rakes, eaves and bottom receiver"),
      S("Utility trim", "topSidingLen", 10, 12.5, 1, "up", "stick", "12.5 ft — top receiver"),
      S("Siding nails", "sidingAreaNet/100 * 2", 0, 1, 1, "up", "lb"),
    ],
  },
  {
    id: "lp-lap-8", label: "LP SmartSide lap 8 in.", desc: "8 in. x 16 ft lap (76 series), 7 in. exposure — 9.33 sq ft per piece",
    rules: [
      S("LP SmartSide 8 in. lap", "sidingAreaNet", 12, 9.333, 1, "up", "pc", "16 ft x 7 in. exposure = 9.33 sq ft"),
      S("House wrap", "wallAreaNet", 10, 900, 1, "up", "roll", "9 x 100 ft roll"),
      S("LP 4/4 x 4 trim — corners", "outsideCornerLen*2 + insideCornerLen*2", 5, 16, 1, "up", "pc", "16 ft — two boards per corner"),
      S("LP 4/4 x 4 trim — openings", "openingsPerimeter", 10, 16, 1, "up", "pc", "16 ft — window and door casing"),
      S("LP 4/4 x 6 trim — frieze", "topSidingLen", 5, 16, 1, "up", "pc", "16 ft — under soffit"),
      S("Starter strip", "bottomSidingLen", 5, 16, 1, "up", "pc", "16 ft"),
      S("Z-flashing", "openingsPerimeter/4 + topSidingLen", 10, 10, 1, "up", "stick", "10 ft — over horizontal trim"),
      S("Butt joint covers", "sidingAreaNet / 9.333", 5, 1, 50, "up", "ea", "one per lap piece"),
      S("Siding nails 8d HDG", "sidingAreaNet/100 * 2.5", 0, 1, 1, "up", "lb", "2 per stud per course"),
      S("Sealant", "openingsPerimeter + outsideCornerLen*2 + insideCornerLen*2", 0, 25, 1, "up", "tube", "25 ft per tube"),
      S("Touch-up / cut-edge paint", "sidingAreaNet", 0, 800, 1, "up", "gal", "primed product — cut edges"),
    ],
  },
  {
    id: "lp-lap-6", label: "LP SmartSide lap 6 in.", desc: "6 in. x 16 ft lap, 5 in. exposure — 6.67 sq ft per piece",
    rules: [
      S("LP SmartSide 6 in. lap", "sidingAreaNet", 12, 6.667, 1, "up", "pc", "16 ft x 5 in. exposure = 6.67 sq ft"),
      S("House wrap", "wallAreaNet", 10, 900, 1, "up", "roll", "9 x 100 ft roll"),
      S("LP 4/4 x 4 trim — corners", "outsideCornerLen*2 + insideCornerLen*2", 5, 16, 1, "up", "pc", "16 ft — two boards per corner"),
      S("LP 4/4 x 4 trim — openings", "openingsPerimeter", 10, 16, 1, "up", "pc", "16 ft"),
      S("LP 4/4 x 6 trim — frieze", "topSidingLen", 5, 16, 1, "up", "pc", "16 ft"),
      S("Starter strip", "bottomSidingLen", 5, 16, 1, "up", "pc", "16 ft"),
      S("Z-flashing", "openingsPerimeter/4 + topSidingLen", 10, 10, 1, "up", "stick", "10 ft"),
      S("Butt joint covers", "sidingAreaNet / 6.667", 5, 1, 50, "up", "ea", "one per lap piece"),
      S("Siding nails 8d HDG", "sidingAreaNet/100 * 3", 0, 1, 1, "up", "lb"),
      S("Sealant", "openingsPerimeter + outsideCornerLen*2 + insideCornerLen*2", 0, 25, 1, "up", "tube", "25 ft per tube"),
    ],
  },
  {
    id: "lp-panel-bb", label: "LP SmartSide panel — board & batten", desc: "4 x 8 vertical panel with 4/4 x 3 battens at 16 in. o.c.",
    rules: [
      S("LP SmartSide 4x8 panel", "sidingAreaNet", 12, 32, 1, "up", "sheet", "32 sq ft — vertical, cut waste"),
      S("LP 4/4 x 3 battens", "sidingAreaNet / 1.333", 5, 16, 1, "up", "pc", "16 ft — battens 16 in. o.c.: area ÷ spacing"),
      S("House wrap", "wallAreaNet", 10, 900, 1, "up", "roll", "9 x 100 ft roll"),
      S("LP 4/4 x 4 trim — corners", "outsideCornerLen*2 + insideCornerLen*2", 5, 16, 1, "up", "pc", "16 ft"),
      S("LP 4/4 x 4 trim — openings", "openingsPerimeter", 10, 16, 1, "up", "pc", "16 ft"),
      S("LP 4/4 x 6 trim — frieze", "topSidingLen", 5, 16, 1, "up", "pc", "16 ft"),
      S("Z-flashing", "openingsPerimeter/4 + topSidingLen", 10, 10, 1, "up", "stick", "10 ft — over horizontal trim and panel joints on 2-story"),
      S("Panel nails 8d HDG", "sidingAreaNet/100 * 3", 0, 1, 1, "up", "lb"),
      S("Sealant", "openingsPerimeter + outsideCornerLen*2 + sidingAreaNet/32*8", 0, 25, 1, "up", "tube", "25 ft — trim and vertical panel joints"),
    ],
  },
  {
    id: "hardie-plank", label: "Fiber cement lap 8.25 in.", desc: "HardiePlank-style 8.25 in. x 12 ft, 7 in. exposure — 7 sq ft per piece",
    rules: [
      S("Fiber cement 8.25 in. plank", "sidingAreaNet", 12, 7, 1, "up", "pc", "12 ft x 7 in. exposure = 7 sq ft"),
      S("House wrap", "wallAreaNet", 10, 900, 1, "up", "roll", "9 x 100 ft roll"),
      S("Fiber cement 4/4 x 3.5 trim — corners", "outsideCornerLen*2 + insideCornerLen*2", 5, 12, 1, "up", "pc", "12 ft — two boards per corner"),
      S("Fiber cement 4/4 x 3.5 trim — openings", "openingsPerimeter", 10, 12, 1, "up", "pc", "12 ft"),
      S("Fiber cement 4/4 x 5.5 trim — frieze", "topSidingLen", 5, 12, 1, "up", "pc", "12 ft"),
      S("Starter strip", "bottomSidingLen", 5, 12, 1, "up", "pc", "12 ft"),
      S("Z-flashing", "openingsPerimeter/4 + topSidingLen", 10, 10, 1, "up", "stick", "10 ft"),
      S("Joint flashing", "sidingAreaNet / 7", 5, 1, 50, "up", "ea", "one per plank butt joint"),
      S("Siding nails 6d stainless/HDG", "sidingAreaNet/100 * 2.5", 0, 1, 1, "up", "lb"),
      S("Sealant", "openingsPerimeter + outsideCornerLen*2 + insideCornerLen*2", 0, 25, 1, "up", "tube", "25 ft per tube"),
    ],
  },
  {
    id: "steel-lap", label: "Steel / aluminum lap 8 in.", desc: "8 in. x 12 ft 6 in. metal lap, 2 sq per box",
    rules: [
      S("Metal lap siding", "sidingAreaNet", 10, 100, 1, "up2", "sq"),
      S("Metal lap boxes", "sidingAreaNet", 10, 200, 1, "up", "box", "2 sq per box"),
      S("House wrap", "wallAreaNet", 10, 900, 1, "up", "roll", "9 x 100 ft roll"),
      S("Outside corner posts", "outsideCornerLen", 5, 10, 1, "up", "stick", "10 ft"),
      S("Inside corner posts", "insideCornerLen", 5, 10, 1, "up", "stick", "10 ft"),
      S("J-channel", "openingsPerimeter + rakeLen + eaveLen", 10, 12.5, 1, "up", "stick", "12.5 ft"),
      S("Starter strip", "bottomSidingLen", 5, 10, 1, "up", "stick", "10 ft"),
      S("Utility trim", "topSidingLen + openingsPerimeter/4", 10, 12.5, 1, "up", "stick", "12.5 ft"),
      S("Siding nails", "sidingAreaNet/100 * 2", 0, 1, 1, "up", "lb"),
    ],
  },
];

// ---------- ROOFING ----------
const RF = R("Roofing");
const asphaltCommon = [
  RF("Starter strip", "eaveLen + rakeLen", 5, 100, 1, "up", "roll", "100 ft roll"),
  RF("Ice & water shield", "eaveLen*6 + valleyLen*3 + penetrationsPerimeter*1.5", 5, 200, 1, "up", "roll", "6 ft up from eaves, 3 ft in valleys, 2-sq roll"),
  RF("Synthetic underlayment", "roofAreaNet - (eaveLen*6 + valleyLen*3)", 10, 1000, 1, "up", "roll", "10-sq roll"),
  RF("Drip edge", "eaveLen + rakeLen", 5, 10, 1, "up", "stick", "10 ft"),
  RF("Ridge vent", "ridgeLen", 0, 4, 1, "up", "pc", "4 ft"),
  RF("Valley metal", "valleyLen", 5, 10, 1, "up", "stick", "10 ft"),
  RF("Step flashing", "stepFlashingLen / 0.5", 10, 1, 100, "up", "pc", "6 in. exposure"),
  RF("Pipe boots", "penetrationsCount", 0, 1, 1, "up", "ea"),
  RF("Coil roofing nails", "roofAreaNet/100 * 1.75", 0, 1, 1, "up", "lb"),
  RF("Cap nails", "roofAreaNet/100", 0, 20, 1, "up", "box", "1 box per 20 sq"),
];

export const ROOFING_PROFILES = [
  {
    id: "arch-shingle", label: "Architectural shingles", desc: "Laminated asphalt, 3 bundles per square, 20 ft ridge cap per bundle",
    rules: [
      RF("Shingles", "roofAreaNet", 10, 100, 1, "up2", "sq"),
      RF("Shingle bundles", "roofAreaNet", 10, 33.333, 3, "up", "bdl", "3 per square"),
      RF("Hip & ridge cap", "ridgeLen + hipLen", 5, 20, 1, "up", "bdl", "20 ft per bundle"),
      ...asphaltCommon,
    ],
  },
  {
    id: "3tab", label: "3-tab shingles", desc: "3-tab asphalt, 3 bundles per square, ridge cut from field shingles (35 ft per bundle)",
    rules: [
      RF("Shingles", "roofAreaNet", 10, 100, 1, "up2", "sq"),
      RF("Shingle bundles", "roofAreaNet", 10, 33.333, 3, "up", "bdl", "3 per square"),
      RF("Ridge bundles (cut 3-tab)", "ridgeLen + hipLen", 5, 35, 1, "up", "bdl", "35 ft per bundle"),
      ...asphaltCommon,
    ],
  },
  {
    id: "standing-seam", label: "Standing seam metal", desc: "16 in. panels — panel footage is estimated from area, not eave-to-ridge lengths",
    rules: [
      RF("Standing seam panel", "roofAreaNet / 1.333", 8, 1, 1, "up", "ft", "16 in. coverage — order by plane lengths, this is total footage"),
      RF("Ridge cap", "ridgeLen + hipLen", 5, 10, 1, "up", "pc", "10 ft"),
      RF("Eave / drip trim", "eaveLen", 5, 10, 1, "up", "pc", "10 ft"),
      RF("Gable / rake trim", "rakeLen", 5, 10, 1, "up", "pc", "10 ft"),
      RF("Valley trim", "valleyLen", 5, 10, 1, "up", "pc", "10 ft"),
      RF("Panel clips", "roofAreaNet / 1.333 / 2", 5, 1, 100, "up", "ea", "one per 2 ft of panel"),
      RF("Ice & water shield (full)", "roofAreaNet", 5, 200, 1, "up", "roll", "high-temp, whole deck, 2-sq roll"),
      RF("Pipe boots (metal)", "penetrationsCount", 0, 1, 1, "up", "ea"),
      RF("Pancake screws", "roofAreaNet / 1.333 / 2 * 2", 0, 1, 250, "up", "ea", "two per clip"),
      RF("Butyl tape", "ridgeLen + hipLen + eaveLen", 0, 45, 1, "up", "roll", "45 ft roll"),
    ],
  },
];

// ---------- SOFFIT & FASCIA ----------
const T = R("Soffit & fascia");
export const TRIM_PROFILES = [
  {
    id: "alum", label: "Aluminum soffit & fascia", desc: "12 ft aluminum fascia, 12 ft vented soffit panel, F-channel",
    rules: [
      T("Aluminum fascia", "fasciaLen", 5, 12, 1, "up", "pc", "12 ft"),
      T("Soffit panel", "eaveLen * soffitDepth", 10, 12, 1, "up", "pc", "12 ft panel — uses assumed overhang"),
      T("F-channel", "eaveLen", 5, 12, 1, "up", "stick", "12 ft"),
      T("Trim coil", "fasciaLen + openingsPerimeter", 0, 300, 1, "up", "roll", "24 in. x 50 ft coil ≈ 300 ft of wrap"),
      T("Trim nails", "fasciaLen/100", 0, 1, 1, "up", "lb"),
    ],
  },
  {
    id: "lp-soffit", label: "LP SmartSide soffit & fascia", desc: "4/4 x 8 fascia 16 ft, 16 in. or 12 in. soffit strips",
    rules: [
      T("LP 4/4 x 8 fascia", "fasciaLen", 5, 16, 1, "up", "pc", "16 ft"),
      T("LP soffit 16 in. x 16 ft", "eaveLen * soffitDepth", 10, 21.333, 1, "up", "pc", "16 x 16 in. = 21.3 sq ft — assumed overhang"),
      T("Soffit vents", "eaveLen", 0, 8, 1, "up", "ea", "one every 8 ft"),
      T("Nails 8d HDG", "fasciaLen/50", 0, 1, 1, "up", "lb"),
    ],
  },
  { id: "none", label: "No soffit or fascia", desc: "", rules: [] },
];

export const PROFILE_GROUPS = [
  { key: "roofing", label: "Roofing", profiles: ROOFING_PROFILES },
  { key: "siding", label: "Siding", profiles: SIDING_PROFILES },
  { key: "trim", label: "Soffit & fascia", profiles: TRIM_PROFILES },
];

export const DEFAULT_SELECTION = { roofing: "arch-shingle", siding: "vinyl-d4", trim: "alum" };

export function findProfile(group, id) {
  const g = PROFILE_GROUPS.find((x) => x.key === group);
  return g.profiles.find((p) => p.id === id) || g.profiles[0];
}
