import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Search, 
  MoreVertical, 
  MessageCircle, 
  Settings, 
  User,
  LogOut 
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { type Chat, type User as UserType } from "@/services/api";
import { useToast } from "@/hooks/use-toast";

interface ChatSidebarProps {
  chats: Chat[];
  selectedChat: Chat | null;
  onChatSelect: (chat: Chat) => void;
  currentUser: UserType | null;
}

export const ChatSidebar = ({ chats, selectedChat, onChatSelect, currentUser }: ChatSidebarProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  const filteredChats = chats.filter(chat => {
    const chatName = chat.isGroup ? chat.groupName : chat.participants[0]?.username;
    return chatName?.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    toast({
      title: "Logged out",
      description: "You have been logged out successfully.",
    });
    navigate('/');
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    }).format(new Date(date));
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const messageDate = new Date(date);
    const diffDays = Math.floor((now.getTime() - messageDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return formatTime(messageDate);
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else {
      return messageDate.toLocaleDateString();
    }
  };

  return (
    <div className="w-80 bg-whatsapp-sidebar border-r border-border flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-whatsapp-panel">
        <div className="flex items-center space-x-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={currentUser?.avatar} />
            <AvatarFallback className="bg-whatsapp-green text-white">
              {currentUser?.username?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span className="font-medium text-foreground">{currentUser?.username}</span>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={() => navigate('/profile')}>
              <User className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate('/settings')}>
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Search */}
      <div className="p-3 bg-whatsapp-panel">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search or start new chat"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-background border-border"
          />
        </div>
      </div>

      <Separator />

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        {filteredChats.map((chat) => {
          const isSelected = selectedChat?.id === chat.id;
          const chatName = chat.isGroup ? chat.groupName : chat.participants[0]?.username;
          const chatAvatar = chat.isGroup ? chat.groupAvatar : chat.participants[0]?.avatar;
          
          return (
            <div
              key={chat.id}
              onClick={() => onChatSelect(chat)}
              className={`flex items-center p-3 cursor-pointer transition-colors ${
                isSelected 
                  ? 'bg-whatsapp-selected border-r-2 border-whatsapp-green' 
                  : 'hover:bg-whatsapp-hover'
              }`}
            >
              <Avatar className="h-12 w-12 mr-3">
                <AvatarImage src={chatAvatar} />
                <AvatarFallback className="bg-secondary text-secondary-foreground">
                  {chatName?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-medium text-foreground truncate">
                    {chatName}
                  </h3>
                  <span className="text-xs text-muted-foreground">
                    {chat.lastMessage && formatDate(chat.lastMessage.timestamp)}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground truncate">
                    {chat.lastMessage?.content || 'No messages yet'}
                  </p>
                  {chat.unreadCount > 0 && (
                    <Badge className="bg-whatsapp-green text-white text-xs px-2 py-1 rounded-full min-w-[20px] h-5">
                      {chat.unreadCount}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        
        {filteredChats.length === 0 && (
          <div className="flex flex-col items-center justify-center h-64 text-center p-4">
            <MessageCircle className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No chats found</h3>
            <p className="text-sm text-muted-foreground">
              {searchQuery ? 'Try a different search term' : 'Start a new conversation'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};