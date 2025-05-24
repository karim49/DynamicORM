import CustomNode from './CustomNode';
import CustomEdge from './CustomEdge';
import SchemaBox from '../schema/SchemaBox';

export const nodeTypes = {
  custom: CustomNode,
  schema: SchemaBox,
};

export const edgeTypes = {
  custom: CustomEdge,
};
