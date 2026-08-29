import type { BodyType, Character, FieldConfig, FieldState } from "./types";
import { defaultFieldState } from "./data";
import { FIELD_IDS } from "./types";

export const MAX_HISTORY = 50;
const HISTORY_KEY = "persona.history.v3";
const LEGACY_KEYS = ["persona.history.v2", "persona.history.v1"];
const STATE_KEY = "persona.fields.v3";
const BODY_KEY = "persona.body.v1";

function canUseStorage(): boolean {
  return typeof window !== "undefined" && typeof localStorage !== "undefined";
}

export function loadHistory(): Character[] {
  if (!canUseStorage()) return [];
  try {
    let raw = localStorage.getItem(HISTORY_KEY);
    if (!raw) {
      for (const key of LEGACY_KEYS) {
        raw = localStorage.getItem(key);
        if (raw) break;
      }
    }
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    const items = parsed.map(normalizeCharacter).filter((item): item is Character => item !== null);
    return items.slice(0, MAX_HISTORY);
  } catch {
    return [];
  }
}

export function saveHistory(history: Character[]): void {
  if (!canUseStorage()) return;
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, MAX_HISTORY)));
  } catch {
    // quota / private mode
  }
}

export function pushHistory(history: Character[], character: Character): Character[] {
  const next = [character, ...history.filter((item) => item.id !== character.id)].slice(
    0,
    MAX_HISTORY,
  );
  saveHistory(next);
  return next;
}

export function loadFieldState(): FieldState {
  const fallback = defaultFieldState();
  if (!canUseStorage()) return fallback;
  try {
    const raw = localStorage.getItem(STATE_KEY) ?? localStorage.getItem("persona.fields.v1");
    if (!raw) return fallback;
    const parsed = JSON.parse(raw) as Partial<FieldState> & {
      age?: FieldConfig;
      conflict?: FieldConfig;
      archetype1?: FieldConfig;
      archetype2?: FieldConfig;
    };
    const next = defaultFieldState();
    for (const id of FIELD_IDS) {
      const value = parsed[id];
      if (value && typeof value.enabled === "boolean") {
        next[id] = {
          enabled: value.enabled,
          locked: Boolean(value.locked) && value.enabled,
        };
      }
    }
    if (!parsed.ageGroup && parsed.age && typeof parsed.age.enabled === "boolean") {
      next.ageGroup = {
        enabled: parsed.age.enabled,
        locked: Boolean(parsed.age.locked) && parsed.age.enabled,
      };
    }
    if (!parsed.plotTwist && parsed.conflict && typeof parsed.conflict.enabled === "boolean") {
      next.plotTwist = {
        enabled: parsed.conflict.enabled,
        locked: Boolean(parsed.conflict.locked) && parsed.conflict.enabled,
      };
    }
    if (!parsed.archetype && parsed.archetype1 && typeof parsed.archetype1.enabled === "boolean") {
      next.archetype = {
        enabled: parsed.archetype1.enabled,
        locked: Boolean(parsed.archetype1.locked) && parsed.archetype1.enabled,
      };
    }
    return next;
  } catch {
    return fallback;
  }
}

export function saveFieldState(state: FieldState): void {
  if (!canUseStorage()) return;
  try {
    localStorage.setItem(STATE_KEY, JSON.stringify(state));
  } catch {
    // ignore
  }
}

export function loadBodyType(): BodyType {
  if (!canUseStorage()) return "humanoid";
  try {
    const raw = localStorage.getItem(BODY_KEY);
    if (raw === "humanoid" || raw === "anthro" || raw === "feral" || raw === "monster") {
      return raw;
    }
  } catch {
    // ignore
  }
  return "humanoid";
}

export function saveBodyType(body: BodyType): void {
  if (!canUseStorage()) return;
  try {
    localStorage.setItem(BODY_KEY, body);
  } catch {
    // ignore
  }
}

function normalizeCharacter(value: unknown): Character | null {
  if (!value || typeof value !== "object") return null;
  const item = value as Character & {
    age?: string;
    conflict?: string;
    occupation?: string;
    archetype1?: string;
    archetype2?: string;
  };
  if (typeof item.id !== "string" || typeof item.createdAt !== "number") return null;
  if (!item.bodyType) item.bodyType = "humanoid";
  if (!item.ageGroup && item.age && !/\d/.test(item.age)) {
    item.ageGroup = item.age;
  }
  if (!item.plotTwist && item.conflict) item.plotTwist = item.conflict;
  if (!item.archetype && item.archetype1) item.archetype = item.archetype1;
  if (!item.occupationRole && item.occupation) {
    const parts = item.occupation.split("+").map((part) => part.trim());
    item.occupationRole = parts[0];
    item.occupationTag = parts[1] ?? "Странник";
  }
  delete item.age;
  delete item.conflict;
  delete item.occupation;
  delete item.archetype1;
  delete item.archetype2;
  return item;
}
