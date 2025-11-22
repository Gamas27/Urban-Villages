'use client';

import { useState } from 'react';
import { useWalrusUpload } from '@/lib/hooks/useWalrusUpload';
import { WalrusImage } from '@/components/WalrusImage';
import { Button } from '@/components/ui/button';
import { useCurrentAccount } from '@mysten/dapp-kit';
import { ConnectButton } from '@mysten/dapp-kit';

export default function TestWalrusPage() {
  const account = useCurrentAccount();
  const { uploadFile, uploading, error, clearError } = useWalrusUpload();
  const [uploadResult, setUploadResult] = useState<{ blobId: string; url: string; metadataId: string } | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setUploadResult(null);
    clearError();

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    const result = await uploadFile(selectedFile);
    if (result) {
      setUploadResult(result);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Walrus Integration Test</h1>

        {/* Wallet Connection */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">1. Connect Wallet</h2>
          {!account ? (
            <div className="flex items-center gap-4">
              <p className="text-gray-600">Please connect your wallet to test Walrus uploads</p>
              <ConnectButton />
            </div>
          ) : (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-green-800 font-medium">✓ Wallet Connected</p>
              <p className="text-sm text-green-600 mt-1">{account.address}</p>
            </div>
          )}
        </div>

        {/* File Selection */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">2. Select Image</h2>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            disabled={!account || uploading}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
          />
          
          {previewUrl && (
            <div className="mt-4">
              <p className="text-sm text-gray-600 mb-2">Preview:</p>
              <img
                src={previewUrl}
                alt="Preview"
                className="max-w-md rounded-lg border border-gray-200"
              />
            </div>
          )}
        </div>

        {/* Upload */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">3. Upload to Walrus</h2>
          <Button
            onClick={handleUpload}
            disabled={!account || !selectedFile || uploading}
            className="w-full"
          >
            {uploading ? 'Uploading to Walrus...' : 'Upload to Walrus'}
          </Button>

          {error && (
            <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800 font-medium">Upload Error:</p>
              <p className="text-sm text-red-600 mt-1">{error}</p>
            </div>
          )}
        </div>

        {/* Results */}
        {uploadResult && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">4. Upload Results</h2>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-700 mb-1">Blob ID:</p>
                <code className="block bg-gray-100 p-2 rounded text-sm break-all">
                  {uploadResult.blobId}
                </code>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-700 mb-1">URL:</p>
                <code className="block bg-gray-100 p-2 rounded text-sm break-all">
                  {uploadResult.url}
                </code>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-700 mb-1">Metadata ID:</p>
                <code className="block bg-gray-100 p-2 rounded text-sm break-all">
                  {uploadResult.metadataId}
                </code>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Image from Walrus:</p>
                <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <WalrusImage
                    blobId={uploadResult.blobId}
                    alt="Uploaded image"
                    className="max-w-md rounded-lg"
                  />
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-blue-800 font-medium mb-2">✓ Success!</p>
                <p className="text-sm text-blue-600">
                  Your image has been uploaded to Walrus decentralized storage and is now accessible via the blob ID.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold text-blue-900 mb-2">Testing Instructions:</h3>
          <ol className="list-decimal list-inside space-y-2 text-sm text-blue-800">
            <li>Connect your wallet (Sui Wallet or Enoki/Google login)</li>
            <li>Select an image file (JPG, PNG, etc.)</li>
            <li>Click "Upload to Walrus"</li>
            <li>Approve the transaction in your wallet (2 transactions: register + certify)</li>
            <li>Wait for upload to complete</li>
            <li>Verify the image displays correctly from Walrus</li>
          </ol>
          <p className="mt-4 text-sm text-blue-700">
            <strong>Note:</strong> The upload process requires 2 blockchain transactions:
            <br />1. Register transaction (stores metadata on-chain)
            <br />2. Certify transaction (confirms data is uploaded)
          </p>
        </div>
      </div>
    </div>
  );
}

