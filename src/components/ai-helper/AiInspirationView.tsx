import React, { useState } from 'react';
import { 
  Sparkles, 
  Heart, 
  Send, 
  Copy, 
  Check, 
  Gift, 
  ArrowRight, 
  Compass, 
  MessageSquareHeart,
  CalendarCheck
} from 'lucide-react';
import { GiftPageConfig } from '../../types';

interface AiInspirationViewProps {
  config: GiftPageConfig;
  onUpdateConfig: (newConfig: GiftPageConfig) => void;
  onNavigateToBuilder: () => void;
  onNavigateToPlanner: () => void;
}

export const AiInspirationView: React.FC<AiInspirationViewProps> = ({
  config,
  onUpdateConfig,
  onNavigateToBuilder,
  onNavigateToPlanner,
}) => {
  const [mode, setMode] = useState<'letter' | 'date_ideas' | 'reasons' | 'planner'>('letter');
  const [partnerName, setPartnerName] = useState(config.couple.partnerName);
  const [userName, setUserName] = useState(config.couple.yourName);
  const [details, setDetails] = useState('');
  const [tone, setTone] = useState('Duygusal ve şiirsel');
  const [loading, setLoading] = useState(false);
  const [resultText, setResultText] = useState('');
  const [copied, setCopied] = useState(false);
  const [transferredNotice, setTransferredNotice] = useState(false);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResultText('');
    setTransferredNotice(false);

    try {
      const res = await fetch('/api/ai/romantic-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode,
          partnerName,
          userName,
          details: details.trim() || undefined,
          tone,
          relationshipLength: config.couple.relationshipStartDate,
        }),
      });

      const data = await res.json();
      if (data.success && data.result) {
        setResultText(data.result);
      } else {
        setResultText(data.error || 'Üretim tamamlanamadı.');
      }
    } catch (err: any) {
      console.error(err);
      setResultText('Sunucu ile iletişim kurulurken bir sorun oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!resultText) return;
    navigator.clipboard.writeText(resultText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleTransferToGift = () => {
    if (!resultText) return;
    if (mode === 'letter') {
      onUpdateConfig({
        ...config,
        letter: {
          ...config.letter,
          content: resultText,
        },
      });
      setTransferredNotice(true);
      setTimeout(() => setTransferredNotice(false), 3000);
    } else if (mode === 'reasons') {
      const lines = resultText
        .split('\n')
        .map(l => l.replace(/^[-*0-9.]+\s*/, '').trim())
        .filter(l => l.length > 5);

      if (lines.length > 0) {
        const newReasons = lines.map((text, idx) => ({
          id: 'r_ai_' + Date.now() + '_' + idx,
          text,
        }));
        onUpdateConfig({
          ...config,
          reasons: [...config.reasons, ...newReasons],
        });
        setTransferredNotice(true);
        setTimeout(() => setTransferredNotice(false), 3000);
      }
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-amber-600 text-xs font-semibold tracking-wider uppercase mb-1">
            <Sparkles className="w-4 h-4" />
            <span>Gemini Yapay Zeka Destekli İlham Stüdyosu</span>
          </div>
          <h1 className="font-serif-romantic text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
            Romantik Mektuplar, Randevu Fikirleri & Plan İlhamı
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1 max-w-xl">
            Tıkanıp kaldığınızda veya sevgilinizi büyüleyecek kelimeler aradığınızda akıllı ilham periniz yanınızda.
          </p>
        </div>
      </div>

      {/* Mode Selector Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {[
          { id: 'letter', label: 'Aşk Mektubu Yaz', icon: MessageSquareHeart },
          { id: 'date_ideas', label: 'Randevu & Sürpriz', icon: Compass },
          { id: 'reasons', label: 'Neden Seviyorum?', icon: Heart },
          { id: 'planner', label: 'Plan & Motivasyon', icon: CalendarCheck },
        ].map(item => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => {
                setMode(item.id as any);
                setResultText('');
              }}
              className={`flex items-center justify-center gap-2 p-3 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
                mode === item.id
                  ? 'bg-stone-900 text-white border-stone-900 shadow-xs'
                  : 'bg-white border-stone-200 hover:bg-stone-50 text-stone-700'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Input Form (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-stone-200 p-6 space-y-4">
          <h2 className="text-sm font-semibold text-stone-900 pb-2 border-b border-stone-100 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>{mode === 'letter' ? 'Mektup Parametreleri' : mode === 'date_ideas' ? 'Randevu Tercihleri' : mode === 'reasons' ? 'Sevgi Detayları' : 'Günlük Durum'}</span>
          </h2>

          <form onSubmit={handleGenerate} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Sevgilinizin İsmi</label>
                <input
                  type="text"
                  value={partnerName}
                  onChange={(e) => setPartnerName(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-stone-200 text-stone-800"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Sizin İsminiz</label>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-stone-200 text-stone-800"
                />
              </div>
            </div>

            {mode === 'letter' && (
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Yazım Tonu</label>
                <select
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-stone-200 text-stone-800"
                >
                  <option value="Duygusal, içten ve derin">Duygusal, içten ve derin</option>
                  <option value="Şiirsel, nostaljik ve romantik">Şiirsel, nostaljik ve romantik</option>
                  <option value="Neşeli, tatlı ve hafif eğlenceli">Neşeli, tatlı ve hafif eğlenceli</option>
                  <option value="Yıldönümü ve gelecek hayalleri odaklı">Yıldönümü ve gelecek hayalleri odaklı</option>
                </select>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Özel Anılar veya İstediğiniz Vurgular (İsteğe bağlı)
              </label>
              <textarea
                rows={3}
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder={
                  mode === 'letter'
                    ? 'Örn: İlk kahvemiz, gülüşü, beraber dinlediğimiz şarkı...'
                    : mode === 'date_ideas'
                    ? 'Örn: Evde sakin bir akşam, bütçe dostu, sürprizli...'
                    : mode === 'reasons'
                    ? 'Örn: Bana hissettirdiği güven, yemek yapışı, şefkati...'
                    : 'Örn: Bugün enerjim biraz düşük ama işlerimi bitirip sevgilime vakit ayırmak istiyorum...'
                }
                className="w-full px-3 py-2 text-xs rounded-lg border border-stone-200 text-stone-800 resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 shadow-xs transition-all cursor-pointer disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4" />
              <span>{loading ? 'Yapay Zeka Hazırlıyor...' : 'Oluştur'}</span>
            </button>
          </form>
        </div>

        {/* Right: Output Result View (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-stone-200 p-6 space-y-4 min-h-[380px] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h2 className="text-sm font-semibold text-stone-900">
                Oluşturulan İçerik
              </h2>

              {resultText && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 px-2.5 py-1 text-xs text-stone-600 hover:text-stone-900 bg-stone-100 rounded-md cursor-pointer"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Kopyalandı' : 'Kopyala'}</span>
                  </button>

                  {(mode === 'letter' || mode === 'reasons') && (
                    <button
                      onClick={handleTransferToGift}
                      className="flex items-center gap-1.5 px-2.5 py-1 text-xs text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-md font-medium cursor-pointer"
                    >
                      <Gift className="w-3.5 h-3.5" />
                      <span>Hediye Sayfasına Aktar</span>
                    </button>
                  )}
                </div>
              )}
            </div>

            {transferredNotice && (
              <div className="mt-2 p-2 rounded bg-emerald-50 text-emerald-800 text-xs font-medium border border-emerald-200 animate-fadeIn flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5" />
                <span>İçerik başarıyla Hediye Sayfası Stüdyonuza eklendi!</span>
              </div>
            )}

            <div className="mt-4">
              {loading ? (
                <div className="py-16 text-center space-y-3">
                  <div className="w-10 h-10 border-2 border-rose-600 border-t-transparent rounded-full animate-spin mx-auto" />
                  <p className="text-xs text-stone-500 font-serif-romantic italic">
                    Kelimeler kalpten süzülüyor, lütfen bekleyin...
                  </p>
                </div>
              ) : resultText ? (
                <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 text-stone-800 text-xs sm:text-sm leading-relaxed whitespace-pre-line font-serif-romantic">
                  {resultText}
                </div>
              ) : (
                <div className="py-20 text-center text-stone-400 space-y-2">
                  <Sparkles className="w-8 h-8 text-stone-300 mx-auto" />
                  <p className="text-xs">
                    Sol taraftaki bilgileri doldurup &quot;Oluştur&quot; butonuna basarak kişiye özel aşk mektubu veya öneriler hazırlayabilirsiniz.
                  </p>
                </div>
              )}
            </div>
          </div>

          {resultText && (
            <div className="pt-4 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
              <span>Beğendiğiniz kısımları istediğiniz gibi düzenleyebilirsiniz.</span>
              <button
                onClick={onNavigateToBuilder}
                className="text-rose-600 hover:text-rose-700 font-medium flex items-center gap-1 cursor-pointer"
              >
                <span>Hediye Stüdyosunda Gör</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
