import { Check } from "lucide-react";
import { FIELD_GROUPS, FIELD_LABELS } from "@/lib/generator/data";
import { FIELD_ICONS } from "@/lib/generator/fields";
import type { FieldId, FieldState } from "@/lib/generator/types";
import { cn } from "@/lib/utils";

type OptionPanelProps = {
  state: FieldState;
  onToggle: (id: FieldId, enabled: boolean) => void;
};

export function OptionPanel({ state, onToggle }: OptionPanelProps) {
  return (
    <div className="flex flex-col gap-6">
      {FIELD_GROUPS.map((group) => (
        <section key={group.id} className="flex flex-col gap-2">
          <h2 className="text-center text-[11px] font-medium uppercase tracking-[0.16em] text-subtle">
            {group.title}
          </h2>
          <div
            className={cn(
              "grid gap-2",
              group.fields.length === 1 ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-2",
            )}
          >
            {group.fields.map((id) => {
              const Icon = FIELD_ICONS[id];
              const enabled = state[id].enabled;
              return (
                <label
                  key={id}
                  className={cn(
                    "gothic-window flex min-h-11 cursor-pointer items-center justify-between gap-3 px-3.5 py-2.5 transition-[background-color,box-shadow,opacity] duration-150 ease-out",
                    enabled ? "gothic-window-on" : "gothic-window-off hover:opacity-90",
                  )}
                >
                  <span className="flex min-w-0 items-center gap-2.5 text-sm text-foreground">
                    <Icon className="size-4 shrink-0 text-muted-foreground" strokeWidth={1.75} />
                    <span className="truncate">{FIELD_LABELS[id]}</span>
                  </span>
                  <span
                    className={cn(
                      "flex size-4 shrink-0 items-center justify-center rounded-[4px] border border-border",
                      enabled && "border-primary bg-primary text-primary-foreground",
                    )}
                    aria-hidden="true"
                  >
                    {enabled ? <Check className="size-3" strokeWidth={3} /> : null}
                  </span>
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={enabled}
                    onChange={(e) => onToggle(id, e.target.checked)}
                    aria-label={FIELD_LABELS[id]}
                  />
                </label>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
