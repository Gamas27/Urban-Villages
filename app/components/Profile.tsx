import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Coins, Image as ImageIcon, Users, QrCode, ExternalLink } from 'lucide-react';

interface ProfileProps {
  user: {
    username: string;
    village: string;
    profilePic: string;
    corkBalance: number;
  };
}

const DEMO_NFTS = [
  {
    id: '1',
    name: 'Orange Wine 2023',
    bottle: 47,
    image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&q=80',
    acquired: '2 days ago',
  },
];

export function Profile({ user }: ProfileProps) {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Profile Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start gap-6">
            <Avatar className="w-24 h-24 border-4">
              <AvatarImage src={user.profilePic} />
              <AvatarFallback>{user.username[0].toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-2xl font-semibold">@{user.username}.{user.village}</h2>
                <Badge variant="outline">{user.village}</Badge>
              </div>
              <div className="flex items-center gap-2 text-sm opacity-60 mb-4">
                <ImageIcon className="w-4 h-4" />
                <span>Profile stored on Walrus</span>
              </div>
              <div className="flex items-center gap-4">
                <div>
                  <p className="text-2xl font-semibold">{user.corkBalance}</p>
                  <p className="text-sm opacity-60">CORK</p>
                </div>
                <div className="h-8 w-px bg-gray-200" />
                <div>
                  <p className="text-2xl font-semibold">1</p>
                  <p className="text-sm opacity-60">NFTs Owned</p>
                </div>
                <div className="h-8 w-px bg-gray-200" />
                <div>
                  <p className="text-2xl font-semibold">5</p>
                  <p className="text-sm opacity-60">Friends Invited</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Content Tabs */}
      <Tabs defaultValue="nfts">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="nfts">My NFTs</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="rewards">Rewards</TabsTrigger>
        </TabsList>

        <TabsContent value="nfts" className="space-y-4">
          <div className="grid gap-4">
            {DEMO_NFTS.map((nft) => (
              <Card key={nft.id}>
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    <img
                      src={nft.image}
                      alt={nft.name}
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold mb-1">{nft.name}</h4>
                      <p className="text-sm opacity-70 mb-2">Bottle #{nft.bottle}</p>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          SUI NFT
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          Walrus Images
                        </Badge>
                      </div>
                      <p className="text-xs opacity-60 mt-2">Acquired {nft.acquired}</p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Button size="sm" variant="outline" className="gap-2">
                        <QrCode className="w-4 h-4" />
                        QR
                      </Button>
                      <Button size="sm" variant="outline" className="gap-2">
                        <ExternalLink className="w-4 h-4" />
                        View
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="activity">
          <Card>
            <CardContent className="p-8 text-center opacity-60">
              <p>Activity history coming soon</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rewards">
          <div className="space-y-4">
            <Card className="bg-gradient-to-br from-amber-50 to-orange-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Coins className="w-5 h-5 text-amber-600" />
                  CORK Rewards Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="opacity-70">Welcome Bonus</span>
                  <span className="font-semibold">+100 CORK</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="opacity-70">Bottle Purchase</span>
                  <span className="font-semibold">+100 CORK</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="opacity-70">Referral Rewards (5)</span>
                  <span className="font-semibold">+250 CORK</span>
                </div>
                <div className="border-t pt-3 flex items-center justify-between">
                  <span className="font-semibold">Total Balance</span>
                  <span className="text-xl font-semibold text-amber-600">{user.corkBalance} CORK</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Referral Program
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm opacity-70 mb-3">
                  You've invited 5 friends and earned 250 CORK!
                </p>
                <Button className="w-full">
                  Invite More Friends
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
