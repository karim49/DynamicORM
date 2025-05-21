// lib/sourceMeta.js
export const sourceMeta = {
  mysql: { label: 'MySQL', category: 'Relational DB', modalType: 'connection' },
  postgres: { label: 'PostgreSQL', category: 'Relational DB', modalType: 'connection' },
  sqlserver: { label: 'SQL Server', category: 'Relational DB', modalType: 'connection' },
  mongodb: { label: 'MongoDB', category: 'Non-Relational DB', modalType: 'connection' },
  redis: { label: 'Redis', category: 'Non-Relational DB', modalType: 'connection' },
  csv: { label: 'CSV', category: 'File', modalType: 'file' },
  excel: { label: 'Excel', category: 'File', modalType: 'file' },
  json: { label: 'JSON', category: 'File', modalType: 'file' },
};
