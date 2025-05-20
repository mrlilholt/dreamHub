import { useCollection } from 'react-firebase-hooks/firestore';
import { collection, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import GenericCard from './GenericCard';
import QueueCard from './QueueCard';
import QuestionCard from './QuestionCard';
import TimeCard from './TimeCard';

export default function CardGrid({ classId, user }) {
  const [snapshot] = useCollection(
    query(collection(db, 'classes', classId, 'cards'), orderBy('title'))
  );

  const cardStyle = `
    bg-gray-900/70 rounded-lg border border-sky-900/50 p-2 
    hover:border-sky-600/50 transition-all duration-200 h-full
  `;

  return (
    <div className="flex flex-col h-full">
      {/* Main horizontal layout */}
      <div className="flex flex-row gap-3 h-full">
        {/* Left Column - Time and Interactive Systems */}
        <div className="w-1/4 flex flex-col gap-3">
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
        
        {/* Middle Column - Comms Channel */}
        <div className="w-1/4">
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
        <div className="w-2/4 overflow-auto">
          <div className="flex items-center mb-2">
            <div className="h-4 w-1 bg-sky-400 mr-2"></div>
            <h3 className="text-base font-bold text-white">MODULES</h3>
          </div>
          
          <div className="grid grid-cols-2 gap-3 pr-1">
            {snapshot?.docs.map(d => (
              <div key={d.id} className={cardStyle} style={{boxShadow: '0 0 15px rgba(56, 189, 248, 0.1)'}}>
                <div className="flex items-center justify-between mb-2">
                  <div className="bg-sky-900/50 px-2 py-0.5 rounded text-xs text-sky-300 font-mono">
                    MODULE #{d.id.slice(0, 4)}
                  </div>
                  <div className="flex space-x-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-sky-400"></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-sky-400"></div>
                  </div>
                </div>
                <GenericCard doc={d} isTeacher={isTeacher(user)} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function isTeacher(user) {
  const TEACHER_UIDS = [
    // Add your teacher UIDs here
  ];
  return TEACHER_UIDS.includes(user.uid) || user.email?.endsWith('@faculty.institution.edu');
}