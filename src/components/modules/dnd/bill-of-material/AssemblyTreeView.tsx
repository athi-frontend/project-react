'use client'

import { useMemo, useState, useEffect } from 'react'
import { useTheme } from '@mui/material/styles'
import ReactFlow, {
  Node,
  Edge,
  Handle,
  Position,
  NodeTypes,
  EdgeTypes,
  Controls,
  useReactFlow,
  BaseEdge,
  EdgeProps,
  Viewport,
} from 'reactflow'
import 'reactflow/dist/style.css'
import type { Node as BomNode } from '@/types/modules/dnd/bom'
import {
  TreeSvgOuterDiv,
  ReactFlowContainer,
  ProductNodeContainer,
  AssemblyNodeContainer,
  PartNodeContainer,
  getHandleStyle,
  getEdgeStyle,
  getSpineLineOverlayStyle,
} from '@/styles/modules/dnd/bomTree'
import {
  NODE_W,
  NODE_H,
  X_STEP,
  Y_STEP,
  SPINE_X,
  START_Y,
  ASSEMBLY_TREE_NODE_TYPES,
  ASSEMBLY_TREE_EDGE_TYPES,
  ASSEMBLY_TREE_HANDLE_IDS,
  ASSEMBLY_TREE_NODE_IDS,
  ASSEMBLY_TREE_EDGE_PREFIX,
  ASSEMBLY_TREE_VIEWPORT_CONFIG,
} from '@/constants/modules/dnd/bom'
import { NUMBERMAP } from '@/constants/common'


// Custom Edge Component for L-shaped connectors
const CustomStepEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  style = {},
  markerEnd,
}: EdgeProps) => {
  const theme = useTheme()
  const edgePath = `M ${sourceX} ${sourceY} L ${sourceX} ${targetY} L ${targetX} ${targetY}`

  return (
    <BaseEdge
      id={id}
      path={edgePath}
      style={{ ...style, ...getEdgeStyle(theme) }}
      markerEnd={markerEnd}
    />
  )
}

// Custom Edge Component for spine connections (vertical from root to spine, then horizontal to level 1 nodes)
const SpineEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  style = {},
}: EdgeProps) => {
  const theme = useTheme()
  const edgePath = `M ${sourceX} ${sourceY} L ${sourceX} ${targetY} L ${targetX} ${targetY}`

  return (
    <BaseEdge
      id={id}
      path={edgePath}
      style={{ ...style, ...getEdgeStyle(theme) }}
    />
  )
}

// Component to draw the vertical spine line using React Flow's coordinate system
const SpineLineOverlay = ({
  spineStartY,
  spineEndY,
}: {
  spineStartY: number
  spineEndY: number
}) => {
  const theme = useTheme()
  const { getViewport } = useReactFlow()
  const [viewport, setViewport] = useState<Viewport>(getViewport())

  useEffect(() => {
    // Update viewport on mount and when it changes
    const updateViewport = () => {
      setViewport(getViewport())
    }
    
    // Use a small interval to update viewport (React Flow doesn't expose viewport change events easily)
    const interval = setInterval(updateViewport, ASSEMBLY_TREE_VIEWPORT_CONFIG.UPDATE_INTERVAL)
    
    return () => clearInterval(interval)
  }, [getViewport])

  // Calculate screen coordinates
  const screenX = (SPINE_X - viewport.x) * viewport.zoom
  const screenY1 = (spineStartY - viewport.y) * viewport.zoom
  const screenY2 = (spineEndY - viewport.y) * viewport.zoom

  return (
    <div
      style={getSpineLineOverlayStyle(screenX, screenY1, screenY2, theme)}
    />
  )
}

// Custom Node Component for Product
const ProductNode = ({ data }: { data: { label: string; depth: number } }) => {
  return (
    <ProductNodeContainer>
      <Handle
        type="source"
        position={Position.Bottom}
        id={ASSEMBLY_TREE_HANDLE_IDS.SPINE}
        style={getHandleStyle()}
      />
      {data.label}
    </ProductNodeContainer>
  )
}

