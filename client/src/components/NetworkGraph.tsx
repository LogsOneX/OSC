import { useState, useCallback, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Network,
  ZoomIn,
  ZoomOut,
  Maximize2,
  RotateCcw,
  Download,
  User,
  Phone,
  Mail,
  Car,
  Wallet,
  Building,
  MapPin,
  X,
} from "lucide-react";

interface NetworkNode {
  id: string;
  type: "person" | "phone" | "email" | "vehicle" | "wallet" | "address" | "organization";
  label: string;
  data?: Record<string, string | undefined>;
  x?: number;
  y?: number;
}

interface NetworkEdge {
  source: string;
  target: string;
  relationship: string;
}

interface NetworkGraphProps {
  nodes: NetworkNode[];
  edges: NetworkEdge[];
  onNodeClick?: (node: NetworkNode) => void;
}

const nodeIcons: Record<string, React.ElementType> = {
  person: User,
  phone: Phone,
  email: Mail,
  vehicle: Car,
  wallet: Wallet,
  address: MapPin,
  organization: Building,
};

const nodeColors: Record<string, string> = {
  person: "bg-blue-500",
  phone: "bg-green-500",
  email: "bg-purple-500",
  vehicle: "bg-orange-500",
  wallet: "bg-yellow-500",
  address: "bg-pink-500",
  organization: "bg-cyan-500",
};

