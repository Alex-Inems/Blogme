import React from 'react';
import { COMPANY_INFO } from '@/Commons/constants';

const AboutPage = () => {
    return (
        <div className="min-h-screen bg-gray-50">

            <div className="max-w-4xl mx-auto px-4 py-16">
                {/* Hero Section */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                        About {COMPANY_INFO.name}
                    </h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        {COMPANY_INFO.description}
                    </p>
                </div>

                {/* Mission Section */}
                <section id="story" className="mb-16">
                    <h2 className="text-3xl font-bold text-gray-900 mb-8">Our Story</h2>
                    <div className="bg-white rounded-lg shadow-md p-8">
                        <p className="text-lg text-gray-700 mb-6">
                            Founded with a vision to democratize storytelling, Blogme emerged from the belief that
                            everyone has a story worth sharing. In a world where voices can be lost in the noise,
                            we provide a platform that amplifies authentic narratives and connects people through
                            the power of words.
                        </p>
                        <p className="text-lg text-gray-700 mb-6">
                            Our journey began when we realized that traditional blogging platforms were either too
                            complex for casual writers or too restrictive for creative expression. We set out to
                            create something different - a space where simplicity meets functionality, where
                            creativity flourishes, and where every voice matters.
                        </p>
                        <p className="text-lg text-gray-700">
                            Today, Blogme serves as a bridge between storytellers and their audiences, fostering
                            a community where ideas flow freely and connections are made through shared experiences.
                        </p>
                    </div>
                </section>

                {/* Mission & Values */}
                <section className="mb-16">
                    <h2 className="text-3xl font-bold text-gray-900 mb-8">Our Mission & Values</h2>
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="bg-white rounded-lg shadow-md p-8">
                            <h3 className="text-2xl font-semibold text-gray-900 mb-4">Our Mission</h3>
                            <p className="text-gray-700">
                                To empower individuals and organizations to share their stories, build meaningful
                                connections, and create positive impact through authentic storytelling and community engagement.
                            </p>
                        </div>
                        <div className="bg-white rounded-lg shadow-md p-8">
                            <h3 className="text-2xl font-semibold text-gray-900 mb-4">Our Values</h3>
                            <ul className="text-gray-700 space-y-2">
                                <li>• <strong>Authenticity:</strong> We believe in genuine, honest storytelling</li>
                                <li>• <strong>Accessibility:</strong> Everyone should have a voice</li>
                                <li>• <strong>Community:</strong> Building connections through shared experiences</li>
                                <li>• <strong>Innovation:</strong> Continuously improving our platform</li>
                                <li>• <strong>Respect:</strong> Creating a safe space for all voices</li>
                            </ul>
                        </div>
                    </div>
                </section>

                {/* Team Section */}
                <section id="team" className="mb-16">
                    <h2 className="text-3xl font-bold text-gray-900 mb-8">Meet Our Team</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="bg-white rounded-lg shadow-md p-6 text-center">
                            <div className="w-24 h-24 bg-gray-300 rounded-full mx-auto mb-4"></div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Sarah Johnson</h3>
                            <p className="text-gray-600 mb-2">CEO & Founder</p>
                            <p className="text-sm text-gray-500">
                                Passionate about storytelling and community building. Former journalist with 10+ years experience.
                            </p>
                        </div>
                        <div className="bg-white rounded-lg shadow-md p-6 text-center">
                            <div className="w-24 h-24 bg-gray-300 rounded-full mx-auto mb-4"></div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Michael Chen</h3>
                            <p className="text-gray-600 mb-2">CTO</p>
                            <p className="text-sm text-gray-500">
                                Tech enthusiast focused on creating seamless user experiences. Full-stack developer and designer.
                            </p>
                        </div>
                        <div className="bg-white rounded-lg shadow-md p-6 text-center">
                            <div className="w-24 h-24 bg-gray-300 rounded-full mx-auto mb-4"></div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Emily Rodriguez</h3>
                            <p className="text-gray-600 mb-2">Head of Community</p>
                            <p className="text-sm text-gray-500">
                                Dedicated to fostering inclusive communities and supporting our users&apos; creative journeys.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Contact Information */}
                <section className="bg-white rounded-lg shadow-md p-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">Get in Touch</h2>
                    <div className="grid md:grid-cols-2 gap-8">
                        <div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-4">Contact Information</h3>
                            <div className="space-y-3">
                                <p className="flex items-center text-gray-700">
                                    <span className="mr-3">📧</span>
                                    {COMPANY_INFO.email}
                                </p>
                                <p className="flex items-center text-gray-700">
                                    <span className="mr-3">📞</span>
                                    {COMPANY_INFO.phone}
                                </p>
                                <p className="flex items-center text-gray-700">
                                    <span className="mr-3">📍</span>
                                    {COMPANY_INFO.address}
                                </p>
                            </div>
                        </div>
                        <div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-4">Follow Us</h3>
                            <p className="text-gray-700 mb-4">
                                Stay updated with our latest news and community highlights.
                            </p>
                            <div className="flex space-x-4">
                                <a href="#" className="text-blue-600 hover:text-blue-800">Twitter</a>
                                <a href="#" className="text-blue-600 hover:text-blue-800">Facebook</a>
                                <a href="#" className="text-blue-600 hover:text-blue-800">Instagram</a>
                                <a href="#" className="text-blue-600 hover:text-blue-800">LinkedIn</a>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default AboutPage;
