import React from 'react';
import { Calendar, Heart, Gift, Sparkles, ExternalLink } from 'lucide-react';

interface NavbarProps {
  activeTab: 'planner' | 'builder' | 'dates' | 'ai-helper';
  setActiveTab: (tab: 'planner' | 'builder' | 'dates' | 'ai-helper') => void;
  onOpenGiftView: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenGiftView,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand wordmark in single element */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-rose-600 to-amber-500 flex items-center justify-center text-white shadow-sm">
            <Heart className="w-5 h-5 fill-white" />
          </div>
          <span className="font-serif-romantic text-xl font-bold tracking-tight text-stone-900 whitespace-nowrap">
            Kalp & Ajanda
          </span>
        </div>

        {/* Zone 2: Navigation Links (Single-line controls) */}
        <nav className="hidden md:flex items-center gap-1.5 lg:gap-3">
          <button
            onClick={() => setActiveTab('planner')}
            className={`flex items-center gap-2 px-3.5 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'planner'
                ? 'bg-stone-900 text-white'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Günlük Ajanda</span>
          </button>

          <button
            onClick={() => setActiveTab('builder')}
            className={`flex items-center gap-2 px-3.5 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'builder'
                ? 'bg-rose-700 text-white'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            <Gift className="w-4 h-4" />
            <span>Hediye Sayfası Stüdyosu</span>
          </button>

          <button
            onClick={() => setActiveTab('dates')}
            className={`flex items-center gap-2 px-3.5 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'dates'
                ? 'bg-stone-900 text-white'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            <Heart className="w-4 h-4" />
            <span>Geri Sayım & Randevular</span>
          </button>

          <button
            onClick={() => setActiveTab('ai-helper')}
            className={`flex items-center gap-2 px-3.5 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'ai-helper'
                ? 'bg-stone-900 text-white'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Aşk & Plan İlhamı</span>
          </button>
        </nav>

        {/* Zone 3: Primary action button */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onOpenGiftView}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 rounded-lg shadow-sm transition-all whitespace-nowrap shrink-0 cursor-pointer"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Hediye Sayfasını Aç</span>
          </button>
        </div>
      </div>

      {/* Mobile subnav */}
      <div className="md:hidden flex items-center justify-around border-t border-stone-200 bg-stone-50/90 py-2 px-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('planner')}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap ${
            activeTab === 'planner' ? 'bg-stone-900 text-white' : 'text-stone-600'
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          Ajanda
        </button>
        <button
          onClick={() => setActiveTab('builder')}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap ${
            activeTab === 'builder' ? 'bg-rose-700 text-white' : 'text-stone-600'
          }`}
        >
          <Gift className="w-3.5 h-3.5" />
          Hediye Stüdyosu
        </button>
        <button
          onClick={() => setActiveTab('dates')}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap ${
            activeTab === 'dates' ? 'bg-stone-900 text-white' : 'text-stone-600'
          }`}
        >
          <Heart className="w-3.5 h-3.5" />
          Randevular
        </button>
        <button
          onClick={() => setActiveTab('ai-helper')}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap ${
            activeTab === 'ai-helper' ? 'bg-stone-900 text-white' : 'text-stone-600'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          İlham
        </button>
      </div>
    </header>
  );
};