export function NetworkGraph({ nodes, edges, onNodeClick }: NetworkGraphProps) {
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [selectedNode, setSelectedNode] = useState<NetworkNode | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [nodePositions, setNodePositions] = useState<Record<string, { x: number; y: number }>>({});

  useEffect(() => {
    const centerX = 400;
    const centerY = 300;
    const radius = 200;

    const positions: Record<string, { x: number; y: number }> = {};
    nodes.forEach((node, idx) => {
      const angle = (2 * Math.PI * idx) / nodes.length - Math.PI / 2;
      positions[node.id] = {
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle),
      };
    });
    setNodePositions(positions);
  }, [nodes]);

  const handleZoomIn = () => setZoom((z) => Math.min(z + 0.2, 3));
  const handleZoomOut = () => setZoom((z) => Math.max(z - 0.2, 0.5));
  const handleReset = () => {
    setZoom(1);
    setOffset({ x: 0, y: 0 });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target === containerRef.current || (e.target as HTMLElement).tagName === "svg") {
      setDragging(true);
      setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (dragging) {
      setOffset({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => setDragging(false);

  const handleNodeClick = (node: NetworkNode) => {
    setSelectedNode(node);
    onNodeClick?.(node);
  };

  const getEdgePath = (edge: NetworkEdge) => {
    const source = nodePositions[edge.source];
    const target = nodePositions[edge.target];
    if (!source || !target) return "";
    return `M ${source.x} ${source.y} L ${target.x} ${target.y}`;
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10">
              <Network className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">Network Mapping</CardTitle>
              <p className="text-sm text-muted-foreground">
                {nodes.length} nodes, {edges.length} connections
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" onClick={handleZoomIn} data-testid="button-zoom-in">
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleZoomOut} data-testid="button-zoom-out">
              <ZoomOut className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleReset} data-testid="button-reset-view">
              <RotateCcw className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" data-testid="button-fullscreen">
              <Maximize2 className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" data-testid="button-download-graph">
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="flex h-[500px]">
          <div
            ref={containerRef}
            className="relative flex-1 overflow-hidden bg-muted/30 cursor-grab active:cursor-grabbing"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            <svg
              width="100%"
              height="100%"
              style={{
                transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})`,
                transformOrigin: "center",
              }}
            >
              {edges.map((edge, idx) => (
                <g key={idx}>
                  <path
                    d={getEdgePath(edge)}
                    stroke="hsl(var(--muted-foreground))"
                    strokeWidth="1"
                    strokeOpacity="0.3"
                    fill="none"
                  />
                  <text
                    x={
                      (nodePositions[edge.source]?.x + nodePositions[edge.target]?.x) / 2 || 0
                    }
                    y={
                      (nodePositions[edge.source]?.y + nodePositions[edge.target]?.y) / 2 - 5 || 0
                    }
                    textAnchor="middle"
                    className="fill-muted-foreground text-[10px]"
                  >
                    {edge.relationship}
                  </text>
                </g>
              ))}

              {nodes.map((node) => {
                const pos = nodePositions[node.id];
                if (!pos) return null;
                const Icon = nodeIcons[node.type] || User;
                const isSelected = selectedNode?.id === node.id;

                return (
                  <g
                    key={node.id}
                    transform={`translate(${pos.x}, ${pos.y})`}
                    onClick={() => handleNodeClick(node)}
                    className="cursor-pointer"
                    data-testid={`node-${node.id}`}
                  >
                    <circle
                      r={isSelected ? 28 : 24}
                      className={`${
                        isSelected ? "fill-primary" : "fill-card"
                      } stroke-border stroke-2`}
                    />
                    <foreignObject x="-12" y="-12" width="24" height="24">
                      <div className="flex h-full w-full items-center justify-center">
                        <Icon
                          className={`h-5 w-5 ${
                            isSelected ? "text-primary-foreground" : "text-foreground"
                          }`}
                        />
                      </div>
                    </foreignObject>
                    <text
                      y="40"
                      textAnchor="middle"
                      className="fill-foreground text-xs font-medium"
                    >
                      {node.label.length > 15
                        ? node.label.slice(0, 15) + "..."
                        : node.label}
                    </text>
                  </g>
                );
              })}
            </svg>

            <div className="absolute bottom-4 left-4 flex flex-wrap gap-2">
              {Object.entries(nodeColors).map(([type, color]) => (
                <div key={type} className="flex items-center gap-1.5">
                  <div className={`h-3 w-3 rounded-full ${color}`} />
                  <span className="text-xs text-muted-foreground capitalize">{type}</span>
                </div>
              ))}
            </div>
          </div>

          {selectedNode && (
            <div className="w-72 border-l bg-card">
              <div className="flex items-center justify-between gap-2 border-b p-4">
                <h3 className="font-semibold">Node Details</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => setSelectedNode(null)}
                  data-testid="button-close-details"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <ScrollArea className="h-[calc(100%-57px)]">
                <div className="p-4 space-y-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-md ${
                        nodeColors[selectedNode.type]
                      }`}
                    >
                      {(() => {
                        const Icon = nodeIcons[selectedNode.type] || User;
                        return <Icon className="h-5 w-5 text-white" />;
                      })()}
                    </div>
                    <div>
                      <p className="font-medium">{selectedNode.label}</p>
                      <Badge variant="secondary" className="capitalize">
                        {selectedNode.type}
                      </Badge>
                    </div>
                  </div>

                  <Separator />

                  {selectedNode.data && (
                    <div className="space-y-2">
                      {Object.entries(selectedNode.data).map(([key, value]) => (
                        <div key={key} className="flex justify-between text-sm">
                          <span className="text-muted-foreground capitalize">
                            {key.replace(/_/g, " ")}
                          </span>
                          <span className="font-medium font-mono text-right">
                            {value}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  <Separator />

                  <div>
                    <h4 className="text-sm font-medium mb-2">Connections</h4>
                    <div className="space-y-1">
                      {edges
                        .filter(
                          (e) =>
                            e.source === selectedNode.id ||
                            e.target === selectedNode.id
                        )
                        .map((edge, idx) => {
                          const connectedId =
                            edge.source === selectedNode.id
                              ? edge.target
                              : edge.source;
                          const connectedNode = nodes.find(
                            (n) => n.id === connectedId
                          );
                          return (
                            <div
                              key={idx}
                              className="flex items-center justify-between rounded-md bg-muted/50 px-2 py-1.5 text-xs"
                            >
                              <span>{connectedNode?.label}</span>
                              <span className="text-muted-foreground">
                                {edge.relationship}
                              </span>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
