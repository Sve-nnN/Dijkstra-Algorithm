import React from "react";
import { Group } from "@visx/group";
import { scaleLinear } from "@visx/scale";
import { Card } from "@/components/ui/card";
interface GraphVisualizationProps {
  graphData: {
    nodes: { id: number; x: number; y: number; label: string }[];
    edges: { source: number; target: number; label: string }[];
  };
  highlightedEdges: { source: number; target: number }[];
}

const GraphVisualization: React.FC<GraphVisualizationProps> = ({
  graphData,
  highlightedEdges,
}) => {
  const xScale = scaleLinear<number>({ domain: [0, 100], range: [0, 800] });
  const yScale = scaleLinear<number>({ domain: [0, 100], range: [0, 600] });

  return (
    <Card className="p-4 m-4">
      <svg width="800px" height="600px" className="animate-fade-in">
        <Group>
          {graphData.edges.map((edge, index) => {
            const source = graphData.nodes[edge.source];
            const target = graphData.nodes[edge.target];
            const isHighlighted = highlightedEdges.some(
              (he) => he.source === edge.source && he.target === edge.target
            );

            return (
              <g key={`edge-${index}`}>
                <line
                  x1={xScale(source.x)}
                  y1={yScale(source.y)}
                  x2={xScale(target.x)}
                  y2={yScale(target.y)}
                  stroke={isHighlighted ? "red" : "#999"}
                  strokeWidth={isHighlighted ? 3 : 2}
                  markerEnd="url(#arrowhead)"
                />
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
    </Card>
  );
};

export default GraphVisualization;
