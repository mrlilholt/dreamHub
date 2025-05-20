export default function TutorialModule({ data }) {
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-sky-300">{data?.title || 'Tutorial'}</h3>
      <p className="text-xs text-gray-300">{data?.description || 'Tutorial description'}</p>
      <div className="flex justify-between items-center text-xs mt-2">
        <span className="text-gray-400">Duration: {data?.duration || '30 min'}</span>
        <button className="px-2 py-1 bg-sky-900/60 text-sky-300 rounded border border-sky-700/50">
          START
        </button>
      </div>
    </div>
  );
}