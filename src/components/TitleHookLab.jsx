'use client';

import React, { useState } from 'react';
import { Sparkles, Copy, Check, Zap, Target, TrendingUp, HelpCircle, Video } from 'lucide-react';

const NICHES = [
  'Tech & AI',
  'Gaming',
  'Education & How-To',
  'Finance & Crypto',
  'Fitness & Health',
  'Vlog & Lifestyle',
  'Entertainment & Film',
  'Business & Marketing'
];

export default function TitleHookLab({ apiKeys }) {
  const [topic, setTopic] = useState('');
  const [niche, setNiche] = useState('Tech & AI');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [copiedHook, setCopiedHook] = useState(null);

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    setLoading(true);
    try {
      const res = await fetch('/api/generate-seo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic,
          niche,
          type: 'titles',
          geminiKey: apiKeys?.geminiKey || null
        })
      });

      const json = await res.json();
      if (json.success) {
        setResults({
          titles: json.titles || [],
          hooks: json.hooks || []
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleCopyHook = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedHook(index);
    setTimeout(() => setCopiedHook(null), 2000);
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Input Generator Panel */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Sparkles size={20} color="var(--accent-purple)" />
          Viral Title & 3-Second Hook Generator
        </h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '18px' }}>
          Uses YouTube algorithm psychology formulas (Curiosity, Extreme, High Stakes) to maximize your click-through rate (CTR) and initial 30-second retention.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 220px auto', gap: '12px' }}>
          <input
            type="text"
            className="input-glass"
            placeholder="Enter your video topic or core keyword (e.g. LTX Video, Passive Income, Best Camera...)"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleGenerate(); }}
          />

          <select
            className="input-glass"
            value={niche}
            onChange={(e) => setNiche(e.target.value)}
            style={{ cursor: 'pointer' }}
          >
            {NICHES.map((n) => (
              <option key={n} value={n} style={{ background: '#12141a', color: '#fff' }}>
                {n}
              </option>
            ))}
          </select>

          <button onClick={handleGenerate} className="btn-primary btn-glow-purple" disabled={loading}>
            {loading ? 'Analyzing Algorithm...' : 'Generate Viral Titles'}
          </button>
        </div>
      </div>

      {/* Results */}
      {results && (
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '20px' }}>
          {/* Titles List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Target size={18} color="var(--accent-yt)" />
              High-CTR Title Concepts ({results.titles.length})
            </h3>

            {results.titles.map((item, idx) => {
              const charCount = item.title.length;
              const isSweetSpot = charCount >= 40 && charCount <= 70;

              return (
                <div
                  key={idx}
                  className="glass-panel"
                  style={{
                    padding: '16px 20px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                    borderLeft: `4px solid ${item.ctrScore >= 95 ? '#ff2b43' : '#8b5cf6'}`
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '14px' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', flexWrap: 'wrap' }}>
                        <span className="badge badge-purple">{item.formula}</span>
                        <span className="badge badge-green">CTR: {item.ctrScore}%</span>
                        <span style={{ fontSize: '0.75rem', color: isSweetSpot ? '#10b981' : '#f59e0b' }}>
                          {charCount} chars {isSweetSpot ? '(Optimal)' : ''}
                        </span>
                      </div>
                      <p style={{ fontSize: '1.05rem', fontWeight: 600, color: '#ffffff', lineHeight: 1.35 }}>
                        {item.title}
                      </p>
                    </div>

                    <button
                      onClick={() => handleCopy(item.title, idx)}
                      className="btn-secondary"
                      style={{ padding: '6px 12px', fontSize: '0.8rem', background: copiedIndex === idx ? 'var(--accent-green)' : 'rgba(255,255,255,0.05)' }}
                    >
                      {copiedIndex === idx ? <Check size={14} /> : <Copy size={14} />}
                    </button>
                  </div>

                  {item.whyItWorks && (
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: '8px' }}>
                      💡 <strong>Algorithm Insight:</strong> {item.whyItWorks}
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          {/* 3-Second Viral Hooks */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Video size={18} color="var(--accent-cyan)" />
              3-Second Retention Hooks
            </h3>

            {results.hooks?.map((hook, hIdx) => (
              <div key={hIdx} className="glass-panel" style={{ padding: '18px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span className="badge badge-cyan">{hook.type}</span>
                  <button
                    onClick={() => handleCopyHook(hook.verbalHook, hIdx)}
                    className="btn-secondary"
                    style={{ padding: '4px 8px', fontSize: '0.75rem' }}
                  >
                    {copiedHook === hIdx ? <Check size={12} /> : <Copy size={12} />}
                  </button>
                </div>

                <div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
                    🎙️ Verbal Script (What to say):
                  </span>
                  <p style={{ fontSize: '0.9rem', color: '#ffffff', fontStyle: 'italic', marginTop: '4px', lineHeight: 1.4 }}>
                    {hook.verbalHook}
                  </p>
                </div>

                <div style={{ padding: '10px', background: 'rgba(6, 182, 212, 0.08)', borderRadius: '8px', border: '1px solid rgba(6, 182, 212, 0.2)' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--accent-cyan)', textTransform: 'uppercase' }}>
                    🎬 Visual Action (What viewers see):
                  </span>
                  <p style={{ fontSize: '0.85rem', color: '#cbd5e1', marginTop: '3px' }}>
                    {hook.visualHook}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
