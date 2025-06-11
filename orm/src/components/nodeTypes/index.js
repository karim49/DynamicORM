import DataSourceNode from './DataSourceNode';
import CustomEdge from './CustomEdge';
import SchemaNode from '../schema/SchemaNode';
import IntegratedNode from './IntegratedNode';
import EtlTransformNode from './EtlTransformNode';
import EtlLoadNode from './EtlLoadNode';
import CustomEtlEdge from './CustomEtlEdge';
import OperationNode from './OperationNode';

export const nodeTypes = {
  dataSourceNode: DataSourceNode,
  schemaNode: SchemaNode,
  integratedSchemaNode: IntegratedNode,
  etlTransformNode: EtlTransformNode,
  etlLoadNode: EtlLoadNode,
  operationNode: OperationNode
};

export const edgeTypes = {
  custom: CustomEdge,
    customEtlEdge: CustomEtlEdge,

};
