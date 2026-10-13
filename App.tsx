import React, { useState, useEffect } from 'react';
import { Navbar } from './components/navigation/Navbar';
import { DailyPlannerView } from './components/planner/DailyPlannerView';
import { GiftStudioView } from './components/gift-builder/GiftStudioView';
import { RomanticGiftPageView } from './components/gift-page/RomanticGiftPageView';
import { SpecialDatesView } from './components/special-dates/SpecialDatesView';
import { AiInspirationView } from './components/ai-helper/AiInspirationView';
import { ShareGiftModal } from './components/gift-builder/ShareGiftModal';
import { GiftPageConfig } from './types';
import { 
  loadGiftConfig, 
  saveGiftConfig, 
  decodeGiftFromShareUrl 
} from './services/shareService';

export default function App() {
  const [activeTab, setActiveTab] = useState<'planner' | 'builder' | 'dates' | 'ai-helper'>('planner');
  const [giftConfig, setGiftConfig] = useState<GiftPageConfig>(loadGiftConfig);
  const [isGiftPreviewOpen, setIsGiftPreviewOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isDirectGiftSharedMode, setIsDirectGiftSharedMode] = useState(false);

  // Check on load if this URL was directly shared to a partner (via #gift=... or ?gift=...)
  useEffect(() => {
    const sharedConfig = decodeGiftFromShareUrl();
    if (sharedConfig) {
      setGiftConfig(sharedConfig);
      setIsDirectGiftSharedMode(true);
      setIsGiftPreviewOpen(true);
    }

    // Listen to hash changes in case of navigation
    const handleHashChange = () => {
      const updated = decodeGiftFromShareUrl();
      if (updated) {
        setGiftConfig(updated);
        setIsDirectGiftSharedMode(true);
        setIsGiftPreviewOpen(true);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleUpdateConfig = (newConfig: GiftPageConfig) => {
    setGiftConfig(newConfig);
    saveGiftConfig(newConfig);
  };

  // If in direct shared gift mode or user clicked full-screen preview:
  if (isGiftPreviewOpen) {
    return (
      <div className="min-h-screen">
        <RomanticGiftPageView
          config={giftConfig}
          isStandalone={isDirectGiftSharedMode}
          onBackToStudio={
            isDirectGiftSharedMode
              ? () => {
                  // Allow partner to go to planner/studio if desired
                  window.location.hash = '';
                  setIsDirectGiftSharedMode(false);
                  setIsGiftPreviewOpen(false);
                  setActiveTab('planner');
                }
              : () => setIsGiftPreviewOpen(false)
          }
          onOpenShareModal={() => setIsShareModalOpen(true)}
        />

        <ShareGiftModal
          config={giftConfig}
          isOpen={isShareModalOpen}
          onClose={() => setIsShareModalOpen(false)}
          onOpenGiftView={() => setIsGiftPreviewOpen(true)}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 flex flex-col font-sans">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenGiftView={() => setIsGiftPreviewOpen(true)}
      />

      <main className="flex-1">
        {activeTab === 'planner' && (
          <DailyPlannerView
            onNavigateToAiHelper={() => setActiveTab('ai-helper')}
          />
        )}

        {activeTab === 'builder' && (
          <GiftStudioView
            config={giftConfig}
            onUpdateConfig={handleUpdateConfig}
            onOpenGiftView={() => setIsGiftPreviewOpen(true)}
            onOpenShareModal={() => setIsShareModalOpen(true)}
          />
        )}

        {activeTab === 'dates' && (
          <SpecialDatesView
            config={giftConfig}
            onNavigateToAiHelper={() => setActiveTab('ai-helper')}
            onOpenGiftStudio={() => setActiveTab('builder')}
          />
        )}

        {activeTab === 'ai-helper' && (
          <AiInspirationView
            config={giftConfig}
            onUpdateConfig={handleUpdateConfig}
            onNavigateToBuilder={() => setActiveTab('builder')}
            onNavigateToPlanner={() => setActiveTab('planner')}
          />
        )}
      </main>

      {/* Share Modal */}
      <ShareGiftModal
        config={giftConfig}
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        onOpenGiftView={() => setIsGiftPreviewOpen(true)}
      />

      {/* Subtle, unboxed clean footer */}
      <footer className="border-t border-stone-200 bg-white py-6 mt-12 text-center text-xs text-stone-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 Kalp & Ajanda · Günlük Plan & Romantik Hediye Stüdyosu</p>
          <div className="flex items-center gap-4 text-stone-600">
            <button
              onClick={() => setActiveTab('planner')}
              className="hover:text-stone-900 cursor-pointer"
            >
              Ajanda
            </button>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => setActiveTab('builder')}
              className="hover:text-stone-900 cursor-pointer"
            >
              Hediye Tasarla
            </button>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => setIsGiftPreviewOpen(true)}
              className="hover:text-stone-900 cursor-pointer"
            >
              Canlı Hediye Sayfası
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
