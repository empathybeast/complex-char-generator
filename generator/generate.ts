import {
  ageGroupsByBody,
  archetypesByBody,
  countries,
  fallbackCulture,
  feralNames,
  gendersByBody,
  marksByBody,
  monsterNames,
  namesByCountry,
  occupationRolesByBody,
  occupationTagsByBody,
  orientations,
  orientationsFeral,
  plotTwists,
  settingsByBody,
  speciesByBody,
  traits,
  type NameAtom,
  type NameCulture,
} from "./data";
import type { BodyType, Character, FieldId, FieldState } from "./types";

export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function pick<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)] as T;
}

export function shuffle<T>(arr: readonly T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = a[i] as T;
    a[i] = a[j] as T;
    a[j] = tmp;
  }
  return a;
}

export function pickUnique<T>(arr: readonly T[], count: number): T[] {
  const n = Math.max(0, Math.min(count, arr.length));
  return shuffle(arr).slice(0, n);
}

function newId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `per-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function formatBilingual(ru: string, en: string): string {
  return `${ru} / ${en}`;
}

function genderBucket(gender?: string): "f" | "m" | "u" {
  if (!gender) return "u";
  const g = gender.toLowerCase();
  if (
    g.includes("женщин") ||
    g.includes("самка") ||
    g.includes("женский")
  ) {
    return "f";
  }
  if (
    g.includes("мужчин") ||
    g.includes("самец") ||
    g.includes("мужской")
  ) {
    return "m";
  }
  return "u";
}

function joinName(order: NameCulture["order"], given: NameAtom, family?: NameAtom): string {
  if (!family) return formatBilingual(given.ru, given.en);
  if (order === "family-given") {
    return formatBilingual(`${family.ru} ${given.ru}`, `${family.en} ${given.en}`);
  }
  return formatBilingual(`${given.ru} ${family.ru}`, `${given.en} ${family.en}`);
}

function composeCultureName(culture: NameCulture, gender?: string): string {
  const bucket = genderBucket(gender);
  const givenPool =
    bucket === "f"
      ? [...culture.givenF, ...culture.givenU]
      : bucket === "m"
        ? [...culture.givenM, ...culture.givenU]
        : [...culture.givenU, ...culture.givenF, ...culture.givenM];
  const familyPool =
    bucket === "f"
      ? (culture.familyF ?? culture.familyAny ?? [])
      : bucket === "m"
        ? (culture.familyM ?? culture.familyAny ?? [])
        : (culture.familyAny ?? [...(culture.familyF ?? []), ...(culture.familyM ?? [])]);
  const given = pick(givenPool);
  const family = familyPool.length > 0 ? pick(familyPool) : undefined;
  return joinName(culture.order, given, family);
}

function generateName(body: BodyType, country?: string, gender?: string): string {
  if (body === "feral") {
    const atom = pick(feralNames);
    return formatBilingual(atom.ru, atom.en);
  }
  if (body === "monster") {
    const atom = pick(monsterNames);
    return formatBilingual(atom.ru, atom.en);
  }
  const culture = (country && namesByCountry[country]) || fallbackCulture;
  return composeCultureName(culture, gender);
}

type Context = {
  body: BodyType;
  country?: string;
  gender?: string;
  species?: string;
  setting?: string;
};

function poolIncludes(pool: readonly string[], value: string): boolean {
  return pool.some((item) => item.toLowerCase() === value.toLowerCase());
}

export function isValueValid(field: FieldId, value: unknown, body: BodyType): boolean {
  if (value === undefined || value === null) return false;
  switch (field) {
    case "gender":
      return typeof value === "string" && poolIncludes(gendersByBody[body], value);
    case "species":
      return typeof value === "string" && poolIncludes(speciesByBody[body], value);
    case "ageGroup":
      return typeof value === "string" && poolIncludes(ageGroupsByBody[body], value);
    case "setting":
      return typeof value === "string" && poolIncludes(settingsByBody[body], value);
    case "archetype":
      return typeof value === "string" && poolIncludes(archetypesByBody[body], value);
    case "orientation":
      return typeof value === "string" && poolIncludes(orientationPool(body), value);
    case "occupation":
      return true;
    case "marks":
      return Array.isArray(value) && value.every((item) => typeof item === "string");
    default:
      return true;
  }
}

function orientationPool(body: BodyType): readonly string[] {
  if (body === "feral" || body === "monster") return orientationsFeral;
  return orientations;
}

function generateOccupation(body: BodyType): { role: string; tag: string } {
  return {
    role: pick(occupationRolesByBody[body]),
    tag: pick(occupationTagsByBody[body]),
  };
}

function generateFieldValue(field: FieldId, ctx: Context): unknown {
  switch (field) {
    case "name":
      return generateName(ctx.body, ctx.country, ctx.gender);
    case "country":
      return pick(countries);
    case "gender":
      return pick(gendersByBody[ctx.body]);
    case "orientation":
      return pick(orientationPool(ctx.body));
    case "species":
      return pick(speciesByBody[ctx.body]);
    case "ageGroup":
      return pick(ageGroupsByBody[ctx.body]);
    case "setting":
      return pick(settingsByBody[ctx.body]);
    case "occupation":
      return generateOccupation(ctx.body);
    case "archetype":
      return pick(archetypesByBody[ctx.body]);
    case "marks":
      return pickUnique(marksByBody[ctx.body], randomInt(1, 3));
    case "traits":
      return pickUnique(traits, 2);
    case "plotTwist":
      return pick(plotTwists);
  }
}

const INDEPENDENT: FieldId[] = [
  "country",
  "gender",
  "orientation",
  "species",
  "setting",
  "archetype",
  "plotTwist",
];

const DEPENDENT: FieldId[] = ["name", "ageGroup", "occupation", "marks", "traits"];

function applyOccupation(next: Character, value: { role: string; tag: string }) {
  next.occupationRole = value.role;
  next.occupationTag = value.tag;
}

function keepLocked<K extends FieldId>(
  field: K,
  state: FieldState,
  previous: Character | undefined,
  body: BodyType,
): unknown {
  if (!state[field].enabled) return undefined;
  if (!state[field].locked || !previous) return undefined;
  if (field === "occupation") {
    if (!previous.occupationRole || !previous.occupationTag) return undefined;
    return { role: previous.occupationRole, tag: previous.occupationTag };
  }
  const current = previous[field as keyof Character];
  if (!isValueValid(field, current, body)) return undefined;
  return current;
}

export function generateCharacter(
  state: FieldState,
  body: BodyType,
  previous?: Character,
): Character {
  const next: Character = {
    id: newId(),
    createdAt: Date.now(),
    bodyType: body,
  };

  for (const field of INDEPENDENT) {
    if (!state[field].enabled) continue;
    const kept = keepLocked(field, state, previous, body);
    const value = kept !== undefined ? kept : generateFieldValue(field, { body });
    (next as Record<string, unknown>)[field] = value;
  }

  const ctx: Context = {
    body,
    country: next.country,
    gender: next.gender,
    species: next.species,
    setting: next.setting,
  };

  for (const field of DEPENDENT) {
    if (!state[field].enabled) continue;
    const kept = keepLocked(field, state, previous, body);
    const value = kept !== undefined ? kept : generateFieldValue(field, ctx);
    if (field === "occupation") {
      applyOccupation(next, value as { role: string; tag: string });
    } else {
      (next as Record<string, unknown>)[field] = value;
    }
  }

  return next;
}

export function rerollField(
  character: Character,
  field: FieldId,
  state: FieldState,
): Character {
  if (!state[field].enabled) return character;
  const ctx: Context = {
    body: character.bodyType,
    country: character.country,
    gender: character.gender,
    species: character.species,
    setting: character.setting,
  };
  const value = generateFieldValue(field, ctx);
  if (field === "occupation") {
    const occ = value as { role: string; tag: string };
    return { ...character, occupationRole: occ.role, occupationTag: occ.tag };
  }
  return { ...character, [field]: value };
}

export function enabledCount(state: FieldState): number {
  return Object.values(state).filter((f) => f.enabled).length;
}

export function allLocked(state: FieldState): boolean {
  const active = Object.values(state).filter((f) => f.enabled);
  return active.length > 0 && active.every((f) => f.locked);
}
