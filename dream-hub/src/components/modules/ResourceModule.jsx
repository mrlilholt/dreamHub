export default function ResourceModule({ data }) {
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-sky-300">{data?.title || 'Resources'}</h3>
      <p className="text-xs text-gray-300">{data?.description || 'Available resources'}</p>
      <div className="space-y-1 mt-2">
        {data?.resources?.map((resource, i) => (
          <a 
            key={i}
            href={resource.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center py-1 px-2 bg-gray-800/60 hover:bg-sky-900/40 rounded text-xs text-sky-300 border border-sky-900/40"
          >
            <span className="w-4 h-4 mr-2 text-sky-400">📎</span>
            {resource.name}
          </a>
        )) || (
          <div className="text-xs text-gray-500">No resources available</div>
        )}
      </div>
    </div>
  );
}