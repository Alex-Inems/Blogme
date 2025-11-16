import React from 'react';
import Link from 'next/link';

const HelpCenterPage = () => {
    const faqItems = [
        {
            question: "How do I create my first blog post?",
            answer: "To create your first blog post, sign in to your account and click the 'Create Post' button in the navigation menu. Fill in the title, content, and add an image if desired. Click 'Publish' when you're ready to share your post with the world."
        },
        {
            question: "Can I edit my posts after publishing?",
            answer: "Yes! You can edit your posts at any time. Go to your profile or stories page, find the post you want to edit, and click the edit button. Make your changes and save them."
        },
        {
            question: "How do I change my profile picture?",
            answer: "To change your profile picture, go to your profile page and click on the current profile picture. You'll be able to upload a new image from your device."
        },
        {
            question: "Is there a limit to how many posts I can create?",
            answer: "No, there's no limit to the number of posts you can create. You can share as many stories as you'd like on our platform."
        },
        {
            question: "How do I delete my account?",
            answer: "To delete your account, please contact our support team at support@blogme.africa. We'll help you through the process and ensure your data is properly removed."
        },
        {
            question: "Can I make my posts private?",
            answer: "Currently, all posts are public and visible to everyone. We're working on adding privacy settings in a future update."
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-4xl mx-auto px-4 py-16">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Help Center</h1>
                    <p className="text-xl text-gray-600">
                        Find answers to common questions and get the support you need
                    </p>
                </div>

                {/* Quick Links */}
                <div className="grid md:grid-cols-3 gap-6 mb-12">
                    <div className="bg-white rounded-lg shadow-md p-6 text-center">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                            <span className="text-blue-600 text-xl">📝</span>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Getting Started</h3>
                        <p className="text-gray-600 mb-4">Learn how to create your first post and set up your profile</p>
                        <Link href="/create" className="text-blue-600 hover:text-blue-800 font-medium">
                            Start Writing →
                        </Link>
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-6 text-center">
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                            <span className="text-green-600 text-xl">❓</span>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">FAQ</h3>
                        <p className="text-gray-600 mb-4">Browse frequently asked questions and quick answers</p>
                        <Link href="/faq" className="text-green-600 hover:text-green-800 font-medium">
                            View FAQ →
                        </Link>
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-6 text-center">
                        <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                            <span className="text-orange-600 text-xl">💬</span>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Contact Support</h3>
                        <p className="text-gray-600 mb-4">Can&apos;t find what you&apos;re looking for? Get in touch with us</p>
                        <Link href="/contact" className="text-orange-600 hover:text-orange-800 font-medium">
                            Contact Us →
                        </Link>
                    </div>
                </div>

                {/* FAQ Section */}
                <div className="bg-white rounded-lg shadow-md p-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
                    <div className="space-y-6">
                        {faqItems.map((item, index) => (
                            <div key={index} className="border-b border-gray-200 pb-6 last:border-b-0">
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                    {item.question}
                                </h3>
                                <p className="text-gray-600">
                                    {item.answer}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Contact Support */}
                <div className="mt-12 bg-blue-50 rounded-lg p-8 text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Still Need Help?</h2>
                    <p className="text-gray-600 mb-6">
                        Our support team is here to help you with any questions or issues you might have.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/contact"
                            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
                        >
                            Contact Support
                        </Link>
                        <a
                            href="mailto:support@blogme.africa"
                            className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
                        >
                            Email Us
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HelpCenterPage;
