import { Copy } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import type { Offer } from "@/data/cinebook";
import { cn } from "@/lib/utils";

export function OfferCard({ offer, detailed = false }: { offer: Offer; detailed?: boolean }) {
  const copy = async () => {
    try {
      await navigator.clipboard?.writeText(offer.code);
      toast.success(`Code ${offer.code} copied`);
    } catch {
      toast.error("Could not copy the code");
    }
  };

  return (
    <article
      className={cn(
        offer.tone,
        "rounded-lg p-6 shadow-card",
        detailed ? "min-h-72 p-7" : "min-h-56",
      )}
    >
      <p className="text-xs font-bold uppercase text-foreground/70">{offer.kicker}</p>
      <h3
        className={cn(
          "mt-6 max-w-[15ch] font-display font-bold",
          detailed ? "mt-8 text-3xl" : "text-2xl",
        )}
      >
        {offer.title}
      </h3>
      {detailed && <p className="mt-4 text-sm text-foreground/70">{offer.detail}</p>}
      <div
        className={cn(
          "flex items-center justify-between border-t border-foreground/20",
          detailed ? "mt-9 pt-5" : "mt-7 pt-4",
        )}
      >
        <code className={cn("font-bold", detailed && "text-lg")}>{offer.code}</code>
        <Button variant="secondary" size={detailed ? "default" : "sm"} onClick={copy}>
          <Copy /> Copy
        </Button>
      </div>
    </article>
  );
}
