export default function ProjectModule({ data }) {
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-sky-300">{data?.title || 'Project'}</h3>
      <p className="text-xs text-gray-300">{data?.description || 'Project description'}</p>
      <div className="mt-2">
        <div className="w-full bg-gray-800 rounded-full h-1.5">
          <div className="bg-sky-500 h-1.5 rounded-full" style={{width: `${data?.progress || 0}%`}}></div>
        </div>
        <div className="flex justify-between text-xs mt-1">
          <span className="text-gray-500">Progress</span>
          <span className="text-sky-300">{data?.progress || 0}%</span>
        </div>
      </div>
    </div>
  );
}