'use client';

import React, { useState } from 'react';
import { Radar, Search, Flame, TrendingUp, BarChart2, ExternalLink, ArrowRight, Eye, ShieldAlert } from 'lucide-react';

export default function CompetitorRadar({ apiKeys, onInspectVideo }) {
  const [keyword, setKeyword] = useState('');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);

  const handleSearch = async (kw) => {
    const query = kw || keyword;
    if (!query.trim()) return;
    setLoading(true);
    try {
      const res = await fetch('/api/competitor-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          keyword: query,
          apiKey: apiKeys?.youtubeKey || null
        })
      });

      const json = await res.json();
      if (json.success) {
        setData(json);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Search Bar */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Radar size={20} color="var(--accent-cyan)" />
          Competitor Radar & Viral Outlier Finder
        </h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
          Finds high-performing competitor videos and identifies <strong>Outliers</strong> (videos getting 5x-10x more views than normal channel averages).
        </p>

        <form onSubmit={(e) => { e.preventDefault(); handleSearch(); }} style={{ display: 'flex', gap: '10px' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <input
              type="text"
              className="input-glass"
              placeholder="Search topic or keyword (e.g. AI Video Generator, ComfyUI, Next.js fullstack...)"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              style={{ paddingLeft: '40px' }}
            />
            <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
          </div>
          <button type="submit" className="btn-primary" style={{ background: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)' }} disabled={loading}>
            {loading ? 'Scanning YouTube...' : 'Find Outliers'}
          </button>
        </form>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '12px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Trending niches:</span>
          {['AI Video Generator', 'ComfyUI LTX', 'Make Money Online', 'Coding with AI'].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => { setKeyword(n); handleSearch(n); }}
              className="tag-chip"
              style={{ fontSize: '0.75rem' }}
            >
              {n}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      {data && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Keyword Metric Badges */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            <div className="glass-panel" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'rgba(6, 182, 212, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <TrendingUp size={22} color="var(--accent-cyan)" />
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Search Volume</span>
                <h4 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>
                  {data.searchVolumeScore} / 100
                </h4>
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'rgba(245, 158, 11, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <BarChart2 size={22} color="var(--accent-amber)" />
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Competition</span>
                <h4 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--accent-amber)' }}>
                  {data.competitionScore < 50 ? 'Low' : (data.competitionScore < 75 ? 'Medium' : 'High')} ({data.competitionScore}%)
                </h4>
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Flame size={22} color="var(--accent-green)" />
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Opportunity Rating</span>
                <h4 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--accent-green)' }}>
                  VERY HIGH 🔥
                </h4>
              </div>
            </div>
          </div>

          {/* Outlier Video Grid */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>
              Top Ranking & Viral Outlier Videos for "{data.keyword}"
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
              {data.results.map((video) => (
                <div
                  key={video.id}
                  className="glass-panel"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{ position: 'relative', width: '100%', height: '170px', background: '#000' }}>
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={(e) => { e.target.src = `https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`; }}
                    />
                    <div style={{ position: 'absolute', top: '10px', left: '10px' }}>
                      <span className="badge badge-red" style={{ fontWeight: 800 }}>
                        RANK #{video.rank}
                      </span>
                    </div>

                    <div style={{ position: 'absolute', bottom: '10px', right: '10px' }}>
                      <span className="badge badge-green" style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(6px)', border: '1px solid #10b981' }}>
                        🔥 {video.outlierScore}x Outlier
                      </span>
                    </div>
                  </div>

                  <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px', flex: 1, justifyContent: 'space-between' }}>
                    <div>
                      <h4 style={{ fontSize: '0.95rem', fontWeight: 700, lineHeight: 1.35, marginBottom: '6px' }}>
                        {video.title}
                      </h4>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                        {video.channelTitle}
                      </p>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        <Eye size={14} />
                        <span>{video.viewCountText || `${video.viewCount.toLocaleString()} views`}</span>
                      </div>

                      <button
                        onClick={() => onInspectVideo && onInspectVideo(`https://www.youtube.com/watch?v=${video.id}`)}
                        className="btn-secondary"
                        style={{ fontSize: '0.75rem', padding: '4px 10px', gap: '4px' }}
                      >
                        Inspect Tags <ArrowRight size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
