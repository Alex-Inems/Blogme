'use client';

import React, { useState } from 'react';
import { COMPANY_INFO, SOCIAL_LINKS } from '@/Commons/constants';
import { FiMail, FiPhone, FiMapPin, FiSend, FiClock, FiMessageCircle, FiUsers, FiHeart, FiStar, FiCheckCircle } from 'react-icons/fi';

const ContactPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate form submission
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            setSubmitStatus('success');
            setFormData({ name: '', email: '', subject: '', message: '' });
        } catch (error) {
            setSubmitStatus('error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const faqs = [
        {
            question: "How do I get started with Blogme?",
            answer: "Simply sign up for an account and start creating your first post. It's that easy! Our intuitive interface makes blogging accessible to everyone."
        },
        {
            question: "Is Blogme free to use?",
            answer: "Yes, our basic features are completely free. We also offer premium features for advanced users who want more customization options."
        },
        {
            question: "Can I customize my blog?",
            answer: "Absolutely! We offer various themes and customization options to make your blog unique and reflect your personal style."
        },
        {
            question: "How do I get support?",
            answer: "You can reach out to us through this contact form, email us directly, or check our help center for detailed guides and tutorials."
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
            {/* Hero Section */}
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white py-20">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="text-center">
                        <h1 className="text-4xl md:text-6xl font-bold mb-6">
                            Get in Touch
                        </h1>
                        <p className="text-xl md:text-2xl text-orange-100 max-w-3xl mx-auto mb-8">
                            Have a question, suggestion, or just want to say hello? We'd love to hear from you!
                        </p>
                        <div className="flex justify-center space-x-8 text-orange-100">
                            <div className="flex items-center space-x-2">
                                <FiClock className="w-5 h-5" />
                                <span>24/7 Support</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <FiUsers className="w-5 h-5" />
                                <span>Community Driven</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <FiHeart className="w-5 h-5" />
                                <span>Made with Love</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 py-16">
                <div className="grid lg:grid-cols-2 gap-12">
                    {/* Contact Form */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
                        <div className="flex items-center space-x-3 mb-8">
                            <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-xl flex items-center justify-center">
                                <FiMessageCircle className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                            </div>
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Send us a Message</h2>
                        </div>

                        {submitStatus === 'success' && (
                            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-800 dark:text-green-200 px-6 py-4 rounded-xl mb-6 flex items-center space-x-3">
                                <FiCheckCircle className="w-5 h-5" />
                                <span>Thank you for your message! We'll get back to you soon.</span>
                            </div>
                        )}

                        {submitStatus === 'error' && (
                            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 px-6 py-4 rounded-xl mb-6 flex items-center space-x-3">
                                <FiMessageCircle className="w-5 h-5" />
                                <span>Sorry, there was an error sending your message. Please try again.</span>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                        Full Name *
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
                                        placeholder="Enter your full name"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="email" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                        Email Address *
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
                                        placeholder="Enter your email"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="subject" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                    Subject *
                                </label>
                                <input
                                    type="text"
                                    id="subject"
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
                                    placeholder="What's this about?"
                                />
                            </div>

                            <div>
                                <label htmlFor="message" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                    Message *
                                </label>
                                <textarea
                                    id="message"
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    required
                                    rows={6}
                                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors resize-none"
                                    placeholder="Tell us what's on your mind..."
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-4 px-6 rounded-xl font-semibold hover:from-orange-600 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2"
                            >
                                <FiSend className="w-5 h-5" />
                                <span>{isSubmitting ? 'Sending...' : 'Send Message'}</span>
                            </button>
                        </form>
                    </div>

                    {/* Contact Information & FAQ */}
                    <div className="space-y-8">
                        {/* Contact Details */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
                            <div className="flex items-center space-x-3 mb-8">
                                <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-xl flex items-center justify-center">
                                    <FiMail className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                                </div>
                                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Contact Information</h2>
                            </div>

                            <div className="space-y-6">
                                <div className="flex items-start space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                                    <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-xl flex items-center justify-center flex-shrink-0">
                                        <FiMail className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Email</h3>
                                        <p className="text-gray-600 dark:text-gray-300 font-medium">{COMPANY_INFO.email}</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">We'll respond within 24 hours</p>
                                    </div>
                                </div>

                                <div className="flex items-start space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                                    <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-xl flex items-center justify-center flex-shrink-0">
                                        <FiPhone className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Phone</h3>
                                        <p className="text-gray-600 dark:text-gray-300 font-medium">{COMPANY_INFO.phone}</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Mon-Fri 9AM-6PM EST</p>
                                    </div>
                                </div>

                                <div className="flex items-start space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                                    <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-xl flex items-center justify-center flex-shrink-0">
                                        <FiMapPin className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Address</h3>
                                        <p className="text-gray-600 dark:text-gray-300 font-medium">{COMPANY_INFO.address}</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Visit us anytime</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* FAQ Section */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
                            <div className="flex items-center space-x-3 mb-8">
                                <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-xl flex items-center justify-center">
                                    <FiStar className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                                </div>
                                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Frequently Asked Questions</h2>
                            </div>

                            <div className="space-y-6">
                                {faqs.map((faq, index) => (
                                    <div key={index} className="border-l-4 border-orange-500 pl-6">
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                            {faq.question}
                                        </h3>
                                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                                            {faq.answer}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Social Media */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
                            <div className="flex items-center space-x-3 mb-6">
                                <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-xl flex items-center justify-center">
                                    <FiUsers className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                                </div>
                                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Follow Us</h2>
                            </div>

                            <p className="text-gray-600 dark:text-gray-300 mb-6">
                                Stay connected and get the latest updates from our community.
                            </p>

                            <div className="grid grid-cols-2 gap-4">
                                {SOCIAL_LINKS.map((social, index) => (
                                    <a
                                        key={index}
                                        href={social.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-colors group"
                                    >
                                        <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center group-hover:bg-orange-200 dark:group-hover:bg-orange-800 transition-colors">
                                            <span className="text-orange-600 dark:text-orange-400 font-semibold text-sm">
                                                {social.name.charAt(0)}
                                            </span>
                                        </div>
                                        <span className="text-gray-700 dark:text-gray-300 font-medium group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                                            {social.name}
                                        </span>
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactPage;