import { BODY_TYPE_LABELS, FIELD_LABELS } from "./data";
import { FIELD_IDS, type Character, type FieldId } from "./types";

export function capitalize(text: string): string {
  const trimmed = text.trim();
  if (!trimmed) return trimmed;
  return trimmed.charAt(0).toLocaleUpperCase("ru-RU") + trimmed.slice(1);
}

export function occupationLine(character: Character): string | null {
  if (!character.occupationRole || !character.occupationTag) return null;
  return `${character.occupationRole} + ${character.occupationTag}`;
}

function formatValue(field: FieldId, character: Character): string | null {
  if (field === "occupation") return occupationLine(character);
  const value = character[field as keyof Character];
  if (value === undefined) return null;
  if (Array.isArray(value)) {
    if (value.length === 0) return null;
    return value.map((item) => capitalize(String(item))).join(", ");
  }
  return capitalize(String(value));
}

export function formatCharacterText(character: Character): string {
  const lines: string[] = [
    "— карточка персонажа —",
    `Морфология: ${BODY_TYPE_LABELS[character.bodyType]}`,
  ];
  for (const field of FIELD_IDS) {
    const formatted = formatValue(field, character);
    if (formatted) {
      lines.push(`${FIELD_LABELS[field]}: ${formatted}`);
    }
  }
  return lines.join("\n");
}

export function dossierCode(id: string): string {
  const compact = id.replace(/-/g, "").slice(0, 4).toUpperCase();
  return `PER-${compact || "0000"}`;
}

export function characterTitle(character: Character): string {
  return character.name ?? character.species ?? "Безымянный / Nameless";
}

export function characterSubtitle(character: Character): string {
  return [character.species, character.ageGroup].filter(Boolean).join(" · ");
}

export function ruName(full: string): string {
  const [ru] = full.split(" / ");
  return (ru ?? full).trim();
}
