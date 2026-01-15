import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';
import { setCache, getCache } from '../config/redis';
import { wsLogger } from '../logger';

// WebSocket event types
export const WS_EVENTS = {
  // Connection
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  ERROR: 'error',

  // Rooms
  JOIN_ROOM: 'join:room',
  LEAVE_ROOM: 'leave:room',

  // Notifications
  NOTIFICATION_NEW: 'notification:new',
  NOTIFICATION_READ: 'notification:read',

  // Chat/DM
  CHAT_MESSAGE: 'chat:message',
  CHAT_MESSAGE_NEW: 'chat:message:new',
  CHAT_TYPING: 'chat:typing',
  CHAT_TYPING_STATUS: 'chat:typing:status',
  CHAT_READ: 'chat:read',

  // Presence
  PRESENCE_UPDATE: 'presence:update',
  PRESENCE_STATUS: 'presence:status',

  // Gamification
  ACHIEVEMENT_EARNED: 'achievement:earned',
  XP_GAINED: 'xp:gained',
  LEVEL_UP: 'level:up',
  STREAK_MILESTONE: 'streak:milestone',
  LEADERBOARD_UPDATE: 'leaderboard:update',

  // Challenges
  CHALLENGE_UPDATE: 'challenge:update',
  CHALLENGE_COMPLETED: 'challenge:completed',

  // Friends
  FRIEND_REQUEST: 'friend:request',
  FRIEND_ACCEPTED: 'friend:accepted',
  FRIEND_ONLINE: 'friend:online',
  FRIEND_OFFLINE: 'friend:offline',
};

// User presence data structure
interface UserPresence {
  status: 'online' | 'away' | 'offline';
  lastSeen: string;
  socketId: string;
}

// Socket with user data
interface AuthenticatedSocket extends Socket {
  userId?: number;
  username?: string;
}

let io: Server;

// Initialize Socket.IO server
export function initializeWebSocket(httpServer: HttpServer): Server {
  io = new Server(httpServer, {
    cors: {
      origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:5000'],
      credentials: true,
    },
    transports: ['websocket', 'polling'],
    pingTimeout: 60000,
    pingInterval: 25000,
  });

  // Note: Redis adapter disabled for simplicity
  // For horizontal scaling, enable Redis adapter when Redis is properly configured
  wsLogger.info('Socket.IO running without Redis adapter (single-instance mode)');

  // Authentication middleware
  io.use(async (socket: AuthenticatedSocket, next) => {
    try {
      // Get user ID from handshake auth or query
      const userId = socket.handshake.auth?.userId || socket.handshake.query?.userId;

      if (!userId) {
        return next(new Error('Authentication required'));
      }

      socket.userId = parseInt(userId as string);
      socket.username = socket.handshake.auth?.username || socket.handshake.query?.username;

      wsLogger.debug(`Socket authenticated: userId=${socket.userId}`);
      next();
    } catch (error) {
      wsLogger.error({ err: error }, 'Socket authentication error');
      next(new Error('Authentication failed'));
    }
  });

  // Connection handler
  io.on('connection', async (socket: AuthenticatedSocket) => {
    const userId = socket.userId;

    if (!userId) {
      socket.disconnect();
      return;
    }

    wsLogger.info(`User connected: ${userId} (socket: ${socket.id})`);

    // Join user's personal room
    socket.join(`user:${userId}`);

    // Update presence
    await updatePresence(userId, {
      status: 'online',
      lastSeen: new Date().toISOString(),
      socketId: socket.id,
    });

    // Notify friends that user is online
    emitToFriends(userId, WS_EVENTS.FRIEND_ONLINE, { userId });

    // Handle room joins
    socket.on(WS_EVENTS.JOIN_ROOM, (room: string) => {
      socket.join(room);
      wsLogger.debug(`User ${userId} joined room: ${room}`);
    });

    // Handle room leaves
    socket.on(WS_EVENTS.LEAVE_ROOM, (room: string) => {
      socket.leave(room);
      wsLogger.debug(`User ${userId} left room: ${room}`);
    });

    // Handle typing indicators
    socket.on(WS_EVENTS.CHAT_TYPING, (data: { conversationId: string; isTyping: boolean }) => {
      socket.to(`dm:${data.conversationId}`).emit(WS_EVENTS.CHAT_TYPING_STATUS, {
        userId,
        isTyping: data.isTyping,
      });
    });

    // Handle presence updates
    socket.on(WS_EVENTS.PRESENCE_UPDATE, async (status: 'online' | 'away') => {
      await updatePresence(userId, {
        status,
        lastSeen: new Date().toISOString(),
        socketId: socket.id,
      });

      emitToFriends(userId, WS_EVENTS.PRESENCE_STATUS, { userId, status });
    });

    // Handle disconnect
    socket.on('disconnect', async (reason) => {
      wsLogger.info(`User disconnected: ${userId} (reason: ${reason})`);

      // Update presence to offline
      await updatePresence(userId, {
        status: 'offline',
        lastSeen: new Date().toISOString(),
        socketId: '',
      });

      // Notify friends that user is offline
      emitToFriends(userId, WS_EVENTS.FRIEND_OFFLINE, { userId });
    });

    // Handle errors
    socket.on('error', (error) => {
      wsLogger.error({ err: error }, `Socket error for user ${userId}`);
    });
  });

  wsLogger.info('WebSocket server initialized');
  return io;
}

