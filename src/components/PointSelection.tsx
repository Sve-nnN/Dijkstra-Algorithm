import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

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
  return (
    <Card className="mb-6 p-4">
      <h3 className="text-xl font-semibold mb-4">
        Seleccione los puntos A y B
      </h3>
      <div className="flex gap-4">
        <div className="w-1/2">
          <label className="block mb-2">Punto A:</label>
          <select
            value={pointA}
            onChange={(e) => setPointA(e.target.value)}
            className="w-full p-2 border rounded-md text-black"
          >
            <option value="">Seleccionar</option>
            {vertexNames.map((name, i) => (
              <option key={i} value={name}>
                {name}
              </option>
            ))}
          </select>
        </div>
        <div className="w-1/2">
          <label className="block mb-2">Punto B:</label>
          <select
            value={pointB}
            onChange={(e) => setPointB(e.target.value)}
            className="w-full p-2 border rounded-md text-black"
          >
            <option value="">Seleccionar</option>
            {vertexNames.map((name, i) => (
              <option key={i} value={name}>
                {name}
              </option>
            ))}
          </select>
        </div>
      </div>
      <Button onClick={onCalculate} className="mt-4 w-full">
        Calcular camino mínimo
      </Button>
    </Card>
  );
};

export default PointSelection;
