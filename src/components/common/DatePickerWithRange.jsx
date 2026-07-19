import { addDays, format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Field } from "@/components/ui/field";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState } from "react";
import MotionButton from "@/components/motionUI/MotionButton";
const today = new Date();
const oneYearAgo = new Date(today);
oneYearAgo.setFullYear(today.getFullYear() - 1);

const DatePickerWithRange = ({ disabledBeforeDate = oneYearAgo }) => {
  const [date, setDate] = useState({
    from: new Date(today.getFullYear(), today.getMonth(), 1),
    to: today,
  });
  return (
    <Field className="w-full max-w-106">
      <Popover>
        <PopoverTrigger asChild>
          <MotionButton
            variant="secondary"
            buttonConfig="dropdown"
            size="filter"
            className="justify-none gap-4"
          >
            <CalendarIcon className="w-8 h-8" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} -{" "}
                  {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date</span>
            )}
          </MotionButton>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={setDate}
            numberOfMonths={2}
            showOutsideDays={false}
            disabled={{
              before: disabledBeforeDate,
              after: today,
            }}
          />
        </PopoverContent>
      </Popover>
    </Field>
  );
};

export default DatePickerWithRange;
