'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useUser } from '@clerk/nextjs';
import { getNotifications, markNotificationAsRead, markAllNotificationsAsRead, getUnreadNotificationCount } from '@/lib/notifications';
import { FiBell, FiX } from 'react-icons/fi';
import Link from 'next/link';

const NotificationsDropdown = () => {
    const { user } = useUser();
    const [notifications, setNotifications] = useState<any[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const fetchNotifications = useCallback(async () => {
        if (!user) return;

        setLoading(true);
        try {
            const notifs = await getNotifications(user.id, 10);
            setNotifications(notifs);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        } finally {
            setLoading(false);
        }
    }, [user]);

    const fetchUnreadCount = useCallback(async () => {
        if (!user) return;

        try {
            const count = await getUnreadNotificationCount(user.id);
            setUnreadCount(count);
        } catch (error) {
            console.error('Error fetching unread count:', error);
        }
    }, [user]);

    useEffect(() => {
        if (user) {
            fetchNotifications();
            fetchUnreadCount();

            // Refresh every 30 seconds
            const interval = setInterval(() => {
                fetchNotifications();
                fetchUnreadCount();
            }, 30000);

            return () => clearInterval(interval);
        }
    }, [user, fetchNotifications, fetchUnreadCount]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    const handleMarkAsRead = async (notificationId: string) => {
        try {
            await markNotificationAsRead(notificationId);
            setNotifications(prev =>
                prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
            );
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    const handleMarkAllAsRead = async () => {
        if (!user) return;

        try {
            await markAllNotificationsAsRead(user.id);
            setNotifications(prev => prev.map(n => ({ ...n, read: true })));
            setUnreadCount(0);
        } catch (error) {
            console.error('Error marking all as read:', error);
        }
    };

    const getNotificationIcon = (type: string) => {
        switch (type) {
            case 'like':
                return '❤️';
            case 'comment':
                return '💬';
            case 'follow':
                return '👤';
            default:
                return '🔔';
        }
    };

    if (!user) return null;

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => {
                    setIsOpen(!isOpen);
                    if (!isOpen) {
                        fetchNotifications();
                    }
                }}
                className="relative p-2 text-gray-700 dark:text-zinc-300 hover:text-orange-500 dark:hover:text-orange-400 transition-colors"
            >
                <FiBell className="w-6 h-6" />
                {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-zinc-900 rounded-xl shadow-2xl border border-gray-200 dark:border-zinc-800 z-50 max-h-96 overflow-hidden flex flex-col">
                    <div className="p-4 border-b border-gray-200 dark:border-zinc-800 flex items-center justify-between">
                        <h3 className="font-bold text-gray-900 dark:text-zinc-50">Notifications</h3>
                        <div className="flex items-center gap-2">
                            {unreadCount > 0 && (
                                <button
                                    onClick={handleMarkAllAsRead}
                                    className="text-xs text-orange-500 dark:text-orange-400 hover:underline"
                                >
                                    Mark all read
                                </button>
                            )}
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-gray-500 dark:text-zinc-400 hover:text-gray-700 dark:hover:text-zinc-200"
                            >
                                <FiX className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    <div className="overflow-y-auto flex-1">
                        {loading ? (
                            <div className="p-4 text-center text-gray-500 dark:text-zinc-400">
                                Loading...
                            </div>
                        ) : notifications.length === 0 ? (
                            <div className="p-4 text-center text-gray-500 dark:text-zinc-400">
                                No notifications
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-200 dark:divide-zinc-800">
                                {notifications.map((notification) => (
                                    <div
                                        key={notification.id}
                                        onClick={() => {
                                            if (!notification.read) {
                                                handleMarkAsRead(notification.id);
                                            }
                                        }}
                                        className={`p-4 hover:bg-gray-50 dark:hover:bg-zinc-800 cursor-pointer transition-colors ${!notification.read ? 'bg-orange-50 dark:bg-orange-900/10' : ''
                                            }`}
                                    >
                                        <div className="flex items-start gap-3">
                                            <span className="text-2xl">{getNotificationIcon(notification.type)}</span>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm text-gray-900 dark:text-zinc-50">
                                                    {notification.message}
                                                </p>
                                                <p className="text-xs text-gray-500 dark:text-zinc-400 mt-1">
                                                    {new Date(notification.createdAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                            {!notification.read && (
                                                <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {notifications.length > 0 && (
                        <div className="p-3 border-t border-gray-200 dark:border-zinc-800">
                            <Link
                                href="/notifications"
                                onClick={() => setIsOpen(false)}
                                className="block text-center text-sm text-orange-500 dark:text-orange-400 hover:underline"
                            >
                                View all notifications
                            </Link>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default NotificationsDropdown;

