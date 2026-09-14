import { useEffect, useRef, useState, type ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * Fades a section up the first time it reaches the viewport, then stops listening.
 *
 * Deliberately not IntersectionObserver: a fast scroll can carry a section from below
 * the fold to above it inside a single frame, so its intersection ratio reads 0 both
 * before and after. No threshold is crossed, no callback fires, and the section stays
 * invisible forever. A rAF-throttled position check cannot miss that jump.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "section" | "article";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    let frame = 0;
    let revealed = false;

    const stop = () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (frame) cancelAnimationFrame(frame);
    };

    const check = () => {
      frame = 0;
      const rect = node.getBoundingClientRect();
      // Either it has entered the lower 92% of the viewport, or we blew straight past it.
      if (rect.top < window.innerHeight * 0.92) {
        revealed = true;
        setShown(true);
        stop();
      }
    };

    function schedule() {
      if (revealed || frame) return;
      frame = requestAnimationFrame(check);
    }

    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    check();

    return stop;
  }, []);

  return (
    <Tag
      ref={ref}
      className={cn(shown ? "reveal" : "opacity-0", className)}
      style={shown && delay ? { animationDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  );
}
