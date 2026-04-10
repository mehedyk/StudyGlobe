import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { countriesAPI } from '../services/api';

const SearchIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);

const REGION_FLAGS = {
  'Europe': '🌍',
  'North America': '🌎',
  'Asia': '🌏',
  'Oceania': '🌏',
  'Middle East': '🌍',
  'Africa': '🌍',
  'South America': '🌎',
};

function CardSkeleton() {
  return (
    <div className="card" style={{ padding: 'var(--sp-6)' }}>
      <div className="skeleton" style={{ width: 56, height: 56, borderRadius: 'var(--r-md)', marginBottom: 'var(--sp-4)' }} />
      <div className="skeleton" style={{ height: 20, width: '60%', marginBottom: 8 }} />
      <div className="skeleton" style={{ height: 14, width: '80%', marginBottom: 6 }} />
      <div className="skeleton" style={{ height: 14, width: '50%', marginBottom: 'var(--sp-4)' }} />
      <div className="skeleton" style={{ height: 32, width: 100, borderRadius: 'var(--r-full)' }} />
    </div>
  );
}

export default function Countries() {
  const [allCountries, setAllCountries] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    countriesAPI.getAll()
      .then(r => setAllCountries(r.data))
      .catch(() => setError('Failed to load destinations. Please try again.'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = allCountries.filter(c =>
    c.name?.toLowerCase().includes(searchText.toLowerCase().trim())
  );

  const handleClear = () => { setSearchText(''); inputRef.current?.focus(); };

  return (
    <div style={{ paddingTop: 'var(--sp-8)', paddingBottom: 'var(--sp-16)' }}>

      {/* Page header */}
      <div style={{ marginBottom: 'var(--sp-8)' }}>
        <div className="t-label" style={{ color: 'var(--c-sienna)', marginBottom: 8 }}>Where will you study?</div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 4vw, 2.75rem)', fontWeight: 700, marginBottom: 12, lineHeight: 1.15 }}>
          Study Destinations
        </h1>
        <p style={{ color: 'var(--c-text-3)', fontSize: '1.0625rem', maxWidth: 520 }}>
          Browse 190+ countries. Each destination includes visa info, cost of living, and top universities.
        </p>
      </div>

      {/* Search bar */}
      <div style={{
        background: 'var(--c-surface)', border: '1px solid var(--c-border)',
        borderRadius: 'var(--r-lg)', padding: 'var(--sp-4)',
        marginBottom: 'var(--sp-4)', boxShadow: 'var(--shadow-sm)',
      }}>
        <div style={{ position: 'relative' }}>
          <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--c-text-3)', pointerEvents: 'none', display: 'flex' }}>
            <SearchIcon />
          </span>
          <input
            ref={inputRef}
            className="input"
            type="text"
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
            placeholder="Search by country name…"
            style={{ paddingLeft: 44, paddingRight: searchText ? 44 : 14 }}
          />
          {searchText && (
            <button onClick={handleClear} style={{
              position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
              background: 'none', border: 'none', cursor: 'pointer', color: 'var(--c-text-3)',
              fontSize: '1.2rem', lineHeight: 1, padding: 4,
            }}>×</button>
          )}
        </div>
      </div>

      {/* Result count */}
      {!error && !loading && (
        <div style={{ fontSize: '0.875rem', color: 'var(--c-text-3)', marginBottom: 'var(--sp-6)' }}>
          {searchText.trim()
            ? <><strong style={{ color: 'var(--c-text)' }}>{filtered.length}</strong> result{filtered.length !== 1 ? 's' : ''} for "<span style={{ color: 'var(--c-forest)' }}>{searchText.trim()}</span>"</>
            : <><strong style={{ color: 'var(--c-text)' }}>{allCountries.length}</strong> destinations available</>
          }
        </div>
      )}

      {error && <div className="alert alert-error" style={{ marginBottom: 'var(--sp-6)' }}>{error}</div>}

      {/* Grid */}
      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 'var(--sp-5)' }}>
          {Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)}
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 'var(--sp-20) 0' }}>
          <div style={{ fontSize: '3.5rem', marginBottom: 'var(--sp-5)' }}>🌐</div>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 600, marginBottom: 8 }}>No countries found</h3>
          <p style={{ color: 'var(--c-text-3)', marginBottom: 'var(--sp-5)' }}>
            {searchText ? `No results for "${searchText}"` : 'No countries available at the moment.'}
          </p>
          {searchText && (
            <button onClick={handleClear} className="btn btn-outline btn-sm">Clear search</button>
          )}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 'var(--sp-5)' }}>
          {filtered.map((country, i) => (
            <Link
              key={country.id}
              to={`/universities?country_id=${country.id}`}
              className="card"
              style={{
                padding: 'var(--sp-6)',
                textDecoration: 'none',
                display: 'block',
                animationDelay: `${i * 40}ms`,
                transition: 'all var(--t-base) var(--ease)',
              }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = 'var(--shadow-lg)'; e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.borderColor = 'var(--c-forest-light)'; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = ''; e.currentTarget.style.transform = ''; e.currentTarget.style.borderColor = 'var(--c-border)'; }}
            >
              {/* Flag area */}
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--sp-5)',
              }}>
                <div style={{
                  width: 52, height: 52, borderRadius: 'var(--r-md)',
                  background: 'var(--c-forest-pale)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.75rem',
                }}>
                  {REGION_FLAGS[country.region] || '🌍'}
                </div>
                {country.code && (
                  <span style={{
                    fontSize: '0.72rem', fontWeight: 700, color: 'var(--c-text-3)',
                    letterSpacing: '0.1em', textTransform: 'uppercase',
                    padding: '3px 8px', borderRadius: 'var(--r-full)', background: 'var(--c-surface-2)',
                  }}>{country.code}</span>
                )}
              </div>

              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1875rem', fontWeight: 600, marginBottom: 6, color: 'var(--c-text)' }}>
                {country.name}
              </h3>

              {country.description && (
                <p style={{
                  fontSize: '0.875rem', color: 'var(--c-text-3)', lineHeight: 1.6,
                  marginBottom: 'var(--sp-5)',
                  display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
                }}>
                  {country.description}
                </p>
              )}

              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.875rem', fontWeight: 500, color: 'var(--c-forest)', marginTop: country.description ? 0 : 'var(--sp-4)' }}>
                View Universities
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                </svg>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
