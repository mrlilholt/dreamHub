export default function AssignmentModule({ data }) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-medium text-sky-300">{data.title}</h3>
        <span className={`text-xs px-1.5 rounded ${
          data.status === 'active' ? 'bg-green-900/50 text-green-400' : 
          data.status === 'upcoming' ? 'bg-yellow-900/50 text-yellow-400' : 
          'bg-red-900/50 text-red-400'
        }`}>
          {data.status?.toUpperCase() || 'NEW'}
        </span>
      </div>
      <p className="text-xs text-gray-300">{data.description}</p>
      <div className="flex justify-between items-center text-xs mt-2">
        <span className="text-gray-400">Due: {data.dueDate || 'TBD'}</span>
        <button className="px-2 py-1 bg-sky-900/60 text-sky-300 rounded border border-sky-700/50">
          SUBMIT
        </button>
      </div>
    </div>
  );
}