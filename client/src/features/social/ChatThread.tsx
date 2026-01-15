/**
 * Chat Thread Component
 * Direct messaging conversation view
 */

import { useState, useRef, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Conversation, Message, getDisplayName, getZodiacEmoji } from './types';
import { ArrowLeft, Send, Loader2 } from 'lucide-react';

interface ChatThreadProps {
  conversation: Conversation;
  currentUserId: number;
  onBack: () => void;
}

export function ChatThread({ conversation, currentUserId, onBack }: ChatThreadProps) {
  const queryClient = useQueryClient();
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Fetch messages
  const { data: messages = [], isLoading } = useQuery<Message[]>({
    queryKey: ['messages', conversation.id],
    queryFn: async () => {
      const res = await fetch(`/api/v2/social/conversations/${conversation.id}/messages`, {
        credentials: 'include',
      });
      const data = await res.json();
      return data.data;
    },
    refetchInterval: 5000, // Poll for new messages
  });

  // Send message mutation
  const sendMutation = useMutation({
    mutationFn: async (content: string) => {
      const res = await fetch(`/api/v2/social/conversations/${conversation.id}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ content }),
      });
      if (!res.ok) throw new Error('Failed to send');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages', conversation.id] });
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
      setNewMessage('');
    },
  });

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      sendMutation.mutate(newMessage.trim());
    }
  };

  const displayName = getDisplayName(conversation.otherUser);
  const zodiacEmoji = getZodiacEmoji(conversation.otherUser.zodiacSign);

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-white/10 flex items-center gap-3">
        <button
          onClick={onBack}
          className="p-2 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-medium">
          {displayName.charAt(0).toUpperCase()}
        </div>

        <div className="flex-1 min-w-0">
          <p className="font-medium text-white truncate">
            {displayName} {zodiacEmoji}
          </p>
          <p className="text-xs text-white/40 truncate">{conversation.otherUser.email}</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="w-6 h-6 text-white/50 animate-spin" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-center">
            <div>
              <p className="text-white/50">No messages yet</p>
              <p className="text-sm text-white/30 mt-1">Send a message to start the conversation</p>
            </div>
          </div>
        ) : (
          <>
            {messages.map((message, index) => (
              <MessageBubble
                key={message.id}
                message={message}
                isOwn={message.senderId === currentUserId}
                showAvatar={
                  index === 0 ||
                  messages[index - 1].senderId !== message.senderId
                }
                otherUserInitial={displayName.charAt(0).toUpperCase()}
              />
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="p-4 border-t border-white/10">
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            maxLength={2000}
            className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10
                     text-white placeholder:text-white/40
                     focus:outline-none focus:ring-2 focus:ring-purple-500/50"
          />
          <button
            type="submit"
            disabled={!newMessage.trim() || sendMutation.isPending}
            className="px-4 py-3 rounded-xl bg-purple-600 text-white
                     hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed
                     transition-colors flex items-center gap-2"
          >
            {sendMutation.isPending ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
  showAvatar: boolean;
  otherUserInitial: string;
}

function MessageBubble({ message, isOwn, showAvatar, otherUserInitial }: MessageBubbleProps) {
  const time = new Date(message.createdAt).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex items-end gap-2 ${isOwn ? 'flex-row-reverse' : ''}`}
    >
      {/* Avatar */}
      {showAvatar && !isOwn ? (
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-sm font-medium flex-shrink-0">
          {otherUserInitial}
        </div>
      ) : (
        <div className="w-8 flex-shrink-0" />
      )}

      {/* Message */}
      <div
        className={`max-w-[70%] px-4 py-2 rounded-2xl ${
          isOwn
            ? 'bg-purple-600 text-white rounded-br-sm'
            : 'bg-white/10 text-white rounded-bl-sm'
        }`}
      >
        <p className="break-words">{message.content}</p>
        <p
          className={`text-[10px] mt-1 ${
            isOwn ? 'text-white/60' : 'text-white/40'
          }`}
        >
          {time}
        </p>
      </div>
    </motion.div>
  );
}

interface ConversationListProps {
  onSelectConversation: (conversation: Conversation) => void;
}

export function ConversationList({ onSelectConversation }: ConversationListProps) {
  const { data: conversations = [], isLoading } = useQuery<Conversation[]>({
    queryKey: ['conversations'],
    queryFn: async () => {
      const res = await fetch('/api/v2/social/conversations', { credentials: 'include' });
      const data = await res.json();
      return data.data;
    },
    refetchInterval: 10000,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-6 h-6 text-white/50 animate-spin" />
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-white/50">No conversations yet</p>
        <p className="text-sm text-white/30 mt-1">Start a chat from your friends list</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {conversations.map((conv) => (
        <ConversationCard
          key={conv.id}
          conversation={conv}
          onClick={() => onSelectConversation(conv)}
        />
      ))}
    </div>
  );
}

interface ConversationCardProps {
  conversation: Conversation;
  onClick: () => void;
}

function ConversationCard({ conversation, onClick }: ConversationCardProps) {
  const displayName = getDisplayName(conversation.otherUser);
  const zodiacEmoji = getZodiacEmoji(conversation.otherUser.zodiacSign);
  const lastMessageTime = conversation.lastMessageAt
    ? new Date(conversation.lastMessageAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      })
    : '';

  return (
    <motion.button
      onClick={onClick}
      className="w-full p-3 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3
               hover:bg-white/10 transition-colors text-left"
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
    >
      <div className="relative">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-medium">
          {displayName.charAt(0).toUpperCase()}
        </div>
        {conversation.unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs flex items-center justify-center text-white">
            {conversation.unreadCount}
          </span>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <p className="font-medium text-white truncate">
            {displayName} {zodiacEmoji}
          </p>
          {lastMessageTime && (
            <span className="text-xs text-white/40 flex-shrink-0 ml-2">{lastMessageTime}</span>
          )}
        </div>
        {conversation.lastMessage && (
          <p className="text-sm text-white/50 truncate">{conversation.lastMessage}</p>
        )}
      </div>
    </motion.button>
  );
}
