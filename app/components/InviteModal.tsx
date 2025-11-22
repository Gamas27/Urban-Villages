import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Copy, Share2, Sparkles } from 'lucide-react';
import { useState } from 'react';

interface InviteModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: {
    username: string;
    village: string;
  };
}

export function InviteModal({ isOpen, onClose, user }: InviteModalProps) {
  const [copied, setCopied] = useState(false);
  const inviteCode = `CORK-${user.username.toUpperCase()}-${Math.random().toString(36).substring(2, 5).toUpperCase()}`;
  const inviteLink = `https://cork.collective/${user.village}/join?ref=${inviteCode}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="w-5 h-5" />
            Invite Friends to {user.village.charAt(0).toUpperCase() + user.village.slice(1)} Village
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {/* Reward Info */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold mb-1">Earn 50 CORK per invite!</p>
              <p className="text-sm opacity-70">
                You and your friend both earn 50 CORK when they join using your code.
              </p>
            </div>
          </div>

          {/* Invite Code */}
          <div className="space-y-2">
            <Label>Your Invite Code</Label>
            <div className="flex gap-2">
              <Input value={inviteCode} readOnly className="font-mono" />
              <Button variant="outline" size="icon" onClick={handleCopy}>
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Invite Link */}
          <div className="space-y-2">
            <Label>Share Link</Label>
            <div className="flex gap-2">
              <Input value={inviteLink} readOnly className="text-sm" />
              <Button variant="outline" size="icon" onClick={handleCopy}>
                <Copy className="w-4 h-4" />
              </Button>
            </div>
            {copied && (
              <p className="text-sm text-green-600">Copied to clipboard!</p>
            )}
          </div>

          {/* Stats */}
          <div className="bg-gray-50 rounded-lg p-4 grid grid-cols-2 gap-4">
            <div>
              <p className="text-2xl font-semibold">5</p>
              <p className="text-sm opacity-60">Friends Invited</p>
            </div>
            <div>
              <p className="text-2xl font-semibold text-amber-600">250</p>
              <p className="text-sm opacity-60">CORK Earned</p>
            </div>
          </div>

          {/* Share Buttons */}
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" className="gap-2">
              📧 Email
            </Button>
            <Button variant="outline" className="gap-2">
              💬 Message
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
