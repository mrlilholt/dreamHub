const classes = [
  { id: 'dream8', label: 'DREAM Lab 8' },
  { id: 'dream7', label: 'DREAM Lab 7' },
  { id: 'idesign', label: 'Interdisciplinary Design' },
  { id: 'cs', label: 'Computer Science' },
];

export default function ClassDrawer({ current, setCurrent }) {
  return (
    <div className="space-y-1.5">
      {classes.map(c => (
        <button
          key={c.id}
          onClick={() => setCurrent(c.id)}
          className={`block w-full text-left px-3 py-2 rounded text-sm
            ${current === c.id 
              ? 'bg-sky-900 text-sky-300 border border-sky-700' 
              : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-sky-300 border border-transparent'}`}
        >
          {c.label}
        </button>
      ))}
    </div>
  );
}

