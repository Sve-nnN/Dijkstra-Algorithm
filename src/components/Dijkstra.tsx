import React, { useState } from "react";
import CaseSelection from "./CaseSelection";
import MatrixSizeForm from "./MatrixSizeForm";
import DistanceMatrix from "./DistanceMatrix";
import GraphVisualization from "./GraphVisualization";
import PointSelection from "./PointSelection";
import ShortestPathDisplay from "./ShortestPathDisplay";
import { Button } from "@/components/ui/button";

// Función para generar nombres de nodos basada en el caso de uso
const generateVertexNames = (size: number, useCase: string): string[] => {
  const cities = [
    "Madrid",
    "Lisboa",
    "París",
    "Berlín",
    "Roma",
    "Londres",
    "Dublín",
    "Praga",
    "Atenas",
    "Viena",
    "Bruselas",
    "Amsterdam",
    "Estocolmo",
    "Helsinki",
    "Oslo",
    "Copenhague",
  ];

  const stations = [
    "Atocha",
    "Sants",
    "Chamartín",
    "Valencia Nord",
    "Santa Justa",
    "Bilbao Abando",
    "Zaragoza Delicias",
    "Málaga María Zambrano",
    "Córdoba Central",
    "Sevilla San Bernardo",
    "Granada",
    "Oviedo",
    "Santander",
    "León",
    "Albacete",
    "Alicante",
  ];

  const networks = [
    "AWS East",
    "AWS West",
    "Google Cloud EU",
    "Azure North",
    "Azure South",
    "Oracle Cloud East",
    "IBM Cloud Central",
    "AWS GovCloud",
    "Google Cloud APAC",
    "Azure East US",
    "AWS Canada",
    "IBM Cloud EU",
    "Google Cloud SA",
    "Azure Japan",
    "AWS UK",
    "Oracle Cloud West",
  ];

  switch (useCase) {
    case "ciudades":
      return cities.slice(0, size);
    case "estaciones":
      return stations.slice(0, size);
    case "redes":
      return networks.slice(0, size);
    default:
      return [];
  }
};
type Option = {
  value: string;
  label: string;
};
type Matrix = number[][];
type GraphData = {
  nodes: NodeData[];
  edges: EdgeData[];
};

type EdgeData = {
  source: number;
  target: number;
  label: string;
};

type NodeData = {
  id: number;
  x: number;
  y: number;
  label: string;
};

