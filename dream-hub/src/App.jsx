import { useEffect, useState } from 'react';
import { onAuthStateChanged, signInWithPopup } from 'firebase/auth';
import { auth, provider } from './firebase';
import ClassDrawer from './components/classdrawer';
import CardGrid from './components/CardGrid';
import dreamhubGif from './assets/dreamhub.gif';

export default function App() {
  const [user, setUser] = useState(null);
  const [currentClass, setCurrentClass] = useState('dream8');
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() =>
    onAuthStateChanged(auth, u => setUser(u)), []);

  const signIn = () => signInWithPopup(auth, provider);

  if (!user) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-black" 
           style={{
             backgroundImage: 'url("/stars-bg.jpg")', 
             backgroundSize: 'cover',
           }}>
        {/* Featured GIF at top of login */}
        <div className="w-full max-w-md mb-6 flex justify-center">
          <img 
            src={dreamhubGif} 
            alt="DREAMHub" 
            className="h-24 w-auto object-contain"
          />
        </div>
        
        <div className="max-w-md w-full p-6 border border-blue-400/30 rounded-xl shadow-lg" 
             style={{
               background: 'linear-gradient(to bottom, rgba(10,20,30,0.8), rgba(5,10,20,0.9))',
               boxShadow: '0 0 20px rgba(56, 189, 248, 0.2), inset 0 0 20px rgba(56, 189, 248, 0.1)'
             }}>
          <div className="mb-6 text-center">
            <h1 className="text-4xl font-bold text-white tracking-tighter">
              DREAM<span className="text-sky-400">_</span>HUB
            </h1>
            <div className="h-0.5 bg-gradient-to-r from-transparent via-sky-500/50 to-transparent my-4"></div>
            <p className="text-sky-300/80 text-sm">NAVIGATIONAL INTERFACE v4.8.2</p>
          </div>
          <div className="px-4 py-2 bg-black/60 rounded-lg border border-sky-900/50 mb-6">
            <p className="text-gray-400 text-xs font-mono mb-2">// SYSTEM STATUS: LOCKED</p>
            <p className="text-gray-400 text-xs font-mono">// AUTHORIZATION REQUIRED</p>
          </div>
          <button
            onClick={signIn}
            className="w-full px-6 py-3 bg-sky-900/60 text-sky-300 rounded-md border border-sky-700/50 hover:bg-sky-800/50 transition-all font-medium text-center"
            style={{boxShadow: '0 0 10px rgba(56, 189, 248, 0.15)'}}
          >
            <div className="flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-sky-400 mr-2 animate-pulse"></div>
              INITIATE LOGIN SEQUENCE
            </div>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen w-full bg-gray-900 text-white"
         style={{
           backgroundImage: 'url("/stars-bg.jpg")', 
           backgroundSize: 'cover', 
           backgroundAttachment: 'fixed'
         }}>
      {/* Full-width GIF banner */}
      <div className="w-full bg-black/40 backdrop-blur-sm flex justify-center py-2 border-b border-sky-900/50">
        <img 
          src={dreamhubGif} 
          alt="DREAMHub" 
          className="h-12 w-auto object-contain"
        />
      </div>
      
      {/* Spaceship Header Control Panel */}
      <header className="bg-gray-900/80 border-b border-sky-900/50 px-3 py-2 flex items-center justify-between sticky top-0 z-10 backdrop-blur-sm"
              style={{boxShadow: '0 0 15px rgba(56, 189, 248, 0.15)'}}>
        <div className="flex items-center">
          <div className="flex items-center">
            <div className="h-5 w-1 bg-sky-400 mr-2"></div>
            <h1 className="text-sky-100 text-xl font-bold tracking-tight mr-4">DREAM<span className="text-sky-400">_</span>HUB</h1>
          </div>
          <div className="hidden md:flex space-x-4 text-xs">
            <div className="px-2 py-1 bg-sky-900/30 rounded border border-sky-800/50">NAV</div>
            <div className="px-2 py-1 bg-sky-900/30 rounded border border-sky-800/50">COMMS</div>
            <div className="px-2 py-1 bg-sky-900/30 rounded border border-sky-800/50">SYSTEMS</div>
          </div>
        </div>
        
        <div className="flex items-center">
          {/* Mobile menu button with dropdown positioning */}
          <div className="relative md:hidden">
            <button 
              onClick={() => setMenuOpen(!menuOpen)} 
              className="mr-3 p-1 rounded border border-sky-900/50 bg-gray-800/70"
            >
              <svg className="w-5 h-5 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            </button>
            
            {/* Right-side dropdown menu - now with solid black background */}
            {menuOpen && (
              <div className="absolute right-0 top-full mt-1 w-64 bg-black border border-sky-900/50 rounded-md shadow-lg z-50"
                   style={{boxShadow: '0 0 15px rgba(56, 189, 248, 0.15)'}}>
                <div className="p-3 border-b border-sky-900/50 bg-black">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-sm text-sky-400 font-semibold tracking-wider">COMMAND MENU</h3>
                    <button onClick={() => setMenuOpen(false)} className="text-gray-400 hover:text-white">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
                
                <div className="p-3 border-b border-sky-900/50 bg-black">
                  <h3 className="text-xs text-sky-400 font-semibold tracking-wider mb-2">NAVIGATION</h3>
                  <ClassDrawer current={currentClass} setCurrent={(cls) => {
                    setCurrentClass(cls);
                    setMenuOpen(false);
                  }} />
                </div>
                
                <div className="p-3 bg-black">
                  <h3 className="text-xs text-sky-400 font-semibold tracking-wider mb-2">SYSTEM METRICS</h3>
                  <div className="space-y-2">
                    <div className="bg-gray-800 p-2 rounded border border-sky-900/50">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-400">CPU LOAD</span>
                        <span className="text-sky-300">24%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-1.5">
                        <div className="bg-sky-500 h-1.5 rounded-full" style={{width: '24%'}}></div>
                      </div>
                    </div>
                    <div className="bg-gray-800 p-2 rounded border border-sky-900/50">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-400">MEMORY</span>
                        <span className="text-sky-300">67%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-1.5">
                        <div className="bg-sky-500 h-1.5 rounded-full" style={{width: '67%'}}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <div className="flex items-center mr-3">
            <div className="w-2 h-2 rounded-full bg-green-400 mr-1 animate-pulse"></div>
            <span className="text-gray-400 text-xs font-mono">ONLINE</span>
          </div>
          {user.photoURL && (
            <div className="flex items-center p-1 bg-gray-800/70 rounded border border-sky-900/50">
              <img 
                src={user.photoURL} 
                alt="User" 
                className="h-6 w-6 rounded-full border border-sky-700/50"
              />
              <span className="text-sky-100 text-xs ml-2 hidden sm:inline truncate max-w-[100px]">
                {user.displayName?.split(' ')[0]}
              </span>
            </div>
          )}
        </div>
      </header>
      
      {/* Main Spacecraft Console */}
      <div className="flex flex-1 overflow-hidden w-full h-[calc(100vh-108px)]">
        {/* Left Control Panel - desktop */}
        <div className="w-64 bg-gray-900/80 border-r border-sky-900/50 flex-shrink-0 backdrop-blur-sm hidden md:block overflow-y-auto">
          <div className="p-3 border-b border-sky-900/50">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs text-sky-400 font-semibold tracking-wider">NAVIGATION</h3>
              <div className="w-2 h-2 rounded-full bg-sky-400"></div>
            </div>
            <ClassDrawer current={currentClass} setCurrent={setCurrentClass} />
          </div>
          <div className="p-3">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs text-sky-400 font-semibold tracking-wider">SYSTEM METRICS</h3>
              <div className="w-2 h-2 rounded-full bg-sky-400"></div>
            </div>
            <div className="space-y-2 mt-3">
              <div className="bg-gray-800/70 p-2 rounded border border-sky-900/50">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-400">CPU LOAD</span>
                  <span className="text-sky-300">24%</span>
                </div>
                <div className="w-full bg-gray-700/50 rounded-full h-1.5">
                  <div className="bg-sky-500 h-1.5 rounded-full" style={{width: '24%'}}></div>
                </div>
              </div>
              <div className="bg-gray-800/70 p-2 rounded border border-sky-900/50">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-400">MEMORY</span>
                  <span className="text-sky-300">67%</span>
                </div>
                <div className="w-full bg-gray-700/50 rounded-full h-1.5">
                  <div className="bg-sky-500 h-1.5 rounded-full" style={{width: '67%'}}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Main Viewscreen */}
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          <div className="px-3 py-2 border-b border-sky-900/30 bg-black/40">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
              <div className="flex items-center mb-2 sm:mb-0">
                <div className="h-5 w-1 bg-sky-400 mr-2"></div>
                <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">MISSION CONTROL</h2>
              </div>
              <div className="text-xs text-sky-400 font-mono">
                STARDATE: {new Date().toLocaleDateString().replace(/\//g, '.')}
              </div>
            </div>
          </div>
          
          <div className="flex-1 p-3 overflow-auto">
            <CardGrid classId={currentClass} user={user} />
          </div>
        </div>
      </div>
    </div>
  );
}
