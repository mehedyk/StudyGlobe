import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { profileAPI } from '../services/api';

const GlobeIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/>
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
  </svg>
);
const UniIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>
  </svg>
);
const BookIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
  </svg>
);
const UserIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
  </svg>
);
const ArrowRight = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
  </svg>
);

const NAV_CARDS = [
  {
    to: '/countries',
    icon: <GlobeIcon />,
    iconBg: 'var(--c-forest-pale)',
    iconColor: 'var(--c-forest)',
    title: 'Destinations',
    desc: 'Explore 190+ countries with cost, visa, and lifestyle data.',
    badge: '190+ countries',
  },
  {
    to: '/universities',
    icon: <UniIcon />,
    iconBg: 'var(--c-sienna-pale)',
    iconColor: 'var(--c-sienna)',
    title: 'Universities',
    desc: 'Search, filter, and compare universities worldwide.',
    badge: '12,000+ listed',
  },
  {
    to: '/programs',
    icon: <BookIcon />,
    iconBg: 'var(--c-gold-pale)',
    iconColor: 'var(--c-gold)',
    title: 'Programs',
    desc: 'Find programs by degree, field, and budget.',
    badge: 'All levels',
  },
  {
    to: '/profile',
    icon: <UserIcon />,
    iconBg: 'var(--c-surface-2)',
    iconColor: 'var(--c-text-2)',
    title: 'My Profile',
    desc: 'Set your preferences to get personalised results.',
    badge: null,
    profileCard: true,
  },
];

function ProfileCompletion({ profile }) {
  const fields = ['full_name', 'preferred_country', 'degree_level', 'field_of_study', 'budget_range', 'language_test'];
  const filled = fields.filter(f => profile?.[f]).length;
  const pct = Math.round((filled / fields.length) * 100);
  return (
    <div style={{ padding: 'var(--sp-6)', background: 'var(--c-surface)', border: '1px solid var(--c-border)', borderRadius: 'var(--r-lg)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--sp-4)' }}>
        <div>
          <div style={{ fontSize: '0.8125rem', fontWeight: 500, color: 'var(--c-text-3)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 4 }}>Profile completion</div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 700, color: 'var(--c-forest)', lineHeight: 1 }}>{pct}%</div>
        </div>
        <Link to="/profile" className="btn btn-outline btn-sm">Complete →</Link>
      </div>
      <div style={{ height: 6, background: 'var(--c-border)', borderRadius: 'var(--r-full)', overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${pct}%`, background: 'var(--c-forest)', borderRadius: 'var(--r-full)', transition: 'width 0.8s var(--ease)' }} />
      </div>
      <p style={{ fontSize: '0.8125rem', color: 'var(--c-text-3)', marginTop: 10 }}>
        {pct === 100 ? 'Your profile is complete! We can now give you personalised recommendations.' : `Complete your profile to get personalised university recommendations.`}
      </p>
    </div>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const name = user?.full_name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Student';
  const firstName = name.split(' ')[0];

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  useEffect(() => {
    profileAPI.get().then(r => setProfile(r.data)).catch(() => {});
  }, []);

  return (
    <div style={{ paddingTop: 'var(--sp-8)', paddingBottom: 'var(--sp-16)' }}>

      {/* Welcome header */}
      <div style={{
        background: 'var(--c-forest)', borderRadius: 'var(--r-xl)',
        padding: 'clamp(var(--sp-8), 4vw, var(--sp-12)) clamp(var(--sp-6), 4vw, var(--sp-10))',
        marginBottom: 'var(--sp-8)',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.05,
          backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
          backgroundSize: '24px 24px',
        }} />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 560 }}>
          <div style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.6)', marginBottom: 8 }}>{greeting},</div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 700, color: 'white', marginBottom: 12, lineHeight: 1.15 }}>
            {firstName}.
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1rem', lineHeight: 1.65, maxWidth: 400 }}>
            Your next chapter starts here. Explore destinations, compare universities, and find the program that fits your future.
          </p>
        </div>
        {/* Decorative */}
        <div style={{
          position: 'absolute', right: '-20px', top: '50%', transform: 'translateY(-50%)',
          width: 200, height: 200, borderRadius: '50%',
          border: '1px solid rgba(255,255,255,0.06)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', right: '30px', top: '50%', transform: 'translateY(-50%)',
          width: 130, height: 130, borderRadius: '50%',
          border: '1px solid rgba(255,255,255,0.08)',
          pointerEvents: 'none',
        }} />
      </div>

      {/* Main grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 'var(--sp-5)' }}>
        {NAV_CARDS.map(({ to, icon, iconBg, iconColor, title, desc, badge }) => (
          <Link key={to} to={to} className="card" style={{
            padding: 'var(--sp-6)',
            textDecoration: 'none',
            display: 'block',
            transition: 'all var(--t-base) var(--ease)',
          }}
            onMouseEnter={e => { e.currentTarget.style.boxShadow = 'var(--shadow-lg)'; e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.borderColor = 'var(--c-forest-light)'; }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = ''; e.currentTarget.style.transform = ''; e.currentTarget.style.borderColor = 'var(--c-border)'; }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--sp-5)' }}>
              <div style={{ width: 48, height: 48, borderRadius: 'var(--r-md)', background: iconBg, color: iconColor, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {icon}
              </div>
              {badge && <span className="badge badge-neutral" style={{ fontSize: '0.72rem' }}>{badge}</span>}
            </div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1875rem', fontWeight: 600, marginBottom: 6, color: 'var(--c-text)' }}>{title}</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--c-text-3)', lineHeight: 1.6, marginBottom: 'var(--sp-5)' }}>{desc}</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.875rem', fontWeight: 500, color: 'var(--c-forest)' }}>
              Explore <ArrowRight />
            </div>
          </Link>
        ))}
      </div>

      {/* Profile completion */}
      <div style={{ marginTop: 'var(--sp-6)' }}>
        <ProfileCompletion profile={profile} />
      </div>
    </div>
  );
}
