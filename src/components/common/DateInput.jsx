import { useEffect, useState } from "react";
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
  const [calendarDate, setCalendarDate] = useState(value);

  useEffect(() => {
    setCalendarDate(value);

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
    const numbers = value.replace(/\D/g, "").slice(0, 8);

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

  const parseDate = (value) => {
    if (!/^\d{2}\/\d{2}\/\d{4}$/.test(value)) return null;

    const [day, month, year] = value.split("/").map(Number);

    // Basic range checks
    if (year < 1000 || year > 9999) return null;
    if (month < 1 || month > 12) return null;
    if (day < 1 || day > 31) return null;

    // Construct date manually
    const date = new Date(year, month - 1, day);

    // Reject rollover dates
    if (
      date.getFullYear() !== year ||
      date.getMonth() !== month - 1 ||
      date.getDate() !== day
    ) {
      return null;
    }

    // Normalize time
    date.setHours(0, 0, 0, 0);

    if (minDate) {
      const min = new Date(minDate);
      min.setHours(0, 0, 0, 0);
      if (date < min) return null;
    }

    if (maxDate) {
      const max = new Date(maxDate);
      max.setHours(0, 0, 0, 0);
      if (date > max) return null;
    }

    return date;
  };

  const handleInputChange = (e) => {
    const formatted = formatInput(e.target.value);

    setInputValue(formatted);

    if (formatted.length !== 10) return;

    const parsed = parseDate(formatted);

    if (!parsed) return;

    setCalendarDate(parsed);
    onChange?.(parsed);
  };

  const handleBlur = () => {
    if (!inputValue) {
      setCalendarDate(undefined);
      onChange?.(undefined);
      return;
    }

    if (inputValue.length !== 10) {
      setInputValue(value ? format(value, "dd/MM/yyyy") : "");
      return;
    }

    const parsed = parseDate(inputValue);

    if (parsed) {
      setCalendarDate(parsed);
      onChange?.(parsed);
    } else {
      setInputValue(value ? format(value, "dd/MM/yyyy") : "");
      setCalendarDate(value);
    }
  };

  const handleCalendarSelect = (selectedDate) => {
    if (!selectedDate) return;

    setCalendarDate(selectedDate);
    setInputValue(format(selectedDate, "dd/MM/yyyy"));
    onChange?.(selectedDate);
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
              onChange={handleInputChange}
              onBlur={handleBlur}
              {...props}
            />
          </div>
        </PopoverTrigger>

        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={calendarDate}
            month={calendarDate}
            captionLayout="dropdown"
            onMonthChange={setCalendarDate}
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
