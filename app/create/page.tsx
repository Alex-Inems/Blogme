'use client';

import { useState, useEffect } from 'react';
import { collection, addDoc, doc, getDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { uploadImage, uploadVideo } from '@/lib/cloudinary-upload';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { HiOutlinePhotograph, HiOutlineVideoCamera, HiOutlineSave, HiOutlineCalendar } from 'react-icons/hi';
import { toast } from 'sonner';
import RichTextEditor from '@/components/RichTextEditor';
import Image from 'next/image';
import DOMPurify from 'dompurify';

interface PostData {
  title: string;
  content: string;
  author: string;
  authorId?: string; // Clerk user ID for following functionality
  createdAt: Timestamp;
  imageUrl: string | null;
  videoUrl: string | null;
  authorProfileImage: string | null;
  readingTime?: number;
  category?: string;
  tags?: string[];
  published?: boolean;
  isDraft?: boolean;
  scheduledAt?: Timestamp | null;
}

const CreatePost: React.FC = () => {
  const { user, isLoaded, isSignedIn } = useUser();
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [category, setCategory] = useState<string>('');
  const [tags, setTags] = useState<string>('');
  const [scheduledAt, setScheduledAt] = useState<string>('');
  const router = useRouter();

  const categories = [
    'Technology',
    'Lifestyle',
    'Travel',
    'Food',
    'Health',
    'Business',
    'Education',
    'Entertainment',
    'Sports',
    'Science',
    'Art',
    'Other'
  ];

  useEffect(() => {
    const fetchUserProfileImage = async () => {
      if (user?.id) {
        try {
          const userDocRef = doc(db, 'users', user.id);
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setProfileImageUrl(userData?.profileImageUrl || '/default-profile.png');
          }
        } catch (error) {
          console.error('Error fetching user profile image:', error);
        }
      }
    };

    if (isLoaded && isSignedIn) {
      fetchUserProfileImage();
    }
  }, [isLoaded, isSignedIn, user?.id]);

  const handleFileUpload = async (file: File, folder: string, isVideo: boolean = false): Promise<string | null> => {
    if (!file) return null;
    try {
      const uploadFunction = isVideo ? uploadVideo : uploadImage;
      const url = await uploadFunction(file, folder, (progress) => {
        setProgress(progress);
      });
      return url;
    } catch (error) {
      console.error(`Error uploading ${folder} file:`, error);
      return null;
    }
  };

  const calculateReadingTime = (text: string): number => {
    const wordCount = text.trim().split(/\s+/).length;
    return Math.ceil(wordCount / 250); // Average reading speed of 250 words/min
  };

  const handleSubmit = async (publish: boolean = true): Promise<void> => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    setProgress(0);

    try {
      let imageUrl: string | null = null;
      let videoUrl: string | null = null;

      if (imageFile) {
        imageUrl = await handleFileUpload(imageFile, 'images', false);
      }

      if (videoFile) {
        videoUrl = await handleFileUpload(videoFile, 'videos', true);
      }

      const sanitizedContent = DOMPurify.sanitize(content);
      const readingTime = calculateReadingTime(sanitizedContent);

      // Parse tags
      const tagsArray = tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);

      // Parse scheduled date
      let scheduledTimestamp: Timestamp | null = null;
      if (scheduledAt && !publish) {
        scheduledTimestamp = Timestamp.fromDate(new Date(scheduledAt));
      }

      const postData: PostData = {
        title,
        content: sanitizedContent,
        author: user?.fullName || user?.username || 'Anonymous',
        authorId: user?.id, // Store Clerk user ID for following functionality
        createdAt: Timestamp.fromDate(new Date()),
        imageUrl,
        videoUrl,
        authorProfileImage: profileImageUrl,
        readingTime,
        category: category || undefined,
        tags: tagsArray.length > 0 ? tagsArray : undefined,
        published: publish,
        isDraft: !publish,
        scheduledAt: scheduledTimestamp,
      };

      await addDoc(collection(db, 'posts'), postData);

      if (publish) {
        toast.success('Post published!', {
          description: 'Your post has been published and is now live.',
        });
        router.push('/');
      } else {
        toast.success('Draft saved!', {
          description: 'Your draft has been saved. You can publish it later.',
        });
        router.push('/stories');
      }
    } catch (error) {
      console.error('Error creating post:', error);
      toast.error('Error saving post', {
        description: 'Please try again. If the problem persists, contact support.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveDraft = async (): Promise<void> => {
    await handleSubmit(false);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0];
    if (file) setImageFile(file);
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0];
    if (file) {
      const videoElement = document.createElement('video');
      videoElement.src = URL.createObjectURL(file);

      videoElement.onloadedmetadata = () => {
        const durationInSeconds = videoElement.duration;

        if (durationInSeconds > 1200) {
          toast.error('Video too long', {
            description: 'Video duration must be less than 20 minutes.',
          });
          return;
        }

        setVideoFile(file);
      };

      videoElement.onerror = () => {
        toast.error('Error loading video', {
          description: 'Please try another file or check if the file is corrupted.',
        });
      };
    }
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-zinc-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 flex items-center justify-center p-4">
        <div className="max-w-md mx-auto text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-zinc-50 mb-4">Sign In Required</h1>
          <p className="text-gray-600 dark:text-zinc-400 mb-6">Please sign in to create a post.</p>
          <button
            onClick={() => router.push('/sign-in')}
            className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-6 rounded-lg transition-colors"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="dark:bg-zinc-950 dark:text-zinc-50 flex flex-col min-h-screen p-4 bg-gray-50">
      <div className="w-full max-w-4xl mx-auto p-6 mt-8">
        <h1 className="text-4xl font-bold mb-6 text-gray-900 dark:text-zinc-50">Create a New Post</h1>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
          className="space-y-6"
        >
          <div>
            <input
              placeholder="Enter post title..."
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full py-3 px-4 text-2xl font-semibold text-gray-900 dark:text-zinc-50 bg-white dark:bg-zinc-900 border-2 border-gray-200 dark:border-zinc-700 rounded-xl focus:outline-none focus:border-orange-500 dark:focus:border-orange-500 transition-colors"
            />
          </div>

          <div className="flex items-center gap-3 mb-4">
            <label
              htmlFor="image"
              className="cursor-pointer text-gray-600 dark:text-zinc-400 hover:text-orange-500 dark:hover:text-orange-400 flex items-center justify-center w-12 h-12 rounded-full border-2 border-gray-300 dark:border-zinc-700 hover:border-orange-500 dark:hover:border-orange-500 transition-colors"
              title="Upload Image"
            >
              <HiOutlinePhotograph size={24} />
            </label>
            <input
              type="file"
              accept="image/*"
              id="image"
              onChange={handleImageChange}
              className="hidden"
            />

            <label
              htmlFor="video"
              className="cursor-pointer text-gray-600 dark:text-zinc-400 hover:text-orange-500 dark:hover:text-orange-400 flex items-center justify-center w-12 h-12 rounded-full border-2 border-gray-300 dark:border-zinc-700 hover:border-orange-500 dark:hover:border-orange-500 transition-colors"
              title="Upload Video"
            >
              <HiOutlineVideoCamera size={24} />
            </label>
            <input
              type="file"
              accept="video/*"
              id="video"
              onChange={handleVideoChange}
              className="hidden"
            />
          </div>

          <div>
            <label htmlFor="content" className="block text-sm font-semibold text-gray-700 dark:text-zinc-300 mb-2">
              Content
            </label>
            <RichTextEditor
              value={content}
              onChange={setContent}
              placeholder="Write your blog post content here..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="category" className="block text-sm font-semibold text-gray-700 dark:text-zinc-300 mb-2">
                Category
              </label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full py-3 px-4 text-gray-900 dark:text-zinc-50 bg-white dark:bg-zinc-900 border-2 border-gray-200 dark:border-zinc-700 rounded-xl focus:outline-none focus:border-orange-500 dark:focus:border-orange-500 transition-colors"
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="tags" className="block text-sm font-semibold text-gray-700 dark:text-zinc-300 mb-2">
                Tags (comma-separated)
              </label>
              <input
                type="text"
                id="tags"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="e.g., technology, programming, web"
                className="w-full py-3 px-4 text-gray-900 dark:text-zinc-50 bg-white dark:bg-zinc-900 border-2 border-gray-200 dark:border-zinc-700 rounded-xl focus:outline-none focus:border-orange-500 dark:focus:border-orange-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <label htmlFor="scheduledAt" className="block text-sm font-semibold text-gray-700 dark:text-zinc-300 mb-2">
              <HiOutlineCalendar className="inline w-4 h-4 mr-2" />
              Schedule Publication (optional)
            </label>
            <input
              type="datetime-local"
              id="scheduledAt"
              value={scheduledAt}
              onChange={(e) => setScheduledAt(e.target.value)}
              min={new Date().toISOString().slice(0, 16)}
              className="w-full py-3 px-4 text-gray-900 dark:text-zinc-50 bg-white dark:bg-zinc-900 border-2 border-gray-200 dark:border-zinc-700 rounded-xl focus:outline-none focus:border-orange-500 dark:focus:border-orange-500 transition-colors"
            />
            <p className="text-xs text-gray-500 dark:text-zinc-400 mt-1">
              Leave empty to publish immediately. If set, the post will be published at the scheduled time.
            </p>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 text-sm text-blue-800 dark:text-blue-200">
            <p className="mb-1">📸 Supported image formats: JPEG, PNG, GIF, WebP</p>
            <p>🎥 Video must be less than 20 minutes in duration. Supported formats: MP4, WebM, MOV</p>
          </div>

          {progress > 0 && progress < 100 && (
            <div className="w-full bg-gray-200 dark:bg-zinc-800 rounded-full h-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-orange-500 to-orange-600 h-3 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` } as React.CSSProperties}
              ></div>
              <p className="text-sm text-gray-600 dark:text-zinc-400 mt-2 text-center">Uploading... {progress}%</p>
            </div>
          )}

          {imageFile && (
            <div className="mt-4 p-4 bg-white dark:bg-zinc-900 rounded-xl border-2 border-gray-200 dark:border-zinc-700">
              <p className="text-sm font-semibold text-gray-700 dark:text-zinc-300 mb-2">Image Preview:</p>
              <div className="relative">
                <Image
                  src={URL.createObjectURL(imageFile)}
                  alt="Selected Image Preview"
                  className="max-w-full h-auto rounded-lg border border-gray-200 dark:border-zinc-700"
                  width={800}
                  height={400}
                />
                <button
                  type="button"
                  onClick={() => setImageFile(null)}
                  className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 transition-colors"
                  title="Remove image"
                >
                  ×
                </button>
              </div>
            </div>
          )}

          {videoFile && (
            <div className="mt-4 p-4 bg-white dark:bg-zinc-900 rounded-xl border-2 border-gray-200 dark:border-zinc-700">
              <p className="text-sm font-semibold text-gray-700 dark:text-zinc-300 mb-2">Video Preview:</p>
              <div className="relative">
                <video controls className="w-full max-w-2xl rounded-lg border border-gray-200 dark:border-zinc-700">
                  <source src={URL.createObjectURL(videoFile)} type={videoFile.type} />
                  Your browser does not support the video tag.
                </video>
                <button
                  type="button"
                  onClick={() => setVideoFile(null)}
                  className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 transition-colors"
                  title="Remove video"
                >
                  ×
                </button>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between pt-4 gap-4">
            <button
              type="button"
              onClick={handleSaveDraft}
              disabled={isSubmitting || progress > 0 || !title.trim() || !content.trim()}
              className={`${isSubmitting || progress > 0 || !title.trim() || !content.trim()
                ? 'bg-gray-400 dark:bg-zinc-700 cursor-not-allowed'
                : 'bg-gray-200 dark:bg-zinc-800 hover:bg-gray-300 dark:hover:bg-zinc-700'
                } text-gray-900 dark:text-zinc-50 font-bold py-3 px-6 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 flex items-center gap-2`}
            >
              <HiOutlineSave className="w-5 h-5" />
              Save as Draft
            </button>

            <button
              type="submit"
              disabled={isSubmitting || progress > 0 || !title.trim() || !content.trim()}
              className={`${isSubmitting || progress > 0 || !title.trim() || !content.trim()
                ? 'bg-gray-400 dark:bg-zinc-700 cursor-not-allowed'
                : 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700'
                } text-white font-bold py-3 px-8 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-all duration-200 shadow-lg hover:shadow-xl`}
            >
              {isSubmitting ? 'Publishing...' : progress > 0 ? `Uploading... ${progress}%` : scheduledAt ? 'Schedule Post' : 'Publish Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;
