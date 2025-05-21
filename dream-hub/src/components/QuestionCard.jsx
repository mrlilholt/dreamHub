import React, { useState, useEffect } from 'react';
import { collection, addDoc, query, orderBy, onSnapshot, deleteDoc, doc, updateDoc, arrayUnion, arrayRemove, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { isAdmin } from '../utils/roles';

export default function QuestionCard({ classId, user }) {
  const [question, setQuestion] = useState('');
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expandedQuestion, setExpandedQuestion] = useState(null);
  const [answerText, setAnswerText] = useState('');
  const [answerLoading, setAnswerLoading] = useState(false);
  const [votingQuestionId, setVotingQuestionId] = useState(null); // Track active voting operations

  useEffect(() => {
    // Subscribe to the questions collection
    const questionsRef = collection(db, 'classes', classId, 'questions');
    const q = query(questionsRef, orderBy('timestamp', 'desc'));
    
    console.log("Setting up listener for questions in class:", classId);
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      console.log("Firestore update received. Document count:", snapshot.docs.length);
      
      const questionsData = snapshot.docs.map(doc => {
        const data = doc.data();
        console.log(`Question ${doc.id} has ${data.sameQuestionUsers?.length || 0} votes`);
        
        return {
          id: doc.id,
          ...data,
          answers: data.answers || [],
          sameQuestionUsers: data.sameQuestionUsers || []
        };
      });
      
      setQuestions(questionsData);
      console.log("Updated questions state with new data");
    }, (error) => {
      console.error("Error in Firestore listener:", error);
    });

    return () => unsubscribe();
  }, [classId]);

  const submitQuestion = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;
    
    setLoading(true);
    try {
      const questionsRef = collection(db, 'classes', classId, 'questions');
      await addDoc(questionsRef, {
        text: question,
        userId: user.uid,
        displayName: user.displayName,
        photoURL: user.photoURL,
        timestamp: serverTimestamp(),
        votes: 0,
        answers: [],
        sameQuestionUsers: []
      });
      setQuestion('');
    } catch (error) {
      console.error("Error submitting question:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteQuestion = async (questionId) => {
    // Check if user is admin or the owner of the question
    const question = questions.find(q => q.id === questionId);
    if (!question) return;
    
    // Only allow deletion by admin or the question creator
    if (!isAdmin(user) && user.uid !== question.userId) {
      console.error("Permission denied: Cannot delete this question");
      return;
    }
    
    try {
      const questionRef = doc(db, 'classes', classId, 'questions', questionId);
      await deleteDoc(questionRef);
    } catch (error) {
      console.error("Error deleting question:", error);
    }
  };

  const toggleSameQuestion = async (questionId, currentUsers) => {
    setVotingQuestionId(questionId);
    
    const hasVoted = currentUsers.includes(user.uid);
    console.log(`Toggling vote: current=${hasVoted ? 'voted' : 'not voted'}`);
    
    // Add immediate visual feedback with local state
    setQuestions(prevQuestions => 
      prevQuestions.map(q => {
        if (q.id === questionId) {
          const updatedUsers = hasVoted 
            ? q.sameQuestionUsers.filter(id => id !== user.uid)
            : [...q.sameQuestionUsers, user.uid];
            
          console.log("Local state update:", updatedUsers.length, "votes");
          
          return {
            ...q,
            sameQuestionUsers: updatedUsers
          };
        }
        return q;
      })
    );
    
    try {
      const questionRef = doc(db, 'classes', classId, 'questions', questionId);
      
      if (hasVoted) {
        console.log('Removing user from sameQuestionUsers');
        await updateDoc(questionRef, {
          sameQuestionUsers: arrayRemove(user.uid)
        });
      } else {
        console.log('Adding user to sameQuestionUsers');
        await updateDoc(questionRef, {
          sameQuestionUsers: arrayUnion(user.uid)
        });
      }
      console.log('Firebase update completed successfully');
    } catch (error) {
      console.error("Error updating question:", error);
      alert(`Error updating vote: ${error.message || 'Unknown error'}`);
      
      // Revert local change on error
      setQuestions(prevQuestions => 
        prevQuestions.map(q => 
          q.id === questionId 
            ? {...q, sameQuestionUsers: currentUsers} 
            : q
        )
      );
    } finally {
      setVotingQuestionId(null);
    }
  };
  
  const submitAnswer = async (questionId) => {
    if (!answerText.trim()) return;
    
    setAnswerLoading(true);
    try {
      const questionRef = doc(db, 'classes', classId, 'questions', questionId);
      await updateDoc(questionRef, {
        answers: arrayUnion({
          text: answerText,
          userId: user.uid,
          displayName: user.displayName,
          photoURL: user.photoURL,
          timestamp: new Date().toISOString()
        })
      });
      setAnswerText('');
      setExpandedQuestion(null);
    } catch (error) {
      console.error("Error submitting answer:", error);
    } finally {
      setAnswerLoading(false);
    }
  };

  const canModifyQuestion = (questionUserId) => {
    // Admin can modify any question, users can only modify their own
    return isAdmin(user) || user.uid === questionUserId;
  };

  return (
    <div className="space-y-4">
      <form onSubmit={submitQuestion} className="mb-2">
        <div className="mb-2">
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask a question..."
            className="w-full p-2 border rounded bg-black/60 text-sky-300 border-sky-900/50 placeholder-gray-500 text-sm"
            rows={2}
          ></textarea>
        </div>
        <button 
          type="submit"
          disabled={loading || !question.trim()}
          className="bg-sky-900/80 hover:bg-sky-800 text-sky-300 px-3 py-1 rounded text-xs font-mono border border-sky-800/50 disabled:opacity-50"
        >
          {loading ? "PROCESSING..." : "TRANSMIT QUERY"}
        </button>
      </form>

      <div className="max-h-60 overflow-y-auto custom-scrollbar">
        <div className="space-y-3">
          {questions.map((q) => (
            <div key={q.id} className="bg-black/50 border border-sky-900/50 rounded p-2">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-2">
                  {q.photoURL && (
                    <img src={q.photoURL} alt="" className="w-5 h-5 rounded-full mt-1 border border-sky-900/50" />
                  )}
                  <div>
                    <div className="text-xs text-sky-400 font-medium">{q.displayName}</div>
                    <p className="text-sm text-white">{q.text}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="text-xs text-gray-500">
                        {q.timestamp?.toDate().toLocaleString()}
                      </div>
                      
                      {/* Same Question Button */}
                      <button 
                        type="button"
                        onClick={() => toggleSameQuestion(q.id, q.sameQuestionUsers)}
                        disabled={votingQuestionId === q.id}
                        className={`flex items-center text-xs px-1.5 py-0.5 rounded border 
                          ${q.sameQuestionUsers?.includes(user.uid) 
                            ? 'bg-purple-900/50 text-purple-300 border-purple-800/50' 
                            : 'bg-gray-800/50 text-gray-300 border-gray-700/50 hover:bg-purple-900/30 hover:text-purple-300'}
                          ${votingQuestionId === q.id ? 'opacity-50' : ''}`}
                      >
                        {votingQuestionId === q.id ? (
                          <span className="animate-pulse">...</span>
                        ) : (
                          <span>+{(q.sameQuestionUsers?.length || 0)}</span>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="flex space-x-1">
                  <button 
                    onClick={() => setExpandedQuestion(expandedQuestion === q.id ? null : q.id)}
                    className="text-xs px-1.5 py-0.5 bg-sky-900/50 text-sky-300 rounded border border-sky-800/50"
                  >
                    {q.answers.length > 0 ? `${q.answers.length} RESP` : "RESPOND"}
                  </button>
                  
                  {/* Only show delete button to admin or question owner */}
                  {canModifyQuestion(q.userId) && (
                    <button 
                      onClick={() => deleteQuestion(q.id)}
                      className="text-xs px-1.5 py-0.5 bg-red-900/50 text-red-300 rounded border border-red-800/50"
                    >
                      DELETE
                    </button>
                  )}
                </div>
              </div>
              
              {/* Answers section */}
              {expandedQuestion === q.id && (
                <div className="mt-2 pl-6 border-l border-sky-900/30">
                  {q.answers.length > 0 ? (
                    <div className="space-y-2 mb-2">
                      {q.answers.map((answer, index) => (
                        <div key={index} className="bg-gray-900/50 p-1.5 rounded">
                          <div className="flex items-start justify-between gap-1.5">
                            <div className="flex items-start gap-1.5">
                              {answer.photoURL && (
                                <img src={answer.photoURL} alt="" className="w-4 h-4 rounded-full mt-0.5 border border-sky-900/50" />
                              )}
                              <div>
                                <div className="text-xs text-sky-400">{answer.displayName}</div>
                                <p className="text-xs text-gray-300">{answer.text}</p>
                              </div>
                            </div>
                            
                            {/* Only admin can delete any comment */}
                            {isAdmin(user) && (
                              <button 
                                onClick={() => deleteAnswer(q.id, index)}
                                className="text-xs text-red-400 hover:text-red-300"
                              >
                                ✕
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-xs text-gray-500 mb-2">No responses yet</div>
                  )}
                  
                  <div className="flex gap-1">
                    <input
                      type="text"
                      value={answerText}
                      onChange={(e) => setAnswerText(e.target.value)}
                      placeholder="Type response..."
                      className="flex-1 px-2 py-1 text-xs bg-black/70 border border-sky-900/50 rounded text-sky-300 placeholder-gray-500"
                    />
                    <button
                      onClick={() => submitAnswer(q.id)}
                      disabled={answerLoading || !answerText.trim()}
                      className="text-xs px-2 py-0.5 bg-sky-900/70 text-sky-300 rounded border border-sky-800/50 disabled:opacity-50"
                    >
                      SEND
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
          
          {questions.length === 0 && (
            <div className="text-gray-500 text-sm py-2 text-center">NO ACTIVE COMMUNICATIONS</div>
          )}
        </div>
      </div>
    </div>
  );
}