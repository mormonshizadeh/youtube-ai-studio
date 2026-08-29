'use client';

import React, { useState } from 'react';
import { Search, Copy, Check, ExternalLink, Flame, Eye, Clock, Hash, AlertCircle, CheckCircle2, AlertTriangle, ArrowUpRight } from 'lucide-react';

export default function TagInspector({ apiKeys }) {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleAnalyze = async (inputUrl) => {
    const targetUrl = inputUrl || url;
    if (!targetUrl.trim()) return;

    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/analyze-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: targetUrl,
          apiKey: apiKeys?.youtubeKey || null
        })
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to analyze video');
      setData(json.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyTags = () => {
    if (!data?.formattedTags) return;
    navigator.clipboard.writeText(data.formattedTags);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const getScoreColor = (score) => {
    if (score >= 80) return '#10b981';
    if (score >= 50) return '#f59e0b';
    return '#ff2b43';
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Search Bar */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Hash size={20} color="var(--accent-yt)" />
          Video SEO & Hidden Tags Extractor
        </h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
          Paste any YouTube video link to extract all hidden video tags, view velocity, and calculate its VidIQ-style SEO score.
        </p>

        <form onSubmit={(e) => { e.preventDefault(); handleAnalyze(); }} style={{ display: 'flex', gap: '10px' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <input
              type="text"
              className="input-glass"
              placeholder="Paste YouTube Video URL (e.g. https://www.youtube.com/watch?v=... or shorts/...)"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              style={{ paddingLeft: '40px' }}
            />
            <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
          </div>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Analyzing...' : 'Inspect SEO'}
          </button>
        </form>

        {/* Quick Samples */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '14px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Try popular samples:</span>
          <button
            type="button"
            onClick={() => { setUrl('https://www.youtube.com/watch?v=dQw4w9WgXcQ'); handleAnalyze('https://www.youtube.com/watch?v=dQw4w9WgXcQ'); }}
            className="tag-chip"
            style={{ fontSize: '0.75rem' }}
          >
            Music Video Classic
          </button>
          <button
            type="button"
            onClick={() => { setUrl('https://www.youtube.com/watch?v=jNQXAC9IVRw'); handleAnalyze('https://www.youtube.com/watch?v=jNQXAC9IVRw'); }}
            className="tag-chip"
            style={{ fontSize: '0.75rem' }}
          >
            First YouTube Video
          </button>
        </div>

        {error && (
          <div style={{ marginTop: '16px', padding: '12px 16px', background: 'rgba(255, 43, 67, 0.1)', border: '1px solid rgba(255, 43, 67, 0.3)', borderRadius: '8px', color: '#ff8c99', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Results Section */}
      {data && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '20px' }}>
          {/* Main Video Overview & Tags */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Video Card */}
            <div className="glass-panel" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', gap: '18px' }}>
                <div style={{ position: 'relative', width: '220px', height: '124px', flexShrink: 0, borderRadius: '10px', overflow: 'hidden', background: '#000' }}>
                  <img
                    src={data.thumbnail}
                    alt={data.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={(e) => { e.target.src = `https://i.ytimg.com/vi/${data.id}/hqdefault.jpg`; }}
                  />
                  <a
                    href={`https://www.youtube.com/watch?v=${data.id}`}
                    target="_blank"
                    rel="noreferrer"
                    style={{ position: 'absolute', top: '8px', right: '8px', background: 'rgba(0,0,0,0.7)', borderRadius: '6px', padding: '4px 6px', color: 'white', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.7rem', textDecoration: 'none' }}
                  >
                    Watch <ExternalLink size={12} />
                  </a>
                </div>

                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, lineHeight: 1.3, marginBottom: '6px' }}>
                      {data.title}
                    </h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
                      {data.channelTitle}
                    </p>
                  </div>

                  <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginTop: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem' }}>
                      <Eye size={16} color="var(--accent-cyan)" />
                      <span><strong>{data.viewCount.toLocaleString()}</strong> views</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem' }}>
                      <Flame size={16} color="var(--accent-yt)" />
                      <span><strong>{data.viewsPerHour.toLocaleString()}</strong> VPH</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      <Clock size={16} />
                      <span>{data.hoursSinceUpload} hours ago</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Extracted Hidden Tags */}
            <div className="glass-panel" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span>Hidden Video Tags</span>
                    <span className="badge badge-purple">{data.tags.length} Tags Found</span>
                  </h3>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                    Total characters: {data.formattedTags.length} / 500 limit
                  </p>
                </div>

                <button
                  onClick={handleCopyTags}
                  className="btn-primary"
                  style={{ padding: '8px 16px', fontSize: '0.85rem', background: copied ? 'var(--accent-green)' : 'var(--accent-yt-gradient)' }}
                  disabled={data.tags.length === 0}
                >
                  {copied ? (
                    <>
                      <Check size={16} /> Copied to Clipboard!
                    </>
                  ) : (
                    <>
                      <Copy size={16} /> Copy All for YouTube Studio
                    </>
                  )}
                </button>
              </div>

              {data.tags.length > 0 ? (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', maxHeight: '280px', overflowY: 'auto', padding: '4px' }}>
                  {data.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="tag-chip"
                      onClick={() => {
                        navigator.clipboard.writeText(tag);
                      }}
                      title="Click to copy single tag"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              ) : (
                <div style={{ padding: '24px', textAlign: 'center', background: 'rgba(255,255,255,0.02)', borderRadius: '8px' }}>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                    This video does not have any tags set in its metadata.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar: SEO Score Breakdown */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="glass-panel" style={{ padding: '24px', textAlign: 'center' }}>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '16px' }}>
                SEO OPTIMIZATION SCORE
              </h3>

              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
                <div
                  className="score-circle"
                  style={{
                    '--score-val': data.seoScore,
                    '--score-color': getScoreColor(data.seoScore)
                  }}
                >
                  <span className="score-text" style={{ color: getScoreColor(data.seoScore) }}>
                    {data.seoScore}
                  </span>
                  <span className="score-sub">/ 100</span>
                </div>
              </div>

              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                {data.seoScore >= 80 ? '🔥 Highly Optimized Video!' : (data.seoScore >= 50 ? '⚠️ Good, with room for improvement' : '❌ Needs SEO Optimization')}
              </p>
            </div>

            {/* Checklist */}
            <div className="glass-panel" style={{ padding: '20px' }}>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--text-muted)' }}>
                SEO Audit Checklist
              </h4>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {data.seoChecklist?.map((item, idx) => (
                  <div key={idx} style={{ padding: '10px 12px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                        {item.status === 'pass' && <CheckCircle2 size={14} color="#10b981" />}
                        {item.status === 'warn' && <AlertTriangle size={14} color="#f59e0b" />}
                        {item.status === 'fail' && <AlertCircle size={14} color="#ff2b43" />}
                        {item.label}
                      </span>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: item.status === 'pass' ? '#10b981' : (item.status === 'warn' ? '#f59e0b' : '#ff2b43') }}>
                        {item.score}
                      </span>
                    </div>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {item.desc}
                    </p>
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
