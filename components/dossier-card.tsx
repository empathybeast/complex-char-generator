import type { ReactNode } from "react";
import { Copy, Dices, Download, Lock, LockOpen, LoaderCircle } from "lucide-react";
import { BODY_TYPE_LABELS, FIELD_LABELS } from "@/lib/generator/data";
import { capitalize, characterTitle, dossierCode } from "@/lib/generator/format";
import { FIELD_IDS, type Character, type FieldId, type FieldState } from "@/lib/generator/types";
import { Button } from "@/components/ui/button";
import { GothicPanel } from "@/components/gothic-panel";
import { FiligreeDivider } from "@/components/gothic-ornament";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

type DossierCardProps = {
  character: Character | null;
  state: FieldState;
  downloading?: boolean;
  onCopy: () => void;
  onDownload: () => void;
  onLock: (id: FieldId) => void;
  onReroll: (id: FieldId) => void;
};

function FieldActions({
  id,
  locked,
  onLock,
  onReroll,
}: {
  id: FieldId;
  locked: boolean;
  onLock: (id: FieldId) => void;
  onReroll: (id: FieldId) => void;
}) {
  return (
    <div className="flex shrink-0 items-center justify-center">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="size-9 text-subtle hover:text-foreground"
            onClick={() => onReroll(id)}
            aria-label={`Перебросить: ${FIELD_LABELS[id]}`}
          >
            <Dices />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Перебросить поле</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className={cn(
              "size-9",
              locked ? "text-primary" : "text-subtle hover:text-foreground",
            )}
            onClick={() => onLock(id)}
            aria-label={locked ? `Отпустить: ${FIELD_LABELS[id]}` : `Зафиксировать: ${FIELD_LABELS[id]}`}
          >
            {locked ? <Lock /> : <LockOpen />}
          </Button>
        </TooltipTrigger>
        <TooltipContent>{locked ? "Поле зафиксировано" : "Зафиксировать поле"}</TooltipContent>
      </Tooltip>
    </div>
  );
}

function CenterField({
  id,
  label,
  locked,
  onLock,
  onReroll,
  children,
}: {
  id: FieldId;
  label: string;
  locked: boolean;
  onLock: (id: FieldId) => void;
  onReroll: (id: FieldId) => void;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center py-4">
      <dt className="text-center text-[11px] font-medium uppercase tracking-[0.18em] text-subtle">
        {label}
      </dt>
      <dd className="mt-1.5 w-full text-center">{children}</dd>
      <FieldActions id={id} locked={locked} onLock={onLock} onReroll={onReroll} />
    </div>
  );
}

function FieldBody({ field, character }: { field: FieldId; character: Character }) {
  if (field === "occupation") {
    if (!character.occupationRole || !character.occupationTag) return null;
    return (
      <div className="mt-1 flex flex-wrap items-center justify-center gap-2">
        <span className="gothic-window gothic-window-on px-3.5 py-2 text-sm text-foreground">
          {capitalize(character.occupationRole)}
        </span>
        <span className="text-subtle">+</span>
        <span className="gothic-window gothic-window-on px-3.5 py-2 text-sm text-foreground">
          {capitalize(character.occupationTag)}
        </span>
      </div>
    );
  }
  const value = character[field as keyof Character];
  if (value === undefined) return null;
  if (Array.isArray(value)) {
    return (
      <ul className="mt-1 flex flex-col items-center gap-1.5">
        {value.map((item) => (
          <li
            key={item}
            className="gothic-window gothic-window-on px-3.5 py-2 text-sm leading-snug text-foreground"
          >
            {capitalize(String(item))}
          </li>
        ))}
      </ul>
    );
  }
  return (
    <p className="gothic-window gothic-window-on mx-auto mt-1 inline-block max-w-full px-4 py-2 text-sm leading-snug text-foreground">
      {capitalize(String(value))}
    </p>
  );
}

export function DossierCard({
  character,
  state,
  downloading = false,
  onCopy,
  onDownload,
  onLock,
  onReroll,
}: DossierCardProps) {
  if (!character) {
    return (
      <GothicPanel className="flex min-h-[280px] flex-col items-center justify-center px-6 py-14 text-center">
        <p className="font-display text-2xl tracking-tight text-foreground">Пустая карточка</p>
        <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
          Выберите морфологию и пункты, затем нажмите «Сгенерировать».
        </p>
      </GothicPanel>
    );
  }

  const visible = FIELD_IDS.filter((id) => {
    if (!state[id].enabled) return false;
    if (id === "occupation") return Boolean(character.occupationRole && character.occupationTag);
    return character[id as keyof Character] !== undefined;
  });

  return (
    <GothicPanel className="p-6 pt-8 sm:p-7 sm:pt-9">
      <header className="flex items-start justify-between gap-3">
        <p className="font-mono text-[11px] tracking-[0.18em] text-subtle">{dossierCode(character.id)}</p>
        <p className="font-display text-sm tracking-wide text-primary">
          {BODY_TYPE_LABELS[character.bodyType]}
        </p>
        <div className="flex shrink-0 items-center">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                className="size-9 -mt-1 text-subtle hover:text-foreground"
                onClick={onCopy}
                aria-label="Скопировать карточку"
              >
                <Copy />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Скопировать текст</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                className="size-9 -mr-1 -mt-1 text-subtle hover:text-foreground"
                onClick={onDownload}
                disabled={downloading}
                aria-label="Скачать карточку JPG"
              >
                {downloading ? <LoaderCircle className="animate-spin" /> : <Download />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>Скачать JPG</TooltipContent>
          </Tooltip>
        </div>
      </header>

      <FiligreeDivider className="mx-auto mt-3 mb-1 max-w-sm" />

      <dl className="mt-1 flex flex-col">
        {visible.map((id, index) => (
          <div key={id}>
            {index > 0 ? <FiligreeDivider className="mx-auto h-3 max-w-xs opacity-70" /> : null}
            <CenterField
              id={id}
              label={FIELD_LABELS[id]}
              locked={state[id].locked}
              onLock={onLock}
              onReroll={onReroll}
            >
              {id === "name" ? (
                <p className="font-display text-2xl leading-tight tracking-tight text-foreground sm:text-[1.85rem]">
                  {characterTitle(character)}
                </p>
              ) : (
                <FieldBody field={id} character={character} />
              )}
            </CenterField>
          </div>
        ))}
      </dl>
      <Button
        type="button"
        variant="secondary"
        className="mt-4 w-full"
        onClick={onDownload}
        disabled={downloading}
      >
        {downloading ? <LoaderCircle className="animate-spin" /> : <Download />}
        Скачать JPG
      </Button>
    </GothicPanel>
  );
}
