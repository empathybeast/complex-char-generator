import { useEffect, useMemo, useState } from "react";
import { Dices } from "lucide-react";
import { toast } from "sonner";
import { BodyTypePicker } from "@/components/body-type-picker";
import { OptionPanel } from "@/components/option-panel";
import { DossierCard } from "@/components/dossier-card";
import { GothicPanel } from "@/components/gothic-panel";
import { CornerFlourish, FiligreeDivider, GothicArch, TitleCrest } from "@/components/gothic-ornament";
import { HistoryRail } from "@/components/history-rail";
import { HistorySheet } from "@/components/history-sheet";
import { Button } from "@/components/ui/button";
import { TooltipProvider } from "@/components/ui/tooltip";
import { defaultFieldState } from "@/lib/generator/data";
import { downloadCharacterCard } from "@/lib/generator/export-card";
import { formatCharacterText } from "@/lib/generator/format";
import {
  allLocked,
  enabledCount,
  generateCharacter,
  rerollField,
} from "@/lib/generator/generate";
import {
  loadBodyType,
  loadFieldState,
  loadHistory,
  pushHistory,
  saveBodyType,
  saveFieldState,
} from "@/lib/generator/history";
import type { BodyType, Character, FieldId, FieldState } from "@/lib/generator/types";
import { FIELD_IDS } from "@/lib/generator/types";

export function CharacterGenerator() {
  const [state, setState] = useState<FieldState>(defaultFieldState);
  const [bodyType, setBodyType] = useState<BodyType>("humanoid");
  const [character, setCharacter] = useState<Character | null>(null);
  const [history, setHistory] = useState<Character[]>([]);
  const [ready, setReady] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    const storedState = loadFieldState();
    const storedHistory = loadHistory();
    const storedBody = loadBodyType();
    setState(storedState);
    setHistory(storedHistory);
    setBodyType(storedBody);
    if (storedHistory[0]) {
      setCharacter(storedHistory[0]);
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    saveFieldState(state);
  }, [state, ready]);

  useEffect(() => {
    if (!ready) return;
    saveBodyType(bodyType);
  }, [bodyType, ready]);

  const activeCount = useMemo(() => enabledCount(state), [state]);

  function updateState(updater: (prev: FieldState) => FieldState) {
    setState((prev) => updater(prev));
  }

  function handleToggle(id: FieldId, enabled: boolean) {
    updateState((prev) => ({
      ...prev,
      [id]: { enabled, locked: enabled ? prev[id].locked : false },
    }));
  }

  function handleLock(id: FieldId) {
    updateState((prev) => ({
      ...prev,
      [id]: { ...prev[id], locked: prev[id].enabled ? !prev[id].locked : false },
    }));
  }

  function setAll(enabled: boolean) {
    updateState((prev) => {
      const next = { ...prev };
      for (const id of FIELD_IDS) {
        next[id] = { enabled, locked: enabled ? prev[id].locked : false };
      }
      return next;
    });
  }

  function handleGenerate() {
    if (activeCount === 0) {
      toast("Включите хотя бы один пункт");
      return;
    }
    if (allLocked(state)) {
      toast("Все пункты зафиксированы — отпустите хотя бы один");
      return;
    }
    const next = generateCharacter(state, bodyType, character ?? undefined);
    setCharacter(next);
    setHistory((prev) => pushHistory(prev, next));
  }

  function handleReroll(id: FieldId) {
    if (!character) return;
    const next = rerollField(character, id, state);
    setCharacter(next);
    setHistory((prev) => pushHistory(prev, next));
  }

  async function handleCopy() {
    if (!character) return;
    const text = formatCharacterText(character);
    try {
      await navigator.clipboard.writeText(text);
      toast("Карточка скопирована");
    } catch {
      toast("Не удалось скопировать");
    }
  }

  async function handleDownload() {
    if (!character || downloading) return;
    setDownloading(true);
    try {
      await downloadCharacterCard(character);
      toast("JPG сохранён");
    } catch {
      toast("Не удалось сохранить карточку");
    } finally {
      setDownloading(false);
    }
  }

  return (
    <TooltipProvider>
      <div className="relative min-h-screen overflow-x-hidden bg-background">
        <div aria-hidden="true" className="gothic-veil pointer-events-none absolute inset-0" />
        <div aria-hidden="true" className="pointer-events-none absolute inset-3 hidden lg:block">
          <CornerFlourish corner="tl" className="size-28 opacity-35" />
          <CornerFlourish corner="tr" className="size-28 opacity-35" />
          <CornerFlourish corner="bl" className="size-28 opacity-35" />
          <CornerFlourish corner="br" className="size-28 opacity-35" />
        </div>
        <main className="relative mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
          <header className="flex flex-col items-center gap-2 text-center">
            <GothicArch className="mb-1 opacity-90" />
            <TitleCrest />
            <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-subtle">
              Генератор карточек
            </p>
            <h1 className="font-display text-5xl tracking-tight text-foreground sm:text-6xl">
              Персона
            </h1>
            <FiligreeDivider className="mt-1" />
            <p className="max-w-lg text-sm leading-relaxed text-muted-foreground">
              Милая готика, вселенные и морфология. Выберите тело, пункты — и снимите досье.
            </p>
          </header>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,24rem)_minmax(0,1fr)] lg:items-start">
            <aside className="flex flex-col gap-5">
              <GothicPanel className="flex flex-col gap-5 p-6 pt-8 sm:p-7 sm:pt-9">
                <BodyTypePicker value={bodyType} onChange={setBodyType} />
                <div className="flex flex-col gap-2">
                  <Button type="button" variant="secondary" className="w-full" onClick={() => setAll(true)}>
                    Выбрать все пункты
                  </Button>
                  <Button type="button" variant="outline" className="w-full" onClick={() => setAll(false)}>
                    Сбросить все пункты
                  </Button>
                </div>
                <OptionPanel state={state} onToggle={handleToggle} />
                <Button
                  type="button"
                  size="lg"
                  className="w-full"
                  onClick={handleGenerate}
                  disabled={activeCount === 0}
                >
                  <Dices />
                  Сгенерировать
                </Button>
                <p className="text-center text-xs text-subtle">
                  {activeCount === 0
                    ? "Нет активных пунктов"
                    : `${activeCount} ${pluralFields(activeCount)} в карточке`}
                </p>
              </GothicPanel>
            </aside>

            <div className="flex min-w-0 flex-col gap-8">
              <DossierCard
                character={character}
                state={state}
                downloading={downloading}
                onCopy={handleCopy}
                onDownload={handleDownload}
                onLock={handleLock}
                onReroll={handleReroll}
              />
              <HistoryRail
                items={history}
                activeId={character?.id}
                onSelect={setCharacter}
                onOpenAll={() => setHistoryOpen(true)}
              />
            </div>
          </div>
        </main>
        <HistorySheet
          open={historyOpen}
          onOpenChange={setHistoryOpen}
          items={history}
          activeId={character?.id}
          onSelect={setCharacter}
        />
      </div>
    </TooltipProvider>
  );
}

function pluralFields(n: number): string {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return "пункт";
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return "пункта";
  return "пунктов";
}
