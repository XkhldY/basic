"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowLeft,
  Shield,
  User,
  KeyRound,
  WifiOff,
  AlertTriangle,
  BadgeInfo,
  Target,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function PrivacyClient() {
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
          {/* Title */}
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-[#ffc759] to-[#ffb84d] border border-[#ffc759] rounded-full text-sm font-medium text-slate-900 mb-6">
              <Shield size={16} />
              <span>Privacy, Deception and Device Abuse</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-6">
              Protecting users and their data
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              We’re committed to protecting user privacy and providing a safe
              and secure environment. Apps or behaviors that are deceptive,
              malicious, or intended to abuse or misuse any network, device, or
              personal data are strictly prohibited.
            </p>
          </motion.div>

          <div className="space-y-12">
            {/* Intro / Statement */}
            <motion.section
              className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-lg border border-slate-200 dark:border-slate-700"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.05 }}
            >
              <div className="space-y-4 text-slate-600 dark:text-slate-300">
                <p>
                  We design our services to respect user privacy, maintain
                  transparency, and safeguard personal information. We do not
                  tolerate deceptive behavior, device or network abuse, or any
                  practice that risks user trust and safety.
                </p>
                <p>
                  This page summarizes our approach and the standards we expect
                  of our software and any integrated experiences.
                </p>
              </div>
            </motion.section>

            {/* User Data */}
            <motion.section
              className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-lg border border-slate-200 dark:border-slate-700"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
            >
              <div className="flex items-center space-x-3 mb-6">
                <User className="w-6 h-6 text-[#ffc759]" />
                <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">
                  User Data
                </h2>
              </div>
              <div className="space-y-4 text-slate-600 dark:text-slate-300">
                <p>
                  We collect and process only the data necessary to operate our
                  services and deliver value to users. Our principles:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>
                    Transparency: clear explanations about what we collect, how
                    we use it, and why.
                  </li>
                  <li>
                    Consent: obtain user consent where required; respect user
                    choices and privacy controls.
                  </li>
                  <li>
                    Minimization: limit collection to what’s relevant and
                    necessary for functionality.
                  </li>
                  <li>
                    Security: protect data in transit and at rest using industry
                    best practices.
                  </li>
                  <li>
                    Access &amp; deletion: provide means to access, correct, or
                    request deletion of personal data, subject to legal
                    obligations.
                  </li>
                </ul>
              </div>
            </motion.section>

            {/* Permissions & Sensitive APIs */}
            <motion.section
              className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-lg border border-slate-200 dark:border-slate-700"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.15 }}
            >
              <div className="flex items-center space-x-3 mb-6">
                <KeyRound className="w-6 h-6 text-[#ffc759]" />
                <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">
                  Permissions and APIs that Access Sensitive Information
                </h2>
              </div>
              <div className="space-y-4 text-slate-600 dark:text-slate-300">
                <p>
                  We request permissions only when a feature requires them,
                  explaining the purpose and providing in-product context.
                  Sensitive permissions are:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>
                    Requested just-in-time and only used for declared features.
                  </li>
                  <li>
                    Revocable by users at any time through system or app
                    settings.
                  </li>
                  <li>
                    Never used to harvest data unrelated to core functionality.
                  </li>
                </ul>
              </div>
            </motion.section>

            {/* Device & Network Abuse */}
            <motion.section
              className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-lg border border-slate-200 dark:border-slate-700"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="flex items-center space-x-3 mb-6">
                <WifiOff className="w-6 h-6 text-[#ffc759]" />
                <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">
                  Device and Network Abuse
                </h2>
              </div>
              <div className="space-y-4 text-slate-600 dark:text-slate-300">
                <p>
                  We prohibit any activity that compromises device integrity,
                  degrades network quality, or exploits system resources,
                  including:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>
                    Malware, spyware, cryptojacking, or unauthorized background
                    activity.
                  </li>
                  <li>
                    Excessive bandwidth consumption or denial-of-service
                    behavior.
                  </li>
                  <li>
                    Interference with other apps, APIs, or system services.
                  </li>
                </ul>
              </div>
            </motion.section>

            {/* Deceptive Behavior */}
            <motion.section
              className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-lg border border-slate-200 dark:border-slate-700"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.25 }}
            >
              <div className="flex items-center space-x-3 mb-6">
                <AlertTriangle className="w-6 h-6 text-[#ffc759]" />
                <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">
                  Deceptive Behavior
                </h2>
              </div>
              <div className="space-y-4 text-slate-600 dark:text-slate-300">
                <p>
                  We do not engage in misleading, manipulative, or fraudulent
                  behavior. Prohibited practices include:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>
                    False claims about features, affiliations, or outcomes.
                  </li>
                  <li>
                    Dark patterns that coerce user actions or hide essential
                    choices.
                  </li>
                  <li>
                    Cloaking content or functionality to bypass review or user
                    expectations.
                  </li>
                </ul>
              </div>
            </motion.section>

            {/* Misrepresentation */}
            <motion.section
              className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-lg border border-slate-200 dark:border-slate-700"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <div className="flex items-center space-x-3 mb-6">
                <BadgeInfo className="w-6 h-6 text-[#ffc759]" />
                <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">
                  Misrepresentation
                </h2>
              </div>
              <div className="space-y-4 text-slate-600 dark:text-slate-300">
                <p>
                  We accurately represent our identity, functionality, pricing,
                  and data usage. We avoid:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Impersonation of brands, people, or organizations.</li>
                  <li>Ambiguous or hidden subscriptions, fees, or charges.</li>
                  <li>
                    Inaccurate disclosures about data collection or sharing.
                  </li>
                </ul>
              </div>
            </motion.section>

            {/* Target API Level */}
            <motion.section
              className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-lg border border-slate-200 dark:border-slate-700"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.35 }}
            >
              <div className="flex items-center space-x-3 mb-6">
                <Target className="w-6 h-6 text-[#ffc759]" />
                <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">
                  Google Play&apos;s Target API Level Policy
                </h2>
              </div>
              <div className="space-y-4 text-slate-600 dark:text-slate-300">
                <p>
                  For Android experiences, we adhere to Google Play’s Target API
                  Level requirements to ensure modern security, privacy, and
                  performance standards. We regularly update target and compile
                  SDKs, and adjust permission usage per the latest platform
                  policies.
                </p>
              </div>
            </motion.section>

            {/* Contact / Links */}
            <motion.section
              className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-lg border border-slate-200 dark:border-slate-700"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <div className="space-y-4 text-slate-600 dark:text-slate-300">
                <p>
                  For our general data practices, please also see our{" "}
                  <Link
                    href="/privacy-policy"
                    className="text-[#ffc759] hover:underline"
                  >
                    Privacy Policy
                  </Link>
                  .
                </p>
                <p>
                  Questions or concerns? Contact us at{" "}
                  <a
                    href="mailto:info@hirewithpom.com"
                    className="text-[#ffc759] hover:underline"
                  >
                    info@hirewithpom.com
                  </a>
                  .
                </p>
              </div>
            </motion.section>

            {/* Privacy Policy (Markdown) */}
            <motion.section
              className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-lg border border-slate-200 dark:border-slate-700"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.42 }}
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

**Email:** admin@hirewithpom.com

---

## 12. Consent

By using our website or mobile application, you consent to this Privacy Policy.

---`}
                </ReactMarkdown>
              </div>
            </motion.section>
          </div>

          {/* Footer note */}
          <motion.div
            className="text-center mt-16 p-6 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.45 }}
          >
            <p className="text-slate-600 dark:text-slate-400">
              <strong>Last updated:</strong> March 2026. We may update this page
              periodically to reflect evolving platform and policy requirements.
            </p>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
