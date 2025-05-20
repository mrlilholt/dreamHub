import React, { useState, useEffect } from 'react';
import { collection, doc, getDoc, setDoc, deleteDoc, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';

export default function QueueCard({ classId, user }) {
  const [inQueue, setInQueue] = useState(false);
  const [queue, setQueue] = useState([]);
  const [loading, setLoading] = useState(false);

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
    });

    return () => unsubscribe();
  }, [classId, user.uid]);

  const joinQueue = async () => {
    setLoading(true);
    try {
      const queueRef = doc(db, 'classes', classId, 'queue', user.uid);
      await setDoc(queueRef, {
        userId: user.uid,
        displayName: user.displayName,
        photoURL: user.photoURL,
        timestamp: new Date()
      });
    } catch (error) {
      console.error("Error joining queue:", error);
    } finally {
      setLoading(false);
    }
  };

  const leaveQueue = async () => {
    setLoading(true);
    try {
      const queueRef = doc(db, 'classes', classId, 'queue', user.uid);
      await deleteDoc(queueRef);
    } catch (error) {
      console.error("Error leaving queue:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
      <h3 className="text-lg font-medium mb-4">Help Queue</h3>
      
      {inQueue ? (
        <button 
          onClick={leaveQueue}
          disabled={loading}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md disabled:opacity-50"
        >
          Leave Queue
        </button>
      ) : (
        <button 
          onClick={joinQueue}
          disabled={loading}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md disabled:opacity-50"
        >
          Join Queue
        </button>
      )}

      <div className="mt-4">
        <h4 className="font-medium mb-2">Current Queue ({queue.length})</h4>
        <ul className="space-y-2">
          {queue.map((item) => (
            <li key={item.id} className="flex items-center gap-2 p-2 bg-gray-100 dark:bg-gray-700 rounded">
              {item.photoURL && (
                <img src={item.photoURL} alt="" className="w-6 h-6 rounded-full" />
              )}
              <span>{item.displayName}</span>
            </li>
          ))}
        </ul>
        {queue.length === 0 && (
          <p className="text-gray-500 dark:text-gray-400 text-sm">Queue is empty</p>
        )}
      </div>
    </div>
  );
}