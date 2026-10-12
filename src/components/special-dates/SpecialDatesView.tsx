import React, { useState, useEffect } from 'react';
import { 
  Heart, 
  Calendar, 
  Clock, 
  Plus, 
  Trash2, 
  Sparkles, 
  Gift, 
  MapPin, 
  Check 
} from 'lucide-react';
import { SpecialEvent, GiftPageConfig } from '../../types';
import { getStoredEvents, saveStoredEvents } from '../../services/shareService';

interface SpecialDatesViewProps {
  config: GiftPageConfig;
  onNavigateToAiHelper: () => void;
  onOpenGiftStudio: () => void;
}

const DEFAULT_EVENTS: SpecialEvent[] = [
  { id: 'ev1', title: 'Birliktelik Yıldönümümüz 💍', date: '2025-05-18', type: 'anniversary', notes: 'Güneş batımında şık bir akşam yemeği planı.' },
  { id: 'ev2', title: 'Sevgilimin Doğum Günü 🎂', date: '2025-08-14', type: 'birthday', notes: 'Özel hediye kutusu ve sürpriz mektup hazırla.' },
  { id: 'ev3', title: 'Hafta Sonu Doğa Kaçamağı & Piknik 🧺', date: '2025-06-07', type: 'date_night', notes: 'Termos kahve, meyve ve fotoğraf makinesi.' },
];

export const SpecialDatesView: React.FC<SpecialDatesViewProps> = ({
  config,
  onNavigateToAiHelper,
  onOpenGiftStudio,
}) => {
  const [events, setEvents] = useState<SpecialEvent[]>(() => getStoredEvents() || DEFAULT_EVENTS);
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventDate, setNewEventDate] = useState('');
  const [newEventType, setNewEventType] = useState<'anniversary' | 'birthday' | 'date_night' | 'reminder'>('date_night');
  const [newEventNotes, setNewEventNotes] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    saveStoredEvents(events);
  }, [events]);

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEventTitle.trim() || !newEventDate) return;
    const item: SpecialEvent = {
      id: 'ev_' + Date.now(),
      title: newEventTitle.trim(),
      date: newEventDate,
      type: newEventType,
      notes: newEventNotes.trim(),
    };
    setEvents(prev => [...prev, item]);
    setNewEventTitle('');
    setNewEventDate('');
    setNewEventNotes('');
    setShowAddForm(false);
  };

  const handleDeleteEvent = (id: string) => {
    setEvents(prev => prev.filter(e => e.id !== id));
  };

  const getDaysRemaining = (targetDateStr: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const target = new Date(targetDateStr);
    target.setHours(0, 0, 0, 0);
    const diffTime = target.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-rose-600 text-xs font-semibold tracking-wider uppercase mb-1">
            <Heart className="w-4 h-4 fill-rose-600" />
            <span>Geri Sayım & Özel Tarihler</span>
          </div>
          <h1 className="font-serif-romantic text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
            Sevgilinizle Biriktireceğiniz Özel Günler
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1 max-w-xl">
            Yıldönümleri, doğum günleri, planlanan romantik akşamlar ve özel anlarınızı takip edin.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onNavigateToAiHelper}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-stone-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg transition-colors cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Randevu Fikri Üret</span>
          </button>

          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-white bg-stone-900 hover:bg-stone-800 rounded-lg transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Yeni Özel Gün Ekle</span>
          </button>
        </div>
      </div>

      {/* Add Event Form Modal/Accordion */}
      {showAddForm && (
        <form onSubmit={handleAddEvent} className="bg-white rounded-2xl border border-stone-200 p-6 space-y-4 animate-fadeIn">
          <h2 className="text-sm font-semibold text-stone-900 pb-2 border-b border-stone-100">
            Yeni Özel Tarih veya Randevu
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-stone-700 mb-1">Başlık</label>
              <input
                type="text"
                value={newEventTitle}
                onChange={(e) => setNewEventTitle(e.target.value)}
                placeholder="Örn: Boğazda Akşam Yemeği..."
                className="w-full px-3 py-2 text-xs rounded-lg border border-stone-200 text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-900"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Tarih</label>
              <input
                type="date"
                value={newEventDate}
                onChange={(e) => setNewEventDate(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-stone-200 text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-900 cursor-pointer"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Tür</label>
              <select
                value={newEventType}
                onChange={(e: any) => setNewEventType(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-stone-200 text-stone-900 focus:outline-none"
              >
                <option value="date_night">🍷 Romantik Randevu / Buluşma</option>
                <option value="anniversary">💍 Yıldönümü</option>
                <option value="birthday">🎂 Doğum Günü</option>
                <option value="reminder">🔔 Hatırlatıcı</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Not / Plan</label>
              <input
                type="text"
                value={newEventNotes}
                onChange={(e) => setNewEventNotes(e.target.value)}
                placeholder="Rezervasyon yap, çiçek al vb."
                className="w-full px-3 py-2 text-xs rounded-lg border border-stone-200 text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-900"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-3.5 py-1.5 text-xs text-stone-600 hover:text-stone-900 cursor-pointer"
            >
              İptal
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 text-xs font-semibold text-white bg-stone-900 rounded-lg cursor-pointer"
            >
              Kaydet
            </button>
          </div>
        </form>
      )}

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {events.map((ev) => {
          const daysLeft = getDaysRemaining(ev.date);
          const isPast = daysLeft < 0;
          const isToday = daysLeft === 0;

          return (
            <div
              key={ev.id}
              className="bg-white rounded-2xl border border-stone-200 p-5 flex flex-col justify-between space-y-4 hover:border-stone-300 transition-all shadow-xs"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[11px] font-semibold uppercase px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-100">
                    {ev.type === 'anniversary' ? 'Yıldönümü' :
                     ev.type === 'birthday' ? 'Doğum Günü' :
                     ev.type === 'date_night' ? 'Romantik Randevu' : 'Hatırlatıcı'}
                  </span>
                  <button
                    onClick={() => handleDeleteEvent(ev.id)}
                    className="text-stone-300 hover:text-rose-600 p-1 cursor-pointer"
                    title="Sil"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <h3 className="font-serif-romantic text-base font-bold text-stone-900 leading-snug">
                  {ev.title}
                </h3>

                <p className="text-xs text-stone-500 mt-1 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{new Date(ev.date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                </p>

                {ev.notes && (
                  <p className="text-xs text-stone-600 mt-2 p-2 rounded-lg bg-stone-50 border border-stone-100">
                    {ev.notes}
                  </p>
                )}
              </div>

              {/* Countdown status */}
              <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                <span className="text-xs text-stone-500">Kalan Süre:</span>
                <span className={`text-xs font-bold tabular-nums px-2 py-0.5 rounded ${
                  isToday 
                    ? 'bg-rose-600 text-white animate-pulse' 
                    : isPast 
                    ? 'bg-stone-100 text-stone-500' 
                    : 'bg-amber-100 text-amber-900'
                }`}>
                  {isToday ? 'Bugün! 🎉' : isPast ? `${Math.abs(daysLeft)} gün önce geçti` : `${daysLeft} Gün Kaldı`}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
