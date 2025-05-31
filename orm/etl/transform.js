import etl from 'etl';

function transformData(records) {
  // Transform each record using etljs (example: add a timestamp)
  return etl.toStream(records)
    .pipe(etl.map(record => ({
      ...record,
      transformedAt: new Date().toISOString(),
    })));
}

export { transformData };
