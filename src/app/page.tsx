"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  // Custom cursor state for Get Started button
  const [cursor, setCursor] = useState({ x: 0, y: 0, hovering: false });
  // Category dropdown state
  const [catOpen, setCatOpen] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const catBtnRef = useRef<HTMLButtonElement>(null);
  const catDropdownRef = useRef<HTMLDivElement>(null);
  // State for Why Skill Sage submenu
  const [whyOpen, setWhyOpen] = useState(false);

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
    if (catOpen) {
      // Load from localStorage first
      const cached = typeof window !== 'undefined' ? localStorage.getItem('categories') : null;
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
            if (typeof window !== 'undefined') localStorage.setItem('categories', JSON.stringify(data));
          }
        })
        .catch(() => {/* ignore fetch errors, keep cached */});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [catOpen]);

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
    <div className="font-sans min-h-screen w-full flex flex-col bg-white">
      {/* Header - Histudy Style with Glass Effect */}
      <header className="w-full sticky top-0 z-30">
        <div className="mx-auto flex items-center justify-between px-4 py-3 md:px-[15px] md:py-4 rounded-[32px] md:rounded-[60px] w-full md:w-[calc(100%-30px)] mt-2 bg-white/70 backdrop-blur-md shadow-sm" style={{background: 'inherit'}}>
          {/* Left: Logo */}
          <div className="flex items-center gap-2 md:gap-4 ml-0">
            <Image src="/Skill Sage Logo.png" alt="SKILL SAGE Logo" width={120} height={40} className="ml-1 md:ml-4 w-[120px] md:w-[180px] h-auto" />
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
                className="font-bold text-white bg-[#1D4ED8] shadow-sm transition relative group overflow-hidden"
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
        {menuOpen && (
          <nav className="md:hidden fixed top-0 left-0 w-full h-full flex flex-col gap-4 px-8 pt-24 pb-8 bg-white/80 backdrop-blur-lg shadow-lg z-40 animate-fade-in-down">
            <button className="absolute top-6 right-6 p-2 rounded-full bg-white/70" onClick={() => setMenuOpen(false)}>
              <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            <a href="#" className="hover:text-indigo-600 transition text-lg font-semibold">Home</a>
            <a href="#courses" className="hover:text-indigo-600 transition text-lg font-semibold">Courses</a>
            <a href="#dashboard" className="hover:text-indigo-600 transition text-lg font-semibold">Dashboard</a>
            <a href="#pages" className="hover:text-indigo-600 transition text-lg font-semibold">Pages</a>
            <a href="#elements" className="hover:text-indigo-600 transition text-lg font-semibold">Elements</a>
            <a href="#blog" className="hover:text-indigo-600 transition text-lg font-semibold">Blog</a>
            <a href="#enroll" className="font-bold text-indigo-700 text-lg">Enroll</a>
          </nav>
        )}
      </header>
      {/* Hero Section - Clean Histudy Style */}
      <section className="w-full flex flex-col-reverse md:flex-row items-center justify-between px-6 md:px-16 pb-32 pt-16 md:pt-28 bg-transparent relative overflow-hidden min-h-[100vh] md:min-h-[850px]" style={{ minHeight: '100vh' }}>
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
        {/* Left: Text Content */}
        <div className="w-full md:w-1/2 flex flex-col items-start justify-center gap-6 md:gap-8">
          <motion.h1
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.7 }}
            className="font-extrabold leading-tight mb-2 text-center md:text-left text-[40px] md:text-[56px] lg:text-[72px]" style={{ color: '#000', lineHeight: 1.1, fontWeight: 800, letterSpacing: '-0.01em' }}
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
            className="mb-4 md:mb-6 max-w-xl"
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
                className="font-bold text-white bg-[#1D4ED8] shadow-sm transition relative group overflow-hidden"
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
              className="font-bold text-indigo-700 bg-gray-100 shadow-sm transition relative group overflow-hidden"
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
        <div className="w-full md:w-1/2 flex items-center justify-center mb-10 md:mb-0 z-20" style={{ marginTop: '-52px' }}>
          <CourseCardStack />
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
          className="text-center mb-12 font-bold"
          style={{ fontSize: '44px', color: '#000000', lineHeight: 1.1 }}
        >
          Explore Top Skills Categories<br/>
          That Can Make You
        </motion.h2>
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { icon: "/3dicons-gift-dynamic-color.png", title: "Discover", desc: "Explore a wide range of courses and tutorials." },
            { icon: "/3dicons-star-dynamic-color.png", title: "Learn", desc: "Learn at your own pace, earn badges and certificates." },
            { icon: "/3dicons-trophy-dynamic-color.png", title: "Teach", desc: "Share your skills and create your own courses." },
            { icon: "/3dicons-money-bag-dynamic-color.png", title: "Earn", desc: "Monetize your talent through paid tutorials and courses." },
          ].map((step, i) => (
            <motion.div key={step.title} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 * i, duration: 0.7 }} className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center text-center">
              <Image src={step.icon} alt={step.title} width={64} height={64} className="mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-indigo-700">{step.title}</h3>
              <p className="text-gray-600">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 sm:px-8 bg-white">
        <motion.h2 initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="text-3xl font-bold text-center mb-12 text-gray-900">Why Choose SKILL SAGE?</motion.h2>
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">
          <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="bg-indigo-50 rounded-2xl p-8 shadow-lg">
            <h3 className="text-2xl font-bold mb-4 text-indigo-700">For Learners</h3>
            <ul className="space-y-3 text-gray-700">
              <li>• Wide range of skills & topics</li>
              <li>• Interactive, hands-on learning</li>
              <li>• Earn certificates & badges</li>
              <li>• Learn from top creators</li>
            </ul>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="bg-pink-50 rounded-2xl p-8 shadow-lg">
            <h3 className="text-2xl font-bold mb-4 text-pink-700">For Creators</h3>
            <ul className="space-y-3 text-gray-700">
              <li>• Easy course creation tools</li>
              <li>• Monetize your knowledge</li>
              <li>• Reach a global audience</li>
              <li>• Analytics & earnings dashboard</li>
            </ul>
          </motion.div>
        </div>
      </section>

      {/* Monetization Highlight */}
      <section className="py-20 px-4 sm:px-8 bg-gradient-to-r from-indigo-600 via-purple-500 to-pink-400 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2 initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="text-3xl font-bold mb-4">Turn Your Passion Into Income</motion.h2>
          <motion.p initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2, duration: 0.7 }} className="text-lg mb-8 opacity-90">Over <span className="font-bold">₦10,000,000</span> paid out to creators. Start earning by sharing your skills today!</motion.p>
          <motion.div initial={{ scale: 0.8, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.4, duration: 0.7 }} className="flex justify-center">
            <div className="bg-white bg-opacity-20 rounded-2xl px-8 py-6 shadow-xl inline-block">
              <span className="text-4xl font-extrabold">🎉</span>
              <p className="mt-2 text-lg font-semibold">Join our top creators and start earning!</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 sm:px-8 bg-gray-50">
        <motion.h2 initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="text-3xl font-bold text-center mb-12 text-gray-900">What Our Users Say</motion.h2>
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { name: "Jane Doe", text: "Skill Sage helped me turn my passion into a thriving business!", img: "/3dicons-star-dynamic-color.png" },
            { name: "John Smith", text: "The courses are top-notch and the platform is super easy to use.", img: "/3dicons-trophy-dynamic-color.png" },
            { name: "Aisha Bello", text: "I love teaching on Skill Sage. The earnings dashboard is amazing!", img: "/3dicons-gift-dynamic-color.png" },
          ].map((t, i) => (
            <motion.div key={t.name} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 * i, duration: 0.7 }} className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center text-center">
              <Image src={t.img} alt={t.name} width={48} height={48} className="mb-4" />
              <p className="text-gray-700 mb-2">“{t.text}”</p>
              <span className="font-semibold text-indigo-700">{t.name}</span>
            </motion.div>
          ))}
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
      <style jsx global>{`
@keyframes blink {
  0%, 49% { opacity: 1; }
  50%, 100% { opacity: 0; }
}
.animate-blink {
  animation: blink 1s step-end infinite;
}
.perspective {
  perspective: 1200px;
}
.group:hover .group-hover\:rotate-y-180 {
  transform: rotateY(180deg) !important;
}
[transform-style="preserve-3d"] {
  transform-style: preserve-3d;
}
[transform\:rotateY\(180deg\)] {
  transform: rotateY(180deg);
}
`}</style>
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
