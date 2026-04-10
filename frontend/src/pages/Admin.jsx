import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { analyticsAPI, usersAPI, countriesAPI, universitiesAPI } from '../services/api';

// ── Shared Admin Layout ───────────────────────────────────────────
function AdminLayout({ children, title, subtitle }) {
  const location = useLocation();
  const nav = [
    { to: '/admin', label: 'Overview', exact: true },
    { to: '/admin/users', label: 'Users' },
    { to: '/admin/analytics', label: 'Analytics' },
  ];
  const isActive = (to, exact) => exact ? location.pathname === to : location.pathname.startsWith(to);

  return (
    <div style={{ paddingTop: 'var(--sp-8)', paddingBottom: 'var(--sp-16)' }}>
      {/* Admin header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--sp-6)', flexWrap: 'wrap', gap: 'var(--sp-4)' }}>
        <div>
          <span className="badge badge-gold" style={{ marginBottom: 8 }}>Admin Panel</span>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.75rem, 4vw, 2.25rem)', fontWeight: 700, lineHeight: 1.15 }}>{title}</h1>
          {subtitle && <p style={{ color: 'var(--c-text-3)', marginTop: 6 }}>{subtitle}</p>}
        </div>
        <Link to="/dashboard" className="btn btn-outline btn-sm">← Back to app</Link>
      </div>

      {/* Admin nav */}
      <div className="tabs" style={{ marginBottom: 'var(--sp-8)' }}>
        {nav.map(({ to, label, exact }) => (
          <Link key={to} to={to} className={`tab-btn ${isActive(to, exact) ? 'active' : ''}`}>{label}</Link>
        ))}
      </div>

      {children}
    </div>
  );
}

// ── Stat Card ────────────────────────────────────────────────────
function StatCard({ label, value, sub, color = 'var(--c-forest)', loading }) {
  return (
    <div style={{ background: 'var(--c-surface)', border: '1px solid var(--c-border)', borderRadius: 'var(--r-lg)', padding: 'var(--sp-6)' }}>
      <div style={{ fontSize: '0.8125rem', fontWeight: 500, color: 'var(--c-text-3)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>{label}</div>
      {loading ? (
        <div className="skeleton" style={{ height: 36, width: '60%', marginBottom: 8 }} />
      ) : (
        <div style={{ fontFamily: 'var(--font-display)', fontSize: '2.25rem', fontWeight: 700, color, lineHeight: 1, marginBottom: 6 }}>{value ?? '—'}</div>
      )}
      {sub && <div style={{ fontSize: '0.8125rem', color: 'var(--c-text-3)' }}>{sub}</div>}
    </div>
  );
}

// ── Admin Dashboard (Overview) ───────────────────────────────────
export function AdminDashboard() {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    analyticsAPI.getSystemMetrics()
      .then(r => setMetrics(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <AdminLayout title="Overview" subtitle="Platform health and key metrics">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 'var(--sp-4)', marginBottom: 'var(--sp-8)' }}>
        <StatCard label="Total Users" value={metrics?.total_users} loading={loading} color="var(--c-forest)" sub="Registered accounts" />
        <StatCard label="Universities" value={metrics?.total_universities} loading={loading} color="var(--c-sienna)" sub="Listed institutions" />
        <StatCard label="Programs" value={metrics?.total_programs} loading={loading} color="var(--c-gold)" sub="Academic programs" />
        <StatCard label="Countries" value={metrics?.total_countries} loading={loading} color="var(--c-forest-mid)" sub="Destinations covered" />
      </div>

      <div style={{ background: 'var(--c-surface)', border: '1px solid var(--c-border)', borderRadius: 'var(--r-xl)', padding: 'var(--sp-7)' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '1.125rem', marginBottom: 'var(--sp-4)' }}>Quick Actions</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--sp-3)' }}>
          <Link to="/admin/users" className="btn btn-outline btn-sm">Manage Users</Link>
          <Link to="/admin/analytics" className="btn btn-outline btn-sm">View Analytics</Link>
        </div>
      </div>
    </AdminLayout>
  );
}

