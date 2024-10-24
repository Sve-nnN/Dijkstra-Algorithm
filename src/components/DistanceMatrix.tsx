import React from "react";
import { Table } from "@/components/ui/table";
import { Input } from "@/components/ui/input";

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
    <div className="overflow-x-auto mb-6">
      <h3 className="text-xl font-semibold mb-4">
        Matriz de distancias en kilómetros
      </h3>
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
    </div>
  );
};

export default DistanceMatrix;
