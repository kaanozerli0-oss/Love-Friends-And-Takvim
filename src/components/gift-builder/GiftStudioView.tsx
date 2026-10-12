import React, { useState } from 'react';
import { 
  Gift, 
  Palette, 
  Heart, 
  FileText, 
  Image as ImageIcon, 
  Ticket, 
  ListOrdered, 
  Lock, 
  Sparkles, 
  Save, 
  Eye, 
  Share2, 
  Music, 
  Plus, 
  Trash2, 
  Check, 
  RefreshCw,
  ExternalLink
} from 'lucide-react';
import { GiftPageConfig, ThemeKey, TimelineMoment, LoveVoucher } from '../../types';
import { THEME_PRESETS } from '../../data/constants';
import { saveGiftConfig } from '../../services/shareService';

interface GiftStudioViewProps {
  config: GiftPageConfig;
  onUpdateConfig: (newConfig: GiftPageConfig) => void;
  onOpenGiftView: () => void;
  onOpenShareModal: () => void;
}

export const GiftStudioView: React.FC<GiftStudioViewProps> = ({
  config,
  onUpdateConfig,
  onOpenGiftView,
  onOpenShareModal,
}) => {
  const [activeTab, setActiveTab] = useState<'info' | 'theme' | 'letter' | 'moments' | 'vouchers' | 'reasons' | 'surprise'>('info');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiLetterPrompt, setAiLetterPrompt] = useState('Duygusal, samimi ve ilk kahvemizden bahseden bir mektup');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Helper updater
  const updateConfig = (patch: Partial<GiftPageConfig>) => {
    const updated = { ...config, ...patch };
    onUpdateConfig(updated);
    saveGiftConfig(updated);
  };

  const handleManualSave = () => {
    saveGiftConfig(config);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  // AI Letter Generator helper
  const handleGenerateAiLetter = async () => {
    setIsAiLoading(true);
    try {
      const res = await fetch('/api/ai/romantic-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: 'letter',
          partnerName: config.couple.partnerName,
          userName: config.couple.yourName,
          details: aiLetterPrompt,
          tone: 'Duygusal ve şiirsel',
          relationshipLength: config.couple.relationshipStartDate,
        }),
      });
      const data = await res.json();
      if (data.success && data.result) {
        updateConfig({
          letter: {
            ...config.letter,
            content: data.result,
          },
        });
      }
    } catch (err) {
      console.error('AI generation failed:', err);
    } finally {
      setIsAiLoading(false);
    }
  };

  // AI Reasons Generator helper
  const handleGenerateAiReasons = async () => {
    setIsAiLoading(true);
    try {
      const res = await fetch('/api/ai/romantic-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: 'reasons',
          partnerName: config.couple.partnerName,
          userName: config.couple.yourName,
          details: 'Gülüşü, huzur vermesi, sabrı ve şefkati',
        }),
      });
      const data = await res.json();
      if (data.success && data.result) {
        // Parse lines into reasons
        const lines = data.result
          .split('\n')
          .map((l: string) => l.replace(/^[-*0-9.]+\s*/, '').trim())
          .filter((l: string) => l.length > 5);

        if (lines.length > 0) {
          const newReasons = lines.map((text: string, idx: number) => ({
            id: 'r_ai_' + Date.now() + '_' + idx,
            text,
          }));
          updateConfig({ reasons: newReasons });
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsAiLoading(false);
    }
  };

  // Moment handlers
  const handleAddMoment = () => {
    const newMoment: TimelineMoment = {
      id: 'm_' + Date.now(),
      date: new Date().toLocaleDateString('tr-TR'),
      title: 'Yeni Güzel Bir Anımız',
      description: 'Birlikte geçirdiğimiz bu özel gün...',
      imageUrl: '/src/assets/images/gift_romantic_couple_1791827481163.jpg',
      category: 'Unutulmaz An',
    };
    updateConfig({ moments: [...config.moments, newMoment] });
  };

  const handleDeleteMoment = (id: string) => {
    updateConfig({ moments: config.moments.filter(m => m.id !== id) });
  };

  const handleUpdateMoment = (id: string, field: keyof TimelineMoment, value: string) => {
    updateConfig({
      moments: config.moments.map(m => m.id === id ? { ...m, [field]: value } : m),
    });
  };

  // Voucher handlers
  const handleAddVoucher = () => {
    const newVoucher: LoveVoucher = {
      id: 'v_' + Date.now(),
      title: 'Özel Sürpriz Kuponu',
      description: 'Sevgilim ne zaman isterse anında geçerli!',
      icon: 'Heart',
      isRedeemed: false,
    };
    updateConfig({ vouchers: [...config.vouchers, newVoucher] });
  };

  const handleDeleteVoucher = (id: string) => {
    updateConfig({ vouchers: config.vouchers.filter(v => v.id !== id) });
  };

  const handleUpdateVoucher = (id: string, field: keyof LoveVoucher, value: any) => {
    updateConfig({
      vouchers: config.vouchers.map(v => v.id === id ? { ...v, [field]: value } : v),
    });
  };

  // Reason handlers
  const handleAddReason = () => {
    updateConfig({
      reasons: [...config.reasons, { id: 'r_' + Date.now(), text: 'Birlikte her şeye gülebilmemiz.' }],
    });
  };

  const handleDeleteReason = (id: string) => {
    updateConfig({ reasons: config.reasons.filter(r => r.id !== id) });
  };

  const handleUpdateReason = (id: string, text: string) => {
    updateConfig({
      reasons: config.reasons.map(r => r.id === id ? { ...r, text } : r),
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Studio Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-stone-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-rose-600 text-xs font-semibold tracking-wider uppercase mb-1">
            <Gift className="w-4 h-4" />
            <span>Kişiselleştirilebilir Sevgiliye Hediye Sayfası Stüdyosu</span>
          </div>
          <h1 className="font-serif-romantic text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
            Sevgilinize Özel Web Sayfası Tasarlayın
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1 max-w-2xl">
            İsimleriniz, aşk mektubunuz, canlı süreniz, fotoğraflarınız ve etkileşimli aşk kuponlarıyla sevgilinize unutamayacağı bir hediye linki hazırlayın.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={handleManualSave}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors cursor-pointer"
          >
            {saveSuccess ? <Check className="w-4 h-4 text-emerald-600" /> : <Save className="w-4 h-4" />}
            <span>{saveSuccess ? 'Kaydedildi' : 'Kaydet'}</span>
          </button>

          <button
            onClick={onOpenShareModal}
            className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-stone-900 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors cursor-pointer"
          >
            <Share2 className="w-4 h-4" />
            <span>Paylaşım Linki Al</span>
          </button>

          <button
            onClick={onOpenGiftView}
            className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-white bg-rose-600 hover:bg-rose-500 rounded-lg shadow-sm transition-colors cursor-pointer"
          >
            <Eye className="w-4 h-4" />
            <span>Tam Ekran Önizle</span>
          </button>
        </div>
      </div>

      {/* Segmented Step / Tab Selector */}
      <div className="bg-white p-1.5 rounded-xl border border-stone-200 overflow-x-auto flex items-center gap-1">
        {[
          { id: 'info', label: '1. Çift & Başlık', icon: Heart },
          { id: 'theme', label: '2. Tema & Müzik', icon: Palette },
          { id: 'letter', label: '3. Aşk Mektubu', icon: FileText },
          { id: 'moments', label: '4. Anı Zaman Çizelgesi', icon: ImageIcon },
          { id: 'vouchers', label: '5. Aşk Kuponları', icon: Ticket },
          { id: 'reasons', label: '6. Neden Seviyorum?', icon: ListOrdered },
          { id: 'surprise', label: '7. Gizli Soru & Kilit', icon: Lock },
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Contents */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 space-y-6">
        {/* Tab 1: Couple Info */}
        {activeTab === 'info' && (
          <div className="space-y-6 max-w-3xl">
            <h2 className="font-serif-romantic text-lg font-bold text-stone-900 pb-2 border-b border-stone-100">
              Temel Çift Bilgileri & Başlık
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Sevgilinizin İsmi / Hitabı
                </label>
                <input
                  type="text"
                  value={config.couple.partnerName}
                  onChange={(e) => updateConfig({ couple: { ...config.couple, partnerName: e.target.value } })}
                  placeholder="Örn: Zeynep, Canım..."
                  className="w-full px-3.5 py-2 text-sm rounded-lg border border-stone-200 focus:outline-none focus:ring-1 focus:ring-stone-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Sizin İsminiz
                </label>
                <input
                  type="text"
                  value={config.couple.yourName}
                  onChange={(e) => updateConfig({ couple: { ...config.couple, yourName: e.target.value } })}
                  placeholder="Örn: Kaan"
                  className="w-full px-3.5 py-2 text-sm rounded-lg border border-stone-200 focus:outline-none focus:ring-1 focus:ring-stone-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  İlişkinizin Başlangıç Tarihi (Canlı sayaç için)
                </label>
                <input
                  type="date"
                  value={config.couple.relationshipStartDate}
                  onChange={(e) => updateConfig({ couple: { ...config.couple, relationshipStartDate: e.target.value } })}
                  className="w-full px-3.5 py-2 text-sm rounded-lg border border-stone-200 focus:outline-none focus:ring-1 focus:ring-stone-900 cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Yıldönümü / Özel Gün
                </label>
                <input
                  type="date"
                  value={config.couple.anniversaryDate || ''}
                  onChange={(e) => updateConfig({ couple: { ...config.couple, anniversaryDate: e.target.value } })}
                  className="w-full px-3.5 py-2 text-sm rounded-lg border border-stone-200 focus:outline-none focus:ring-1 focus:ring-stone-900 cursor-pointer"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Sayfa Ana Manşeti
              </label>
              <input
                type="text"
                value={config.couple.mainHeadline}
                onChange={(e) => updateConfig({ couple: { ...config.couple, mainHeadline: e.target.value } })}
                placeholder="Örn: Seninle Her Günüm Yeni Bir Masal"
                className="w-full px-3.5 py-2 text-sm rounded-lg border border-stone-200 focus:outline-none focus:ring-1 focus:ring-stone-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Alt Manşet / Romantik Cümle
              </label>
              <textarea
                rows={2}
                value={config.couple.subtitle}
                onChange={(e) => updateConfig({ couple: { ...config.couple, subtitle: e.target.value } })}
                placeholder="Örn: Hayatıma girdiğin andan beri tüm renkler daha canlı..."
                className="w-full px-3.5 py-2 text-sm rounded-lg border border-stone-200 focus:outline-none focus:ring-1 focus:ring-stone-900 resize-none"
              />
            </div>
          </div>
        )}

        {/* Tab 2: Theme & Music */}
        {activeTab === 'theme' && (
          <div className="space-y-6 max-w-4xl">
            <h2 className="font-serif-romantic text-lg font-bold text-stone-900 pb-2 border-b border-stone-100">
              Görsel Atmosfer & Arka Plan Müziği
            </h2>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-3">
                Renk Temasını Seçin:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {(Object.keys(THEME_PRESETS) as ThemeKey[]).map(key => {
                  const item = THEME_PRESETS[key];
                  const isSelected = config.theme === key;
                  return (
                    <div
                      key={key}
                      onClick={() => updateConfig({ theme: key })}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        isSelected 
                          ? 'border-rose-600 bg-rose-50/40 shadow-sm' 
                          : 'border-stone-200 hover:border-stone-300 bg-white'
                      }`}
                    >
                      <div className={`h-16 rounded-lg bg-gradient-to-r ${item.bgGradient} mb-3 flex items-center justify-center text-white`}>
                        <Heart className="w-5 h-5 fill-white" />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-semibold text-stone-900">{item.name}</h4>
                          <p className="text-[11px] text-stone-500 mt-0.5">{item.tagline}</p>
                        </div>
                        {isSelected && <Check className="w-4 h-4 text-rose-600 stroke-[3]" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="pt-4 border-t border-stone-100">
              <label className="block text-xs font-semibold text-stone-700 mb-2">
                Romantik Arka Plan Melodisi (Web Audio API)
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { id: 'piano-waltz', name: 'Zarif Piyano Valsi', desc: 'Sakin, dingin ve romantik akorlar' },
                  { id: 'lofi-twilight', name: 'Lo-Fi Alacakaranlık', desc: 'Yumuşak sıcak dalgalar' },
                  { id: 'acoustic-warmth', name: 'Akustik Sıcaklık', desc: 'Bahar esintisi tadında hafif melodi' },
                ].map(mel => (
                  <button
                    key={mel.id}
                    type="button"
                    onClick={() => updateConfig({ backgroundMusic: { ...config.backgroundMusic, melody: mel.id as any } })}
                    className={`p-3 rounded-lg border text-left transition-all cursor-pointer ${
                      config.backgroundMusic.melody === mel.id
                        ? 'border-stone-900 bg-stone-50 font-medium'
                        : 'border-stone-200 hover:bg-stone-50'
                    }`}
                  >
                    <span className="block text-xs font-semibold text-stone-900">{mel.name}</span>
                    <span className="block text-[11px] text-stone-500 mt-0.5">{mel.desc}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Wax-Sealed Love Letter */}
        {activeTab === 'letter' && (
          <div className="space-y-6 max-w-3xl">
            <div className="flex items-center justify-between pb-2 border-b border-stone-100 flex-wrap gap-2">
              <h2 className="font-serif-romantic text-lg font-bold text-stone-900">
                Mühürlü Aşk Mektubu İçeriği
              </h2>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={aiLetterPrompt}
                  onChange={(e) => setAiLetterPrompt(e.target.value)}
                  placeholder="AI yönlendirmesi..."
                  className="px-2.5 py-1 text-xs border border-stone-200 rounded-lg w-48 text-stone-800"
                />
                <button
                  onClick={handleGenerateAiLetter}
                  disabled={isAiLoading}
                  className="flex items-center gap-1.5 px-3 py-1 text-xs font-medium text-white bg-amber-600 hover:bg-amber-500 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{isAiLoading ? 'Yazılıyor...' : 'AI ile Mektup Yaz'}</span>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Mektup Başlığı
              </label>
              <input
                type="text"
                value={config.letter.title}
                onChange={(e) => updateConfig({ letter: { ...config.letter, title: e.target.value } })}
                placeholder="Örn: Kalbimden Dökülen En Güzel Satırlar"
                className="w-full px-3.5 py-2 text-sm rounded-lg border border-stone-200 focus:outline-none focus:ring-1 focus:ring-stone-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Mektup Metni (Sevgilinize hislerinizi yazın)
              </label>
              <textarea
                rows={8}
                value={config.letter.content}
                onChange={(e) => updateConfig({ letter: { ...config.letter, content: e.target.value } })}
                placeholder="Sevgilinize özel duygularınızı buraya dökün..."
                className="w-full px-3.5 py-2 text-sm rounded-lg border border-stone-200 focus:outline-none focus:ring-1 focus:ring-stone-900 leading-relaxed font-serif-romantic"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  İmza / Kapanış
                </label>
                <input
                  type="text"
                  value={config.letter.signature}
                  onChange={(e) => updateConfig({ letter: { ...config.letter, signature: e.target.value } })}
                  placeholder="Örn: Seni sonsuz aşkla seven sevgilin"
                  className="w-full px-3.5 py-2 text-sm rounded-lg border border-stone-200 focus:outline-none focus:ring-1 focus:ring-stone-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  P.S. / Dipnot
                </label>
                <input
                  type="text"
                  value={config.letter.postScript}
                  onChange={(e) => updateConfig({ letter: { ...config.letter, postScript: e.target.value } })}
                  placeholder="Örn: Aşağıdaki kuponları istediğin zaman kullanabilirsin!"
                  className="w-full px-3.5 py-2 text-sm rounded-lg border border-stone-200 focus:outline-none focus:ring-1 focus:ring-stone-900"
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Moments & Timeline */}
        {activeTab === 'moments' && (
          <div className="space-y-6 max-w-4xl">
            <div className="flex items-center justify-between pb-2 border-b border-stone-100">
              <h2 className="font-serif-romantic text-lg font-bold text-stone-900">
                Anı & Fotoğraf Zaman Çizelgesi
              </h2>
              <button
                onClick={handleAddMoment}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-stone-900 hover:bg-stone-800 rounded-lg cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Yeni Anı Ekle</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {config.moments.map((moment) => (
                <div key={moment.id} className="p-4 rounded-xl border border-stone-200 bg-stone-50 space-y-3">
                  <div className="flex items-center justify-between">
                    <input
                      type="text"
                      value={moment.category}
                      onChange={(e) => handleUpdateMoment(moment.id, 'category', e.target.value)}
                      placeholder="Kategori (İlk Gün, Tatil...)"
                      className="text-xs px-2 py-0.5 rounded bg-white border border-stone-200 font-semibold text-rose-700"
                    />
                    <button
                      onClick={() => handleDeleteMoment(moment.id)}
                      className="text-stone-400 hover:text-rose-600 p-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={moment.title}
                      onChange={(e) => handleUpdateMoment(moment.id, 'title', e.target.value)}
                      placeholder="Anı Başlığı"
                      className="text-xs font-semibold px-2.5 py-1.5 rounded bg-white border border-stone-200 text-stone-900"
                    />
                    <input
                      type="text"
                      value={moment.date}
                      onChange={(e) => handleUpdateMoment(moment.id, 'date', e.target.value)}
                      placeholder="Tarih (Örn: 18 Mayıs 2024)"
                      className="text-xs px-2.5 py-1.5 rounded bg-white border border-stone-200 text-stone-700"
                    />
                  </div>

                  <textarea
                    rows={2}
                    value={moment.description}
                    onChange={(e) => handleUpdateMoment(moment.id, 'description', e.target.value)}
                    placeholder="Anının kısa hikayesi..."
                    className="w-full text-xs p-2.5 rounded bg-white border border-stone-200 text-stone-800 resize-none"
                  />

                  <div>
                    <label className="block text-[11px] text-stone-500 mb-1">
                      Fotoğraf Seçimi:
                    </label>
                    <div className="flex items-center gap-2">
                      <select
                        value={moment.imageUrl}
                        onChange={(e) => handleUpdateMoment(moment.id, 'imageUrl', e.target.value)}
                        className="text-xs px-2 py-1 rounded bg-white border border-stone-200 flex-1 text-stone-800"
                      >
                        <option value="/src/assets/images/gift_romantic_couple_1791827481163.jpg">Romantik Çift Portresi (Günbatımı)</option>
                        <option value="/src/assets/images/gift_starry_night_1791827504771.jpg">Yıldızlı Gece & Balkon Romantizmi</option>
                        <option value="/src/assets/images/gift_vintage_letter_1791827491223.jpg">Antika Aşk Mektubu & Çiçekler</option>
                      </select>
                      {moment.imageUrl && (
                        <img
                          src={moment.imageUrl}
                          alt="Önizleme"
                          referrerPolicy="no-referrer"
                          className="w-8 h-8 rounded object-cover border border-stone-200"
                        />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 5: Love Vouchers */}
        {activeTab === 'vouchers' && (
          <div className="space-y-6 max-w-3xl">
            <div className="flex items-center justify-between pb-2 border-b border-stone-100">
              <h2 className="font-serif-romantic text-lg font-bold text-stone-900">
                İnteraktif Aşk Kuponları
              </h2>
              <button
                onClick={handleAddVoucher}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-stone-900 hover:bg-stone-800 rounded-lg cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Yeni Kupon Ekle</span>
              </button>
            </div>

            <div className="space-y-3">
              {config.vouchers.map((voucher) => (
                <div key={voucher.id} className="p-3.5 rounded-xl border border-stone-200 bg-stone-50 flex items-center justify-between gap-3">
                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={voucher.title}
                      onChange={(e) => handleUpdateVoucher(voucher.id, 'title', e.target.value)}
                      placeholder="Kupon Başlığı (Örn: 30 Dk Masaj)"
                      className="text-xs font-semibold px-2.5 py-1.5 rounded bg-white border border-stone-200 text-stone-900"
                    />
                    <input
                      type="text"
                      value={voucher.description}
                      onChange={(e) => handleUpdateVoucher(voucher.id, 'description', e.target.value)}
                      placeholder="Açıklama (Örn: Ne zaman istersen geçerli!)"
                      className="text-xs px-2.5 py-1.5 rounded bg-white border border-stone-200 text-stone-700"
                    />
                  </div>

                  <button
                    onClick={() => handleDeleteVoucher(voucher.id)}
                    className="text-stone-400 hover:text-rose-600 p-1.5 cursor-pointer shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 6: Reasons */}
        {activeTab === 'reasons' && (
          <div className="space-y-6 max-w-3xl">
            <div className="flex items-center justify-between pb-2 border-b border-stone-100 flex-wrap gap-2">
              <h2 className="font-serif-romantic text-lg font-bold text-stone-900">
                &ldquo;Seni Neden Seviyorum?&rdquo; Nedenleri
              </h2>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleGenerateAiReasons}
                  disabled={isAiLoading}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span>AI ile Neden Üret</span>
                </button>
                <button
                  onClick={handleAddReason}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-stone-900 hover:bg-stone-800 rounded-lg cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Ekle</span>
                </button>
              </div>
            </div>

            <div className="space-y-2.5">
              {config.reasons.map((reason, index) => (
                <div key={reason.id} className="flex items-center gap-2 p-2 rounded-lg border border-stone-200 bg-stone-50">
                  <span className="text-xs font-semibold text-stone-400 w-6 text-center tabular-nums">
                    {index + 1}.
                  </span>
                  <input
                    type="text"
                    value={reason.text}
                    onChange={(e) => handleUpdateReason(reason.id, e.target.value)}
                    placeholder="Sevgi nedeni..."
                    className="flex-1 text-xs px-2.5 py-1.5 rounded bg-white border border-stone-200 text-stone-800"
                  />
                  <button
                    onClick={() => handleDeleteReason(reason.id)}
                    className="text-stone-400 hover:text-rose-600 p-1 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 7: Secret Surprise */}
        {activeTab === 'surprise' && (
          <div className="space-y-6 max-w-2xl">
            <h2 className="font-serif-romantic text-lg font-bold text-stone-900 pb-2 border-b border-stone-100">
              Kilitli Soru & Sürpriz Kutu
            </h2>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="surprise_enabled"
                checked={config.surprise.isEnabled}
                onChange={(e) => updateConfig({ surprise: { ...config.surprise, isEnabled: e.target.checked } })}
                className="rounded text-rose-600 focus:ring-0 cursor-pointer"
              />
              <label htmlFor="surprise_enabled" className="text-xs font-semibold text-stone-800 cursor-pointer">
                Sürpriz Kilitli Sandığı Etkinleştir
              </label>
            </div>

            {config.surprise.isEnabled && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Sevgilinize Sorulacak Özel Aşk Sorusu
                  </label>
                  <input
                    type="text"
                    value={config.surprise.question}
                    onChange={(e) => updateConfig({ surprise: { ...config.surprise, question: e.target.value } })}
                    placeholder="Örn: İlk kahvemizi nerede içmiştik?"
                    className="w-full px-3.5 py-2 text-sm rounded-lg border border-stone-200 focus:outline-none focus:ring-1 focus:ring-stone-900"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Doğru Cevap (Büyük/küçük harf duyarsız)
                    </label>
                    <input
                      type="text"
                      value={config.surprise.answer}
                      onChange={(e) => updateConfig({ surprise: { ...config.surprise, answer: e.target.value } })}
                      placeholder="Örn: Kadıköy"
                      className="w-full px-3.5 py-2 text-sm rounded-lg border border-stone-200 focus:outline-none focus:ring-1 focus:ring-stone-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      İpucu (İsteğe bağlı)
                    </label>
                    <input
                      type="text"
                      value={config.surprise.hint}
                      onChange={(e) => updateConfig({ surprise: { ...config.surprise, hint: e.target.value } })}
                      placeholder="Örn: Vapur iskelesine yakın o semt..."
                      className="w-full px-3.5 py-2 text-sm rounded-lg border border-stone-200 focus:outline-none focus:ring-1 focus:ring-stone-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Doğru Bilince Açılacak Sürpriz Mesajı
                  </label>
                  <textarea
                    rows={3}
                    value={config.surprise.revealedMessage}
                    onChange={(e) => updateConfig({ surprise: { ...config.surprise, revealedMessage: e.target.value } })}
                    placeholder="Örn: Tebrikler aşkım! Bu hafta sonu oraya tekrar gidiyoruz ❤️"
                    className="w-full px-3.5 py-2 text-sm rounded-lg border border-stone-200 focus:outline-none focus:ring-1 focus:ring-stone-900 resize-none"
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
