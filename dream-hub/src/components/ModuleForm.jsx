import React, { useState, useEffect } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

export default function ModuleForm({ classId, onClose, buttonPosition }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [moduleType, setModuleType] = useState('assignment');
  const [loading, setLoading] = useState(false);
  
  // Type-specific fields
  const [dueDate, setDueDate] = useState('');
  const [status, setStatus] = useState('active');

  // Prevent body scrolling when form is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    
    setLoading(true);
    
    try {
      const moduleData = {
        title,
        type: moduleType,
        createdAt: serverTimestamp(),
        content: {
          title,
          description,
          ...(moduleType === 'assignment' && {
            dueDate,
            status
          })
        }
      };
      
      const modulesRef = collection(db, 'classes', classId, 'modules');
      await addDoc(modulesRef, moduleData);
      onClose();
    } catch (error) {
      console.error("Error adding module:", error);
      alert("Failed to add module: " + error.message);
    } finally {
      setLoading(false);
    }
  };
  
  // Render fields specific to module type
  const renderTypeSpecificFields = () => {
    switch(moduleType) {
      case 'assignment':
        return (
          <>
            <div className="mb-3">
              <label className="block text-xs text-sky-300 mb-1">Due Date</label>
              <input
                type="text"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                placeholder="e.g. May 30, 2025"
                className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-sky-100 text-sm"
              />
            </div>
            <div className="mb-3">
              <label className="block text-xs text-sky-300 mb-1">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-sky-100 text-sm"
              >
                <option value="active">Active</option>
                <option value="upcoming">Upcoming</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </>
        );
      default:
        return null;
    }
  };
  
  return (
    <>
      {/* Semi-transparent backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
      ></div>
      
      {/* Form positioned below the button */}
      <div 
        className="fixed z-50 w-80 rounded-lg border border-sky-900/50 overflow-hidden"
        style={{
          top: '76px', /* Position at the top menu bar height */
          right: '8px',
          backgroundColor: '#111827',
          boxShadow: '0 4px 20px rgba(56, 189, 248, 0.3)'
        }}
      >
        {/* Triangle connector to button */}
        <div
          className="absolute w-4 h-4 bg-sky-900 rotate-45 transform"
          style={{
            top: '-8px',
            right: '24px',
            border: '1px solid rgba(56, 189, 248, 0.3)',
            borderBottom: 'none',
            borderRight: 'none'
          }}
        ></div>
        
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-sky-300 text-base font-mono">ADD MODULE</h2>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-300 text-xl"
            >
              ✕
            </button>
          </div>
          
          <div className="max-h-[60vh] overflow-y-auto pr-1">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="block text-xs text-sky-300 mb-1">Module Type</label>
                <select
                  value={moduleType}
                  onChange={(e) => setModuleType(e.target.value)}
                  className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-sky-100 text-sm"
                >
                  <option value="assignment">Assignment</option>
                  <option value="data">Data</option>
                  <option value="tutorial">Tutorial</option>
                  <option value="resource">Resource</option>
                  <option value="project">Project</option>
                </select>
              </div>
              
              <div className="mb-3">
                <label className="block text-xs text-sky-300 mb-1">Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter module title"
                  className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-sky-100 text-sm"
                  required
                />
              </div>
              
              <div className="mb-3">
                <label className="block text-xs text-sky-300 mb-1">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter module description"
                  className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-sky-100 text-sm"
                  rows={3}
                />
              </div>
              
              {renderTypeSpecificFields()}
              
              <div className="flex justify-end gap-2 mt-5">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-3 py-1.5 bg-gray-800 text-gray-300 rounded border border-gray-700 text-sm"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  disabled={loading || !title.trim()}
                  className="px-3 py-1.5 bg-sky-900 text-sky-300 rounded border border-sky-800 text-sm font-mono disabled:opacity-50"
                >
                  {loading ? "PROCESSING..." : "TRANSMIT"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}