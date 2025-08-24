import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Send, 
  Paperclip, 
  Smile, 
  MoreVertical,
  Phone,
  Video,
  Search
} from "lucide-react";
import { type Chat, type Message, type User } from "@/services/api";

interface ChatWindowProps {
  chat: Chat | null;
  messages: Message[];
  currentUser: User | null;
  onSendMessage: (content: string) => void;
}

export const ChatWindow = ({ chat, messages, currentUser, onSendMessage }: ChatWindowProps) => {
  const [newMessage, setNewMessage] = useState("");
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to bottom when new messages arrive
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() && chat) {
      onSendMessage(newMessage.trim());
      setNewMessage("");
    }
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    }).format(new Date(date));
  };

  const groupMessagesByDate = (messages: Message[]) => {
    const groups: { [key: string]: Message[] } = {};
    
    messages.forEach(message => {
      const date = new Date(message.timestamp).toDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(message);
    });
    
    return groups;
  };

  const formatDateHeader = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    
    if (dateString === today) return "Today";
    if (dateString === yesterday) return "Yesterday";
    return date.toLocaleDateString();
  };

  if (!chat) {
    return (
      <div className="flex-1 flex items-center justify-center bg-whatsapp-panel">
        <div className="text-center">
          <div className="w-64 h-64 mx-auto mb-8 opacity-20">
            <svg viewBox="0 0 303 172" className="w-full h-full">
              <defs>
                <linearGradient id="intro-phone" x1="50%" x2="50%" y1="0%" y2="100%">
                  <stop offset="0%" stopColor="#5edec9"></stop>
                  <stop offset="100%" stopColor="#07a884"></stop>
                </linearGradient>
              </defs>
              <path fill="url(#intro-phone)" d="M135.5 172h-50a8 8 0 01-8-8V8a8 8 0 018-8h50a8 8 0 018 8v156a8 8 0 01-8 8z"></path>
            </svg>
          </div>
          <h2 className="text-2xl font-light text-muted-foreground mb-4">
            WhatsApp Web Clone
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Send and receive messages without keeping your phone online. 
            Use WhatsApp on up to 4 linked devices and 1 phone at the same time.
          </p>
        </div>
      </div>
    );
  }

  const chatName = chat.isGroup ? chat.groupName : chat.participants[0]?.username;
  const chatAvatar = chat.isGroup ? chat.groupAvatar : chat.participants[0]?.avatar;
  const groupedMessages = groupMessagesByDate(messages);

  return (
    <div className="flex-1 flex flex-col bg-whatsapp-panel">
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 bg-whatsapp-panel border-b border-border">
        <div className="flex items-center space-x-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={chatAvatar} />
            <AvatarFallback className="bg-secondary text-secondary-foreground">
              {chatName?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className="font-medium text-foreground">{chatName}</h2>
            <p className="text-sm text-muted-foreground">
              {chat.isGroup 
                ? `${chat.participants.length} participants` 
                : chat.participants[0]?.status || 'offline'
              }
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <Video className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <Phone className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <Search className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-hidden bg-[#0a0e16] relative">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="w-full h-full" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M30 30c0-6.627-5.373-12-12-12s-12 5.373-12 12 5.373 12 12 12 12-5.373 12-12zm12 0c0-6.627-5.373-12-12-12s-12 5.373-12 12 5.373 12 12 12 12-5.373 12-12z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>
        
        <ScrollArea className="h-full p-4" ref={scrollAreaRef}>
          <div className="space-y-1">
            {Object.entries(groupedMessages).map(([dateString, dayMessages]) => (
              <div key={dateString}>
                {/* Date separator */}
                <div className="flex justify-center my-4">
                  <div className="bg-muted px-3 py-1 rounded-lg text-xs text-muted-foreground">
                    {formatDateHeader(dateString)}
                  </div>
                </div>
                
                {/* Messages for this date */}
                {dayMessages.map((message, index) => {
                  const isOwnMessage = message.senderId === currentUser?.id;
                  const showAvatar = !isOwnMessage && (
                    index === dayMessages.length - 1 || 
                    dayMessages[index + 1]?.senderId !== message.senderId
                  );
                  
                  return (
                    <div
                      key={message.id}
                      className={`flex mb-1 ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`flex max-w-xs lg:max-w-md ${isOwnMessage ? 'flex-row-reverse' : 'flex-row'}`}>
                        {!isOwnMessage && (
                          <div className="w-8 flex justify-center">
                            {showAvatar && (
                              <Avatar className="h-6 w-6">
                                <AvatarImage src={chat.participants.find(p => p.id === message.senderId)?.avatar} />
                                <AvatarFallback className="bg-secondary text-secondary-foreground text-xs">
                                  {chat.participants.find(p => p.id === message.senderId)?.username?.charAt(0).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                            )}
                          </div>
                        )}
                        
                        <div
                          className={`px-3 py-2 rounded-lg ${
                            isOwnMessage
                              ? 'bg-whatsapp-message-out text-white'
                              : 'bg-whatsapp-message-in text-foreground'
                          } ${!isOwnMessage ? 'ml-2' : 'mr-2'}`}
                        >
                          <p className="text-sm">{message.content}</p>
                          <div className={`flex items-center justify-end mt-1 space-x-1 ${
                            isOwnMessage ? 'text-green-100' : 'text-muted-foreground'
                          }`}>
                            <span className="text-xs">
                              {formatTime(message.timestamp)}
                            </span>
                            {isOwnMessage && (
                              <div className="text-xs">
                                {message.status === 'sent' && '✓'}
                                {message.status === 'delivered' && '✓✓'}
                                {message.status === 'read' && '✓✓'}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      </div>

      {/* Message Input */}
      <div className="p-4 bg-whatsapp-panel border-t border-border">
        <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" type="button" className="h-8 w-8 p-0">
            <Smile className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" type="button" className="h-8 w-8 p-0">
            <Paperclip className="h-4 w-4" />
          </Button>
          
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message"
            className="flex-1 bg-background border-border"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage(e);
              }
            }}
          />
          
          <Button 
            type="submit" 
            size="sm" 
            disabled={!newMessage.trim()}
            className="h-8 w-8 p-0 bg-whatsapp-green hover:bg-whatsapp-green/90"
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
};