import { useEffect, useState } from "react";
import { CalendarIcon } from "lucide-react";
import { format, parse, isValid } from "date-fns";

import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const DateInput = ({
  value,
  onChange,
  placeholder = "DD/MM/YYYY",
  className,
  disabled,
  minDate,
  maxDate,
  ...props
}) => {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    if (value instanceof Date && isValid(value)) {
      setInputValue(format(value, "dd/MM/yyyy"));
    } else {
      setInputValue("");
    }
  }, [value]);

  const handleOpen = (isOpen) => {
    if (disabled) return;
    setOpen(isOpen);
  };
  const formatInput = (value) => {
    let numbers = value.replace(/\D/g, "").slice(0, 8);

    if (numbers.length > 4) {
      return `${numbers.slice(0, 2)}/${numbers.slice(
        2,
        4,
      )}/${numbers.slice(4)}`;
    }

    if (numbers.length > 2) {
      return `${numbers.slice(0, 2)}/${numbers.slice(2)}`;
    }

    return numbers;
  };

  const handleInputChange = (e) => {
    const formatted = formatInput(e.target.value);

    setInputValue(formatted);

    if (formatted.length !== 10) return;

    const parsed = parse(formatted, "dd/MM/yyyy", new Date());

    if (isValid(parsed) && format(parsed, "dd/MM/yyyy") === formatted) {
      onChange?.(parsed);
    }
  };

  const handleBlur = () => {
    if (!inputValue) {
      onChange?.(undefined);
      return;
    }

    if (inputValue.length !== 10) return;

    const parsed = parse(inputValue, "dd/MM/yyyy", new Date());

    if (isValid(parsed) && format(parsed, "dd/MM/yyyy") === inputValue) {
      onChange?.(parsed);
    } else {
      setInputValue(value ? format(value, "dd/MM/yyyy") : "");
    }
  };

  const handleCalendarSelect = (selectedDate) => {
    if (!selectedDate) return;

    onChange?.(selectedDate);
    setInputValue(format(selectedDate, "dd/MM/yyyy"));
    setOpen(false);
  };

  return (
    <div className={cn(className)}>
      <Popover open={open} onOpenChange={handleOpen}>
        <PopoverTrigger asChild>
          <div className="relative w-full">
            <Input
              value={inputValue}
              placeholder={placeholder}
              disabled={disabled}
              //   onFocus={() => !disabled && setOpen(true)}
              onChange={handleInputChange}
              onBlur={handleBlur}
              {...props}
            />
          </div>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-auto p-0">
          <Calendar
            mode="single"
            selected={value}
            onSelect={handleCalendarSelect}
            disabled={(date) => {
              if (minDate && date < minDate) return true;
              if (maxDate && date > maxDate) return true;
              return false;
            }}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default DateInput;
