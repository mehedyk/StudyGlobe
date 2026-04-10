import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const SunIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
    <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
  </svg>
);
const MoonIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
  </svg>
);
const ChevronDown = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9"/>
  </svg>
);
const MenuIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
  </svg>
);
const CloseIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

const NAV_LINKS = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/countries', label: 'Destinations' },
  { to: '/universities', label: 'Universities' },
  { to: '/programs', label: 'Programs' },
];

export default function Navbar({ theme, onThemeToggle }) {
  const { isAuthenticated, isAdmin, logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);
  const dropRef = useRef(null);

  const name = user?.full_name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Student';
  const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  const handleLogout = async () => {
    setDropOpen(false);
    await logout();
    navigate('/login');
  };

  useEffect(() => {
    const handler = (e) => { if (dropRef.current && !dropRef.current.contains(e.target)) setDropOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [location]);

  const isActive = (to) => location.pathname.startsWith(to);

  return (
    <>
      <nav style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: 'var(--c-surface)',
        borderBottom: '1px solid var(--c-border)',
        boxShadow: 'var(--shadow-sm)',
      }}>
        <div className="container" style={{ height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

          {/* Logo */}
          <Link to={isAuthenticated ? '/dashboard' : '/'} style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <div style={{
              width: 34, height: 34, borderRadius: 8,
              background: 'var(--c-forest)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <line x1="2" y1="12" x2="22" y2="12"/>
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
              </svg>
            </div>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.2rem', color: 'var(--c-forest)', letterSpacing: '-0.02em' }}>
              StudyGlobe
            </span>
          </Link>

          {/* Desktop nav links */}
          {isAuthenticated && (
            <div style={{ display: 'flex', gap: 4, alignItems: 'center' }} className="hide-mobile">
              {NAV_LINKS.map(({ to, label }) => (
                <Link key={to} to={to} style={{
                  padding: '6px 14px',
                  borderRadius: 'var(--r-md)',
                  fontSize: '0.9375rem',
                  fontWeight: isActive(to) ? 600 : 400,
                  color: isActive(to) ? 'var(--c-forest)' : 'var(--c-text-2)',
                  background: isActive(to) ? 'var(--c-forest-pale)' : 'transparent',
                  transition: 'all var(--t-fast)',
                  textDecoration: 'none',
                }}>
                  {label}
                </Link>
              ))}
              {isAdmin && (
                <Link to="/admin" style={{
                  padding: '5px 12px',
                  borderRadius: 'var(--r-md)',
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  color: 'var(--c-gold)',
                  border: '1px solid var(--c-gold)',
                  background: 'var(--c-gold-pale)',
                  textDecoration: 'none',
                }}>Admin</Link>
              )}
            </div>
          )}

          {/* Right controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {/* Theme toggle */}
            <button
              onClick={onThemeToggle}
              className="btn btn-ghost btn-sm"
              style={{ padding: '7px', borderRadius: 'var(--r-md)' }}
              title="Toggle theme"
            >
              {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
            </button>

            {isAuthenticated ? (
              <>
                {/* Avatar dropdown */}
                <div ref={dropRef} style={{ position: 'relative' }} className="hide-mobile">
                  <button
                    onClick={() => setDropOpen(v => !v)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 8,
                      padding: '5px 10px 5px 5px',
                      borderRadius: 'var(--r-full)',
                      border: '1px solid var(--c-border)',
                      background: 'var(--c-surface)',
                      cursor: 'pointer',
                      transition: 'border-color var(--t-fast)',
                    }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--c-forest-light)'}
                    onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--c-border)'}
                  >
                    <div style={{
                      width: 30, height: 30, borderRadius: '50%',
                      background: 'var(--c-forest)', color: 'white',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '0.75rem', fontWeight: 700,
                    }}>{initials}</div>
                    <span style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--c-text)', maxWidth: 100, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{name}</span>
                    <ChevronDown />
                  </button>

                  {dropOpen && (
                    <div style={{
                      position: 'absolute', top: 'calc(100% + 8px)', right: 0,
                      minWidth: 200,
                      background: 'var(--c-surface)',
                      border: '1px solid var(--c-border)',
                      borderRadius: 'var(--r-lg)',
                      boxShadow: 'var(--shadow-lg)',
                      padding: '6px',
                      animation: 'fadeUp 0.15s ease both',
                    }}>
                      <div style={{ padding: '8px 12px 10px', borderBottom: '1px solid var(--c-border)', marginBottom: 4 }}>
                        <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--c-text)' }}>{name}</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--c-text-3)', marginTop: 1 }}>{user?.email}</div>
                      </div>
                      <Link to="/profile" onClick={() => setDropOpen(false)} style={{
                        display: 'block', padding: '8px 12px', borderRadius: 'var(--r-md)',
                        fontSize: '0.9rem', color: 'var(--c-text-2)',
                        transition: 'background var(--t-fast)',
                      }}
                        onMouseEnter={e => e.currentTarget.style.background = 'var(--c-surface-2)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      >My Profile</Link>
                      <button onClick={handleLogout} style={{
                        display: 'block', width: '100%', textAlign: 'left',
                        padding: '8px 12px', borderRadius: 'var(--r-md)',
                        fontSize: '0.9rem', color: '#DC2626',
                        background: 'transparent', border: 'none', cursor: 'pointer',
                        transition: 'background var(--t-fast)',
                      }}
                        onMouseEnter={e => e.currentTarget.style.background = '#FEF2F2'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      >Sign out</button>
                    </div>
                  )}
                </div>

                {/* Mobile hamburger */}
                <button onClick={() => setMenuOpen(v => !v)} className="btn btn-ghost btn-sm show-mobile" style={{ padding: 7 }}>
                  {menuOpen ? <CloseIcon /> : <MenuIcon />}
                </button>
              </>
            ) : (
              <div style={{ display: 'flex', gap: 8 }}>
                <Link to="/login" className="btn btn-ghost btn-sm">Sign in</Link>
                <Link to="/register" className="btn btn-primary btn-sm">Get started</Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile menu drawer */}
      {menuOpen && isAuthenticated && (
        <div style={{
          position: 'fixed', top: 65, left: 0, right: 0, bottom: 0, zIndex: 99,
          background: 'var(--c-surface)',
          borderTop: '1px solid var(--c-border)',
          padding: 'var(--sp-4)',
          display: 'flex', flexDirection: 'column', gap: 4,
          animation: 'fadeIn 0.15s ease both',
        }}>
          {NAV_LINKS.map(({ to, label }) => (
            <Link key={to} to={to} style={{
              padding: '12px 16px',
              borderRadius: 'var(--r-md)',
              fontSize: '1rem',
              fontWeight: isActive(to) ? 600 : 400,
              color: isActive(to) ? 'var(--c-forest)' : 'var(--c-text-2)',
              background: isActive(to) ? 'var(--c-forest-pale)' : 'transparent',
            }}>{label}</Link>
          ))}
          {isAdmin && <Link to="/admin" style={{ padding: '12px 16px', borderRadius: 'var(--r-md)', color: 'var(--c-gold)', fontWeight: 600 }}>Admin Panel</Link>}
          <div style={{ marginTop: 'auto', borderTop: '1px solid var(--c-border)', paddingTop: 16 }}>
            <Link to="/profile" style={{ display: 'block', padding: '12px 16px', borderRadius: 'var(--r-md)', color: 'var(--c-text-2)' }}>My Profile</Link>
            <button onClick={handleLogout} style={{
              display: 'block', width: '100%', textAlign: 'left',
              padding: '12px 16px', borderRadius: 'var(--r-md)',
              color: '#DC2626', background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '1rem',
            }}>Sign out</button>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) { .hide-mobile { display: none !important; } }
        @media (min-width: 769px) { .show-mobile { display: none !important; } }
      `}</style>
    </>
  );
}
