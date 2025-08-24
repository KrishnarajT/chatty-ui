import { useToast } from "@/hooks/use-toast";

// Types for our API responses
export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  status: 'online' | 'offline' | 'away';
  lastSeen?: Date;
}

export interface Chat {
  id: string;
  participants: User[];
  lastMessage?: Message;
  unreadCount: number;
  isGroup: boolean;
  groupName?: string;
  groupAvatar?: string;
  createdAt: Date;
}

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  content: string;
  timestamp: Date;
  type: 'text' | 'image' | 'file';
  status: 'sent' | 'delivered' | 'read';
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
}

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
const WEBSOCKET_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:3001';

// Helper function for API calls with error handling
async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {},
  fallbackData?: T
): Promise<T> {
  try {
    const token = localStorage.getItem('auth_token');
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`API call failed for ${endpoint}:`, error);
    
    // Return fallback data if available, otherwise throw
    if (fallbackData !== undefined) {
      return fallbackData;
    }
    throw error;
  }
}

// Authentication APIs
export const authAPI = {
  // POST /auth/login
  // Expected response: { user: User, token: string }
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const fallbackResponse: LoginResponse = {
      user: {
        id: "user_123",
        username: "demo_user",
        email: credentials.email,
        avatar: "/lovable-uploads/be29105b-ee47-4cf7-a3c4-a08555d7ab72.png",
        status: "online"
      },
      token: "demo_token_123456789"
    };

    return apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }, fallbackResponse);
  },

  // POST /auth/logout
  // Expected response: { success: boolean }
  async logout(): Promise<{ success: boolean }> {
    const fallbackResponse = { success: true };
    
    return apiCall('/auth/logout', {
      method: 'POST',
    }, fallbackResponse);
  },

  // GET /auth/me
  // Expected response: User
  async getCurrentUser(): Promise<User> {
    const fallbackUser: User = {
      id: "user_123",
      username: "demo_user",
      email: "demo@example.com",
      avatar: "/lovable-uploads/be29105b-ee47-4cf7-a3c4-a08555d7ab72.png",
      status: "online"
    };

    return apiCall('/auth/me', {}, fallbackUser);
  }
};

// Chat APIs
export const chatAPI = {
  // GET /chats
  // Expected response: Chat[]
  async getChats(): Promise<Chat[]> {
    const fallbackChats: Chat[] = [
      {
        id: "chat_1",
        participants: [
          {
            id: "user_456",
            username: "Family",
            email: "family@example.com",
            status: "online"
          }
        ],
        lastMessage: {
          id: "msg_1",
          chatId: "chat_1",
          senderId: "user_456",
          content: "Image",
          timestamp: new Date("2025-08-20T14:30:00Z"),
          type: "image",
          status: "read"
        },
        unreadCount: 0,
        isGroup: true,
        groupName: "Family",
        createdAt: new Date("2025-08-20T14:30:00Z")
      },
      {
        id: "chat_2",
        participants: [
          {
            id: "user_789",
            username: "Aaron Philip",
            email: "aaron@example.com",
            status: "online"
          }
        ],
        lastMessage: {
          id: "msg_2",
          chatId: "chat_2",
          senderId: "user_789",
          content: "everything should work",
          timestamp: new Date("2025-08-24T13:00:00Z"),
          type: "text",
          status: "delivered"
        },
        unreadCount: 0,
        isGroup: false,
        createdAt: new Date("2025-08-24T13:00:00Z")
      },
      {
        id: "chat_3",
        participants: [
          {
            id: "user_101",
            username: "6th floor boys",
            email: "group@example.com",
            status: "away"
          }
        ],
        lastMessage: {
          id: "msg_3",
          chatId: "chat_3",
          senderId: "user_102",
          content: "🙂 to \"Sax sux\"",
          timestamp: new Date("2025-08-24T11:49:00Z"),
          type: "text",
          status: "read"
        },
        unreadCount: 2,
        isGroup: true,
        groupName: "6th floor boys",
        createdAt: new Date("2025-08-24T11:49:00Z")
      }
    ];

    return apiCall('/chats', {}, fallbackChats);
  },

  // GET /chats/:chatId/messages
  // Expected response: Message[]
  async getMessages(chatId: string): Promise<Message[]> {
    const fallbackMessages: Message[] = [
      {
        id: "msg_1",
        chatId: chatId,
        senderId: "user_456",
        content: "Hey! How are you doing?",
        timestamp: new Date("2025-08-24T10:00:00Z"),
        type: "text",
        status: "read"
      },
      {
        id: "msg_2",
        chatId: chatId,
        senderId: "user_123",
        content: "I'm doing great! Just working on some new projects.",
        timestamp: new Date("2025-08-24T10:05:00Z"),
        type: "text",
        status: "read"
      },
      {
        id: "msg_3",
        chatId: chatId,
        senderId: "user_456",
        content: "That sounds awesome! Would love to hear more about it.",
        timestamp: new Date("2025-08-24T10:10:00Z"),
        type: "text",
        status: "read"
      }
    ];

    return apiCall(`/chats/${chatId}/messages`, {}, fallbackMessages);
  },

  // POST /chats/:chatId/messages
  // Expected response: Message
  async sendMessage(chatId: string, content: string): Promise<Message> {
    const fallbackMessage: Message = {
      id: `msg_${Date.now()}`,
      chatId: chatId,
      senderId: "user_123",
      content: content,
      timestamp: new Date(),
      type: "text",
      status: "sent"
    };

    return apiCall(`/chats/${chatId}/messages`, {
      method: 'POST',
      body: JSON.stringify({ content, type: 'text' }),
    }, fallbackMessage);
  }
};

// User APIs
export const userAPI = {
  // PUT /users/profile
  // Expected response: User
  async updateProfile(updates: Partial<User>): Promise<User> {
    const fallbackUser: User = {
      id: "user_123",
      username: updates.username || "demo_user",
      email: updates.email || "demo@example.com",
      avatar: updates.avatar || "/lovable-uploads/be29105b-ee47-4cf7-a3c4-a08555d7ab72.png",
      status: updates.status || "online"
    };

    return apiCall('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(updates),
    }, fallbackUser);
  },

  // PUT /users/status
  // Expected response: { success: boolean }
  async updateStatus(status: User['status']): Promise<{ success: boolean }> {
    const fallbackResponse = { success: true };
    
    return apiCall('/users/status', {
      method: 'PUT',
      body: JSON.stringify({ status }),
    }, fallbackResponse);
  }
};

// WebSocket connection for real-time messaging
export class WebSocketService {
  private ws: WebSocket | null = null;
  private listeners: Set<(message: any) => void> = new Set();

  connect() {
    try {
      const token = localStorage.getItem('auth_token');
      this.ws = new WebSocket(`${WEBSOCKET_URL}?token=${token}`);

      this.ws.onopen = () => {
        console.log('WebSocket connected');
      };

      this.ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        this.listeners.forEach(listener => listener(data));
      };

      this.ws.onclose = () => {
        console.log('WebSocket disconnected');
        // Attempt to reconnect after 5 seconds
        setTimeout(() => this.connect(), 5000);
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };
    } catch (error) {
      console.error('Failed to connect WebSocket:', error);
      // Graceful fallback - app continues to work without real-time updates
    }
  }

  addListener(callback: (message: any) => void) {
    this.listeners.add(callback);
  }

  removeListener(callback: (message: any) => void) {
    this.listeners.delete(callback);
  }

  sendMessage(data: any) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
    } else {
      console.warn('WebSocket not connected, message not sent');
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}

export const wsService = new WebSocketService();