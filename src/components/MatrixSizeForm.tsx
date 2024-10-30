import React from "react"; // Importa React para crear componentes
import { Button } from "@/components/ui/button"; // Importa el componente Button de la carpeta de UI
import { Card } from "@/components/ui/card"; // Importa el componente Card de la carpeta de UI
import { Input } from "@/components/ui/input"; // Importa el componente Input de la carpeta de UI

// Define las propiedades del componente MatrixSizeForm
interface MatrixSizeFormProps {
  onSubmit: (size: number) => void; // Función que se llama al enviar el formulario con el tamaño de la matriz
}

// Componente funcional MatrixSizeForm
const MatrixSizeForm: React.FC<MatrixSizeFormProps> = ({ onSubmit }) => {
  // Maneja el evento de envío del formulario
  const handleMatrixSizeSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Previene la acción predeterminada del formulario
    const sizeValue = (e.target as HTMLFormElement).elements.namedItem(
      "size"
    ) as HTMLInputElement; // Obtiene el elemento de entrada de tamaño
    const size = parseInt(sizeValue.value, 10); // Convierte el valor de entrada a número
    onSubmit(size); // Llama a la función onSubmit con el tamaño
  };

  return (
    <form
      onSubmit={handleMatrixSizeSubmit} // Asocia el manejador de envío al formulario
      className="mb-6 max-w-60 animate-fade-in" // Clases CSS para el estilo
    >
      <Card className="p-4 min-w-min ">
        <label className="block mb-2">
          Escriba un número n. Dependiendo de su caso habrá n² datos (entre 8 y 16):
        </label>
        <Input
          type="number" // Tipo de entrada numérico
          name="size" // Nombre del campo de entrada
          min="8" // Valor mínimo permitido
          max="16" // Valor máximo permitido
          required // Hace que este campo sea obligatorio
          className="mb-4 w-min shadow-lg" // Clases CSS para el estilo
        />
        <Button type="submit" className="w-full">
          Generar Matriz 🕚
        </Button>
      </Card>
    </form>
  );
};

// Exporta el componente para que pueda ser utilizado en otras partes de la aplicación
export default MatrixSizeForm;
