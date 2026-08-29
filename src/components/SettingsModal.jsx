'use client';

import React, { useState, useEffect } from 'react';
import { X, Key, ShieldCheck, ExternalLink, Save, Check } from 'lucide-react';

export default function SettingsModal({ isOpen, onClose, onSave, currentKeys }) {
  const [geminiKey, setGeminiKey] = useState('');
  const [youtubeKey, setYoutubeKey] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (currentKeys) {
      setGeminiKey(currentKeys.geminiKey || '');
      setYoutubeKey(currentKeys.youtubeKey || '');
    }
  }, [currentKeys, isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave({ geminiKey, youtubeKey });
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 1200);
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px'
    }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '520px', padding: '28px', position: 'relative', boxShadow: '0 20px 60px rgba(0,0,0,0.8)' }}>
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'transparent',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer'
          }}
        >
          <X size={20} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(255, 43, 67, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Key size={18} color="var(--accent-yt)" />
          </div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>
            API Keys & Settings
          </h2>
        </div>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '22px' }}>
          Keys are stored safely in your local browser only. The app works automatically even without custom keys using built-in intelligence.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Gemini API Key */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>
                Google Gemini API Key (For Custom AI Generation):
              </label>
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                Get Free Key <ExternalLink size={11} />
              </a>
            </div>
            <input
              type="password"
              className="input-glass"
              placeholder="AIzaSy..."
              value={geminiKey}
              onChange={(e) => setGeminiKey(e.target.value)}
            />
          </div>

          {/* YouTube Data API Key */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>
                YouTube Data API v3 Key (Optional for unlimited stats):
              </label>
              <a
                href="https://console.cloud.google.com/apis/credentials"
                target="_blank"
                rel="noreferrer"
                style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                Get Google Key <ExternalLink size={11} />
              </a>
            </div>
            <input
              type="password"
              className="input-glass"
              placeholder="AIzaSy..."
              value={youtubeKey}
              onChange={(e) => setYoutubeKey(e.target.value)}
            />
          </div>
        </div>

        <div style={{ marginTop: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            <ShieldCheck size={14} color="#10b981" />
            <span>Encrypted in local storage</span>
          </div>

          <button onClick={handleSave} className="btn-primary" style={{ padding: '8px 20px', background: saved ? 'var(--accent-green)' : 'var(--accent-yt-gradient)' }}>
            {saved ? <Check size={16} /> : <Save size={16} />}
            {saved ? 'Saved!' : 'Save Settings'}
          </button>
        </div>
      </div>
    </div>
  );
}
