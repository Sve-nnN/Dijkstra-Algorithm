// Importaciones de bibliotecas y componentes necesarios
import React from "react"; // Importa React para crear componentes
import { Button } from "@/components/ui/button"; // Importa el componente Button de la carpeta de UI
import { Card } from "@/components/ui/card"; // Importa el componente Card de la carpeta de UI
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"; // Importa componentes relacionados con Popover de la carpeta de UI
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandEmpty,
} from "@/components/ui/command"; // Importa componentes relacionados con comandos de la carpeta de UI
import { Check, ChevronsUpDown } from "lucide-react"; // Importa iconos de la biblioteca lucide-react

// Define la interfaz para las opciones disponibles
interface Option {
  value: string; // El valor único de la opción
  label: string; // La etiqueta de la opción que se mostrará al usuario
}

// Define las propiedades del componente CaseSelection
interface CaseSelectionProps {
  options: Option[]; // Array de opciones que se pueden seleccionar
  selectedOption: string; // Opción actualmente seleccionada
  onSelect: (value: string) => void; // Función que se llama cuando se selecciona una opción
}

// Define el componente funcional CaseSelection
const CaseSelection: React.FC<CaseSelectionProps> = ({
  options,
  selectedOption,
  onSelect,
}) => {
  // Estado local que controla si el Popover está abierto o cerrado
  const [open, setOpen] = React.useState<boolean>(false);

  return (
    <Card className="mb-6 p-4 w-auto animate-fade-in">
      <label className="block mb-2">Selecciona un caso de uso:</label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-min justify-between shadow-lg"
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

// Exporta el componente para que pueda ser utilizado en otras partes de la aplicación
export default CaseSelection;
