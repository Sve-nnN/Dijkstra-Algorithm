import React from "react"; // Importa React para crear componentes
import { Card } from "@/components/ui/card"; // Importa el componente Card de la carpeta de UI

// Define las propiedades del componente ShortestPathDisplay
interface ShortestPathDisplayProps {
  shortestPath: string[]; // Array que representa el camino más corto
  shortestPathDistance: string | number | null; // Distancia total del camino más corto
}

// Componente funcional ShortestPathDisplay
const ShortestPathDisplay: React.FC<ShortestPathDisplayProps> = ({
  shortestPath,
  shortestPathDistance,
}) => {
  return (
    <>
      {shortestPath.length > 0 && ( // Verifica si hay un camino más corto
        <Card className="p-4 animate-fade-in"> {/* Card que contiene la información del camino */}
          <h3 className="text-xl font-semibold mb-2">Camino más corto</h3> {/* Título */}
          <p>
            <strong>Camino:</strong> {shortestPath.join(" → ")} {/* Muestra el camino como una cadena */}
            <br />
            <strong>Distancia total:</strong> {shortestPathDistance} km {/* Muestra la distancia total */}
          </p>
        </Card>
      )}
    </>
  );
};

// Exporta el componente para que pueda ser utilizado en otras partes de la aplicación
export default ShortestPathDisplay;
