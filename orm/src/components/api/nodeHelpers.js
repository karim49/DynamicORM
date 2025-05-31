export async function uploadFileApi(file) {
  const formData = new FormData();
  formData.append('file', file);
  const response = await fetch(`${import.meta.env.VITE_BEAPI}/api/uploadFile`, {
    method: 'POST',
    body: formData,
  });
  if (!response.ok) throw new Error('Failed to upload file');
  return response.json();
}

export async function sendConnectionApi({ nodeId, type, connectionString }) {
  const response = await fetch(`${import.meta.env.VITE_BEAPI}/api/connection`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nodeId, type, connectionString }),
  });
  if (!response.ok) throw new Error('Submission failed');
  return response.json();
}

export async function sendSchemaDataApi(data) {
  const response = await fetch(`${import.meta.env.VITE_BEAPI}/api/handleSelectedSchema`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ data }),
  });
  if (!response.ok) {
    let errorMsg = 'Submission failed';
    try {
      const err = await response.json();
      errorMsg = err.message || JSON.stringify(err) || errorMsg;
    } catch (e) {
      // fallback: try text
      try {
        errorMsg = await response.text();
      } catch {}
    }
    throw new Error(errorMsg);
  }
  return response.json();
}

export async function fetchSampleRecordApi(pipeline) {
  // This endpoint should apply the pipeline to a sample record and return the result (no transaction)
  const response = await fetch(`${import.meta.env.VITE_BEAPI}/api/sampleRecord`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(pipeline),
  });
  if (!response.ok) {
    let errorMsg = 'Failed to fetch sample record';
    try {
      const err = await response.json();
      errorMsg = err.message || JSON.stringify(err) || errorMsg;
    } catch {
      try { errorMsg = await response.text(); } catch { /* ignore */ }
    }
    throw new Error(errorMsg);
  }
  return response.json();
}

export async function sendConfigurationApi(config) {
  const response = await fetch(`${import.meta.env.VITE_BEAPI}/api/etl/configuration`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(config),
  });
  if (!response.ok) {
    let errorMsg = 'Failed to send configuration';
    try {
      const err = await response.json();
      errorMsg = err.message || JSON.stringify(err) || errorMsg;
    } catch {
      try { errorMsg = await response.text(); } catch { /* ignore */ }
    }
    throw new Error(errorMsg);
  }
  return response.json();
}
