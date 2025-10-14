"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function WaitlistPage() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the email to your backend
    console.log("Waitlist signup:", email);
    setIsSubmitted(true);
  };

  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
          .back-button,
          .back-button:focus,
          .back-button:active,
          .back-button:hover,
          .back-button:visited {
            border: none !important;
            outline: none !important;
            text-decoration: none !important;
            box-shadow: none !important;
            -webkit-tap-highlight-color: transparent !important;
          }
        `,
        }}
      />
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 relative">
        {/* Back button */}
        <Link
          href="/"
          className="back-button absolute top-6 left-6 z-10 flex items-center space-x-2 text-white/70 hover:text-white transition-colors duration-200 group no-underline border-0 outline-none focus:outline-none"
          style={{ textDecoration: "none", border: "none", outline: "none" }}
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-200" />
          <span className="text-sm font-medium">Back to home</span>
        </Link>

        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="w-full max-w-md">
            <div className="bg-white/10 backdrop-blur-sm shadow-2xl border border-white/20 rounded-t-2xl rounded-b-none p-8 pb-10">
              <div className="text-center mb-6">
                <h1 className="text-white text-2xl font-bold mb-3">Join the Waitlist</h1>
                <p className="text-gray-300 text-center leading-relaxed">
                  Be the first to know when we launch new features and opportunities.
                </p>
              </div>
              
              {!isSubmitted ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="email" className="text-white font-medium mb-2 block">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      required
                      className="w-full bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:bg-white/20 focus:border-white/40 rounded-xl px-4 py-3 transition-all duration-200"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-900 font-semibold py-3 px-6 rounded-xl transition-all duration-200 border-0 mt-0 mb-4"
                  >
                    Join Waitlist
                  </button>
                </form>
              ) : (
                <div className="text-center">
                  <div className="text-amber-400 text-4xl mb-4">✓</div>
                  <h2 className="text-white text-xl font-bold mb-2">You're on the list!</h2>
                  <p className="text-gray-300">
                    Thank you for joining our waitlist. We'll notify you when we have updates.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
