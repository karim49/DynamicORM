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
  if (!response.ok) throw new Error('Submission failed');
  return response.json();
}
