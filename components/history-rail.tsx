import { formatDistanceToNow } from "date-fns";
import { ru } from "date-fns/locale";
import { History } from "lucide-react";
import { BODY_TYPE_LABELS } from "@/lib/generator/data";
import { characterTitle, occupationLine, ruName } from "@/lib/generator/format";
import { MAX_HISTORY } from "@/lib/generator/history";
import type { Character } from "@/lib/generator/types";
import { Button } from "@/components/ui/button";
import { GothicPanel } from "@/components/gothic-panel";
import { cn } from "@/lib/utils";

const PREVIEW = 6;

type HistoryRailProps = {
  items: Character[];
  activeId?: string;
  onSelect: (character: Character) => void;
  onOpenAll: () => void;
};

export function HistoryRail({ items, activeId, onSelect, onOpenAll }: HistoryRailProps) {
  if (items.length === 0) return null;

  const preview = items.slice(0, PREVIEW);

  return (
    <GothicPanel className="flex flex-col gap-3 p-6 pt-8 sm:p-7 sm:pt-9">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-[11px] font-medium uppercase tracking-[0.16em] text-subtle">
          История
        </h2>
        <p className="font-mono text-[11px] tabular-nums text-subtle">
          {items.length} / {MAX_HISTORY}
        </p>
      </div>
      <ul className="flex flex-col gap-2">
        {preview.map((item) => {
          const active = item.id === activeId;
          const meta = [BODY_TYPE_LABELS[item.bodyType], occupationLine(item)]
            .filter(Boolean)
            .join(" · ");
          return (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => onSelect(item)}
                className={cn(
                  "gothic-window flex w-full min-h-11 flex-col items-start px-3 py-2.5 text-left transition-[background-color,box-shadow] duration-150 ease-out",
                  active ? "gothic-window-on" : "",
                )}
              >
                <span className="w-full truncate text-sm text-foreground">
                  {ruName(characterTitle(item))}
                </span>
                <span className="mt-0.5 w-full truncate text-xs text-subtle">
                  {meta ||
                    formatDistanceToNow(item.createdAt, { addSuffix: true, locale: ru })}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
      <Button type="button" variant="outline" className="w-full" onClick={onOpenAll}>
        <History />
        Все {items.length} {pluralRecords(items.length)}
      </Button>
    </GothicPanel>
  );
}

function pluralRecords(n: number): string {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return "запись";
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return "записи";
  return "записей";
}
