/**
 * Chat Interface Component
 * Main chat UI for AI wellness coach
 */

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { MessageBubble } from './MessageBubble';
import { TypingIndicator, StreamingText } from './TypingIndicator';
import { SuggestedPrompts, WelcomeMessage } from './SuggestedPrompts';
import {
  Message,
  Conversation,
  CreateConversationResponse,
  SSEMessage,
  COACH_NAME,
  getElementColor,
} from './types';
import { Send, Sparkles, Loader2 } from 'lucide-react';

interface ChatInterfaceProps {
  zodiacSign?: string | null;
}

export function ChatInterface({ zodiacSign }: ChatInterfaceProps) {
  const [input, setInput] = useState('');
  const [streamingText, setStreamingText] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const queryClient = useQueryClient();
  const colors = getElementColor(zodiacSign);

  // Fetch suggested prompts
  const { data: promptsData } = useQuery({
    queryKey: ['ai-prompts'],
    queryFn: async () => {
      const res = await fetch('/api/v2/ai/prompts', { credentials: 'include' });
      if (!res.ok) throw new Error('Failed to fetch prompts');
      return res.json();
    },
  });

  // Create conversation mutation
  const createConversationMutation = useMutation({
    mutationFn: async (): Promise<CreateConversationResponse> => {
      const res = await fetch('/api/v2/ai/conversations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ topic: 'wellness' }),
      });
      if (!res.ok) throw new Error('Failed to create conversation');
      return res.json();
    },
    onSuccess: (data) => {
      setConversation(data.data.conversation);
    },
  });

  // Send message with SSE streaming
  const sendMessageStreaming = useCallback(
    async (messageText: string, conversationId: number) => {
      setIsStreaming(true);
      setStreamingText('');

      // Add user message optimistically
      const userMessage: Message = {
        id: Date.now(),
        role: 'user',
        content: messageText,
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, userMessage]);

      try {
        const response = await fetch(`/api/v2/ai/conversations/${conversationId}/messages`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'text/event-stream',
          },
          credentials: 'include',
          body: JSON.stringify({ message: messageText, stream: true }),
        });

        if (!response.ok) {
          throw new Error('Failed to send message');
        }

        const reader = response.body?.getReader();
        const decoder = new TextDecoder();

        if (!reader) {
          throw new Error('No response body');
        }

        let fullResponse = '';
        let buffer = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const data: SSEMessage = JSON.parse(line.slice(6));

                if (data.type === 'token' && data.content) {
                  fullResponse += data.content;
                  setStreamingText(fullResponse);
                } else if (data.type === 'complete') {
                  // Add assistant message
                  const assistantMessage: Message = {
                    id: Date.now() + 1,
                    role: 'assistant',
                    content: fullResponse,
                    createdAt: new Date().toISOString(),
                  };
                  setMessages((prev) => [...prev, assistantMessage]);
                  setStreamingText('');
                } else if (data.type === 'error') {
                  console.error('Stream error:', data.message);
                }
              } catch {
                // Ignore parse errors for non-JSON lines
              }
            }
          }
        }
      } catch (error) {
        console.error('Error sending message:', error);
        // Add error message
        const errorMessage: Message = {
          id: Date.now() + 1,
          role: 'assistant',
          content: "I'm sorry, I encountered an error. Please try again.",
          createdAt: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, errorMessage]);
      } finally {
        setIsStreaming(false);
        setStreamingText('');
      }
    },
    []
  );

  // Handle send message
  const handleSend = async () => {
    if (!input.trim() || isStreaming) return;

    const messageText = input.trim();
    setInput('');

    // Create conversation if needed
    if (!conversation) {
      const result = await createConversationMutation.mutateAsync();
      await sendMessageStreaming(messageText, result.data.conversation.id);
    } else {
      await sendMessageStreaming(messageText, conversation.id);
    }
  };

  // Handle prompt selection
  const handlePromptSelect = (prompt: string) => {
    setInput(prompt);
    inputRef.current?.focus();
  };

  // Handle key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamingText]);

  // Auto-resize textarea
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
  };

  const suggestedPrompts = promptsData?.data?.prompts || [];
  const zodiacInsight = promptsData?.data?.zodiacInsight;

  return (
    <div className="flex flex-col h-full">
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && !isStreaming ? (
          <>
            <WelcomeMessage
              zodiacSign={zodiacSign}
              zodiacInsight={zodiacInsight}
              coachName={COACH_NAME}
            />
            <SuggestedPrompts
              prompts={suggestedPrompts}
              zodiacSign={zodiacSign}
              onSelect={handlePromptSelect}
              disabled={isStreaming}
            />
          </>
        ) : (
          <>
            {messages.map((message, index) => (
              <MessageBubble
                key={message.id}
                message={message}
                zodiacSign={zodiacSign}
                isLatest={index === messages.length - 1}
              />
            ))}

            <AnimatePresence>
              {isStreaming && streamingText && (
                <StreamingText text={streamingText} zodiacSign={zodiacSign} />
              )}
              {isStreaming && !streamingText && (
                <TypingIndicator zodiacSign={zodiacSign} />
              )}
            </AnimatePresence>
          </>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="border-t border-white/10 p-4">
        <div className="max-w-3xl mx-auto">
          <div
            className="flex items-end gap-2 p-2 rounded-2xl bg-white/5 border border-white/10
                       focus-within:border-white/30 transition-colors"
            style={{ borderColor: input ? `${colors.primary}40` : undefined }}
          >
            <textarea
              ref={inputRef}
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyPress}
              placeholder={`Ask ${COACH_NAME} anything...`}
              disabled={isStreaming}
              rows={1}
              className="flex-1 bg-transparent text-white placeholder-white/40 resize-none
                         focus:outline-none px-2 py-2 text-sm max-h-[120px]"
            />

            <motion.button
              onClick={handleSend}
              disabled={!input.trim() || isStreaming}
              className="p-2 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed
                         transition-colors flex-shrink-0"
              style={{
                backgroundColor: input.trim() ? colors.primary : 'transparent',
              }}
              whileHover={input.trim() ? { scale: 1.05 } : {}}
              whileTap={input.trim() ? { scale: 0.95 } : {}}
            >
              {isStreaming ? (
                <Loader2 className="w-5 h-5 text-white animate-spin" />
              ) : (
                <Send className="w-5 h-5 text-white" />
              )}
            </motion.button>
          </div>

          <div className="flex items-center justify-center gap-2 mt-2 text-xs text-white/30">
            <Sparkles className="w-3 h-3" />
            <span>Powered by cosmic AI wisdom</span>
          </div>
        </div>
      </div>
    </div>
  );
}
