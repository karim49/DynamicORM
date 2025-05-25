import DataSourceNode from './DataSourceNode';
import CustomEdge from './CustomEdge';
import SchemaNode from '../schema/SchemaNode';
import IntegratedNode from './IntegratedNode';

export const nodeTypes = {
  dataSourceNode: DataSourceNode,
  schemaNode: SchemaNode,
  integratedSchemaNode : IntegratedNode
};

export const edgeTypes = {
  custom: CustomEdge,
};
