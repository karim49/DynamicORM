import SourceNode from './SourceNode';
import CustomEdge from './CustomEdge';
import SchemaNode from '../schema/SchemaNode';
import IntegratedNode from './IntegratedNode';

export const nodeTypes = {
  sourceNode: SourceNode,
  schemaNode: SchemaNode,
  integratedSchemaNode : IntegratedNode
};

export const edgeTypes = {
  custom: CustomEdge,
};
