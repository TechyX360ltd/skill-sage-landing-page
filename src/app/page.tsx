"use client";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";

// Client-side only wrapper to prevent hydration issues
function ClientOnly({ children }: { children: React.ReactNode }) {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return null;
  }

  return <>{children}</>;
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  // Custom cursor state for Get Started button
  const [cursor, setCursor] = useState({ x: 0, y: 0, hovering: false });
  // Separate cursor states for course buttons
  const [cursor1, setCursor1] = useState({ x: 0, y: 0, hovering: false });
  const [cursor2, setCursor2] = useState({ x: 0, y: 0, hovering: false });
  const [cursor3, setCursor3] = useState({ x: 0, y: 0, hovering: false });
  // Category dropdown state
  const [catOpen, setCatOpen] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  // Featured courses state
  const [featuredCourses, setFeaturedCourses] = useState<any[]>([]);
  const [coursesLoading, setCoursesLoading] = useState(true);
  const catBtnRef = useRef<HTMLButtonElement>(null);
  const catDropdownRef = useRef<HTMLDivElement>(null);
  // State for Why Skill Sage submenu
  const [whyOpen, setWhyOpen] = useState(false);
  // State for Why Skill Sage section tab
  const [tab, setTab] = useState<'learners' | 'creators'>('learners');
  const [activeMenu, setActiveMenu] = useState("Home");

  // Typing animation for hero title
  const words = ["Build", "Grow", "Monetize"];
  const [wordIdx, setWordIdx] = useState(0);
  const [typed, setTyped] = useState("");
  const [typing, setTyping] = useState(true);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (typing) {
      if (typed.length < words[wordIdx].length) {
        timeout = setTimeout(() => setTyped(words[wordIdx].slice(0, typed.length + 1)), 220); // even slower typing
      } else {
        timeout = setTimeout(() => setTyping(false), 1800); // longer pause
      }
    } else {
      if (typed.length > 0) {
        timeout = setTimeout(() => setTyped(words[wordIdx].slice(0, typed.length - 1)), 120); // slower erasing
      } else {
        timeout = setTimeout(() => {
          setTyping(true);
          setWordIdx((wordIdx + 1) % words.length);
        }, 900);
      }
    }
    return () => clearTimeout(timeout);
  }, [typed, typing, wordIdx]);

  // Fetch categories when dropdown opens (if not already loaded)
  useEffect(() => {
    if (catOpen && typeof window !== 'undefined') {
      // Load from localStorage first
      const cached = localStorage.getItem('categories');
      if (cached && categories.length === 0) {
        try {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed)) setCategories(parsed);
        } catch {}
      }
      // Always try to fetch fresh categories
      fetch('/api/categories')
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) {
            setCategories(data);
            localStorage.setItem('categories', JSON.stringify(data));
          }
        })
        .catch(() => {/* ignore fetch errors, keep cached */});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [catOpen]);

  // Fetch featured courses on component mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Load from localStorage first
      const cached = localStorage.getItem('featuredCourses');
      if (cached && featuredCourses.length === 0) {
        try {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed)) {
            setFeaturedCourses(parsed);
            setCoursesLoading(false);
          }
        } catch {}
      }
      // Always try to fetch fresh courses
      fetch('https://rpexcrwcgdmlfxihdmny.functions.supabase.co/featured-courses', {
        headers: {
          'Authorization': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJwZXhjcndjZ2RtbGZ4aWhkbW55Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEzMzA1MzgsImV4cCI6MjA2NjkwNjUzOH0.ojXLqeHrpeKVgXx-NJnzRMXlBj6uKRsWT1TRRcS9ZGs'
        }
      })
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) {
            setFeaturedCourses(data);
            setCoursesLoading(false);
            localStorage.setItem('featuredCourses', JSON.stringify(data));
          }
        })
        .catch(() => {
          setCoursesLoading(false);
          // ignore fetch errors, keep cached
        });
    }
  }, [featuredCourses.length]);

  // Close dropdown on outside click
  useEffect(() => {
    if (!catOpen) return;
    function handleClick(e: MouseEvent) {
      if (
        catDropdownRef.current &&
        !catDropdownRef.current.contains(e.target as Node) &&
        catBtnRef.current &&
        !catBtnRef.current.contains(e.target as Node)
      ) {
        setCatOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [catOpen]);

  return (
    <div className="font-sans min-h-screen w-full flex flex-col bg-white" suppressHydrationWarning>
      <div suppressHydrationWarning>
      {/* Header - Histudy Style with Glass Effect */}
      <header className="w-full sticky top-0 z-30">
        <div className="mx-auto flex items-center justify-between px-4 py-3 md:px-[15px] md:py-4 rounded-[32px] md:rounded-[60px] w-full md:w-[calc(100%-30px)] mt-2 bg-white/70 backdrop-blur-md shadow-sm" style={{background: 'inherit'}}>
          {/* Left: Logo */}
          <div className="flex items-center gap-2 md:gap-4 ml-0">
            <Image src="/Skill Sage Logo.png" alt="SKILL SAGE Logo" width={120} height={40} className="ml-1 md:ml-4 w-[120px] md:w-[180px] h-auto" />
            <ClientOnly>
              <div className="relative hidden md:block">
                <button
                  ref={catBtnRef}
                  className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium px-4 py-2 rounded-full ml-2 shadow-sm transition focus:outline-none"
                  onClick={() => setCatOpen(v => !v)}
                  aria-haspopup="true"
                  aria-expanded={catOpen}
                  type="button"
                >
                  {/* Grid Icon */}
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="2"/><rect x="14" y="3" width="7" height="7" rx="2"/><rect x="14" y="14" width="7" height="7" rx="2"/><rect x="3" y="14" width="7" height="7" rx="2"/></svg>
                  Category
                  <svg className={`w-4 h-4 transition-transform duration-200 ${catOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                </button>
                {/* Dropdown */}
                {catOpen && (
                  <div
                    ref={catDropdownRef}
                    className="absolute left-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 z-50 animate-fade-in-down"
                    style={{ minWidth: 180 }}
                  >
                    <div className="py-2">
                      {categories.length === 0 ? (
                        <div className="px-4 py-2 text-gray-400 text-sm">Loading...</div>
                      ) : (
                        categories.map((cat, i) => (
                          <div
                            key={cat + i}
                            className="px-4 py-2 text-gray-700 hover:bg-[#e0edff] hover:text-blue-700 cursor-pointer transition-all rounded-lg"
                          >
                            {cat}
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            </ClientOnly>
          </div>
          {/* Desktop Nav */}
          <nav className="hidden md:flex gap-4 text-base font-semibold text-gray-800 mx-auto justify-center flex-1">
            {[
              { label: "Home" },
              { label: "Why Skill Sage", submenu: ["For Learners", "For Creators"] },
              { label: "Learn" },
              { label: "Company" }
            ].map((item, idx) => (
              <div key={item.label} className="relative group">
                {item.submenu ? (
                  <>
                    <button
                      className="flex items-center gap-1 px-4 py-2 rounded-full transition-all duration-300 group-hover:bg-[#e0edff] group-hover:text-blue-700 focus:bg-[#e0edff] focus:text-blue-700"
                      style={{ minWidth: 90 }}
                      onClick={e => { e.preventDefault(); setWhyOpen(v => !v); }}
                      onMouseEnter={() => setWhyOpen(true)}
                      onMouseLeave={() => setWhyOpen(false)}
                      aria-haspopup="true"
                      aria-expanded={whyOpen}
                      type="button"
                    >
                      <span className="transition-colors duration-300">{item.label}</span>
                      <svg className={`w-4 h-4 transition-transform duration-300 ${whyOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                    </button>
                    {whyOpen && (
                      <div className="absolute left-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 z-50 animate-fade-in-down" onMouseEnter={() => setWhyOpen(true)} onMouseLeave={() => setWhyOpen(false)}>
                        <div className="py-2">
                          {item.submenu.map((sub, i) => (
                            <a
                              key={sub + i}
                              href="#"
                              className="block px-4 py-2 text-gray-700 hover:bg-[#e0edff] hover:text-blue-700 cursor-pointer transition-all rounded-lg"
                            >
                              {sub}
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <a
                    href="#"
                    className="flex items-center gap-1 px-4 py-2 rounded-full transition-all duration-300 group-hover:bg-[#e0edff] group-hover:text-blue-700 focus:bg-[#e0edff] focus:text-blue-700"
                    style={{ minWidth: 90 }}
                  >
                    <span className="transition-colors duration-300">{item.label}</span>
                  </a>
                )}
              </div>
            ))}
          </nav>
          {/* Desktop Right: Buttons */}
          <div className="hidden md:flex items-center gap-4 mr-0">
            {/* Divider */}
            <div className="h-6 w-px bg-gray-200 mx-2" />
            {/* User Icon + Login */}
            <div className="flex items-center gap-2">
              {/* Login Icon */}
              <a
                href="#login"
                className="flex items-center gap-2 font-medium text-gray-700 transition-colors duration-200 hover:bg-[#F2F2F2] focus:bg-[#F2F2F2]"
                style={{ cursor: 'pointer', padding: '12px 32px', height: '52px', borderRadius: '32px', display: 'flex', alignItems: 'center' }}
              >
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6A2.25 2.25 0 0 0 5.25 5.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15" /><path strokeLinecap="round" strokeLinejoin="round" d="M18 12H9m0 0l3-3m-3 3l3 3" /></svg>
                <span>Login</span>
              </a>
            </div>
            {/* Get Started Button with custom cursor */}
            <div
              style={{ position: 'relative', display: 'flex', alignItems: 'center' }}
              onMouseMove={e => {
                const rect = e.currentTarget.getBoundingClientRect();
                setCursor({
                  x: e.clientX - rect.left,
                  y: e.clientY - rect.top,
                  hovering: true
                });
              }}
              onMouseLeave={() => setCursor(c => ({ ...c, hovering: false }))}
            >
              <a
                href="#get-started"
                className="font-bold text-white bg-[#1D4ED8] shadow-sm transition relative group overflow-hidden text-sm md:text-base"
                style={{borderRadius: '32px', padding: '12px 32px', height: '52px', display: 'flex', alignItems: 'center', marginRight: 0, cursor: 'none'}}
              >
                {/* Sliding background effect */}
                <span className="absolute inset-0 left-0 top-0 w-full h-full z-0 transition-all duration-300 group-hover:w-0 bg-[#1D4ED8]" style={{borderRadius: '32px'}}></span>
                <span className="absolute inset-0 left-0 top-0 w-0 h-full z-0 transition-all duration-300 group-hover:w-full bg-white" style={{borderRadius: '32px'}}></span>
                <span className="relative z-10 flex items-center gap-2 group-hover:text-[#1D4ED8] transition-colors duration-300" style={{width: '100%', justifyContent: 'center'}}>
                  Get Started
                </span>
                {/* Custom cursor circle that follows pointer */}
                {cursor.hovering && (
                  <span
                    className="pointer-events-none absolute"
                    style={{
                      left: cursor.x - 12,
                      top: cursor.y - 12,
                      width: 24,
                      height: 24,
                      borderRadius: '50%',
                      border: '2px solid #2563eb',
                      background: '#e0edff',
                      opacity: 0.7,
                      transition: 'left 0.1s, top 0.1s',
                      zIndex: 20
                    }}
                  />
                )}
              </a>
            </div>
          </div>
          {/* Mobile Hamburger */}
          <button className="md:hidden flex items-center px-2 py-1 border rounded text-indigo-700 border-indigo-200 ml-2 bg-white/60 backdrop-blur" onClick={() => setMenuOpen(!menuOpen)}>
            <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" /></svg>
          </button>
        </div>
        {/* Mobile Nav Drawer */}
        <AnimatePresence>
          {menuOpen && (
            <motion.nav
              key="mobile-menu"
              initial={{ x: "100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "100%", opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="md:hidden fixed top-0 left-0 w-full h-full flex flex-col gap-4 px-8 pt-24 pb-8 bg-white/80 backdrop-blur-lg shadow-lg z-40 animate-fade-in-down"
            >
              <button className="absolute top-6 right-6 p-2 rounded-full bg-white/70" onClick={() => setMenuOpen(false)}>
                <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
              <a
                href="#"
                onClick={() => setActiveMenu("Home")}
                className={`hover:text-indigo-600 transition text-lg font-semibold px-3 py-2 rounded ${activeMenu === "Home" ? "bg-indigo-100 text-indigo-700 font-bold" : ""}`}
              >Home</a>
              <div>
                <button
                  className={`flex items-center gap-2 w-full text-left text-lg font-semibold hover:text-indigo-600 transition focus:outline-none px-3 py-2 rounded ${activeMenu === "Why Skill Sage" ? "bg-indigo-100 text-indigo-700 font-bold" : ""}`}
                  onClick={() => setWhyOpen(v => !v)}
                  aria-haspopup="true"
                  aria-expanded={whyOpen}
                  type="button"
                >
                  Why Skill Sage
                  <svg className={`w-4 h-4 transition-transform duration-200 ${whyOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                </button>
                {whyOpen && (
                  <div className="ml-4 mt-2 flex flex-col gap-2">
                    <a
                      href="#"
                      onClick={() => setActiveMenu("For Learners")}
                      className={`text-base font-medium hover:text-indigo-600 transition px-3 py-2 rounded ${activeMenu === "For Learners" ? "bg-indigo-100 text-indigo-700 font-bold" : ""}`}
                    >For Learners</a>
                    <a
                      href="#"
                      onClick={() => setActiveMenu("For Creators")}
                      className={`text-base font-medium hover:text-indigo-600 transition px-3 py-2 rounded ${activeMenu === "For Creators" ? "bg-indigo-100 text-indigo-700 font-bold" : ""}`}
                    >For Creators</a>
                  </div>
                )}
              </div>
              <a
                href="#"
                onClick={() => setActiveMenu("Learn")}
                className={`hover:text-indigo-600 transition text-lg font-semibold px-3 py-2 rounded ${activeMenu === "Learn" ? "bg-indigo-100 text-indigo-700 font-bold" : ""}`}
              >Learn</a>
              <a
                href="#"
                onClick={() => setActiveMenu("Company")}
                className={`hover:text-indigo-600 transition text-lg font-semibold px-3 py-2 rounded ${activeMenu === "Company" ? "bg-indigo-100 text-indigo-700 font-bold" : ""}`}
              >Company</a>
              <a
                href="#login"
                onClick={() => setActiveMenu("Login")}
                className={`font-bold border border-[#1D4ED8] text-[#1D4ED8] bg-white rounded-full px-6 py-3 text-lg text-center shadow hover:bg-[#e0edff] transition ${activeMenu === "Login" ? "ring-4 ring-indigo-100" : ""}`}
              >Login</a>
              <a
                href="#get-started"
                onClick={() => setActiveMenu("Get Started")}
                className={`font-bold text-white bg-[#1D4ED8] rounded-full px-6 py-3 text-lg text-center shadow hover:bg-[#2563eb] transition ${activeMenu === "Get Started" ? "ring-4 ring-indigo-200" : ""}`}
              >Get Started</a>
              <div className="mt-auto pt-8 text-center text-xs text-gray-500 opacity-80">
                &copy; Skill Sage - by TechyX360
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </header>
      {/* Hero Section - Clean Histudy Style */}
      <section className="w-full flex flex-col items-center justify-between px-6 md:px-16 pb-32 pt-16 md:pt-28 bg-transparent relative overflow-hidden min-h-[100vh] md:min-h-[850px]" style={{ minHeight: '100vh' }}>
        {/* Gradient Background */}
        <div
          aria-hidden
          className="absolute inset-0 z-0 pointer-events-none"
          style={{
            background: 'linear-gradient(to top, #1D4ED8 0%,rgb(255, 233, 173) 100%)',
            opacity: 0.18,
            top: 0,
            height: '100%',
          }}
        />
        {/* Convex SVG at bottom */}
        <svg
          className="absolute left-0 bottom-0 w-full h-16 md:h-20 z-10"
          viewBox="0 0 1440 60"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <path
            d="M0,60 Q720,0 1440,60 L1440,60 L0,60 Z"
            fill="#fff"
            fillOpacity="1"
          />
        </svg>
        {/* Content Container */}
        <div className="w-full flex flex-col md:flex-row items-center justify-between gap-16 md:gap-16 z-20">
          {/* Left: Text Content */}
          <div className="w-full md:w-1/2 flex flex-col items-start justify-center gap-6 md:gap-8 order-1 md:order-1">
            <motion.h1
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.7 }}
              className="font-extrabold leading-tight mb-2 text-left text-[40px] md:text-[28px] lg:text-[72px]" style={{ color: '#000', lineHeight: 1.1, fontWeight: 800, letterSpacing: '-0.01em' }}
            >
              <span className="block text-[#1D4ED8]">
                {typed}
                {typed.length === 0 ? words[wordIdx][0] : ''}
                {typed.length === 0 ? words[wordIdx].slice(1) : ''}
                <span className="inline-block animate-blink" style={{ color: '#000' }}>|</span>
              </span>
              <span className="block" style={{ color: '#000' }}>Your Skills With</span>
              <span className="block text-[#1D4ED8]">Skill Sage</span>
            </motion.h1>
            <motion.p
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.7 }}
              className="mb-4 md:mb-6 max-w-xl text-left"
              style={{ fontSize: '18px', lineHeight: '32px', color: '#000' }}
            >
              Learn, grow, and monetize your skills on a platform built for creators and learners. Join a vibrant community and start your journey today.
            </motion.p>
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.7 }}
              className="flex gap-4"
            >
              <div
                style={{ position: 'relative', display: 'flex', alignItems: 'center' }}
                onMouseMove={e => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  setCursor({
                    x: e.clientX - rect.left,
                    y: e.clientY - rect.top,
                    hovering: true
                  });
                }}
                onMouseLeave={() => setCursor(c => ({ ...c, hovering: false }))}
              >
                <a
                  href="#get-started"
                  className="font-bold text-white bg-[#1D4ED8] shadow-sm transition relative group overflow-hidden text-sm md:text-base"
                  style={{borderRadius: '32px', padding: '12px 32px', height: '52px', display: 'flex', alignItems: 'center', marginRight: 0, cursor: 'none'}}
                >
                  {/* Sliding background effect */}
                  <span className="absolute inset-0 left-0 top-0 w-full h-full z-0 transition-all duration-300 group-hover:w-0 bg-[#1D4ED8]" style={{borderRadius: '32px'}}></span>
                  <span className="absolute inset-0 left-0 top-0 w-0 h-full z-0 transition-all duration-300 group-hover:w-full bg-white" style={{borderRadius: '32px'}}></span>
                  <span className="relative z-10 flex items-center gap-2 group-hover:text-[#1D4ED8] transition-colors duration-300" style={{width: '100%', justifyContent: 'center'}}>
                    Get Started
                  </span>
                  {/* Custom cursor circle that follows pointer */}
                  {cursor.hovering && (
                    <span
                      className="pointer-events-none absolute"
                      style={{
                        left: cursor.x - 12,
                        top: cursor.y - 12,
                        width: 24,
                        height: 24,
                        borderRadius: '50%',
                        border: '2px solid #2563eb',
                        background: '#e0edff',
                        opacity: 0.7,
                        transition: 'left 0.1s, top 0.1s',
                        zIndex: 20
                      }}
                    />
                  )}
                </a>
              </div>
              <a
                href="#courses"
                className="font-bold text-indigo-700 bg-gray-100 shadow-sm transition relative group overflow-hidden text-sm md:text-base"
                style={{borderRadius: '32px', padding: '12px 32px', height: '52px', display: 'flex', alignItems: 'center'}}
              >
                <span className="absolute inset-0 left-0 top-0 w-full h-full z-0 transition-all duration-300 group-hover:w-0 bg-gray-100" style={{borderRadius: '32px'}}></span>
                <span className="absolute inset-0 left-0 top-0 w-0 h-full z-0 transition-all duration-300 group-hover:w-full bg-gray-200" style={{borderRadius: '32px'}}></span>
                <span className="relative z-10 flex items-center gap-2 group-hover:text-indigo-700 transition-colors duration-300" style={{width: '100%', justifyContent: 'center'}}>
                  Browse Courses
                </span>
              </a>
            </motion.div>
          </div>
          {/* Right: Course Card */}
          <div className="w-full md:w-1/2 flex items-center justify-center mb-10 md:mb-0 z-20 order-2 md:order-2" style={{ marginTop: '0px' }}>
            <CourseCardStack />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 sm:px-8 bg-gray-50">
        <div className="flex justify-center mb-4">
          <div className="bg-white rounded-full px-5 py-2 shadow-sm flex items-center" style={{ fontSize: '16px', color: '#1D4ED8', fontWeight: 600 }}>
            Top Categories
          </div>
        </div>
        <motion.h2 
          initial={{ opacity: 0, y: 44 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          viewport={{ once: true }} 
          transition={{ duration: 0.7 }} 
          className="text-center mb-12 font-bold text-2xl md:text-[44px]"
          style={{ color: '#000000', lineHeight: 1.4 }}
        >
          Explore Top Skills Categories<br/>
          That Can Make You
        </motion.h2>
        <div className="max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
          {[
            {
              img: '/design.webp',
              name: 'Web Design',
              count: 1,
            },
            {
              img: '/server.webp',
              name: 'Backend',
              count: 2,
            },
            {
              img: '/personal.webp',
              name: 'Full Stack',
              count: 1,
            },
            {
              img: '/pantone.webp',
              name: 'Mobile Application',
              count: 1,
            },
            {
              img: '/design (1).webp',
              name: 'Finance & Accounting',
              count: 1,
            },
            {
              img: '/smartphone.webp',
              name: 'Graphic Design',
              count: 2,
            },
            {
              img: '/infographic.png',
              name: 'Infographics',
              count: 1,
            },
            {
              img: '/window.svg',
              name: 'Personal Development',
              count: 1,
            },
          ].map((cat, i) => (
            <div
              key={cat.name}
              className="bg-white rounded-[10px] shadow p-4 sm:p-6 md:p-8 flex flex-col items-center justify-center text-center transition-transform duration-300 group cursor-pointer hover:shadow-2xl hover:-translate-y-2 hover:scale-105 border border-transparent hover:border-[#1D4ED8]/30"
              style={{ minHeight: '200px' }}
            >
              <img src={cat.img} alt={cat.name} className="mb-3 sm:mb-4 md:mb-6 w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20" style={{ objectFit: 'contain' }} />
              <div className="font-bold text-sm sm:text-base md:text-xl mb-1 sm:mb-2 text-[#111]">{cat.name}</div>
              <div className="text-xs sm:text-sm md:text-base text-[#222] font-medium flex items-center justify-center gap-1">
                {cat.count} Course{cat.count > 1 ? 's' : ''}
                <span className="ml-1 text-sm sm:text-base md:text-lg">&rarr;</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6 sm:px-12" style={{ backgroundColor: 'rgba(255, 233, 196, 0.5)' }}>
        <div className="w-full">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between w-full gap-4 mb-12">
            <div>
              <div className="mb-2">
                <div className="bg-white rounded-full px-5 py-2 shadow-sm flex items-center w-max text-left" style={{ fontSize: '16px', color: '#1D4ED8', fontWeight: 600 }}>
                  Why Choose Skill Sage
                </div>
              </div>
              <motion.h2 
                initial={{ opacity: 0, y: 30 }} 
                whileInView={{ opacity: 1, y: 0 }} 
                viewport={{ once: true }} 
                transition={{ duration: 0.7 }} 
                className="text-left font-bold text-2xl md:text-[44px] mb-4 sm:mb-6"
                style={{ color: '#000000', lineHeight: 1.4 }}
              >
                Alot of Reasons you Should<br/>
                Choose Skill Sage
              </motion.h2>
            </div>
            <div className="flex justify-start md:justify-end mt-4 sm:mt-0 mb-6 sm:mb-0 md:mb-0 md:ml-8">
              <div className="flex bg-gray-100 rounded-[4px] p-1 gap-2 shadow-sm w-max">
                <button
                  className={`px-6 py-2 rounded-[4px] font-semibold text-base transition-all duration-200 focus:outline-none ${tab === 'learners' ? 'bg-[#1D4ED8] text-white shadow' : 'bg-transparent text-[#1D4ED8] hover:bg-[#e0edff]'}`}
                  onClick={() => setTab('learners')}
                  type="button"
                >
                  For Learners
                </button>
                <button
                  className={`px-6 py-2 rounded-[4px] font-semibold text-base transition-all duration-200 focus:outline-none ${tab === 'creators' ? 'bg-[#1D4ED8] text-white shadow' : 'bg-transparent text-[#1D4ED8] hover:bg-[#e0edff]'}`}
                  onClick={() => setTab('creators')}
                  type="button"
                >
                  For Creators
                </button>
              </div>
            </div>
          </div>
          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 sm:mt-8">
            {tab === 'learners' ? (
              <>
                {/* Left Column - Light Background */}
                <div className="bg-white rounded-2xl p-8 shadow-lg">
                  <div className="bg-orange-100 text-orange-700 px-4 py-2 rounded-full text-sm font-semibold w-max mb-4">
                    WHY CHOOSE SKILL SAGE
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-4">
                    Master Skills That Matter
                  </h3>
                  <p className="text-gray-600 mb-8 leading-relaxed">
                    Transform your career with our carefully crafted learning courses. We meet you where you are and take you to where you want to be. Learn from industry experts and join a community of passionate learners.
                  </p>
                  {/* Video Placeholder */}
                  <div className="bg-gray-100 rounded-xl p-6 text-center">
                    <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                    </div>
                    <p className="text-gray-600 font-medium">Watch Our Success Stories</p>
                  </div>
                </div>
                {/* Right Column - Dark Background */}
                <div className="rounded-2xl px-2 py-8 md:px-8 text-white" style={{ backgroundColor: '#00025D' }}>
                  <div className="space-y-6">
                    <div className="flex items-start gap-4 p-4 rounded-xl transition-all duration-300 hover:bg-white/10 hover:scale-105 cursor-pointer group">
                      <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-bold text-lg mb-2 transition-colors duration-300 group-hover:text-blue-300">Easy Course Creation</h4>
                        <p className="text-blue-100 transition-colors duration-300 group-hover:text-blue-200">Create professional courses with our intuitive tools. No technical skills required - just focus on sharing your expertise.</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4 p-4 rounded-xl transition-all duration-300 hover:bg-white/10 hover:scale-105 cursor-pointer group">
                      <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-bold text-lg mb-2 transition-colors duration-300 group-hover:text-green-300">Monetize Your Knowledge</h4>
                        <p className="text-blue-100 transition-colors duration-300 group-hover:text-blue-200">Turn your expertise into income. Set your own prices and earn from every course sale and subscription.</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4 p-4 rounded-xl transition-all duration-300 hover:bg-white/10 hover:scale-105 cursor-pointer group">
                      <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-bold text-lg mb-2 transition-colors duration-300 group-hover:text-purple-300">Global Reach</h4>
                        <p className="text-blue-100 transition-colors duration-300 group-hover:text-blue-200">Reach students worldwide. Our platform connects you with learners from every corner of the globe.</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4 p-4 rounded-xl transition-all duration-300 hover:bg-white/10 hover:scale-105 cursor-pointer group">
                      <div className="w-12 h-12 bg-yellow-500 rounded-lg flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-bold text-lg mb-2 transition-colors duration-300 group-hover:text-yellow-300">Analytics Dashboard</h4>
                        <p className="text-blue-100 transition-colors duration-300 group-hover:text-blue-200">Track your success with detailed analytics. Monitor earnings, student engagement, and course performance.</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4 p-4 rounded-xl transition-all duration-300 hover:bg-white/10 hover:scale-105 cursor-pointer group">
                      <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-bold text-lg mb-2 transition-colors duration-300 group-hover:text-red-300">Build Your Brand</h4>
                        <p className="text-blue-100 transition-colors duration-300 group-hover:text-blue-200">Establish yourself as an authority in your field. Build a loyal following and grow your personal brand.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Left Column - Dark Background for Creators */}
                <div className="rounded-2xl px-3 py-8 md:px-8 text-white" style={{ backgroundColor: '#00025D' }}>
                  <div className="space-y-6">
                    <div className="flex items-start gap-4 p-4 rounded-xl transition-all duration-300 hover:bg-white/10 hover:scale-105 cursor-pointer group">
                      <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-bold text-lg mb-2 transition-colors duration-300 group-hover:text-blue-300">Easy Course Creation</h4>
                        <p className="text-blue-100 transition-colors duration-300 group-hover:text-blue-200">Create professional courses with our intuitive tools. No technical skills required - just focus on sharing your expertise.</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4 p-4 rounded-xl transition-all duration-300 hover:bg-white/10 hover:scale-105 cursor-pointer group">
                      <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-bold text-lg mb-2 transition-colors duration-300 group-hover:text-green-300">Monetize Your Knowledge</h4>
                        <p className="text-blue-100 transition-colors duration-300 group-hover:text-blue-200">Turn your expertise into income. Set your own prices and earn from every course sale and subscription.</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4 p-4 rounded-xl transition-all duration-300 hover:bg-white/10 hover:scale-105 cursor-pointer group">
                      <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-bold text-lg mb-2 transition-colors duration-300 group-hover:text-purple-300">Global Reach</h4>
                        <p className="text-blue-100 transition-colors duration-300 group-hover:text-blue-200">Reach students worldwide. Our platform connects you with learners from every corner of the globe.</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4 p-4 rounded-xl transition-all duration-300 hover:bg-white/10 hover:scale-105 cursor-pointer group">
                      <div className="w-12 h-12 bg-yellow-500 rounded-lg flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-bold text-lg mb-2 transition-colors duration-300 group-hover:text-yellow-300">Analytics Dashboard</h4>
                        <p className="text-blue-100 transition-colors duration-300 group-hover:text-blue-200">Track your success with detailed analytics. Monitor earnings, student engagement, and course performance.</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4 p-4 rounded-xl transition-all duration-300 hover:bg-white/10 hover:scale-105 cursor-pointer group">
                      <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-bold text-lg mb-2 transition-colors duration-300 group-hover:text-red-300">Build Your Brand</h4>
                        <p className="text-blue-100 transition-colors duration-300 group-hover:text-blue-200">Establish yourself as an authority in your field. Build a loyal following and grow your personal brand.</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column - Light Background for Creators */}
                <div className="bg-white rounded-2xl p-8 shadow-lg">
                  <div className="bg-orange-100 text-orange-700 px-4 py-2 rounded-full text-sm font-semibold w-max mb-4">
                    WHY CREATE ON SKILL SAGE
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-4">
                    Share Your Expertise
                  </h3>
                  <p className="text-gray-600 mb-8 leading-relaxed">
                    Turn your knowledge into a thriving business. Our platform empowers creators to build, monetize, and scale their educational content. Join thousands of successful creators earning from their expertise.
                  </p>
                  {/* Video Placeholder */}
                  <div className="bg-gray-100 rounded-xl p-6 text-center">
                    <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                    </div>
                    <p className="text-gray-600 font-medium">Watch Creator Success Stories</p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="py-10 px-4 sm:px-8 bg-gradient-to-b from-[#FFE9C4]/50 to-[#1D4ED8]" style={{ paddingTop: '40px', paddingBottom: '40px' }}>
        <div className="max-w-6xl mx-auto text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 30 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true }} 
            transition={{ duration: 0.7 }} 
            className="font-bold mb-4"
            style={{ color: '#000000', fontSize: '24px', '@media (min-width: 768px)': { fontSize: '44px' } }}
          >
            Featured Courses
          </motion.h2>
          <motion.p initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2, duration: 0.7 }} className="text-lg mb-12" style={{ color: '#000000' }}>Discover our most popular and highly-rated courses from expert instructors. Start earning while learning!</motion.p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {coursesLoading && (
              <div className="col-span-full text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#1D4ED8]"></div>
                <p className="mt-2 text-gray-600">Loading featured courses...</p>
              </div>
            )}
            {/* Course Card 1 */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              viewport={{ once: true }} 
              transition={{ delay: 0.1, duration: 0.7 }}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col"
              style={{ minHeight: '500px' }}
            >
              <div className="relative">
                <div className="w-full h-48 bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center">
                  <div className="text-white text-center">
                    <div className="text-6xl mb-2">🚀</div>
                    <div className="text-sm opacity-80">Content Creaion</div>
                  </div>
                </div>
                <div className="absolute bottom-2 right-2">
                  <span className="bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full">FREE</span>
                </div>
              </div>
              <div className="p-6 flex flex-col flex-1">
                <h3 className="font-bold text-xl text-gray-900 mb-3">Content creation for total beginners (4 Weeks)</h3>
                <p className="text-gray-600 leading-relaxed mb-4 flex-grow" style={{ fontSize: '16px' }}>
                  The Launchpad program is riddled with in-depth insights and knowledge into the many career paths available to you within the tech landscape.
                </p>
                <div className="flex justify-center mt-auto">
                  <div
                    style={{ position: 'relative', display: 'flex', alignItems: 'center' }}
                    onMouseMove={e => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      setCursor1({
                        x: e.clientX - rect.left,
                        y: e.clientY - rect.top,
                        hovering: true
                      });
                    }}
                    onMouseLeave={() => setCursor1(c => ({ ...c, hovering: false }))}
                  >
                    <button className="font-bold text-white bg-[#1D4ED8] shadow-sm transition relative group overflow-hidden text-sm md:text-base" style={{borderRadius: '32px', padding: '12px 32px', height: '52px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'none'}}>
                      {/* Sliding background effect */}
                      <span className="absolute inset-0 left-0 top-0 w-full h-full z-0 transition-all duration-300 group-hover:w-0 bg-[#1D4ED8]" style={{borderRadius: '32px'}}></span>
                      <span className="absolute inset-0 left-0 top-0 w-0 h-full z-0 transition-all duration-300 group-hover:w-full bg-white" style={{borderRadius: '32px'}}></span>
                      <span className="relative z-10 flex items-center gap-2 group-hover:text-[#1D4ED8] transition-colors duration-300">
                        Enroll Now
                      </span>
                      {/* Custom cursor circle that follows pointer */}
                      {cursor1.hovering && (
                        <span
                          className="pointer-events-none absolute"
                          style={{
                            left: cursor1.x - 12,
                            top: cursor1.y - 12,
                            width: 24,
                            height: 24,
                            borderRadius: '50%',
                            border: '2px solid #2563eb',
                            background: '#e0edff',
                            opacity: 0.7,
                            transition: 'left 0.1s, top 0.1s',
                            zIndex: 20
                          }}
                        />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Course Card 2 */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              viewport={{ once: true }} 
              transition={{ delay: 0.2, duration: 0.7 }}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col"
              style={{ minHeight: '500px' }}
            >
              <div className="relative">
                <div className="w-full h-48 bg-gradient-to-br from-green-400 to-blue-600 flex items-center justify-center">
                  <div className="text-white text-center">
                    <div className="text-6xl mb-2">🎨</div>
                    <div className="text-sm opacity-80">Content Creation</div>
                  </div>
                </div>
                <div className="absolute bottom-2 right-2">
                  <span className="bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full">PAID</span>
                </div>
              </div>
              <div className="p-6 flex flex-col flex-1">
                <h3 className="font-bold text-xl text-gray-900 mb-3">Content Mastery for African Creators (6 Weeks)</h3>
                <p className="text-gray-600 leading-relaxed mb-4 flex-grow" style={{ fontSize: '16px' }}>
                  The program is designed to teach you how to start and boost your content creation career regardless of your niche interest.
                </p>
                <div className="flex justify-center mt-auto">
                  <div
                    style={{ position: 'relative', display: 'flex', alignItems: 'center' }}
                    onMouseMove={e => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      setCursor2({
                        x: e.clientX - rect.left,
                        y: e.clientY - rect.top,
                        hovering: true
                      });
                    }}
                    onMouseLeave={() => setCursor2(c => ({ ...c, hovering: false }))}
                  >
                    <button className="font-bold text-white bg-[#1D4ED8] shadow-sm transition relative group overflow-hidden text-sm md:text-base" style={{borderRadius: '32px', padding: '12px 32px', height: '52px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'none'}}>
                      {/* Sliding background effect */}
                      <span className="absolute inset-0 left-0 top-0 w-full h-full z-0 transition-all duration-300 group-hover:w-0 bg-[#1D4ED8]" style={{borderRadius: '32px'}}></span>
                      <span className="absolute inset-0 left-0 top-0 w-0 h-full z-0 transition-all duration-300 group-hover:w-full bg-white" style={{borderRadius: '32px'}}></span>
                      <span className="relative z-10 flex items-center gap-2 group-hover:text-[#1D4ED8] transition-colors duration-300">
                        Enroll Now
                      </span>
                      {/* Custom cursor circle that follows pointer */}
                      {cursor2.hovering && (
                        <span
                          className="pointer-events-none absolute"
                          style={{
                            left: cursor2.x - 12,
                            top: cursor2.y - 12,
                            width: 24,
                            height: 24,
                            borderRadius: '50%',
                            border: '2px solid #2563eb',
                            background: '#e0edff',
                            opacity: 0.7,
                            transition: 'left 0.1s, top 0.1s',
                            zIndex: 20
                          }}
                        />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Course Card 3 */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              viewport={{ once: true }} 
              transition={{ delay: 0.3, duration: 0.7 }}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col"
              style={{ minHeight: '500px' }}
            >
              <div className="relative">
                <div className="w-full h-48 bg-gradient-to-br from-purple-400 to-pink-600 flex items-center justify-center">
                  <div className="text-white text-center">
                    <div className="text-6xl mb-2">💼</div>
                    <div className="text-sm opacity-80">Sales Mastery</div>
                  </div>
                </div>
                <div className="absolute bottom-2 right-2">
                  <span className="bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full">PAID</span>
                </div>
              </div>
              <div className="p-6 flex flex-col flex-1">
                <h3 className="font-bold text-xl text-gray-900 mb-3">High-Impact Selling: From Prospecting to Closing (6 Weeks)</h3>
                <p className="text-gray-600 leading-relaxed mb-4 flex-grow" style={{ fontSize: '16px' }}>
                  Invest in your professional growth and equip yourself with the essential skills and strategies to excel in the competitive sales landscape.
                </p>
                <div className="flex justify-center mt-auto">
                  <div
                    style={{ position: 'relative', display: 'flex', alignItems: 'center' }}
                    onMouseMove={e => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      setCursor3({
                        x: e.clientX - rect.left,
                        y: e.clientY - rect.top,
                        hovering: true
                      });
                    }}
                    onMouseLeave={() => setCursor3(c => ({ ...c, hovering: false }))}
                  >
                    <button className="font-bold text-white bg-[#1D4ED8] shadow-sm transition relative group overflow-hidden text-sm md:text-base" style={{borderRadius: '32px', padding: '12px 32px', height: '52px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'none'}}>
                      {/* Sliding background effect */}
                      <span className="absolute inset-0 left-0 top-0 w-full h-full z-0 transition-all duration-300 group-hover:w-0 bg-[#1D4ED8]" style={{borderRadius: '32px'}}></span>
                      <span className="absolute inset-0 left-0 top-0 w-0 h-full z-0 transition-all duration-300 group-hover:w-full bg-white" style={{borderRadius: '32px'}}></span>
                      <span className="relative z-10 flex items-center gap-2 group-hover:text-[#1D4ED8] transition-colors duration-300">
                        Enroll Now
                      </span>
                      {/* Custom cursor circle that follows pointer */}
                      {cursor3.hovering && (
                        <span
                          className="pointer-events-none absolute"
                          style={{
                            left: cursor3.x - 12,
                            top: cursor3.y - 12,
                            width: 24,
                            height: 24,
                            borderRadius: '50%',
                            border: '2px solid #2563eb',
                            background: '#e0edff',
                            opacity: 0.7,
                            transition: 'left 0.1s, top 0.1s',
                            zIndex: 20
                          }}
                        />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 sm:px-8 bg-gray-50">
        <motion.h2 initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="text-3xl font-bold text-center mb-12 text-gray-900">What Our Users Say</motion.h2>
        <div className="max-w-full mx-auto space-y-8 py-8 sm:py-12 md:py-16 lg:py-20">
          <CarouselRow testimonials={testimonials.slice(0, 6)} direction="left" />
          <CarouselRow testimonials={testimonials.slice(6, 12).length ? testimonials.slice(6, 12) : testimonials.slice(0, 6)} direction="right" />
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-4 sm:px-8 bg-white">
        <motion.h2 initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="text-3xl font-bold text-center mb-12 text-gray-900">Frequently Asked Questions</motion.h2>
        <div className="max-w-3xl mx-auto space-y-6">
          {[
            { q: "What is SKILL SAGE?", a: "A platform to learn, teach, and monetize skills through courses and tutorials." },
            { q: "How do I become a creator?", a: "Sign up and click 'Become a Creator' in your dashboard to start creating courses." },
            { q: "How do I get paid?", a: "Earnings are paid out via your preferred payment method once you reach the minimum threshold." },
            { q: "Is there a free trial?", a: "Yes! You can explore many courses for free before upgrading." },
          ].map((faq, i) => (
            <motion.div key={faq.q} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 * i, duration: 0.7 }} className="bg-gray-50 rounded-xl p-6 shadow flex flex-col">
              <span className="font-bold text-indigo-700 mb-2">{faq.q}</span>
              <span className="text-gray-700">{faq.a}</span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 sm:px-8 bg-gray-50">
        <motion.h2 initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="text-3xl font-bold text-center mb-12 text-gray-900">What Our Users Say</motion.h2>
        <div className="max-w-full mx-auto space-y-8 py-8 sm:py-12 md:py-16 lg:py-20">
          <CarouselRow testimonials={testimonials.slice(0, 6)} direction="left" />
          <CarouselRow testimonials={testimonials.slice(6, 12).length ? testimonials.slice(6, 12) : testimonials.slice(0, 6)} direction="right" />
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-4 sm:px-8 bg-white">
        <motion.h2 initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="text-3xl font-bold text-center mb-12 text-gray-900">Frequently Asked Questions</motion.h2>
        <div className="max-w-3xl mx-auto space-y-6">
          {[
            { q: "What is SKILL SAGE?", a: "A platform to learn, teach, and monetize skills through courses and tutorials." },
            { q: "How do I become a creator?", a: "Sign up and click 'Become a Creator' in your dashboard to start creating courses." },
            { q: "How do I get paid?", a: "Earnings are paid out via your preferred payment method once you reach the minimum threshold." },
            { q: "Is there a free trial?", a: "Yes! You can explore many courses for free before upgrading." },
          ].map((faq, i) => (
            <motion.div key={faq.q} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 * i, duration: 0.7 }} className="bg-gray-50 rounded-xl p-6 shadow flex flex-col">
              <span className="font-bold text-indigo-700 mb-2">{faq.q}</span>
              <span className="text-gray-700">{faq.a}</span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-10 px-4 sm:px-8 mt-auto">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <Image src="/Skill Sage Logo.png" alt="SKILL SAGE Logo" width={40} height={40} className="rounded-full" />
            <span className="font-bold text-lg tracking-wide">SKILL SAGE</span>
          </div>
          <nav className="flex gap-6 text-sm">
            <a href="#" className="hover:underline">About</a>
            <a href="#" className="hover:underline">Contact</a>
            <a href="#" className="hover:underline">Blog</a>
            <a href="#" className="hover:underline">Terms</a>
            <a href="#" className="hover:underline">Privacy</a>
          </nav>
          <div className="text-xs opacity-70">&copy; {new Date().getFullYear()} SKILL SAGE. All rights reserved.</div>
        </div>
      </footer>
      </div>
    </div>
  );
}

// Demo data for four course cards
const demoCourses = [
  {
    img: "https://randomuser.me/api/portraits/men/44.jpg",
    title: "Difficult Things About Education.",
    subtitle: "WEB DESIGN COURSES",
    date: "01 January - 15 March",
    lessons: 12,
    students: 30,
    desc: "Master Python by building 100 projects in 100 days. Learn data science, automation, build websites,",
    reviews: 15,
    price: 75,
    oldPrice: 110,
    videos: 45,
    classes: 18,
    discount: 40,
  },
  {
    img: "https://randomuser.me/api/portraits/women/44.jpg",
    title: "The Complete Demo Course with Alex.",
    subtitle: "DATA SCIENCE BOOTCAMP",
    date: "10 March - 20 May",
    lessons: 20,
    students: 60,
    desc: "Learn data science from scratch. Build real projects and get certified. Master Python, statistics, and machine learning for real-world applications.",
    reviews: 22,
    price: 90,
    oldPrice: 150,
    videos: 60,
    classes: 25,
    discount: 30,
  },
  {
    img: "https://randomuser.me/api/portraits/women/32.jpg",
    title: "Creative Design Essentials with Adobe AI.",
    subtitle: "GRAPHIC DESIGN",
    date: "20 April - 30 June",
    lessons: 10,
    students: 25,
    desc: "Master graphic design tools and techniques for modern creatives. Learn branding, illustration, and portfolio building for your design career.",
    reviews: 10,
    price: 60,
    oldPrice: 100,
    videos: 30,
    classes: 12,
    discount: 20,
  },
];

// Stacked CourseCards with swipe/next
function CourseCardStack() {
  const [activeIdx, setActiveIdx] = useState(0);
  const total = demoCourses.length;
  const [dragStartX, setDragStartX] = useState<number | null>(null);
  const [dragX, setDragX] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  // Move top card to back or previous
  const nextCard = () => {
    setActiveIdx((prev) => (prev + 1) % total);
    setDragX(0);
  };
  const prevCard = () => {
    setActiveIdx((prev) => (prev - 1 + total) % total);
    setDragX(0);
  };

  // Mouse event handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setDragStartX(e.clientX);
    setDragging(true);
  };
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragging || dragStartX === null) return;
    setDragX(e.clientX - dragStartX);
  };
  const handleMouseUp = () => {
    if (!dragging) return;
    if (dragX < -80) nextCard(); // swipe left
    else if (dragX > 80) prevCard(); // swipe right
    else setDragX(0); // snap back
    setDragging(false);
    setDragStartX(null);
  };
  const handleMouseLeave = () => {
    setDragging(false);
    setDragStartX(null);
    setDragX(0);
  };

  // Touch event handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };
  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    setDragX(e.touches[0].clientX - touchStartX);
  };
  const handleTouchEnd = () => {
    if (dragX < -60) nextCard();
    else if (dragX > 60) prevCard();
    setDragX(0);
    setTouchStartX(null);
  };

  // Auto-flip to next card every 5 seconds unless dragging or touching
  useEffect(() => {
    if (dragging || touchStartX !== null) return;
    const timer = setTimeout(() => {
      nextCard();
    }, 5000);
    return () => clearTimeout(timer);
  }, [activeIdx, dragging, touchStartX]);

  return (
    <>
      <div
        className="relative w-[340px] h-[420px] mx-auto md:mx-0 flex flex-col items-center select-none"
        style={{ cursor: dragging ? 'grabbing' : 'grab' }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          {demoCourses.map((course, i) => {
            // Calculate horizontal offset for stacking
            const idx = (i - activeIdx + total) % total;
            const isActive = idx === 0;
            // Only show previous, current, and next
            if (idx > 2 && idx < total - 1) return null;
            let offset = 0;
            if (idx === total - 1) offset = -80; // far left (previous)
            else if (idx === 1) offset = 80; // far right (next)
            else if (idx === 2) offset = 160; // hidden right (for smooth transition)
            // If active, add dragX
            const dragOffset = isActive ? dragX : 0;
            return (
              <div
                key={course.title}
                className={`absolute top-0 w-full h-full transition-all duration-500 ${isActive ? 'z-20 scale-100 shadow-2xl' : 'z-10 scale-95 opacity-70'} ${idx > 2 && idx < total - 1 ? 'opacity-0 pointer-events-none' : ''}`}
                style={{
                  transform: `translateX(${offset + dragOffset}px) scale(${isActive ? 1 : 0.95})`,
                  left: 0,
                  transition: isActive && (dragging || touchStartX !== null) ? 'none' : 'transform 0.5s, opacity 0.5s',
                }}
              >
                <CourseCard {...course} />
              </div>
            );
          })}
        </div>
      </div>
      {/*
      <div className="flex gap-2 justify-center mt-6 z-30">
        {demoCourses.map((_, i) => (
          <span
            key={i}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${activeIdx === i ? 'bg-[#1D4ED8]' : 'bg-gray-300'}`}
          />
        ))}
      </div>
      */}
    </>
  );
}

type CourseCardProps = {
  img: string;
  title: string;
  subtitle: string;
  date: string;
  lessons: number;
  students: number;
  desc: string;
  reviews: number;
  price: number;
  oldPrice: number;
  videos: number;
  classes: number;
  discount: number;
};

// Demo CourseCard component (static, styled as attached, but now accepts props)
function CourseCard({ img, title, subtitle, date, lessons, students, desc, reviews, price, oldPrice, videos, classes, discount }: CourseCardProps) {
  return (
    <div className="w-[340px] rounded-2xl shadow-xl bg-white overflow-hidden mx-auto md:mx-0 border border-[#f3f3f3]" style={{ minHeight: '430px' }}>
      {/* Top image and overlay */}
      <div className="relative flex items-end justify-end" style={{ width: '284px', height: '175px', margin: '24px auto 0 auto', borderRadius: '8px', overflow: 'hidden' }}>
        <img src={img} alt="Course Demo" className="absolute inset-0 object-cover" style={{ width: '284px', height: '175px', borderRadius: '8px' }} />
        <div className="absolute inset-0 bg-gradient-to-tr from-[#A259FF] via-[#6A82FB] to-[#FBEFCE] opacity-90" style={{ width: '284px', height: '175px', borderRadius: '8px' }} />
        <div className="relative z-10 p-4 w-full flex flex-col h-full justify-between">
          <div>
            <div className="text-xs text-white font-semibold mb-1">{date}</div>
            <div className="text-lg font-bold text-white leading-tight">{subtitle}</div>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <span className="bg-white/80 text-[#1D4ED8] text-xs px-2 py-1 rounded font-semibold flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="#1D4ED8" strokeWidth="2" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="2" /></svg>
              {classes} Class
            </span>
            <span className="bg-white/80 text-[#1D4ED8] text-xs px-2 py-1 rounded font-semibold flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="#1D4ED8" strokeWidth="2" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="2" /><path d="M8 8h8v8H8z" /></svg>
              {videos} Videos
            </span>
            <span className="absolute right-4 top-4 bg-[#4F46E5] text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">-{discount}% Off</span>
          </div>
        </div>
      </div>
      {/* Card body */}
      <div className="p-6">
        <div className="flex items-center gap-4 text-gray-400 text-sm mb-2">
          <span className="flex items-center gap-1"><svg className="w-4 h-4" fill="none" stroke="#1D4ED8" strokeWidth="2" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="2" /></svg>{lessons} Lessons</span>
          <span className="flex items-center gap-1"><svg className="w-4 h-4" fill="none" stroke="#1D4ED8" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="8" /></svg>{students} Students</span>
        </div>
        <div className="font-bold text-xl text-[#000] mb-1">{title}</div>
        <div className="text-[#6B7280] text-base mb-3 leading-6 line-clamp-3" style={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{desc}</div>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-[#F59E42] text-lg">★★★★★</span>
          <span className="text-[#6B7280] text-sm">({reviews} Reviews)</span>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <span className="text-2xl font-bold text-[#1D4ED8]">${price}</span>
            <span className="text-[#B0B0B0] line-through ml-2 text-lg">${oldPrice}</span>
          </div>
          <a href="#" className="text-[#1D4ED8] font-semibold flex items-center gap-1 hover:underline text-base">Learn More <svg className="w-4 h-4" fill="none" stroke="#1D4ED8" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg></a>
        </div>
      </div>
    </div>
  );
}

// TestimonialCard component
function TestimonialCard({ name, title, company, image, quote, link }: {
  name: string;
  title: string;
  company: string;
  image: string;
  quote: string;
  link?: string;
}) {
  return (
    <div
      className="bg-white shadow-lg p-8 flex flex-col relative min-h-[254px] transition-all duration-300"
      style={{ borderRadius: '6px', maxWidth: 550, width: '100%' }}
    >
      {/* Quote Icon */}
      <span className="absolute" style={{ top: '0.5rem', right: '1.5rem', fontSize: '7.5rem', color: 'rgba(16, 185, 129, 0.18)', pointerEvents: 'none', userSelect: 'none' }}>&rdquo;</span>
      <div className="flex items-center gap-4 mb-4">
        <img src={image} alt={name} className="w-14 h-14 rounded-full object-cover border-2 border-gray-100" />
        <div>
          <div className="font-bold text-lg text-gray-900">{name}</div>
          <div className="text-gray-500 text-sm">
            {title} <span className="italic">@ {company}</span>
          </div>
        </div>
      </div>
      <div className="text-gray-700 mb-6 flex-1">{quote}</div>
      {link && (
        <a href={link} className="text-indigo-700 font-semibold hover:underline text-sm mt-auto">Read Project Case Study &rarr;</a>
      )}
    </div>
  );
}

// CarouselRow component for auto-scrolling testimonial cards
function CarouselRow({ testimonials, direction = 'left' }: { testimonials: any[]; direction?: 'left' | 'right'; }) {
  const rowRef = useRef<HTMLDivElement>(null);

  // Duplicate testimonials for seamless looping
  const items = [...testimonials, ...testimonials];

  // Animation keyframes
  const animationName = direction === 'left' ? 'carousel-left' : 'carousel-right';
  const animationDuration = '120s'; // Much slower speed

  return (
    <div className="overflow-hidden w-full">
      <div
        ref={rowRef}
        className="flex"
        style={{
          width: `${items.length * 550}px`,
          animation: `${animationName} ${animationDuration} linear infinite`,
        }}
      >
        {items.map((t, i) => (
          <div key={i} className="flex-shrink-0" style={{ width: 550, marginRight: 24 }}>
            <TestimonialCard {...t} />
          </div>
        ))}
      </div>
    </div>
  );
}

// Demo testimonials data (replace with API fetch later)
const testimonials = [
  {
    name: "Michael D. Lovelady",
    title: "CEO",
    company: "Google",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
    quote: "Histudy education, vulputate at sapien sit amet, auctor iaculis lorem. In vel hend rerit.",
    link: "#"
  },
  {
    name: "Valerie J. Creasman",
    title: "Executive Designer",
    company: "Google",
    image: "https://randomuser.me/api/portraits/men/44.jpg",
    quote: "Our educational, vulputate at sapien sit amet, auctor iaculis lorem. In vel hend rerit nisi.",
    link: "#"
  },
  {
    name: "Hannah R. Sutton",
    title: "Executive Chairman",
    company: "Google",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
    quote: "People says about, vulputate at sapien sit amet, auctor iaculis lorem. In vel hend rerit.",
    link: "#"
  },
  {
    name: "Pearl B. Hill",
    title: "Chairman SR",
    company: "Facebook",
    image: "https://randomuser.me/api/portraits/men/45.jpg",
    quote: "Like this histudy, vulputate at sapien sit amet,auctor iaculis lorem. In vel hend rerit.",
    link: "#"
  },
  {
    name: "Mandy F. Wood",
    title: "SR Designer",
    company: "Google",
    image: "https://randomuser.me/api/portraits/women/45.jpg",
    quote: "Educational template, vulputate at sapien sit amet,auctor iaculis lorem.",
    link: "#"
  },
  {
    name: "John Doe",
    title: "Product Manager",
    company: "Amazon",
    image: "https://randomuser.me/api/portraits/men/46.jpg",
    quote: "A wonderful platform for learning and growth!",
    link: "#"
  },
  {
    name: "Jane Smith",
    title: "Lead Engineer",
    company: "Microsoft",
    image: "https://randomuser.me/api/portraits/women/46.jpg",
    quote: "The best online learning experience I've had.",
    link: "#"
  },
  {
    name: "Samuel Green",
    title: "CTO",
    company: "Apple",
    image: "https://randomuser.me/api/portraits/men/47.jpg",
    quote: "Incredible content and instructors!",
    link: "#"
  },
  {
    name: "Lisa Brown",
    title: "UX Designer",
    company: "Spotify",
    image: "https://randomuser.me/api/portraits/women/47.jpg",
    quote: "I love the interactive courses and community.",
    link: "#"
  },
  {
    name: "Tom White",
    title: "Marketing Lead",
    company: "Netflix",
    image: "https://randomuser.me/api/portraits/men/48.jpg",
    quote: "Skill Sage helped me upskill my whole team!",
    link: "#"
  },
  {
    name: "Emily Black",
    title: "Data Scientist",
    company: "Airbnb",
    image: "https://randomuser.me/api/portraits/women/48.jpg",
    quote: "A must-have for anyone serious about learning.",
    link: "#"
  },
  {
    name: "Chris Blue",
    title: "DevOps Engineer",
    company: "Twitter",
    image: "https://randomuser.me/api/portraits/men/49.jpg",
    quote: "The carousel testimonials are so cool!",
    link: "#"
  },
];
