import React, { useState, useEffect } from 'react';
import { 
  Heart, 
  Music, 
  VolumeX, 
  Sparkles, 
  Check, 
  Lock, 
  Unlock, 
  Share2, 
  ArrowLeft, 
  Gift as GiftIcon, 
  Calendar,
  Clock,
  Send,
  HelpCircle
} from 'lucide-react';
import { GiftPageConfig } from '../../types';
import { THEME_PRESETS } from '../../data/constants';
import { romanticAudio } from '../../services/audioSynthesizer';

interface RomanticGiftPageViewProps {
  config: GiftPageConfig;
  onBackToStudio?: () => void;
  onOpenShareModal?: () => void;
  isStandalone?: boolean;
}

export const RomanticGiftPageView: React.FC<RomanticGiftPageViewProps> = ({
  config,
  onBackToStudio,
  onOpenShareModal,
  isStandalone = false,
}) => {
  const theme = THEME_PRESETS[config.theme] || THEME_PRESETS['velvet-rose'];

  // Music state
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);

  // Wax seal letter state
  const [isLetterOpened, setIsLetterOpened] = useState(false);

  // Love vouchers state (local redeemed state)
  const [vouchers, setVouchers] = useState(config.vouchers);

  // Reasons jar state
  const [activeReasonIndex, setActiveReasonIndex] = useState(0);

  // Secret surprise box state
  const [quizInput, setQuizInput] = useState('');
  const [isSurpriseUnlocked, setIsSurpriseUnlocked] = useState(false);
  const [quizError, setQuizError] = useState(false);
  const [showHint, setShowHint] = useState(false);

  // Live relationship duration counter
  const [elapsedTime, setElapsedTime] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTime = () => {
      const start = new Date(config.couple.relationshipStartDate).getTime();
      const now = new Date().getTime();
      const diff = Math.max(0, now - start);

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setElapsedTime({ days, hours, minutes, seconds });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [config.couple.relationshipStartDate]);

  const toggleMusic = () => {
    romanticAudio.setMelody(config.backgroundMusic.melody);
    const active = romanticAudio.toggle();
    setIsPlayingMusic(active);
  };

  const handleRedeemVoucher = (id: string) => {
    setVouchers(prev => prev.map(v => {
      if (v.id === id) {
        return {
          ...v,
          isRedeemed: true,
          redeemedDate: new Date().toLocaleDateString('tr-TR'),
        };
      }
      return v;
    }));
  };

  const handleCheckQuiz = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanAnswer = config.surprise.answer.trim().toLowerCase();
    const cleanInput = quizInput.trim().toLowerCase();

    if (cleanInput && (cleanInput === cleanAnswer || cleanAnswer.includes(cleanInput) || cleanInput.includes(cleanAnswer))) {
      setIsSurpriseUnlocked(true);
      setQuizError(false);
    } else {
      setQuizError(true);
      setTimeout(() => setQuizError(false), 2500);
    }
  };

  const handleNextReason = () => {
    setActiveReasonIndex((prev) => (prev + 1) % config.reasons.length);
  };

  return (
    <div className={`min-h-screen bg-gradient-to-b ${theme.bgGradient} ${theme.textColor} transition-colors duration-500 relative overflow-hidden pb-24`}>
      {/* Gentle Floating Hearts Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 opacity-25">
        <div className="absolute top-1/4 left-10 text-rose-400 animate-float-heart text-2xl">❤️</div>
        <div className="absolute top-1/2 right-12 text-rose-300 animate-float-heart text-xl [animation-delay:1.5s]">💖</div>
        <div className="absolute top-3/4 left-1/3 text-amber-300 animate-float-heart text-lg [animation-delay:2.2s]">✨</div>
        <div className="absolute top-1/3 right-1/4 text-rose-400 animate-float-heart text-xl [animation-delay:0.8s]">💕</div>
      </div>

      {/* Floating Control Bar */}
      <div className="sticky top-4 z-50 max-w-5xl mx-auto px-4 flex items-center justify-between pointer-events-auto">
        {onBackToStudio ? (
          <button
            onClick={onBackToStudio}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md text-white text-xs font-medium border border-white/10 transition-colors shadow-sm cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Stüdyoya Dön</span>
          </button>
        ) : (
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/40 backdrop-blur-md text-white/90 text-xs font-medium border border-white/10">
            <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
            <span>Sana Özel Hazırlandı</span>
          </div>
        )}

        <div className="flex items-center gap-2">
          {/* Ambient Music Button */}
          <button
            onClick={toggleMusic}
            title={isPlayingMusic ? 'Müziği Durdur' : 'Romantik Müziği Başlat'}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium backdrop-blur-md transition-all cursor-pointer shadow-sm ${
              isPlayingMusic 
                ? 'bg-rose-600 text-white border border-rose-400/50 glow-romantic' 
                : 'bg-black/40 hover:bg-black/60 text-white/90 border border-white/10'
            }`}
          >
            {isPlayingMusic ? (
              <>
                <Music className="w-3.5 h-3.5 animate-bounce" />
                <span>Melodi Çalıyor 🎵</span>
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5" />
                <span>Müziği Başlat</span>
              </>
            )}
          </button>

          {onOpenShareModal && (
            <button
              onClick={onOpenShareModal}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md text-white text-xs font-medium border border-white/20 transition-colors cursor-pointer shadow-sm"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Paylaş</span>
            </button>
          )}
        </div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 pt-8 space-y-16">
        {/* 1. Romantic Hero Section */}
        <section className="text-center pt-6 space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs tracking-wider uppercase">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Bizim Sonsuz Hikayemiz</span>
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          </div>

          <h1 className="font-serif-romantic text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white drop-shadow-sm text-balance">
            {config.couple.mainHeadline}
          </h1>

          <div className="flex items-center justify-center gap-3 text-lg sm:text-2xl font-serif-romantic italic text-rose-200">
            <span>{config.couple.yourName}</span>
            <Heart className="w-5 h-5 text-rose-400 fill-rose-400 animate-pulse" />
            <span>{config.couple.partnerName}</span>
          </div>

          <p className="max-w-xl mx-auto text-sm sm:text-base opacity-90 leading-relaxed font-light text-balance">
            {config.couple.subtitle}
          </p>

          {/* Live Relationship Counter Box */}
          <div className={`mt-8 p-6 sm:p-8 rounded-2xl ${theme.cardBg} border ${theme.cardBorder} shadow-xl max-w-2xl mx-auto`}>
            <div className="flex items-center justify-center gap-2 mb-4 text-xs font-medium tracking-wide uppercase opacity-80">
              <Clock className="w-3.5 h-3.5" />
              <span>Birlikte Geçen Her Anımız</span>
            </div>

            <div className="grid grid-cols-4 gap-2 sm:gap-4 text-center">
              <div className="p-2 sm:p-3 rounded-xl bg-black/20 border border-white/10">
                <span className="block text-2xl sm:text-4xl font-bold font-serif-romantic tabular-nums text-white">
                  {elapsedTime.days}
                </span>
                <span className="text-[11px] sm:text-xs opacity-75">Gün</span>
              </div>
              <div className="p-2 sm:p-3 rounded-xl bg-black/20 border border-white/10">
                <span className="block text-2xl sm:text-4xl font-bold font-serif-romantic tabular-nums text-white">
                  {elapsedTime.hours}
                </span>
                <span className="text-[11px] sm:text-xs opacity-75">Saat</span>
              </div>
              <div className="p-2 sm:p-3 rounded-xl bg-black/20 border border-white/10">
                <span className="block text-2xl sm:text-4xl font-bold font-serif-romantic tabular-nums text-white">
                  {elapsedTime.minutes}
                </span>
                <span className="text-[11px] sm:text-xs opacity-75">Dakika</span>
              </div>
              <div className="p-2 sm:p-3 rounded-xl bg-black/20 border border-white/10">
                <span className="block text-2xl sm:text-4xl font-bold font-serif-romantic tabular-nums text-rose-300">
                  {elapsedTime.seconds}
                </span>
                <span className="text-[11px] sm:text-xs opacity-75">Saniye</span>
              </div>
            </div>

            <p className="mt-4 text-xs opacity-70 text-center">
              {new Date(config.couple.relationshipStartDate).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })} tarihinden beri kalbim seninle atıyor...
            </p>
          </div>
        </section>

        {/* 2. Interactive Wax-Sealed Romantic Letter */}
        <section className="space-y-6">
          <div className="text-center space-y-2">
            <span className="text-xs font-medium uppercase tracking-widest text-rose-300">Özel Mektup</span>
            <h2 className="font-serif-romantic text-2xl sm:text-3xl font-bold text-white">
              Sadece Senin İçin Yazıldı
            </h2>
          </div>

          <div className="max-w-2xl mx-auto">
            {!isLetterOpened ? (
              /* Closed Envelope with Wax Seal Stamp */
              <div 
                onClick={() => setIsLetterOpened(true)}
                className={`relative p-8 sm:p-12 rounded-2xl ${theme.cardBg} border ${theme.cardBorder} text-center cursor-pointer group hover:scale-[1.01] transition-all duration-300 shadow-2xl`}
              >
                <div className="flex flex-col items-center justify-center space-y-6">
                  {/* Wax Seal Stamp Button */}
                  <div 
                    className="w-20 h-20 rounded-full flex items-center justify-center shadow-lg transition-transform group-hover:scale-110 cursor-pointer"
                    style={{ backgroundColor: theme.sealColor }}
                  >
                    <Heart className="w-10 h-10 text-amber-200 fill-amber-200" />
                  </div>

                  <div>
                    <h3 className="font-serif-romantic text-xl font-bold text-white mb-2">
                      {config.couple.partnerName} için Mühürlü Zarf
                    </h3>
                    <p className="text-xs sm:text-sm opacity-80 max-w-sm mx-auto">
                      Mühüre tıkla ve kalbimden dökülen satırları aç...
                    </p>
                  </div>

                  <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium bg-white/10 border border-white/20 text-white group-hover:bg-white/20 transition-colors">
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    <span>Mührü Kır & Mektubu Oku</span>
                  </span>
                </div>
              </div>
            ) : (
              /* Opened Romantic Parchment Letter */
              <div className="relative p-8 sm:p-12 rounded-2xl bg-amber-50 text-stone-900 border border-amber-200 shadow-2xl space-y-6 transition-all duration-500 animate-fadeIn">
                <div className="flex items-center justify-between border-b border-stone-200 pb-4">
                  <div className="flex items-center gap-2">
                    <Heart className="w-5 h-5 text-rose-600 fill-rose-600" />
                    <span className="text-xs font-semibold text-rose-800 uppercase tracking-wider">
                      Özel Aşk Mektubu
                    </span>
                  </div>
                  <button
                    onClick={() => setIsLetterOpened(false)}
                    className="text-xs text-stone-400 hover:text-stone-700 cursor-pointer"
                  >
                    Zarfı Tekrar Kapat
                  </button>
                </div>

                <h3 className="font-serif-romantic text-xl sm:text-2xl font-bold text-stone-900">
                  {config.letter.title}
                </h3>

                <div className="font-serif-romantic text-sm sm:text-base leading-relaxed text-stone-800 whitespace-pre-line space-y-4">
                  {config.letter.content}
                </div>

                <div className="pt-6 border-t border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="text-xs italic text-stone-500">
                    {config.letter.postScript}
                  </div>
                  <div className="text-right">
                    <span className="font-serif-romantic italic text-base font-semibold text-rose-900">
                      — {config.letter.signature}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* 3. Romantic Moments & Photo Timeline */}
        {config.moments && config.moments.length > 0 && (
          <section className="space-y-8">
            <div className="text-center space-y-2">
              <span className="text-xs font-medium uppercase tracking-widest text-rose-300">Anı Defteri</span>
              <h2 className="font-serif-romantic text-2xl sm:text-3xl font-bold text-white">
                Unutulmaz Hatıralarımız
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {config.moments.map((moment) => (
                <div
                  key={moment.id}
                  className={`rounded-2xl ${theme.cardBg} border ${theme.cardBorder} overflow-hidden shadow-lg flex flex-col justify-between group hover:scale-[1.01] transition-all`}
                >
                  {moment.imageUrl ? (
                    <div className="relative h-48 overflow-hidden bg-black/40">
                      <img
                        src={moment.imageUrl}
                        alt={moment.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-[11px] font-medium text-white border border-white/10">
                        {moment.category}
                      </div>
                    </div>
                  ) : (
                    <div className="h-28 bg-gradient-to-br from-rose-900/40 to-black/40 flex items-center justify-center p-4">
                      <Heart className="w-8 h-8 text-rose-400/50" />
                    </div>
                  )}

                  <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <div className="flex items-center gap-2 text-xs text-rose-300 font-medium mb-1">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{moment.date}</span>
                      </div>
                      <h4 className="font-serif-romantic text-base font-bold text-white leading-snug">
                        {moment.title}
                      </h4>
                      <p className="mt-2 text-xs opacity-80 leading-relaxed">
                        {moment.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 4. Interactive Love Vouchers (Aşk Kuponları) */}
        {vouchers && vouchers.length > 0 && (
          <section className="space-y-6">
            <div className="text-center space-y-2">
              <span className="text-xs font-medium uppercase tracking-widest text-rose-300">Özel Haklar</span>
              <h2 className="font-serif-romantic text-2xl sm:text-3xl font-bold text-white">
                İnteraktif Aşk Kuponları
              </h2>
              <p className="text-xs opacity-80 max-w-md mx-auto">
                Bu kuponları dilediğin an kullanabilirsin! Beğendiğin kupona tıkla ve &quot;Kullan&quot; damgasını vur.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {vouchers.map((voucher) => (
                <div
                  key={voucher.id}
                  className={`relative p-5 rounded-xl border transition-all ${
                    voucher.isRedeemed 
                      ? 'bg-black/30 border-white/10 opacity-70' 
                      : `${theme.cardBg} ${theme.cardBorder} hover:border-rose-400/50 shadow-md`
                  }`}
                >
                  {/* Redeemed Stamp Overlay */}
                  {voucher.isRedeemed && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none rotate-[-12deg] z-20">
                      <div className="px-4 py-2 border-2 border-rose-500 text-rose-400 rounded-lg font-bold text-sm tracking-wider uppercase bg-black/75 shadow-lg">
                        ✓ KULLANILDI ({voucher.redeemedDate || 'Bugün'})
                      </div>
                    </div>
                  )}

                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="p-2 rounded-lg bg-rose-500/20 text-rose-300">
                      <GiftIcon className="w-4 h-4" />
                    </div>
                    {!voucher.isRedeemed ? (
                      <button
                        onClick={() => handleRedeemVoucher(voucher.id)}
                        className="px-2.5 py-1 text-xs font-medium rounded-md bg-rose-600 hover:bg-rose-500 text-white transition-colors cursor-pointer shadow-xs"
                      >
                        Kuponu Kullan
                      </button>
                    ) : (
                      <span className="text-[11px] text-stone-400 flex items-center gap-1">
                        <Check className="w-3 h-3 text-rose-400" />
                        Kullanıldı
                      </span>
                    )}
                  </div>

                  <h4 className="font-serif-romantic text-sm font-bold text-white mb-1">
                    {voucher.title}
                  </h4>
                  <p className="text-xs opacity-75 leading-relaxed">
                    {voucher.description}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 5. "Neden Seni Seviyorum?" Interactive Reasons Jar */}
        {config.reasons && config.reasons.length > 0 && (
          <section className="space-y-6">
            <div className="text-center space-y-2">
              <span className="text-xs font-medium uppercase tracking-widest text-rose-300">Sonsuz Sevgi</span>
              <h2 className="font-serif-romantic text-2xl sm:text-3xl font-bold text-white">
                Seni Neden Bu Kadar Çok Seviyorum?
              </h2>
            </div>

            <div className={`p-8 sm:p-10 rounded-2xl ${theme.cardBg} border ${theme.cardBorder} text-center max-w-xl mx-auto shadow-xl relative overflow-hidden`}>
              <div className="w-12 h-12 rounded-full bg-rose-500/20 text-rose-400 mx-auto flex items-center justify-center mb-4">
                <Heart className="w-6 h-6 fill-rose-500" />
              </div>

              <div className="min-h-[90px] flex items-center justify-center">
                <p className="font-serif-romantic text-base sm:text-lg italic text-white leading-relaxed">
                  &ldquo;{config.reasons[activeReasonIndex].text}&rdquo;
                </p>
              </div>

              <div className="mt-6 flex items-center justify-between pt-4 border-t border-white/10">
                <span className="text-xs opacity-60 tabular-nums">
                  {activeReasonIndex + 1} / {config.reasons.length} Neden
                </span>
                <button
                  onClick={handleNextReason}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium bg-white/15 hover:bg-white/25 text-white transition-colors cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>Bir Sonraki Neden</span>
                </button>
              </div>
            </div>
          </section>
        )}

        {/* 6. Secret Locked Surprise Box */}
        {config.surprise && config.surprise.isEnabled && (
          <section className="space-y-6">
            <div className="text-center space-y-2">
              <span className="text-xs font-medium uppercase tracking-widest text-rose-300">Gizli Sandık</span>
              <h2 className="font-serif-romantic text-2xl sm:text-3xl font-bold text-white">
                Aşk Sorusu & Sürpriz Kilit
              </h2>
            </div>

            <div className={`p-6 sm:p-8 rounded-2xl ${theme.cardBg} border ${theme.cardBorder} max-w-lg mx-auto shadow-xl`}>
              {!isSurpriseUnlocked ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-300">
                      <Lock className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-white">
                        Özel Soru: {config.surprise.question}
                      </h4>
                      <p className="text-xs opacity-75">
                        Doğru cevabı yazarak kilidi aç ve sürprizi keşfet!
                      </p>
                    </div>
                  </div>

                  <form onSubmit={handleCheckQuiz} className="space-y-3">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={quizInput}
                        onChange={(e) => setQuizInput(e.target.value)}
                        placeholder="Cevabını buraya yaz..."
                        className="flex-1 px-3.5 py-2 text-xs sm:text-sm rounded-lg bg-black/40 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:border-rose-400"
                      />
                      <button
                        type="submit"
                        className="px-4 py-2 rounded-lg text-xs font-semibold bg-rose-600 hover:bg-rose-500 text-white transition-colors cursor-pointer whitespace-nowrap"
                      >
                        Kilidi Aç
                      </button>
                    </div>

                    {quizError && (
                      <p className="text-xs text-rose-400">
                        Cevap tam olarak bu değil sevgilim, tekrar dene veya ipucuna bak! ❤️
                      </p>
                    )}

                    {config.surprise.hint && (
                      <div className="text-right">
                        <button
                          type="button"
                          onClick={() => setShowHint(!showHint)}
                          className="text-[11px] text-amber-300/80 hover:text-amber-300 underline cursor-pointer"
                        >
                          {showHint ? `İpucu: ${config.surprise.hint}` : 'İpucu Al'}
                        </button>
                      </div>
                    )}
                  </form>
                </div>
              ) : (
                <div className="text-center space-y-4 py-4 animate-fadeIn">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center">
                    <Unlock className="w-6 h-6" />
                  </div>
                  <h4 className="font-serif-romantic text-lg font-bold text-emerald-300">
                    Kilit Açıldı! İşte Özel Sürprizin:
                  </h4>
                  <div className="p-4 rounded-xl bg-black/40 border border-emerald-500/30 text-xs sm:text-sm text-white font-medium leading-relaxed">
                    {config.surprise.revealedMessage}
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Romantic Footer Note */}
        <footer className="pt-12 text-center border-t border-white/10 space-y-3 opacity-80">
          <p className="font-serif-romantic text-sm italic">
            &ldquo;Seni dünden çok, yarından az seviyorum...&rdquo;
          </p>
          <p className="text-xs opacity-60">
            {config.couple.yourName} & {config.couple.partnerName} · Sonsuza Dek
          </p>
        </footer>
      </div>
    </div>
  );
};
