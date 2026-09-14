import { Eye, EyeOff } from "lucide-react";
import { useState, type ComponentProps } from "react";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

/**
 * A password field with a reveal toggle.
 *
 * `type` is owned by this component rather than passed in — the whole point is
 * that it swaps between `password` and `text`. The button is `type="button"` so
 * revealing never submits the form it sits in, and it is labelled for screen
 * readers because an eye glyph alone says nothing.
 */
export function PasswordInput({ className, ...props }: Omit<ComponentProps<typeof Input>, "type">) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <Input
        type={visible ? "text" : "password"}
        // Room for the button, so a long password never runs underneath it.
        className={cn("pr-11", className)}
        {...props}
      />
      <button
        type="button"
        onClick={() => setVisible((shown) => !shown)}
        aria-label={visible ? "Hide password" : "Show password"}
        aria-pressed={visible}
        className="absolute inset-y-0 right-0 grid w-11 place-items-center rounded-r-md text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        {visible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
      </button>
    </div>
  );
}
