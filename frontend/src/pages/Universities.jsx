import React, { useState, useEffect, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { universitiesAPI, countriesAPI } from '../services/api';

const SearchIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);
const FilterIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="11" y1="18" x2="13" y2="18"/>
  </svg>
);
const ArrowRight = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
  </svg>
);
const LocationPin = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
  </svg>
);

function UniCardSkeleton() {
  return (
    <div className="card" style={{ padding: 'var(--sp-5)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--sp-3)' }}>
        <div className="skeleton" style={{ height: 22, width: '55%' }} />
        <div className="skeleton" style={{ height: 22, width: 60, borderRadius: 'var(--r-full)' }} />
      </div>
      <div className="skeleton" style={{ height: 16, width: '35%', marginBottom: 6 }} />
      <div className="skeleton" style={{ height: 14, width: '40%', marginBottom: 'var(--sp-4)' }} />
      <div className="skeleton" style={{ height: 38, borderRadius: 'var(--r-md)' }} />
    </div>
  );
}

export default function Universities() {
  const [universities, setUniversities] = useState([]);
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchParams] = useSearchParams();
  const [searchText, setSearchText] = useState('');
  const [appliedSearch, setAppliedSearch] = useState('');
  const [countryFilter, setCountryFilter] = useState(searchParams.get('country_id') || '');
  const [typeFilter, setTypeFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const inputRef = useRef(null);

  const fetchUniversities = async (search, cid, type) => {
    setLoading(true); setError('');
    try {
      const params = {};
      if (search?.trim()) params.search = search.trim();
      if (cid) params.country_id = cid;
      if (type) params.type = type;
      const res = await universitiesAPI.getAll(params);
      setUniversities(res.data);
    } catch {
      setError('Failed to load universities. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    countriesAPI.getAll().then(r => setCountries(r.data)).catch(() => {});
    fetchUniversities('', searchParams.get('country_id') || '', '');
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    setAppliedSearch(searchText);
    fetchUniversities(searchText, countryFilter, typeFilter);
  };

  const handleFilter = () => {
    setAppliedSearch(searchText);
    fetchUniversities(searchText, countryFilter, typeFilter);
  };

  const handleClear = () => {
    setSearchText(''); setAppliedSearch(''); setCountryFilter(''); setTypeFilter('');
    fetchUniversities('', '', '');
    inputRef.current?.focus();
  };

  const activeFilters = [countryFilter, typeFilter].filter(Boolean).length;

  return (
    <div style={{ paddingTop: 'var(--sp-8)', paddingBottom: 'var(--sp-16)' }}>

      {/* Page header */}
      <div style={{ marginBottom: 'var(--sp-8)' }}>
        <div className="t-label" style={{ color: 'var(--c-sienna)', marginBottom: 8 }}>Find your institution</div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 4vw, 2.75rem)', fontWeight: 700, marginBottom: 12, lineHeight: 1.15 }}>
          Universities
        </h1>
        <p style={{ color: 'var(--c-text-3)', fontSize: '1.0625rem', maxWidth: 480 }}>
          Search 12,000+ universities. Filter by country, type, and tuition to find your match.
        </p>
      </div>

      {/* Search + filter bar */}
      <div style={{
        background: 'var(--c-surface)', border: '1px solid var(--c-border)',
        borderRadius: 'var(--r-lg)', padding: 'var(--sp-4)',
        marginBottom: 'var(--sp-3)', boxShadow: 'var(--shadow-sm)',
      }}>
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: 'var(--sp-3)', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: '1 1 280px', minWidth: 200 }}>
            <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--c-text-3)', pointerEvents: 'none', display: 'flex' }}>
              <SearchIcon />
            </span>
            <input ref={inputRef} className="input" type="text" value={searchText} onChange={e => setSearchText(e.target.value)} placeholder="Search by university name…" style={{ paddingLeft: 44, paddingRight: searchText ? 44 : 14 }} />
            {searchText && (
              <button type="button" onClick={() => { setSearchText(''); }} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--c-text-3)', fontSize: '1.2rem', lineHeight: 1, padding: 4 }}>×</button>
            )}
          </div>
          <button type="button" onClick={() => setShowFilters(v => !v)} className="btn btn-outline btn-sm" style={{ gap: 6, position: 'relative' }}>
            <FilterIcon /> Filters
            {activeFilters > 0 && (
              <span style={{ position: 'absolute', top: -5, right: -5, width: 16, height: 16, borderRadius: '50%', background: 'var(--c-sienna)', color: 'white', fontSize: '0.625rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{activeFilters}</span>
            )}
          </button>
          <button type="submit" className="btn btn-primary btn-sm">Search</button>
        </form>

        {/* Expandable filters */}
        {showFilters && (
          <div style={{ borderTop: '1px solid var(--c-border)', marginTop: 'var(--sp-4)', paddingTop: 'var(--sp-4)', display: 'flex', flexWrap: 'wrap', gap: 'var(--sp-4)', alignItems: 'flex-end' }}>
            <div className="input-group" style={{ flex: '1 1 200px', minWidth: 180 }}>
              <label className="input-label">Country</label>
              <select className="input" value={countryFilter} onChange={e => setCountryFilter(e.target.value)} style={{ cursor: 'pointer' }}>
                <option value="">All countries</option>
                {countries.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div className="input-group" style={{ flex: '1 1 160px', minWidth: 140 }}>
              <label className="input-label">Type</label>
              <select className="input" value={typeFilter} onChange={e => setTypeFilter(e.target.value)} style={{ cursor: 'pointer' }}>
                <option value="">All types</option>
                <option value="public">Public</option>
                <option value="private">Private</option>
              </select>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={handleFilter} className="btn btn-primary btn-sm">Apply</button>
              <button onClick={handleClear} className="btn btn-ghost btn-sm" style={{ color: 'var(--c-text-3)' }}>Clear all</button>
            </div>
          </div>
        )}
      </div>

      {/* Result count */}
      {!loading && !error && (
        <div style={{ fontSize: '0.875rem', color: 'var(--c-text-3)', marginBottom: 'var(--sp-5)' }}>
          {appliedSearch
            ? <><strong style={{ color: 'var(--c-text)' }}>{universities.length}</strong> result{universities.length !== 1 ? 's' : ''} for "<span style={{ color: 'var(--c-forest)' }}>{appliedSearch}</span>"</>
            : <><strong style={{ color: 'var(--c-text)' }}>{universities.length}</strong> universit{universities.length !== 1 ? 'ies' : 'y'} found</>
          }
        </div>
      )}

      {error && <div className="alert alert-error" style={{ marginBottom: 'var(--sp-5)' }}>{error}</div>}

      {/* Grid */}
      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 'var(--sp-4)' }}>
          {Array.from({ length: 6 }).map((_, i) => <UniCardSkeleton key={i} />)}
        </div>
      ) : universities.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 'var(--sp-20) 0' }}>
          <div style={{ fontSize: '3.5rem', marginBottom: 'var(--sp-4)' }}>🎓</div>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 600, marginBottom: 8 }}>No universities found</h3>
          <p style={{ color: 'var(--c-text-3)', marginBottom: 'var(--sp-5)' }}>Try adjusting your search or filters.</p>
          <button onClick={handleClear} className="btn btn-outline btn-sm">Clear all filters</button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 'var(--sp-4)' }}>
          {universities.map((uni, i) => (
            <Link
              key={uni.id}
              to={`/universities/${uni.id}`}
              className="card"
              style={{
                padding: 'var(--sp-5)',
                textDecoration: 'none',
                display: 'block',
                transition: 'all var(--t-base) var(--ease)',
              }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = 'var(--shadow-lg)'; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.borderColor = 'var(--c-forest-light)'; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = ''; e.currentTarget.style.transform = ''; e.currentTarget.style.borderColor = 'var(--c-border)'; }}
            >
              {/* Header row */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--sp-3)', gap: 8 }}>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.0625rem', fontWeight: 600, color: 'var(--c-text)', lineHeight: 1.3, flex: 1 }}>{uni.Name || uni.name}</h3>
                {uni.type && (
                  <span className={`badge ${uni.type === 'public' ? 'badge-green' : 'badge-sienna'}`} style={{ flexShrink: 0, textTransform: 'capitalize', fontSize: '0.7rem' }}>{uni.type}</span>
                )}
              </div>

              {/* Location */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 'var(--sp-2)' }}>
                <span style={{ color: 'var(--c-text-3)', display: 'flex' }}><LocationPin /></span>
                <span style={{ fontSize: '0.875rem', color: 'var(--c-forest)', fontWeight: 500 }}>{uni.countries?.name}</span>
                {uni.city && <span style={{ fontSize: '0.875rem', color: 'var(--c-text-3)' }}>· {uni.city}</span>}
              </div>

              {/* Tuition / Ranking */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 'var(--sp-4)', marginTop: 'var(--sp-3)' }}>
                {uni.ranking && (
                  <span className="badge badge-gold">#{uni.ranking} Ranked</span>
                )}
                {(uni.tuition_min || uni.tuition_max) && (
                  <span className="badge badge-neutral">
                    {uni.tuition_min && uni.tuition_max
                      ? `$${Number(uni.tuition_min).toLocaleString()} – $${Number(uni.tuition_max).toLocaleString()}`
                      : uni.tuition_min
                        ? `From $${Number(uni.tuition_min).toLocaleString()}`
                        : `Up to $${Number(uni.tuition_max).toLocaleString()}`}
                  </span>
                )}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.875rem', fontWeight: 500, color: 'var(--c-forest)', borderTop: '1px solid var(--c-border)', paddingTop: 'var(--sp-3)' }}>
                View details <ArrowRight />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
