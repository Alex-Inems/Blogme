'use client';

interface SkeletonProps {
    className?: string;
}

export const PostCardSkeleton = ({ className = '' }: SkeletonProps) => {
    return (
        <div className={`bg-white dark:bg-zinc-900 rounded-xl shadow-md overflow-hidden animate-pulse ${className}`}>
            <div className="w-full h-48 bg-gray-200 dark:bg-zinc-800"></div>
            <div className="p-6 space-y-4">
                <div className="h-6 bg-gray-200 dark:bg-zinc-800 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 dark:bg-zinc-800 rounded w-full"></div>
                <div className="h-4 bg-gray-200 dark:bg-zinc-800 rounded w-5/6"></div>
                <div className="flex items-center space-x-4 pt-4">
                    <div className="w-10 h-10 bg-gray-200 dark:bg-zinc-800 rounded-full"></div>
                    <div className="space-y-2 flex-1">
                        <div className="h-3 bg-gray-200 dark:bg-zinc-800 rounded w-1/4"></div>
                        <div className="h-3 bg-gray-200 dark:bg-zinc-800 rounded w-1/3"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const PostListSkeleton = ({ count = 6 }: { count?: number }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: count }).map((_, i) => (
                <PostCardSkeleton key={i} />
            ))}
        </div>
    );
};

export const PostDetailSkeleton = () => {
    return (
        <div className="max-w-4xl mx-auto p-6 space-y-6 animate-pulse">
            <div className="h-10 bg-gray-200 dark:bg-zinc-800 rounded w-3/4"></div>
            <div className="w-full h-64 bg-gray-200 dark:bg-zinc-800 rounded-lg"></div>
            <div className="space-y-3">
                <div className="h-4 bg-gray-200 dark:bg-zinc-800 rounded w-full"></div>
                <div className="h-4 bg-gray-200 dark:bg-zinc-800 rounded w-full"></div>
                <div className="h-4 bg-gray-200 dark:bg-zinc-800 rounded w-5/6"></div>
                <div className="h-4 bg-gray-200 dark:bg-zinc-800 rounded w-full"></div>
                <div className="h-4 bg-gray-200 dark:bg-zinc-800 rounded w-4/5"></div>
            </div>
        </div>
    );
};

export const ProfileSkeleton = () => {
    return (
        <div className="animate-pulse space-y-6">
            <div className="flex items-center space-x-4">
                <div className="w-24 h-24 bg-gray-200 dark:bg-zinc-800 rounded-full"></div>
                <div className="space-y-3 flex-1">
                    <div className="h-6 bg-gray-200 dark:bg-zinc-800 rounded w-1/3"></div>
                    <div className="h-4 bg-gray-200 dark:bg-zinc-800 rounded w-1/2"></div>
                </div>
            </div>
            <div className="space-y-4">
                <div className="h-4 bg-gray-200 dark:bg-zinc-800 rounded w-full"></div>
                <div className="h-4 bg-gray-200 dark:bg-zinc-800 rounded w-5/6"></div>
            </div>
        </div>
    );
};

export const FormSkeleton = () => {
    return (
        <div className="space-y-6 animate-pulse">
            <div className="h-12 bg-gray-200 dark:bg-zinc-800 rounded"></div>
            <div className="h-32 bg-gray-200 dark:bg-zinc-800 rounded"></div>
            <div className="h-12 bg-gray-200 dark:bg-zinc-800 rounded w-1/4"></div>
        </div>
    );
};

