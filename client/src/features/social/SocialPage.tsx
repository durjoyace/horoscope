/**
 * Social Page
 * Main hub for friends and messaging
 */

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { FriendsList } from './FriendsList';
import { ChatThread, ConversationList } from './ChatThread';
import { Conversation } from './types';
import { Users, MessageCircle, Bell } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';

type View = 'friends' | 'messages' | 'chat';

export function SocialPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [view, setView] = useState<View>('friends');
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);

  // Get unread count for badge
  const { data: unreadData } = useQuery<{ unreadCount: number }>({
    queryKey: ['unread-count'],
    queryFn: async () => {
      const res = await fetch('/api/v2/social/unread', { credentials: 'include' });
      const data = await res.json();
      return data.data;
    },
    refetchInterval: 30000,
  });

  // Start a chat with a friend
  const startChatMutation = useMutation({
    mutationFn: async (userId: number) => {
      const res = await fetch('/api/v2/social/conversations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ userId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      return data.data as Conversation;
    },
    onSuccess: (conversation) => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
      setSelectedConversation(conversation);
      setView('chat');
    },
  });

  const handleStartChat = (friendId: number) => {
    startChatMutation.mutate(friendId);
  };

  const handleSelectConversation = (conversation: Conversation) => {
    setSelectedConversation(conversation);
    setView('chat');
  };

  const handleBackFromChat = () => {
    setSelectedConversation(null);
    setView('messages');
    queryClient.invalidateQueries({ queryKey: ['unread-count'] });
  };

  const unreadCount = unreadData?.unreadCount || 0;

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <div className="bg-gradient-to-b from-purple-900/30 to-transparent">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold mb-2">Social</h1>
          <p className="text-white/60">Connect with friends and share your journey</p>
        </div>
      </div>

      {/* Tab Navigation */}
      {view !== 'chat' && (
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex gap-2 p-1 bg-white/5 rounded-xl">
            <button
              onClick={() => setView('friends')}
              className={`flex-1 py-3 rounded-lg flex items-center justify-center gap-2 transition-colors ${
                view === 'friends'
                  ? 'bg-purple-600 text-white'
                  : 'text-white/50 hover:text-white hover:bg-white/5'
              }`}
            >
              <Users className="w-5 h-5" />
              Friends
            </button>
            <button
              onClick={() => setView('messages')}
              className={`flex-1 py-3 rounded-lg flex items-center justify-center gap-2 transition-colors relative ${
                view === 'messages'
                  ? 'bg-purple-600 text-white'
                  : 'text-white/50 hover:text-white hover:bg-white/5'
              }`}
            >
              <MessageCircle className="w-5 h-5" />
              Messages
              {unreadCount > 0 && view !== 'messages' && (
                <span className="absolute top-2 right-2 w-5 h-5 bg-red-500 rounded-full text-xs flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <AnimatePresence mode="wait">
          {view === 'friends' && (
            <motion.div
              key="friends"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white/5 rounded-2xl border border-white/10 min-h-[500px]"
            >
              <FriendsList onStartChat={handleStartChat} />
            </motion.div>
          )}

          {view === 'messages' && (
            <motion.div
              key="messages"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="bg-white/5 rounded-2xl border border-white/10 min-h-[500px] p-4"
            >
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <MessageCircle className="w-5 h-5" />
                Conversations
              </h2>
              <ConversationList onSelectConversation={handleSelectConversation} />
            </motion.div>
          )}

          {view === 'chat' && selectedConversation && user && (
            <motion.div
              key="chat"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="bg-white/5 rounded-2xl border border-white/10 h-[600px]"
            >
              <ChatThread
                conversation={selectedConversation}
                currentUserId={user.id}
                onBack={handleBackFromChat}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Error display */}
      {startChatMutation.error && (
        <div className="max-w-4xl mx-auto px-4">
          <div className="p-4 bg-red-500/20 border border-red-500/30 rounded-xl text-red-400">
            {(startChatMutation.error as Error).message}
          </div>
        </div>
      )}
    </div>
  );
}
