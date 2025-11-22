import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { MapPin, Upload, Check } from 'lucide-react';

interface OnboardingProps {
  onComplete: (userData: { username: string; village: string; profilePic: string }) => void;
}

const VILLAGES = [
  {
    id: 'lisbon',
    name: 'Lisbon',
    country: 'Portugal',
    wine: 'Orange Wine',
    members: 47,
    treasury: 2500,
    color: 'bg-amber-500',
  },
  {
    id: 'porto',
    name: 'Porto',
    country: 'Portugal',
    wine: 'Port Wine',
    members: 32,
    treasury: 1800,
    color: 'bg-rose-600',
  },
  {
    id: 'berlin',
    name: 'Berlin',
    country: 'Germany',
    wine: 'Riesling',
    members: 28,
    treasury: 1200,
    color: 'bg-yellow-500',
  },
];

export function Onboarding({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState<'welcome' | 'invite' | 'village' | 'username' | 'profile'>('welcome');
  const [inviteCode, setInviteCode] = useState('');
  const [selectedVillage, setSelectedVillage] = useState('');
  const [username, setUsername] = useState('');
  const [profilePic, setProfilePic] = useState('');

  const handleNext = () => {
    if (step === 'welcome') setStep('invite');
    else if (step === 'invite') setStep('village');
    else if (step === 'village') setStep('username');
    else if (step === 'username') setStep('profile');
  };

  const handleComplete = () => {
    onComplete({
      username,
      village: selectedVillage,
      profilePic: profilePic || `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {step === 'welcome' && (
          <Card className="border-2">
            <CardHeader className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-rose-600 rounded-full flex items-center justify-center">
                  <span className="text-3xl">🍷</span>
                </div>
              </div>
              <CardTitle className="text-3xl">Welcome to Urban Villages</CardTitle>
              <CardDescription className="text-base">
                Join a community-owned collective. Tokenize resources, earn rewards, build together.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-amber-50 rounded-lg">
                  <div className="text-2xl mb-2">🌍</div>
                  <div className="text-sm opacity-70">Location-based villages</div>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <div className="text-2xl mb-2">🪙</div>
                  <div className="text-sm opacity-70">Earn CORK tokens</div>
                </div>
                <div className="text-center p-4 bg-rose-50 rounded-lg">
                  <div className="text-2xl mb-2">🎨</div>
                  <div className="text-sm opacity-70">NFT provenance</div>
                </div>
              </div>
              <Button onClick={handleNext} className="w-full" size="lg">
                Get Started
              </Button>
            </CardContent>
          </Card>
        )}

        {step === 'invite' && (
          <Card className="border-2">
            <CardHeader>
              <CardTitle>Do you have an invite code?</CardTitle>
              <CardDescription>
                Join through a friend's invite to earn bonus rewards
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="invite">Invite Code (optional)</Label>
                <Input
                  id="invite"
                  placeholder="e.g., CORK-MARIA-5X9"
                  value={inviteCode}
                  onChange={(e) => setInviteCode(e.target.value)}
                />
                {inviteCode && (
                  <div className="flex items-center gap-2 text-sm text-green-600">
                    <Check className="w-4 h-4" />
                    Valid invite from @maria.lisbon - You'll both earn 50 CORK!
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                <Button onClick={handleNext} variant="outline" className="flex-1">
                  Skip
                </Button>
                <Button onClick={handleNext} className="flex-1">
                  Continue
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {step === 'village' && (
          <Card className="border-2">
            <CardHeader>
              <CardTitle>Choose Your Village</CardTitle>
              <CardDescription>
                Join a local community collective
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-3">
                {VILLAGES.map((village) => (
                  <button
                    key={village.id}
                    onClick={() => setSelectedVillage(village.id)}
                    className={`text-left p-4 rounded-lg border-2 transition-all ${
                      selectedVillage === village.id
                        ? 'border-black bg-amber-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-12 h-12 ${village.color} rounded-full flex items-center justify-center flex-shrink-0`}>
                        <MapPin className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">{village.name}</h3>
                          <span className="text-sm opacity-60">{village.country}</span>
                        </div>
                        <p className="text-sm opacity-70 mb-2">{village.wine} Collective</p>
                        <div className="flex gap-4 text-xs opacity-60">
                          <span>{village.members} members</span>
                          <span>{village.treasury} CORK treasury</span>
                        </div>
                      </div>
                      {selectedVillage === village.id && (
                        <Check className="w-5 h-5 text-green-600" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
              <Button onClick={handleNext} className="w-full" disabled={!selectedVillage}>
                Continue
              </Button>
            </CardContent>
          </Card>
        )}

        {step === 'username' && (
          <Card className="border-2">
            <CardHeader>
              <CardTitle>Claim Your Namespace</CardTitle>
              <CardDescription>
                Your portable identity across all villages, powered by SUI Namespace
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Choose Username</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="username"
                    placeholder="maria"
                    value={username}
                    onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, ''))}
                  />
                  <span className="text-sm opacity-60 whitespace-nowrap">
                    .{selectedVillage}
                  </span>
                </div>
                {username && (
                  <p className="text-sm opacity-70">
                    Your namespace: <span className="font-mono font-semibold">@{username}.{selectedVillage}</span>
                  </p>
                )}
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
                <p className="text-sm font-semibold">What is a namespace?</p>
                <ul className="text-sm opacity-70 space-y-1">
                  <li>• Your unique identity on SUI blockchain</li>
                  <li>• Works across all villages</li>
                  <li>• Human-readable, no wallet addresses</li>
                  <li>• You own it forever</li>
                </ul>
              </div>
              <Button onClick={handleNext} className="w-full" disabled={!username || username.length < 3}>
                Claim Namespace
              </Button>
            </CardContent>
          </Card>
        )}

        {step === 'profile' && (
          <Card className="border-2">
            <CardHeader>
              <CardTitle>Upload Profile Picture</CardTitle>
              <CardDescription>
                Stored on Walrus decentralized storage
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col items-center gap-4">
                <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                  {profilePic ? (
                    <img src={profilePic} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <img 
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`}
                      alt="Default avatar"
                      className="w-full h-full"
                    />
                  )}
                </div>
                <Button variant="outline" className="gap-2">
                  <Upload className="w-4 h-4" />
                  Upload Photo
                </Button>
                <p className="text-sm opacity-60 text-center">
                  Or we'll generate one for you
                </p>
              </div>
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <p className="text-sm font-semibold mb-2">Walrus Storage</p>
                <p className="text-sm opacity-70">
                  Your profile picture will be stored on Walrus - permanent, decentralized storage on the SUI network.
                </p>
              </div>
              <Button onClick={handleComplete} className="w-full" size="lg">
                Complete Setup
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Progress indicator */}
        <div className="flex justify-center gap-2 mt-6">
          {['welcome', 'invite', 'village', 'username', 'profile'].map((s, i) => (
            <div
              key={s}
              className={`h-2 rounded-full transition-all ${
                s === step ? 'w-8 bg-black' : 'w-2 bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
