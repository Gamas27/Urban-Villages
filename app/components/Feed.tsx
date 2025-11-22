import { useState } from 'react';
import { Card, CardContent } from './ui/card';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Heart, MessageCircle, Share2, Plus, Image as ImageIcon, Sparkles } from 'lucide-react';
import { PostComposer } from './PostComposer';

interface FeedProps {
  user: {
    username: string;
    village: string;
    profilePic: string;
  };
  currentVillage: string;
}

const DEMO_POSTS = [
  {
    id: '1',
    user: { username: 'maria', village: 'lisbon', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=maria' },
    type: 'purchase',
    content: 'Just acquired Bottle #47 from our 2023 Orange Wine collection! 🍷',
    image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800&q=80',
    timestamp: '2 hours ago',
    likes: 12,
    comments: 3,
    reward: 100,
  },
  {
    id: '2',
    user: { username: 'pedro', village: 'porto', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=pedro' },
    type: 'post',
    content: 'Tasting notes from last night: hints of apricot, wild flowers, and minerality. Absolutely stunning! 🌸',
    image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=800&q=80',
    timestamp: '5 hours ago',
    likes: 8,
    comments: 5,
    reward: 10,
  },
  {
    id: '3',
    user: { username: 'anna', village: 'berlin', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=anna' },
    type: 'join',
    content: 'Just joined Berlin Village! Excited to be part of this community 🎉',
    timestamp: '1 day ago',
    likes: 15,
    comments: 7,
    reward: 100,
  },
  {
    id: '4',
    user: { username: 'joao', village: 'lisbon', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=joao' },
    type: 'post',
    content: 'Visiting the vineyard today - harvest season is here! 🍇',
    image: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=800&q=80',
    timestamp: '1 day ago',
    likes: 23,
    comments: 9,
    reward: 10,
  },
  {
    id: '5',
    user: { username: 'sofia', village: 'porto', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sofia' },
    type: 'purchase',
    content: 'Picked up Bottle #12 - Port Wine Reserve. Can\'t wait to open it! 🍷',
    image: 'https://images.unsplash.com/photo-1584916201218-f4242ceb4809?w=800&q=80',
    timestamp: '2 days ago',
    likes: 11,
    comments: 4,
    reward: 100,
  },
];

export function Feed({ user, currentVillage }: FeedProps) {
  const [feedTab, setFeedTab] = useState('village');
  const [showComposer, setShowComposer] = useState(false);
  const [following, setFollowing] = useState(['pedro', 'anna']);

  const filteredPosts = DEMO_POSTS.filter((post) => {
    if (feedTab === 'village') return post.user.village === currentVillage;
    if (feedTab === 'following') return following.includes(post.user.username);
    return true;
  });

  const isFollowing = (username: string) => following.includes(username);
  const toggleFollow = (username: string) => {
    setFollowing((prev) =>
      prev.includes(username) ? prev.filter((u) => u !== username) : [...prev, username]
    );
  };

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      {/* Feed Tabs */}
      <Card>
        <CardContent className="p-4">
          <Tabs value={feedTab} onValueChange={setFeedTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="village">My Village</TabsTrigger>
              <TabsTrigger value="following">Following</TabsTrigger>
              <TabsTrigger value="all">All Villages</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardContent>
      </Card>

      {/* Post Composer Button */}
      <Button
        onClick={() => setShowComposer(!showComposer)}
        className="w-full gap-2"
        size="lg"
      >
        <Plus className="w-4 h-4" />
        Create Post
      </Button>

      {/* Post Composer */}
      {showComposer && (
        <PostComposer
          user={user}
          onClose={() => setShowComposer(false)}
        />
      )}

      {/* Posts */}
      <div className="space-y-4">
        {filteredPosts.map((post) => (
          <Card key={post.id} className="overflow-hidden">
            <CardContent className="p-4 space-y-3">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={post.user.avatar} />
                    <AvatarFallback>{post.user.username[0].toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">@{post.user.username}.{post.user.village}</span>
                      <Badge variant="outline" className="text-xs">
                        {post.user.village}
                      </Badge>
                    </div>
                    <span className="text-sm opacity-60">{post.timestamp}</span>
                  </div>
                </div>
                {post.user.username !== user.username && (
                  <Button
                    variant={isFollowing(post.user.username) ? 'outline' : 'default'}
                    size="sm"
                    onClick={() => toggleFollow(post.user.username)}
                  >
                    {isFollowing(post.user.username) ? 'Following' : 'Follow'}
                  </Button>
                )}
              </div>

              {/* Content */}
              <p>{post.content}</p>

              {/* Image */}
              {post.image && (
                <div className="relative rounded-lg overflow-hidden bg-gray-100">
                  <img
                    src={post.image}
                    alt="Post image"
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute top-2 right-2 bg-purple-600 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                    <ImageIcon className="w-3 h-3" />
                    Walrus
                  </div>
                </div>
              )}

              {/* Reward Badge */}
              {post.reward && (
                <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 w-fit">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span className="text-sm font-semibold">Earned {post.reward} CORK</span>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center gap-4 pt-2 border-t">
                <Button variant="ghost" size="sm" className="gap-2">
                  <Heart className="w-4 h-4" />
                  {post.likes}
                </Button>
                <Button variant="ghost" size="sm" className="gap-2">
                  <MessageCircle className="w-4 h-4" />
                  {post.comments}
                </Button>
                <Button variant="ghost" size="sm" className="gap-2">
                  <Share2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredPosts.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <p className="opacity-60">No posts yet in this view</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
