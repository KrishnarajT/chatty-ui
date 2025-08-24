import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChatSidebar } from "@/components/chat/ChatSidebar";
import { ChatWindow } from "@/components/chat/ChatWindow";
import { chatAPI, wsService, type Chat, type Message, type User } from "@/services/api";
import { useToast } from "@/hooks/use-toast";

const ChatPage = () => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('auth_token');
    const userData = localStorage.getItem('user');
    
    if (!token || !userData) {
      navigate('/');
      return;
    }

    setCurrentUser(JSON.parse(userData));
    loadChats();
    
    // Connect to WebSocket for real-time updates
    wsService.connect();
    wsService.addListener(handleWebSocketMessage);

    return () => {
      wsService.removeListener(handleWebSocketMessage);
    };
  }, [navigate]);

  const loadChats = async () => {
    try {
      const chatsData = await chatAPI.getChats();
      setChats(chatsData);
    } catch (error) {
      toast({
        title: "Failed to load chats",
        description: "Using offline mode. Some features may be limited.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChatSelect = async (chat: Chat) => {
    setSelectedChat(chat);
    try {
      const messagesData = await chatAPI.getMessages(chat.id);
      setMessages(messagesData);
    } catch (error) {
      toast({
        title: "Failed to load messages",
        description: "Some messages may not be available.",
        variant: "destructive",
      });
    }
  };

  const handleSendMessage = async (content: string) => {
    if (!selectedChat || !currentUser) return;

    try {
      const newMessage = await chatAPI.sendMessage(selectedChat.id, content);
      setMessages(prev => [...prev, newMessage]);
      
      // Update chat's last message
      setChats(prev => prev.map(chat => 
        chat.id === selectedChat.id 
          ? { ...chat, lastMessage: newMessage }
          : chat
      ));
    } catch (error) {
      toast({
        title: "Failed to send message",
        description: "Message could not be delivered. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleWebSocketMessage = (data: any) => {
    // Handle real-time message updates
    if (data.type === 'new_message') {
      const message: Message = data.message;
      
      // Add message to current chat if it's selected
      if (selectedChat && message.chatId === selectedChat.id) {
        setMessages(prev => [...prev, message]);
      }
      
      // Update chat list
      setChats(prev => prev.map(chat => 
        chat.id === message.chatId 
          ? { ...chat, lastMessage: message, unreadCount: chat.unreadCount + 1 }
          : chat
      ));
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-whatsapp-green mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading chats...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex bg-background">
      <ChatSidebar 
        chats={chats}
        selectedChat={selectedChat}
        onChatSelect={handleChatSelect}
        currentUser={currentUser}
      />
      <ChatWindow 
        chat={selectedChat}
        messages={messages}
        currentUser={currentUser}
        onSendMessage={handleSendMessage}
      />
    </div>
  );
};

export default ChatPage;