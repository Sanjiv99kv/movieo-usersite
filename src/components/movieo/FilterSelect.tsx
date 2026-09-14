import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import { cn } from "@/lib/utils";

export const ALL = "All";

/** Shared filter dropdown: shows its own selection in the trigger and highlights when set. */
export function FilterSelect({
  label,
  allLabel,
  options,
  value,
  onChange,
  optionHint,
}: {
  label: string;
  /** Explicit, because pluralising the label gives "All genre" / "All preferred time". */
  allLabel: string;
  options: string[];
  value: string;
  onChange: (next: string) => void;
  optionHint?: (option: string) => string | undefined;
}) {
  const isDefault = value === ALL;

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger
        aria-label={label}
        className={cn("h-10 w-auto gap-2 bg-card", !isDefault && "border-primary/60 bg-primary/10")}
      >
        <span className="truncate">
          {isDefault ? (
            label
          ) : (
            <>
              <span className="text-muted-foreground">{label}:</span> {value}
            </>
          )}
        </span>
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => {
          const hint = optionHint?.(option);
          return (
            <SelectItem key={option} value={option}>
              {option === ALL ? allLabel : option}
              {hint && <span className="ml-2 text-xs text-muted-foreground">{hint}</span>}
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}
