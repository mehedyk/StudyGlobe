import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { universitiesAPI } from '../services/api';

const BackIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
  </svg>
);
const GlobeIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/>
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
  </svg>
);

const TABS = [
  { key: 'overview', label: 'Overview' },
  { key: 'programs', label: 'Programs' },
  { key: 'intake', label: 'Intake' },
  { key: 'language', label: 'Language Req.' },
  { key: 'scholarships', label: 'Scholarships' },
];

function EmptyState({ icon, message }) {
  return (
    <div style={{ textAlign: 'center', padding: 'var(--sp-12) 0' }}>
      <div style={{ fontSize: '2.5rem', marginBottom: 'var(--sp-4)' }}>{icon}</div>
      <p style={{ color: 'var(--c-text-3)' }}>{message}</p>
    </div>
  );
}

function InfoChip({ label, value }) {
  return (
    <div style={{ padding: 'var(--sp-4)', background: 'var(--c-surface-2)', borderRadius: 'var(--r-md)' }}>
      <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--c-text-3)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>{label}</div>
      <div style={{ fontWeight: 500, color: 'var(--c-text)', fontSize: '0.9375rem' }}>{value || '—'}</div>
    </div>
  );
}

export default function UniversityDetails() {
  const { id } = useParams();
  const [university, setUniversity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    universitiesAPI.getById(id)
      .then(r => setUniversity(r.data))
      .catch(() => setError('University not found or failed to load.'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div style={{ paddingTop: 'var(--sp-8)' }}>
      <div className="skeleton" style={{ height: 16, width: 160, marginBottom: 'var(--sp-8)' }} />
      <div style={{ background: 'var(--c-surface)', border: '1px solid var(--c-border)', borderRadius: 'var(--r-xl)', padding: 'var(--sp-8)', marginBottom: 'var(--sp-6)' }}>
        <div className="skeleton" style={{ height: 32, width: '50%', marginBottom: 12 }} />
        <div className="skeleton" style={{ height: 18, width: '25%', marginBottom: 8 }} />
        <div className="skeleton" style={{ height: 14, width: '30%' }} />
      </div>
    </div>
  );
  if (error) return <div className="alert alert-error" style={{ marginTop: 'var(--sp-8)' }}>{error}</div>;
  if (!university) return null;

  const uniName = university.Name || university.name;
  const website = university.website?.trim();
  const websiteUrl = website ? (website.startsWith('http') ? website : `https://${website}`) : null;

  return (
    <div style={{ paddingTop: 'var(--sp-8)', paddingBottom: 'var(--sp-16)' }}>

      {/* Back link */}
      <Link to="/universities" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: '0.875rem', color: 'var(--c-text-3)', marginBottom: 'var(--sp-6)', textDecoration: 'none', transition: 'color var(--t-fast)' }}
        onMouseEnter={e => e.currentTarget.style.color = 'var(--c-forest)'}
        onMouseLeave={e => e.currentTarget.style.color = 'var(--c-text-3)'}>
        <BackIcon /> Back to Universities
      </Link>

      {/* Hero card */}
      <div style={{ background: 'var(--c-surface)', border: '1px solid var(--c-border)', borderRadius: 'var(--r-xl)', padding: 'clamp(var(--sp-6), 4vw, var(--sp-10))', marginBottom: 'var(--sp-6)', boxShadow: 'var(--shadow-sm)' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: 'var(--sp-5)' }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 'var(--sp-4)', alignItems: 'center' }}>
              {university.countries?.name && (
                <span className="badge badge-green">{university.countries.name}</span>
              )}
              {university.type && (
                <span className={`badge ${university.type === 'public' ? 'badge-neutral' : 'badge-sienna'}`} style={{ textTransform: 'capitalize' }}>{university.type}</span>
              )}
              {university.ranking && (
                <span className="badge badge-gold">#{university.ranking} Ranked</span>
              )}
            </div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.5rem, 4vw, 2.25rem)', fontWeight: 700, lineHeight: 1.15, marginBottom: 'var(--sp-3)' }}>{uniName}</h1>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--sp-4)', alignItems: 'center' }}>
              {university.city && (
                <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.9rem', color: 'var(--c-text-3)' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                  {university.city}
                </span>
              )}
              {websiteUrl && (
                <a href={websiteUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.875rem', color: 'var(--c-forest)', textDecoration: 'none', fontWeight: 500 }}
                  onMouseEnter={e => e.currentTarget.style.textDecoration = 'underline'}
                  onMouseLeave={e => e.currentTarget.style.textDecoration = 'none'}>
                  <GlobeIcon /> Visit website
                </a>
              )}
            </div>
          </div>

          {/* Tuition range */}
          {(university.tuition_min || university.tuition_max) && (
            <div style={{ background: 'var(--c-forest-pale)', border: '1px solid rgba(61,122,87,0.2)', borderRadius: 'var(--r-lg)', padding: 'var(--sp-5)', minWidth: 180, textAlign: 'center' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--c-forest)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>Annual Tuition</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 700, color: 'var(--c-forest)', lineHeight: 1.2 }}>
                {university.tuition_min && university.tuition_max
                  ? `$${Number(university.tuition_min).toLocaleString()} – $${Number(university.tuition_max).toLocaleString()}`
                  : university.tuition_min ? `From $${Number(university.tuition_min).toLocaleString()}`
                    : `Up to $${Number(university.tuition_max).toLocaleString()}`
                }
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs" style={{ marginBottom: 'var(--sp-6)' }}>
        {TABS.map(({ key, label }) => (
          <button key={key} onClick={() => setActiveTab(key)} className={`tab-btn ${activeTab === key ? 'active' : ''}`}>
            {label}
          </button>
        ))}
      </div>

      {/* Tab panels */}
      <div style={{ background: 'var(--c-surface)', border: '1px solid var(--c-border)', borderRadius: 'var(--r-xl)', padding: 'clamp(var(--sp-5), 4vw, var(--sp-8))' }}>

        {/* Overview */}
        {activeTab === 'overview' && (
          <div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 600, marginBottom: 'var(--sp-4)' }}>About</h2>
            <p style={{ color: 'var(--c-text-2)', lineHeight: 1.75, marginBottom: 'var(--sp-6)', fontSize: '0.9875rem' }}>
              {university.description || 'No description available for this university.'}
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 'var(--sp-3)' }}>
              <InfoChip label="Country" value={university.countries?.name} />
              <InfoChip label="City" value={university.city} />
              <InfoChip label="Type" value={university.type ? university.type.charAt(0).toUpperCase() + university.type.slice(1) : null} />
              {university.ranking && <InfoChip label="World Ranking" value={`#${university.ranking}`} />}
            </div>
          </div>
        )}

        {/* Programs */}
        {activeTab === 'programs' && (
          <div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 600, marginBottom: 'var(--sp-5)' }}>Academic Programs</h2>
            {!university.programs?.length ? (
              <EmptyState icon="📚" message="No program information available for this university." />
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)' }}>
                {university.programs.map(p => (
                  <div key={p.id} style={{ border: '1px solid var(--c-border)', borderRadius: 'var(--r-lg)', padding: 'var(--sp-5)', transition: 'border-color var(--t-fast)', background: 'var(--c-bg)' }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--c-forest-light)'}
                    onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--c-border)'}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                      <div>
                        <h3 style={{ fontWeight: 600, marginBottom: 6, color: 'var(--c-text)', fontSize: '0.9875rem' }}>{p.name || `${p.degree} in ${p.field}`}</h3>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                          {p.degree && <span className="badge badge-green">{p.degree}</span>}
                          {p.field && <span className="badge badge-neutral">{p.field}</span>}
                          {p.duration_years && <span className="badge badge-neutral">{p.duration_years} yr{p.duration_years !== 1 ? 's' : ''}</span>}
                        </div>
                      </div>
                      {p.tuition_per_year && (
                        <div style={{ textAlign: 'right', flexShrink: 0 }}>
                          <div style={{ fontSize: '0.75rem', color: 'var(--c-text-3)', marginBottom: 2 }}>Tuition / year</div>
                          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--c-forest)', fontSize: '1rem' }}>
                            ${Number(p.tuition_per_year).toLocaleString()}
                          </div>
                        </div>
                      )}
                    </div>
                    {p.description && <p style={{ fontSize: '0.875rem', color: 'var(--c-text-3)', marginTop: 'var(--sp-3)', lineHeight: 1.6 }}>{p.description}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Intake */}
        {activeTab === 'intake' && (
          <div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 600, marginBottom: 'var(--sp-5)' }}>Intake Schedule</h2>
            {!university.intakes?.length ? (
              <EmptyState icon="📅" message="No intake information available for this university." />
            ) : (
              <div className="table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th>Intake Session</th>
                      <th>Start</th>
                      <th>Application Deadline</th>
                    </tr>
                  </thead>
                  <tbody>
                    {university.intakes.map(intake => (
                      <tr key={intake.id}>
                        <td style={{ fontWeight: 500, color: 'var(--c-text)' }}>{intake.session_name || intake.intake_name}</td>
                        <td>{intake.start_date ? new Date(intake.start_date).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' }) : intake.start_month || '—'}</td>
                        <td>
                          {intake.application_deadline ? (
                            <span className="badge badge-sienna">
                              {new Date(intake.application_deadline).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </span>
                          ) : '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Language requirements */}
        {activeTab === 'language' && (
          <div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 600, marginBottom: 'var(--sp-5)' }}>Language Requirements</h2>
            {!university.language_requirements?.length ? (
              <EmptyState icon="📝" message="No language requirement data available for this university." />
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 'var(--sp-4)' }}>
                {university.language_requirements.map(req => (
                  <div key={req.id} style={{ background: 'var(--c-gold-pale)', border: '1px solid rgba(184,150,62,0.2)', borderRadius: 'var(--r-lg)', padding: 'var(--sp-5)' }}>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.375rem', fontWeight: 700, color: 'var(--c-text)', marginBottom: 6 }}>{req.test_name}</div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                      <span style={{ fontSize: '0.8125rem', color: 'var(--c-text-3)' }}>Minimum score:</span>
                      <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.25rem', color: 'var(--c-gold)' }}>{req.min_score || req.minimum_score}</span>
                    </div>
                    {req.notes && <p style={{ fontSize: '0.8125rem', color: 'var(--c-text-3)', marginTop: 8, lineHeight: 1.5 }}>{req.notes}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Scholarships */}
        {activeTab === 'scholarships' && (
          <div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 600, marginBottom: 'var(--sp-5)' }}>Scholarship Eligibility</h2>
            {!university.scholarship_eligibility?.length ? (
              <EmptyState icon="🎓" message="No scholarship information available for this university." />
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)' }}>
                {university.scholarship_eligibility.map(s => (
                  <div key={s.id} style={{ background: 'var(--c-forest-pale)', border: '1px solid rgba(61,122,87,0.2)', borderRadius: 'var(--r-lg)', padding: 'var(--sp-6)' }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: 'var(--sp-3)', marginBottom: 'var(--sp-3)' }}>
                      <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '1.0625rem', color: 'var(--c-forest)' }}>
                        {s.name || `Scholarship #${s.id}`}
                      </h3>
                      {s.amount && (
                        <div style={{ background: 'var(--c-forest)', color: 'white', padding: '4px 12px', borderRadius: 'var(--r-full)', fontSize: '0.875rem', fontWeight: 600 }}>
                          {s.amount}
                        </div>
                      )}
                    </div>
                    {(s.eligibility_criteria || s.eligibility_basis) && (
                      <p style={{ fontSize: '0.9rem', color: 'var(--c-text-2)', lineHeight: 1.65, marginBottom: 'var(--sp-3)' }}>
                        <strong>Eligibility:</strong> {s.eligibility_criteria || s.eligibility_basis}
                      </p>
                    )}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--sp-3)', marginTop: 'var(--sp-2)' }}>
                      {s.minimum_gpa && (
                        <div style={{ background: 'white', border: '1px solid rgba(61,122,87,0.2)', borderRadius: 'var(--r-md)', padding: '4px 12px' }}>
                          <span style={{ fontSize: '0.8125rem', color: 'var(--c-text-3)' }}>Min. GPA: </span>
                          <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--c-forest)' }}>{s.minimum_gpa}</span>
                        </div>
                      )}
                      {s.deadline && (
                        <div style={{ background: 'white', border: '1px solid rgba(61,122,87,0.2)', borderRadius: 'var(--r-md)', padding: '4px 12px' }}>
                          <span style={{ fontSize: '0.8125rem', color: 'var(--c-text-3)' }}>Deadline: </span>
                          <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>{new Date(s.deadline).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                        </div>
                      )}
                    </div>
                    {s.additional_notes && <p style={{ fontSize: '0.8125rem', color: 'var(--c-text-3)', marginTop: 'var(--sp-3)' }}>{s.additional_notes}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
