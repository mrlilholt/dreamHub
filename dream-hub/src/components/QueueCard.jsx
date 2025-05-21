import React, { useState, useEffect } from 'react';
import { collection, doc, getDoc, setDoc, deleteDoc, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { isAdmin } from '../utils/roles';

export default function QueueCard({ classId, user }) {
  const [inQueue, setInQueue] = useState(false);
  const [queue, setQueue] = useState([]);
  const [loading, setLoading] = useState(false);
  const [removingId, setRemovingId] = useState(null);

  useEffect(() => {
    // Subscribe to the queue collection
    const queueRef = collection(db, 'classes', classId, 'queue');
    const q = query(queueRef, orderBy('timestamp'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const queueData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setQueue(queueData);
      setInQueue(queueData.some(item => item.userId === user.uid));
    }, (error) => {
      console.error("Error in queue listener:", error);
    });

    return () => unsubscribe();
  }, [classId, user.uid]);

  const joinQueue = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const queueRef = doc(db, 'classes', classId, 'queue', user.uid);
      await setDoc(queueRef, {
        userId: user.uid,
        displayName: user.displayName || 'Unknown User',
        photoURL: user.photoURL || null,
        timestamp: new Date()
      });
      console.log("Successfully joined queue");
    } catch (error) {
      console.error("Error joining queue:", error);
      alert("Could not join queue: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const leaveQueue = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const queueRef = doc(db, 'classes', classId, 'queue', user.uid);
      await deleteDoc(queueRef);
      console.log("Successfully left queue");
    } catch (error) {
      console.error("Error leaving queue:", error);
      alert("Could not leave queue: " + error.message);
    } finally {
      setLoading(false);
    }
  };
  
  const removeFromQueue = async (userId) => {
    if (!isAdmin(user)) {
      console.error("Permission denied: Only admins can remove others from queue");
      return;
    }
    
    setRemovingId(userId);
    try {
      const queueRef = doc(db, 'classes', classId, 'queue', userId);
      await deleteDoc(queueRef);
      console.log("Admin removed user from queue");
    } catch (error) {
      console.error("Error removing from queue:", error);
    } finally {
      setRemovingId(null);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="text-sm font-medium text-sky-300">AWAITING ASSISTANCE ({queue.length})</div>
        
        <div>
          {inQueue ? (
            <button 
              onClick={leaveQueue}
              disabled={loading}
              className="text-xs px-2 py-1 bg-red-900/50 text-red-300 rounded border border-red-800/50 disabled:opacity-50"
            >
              {loading ? "PROCESSING..." : "EXIT QUEUE"}
            </button>
          ) : (
            <button 
              onClick={joinQueue}
              disabled={loading}
              className="text-xs px-2 py-1 bg-sky-900/50 text-sky-300 rounded border border-sky-800/50 disabled:opacity-50"
            >
              {loading ? "PROCESSING..." : "JOIN QUEUE"}
            </button>
          )}
        </div>
      </div>

      <div className="space-y-1">
        {queue.length === 0 ? (
          <div className="text-center py-2 text-gray-500 text-xs">
            QUEUE EMPTY
          </div>
        ) : (
          queue.map((item) => (
            <div key={item.id} className="flex items-center justify-between p-1.5 bg-gray-900/50 border border-gray-800/50 rounded">
              <div className="flex items-center gap-2">
                {item.photoURL ? (
                  <img src={item.photoURL} alt="" className="w-5 h-5 rounded-full border border-gray-700/50" />
                ) : (
                  <div className="w-5 h-5 rounded-full bg-gray-700 flex items-center justify-center">
                    <span className="text-xs text-gray-300">{item.displayName?.charAt(0) || '?'}</span>
                  </div>
                )}
                <span className="text-xs text-gray-300">{item.displayName}</span>
              </div>
              
              {/* Show remove button if admin or if it's your own entry */}
              {(isAdmin(user) || item.userId === user.uid) && (
                <button
                  onClick={() => item.userId === user.uid ? leaveQueue() : removeFromQueue(item.userId)}
                  disabled={loading || removingId === item.userId}
                  className="text-xs px-1.5 py-0.5 bg-red-900/50 text-red-300 rounded border border-red-800/50 disabled:opacity-50"
                >
                  {removingId === item.userId ? "..." : "✕"}
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}