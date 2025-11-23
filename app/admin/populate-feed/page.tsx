'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

export default function PopulateFeedPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    message?: string;
    count?: number;
    error?: string;
  } | null>(null);

  const handlePopulate = async (clear: boolean = false) => {
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/admin/populate-feed', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          count: 20,
          clear,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setResult({
          success: true,
          message: data.message,
          count: data.count,
        });
      } else {
        setResult({
          success: false,
          error: data.error || 'Failed to populate feed',
        });
      }
    } catch (error) {
      setResult({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Populate Feed (Demo)</h1>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-yellow-900 mb-2">⚠️ Demo Mode</h2>
          <p className="text-yellow-800">
            This tool populates the feed with fake posts for demo purposes. Since Walrus is having issues,
            posts will use placeholder image URLs instead of Walrus blob IDs.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Populate Feed</h2>
          
          <div className="space-y-4">
            <div>
              <p className="text-gray-600 mb-4">
                This will create demo posts across different villages (Lisbon, Porto, Berlin, Paris, Barcelona, Rome)
                with realistic content and placeholder images.
              </p>
            </div>

            <div className="flex gap-4">
              <Button
                onClick={() => handlePopulate(false)}
                disabled={loading}
                className="flex-1"
              >
                {loading ? 'Creating posts...' : 'Add Demo Posts'}
              </Button>

              <Button
                onClick={() => handlePopulate(true)}
                disabled={loading}
                variant="destructive"
                className="flex-1"
              >
                {loading ? 'Clearing & Creating...' : 'Clear & Populate'}
              </Button>
            </div>
          </div>
        </div>

        {result && (
          <div className={`rounded-lg shadow p-6 ${
            result.success 
              ? 'bg-green-50 border border-green-200' 
              : 'bg-red-50 border border-red-200'
          }`}>
            <h2 className={`text-xl font-semibold mb-2 ${
              result.success ? 'text-green-900' : 'text-red-900'
            }`}>
              {result.success ? '✓ Success' : '✗ Error'}
            </h2>
            
            {result.success ? (
              <div className="text-green-800">
                <p className="font-medium">{result.message}</p>
                {result.count !== undefined && (
                  <p className="text-sm mt-2">
                    Created {result.count} demo posts. Check the feed to see them!
                  </p>
                )}
              </div>
            ) : (
              <div className="text-red-800">
                <p className="font-medium">Error: {result.error}</p>
              </div>
            )}
          </div>
        )}

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-6">
          <h3 className="font-semibold text-blue-900 mb-2">What this does:</h3>
          <ul className="list-disc list-inside space-y-2 text-sm text-blue-800">
            <li>Creates demo posts for different villages (Lisbon, Porto, Berlin, Paris, Barcelona, Rome)</li>
            <li>Uses placeholder image URLs (Unsplash) instead of Walrus blob IDs</li>
            <li>Includes various post types: regular posts, purchases, gifts, token transfers</li>
            <li>Generates realistic usernames and content</li>
            <li>Sets appropriate timestamps (recent posts)</li>
          </ul>
          <p className="mt-4 text-sm text-blue-700">
            <strong>Note:</strong> Posts created this way will appear in the feed immediately.
            The "Clear & Populate" option will delete all existing posts first.
          </p>
        </div>
      </div>
    </div>
  );
}

