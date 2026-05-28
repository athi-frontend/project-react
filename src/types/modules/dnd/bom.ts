export type NodeType = 'product' | 'assembly' | 'part';

export interface Node {
  id: string;
  label: string;
  type: NodeType;
  children?: string[];
  bomPartId?: string;
}

export interface PositionedNode {
  node: Node;
  x: number;
  y: number;
  depth: number;
  parent?: PositionedNode;
}

export interface ManagePartsDetailProps {
  projectId: number;
  productId?: number;
  initialDetail?: Record<string, any> | null;
  initialPartId?: string | null;
  onCancel?: () => void;
}

export interface BomPartFormData {
  model_id: string;
  assembly_type_id: string;
  location_id: string;
  quantity: string;
  part_category_id: string;
  part_no: string;
  part_name: string;
  description: string;
  unit_id: string;
  part_type: string;
  part_quantity_type: string;
  part_component_type: string;
  classification: string;
  part_purchase_type: string;
  manufacturer: string;
  manufacture_part_no: string;
  specification: string;
  parent_assembly: string;
  alternative_part_no: string;
  assembly_level: string;
  bom_type: string;
  other_unit: string;
}

