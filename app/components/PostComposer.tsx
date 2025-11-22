import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Image as ImageIcon, Sparkles, X } from 'lucide-react';

interface PostComposerProps {
  user: {
    username: string;
    village: string;
    profilePic: string;
  };
  onClose: () => void;
}

const POST_TEMPLATES = [
  { id: 'opened', text: 'Just opened [bottle]! 🍷', reward: 10 },
  { id: 'tasting', text: 'Tasting notes: ', reward: 10 },
  { id: 'vineyard', text: 'Visiting the vineyard 🍇', reward: 10 },
  { id: 'custom', text: 'Write your own...', reward: 10 },
];

export function PostComposer({ user, onClose }: PostComposerProps) {
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [content, setContent] = useState('');
  const [hasImage, setHasImage] = useState(false);

  const handleTemplateSelect = (template: typeof POST_TEMPLATES[0]) => {
    setSelectedTemplate(template.id);
    setContent(template.text);
  };

  return (
    <Card className="border-2 border-amber-500">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Create Post</CardTitle>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Templates */}
        <div>
          <p className="text-sm font-semibold mb-2">Quick Templates</p>
          <div className="grid grid-cols-2 gap-2">
            {POST_TEMPLATES.map((template) => (
              <Button
                key={template.id}
                variant={selectedTemplate === template.id ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleTemplateSelect(template)}
                className="justify-start"
              >
                {template.text.substring(0, 20)}...
              </Button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div>
          <Textarea
            placeholder="Share your thoughts..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={4}
          />
        </div>

        {/* Image Upload */}
        <div>
          <Button
            variant="outline"
            className="w-full gap-2"
            onClick={() => setHasImage(!hasImage)}
          >
            <ImageIcon className="w-4 h-4" />
            {hasImage ? 'Image Added (Walrus)' : 'Add Photo'}
          </Button>
          {hasImage && (
            <div className="mt-2 bg-purple-50 border border-purple-200 rounded-lg p-3 text-sm">
              <p className="font-semibold mb-1">📸 Image will be stored on Walrus</p>
              <p className="text-xs opacity-70">Permanent, decentralized storage</p>
            </div>
          )}
        </div>

        {/* Reward Info */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-600" />
          <span className="text-sm font-semibold">You'll earn 10 CORK for this post</span>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button
            className="flex-1"
            disabled={!content.trim()}
            onClick={() => {
              // In real app, would post here
              onClose();
            }}
          >
            Post
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
