import React, { useState } from "react";
import { Graph } from "react-d3-graph";

const DijkstraApp = () => {
  const [useCase, setUseCase] = useState("");
  const [matrixSize, setMatrixSize] = useState(null);
  const [matrix, setMatrix] = useState([]);
  const [vertexNames, setVertexNames] = useState([]);
  const [graph, setGraph] = useState(null);
  const [pointA, setPointA] = useState("");
  const [pointB, setPointB] = useState("");
  const [shortestPath, setShortestPath] = useState([]);

  const handleUseCaseChange = (e) => {
    setUseCase(e.target.value);
  };

  const handleMatrixSizeSubmit = (e) => {
    e.preventDefault();
    const size = parseInt(e.target.elements.size.value, 10);
    setMatrixSize(size);

    const names = generateVertexNames(size, useCase);
    setVertexNames(names);

    const newMatrix = Array(size)
      .fill(0)
      .map(() => Array(size).fill(0));
    setMatrix(newMatrix);
  };

  const handleGenerateRandomMatrix = () => {
    if (matrixSize) {
      const randomMatrix = generateRandomMatrix(matrixSize);
      setMatrix(randomMatrix);
    }
  };

  const generateRandomMatrix = (size) => {
    const matrix = Array(size)
      .fill(0)
      .map((_, i) =>
        Array(size)
          .fill(0)
          .map((_, j) => (i === j ? 0 : Math.floor(Math.random() * 100) + 1))
      );
    return matrix;
  };

  const generateGraph = (matrix) => {
    const graph = { nodes: [], links: [] };

    for (let i = 0; i < matrix.length; i++) {
      const node = { id: vertexNames[i] };
      graph.nodes.push(node);

      for (let j = 0; j < matrix.length; j++) {
        if (matrix[i][j] !== 0) {
          graph.links.push({
            source: vertexNames[i],
            target: vertexNames[j],
            label: String(matrix[i][j]),
          });
        }
      }
    }

    return graph;
  };

  const runDijkstra = (start, end) => {
    const n = matrix.length;
    const distances = Array(n).fill(Infinity);
    const previous = Array(n).fill(null);
    const visited = Array(n).fill(false);

    const startIdx = vertexNames.indexOf(start);
    const endIdx = vertexNames.indexOf(end);

    distances[startIdx] = 0;

    for (let i = 0; i < n; i++) {
      let u = -1;

      for (let j = 0; j < n; j++) {
        if (!visited[j] && (u === -1 || distances[j] < distances[u])) {
          u = j;
        }
      }

      if (distances[u] === Infinity) break;

      visited[u] = true;

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

    const path = [];
    let u = endIdx;

    while (previous[u] !== null) {
      path.unshift(u);
      u = previous[u];
    }

    if (path.length > 0) {
      path.unshift(startIdx);
    }

    return path.map((idx) => vertexNames[idx]);
  };

  const handleCalculateShortestPath = () => {
    const path = runDijkstra(pointA, pointB);
    setShortestPath(path);
  };

  const graphConfig = {
    nodeHighlightBehavior: true,
    node: {
      color: "lightgreen",
      size: 500,
      highlightStrokeColor: "blue",
    },
    link: {
      highlightColor: "lightblue",
      renderLabel: true,
      fontSize: 12,
    },
    directed: true,
  };

  const highlightedGraph = () => {
    if (!shortestPath.length) return graph;

    const newGraph = {
      ...graph,
      links: graph.links.map((link) => {
        const isInShortestPath =
          shortestPath.includes(link.source) &&
          shortestPath.includes(link.target);
        return {
          ...link,
          color: isInShortestPath ? "red" : "black",
        };
      }),
    };

    return newGraph;
  };

  return (
    <div>
      <h1>Algoritmo de Dijkstra</h1>

      {/* Paso 1: Seleccionar caso de uso */}
      <label>Seleccione un caso de uso:</label>
      <select value={useCase} onChange={handleUseCaseChange}>
        <option value="">Seleccionar</option>
        <option value="ciudades">Ciudades</option>
        <option value="vias-tren">Vías de tren</option>
        <option value="redes">Redes informáticas</option>
      </select>

      {/* Paso 2: Ingresar tamaño de la matriz */}
      {useCase && (
        <form onSubmit={handleMatrixSizeSubmit}>
          <label>Ingrese el número de nodos (entre 8 y 16):</label>
          <input type="number" name="size" min="8" max="16" required />
          <button type="submit">Generar Matriz</button>
        </form>
      )}

      {/* Botón para generar matriz aleatoria */}
      {matrixSize && (
        <button onClick={handleGenerateRandomMatrix}>
          Generar matriz aleatoria
        </button>
      )}

      {/* Paso 3: Visualización de la matriz con nombres de vértices */}
      {matrixSize && (
        <div>
          <h3>Matriz de distancias para {useCase}</h3>
          <table>
            <thead>
              <tr>
                <th></th>
                {vertexNames.map((name, i) => (
                  <th key={i}>{name}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {matrix.map((row, i) => (
                <tr key={i}>
                  <td>
                    <strong>{vertexNames[i]}</strong>
                  </td>
                  {row.map((val, j) => (
                    <td key={j}>
                      <input
                        type="number"
                        value={val}
                        onChange={(e) => {
                          const updatedMatrix = [...matrix];
                          updatedMatrix[i][j] =
                            parseInt(e.target.value, 10) || 0;
                          setMatrix(updatedMatrix);
                        }}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Botón para generar grafo */}
      {matrixSize && (
        <button onClick={() => setGraph(generateGraph(matrix))}>
          Generar Grafo
        </button>
      )}

      {/* Seleccionar puntos A y B */}
      {graph && (
        <div>
          <h3>Seleccione los puntos A y B</h3>
          <label>Punto A:</label>
          <select value={pointA} onChange={(e) => setPointA(e.target.value)}>
            <option value="">Seleccionar</option>
            {vertexNames.map((name, i) => (
              <option key={i} value={name}>
                {name}
              </option>
            ))}
          </select>

          <label>Punto B:</label>
          <select value={pointB} onChange={(e) => setPointB(e.target.value)}>
            <option value="">Seleccionar</option>
            {vertexNames.map((name, i) => (
              <option key={i} value={name}>
                {name}
              </option>
            ))}
          </select>

          <button onClick={handleCalculateShortestPath}>
            Calcular camino mínimo
          </button>
        </div>
      )}

      {/* Visualización del grafo generado con el camino mínimo resaltado */}
      {graph && (
        <div>
          <h3>Grafo generado</h3>
          <Graph id="graph-id" data={highlightedGraph()} config={graphConfig} />
        </div>
      )}
    </div>
  );
};

const generateVertexNames = (size, useCase) => {
  const cities = [
    "Lima",
    "Cusco",
    "Arequipa",
    "Trujillo",
    "Iquitos",
    "Piura",
    "Chiclayo",
    "Tacna",
    "Puno",
    "Huancayo",
    "Ayacucho",
    "Juliaca",
    "Tarapoto",
    "Cajamarca",
    "Tumbes",
    "Moquegua",
  ];
  const stations = [
    "Estación 1",
    "Estación 2",
    "Estación 3",
    "Estación 4",
    "Estación 5",
    "Estación 6",
    "Estación 7",
    "Estación 8",
    "Estación 9",
    "Estación 10",
    "Estación 11",
    "Estación 12",
    "Estación 13",
    "Estación 14",
    "Estación 15",
    "Estación 16",
  ];
  const networks = [
    "Nodo A",
    "Nodo B",
    "Nodo C",
    "Nodo D",
    "Nodo E",
    "Nodo F",
    "Nodo G",
    "Nodo H",
    "Nodo I",
    "Nodo J",
    "Nodo K",
    "Nodo L",
    "Nodo M",
    "Nodo N",
    "Nodo O",
    "Nodo P",
  ];

  switch (useCase) {
    case "ciudades":
      return cities.slice(0, size);
    case "vias-tren":
      return stations.slice(0, size);
    case "redes":
      return networks.slice(0, size);
    default:
      return [];
  }
};

export default DijkstraApp;
