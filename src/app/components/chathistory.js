'use client'
import React, { useEffect, useState } from "react";
import { IoIosChatboxes, IoMdClose } from "react-icons/io";
import { FiClock } from "react-icons/fi";

const ChatHistory = () => {
  const [chatSessions, setChatSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      try {
        const decoded = JSON.parse(atob(token.split(".")[1]));
        setUserId(decoded.user_id);
      } catch (err) {
        console.error("Error decoding token:", err);
      }
    }
  }, []);

  useEffect(() => {
    if (!userId) return;

    const fetchChatSessions = async () => {
      try {
        const res = await fetch(`https://api.neurovisesolutions.com/chat/sessions/${userId}`);
        const data = await res.json();
        
        // Sort chat sessions in descending order (newest first)
        const sortedSessions = (data.chat_sessions || []).sort((a, b) => 
          new Date(b.created_at) - new Date(a.created_at)
        );
        
        setChatSessions(sortedSessions);
      } catch (err) {
        console.error("Error fetching chat sessions:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchChatSessions();
  }, [userId]);

  const formatDateTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: false,
    });
  };

  const formatTimeAgo = (isoString) => {
    const date = new Date(isoString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    return `${Math.floor(diffInSeconds / 86400)} days ago`;
  };

  const openModal = (session) => {
    // Sort messages in ascending order by timestamp before displaying
    const sortedMessages = [...session.messages].sort((a, b) => 
      new Date(a.timestamp) - new Date(b.timestamp)
    );
    
    // Create a new session object with sorted messages
    const sessionWithSortedMessages = {
      ...session,
      messages: sortedMessages
    };
    
    setSelectedSession(sessionWithSortedMessages);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedSession(null);
  };

  // Determine which sessions to display
  const displayedSessions = showAll ? chatSessions : chatSessions.slice(0, 5);
  const hasMoreSessions = chatSessions.length > 5;

  return (
    <div className="p-2 bg-gray-700 rounded-lg px-3 py-5">
      {loading ? (
        <div className="bg-white rounded-xl p-8 text-center shadow-sm">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-6 w-24 bg-gray-200 rounded mb-4"></div>
            <div className="h-4 w-48 bg-gray-200 rounded"></div>
          </div>
        </div>
      ) : chatSessions.length === 0 ? (
        <div className="bg-white rounded-xl p-8 text-center shadow-sm">
          <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <IoIosChatboxes className="h-12 w-12 text-gray-400" />
          </div>
          <h3 className="text-xl font-medium text-gray-900 mb-2">No chat history</h3>
          <p className="text-gray-500">No chat sessions found for this user</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedSessions.map((session) => (
              <div 
                key={session._id} 
                className="bg-white rounded-xl overflow-hidden shadow-lg transition-all hover:shadow-2xl"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1 pr-2">
                      <h3 className="text-xl font-bold text-gray-800 break-words">
                        {session.full_name || "Anonymous User"}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {formatTimeAgo(session.created_at)}
                      </p>
                    </div>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-teal-100 text-teal-800 flex-shrink-0">
                      {session.messages.length} messages
                    </span>
                  </div>
                  
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="font-medium mr-2">Email:</span>
                      <span className="overflow-auto">{session.email || "Not provided"}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="font-medium mr-2">Phone:</span>
                      <span>{session.phone_number || "Not provided"}</span>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center text-sm text-gray-500">
                      <FiClock className="mr-2" />
                      <span>{formatDateTime(session.created_at)}</span>
                    </div>
                  </div>
                </div>
                
                <div className="border-t border-gray-200 p-4 bg-gray-50 flex justify-end">
                  <button
                    onClick={() => openModal(session)}
                    className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg flex items-center space-x-2 transition-colors"
                  >
                    <IoIosChatboxes className="h-5 w-5" />
                    <span>View Chat</span>
                  </button>
                </div>
              </div>
            ))}
            
            {/* Show More Button Card */}
            {hasMoreSessions && !showAll && (
              <div className="bg-white rounded-xl overflow-hidden shadow-lg transition-all hover:shadow-2xl border-2 border-dashed border-gray-300">
                <div className="p-6 flex flex-col items-center justify-center h-full min-h-[300px]">
                  <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <IoIosChatboxes className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-700 mb-2">
                    {chatSessions.length - 5} More Sessions
                  </h3>
                  <p className="text-gray-500 text-center mb-4">
                    Click to view all chat sessions
                  </p>
                  <button
                    onClick={() => setShowAll(true)}
                    className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors font-medium"
                  >
                    Show More
                  </button>
                </div>
              </div>
            )}
          </div>
          
          {/* Show Less Button */}
          {showAll && hasMoreSessions && (
            <div className="mt-6 text-center">
              <button
                onClick={() => setShowAll(false)}
                className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors font-medium"
              >
                Show Less
              </button>
            </div>
          )}
        </>
      )}

      {/* Modal */}
      {isModalOpen && selectedSession && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-2xl h-full md:h-[80vh] overflow-y-auto shadow-2xl relative">
            <div className="sticky top-0 bg-white p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-semibold break-words pr-4">
                Chat with {selectedSession.full_name || "Anonymous User"}
              </h2>
              <button
                className="text-gray-500 hover:text-red-600 text-2xl flex-shrink-0"
                onClick={closeModal}
              >
                <IoMdClose />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-medium text-gray-500">Email</p>
                    <p className="break-words">{selectedSession.email || "Not provided"}</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-500">Phone</p>
                    <p>{selectedSession.phone_number || "Not provided"}</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-500">Started</p>
                    <p>{formatDateTime(selectedSession.created_at)}</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-500">Messages</p>
                    <p>{selectedSession.messages.length}</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-6">
                {selectedSession.messages.map((msg, idx) => (
                  <div key={idx} className="space-y-2">
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 bg-teal-600 text-white rounded-full w-8 h-8 flex items-center justify-center">
                        {selectedSession.full_name ? selectedSession.full_name.charAt(0) : "U"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="bg-teal-100 text-teal-900 p-3 rounded-lg">
                          <p>{msg.query}</p>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          {formatDateTime(msg.timestamp)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3 ml-12">
                      <div className="flex-shrink-0 bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center">
                        B
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="bg-green-100 text-green-900 p-3 rounded-lg">
                          <p>{msg.response}</p>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          {formatDateTime(msg.timestamp)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatHistory;