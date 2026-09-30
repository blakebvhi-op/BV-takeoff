import { blankMeasurements } from "../fields.js";

const arr = (x) => (x == null ? [] : Array.isArray(x) ? x : [x]);

/** Parse an EagleView measurement JSON export into a Takeoff object. */
export function parseEagleView(doc) {
  const ex = doc && doc.EAGLEVIEW_EXPORT;
  if (!ex) throw new Error("Not an EagleView measurement export (no EAGLEVIEW_EXPORT root).");

  const attrs = {};
  arr(ex.OVERALL_SUMMARY && ex.OVERALL_SUMMARY.ATTRIBUTE).forEach((a) => (attrs[a["@name"]] = a["@value"]));
  const num = (n) => { const v = parseFloat(attrs[n]); return Number.isFinite(v) ? v : 0; };

  const m = blankMeasurements();
  Object.assign(m, {
    roofArea: num("TotalRoofArea"),
    roofAreaNet: num("TotalRoofAreaLessPenetrations"),
    predominantPitch: parseFloat((attrs.PredominantPitch || "0").split("/")[0]) || 0,
    facets: num("TotalRoofFacets"),
    ridgeLen: num("TotalRidgesLength"), hipLen: num("TotalHipsLength"), valleyLen: num("TotalValleysLength"),
    rakeLen: num("TotalRakesLength"), eaveLen: num("TotalEavesLength"), fasciaLen: num("Fascia"),
    flashingLen: num("TotalFlashingLength"), stepFlashingLen: num("TotalStepFlashingLength"), parapetLen: num("TotalParapetsLength"),
    penetrationsCount: num("TotalPenetrationsCount"), penetrationsPerimeter: num("TotalPenetrationsPerimeter"),
    wasteSuggestedPct: num("SuggestedWastePercentage"),
    stories: parseInt(String(attrs.NumberOfStories || "").replace(/[^\d]/g, ""), 10) || 0,
    wallArea: num("TotalWallArea"), wallAreaNet: num("TotalWallAreaLessPenetrations"),
    sidingArea: num("TotalSidingArea"), sidingAreaNet: num("TotalSidingAreaLessPenetrations"),
    masonryArea: num("TotalMasonryArea"), masonryAreaNet: num("TotalMasonryAreaLessPenetrations"),
    outsideCornerLen: num("TotalOutsideSidingCornersLength") + num("TotalOutsideSidingToMasonryCornersLength"),
    insideCornerLen: num("TotalInsideSidingCornersLength") + num("TotalInsideSidingToMasonryCornersLength"),
    outsideCornerMasonryLen: num("TotalOutsideMasonryCornersLength"), insideCornerMasonryLen: num("TotalInsideMasonryCornersLength"),
    topSidingLen: num("TotalTopSidingWallsLength"), bottomSidingLen: num("TotalBottomSidingWallsLength"),
    openingsCount: num("TotalWindowsAndDoors"), openingsArea: num("TotalWindowsAndDoorsArea"), openingsPerimeter: num("TotalWindowsAndDoorsPerimeter"),
  });

  // Geometry
  const roof = ex.STRUCTURES && ex.STRUCTURES.ROOF;
  const faces = roof && roof.FACES ? arr(roof.FACES.FACE) : [];
  const lines = roof && roof.LINES ? arr(roof.LINES.LINE) : [];
  const byId = {}; faces.forEach((f) => (byId[f["@id"]] = f));
  const matLabel = {}; arr(ex.MATERIALS && ex.MATERIALS.MATERIAL).forEach((x) => (matLabel[x["@id"]] = x["@label"]));
  const subLabel = {}; arr(ex.SUBTYPES && ex.SUBTYPES.SUBTYPE).forEach((x) => (subLabel[x["@id"]] = x["@label"]));
  const size = (f) => parseFloat((f.POLYGON || {})["@unroundedsize"] || (f.POLYGON || {})["@size"] || 0) || 0;

  // Corner counts: each corner line of siding type is one physical corner
  const countType = (re) => lines.filter((l) => re.test(l["@type"] || "")).length;
  m.outsideCornerCount = countType(/^OUTSIDE_CORNER_SIDING/);
  m.insideCornerCount = countType(/^INSIDE_CORNER_SIDING/);

  const walls = faces.filter((f) => f["@type"] === "WALL").map((w) => {
    const kids = (w["@children"] || "").split(",").filter(Boolean).map((id) => byId[id]).filter(Boolean);
    const mats = kids.filter((k) => k["@type"] === "MATERIAL");
    const opens = kids.filter((k) => k["@type"] === "WALLPENETRATION");
    const area = (t) => mats.filter((k) => matLabel[k["@material"]] === t).reduce((s, k) => s + size(k), 0);
    return {
      id: w["@id"], direction: (w.POLYGON || {})["@direction"] || "", gross: size(w),
      siding: area("Siding"), masonry: area("Masonry"),
      openings: opens.length, openingsArea: opens.reduce((s, k) => s + size(k), 0),
      openingsList: opens.map((o) => ({ type: subLabel[o["@subType"]] || "Opening", dim: (o.POLYGON || {})["@dimension"] || "" })),
    };
  });
  const allOpens = faces.filter((f) => f["@type"] === "WALLPENETRATION");
  const cnt = (lbl) => allOpens.filter((o) => subLabel[o["@subType"]] === lbl).length;
  m.windowsCount = cnt("WINDOW"); m.doorsCount = cnt("DOOR") + cnt("MAIN_DOOR"); m.garageDoorsCount = cnt("GARAGE_DOOR");

  const planes = faces.filter((f) => f["@type"] === "ROOF").map((p) => ({
    id: p["@id"], direction: (p.POLYGON || {})["@direction"] || "", pitch: (p.POLYGON || {})["@pitch"] || "", area: size(p),
  }));
  const pitchAreas = Object.keys(attrs).filter((k) => k.startsWith("RoofAreaPerPitch:")).map((k) => ({ pitch: k.split(":")[1], area: parseFloat(attrs[k]) || 0 }));

  const loc = ex.LOCATION || {};
  return {
    source: "eagleview",
    reportId: (ex.REPORT || {})["@reportId"] || "",
    address: [loc["@address"], loc["@city"], loc["@state"], loc["@postal"]].filter(Boolean).join(", "),
    measurements: m, walls, planes, pitchAreas,
  };
}
