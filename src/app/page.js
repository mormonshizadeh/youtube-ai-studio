'use client';

import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import TagInspector from '../components/TagInspector';
import TitleHookLab from '../components/TitleHookLab';
import CompetitorRadar from '../components/CompetitorRadar';
import SeoAutoPilot from '../components/SeoAutoPilot';
import SettingsModal from '../components/SettingsModal';
import { Hash, Sparkles, Radar, FileText, Zap } from 'lucide-react';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('tags');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [apiKeys, setApiKeys] = useState({ geminiKey: '', youtubeKey: '' });
  const [inspectorPrefillUrl, setInspectorPrefillUrl] = useState('');

  // Load API keys from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('yt_studio_api_keys');
      if (stored) {
        setApiKeys(JSON.parse(stored));
      }
    } catch (e) {
      console.warn("Could not read local storage:", e);
    }
  }, []);

  const handleSaveKeys = (newKeys) => {
    setApiKeys(newKeys);
    try {
      localStorage.setItem('yt_studio_api_keys', JSON.stringify(newKeys));
    } catch (e) {
      console.warn("Could not save to local storage:", e);
    }
  };

  const handleInspectFromRadar = (videoUrl) => {
    setInspectorPrefillUrl(videoUrl);
    setActiveTab('tags');
  };

  return (
    <main style={{ minHeight: '100vh', padding: '24px 32px 64px 32px', maxWidth: '1440px', margin: '0 auto' }}>
      <Header
        onOpenSettings={() => setIsSettingsOpen(true)}
        hasCustomKeys={Boolean(apiKeys.geminiKey || apiKeys.youtubeKey)}
      />

      {/* Navigation Tabs */}
      <div style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
        <div className="tabs-container">
          <button
            className={`tab-btn ${activeTab === 'tags' ? 'active' : ''}`}
            onClick={() => setActiveTab('tags')}
          >
            <Hash size={16} />
            <span>Tag & SEO Inspector</span>
          </button>

          <button
            className={`tab-btn ${activeTab === 'titles' ? 'active' : ''}`}
            onClick={() => setActiveTab('titles')}
          >
            <Sparkles size={16} />
            <span>Viral Titles & Hooks</span>
          </button>

          <button
            className={`tab-btn ${activeTab === 'radar' ? 'active' : ''}`}
            onClick={() => setActiveTab('radar')}
          >
            <Radar size={16} />
            <span>Competitor Outlier Radar</span>
          </button>

          <button
            className={`tab-btn ${activeTab === 'autopilot' ? 'active' : ''}`}
            onClick={() => setActiveTab('autopilot')}
          >
            <FileText size={16} />
            <span>Complete SEO Package</span>
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          <Zap size={14} color="#f59e0b" />
          <span>Algorithm updates for 2026 synced</span>
        </div>
      </div>

      {/* Tab Panels */}
      <div>
        {activeTab === 'tags' && (
          <TagInspector apiKeys={apiKeys} initialUrl={inspectorPrefillUrl} />
        )}

        {activeTab === 'titles' && (
          <TitleHookLab apiKeys={apiKeys} />
        )}

        {activeTab === 'radar' && (
          <CompetitorRadar apiKeys={apiKeys} onInspectVideo={handleInspectFromRadar} />
        )}

        {activeTab === 'autopilot' && (
          <SeoAutoPilot apiKeys={apiKeys} />
        )}
      </div>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onSave={handleSaveKeys}
        currentKeys={apiKeys}
      />
    </main>
  );
}
