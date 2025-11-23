'use client';

import { useState, useMemo } from 'react';
import { Users, Send, Gift, ArrowRightLeft, Search, UserPlus, Check, Clock, X, Sparkles, Package, ExternalLink, Award, TrendingUp, Heart } from 'lucide-react';
import { getVillageById } from './data/villages';
import { Button } from '@/components/ui/button';
import { useUserNamespace } from '@/lib/stores/userStore';
import { useCurrentAccount, useSuiClientQuery } from '@mysten/dapp-kit';

interface FriendsProps {
  village: string;
}

type FriendsTab = 'friends' | 'transactions' | 'send';

interface Friend {
  id: string;
  username: string;
  namespace: string;
  village: string;
  profilePic: string;
  corkBalance: number;
  bottlesOwned: number;
  isOnline: boolean;
  mutualFriends: number;
}

interface Transaction {
  id: string;
  type: 'sent-tokens' | 'received-tokens' | 'sent-bottle' | 'received-bottle';
  from: string;
  to: string;
  amount?: number;
  bottle?: {
    name: string;
    image: string;
  };
  timestamp: string;
  status: 'completed' | 'pending';
  message?: string;
}

export function Friends({ village }: FriendsProps) {
  const account = useCurrentAccount();
  const namespace = useUserNamespace();
  const [activeTab, setActiveTab] = useState<FriendsTab>('friends');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null);
  const [showSendModal, setShowSendModal] = useState(false);
  const [sendType, setSendType] = useState<'tokens' | 'bottle'>('tokens');
  const [sendAmount, setSendAmount] = useState('');
  const [sendMessage, setSendMessage] = useState('');

  // Fetch real CORK balance
  const { data: corkBalanceData } = useSuiClientQuery(
    'getBalance',
    {
      coinType: process.env.NEXT_PUBLIC_CORK_TOKEN_PACKAGE_ID 
        ? `${process.env.NEXT_PUBLIC_CORK_TOKEN_PACKAGE_ID}::cork_token::CORK`
        : '0x2::sui::SUI',
      owner: account?.address || '',
    },
    {
      enabled: !!account && !!process.env.NEXT_PUBLIC_CORK_TOKEN_PACKAGE_ID,
      refetchInterval: 10000,
    }
  );

  const corkBalance = useMemo(() => {
    if (!corkBalanceData || !process.env.NEXT_PUBLIC_CORK_TOKEN_PACKAGE_ID) return 0;
    return Number(corkBalanceData.totalBalance || 0) / 1_000_000; // 6 decimals
  }, [corkBalanceData]);

  // Mock friends data
  const friends: Friend[] = [
    {
      id: '1',
      username: 'Maria Silva',
      namespace: 'maria.lisbon',
      village: 'lisbon',
      profilePic: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
      corkBalance: 1250,
      bottlesOwned: 8,
      isOnline: true,
      mutualFriends: 3,
    },
    {
      id: '2',
      username: 'João Santos',
      namespace: 'joao.porto',
      village: 'porto',
      profilePic: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      corkBalance: 890,
      bottlesOwned: 5,
      isOnline: true,
      mutualFriends: 2,
    },
    {
      id: '3',
      username: 'Sophie Martin',
      namespace: 'sophie.paris',
      village: 'paris',
      profilePic: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
      corkBalance: 2100,
      bottlesOwned: 12,
      isOnline: false,
      mutualFriends: 5,
    },
    {
      id: '4',
      username: 'Carlos Pereira',
      namespace: 'carlos.lisbon',
      village: 'lisbon',
      profilePic: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
      corkBalance: 650,
      bottlesOwned: 4,
      isOnline: true,
      mutualFriends: 1,
    },
  ];

  // Mock transaction data (using real namespace)
  const transactions: Transaction[] = [
    {
      id: '1',
      type: 'sent-tokens',
      from: namespace || 'user',
      to: 'maria.lisbon',
      amount: 50,
      timestamp: '2024-11-20T14:30:00',
      status: 'completed',
      message: 'Thanks for the wine recommendation! 🍷',
    },
    {
      id: '2',
      type: 'received-bottle',
      from: 'joao.porto',
      to: namespace || 'user',
      bottle: {
        name: '2021 Amphora Orange',
        image: 'https://images.unsplash.com/photo-1584916201218-f4242ceb4809?w=200',
      },
      timestamp: '2024-11-19T10:15:00',
      status: 'completed',
      message: 'Happy birthday! 🎉',
    },
    {
      id: '3',
      type: 'received-tokens',
      from: 'sophie.paris',
      to: namespace || 'user',
      amount: 100,
      timestamp: '2024-11-18T16:45:00',
      status: 'completed',
    },
    {
      id: '4',
      type: 'sent-bottle',
      from: namespace || 'user',
      to: 'carlos.lisbon',
      bottle: {
        name: '2023 Orange Skin Contact',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=200',
      },
      timestamp: '2024-11-17T09:20:00',
      status: 'completed',
      message: 'Cheers to our collaboration!',
    },
    {
      id: '5',
      type: 'sent-tokens',
      from: namespace || 'user',
      to: 'maria.lisbon',
      amount: 25,
      timestamp: '2024-11-16T12:00:00',
      status: 'pending',
    },
  ];

  const filteredFriends = friends.filter(friend =>
    friend.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    friend.namespace.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = {
    totalFriends: friends.length,
    onlineFriends: friends.filter(f => f.isOnline).length,
    tokensSent: transactions.filter(t => t.type === 'sent-tokens' && t.status === 'completed').reduce((sum, t) => sum + (t.amount || 0), 0),
    tokensReceived: transactions.filter(t => t.type === 'received-tokens' && t.status === 'completed').reduce((sum, t) => sum + (t.amount || 0), 0),
    bottlesGifted: transactions.filter(t => t.type === 'sent-bottle').length,
    bottlesReceived: transactions.filter(t => t.type === 'received-bottle').length,
  };

  const transactionIcon = (type: Transaction['type']) => {
    switch (type) {
      case 'sent-tokens':
        return <Send className="w-4 h-4 text-orange-600" />;
      case 'received-tokens':
        return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'sent-bottle':
        return <Gift className="w-4 h-4 text-purple-600" />;
      case 'received-bottle':
        return <Package className="w-4 h-4 text-blue-600" />;
    }
  };

  const transactionLabel = (transaction: Transaction) => {
    switch (transaction.type) {
      case 'sent-tokens':
        return `Sent ${transaction.amount} CORK to @${transaction.to}`;
      case 'received-tokens':
        return `Received ${transaction.amount} CORK from @${transaction.from}`;
      case 'sent-bottle':
        return `Gifted ${transaction.bottle?.name} to @${transaction.to}`;
      case 'received-bottle':
        return `Received ${transaction.bottle?.name} from @${transaction.from}`;
    }
  };

  const handleSend = () => {
    // TODO: Implement actual sending logic
    setShowSendModal(false);
    setSelectedFriend(null);
    setSendAmount('');
    setSendMessage('');
    setActiveTab('transactions');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Friends Tabs */}
      <div className="sticky top-[72px] z-20 bg-white border-b border-gray-200">
        <div className="flex items-center max-w-2xl mx-auto">
          <button
            onClick={() => setActiveTab('friends')}
            className={`flex-1 py-4 text-sm font-medium transition-colors relative ${
              activeTab === 'friends'
                ? 'text-purple-600'
                : 'text-gray-600'
            }`}
          >
            Friends
            {activeTab === 'friends' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('transactions')}
            className={`flex-1 py-4 text-sm font-medium transition-colors relative ${
              activeTab === 'transactions'
                ? 'text-purple-600'
                : 'text-gray-600'
            }`}
          >
            Activity
            {activeTab === 'transactions' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('send')}
            className={`flex-1 py-4 text-sm font-medium transition-colors relative ${
              activeTab === 'send'
                ? 'text-purple-600'
                : 'text-gray-600'
            }`}
          >
            Send
            {activeTab === 'send' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600" />
            )}
          </button>
        </div>
      </div>

      <div className="p-4 pb-6 space-y-4">
        {/* Stats Header */}
        <div className="bg-gradient-to-br from-orange-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-2xl mb-1">Friends & Gifting</h2>
              <p className="text-sm text-white/90">
                Share CORK tokens and NFT bottles
              </p>
            </div>
            <div className="bg-white/20 backdrop-blur px-3 py-2 rounded-xl text-center">
              <div className="text-lg">{stats.totalFriends}</div>
              <div className="text-xs text-white/80">Friends</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="bg-white/10 backdrop-blur rounded-xl p-3">
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="w-4 h-4" />
                <span className="text-xs text-white/80">Sent</span>
              </div>
              <div className="text-lg">{stats.tokensSent} CORK</div>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-xl p-3">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="w-4 h-4" />
                <span className="text-xs text-white/80">Received</span>
              </div>
              <div className="text-lg">{stats.tokensReceived} CORK</div>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-xl p-3">
              <div className="flex items-center gap-2 mb-1">
                <Gift className="w-4 h-4" />
                <span className="text-xs text-white/80">Gifted</span>
              </div>
              <div className="text-lg">{stats.bottlesGifted} Bottles</div>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-xl p-3">
              <div className="flex items-center gap-2 mb-1">
                <Package className="w-4 h-4" />
                <span className="text-xs text-white/80">Received</span>
              </div>
              <div className="text-lg">{stats.bottlesReceived} Bottles</div>
            </div>
          </div>
        </div>

        {/* Friends Tab */}
        {activeTab === 'friends' && (
          <>
            {/* Search */}
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search friends..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <button className="px-4 bg-gradient-to-r from-orange-500 to-purple-600 text-white rounded-xl hover:from-orange-600 hover:to-purple-700 transition-colors">
                <UserPlus className="w-5 h-5" />
              </button>
            </div>

            {/* Friends List */}
            <div className="space-y-3">
              {filteredFriends.map((friend) => {
                const friendVillage = getVillageById(friend.village);
                
                return (
                  <div key={friend.id} className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-all">
                    <div className="flex gap-4">
                      {/* Profile Picture */}
                      <div className="relative flex-shrink-0">
                        <img
                          src={friend.profilePic}
                          alt={friend.username}
                          className="w-16 h-16 rounded-full object-cover"
                        />
                        {friend.isOnline && (
                          <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full" />
                        )}
                      </div>

                      {/* Friend Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-1">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold truncate">{friend.username}</h3>
                            <p className="text-xs text-purple-600">@{friend.namespace}</p>
                          </div>
                          <div className="text-lg ml-2">{friendVillage?.emoji}</div>
                        </div>

                        <div className="flex items-center gap-3 text-[10px] text-gray-600 mb-3">
                          <span className="flex items-center gap-1">
                            <Sparkles className="w-3 h-3" />
                            {friend.corkBalance} CORK
                          </span>
                          <span className="flex items-center gap-1">
                            <Package className="w-3 h-3" />
                            {friend.bottlesOwned} bottles
                          </span>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2">
                          <Button
                            onClick={() => {
                              setSelectedFriend(friend);
                              setSendType('tokens');
                              setShowSendModal(true);
                            }}
                            className="flex-1 py-2 px-3 bg-green-500 hover:bg-green-600 text-white rounded-lg text-xs h-auto"
                          >
                            <Sparkles className="w-3 h-3 inline mr-1" />
                            Send CORK
                          </Button>
                          <Button
                            onClick={() => {
                              setSelectedFriend(friend);
                              setSendType('bottle');
                              setShowSendModal(true);
                            }}
                            className="flex-1 py-2 px-3 bg-gradient-to-r from-orange-500 to-purple-600 hover:from-orange-600 hover:to-purple-700 text-white rounded-lg text-xs h-auto"
                          >
                            <Gift className="w-3 h-3 inline mr-1" />
                            Gift Bottle
                          </Button>
                        </div>
                      </div>
                    </div>

                    {friend.mutualFriends > 0 && (
                      <div className="mt-3 pt-3 border-t border-gray-100">
                        <p className="text-[10px] text-gray-500">
                          <Users className="w-3 h-3 inline mr-1" />
                          {friend.mutualFriends} mutual friend{friend.mutualFriends > 1 ? 's' : ''}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {filteredFriends.length === 0 && (
              <div className="text-center py-16 bg-white rounded-2xl">
                <div className="w-20 h-20 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Search className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-lg mb-2">No friends found</h3>
                <p className="text-sm text-gray-600">Try adjusting your search</p>
              </div>
            )}
          </>
        )}

        {/* Transactions Tab */}
        {activeTab === 'transactions' && (
          <div className="space-y-3">
            {transactions.map((transaction) => {
              const isOutgoing = transaction.from === (namespace || 'user');
              
              return (
                <div key={transaction.id} className="bg-white rounded-2xl p-4 shadow-sm">
                  <div className="flex gap-3">
                    {/* Icon */}
                    <div className={`w-10 h-10 flex-shrink-0 rounded-full flex items-center justify-center ${
                      transaction.type.includes('sent') ? 'bg-orange-50' : 'bg-green-50'
                    }`}>
                      {transactionIcon(transaction.type)}
                    </div>

                    {/* Transaction Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-1">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">
                            {transactionLabel(transaction)}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(transaction.timestamp).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </p>
                        </div>
                        <div className={`px-2 py-1 rounded-lg text-[10px] ml-2 ${
                          transaction.status === 'completed'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {transaction.status === 'completed' ? (
                            <Check className="w-3 h-3" />
                          ) : (
                            <Clock className="w-3 h-3" />
                          )}
                        </div>
                      </div>

                      {transaction.message && (
                        <div className="bg-gray-50 rounded-lg px-3 py-2 mt-2">
                          <p className="text-xs text-gray-700">{transaction.message}</p>
                        </div>
                      )}

                      {transaction.bottle && (
                        <div className="flex items-center gap-2 mt-2">
                          <img
                            src={transaction.bottle.image}
                            alt={transaction.bottle.name}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                          <p className="text-xs text-gray-600">{transaction.bottle.name}</p>
                        </div>
                      )}

                      {transaction.amount && (
                        <div className="flex items-center gap-1 mt-2">
                          <Sparkles className="w-4 h-4 text-purple-600" />
                          <span className={`text-sm font-semibold ${
                            isOutgoing ? 'text-orange-600' : 'text-green-600'
                          }`}>
                            {isOutgoing ? '-' : '+'}{transaction.amount} CORK
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {transactions.length === 0 && (
              <div className="text-center py-16 bg-white rounded-2xl">
                <div className="w-20 h-20 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <ArrowRightLeft className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-lg mb-2">No transactions yet</h3>
                <p className="text-sm text-gray-600 mb-6">
                  Start sending CORK or gifting bottles to friends
                </p>
                <Button
                  onClick={() => setActiveTab('send')}
                  className="bg-gradient-to-r from-orange-500 to-purple-600 hover:from-orange-600 hover:to-purple-700"
                >
                  Send to Friends
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Send Tab */}
        {activeTab === 'send' && (
          <div className="space-y-4">
            {/* Quick Actions */}
            <div className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
              <h3 className="font-semibold flex items-center gap-2">
                <Send className="w-5 h-5 text-purple-600" />
                Quick Send
              </h3>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => {
                    setSendType('tokens');
                    if (friends.length > 0) {
                      setSelectedFriend(friends[0]);
                      setShowSendModal(true);
                    }
                  }}
                  className="p-4 border-2 border-gray-200 rounded-xl hover:border-purple-300 hover:bg-purple-50 transition-all"
                >
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Sparkles className="w-6 h-6 text-green-600" />
                  </div>
                  <p className="font-medium text-sm">Send CORK</p>
                  <p className="text-xs text-gray-500 mt-1">Transfer tokens</p>
                </button>

                <button
                  onClick={() => {
                    setSendType('bottle');
                    if (friends.length > 0) {
                      setSelectedFriend(friends[0]);
                      setShowSendModal(true);
                    }
                  }}
                  className="p-4 border-2 border-gray-200 rounded-xl hover:border-purple-300 hover:bg-purple-50 transition-all"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Gift className="w-6 h-6 text-purple-600" />
                  </div>
                  <p className="font-medium text-sm">Gift Bottle</p>
                  <p className="text-xs text-gray-500 mt-1">Send NFT</p>
                </button>
              </div>
            </div>

            {/* Your Balance */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-green-900">Your CORK Balance</h3>
                <Sparkles className="w-5 h-5 text-green-600" />
              </div>
              <p className="text-3xl text-green-900 mb-1">{corkBalance.toFixed(2)}</p>
              <p className="text-xs text-green-600">Available to send</p>
            </div>

            {/* Recent Recipients */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="font-semibold mb-4">Recent Recipients</h3>
              <div className="space-y-3">
                {friends.slice(0, 3).map((friend) => {
                  const friendVillage = getVillageById(friend.village);
                  
                  return (
                    <button
                      key={friend.id}
                      onClick={() => {
                        setSelectedFriend(friend);
                        setShowSendModal(true);
                      }}
                      className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded-xl transition-colors"
                    >
                      <img
                        src={friend.profilePic}
                        alt={friend.username}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div className="flex-1 text-left">
                        <p className="text-sm font-medium">{friend.username}</p>
                        <p className="text-xs text-gray-500">@{friend.namespace}</p>
                      </div>
                      <div className="text-lg">{friendVillage?.emoji}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Info Box */}
            <div className="bg-blue-50 rounded-2xl p-4">
              <div className="flex gap-3">
                <Award className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-blue-900 text-sm mb-1">
                    Build Village Economy
                  </h4>
                  <p className="text-xs text-blue-700">
                    Every transaction strengthens your village treasury. Send tokens and gift bottles to create a thriving community economy!
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Send Modal */}
      {showSendModal && selectedFriend && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-100 p-6 pb-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h2 className="text-xl font-semibold mb-1">
                    {sendType === 'tokens' ? 'Send CORK Tokens' : 'Gift Bottle'}
                  </h2>
                  <p className="text-sm text-gray-600">
                    To @{selectedFriend.namespace}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setShowSendModal(false);
                    setSelectedFriend(null);
                    setSendAmount('');
                    setSendMessage('');
                  }}
                  className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Recipient */}
              <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-3">
                <img
                  src={selectedFriend.profilePic}
                  alt={selectedFriend.username}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="flex-1">
                  <p className="font-medium">{selectedFriend.username}</p>
                  <p className="text-xs text-gray-500">@{selectedFriend.namespace}</p>
                </div>
                <div className="text-2xl">{getVillageById(selectedFriend.village)?.emoji}</div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              {sendType === 'tokens' ? (
                <>
                  {/* Amount Input */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Amount (CORK)
                    </label>
                    <div className="relative">
                      <Sparkles className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="number"
                        value={sendAmount}
                        onChange={(e) => setSendAmount(e.target.value)}
                        placeholder="0"
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Available: {corkBalance.toFixed(2)} CORK
                    </p>
                  </div>

                  {/* Quick Amounts */}
                  <div className="flex gap-2">
                    {[25, 50, 100, 200].map((amount) => (
                      <button
                        key={amount}
                        onClick={() => setSendAmount(amount.toString())}
                        className="flex-1 py-2 px-3 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-colors text-sm"
                      >
                        {amount}
                      </button>
                    ))}
                  </div>
                </>
              ) : (
                <>
                  {/* Bottle Selection (simplified) */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Bottle to Gift
                    </label>
                    <div className="space-y-2">
                      <button className="w-full flex items-center gap-3 p-3 border-2 border-purple-300 bg-purple-50 rounded-xl">
                        <img
                          src="https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=100"
                          alt="Bottle"
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                        <div className="flex-1 text-left">
                          <p className="font-medium text-sm">2023 Orange Skin Contact</p>
                          <p className="text-xs text-gray-600">Quinta do Terroir</p>
                          <p className="text-xs text-purple-600 mt-1">Selected</p>
                        </div>
                      </button>
                    </div>
                  </div>
                </>
              )}

              {/* Message */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Add a message (optional)
                </label>
                <textarea
                  value={sendMessage}
                  onChange={(e) => setSendMessage(e.target.value)}
                  placeholder="Say something nice..."
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                  rows={3}
                />
              </div>

              {/* Summary */}
              <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    {sendType === 'tokens' ? 'Amount' : 'Gift'}
                  </span>
                  <span className="font-medium">
                    {sendType === 'tokens' ? `${sendAmount || 0} CORK` : '1 NFT Bottle'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Gas fee (est.)</span>
                  <span className="font-medium">0.01 SUI</span>
                </div>
                <div className="border-t border-gray-200 pt-2 flex justify-between font-semibold">
                  <span>Total Cost</span>
                  <span>{sendType === 'tokens' ? `${sendAmount || 0} CORK + 0.01 SUI` : '0.01 SUI'}</span>
                </div>
              </div>

              {/* Send Button */}
              <Button
                onClick={handleSend}
                disabled={sendType === 'tokens' && (!sendAmount || Number(sendAmount) <= 0)}
                className="w-full py-6 text-lg bg-gradient-to-r from-orange-500 to-purple-600 hover:from-orange-600 hover:to-purple-700 disabled:opacity-50"
              >
                {sendType === 'tokens' ? (
                  <>
                    <Send className="w-5 h-5 mr-2" />
                    Send {sendAmount || 0} CORK
                  </>
                ) : (
                  <>
                    <Gift className="w-5 h-5 mr-2" />
                    Gift Bottle
                  </>
                )}
              </Button>

              <p className="text-xs text-center text-gray-500">
                🔐 Secured by SUI blockchain • Transaction on-chain
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
