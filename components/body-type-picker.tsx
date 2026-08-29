import { BODY_TYPE_HINTS, BODY_TYPE_LABELS } from "@/lib/generator/data";
import { BODY_TYPES, type BodyType } from "@/lib/generator/types";
import { cn } from "@/lib/utils";

type BodyTypePickerProps = {
  value: BodyType;
  onChange: (value: BodyType) => void;
};

export function BodyTypePicker({ value, onChange }: BodyTypePickerProps) {
  return (
    <fieldset className="flex flex-col gap-3">
      <legend className="w-full text-center text-[11px] font-medium uppercase tracking-[0.22em] text-subtle">
        Морфология
      </legend>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4" role="radiogroup" aria-label="Морфология">
        {BODY_TYPES.map((id) => {
          const active = value === id;
          return (
            <button
              key={id}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => onChange(id)}
              className={cn(
                "flex min-h-14 flex-col items-center justify-center rounded-lg px-2 py-2.5 text-center transition-[background-color,box-shadow,color] duration-150 ease-out",
                active
                  ? "bg-primary text-primary-foreground shadow-[0_0_0_1px_var(--color-primary),0_0_18px_color-mix(in_oklab,var(--color-ice-2)_40%,transparent)]"
                  : "gothic-window gothic-window-off text-foreground",
              )}
            >
              <span className="text-sm font-medium">{BODY_TYPE_LABELS[id]}</span>
              <span
                className={cn(
                  "mt-0.5 hidden text-[10px] leading-tight sm:block",
                  active ? "text-primary-foreground/75" : "text-subtle",
                )}
              >
                {shortHint(id)}
              </span>
            </button>
          );
        })}
      </div>
      <p className="text-center text-xs leading-relaxed text-muted-foreground">{BODY_TYPE_HINTS[value]}</p>
    </fieldset>
  );
}

function shortHint(id: BodyType): string {
  switch (id) {
    case "humanoid":
      return "человек и близкие";
    case "anthro":
      return "зверь на двух";
    case "feral":
      return "зверь как есть";
    case "monster":
      return "чужое";
  }
}
