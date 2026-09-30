// The one flat measurement object every source produces and every rule reads.
// [key, label, unit, group]
export const FIELDS = [
  ["roofArea", "Roof area (gross)", "sq ft", "Roof"],
  ["roofAreaNet", "Roof area less penetrations", "sq ft", "Roof"],
  ["predominantPitch", "Predominant pitch", "/12", "Roof"],
  ["facets", "Roof facets", "ea", "Roof"],
  ["ridgeLen", "Ridge", "ft", "Roof"],
  ["hipLen", "Hip", "ft", "Roof"],
  ["valleyLen", "Valley", "ft", "Roof"],
  ["rakeLen", "Rake", "ft", "Roof"],
  ["eaveLen", "Eave", "ft", "Roof"],
  ["fasciaLen", "Fascia", "ft", "Roof"],
  ["flashingLen", "Flashing", "ft", "Roof"],
  ["stepFlashingLen", "Step flashing", "ft", "Roof"],
  ["parapetLen", "Parapet", "ft", "Roof"],
  ["penetrationsCount", "Roof penetrations", "ea", "Roof"],
  ["penetrationsPerimeter", "Penetration perimeter", "ft", "Roof"],
  ["wasteSuggestedPct", "EagleView suggested waste", "%", "Roof"],
  ["stories", "Stories", "", "Walls"],
  ["wallArea", "Wall area (gross)", "sq ft", "Walls"],
  ["wallAreaNet", "Wall area less openings", "sq ft", "Walls"],
  ["sidingArea", "Siding area (gross)", "sq ft", "Walls"],
  ["sidingAreaNet", "Siding area less openings", "sq ft", "Walls"],
  ["masonryArea", "Masonry area (gross)", "sq ft", "Walls"],
  ["masonryAreaNet", "Masonry area less openings", "sq ft", "Walls"],
  ["outsideCornerLen", "Outside corners (siding)", "ft", "Walls"],
  ["insideCornerLen", "Inside corners (siding)", "ft", "Walls"],
  ["outsideCornerCount", "Outside corners", "ea", "Walls"],
  ["insideCornerCount", "Inside corners", "ea", "Walls"],
  ["outsideCornerMasonryLen", "Outside corners (masonry)", "ft", "Walls"],
  ["insideCornerMasonryLen", "Inside corners (masonry)", "ft", "Walls"],
  ["topSidingLen", "Top of siding", "ft", "Walls"],
  ["bottomSidingLen", "Bottom of siding", "ft", "Walls"],
  ["soffitDepth", "Soffit overhang (assumed)", "ft", "Walls"],
  ["openingsCount", "Windows and doors", "ea", "Openings"],
  ["openingsArea", "Opening area", "sq ft", "Openings"],
  ["openingsPerimeter", "Opening perimeter", "ft", "Openings"],
  ["windowsCount", "Windows", "ea", "Openings"],
  ["doorsCount", "Doors", "ea", "Openings"],
  ["garageDoorsCount", "Garage doors", "ea", "Openings"],
];

export const FIELD_KEYS = FIELDS.map((f) => f[0]);

export function blankMeasurements() {
  const m = {};
  FIELD_KEYS.forEach((k) => (m[k] = 0));
  m.soffitDepth = 1.5;
  return m;
}

// What every source hands back.
export function emptyTakeoff(source = "manual") {
  return { source, reportId: "", address: "", measurements: blankMeasurements(), walls: [], planes: [], pitchAreas: [] };
}
