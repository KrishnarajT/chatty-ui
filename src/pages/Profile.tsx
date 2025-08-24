import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Camera, Edit2, Save, X } from "lucide-react";
import { userAPI, type User } from "@/services/api";
import { useToast } from "@/hooks/use-toast";

const Profile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    username: "",
    email: "",
    status: "online" as User['status']
  });

  useEffect(() => {
    // Load user data from localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      setEditForm({
        username: parsedUser.username,
        email: parsedUser.email,
        status: parsedUser.status
      });
    }
  }, []);

  const handleSaveProfile = async () => {
    try {
      const updatedUser = await userAPI.updateProfile(editForm);
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setIsEditing(false);
      
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Update failed",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleStatusChange = async (newStatus: User['status']) => {
    try {
      await userAPI.updateStatus(newStatus);
      const updatedUser = { ...user!, status: newStatus };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      toast({
        title: "Status updated",
        description: `Status changed to ${newStatus}.`,
      });
    } catch (error) {
      toast({
        title: "Status update failed",
        description: "Failed to update status. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-whatsapp-green mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate('/chat')}
              className="mr-4"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-2xl font-bold">Profile</h1>
          </div>
          
          {!isEditing ? (
            <Button onClick={() => setIsEditing(true)} variant="outline" size="sm">
              <Edit2 className="h-4 w-4 mr-2" />
              Edit
            </Button>
          ) : (
            <div className="flex space-x-2">
              <Button onClick={handleSaveProfile} size="sm" className="bg-whatsapp-green hover:bg-whatsapp-green/90">
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
              <Button onClick={() => setIsEditing(false)} variant="outline" size="sm">
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </div>
          )}
        </div>

        <div className="space-y-6">
          {/* Profile Picture & Basic Info */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center space-y-4">
                <div className="relative">
                  <Avatar className="h-32 w-32">
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback className="bg-whatsapp-green text-white text-4xl">
                      {user.username.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  {isEditing && (
                    <Button 
                      size="sm" 
                      className="absolute bottom-0 right-0 rounded-full h-10 w-10 p-0 bg-whatsapp-green hover:bg-whatsapp-green/90"
                    >
                      <Camera className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                
                <div className="text-center space-y-2">
                  {isEditing ? (
                    <Input
                      value={editForm.username}
                      onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
                      className="text-center font-medium text-lg"
                      placeholder="Username"
                    />
                  ) : (
                    <h2 className="text-2xl font-bold">{user.username}</h2>
                  )}
                  
                  <div className="flex items-center justify-center space-x-2">
                    <Badge 
                      variant={user.status === 'online' ? 'default' : 'secondary'}
                      className={user.status === 'online' ? 'bg-whatsapp-green' : ''}
                    >
                      {user.status}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
              <CardDescription>
                Your contact details and account information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Email</label>
                {isEditing ? (
                  <Input
                    type="email"
                    value={editForm.email}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    className="mt-1"
                  />
                ) : (
                  <p className="mt-1">{user.email}</p>
                )}
              </div>
              
              <div>
                <label className="text-sm font-medium text-muted-foreground">User ID</label>
                <p className="mt-1 text-xs font-mono bg-muted p-2 rounded">{user.id}</p>
              </div>
            </CardContent>
          </Card>

          {/* Status */}
          <Card>
            <CardHeader>
              <CardTitle>Status</CardTitle>
              <CardDescription>
                Set your availability status
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-2">
                {(['online', 'away', 'offline'] as const).map((status) => (
                  <Button
                    key={status}
                    variant={user.status === status ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleStatusChange(status)}
                    className={user.status === status ? "bg-whatsapp-green hover:bg-whatsapp-green/90" : ""}
                  >
                    <div className={`w-2 h-2 rounded-full mr-2 ${
                      status === 'online' ? 'bg-green-500' :
                      status === 'away' ? 'bg-yellow-500' : 'bg-gray-500'
                    }`} />
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </Button>
                ))}
              </div>
              
              {user.lastSeen && user.status !== 'online' && (
                <p className="text-sm text-muted-foreground">
                  Last seen: {new Date(user.lastSeen).toLocaleString()}
                </p>
              )}
            </CardContent>
          </Card>

          {/* About */}
          <Card>
            <CardHeader>
              <CardTitle>About</CardTitle>
              <CardDescription>
                Tell others about yourself
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <Textarea
                  placeholder="Write something about yourself..."
                  className="min-h-[100px]"
                  defaultValue="Hey there! I am using WhatsApp."
                />
              ) : (
                <p className="text-muted-foreground">
                  Hey there! I am using WhatsApp.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;