"use client";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { cn, formatDate } from "@/lib/utils";
import {
  MessageSquare,
  Trash2,
  RefreshCw,
  Loader2,
  History,
  Sparkles,
} from "lucide-react";
import { useEffect, useState } from "react";

export function PrevChats({
  open,
  onOpenChange,
  onSelectSession,
  clientId,
  currentSessionId,
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(null);
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    if (clientId !== undefined) {
      getAllSessions();
    }
  }, [clientId]);

  async function getAllSessions() {
    try {
      setIsLoading(true);
      const response = await fetch("/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: `/client/${clientId}/sessions`,
          options: { method: "GET" },
        }),
      });
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      const data = await response.json();
      setSessions(data?.data || []);
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setIsLoading(false);
    }
  }

  async function deleteSession(id, e) {
    if (e) e.stopPropagation();
    try {
      setIsDeleting(id);
      const response = await fetch("/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: `/session/${id}/`,
          options: { method: "DELETE" },
        }),
      });
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      await response.json();
      getAllSessions();
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setIsDeleting(null);
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-80 p-0 flex flex-col">
        {/* Header */}
        <div className="px-4 py-4 border-b border-gray-100 bg-gradient-to-br from-slate-50 to-white">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#003B6D] to-[#26B9B3] flex items-center justify-center">
              <History className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-gray-900 leading-tight">
                Chat history
              </h2>
              <p className="text-xs text-gray-500">
                {sessions.length} previous conversation{sessions.length === 1 ? "" : "s"}
              </p>
            </div>
          </div>
          <Button
            size="sm"
            variant="outline"
            className="w-full h-8 text-xs"
            disabled={isLoading}
            onClick={getAllSessions}
          >
            {isLoading ? (
              <Loader2 className="w-3 h-3 mr-1.5 animate-spin" />
            ) : (
              <RefreshCw className="w-3 h-3 mr-1.5" />
            )}
            Refresh
          </Button>
        </div>

        {/* List */}
        <ScrollArea className="flex-1">
          <div className="p-3">
            {isLoading ? (
              <div className="space-y-2">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div
                    key={i}
                    className="animate-pulse p-3 rounded-xl bg-gray-100/70"
                  >
                    <div className="w-3/4 h-3.5 bg-gray-200 rounded mb-2" />
                    <div className="w-1/3 h-2.5 bg-gray-200 rounded" />
                  </div>
                ))}
              </div>
            ) : sessions.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center px-4">
                <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center mb-3">
                  <Sparkles className="w-5 h-5 text-gray-400" />
                </div>
                <p className="text-sm font-medium text-gray-700">No conversations yet</p>
                <p className="text-xs text-gray-500 mt-1">
                  Start a new chat to see it here
                </p>
              </div>
            ) : (
              <div className="space-y-1">
                {sessions.map((session) => {
                  const isActive = session.id === currentSessionId;
                  return (
                    <div
                      key={session.id}
                      onClick={() => onSelectSession(session.id)}
                      className={cn(
                        "group relative flex items-start gap-3 p-3 rounded-xl cursor-pointer transition-colors",
                        isActive
                          ? "bg-gradient-to-r from-[#003B6D]/8 to-[#26B9B3]/8 border border-[#26B9B3]/30"
                          : "hover:bg-gray-100"
                      )}
                    >
                      <div
                        className={cn(
                          "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors",
                          isActive
                            ? "bg-gradient-to-br from-[#003B6D] to-[#26B9B3] text-white"
                            : "bg-gray-100 text-gray-500 group-hover:bg-gray-200"
                        )}
                      >
                        <MessageSquare className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0 pr-8">
                        <p
                          className={cn(
                            "text-sm font-medium leading-snug line-clamp-2",
                            isActive ? "text-gray-900" : "text-gray-800"
                          )}
                        >
                          {session?.title || "Untitled conversation"}
                        </p>
                        <p className="text-[11px] text-gray-500 mt-1">
                          {formatDate(session.created_at)}
                        </p>
                      </div>
                      <button
                        disabled={isDeleting === session.id}
                        onClick={(e) => deleteSession(session.id, e)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-md opacity-0 group-hover:opacity-100 hover:bg-red-50 text-gray-400 hover:text-red-600 transition-all"
                        title="Delete conversation"
                      >
                        {isDeleting === session.id ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Trash2 className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
