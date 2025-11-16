import React from 'react';

const PrivacyPolicyPage = () => {
    return (
        <div className="min-h-screen bg-gray-50">

            <div className="max-w-4xl mx-auto px-4 py-16">
                <div className="bg-white rounded-lg shadow-md p-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
                    <p className="text-gray-600 mb-8">
                        <strong>Last updated:</strong> {new Date().toLocaleDateString()}
                    </p>

                    <div className="prose prose-lg max-w-none">
                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Introduction</h2>
                            <p className="text-gray-700 mb-4">
                                Welcome to Blogme (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;). This Privacy Policy explains how we collect,
                                use, disclose, and safeguard your information when you visit our website and use our
                                services. Please read this privacy policy carefully. If you do not agree with the terms
                                of this privacy policy, please do not access the site.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Information We Collect</h2>

                            <h3 className="text-xl font-semibold text-gray-900 mb-3">2.1 Personal Information</h3>
                            <p className="text-gray-700 mb-4">
                                We may collect personal information that you voluntarily provide to us when you:
                            </p>
                            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                                <li>Register for an account</li>
                                <li>Create and publish content</li>
                                <li>Contact us for support</li>
                                <li>Subscribe to our newsletter</li>
                                <li>Participate in surveys or promotions</li>
                            </ul>
                            <p className="text-gray-700 mb-4">
                                This information may include your name, email address, profile picture, and any other
                                information you choose to provide.
                            </p>

                            <h3 className="text-xl font-semibold text-gray-900 mb-3">2.2 Automatically Collected Information</h3>
                            <p className="text-gray-700 mb-4">
                                We automatically collect certain information when you visit our website, including:
                            </p>
                            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                                <li>IP address and location data</li>
                                <li>Browser type and version</li>
                                <li>Operating system</li>
                                <li>Pages visited and time spent on pages</li>
                                <li>Referring website</li>
                                <li>Device information</li>
                            </ul>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. How We Use Your Information</h2>
                            <p className="text-gray-700 mb-4">We use the information we collect to:</p>
                            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                                <li>Provide, operate, and maintain our services</li>
                                <li>Improve, personalize, and expand our services</li>
                                <li>Understand and analyze how you use our services</li>
                                <li>Develop new products, services, features, and functionality</li>
                                <li>Communicate with you for customer service and support</li>
                                <li>Send you marketing communications (with your consent)</li>
                                <li>Process transactions and send related information</li>
                                <li>Find and prevent fraud</li>
                            </ul>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Information Sharing and Disclosure</h2>
                            <p className="text-gray-700 mb-4">
                                We do not sell, trade, or otherwise transfer your personal information to third parties
                                without your consent, except in the following circumstances:
                            </p>
                            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                                <li>With service providers who assist us in operating our website and conducting our business</li>
                                <li>When required by law or to protect our rights</li>
                                <li>In connection with a business transfer or acquisition</li>
                                <li>With your explicit consent</li>
                            </ul>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Data Security</h2>
                            <p className="text-gray-700 mb-4">
                                We implement appropriate technical and organizational security measures to protect your
                                personal information against unauthorized access, alteration, disclosure, or destruction.
                                However, no method of transmission over the internet or electronic storage is 100% secure,
                                and we cannot guarantee absolute security.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Your Rights</h2>
                            <p className="text-gray-700 mb-4">Depending on your location, you may have the following rights:</p>
                            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                                <li>Access to your personal information</li>
                                <li>Correction of inaccurate personal information</li>
                                <li>Deletion of your personal information</li>
                                <li>Restriction of processing of your personal information</li>
                                <li>Data portability</li>
                                <li>Objection to processing of your personal information</li>
                                <li>Withdrawal of consent</li>
                            </ul>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Cookies and Tracking Technologies</h2>
                            <p className="text-gray-700 mb-4">
                                We use cookies and similar tracking technologies to enhance your experience on our website.
                                You can control cookie settings through your browser preferences. However, disabling cookies
                                may affect the functionality of our services.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Third-Party Links</h2>
                            <p className="text-gray-700 mb-4">
                                Our website may contain links to third-party websites. We are not responsible for the
                                privacy practices or content of these external sites. We encourage you to review the
                                privacy policies of any third-party sites you visit.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Children&apos;s Privacy</h2>
                            <p className="text-gray-700 mb-4">
                                Our services are not intended for children under 13 years of age. We do not knowingly
                                collect personal information from children under 13. If you are a parent or guardian and
                                believe your child has provided us with personal information, please contact us.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Changes to This Privacy Policy</h2>
                            <p className="text-gray-700 mb-4">
                                We may update this Privacy Policy from time to time. We will notify you of any changes
                                by posting the new Privacy Policy on this page and updating the &quot;Last updated&quot; date.
                                You are advised to review this Privacy Policy periodically for any changes.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Contact Us</h2>
                            <p className="text-gray-700 mb-4">
                                If you have any questions about this Privacy Policy or our privacy practices, please contact us:
                            </p>
                            <div className="bg-gray-100 p-4 rounded-lg">
                                <p className="text-gray-700">
                                    <strong>Email:</strong> privacy@blogme.africa<br />
                                    <strong>Address:</strong> 123 Story Street, Digital City, DC 12345<br />
                                    <strong>Phone:</strong> +1 (555) 123-4567
                                </p>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicyPage;
