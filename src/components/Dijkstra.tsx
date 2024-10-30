import React, { useState } from "react"; // Importa React y useState para manejar el estado
import CaseSelection from "./CaseSelection"; // Importa el componente para seleccionar el caso de uso
import MatrixSizeForm from "./MatrixSizeForm"; // Importa el componente para definir el tamaño de la matriz
import DistanceMatrix from "./DistanceMatrix"; // Importa el componente para mostrar la matriz de distancias
import GraphVisualization from "./GraphVisualization"; // Importa el componente para visualizar el grafo
import PointSelection from "./PointSelection"; // Importa el componente para seleccionar puntos en el grafo
import ShortestPathDisplay from "./ShortestPathDisplay"; // Importa el componente para mostrar el camino más corto
import { Button } from "@/components/ui/button"; // Importa el componente Button de la carpeta de UI

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

  // Devuelve un array de nombres según el caso de uso
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
  value: string; // Valor único de la opción
  label: string; // Etiqueta de la opción que se mostrará al usuario
};

type Matrix = number[][]; // Definición del tipo de matriz
type GraphData = {
  nodes: NodeData[]; // Nodos del grafo
  edges: EdgeData[]; // Aristas del grafo
};

type EdgeData = {
  source: number; // Índice del nodo de origen
  target: number; // Índice del nodo de destino
  label: string; // Etiqueta de la arista
};

type NodeData = {
  id: number; // ID del nodo
  x: number; // Posición X del nodo
  y: number; // Posición Y del nodo
  label: string; // Etiqueta del nodo
};

// Componente principal DijkstraApp
const DijkstraApp: React.FC = () => {
  const options: Option[] = [
    { value: "estaciones", label: "Estaciones de tren" },
    { value: "ciudades", label: "Ciudades" },
    { value: "redes", label: "Redes" },
  ];

  const [useCase, setUseCase] = useState<string>(""); // Estado para almacenar el caso de uso seleccionado
  const [matrixSize, setMatrixSize] = useState<number | null>(null); // Estado para el tamaño de la matriz
  const [matrix, setMatrix] = useState<Matrix>([]); // Estado para almacenar la matriz de distancias
  const [vertexNames, setVertexNames] = useState<string[]>([]); // Estado para almacenar los nombres de los vértices
  const [graphData, setGraphData] = useState<GraphData>({ nodes: [], edges: [] }); // Estado para almacenar los datos del grafo
  const [pointA, setPointA] = useState<string>(""); // Estado para el punto A del camino
  const [pointB, setPointB] = useState<string>(""); // Estado para el punto B del camino
  const [shortestPath, setShortestPath] = useState<string[]>([]); // Estado para almacenar el camino más corto
  const [shortestPathDistance, setShortestPathDistance] = useState<string | number | null>(null); // Estado para la distancia del camino más corto
  const [highlightedEdges, setHighlightedEdges] = useState<EdgeData[]>([]); // Estado para almacenar las aristas resaltadas

  // Maneja la creación de la matriz aleatoria de caminos unidireccionales
  const handleGenerateRandomMatrix = () => {
    if (matrixSize) {
      const randomMatrix = generateRandomMatrixWithOneWayPaths(matrixSize); // Genera una matriz aleatoria
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

    setGraphData({ nodes, edges }); // Actualiza el estado del grafo
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

    // Asegura que la matriz sea simétrica
    for (let i = 0; i < size; i++) {
      for (let j = i + 1; j < size; j++) {
        const value = matrix[i][j];
        matrix[j][i] = value; // Sincroniza ida y vuelta
      }
    }

    return matrix; // Devuelve la matriz generada
  };

  // Implementa el algoritmo de Dijkstra para encontrar el camino más corto
  const runDijkstra = (start: string, end: string): string[] => {
    const n = matrix.length;
    const distances: number[] = Array(n).fill(Infinity); // Inicializa las distancias a infinito
    const previous: (number | null)[] = Array(n).fill(null); // Almacena el nodo anterior en el camino
    const visited: boolean[] = Array(n).fill(false); // Almacena si el nodo ha sido visitado

    const startIdx = vertexNames.indexOf(start); // Índice del nodo de inicio
    const endIdx = vertexNames.indexOf(end); // Índice del nodo final

    distances[startIdx] = 0; // La distancia desde el nodo inicial a sí mismo es 0

    for (let i = 0; i < n; i++) {
      let u = -1;

      // Encuentra el nodo no visitado con la distancia más corta
      for (let j = 0; j < n; j++) {
        if (!visited[j] && (u === -1 || distances[j] < distances[u])) {
          u = j;
        }
      }

      if (distances[u] === Infinity) break; // Si no hay más nodos accesibles, sale del bucle

      visited[u] = true; // Marca el nodo como visitado

      // Actualiza las distancias de los vecinos del nodo actual
      for (let v = 0; v < n; v++) {
        if (matrix[u][v] !== 0 && !visited[v]) {
          const alt = distances[u] + matrix[u][v]; // Calcula la distancia alternativa
          if (alt < distances[v]) {
            distances[v] = alt; // Actualiza la distancia si es menor
            previous[v] = u; // Actualiza el nodo anterior
          }
        }
      }
    }

    // Reconstruye el camino más corto desde el nodo final al inicio
    const path: number[] = [];
    let u = endIdx;

    while (previous[u] !== null) {
      path.unshift(u); // Agrega el nodo al inicio del camino
      u = previous[u] !== null ? (previous[u] as number) : -1; // Asigna -1 si previous[u] es null
    }

    if (path.length > 0) {
      path.unshift(startIdx); // Agrega el nodo de inicio al camino
    }

    return path.map((idx) => vertexNames[idx]); // Devuelve los nombres de los nodos en el camino
  };

  // Maneja el cálculo del camino más corto entre dos puntos
  const handleCalculateShortestPath = () => {
    if (!pointA || !pointB) return; // Asegúrate de que ambos puntos estén seleccionados
    const path = runDijkstra(pointA, pointB); // Ejecuta el algoritmo de Dijkstra
    setShortestPath(path); // Actualiza el estado con el camino más corto

    // Actualiza las aristas resaltadas para el camino más corto
    if (path.length > 1) {
      const highlighted = [];
      for (let i = 0; i < path.length - 1; i++) {
        const sourceIdx = vertexNames.indexOf(path[i]);
        const targetIdx = vertexNames.indexOf(path[i + 1]);
        highlighted.push({ source: sourceIdx, target: targetIdx, label: "" }); // Agrega las aristas resaltadas
      }
      setHighlightedEdges(highlighted);
    } else {
      setHighlightedEdges([]); // Si no hay camino, limpiar
    }

    // Suma la distancia total
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

// Exporta el componente principal DijkstraApp para que pueda ser utilizado en otras partes de la aplicación
export default DijkstraApp;
