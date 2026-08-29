import { BODY_TYPE_LABELS, FIELD_LABELS } from "./data";
import { characterTitle, dossierCode, occupationLine } from "./format";
import { FIELD_IDS, type Character, type FieldId } from "./types";

const W = 1600;
const H = 900;
const MARGIN = 64;

const NAVY = "#020F29";
const INK = "#000000";
const ICE = "#ABDCF4";
const ICE_2 = "#9BD6F2";
const MUTED = "rgba(171,220,244,0.72)";
const LINE = "rgba(171,220,244,0.55)";
const LINE_SOFT = "rgba(171,220,244,0.32)";

function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (ctx.measureText(next).width <= maxWidth) {
      current = next;
      continue;
    }
    if (current) lines.push(current);
    current = word;
  }
  if (current) lines.push(current);
  return lines.length > 0 ? lines : [text];
}

function fieldText(field: FieldId, character: Character): string | null {
  if (field === "occupation") return occupationLine(character);
  const value = character[field as keyof Character];
  if (value === undefined) return null;
  if (Array.isArray(value)) {
    if (value.length === 0) return null;
    return value.join(" · ");
  }
  return String(value);
}

function flourish(ctx: CanvasRenderingContext2D, x: number, y: number, dx: number, dy: number) {
  ctx.save();
  ctx.strokeStyle = ICE;
  ctx.fillStyle = ICE;
  ctx.lineWidth = 1.35;
  ctx.lineCap = "round";
  ctx.globalAlpha = 0.95;
  ctx.beginPath();
  ctx.moveTo(x, y + 52 * dy);
  ctx.lineTo(x, y + 12 * dy);
  ctx.quadraticCurveTo(x, y, x + 12 * dx, y);
  ctx.lineTo(x + 52 * dx, y);
  ctx.stroke();
  ctx.globalAlpha = 0.72;
  ctx.beginPath();
  ctx.moveTo(x + 9 * dx, y + 42 * dy);
  ctx.lineTo(x + 9 * dx, y + 16 * dy);
  ctx.quadraticCurveTo(x + 9 * dx, y + 9 * dy, x + 16 * dx, y + 9 * dy);
  ctx.lineTo(x + 42 * dx, y + 9 * dy);
  ctx.stroke();
  ctx.globalAlpha = 0.92;
  ctx.beginPath();
  ctx.moveTo(x + 40 * dx, y + 9 * dy);
  ctx.bezierCurveTo(
    x + 60 * dx,
    y + 8 * dy,
    x + 64 * dx,
    y + 30 * dy,
    x + 44 * dx,
    y + 34 * dy,
  );
  ctx.bezierCurveTo(
    x + 26 * dx,
    y + 38 * dy,
    x + 26 * dx,
    y + 14 * dy,
    x + 50 * dx,
    y + 18 * dy,
  );
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x + 9 * dx, y + 40 * dy);
  ctx.bezierCurveTo(
    x + 8 * dx,
    y + 58 * dy,
    x + 30 * dx,
    y + 62 * dy,
    x + 34 * dx,
    y + 42 * dy,
  );
  ctx.bezierCurveTo(
    x + 38 * dx,
    y + 24 * dy,
    x + 14 * dx,
    y + 24 * dy,
    x + 18 * dx,
    y + 50 * dy,
  );
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x + 22 * dx, y);
  ctx.lineTo(x + 22 * dx, y + 8 * dy);
  ctx.moveTo(x + 32 * dx, y);
  ctx.lineTo(x + 32 * dx, y + 5 * dy);
  ctx.moveTo(x, y + 22 * dy);
  ctx.lineTo(x + 8 * dx, y + 22 * dy);
  ctx.moveTo(x, y + 32 * dy);
  ctx.lineTo(x + 5 * dx, y + 32 * dy);
  ctx.stroke();
  diamond(ctx, x + 18 * dx, y + 18 * dy, 5.5);
  ctx.beginPath();
  ctx.arc(x, y, 2.4, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(x + 40 * dx, y + 9 * dy, 1.4, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function windowBox(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
) {
  ctx.fillStyle = "rgba(171,220,244,0.16)";
  roundRect(ctx, x, y, w, h, 8);
  ctx.fill();
  ctx.strokeStyle = ICE;
  ctx.globalAlpha = 0.95;
  ctx.lineWidth = 1.4;
  ctx.stroke();
  ctx.globalAlpha = 0.45;
  ctx.lineWidth = 1;
  roundRect(ctx, x + 4, y + 4, w - 8, h - 8, 5);
  ctx.stroke();
  ctx.globalAlpha = 0.9;
  ctx.lineWidth = 1.2;
  const inset = 7;
  const tick = 8;
  ctx.beginPath();
  ctx.moveTo(x + inset, y + inset);
  ctx.lineTo(x + inset + tick, y + inset);
  ctx.moveTo(x + inset, y + inset);
  ctx.lineTo(x + inset, y + inset + tick);
  ctx.moveTo(x + w - inset, y + inset);
  ctx.lineTo(x + w - inset - tick, y + inset);
  ctx.moveTo(x + w - inset, y + inset);
  ctx.lineTo(x + w - inset, y + inset + tick);
  ctx.moveTo(x + inset, y + h - inset);
  ctx.lineTo(x + inset + tick, y + h - inset);
  ctx.moveTo(x + inset, y + h - inset);
  ctx.lineTo(x + inset, y + h - inset - tick);
  ctx.moveTo(x + w - inset, y + h - inset);
  ctx.lineTo(x + w - inset - tick, y + h - inset);
  ctx.moveTo(x + w - inset, y + h - inset);
  ctx.lineTo(x + w - inset, y + h - inset - tick);
  ctx.stroke();
  ctx.globalAlpha = 1;
}

function diamond(ctx: CanvasRenderingContext2D, x: number, y: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x, y - r);
  ctx.lineTo(x + r, y);
  ctx.lineTo(x, y + r);
  ctx.lineTo(x - r, y);
  ctx.closePath();
  ctx.fill();
}

function scallopRow(
  ctx: CanvasRenderingContext2D,
  x1: number,
  x2: number,
  y: number,
  amp: number,
) {
  const step = 22;
  ctx.beginPath();
  ctx.moveTo(x1, y);
  for (let x = x1; x < x2; x += step) {
    const mid = Math.min(x + step / 2, x2);
    const end = Math.min(x + step, x2);
    ctx.quadraticCurveTo(mid, y + amp, end, y);
  }
  ctx.stroke();
}

function scallopCol(
  ctx: CanvasRenderingContext2D,
  y1: number,
  y2: number,
  x: number,
  amp: number,
) {
  const step = 22;
  ctx.beginPath();
  ctx.moveTo(x, y1);
  for (let y = y1; y < y2; y += step) {
    const mid = Math.min(y + step / 2, y2);
    const end = Math.min(y + step, y2);
    ctx.quadraticCurveTo(x + amp, mid, x, end);
  }
  ctx.stroke();
}

function edgeJewel(ctx: CanvasRenderingContext2D, x: number, y: number) {
  ctx.save();
  ctx.fillStyle = ICE;
  ctx.strokeStyle = ICE;
  ctx.globalAlpha = 0.95;
  diamond(ctx, x, y, 6);
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(x - 16, y);
  ctx.lineTo(x - 7, y);
  ctx.moveTo(x + 7, y);
  ctx.lineTo(x + 16, y);
  ctx.stroke();
  ctx.restore();
}

async function ensureFonts(): Promise<void> {
  if (typeof document === "undefined" || !document.fonts) return;
  await Promise.all([
    document.fonts.load('600 56px "EB Garamond"'),
    document.fonts.load('italic 400 22px "EB Garamond"'),
    document.fonts.load('500 13px "Cinzel"'),
    document.fonts.load('500 18px "Figtree"'),
  ]).catch(() => undefined);
  await document.fonts.ready.catch(() => undefined);
}

export async function renderCharacterCardJpeg(character: Character): Promise<Blob> {
  await ensureFonts();

  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Не удалось создать холст");

  ctx.fillStyle = NAVY;
  ctx.fillRect(0, 0, W, H);

  const glow = ctx.createRadialGradient(W / 2, 80, 20, W / 2, 80, 640);
  glow.addColorStop(0, "rgba(155,214,242,0.16)");
  glow.addColorStop(1, "rgba(155,214,242,0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, W, H);

  ctx.fillStyle = INK;
  ctx.fillRect(36, 36, W - 72, H - 72);
  ctx.strokeStyle = ICE;
  ctx.globalAlpha = 0.92;
  ctx.lineWidth = 1.6;
  ctx.strokeRect(36, 36, W - 72, H - 72);
  ctx.globalAlpha = 0.62;
  ctx.lineWidth = 1.1;
  ctx.strokeRect(46, 46, W - 92, H - 92);
  ctx.globalAlpha = 0.32;
  ctx.lineWidth = 1;
  ctx.strokeRect(58, 58, W - 116, H - 116);
  ctx.strokeStyle = ICE;
  ctx.globalAlpha = 0.7;
  ctx.lineWidth = 1.05;
  scallopRow(ctx, 86, W - 86, 50, -6);
  scallopRow(ctx, 86, W - 86, H - 50, 6);
  scallopCol(ctx, 86, H - 86, 50, -6);
  scallopCol(ctx, 86, H - 86, W - 50, 6);
  ctx.globalAlpha = 1;

  flourish(ctx, 52, 52, 1, 1);
  flourish(ctx, W - 52, 52, -1, 1);
  flourish(ctx, 52, H - 52, 1, -1);
  flourish(ctx, W - 52, H - 52, -1, -1);
  edgeJewel(ctx, W / 2, 42);
  edgeJewel(ctx, W / 2, H - 42);
  edgeJewel(ctx, 42, H / 2);
  edgeJewel(ctx, W - 42, H / 2);

  let y = 96;

  ctx.fillStyle = MUTED;
  ctx.font = '500 12px "Cinzel", "Times New Roman", serif';
  ctx.letterSpacing = "0.28em";
  ctx.textAlign = "left";
  ctx.fillText(dossierCode(character.id), MARGIN, y);
  ctx.textAlign = "center";
  ctx.fillStyle = ICE_2;
  ctx.fillText(BODY_TYPE_LABELS[character.bodyType].toUpperCase(), W / 2, y);
  ctx.textAlign = "right";
  ctx.fillStyle = MUTED;
  ctx.fillText("ПЕРСОНА", W - MARGIN, y);
  ctx.textAlign = "left";
  ctx.letterSpacing = "0px";

  y += 70;
  const title = characterTitle(character);
  ctx.fillStyle = ICE;
  ctx.font = '600 48px "EB Garamond", Georgia, serif';
  ctx.textAlign = "center";
  const titleLines = wrapText(ctx, title, W - MARGIN * 2).slice(0, 2);
  for (const line of titleLines) {
    ctx.fillText(line, W / 2, y);
    y += 54;
  }

  const subtitle = [character.species, character.ageGroup, character.archetype]
    .filter(Boolean)
    .join("  ·  ");
  if (subtitle) {
    ctx.fillStyle = MUTED;
    ctx.font = 'italic 400 22px "EB Garamond", Georgia, serif';
    ctx.fillText(subtitle, W / 2, y);
    y += 36;
  }

  const occ = occupationLine(character);
  if (occ) {
    y += 8;
    const [role, tag] = occ.split(" + ");
    ctx.font = '500 20px "Figtree", ui-sans-serif, system-ui, sans-serif';
    const roleW = Math.max(160, ctx.measureText(role ?? "").width + 48);
    const tagW = Math.max(160, ctx.measureText(tag ?? "").width + 48);
    const plus = 36;
    const total = roleW + plus + tagW;
    let x = (W - total) / 2;
    windowBox(ctx, x, y, roleW, 44);
    ctx.fillStyle = ICE;
    ctx.fillText(role ?? "", x + roleW / 2, y + 30);
    x += roleW;
    ctx.fillStyle = MUTED;
    ctx.fillText("+", x + plus / 2, y + 30);
    x += plus;
    windowBox(ctx, x, y, tagW, 44);
    ctx.fillStyle = ICE;
    ctx.fillText(tag ?? "", x + tagW / 2, y + 30);
    y += 70;
  }

  ctx.strokeStyle = LINE_SOFT;
  ctx.beginPath();
  ctx.moveTo(MARGIN + 80, y);
  ctx.lineTo(W / 2 - 18, y);
  ctx.moveTo(W / 2 + 18, y);
  ctx.lineTo(W - MARGIN - 80, y);
  ctx.stroke();
  ctx.fillStyle = ICE;
  diamond(ctx, W / 2, y, 5);
  y += 36;

  const bodyFields = FIELD_IDS.filter((id) => id !== "name" && id !== "occupation");
  const entries: { label: string; text: string }[] = [];
  for (const field of bodyFields) {
    const text = fieldText(field, character);
    if (text) entries.push({ label: FIELD_LABELS[field], text });
  }

  const cols = 3;
  const colW = (W - MARGIN * 2) / cols;
  const colH = Math.floor((H - 70 - y) / Math.ceil(entries.length / cols));
  entries.forEach((entry, index) => {
    const col = index % cols;
    const row = Math.floor(index / cols);
    const cx = MARGIN + col * colW + colW / 2;
    const cy = y + row * Math.max(colH, 78);
    ctx.textAlign = "center";
    ctx.fillStyle = MUTED;
    ctx.font = '500 11px "Cinzel", "Times New Roman", serif';
    ctx.letterSpacing = "0.22em";
    ctx.fillText(entry.label.toUpperCase(), cx, cy);
    ctx.letterSpacing = "0px";
    ctx.fillStyle = ICE;
    ctx.font = '500 18px "Figtree", ui-sans-serif, system-ui, sans-serif';
    const lines = wrapText(ctx, entry.text, colW - 28).slice(0, 2);
    lines.forEach((line, i) => {
      ctx.fillText(line, cx, cy + 26 + i * 22);
    });
  });

  ctx.textAlign = "left";
  ctx.fillStyle = MUTED;
  ctx.font = '500 11px "Cinzel", "Times New Roman", serif';
  ctx.letterSpacing = "0.2em";
  ctx.fillText("КАРТОЧКА ПЕРСОНАЖА", MARGIN, H - 48);
  ctx.letterSpacing = "0px";

  return await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error("Не удалось собрать изображение"));
      },
      "image/jpeg",
      0.92,
    );
  });
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
}

function fileSlug(character: Character): string {
  const base = characterTitle(character)
    .split(" / ")[0]
    ?.toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
  return base || "persona";
}

export async function downloadCharacterCard(character: Character): Promise<void> {
  const blob = await renderCharacterCardJpeg(character);
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${fileSlug(character)}.jpg`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1500);
}
