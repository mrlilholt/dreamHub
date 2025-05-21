import React from 'react';
import ResourceModule from './modules/ResourceModule';
import AssignmentModule from './modules/AssignmentModule';
import TutorialModule from './modules/TutorialModule';
import ProjectModule from './modules/ProjectModule';
import DataModule from './modules/DataModule';

export default function GenericCard({ doc, isAdmin }) {
  const data = doc.data();
  console.log("GenericCard rendering:", data.type, data.title);
  
  const renderModule = () => {
    switch(data.type) {
      case 'resource': return <ResourceModule data={data.content} />;
      case 'assignment': return <AssignmentModule data={data.content} />;
      case 'tutorial': return <TutorialModule data={data.content} />;
      case 'project': return <ProjectModule data={data.content} />;
      case 'data': return <DataModule data={data.content} />;
      default: return (
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-sky-300">{data.title || 'Untitled Module'}</h3>
          <p className="text-xs text-gray-300">{data.description || 'No description available.'}</p>
        </div>
      );
    }
  };
  
  return (
    <div>
      {renderModule()}
      
      {/* Only show edit button to admin */}
      {isAdmin && (
        <div className="mt-2 pt-2 border-t border-gray-800">
          <button className="text-xs text-gray-400 hover:text-sky-300">
            EDIT MODULE
          </button>
        </div>
      )}
    </div>
  );
}