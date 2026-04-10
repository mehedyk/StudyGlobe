import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

const STATS = [
  { value: '190+', label: 'Countries covered' },
  { value: '12,000+', label: 'Universities listed' },
  { value: '850,000+', label: 'Students placed' },
  { value: '98%', label: 'Visa success rate' },
];

const FEATURES = [
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    ),
    title: 'Curated Destinations',
    desc: 'Detailed guides on visa requirements, cost of living, and cultural context for every major study destination worldwide.',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>
      </svg>
    ),
    title: 'University Profiles',
    desc: 'Rankings, tuition ranges, intake schedules, and language requirements — all in one place. No more switching tabs.',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>
      </svg>
    ),
    title: 'Program Explorer',
    desc: 'Filter thousands of academic programs by degree level, field, duration, and budget. Find exactly what you need.',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/>
      </svg>
    ),
    title: 'Scholarship Matching',
    desc: 'Discover scholarships you\'re eligible for based on your GPA, nationality, and chosen field of study.',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
    ),
    title: 'AI Study Advisor',
    desc: 'Get instant answers to your questions about applications, requirements, deadlines, and study abroad life.',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
      </svg>
    ),
    title: 'Smart Profile',
    desc: 'Set your preferences once. Get personalised recommendations for universities and programs that fit you.',
  },
];

const DESTINATIONS = [
  { name: 'United Kingdom', emoji: '🇬🇧', universities: 164, badge: 'Top Destination' },
  { name: 'United States', emoji: '🇺🇸', universities: 312, badge: 'Most Popular' },
  { name: 'Canada', emoji: '🇨🇦', universities: 98, badge: 'Visa-Friendly' },
  { name: 'Australia', emoji: '🇦🇺', universities: 43, badge: 'High Acceptance' },
  { name: 'Germany', emoji: '🇩🇪', universities: 87, badge: 'Low Tuition' },
  { name: 'Netherlands', emoji: '🇳🇱', universities: 56, badge: 'English Programs' },
];

const TESTIMONIALS = [
  {
    quote: 'StudyGlobe cut my university research time in half. I found my Masters program at Edinburgh in two weeks.',
    name: 'Amara Osei', country: 'Ghana → Scotland', avatar: 'AO',
  },
  {
    quote: 'The scholarship matching feature is incredible. I found three I had no idea I was eligible for.',
    name: 'Riya Patel', country: 'India → Canada', avatar: 'RP',
  },
  {
    quote: 'Finally a platform that shows real intake dates and language score requirements together. Saves so much time.',
    name: 'Juan Herrera', country: 'Colombia → Netherlands', avatar: 'JH',
  },
];

