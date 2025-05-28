import DataSourceNode from './DataSourceNode';
import CustomEdge from './CustomEdge';
import SchemaNode from '../schema/SchemaNode';
import IntegratedNode from './IntegratedNode';
import EtlTransformNode from './EtlTransformNode';
import EtlLoadNode from './EtlLoadNode';
import CustomEtlEdge from './CustomEtlEdge';
export const nodeTypes = {
  dataSourceNode: DataSourceNode,
  schemaNode: SchemaNode,
  integratedSchemaNode: IntegratedNode,
  etlTransformNode: EtlTransformNode,
  etlLoadNode: EtlLoadNode,
};

export const edgeTypes = {
  custom: CustomEdge,
    customEtlEdge: CustomEtlEdge,

};
