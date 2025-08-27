import React from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const PrivacyPolicyPage = () => {
  return (
    <>
      <Helmet>
        <title>Privacy Policy - TMA Academy</title>
        <meta name="description" content="TMA Academy Privacy Policy - Our commitment to protecting student and parent data with encryption, secure access controls, and comprehensive safety measures." />
        <link rel="canonical" href={`${window.location.origin}/privacy-policy`} />
      </Helmet>
      
      <Header />
      
      <main className="min-h-screen bg-gradient-to-b from-background to-muted/20">
        <div className="container mx-auto px-4 py-16 max-w-4xl">
          <header className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4">Privacy Policy</h1>
            <p className="text-xl text-muted-foreground">
              Your privacy and safety are our highest priority
            </p>
          </header>

          <div className="prose prose-lg max-w-none space-y-8">
            {/* Privacy Statement - As required by TMA Security Policy Section 9 */}
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-6 mb-8">
              <h2 className="text-2xl font-semibold text-primary mb-4">Our Privacy Commitment</h2>
              <p className="text-lg leading-relaxed">
                <strong>TMA encrypts all student and parent data, never sells information, and only grants access to authorized staff. Safety and privacy are our highest priority.</strong>
              </p>
            </div>

            {/* Data Classification */}
            <section>
              <h2 className="text-3xl font-bold mb-6">Data Classification & Protection</h2>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="border rounded-lg p-4">
                  <h3 className="text-xl font-semibold text-destructive mb-3">Highly Confidential</h3>
                  <ul className="text-sm space-y-1">
                    <li>• Student personal information</li>
                    <li>• Parent/guardian details</li>
                    <li>• Teacher applications</li>
                    <li>• Child safety reports</li>
                  </ul>
                  <p className="text-xs text-muted-foreground mt-3">
                    <strong>Always encrypted, access-controlled, never exposed publicly</strong>
                  </p>
                </div>
                
                <div className="border rounded-lg p-4">
                  <h3 className="text-xl font-semibold text-yellow-600 mb-3">Confidential</h3>
                  <ul className="text-sm space-y-1">
                    <li>• Administrative data</li>
                    <li>• Curriculum drafts</li>
                    <li>• Internal reports</li>
                  </ul>
                </div>
                
                <div className="border rounded-lg p-4">
                  <h3 className="text-xl font-semibold text-green-600 mb-3">Public</h3>
                  <ul className="text-sm space-y-1">
                    <li>• Marketing content</li>
                    <li>• Voices blog</li>
                    <li>• Newsletters</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Access Control */}
            <section>
              <h2 className="text-3xl font-bold mb-4">Access Control & Security</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold mb-2">Role-Based Access</h3>
                  <p>Our system enforces strict role-based access control with four user types: Student, Parent, Teacher, and Admin. Users can only access their own data.</p>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold mb-2">Admin Security</h3>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Strong passwords (minimum 12 characters with complexity requirements)</li>
                    <li>Two-Factor Authentication (2FA) mandatory</li>
                    <li>Session timeout with secure cookies</li>
                    <li>Zero Trust principle: no access granted by default</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Data Storage */}
            <section>
              <h2 className="text-3xl font-bold mb-4">Data Storage & Transmission</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold mb-2">Encryption Standards</h3>
                  <ul className="list-disc list-inside space-y-1">
                    <li>All data in transit: HTTPS only (TLS 1.2/1.3, HSTS enforced)</li>
                    <li>All data at rest: encrypted database columns for Highly Confidential data</li>
                    <li>File uploads stored in private storage buckets</li>
                    <li>Access only via time-limited signed URLs</li>
                    <li>Encrypted backups with admin-only access</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Authentication */}
            <section>
              <h2 className="text-3xl font-bold mb-4">Password & Authentication</h2>
              <ul className="list-disc list-inside space-y-2">
                <li>Strong password enforcement with breached password protection</li>
                <li>Two-Factor Authentication (2FA) mandatory for admin accounts</li>
                <li>Student/parent logins: strong password policy with optional OTP verification</li>
                <li>Failed login attempts result in account lockout and security alerts</li>
              </ul>
            </section>

            {/* Monitoring */}
            <section>
              <h2 className="text-3xl font-bold mb-4">Logging & Monitoring</h2>
              <ul className="list-disc list-inside space-y-2">
                <li>Complete audit logs for all admin access to confidential data</li>
                <li>Automated alerts on suspicious activity (repeated failed logins, mass data exports)</li>
                <li>Monthly security scans and monitoring</li>
                <li>Annual external penetration testing</li>
              </ul>
            </section>

            {/* Data Rights */}
            <section>
              <h2 className="text-3xl font-bold mb-4">Your Data Rights</h2>
              <p className="mb-4">You have the right to:</p>
              <ul className="list-disc list-inside space-y-2">
                <li>Access your personal data</li>
                <li>Correct inaccurate information</li>
                <li>Request deletion of your data</li>
                <li>Withdraw consent where applicable</li>
                <li>File a complaint with supervisory authorities</li>
              </ul>
            </section>

            {/* Contact */}
            <section>
              <h2 className="text-3xl font-bold mb-4">Contact Information</h2>
              <p>
                For privacy-related questions or concerns, please contact us at:{' '}
                <a href="mailto:privacy@tma-academy.com" className="text-primary hover:underline">
                  privacy@tma-academy.com
                </a>
              </p>
              <p className="text-sm text-muted-foreground mt-4">
                Last updated: {new Date().toLocaleDateString()}
              </p>
            </section>
          </div>
        </div>
      </main>
      
      <Footer />
    </>
  );
};

export default PrivacyPolicyPage;