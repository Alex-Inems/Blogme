import React from 'react';

const FAQPage = () => {
    const faqCategories = [
        {
            title: "Getting Started",
            items: [
                {
                    question: "How do I sign up for Blogme?",
                    answer: "Click the 'Sign In' button in the top right corner, then select 'Sign Up' to create your account. You can use your email address or sign up with Google, Facebook, or other social media accounts."
                },
                {
                    question: "Is Blogme free to use?",
                    answer: "Yes! Blogme is completely free to use. You can create unlimited posts, customize your profile, and access all our features without any cost."
                },
                {
                    question: "What can I write about?",
                    answer: "You can write about anything that interests you! Share your thoughts, experiences, tutorials, reviews, stories, or any other content you'd like to share with the world. Just make sure your content follows our community guidelines."
                }
            ]
        },
        {
            title: "Creating Content",
            items: [
                {
                    question: "How do I create a new blog post?",
                    answer: "After signing in, click the 'Create Post' button in the navigation menu. Add a title, write your content, upload an image if desired, and click 'Publish' when you're ready to share."
                },
                {
                    question: "Can I add images to my posts?",
                    answer: "Yes! You can upload images to accompany your posts. Simply click the image upload button when creating or editing a post and select the image from your device."
                },
                {
                    question: "Is there a word limit for posts?",
                    answer: "There's no strict word limit, but we recommend keeping posts between 300-2000 words for optimal readability. Very long posts might take longer to load on mobile devices."
                },
                {
                    question: "Can I save drafts?",
                    answer: "Currently, posts are published immediately when you click 'Publish'. We're working on adding a draft feature in a future update."
                }
            ]
        },
        {
            title: "Account & Profile",
            items: [
                {
                    question: "How do I edit my profile?",
                    answer: "Go to your profile page and click the 'Edit Profile' button. You can update your display name, bio, profile picture, and other information."
                },
                {
                    question: "Can I change my username?",
                    answer: "Your username is based on your account information and cannot be changed directly. If you need to change it, please contact our support team."
                },
                {
                    question: "How do I delete my account?",
                    answer: "To delete your account, please contact our support team at support@blogme.africa. We'll help you through the process and ensure your data is properly removed."
                }
            ]
        },
        {
            title: "Privacy & Security",
            items: [
                {
                    question: "Who can see my posts?",
                    answer: "All posts on Blogme are public and can be seen by anyone who visits the platform. We're working on adding privacy settings in a future update."
                },
                {
                    question: "Is my personal information safe?",
                    answer: "Yes, we take your privacy seriously. We use industry-standard security measures to protect your data and never share your personal information with third parties without your consent."
                },
                {
                    question: "Can I report inappropriate content?",
                    answer: "Yes, if you see content that violates our community guidelines, you can report it by clicking the three dots menu on any post and selecting 'Report'. We review all reports and take appropriate action."
                }
            ]
        },
        {
            title: "Technical Issues",
            items: [
                {
                    question: "The site is loading slowly. What should I do?",
                    answer: "Try refreshing the page or clearing your browser cache. If the problem persists, please contact our support team with details about your browser and device."
                },
                {
                    question: "I can't upload images. What's wrong?",
                    answer: "Make sure your image is in a supported format (JPG, PNG, GIF) and under 10MB in size. If you're still having trouble, try using a different browser or device."
                },
                {
                    question: "My post didn't save. What happened?",
                    answer: "This could be due to a temporary connection issue. Try refreshing the page and creating your post again. If the problem continues, contact our support team."
                }
            ]
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-4xl mx-auto px-4 py-16">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h1>
                    <p className="text-xl text-gray-600">
                        Find quick answers to the most common questions about Blogme
                    </p>
                </div>

                <div className="space-y-12">
                    {faqCategories.map((category, categoryIndex) => (
                        <div key={categoryIndex} className="bg-white rounded-lg shadow-md p-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">{category.title}</h2>
                            <div className="space-y-6">
                                {category.items.map((item, itemIndex) => (
                                    <div key={itemIndex} className="border-b border-gray-200 pb-6 last:border-b-0">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-3">
                                            {item.question}
                                        </h3>
                                        <p className="text-gray-600 leading-relaxed">
                                            {item.answer}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Still Have Questions */}
                <div className="mt-12 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-8 text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Still Have Questions?</h2>
                    <p className="text-gray-600 mb-6">
                        Can&apos;t find the answer you&apos;re looking for? Our support team is here to help!
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <a
                            href="/contact"
                            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
                        >
                            Contact Support
                        </a>
                        <a
                            href="/help"
                            className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
                        >
                            Visit Help Center
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FAQPage;
