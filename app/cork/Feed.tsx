'use client';

import { useState } from 'react';
import { Heart, MessageCircle, Sparkles, Gift, Send, ShoppingBag, ArrowRight } from 'lucide-react';
import { MOCK_POSTS } from './data/mockData';
import { getVillageById } from './data/villages';

interface FeedProps {
  village: string;
}

type FeedTab = 'village' | 'following' | 'all';

export function Feed({ village }: FeedProps) {
  const [activeTab, setActiveTab] = useState<FeedTab>('village');

  const currentVillage = getVillageById(village);
  
  const filteredPosts = MOCK_POSTS.filter(post => {
    if (activeTab === 'village') return post.village === village;
    if (activeTab === 'following') return true; // TODO: filter by following
    return true; // all posts
  });

  const formatTimeAgo = (timestamp: number) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'gift-bottle':
        return <Gift className="w-5 h-5 text-purple-600" />;
      case 'send-tokens':
        return <Send className="w-5 h-5 text-green-600" />;
      case 'purchase':
        return <ShoppingBag className="w-5 h-5 text-orange-600" />;
      default:
        return null;
    }
  };

  const getActivityBadge = (type: string) => {
    switch (type) {
      case 'gift-bottle':
        return { bg: 'bg-purple-50', text: 'text-purple-700', label: '🎁 Gift' };
      case 'send-tokens':
        return { bg: 'bg-green-50', text: 'text-green-700', label: '✨ Transfer' };
      case 'purchase':
        return { bg: 'bg-orange-50', text: 'text-orange-700', label: '🛍️ Purchase' };
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen">
      {/* Feed Tabs */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-10">
        <div className="flex gap-1 p-2">
          <button
            onClick={() => setActiveTab('village')}
            className={`flex-1 py-2 px-4 rounded-lg text-sm transition-all ${
              activeTab === 'village'
                ? 'bg-purple-100 text-purple-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Your Village
          </button>
          <button
            onClick={() => setActiveTab('following')}
            className={`flex-1 py-2 px-4 rounded-lg text-sm transition-all ${
              activeTab === 'following'
                ? 'bg-purple-100 text-purple-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Following
          </button>
          <button
            onClick={() => setActiveTab('all')}
            className={`flex-1 py-2 px-4 rounded-lg text-sm transition-all ${
              activeTab === 'all'
                ? 'bg-purple-100 text-purple-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            All Villages
          </button>
        </div>
      </div>

      {/* Posts */}
      <div className="p-4 space-y-4">
        {filteredPosts.map((post) => {
          const postVillage = getVillageById(post.village);
          const activityBadge = post.type ? getActivityBadge(post.type) : null;
          const isActivityPost = post.type && post.type !== 'regular';
          
          return (
            <div
              key={post.id}
              className={`bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-shadow ${
                isActivityPost ? 'ring-2 ring-purple-100' : ''
              }`}
            >
              {/* Post Header */}
              <div className="p-4 flex items-center gap-3">
                <div className={`w-12 h-12 bg-gradient-to-br ${postVillage?.gradient || 'from-gray-300 to-gray-400'} rounded-full flex items-center justify-center text-2xl`}>
                  {postVillage?.emoji || '🍷'}
                </div>
                <div className="flex-1">
                  <p className="font-semibold">@{post.namespace}</p>
                  <p className="text-xs text-gray-500">
                    {postVillage?.name} • {formatTimeAgo(post.timestamp)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {activityBadge && (
                    <div className={`flex items-center gap-1 ${activityBadge.bg} px-3 py-1 rounded-full`}>
                      <span className={`text-xs font-medium ${activityBadge.text}`}>
                        {activityBadge.label}
                      </span>
                    </div>
                  )}
                  {post.corkEarned > 0 && (
                    <div className="flex items-center gap-1 bg-green-50 px-3 py-1 rounded-full">
                      <Sparkles className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-green-700">+{post.corkEarned}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Post Content */}
              <div className="px-4 pb-3">
                <p className="text-gray-900">{post.text}</p>
              </div>

              {/* Activity Card (for gifts, transfers, purchases) */}
              {isActivityPost && post.activityData && (
                <div className="mx-4 mb-3">
                  {post.type === 'gift-bottle' && post.activityData.bottleImage && (
                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-200">
                      <div className="flex items-center gap-3">
                        <img
                          src={post.activityData.bottleImage}
                          alt={post.activityData.bottleName}
                          className="w-20 h-20 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <p className="text-xs text-purple-600 mb-1 font-medium">Gifted Bottle</p>
                          <p className="font-semibold text-sm mb-1">{post.activityData.bottleName}</p>
                          <div className="flex items-center gap-1 text-xs text-gray-600">
                            <span>To</span>
                            <ArrowRight className="w-3 h-3" />
                            <span className="text-purple-600 font-medium">@{post.activityData.recipient}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {post.type === 'send-tokens' && post.activityData.amount && (
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                            <Sparkles className="w-6 h-6 text-green-600" />
                          </div>
                          <div>
                            <p className="text-xs text-green-600 mb-1 font-medium">CORK Transfer</p>
                            <div className="flex items-center gap-1 text-xs text-gray-600">
                              <span>To</span>
                              <ArrowRight className="w-3 h-3" />
                              <span className="text-green-600 font-medium">@{post.activityData.recipient}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-green-600">{post.activityData.amount}</p>
                          <p className="text-xs text-gray-500">CORK</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {post.type === 'purchase' && post.activityData.bottleImage && (
                    <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-4 border border-orange-200">
                      <div className="flex items-center gap-3">
                        <img
                          src={post.activityData.bottleImage}
                          alt={post.activityData.bottleName}
                          className="w-20 h-20 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <p className="text-xs text-orange-600 mb-1 font-medium">New Purchase</p>
                          <p className="font-semibold text-sm mb-1">{post.activityData.bottleName}</p>
                          <p className="text-xs text-gray-600">NFT Minted on SUI</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Post Image */}
              {post.imageUrl && !isActivityPost && (
                <img
                  src={post.imageUrl}
                  alt="Post image"
                  className="w-full aspect-video object-cover"
                />
              )}

              {/* Post Actions */}
              <div className="p-4 flex items-center gap-6 border-t border-gray-100">
                <button className="flex items-center gap-2 text-gray-600 hover:text-red-600 transition-colors">
                  <Heart className="w-5 h-5" />
                  <span className="text-sm">{post.likes}</span>
                </button>
                <button className="flex items-center gap-2 text-gray-600 hover:text-purple-600 transition-colors">
                  <MessageCircle className="w-5 h-5" />
                  <span className="text-sm">{post.comments}</span>
                </button>
              </div>
            </div>
          );
        })}

        {filteredPosts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No posts yet in this feed</p>
            <p className="text-sm text-gray-400 mt-2">Be the first to post!</p>
          </div>
        )}
      </div>
    </div>
  );
}