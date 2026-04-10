import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { programsAPI } from '../services/api';

const DEGREE_LEVELS = ['All', 'Bachelor', 'Master', 'PhD', 'Diploma', 'Certificate'];
const FIELDS = ['All Fields', 'Computer Science', 'Business', 'Engineering', 'Medicine', 'Law', 'Arts', 'Education', 'Social Sciences', 'Natural Sciences'];

function ProgramCardSkeleton() {
  return (
    <div className="card" style={{ padding: 'var(--sp-5)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--sp-3)' }}>
        <div className="skeleton" style={{ height: 20, width: '60%' }} />
        <div className="skeleton" style={{ height: 22, width: 80, borderRadius: 'var(--r-full)' }} />
      </div>
      <div className="skeleton" style={{ height: 16, width: '45%', marginBottom: 'var(--sp-4)' }} />
      <div style={{ display: 'flex', gap: 6 }}>
        <div className="skeleton" style={{ height: 24, width: 70, borderRadius: 'var(--r-full)' }} />
        <div className="skeleton" style={{ height: 24, width: 90, borderRadius: 'var(--r-full)' }} />
      </div>
    </div>
  );
}

export default function Programs() {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchText, setSearchText] = useState('');
  const [degreeFilter, setDegreeFilter] = useState('All');
  const [fieldFilter, setFieldFilter] = useState('All Fields');

  useEffect(() => {
    programsAPI.getAll()
      .then(r => setPrograms(r.data))
      .catch(() => setError('Failed to load programs.'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = programs.filter(p => {
    const matchSearch = !searchText.trim() ||
      p.name?.toLowerCase().includes(searchText.toLowerCase()) ||
      p.field?.toLowerCase().includes(searchText.toLowerCase()) ||
      p.universities?.name?.toLowerCase().includes(searchText.toLowerCase());
    const matchDegree = degreeFilter === 'All' || p.degree_level?.toLowerCase().includes(degreeFilter.toLowerCase());
    const matchField = fieldFilter === 'All Fields' || p.field?.toLowerCase().includes(fieldFilter.toLowerCase());
    return matchSearch && matchDegree && matchField;
  });

  const hasFilters = searchText.trim() || degreeFilter !== 'All' || fieldFilter !== 'All Fields';

  return (
    <div style={{ paddingTop: 'var(--sp-8)', paddingBottom: 'var(--sp-16)' }}>

      {/* Header */}
      <div style={{ marginBottom: 'var(--sp-8)' }}>
        <div className="t-label" style={{ color: 'var(--c-sienna)', marginBottom: 8 }}>Find your field</div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 4vw, 2.75rem)', fontWeight: 700, marginBottom: 12, lineHeight: 1.15 }}>
          Academic Programs
        </h1>
        <p style={{ color: 'var(--c-text-3)', fontSize: '1.0625rem', maxWidth: 480 }}>
          Search thousands of programs. Filter by degree level, field of study, and more.
        </p>
      </div>

      {/* Filters */}
      <div style={{ background: 'var(--c-surface)', border: '1px solid var(--c-border)', borderRadius: 'var(--r-lg)', padding: 'var(--sp-5)', marginBottom: 'var(--sp-5)', boxShadow: 'var(--shadow-sm)' }}>
        {/* Search */}
        <div style={{ position: 'relative', marginBottom: 'var(--sp-4)' }}>
          <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--c-text-3)', pointerEvents: 'none', display: 'flex' }}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          </span>
          <input className="input" type="text" value={searchText} onChange={e => setSearchText(e.target.value)}
            placeholder="Search programs, fields, or universities…" style={{ paddingLeft: 44 }} />
        </div>

        {/* Degree level chips */}
        <div style={{ marginBottom: 'var(--sp-4)' }}>
          <div style={{ fontSize: '0.8125rem', fontWeight: 500, color: 'var(--c-text-3)', marginBottom: 8 }}>Degree level</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {DEGREE_LEVELS.map(level => (
              <button key={level} onClick={() => setDegreeFilter(level)}
                className={`badge ${degreeFilter === level ? 'badge-green' : 'badge-neutral'}`}
                style={{ cursor: 'pointer', border: degreeFilter === level ? '1px solid var(--c-forest)' : '1px solid transparent', padding: '5px 12px', fontSize: '0.8125rem', transition: 'all var(--t-fast)' }}>
                {level}
              </button>
            ))}
          </div>
        </div>

        {/* Field select */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-4)', flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 220px', minWidth: 180 }}>
            <select className="input" value={fieldFilter} onChange={e => setFieldFilter(e.target.value)} style={{ cursor: 'pointer', fontSize: '0.9rem' }}>
              {FIELDS.map(f => <option key={f} value={f}>{f}</option>)}
            </select>
          </div>
          {hasFilters && (
            <button onClick={() => { setSearchText(''); setDegreeFilter('All'); setFieldFilter('All Fields'); }}
              className="btn btn-ghost btn-sm" style={{ color: 'var(--c-text-3)' }}>
              Clear all filters
            </button>
          )}
        </div>
      </div>

      {/* Count */}
      {!loading && !error && (
        <div style={{ fontSize: '0.875rem', color: 'var(--c-text-3)', marginBottom: 'var(--sp-5)' }}>
          <strong style={{ color: 'var(--c-text)' }}>{filtered.length}</strong> program{filtered.length !== 1 ? 's' : ''} found
          {hasFilters && ` (filtered from ${programs.length} total)`}
        </div>
      )}

      {error && <div className="alert alert-error" style={{ marginBottom: 'var(--sp-5)' }}>{error}</div>}

      {/* Results */}
      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 'var(--sp-4)' }}>
          {Array.from({ length: 6 }).map((_, i) => <ProgramCardSkeleton key={i} />)}
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 'var(--sp-20) 0' }}>
          <div style={{ fontSize: '3rem', marginBottom: 'var(--sp-4)' }}>📚</div>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 600, marginBottom: 8 }}>No programs found</h3>
          <p style={{ color: 'var(--c-text-3)', marginBottom: 'var(--sp-5)' }}>Try adjusting your search or filters.</p>
          <button onClick={() => { setSearchText(''); setDegreeFilter('All'); setFieldFilter('All Fields'); }} className="btn btn-outline btn-sm">
            Clear filters
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 'var(--sp-4)' }}>
          {filtered.map((p, i) => (
            <div key={p.id} className="card" style={{ padding: 'var(--sp-5)', transition: 'all var(--t-base) var(--ease)' }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = 'var(--shadow-md)'; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.borderColor = 'var(--c-forest-light)'; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = ''; e.currentTarget.style.transform = ''; e.currentTarget.style.borderColor = 'var(--c-border)'; }}>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--sp-2)', gap: 8 }}>
                <h3 style={{ fontWeight: 600, color: 'var(--c-text)', fontSize: '0.9875rem', lineHeight: 1.35, flex: 1 }}>{p.name || `${p.degree_level || ''} in ${p.field || 'Program'}`}</h3>
                {p.degree_level && (
                  <span className="badge badge-green" style={{ flexShrink: 0, fontSize: '0.7rem' }}>{p.degree_level}</span>
                )}
              </div>

              {p.universities?.name && (
                <Link to={`/universities/${p.university_id}`} style={{ fontSize: '0.875rem', color: 'var(--c-forest)', fontWeight: 500, textDecoration: 'none', display: 'block', marginBottom: 'var(--sp-3)' }}
                  onMouseEnter={e => e.currentTarget.style.textDecoration = 'underline'}
                  onMouseLeave={e => e.currentTarget.style.textDecoration = 'none'}>
                  {p.universities.name}
                </Link>
              )}

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: p.description ? 'var(--sp-3)' : 0 }}>
                {p.field && <span className="badge badge-neutral">{p.field}</span>}
                {p.duration_years && <span className="badge badge-neutral">{p.duration_years} yr{p.duration_years !== 1 ? 's' : ''}</span>}
                {p.tuition_fee && (
                  <span className="badge badge-gold">${Number(p.tuition_fee).toLocaleString()}/yr</span>
                )}
              </div>

              {p.description && (
                <p style={{ fontSize: '0.8375rem', color: 'var(--c-text-3)', lineHeight: 1.6, marginTop: 'var(--sp-3)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {p.description}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
