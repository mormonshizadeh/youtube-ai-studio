'use client';

import React, { useState } from 'react';
import { FileText, Copy, Check, Sparkles, Image, Hash, ListOrdered, Share2 } from 'lucide-react';

export default function SeoAutoPilot({ apiKeys }) {
  const [topic, setTopic] = useState('');
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [copiedType, setCopiedType] = useState(null);

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    setLoading(true);
    try {
      const res = await fetch('/api/generate-seo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic,
          summary,
          type: 'full-package',
          geminiKey: apiKeys?.geminiKey || null
        })
      });

      const json = await res.json();
      if (json.success) {
        setResult(json);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text, typeKey) => {
    navigator.clipboard.writeText(text);
    setCopiedType(typeKey);
    setTimeout(() => setCopiedType(null), 2500);
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Input Form */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Sparkles size={20} color="var(--accent-yt)" />
          Complete Video SEO Auto-Pilot
        </h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '18px' }}>
          Instantly generates full YouTube metadata: Description with timestamps, 15 ranked tags, hashtags, and Midjourney thumbnail prompts.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px', display: 'block' }}>
              Video Title or Core Topic:
            </label>
            <input
              type="text"
              className="input-glass"
              placeholder="e.g. How to Build an AI Storyboard App with Next.js and ComfyUI"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px', display: 'block' }}>
              Brief Notes / Key Points (Optional):
            </label>
            <textarea
              className="input-glass"
              rows={3}
              placeholder="e.g. We cover installation, model downloading, API integration, and full demo with free resources."
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              style={{ resize: 'vertical' }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button onClick={handleGenerate} className="btn-primary" disabled={loading}>
              {loading ? 'Crafting SEO Package...' : 'Generate Full SEO Package'}
            </button>
          </div>
        </div>
      </div>

      {/* Generated SEO Package Output */}
      {result && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          {/* Left Column: Description & Hashtags */}
          <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FileText size={18} color="var(--accent-yt)" />
                Optimized Video Description
              </h3>
              <button
                onClick={() => copyToClipboard(result.description, 'desc')}
                className="btn-secondary"
                style={{ fontSize: '0.8rem', padding: '6px 12px' }}
              >
                {copiedType === 'desc' ? <Check size={14} /> : <Copy size={14} />}
                {copiedType === 'desc' ? 'Copied' : 'Copy Description'}
              </button>
            </div>

            <pre
              style={{
                background: 'rgba(0,0,0,0.4)',
                padding: '16px',
                borderRadius: '8px',
                border: '1px solid var(--border-subtle)',
                color: '#cbd5e1',
                fontSize: '0.85rem',
                lineHeight: 1.5,
                whiteSpace: 'pre-wrap',
                maxHeight: '340px',
                overflowY: 'auto'
              }}
            >
              {result.description}
            </pre>

            {/* Hashtags */}
            <div>
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>
                Strategic Hashtags:
              </span>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {result.hashtags?.map((h, i) => (
                  <span key={i} className="badge badge-purple" style={{ fontSize: '0.85rem', padding: '6px 10px' }}>
                    {h}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Tags & AI Thumbnail Prompts */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Tags Box */}
            <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Hash size={16} color="var(--accent-purple)" />
                  15 Ranked Tags for YouTube Studio
                </h3>
                <button
                  onClick={() => copyToClipboard(result.tags.join(', '), 'tags')}
                  className="btn-primary"
                  style={{ fontSize: '0.75rem', padding: '6px 12px' }}
                >
                  {copiedType === 'tags' ? <Check size={14} /> : <Copy size={14} />}
                  {copiedType === 'tags' ? 'Copied' : 'Copy All Tags'}
                </button>
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {result.tags?.map((t, i) => (
                  <span key={i} className="tag-chip" style={{ fontSize: '0.8rem' }}>
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Thumbnail AI Prompts */}
            <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Image size={16} color="var(--accent-cyan)" />
                High-CTR Thumbnail Prompts (Midjourney / Flux)
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {result.thumbnailPrompts?.map((thumb, idx) => (
                  <div key={idx} style={{ padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <span className="badge badge-cyan">{thumb.style}</span>
                      <span className="badge badge-red" style={{ fontWeight: 800 }}>
                        TEXT: "{thumb.textOverlay}"
                      </span>
                    </div>
                    <p style={{ fontSize: '0.8rem', color: '#cbd5e1', fontStyle: 'italic', marginBottom: '8px' }}>
                      "{thumb.prompt}"
                    </p>
                    <button
                      onClick={() => copyToClipboard(thumb.prompt, `thumb-${idx}`)}
                      className="btn-secondary"
                      style={{ fontSize: '0.7rem', padding: '4px 8px', width: '100%' }}
                    >
                      {copiedType === `thumb-${idx}` ? <Check size={12} /> : <Copy size={12} />} Copy Prompt
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
