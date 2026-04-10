import React, { useState, useEffect } from 'react';
import { profileAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const DEGREE_OPTIONS = ['Undergraduate', 'Postgraduate', 'PhD', 'Diploma', 'Short Course'];
const FIELD_OPTIONS = ['Computer Science', 'Business & Management', 'Engineering', 'Medicine & Health', 'Law', 'Arts & Humanities', 'Social Sciences', 'Natural Sciences', 'Education', 'Architecture', 'Economics'];
const BUDGET_OPTIONS = ['Under $5,000', '$5,000 – $15,000', '$15,000 – $30,000', '$30,000 – $50,000', 'Over $50,000'];
const LANG_TESTS = ['IELTS', 'TOEFL', 'PTE', 'Duolingo English Test', 'Cambridge English', 'None / Not yet taken'];

const PROFILE_FIELDS = [
  { key: 'full_name', label: 'Full name' },
  { key: 'preferred_country', label: 'Preferred country' },
  { key: 'degree_level', label: 'Degree level' },
  { key: 'field_of_study', label: 'Field of study' },
  { key: 'budget_range', label: 'Budget range' },
  { key: 'language_test', label: 'Language test' },
];

function SaveIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/>
    </svg>
  );
}

function Chip({ label, selected, onClick }) {
  return (
    <button type="button" onClick={onClick} style={{
      padding: '7px 16px', borderRadius: 'var(--r-full)',
      border: `1.5px solid ${selected ? 'var(--c-forest)' : 'var(--c-border)'}`,
      background: selected ? 'var(--c-forest-pale)' : 'var(--c-surface)',
      color: selected ? 'var(--c-forest)' : 'var(--c-text-2)',
      fontSize: '0.875rem', fontWeight: selected ? 600 : 400,
      cursor: 'pointer', transition: 'all var(--t-fast)',
    }}
      onMouseEnter={e => { if (!selected) { e.currentTarget.style.borderColor = 'var(--c-forest)'; e.currentTarget.style.background = 'var(--c-forest-pale)'; } }}
      onMouseLeave={e => { if (!selected) { e.currentTarget.style.borderColor = 'var(--c-border)'; e.currentTarget.style.background = 'var(--c-surface)'; } }}
    >
      {label}
    </button>
  );
}

