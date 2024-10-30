import React from "react"; // Importa React para crear componentes
import { Group } from "@visx/group"; // Importa el componente Group de la biblioteca visx
import { scaleLinear } from "@visx/scale"; // Importa la función para crear escalas lineales de visx
import { Card } from "@/components/ui/card"; // Importa el componente Card de la carpeta de UI

// Define las propiedades del componente GraphVisualization
interface GraphVisualizationProps {
  graphData: {
    nodes: { id: number; x: number; y: number; label: string }[]; // Nodos del grafo
    edges: { source: number; target: number; label: string }[]; // Aristas del grafo
  };
  highlightedEdges: { source: number; target: number }[]; // Aristas que se deben resaltar
}

// Componente funcional GraphVisualization
const GraphVisualization: React.FC<GraphVisualizationProps> = ({
  graphData,
  highlightedEdges,
}) => {
  // Escalas para posicionar los nodos en el SVG
  const xScale = scaleLinear<number>({ domain: [0, 100], range: [0, 800] });
  const yScale = scaleLinear<number>({ domain: [0, 100], range: [0, 600] });

  return (
    <Card className="p-4 m-4">
      <svg width="800px" height="600px" className="animate-fade-in">
        <Group>
          {graphData.edges.map((edge, index) => {
            const source = graphData.nodes[edge.source]; // Nodo de origen
            const target = graphData.nodes[edge.target]; // Nodo de destino
            const isHighlighted = highlightedEdges.some(
              (he) => he.source === edge.source && he.target === edge.target // Verifica si la arista debe ser resaltada
            );

            return (
              <g key={`edge-${index}`}>
                <line
                  x1={xScale(source.x)} // Coordenada X del nodo de origen
                  y1={yScale(source.y)} // Coordenada Y del nodo de origen
                  x2={xScale(target.x)} // Coordenada X del nodo de destino
                  y2={yScale(target.y)} // Coordenada Y del nodo de destino
                  stroke={isHighlighted ? "red" : "#999"} // Color de la línea según el estado de resaltado
                  strokeWidth={isHighlighted ? 3 : 2} // Ancho de la línea según el estado de resaltado
                  markerEnd="url(#arrowhead)" // Añade una flecha al final de la línea
                />
                <text
                  x={(xScale(source.x) + xScale(target.x)) / 2} // Posición X del texto en el medio de la línea
                  y={(yScale(source.y) + yScale(target.y)) / 2} // Posición Y del texto en el medio de la línea
                  textAnchor="middle" // Centra el texto horizontalmente
                  fill="#000" // Color del texto
                  fontSize="1em" // Tamaño de fuente del texto
                  fontWeight={400} // Peso de fuente del texto
                >
                  {edge.label} km
                </text>
              </g>
            );
          })}

          {graphData.nodes.map((node) => (
            <g key={`node-${node.id}`}>
              <circle
                cx={xScale(node.x)} // Coordenada X del nodo
                cy={yScale(node.y)} // Coordenada Y del nodo
                r={15} // Radio del círculo
                fill="#4a90e2" // Color del círculo
              />
              <text
                x={xScale(node.x)} // Posición X del texto
                y={yScale(node.y) - 20} // Posición Y del texto (arriba del círculo)
                textAnchor="middle" // Centra el texto horizontalmente
                fill="#333" // Color del texto
              >
                {node.label}
              </text>
            </g>
          ))}

          <defs>
            <marker
              id="arrowhead" // Definición del marcador de flecha
              markerWidth="10"
              markerHeight="7"
              refX="10"
              refY="3.5"
              orient="auto"
            >
              <polygon points="0 0, 10 3.5, 0 7" fill="#999" /> // Forma del marcador
            </marker>
          </defs>
        </Group>
      </svg>
    </Card>
  );
};

// Exporta el componente para que pueda ser utilizado en otras partes de la aplicación
export default GraphVisualization;
