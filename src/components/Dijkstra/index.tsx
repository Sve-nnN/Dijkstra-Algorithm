import React, { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table } from "@/components/ui/table";
import { Network } from "@visx/network";
import { Group } from "@visx/group";
import { scaleLinear } from "@visx/scale";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface options {
  value: string;
  label: string;
}

// Tipos para los datos del grafo
interface NodeData {
  id: number;
  x: number;
  y: number;
  label: string;
}

interface EdgeData {
  source: number;
  target: number;
  label?: string;
}

interface GraphData {
  nodes: NodeData[];
  edges: EdgeData[];
}

// Tipos para los datos de Dijkstra
type Matrix = number[][];

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
const options = [
  {
    value: "estaciones",
    label: "Estaciones de tren",
  },
  {
    value: "ciudades",
    label: "Ciudades",
  },
  {
    value: "redes",
    label: "Redes",
  },
];

// El componente principal del Algoritmo de Dijkstra
const DijkstraApp: React.FC = () => {
  const [open, setOpen] = React.useState<boolean>(false);
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
  const [highlightedEdges, setHighlightedEdges] = useState<EdgeData[]>([]); // Aristas resaltadas para el camino mínimo
  const [draggingNodeId, setDraggingNodeId] = useState<number | null>(null); // Nodo que se está arrastrando

  // Escalas para posicionar los nodos en el gráfico
  const xScale = scaleLinear<number>({
    domain: [0, 100],
    range: [0, 800],
  });

  const yScale = scaleLinear<number>({
    domain: [0, 100],
    range: [0, 600],
  });

  // Maneja la selección del caso de uso
  const handleUseCaseChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = e.target.value;
    setUseCase(selectedValue);
  };

  // Maneja la creación inicial de la matriz cuando el usuario especifica el tamaño
  const handleMatrixSizeSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const size = parseInt(
      (e.target as HTMLFormElement).elements.namedItem("size")?.value || "0",
      10
    );
    setMatrixSize(size);

    const names = generateVertexNames(size, useCase);
    setVertexNames(names);
    const mappedVertex = names.map((name) => ({
      value: name,
      label: name,
    }));

    const newMatrix: Matrix = Array(size)
      .fill(0)
      .map(() => Array(size).fill(0));
    setMatrix(newMatrix);
  };

  // Genera una matriz aleatoria de caminos unidireccionales
  const handleGenerateRandomMatrix = () => {
    if (matrixSize) {
      const randomMatrix = generateRandomMatrixWithOneWayPaths(matrixSize);
      setMatrix(randomMatrix);
    }
  };

  // Genera una matriz de caminos unidireccionales con valores aleatorios
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
          edges.push({
            source: i,
            target: j,
            label: String(matrix[i][j]),
          });
        }
      }
    }

    setGraphData({ nodes, edges });
  };

  // Renderiza el grafo utilizando `visx`
  const renderGraph = () => {
    return (
      <svg width={800} height={600}>
        <Group>
          {/* Renderizado de las aristas */}
          {graphData.edges.map((edge, index) => {
            const source = graphData.nodes[edge.source];
            const target = graphData.nodes[edge.target];
            const isHighlighted = highlightedEdges.some(
              (he) => he.source === edge.source && he.target === edge.target
            );

            return (
              <g key={`edge-${index}`}>
                {/* Línea de la arista */}
                <line
                  x1={xScale(source.x)}
                  y1={yScale(source.y)}
                  x2={xScale(target.x)}
                  y2={yScale(target.y)}
                  stroke={isHighlighted ? "red" : "#999"}
                  strokeWidth={isHighlighted ? 3 : 2}
                  markerEnd="url(#arrowhead)" // Añadir flecha
                />
                {/* Etiqueta de la arista */}
                <text
                  x={(xScale(source.x) + xScale(target.x)) / 2}
                  y={(yScale(source.y) + yScale(target.y)) / 2}
                  textAnchor="middle"
                  fill="#000"
                  fontSize="1em"
                  fontWeight={400}
                >
                  {edge.label} km
                </text>
              </g>
            );
          })}

          {/* Renderizado de los nodos */}
          {graphData.nodes.map((node) => (
            <g key={`node-${node.id}`}>
              <circle
                cx={xScale(node.x)}
                cy={yScale(node.y)}
                r={15}
                fill="#4a90e2"
              />
              <text
                x={xScale(node.x)}
                y={yScale(node.y) - 20}
                textAnchor="middle"
                fill="#333"
              >
                {node.label}
              </text>
            </g>
          ))}

          {/* Definición del marcador para la flecha */}
          <defs>
            <marker
              id="arrowhead"
              markerWidth="10"
              markerHeight="7"
              refX="10"
              refY="3.5"
              orient="auto"
            >
              <polygon points="0 0, 10 3.5, 0 7" fill="#999" />
            </marker>
          </defs>
        </Group>
      </svg>
    );
  };

  // Maneja el cálculo del camino más corto usando Dijkstra
  const handleCalculateShortestPath = () => {
    const path = runDijkstra(pointA, pointB);
    setShortestPath(path);

    // Actualiza las aristas resaltadas para el camino más corto
    if (path.length > 1) {
      const highlighted = [];
      for (let i = 0; i < path.length - 1; i++) {
        const sourceIdx = vertexNames.indexOf(path[i]);
        const targetIdx = vertexNames.indexOf(path[i + 1]);
        highlighted.push({ source: sourceIdx, target: targetIdx });
      }
      setHighlightedEdges(highlighted);
    } else {
      setHighlightedEdges([]);
    }
  };

  // Implementación del algoritmo de Dijkstra
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
      u = previous[u];
    }

    if (path.length > 0) {
      path.unshift(startIdx);
    }

    // Calcula la distancia total del camino más corto
    const totalDistance =
      distances[endIdx] === Infinity ? "Inalcanzable" : distances[endIdx];
    setShortestPathDistance(totalDistance);

    return path.map((idx) => vertexNames[idx]);
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Calcular el camino mas corto</h1>

      {/* Selección del caso de uso */}
      <Card className="mb-6 p-4 max-w-60">
        <label className="block mb-2">Selecciona un caso de uso:</label>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-[200px] justify-between"
            >
              {useCase
                ? options.find((opt) => opt.value === useCase)?.label
                : "Selecciona un caso de uso..."}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0">
            <Command>
              <CommandInput placeholder="Search framework..." />
              <CommandList>
                <CommandEmpty>No se encontraron opciones válidas.</CommandEmpty>
                <CommandGroup>
                  {options.map((opt) => (
                    <CommandItem
                      key={opt.value}
                      value={opt.value}
                      onSelect={(currentValue) => {
                        setUseCase(
                          currentValue === useCase ? "" : currentValue
                        );
                        setOpen(false);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          useCase === opt.value ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {opt.label}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </Card>
      {/* Formulario para ingresar el tamaño de la matriz */}
      {useCase && (
        <form onSubmit={handleMatrixSizeSubmit} className="mb-6 max-w-60">
          <Card className="p-4">
            <label className="block mb-2">
              Ingrese el número de nodos (entre 8 y 16):
            </label>
            <Input
              type="number"
              name="size"
              min="8"
              max="16"
              required
              className="mb-4 w-14"
            />
            <Button type="submit" className="w-full">
              Generar Matriz 🕚
            </Button>
          </Card>
        </form>
      )}

      {/* Botón para generar matriz aleatoria */}
      {matrixSize && (
        <Button onClick={handleGenerateRandomMatrix} className="mb-6">
          Generar matriz aleatoria
        </Button>
      )}

      <Card className="mb-6 p-4">
        {/* Visualización de la matriz de distancias */}
        {matrixSize && (
          <div className="overflow-x-auto mb-6">
            <h3 className="text-xl font-semibold mb-4">
              Matriz de distancias en kilómetros para {useCase}
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
                    <td className="px-4 py-2 font-semibold">
                      {vertexNames[i]}
                    </td>
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
                            setMatrix(updatedMatrix);
                          }}
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        )}
      </Card>
      {/* Botón para generar grafo */}
      {matrixSize && matrix.length > 0 && (
        <Button onClick={generateGraph} className="mb-6">
          Generar Grafo
        </Button>
      )}

      {/* Visualización del grafo generado */}
      {graphData.nodes.length > 0 && (
        <Card className="mb-6 p-4">
          <h3 className="text-xl font-semibold mb-4">Grafo generado</h3>
          <div
            className="border rounded-lg p-4"
            style={{ height: "100%", width: "100%" }}
          >
            {renderGraph()}
          </div>
        </Card>
      )}

      {/* Selección de puntos A y B */}
      {graphData.nodes.length > 0 && (
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
                className="w-full p-2 border rounded-md  text-white"
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
                className="w-full p-2 border rounded-md  text-white"
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
          <Button onClick={handleCalculateShortestPath} className="mt-4 w-full">
            Calcular camino mínimo
          </Button>
        </Card>
      )}

      {/* Mostrar texto del camino más corto */}
      {shortestPath.length > 0 && (
        <Card className="p-4">
          <h3 className="text-xl font-semibold mb-2">Camino más corto</h3>
          <p>
            <strong>Camino:</strong> {shortestPath.join(" → ")}
            <br />
            <strong>Distancia total:</strong> {shortestPathDistance}
          </p>
        </Card>
      )}
    </div>
  );
};

export default DijkstraApp;
