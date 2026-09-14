import {
  CalendarDays,
  Check,
  Copy,
  CreditCard,
  Gift,
  GraduationCap,
  Popcorn,
  Sparkles,
  Ticket,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { offerValidTill, type Offer } from "@/data/movieo";
import { copyText } from "@/lib/clipboard";
import { cn } from "@/lib/utils";

const OFFER_ICONS: Record<Offer["icon"], LucideIcon> = {
  ticket: Ticket,
  bank: CreditCard,
  gift: Gift,
  student: GraduationCap,
  food: Popcorn,
  member: Sparkles,
};

export function OfferCard({ offer }: { offer: Offer }) {
  const Icon = OFFER_ICONS[offer.icon];
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(timer);
  }, [copied]);

  const copy = async () => {
    if (await copyText(offer.code)) {
      setCopied(true);
      toast.success(`Code ${offer.code} copied`);
    } else {
      toast.error(`Copy blocked — the code is ${offer.code}`);
    }
  };

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-xl bg-card transition duration-500 hover:-translate-y-1">
      {/* There is no artwork for these, so the banner is typographic: the saving is the
          image. A big number reads from across the page the way a poster would. */}
      <div className={cn(offer.tone, "relative flex items-center justify-between gap-4 px-5 py-6")}>
        <div className="min-w-0">
          <p className="text-[11px] font-bold uppercase tracking-wider text-foreground/70">
            {offer.kicker}
          </p>
          <p className="mt-1 font-display text-3xl font-bold leading-none">{offer.value}</p>
        </div>
        <Icon className="size-10 shrink-0 text-foreground/25 transition duration-500 group-hover:scale-110 group-hover:text-foreground/40" />
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-lg font-bold leading-tight">{offer.title}</h3>
        <p className="mt-2 flex-1 text-sm leading-6 text-muted-foreground">{offer.detail}</p>

        <div className="mt-5 flex items-end justify-between gap-3 border-t border-border pt-4">
          <div className="min-w-0">
            <p className="flex items-center gap-1 text-[11px] text-muted-foreground">
              <CalendarDays className="size-3" /> Valid till
            </p>
            <p className="mt-0.5 truncate text-xs font-semibold">
              {offerValidTill(offer.validDays)}
            </p>
          </div>
          <Button size="sm" variant="outline" className="h-8 shrink-0 font-mono" onClick={copy}>
            {copied ? <Check className="text-primary" /> : <Copy />}
            {offer.code}
          </Button>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-border transition duration-500 group-hover:ring-primary/50" />
    </article>
  );
}
