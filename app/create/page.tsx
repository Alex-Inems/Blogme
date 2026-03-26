'use client';

import { useState, useEffect } from 'react';
import { collection, addDoc, doc, getDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { uploadImage, uploadVideo } from '@/lib/cloudinary-upload';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import RichTextEditor from '@/components/RichTextEditor';
import { HiOutlinePhotograph, HiOutlineVideoCamera, HiOutlineSave, HiOutlineCalendar, HiSparkles, HiOutlineInformationCircle } from 'react-icons/hi';
import { Loader2 } from 'lucide-react';
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
  const [isAIThinking, setIsAIThinking] = useState(false);
  // const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [_isGeneratingImage, _setIsGeneratingImage] = useState(false); // Used to avoid unused-vars in commented logic below
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [showAiPanel, setShowAiPanel] = useState(false);
  const [showAiHowTo, setShowAiHowTo] = useState(false);
  const [aiPanelType, setAiPanelType] = useState<'title' | 'content' | 'tags' | null>(null);
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

  const fetchAiSuggestions = async (type: 'title' | 'content' | 'tags') => {
    if (isAIThinking) return;
    setIsAIThinking(true);
    setAiPanelType(type);
    setShowAiPanel(true);
    setAiSuggestions([]);

    try {
      const response = await fetch('/api/suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentTitle: title,
          currentContent: content,
          type: type,
        }),
      });

      const data = await response.json();
      if (data.error) {
        toast.error('AI Error', { description: data.error });
        setShowAiPanel(false);
      } else {
        if (type === 'title') {
          // Parse lines for titles
          const titles = data.suggestion.split('\n').filter((l: string) => l.trim().length > 0).map((l: string) => l.replace(/^\d+[\.\)]\s*/, '').trim());
          setAiSuggestions(titles);
        } else if (type === 'tags') {
          const tagsList = data.suggestion.split(',').map((t: string) => t.trim());
          setAiSuggestions([tagsList.join(', ')]);
        } else {
          setAiSuggestions([data.suggestion]);
        }
      }
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      toast.error('AI Error', { description: 'Failed to connect to AI service.' });
      setShowAiPanel(false);
    } finally {
      setIsAIThinking(false);
    }
  };

  const applySuggestion = (suggestion: string) => {
    if (aiPanelType === 'title') {
      setTitle(suggestion);
    } else if (aiPanelType === 'content') {
      setContent(content + ' ' + suggestion);
    } else if (aiPanelType === 'tags') {
      setTags(suggestion);
    }
    setShowAiPanel(false);
  };

  /* Temporarily commented out to fix unused-vars lint error
  const handleAiImageGenerate = async () => {
    if (!title) {
      toast.error('Missing title', { description: 'Please enter a title first so the AI knows what image to generate.' });
      return;
    }
    _setIsGeneratingImage(true);
    try {
      const response = await fetch('/api/suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentTitle: title,
          currentContent: content,
          type: 'image',
        }),
      });
      const data = await response.json();
      if (data.error) {
        toast.error('AI Error', { description: data.error });
      } else {
        const imageUrl = data.suggestion;
        // Fetch the image as a blob and convert to File
        const imgRes = await fetch(imageUrl);
        const blob = await imgRes.blob();
        const file = new File([blob], 'ai-generated-image.png', { type: 'image/png' });
        setImageFile(file);
        toast.success('AI Image Generated!', { description: 'The image has been generated and set as your post cover.' });
      }
    } catch (error) {
      console.error('Error generating AI image:', error);
      toast.error('AI Error', { description: 'Failed to generate AI image.' });
    } finally {
      _setIsGeneratingImage(false);
    }
  };
  */

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
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-zinc-50">Create a New Post</h1>
          <button
            onClick={() => setShowAiHowTo(true)}
            className="flex items-center gap-2 text-sm font-medium text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 transition-colors"
          >
            <HiOutlineInformationCircle size={20} />
            How to use AI?
          </button>
        </div>

        <div className="bg-orange-50 dark:bg-orange-900/10 border border-orange-100 dark:border-orange-900/30 rounded-2xl p-4 mb-8 flex items-start gap-4 animate-in slide-in-from-top-4 duration-500">
          <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-xl text-orange-600 dark:text-orange-400">
            <HiSparkles size={24} />
          </div>
          <div>
            <h4 className="font-bold text-orange-900 dark:text-orange-100 mb-1">AI Writing Assistant is Active!</h4>
            <p className="text-sm text-orange-800/80 dark:text-orange-200/80 leading-relaxed">
              Stuck on a title or need ideas to keep writing? Look for the <span className="inline-flex items-center bg-orange-200 dark:bg-orange-800 px-1 rounded mx-1"><HiSparkles size={12} className="mr-1" /> ✨</span> icons throughout the form for instant AI-powered suggestions based on your post.
            </p>
          </div>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
          className="space-y-6"
        >
          <div>
            <div className="flex items-center gap-2">
              <input
                placeholder="Enter post title..."
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="flex-1 py-3 px-4 text-2xl font-semibold text-gray-900 dark:text-zinc-50 bg-white dark:bg-zinc-900 border-2 border-gray-200 dark:border-zinc-700 rounded-xl focus:outline-none focus:border-orange-500 dark:focus:border-orange-500 transition-colors"
              />
              <button
                type="button"
                onClick={() => fetchAiSuggestions('title')}
                disabled={isAIThinking || content.length < 20}
                title="Get Title Suggestions"
                className="p-3 rounded-xl bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 hover:bg-orange-200 dark:hover:bg-orange-900/50 transition-colors disabled:opacity-50"
              >
                <HiSparkles size={24} />
              </button>
            </div>
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

            {/* Temporarily hidden AI Image Generation
            <button
              type="button"
              onClick={handleAiImageGenerate}
              disabled={isGeneratingImage || !title || title.length < 5}
              className={`flex items-center gap-2 px-4 py-2 rounded-full border-2 transition-all duration-200 ${isGeneratingImage
                ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
                : 'border-orange-200 text-orange-600 hover:bg-orange-50 hover:border-orange-500'
                }`}
              title="Generate Cover Image with AI"
            >
              {isGeneratingImage ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <HiSparkles className="w-5 h-5" />
                  <span className="text-sm font-semibold text-wrap">Generate AI Cover</span>
                </>
              )}
            </button>
            */}
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label htmlFor="content" className="text-sm font-semibold text-gray-700 dark:text-zinc-300">
                Content
              </label>
              <button
                type="button"
                onClick={() => fetchAiSuggestions('content')}
                disabled={isAIThinking || title.length < 5}
                title="AI Writing Assistant"
                className="flex items-center gap-2 text-sm font-medium text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 transition-colors"
              >
                <HiSparkles size={16} />
                AI Assist
              </button>
            </div>
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
              <div className="flex justify-between items-center mb-2">
                <label htmlFor="tags" className="text-sm font-semibold text-gray-700 dark:text-zinc-300">
                  Tags (comma-separated)
                </label>
                <button
                  type="button"
                  onClick={() => fetchAiSuggestions('tags')}
                  disabled={isAIThinking || content.length < 50}
                  className="flex items-center gap-1 text-xs text-orange-500 hover:text-orange-600"
                >
                  <HiSparkles size={12} /> Suggest
                </button>
              </div>
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

      {/* AI How-to Modal */}
      {showAiHowTo && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden border border-gray-100 dark:border-zinc-800 animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-gray-100 dark:border-zinc-800 flex items-center justify-between bg-orange-50/50 dark:bg-orange-900/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-600 dark:text-orange-400">
                  <HiSparkles size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-zinc-50">Magic Writing Assistant</h3>
                  <p className="text-sm text-gray-500 dark:text-zinc-400">Learn how to boost your creativity</p>
                </div>
              </div>
              <button
                onClick={() => setShowAiHowTo(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-zinc-200 transition-colors p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full"
              >
                ✕
              </button>
            </div>

            <div className="p-8 space-y-8 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3 p-4 rounded-2xl bg-gray-50 dark:bg-zinc-800/50 border border-gray-100 dark:border-zinc-800">
                  <div className="flex items-center gap-2 text-orange-600 dark:text-orange-400 font-bold">
                    <HiSparkles size={18} />
                    Title Helper
                  </div>
                  <p className="text-sm text-gray-600 dark:text-zinc-400 leading-relaxed">
                    Write a few sentences of your story first, then click the sparkle icon next to the Title field. AI will suggest 5 catchy, SEO-friendly titles.
                  </p>
                </div>

                <div className="space-y-3 p-4 rounded-2xl bg-gray-50 dark:bg-zinc-800/50 border border-gray-100 dark:border-zinc-800">
                  <div className="flex items-center gap-2 text-orange-600 dark:text-orange-400 font-bold">
                    <HiSparkles size={18} />
                    Writing Partner
                  </div>
                  <p className="text-sm text-gray-600 dark:text-zinc-400 leading-relaxed">
                    If you get writer&apos;s block, click &quot;AI Assist&quot; above the editor. The AI will look at your title and current text to suggest the next perfect paragraph.
                  </p>
                </div>

                <div className="space-y-3 p-4 rounded-2xl bg-gray-50 dark:bg-zinc-800/50 border border-gray-100 dark:border-zinc-800">
                  <div className="flex items-center gap-2 text-orange-600 dark:text-orange-400 font-bold">
                    <HiSparkles size={18} />
                    Auto-Tags
                  </div>
                  <p className="text-sm text-gray-600 dark:text-zinc-400 leading-relaxed">
                    Don&apos;t worry about categorization. Click &quot;Suggest&quot; next to the tags field, and let the AI find the most relevant keywords for your post.
                  </p>
                </div>

                {/* Temporarily hidden Visual Storyteller help
                <div className="space-y-3 p-4 rounded-2xl bg-gray-50 dark:bg-zinc-800/50 border border-gray-100 dark:border-zinc-800">
                  <div className="flex items-center gap-2 text-orange-600 dark:text-orange-400 font-bold">
                    <HiSparkles size={18} />
                    Visual Storyteller
                  </div>
                  <p className="text-sm text-gray-600 dark:text-zinc-400 leading-relaxed">
                    Need a cover image? Click "Generate AI Cover" next to the upload icons. DALL-E 3 will create a custom, professional illustration based on your title.
                  </p>
                </div>
                */}

                <div className="space-y-3 p-4 rounded-2xl bg-orange-50 dark:bg-orange-900/10 border border-orange-100 dark:border-orange-900/20">
                  <div className="flex items-center gap-2 text-orange-700 dark:text-orange-300 font-bold">
                    💡 Pro Tip
                  </div>
                  <p className="text-sm text-orange-800/80 dark:text-orange-200/80 leading-relaxed">
                    AI works best when it has context! Try to write at least 20-50 words before asking for suggestions to get the most accurate results.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 bg-gray-50 dark:bg-zinc-900/50 border-t border-gray-100 dark:border-zinc-800 flex justify-end">
              <button
                onClick={() => setShowAiHowTo(false)}
                className="px-8 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold transition-all shadow-lg hover:shadow-orange-500/20"
              >
                Got it, thanks!
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AI Suggestion Modal */}
      {showAiPanel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border border-gray-100 dark:border-zinc-800 animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-gray-100 dark:border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-600 dark:text-orange-400">
                  <HiSparkles size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-zinc-50">AI Post {aiPanelType === 'title' ? 'Titles' : aiPanelType === 'content' ? 'Assistant' : 'Tags'}</h3>
                  <p className="text-sm text-gray-500 dark:text-zinc-400">Powered by OpenAI</p>
                </div>
              </div>
              <button
                onClick={() => setShowAiPanel(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-zinc-200 transition-colors p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full"
              >
                ✕
              </button>
            </div>

            <div className="p-6 max-h-[60vh] overflow-y-auto">
              {isAIThinking ? (
                <div className="flex flex-col items-center justify-center py-12 gap-4">
                  <Loader2 className="w-12 h-12 text-orange-500 animate-spin" />
                  <p className="text-gray-600 dark:text-zinc-400 font-medium">Brewing some ideas...</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {aiSuggestions.length > 0 ? (
                    aiSuggestions.map((suggestion, idx) => (
                      <button
                        key={idx}
                        onClick={() => applySuggestion(suggestion)}
                        className="w-full text-left p-4 rounded-2xl border-2 border-gray-100 dark:border-zinc-800 hover:border-orange-500 dark:hover:border-orange-500 hover:bg-orange-50/50 dark:hover:bg-orange-900/10 transition-all duration-200 group relative"
                      >
                        <span className="text-gray-800 dark:text-zinc-200 group-hover:text-orange-700 dark:group-hover:text-orange-300 block mb-1">
                          {suggestion}
                        </span>
                        <span className="text-xs text-orange-500 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 font-medium">
                          Apply this <HiSparkles size={12} />
                        </span>
                      </button>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-500 dark:text-zinc-400">No suggestions found. Try adding more content first.</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="p-4 bg-gray-50 dark:bg-zinc-900/50 border-t border-gray-100 dark:border-zinc-800 flex justify-end">
              <button
                onClick={() => setShowAiPanel(false)}
                className="px-6 py-2 rounded-xl text-sm font-semibold text-gray-600 dark:text-zinc-400 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreatePost;
