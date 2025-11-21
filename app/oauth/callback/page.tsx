'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';

function CallbackContent() {
    const searchParams = useSearchParams();
    const [params, setParams] = useState<{ [key: string]: string }>({});

    useEffect(() => {
        const entries = Array.from(searchParams.entries());
        const paramsObj: { [key: string]: string } = {};
        entries.forEach(([key, value]) => {
            paramsObj[key] = value;
        });
        setParams(paramsObj);
    }, [searchParams]);

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        alert('Copied to clipboard!');
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8 flex flex-col items-center justify-center">
            <div className="max-w-2xl w-full bg-white rounded-xl shadow-lg p-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">
                    OAuth Callback Received
                </h1>

                <div className="space-y-6">
                    {Object.keys(params).length === 0 ? (
                        <p className="text-center text-gray-500">No parameters received.</p>
                    ) : (
                        Object.entries(params).map(([key, value]) => (
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
                                        className="text-gray-400 hover:text-gray-600 transition-colors"
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
                        ))
                    )}
                </div>

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
