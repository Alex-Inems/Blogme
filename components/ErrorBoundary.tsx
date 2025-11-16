'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { FiAlertCircle, FiRefreshCw, FiHome } from 'react-icons/fi';
import Link from 'next/link';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
        };
    }

    static getDerivedStateFromError(error: Error): State {
        return {
            hasError: true,
            error,
        };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    handleReset = () => {
        this.setState({
            hasError: false,
            error: null,
        });
    };

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 flex items-center justify-center p-4">
                    <div className="max-w-md w-full bg-white dark:bg-zinc-900 rounded-2xl shadow-xl p-8 text-center">
                        <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FiAlertCircle className="w-8 h-8 text-red-500 dark:text-red-400" />
                        </div>

                        <h1 className="text-2xl font-bold text-gray-900 dark:text-zinc-50 mb-2">
                            Something went wrong
                        </h1>

                        <p className="text-gray-600 dark:text-zinc-400 mb-6">
                            We encountered an unexpected error. Please try refreshing the page or return to the homepage.
                        </p>

                        {this.state.error && process.env.NODE_ENV === 'development' && (
                            <div className="mb-6 p-4 bg-gray-100 dark:bg-zinc-800 rounded-lg text-left">
                                <p className="text-sm font-mono text-red-600 dark:text-red-400 break-all">
                                    {this.state.error.toString()}
                                </p>
                            </div>
                        )}

                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <button
                                onClick={this.handleReset}
                                className="inline-flex items-center justify-center px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl transition-colors duration-200"
                            >
                                <FiRefreshCw className="w-5 h-5 mr-2" />
                                Try Again
                            </button>

                            <Link
                                href="/"
                                className="inline-flex items-center justify-center px-6 py-3 bg-gray-200 dark:bg-zinc-800 hover:bg-gray-300 dark:hover:bg-zinc-700 text-gray-900 dark:text-zinc-50 font-semibold rounded-xl transition-colors duration-200"
                            >
                                <FiHome className="w-5 h-5 mr-2" />
                                Go Home
                            </Link>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;