// Get Socket.IO server instance
export function getIO(): Server {
  if (!io) {
    throw new Error('Socket.IO not initialized');
  }
  return io;
}

// Update user presence in Redis
async function updatePresence(userId: number, presence: UserPresence): Promise<void> {
  try {
    await setCache(`presence:${userId}`, presence, 300); // 5 minute TTL
  } catch (error) {
    wsLogger.error({ err: error }, 'Failed to update presence');
  }
}

// Get user presence from Redis
export async function getPresence(userId: number): Promise<UserPresence | null> {
  try {
    return await getCache<UserPresence>(`presence:${userId}`);
  } catch (error) {
    wsLogger.error({ err: error }, 'Failed to get presence');
    return null;
  }
}

// Emit event to a specific user
export function emitToUser(userId: number, event: string, data: unknown): void {
  if (io) {
    io.to(`user:${userId}`).emit(event, data);
  }
}

// Emit event to multiple users
export function emitToUsers(userIds: number[], event: string, data: unknown): void {
  if (io) {
    userIds.forEach((userId) => {
      io.to(`user:${userId}`).emit(event, data);
    });
  }
}

// Emit event to a room
export function emitToRoom(room: string, event: string, data: unknown): void {
  if (io) {
    io.to(room).emit(event, data);
  }
}

// Emit event to user's friends (placeholder - needs friend list from DB)
async function emitToFriends(userId: number, event: string, data: unknown): Promise<void> {
  // TODO: Get friend list from database and emit to each friend
  // For now, this is a placeholder
  wsLogger.debug(`Would emit ${event} to friends of user ${userId}`);
}

// Notification helpers
export function sendNotification(userId: number, notification: {
  type: string;
  title: string;
  body: string;
  data?: unknown;
}): void {
  emitToUser(userId, WS_EVENTS.NOTIFICATION_NEW, notification);
}

// Achievement notification
export function sendAchievementNotification(userId: number, achievement: {
  id: number;
  name: string;
  description: string;
  icon: string;
  xpReward: number;
}): void {
  emitToUser(userId, WS_EVENTS.ACHIEVEMENT_EARNED, achievement);
}

// XP gained notification
export function sendXPNotification(userId: number, data: {
  amount: number;
  reason: string;
  newTotal: number;
}): void {
  emitToUser(userId, WS_EVENTS.XP_GAINED, data);
}

// Level up notification
export function sendLevelUpNotification(userId: number, data: {
  newLevel: number;
  rewards?: unknown[];
}): void {
  emitToUser(userId, WS_EVENTS.LEVEL_UP, data);
}

// DM message notification
export function sendDMNotification(userId: number, message: {
  conversationId: string;
  senderId: number;
  senderName: string;
  content: string;
  createdAt: string;
}): void {
  emitToUser(userId, WS_EVENTS.CHAT_MESSAGE_NEW, message);
}

// Friend request notification
export function sendFriendRequestNotification(userId: number, data: {
  requesterId: number;
  requesterName: string;
  requesterAvatar?: string;
}): void {
  emitToUser(userId, WS_EVENTS.FRIEND_REQUEST, data);
}

export default initializeWebSocket;