export default function LandingPage() {
  const heroRef = useRef(null);

  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    el.querySelectorAll('.stagger').forEach((child, i) => {
      child.style.animationDelay = `${i * 120}ms`;
    });
  }, []);

  return (
    <div style={{ fontFamily: 'var(--font-body)' }}>

      {/* ── Hero ──────────────────────────────────────────────── */}
      <section ref={heroRef} style={{
        minHeight: '92vh',
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
        background: 'var(--c-forest)',
      }}>
        {/* Background texture */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `
            radial-gradient(ellipse 80% 60% at 70% 50%, rgba(61,122,87,0.4) 0%, transparent 70%),
            radial-gradient(ellipse 40% 40% at 20% 80%, rgba(196,98,45,0.2) 0%, transparent 60%)
          `,
          pointerEvents: 'none',
        }} />
        {/* Grid pattern */}
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.04,
          backgroundImage: 'linear-gradient(var(--c-gold) 1px, transparent 1px), linear-gradient(90deg, var(--c-gold) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }} />

        <div className="container" style={{ position: 'relative', zIndex: 1, padding: '80px var(--sp-6)' }}>
          <div style={{ maxWidth: 780 }}>
            <div className="stagger animate-fade-up" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '5px 14px', borderRadius: 'var(--r-full)',
              background: 'rgba(184,150,62,0.2)', border: '1px solid rgba(184,150,62,0.4)',
              color: '#E8C97A', fontSize: '0.8125rem', fontWeight: 500, letterSpacing: '0.04em',
              marginBottom: 28,
            }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#E8C97A', display: 'inline-block' }} />
              TRUSTED BY 850,000+ STUDENTS WORLDWIDE
            </div>

            <h1 className="stagger animate-fade-up t-display" style={{
              fontSize: 'clamp(2.8rem, 6vw, 4.75rem)',
              color: '#FAFAF7',
              marginBottom: 28,
              maxWidth: 720,
            }}>
              Your path to studying{' '}
              <em style={{ color: '#E8C97A', fontStyle: 'italic' }}>abroad</em>{' '}
              starts here.
            </h1>

            <p className="stagger animate-fade-up" style={{
              fontSize: 'clamp(1rem, 2vw, 1.25rem)',
              color: 'rgba(250,250,247,0.72)',
              lineHeight: 1.7,
              maxWidth: 560,
              marginBottom: 44,
            }}>
              Explore 12,000+ universities across 190 countries. Compare programs, check scholarships, 
              and plan your journey with confidence — all in one place.
            </p>

            <div className="stagger animate-fade-up" style={{ display: 'flex', flexWrap: 'wrap', gap: 14 }}>
              <Link to="/register" className="btn btn-accent btn-lg" style={{ fontWeight: 600 }}>
                Start exploring — it's free
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                </svg>
              </Link>
              <Link to="/login" className="btn btn-outline btn-lg" style={{ color: 'rgba(250,250,247,0.85)', borderColor: 'rgba(250,250,247,0.25)', background: 'rgba(250,250,247,0.06)' }}>
                Sign in
              </Link>
            </div>
          </div>
        </div>

        {/* Decorative globe */}
        <div style={{
          position: 'absolute', right: '-5%', top: '50%', transform: 'translateY(-50%)',
          width: 'clamp(300px, 45vw, 600px)', height: 'clamp(300px, 45vw, 600px)',
          borderRadius: '50%',
          border: '1px solid rgba(250,250,247,0.08)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          pointerEvents: 'none',
        }}>
          <div style={{
            width: '80%', height: '80%', borderRadius: '50%',
            border: '1px solid rgba(250,250,247,0.06)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <div style={{
              width: '75%', height: '75%', borderRadius: '50%',
              background: 'radial-gradient(circle at 35% 35%, rgba(61,122,87,0.5), rgba(26,61,43,0.8))',
              border: '1px solid rgba(184,150,62,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="42%" height="42%" viewBox="0 0 24 24" fill="none" stroke="rgba(250,250,247,0.3)" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <line x1="2" y1="12" x2="22" y2="12"/>
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats bar ─────────────────────────────────────────── */}
      <section style={{ background: 'var(--c-surface)', borderBottom: '1px solid var(--c-border)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 0 }}>
            {STATS.map(({ value, label }, i) => (
              <div key={i} style={{
                padding: 'var(--sp-8) var(--sp-6)',
                borderRight: i < STATS.length - 1 ? '1px solid var(--c-border)' : 'none',
                textAlign: 'center',
              }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 700, color: 'var(--c-forest)', lineHeight: 1 }}>{value}</div>
                <div style={{ fontSize: '0.875rem', color: 'var(--c-text-3)', marginTop: 6 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ──────────────────────────────────────────── */}
      <section className="section">
        <div className="container">
          <div style={{ maxWidth: 580, marginBottom: 'var(--sp-16)' }}>
            <div className="t-label" style={{ color: 'var(--c-sienna)', marginBottom: 12 }}>Everything in one platform</div>
            <h2 className="t-display" style={{ fontSize: 'clamp(2rem, 4vw, 2.75rem)', marginBottom: 16 }}>Built for every stage of your journey</h2>
            <p style={{ fontSize: '1.0625rem', color: 'var(--c-text-2)', lineHeight: 1.7 }}>
              From first research to final application — StudyGlobe has the tools, data, and guidance you need at every step.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--sp-5)' }}>
            {FEATURES.map(({ icon, title, desc }, i) => (
              <div key={i} className="card" style={{ padding: 'var(--sp-7)', transition: 'all var(--t-base) var(--ease)' }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = 'var(--shadow-lg)'; e.currentTarget.style.transform = 'translateY(-3px)'; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = ''; e.currentTarget.style.transform = ''; }}>
                <div style={{
                  width: 48, height: 48, borderRadius: 'var(--r-md)',
                  background: 'var(--c-forest-pale)', color: 'var(--c-forest)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: 'var(--sp-5)',
                }}>{icon}</div>
                <h3 className="t-title" style={{ fontSize: '1.0625rem', marginBottom: 8 }}>{title}</h3>
                <p style={{ fontSize: '0.9375rem', color: 'var(--c-text-2)', lineHeight: 1.65 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Destinations ──────────────────────────────────────── */}
      <section className="section" style={{ background: 'var(--c-surface-2)' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 16, marginBottom: 'var(--sp-12)' }}>
            <div>
              <div className="t-label" style={{ color: 'var(--c-sienna)', marginBottom: 10 }}>Where will you go?</div>
              <h2 className="t-display" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)' }}>Popular destinations</h2>
            </div>
            <Link to="/register" className="btn btn-outline" style={{ flexShrink: 0 }}>
              View all 190+ countries →
            </Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 'var(--sp-4)' }}>
            {DESTINATIONS.map(({ name, emoji, universities, badge }, i) => (
              <div key={i} className="card card-interactive" style={{ padding: 'var(--sp-6)', cursor: 'pointer' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 'var(--sp-4)' }}>
                  <span style={{ fontSize: '2.5rem', lineHeight: 1 }}>{emoji}</span>
                  <span className="badge badge-green" style={{ fontSize: '0.72rem' }}>{badge}</span>
                </div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '1.1rem', marginBottom: 4 }}>{name}</h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--c-text-3)' }}>{universities} universities</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ──────────────────────────────────────── */}
      <section className="section">
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: 520, margin: '0 auto var(--sp-16)' }}>
            <div className="t-label" style={{ color: 'var(--c-sienna)', marginBottom: 10 }}>Student stories</div>
            <h2 className="t-display" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)' }}>Trusted by students from every continent</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--sp-5)' }}>
            {TESTIMONIALS.map(({ quote, name, country, avatar }, i) => (
              <div key={i} className="card" style={{ padding: 'var(--sp-7)' }}>
                <div style={{ color: 'var(--c-gold)', fontSize: '2.5rem', lineHeight: 0.8, fontFamily: 'Georgia, serif', marginBottom: 16 }}>"</div>
                <p style={{ fontSize: '1rem', color: 'var(--c-text-2)', lineHeight: 1.7, marginBottom: 'var(--sp-6)', fontStyle: 'italic' }}>{quote}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{
                    width: 42, height: 42, borderRadius: '50%',
                    background: 'var(--c-forest)', color: 'white',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.75rem', fontWeight: 700,
                  }}>{avatar}</div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.9375rem' }}>{name}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--c-text-3)' }}>{country}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────── */}
      <section style={{ background: 'var(--c-forest)', padding: 'var(--sp-24) 0' }}>
        <div className="container" style={{ textAlign: 'center', maxWidth: 660, margin: '0 auto' }}>
          <h2 className="t-display" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', color: '#FAFAF7', marginBottom: 20 }}>
            Ready to find your university?
          </h2>
          <p style={{ fontSize: '1.0625rem', color: 'rgba(250,250,247,0.7)', lineHeight: 1.7, marginBottom: 40 }}>
            Join hundreds of thousands of students who found their dream program through StudyGlobe. Free to use, forever.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 14, flexWrap: 'wrap' }}>
            <Link to="/register" className="btn btn-accent btn-lg" style={{ fontWeight: 600 }}>Create free account</Link>
            <Link to="/login" className="btn btn-outline btn-lg" style={{ color: 'rgba(250,250,247,0.85)', borderColor: 'rgba(250,250,247,0.3)', background: 'rgba(250,250,247,0.06)' }}>Sign in</Link>
          </div>
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────────────── */}
      <footer style={{ background: 'var(--c-surface)', borderTop: '1px solid var(--c-border)', padding: 'var(--sp-12) 0' }}>
        <div className="container" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 28, height: 28, borderRadius: 7, background: 'var(--c-forest)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <line x1="2" y1="12" x2="22" y2="12"/>
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
              </svg>
            </div>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--c-forest)' }}>StudyGlobe</span>
          </div>
          <p style={{ fontSize: '0.875rem', color: 'var(--c-text-3)' }}>© {new Date().getFullYear()} StudyGlobe. Empowering international students worldwide.</p>
        </div>
      </footer>
    </div>
  );
}
