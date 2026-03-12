"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Layout } from "@/components/layout/Layout";

export default function MessagesPage() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const selectedUserId = searchParams.get('userId');

  return (
    <Layout>
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Messages</h1>
          <p className="text-slate-600">
            {selectedUserId 
              ? `Chat with user ID: ${selectedUserId}` 
              : "Select a team member to start messaging"
            }
          </p>
        </div>

        {selectedUserId ? (
          <div className="bg-white rounded-lg border border-slate-200 p-6">
            <div className="text-center text-slate-500">
              <p className="mb-4">Chat interface for User ID: {selectedUserId}</p>
              <p className="text-sm">This is a placeholder for the chat functionality.</p>
              <p className="text-sm">The actual chat UI will be implemented here.</p>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-slate-200 p-6">
            <div className="text-center text-slate-500">
              <p>Please select a team member from the team page to start messaging.</p>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
