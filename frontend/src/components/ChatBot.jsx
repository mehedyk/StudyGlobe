import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const BotIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    <line x1="12" y1="3" x2="12" y2="5"/>
    <line x1="8" y1="16" x2="8" y2="16"/>
    <line x1="16" y1="16" x2="16" y2="16"/>
  </svg>
);
const CloseIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);
const SendIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
  </svg>
);

const SUGGESTIONS = [
  'What countries are best for studying engineering?',
  'How do I apply for a student visa?',
  'What IELTS score do I need for UK universities?',
  'Tell me about scholarships for international students',
];

export default function ChatBot() {
  const { isAuthenticated } = useAuth();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hi! I\'m your StudyGlobe advisor. Ask me anything about studying abroad — universities, visas, scholarships, or application tips.' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [hasNew, setHasNew] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => { if (open) { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); inputRef.current?.focus(); setHasNew(false); } }, [open, messages]);

  if (!isAuthenticated) return null;

  const send = async (text) => {
    const msg = text || input.trim();
    if (!msg || loading) return;
    setInput('');
    setMessages(m => [...m, { role: 'user', content: msg }]);
    setLoading(true);
    try {
      const res = await api.post('/chat', { message: msg });
      const reply = res.data?.reply || 'Sorry, I couldn\'t process that. Please try again.';
      setMessages(m => [...m, { role: 'assistant', content: reply }]);
      if (!open) setHasNew(true);
    } catch {
      setMessages(m => [...m, { role: 'assistant', content: 'I\'m having trouble connecting right now. Please try again in a moment.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(v => !v)}
        style={{
          position: 'fixed', bottom: 28, right: 28, zIndex: 1000,
          width: 52, height: 52, borderRadius: '50%',
          background: 'var(--c-forest)', color: 'white', border: 'none',
          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 16px rgba(26,61,43,0.4)',
          transition: 'all var(--t-base) var(--ease)',
        }}
        onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.08)'; e.currentTarget.style.boxShadow = '0 6px 24px rgba(26,61,43,0.5)'; }}
        onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 4px 16px rgba(26,61,43,0.4)'; }}
      >
        {open ? <CloseIcon /> : <BotIcon />}
        {!open && hasNew && (
          <span style={{ position: 'absolute', top: 0, right: 0, width: 12, height: 12, borderRadius: '50%', background: 'var(--c-sienna)', border: '2px solid var(--c-bg)' }} />
        )}
      </button>

      {/* Chat panel */}
      {open && (
        <div style={{
          position: 'fixed', bottom: 92, right: 28, zIndex: 999,
          width: 'clamp(300px, 90vw, 380px)',
          maxHeight: '65vh',
          background: 'var(--c-surface)',
          border: '1px solid var(--c-border)',
          borderRadius: 'var(--r-xl)',
          boxShadow: 'var(--shadow-xl)',
          display: 'flex', flexDirection: 'column',
          overflow: 'hidden',
          animation: 'fadeUp 0.2s ease both',
        }}>
          {/* Header */}
          <div style={{ padding: 'var(--sp-4) var(--sp-5)', borderBottom: '1px solid var(--c-border)', background: 'var(--c-forest)', display: 'flex', alignItems: 'center', gap: 'var(--sp-3)' }}>
            <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <BotIcon />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: '0.9375rem', color: 'white' }}>Study Advisor</div>
              <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.65)', display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#4ADE80', display: 'inline-block' }} />
                AI-powered
              </div>
            </div>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: 'var(--sp-4)', display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)' }}>
            {messages.map((m, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
                <div style={{
                  maxWidth: '82%', padding: 'var(--sp-3) var(--sp-4)',
                  borderRadius: m.role === 'user' ? '16px 16px 4px 16px' : '4px 16px 16px 16px',
                  background: m.role === 'user' ? 'var(--c-forest)' : 'var(--c-surface-2)',
                  color: m.role === 'user' ? 'white' : 'var(--c-text)',
                  fontSize: '0.875rem', lineHeight: 1.6,
                }}>
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <div style={{ padding: 'var(--sp-3) var(--sp-4)', borderRadius: '4px 16px 16px 16px', background: 'var(--c-surface-2)', display: 'flex', gap: 4, alignItems: 'center' }}>
                  {[0, 1, 2].map(i => (
                    <div key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--c-text-3)', animation: `bounce 1s ${i * 0.15}s infinite ease-in-out` }} />
                  ))}
                </div>
              </div>
            )}
            {/* Suggestions */}
            {messages.length === 1 && !loading && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 4 }}>
                {SUGGESTIONS.map(s => (
                  <button key={s} onClick={() => send(s)} style={{
                    textAlign: 'left', padding: 'var(--sp-2) var(--sp-3)',
                    background: 'transparent', border: '1px solid var(--c-border)',
                    borderRadius: 'var(--r-md)', cursor: 'pointer', fontSize: '0.8125rem',
                    color: 'var(--c-text-2)', transition: 'all var(--t-fast)',
                  }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--c-forest)'; e.currentTarget.style.background = 'var(--c-forest-pale)'; e.currentTarget.style.color = 'var(--c-forest)'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--c-border)'; e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--c-text-2)'; }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div style={{ padding: 'var(--sp-3) var(--sp-4)', borderTop: '1px solid var(--c-border)', display: 'flex', gap: 'var(--sp-2)' }}>
            <input
              ref={inputRef}
              className="input"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
              placeholder="Ask anything…"
              style={{ flex: 1, fontSize: '0.875rem', padding: '9px 14px' }}
              disabled={loading}
            />
            <button onClick={() => send()} disabled={!input.trim() || loading} className="btn btn-primary btn-sm" style={{ padding: '9px 14px', flexShrink: 0 }}>
              <SendIcon />
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: scale(0.7); opacity: 0.4; }
          40% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </>
  );
}
