/**
 * Friends List Component
 * Displays friends and pending requests
 */

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Friend, PendingRequest, getDisplayName, getZodiacEmoji } from './types';
import {
  Users,
  UserPlus,
  UserCheck,
  UserX,
  MessageCircle,
  Clock,
  Check,
  X,
  Search,
} from 'lucide-react';

interface FriendsListProps {
  onStartChat: (friendId: number) => void;
}

export function FriendsList({ onStartChat }: FriendsListProps) {
  const queryClient = useQueryClient();
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [friendEmail, setFriendEmail] = useState('');
  const [activeTab, setActiveTab] = useState<'friends' | 'requests'>('friends');

  // Fetch friends
  const { data: friends = [], isLoading: loadingFriends } = useQuery<Friend[]>({
    queryKey: ['friends'],
    queryFn: async () => {
      const res = await fetch('/api/v2/social/friends', { credentials: 'include' });
      const data = await res.json();
      return data.data;
    },
  });

  // Fetch pending requests
  const { data: requests = [] } = useQuery<PendingRequest[]>({
    queryKey: ['friend-requests'],
    queryFn: async () => {
      const res = await fetch('/api/v2/social/friends/requests', { credentials: 'include' });
      const data = await res.json();
      return data.data;
    },
  });

  // Send friend request
  const sendRequestMutation = useMutation({
    mutationFn: async (email: string) => {
      const res = await fetch('/api/v2/social/friends/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['friend-requests'] });
      setFriendEmail('');
      setShowAddFriend(false);
    },
  });

  // Respond to request
  const respondMutation = useMutation({
    mutationFn: async ({ requestId, accept }: { requestId: number; accept: boolean }) => {
      const res = await fetch(`/api/v2/social/friends/requests/${requestId}/respond`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ accept }),
      });
      if (!res.ok) throw new Error('Failed to respond');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['friends'] });
      queryClient.invalidateQueries({ queryKey: ['friend-requests'] });
    },
  });

  // Remove friend
  const removeMutation = useMutation({
    mutationFn: async (friendId: number) => {
      const res = await fetch(`/api/v2/social/friends/${friendId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Failed to remove');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['friends'] });
    },
  });

  const incomingRequests = requests.filter((r) => r.type === 'incoming');
  const outgoingRequests = requests.filter((r) => r.type === 'outgoing');

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <Users className="w-5 h-5" />
            Friends
          </h2>
          <button
            onClick={() => setShowAddFriend(!showAddFriend)}
            className="p-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition-colors"
          >
            <UserPlus className="w-5 h-5" />
          </button>
        </div>

        {/* Add friend form */}
        <AnimatePresence>
          {showAddFriend && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (friendEmail) sendRequestMutation.mutate(friendEmail);
                }}
                className="flex gap-2 mb-4"
              >
                <input
                  type="email"
                  value={friendEmail}
                  onChange={(e) => setFriendEmail(e.target.value)}
                  placeholder="Friend's email..."
                  className="flex-1 px-3 py-2 rounded-lg bg-white/5 border border-white/10
                           text-white placeholder:text-white/40
                           focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                />
                <button
                  type="submit"
                  disabled={!friendEmail || sendRequestMutation.isPending}
                  className="px-4 py-2 rounded-lg bg-purple-600 text-white
                           hover:bg-purple-700 disabled:opacity-50 transition-colors"
                >
                  Send
                </button>
              </form>
              {sendRequestMutation.error && (
                <p className="text-sm text-red-400 mb-2">
                  {(sendRequestMutation.error as Error).message}
                </p>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tabs */}
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('friends')}
            className={`flex-1 py-2 rounded-lg text-sm transition-colors ${
              activeTab === 'friends'
                ? 'bg-white/10 text-white'
                : 'text-white/50 hover:text-white/70'
            }`}
          >
            Friends ({friends.length})
          </button>
          <button
            onClick={() => setActiveTab('requests')}
            className={`flex-1 py-2 rounded-lg text-sm transition-colors relative ${
              activeTab === 'requests'
                ? 'bg-white/10 text-white'
                : 'text-white/50 hover:text-white/70'
            }`}
          >
            Requests ({requests.length})
            {incomingRequests.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-xs flex items-center justify-center">
                {incomingRequests.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'friends' ? (
          loadingFriends ? (
            <div className="text-center text-white/50 py-8">Loading...</div>
          ) : friends.length === 0 ? (
            <div className="text-center py-8">
              <Users className="w-12 h-12 mx-auto text-white/20 mb-3" />
              <p className="text-white/50">No friends yet</p>
              <p className="text-sm text-white/30 mt-1">Send a friend request to get started</p>
            </div>
          ) : (
            <div className="space-y-2">
              {friends.map((friend) => (
                <FriendCard
                  key={friend.id}
                  friend={friend}
                  onChat={() => onStartChat(friend.id)}
                  onRemove={() => {
                    if (confirm('Remove this friend?')) {
                      removeMutation.mutate(friend.id);
                    }
                  }}
                />
              ))}
            </div>
          )
        ) : (
          <div className="space-y-4">
            {incomingRequests.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-white/50 mb-2">Incoming</h3>
                <div className="space-y-2">
                  {incomingRequests.map((req) => (
                    <RequestCard
                      key={req.id}
                      request={req}
                      onAccept={() => respondMutation.mutate({ requestId: req.id, accept: true })}
                      onDecline={() => respondMutation.mutate({ requestId: req.id, accept: false })}
                    />
                  ))}
                </div>
              </div>
            )}

            {outgoingRequests.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-white/50 mb-2">Pending</h3>
                <div className="space-y-2">
                  {outgoingRequests.map((req) => (
                    <RequestCard key={req.id} request={req} />
                  ))}
                </div>
              </div>
            )}

            {requests.length === 0 && (
              <div className="text-center py-8">
                <Clock className="w-12 h-12 mx-auto text-white/20 mb-3" />
                <p className="text-white/50">No pending requests</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

interface FriendCardProps {
  friend: Friend;
  onChat: () => void;
  onRemove: () => void;
}

function FriendCard({ friend, onChat, onRemove }: FriendCardProps) {
  const displayName = getDisplayName(friend);
  const zodiacEmoji = getZodiacEmoji(friend.zodiacSign);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3"
    >
      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-medium">
        {displayName.charAt(0).toUpperCase()}
      </div>

      <div className="flex-1 min-w-0">
        <p className="font-medium text-white truncate">
          {displayName} {zodiacEmoji}
        </p>
        <p className="text-xs text-white/40 truncate">{friend.email}</p>
      </div>

      <div className="flex gap-1">
        <button
          onClick={onChat}
          className="p-2 rounded-lg bg-purple-600/20 text-purple-400 hover:bg-purple-600/30 transition-colors"
          title="Send message"
        >
          <MessageCircle className="w-4 h-4" />
        </button>
        <button
          onClick={onRemove}
          className="p-2 rounded-lg bg-red-600/20 text-red-400 hover:bg-red-600/30 transition-colors"
          title="Remove friend"
        >
          <UserX className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}

interface RequestCardProps {
  request: PendingRequest;
  onAccept?: () => void;
  onDecline?: () => void;
}

function RequestCard({ request, onAccept, onDecline }: RequestCardProps) {
  const displayName = getDisplayName(request.user);
  const zodiacEmoji = getZodiacEmoji(request.user.zodiacSign);
  const isIncoming = request.type === 'incoming';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-3 rounded-xl bg-white/5 border border-white/10"
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-medium">
          {displayName.charAt(0).toUpperCase()}
        </div>

        <div className="flex-1 min-w-0">
          <p className="font-medium text-white truncate">
            {displayName} {zodiacEmoji}
          </p>
          <p className="text-xs text-white/40">
            {isIncoming ? 'Wants to be your friend' : 'Request pending'}
          </p>
        </div>

        {isIncoming && onAccept && onDecline && (
          <div className="flex gap-1">
            <button
              onClick={onAccept}
              className="p-2 rounded-lg bg-green-600/20 text-green-400 hover:bg-green-600/30 transition-colors"
            >
              <Check className="w-4 h-4" />
            </button>
            <button
              onClick={onDecline}
              className="p-2 rounded-lg bg-red-600/20 text-red-400 hover:bg-red-600/30 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {!isIncoming && (
          <Clock className="w-4 h-4 text-white/30" />
        )}
      </div>
    </motion.div>
  );
}
