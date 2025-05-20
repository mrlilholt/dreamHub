export default function DataModule({ data }) {
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-sky-300">{data?.title || 'Data Module'}</h3>
      <p className="text-xs text-gray-300">{data?.description || 'Data analysis module'}</p>
      <div className="grid grid-cols-2 gap-2 mt-2">
        <div className="bg-gray-800/70 p-1.5 rounded border border-sky-900/50">
          <div className="text-xs text-gray-400">Samples</div>
          <div className="text-sm font-mono text-sky-300">{data?.samples || '0'}</div>
        </div>
        <div className="bg-gray-800/70 p-1.5 rounded border border-sky-900/50">
          <div className="text-xs text-gray-400">Accuracy</div>
          <div className="text-sm font-mono text-sky-300">{data?.accuracy || '0%'}</div>
        </div>
      </div>
    </div>
  );
}