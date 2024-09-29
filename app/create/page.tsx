// pages/CreatePost.tsx
'use client';

import { useState, useEffect } from 'react';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { db, storage } from '@/lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { HiPlus } from 'react-icons/hi';
import CreatePostNavbar from '@/components/CreatePostNavbar';
import Image from 'next/image';

interface PostData {
    title: string;
    content: string;
    author: string;
    createdAt: Timestamp;
    imageUrl: string | null;
}

const CreatePost: React.FC = () => {
    const { user, isLoaded, isSignedIn } = useUser();
    const [title, setTitle] = useState<string>('');
    const [content, setContent] = useState<string>('');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [elements, setElements] = useState<File[]>([]); // Only images now
    const router = useRouter();

    // Redirect to login if the user is not signed in
    useEffect(() => {
        if (isLoaded && !isSignedIn) {
            router.push('/sign-in'); // Redirect to the sign-in page
        }
    }, [isLoaded, isSignedIn, router]);

    const handleImageUpload = async (file: File): Promise<string | null> => {
        if (!file) return null;
        const storageRef = ref(storage, `images/${file.name}`);
        await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(storageRef);
        return downloadURL;
    };

    const handleSubmit = async (): Promise<void> => {
        let imageUrl: string | null = null;
        if (imageFile) {
            imageUrl = await handleImageUpload(imageFile);
        }

        const postData: PostData = {
            title,
            content,
            author: user?.fullName || user?.firstName || user?.username || 'Anonymous', // Prioritize available name fields
            createdAt: Timestamp.fromDate(new Date()),
            imageUrl: imageUrl || null,
        };

        await addDoc(collection(db, 'posts'), postData);
        router.push('/'); // Redirect to homepage after submission
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const files = e.target.files;
        if (files && files.length > 0) {
            setImageFile(files[0]);
            setElements((prev) => [...prev, files[0]]); // Only add image files to the elements array
        }
    };

    if (!isLoaded || !isSignedIn) {
        return <div>Loading...</div>; // Display loading state or a message while the user data is being loaded
    }

    return (
        <div className="flex flex-col min-h-screen p-4 bg-gray-50 mt-20">
            <CreatePostNavbar onSubmit={handleSubmit} /> {/* Pass submit function */}
            <h1 className="text-4xl font-bold mb-4">Create a New Post</h1>
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmit();
                }}
                className="w-full max-w-4xl mx-auto p-6 "
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
                        required
                        className="hidden"
                    />

                    <textarea
                        placeholder="Write Blog"
                        id="content"
                        value={content}
                        onChange={(e) => setContent(e.target.value)} // Just update the content, no need to add to elements array
                        required
                        className="w-full py-2 px-3 text-gray-700 focus:outline-none bg-inherit"
                    />
                </div>

                <div className="mt-4">
                    {elements.map((element, index) => (
                        <Image
                            key={index}
                            src={URL.createObjectURL(element)}
                            alt="Selected Preview"
                            className="max-w-full h-auto border rounded-md my-2"
                            width={100}
                            height={100} // Add height to avoid warning
                        />
                    ))}
                </div>

                <div className="flex items-center justify-between">
                    <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none md:hidden lg:hidden"
                    >
                        Create Post
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreatePost;
