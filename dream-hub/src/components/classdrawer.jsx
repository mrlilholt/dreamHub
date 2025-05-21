import { signOut } from 'firebase/auth';
import { auth } from '../firebase';

const classes = [
  { id: 'dream8', label: 'DREAM Lab 8' },
  { id: 'dream7', label: 'DREAM Lab 7' },
  { id: 'idesign', label: 'Interdisciplinary Design' },
  { id: 'cs', label: 'Computer Science' },
];

export default function ClassDrawer({ current, setCurrent }) {
  const handleLogout = async () => {
    try {
      await signOut(auth);
      // The onAuthStateChanged listener in your App.jsx will handle the redirect
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <div 
      className="space-y-1.5 p-3 rounded-lg border border-sky-900/50"
      style={{
        backgroundColor: '#111827', // Solid background to match module form
        boxShadow: '0 4px 20px rgba(56, 189, 248, 0.2)'
      }}
    >
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
      
      {/* Separator */}
      <div className="border-t border-gray-700/50 my-3"></div>
      
      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="block w-full text-left px-3 py-2 rounded text-sm bg-red-900/50 text-red-300 hover:bg-red-800/60 border border-red-900/50"
      >
        <div className="flex items-center justify-between">
          <span>LOGOUT</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
        </div>
      </button>
    </div>
  );
}

