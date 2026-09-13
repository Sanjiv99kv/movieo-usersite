import { Sparkles } from "lucide-react";

import { OfferCard } from "@/components/cinebook/OfferCard";
import { Reveal } from "@/components/cinebook/Reveal";
import { offers } from "@/data/cinebook";
import { usePageMeta } from "@/hooks/use-page-meta";

export default function OffersPage() {
  usePageMeta({
    title: "Movie Offers — MOVIEO",
    description: "Save on movie tickets, food combos and premium cinema experiences.",
    ogTitle: "Exclusive Movie Offers — MOVIEO",
    ogDescription: "Unlock savings on cinema tickets and movie experiences.",
  });

  return (
    <div className="page-shell pb-24 pt-32">
      <Sparkles className="size-7 text-primary" />
      <h1 className="mt-4 font-display text-4xl font-bold sm:text-6xl">
        Good stories. Better prices.
      </h1>
      <p className="mt-4 max-w-xl text-muted-foreground">
        Handpicked ticket, bank and food offers for your next cinema visit. Apply a code at
        checkout.
      </p>

      <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {offers.map((offer, index) => (
          <Reveal key={offer.code} delay={index * 60}>
            <OfferCard offer={offer} />
          </Reveal>
        ))}
      </div>
    </div>
  );
}
