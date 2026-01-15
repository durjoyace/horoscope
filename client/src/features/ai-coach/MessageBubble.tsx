/**
 * Message Bubble Component
 * Displays chat messages with styling based on sender
 */

import { motion } from 'framer-motion';
import { Message, getElementColor, MESSAGE_FADE_IN } from './types';
import { CoachAvatar } from './CoachAvatar';
import { format } from 'date-fns';

interface MessageBubbleProps {
  message: Message;
  zodiacSign?: string | null;
  isLatest?: boolean;
}

export function MessageBubble({ message, zodiacSign, isLatest = false }: MessageBubbleProps) {
  const isUser = message.role === 'user';
  const colors = getElementColor(zodiacSign);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: MESSAGE_FADE_IN / 1000 }}
      className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
    >
      {/* Avatar (only for assistant messages) */}
      {!isUser && <CoachAvatar zodiacSign={zodiacSign} size="sm" />}

      {/* Message content */}
      <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} max-w-[80%]`}>
        <div
          className={`px-4 py-3 rounded-2xl ${
            isUser
              ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-br-md'
              : 'bg-white/10 backdrop-blur-sm border border-white/20 text-white/90 rounded-bl-md'
          }`}
          style={
            !isUser
              ? {
                  borderColor: `${colors.primary}30`,
                }
              : {}
          }
        >
          {/* Render message with markdown-like formatting */}
          <MessageContent content={message.content} />
        </div>

        {/* Timestamp */}
        <span className="text-xs text-white/40 mt-1 px-1">
          {format(new Date(message.createdAt), 'h:mm a')}
        </span>
      </div>

      {/* Spacer for user messages (to align with assistant avatar) */}
      {isUser && <div className="w-10" />}
    </motion.div>
  );
}

/**
 * Render message content with basic formatting
 */
function MessageContent({ content }: { content: string }) {
  // Split content into paragraphs and handle bullet points
  const paragraphs = content.split('\n\n');

  return (
    <div className="space-y-2">
      {paragraphs.map((paragraph, i) => {
        // Check if it's a bullet list
        if (paragraph.includes('\n- ') || paragraph.startsWith('- ')) {
          const items = paragraph.split('\n').filter((line) => line.startsWith('- '));
          return (
            <ul key={i} className="list-disc list-inside space-y-1">
              {items.map((item, j) => (
                <li key={j} className="text-sm">
                  {item.replace('- ', '')}
                </li>
              ))}
            </ul>
          );
        }

        // Check if it's a numbered list
        if (/^\d+\./.test(paragraph)) {
          const items = paragraph.split('\n').filter((line) => /^\d+\./.test(line.trim()));
          return (
            <ol key={i} className="list-decimal list-inside space-y-1">
              {items.map((item, j) => (
                <li key={j} className="text-sm">
                  {item.replace(/^\d+\.\s*/, '')}
                </li>
              ))}
            </ol>
          );
        }

        // Bold text within **
        const formattedText = paragraph.split(/(\*\*.*?\*\*)/g).map((part, j) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            return (
              <strong key={j} className="font-semibold">
                {part.slice(2, -2)}
              </strong>
            );
          }
          return part;
        });

        return (
          <p key={i} className="text-sm leading-relaxed">
            {formattedText}
          </p>
        );
      })}
    </div>
  );
}
