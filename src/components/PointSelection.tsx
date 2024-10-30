"use client"; // Indica que este módulo debe ser ejecutado en el cliente
import * as React from "react"; // Importa React
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons"; // Importa íconos de Radix UI
import { cn } from "@/lib/utils"; // Importa la función de utilidad para la manipulación de clases
import { Button } from "@/components/ui/button"; // Importa el componente Button de la carpeta de UI
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"; // Importa componentes relacionados con el comando de la carpeta de UI
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"; // Importa componentes relacionados con Popover de la carpeta de UI
import { Card } from "@/components/ui/card"; // Importa el componente Card de la carpeta de UI

// Define la interfaz para los elementos del Combobox
interface ComboboxItem {
  value: string; // Valor del elemento
  label: string; // Etiqueta que se muestra al usuario
}

// Define las propiedades del componente Combobox
interface ComboboxProps {
  items: ComboboxItem[]; // Array de elementos que se mostrarán en el Combobox
  value: string; // Valor actualmente seleccionado
  onChange: (value: string) => void; // Función que se llama al cambiar el valor
  placeholder: string; // Texto de marcador de posición
}

// Componente funcional Combobox
const Combobox: React.FC<ComboboxProps> = ({
  items,
  value,
  onChange,
  placeholder,
}) => {
  const [open, setOpen] = React.useState(false); // Estado para controlar la apertura del Popover

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline" // Estilo del botón
          role="combobox" // Atributo ARIA para accesibilidad
          aria-expanded={open} // Indica si el Combobox está abierto
          className="w-full justify-between shadow-lg" // Clases CSS para el estilo
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
            placeholder={`Search ${placeholder.toLowerCase()}...`} // Marcador de búsqueda
            className="h-9"
          />
          <CommandList>
            <CommandEmpty>No {placeholder.toLowerCase()} found.</CommandEmpty>
            <CommandGroup>
              {items.map((item) => (
                <CommandItem
                  key={item.value} // Llave única para cada elemento
                  value={item.value} // Valor del elemento
                  onSelect={(currentValue: string) => {
                    onChange(currentValue === value ? "" : currentValue); // Llama a onChange para actualizar el valor
                    setOpen(false); // Cierra el Popover
                  }}
                >
                  {item.label} {/* Muestra la etiqueta del elemento */}
                  <CheckIcon
                    className={cn(
                      "ml-auto h-4 w-4", // Clases CSS para el icono
                      value === item.value ? "opacity-100" : "opacity-0" // Cambia la opacidad si está seleccionado
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

// Define las propiedades del componente PointSelection
interface PointSelectionProps {
  vertexNames: string[]; // Nombres de los vértices disponibles para selección
  pointA: string; // Valor del punto A seleccionado
  setPointA: (value: string) => void; // Función para actualizar el punto A
  pointB: string; // Valor del punto B seleccionado
  setPointB: (value: string) => void; // Función para actualizar el punto B
  onCalculate: () => void; // Función para calcular el camino mínimo
}

// Componente funcional PointSelection
const PointSelection: React.FC<PointSelectionProps> = ({
  vertexNames,
  pointA,
  setPointA,
  pointB,
  setPointB,
  onCalculate,
}) => {
  const items = vertexNames.map((name) => ({ value: name, label: name })); // Crea los elementos del Combobox a partir de los nombres de los vértices

  return (
    <Card className="mb-6 p-4 animate-fade-in">
      <h3 className="text-xl font-semibold mb-4">
        Seleccione los puntos A y B
      </h3>
      <div className="flex gap-4">
        <div className="w-1/2">
          <label className="block mb-2">Punto A:</label>
          <Combobox
            items={items} // Elementos para el Combobox
            value={pointA} // Valor seleccionado para el punto A
            onChange={setPointA} // Función para actualizar el punto A
            placeholder="Punto A" // Texto de marcador de posición
          />
        </div>
        <div className="w-1/2">
          <label className="block mb-2">Punto B:</label>
          <Combobox
            items={items} // Elementos para el Combobox
            value={pointB} // Valor seleccionado para el punto B
            onChange={setPointB} // Función para actualizar el punto B
            placeholder="Punto B" // Texto de marcador de posición
          />
        </div>
      </div>
      <Button onClick={onCalculate} className="mt-4 w-full">
        Calcular camino mínimo
      </Button>
    </Card>
  );
};

// Exporta el componente PointSelection para que pueda ser utilizado en otras partes de la aplicación
export default PointSelection;
