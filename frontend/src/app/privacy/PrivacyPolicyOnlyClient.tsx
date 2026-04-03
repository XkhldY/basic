"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function PrivacyPolicyOnlyClient() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <header className="bg-slate-950/95 backdrop-blur-sm border-b border-slate-800/50">
        <div className="container-custom">
          <div className="grid grid-cols-3 items-center h-20">
            {/* Logo */}
            <div className="flex items-center justify-start h-20">
              <Link href="/" className="flex items-center space-x-3 group">
                <img
                  src="/img/white@2x.png"
                  alt="POM Logo"
                  className="w-24 h-24 object-contain transition-all duration-300 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:scale-110"
                />
              </Link>
            </div>

            {/* Center spacer */}
            <div className="flex items-center justify-center h-20" />

            {/* Back */}
            <div className="flex items-center justify-end h-20">
              <Link
                href="/"
                className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors duration-200"
              >
                <ArrowLeft size={18} />
                <span>Go back home</span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="container-custom py-16">
        <div className="max-w-4xl mx-auto">
          {/* Privacy Policy (Markdown only) */}
          <motion.section
            className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-lg border border-slate-200 dark:border-slate-700"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="space-y-4 text-slate-700 dark:text-slate-200 prose prose-slate max-w-none dark:prose-invert">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {`# Privacy Policy

**Last updated:** ${new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}

## 1. Introduction

Welcome to POM ("we", "our", or "us").
Your privacy is important to us. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website and mobile applications (the "Services").

By using our Services, you agree to the collection and use of information in accordance with this policy.

---

## 2. Information We Collect

We may collect the following types of information:

### a) Personal Information

- Name
- Email address
- Phone number
- Any information you submit through forms or account registration

### b) Usage Data

- IP address
- Browser type and version
- Pages visited
- Time and date of visits
- Device identifiers
- App usage behavior

### c) Mobile App Data

When using our Android app, we may collect:

- Device type and operating system
- App version
- Crash logs and diagnostics
- Advertising ID (if ads are used)

### d) Cookies and Tracking Technologies

We use cookies and similar tracking technologies to:

- Improve user experience
- Analyze traffic
- Personalize content

You can control cookies through your browser settings.

---

## 3. How We Use Your Information

We use collected data to:

- Provide and maintain our Services
- Improve performance and user experience
- Communicate with you (support, updates, notifications)
- Analyze usage trends
- Prevent fraud and ensure security
- Comply with legal obligations

---

## 4. Sharing Your Information

We do **not sell your personal data**.

We may share your information with:

- Service providers (hosting, analytics, email services)
- Legal authorities when required by law
- Business partners (only when necessary for service functionality)

---

## 5. Third-Party Services

Our Services may use third-party tools such as:

- Analytics providers (e.g., Google Analytics)
- Advertising networks (if applicable)
- Cloud hosting providers

These third parties may collect data in accordance with their own privacy policies.

---

## 6. Data Retention

We retain your information only as long as necessary for:

- Providing services
- Legal compliance
- Resolving disputes

---

## 7. Data Security

We implement reasonable technical and organizational measures to protect your data.
However, no system is 100% secure, and we cannot guarantee absolute security.

---

## 8. Your Rights

Depending on your location, you may have the right to:

- Access your data
- Correct inaccurate information
- Request deletion of your data
- Object to or restrict processing

To exercise your rights, contact us at:
**admin@hirewithpom**

---

## 9. Children's Privacy

Our Services are not intended for children under 13.
We do not knowingly collect personal information from children.

If we become aware of such data, we will delete it promptly.

---

## 10. Changes to This Privacy Policy

We may update this Privacy Policy from time to time.
Changes will be posted on this page with an updated "Last updated" date.

---

## 11. Contact Us

If you have any questions about this Privacy Policy, contact us:

**Email:** admin@hirewithpom  
**Website:** https://hirewithpom.com

---

## 12. Consent

By using our website or mobile application, you consent to this Privacy Policy.

---`}
              </ReactMarkdown>
            </div>
          </motion.section>
        </div>
      </main>
    </div>
  );
}
