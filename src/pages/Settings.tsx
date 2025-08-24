import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Bell, Lock, Palette, Download, Info } from "lucide-react";

const Settings = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [desktopNotifications, setDesktopNotifications] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center mb-6">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate('/chat')}
            className="mr-4"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">Settings</h1>
        </div>

        <div className="space-y-6">
          {/* Notifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="mr-2 h-5 w-5" />
                Notifications
              </CardTitle>
              <CardDescription>
                Manage your notification preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="notifications" className="flex flex-col space-y-1">
                  <span>Push Notifications</span>
                  <span className="text-sm text-muted-foreground">
                    Receive notifications for new messages
                  </span>
                </Label>
                <Switch
                  id="notifications"
                  checked={notifications}
                  onCheckedChange={setNotifications}
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <Label htmlFor="sound" className="flex flex-col space-y-1">
                  <span>Sound</span>
                  <span className="text-sm text-muted-foreground">
                    Play notification sounds
                  </span>
                </Label>
                <Switch
                  id="sound"
                  checked={soundEnabled}
                  onCheckedChange={setSoundEnabled}
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <Label htmlFor="desktop" className="flex flex-col space-y-1">
                  <span>Desktop Notifications</span>
                  <span className="text-sm text-muted-foreground">
                    Show notifications on desktop
                  </span>
                </Label>
                <Switch
                  id="desktop"
                  checked={desktopNotifications}
                  onCheckedChange={setDesktopNotifications}
                />
              </div>
            </CardContent>
          </Card>

          {/* Privacy & Security */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Lock className="mr-2 h-5 w-5" />
                Privacy & Security
              </CardTitle>
              <CardDescription>
                Control your privacy and security settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="outline" className="w-full justify-start">
                Last Seen
              </Button>
              <Button variant="outline" className="w-full justify-start">
                Profile Photo
              </Button>
              <Button variant="outline" className="w-full justify-start">
                Status
              </Button>
              <Button variant="outline" className="w-full justify-start">
                Blocked Contacts
              </Button>
            </CardContent>
          </Card>

          {/* Appearance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Palette className="mr-2 h-5 w-5" />
                Appearance
              </CardTitle>
              <CardDescription>
                Customize the look and feel
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="outline" className="w-full justify-start">
                Theme (Dark Mode)
              </Button>
              <Button variant="outline" className="w-full justify-start">
                Chat Wallpaper
              </Button>
              <Button variant="outline" className="w-full justify-start">
                Font Size
              </Button>
            </CardContent>
          </Card>

          {/* Storage */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Download className="mr-2 h-5 w-5" />
                Storage and Data
              </CardTitle>
              <CardDescription>
                Manage storage and data usage
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="outline" className="w-full justify-start">
                Manage Storage
              </Button>
              <Button variant="outline" className="w-full justify-start">
                Network Usage
              </Button>
              <Button variant="outline" className="w-full justify-start">
                Auto-Download Media
              </Button>
            </CardContent>
          </Card>

          {/* About */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Info className="mr-2 h-5 w-5" />
                About
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm text-muted-foreground">
                <p>WhatsApp Web Clone v1.0.0</p>
                <p>Built with React, TypeScript, and Tailwind CSS</p>
                <p className="mt-2">© 2025 Your Private Messaging App</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Settings;