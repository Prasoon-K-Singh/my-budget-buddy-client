"use client";
import { useId, useRef, useState, useEffect } from "react";
import { CheckIcon, ChevronsUpDownIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { LABEL_COLORS } from "@/config/colorConfig";

const ComboboxCreatable = ({
  className,
  options = [],
  value,
  onChange,
  onBlur,
  name,
  disabled = false,
  "aria-invalid": ariaInvalid,
}) => {
  const id = useId();

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [labels, setLabels] = useState(() =>
    options.map((option, index) => ({
      ...option,
      color: option.color || LABEL_COLORS[index % LABEL_COLORS.length].progress,
    })),
  );
  const [mounted, setMounted] = useState(false);

  const colorIndexRef = useRef(options.length);
  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => {
        setMounted(true);
      }, 50);

      return () => clearTimeout(timer);
    }

    setMounted(false);
  }, [open]);

  const selected = labels.find((label) => label.value === value);

  const trimmed = query.trim();

  const exactMatch = labels.some(
    (label) => label.label.toLowerCase() === trimmed.toLowerCase(),
  );

  const showCreate = trimmed.length > 0 && !exactMatch;

  const handleCreate = () => {
    const newValue = trimmed.toLowerCase().replace(/\s+/g, "-");

    const color =
      LABEL_COLORS[colorIndexRef.current % LABEL_COLORS.length].progress;

    colorIndexRef.current += 1;

    const newLabel = {
      value: newValue,
      label: trimmed,
      color,
    };

    setLabels((prev) => [...prev, newLabel]);

    onChange?.(newValue);

    setQuery("");
    setOpen(false);
  };

  const handleSelect = (label) => {
    const newValue = label.value === value ? "" : label.value;

    onChange?.(newValue);
    setQuery("");
    setOpen(false);
  };

  return (
    <div className="w-full max-w-xs">
      <Popover
        open={open}
        onOpenChange={(value) => {
          setOpen(value);

          if (!value) {
            onBlur?.();
          }
        }}
      >
        <PopoverTrigger asChild>
          <Button
            id={id}
            name={name}
            disabled={disabled}
            variant="outline"
            role="combobox"
            aria-expanded={open}
            aria-invalid={ariaInvalid}
            className={cn(
              "bg-background hover:bg-background border-input text-color-white dark:border-input aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 w-full dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 justify-between px-3 font-normal outline-offset-0 outline-none focus-visible:outline-2 cursor-pointer",
              className,
            )}
          >
            {selected ? (
              <span className="flex items-center gap-2 min-w-0">
                {/* <span
                  className={cn("size-2 rounded-full shrink-0", selected.color)}
                /> */}

                <span className="truncate">{selected.label}</span>
              </span>
            ) : (
              <span className="text-muted-foreground">
                Select or create category
              </span>
            )}

            <ChevronsUpDownIcon
              className="text-muted-foreground/80 shrink-0 size-4"
              aria-hidden="true"
            />
          </Button>
        </PopoverTrigger>

        <PopoverContent
          className="border-input w-(--radix-popover-trigger-width) p-0"
          align="start"
        >
          {mounted && (
            <Command>
              <CommandInput
                placeholder="Search or create category..."
                value={query}
                onValueChange={(value) => setQuery(value.slice(0, 21))}
              />

              <CommandList className="max-h-25">
                <CommandEmpty className={cn(showCreate && "hidden")}>
                  No category found.
                </CommandEmpty>

                <CommandGroup>
                  {labels.map((label) => (
                    <CommandItem
                      key={label.value}
                      value={label.label}
                      onSelect={() => handleSelect(label)}
                      className="[&>svg:last-of-type]:hidden"
                    >
                      <span className="flex grow items-center gap-2 min-w-0">
                        {/* <span
                          className={cn(
                            "size-2 rounded-full shrink-0",
                            label.color,
                          )}
                        /> */}

                        <span className="truncate">{label.label}</span>
                      </span>

                      <CheckIcon
                        className={cn(
                          "size-4 transition-opacity",
                          value === label.value ? "opacity-100" : "opacity-0",
                        )}
                      />
                    </CommandItem>
                  ))}

                  {showCreate && (
                    <CommandItem
                      value={`__create__${trimmed}`}
                      onSelect={handleCreate}
                      className="[&>svg:last-of-type]:hidden text-muted-foreground"
                    >
                      Create
                      <Badge
                        variant="secondary"
                        className="max-w-3/4 truncate ml-1 rounded px-1.5 py-0 font-medium leading-5"
                      >
                        {trimmed}
                      </Badge>
                    </CommandItem>
                  )}
                </CommandGroup>
              </CommandList>
            </Command>
          )}
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default ComboboxCreatable;
