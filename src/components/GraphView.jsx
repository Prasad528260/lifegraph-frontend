import { useMemo } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  Handle,
  Position,
  useNodesState,
  useEdgesState,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

const DOMAIN_CONFIG = {
  identity: {
    bg: "#818cf8",
    border: "#4f46e5",
    light: "#eef2ff",
    icon: "👤",
  },
  education: {
    bg: "#60a5fa",
    border: "#2563eb",
    light: "#eff6ff",
    icon: "🎓",
  },
  finance: {
    bg: "#fbbf24",
    border: "#d97706",
    light: "#fffbeb",
    icon: "💰",
  },
  health: {
    bg: "#f87171",
    border: "#dc2626",
    light: "#fef2f2",
    icon: "🏥",
  },
};

const CustomNode = ({ data }) => {
  const config = DOMAIN_CONFIG[data.domain] || DOMAIN_CONFIG.identity;
  const isRoot = data.isRoot;

  return (
    <div
      style={{
        background: isRoot ? config.bg : config.light,
        border: `2px solid ${config.border}`,
        borderRadius: isRoot ? "12px" : "8px",
        padding: isRoot ? "10px 16px" : "6px 12px",
        minWidth: isRoot ? "120px" : "100px",
        textAlign: "center",
        boxShadow: isRoot
          ? "0 4px 12px rgba(0,0,0,0.15)"
          : "0 2px 6px rgba(0,0,0,0.08)",
      }}
    >
      <Handle type="target" position={Position.Top} style={{ opacity: 0 }} />
      <Handle type="target" position={Position.Left} style={{ opacity: 0 }} />
      <Handle type="target" position={Position.Right} style={{ opacity: 0 }} />
      <Handle type="target" position={Position.Bottom} style={{ opacity: 0 }} />

      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
        {isRoot && (
          <span style={{ fontSize: "14px" }}>{config.icon}</span>
        )}
        <span
          style={{
            fontSize: isRoot ? "13px" : "11px",
            fontWeight: isRoot ? "700" : "500",
            color: isRoot ? "#ffffff" : config.border,
            fontFamily: "arial",
          }}
        >
          {data.label}
        </span>
      </div>

      <Handle type="source" position={Position.Top} style={{ opacity: 0 }} />
      <Handle type="source" position={Position.Left} style={{ opacity: 0 }} />
      <Handle type="source" position={Position.Right} style={{ opacity: 0 }} />
      <Handle type="source" position={Position.Bottom} style={{ opacity: 0 }} />
    </div>
  );
};

const nodeTypes = { custom: CustomNode };

// ─────────────────────────────────────────
// radial layout — spreads in all directions
// ─────────────────────────────────────────
const radialLayout = (nodes, edges) => {
  const positions = {};
  const children = {}; // parent → [children]
  const parents = {};  // child → parent

  // build parent-child map
  edges.forEach((e) => {
    if (!children[e.from]) children[e.from] = [];
    children[e.from].push(e.to);
    parents[e.to] = e.from;
  });

  // find root node (no parent)
  const rootNode = nodes.find((n) => !parents[n.id]);
  if (!rootNode) return positions;

  // place root at center
  positions[rootNode.id] = { x: 0, y: 0 };

  // BFS — spread children radially around parent
  const queue = [{ id: rootNode.id, angle: 0, spread: 2 * Math.PI, depth: 1 }];
  const visited = new Set([rootNode.id]);

  while (queue.length > 0) {
    const { id, angle, spread, depth } = queue.shift();
    const nodeChildren = children[id] || [];

    if (nodeChildren.length === 0) continue;

    const parentPos = positions[id];
    const radius = depth === 1 ? 200 : 150; // first ring bigger
    const angleStep = spread / nodeChildren.length;
    const startAngle = angle - spread / 2 + angleStep / 2;

    nodeChildren.forEach((childId, i) => {
      if (visited.has(childId)) return;
      visited.add(childId);

      const childAngle = startAngle + i * angleStep;
      positions[childId] = {
        x: parentPos.x + radius * Math.cos(childAngle),
        y: parentPos.y + radius * Math.sin(childAngle),
      };

      // child spreads in narrower arc
      queue.push({
        id: childId,
        angle: childAngle,
        spread: Math.max(spread / nodeChildren.length, Math.PI / 3),
        depth: depth + 1,
      });
    });
  }

  // fallback for disconnected nodes
  nodes.forEach((n, i) => {
    if (!positions[n.id]) {
      positions[n.id] = { x: i * 200, y: 400 };
    }
  });

  return positions;
};

// ─────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────
const GraphView = ({ nodes, edges }) => {

  const rfNodes = useMemo(() => {
    if (!nodes || nodes.length === 0) return [];

    const hasIncoming = new Set(edges.map((e) => e.to));
    const positions = radialLayout(nodes, edges);

    return nodes.map((node) => ({
      id: node.id,
      type: "custom",
      position: positions[node.id] || { x: 0, y: 0 },
      data: {
        label: node.label,
        domain: node.domain,
        isRoot: !hasIncoming.has(node.id) || node.data?.type === "root",
      },
    }));
  }, [nodes, edges]);

  const rfEdges = useMemo(() => {
    if (!edges || edges.length === 0) return [];

    return edges.map((edge, i) => ({
      id: `edge_${i}`,
      source: edge.from,
      target: edge.to,
      label: edge.relation,
      type: "straight",
      style: { stroke: "#94a3b8", strokeWidth: 1.5 },
      labelStyle: {
        fontSize: 10,
        fill: "#64748b",
        fontFamily: "arial",
      },
      labelBgStyle: {
        fill: "#f8fafc",
        fillOpacity: 0.8,
      },
      markerEnd: {
        type: "arrowclosed",
        color: "#94a3b8",
        width: 15,
        height: 15,
      },
    }));
  }, [edges]);

  const [flowNodes, setFlowNodes, onNodesChange] = useNodesState(rfNodes);
  const [flowEdges, setFlowEdges, onEdgesChange] = useEdgesState(rfEdges);

  useMemo(() => {
    setFlowNodes(rfNodes);
    setFlowEdges(rfEdges);
  }, [rfNodes, rfEdges]);

  if (!nodes || nodes.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 bg-transparent">
        <p className="text-neutral-500 text-sm font-medium">
          No graph data yet.
        </p>
      </div>
    );
  }

  return (
    <div
      className="w-full h-full min-h-[500px] bg-transparent"
    >
      <ReactFlow
        nodes={flowNodes}
        edges={flowEdges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.4 }}
        minZoom={0.2}
        maxZoom={2}
        attributionPosition="bottom-left"
      >
        <Background color="#e2e8f0" gap={20} />
        <Controls />
        <MiniMap
          nodeColor={(n) => {
            const domain = n.data?.domain;
            return DOMAIN_CONFIG[domain]?.bg || "#818cf8";
          }}
          style={{
            border: "1px solid #e2e8f0",
            borderRadius: "8px",
          }}
        />
      </ReactFlow>
    </div>
  );
};

export default GraphView;