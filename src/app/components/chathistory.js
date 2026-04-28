'use client'
import React, { useEffect, useState } from "react";
import { IoIosChatboxes, IoMdClose } from "react-icons/io";
import { FiClock, FiDownload } from "react-icons/fi";
import { apiUrl } from "@/lib/api";

const ChatHistory = () => {
  const [chatSessions, setChatSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);
  const [showAll, setShowAll] = useState(false);
  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);

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
        const res = await fetch(apiUrl(`/chat/sessions/${userId}`));
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

  const buildLeadRows = () => {
    return chatSessions.map((session) => ({
      Name: session.full_name || "",
      Email: session.email || "",
      Phone: session.phone_number || "",
      "Date Time": formatDateTime(session.created_at),
    }));
  };

  const triggerDownload = (content, filename, mimeType) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = filename;
    link.click();

    setTimeout(() => URL.revokeObjectURL(url), 0);
  };

  const downloadCsv = () => {
    const rows = buildLeadRows();
    const headers = ["Name", "Email", "Phone", "Date Time"];
    const escapeCell = (value) => {
      const text = String(value ?? "");
      return `"${text.replace(/"/g, '""')}"`;
    };

    const csvContent = [
      headers.map(escapeCell).join(","),
      ...rows.map((row) => headers.map((header) => escapeCell(row[header])).join(",")),
    ].join("\n");

    triggerDownload(csvContent, "chat-leads.csv", "text/csv;charset=utf-8;");
  };

  const downloadExcel = async () => {
    const rows = buildLeadRows();
    const xlsxModule = await import("xlsx");
    const XLSX = xlsxModule.default ?? xlsxModule;
    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Leads");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    triggerDownload(
      excelBuffer,
      "chat-leads.xlsx",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
  };

  const handleExport = async (format) => {
    setIsExportMenuOpen(false);

    if (format === "csv") {
      downloadCsv();
      return;
    }

    await downloadExcel();
  };

  // Determine which sessions to display
  const displayedSessions = showAll ? chatSessions : chatSessions.slice(0, 5);
  const hasMoreSessions = chatSessions.length > 5;

  return (
    <div className="rounded-lg border border-slate-700 bg-slate-950/60 px-3 py-5">
      {loading ? (
        <div className="rounded-xl border border-slate-700 bg-slate-900 p-8 text-center shadow-sm">
          <div className="animate-pulse flex flex-col items-center">
            <div className="mb-4 h-6 w-24 rounded bg-slate-700"></div>
            <div className="h-4 w-48 rounded bg-slate-700"></div>
          </div>
        </div>
      ) : chatSessions.length === 0 ? (
        <div className="rounded-xl border border-slate-700 bg-slate-900 p-8 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-slate-800">
            <IoIosChatboxes className="h-12 w-12 text-slate-400" />
          </div>
          <h3 className="mb-2 text-xl font-medium text-slate-100">No chat history</h3>
          <p className="text-slate-400">No chat sessions found for this user</p>
        </div>
      ) : (
        <>
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-800 bg-slate-900/80 px-4 py-3">
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-300">
                Leads export
              </h2>
              <p className="mt-1 text-sm text-slate-400">
                Download the captured lead details as CSV or Excel.
              </p>
            </div>

            <div className="relative">
              <button
                type="button"
                onClick={() => setIsExportMenuOpen((current) => !current)}
                className="inline-flex items-center gap-2 rounded-lg bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950 transition-colors hover:bg-cyan-400"
              >
                <FiDownload className="h-4 w-4" />
                Download Leads
              </button>

              {isExportMenuOpen && (
                <div className="absolute right-0 z-20 mt-2 w-44 overflow-hidden rounded-lg border border-slate-700 bg-slate-950 shadow-xl">
                  <button
                    type="button"
                    onClick={() => handleExport("csv")}
                    className="block w-full px-4 py-3 text-left text-sm text-slate-200 transition-colors hover:bg-slate-800"
                  >
                    Download CSV
                  </button>
                  <button
                    type="button"
                    onClick={() => handleExport("excel")}
                    className="block w-full px-4 py-3 text-left text-sm text-slate-200 transition-colors hover:bg-slate-800"
                  >
                    Download Excel
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedSessions.map((session) => (
              <div 
                key={session._id} 
                className="overflow-hidden rounded-xl border border-slate-700 bg-slate-900 shadow-lg transition-all hover:border-cyan-500/50"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1 pr-2">
                      <h3 className="text-xl font-bold text-slate-100 break-words">
                        {session.full_name || "Anonymous User"}
                      </h3>
                      <p className="mt-1 text-sm text-slate-400">
                        {formatTimeAgo(session.created_at)}
                      </p>
                    </div>
                    <span className="inline-flex flex-shrink-0 items-center rounded-full border border-cyan-500/40 bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-200">
                      {session.messages.length} messages
                    </span>
                  </div>
                  
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center text-sm text-slate-300">
                      <span className="mr-2 font-medium text-slate-400">Email:</span>
                      <span className="overflow-auto">{session.email || "Not provided"}</span>
                    </div>
                    <div className="flex items-center text-sm text-slate-300">
                      <span className="mr-2 font-medium text-slate-400">Phone:</span>
                      <span>{session.phone_number || "Not provided"}</span>
                    </div>
                  </div>
                  
                  <div className="mt-4 border-t border-slate-700 pt-4">
                    <div className="flex items-center text-sm text-slate-400">
                      <FiClock className="mr-2" />
                      <span>{formatDateTime(session.created_at)}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end border-t border-slate-700 bg-slate-950 p-4">
                  <button
                    onClick={() => openModal(session)}
                    className="flex items-center space-x-2 rounded-lg bg-cyan-500 px-4 py-2 text-slate-950 transition-colors hover:bg-cyan-400"
                  >
                    <IoIosChatboxes className="h-5 w-5" />
                    <span>View Chat</span>
                  </button>
                </div>
              </div>
            ))}
            
            {/* Show More Button Card */}
            {hasMoreSessions && !showAll && (
              <div className="overflow-hidden rounded-xl border-2 border-dashed border-slate-600 bg-slate-900 shadow-lg transition-all hover:border-cyan-500/40">
                <div className="p-6 flex flex-col items-center justify-center h-full min-h-[300px]">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-800">
                    <IoIosChatboxes className="h-8 w-8 text-slate-400" />
                  </div>
                  <h3 className="mb-2 text-lg font-medium text-slate-200">
                    {chatSessions.length - 5} More Sessions
                  </h3>
                  <p className="mb-4 text-center text-slate-400">
                    Click to view all chat sessions
                  </p>
                  <button
                    onClick={() => setShowAll(true)}
                    className="rounded-lg bg-cyan-500 px-6 py-3 font-medium text-slate-950 transition-colors hover:bg-cyan-400"
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
                className="rounded-lg bg-slate-700 px-6 py-3 font-medium text-white transition-colors hover:bg-slate-600"
              >
                Show Less
              </button>
            </div>
          )}
        </>
      )}

      {/* Modal */}
      {isModalOpen && selectedSession && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="relative h-full w-full max-w-2xl overflow-y-auto rounded-xl border border-slate-700 bg-slate-950 shadow-2xl md:h-[80vh]">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-700 bg-slate-900/95 p-6 backdrop-blur">
              <h2 className="pr-4 text-xl font-semibold break-words text-slate-100">
                Chat with {selectedSession.full_name || "Anonymous User"}
              </h2>
              <button
                className="flex-shrink-0 text-2xl text-slate-400 transition hover:text-rose-400"
                onClick={closeModal}
              >
                <IoMdClose />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="rounded-lg border border-slate-700 bg-slate-900 p-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-medium text-slate-400">Email</p>
                    <p className="break-words text-slate-200">{selectedSession.email || "Not provided"}</p>
                  </div>
                  <div>
                    <p className="font-medium text-slate-400">Phone</p>
                    <p className="text-slate-200">{selectedSession.phone_number || "Not provided"}</p>
                  </div>
                  <div>
                    <p className="font-medium text-slate-400">Started</p>
                    <p className="text-slate-200">{formatDateTime(selectedSession.created_at)}</p>
                  </div>
                  <div>
                    <p className="font-medium text-slate-400">Messages</p>
                    <p className="text-slate-200">{selectedSession.messages.length}</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-6">
                {selectedSession.messages.map((msg, idx) => (
                  <div key={idx} className="space-y-2">
                    <div className="flex items-start space-x-3">
                      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-cyan-500 text-slate-950">
                        {selectedSession.full_name ? selectedSession.full_name.charAt(0) : "U"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="rounded-lg border border-cyan-500/30 bg-cyan-500/10 p-3 text-cyan-100">
                          <p>{msg.query}</p>
                        </div>
                        <p className="mt-1 text-xs text-slate-400">
                          {formatDateTime(msg.timestamp)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3 ml-12">
                      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-emerald-500 text-slate-950">
                        B
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3 text-emerald-100">
                          <p>{msg.response}</p>
                        </div>
                        <p className="mt-1 text-xs text-slate-400">
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