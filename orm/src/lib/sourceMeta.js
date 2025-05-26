// lib/sourceMeta.js
export const sourceMeta = {
  mysql: { label: 'MySQL', category: 'Relational DB', srcType: 'connection' },
  postgres: { label: 'PostgreSQL', category: 'Relational DB', srcType: 'connection' },
  sqlserver: { label: 'SQL Server', category: 'Relational DB', srcType: 'connection' },
  mongodb: { label: 'MongoDB', category: 'Non-Relational DB', srcType: 'connection' },
  redis: { label: 'Redis', category: 'Non-Relational DB', srcType: 'connection' },
  csv: { label: 'CSV', category: 'File', srcType: 'file' },
  excel: { label: 'Excel', category: 'File', srcType: 'file' },
  json: { label: 'JSON', category: 'File', srcType: 'file' },
};
