/**
 * AI Coach Page
 * Main page for the AI wellness coach feature
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { ChatInterface } from './ChatInterface';
import { CoachAvatar } from './CoachAvatar';
import { getElementColor, COACH_NAME, COACH_TAGLINE, Conversation } from './types';
import { useAuth } from '@/hooks/use-auth';
import { MessageSquare, Plus, History, Sparkles, ChevronRight } from 'lucide-react';

type ViewMode = 'chat' | 'history';

export function AICoachPage() {
  const { user } = useAuth();
  const [viewMode, setViewMode] = useState<ViewMode>('chat');
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const zodiacSign = user?.zodiacSign;
  const colors = getElementColor(zodiacSign);

  // Fetch conversation history
  const { data: conversationsData, isLoading: loadingConversations } = useQuery({
    queryKey: ['ai-conversations'],
    queryFn: async () => {
      const res = await fetch('/api/v2/ai/conversations', { credentials: 'include' });
      if (!res.ok) throw new Error('Failed to fetch conversations');
      return res.json();
    },
    enabled: viewMode === 'history',
  });

  const conversations: Conversation[] = conversationsData?.data || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-slate-900/80 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CoachAvatar zodiacSign={zodiacSign} size="md" />
              <div>
                <h1 className="text-xl font-semibold text-white flex items-center gap-2">
                  {COACH_NAME}
                  <Sparkles className="w-4 h-4 text-yellow-400" />
                </h1>
                <p className="text-sm text-white/60">{COACH_TAGLINE}</p>
              </div>
            </div>

            {/* View toggle */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode('chat')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'chat'
                    ? 'bg-white/10 text-white'
                    : 'text-white/50 hover:text-white/80'
                }`}
              >
                <MessageSquare className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('history')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'history'
                    ? 'bg-white/10 text-white'
                    : 'text-white/50 hover:text-white/80'
                }`}
              >
                <History className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-4xl mx-auto" style={{ height: 'calc(100vh - 88px)' }}>
        {viewMode === 'chat' ? (
          <ChatInterface zodiacSign={zodiacSign} />
        ) : (
          <ConversationHistory
            conversations={conversations}
            loading={loadingConversations}
            zodiacSign={zodiacSign}
            onSelect={(conv) => {
              setSelectedConversation(conv);
              setViewMode('chat');
            }}
            onNewChat={() => setViewMode('chat')}
          />
        )}
      </div>
    </div>
  );
}

/**
 * Conversation History List
 */
interface ConversationHistoryProps {
  conversations: Conversation[];
  loading: boolean;
  zodiacSign?: string | null;
  onSelect: (conversation: Conversation) => void;
  onNewChat: () => void;
}

function ConversationHistory({
  conversations,
  loading,
  zodiacSign,
  onSelect,
  onNewChat,
}: ConversationHistoryProps) {
  const colors = getElementColor(zodiacSign);

  return (
    <div className="p-4 space-y-4">
      {/* New chat button */}
      <motion.button
        onClick={onNewChat}
        className="w-full p-4 rounded-xl border border-dashed border-white/20
                   flex items-center justify-center gap-2 text-white/60
                   hover:border-white/40 hover:text-white/80 transition-colors"
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        <Plus className="w-5 h-5" />
        <span>Start New Conversation</span>
      </motion.button>

      {/* Conversation list */}
      <div className="space-y-2">
        <h2 className="text-sm font-medium text-white/50 uppercase tracking-wider px-1">
          Recent Conversations
        </h2>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-white/20 border-t-white" />
          </div>
        ) : conversations.length === 0 ? (
          <div className="text-center py-8 text-white/40">
            <MessageSquare className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No conversations yet</p>
            <p className="text-sm">Start chatting to see your history here</p>
          </div>
        ) : (
          conversations.map((conv, index) => (
            <motion.button
              key={conv.id}
              onClick={() => onSelect(conv)}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="w-full p-4 rounded-xl bg-white/5 border border-white/10
                         hover:bg-white/10 hover:border-white/20 transition-all
                         flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: `${colors.primary}20` }}
                >
                  <MessageSquare className="w-5 h-5" style={{ color: colors.primary }} />
                </div>
                <div className="text-left">
                  <p className="text-white font-medium">
                    {conv.topic || 'Wellness Chat'}
                  </p>
                  <p className="text-sm text-white/50">
                    {conv.messageCount} messages
                    {conv.lastMessageAt && (
                      <> · {new Date(conv.lastMessageAt).toLocaleDateString()}</>
                    )}
                  </p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-white/30 group-hover:text-white/60 transition-colors" />
            </motion.button>
          ))
        )}
      </div>
    </div>
  );
}

export default AICoachPage;