// Custom Node Component for Assembly (Level 1)
const AssemblyNode = ({ 
  data, 
  onPartClick 
}: { 
  data: { label: string; nodeId: string; depth: number } 
  onPartClick?: (partId: string) => void
}) => {
  const handleClick = () => {
    if (onPartClick && data.nodeId !== ASSEMBLY_TREE_NODE_IDS.PRODUCT) {
      onPartClick(data.nodeId)
    }
  }

  return (
    <AssemblyNodeContainer onClick={handleClick}>
      <Handle
        type="target"
        position={Position.Left}
        id={ASSEMBLY_TREE_HANDLE_IDS.SPINE_CONNECTION}
        style={getHandleStyle()}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id={ASSEMBLY_TREE_HANDLE_IDS.CHILDREN}
        style={getHandleStyle()}
      />
      {data.label}
    </AssemblyNodeContainer>
  )
}

// Custom Node Component for Parts (Level 2+)
const PartNode = ({ 
  data, 
  onPartClick 
}: { 
  data: { label: string; nodeId: string; depth: number } 
  onPartClick?: (partId: string) => void
}) => {
  const handleClick = () => {
    if (onPartClick) {
      onPartClick(data.nodeId)
    }
  }

  return (
    <PartNodeContainer onClick={handleClick}>
      <Handle
        type="target"
        position={Position.Left}
        style={getHandleStyle()}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        style={getHandleStyle()}
      />
      {data.label}
    </PartNodeContainer>
  )
}

// Create node types factory to pass onPartClick callback
const createNodeTypes = (onPartClick?: (partId: string) => void): NodeTypes => ({
  [ASSEMBLY_TREE_NODE_TYPES.PRODUCT]: ProductNode,
  [ASSEMBLY_TREE_NODE_TYPES.ASSEMBLY]: (props: any) => <AssemblyNode {...props} onPartClick={onPartClick} />,
  [ASSEMBLY_TREE_NODE_TYPES.PART]: (props: any) => <PartNode {...props} onPartClick={onPartClick} />,
})

// Define edge types
const edgeTypes: EdgeTypes = {
  [ASSEMBLY_TREE_EDGE_TYPES.SPINE]: SpineEdge,
  [ASSEMBLY_TREE_EDGE_TYPES.STEP]: CustomStepEdge,
}

interface PositionedNode {
  node: BomNode
  x: number
  y: number
  depth: number
  parent?: PositionedNode
}

let cursorY = START_Y

const layoutTree = (
  node: BomNode,
  nodeMap: Record<string, BomNode>,
  depth = NUMBERMAP.ZERO,
  parent?: PositionedNode
): PositionedNode[] => {
  const x =
    depth === NUMBERMAP.ZERO
      ? SPINE_X - NODE_W / NUMBERMAP.TWO
      : SPINE_X + depth * X_STEP

  const y = cursorY

  const current: PositionedNode = { node, x, y, depth, parent }
  const result = [current]

  cursorY += Y_STEP

  node.children?.forEach((childId) => {
    const child = nodeMap[childId]
    if (child) {
      result.push(...layoutTree(child, nodeMap, depth + NUMBERMAP.ONE, current))
    }
  })

  return result
}

function toTreeData(apiResp: any): {
  root: BomNode
  nodeMap: Record<string, BomNode>
} {
  if (!apiResp?.data?.[NUMBERMAP.ZERO]) {
    return {
      root: { id: ASSEMBLY_TREE_NODE_IDS.ROOT, label: '', type: ASSEMBLY_TREE_NODE_TYPES.PRODUCT },
      nodeMap: {},
    }
  }

  const bom = apiResp.data[NUMBERMAP.ZERO]
  const partsArr = Array.isArray(bom.parts) ? bom.parts : []
  const nodeMap: Record<string, BomNode> = {}

  // Build nodes
  for (const p of partsArr) {
    nodeMap[String(p.part_id)] = {
      id: String(p.part_id),
      label: p.part_name,
      type: p.assembly_level === NUMBERMAP.ONE ? ASSEMBLY_TREE_NODE_TYPES.ASSEMBLY : ASSEMBLY_TREE_NODE_TYPES.PART,
      children: [],
      bomPartId: p.bom_part_id ? String(p.bom_part_id) : undefined,
    }
  }

  // Assign children
  for (const p of partsArr) {
    if (
      p.assembly_level === NUMBERMAP.TWO &&
      p.parent_assembly_id !== null &&
      nodeMap[String(p.parent_assembly_id)]
    ) {
      nodeMap[String(p.parent_assembly_id)].children!.push(
        String(p.part_id)
      )
    }
  }

  const level1Ids = partsArr
    .filter((p: any) => p.assembly_level === NUMBERMAP.ONE)
    .map((p: any) => String(p.part_id))

  const root: BomNode = {
    id: ASSEMBLY_TREE_NODE_IDS.PRODUCT,
    label: bom.bom_name,
    type: ASSEMBLY_TREE_NODE_TYPES.PRODUCT,
    children: level1Ids,
  }

  return { root, nodeMap }
}

