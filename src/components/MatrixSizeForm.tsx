import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface MatrixSizeFormProps {
  onSubmit: (size: number) => void;
}

const MatrixSizeForm: React.FC<MatrixSizeFormProps> = ({ onSubmit }) => {
  const handleMatrixSizeSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const sizeValue = (e.target as HTMLFormElement).elements.namedItem(
      "size"
    ) as HTMLInputElement;
    const size = parseInt(sizeValue.value, 10);
    onSubmit(size);
  };

  return (
    <form
      onSubmit={handleMatrixSizeSubmit}
      className="mb-6 max-w-60 animate-fade-in"
    >
      <Card className="p-4 min-w-min ">
        <label className="block mb-2">
          Escriba un número n. Dependiendo de su caso habrá n² datos (entre 8 y 16):
        </label>
        <Input
          type="number"
          name="size"
          min="8"
          max="16"
          required
          className="mb-4 w-min shadow-lg"
        />
        <Button type="submit" className="w-full">
          Generar Matriz 🕚
        </Button>
      </Card>
    </form>
  );
};

export default MatrixSizeForm;