// ── Admin Users ──────────────────────────────────────────────────
export function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    usersAPI.getAll()
      .then(r => setUsers(r.data))
      .catch(() => setError('Failed to load users.'))
      .finally(() => setLoading(false));
  }, []);

  const toggleAdmin = async (user) => {
    setUpdatingId(user.id);
    try {
      await usersAPI.updateRole(user.id, user.is_admin ? 'user' : 'admin');
      setUsers(us => us.map(u => u.id === user.id ? { ...u, is_admin: !u.is_admin } : u));
    } catch { setError('Failed to update user role.'); }
    finally { setUpdatingId(null); }
  };

  const filtered = users.filter(u =>
    u.full_name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout title="Users" subtitle={`${users.length} registered accounts`}>
      <div style={{ background: 'var(--c-surface)', border: '1px solid var(--c-border)', borderRadius: 'var(--r-xl)', padding: 'var(--sp-5)', marginBottom: 'var(--sp-5)' }}>
        <input className="input" type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or email…" style={{ maxWidth: 360 }} />
      </div>

      {error && <div className="alert alert-error" style={{ marginBottom: 'var(--sp-5)' }}>{error}</div>}

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 'var(--sp-16)' }}>
          <div className="spinner" />
        </div>
      ) : (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Joined</th>
                <th>Degree Level</th>
                <th>Role</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(u => (
                <tr key={u.id}>
                  <td style={{ fontWeight: 500, color: 'var(--c-text)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'var(--c-forest-pale)', color: 'var(--c-forest)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 700, flexShrink: 0 }}>
                        {(u.full_name || u.email || 'U').split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                      </div>
                      {u.full_name || '—'}
                    </div>
                  </td>
                  <td>{u.email}</td>
                  <td>{u.created_at ? new Date(u.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}</td>
                  <td>{u.degree_level || <span style={{ color: 'var(--c-text-3)' }}>Not set</span>}</td>
                  <td>
                    <span className={`badge ${u.is_admin ? 'badge-gold' : 'badge-neutral'}`}>
                      {u.is_admin ? 'Admin' : 'User'}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button
                      onClick={() => toggleAdmin(u)}
                      disabled={updatingId === u.id}
                      className="btn btn-ghost btn-sm"
                      style={{ fontSize: '0.8125rem', color: u.is_admin ? '#DC2626' : 'var(--c-forest)' }}
                    >
                      {updatingId === u.id ? '…' : u.is_admin ? 'Remove admin' : 'Make admin'}
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: 'var(--sp-10)', color: 'var(--c-text-3)' }}>
                    {search ? `No users matching "${search}"` : 'No users found.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  );
}

// ── Admin Analytics ──────────────────────────────────────────────
export function AdminAnalytics() {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [countries, setCountries] = useState([]);
  const [universities, setUniversities] = useState([]);

  useEffect(() => {
    Promise.all([
      analyticsAPI.getSystemMetrics().then(r => r.data).catch(() => null),
      countriesAPI.getAll().then(r => r.data).catch(() => []),
      universitiesAPI.getAll().then(r => r.data).catch(() => []),
    ]).then(([m, c, u]) => {
      setMetrics(m);
      setCountries(c.slice(0, 8));
      setUniversities(u.filter(u => u.ranking).sort((a, b) => a.ranking - b.ranking).slice(0, 5));
    }).finally(() => setLoading(false));
  }, []);

  const maxCount = countries.reduce((max, c) => Math.max(max, c.university_count || 1), 1);

  return (
    <AdminLayout title="Analytics" subtitle="Platform usage and data insights">
      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 'var(--sp-4)', marginBottom: 'var(--sp-8)' }}>
        <StatCard label="Total Users" value={metrics?.total_users} loading={loading} />
        <StatCard label="Universities" value={metrics?.total_universities} loading={loading} color="var(--c-sienna)" />
        <StatCard label="Programs" value={metrics?.total_programs} loading={loading} color="var(--c-gold)" />
        <StatCard label="Countries" value={metrics?.total_countries} loading={loading} color="var(--c-forest-mid)" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 'var(--sp-6)' }}>
        {/* Top destinations */}
        <div style={{ background: 'var(--c-surface)', border: '1px solid var(--c-border)', borderRadius: 'var(--r-xl)', padding: 'var(--sp-6)' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '1.0625rem', marginBottom: 'var(--sp-5)' }}>Top Destinations</h2>
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => <div key={i} className="skeleton" style={{ height: 36, marginBottom: 8, borderRadius: 'var(--r-md)' }} />)
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)' }}>
              {countries.map((c, i) => (
                <div key={c.id}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--c-text)' }}>{c.name}</span>
                    <span style={{ fontSize: '0.8125rem', color: 'var(--c-text-3)' }}>{c.university_count || 0} unis</span>
                  </div>
                  <div style={{ height: 5, background: 'var(--c-surface-2)', borderRadius: 'var(--r-full)', overflow: 'hidden' }}>
                    <div style={{
                      height: '100%',
                      width: `${((c.university_count || 0) / maxCount) * 100}%`,
                      background: i === 0 ? 'var(--c-forest)' : i === 1 ? 'var(--c-forest-mid)' : 'var(--c-forest-light)',
                      borderRadius: 'var(--r-full)',
                      transition: 'width 0.6s var(--ease)',
                    }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Top ranked universities */}
        <div style={{ background: 'var(--c-surface)', border: '1px solid var(--c-border)', borderRadius: 'var(--r-xl)', padding: 'var(--sp-6)' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '1.0625rem', marginBottom: 'var(--sp-5)' }}>Top Ranked Universities</h2>
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => <div key={i} className="skeleton" style={{ height: 44, marginBottom: 8, borderRadius: 'var(--r-md)' }} />)
          ) : universities.length === 0 ? (
            <p style={{ color: 'var(--c-text-3)', fontSize: '0.9rem' }}>No ranking data available.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {universities.map((u, i) => (
                <div key={u.id} style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-3)', padding: 'var(--sp-3)', borderRadius: 'var(--r-md)', transition: 'background var(--t-fast)' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--c-surface-2)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <div style={{ width: 28, height: 28, borderRadius: '50%', background: i === 0 ? 'var(--c-gold-pale)' : 'var(--c-surface-2)', color: i === 0 ? 'var(--c-gold)' : 'var(--c-text-3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700, flexShrink: 0 }}>
                    #{u.ranking}
                  </div>
                  <div style={{ flex: 1, overflow: 'hidden' }}>
                    <div style={{ fontWeight: 500, fontSize: '0.875rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{u.Name || u.name}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--c-text-3)' }}>{u.countries?.name}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
