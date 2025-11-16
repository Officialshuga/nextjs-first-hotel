"use client";

import * as React from "react";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { type DateRange } from "react-day-picker";

type Range = DateRange | undefined;

interface DateRangePickerProps {
  range?: Range;
  setRange?: React.Dispatch<React.SetStateAction<Range>>;
  internalRange?: Range;
  setInternalRange?: React.Dispatch<React.SetStateAction<Range>>;
  numberOfMonths?: number;
  className?: string;
  disabledDates?: Date[];
}

export default function DateRangePicker({
  range,
  setRange,
  internalRange,
  setInternalRange,
  numberOfMonths = 2,
  className,
  disabledDates,
}: DateRangePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  const dateRange = range ?? internalRange;
  const handleSetRange = setRange ?? setInternalRange;

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal",
              !dateRange && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {dateRange?.from ? (
              dateRange.to ? (
                <>
                  {format(dateRange.from, "LLL dd, y")} -{" "}
                  {format(dateRange.to, "LLL dd, y")}
                </>
              ) : (
                format(dateRange.from, "LLL dd, y")
              )
            ) : (
              <span>Book Date</span>
            )}
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={dateRange?.from}
            selected={dateRange}
            onSelect={(selectedRange) => {
              handleSetRange?.(selectedRange);
              if (selectedRange?.from && selectedRange?.to) {
                setIsOpen(false);
              }
            }}
            numberOfMonths={numberOfMonths}
            disabled={(date) => 
              date < new Date(new Date().setHours(0, 0, 0, 0)) || // Disable past dates
              (disabledDates?.some(disabledDate => 
                date.getDate() === disabledDate.getDate() &&
                date.getMonth() === disabledDate.getMonth() &&
                date.getFullYear() === disabledDate.getFullYear()
              ) ?? false)
            }
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
