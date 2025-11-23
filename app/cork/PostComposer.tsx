'use client';

import { useState } from 'react';
import { X, Image as ImageIcon, Sparkles, Loader2 } from 'lucide-react';
import { useEnokiWalrusUpload } from '@/lib/hooks/useEnokiWalrusUpload';
import { usePostUpload } from '@/lib/hooks/usePostUpload';
import { useCurrentAccount } from '@mysten/dapp-kit';
import { getVillageById } from './data/villages';
import { Button } from '@/components/ui/button';
import { createPost } from '@/lib/api/postsApi';
import { WalrusImage } from '@/components/WalrusImage';
import { useUserProfile, useUserNamespace, useUserVillage } from '@/lib/stores/userStore';

interface PostComposerProps {
  onClose: () => void;
  onPost: () => void;
}

export function PostComposer({ onClose, onPost }: PostComposerProps) {
  const account = useCurrentAccount();
  const { uploadFile, uploading: imageUploading, error: walrusError } = useEnokiWalrusUpload();
  const { uploadPost, uploading: postUploading, error: postError } = usePostUpload();
  const profile = useUserProfile();
  const namespace = useUserNamespace();
  const userVillage = useUserVillage();
  
  const [text, setText] = useState('');
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [imageBlobId, setImageBlobId] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [posting, setPosting] = useState(false);
  
  const username = profile?.username || 'user';
  const villageId = userVillage || 'lisbon';
  const userNamespace = namespace || 'user';

  const village = getVillageById(villageId);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Store the file for later upload (only when posting)
    setSelectedImageFile(file);

    // Show preview immediately (no upload yet)
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setSelectedImageFile(null);
    setImageBlobId(null);
    setPreviewUrl(null);
  };

  const handlePost = async () => {
    if (!text.trim() && !selectedImageFile) return;
    if (!account || !profile || !namespace || !villageId) {
      console.error('User data incomplete for posting.');
      return;
    }

    // Check if wallet is needed for image upload
    if (selectedImageFile && !account) {
      alert('Please connect a wallet to post images.');
      return;
    }

    setPosting(true);
    
    try {
      let finalImageBlobId = imageBlobId;

      // Step 1: Upload image to Walrus (only if image selected and not already uploaded)
      if (selectedImageFile && !imageBlobId) {
        if (!account) {
          throw new Error('Wallet required for image upload');
        }

        const uploadResult = await uploadFile(selectedImageFile);
        if (!uploadResult) {
          throw new Error('Failed to upload image to Walrus');
        }
        finalImageBlobId = uploadResult.blobId;
        setImageBlobId(uploadResult.blobId);
      }

      // Calculate CORK earned
      let corkEarned = 10;
      if (text.trim().length > 100) corkEarned = 20;
      else if (text.trim().length > 50) corkEarned = 15;
      if (finalImageBlobId) corkEarned += 5;

      // Step 2: Upload post content to Walrus
      const postContent = {
        namespace: userNamespace,
        village: villageId,
        text: text.trim(),
        imageBlobId: finalImageBlobId || undefined,
        type: 'regular' as const,
        corkEarned,
        likes: 0,
        comments: 0,
        author: username,
        profilePicBlobId: profile?.profilePicBlobId || undefined,
      };

      const walrusResult = await uploadPost(postContent);
      if (!walrusResult) {
        throw new Error('Failed to upload post to Walrus');
      }

      console.log('Post uploaded to Walrus:', walrusResult.blobId);

      // Step 3: Save post index to backend API (includes Walrus blobId)
      const post = await createPost({
        walletAddress: account.address,
        namespace: userNamespace,
        village: villageId,
        text: text.trim(),
        imageBlobId: finalImageBlobId || undefined,
        walrusBlobId: walrusResult.blobId, // Store Walrus blob ID
        type: 'regular',
      });

      if (!post) {
        throw new Error('Failed to create post index');
      }

      console.log('Post index saved to backend:', post);

      // Trigger event to refresh feed
      window.dispatchEvent(new Event('postCreated'));

      // TODO: Create post transaction on SUI blockchain
      // Include text and imageBlobId in transaction
      // await createPostTransaction(post);
      
      // Clear form
      setText('');
      setSelectedImageFile(null);
      setImageBlobId(null);
      setPreviewUrl(null);
      
      // Close composer
      onPost();
    } catch (error) {
      console.error('Error posting:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to post. Please try again.';
      alert(errorMessage);
    } finally {
      setPosting(false);
    }
  };

  const estimatedCork = text.length > 100 ? 20 : text.length > 50 ? 15 : 10;
  const hasImage = selectedImageFile || previewUrl;
  const canPost = (text.trim().length > 0 || hasImage) && !posting && !imageUploading && !postUploading;
  const isUploading = (imageUploading || postUploading) && posting; // Show upload state during posting

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end md:items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full md:max-w-2xl md:rounded-3xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl animate-in slide-in-from-bottom-4 md:slide-in-from-bottom-0 md:zoom-in-95 duration-300">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between z-10">
          <button
            onClick={onClose}
            disabled={posting}
            className="p-2 hover:bg-gray-100 rounded-full transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
          <h2 className="text-xl font-bold text-gray-900">Create Post</h2>
          <Button
            onClick={handlePost}
            disabled={!canPost}
            size="sm"
            className="bg-gradient-to-r from-purple-600 to-orange-500 hover:from-purple-700 hover:to-orange-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed px-6"
          >
            {posting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="hidden sm:inline">
                  {imageUploading ? 'Uploading image...' : postUploading ? 'Uploading post...' : 'Posting...'}
                </span>
                <span className="sm:hidden">Posting...</span>
              </>
            ) : (
              'Post'
            )}
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {/* User Info */}
          <div className="flex items-center gap-3 mb-6">
            {profile?.profilePicBlobId ? (
              <WalrusImage
                blobId={profile.profilePicBlobId}
                alt="Profile"
                className="w-14 h-14 rounded-full object-cover ring-2 ring-purple-100"
                type="profile"
                initial={username[0]?.toUpperCase() || 'U'}
              />
            ) : (
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-400 to-orange-400 flex items-center justify-center text-white font-semibold text-lg ring-2 ring-purple-100">
                {username[0]?.toUpperCase() || 'U'}
              </div>
            )}
            <div className="flex-1">
              <p className="font-semibold text-gray-900 text-base">@{userNamespace}</p>
              <div className="flex items-center gap-2 text-sm text-gray-500 mt-0.5">
                <span className="text-lg">{village?.emoji}</span>
                <span>{village?.name}</span>
              </div>
            </div>
          </div>

          {/* Text Input */}
          <div className="relative mb-4">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="What's happening in your village? Share your thoughts..."
              className="w-full min-h-[180px] p-5 border-2 border-gray-200 rounded-2xl resize-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100 focus:outline-none text-base text-gray-900 placeholder:text-gray-400 disabled:text-gray-500 disabled:bg-gray-50 transition-all"
              maxLength={280}
              disabled={posting}
            />
            {/* Character Count - positioned absolutely */}
            <div className="absolute bottom-3 right-3">
              <span className={`text-xs font-medium px-2 py-1 rounded-full bg-white/80 backdrop-blur-sm ${
                text.length > 250 ? 'text-orange-600' : text.length > 200 ? 'text-yellow-600' : 'text-gray-400'
              }`}>
                {text.length}/280
              </span>
            </div>
          </div>

          {/* CORK Estimate */}
          {text.trim().length > 0 && (
            <div className="flex items-center gap-2 mb-4 px-4 py-2.5 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100">
              <Sparkles className="w-5 h-5 text-green-600" />
              <span className="text-sm font-medium text-green-700">
                Earn <span className="font-bold">+{estimatedCork + (hasImage ? 5 : 0)} CORK</span> for this post
              </span>
            </div>
          )}

          {/* Image Preview */}
          {previewUrl && (
            <div className="relative mb-4 rounded-2xl overflow-hidden border-2 border-gray-200 group">
              <div className="relative aspect-video bg-gray-100">
                <img
                  src={previewUrl}
                  alt="Upload preview"
                  className="w-full h-full object-cover"
                />
                {isUploading && (
                  <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex flex-col items-center justify-center z-10">
                    <Loader2 className="w-10 h-10 text-white animate-spin mb-3" />
                    <p className="text-white font-medium text-sm">
                      {imageUploading ? 'Uploading image to Walrus...' : 'Processing...'}
                    </p>
                    <p className="text-white/80 text-xs mt-1">This may take a moment</p>
                  </div>
                )}
                {imageBlobId && !isUploading && (
                  <div className="absolute top-4 left-4 bg-green-500 text-white px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 shadow-lg z-10">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                    Ready to post
                  </div>
                )}
                {!posting && (
                  <button
                    onClick={handleRemoveImage}
                    className="absolute top-4 right-4 bg-black/60 hover:bg-black/80 text-white p-2.5 rounded-full transition-all backdrop-blur-sm z-10 active:scale-95"
                    aria-label="Remove image"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
                {/* Gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              </div>
            </div>
          )}

          {/* Error Messages */}
          {(walrusError || postError) && (
            <div className="bg-red-50 border-2 border-red-200 text-red-700 p-4 rounded-xl mb-4">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center text-xs font-bold mt-0.5">
                  !
                </div>
                <div className="flex-1">
                  <p className="font-semibold mb-1">Upload failed</p>
                  <p className="text-sm text-red-600">{walrusError || postError}</p>
                </div>
              </div>
            </div>
          )}

          {selectedImageFile && !account && (
            <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-4 mb-4">
              <div className="flex items-start gap-3">
                <div className="text-2xl">⚠️</div>
                <div className="flex-1">
                  <p className="font-semibold text-amber-900 mb-1">Wallet required for images</p>
                  <p className="text-sm text-amber-700">
                    You can preview the image, but need to connect a wallet to upload it to Walrus.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-3 pt-5 border-t border-gray-100">
            <label className={`flex items-center gap-2.5 text-purple-600 hover:bg-purple-50 px-5 py-2.5 rounded-xl cursor-pointer transition-all font-medium text-sm active:scale-95 ${
              posting || hasImage ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-md'
            }`}>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                disabled={posting || !!hasImage}
                className="hidden"
              />
              <ImageIcon className="w-5 h-5" />
              <span>{hasImage ? 'Image added' : 'Add Image'}</span>
            </label>

            {hasImage && (
              <div className="flex-1 text-sm text-gray-600 flex items-center gap-2 px-4 py-2.5 bg-green-50 rounded-xl border border-green-100">
                <Sparkles className="w-4 h-4 text-green-600" />
                <span className="font-medium text-green-700">+5 CORK bonus for image</span>
              </div>
            )}
          </div>

          {/* Info Card */}
          <div className="mt-6 p-5 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl border border-blue-100">
            <div className="flex items-start gap-3">
              <div className="text-2xl flex-shrink-0">💡</div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-900 mb-2">Earn CORK by posting!</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-700">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                    <span>Regular posts: <strong>10 CORK</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                    <span>With images: <strong>+5 CORK</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                    <span>Long posts (100+): <strong>20 CORK</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                    <span>Stored on Walrus</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}