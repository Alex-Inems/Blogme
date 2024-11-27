'use client';

import { useState, useEffect } from 'react';
import { collection, addDoc, doc, getDoc, Timestamp } from 'firebase/firestore';
import { db, storage } from '@/lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { HiPlus } from 'react-icons/hi';
import CreatePostNavbar from '@/components/CreatePostNavbar';
import Image from 'next/image';
import DOMPurify from 'dompurify';

interface PostData {
    title: string;
    content: string;
    author: string;
    createdAt: Timestamp;
    imageUrl: string | null;
    authorProfileImage: string | null;
    readingTime?: number; // Add reading time property
}

const CreatePost: React.FC = () => {
    const { user, isLoaded, isSignedIn } = useUser();
    const [title, setTitle] = useState<string>('');
    const [content, setContent] = useState<string>('');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        const fetchUserProfileImage = async () => {
            if (user?.id) {
                const userDocRef = doc(db, 'users', user.id);
                const userDoc = await getDoc(userDocRef);
                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    setProfileImageUrl(userData?.profileImageUrl || '/default-profile.png');
                }
            }
        };

        if (isLoaded && isSignedIn) {
            fetchUserProfileImage();
        }
    }, [isLoaded, isSignedIn, user?.id]);

    const handleImageUpload = async (file: File): Promise<string | null> => {
        if (!file) return null;
        const storageRef = ref(storage, `images/${file.name}`);
        await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(storageRef);
        return downloadURL;
    };

    const calculateReadingTime = (content: string): number => {
        const words = content.trim().split(/\s+/).length;
        return Math.ceil(words / 250); // Average reading speed of 250 words per minute
    };

    const handleSubmit = async (): Promise<void> => {
        let imageUrl: string | null = null;
        if (imageFile) {
            imageUrl = await handleImageUpload(imageFile);
        }

        const sanitizedContent = DOMPurify.sanitize(content);
        const readingTime = calculateReadingTime(sanitizedContent); // Calculate reading time

        const postData: PostData = {
            title,
            content: sanitizedContent,
            author: user?.fullName || user?.firstName || user?.username || 'Anonymous',
            createdAt: Timestamp.fromDate(new Date()),
            imageUrl: imageUrl || null,
            authorProfileImage: profileImageUrl,
            readingTime, // Include reading time
        };

        await addDoc(collection(db, 'posts'), postData);
        router.push('/');
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const files = e.target.files;
        if (files && files.length > 0) {
            setImageFile(files[0]);
        }
    };

    if (!isLoaded || !isSignedIn) {
        return <div>Loading...</div>;
    }

    return (
        <div className="dark:bg-gray-950 dark:text-white  flex flex-col min-h-screen p-4 bg-gray-50 mt-20">
            <CreatePostNavbar onSubmit={handleSubmit} />
            <h1 className="mt-20 text-4xl font-bold mb-4">Create a New Post</h1>
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmit();
                }}
                className="w-full max-w-4xl mx-auto p-6"
            >
                <div className="mb-4">
                    <input
                        placeholder="Title"
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        className="w-full py-2 px-3 text-gray-700 text-2xl bg-inherit focus:outline-none"
                    />
                </div>

                <div className="flex items-start mb-4">
                    <label
                        htmlFor="image"
                        className="mr-2 cursor-pointer text-gray-500 flex items-center justify-center w-10 h-10 rounded-full border border-gray-300"
                    >
                        <HiPlus size={24} />
                    </label>
                    <input
                        type="file"
                        accept="image/*"
                        id="image"
                        onChange={handleImageChange}
                        className="hidden"
                    />

                    <textarea
                        placeholder="Write Blog"
                        id="content"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        required
                        className="w-full py-2 px-3 text-gray-700 focus:outline-none bg-inherit"
                    />
                </div>

                {imageFile && (
                    <div className="mt-4">
                        <Image
                            src={URL.createObjectURL(imageFile)}
                            alt="Selected Preview"
                            className="max-w-full h-auto border rounded-md my-2"
                            width={100}
                            height={100}
                        />
                    </div>
                )}

                <div className="flex items-center justify-between">
                    <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none"
                    >
                        Create Post
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreatePost;
