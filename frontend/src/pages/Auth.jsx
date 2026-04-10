import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';

function BrandPanel({ headline, sub }) {
  return (
    <div style={{
      flex: '0 0 420px',
      background: 'var(--c-forest)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: 'var(--sp-12) var(--sp-10)',
      position: 'relative',
      overflow: 'hidden',
    }} className="auth-brand-panel">
      {/* Pattern */}
      <div style={{
        position: 'absolute', inset: 0, opacity: 0.05,
        backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
        backgroundSize: '28px 28px',
      }} />
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 'var(--sp-16)' }}>
          <div style={{ width: 36, height: 36, borderRadius: 9, background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/>
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
            </svg>
          </div>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.25rem', color: 'white' }}>StudyGlobe</span>
        </div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 700, color: 'white', lineHeight: 1.2, marginBottom: 16 }}>{headline}</h2>
        <p style={{ color: 'rgba(255,255,255,0.65)', lineHeight: 1.7, fontSize: '0.9875rem' }}>{sub}</p>
      </div>
      <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', gap: 14 }}>
        {[
          { n: '190+', l: 'Countries covered' },
          { n: '12,000+', l: 'Universities listed' },
          { n: 'Free', l: 'Always' },
        ].map(({ n, l }) => (
          <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.3rem', color: '#E8C97A', minWidth: 70 }}>{n}</span>
            <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.875rem' }}>{l}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await authAPI.login({ email, password });
      login(res.data.session, res.data.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: 'var(--c-bg)' }}>
      <BrandPanel
        headline="Welcome back to your study journey."
        sub="Sign in to continue exploring universities and programs tailored to you."
      />
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'var(--sp-8)' }}>
        <div style={{ width: '100%', maxWidth: 420 }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.875rem', fontWeight: 700, marginBottom: 8 }}>Sign in</h1>
          <p style={{ color: 'var(--c-text-3)', marginBottom: 'var(--sp-8)', fontSize: '0.9375rem' }}>
            New here? <Link to="/register" style={{ color: 'var(--c-forest)', fontWeight: 500 }}>Create an account →</Link>
          </p>

          {error && <div className="alert alert-error" style={{ marginBottom: 'var(--sp-5)' }}>{error}</div>}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-5)' }}>
            <div className="input-group">
              <label className="input-label">Email address</label>
              <input className="input" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required />
            </div>
            <div className="input-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label className="input-label">Password</label>
                <Link to="/forgot-password" style={{ fontSize: '0.8125rem', color: 'var(--c-forest)', fontWeight: 500 }}>Forgot password?</Link>
              </div>
              <input className="input" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: 4, height: 48 }} disabled={loading}>
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
        </div>
      </div>
      <style>{`@media (max-width: 768px) { .auth-brand-panel { display: none !important; } }`}</style>
    </div>
  );
}

export function Register() {
  const [form, setForm] = useState({ full_name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    setLoading(true);
    setError('');
    try {
      await authAPI.register(form);
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'var(--sp-8)' }}>
        <div style={{ textAlign: 'center', maxWidth: 440 }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--c-forest-pale)', color: 'var(--c-forest)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto var(--sp-6)' }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          </div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 700, marginBottom: 12 }}>Check your email</h2>
          <p style={{ color: 'var(--c-text-2)', lineHeight: 1.7, marginBottom: 'var(--sp-8)' }}>
            We've sent a confirmation link to <strong>{form.email}</strong>. Click the link to activate your account, then sign in.
          </p>
          <Link to="/login" className="btn btn-primary" style={{ width: '100%' }}>Go to sign in</Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: 'var(--c-bg)' }}>
      <BrandPanel
        headline="Start your international education journey today."
        sub="Create a free account to explore universities, programs, and scholarships worldwide."
      />
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'var(--sp-8)' }}>
        <div style={{ width: '100%', maxWidth: 420 }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.875rem', fontWeight: 700, marginBottom: 8 }}>Create account</h1>
          <p style={{ color: 'var(--c-text-3)', marginBottom: 'var(--sp-8)', fontSize: '0.9375rem' }}>
            Already have one? <Link to="/login" style={{ color: 'var(--c-forest)', fontWeight: 500 }}>Sign in →</Link>
          </p>

          {error && <div className="alert alert-error" style={{ marginBottom: 'var(--sp-5)' }}>{error}</div>}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-5)' }}>
            <div className="input-group">
              <label className="input-label">Full name</label>
              <input className="input" type="text" value={form.full_name} onChange={set('full_name')} placeholder="Alex Johnson" required />
            </div>
            <div className="input-group">
              <label className="input-label">Email address</label>
              <input className="input" type="email" value={form.email} onChange={set('email')} placeholder="you@example.com" required />
            </div>
            <div className="input-group">
              <label className="input-label">Password</label>
              <input className="input" type="password" value={form.password} onChange={set('password')} placeholder="Min. 6 characters" required minLength={6} />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: 4, height: 48 }} disabled={loading}>
              {loading ? 'Creating account…' : 'Create free account'}
            </button>
          </form>
          <p style={{ marginTop: 'var(--sp-5)', fontSize: '0.8125rem', color: 'var(--c-text-3)', textAlign: 'center', lineHeight: 1.6 }}>
            By registering, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
      <style>{`@media (max-width: 768px) { .auth-brand-panel { display: none !important; } }`}</style>
    </div>
  );
}

export function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authAPI.requestPasswordReset(email);
      setSent(true);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to send reset link.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'var(--sp-8)' }}>
      <div style={{ width: '100%', maxWidth: 400 }}>
        <Link to="/login" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: '0.875rem', color: 'var(--c-text-3)', marginBottom: 'var(--sp-8)' }}>
          ← Back to sign in
        </Link>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.875rem', fontWeight: 700, marginBottom: 10 }}>Reset your password</h1>
        <p style={{ color: 'var(--c-text-3)', marginBottom: 'var(--sp-8)' }}>Enter your email and we'll send you a reset link.</p>

        {sent ? (
          <div className="alert alert-success">Reset link sent to <strong>{email}</strong>. Check your inbox.</div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-5)' }}>
            {error && <div className="alert alert-error">{error}</div>}
            <div className="input-group">
              <label className="input-label">Email address</label>
              <input className="input" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%', height: 48 }} disabled={loading}>
              {loading ? 'Sending…' : 'Send reset link'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export function ResetPassword() {
  const [password, setPassword] = useState('');
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const hash = new URLSearchParams(window.location.hash.slice(1));
      const token = hash.get('access_token') || new URLSearchParams(window.location.search).get('access_token');
      await authAPI.resetPassword(token, password);
      setDone(true);
      setTimeout(() => navigate('/login'), 2500);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to reset password. The link may have expired.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'var(--sp-8)' }}>
      <div style={{ width: '100%', maxWidth: 400 }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.875rem', fontWeight: 700, marginBottom: 10 }}>New password</h1>
        <p style={{ color: 'var(--c-text-3)', marginBottom: 'var(--sp-8)' }}>Choose a strong password for your account.</p>

        {done ? (
          <div className="alert alert-success">Password updated! Redirecting to sign in…</div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-5)' }}>
            {error && <div className="alert alert-error">{error}</div>}
            <div className="input-group">
              <label className="input-label">New password</label>
              <input className="input" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Min. 6 characters" required minLength={6} />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%', height: 48 }} disabled={loading}>
              {loading ? 'Saving…' : 'Set new password'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}