"use client";

import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

const Navigation = () => {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [currentSection, setCurrentSection] = useState("hero");
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsScrolled(currentScrollY > 50);

      // Hide/show navbar based on scroll direction - ONLY on mobile
      if (window.innerWidth < 768) {
        // md breakpoint
        if (currentScrollY > lastScrollY && currentScrollY > 100) {
          // Scrolling down and past initial threshold
          setIsVisible(false);
        } else if (currentScrollY < lastScrollY) {
          // Scrolling up
          setIsVisible(true);
        }
      } else {
        // On desktop, always keep navbar visible
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);

      // Check which section the navbar is currently over
      const sections = [
        {
          id: "hero",
          element: document.querySelector("section:first-of-type"),
        },
        { id: "features", element: document.getElementById("features") },
        { id: "contact", element: document.getElementById("contact") },
      ];

      let activeSection = "hero";

      sections.forEach(({ id, element }) => {
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 80 && rect.bottom >= 80) {
            activeSection = id;
          }
        }
      });

      setCurrentSection(activeSection);
    };

    const handleResize = () => {
      // When switching to desktop, ensure navbar is visible
      if (window.innerWidth >= 768) {
        setIsVisible(true);
      }
    };

    if (typeof window !== "undefined") {
      window.addEventListener("scroll", handleScroll);
      window.addEventListener("resize", handleResize);
      return () => {
        window.removeEventListener("scroll", handleScroll);
        window.removeEventListener("resize", handleResize);
      };
    }
  }, [lastScrollY]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navigateToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      // If we're on the home page, scroll to the section
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    } else {
      // If we're not on the home page, navigate to home page with hash
      router.push(`/#${sectionId}`);
      // Wait for navigation to complete, then scroll with proper timing
      const scrollToTarget = () => {
        const targetElement = document.getElementById(sectionId);
        if (targetElement) {
          const offset = 80; // Same offset as when on home page
          const elementPosition = targetElement.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - offset;
          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth",
          });
        } else {
          // If element not found yet, try again after a short delay
          setTimeout(scrollToTarget, 50);
        }
      };

      // Start trying to scroll after navigation
      setTimeout(scrollToTarget, 100);
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] transform ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      } ${
        isMounted && currentSection === "features"
          ? "bg-amber-100 border-b border-amber-200/50"
          : isMounted && currentSection === "contact"
          ? "bg-amber-100 border-b border-amber-200/50"
          : isMounted && isScrolled
          ? "bg-slate-950/95 backdrop-blur-sm border-b border-slate-800/50"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      {/* Desktop Navigation */}
      <nav className="container-custom">
        <div className="hidden md:grid grid-cols-3 items-center h-20">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-start h-20"
          >
            <Link
              href="/"
              className="flex items-center space-x-3 group focus:outline-none focus:ring-0 focus:border-0 focus:shadow-none focus:ring-offset-0"
              style={{
                outline: "none",
                WebkitTapHighlightColor: "transparent",
              }}
            >
              <motion.div className="relative">
                <img
                  src={
                    isMounted &&
                    (currentSection === "features" ||
                      currentSection === "contact")
                      ? "/img/black@2x.png"
                      : "/img/white@2x.png"
                  }
                  alt="POM Logo"
                  className="w-24 h-24 object-contain transition-all duration-300 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:scale-110"
                  onError={(e) => {
                    console.error("Logo failed to load:", e);
                    e.currentTarget.style.display = "none";
                  }}
                />
              </motion.div>
            </Link>
          </motion.div>

          {/* Desktop Navigation - Centered */}
          <motion.div
            className="flex items-center justify-center h-20"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="flex items-center space-x-8">
              <Link
                href="/#features"
                onClick={(e) => {
                  e.preventDefault();
                  navigateToSection("features");
                }}
                className={`transition-all duration-300 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] focus:outline-none focus:ring-0 focus:border-0 focus:shadow-none focus:ring-offset-0 focus:ring-offset-transparent cursor-pointer ${
                  isMounted &&
                  (currentSection === "features" ||
                    currentSection === "contact")
                    ? "text-gray-800 hover:text-gray-900"
                    : isMounted && isScrolled
                    ? "text-gray-300 hover:text-white"
                    : "text-white hover:text-gray-200"
                }`}
                style={{
                  outline: "none",
                  WebkitTapHighlightColor: "transparent",
                }}
              >
                Features
              </Link>
              <Link
                href="/#jobs"
                onClick={(e) => {
                  e.preventDefault();
                  navigateToSection("jobs");
                }}
                className={`transition-all duration-300 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] focus:outline-none focus:ring-0 focus:border-0 focus:shadow-none focus:ring-offset-0 focus:ring-offset-transparent cursor-pointer ${
                  isMounted &&
                  (currentSection === "features" ||
                    currentSection === "contact")
                    ? "text-gray-800 hover:text-gray-900"
                    : isMounted && isScrolled
                    ? "text-gray-300 hover:text-white"
                    : "text-white hover:text-gray-200"
                }`}
                style={{
                  outline: "none",
                  WebkitTapHighlightColor: "transparent",
                }}
              >
                Jobs
              </Link>
              <Link
                href="/blog"
                className={`transition-all duration-300 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] focus:outline-none focus:ring-0 focus:border-0 focus:shadow-none focus:ring-offset-0 focus:ring-offset-transparent cursor-pointer ${
                  isMounted &&
                  (currentSection === "features" ||
                    currentSection === "contact")
                    ? "text-gray-800 hover:text-gray-900"
                    : isMounted && isScrolled
                    ? "text-gray-300 hover:text-white"
                    : "text-white hover:text-gray-200"
                }`}
                style={{
                  outline: "none",
                  WebkitTapHighlightColor: "transparent",
                }}
              >
                Blog
              </Link>
              <Link
                href="/#contact"
                onClick={(e) => {
                  e.preventDefault();
                  navigateToSection("contact");
                }}
                className={`transition-all duration-300 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] focus:outline-none focus:ring-0 focus:border-0 focus:shadow-none focus:ring-offset-0 focus:ring-offset-transparent cursor-pointer ${
                  isMounted &&
                  (currentSection === "features" ||
                    currentSection === "contact")
                    ? "text-gray-800 hover:text-gray-900"
                    : isMounted && isScrolled
                    ? "text-gray-300 hover:text-white"
                    : "text-white hover:text-gray-200"
                }`}
                style={{
                  outline: "none",
                  WebkitTapHighlightColor: "transparent",
                }}
              >
                Contact
              </Link>
            </div>
          </motion.div>

          {/* Desktop CTA Buttons */}
          <motion.div
            className="flex items-center justify-end space-x-4 h-20"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Commented out Sign in button for now
            <Link href="/auth">
              <button className={`font-medium transition-all duration-300 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] focus:outline-none focus:ring-0 focus:border-0 focus:shadow-none focus:ring-offset-0 ${
                isMounted && currentSection === 'features'
                  ? 'text-gray-800 hover:text-gray-900' 
                  : isMounted && isScrolled 
                      ? 'text-gray-300 hover:text-white' 
                      : 'text-white hover:text-gray-200'
              }`} style={{ outline: 'none', WebkitTapHighlightColor: 'transparent' }}>
                Sign in
              </button>
            </Link> */}
            <Link href="/waitlist">
              <button className="btn-primary">Join the waitlist</button>
            </Link>
          </motion.div>
        </div>
      </nav>

      {/* Mobile Navigation - Full Width */}
      <div
        className={`md:hidden flex items-center justify-between h-20 transition-all duration-300 px-4 sm:px-6 lg:px-8 ${
          isMenuOpen ? "bg-slate-950" : ""
        }`}
      >
        <div className="w-full flex items-center justify-between h-20">
          {/* Mobile Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center"
          >
            <Link
              href="/"
              className="flex items-center space-x-3 group focus:outline-none focus:ring-0 focus:border-0 focus:shadow-none focus:ring-offset-0"
              style={{
                outline: "none",
                WebkitTapHighlightColor: "transparent",
              }}
            >
              <motion.div className="relative">
                <img
                  src={
                    isMenuOpen
                      ? "/img/white@2x.png"
                      : isMounted &&
                        (currentSection === "features" ||
                          currentSection === "contact")
                      ? "/img/black@2x.png"
                      : "/img/white@2x.png"
                  }
                  alt="POM Logo"
                  className="w-20 h-20 object-contain transition-all duration-300 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:scale-110"
                  onError={(e) => {
                    console.error("Logo failed to load:", e);
                    e.currentTarget.style.display = "none";
                  }}
                />
              </motion.div>
            </Link>
          </motion.div>

          {/* Mobile Menu Button */}
          <motion.button
            className="p-1 transition-colors duration-200 border-0 outline-none focus:outline-none focus:ring-0 focus:border-0 focus:shadow-none focus:ring-offset-0"
            style={{ border: "none", outline: "none", boxShadow: "none" }}
            onClick={toggleMenu}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            {isMenuOpen ? (
              <X size={24} className="text-white" />
            ) : (
              <Menu
                size={24}
                className={
                  isMounted &&
                  (currentSection === "features" ||
                    currentSection === "contact")
                    ? "text-gray-800"
                    : "text-white"
                }
              />
            )}
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <motion.div
          className="md:hidden py-6 border-t border-slate-800 bg-slate-950"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="container-custom">
            <div className="flex flex-col items-center space-y-4">
              <Link
                href="/#features"
                onClick={(e) => {
                  e.preventDefault();
                  navigateToSection("features");
                  setIsMenuOpen(false);
                }}
                className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors duration-200 focus:outline-none focus:ring-0 focus:border-0 focus:shadow-none focus:ring-offset-0 focus:ring-offset-transparent cursor-pointer text-right"
                style={{
                  outline: "none",
                  WebkitTapHighlightColor: "transparent",
                }}
              >
                Features
              </Link>
              <Link
                href="/#jobs"
                onClick={(e) => {
                  e.preventDefault();
                  navigateToSection("jobs");
                  setIsMenuOpen(false);
                }}
                className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors duration-200 focus:outline-none focus:ring-0 focus:border-0 focus:shadow-none focus:ring-offset-0 focus:ring-offset-transparent cursor-pointer text-right"
                style={{
                  outline: "none",
                  WebkitTapHighlightColor: "transparent",
                }}
              >
                Jobs
              </Link>
              <Link
                href="/blog"
                onClick={() => setIsMenuOpen(false)}
                className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors duration-200 focus:outline-none focus:ring-0 focus:border-0 focus:shadow-none focus:ring-offset-0 focus:ring-offset-transparent cursor-pointer text-right"
                style={{
                  outline: "none",
                  WebkitTapHighlightColor: "transparent",
                }}
              >
                Blog
              </Link>
              <Link
                href="/#contact"
                onClick={(e) => {
                  e.preventDefault();
                  navigateToSection("contact");
                  setIsMenuOpen(false);
                }}
                className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors duration-200 focus:outline-none focus:ring-0 focus:border-0 focus:shadow-none focus:ring-offset-0 focus:ring-offset-transparent cursor-pointer text-right"
                style={{
                  outline: "none",
                  WebkitTapHighlightColor: "transparent",
                }}
              >
                Contact
              </Link>
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700 flex flex-col items-center w-full">
                {/* Sign in button hidden for now */}
                {/* <Link href="/sign-in">
                  <button className="text-white hover:text-gray-200 transition-colors duration-200 px-4 py-2 text-sm font-medium">
                    Sign in
                  </button>
                </Link> */}
                <Link href="/waitlist">
                  <button
                    className="btn-primary px-4 py-2 text-sm"
                    style={{ width: "140px" }}
                  >
                    Join the waitlist
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </header>
  );
};

export default Navigation;
