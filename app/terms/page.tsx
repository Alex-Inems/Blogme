import React from 'react';

const TermsOfServicePage = () => {
    return (
        <div className="min-h-screen bg-gray-50">

            <div className="max-w-4xl mx-auto px-4 py-16">
                <div className="bg-white rounded-lg shadow-md p-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-8">Terms of Service</h1>
                    <p className="text-gray-600 mb-8">
                        <strong>Last updated:</strong> {new Date().toLocaleDateString()}
                    </p>

                    <div className="prose prose-lg max-w-none">
                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Acceptance of Terms</h2>
                            <p className="text-gray-700 mb-4">
                                By accessing and using Blogme (&quot;the Service&quot;), you accept and agree to be bound by the
                                terms and provision of this agreement. If you do not agree to abide by the above,
                                please do not use this service.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Use License</h2>
                            <p className="text-gray-700 mb-4">
                                Permission is granted to temporarily download one copy of the materials on Blogme for
                                personal, non-commercial transitory viewing only. This is the grant of a license, not
                                a transfer of title, and under this license you may not:
                            </p>
                            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                                <li>modify or copy the materials</li>
                                <li>use the materials for any commercial purpose or for any public display</li>
                                <li>attempt to reverse engineer any software contained on the website</li>
                                <li>remove any copyright or other proprietary notations from the materials</li>
                            </ul>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. User Accounts</h2>
                            <p className="text-gray-700 mb-4">
                                When you create an account with us, you must provide information that is accurate,
                                complete, and current at all times. You are responsible for safeguarding the password
                                and for all activities that occur under your account.
                            </p>
                            <p className="text-gray-700 mb-4">
                                You agree not to disclose your password to any third party. You must notify us
                                immediately upon becoming aware of any breach of security or unauthorized use of
                                your account.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Content Guidelines</h2>
                            <p className="text-gray-700 mb-4">
                                You are responsible for the content you post on our platform. You agree not to post
                                content that:
                            </p>
                            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                                <li>Is illegal, harmful, threatening, abusive, or defamatory</li>
                                <li>Violates any intellectual property rights</li>
                                <li>Contains spam or unsolicited promotional content</li>
                                <li>Contains malware or malicious code</li>
                                <li>Is sexually explicit or contains adult content</li>
                                <li>Promotes violence or hatred</li>
                                <li>Violates any applicable laws or regulations</li>
                            </ul>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Intellectual Property</h2>
                            <p className="text-gray-700 mb-4">
                                The Service and its original content, features, and functionality are and will remain
                                the exclusive property of Blogme and its licensors. The Service is protected by
                                copyright, trademark, and other laws.
                            </p>
                            <p className="text-gray-700 mb-4">
                                You retain ownership of the content you post, but by posting content, you grant us
                                a non-exclusive, royalty-free, worldwide license to use, display, and distribute
                                your content in connection with the Service.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Privacy Policy</h2>
                            <p className="text-gray-700 mb-4">
                                Your privacy is important to us. Please review our Privacy Policy, which also
                                governs your use of the Service, to understand our practices.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Prohibited Uses</h2>
                            <p className="text-gray-700 mb-4">
                                You may not use our Service:
                            </p>
                            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                                <li>For any unlawful purpose or to solicit others to perform unlawful acts</li>
                                <li>To violate any international, federal, provincial, or state regulations, rules, laws, or local ordinances</li>
                                <li>To infringe upon or violate our intellectual property rights or the intellectual property rights of others</li>
                                <li>To harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate</li>
                                <li>To submit false or misleading information</li>
                                <li>To upload or transmit viruses or any other type of malicious code</li>
                            </ul>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Termination</h2>
                            <p className="text-gray-700 mb-4">
                                We may terminate or suspend your account and bar access to the Service immediately,
                                without prior notice or liability, under our sole discretion, for any reason whatsoever
                                and without limitation, including but not limited to a breach of the Terms.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Disclaimer</h2>
                            <p className="text-gray-700 mb-4">
                                The information on this website is provided on an &quot;as is&quot; basis. To the fullest extent
                                permitted by law, this Company excludes all representations, warranties, conditions
                                and terms relating to our website and the use of this website.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Limitation of Liability</h2>
                            <p className="text-gray-700 mb-4">
                                In no event shall Blogme, nor its directors, employees, partners, agents, suppliers,
                                or affiliates, be liable for any indirect, incidental, special, consequential, or
                                punitive damages, including without limitation, loss of profits, data, use, goodwill,
                                or other intangible losses, resulting from your use of the Service.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Governing Law</h2>
                            <p className="text-gray-700 mb-4">
                                These Terms shall be interpreted and governed by the laws of the jurisdiction in which
                                Blogme operates, without regard to its conflict of law provisions.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">12. Changes to Terms</h2>
                            <p className="text-gray-700 mb-4">
                                We reserve the right, at our sole discretion, to modify or replace these Terms at any
                                time. If a revision is material, we will provide at least 30 days notice prior to any
                                new terms taking effect.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">13. Contact Information</h2>
                            <p className="text-gray-700 mb-4">
                                If you have any questions about these Terms of Service, please contact us:
                            </p>
                            <div className="bg-gray-100 p-4 rounded-lg">
                                <p className="text-gray-700">
                                    <strong>Email:</strong> legal@blogme.africa<br />
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

export default TermsOfServicePage;
