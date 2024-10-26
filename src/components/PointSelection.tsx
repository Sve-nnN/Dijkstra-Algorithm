"use client";
import * as React from "react";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";
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
import { Card } from "@/components/ui/card";

interface ComboboxItem {
  value: string;
  label: string;
}

interface ComboboxProps {
  items: ComboboxItem[];
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}

const Combobox: React.FC<ComboboxProps> = ({
  items,
  value,
  onChange,
  placeholder,
}) => {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between shadow-lg"
        >
          {value
            ? items.find((item) => item.value === value)?.label
            : placeholder}
          <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput
            placeholder={`Search ${placeholder.toLowerCase()}...`}
            className="h-9"
          />
          <CommandList>
            <CommandEmpty>No {placeholder.toLowerCase()} found.</CommandEmpty>
            <CommandGroup>
              {items.map((item) => (
                <CommandItem
                  key={item.value}
                  value={item.value}
                  onSelect={(currentValue: string) => {
                    onChange(currentValue === value ? "" : currentValue);
                    setOpen(false);
                  }}
                >
                  {item.label}
                  <CheckIcon
                    className={cn(
                      "ml-auto h-4 w-4",
                      value === item.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

interface PointSelectionProps {
  vertexNames: string[];
  pointA: string;
  setPointA: (value: string) => void;
  pointB: string;
  setPointB: (value: string) => void;
  onCalculate: () => void;
}

const PointSelection: React.FC<PointSelectionProps> = ({
  vertexNames,
  pointA,
  setPointA,
  pointB,
  setPointB,
  onCalculate,
}) => {
  const items = vertexNames.map((name) => ({ value: name, label: name }));

  return (
    <Card className="mb-6 p-4 animate-fade-in">
      <h3 className="text-xl font-semibold mb-4">
        Seleccione los puntos A y B
      </h3>
      <div className="flex gap-4">
        <div className="w-1/2">
          <label className="block mb-2">Punto A:</label>
          <Combobox
            items={items}
            value={pointA}
            onChange={setPointA}
            placeholder="Punto A"
          />
        </div>
        <div className="w-1/2">
          <label className="block mb-2">Punto B:</label>
          <Combobox
            items={items}
            value={pointB}
            onChange={setPointB}
            placeholder="Punto B"
          />
        </div>
      </div>
      <Button onClick={onCalculate} className="mt-4 w-full">
        Calcular camino mínimo
      </Button>
    </Card>
  );
};

export default PointSelection;
