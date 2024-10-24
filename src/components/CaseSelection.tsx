import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandEmpty,
} from "@/components/ui/command";
import { Check, ChevronsUpDown } from "lucide-react";

interface Option {
  value: string;
  label: string;
}

interface CaseSelectionProps {
  options: Option[];
  selectedOption: string;
  onSelect: (value: string) => void;
}

const CaseSelection: React.FC<CaseSelectionProps> = ({
  options,
  selectedOption,
  onSelect,
}) => {
  const [open, setOpen] = React.useState<boolean>(false);

  return (
    <Card className="mb-6 p-4 max-w-60">
      <label className="block mb-2">Selecciona un caso de uso:</label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-[200px] justify-between"
          >
            {selectedOption
              ? options.find((opt) => opt.value === selectedOption)?.label
              : "Selecciona un caso de uso..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandInput placeholder="Buscar caso de uso..." />
            <CommandList>
              <CommandEmpty>No se encontraron opciones válidas.</CommandEmpty>
              <CommandGroup>
                {options.map((opt) => (
                  <CommandItem
                    key={opt.value}
                    value={opt.value}
                    onSelect={(currentValue) => {
                      onSelect(
                        currentValue === selectedOption ? "" : currentValue
                      );
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={`mr-2 h-4 w-4 ${
                        selectedOption === opt.value
                          ? "opacity-100"
                          : "opacity-0"
                      }`}
                    />
                    {opt.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </Card>
  );
};

export default CaseSelection;
