import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { Home, ShoppingBag, Users, Coins, User, Share2, MapPin } from 'lucide-react';
import { Feed } from './Feed';
import { Shop } from './Shop';
import { Profile } from './Profile';
import { InviteModal } from './InviteModal';

interface MainAppProps {
  user: {
    username: string;
    village: string;
    profilePic: string;
    corkBalance: number;
  };
}

const VILLAGES = [
  { id: 'lisbon', name: 'Lisbon', color: 'bg-amber-500' },
  { id: 'porto', name: 'Porto', color: 'bg-rose-600' },
  { id: 'berlin', name: 'Berlin', color: 'bg-yellow-500' },
];

export function MainApp({ user }: MainAppProps) {
  const [currentTab, setCurrentTab] = useState('feed');
  const [currentVillage, setCurrentVillage] = useState(user.village);
  const [showInviteModal, setShowInviteModal] = useState(false);

  const villageData = VILLAGES.find((v) => v.id === currentVillage);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo & Village */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-rose-600 rounded-full flex items-center justify-center">
                  <span className="text-xl">🍷</span>
                </div>
                <div>
                  <h1 className="font-semibold">Cork Collective</h1>
                  <div className="flex items-center gap-1 text-xs opacity-60">
                    <MapPin className="w-3 h-3" />
                    <select
                      value={currentVillage}
                      onChange={(e) => setCurrentVillage(e.target.value)}
                      className="bg-transparent border-none outline-none cursor-pointer"
                    >
                      {VILLAGES.map((v) => (
                        <option key={v.id} value={v.id}>
                          {v.name} Village
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* User Info */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-amber-50 px-3 py-1.5 rounded-full">
                <Coins className="w-4 h-4 text-amber-600" />
                <span className="font-semibold">{user.corkBalance}</span>
                <span className="text-sm opacity-60">CORK</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={() => setShowInviteModal(true)}
              >
                <Share2 className="w-4 h-4" />
                Invite
              </Button>
              <Avatar className="w-9 h-9 cursor-pointer border-2" onClick={() => setCurrentTab('profile')}>
                <AvatarImage src={user.profilePic} />
                <AvatarFallback>{user.username[0].toUpperCase()}</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        <Tabs value={currentTab} onValueChange={setCurrentTab}>
          <TabsList className="mb-6 grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
            <TabsTrigger value="feed" className="gap-2">
              <Home className="w-4 h-4" />
              Feed
            </TabsTrigger>
            <TabsTrigger value="shop" className="gap-2">
              <ShoppingBag className="w-4 h-4" />
              Shop
            </TabsTrigger>
            <TabsTrigger value="community" className="gap-2">
              <Users className="w-4 h-4" />
              Community
            </TabsTrigger>
            <TabsTrigger value="profile" className="gap-2">
              <User className="w-4 h-4" />
              Profile
            </TabsTrigger>
          </TabsList>

          <TabsContent value="feed" className="mt-0">
            <Feed user={user} currentVillage={currentVillage} />
          </TabsContent>

          <TabsContent value="shop" className="mt-0">
            <Shop village={currentVillage} />
          </TabsContent>

          <TabsContent value="community" className="mt-0">
            <div className="text-center py-12">
              <Users className="w-12 h-12 mx-auto mb-4 opacity-40" />
              <p className="opacity-60">Community features coming soon</p>
            </div>
          </TabsContent>

          <TabsContent value="profile" className="mt-0">
            <Profile user={user} />
          </TabsContent>
        </Tabs>
      </div>

      {/* Invite Modal */}
      <InviteModal
        isOpen={showInviteModal}
        onClose={() => setShowInviteModal(false)}
        user={user}
      />
    </div>
  );
}
