'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, Settings, LogIn, LogOut, User } from 'lucide-react';

export default function Header({ onOpenSettings, hasCustomKeys }) {
  const [session, setSession] = useState(null); // null = loading, { connected } object after

  useEffect(() => {
    fetch('/api/auth/session')
      .then((r) => r.json())
      .then(setSession)
      .catch(() => setSession({ connected: false }));
  }, []);

  const handleConnect = () => {
    window.location.href = '/api/auth/google';
  };

  const handleDisconnect = async () => {
    await fetch('/api/auth/session', { method: 'DELETE' });
    setSession({ connected: false });
  };

  return (
    <header className="glass-panel" style={{ padding: '16px 24px', marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <div style={{
          width: '42px',
          height: '42px',
          borderRadius: '10px',
          background: 'var(--accent-yt-gradient)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 16px rgba(255, 43, 67, 0.4)'
        }}>
          {/* Custom YouTube Play SVG */}
          <svg width="22" height="22" viewBox="0 0 24 24" fill="#ffffff">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
          </svg>
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h1 style={{ fontSize: '1.4rem', fontWeight: 800, letterSpacing: '-0.5px' }}>
              Studio<span style={{ color: 'var(--accent-yt)' }}>AI</span>
            </h1>
            <span className="badge badge-red" style={{ fontSize: '0.65rem' }}>FREE PRO</span>
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            AI-Powered YouTube SEO, Competitor Radar & Growth Studio
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', background: 'rgba(255,255,255,0.04)', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
          <Sparkles size={14} color="#34d399" />
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            AI Engine: <strong style={{ color: '#34d399' }}>Active</strong>
          </span>
        </div>

        {/* YouTube Channel Connect Button */}
        {session === null ? null : session.connected ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {session.user?.picture && (
              <img
                src={session.user.picture}
                alt="avatar"
                style={{ width: '28px', height: '28px', borderRadius: '50%', border: '2px solid #10b981' }}
              />
            )}
            <span style={{ fontSize: '0.8rem', color: '#10b981', fontWeight: 600 }}>
              {session.user?.name || 'Connected'}
            </span>
            <button
              onClick={handleDisconnect}
              className="btn-secondary"
              title="Disconnect YouTube channel"
              style={{ padding: '6px 10px' }}
            >
              <LogOut size={14} />
              <span>Disconnect</span>
            </button>
          </div>
        ) : (
          <button
            onClick={handleConnect}
            className="btn-primary"
            title="Connect your YouTube channel for private analytics"
            style={{
              background: 'linear-gradient(135deg, #ff2b43, #ff6b35)',
              boxShadow: '0 4px 16px rgba(255,43,67,0.35)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              borderRadius: '8px',
              border: 'none',
              color: '#fff',
              fontWeight: 600,
              fontSize: '0.85rem',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            <LogIn size={15} />
            <span>Connect YouTube</span>
          </button>
        )}

        <button
          onClick={onOpenSettings}
          className="btn-secondary"
          style={{ position: 'relative' }}
          title="Configure API Keys & Settings"
        >
          <Settings size={16} />
          <span>Settings</span>
          {hasCustomKeys && (
            <span style={{
              position: 'absolute',
              top: '-4px',
              right: '-4px',
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: '#10b981',
              boxShadow: '0 0 8px #10b981'
            }} />
          )}
        </button>
      </div>
    </header>
  );
}
