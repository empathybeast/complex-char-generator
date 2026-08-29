import type { HTMLAttributes } from "react";
import { CornerFlourish, EdgeJewel } from "@/components/gothic-ornament";
import { cn } from "@/lib/utils";

export function GothicPanel({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("gothic-panel relative", className)} {...props}>
      <span aria-hidden="true" className="gothic-lace gothic-lace-top" />
      <span aria-hidden="true" className="gothic-lace gothic-lace-bottom" />
      <span aria-hidden="true" className="gothic-lace gothic-lace-left" />
      <span aria-hidden="true" className="gothic-lace gothic-lace-right" />
      <CornerFlourish corner="tl" />
      <CornerFlourish corner="tr" />
      <CornerFlourish corner="bl" />
      <CornerFlourish corner="br" />
      <EdgeJewel edge="t" />
      <EdgeJewel edge="b" />
      <EdgeJewel edge="l" />
      <EdgeJewel edge="r" />
      {children}
    </div>
  );
}
