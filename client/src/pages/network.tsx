import { useState, useCallback, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import {
  Network,
  User,
  Phone,
  Mail,
  AtSign,
  Wallet,
  Car,
  Smartphone,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Filter,
  Download,
  RefreshCw,
} from "lucide-react";
import type { Case, Entity, EntityRelationship } from "@shared/schema";

const entityTypeConfig = {
  person: { icon: User, color: "#3b82f6", bgColor: "bg-blue-500/20" },
  phone: { icon: Phone, color: "#22c55e", bgColor: "bg-green-500/20" },
  email: { icon: Mail, color: "#eab308", bgColor: "bg-yellow-500/20" },
  username: { icon: AtSign, color: "#a855f7", bgColor: "bg-purple-500/20" },
  wallet: { icon: Wallet, color: "#f97316", bgColor: "bg-orange-500/20" },
  vehicle: { icon: Car, color: "#06b6d4", bgColor: "bg-cyan-500/20" },
  imei: { icon: Smartphone, color: "#ec4899", bgColor: "bg-pink-500/20" },
};

interface GraphNode {
  id: string;
  label: string;
  type: string;
  x: number;
  y: number;
  connections: number;
}

interface GraphEdge {
  id: string;
  source: string;
  target: string;
  type: string;
  strength: number;
}

function NetworkNode({ node, selected, onClick }: { node: GraphNode; selected: boolean; onClick: () => void }) {
  const config = entityTypeConfig[node.type as keyof typeof entityTypeConfig] || entityTypeConfig.person;
  const Icon = config.icon;
  const size = Math.min(60, 40 + node.connections * 5);

  return (
    <g
      transform={`translate(${node.x}, ${node.y})`}
      onClick={onClick}
      className="cursor-pointer"
      data-testid={`node-${node.id}`}
    >
      <circle
        r={size / 2}
        fill={selected ? config.color : "hsl(var(--card))"}
        stroke={config.color}
        strokeWidth={selected ? 3 : 2}
        className="transition-all duration-200"
      />
      <foreignObject
        x={-12}
        y={-12}
        width={24}
        height={24}
        className="pointer-events-none"
      >
        <div className="flex h-full w-full items-center justify-center">
          <Icon className="h-4 w-4" style={{ color: selected ? "white" : config.color }} />
        </div>
      </foreignObject>
      <text
        y={size / 2 + 16}
        textAnchor="middle"
        className="fill-foreground text-xs font-medium"
      >
        {node.label.length > 15 ? node.label.slice(0, 15) + "..." : node.label}
      </text>
    </g>
  );
}

function NetworkEdge({ edge, nodes }: { edge: GraphEdge; nodes: GraphNode[] }) {
  const source = nodes.find((n) => n.id === edge.source);
  const target = nodes.find((n) => n.id === edge.target);

  if (!source || !target) return null;

  const strokeWidth = Math.max(1, edge.strength / 25);
  const strokeDasharray = edge.strength < 50 ? "5,5" : undefined;

  return (
    <line
      x1={source.x}
      y1={source.y}
      x2={target.x}
      y2={target.y}
      stroke="hsl(var(--border))"
      strokeWidth={strokeWidth}
      strokeDasharray={strokeDasharray}
      className="transition-all duration-200"
      data-testid={`edge-${edge.id}`}
    />
  );
}

function EmptyGraph() {
  return (
    <div className="flex h-full flex-col items-center justify-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
        <Network className="h-10 w-10 text-muted-foreground" />
      </div>
      <h3 className="mt-6 text-lg font-semibold">No Network Data</h3>
      <p className="mt-2 max-w-md text-center text-sm text-muted-foreground">
        Select a case with entities to visualize the network relationships.
        Add entities and create connections to see the graph.
      </p>
    </div>
  );
}

export default function NetworkPage() {
  const [selectedCase, setSelectedCase] = useState<string>("");
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [filterType, setFilterType] = useState<string>("all");

  const { data: cases } = useQuery<Case[]>({
    queryKey: ["/api/cases"],
  });

  const { data: entities, isLoading: entitiesLoading } = useQuery<Entity[]>({
    queryKey: ["/api/cases", selectedCase, "entities"],
    enabled: !!selectedCase,
  });

  const { data: relationships } = useQuery<EntityRelationship[]>({
    queryKey: ["/api/cases", selectedCase, "relationships"],
    enabled: !!selectedCase,
  });

  const graphData = useMemo(() => {
    if (!entities || entities.length === 0) {
      return { nodes: [], edges: [] };
    }

    const filteredEntities = filterType === "all" 
      ? entities 
      : entities.filter(e => e.type === filterType);

    const connectionCounts: Record<string, number> = {};
    relationships?.forEach((rel) => {
      connectionCounts[rel.sourceEntityId] = (connectionCounts[rel.sourceEntityId] || 0) + 1;
      connectionCounts[rel.targetEntityId] = (connectionCounts[rel.targetEntityId] || 0) + 1;
    });

    const centerX = 400;
    const centerY = 300;
    const radius = Math.min(250, 100 + filteredEntities.length * 20);

    const nodes: GraphNode[] = filteredEntities.map((entity, index) => {
      const angle = (index / filteredEntities.length) * 2 * Math.PI;
      return {
        id: entity.id,
        label: entity.label,
        type: entity.type,
        x: centerX + Math.cos(angle) * radius,
        y: centerY + Math.sin(angle) * radius,
        connections: connectionCounts[entity.id] || 0,
      };
    });

    const entityIds = new Set(filteredEntities.map(e => e.id));
    const edges: GraphEdge[] = (relationships || [])
      .filter(rel => entityIds.has(rel.sourceEntityId) && entityIds.has(rel.targetEntityId))
      .map((rel) => ({
        id: rel.id,
        source: rel.sourceEntityId,
        target: rel.targetEntityId,
        type: rel.relationshipType,
        strength: rel.strength || 50,
      }));

    return { nodes, edges };
  }, [entities, relationships, filterType]);

  const selectedEntity = entities?.find((e) => e.id === selectedNode);

  return (
    <div className="flex h-full">
      <div className="flex-1 flex flex-col">
        <div className="flex items-center justify-between gap-4 border-b border-border p-4">
          <div className="flex items-center gap-3">
            <Select value={selectedCase} onValueChange={setSelectedCase}>
              <SelectTrigger className="w-48" data-testid="select-network-case">
                <SelectValue placeholder="Select case..." />
              </SelectTrigger>
              <SelectContent>
                {cases?.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-36" data-testid="select-filter-type">
                <SelectValue placeholder="Filter..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {Object.keys(entityTypeConfig).map((type) => (
                  <SelectItem key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setZoom((z) => Math.max(0.5, z - 0.1))}
              data-testid="button-zoom-out"
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <span className="text-sm text-muted-foreground w-12 text-center">
              {Math.round(zoom * 100)}%
            </span>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setZoom((z) => Math.min(2, z + 0.1))}
              data-testid="button-zoom-in"
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" data-testid="button-fullscreen">
              <Maximize2 className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" data-testid="button-refresh">
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex-1 relative overflow-hidden osint-grid-bg">
          {!selectedCase ? (
            <EmptyGraph />
          ) : entitiesLoading ? (
            <div className="flex h-full items-center justify-center">
              <div className="flex flex-col items-center gap-4">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                <p className="text-sm text-muted-foreground">Loading network...</p>
              </div>
            </div>
          ) : graphData.nodes.length === 0 ? (
            <EmptyGraph />
          ) : (
            <svg
              className="h-full w-full"
              viewBox="0 0 800 600"
              style={{ transform: `scale(${zoom})`, transformOrigin: "center" }}
            >
              <defs>
                <marker
                  id="arrowhead"
                  markerWidth="10"
                  markerHeight="7"
                  refX="9"
                  refY="3.5"
                  orient="auto"
                >
                  <polygon
                    points="0 0, 10 3.5, 0 7"
                    fill="hsl(var(--border))"
                  />
                </marker>
              </defs>

              <g>
                {graphData.edges.map((edge) => (
                  <NetworkEdge key={edge.id} edge={edge} nodes={graphData.nodes} />
                ))}
              </g>

              <g>
                {graphData.nodes.map((node) => (
                  <NetworkNode
                    key={node.id}
                    node={node}
                    selected={selectedNode === node.id}
                    onClick={() => setSelectedNode(node.id === selectedNode ? null : node.id)}
                  />
                ))}
              </g>
            </svg>
          )}

          <div className="absolute bottom-4 left-4 flex flex-col gap-2 rounded-md border border-border bg-card p-3">
            <span className="text-xs font-medium text-muted-foreground">Legend</span>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(entityTypeConfig).map(([type, config]) => {
                const Icon = config.icon;
                return (
                  <div key={type} className="flex items-center gap-2 text-xs">
                    <div
                      className="flex h-5 w-5 items-center justify-center rounded-full"
                      style={{ backgroundColor: config.color }}
                    >
                      <Icon className="h-3 w-3 text-white" />
                    </div>
                    <span className="capitalize">{type}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="hidden w-80 border-l border-border bg-card/50 lg:block">
        <div className="border-b border-border p-4">
          <h3 className="font-semibold">Node Details</h3>
          <p className="text-xs text-muted-foreground">Select a node to view details</p>
        </div>
        <ScrollArea className="h-[calc(100vh-180px)]">
          {selectedEntity ? (
            <div className="p-4 space-y-4">
              <div className="flex items-center gap-3">
                {(() => {
                  const config = entityTypeConfig[selectedEntity.type as keyof typeof entityTypeConfig] || entityTypeConfig.person;
                  const Icon = config.icon;
                  return (
                    <div
                      className="flex h-12 w-12 items-center justify-center rounded-full"
                      style={{ backgroundColor: config.color }}
                    >
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                  );
                })()}
                <div>
                  <h4 className="font-semibold">{selectedEntity.label}</h4>
                  <Badge variant="outline" className="mt-1 text-xs">
                    {selectedEntity.type}
                  </Badge>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <span className="text-xs text-muted-foreground">Confidence Score</span>
                  <div className="mt-1 flex items-center gap-2">
                    <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full"
                        style={{ width: `${selectedEntity.confidenceScore || 0}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium">{selectedEntity.confidenceScore || 0}%</span>
                  </div>
                </div>

                <div>
                  <span className="text-xs text-muted-foreground">Risk Level</span>
                  <Badge
                    variant="outline"
                    className={`mt-1 block w-fit capitalize ${
                      selectedEntity.riskLevel === "critical"
                        ? "text-red-500 border-red-500/20"
                        : selectedEntity.riskLevel === "high"
                        ? "text-orange-500 border-orange-500/20"
                        : selectedEntity.riskLevel === "medium"
                        ? "text-yellow-500 border-yellow-500/20"
                        : selectedEntity.riskLevel === "low"
                        ? "text-green-500 border-green-500/20"
                        : "text-muted-foreground"
                    }`}
                  >
                    {selectedEntity.riskLevel}
                  </Badge>
                </div>

                {selectedEntity.notes && (
                  <div>
                    <span className="text-xs text-muted-foreground">Notes</span>
                    <p className="mt-1 text-sm">{selectedEntity.notes}</p>
                  </div>
                )}

                {selectedEntity.sourceAttribution && (
                  <div>
                    <span className="text-xs text-muted-foreground">Source</span>
                    <p className="mt-1 text-sm font-mono">{selectedEntity.sourceAttribution}</p>
                  </div>
                )}

                {selectedEntity.tags && selectedEntity.tags.length > 0 && (
                  <div>
                    <span className="text-xs text-muted-foreground">Tags</span>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {selectedEntity.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 px-4">
              <Network className="h-10 w-10 text-muted-foreground/50" />
              <p className="mt-4 text-sm text-muted-foreground text-center">
                Click on a node to view its details
              </p>
            </div>
          )}
        </ScrollArea>
      </div>
    </div>
  );
}
