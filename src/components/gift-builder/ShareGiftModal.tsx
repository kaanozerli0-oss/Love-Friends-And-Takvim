import React, { useState } from 'react';
import { 
  X, 
  Copy, 
  Check, 
  ExternalLink, 
  Share2, 
  QrCode, 
  Heart,
  MessageCircle
} from 'lucide-react';
import { GiftPageConfig } from '../../types';
import { encodeGiftToShareUrl } from '../../services/shareService';

interface ShareGiftModalProps {
  config: GiftPageConfig;
  isOpen: boolean;
  onClose: () => void;
  onOpenGiftView: () => void;
}

export const ShareGiftModal: React.FC<ShareGiftModalProps> = ({
  config,
  isOpen,
  onClose,
  onOpenGiftView,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const shareUrl = encodeGiftToShareUrl(config);
  const whatsappText = encodeURIComponent(
    `Sana özel hazırladığım sürpriz hediye web sayfamız burada: ${shareUrl} ❤️`
  );
  const whatsappUrl = `https://api.whatsapp.com/send?text=${whatsappText}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-stone-200 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-stone-400 hover:text-stone-700 p-1 rounded-lg cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 mx-auto flex items-center justify-center shadow-xs">
            <Heart className="w-6 h-6 fill-rose-600" />
          </div>
          <h3 className="font-serif-romantic text-xl sm:text-2xl font-bold text-stone-900">
            Hediye Web Sayfanız Hazır!
          </h3>
          <p className="text-xs sm:text-sm text-stone-500 max-w-sm mx-auto">
            Bu bağlantıyı sevgilinize gönderin. Açtığında tam ekran, müzikli ve interaktif aşk sayfanız karşısına çıkacak.
          </p>
        </div>

        {/* Copy Link Input */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-stone-700">
            Kişisel Hediye Bağlantınız:
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              readOnly
              value={shareUrl}
              className="flex-1 px-3 py-2 text-xs rounded-lg border border-stone-200 bg-stone-50 text-stone-600 select-all focus:outline-none"
            />
            <button
              onClick={handleCopy}
              className="px-3.5 py-2 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-lg flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Kopyalandı!' : 'Kopyala'}</span>
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <MessageCircle className="w-4 h-4" />
            <span>WhatsApp ile Gönder</span>
          </a>

          <button
            onClick={() => {
              onClose();
              onOpenGiftView();
            }}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Sayfayı Hemen Aç</span>
          </button>
        </div>

        {/* QR Code hint */}
        <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 flex items-center gap-3">
          <div className="p-2 rounded-lg bg-white border border-stone-200 text-stone-700">
            <QrCode className="w-6 h-6" />
          </div>
          <div className="text-xs text-stone-600">
            <p className="font-semibold text-stone-800">QR Kod veya Doğrudan Link</p>
            <p className="text-[11px] text-stone-500 mt-0.5">
              Tüm bilgiler şifrelenmiş URL içine yerleştirilmiştir; sevgiliniz herhangi bir kayıt veya giriş yapmadan anında sayfayı görüntüler!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
