import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import { NUMBERMAP } from '@/constants/common';
import { NODE_W, NODE_H, ASSEMBLY_TREE_VIEWPORT_CONFIG } from '@/constants/modules/dnd/bom';

export const TreeSvgOuterDiv = styled(Box)(({ theme }) => ({
    maxWidth: "100%"
}));

export const ProductNodeContainer = styled(Box)(({ theme }) => ({
  width: NODE_W,
  height: NODE_H,
  backgroundColor: theme.palette.primary.main,
  borderRadius: "6px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: theme.palette.common.white,
  fontSize: "14px",
  fontWeight: "normal",
  cursor: "default",
}));

export const AssemblyNodeContainer = styled(Box)(({ theme }) => ({
  width: NODE_W,
  height: NODE_H,
  backgroundColor: theme.palette.grey[200],
  borderRadius: "6px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: theme.palette.text.primary,
  fontSize: "14px",
  textDecoration: "underline",
  cursor: "pointer",
  userSelect: "none",
  "@media (max-width: 991px)": {
    maxWidth: "100%",
  },
}));

export const PartNodeContainer = styled(Box)(({ theme }) => ({
  width: NODE_W,
  height: NODE_H,
  backgroundColor: theme.palette.common.white,
  border: `${NUMBERMAP.TWO}px solid ${theme.palette.primary.main}`,
  borderRadius: "6px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: theme.palette.text.primary,
  fontSize: "14px",
  textDecoration: "underline",
  cursor: "pointer",
  userSelect: "none",
  "@media (max-width: 991px)": {
    maxWidth: "100%",
  },
}));

export const ReactFlowContainer = styled(Box)(({ theme }) => ({
  width: "100%",
  height: `${ASSEMBLY_TREE_VIEWPORT_CONFIG.CONTAINER_HEIGHT}px`,
  position: "relative",
  "@media (max-width: 991px)": {
    maxWidth: "100%",
  },
}));

// Helper functions for inline styles (used in React Flow components)
export const getProductNodeStyle = (theme: any): React.CSSProperties => ({
  width: NODE_W,
  height: NODE_H,
  backgroundColor: theme.palette.primary.main,
  borderRadius: "6px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: theme.palette.common.white,
  fontSize: "14px",
  fontWeight: "normal",
  cursor: "default",
});


export const getPartNodeStyle = (theme: any): React.CSSProperties => ({
  width: NODE_W,
  height: NODE_H,
  backgroundColor: theme.palette.common.white,
  border: `${NUMBERMAP.TWO}px solid ${theme.palette.primary.main}`,
  borderRadius: "6px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: theme.palette.text.primary,
  fontSize: "14px",
  textDecoration: "underline",
  cursor: "pointer",
  userSelect: "none",
});

export const getHandleStyle = (): React.CSSProperties => ({
  background: "transparent",
  border: "none",
  width: NUMBERMAP.ZERO,
  height: NUMBERMAP.ZERO,
});

export const getEdgeStyle = (theme: any): React.CSSProperties => ({
  stroke: theme.palette.text.primary,
  strokeWidth: NUMBERMAP.TWO,
});

export const getSpineLineOverlayStyle = (
  screenX: number,
  screenY1: number,
  screenY2: number,
  theme: any
): React.CSSProperties => ({
  position: "absolute",
  left: `${screenX}px`,
  top: `${screenY1}px`,
  width: `${NUMBERMAP.TWO}px`,
  height: `${Math.max(NUMBERMAP.ZERO, screenY2 - screenY1)}px`,
  backgroundColor: theme.palette.text.primary,
  pointerEvents: "none",
  zIndex: NUMBERMAP.ONE,
  transform: "translateX(-50%)",
});


