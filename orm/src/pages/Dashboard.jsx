import React from 'react';
import SchemaBuilder from '../components/SchemaBuilder';

export default function Dashboard() {
  return (
    <div className="flex h-screen">
      <div className="w-64 bg-gray-800 text-white p-4">
        <h2 className="text-xl font-bold mb-4">Sidebar</h2>
        <ul>
          <li className="mb-2">Drag MongoDB</li>
          <li className="mb-2">Drag SQL</li>
          <li className="mb-2">Import File</li>
        </ul>
      </div>
      <div className="flex-1 bg-gray-100">
        <SchemaBuilder />
      </div>
    </div>
  );
}