'use client';

import React, { useState, useEffect } from 'react';
import { TrendingUp, Eye, Clock, MousePointer, Users, Play, ExternalLink, RefreshCw, LogIn } from 'lucide-react';

function StatCard({ icon: Icon, label, value, color, subtitle }) {
  return (
    <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Icon size={16} color={color || 'var(--accent-primary)'} />
        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</span>
      </div>
      <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff', letterSpacing: '-1px' }}>{value}</div>
      {subtitle && <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{subtitle}</div>}
    </div>
  );
}

function formatNum(n) {
  if (!n) return '0';
  const num = parseInt(n);
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + 'M';
  if (num >= 1_000) return (num / 1_000).toFixed(1) + 'K';
  return num.toLocaleString();
}

export default function ChannelAnalytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [connected, setConnected] = useState(false);

  const fetchAnalytics = async () => {
    setLoading(true);
    setError(null);
    try {
      // Check connection
      const statusRes = await fetch('/api/auth/status');
      const status = await statusRes.json();
      if (!status.connected) {
        setConnected(false);
        setLoading(false);
        return;
      }
      setConnected(true);

      // Fetch analytics
      const analyticsRes = await fetch('/api/channel/analytics');
      const analytics = await analyticsRes.json();
      if (analytics.error) throw new Error(analytics.error);
      setData(analytics);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAnalytics(); }, []);

  if (!connected && !loading) {
    return (
      <div className="glass-panel" style={{ padding: '48px', textAlign: 'center' }}>
        <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🔒</div>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '8px' }}>کانال یوتیوب وصل نیست</h3>
        <p style={{ color: 'var(--text-muted)', marginBottom: '24px', fontSize: '0.9rem' }}>
          برای دیدن CTR، Watch Time، Impressions و آمار خصوصی کانالت وصل شو
        </p>
        <a href="/api/auth/google" style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          background: 'linear-gradient(135deg,#ff2b43,#ff6b35)',
          color: '#fff', padding: '12px 24px', borderRadius: '10px',
          fontWeight: 700, textDecoration: 'none', fontSize: '0.95rem',
        }}>
          <LogIn size={18} /> Connect YouTube Channel
        </a>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="glass-panel" style={{ padding: '48px', textAlign: 'center' }}>
        <div style={{ width: '40px', height: '40px', border: '3px solid rgba(255,255,255,0.1)', borderTopColor: 'var(--accent-yt)', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 16px' }} />
        <p style={{ color: 'var(--text-muted)' }}>در حال دریافت اطلاعات کانال شما...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass-panel" style={{ padding: '32px', textAlign: 'center' }}>
        <p style={{ color: '#ff6b6b', marginBottom: '16px' }}>⚠️ {error}</p>
        <button onClick={fetchAnalytics} className="btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <RefreshCw size={14} /> دوباره تلاش
        </button>
      </div>
    );
  }

  const { channel, summary, trafficSources, topVideos, period } = data || {};

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Channel Header */}
      <div className="glass-panel" style={{ padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          {channel?.thumbnail && (
            <img src={channel.thumbnail} alt="channel" style={{ width: '52px', height: '52px', borderRadius: '50%', border: '2px solid #10b981' }} />
          )}
          <div>
            <div style={{ fontWeight: 800, fontSize: '1.1rem' }}>{channel?.title}</div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
              {formatNum(channel?.subscriberCount)} subscribers · {formatNum(channel?.videoCount)} videos
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            {period?.startDate} → {period?.endDate}
          </span>
          <button onClick={fetchAnalytics} className="btn-secondary" style={{ padding: '6px 10px' }}>
            <RefreshCw size={14} />
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '14px' }}>
        <StatCard icon={Eye} label="Views" value={formatNum(summary?.views)} color="#60a5fa" subtitle="Last 28 days" />
        <StatCard icon={Clock} label="Watch Hours" value={formatNum(summary?.watchHours)} color="#a78bfa" subtitle="Total watch time" />
        <StatCard icon={Eye} label="Impressions" value={formatNum(summary?.impressions)} color="#f59e0b" subtitle="Thumbnail shown" />
        <StatCard icon={MousePointer} label="CTR" value={summary?.ctr || '—'} color="#34d399" subtitle="Click-through rate" />
        <StatCard icon={Clock} label="Avg Duration" value={summary?.avgViewDuration || '—'} color="#fb923c" subtitle="Per view" />
        <StatCard icon={Users} label="Net Subs" value={(summary?.netSubscribers >= 0 ? '+' : '') + formatNum(summary?.netSubscribers)} color={summary?.netSubscribers >= 0 ? '#10b981' : '#f87171'} subtitle="Gained - lost" />
      </div>

      {/* Traffic Sources */}
      {trafficSources?.length > 0 && (
        <div className="glass-panel" style={{ padding: '20px' }}>
          <h3 style={{ fontWeight: 700, marginBottom: '16px', fontSize: '0.95rem' }}>📡 Traffic Sources</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {trafficSources.map((src, i) => {
              const total = trafficSources.reduce((s, x) => s + x.views, 0);
              const pct = total > 0 ? Math.round((src.views / total) * 100) : 0;
              return (
                <div key={i}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '0.82rem' }}>
                    <span>{src.source.replace('_', ' ')}</span>
                    <span style={{ color: 'var(--text-muted)' }}>{formatNum(src.views)} ({pct}%)</span>
                  </div>
                  <div style={{ height: '6px', background: 'rgba(255,255,255,0.08)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ width: `${pct}%`, height: '100%', background: 'linear-gradient(90deg,#ff2b43,#ff6b35)', borderRadius: '3px', transition: 'width 0.6s ease' }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Top Videos */}
      {topVideos?.length > 0 && (
        <div className="glass-panel" style={{ padding: '20px' }}>
          <h3 style={{ fontWeight: 700, marginBottom: '16px', fontSize: '0.95rem' }}>🏆 Top Videos (Last 28 Days)</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {topVideos.map((v, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px' }}>
                <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-muted)', minWidth: '24px' }}>#{i + 1}</span>
                {v.thumbnail && <img src={v.thumbnail} alt="thumb" style={{ width: '80px', height: '45px', borderRadius: '6px', objectFit: 'cover' }} />}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: '0.85rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{v.title}</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                    {formatNum(v.views)} views · CTR: {v.ctr}
                  </div>
                </div>
                <a href={`https://youtube.com/watch?v=${v.id}`} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-muted)' }}>
                  <ExternalLink size={14} />
                </a>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
