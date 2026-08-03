type ZodiacEntry = { name: string; from: [number, number]; element: string };

const ZODIAC: ZodiacEntry[] = [
  { name: "Capricorn", from: [1, 1], element: "earth" },
  { name: "Aquarius", from: [1, 20], element: "air" },
  { name: "Pisces", from: [2, 19], element: "water" },
  { name: "Aries", from: [3, 21], element: "fire" },
  { name: "Taurus", from: [4, 20], element: "earth" },
  { name: "Gemini", from: [5, 21], element: "air" },
  { name: "Cancer", from: [6, 21], element: "water" },
  { name: "Leo", from: [7, 23], element: "fire" },
  { name: "Virgo", from: [8, 23], element: "earth" },
  { name: "Libra", from: [9, 23], element: "air" },
  { name: "Scorpio", from: [10, 23], element: "water" },
  { name: "Sagittarius", from: [11, 22], element: "fire" },
  { name: "Capricorn", from: [12, 22], element: "earth" },
] as const;

const SIGNS = [
  "Aries",
  "Taurus",
  "Gemini",
  "Cancer",
  "Leo",
  "Virgo",
  "Libra",
  "Scorpio",
  "Sagittarius",
  "Capricorn",
  "Aquarius",
  "Pisces",
] as const;

const ELEMENT_NOTE: Record<string, string> = {
  fire: "moves first and explains later",
  earth: "builds slowly and keeps what it builds",
  air: "thinks out loud and needs an audience",
  water: "feels the shift before anyone announces it",
};

export function sunSign(dob: string | null | undefined): string | null {
  if (!dob) return null;
  const [, m, d] = dob.split("-").map(Number);
  if (!m || !d) return null;
  let current = ZODIAC[0]!;
  for (const z of ZODIAC) {
    const [zm, zd] = z.from;
    if (m > zm! || (m === zm && d >= zd!)) current = z;
  }
  return current.name;
}

function elementOf(sign: string | null): string {
  const found = ZODIAC.find((z) => z.name === sign);
  return found?.element ?? "air";
}

function hash(input: string): number {
  let h = 0;
  for (let i = 0; i < input.length; i += 1) h = (h * 31 + input.charCodeAt(i)) % 100000;
  return h;
}

/**
 * Mock birth-chart summary. Deterministic from the user's birth data —
 * illustrative only, not a real ephemeris calculation.
 */
export function birthChartSummary(profile: {
  name?: string | null;
  dob?: string | null;
  tob?: string | null;
  place_of_birth?: string | null;
}): { sun: string; moon: string; rising: string; paragraph: string } | null {
  const sun = sunSign(profile.dob);
  if (!sun) return null;

  const seed = hash(`${profile.dob ?? ""}|${profile.tob ?? ""}|${profile.place_of_birth ?? ""}`);
  const moon = SIGNS[seed % 12]!;
  const rising = SIGNS[(seed >> 3) % 12]!;
  const element = elementOf(sun);
  const hour = Number((profile.tob ?? "12:00").split(":")[0] ?? 12);
  const daypart = hour < 6 ? "pre-dawn" : hour < 12 ? "morning" : hour < 18 ? "afternoon" : "night";
  const place = profile.place_of_birth?.trim() || "an unrecorded place";

  const paragraph = `Born in the ${daypart} in ${place}, you carry a ${sun} Sun — the part of you that ${ELEMENT_NOTE[element]}. Your ${moon} Moon runs quieter underneath it, handling everything you don't say out loud, which is why your reactions often arrive a beat after the moment does. With ${rising} rising, people tend to read you correctly on the second meeting rather than the first. Practically: your strongest windows land when you let the ${sun} side set the direction and the ${moon} side set the pace. This is a mock summary generated from your birth data — the verification record on your predictions is the part that's real.`;

  return { sun, moon, rising, paragraph };
}
