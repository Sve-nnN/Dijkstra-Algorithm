import React from "react";
import { Table } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
interface DistanceMatrixProps {
  matrix: number[][];
  vertexNames: string[];
  onMatrixChange: (newMatrix: number[][]) => void;
}

const DistanceMatrix: React.FC<DistanceMatrixProps> = ({
  matrix,
  vertexNames,
  onMatrixChange,
}) => {
  return (
    <Card className="overflow-x-auto mb-6 p-6 animate-fade-in">
      <h3 className="text-xl font-semibold mb-4">
        Matriz de distancias en kilómetros
      </h3>
 <label className="block mb-2">
 La matriz tendrá datos de la distancia (en km) de datos relacionados al caso seleccionado
        </label>
      <Card className="mb-4 p-4 shadow-lg">
        <Table className="table-auto w-full min-w-max">
          <thead>
            <tr>
              <th className="px-4 py-2"></th>
              {vertexNames.map((name, i) => (
                <th key={i} className="px-4 py-2">
                  {name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {matrix.map((row, i) => (
              <tr key={i}>
                <td className="px-4 py-2 font-semibold">{vertexNames[i]}</td>
                {row.map((val, j) => (
                  <td key={j} className="px-4 py-2">
                    <Input
                      type="number"
                      value={val}
                      className="w-20"
                      onChange={(e) => {
                        const updatedMatrix = [...matrix];
                        const newValue = parseInt(e.target.value, 10) || 0;
                        updatedMatrix[i][j] = newValue;
                        updatedMatrix[j][i] = newValue; // Sincroniza ida y vuelta
                        onMatrixChange(updatedMatrix);
                      }}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </Table>
      </Card>
    </Card>
  );
};

export default DistanceMatrix;
