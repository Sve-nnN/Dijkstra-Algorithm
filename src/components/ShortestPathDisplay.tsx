import React from "react";
import { Card } from "@/components/ui/card";

interface ShortestPathDisplayProps {
  shortestPath: string[];
  shortestPathDistance: string | number | null;
}

const ShortestPathDisplay: React.FC<ShortestPathDisplayProps> = ({
  shortestPath,
  shortestPathDistance,
}) => {
  return (
    <>
      {shortestPath.length > 0 && (
        <Card className="p-4">
          <h3 className="text-xl font-semibold mb-2">Camino más corto</h3>
          <p>
            <strong>Camino:</strong> {shortestPath.join(" → ")}
            <br />
            <strong>Distancia total:</strong> {shortestPathDistance} km
          </p>
        </Card>
      )}
    </>
  );
};

export default ShortestPathDisplay;
