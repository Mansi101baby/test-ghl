'use client';

import { useEffect, useState, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import axios from 'axios';

export default function OAuthCallback() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [message, setMessage] = useState('Processing OAuth callback...');

    const processedRef = useRef(false);

    useEffect(() => {
        const handleCallback = async () => {
            if (processedRef.current) return;

            const code = searchParams.get('code');
            const state = searchParams.get('state');

            if (!code) {
                // Don't mark as processed if no code, so we can retry if needed
                setStatus('error');
                setMessage('No authorization code received');
                return;
            }

            // Mark as processed immediately to prevent double calls
            processedRef.current = true;

            try {
                const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://backend.phonxai.com/api';

                // // Call your backend's callback endpoint
                // const response = await axios.get(`${API_URL}/ghl/oauth/callback`, {
                //     params: { code, state }
                // });

                setStatus('success');
                setMessage('OAuth authentication successful! Redirecting...');

                // Redirect back to home after 2 seconds
                setTimeout(() => {
                    router.push('/');
                }, 2000);
            } catch (error: any) {
                setStatus('error');
                setMessage(error.response?.data?.message || 'Failed to complete OAuth');
                console.error('OAuth callback error:', error);
            }
        };

        handleCallback();
    }, [searchParams, router]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
                {status === 'loading' && (
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">Processing...</h2>
                        <p className="text-gray-600">{message}</p>
                    </div>
                )}

                {status === 'success' && (
                    <div className="text-center">
                        <div className="text-green-500 mb-4">
                            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">Success!</h2>
                        <p className="text-gray-600">{message}</p>
                    </div>
                )}

                {status === 'error' && (
                    <div className="text-center">
                        <div className="text-red-500 mb-4">
                            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </div>
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">Error</h2>
                        <p className="text-gray-600">{message}</p>
                        <button
                            onClick={() => router.push('/')}
                            className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
                        >
                            Go Back
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
