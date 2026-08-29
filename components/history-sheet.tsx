import { formatDistanceToNow } from "date-fns";
import { ru } from "date-fns/locale";
import { BODY_TYPE_LABELS } from "@/lib/generator/data";
import { characterTitle, occupationLine, ruName } from "@/lib/generator/format";
import { MAX_HISTORY } from "@/lib/generator/history";
import type { Character } from "@/lib/generator/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

type HistorySheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  items: Character[];
  activeId?: string;
  onSelect: (character: Character) => void;
};

export function HistorySheet({
  open,
  onOpenChange,
  items,
  activeId,
  onSelect,
}: HistorySheetProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>История</DialogTitle>
          <DialogDescription>
            {items.length} из {MAX_HISTORY} последних генераций
          </DialogDescription>
        </DialogHeader>
        <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-6">
          {items.length === 0 ? (
            <p className="py-10 text-sm text-muted-foreground">Пока пусто — сгенерируйте карточку.</p>
          ) : (
            <ul className="flex flex-col gap-2">
              {items.map((item, index) => {
                const active = item.id === activeId;
                const meta = [BODY_TYPE_LABELS[item.bodyType], occupationLine(item), item.species]
                  .filter(Boolean)
                  .join(" · ");
                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => {
                        onSelect(item);
                        onOpenChange(false);
                      }}
                      className={cn(
                        "gothic-window flex w-full min-h-11 flex-col items-start px-3 py-2.5 text-left transition-[background-color,box-shadow] duration-150 ease-out",
                        active ? "gothic-window-on" : "",
                      )}
                    >
                      <span className="flex w-full items-baseline justify-between gap-3">
                        <span className="truncate text-sm text-foreground">
                          {ruName(characterTitle(item))}
                        </span>
                        <span className="shrink-0 font-mono text-[11px] tabular-nums text-subtle">
                          {index + 1}
                        </span>
                      </span>
                      <span className="mt-0.5 w-full truncate text-xs text-subtle">
                        {meta ||
                          formatDistanceToNow(item.createdAt, {
                            addSuffix: true,
                            locale: ru,
                          })}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