const DijkstraApp: React.FC = () => {
  const options: Option[] = [
    { value: "estaciones", label: "Estaciones de tren" },
    { value: "ciudades", label: "Ciudades" },
    { value: "redes", label: "Redes" },
  ];

  const [useCase, setUseCase] = useState<string>("");
  const [matrixSize, setMatrixSize] = useState<number | null>(null);
  const [matrix, setMatrix] = useState<Matrix>([]);
  const [vertexNames, setVertexNames] = useState<string[]>([]);
  const [graphData, setGraphData] = useState<GraphData>({
    nodes: [],
    edges: [],
  });
  const [pointA, setPointA] = useState<string>("");
  const [pointB, setPointB] = useState<string>("");
  const [shortestPath, setShortestPath] = useState<string[]>([]);
  const [shortestPathDistance, setShortestPathDistance] = useState<
    string | number | null
  >(null);
  const [highlightedEdges, setHighlightedEdges] = useState<EdgeData[]>([]);

  // Maneja la creación de la matriz aleatoria de caminos unidireccionales
  const handleGenerateRandomMatrix = () => {
    if (matrixSize) {
      const randomMatrix = generateRandomMatrixWithOneWayPaths(matrixSize);
      setMatrix(randomMatrix);
    }
  };

  // Genera el grafo basado en la matriz generada
  const generateGraph = () => {
    const nodes: NodeData[] = vertexNames.map((name, index) => ({
      id: index,
      x: Math.random() * 100, // Posición X aleatoria
      y: Math.random() * 100, // Posición Y aleatoria
      label: name,
    }));

    const edges: EdgeData[] = [];
    for (let i = 0; i < matrix.length; i++) {
      for (let j = 0; j < matrix.length; j++) {
        if (matrix[i][j] !== 0) {
          edges.push({ source: i, target: j, label: String(matrix[i][j]) });
        }
      }
    }

    setGraphData({ nodes, edges });
  };
  // Genera una matriz aleatoria de caminos unidireccionales con valores aleatorios
  const generateRandomMatrixWithOneWayPaths = (size: number): Matrix => {
    const matrix: Matrix = Array(size)
      .fill(0)
      .map((_, i) =>
        Array(size)
          .fill(0)
          .map((_, j) => {
            if (i === j) return 0; // No hay costo para ir a sí mismo
            if (Math.random() < 0.3) return 0; // 30% de probabilidad de que no haya camino directo
            return Math.floor(Math.random() * 100) + 1; // Peso aleatorio del camino
          })
      );

    // Asegurarse de que la matriz sea simétrica
    for (let i = 0; i < size; i++) {
      for (let j = i + 1; j < size; j++) {
        const value = matrix[i][j];
        matrix[j][i] = value; // Sincroniza ida y vuelta
      }
    }

    return matrix;
  };

  const runDijkstra = (start: string, end: string): string[] => {
    const n = matrix.length;
    const distances: number[] = Array(n).fill(Infinity);
    const previous: (number | null)[] = Array(n).fill(null);
    const visited: boolean[] = Array(n).fill(false);

    const startIdx = vertexNames.indexOf(start);
    const endIdx = vertexNames.indexOf(end);

    distances[startIdx] = 0;

    for (let i = 0; i < n; i++) {
      let u = -1;

      // Encuentra el nodo no visitado con la distancia más corta
      for (let j = 0; j < n; j++) {
        if (!visited[j] && (u === -1 || distances[j] < distances[u])) {
          u = j;
        }
      }

      if (distances[u] === Infinity) break;

      visited[u] = true;

      // Actualiza las distancias de los vecinos del nodo actual
      for (let v = 0; v < n; v++) {
        if (matrix[u][v] !== 0 && !visited[v]) {
          const alt = distances[u] + matrix[u][v];
          if (alt < distances[v]) {
            distances[v] = alt;
            previous[v] = u;
          }
        }
      }
    }

    // Reconstruye el camino más corto desde el nodo final al inicio
    const path: number[] = [];
    let u = endIdx;

    while (previous[u] !== null) {
      path.unshift(u);
      u = previous[u] !== null ? (previous[u] as number) : -1; // Asigna -1 si previous[u] es null
    }

    if (path.length > 0) {
      path.unshift(startIdx);
    }

    return path.map((idx) => vertexNames[idx]);
  };

  const handleCalculateShortestPath = () => {
    if (!pointA || !pointB) return; // Asegúrate de que ambos puntos estén seleccionados
    const path = runDijkstra(pointA, pointB);
    setShortestPath(path);

    // Actualiza las aristas resaltadas para el camino más corto
    if (path.length > 1) {
      const highlighted = [];
      for (let i = 0; i < path.length - 1; i++) {
        const sourceIdx = vertexNames.indexOf(path[i]);
        const targetIdx = vertexNames.indexOf(path[i + 1]);
        highlighted.push({ source: sourceIdx, target: targetIdx, label: "" });
      }
      setHighlightedEdges(highlighted);
    } else {
      setHighlightedEdges([]); // Si no hay camino, limpiar
    }

    // Sumar la distancia total
    const totalDistance = path.reduce((sum, node, i) => {
      if (i === path.length - 1) return sum; // No sumar el último nodo
      const currentIdx = vertexNames.indexOf(node);
      const nextIdx = vertexNames.indexOf(path[i + 1]);
      return sum + matrix[currentIdx][nextIdx]; // Sumar la distancia del camino
    }, 0);

    setShortestPathDistance(totalDistance); // Actualiza la distancia total
  };
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 animate-fade-in">
        Calcular el camino más corto
      </h1>

      <CaseSelection
        options={options}
        selectedOption={useCase}
        onSelect={setUseCase}
      />

      {useCase && (
        <MatrixSizeForm
          onSubmit={(size) => {
            setMatrixSize(size);
            const names = generateVertexNames(size, useCase);
            setVertexNames(names);
            setMatrix(
              Array(size)
                .fill(0)
                .map(() => Array(size).fill(0))
            );
          }}
        />
      )}

      {matrixSize && (
        <Button onClick={handleGenerateRandomMatrix} className="mb-6">
          Generar matriz aleatoria
        </Button>
      )}

      {matrixSize && (
        <DistanceMatrix
          matrix={matrix}
          vertexNames={vertexNames}
          onMatrixChange={setMatrix}
        />
      )}

      {matrixSize && matrix.length > 0 && (
        <Button onClick={generateGraph} className="mb-6">
          Generar Grafo
        </Button>
      )}

      {graphData.nodes.length > 0 && (
        <GraphVisualization
          graphData={graphData}
          highlightedEdges={highlightedEdges}
        />
      )}

      {graphData.nodes.length > 0 && (
        <PointSelection
          vertexNames={vertexNames}
          pointA={pointA}
          setPointA={setPointA}
          pointB={pointB}
          setPointB={setPointB}
          onCalculate={handleCalculateShortestPath}
        />
      )}

      <ShortestPathDisplay
        shortestPath={shortestPath}
        shortestPathDistance={shortestPathDistance}
      />
    </div>
  );
};
export default DijkstraApp;
