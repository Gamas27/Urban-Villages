'use client';

import { useState } from 'react';
import { X, Image as ImageIcon, Sparkles, Loader2 } from 'lucide-react';
import { useEnokiWalrusUpload } from '@/lib/hooks/useEnokiWalrusUpload';
import { useCurrentAccount } from '@mysten/dapp-kit';
import { getVillageById } from './data/villages';
import { Button } from '@/components/ui/button';
import { savePost } from './lib/postStorage';
import { WalrusImage } from '@/components/WalrusImage';
import { useUserProfile, useUserNamespace, useUserVillage } from '@/lib/stores/userStore';

interface PostComposerProps {
  onClose: () => void;
  onPost: () => void;
}

export function PostComposer({ onClose, onPost }: PostComposerProps) {
  const account = useCurrentAccount();
  const { uploadFile, uploading: walrusUploading, error: walrusError } = useEnokiWalrusUpload();
  const profile = useUserProfile();
  const namespace = useUserNamespace();
  const userVillage = useUserVillage();
  
  const [text, setText] = useState('');
  const [imageBlobId, setImageBlobId] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [posting, setPosting] = useState(false);
  
  const username = profile?.username || 'user';
  const villageId = userVillage || 'lisbon';
  const userNamespace = namespace || 'user';

  const village = getVillageById(villageId);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check if wallet is connected (Enoki or regular)
    if (!account) {
      console.warn('Please connect a wallet first.');
      // Show preview anyway
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
      return;
    }

    // Show preview immediately
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload to Walrus using Enoki wallet (via dapp-kit)
    const result = await uploadFile(file);
    if (result) {
      setImageBlobId(result.blobId);
    } else {
      console.error('Walrus upload failed:', walrusError);
    }
  };

  const handleRemoveImage = () => {
    setImageBlobId(null);
    setPreviewUrl(null);
  };

  const handlePost = async () => {
    if (!text.trim() && !imageBlobId) return;
    if (!account || !profile || !namespace || !villageId) {
      console.error('User data incomplete for posting.');
      return;
    }

    setPosting(true);
    
    try {
      // Save post with Walrus blobId
      const post = savePost({
        author: username,
        namespace: userNamespace,
        village: villageId,
        text: text.trim(),
        imageBlobId: imageBlobId || undefined,
        type: 'regular',
      });

      console.log('Post saved:', post);

      // TODO: Create post transaction on SUI blockchain
      // Include text and imageBlobId in transaction
      // await createPostTransaction(post);
      
      // Simulate transaction delay
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error('Error posting:', error);
    } finally {
      setPosting(false);
      onPost();
    }
  };

  const estimatedCork = text.length > 100 ? 20 : text.length > 50 ? 15 : 10;
  const hasImage = imageBlobId || previewUrl;
  const canPost = (text.trim().length > 0 || hasImage) && !walrusUploading && !posting;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end md:items-center justify-center">
      <div className="bg-white w-full md:max-w-2xl md:rounded-2xl max-h-screen overflow-y-auto pb-safe">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
          <button
            onClick={onClose}
            disabled={posting}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          <h2 className="text-lg">New Post</h2>
          <Button
            onClick={handlePost}
            disabled={!canPost}
            className="bg-gradient-to-r from-orange-500 to-purple-600 hover:from-orange-600 hover:to-purple-700 disabled:opacity-50"
          >
            {posting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Posting...
              </>
            ) : (
              'Post'
            )}
          </Button>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* User Info */}
          <div className="flex items-center gap-3 mb-4">
            {profile?.profilePicBlobId ? (
              <WalrusImage
                blobId={profile.profilePicBlobId}
                alt="Profile"
                className="w-12 h-12 rounded-full object-cover"
                type="profile"
                initial={username[0]?.toUpperCase() || 'U'}
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                <span className="text-lg">{username[0]?.toUpperCase() || 'U'}</span>
              </div>
            )}
            <div>
              <p className="font-semibold">@{userNamespace}</p>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span className="text-xl">{village?.emoji}</span>
                <span>{village?.name}</span>
              </div>
            </div>
          </div>

          {/* Text Input */}
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="What's happening in your village?"
            className="w-full min-h-[150px] p-4 border-2 border-gray-200 rounded-xl resize-none focus:border-purple-500 focus:outline-none text-lg"
            maxLength={280}
            disabled={posting}
          />

          {/* Character Count */}
          <div className="flex justify-between items-center mb-4">
            <span className={`text-sm ${text.length > 250 ? 'text-orange-600' : 'text-gray-500'}`}>
              {text.length}/280
            </span>
            {text.trim().length > 0 && (
              <div className="flex items-center gap-1 text-sm text-green-600">
                <Sparkles className="w-4 h-4" />
                <span>+{estimatedCork} CORK estimated</span>
              </div>
            )}
          </div>

          {/* Image Preview */}
          {previewUrl && (
            <div className="relative mb-4 rounded-xl overflow-hidden">
              <img
                src={previewUrl}
                alt="Upload preview"
                className="w-full rounded-xl"
              />
              {walrusUploading && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center">
                  <Loader2 className="w-8 h-8 text-white animate-spin mb-2" />
                  <p className="text-white text-sm">Uploading to Walrus...</p>
                </div>
              )}
              {imageBlobId && (
                <div className="absolute top-3 left-3 bg-green-500 text-white px-3 py-1 rounded-full text-sm flex items-center gap-1">
                  ✓ Stored on Walrus
                </div>
              )}
              {!posting && (
                <button
                  onClick={handleRemoveImage}
                  className="absolute top-3 right-3 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          )}

          {walrusError && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">
              Upload failed: {walrusError}
            </div>
          )}

          {!account && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4 text-sm">
              <p className="text-blue-800 text-center">
                <strong>Please connect a wallet to upload images</strong>
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-4 pt-4 border-t border-gray-200">
            <label className={`flex items-center gap-2 text-purple-600 hover:bg-purple-50 px-4 py-2 rounded-lg cursor-pointer transition-colors ${!account ? 'opacity-50 cursor-not-allowed' : ''}`}>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={walrusUploading || posting || !!hasImage || !account}
                className="hidden"
              />
              <ImageIcon className="w-5 h-5" />
              <span className="text-sm">Add Image</span>
            </label>

            {hasImage && (
              <div className="flex-1 text-sm text-gray-600 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-green-600" />
                <span>+5 CORK bonus for image posts</span>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="mt-6 p-4 bg-blue-50 rounded-xl">
            <p className="text-xs text-blue-900 mb-1">💡 Earn CORK by posting!</p>
            <ul className="text-xs text-blue-700 space-y-1">
              <li>• Regular posts: 10 CORK</li>
              <li>• Posts with images: 15 CORK</li>
              <li>• Long posts (100+ chars): 20 CORK</li>
              <li>• Images stored on Walrus decentralized storage</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}