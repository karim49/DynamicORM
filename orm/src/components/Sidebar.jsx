import React from 'react';

const SidebarItem = ({ label, type }) => {
  const onDragStart = (event) => {
    event.dataTransfer.setData('application/reactflow', type);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div
      className="bg-gray-200 p-2 m-2 rounded cursor-move text-center shadow hover:bg-gray-300"
      draggable
      onDragStart={onDragStart}
    >
      {label}
    </div>
  );
};

export default function Sidebar() {
  return (
    <aside className="w-48 bg-white border-r p-4">
      <h2 className="font-bold mb-4 text-lg">Data Sources</h2>
      <SidebarItem label="MongoDB" type="mongodb" />
      <SidebarItem label="SQL" type="sql" />
      <SidebarItem label="File" type="file" />
    </aside>
  );
}
