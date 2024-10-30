import React from "react"; // Importa React para crear componentes
import { Table } from "@/components/ui/table"; // Importa el componente Table de la carpeta de UI
import { Input } from "@/components/ui/input"; // Importa el componente Input de la carpeta de UI
import { Card } from "@/components/ui/card"; // Importa el componente Card de la carpeta de UI

// Define las propiedades del componente DistanceMatrix
interface DistanceMatrixProps {
  matrix: number[][]; // Matriz de distancias a representar
  vertexNames: string[]; // Nombres de los vértices que corresponden a las filas y columnas
  onMatrixChange: (newMatrix: number[][]) => void; // Función que se llama cuando la matriz cambia
}

// Componente funcional DistanceMatrix
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
                        const updatedMatrix = [...matrix]; // Crea una copia de la matriz actual
                        const newValue = parseInt(e.target.value, 10) || 0; // Convierte el valor de entrada a número o 0 si está vacío
                        updatedMatrix[i][j] = newValue; // Actualiza el valor en la matriz
                        updatedMatrix[j][i] = newValue; // Sincroniza la matriz para que sea simétrica
                        onMatrixChange(updatedMatrix); // Llama a la función para actualizar la matriz
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

// Exporta el componente para que pueda ser utilizado en otras partes de la aplicación
export default DistanceMatrix;
