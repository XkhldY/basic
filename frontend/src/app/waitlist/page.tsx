'use client';

import { Waitlist } from '@clerk/nextjs';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function WaitlistPage() {
  return (
    <>
      <style dangerouslySetInnerHTML={{
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
        `
      }} />
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 relative">
      {/* Back button */}
      <Link href="/" className="back-button absolute top-6 left-6 z-10 flex items-center space-x-2 text-white/70 hover:text-white transition-colors duration-200 group no-underline border-0 outline-none focus:outline-none" style={{ textDecoration: 'none', border: 'none', outline: 'none' }}>
        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-200" />
        <span className="text-sm font-medium">Back to home</span>
      </Link>
      
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
        <Waitlist 
          appearance={{
          elements: {
            card: "bg-white/10 backdrop-blur-sm shadow-2xl border border-white/20 rounded-t-2xl rounded-b-none p-8 pb-10",
            rootBox: "p-0 m-0",
            header: "p-0 m-0 mb-4",
            form: "p-0 m-0",
            footer: "bg-transparent shadow-none border-0 p-0 m-0 mt-0",
            footerAction: "bg-transparent shadow-none border-0 hidden",
            footerPages: "bg-transparent shadow-none border-0 p-0 m-0 -mt-1",
            footerActionPages: "bg-transparent shadow-none border-0",
            formButtonPrimary: "w-full bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-900 font-semibold py-3 px-6 rounded-xl transition-all duration-200 border-0 mt-0 mb-4",
            formFieldInput: "w-full bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:bg-white/20 focus:border-white/40 rounded-xl px-4 py-3 transition-all duration-200",
            formFieldRow: "mb-0",
              headerTitle: "text-white text-2xl font-bold mb-3",
              headerSubtitle: "text-gray-300 text-center leading-relaxed",
              formFieldLabel: "text-white font-medium mb-2",
              footerActionText: "text-gray-400",
              footerActionLink: "text-amber-400 hover:text-amber-300"
            }
          }}
        />
        </div>
      </div>
    </div>
    </>
  );
}