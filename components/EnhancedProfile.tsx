'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { db } from '@/lib/firebase';
import { doc, updateDoc, getDoc, setDoc, collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { storage } from '@/lib/firebase';
import Image from 'next/image';
import Link from 'next/link';
import { FiEdit3, FiSettings, FiUser, FiBookOpen, FiHeart, FiEye, FiCalendar, FiTrendingUp, FiPlus, FiTrash2, FiStar, FiAward } from 'react-icons/fi';
// import { getUserPoints, getLevelInfo, getUnlockedAchievements, type UserPoints } from '@/lib/pointsSystem';

interface UserProfile {
    username: string;
    email: string;
    introduction: string;
    topics: string[];
    profileImageUrl: string | null;
    joinDate: string;
    totalPosts: number;
    totalViews: number;
    totalLikes: number;
    followers: number;
    following: number;
}

interface UserPost {
    id: string;
    title: string;
    slug?: string;
    content: string;
    createdAt: { toDate: () => Date };
    imageUrl?: string;
    category?: string;
    topic?: string;
    readingTime?: number;
    views?: number;
    likes?: number;
    published: boolean;
}

const EnhancedProfile = () => {
    const { user } = useUser();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('overview');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Profile data
    const [profile, setProfile] = useState<UserProfile>({
        username: '',
        email: '',
        introduction: '',
        topics: [],
        profileImageUrl: null,
        joinDate: '',
        totalPosts: 0,
        totalViews: 0,
        totalLikes: 0,
        followers: 0,
        following: 0
    });

    // User posts
    const [userPosts, setUserPosts] = useState<UserPost[]>([]);

    // Points and achievements
    // const [userPoints, setUserPoints] = useState<UserPoints | null>(null);

    // Form states
    const [isEditing, setIsEditing] = useState(false);
    const [profileImage, setProfileImage] = useState<File | null>(null);
    const [tempProfile, setTempProfile] = useState<UserProfile>(profile);
    const [settings, setSettings] = useState({
        emailNotifications: true,
        pushNotifications: true,
        profileVisibility: 'public',
        showEmail: false,
        allowComments: true,
        allowLikes: true
    });
    const [showImageUpload, setShowImageUpload] = useState(false);

    useEffect(() => {
        if (user) {
            fetchUserData();
        }
    }, [user]);

    const fetchUserData = async () => {
        if (!user) return;

        try {
            setLoading(true);

            // Fetch user profile
            const userRef = doc(db, 'users', user.id);
            const userDoc = await getDoc(userRef);

            if (userDoc.exists()) {
                const userData = userDoc.data();
                setProfile({
                    username: userData.username || user.username || '',
                    email: userData.email || user.emailAddresses[0]?.emailAddress || '',
                    introduction: userData.introduction || '',
                    topics: userData.topics || [],
                    profileImageUrl: userData.profileImageUrl || user.imageUrl || null,
                    joinDate: userData.joinDate || user.createdAt?.toLocaleDateString() || '',
                    totalPosts: userData.totalPosts || 0,
                    totalViews: userData.totalViews || 0,
                    totalLikes: userData.totalLikes || 0,
                    followers: userData.followers || 0,
                    following: userData.following || 0
                });

                // Load settings
                if (userData.settings) {
                    setSettings(userData.settings);
                }
                setTempProfile({
                    username: userData.username || user.username || '',
                    email: userData.email || user.emailAddresses[0]?.emailAddress || '',
                    introduction: userData.introduction || '',
                    topics: userData.topics || [],
                    profileImageUrl: userData.profileImageUrl || user.imageUrl || null,
                    joinDate: userData.joinDate || user.createdAt?.toLocaleDateString() || '',
                    totalPosts: userData.totalPosts || 0,
                    totalViews: userData.totalViews || 0,
                    totalLikes: userData.totalLikes || 0,
                    followers: userData.followers || 0,
                    following: userData.following || 0
                });
            } else {
                // Create new user profile
                const newProfile = {
                    username: user.username || '',
                    email: user.emailAddresses[0]?.emailAddress || '',
                    introduction: '',
                    topics: [],
                    profileImageUrl: user.imageUrl || null,
                    joinDate: user.createdAt?.toLocaleDateString() || new Date().toLocaleDateString(),
                    totalPosts: 0,
                    totalViews: 0,
                    totalLikes: 0,
                    followers: 0,
                    following: 0
                };
                await setDoc(userRef, newProfile);
                setProfile(newProfile);
                setTempProfile(newProfile);
            }

            // Fetch user posts
            const postsRef = collection(db, 'posts');
            const q = query(postsRef, where('author', '==', user.fullName || user.username || ''), orderBy('createdAt', 'desc'));
            const postsSnapshot = await getDocs(q);
            const posts = postsSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as UserPost[];

            setUserPosts(posts);

            // Fetch user points - commented out for now
            // const points = await getUserPoints(user.id);
            // setUserPoints(points);

            // Update stats
            const totalViews = posts.reduce((sum, post) => sum + (post.views || 0), 0);
            const totalLikes = posts.reduce((sum, post) => sum + (post.likes || 0), 0);

            setProfile(prev => ({
                ...prev,
                totalPosts: posts.length,
                totalViews,
                totalLikes
            }));

        } catch (error) {
            console.error('Error fetching user data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleImageUpload = async (file: File): Promise<string> => {
        if (!user) throw new Error('User is not defined');
        const storageRef = ref(storage, `profileImages/${user.id}`);
        await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(storageRef);
        return downloadURL;
    };

    const handleSaveProfile = async () => {
        if (!user) return;

        try {
            setSaving(true);
            const userRef = doc(db, 'users', user.id);

            const updates: any = {
                username: tempProfile.username,
                email: tempProfile.email,
                introduction: tempProfile.introduction,
                topics: tempProfile.topics
            };

            if (profileImage) {
                updates.profileImageUrl = await handleImageUpload(profileImage);
            }

            await updateDoc(userRef, updates);
            setProfile(tempProfile);
            setIsEditing(false);

        } catch (error) {
            console.error('Error updating profile:', error);
        } finally {
            setSaving(false);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setProfileImage(file);
            setTempProfile(prev => ({
                ...prev,
                profileImageUrl: URL.createObjectURL(file)
            }));
        }
    };

    const handleInputChange = (field: keyof UserProfile, value: string | string[]) => {
        setTempProfile(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSettingsChange = (field: string, value: any) => {
        setSettings(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const saveSettings = async () => {
        if (!user) return;

        try {
            setSaving(true);
            const userRef = doc(db, 'users', user.id);
            await updateDoc(userRef, { settings });
            alert('Settings saved successfully!');
        } catch (error) {
            console.error('Error saving settings:', error);
            alert('Error saving settings. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    const handleProfileImageChange = async () => {
        if (!profileImage || !user) return;

        try {
            setSaving(true);
            const imageUrl = await handleImageUpload(profileImage);
            const userRef = doc(db, 'users', user.id);
            await updateDoc(userRef, { profileImageUrl: imageUrl });

            setProfile(prev => ({ ...prev, profileImageUrl: imageUrl }));
            setTempProfile(prev => ({ ...prev, profileImageUrl: imageUrl }));
            setProfileImage(null);
            setShowImageUpload(false);
            alert('Profile picture updated successfully!');
        } catch (error) {
            console.error('Error updating profile picture:', error);
            alert('Error updating profile picture. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400">Loading profile...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
            <div className="w-full px-1">
                <div className="max-w-6xl mx-auto py-8">
                    {/* Profile Header */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 mb-8">
                        <div className="flex flex-col lg:flex-row items-start lg:items-center space-y-6 lg:space-y-0 lg:space-x-8">
                            {/* Profile Image */}
                            <div className="relative">
                                {tempProfile.profileImageUrl ? (
                                    <Image
                                        src={tempProfile.profileImageUrl}
                                        alt="Profile"
                                        width={120}
                                        height={120}
                                        className="w-30 h-30 rounded-full border-4 border-orange-500"
                                    />
                                ) : (
                                    <div className="w-30 h-30 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center border-4 border-orange-500">
                                        <span className="text-white font-bold text-4xl">
                                            {tempProfile.username.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                )}
                                <button
                                    onClick={() => setShowImageUpload(!showImageUpload)}
                                    className="absolute bottom-0 right-0 bg-orange-500 text-white p-2 rounded-full cursor-pointer hover:bg-orange-600 transition-colors"
                                >
                                    <FiEdit3 className="w-4 h-4" />
                                </button>
                            </div>

                            {/* Profile Image Upload Modal */}
                            {showImageUpload && (
                                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md w-full mx-4">
                                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Change Profile Picture</h3>

                                        <div className="mb-6">
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Select New Image
                                            </label>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleFileChange}
                                                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                            />
                                        </div>

                                        {profileImage && (
                                            <div className="mb-6">
                                                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Preview:</p>
                                                <Image
                                                    src={URL.createObjectURL(profileImage)}
                                                    alt="Preview"
                                                    width={100}
                                                    height={100}
                                                    className="w-25 h-25 rounded-full border-2 border-orange-500"
                                                />
                                            </div>
                                        )}

                                        <div className="flex space-x-3">
                                            <button
                                                onClick={handleProfileImageChange}
                                                disabled={!profileImage || saving}
                                                className="flex-1 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors disabled:opacity-50"
                                            >
                                                {saving ? 'Uploading...' : 'Update Picture'}
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setShowImageUpload(false);
                                                    setProfileImage(null);
                                                }}
                                                className="flex-1 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Profile Info */}
                            <div className="flex-1">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                                    <div>
                                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                                            {isEditing ? (
                                                <input
                                                    type="text"
                                                    value={tempProfile.username}
                                                    onChange={(e) => handleInputChange('username', e.target.value)}
                                                    className="bg-transparent border-b border-orange-500 focus:outline-none"
                                                />
                                            ) : (
                                                tempProfile.username
                                            )}
                                        </h1>
                                        <p className="text-gray-600 dark:text-gray-400">
                                            {isEditing ? (
                                                <input
                                                    type="email"
                                                    value={tempProfile.email}
                                                    onChange={(e) => handleInputChange('email', e.target.value)}
                                                    className="bg-transparent border-b border-orange-500 focus:outline-none w-full"
                                                />
                                            ) : (
                                                tempProfile.email
                                            )}
                                        </p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                            Joined {profile.joinDate}
                                        </p>
                                    </div>

                                    <div className="mt-4 sm:mt-0">
                                        {isEditing ? (
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={handleSaveProfile}
                                                    disabled={saving}
                                                    className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors disabled:opacity-50"
                                                >
                                                    {saving ? 'Saving...' : 'Save'}
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setIsEditing(false);
                                                        setTempProfile(profile);
                                                    }}
                                                    className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => setIsEditing(true)}
                                                className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors flex items-center space-x-2"
                                            >
                                                <FiEdit3 className="w-4 h-4" />
                                                <span>Edit Profile</span>
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* Bio */}
                                <div className="mb-6">
                                    {isEditing ? (
                                        <textarea
                                            value={tempProfile.introduction}
                                            onChange={(e) => handleInputChange('introduction', e.target.value)}
                                            placeholder="Tell us about yourself..."
                                            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                            rows={3}
                                        />
                                    ) : (
                                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                            {profile.introduction || "No bio yet. Click 'Edit Profile' to add one."}
                                        </p>
                                    )}
                                </div>

                                {/* Topics */}
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Interests</h3>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            value={tempProfile.topics.join(', ')}
                                            onChange={(e) => handleInputChange('topics', e.target.value.split(',').map(t => t.trim()))}
                                            placeholder="Technology, Writing, Design..."
                                            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                        />
                                    ) : (
                                        <div className="flex flex-wrap gap-2">
                                            {profile.topics.length > 0 ? (
                                                profile.topics.map((topic, index) => (
                                                    <span
                                                        key={index}
                                                        className="bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200 px-3 py-1 rounded-full text-sm"
                                                    >
                                                        {topic}
                                                    </span>
                                                ))
                                            ) : (
                                                <span className="text-gray-500 dark:text-gray-400 text-sm">No interests added yet</span>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-6 mb-8">
                        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg text-center">
                            <FiBookOpen className="w-8 h-8 text-orange-500 mx-auto mb-2" />
                            <div className="text-2xl font-bold text-gray-900 dark:text-white">{profile.totalPosts}</div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">Posts</div>
                        </div>
                        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg text-center">
                            <FiEye className="w-8 h-8 text-orange-500 mx-auto mb-2" />
                            <div className="text-2xl font-bold text-gray-900 dark:text-white">{profile.totalViews.toLocaleString()}</div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">Views</div>
                        </div>
                        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg text-center">
                            <FiHeart className="w-8 h-8 text-orange-500 mx-auto mb-2" />
                            <div className="text-2xl font-bold text-gray-900 dark:text-white">{profile.totalLikes.toLocaleString()}</div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">Likes</div>
                        </div>
                        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg text-center">
                            <FiStar className="w-8 h-8 text-orange-500 mx-auto mb-2" />
                            <div className="text-2xl font-bold text-gray-900 dark:text-white">0</div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">Points</div>
                        </div>
                        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg text-center">
                            <FiAward className="w-8 h-8 text-orange-500 mx-auto mb-2" />
                            <div className="text-2xl font-bold text-gray-900 dark:text-white">0</div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">Achievements</div>
                        </div>
                    </div>

                    {/* Level Display - Commented out until points system is implemented */}
                    {/* {userPoints && (
                        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-6 text-white mb-8">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-xl font-bold mb-2">Reader Level</h3>
                                    <div className="flex items-center space-x-3">
                                        <span className="text-3xl font-bold">Level {userPoints.level}</span>
                                        <span className="text-orange-100 text-lg">{getLevelInfo(userPoints.level).name}</span>
                                    </div>
                                    <p className="text-orange-100 mt-2">{userPoints.totalPoints} total points earned</p>
                                </div>
                                <div className="text-right">
                                    <div className="text-4xl mb-2">{getLevelInfo(userPoints.level).name === 'Legend' ? '👑' : '⭐'}</div>
                                    <div className="text-sm text-orange-100">
                                        {userPoints.readCount} posts read
                                    </div>
                                </div>
                            </div>
                        </div>
                    )} */}

                    {/* Tabs */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
                        <div className="border-b border-gray-200 dark:border-gray-700">
                            <nav className="flex space-x-8 px-8">
                                {[
                                    { id: 'overview', label: 'Overview', icon: FiUser },
                                    { id: 'posts', label: 'My Posts', icon: FiBookOpen },
                                    { id: 'settings', label: 'Settings', icon: FiSettings }
                                ].map((tab) => {
                                    const Icon = tab.icon;
                                    return (
                                        <button
                                            key={tab.id}
                                            onClick={() => setActiveTab(tab.id)}
                                            className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors ${activeTab === tab.id
                                                ? 'border-orange-500 text-orange-600'
                                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                                }`}
                                        >
                                            <Icon className="w-4 h-4" />
                                            <span>{tab.label}</span>
                                        </button>
                                    );
                                })}
                            </nav>
                        </div>

                        <div className="p-8">
                            {activeTab === 'overview' && (
                                <div className="space-y-6">
                                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Recent Activity</h3>
                                    <div className="space-y-4">
                                        {userPosts.slice(0, 3).map((post) => (
                                            <div key={post.id} className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                                <div className="flex-shrink-0">
                                                    {post.imageUrl ? (
                                                        <Image
                                                            src={post.imageUrl}
                                                            alt={post.title}
                                                            width={60}
                                                            height={60}
                                                            className="w-15 h-15 rounded-lg object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-15 h-15 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                                                            <FiBookOpen className="w-6 h-6 text-white" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <Link href={`/blog/${post.slug || post.id}`} className="text-gray-900 dark:text-white hover:text-orange-600 dark:hover:text-orange-400 font-medium">
                                                        {post.title}
                                                    </Link>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                                        {post.views || 0} views • {post.likes || 0} likes • {post.createdAt.toDate().toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {activeTab === 'posts' && (
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">My Posts</h3>
                                        <Link
                                            href="/stories"
                                            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors flex items-center space-x-2"
                                        >
                                            <FiPlus className="w-4 h-4" />
                                            <span>New Post</span>
                                        </Link>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {userPosts.map((post) => (
                                            <div key={post.id} className="bg-gray-50 dark:bg-gray-700 rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
                                                <Link href={`/blog/${post.slug || post.id}`}>
                                                    {post.imageUrl ? (
                                                        <Image
                                                            src={post.imageUrl}
                                                            alt={post.title}
                                                            width={300}
                                                            height={200}
                                                            className="w-full h-48 object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-48 bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
                                                            <FiBookOpen className="w-12 h-12 text-white" />
                                                        </div>
                                                    )}
                                                </Link>
                                                <div className="p-4">
                                                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                                                        {post.title}
                                                    </h4>
                                                    <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                                                        <span>{post.views || 0} views</span>
                                                        <span>{post.likes || 0} likes</span>
                                                        <span>{post.createdAt.toDate().toLocaleDateString()}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {activeTab === 'settings' && (
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Account Settings</h3>
                                        <button
                                            onClick={saveSettings}
                                            disabled={saving}
                                            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors disabled:opacity-50"
                                        >
                                            {saving ? 'Saving...' : 'Save Settings'}
                                        </button>
                                    </div>

                                    <div className="space-y-6">
                                        {/* Notification Settings */}
                                        <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
                                            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Notifications</h4>
                                            <div className="space-y-4">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <label className="text-sm font-medium text-gray-900 dark:text-white">Email Notifications</label>
                                                        <p className="text-sm text-gray-600 dark:text-gray-400">Receive updates via email</p>
                                                    </div>
                                                    <label className="relative inline-flex items-center cursor-pointer">
                                                        <input
                                                            type="checkbox"
                                                            checked={settings.emailNotifications}
                                                            onChange={(e) => handleSettingsChange('emailNotifications', e.target.checked)}
                                                            className="sr-only peer"
                                                        />
                                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 dark:peer-focus:ring-orange-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-orange-500"></div>
                                                    </label>
                                                </div>

                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <label className="text-sm font-medium text-gray-900 dark:text-white">Push Notifications</label>
                                                        <p className="text-sm text-gray-600 dark:text-gray-400">Receive browser notifications</p>
                                                    </div>
                                                    <label className="relative inline-flex items-center cursor-pointer">
                                                        <input
                                                            type="checkbox"
                                                            checked={settings.pushNotifications}
                                                            onChange={(e) => handleSettingsChange('pushNotifications', e.target.checked)}
                                                            className="sr-only peer"
                                                        />
                                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 dark:peer-focus:ring-orange-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-orange-500"></div>
                                                    </label>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Privacy Settings */}
                                        <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
                                            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Privacy</h4>
                                            <div className="space-y-4">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <label className="text-sm font-medium text-gray-900 dark:text-white">Profile Visibility</label>
                                                        <p className="text-sm text-gray-600 dark:text-gray-400">Who can see your profile</p>
                                                    </div>
                                                    <select
                                                        value={settings.profileVisibility}
                                                        onChange={(e) => handleSettingsChange('profileVisibility', e.target.value)}
                                                        className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                                                    >
                                                        <option value="public">Public</option>
                                                        <option value="followers">Followers Only</option>
                                                        <option value="private">Private</option>
                                                    </select>
                                                </div>

                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <label className="text-sm font-medium text-gray-900 dark:text-white">Show Email</label>
                                                        <p className="text-sm text-gray-600 dark:text-gray-400">Display email on profile</p>
                                                    </div>
                                                    <label className="relative inline-flex items-center cursor-pointer">
                                                        <input
                                                            type="checkbox"
                                                            checked={settings.showEmail}
                                                            onChange={(e) => handleSettingsChange('showEmail', e.target.checked)}
                                                            className="sr-only peer"
                                                        />
                                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 dark:peer-focus:ring-orange-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-orange-500"></div>
                                                    </label>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Content Settings */}
                                        <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
                                            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Content</h4>
                                            <div className="space-y-4">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <label className="text-sm font-medium text-gray-900 dark:text-white">Allow Comments</label>
                                                        <p className="text-sm text-gray-600 dark:text-gray-400">Let others comment on your posts</p>
                                                    </div>
                                                    <label className="relative inline-flex items-center cursor-pointer">
                                                        <input
                                                            type="checkbox"
                                                            checked={settings.allowComments}
                                                            onChange={(e) => handleSettingsChange('allowComments', e.target.checked)}
                                                            className="sr-only peer"
                                                        />
                                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 dark:peer-focus:ring-orange-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-orange-500"></div>
                                                    </label>
                                                </div>

                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <label className="text-sm font-medium text-gray-900 dark:text-white">Allow Likes</label>
                                                        <p className="text-sm text-gray-600 dark:text-gray-400">Let others like your posts</p>
                                                    </div>
                                                    <label className="relative inline-flex items-center cursor-pointer">
                                                        <input
                                                            type="checkbox"
                                                            checked={settings.allowLikes}
                                                            onChange={(e) => handleSettingsChange('allowLikes', e.target.checked)}
                                                            className="sr-only peer"
                                                        />
                                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 dark:peer-focus:ring-orange-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-orange-500"></div>
                                                    </label>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Account Actions */}
                                        <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
                                            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Account Actions</h4>
                                            <div className="space-y-3">
                                                <button className="w-full text-left p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors">
                                                    Change Password
                                                </button>
                                                <button className="w-full text-left p-3 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400 rounded-lg hover:bg-yellow-100 dark:hover:bg-yellow-900/30 transition-colors">
                                                    Export Data
                                                </button>
                                                <button className="w-full text-left p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors">
                                                    Delete Account
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EnhancedProfile;