const AssemblyTreeView = ({ 
  apiData, 
  onPartClick 
}: { 
  apiData: any
  onPartClick?: (partId: string) => void
}) => {
  const { nodes, edges, spineStartY, spineEndY } = useMemo(() => {
    const { root, nodeMap } = toTreeData(apiData)

  cursorY = START_Y
    const positionedNodes = layoutTree(root, nodeMap)

    // Find root node and level 1 nodes
    const rootNode = positionedNodes.find((pn) => pn.depth === NUMBERMAP.ZERO)
    const level1Nodes = positionedNodes.filter((pn) => pn.depth === NUMBERMAP.ONE)

    // Calculate spine line coordinates
    const spineStartY = rootNode
      ? rootNode.y + NODE_H / NUMBERMAP.TWO
      : START_Y + NODE_H / NUMBERMAP.TWO
  const spineEndY =
      level1Nodes.length > NUMBERMAP.ZERO
        ? level1Nodes[level1Nodes.length - NUMBERMAP.ONE].y + NODE_H / NUMBERMAP.TWO
        : spineStartY

    // Convert to React Flow nodes
    const reactFlowNodes: Node[] = positionedNodes.map((pn) => ({
      id: pn.node.id,
      type: pn.node.type,
      position: { x: pn.x, y: pn.y },
      data: {
        label: pn.node.label,
        nodeId: pn.node.id,
        depth: pn.depth,
        bom_part_id: pn.node.bomPartId,
      },
      draggable: false,
      selectable: true,
    }))

    // Create edges
    const reactFlowEdges: Edge[] = []

    // Create spine connection edges for level 1 nodes
    level1Nodes.forEach((pn) => {
      reactFlowEdges.push({
        id: `${ASSEMBLY_TREE_EDGE_PREFIX.SPINE}${pn.node.id}`,
        source: rootNode!.node.id,
        target: pn.node.id,
        sourceHandle: ASSEMBLY_TREE_HANDLE_IDS.SPINE,
        targetHandle: ASSEMBLY_TREE_HANDLE_IDS.SPINE_CONNECTION,
        type: ASSEMBLY_TREE_EDGE_TYPES.SPINE,
        animated: false,
      })
    })

    // Create L-shaped edges for deeper levels
    positionedNodes
      .filter((pn): pn is PositionedNode & { parent: PositionedNode } => 
        pn.parent !== undefined && pn.depth > NUMBERMAP.ONE
      )
      .forEach((pn) => {
        reactFlowEdges.push({
          id: `${pn.parent.node.id}-${pn.node.id}`,
          source: pn.parent.node.id,
          target: pn.node.id,
          sourceHandle: ASSEMBLY_TREE_HANDLE_IDS.CHILDREN,
          targetHandle: ASSEMBLY_TREE_HANDLE_IDS.TARGET,
          type: ASSEMBLY_TREE_EDGE_TYPES.STEP,
          animated: false,
        })
      })

    return {
      nodes: reactFlowNodes,
      edges: reactFlowEdges,
      spineStartY,
      spineEndY,
    }
  }, [apiData])

  return (
    <TreeSvgOuterDiv>
      <ReactFlowContainer>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={createNodeTypes(onPartClick)}
          edgeTypes={edgeTypes}
          fitView
          fitViewOptions={{
            padding: ASSEMBLY_TREE_VIEWPORT_CONFIG.FIT_VIEW_PADDING,
            maxZoom: ASSEMBLY_TREE_VIEWPORT_CONFIG.MAX_ZOOM,
            minZoom: ASSEMBLY_TREE_VIEWPORT_CONFIG.MIN_ZOOM,
          }}
          nodesDraggable={false}
          nodesConnectable={false}
          elementsSelectable={true}
          panOnDrag={true}
          zoomOnScroll={true}
          zoomOnPinch={true}
          preventScrolling={false}
          onNodeClick={(_event, node) => {
            if (onPartClick && node.data.bom_part_id) {
              onPartClick(node.data.bom_part_id)
            }
          }}
          proOptions={{ hideAttribution: true }}
        >
          <Controls />
          <SpineLineOverlay spineStartY={spineStartY} spineEndY={spineEndY} />
        </ReactFlow>
      </ReactFlowContainer>
    </TreeSvgOuterDiv>
  )
}

export default AssemblyTreeView
