'use client';

import { formatDate } from 'date-fns';
import { LucideChevronDown } from 'lucide-react';
import { forwardRef, useImperativeHandle, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

export type DatePickerHandle = {
  reset: () => void;
};

type DatePickerProps = {
  id: string;
  name: string;
  defaultValue?: string | undefined;
};

const DatePicker = forwardRef<DatePickerHandle, DatePickerProps>(
  function DatePicker({ id, name, defaultValue }, ref) {
    const [open, setOpen] = useState(false);
    const [date, setDate] = useState<Date | undefined>(
      defaultValue ? new Date(defaultValue) : new Date()
    );

    useImperativeHandle(ref, () => ({
      reset: () => {
        setDate(new Date());
      },
    }));

    const formattedStringDate = date ? formatDate(date, 'yyyy-MM-dd') : '';
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild className="w-full">
          <Button
            variant="outline"
            id={id}
            className="justify-between text-left font-normal"
          >
            {formattedStringDate}
            <LucideChevronDown />
            <input type="hidden" name={name} value={formattedStringDate} />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            captionLayout="dropdown"
            onSelect={(date) => {
              setDate(date);
              setOpen(false);
            }}
          />
        </PopoverContent>
      </Popover>
    );
  }
);
export { DatePicker };