export default function Profile() {
  const { user } = useAuth();
  const [form, setForm] = useState({
    full_name: '', preferred_country: '', degree_level: '',
    field_of_study: '', budget_range: '', language_test: '', language_score: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // Completion
  const completionFields = ['full_name', 'preferred_country', 'degree_level', 'field_of_study', 'budget_range', 'language_test'];
  const filled = completionFields.filter(f => form[f]).length;
  const pct = Math.round((filled / completionFields.length) * 100);

  useEffect(() => {
    profileAPI.get()
      .then(r => {
        if (r.data) {
          setForm(f => ({
            ...f,
            full_name: r.data.full_name || '',
            preferred_country: r.data.preferred_country || '',
            degree_level: r.data.degree_level || '',
            field_of_study: r.data.field_of_study || '',
            budget_range: r.data.budget_range || '',
            language_test: r.data.language_test || '',
            language_score: r.data.language_score || '',
          }));
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const set = (k) => (v) => setForm(f => ({ ...f, [k]: v }));
  const setE = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true); setError(''); setSuccess(false);
    try {
      await profileAPI.update(form);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch {
      setError('Failed to save changes. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div style={{ paddingTop: 'var(--sp-8)', maxWidth: 720, margin: '0 auto' }}>
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="skeleton" style={{ height: 80, borderRadius: 'var(--r-lg)', marginBottom: 'var(--sp-4)' }} />
      ))}
    </div>
  );

  return (
    <div style={{ paddingTop: 'var(--sp-8)', paddingBottom: 'var(--sp-16)', maxWidth: 720, margin: '0 auto' }}>

      {/* Header */}
      <div style={{ marginBottom: 'var(--sp-8)' }}>
        <div className="t-label" style={{ color: 'var(--c-sienna)', marginBottom: 8 }}>Your account</div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.75rem, 4vw, 2.25rem)', fontWeight: 700, marginBottom: 10, lineHeight: 1.15 }}>
          My Profile
        </h1>
        <p style={{ color: 'var(--c-text-3)', fontSize: '0.9875rem' }}>
          Complete your profile to get personalised university and program recommendations.
        </p>
      </div>

      {/* Completion card */}
      <div style={{ background: 'var(--c-surface)', border: '1px solid var(--c-border)', borderRadius: 'var(--r-xl)', padding: 'var(--sp-6)', marginBottom: 'var(--sp-6)', boxShadow: 'var(--shadow-sm)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--sp-4)', flexWrap: 'wrap', gap: 8 }}>
          <div>
            <div style={{ fontWeight: 600, marginBottom: 2 }}>Profile completion</div>
            <div style={{ fontSize: '0.875rem', color: 'var(--c-text-3)' }}>
              {filled} of {completionFields.length} fields completed
            </div>
          </div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 700, color: pct === 100 ? 'var(--c-forest)' : 'var(--c-gold)' }}>{pct}%</div>
        </div>
        <div style={{ height: 8, background: 'var(--c-surface-2)', borderRadius: 'var(--r-full)', overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${pct}%`, background: pct === 100 ? 'var(--c-forest)' : 'var(--c-gold)', borderRadius: 'var(--r-full)', transition: 'width 0.6s var(--ease)' }} />
        </div>
        {pct === 100 && (
          <div style={{ marginTop: 'var(--sp-3)', display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.875rem', color: 'var(--c-forest)', fontWeight: 500 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
            Profile complete! You're getting fully personalised recommendations.
          </div>
        )}
      </div>

      {/* Email info */}
      <div style={{ background: 'var(--c-surface-2)', border: '1px solid var(--c-border)', borderRadius: 'var(--r-lg)', padding: 'var(--sp-4) var(--sp-5)', marginBottom: 'var(--sp-5)', display: 'flex', alignItems: 'center', gap: 'var(--sp-3)' }}>
        <div style={{ width: 42, height: 42, borderRadius: '50%', background: 'var(--c-forest)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.875rem', fontWeight: 700, flexShrink: 0 }}>
          {(form.full_name || user?.email || 'U').split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
        </div>
        <div>
          <div style={{ fontWeight: 500, fontSize: '0.9375rem' }}>{form.full_name || 'No name set'}</div>
          <div style={{ fontSize: '0.8125rem', color: 'var(--c-text-3)' }}>{user?.email}</div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-6)' }}>

        {/* Basic info */}
        <div style={{ background: 'var(--c-surface)', border: '1px solid var(--c-border)', borderRadius: 'var(--r-xl)', padding: 'var(--sp-6)' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '1.0625rem', marginBottom: 'var(--sp-5)', paddingBottom: 'var(--sp-4)', borderBottom: '1px solid var(--c-border)' }}>Basic Information</h2>
          <div className="input-group">
            <label className="input-label">Full name</label>
            <input className="input" type="text" value={form.full_name} onChange={setE('full_name')} placeholder="Your full name" />
          </div>
        </div>

        {/* Academic preferences */}
        <div style={{ background: 'var(--c-surface)', border: '1px solid var(--c-border)', borderRadius: 'var(--r-xl)', padding: 'var(--sp-6)' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '1.0625rem', marginBottom: 'var(--sp-5)', paddingBottom: 'var(--sp-4)', borderBottom: '1px solid var(--c-border)' }}>Academic Preferences</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-6)' }}>

            <div>
              <label className="input-label" style={{ display: 'block', marginBottom: 'var(--sp-3)' }}>Degree level</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {DEGREE_OPTIONS.map(d => (
                  <Chip key={d} label={d} selected={form.degree_level === d} onClick={() => set('degree_level')(form.degree_level === d ? '' : d)} />
                ))}
              </div>
            </div>

            <div>
              <label className="input-label" style={{ display: 'block', marginBottom: 'var(--sp-3)' }}>Field of study</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {FIELD_OPTIONS.map(f => (
                  <Chip key={f} label={f} selected={form.field_of_study === f} onClick={() => set('field_of_study')(form.field_of_study === f ? '' : f)} />
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* Location & budget */}
        <div style={{ background: 'var(--c-surface)', border: '1px solid var(--c-border)', borderRadius: 'var(--r-xl)', padding: 'var(--sp-6)' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '1.0625rem', marginBottom: 'var(--sp-5)', paddingBottom: 'var(--sp-4)', borderBottom: '1px solid var(--c-border)' }}>Location & Budget</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-5)' }}>
            <div className="input-group">
              <label className="input-label">Preferred country / region</label>
              <input className="input" type="text" value={form.preferred_country} onChange={setE('preferred_country')} placeholder="e.g. United Kingdom, Europe, Canada" />
            </div>
            <div>
              <label className="input-label" style={{ display: 'block', marginBottom: 'var(--sp-3)' }}>Annual tuition budget</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {BUDGET_OPTIONS.map(b => (
                  <Chip key={b} label={b} selected={form.budget_range === b} onClick={() => set('budget_range')(form.budget_range === b ? '' : b)} />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Language */}
        <div style={{ background: 'var(--c-surface)', border: '1px solid var(--c-border)', borderRadius: 'var(--r-xl)', padding: 'var(--sp-6)' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '1.0625rem', marginBottom: 'var(--sp-5)', paddingBottom: 'var(--sp-4)', borderBottom: '1px solid var(--c-border)' }}>Language Proficiency</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-5)' }}>
            <div>
              <label className="input-label" style={{ display: 'block', marginBottom: 'var(--sp-3)' }}>English test taken</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {LANG_TESTS.map(t => (
                  <Chip key={t} label={t} selected={form.language_test === t} onClick={() => set('language_test')(form.language_test === t ? '' : t)} />
                ))}
              </div>
            </div>
            {form.language_test && form.language_test !== 'None / Not yet taken' && (
              <div className="input-group" style={{ maxWidth: 200 }}>
                <label className="input-label">{form.language_test} score</label>
                <input className="input" type="number" step="0.5" value={form.language_score} onChange={setE('language_score')} placeholder="e.g. 7.0" />
              </div>
            )}
          </div>
        </div>

        {/* Alerts */}
        {error && <div className="alert alert-error">{error}</div>}
        {success && (
          <div className="alert alert-success">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
            Profile saved successfully.
          </div>
        )}

        {/* Save button */}
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button type="submit" className="btn btn-primary" disabled={saving} style={{ minWidth: 160 }}>
            <SaveIcon />
            {saving ? 'Saving…' : 'Save Profile'}
          </button>
        </div>
      </form>
    </div>
  );
}
