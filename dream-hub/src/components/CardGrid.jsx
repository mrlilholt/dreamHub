import React, { useState, useEffect } from 'react';
import { collection, query, onSnapshot, orderBy, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import { isAdmin } from '../utils/roles';
import GenericCard from './GenericCard';
import ModuleForm from './ModuleForm';
import QueueCard from './QueueCard';
import QuestionCard from './QuestionCard';
import TimeCard from './TimeCard';

export default function CardGrid({ classId, user }) {
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModuleForm, setShowModuleForm] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const cardStyle = "bg-gray-900/90 p-4 rounded-lg border border-gray-800";
  
  const isTeacher = (user) => {
    return user?.role === 'teacher' || user?.email?.includes('teacher');
  };
  
  useEffect(() => {
    if (!classId) return;
    
    console.log("Fetching modules for class:", classId);
    const modulesRef = collection(db, 'classes', classId, 'modules');
    const modulesQuery = query(modulesRef, orderBy('createdAt', 'desc'));
    
    const unsubscribe = onSnapshot(modulesQuery, (snapshot) => {
      console.log(`Fetched ${snapshot.docs.length} modules`);
      setModules(snapshot.docs);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching modules:", error);
      setLoading(false);
    });
    
    return () => unsubscribe();
  }, [classId]);

  const handleDeleteModule = async (moduleId) => {
    // Only allow admin to delete modules
    if (!isAdmin(user)) {
      console.error("Permission denied: Only admins can delete modules");
      return;
    }
    
    try {
      await deleteDoc(doc(db, 'classes', classId, 'modules', moduleId));
      console.log("Module deleted:", moduleId);
    } catch (error) {
      console.error("Error deleting module:", error);
    } finally {
      setDeleteConfirm(null);
    }
  };
  
  return (
    <div className="flex flex-col h-full">
      {/* Main horizontal layout */}
      <div className="flex flex-row gap-3 h-full">
        {/* Left Column - Time and Interactive Systems */}
        <div className="w-1/5 flex flex-col gap-3">
          {/* Time Card */}
          <div className="flex-initial">
            <TimeCard />
          </div>
          
          {/* Queue Monitor */}
          <div className="flex-1">
            <div className={`${cardStyle} flex flex-col`} style={{boxShadow: '0 0 15px rgba(56, 189, 248, 0.1)'}}>
              <div className="flex items-center justify-between mb-2">
                <div className="bg-sky-900/50 px-2 py-0.5 rounded text-xs text-sky-300 font-mono">
                  QUEUE MONITOR
                </div>
                <div className="flex space-x-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></div>
                  <div className="w-1.5 h-1.5 rounded-full bg-sky-400"></div>
                </div>
              </div>
              <div className="overflow-auto flex-1">
                <QueueCard classId={classId} user={user} />
              </div>
            </div>
          </div>
        </div>
        
        {/* Middle Column - Comms Channel - MAKE WIDER */}
        <div className="w-1/2">
          <div className={`${cardStyle} h-full flex flex-col`} style={{boxShadow: '0 0 15px rgba(56, 189, 248, 0.1)'}}>
            <div className="flex items-center justify-between mb-2">
              <div className="bg-sky-900/50 px-2 py-0.5 rounded text-xs text-sky-300 font-mono">
                COMMS CHANNEL
              </div>
              <div className="flex space-x-1">
                <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-sky-400"></div>
              </div>
            </div>
            <div className="overflow-auto flex-1">
              <QuestionCard classId={classId} user={user} />
            </div>
          </div>
        </div>
        
        {/* Right Column - Module Cards */}
        <div className="w-7/15 overflow-auto">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <div className="h-4 w-1 bg-sky-400 mr-2"></div>
              <h3 className="text-base font-bold text-white">MODULES</h3>
            </div>
            
            {/* Only show Add Module button to admin */}
            {isAdmin(user) && (
              <button 
                onClick={() => setShowModuleForm(true)} 
                className="text-xs bg-sky-900/50 text-sky-300 px-2 py-1 rounded border border-sky-800/50"
              >
                + ADD MODULE
              </button>
            )}
          </div>
          
          {loading ? (
            <div className="text-center py-10 text-sky-300">
              <div className="inline-block animate-pulse">LOADING MODULES...</div>
            </div>
          ) : modules.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              NO MODULES AVAILABLE
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 pr-1">
              {modules.map(doc => (
                <div key={doc.id} className={cardStyle} style={{boxShadow: '0 0 15px rgba(56, 189, 248, 0.1)'}}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="bg-sky-900/50 px-2 py-0.5 rounded text-xs text-sky-300 font-mono">
                      {doc.data().type.toUpperCase()} #{doc.id.slice(0, 4)}
                    </div>
                    
                    {/* Only show delete options to admin */}
                    {isAdmin(user) && (
                      <div className="flex space-x-1">
                        {deleteConfirm === doc.id ? (
                          <>
                            <button 
                              onClick={() => handleDeleteModule(doc.id)}
                              className="text-xs px-1.5 py-0.5 bg-red-900/70 text-red-300 rounded border border-red-800/50"
                            >
                              CONFIRM
                            </button>
                            <button 
                              onClick={() => setDeleteConfirm(null)}
                              className="text-xs px-1.5 py-0.5 bg-gray-800/70 text-gray-300 rounded border border-gray-700/50"
                            >
                              CANCEL
                            </button>
                          </>
                        ) : (
                          <button 
                            onClick={() => setDeleteConfirm(doc.id)}
                            className="text-xs px-1.5 py-0.5 bg-red-900/50 text-red-300 rounded border border-red-800/50"
                          >
                            DELETE
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                  <GenericCard doc={doc} isAdmin={isAdmin(user)} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* Module Form Dropdown */}
      {showModuleForm && isAdmin(user) && (
        <ModuleForm 
          classId={classId}
          onClose={() => setShowModuleForm(false)}
        />
      )}
    </div>
  );
}