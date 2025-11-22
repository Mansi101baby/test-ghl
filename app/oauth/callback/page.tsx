'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import axios from 'axios';

interface TokenResponse {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
    tokenType: string;
    locationId?: string;
    companyId?: string;
}

function CallbackContent() {
    const searchParams = useSearchParams();
    const [params, setParams] = useState<{ [key: string]: string }>({});
    const [tokenData, setTokenData] = useState<TokenResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://backend.phonxai.com/api';

    useEffect(() => {
        const entries = Array.from(searchParams.entries());
        const paramsObj: { [key: string]: string } = {};
        entries.forEach(([key, value]) => {
            paramsObj[key] = value;
        });
        setParams(paramsObj);

        // Automatically exchange code for tokens if code and state are present
        if (paramsObj.code && paramsObj.state) {
            exchangeCodeForTokens(paramsObj.code, paramsObj.state);
        }
    }, [searchParams]);

    const exchangeCodeForTokens = async (code: string, state: string) => {
        try {
            setLoading(true);
            setError('');

            const response = await axios.post(`${API_URL}/ghl/exchange-token`, {
                code,
                state,
                redirectUri: `${window.location.origin}/oauth/callback`,
            });

            setTokenData(response.data.data);
            setLoading(false);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to exchange code for tokens');
            setLoading(false);
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        alert('Copied to clipboard!');
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8 flex flex-col items-center justify-center">
            <div className="max-w-2xl w-full bg-white rounded-xl shadow-lg p-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">
                    OAuth Callback
                </h1>

                {/* Loading State */}
                {loading && (
                    <div className="text-center py-8">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                        <p className="mt-4 text-gray-600">Exchanging code for tokens...</p>
                    </div>
                )}

                {/* Error State */}
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
                        <p className="font-semibold">Error:</p>
                        <p>{error}</p>
                    </div>
                )}

                {/* Token Data Display */}
                {tokenData && !loading && (
                    <div className="mb-6">
                        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-6">
                            <p className="font-semibold">✅ Successfully obtained tokens!</p>
                        </div>

                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Token Information</h2>
                        <div className="space-y-4">
                            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                <label className="block text-sm font-medium text-gray-500 uppercase tracking-wider mb-1">
                                    Access Token
                                </label>
                                <div className="flex items-center justify-between gap-4">
                                    <code className="text-sm font-mono text-blue-600 break-all">
                                        {tokenData.accessToken}
                                    </code>
                                    <button
                                        onClick={() => copyToClipboard(tokenData.accessToken)}
                                        className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
                                        title="Copy value"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-5 w-5"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                                            />
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                <label className="block text-sm font-medium text-gray-500 uppercase tracking-wider mb-1">
                                    Refresh Token
                                </label>
                                <div className="flex items-center justify-between gap-4">
                                    <code className="text-sm font-mono text-blue-600 break-all">
                                        {tokenData.refreshToken}
                                    </code>
                                    <button
                                        onClick={() => copyToClipboard(tokenData.refreshToken)}
                                        className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
                                        title="Copy value"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-5 w-5"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                                            />
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                    <label className="block text-sm font-medium text-gray-500 uppercase tracking-wider mb-1">
                                        Expires In
                                    </label>
                                    <p className="text-sm font-mono text-gray-900">
                                        {tokenData.expiresIn} seconds
                                    </p>
                                </div>

                                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                    <label className="block text-sm font-medium text-gray-500 uppercase tracking-wider mb-1">
                                        Token Type
                                    </label>
                                    <p className="text-sm font-mono text-gray-900">
                                        {tokenData.tokenType}
                                    </p>
                                </div>
                            </div>

                            {tokenData.locationId && (
                                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                    <label className="block text-sm font-medium text-gray-500 uppercase tracking-wider mb-1">
                                        Location ID
                                    </label>
                                    <div className="flex items-center justify-between gap-4">
                                        <code className="text-sm font-mono text-blue-600 break-all">
                                            {tokenData.locationId}
                                        </code>
                                        <button
                                            onClick={() => copyToClipboard(tokenData.locationId!)}
                                            className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
                                            title="Copy value"
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-5 w-5"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                                                />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            )}

                            {tokenData.companyId && (
                                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                    <label className="block text-sm font-medium text-gray-500 uppercase tracking-wider mb-1">
                                        Company ID
                                    </label>
                                    <div className="flex items-center justify-between gap-4">
                                        <code className="text-sm font-mono text-blue-600 break-all">
                                            {tokenData.companyId}
                                        </code>
                                        <button
                                            onClick={() => copyToClipboard(tokenData.companyId!)}
                                            className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
                                            title="Copy value"
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-5 w-5"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                                                />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Original Parameters Display */}
                {!loading && Object.keys(params).length > 0 && (
                    <div className="mb-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">OAuth Parameters</h2>
                        <div className="space-y-4">
                            {Object.entries(params).map(([key, value]) => (
                                <div key={key} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                    <label className="block text-sm font-medium text-gray-500 uppercase tracking-wider mb-1">
                                        {key}
                                    </label>
                                    <div className="flex items-center justify-between gap-4">
                                        <code className="text-sm font-mono text-blue-600 break-all">
                                            {value}
                                        </code>
                                        <button
                                            onClick={() => copyToClipboard(value)}
                                            className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
                                            title="Copy value"
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-5 w-5"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                                                />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* No parameters received */}
                {!loading && Object.keys(params).length === 0 && (
                    <p className="text-center text-gray-500 py-8">No parameters received.</p>
                )}

                <div className="mt-8 text-center">
                    <a
                        href="/"
                        className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                    >
                        Return to Home
                    </a>
                </div>
            </div>
        </div>
    );
}

export default function CallbackPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <CallbackContent />
        </Suspense>
    );
}
