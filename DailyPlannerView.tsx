import React, { useState, useEffect } from 'react';
import { 
  Calendar as CalendarIcon, 
  CheckCircle2, 
  Circle, 
  Plus, 
  Trash2, 
  Heart, 
  Flame, 
  Smile, 
  Sparkles, 
  Clock, 
  Sun, 
  Sunset, 
  Moon, 
  Coffee,
  Check
} from 'lucide-react';
import { PlannerTask, PlannerHabit, DailyJournal } from '../../types';
import { 
  getStoredTasks, 
  saveStoredTasks, 
  getStoredHabits, 
  saveStoredHabits, 
  getStoredJournal, 
  saveStoredJournal 
} from '../../services/shareService';

const INITIAL_TASKS: PlannerTask[] = [
  { id: 't1', title: 'Günün en önemli 3 önceliğini belirle', timeSlot: 'morning', isCompleted: true, priority: 'high', category: 'work' },
  { id: 't2', title: 'Sevgilime günaydın ses kaydı veya tatlı bir not gönder ❤️', timeSlot: 'morning', isCompleted: true, priority: 'high', category: 'relationship' },
  { id: 't3', title: 'Haftalık hediye web sayfası sürprizini güncelle', timeSlot: 'afternoon', isCompleted: false, priority: 'medium', category: 'relationship' },
  { id: 't4', title: 'Akşam için birlikte izlenecek filmi seç', timeSlot: 'evening', isCompleted: false, priority: 'low', category: 'relationship' },
  { id: 't5', title: 'Yatmadan önce 20 sayfa kitap oku ve dinlen', timeSlot: 'evening', isCompleted: false, priority: 'medium', category: 'personal' },
];

const INITIAL_HABITS: PlannerHabit[] = [
  { id: 'h1', name: '2 Litre Su', icon: '💧', streak: 6, completedDays: [new Date().toISOString().slice(0, 10)] },
  { id: 'h2', name: 'Sevgilime Güzel Söz', icon: '💌', streak: 12, completedDays: [new Date().toISOString().slice(0, 10)] },
  { id: 'h3', name: '30 Dk Yürüyüş / Spor', icon: '🏃', streak: 4, completedDays: [] },
  { id: 'h4', name: 'Kitap & Tefekkür', icon: '📖', streak: 8, completedDays: [new Date().toISOString().slice(0, 10)] },
];

export const DailyPlannerView: React.FC<{ onNavigateToAiHelper?: () => void }> = ({ onNavigateToAiHelper }) => {
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [tasks, setTasks] = useState<PlannerTask[]>(() => getStoredTasks() || INITIAL_TASKS);
  const [habits, setHabits] = useState<PlannerHabit[]>(() => getStoredHabits() || INITIAL_HABITS);
  const [journal, setJournal] = useState<DailyJournal>(() => {
    const saved = getStoredJournal();
    return saved || {
      date: new Date().toISOString().slice(0, 10),
      mainFocus: 'Bugün sakin kalmak, sevgilime değer hissettirmek ve işlerimi zamanında bitirmek.',
      mood: 'romantic',
      gratitudeNote: 'Günün güneşli olması ve sevdiğim insanın hayatımda olması.',
      partnerThought: 'Akşam birlikte kahve içerken ona hazırladığım yeni hediye sayfasını göstereceğim.',
    };
  });

  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskSlot, setNewTaskSlot] = useState<'morning' | 'afternoon' | 'evening'>('morning');
  const [newTaskCategory, setNewTaskCategory] = useState<'personal' | 'work' | 'relationship' | 'health'>('relationship');
  const [newTaskPriority, setNewTaskPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [newHabitName, setNewHabitName] = useState('');
  const [showAddHabit, setShowAddHabit] = useState(false);

  useEffect(() => {
    saveStoredTasks(tasks);
  }, [tasks]);

  useEffect(() => {
    saveStoredHabits(habits);
  }, [habits]);

  useEffect(() => {
    saveStoredJournal(journal);
  }, [journal]);

  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, isCompleted: !t.isCompleted } : t));
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    const task: PlannerTask = {
      id: 'task_' + Date.now(),
      title: newTaskTitle.trim(),
      timeSlot: newTaskSlot,
      isCompleted: false,
      priority: newTaskPriority,
      category: newTaskCategory,
    };
    setTasks(prev => [...prev, task]);
    setNewTaskTitle('');
  };

  const toggleHabit = (id: string) => {
    const today = selectedDate;
    setHabits(prev => prev.map(h => {
      if (h.id !== id) return h;
      const isDone = h.completedDays.includes(today);
      if (isDone) {
        return {
          ...h,
          completedDays: h.completedDays.filter(d => d !== today),
          streak: Math.max(0, h.streak - 1),
        };
      } else {
        return {
          ...h,
          completedDays: [...h.completedDays, today],
          streak: h.streak + 1,
        };
      }
    }));
  };

  const handleAddHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHabitName.trim()) return;
    const habit: PlannerHabit = {
      id: 'habit_' + Date.now(),
      name: newHabitName.trim(),
      icon: '✨',
      streak: 0,
      completedDays: [],
    };
    setHabits(prev => [...prev, habit]);
    setNewHabitName('');
    setShowAddHabit(false);
  };

  const completedTasksCount = tasks.filter(t => t.isCompleted).length;
  const progressPercent = tasks.length > 0 ? Math.round((completedTasksCount / tasks.length) * 100) : 0;

  const renderSlotTasks = (slot: 'morning' | 'afternoon' | 'evening', label: string, Icon: any) => {
    const slotTasks = tasks.filter(t => t.timeSlot === slot);

    return (
      <div className="bg-white rounded-xl border border-stone-200 p-4 transition-all">
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-stone-100 text-stone-700">
              <Icon className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-semibold text-stone-900">{label}</h3>
          </div>
          <span className="text-xs text-stone-500 tabular-nums">
            {slotTasks.filter(t => t.isCompleted).length}/{slotTasks.length} Tamamlandı
          </span>
        </div>

        <div className="mt-3 space-y-2">
          {slotTasks.length === 0 ? (
            <p className="text-xs text-stone-400 py-3 text-center italic">Bu zaman aralığında henüz görev yok</p>
          ) : (
            slotTasks.map(task => (
              <div
                key={task.id}
                className={`flex items-start justify-between gap-3 p-2.5 rounded-lg border transition-all ${
                  task.isCompleted 
                    ? 'bg-stone-50 border-stone-200 text-stone-400' 
                    : 'bg-white border-stone-200 hover:border-stone-300 text-stone-800'
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleTask(task.id)}
                  className="mt-0.5 text-rose-600 hover:text-rose-700 cursor-pointer shrink-0"
                >
                  {task.isCompleted ? (
                    <CheckCircle2 className="w-4 h-4 fill-rose-600 text-white" />
                  ) : (
                    <Circle className="w-4 h-4 text-stone-300 hover:text-stone-500" />
                  )}
                </button>

                <div className="flex-1 min-w-0">
                  <p className={`text-sm leading-snug break-words ${task.isCompleted ? 'line-through text-stone-400' : 'text-stone-800'}`}>
                    {task.title}
                  </p>
                  <div className="flex items-center gap-2 mt-1.5 text-xs text-stone-500">
                    <span className="capitalize">
                      {task.category === 'relationship' ? '❤️ Romantik & Sevgili' : 
                       task.category === 'work' ? '💼 İş & Proje' : 
                       task.category === 'health' ? '🥗 Sağlık' : '🌱 Kişisel'}
                    </span>
                    <span>·</span>
                    <span className={task.priority === 'high' ? 'text-rose-600 font-medium' : ''}>
                      {task.priority === 'high' ? 'Yüksek Öncelik' : task.priority === 'medium' ? 'Normal' : 'Düşük'}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => deleteTask(task.id)}
                  className="text-stone-300 hover:text-rose-600 p-1 rounded transition-colors shrink-0 cursor-pointer"
                  title="Sil"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Planner Header with Hero Image Banner & Focus */}
      <div className="relative overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-xs">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
          <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-stone-100 rounded-lg text-xs font-medium text-stone-700">
                    <CalendarIcon className="w-3.5 h-3.5 text-stone-500" />
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="bg-transparent border-0 focus:outline-none cursor-pointer font-medium text-stone-800"
                    />
                  </div>
                  <span className="text-xs text-stone-500">
                    {new Date(selectedDate).toLocaleDateString('tr-TR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                  </span>
                </div>

                {onNavigateToAiHelper && (
                  <button
                    onClick={onNavigateToAiHelper}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-stone-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg transition-colors cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    <span>Plan İlhamı Al</span>
                  </button>
                )}
              </div>

              <h1 className="mt-4 font-serif-romantic text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight text-balance">
                Günün Planı & Huzurlu Yaşam Ajandası
              </h1>
              
              <div className="mt-4 p-4 rounded-xl bg-stone-50 border border-stone-200">
                <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                  🎯 Bugünün Ana Odak Cümlesi
                </label>
                <input
                  type="text"
                  value={journal.mainFocus}
                  onChange={(e) => setJournal({ ...journal, mainFocus: e.target.value })}
                  placeholder="Bugün benim için en önemli şey..."
                  className="w-full bg-transparent border-0 text-sm font-medium text-stone-800 focus:outline-none placeholder:text-stone-400"
                />
              </div>
            </div>

            {/* Progress stats bar */}
            <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-stone-700">Günün İlerlemesi</span>
                <span className="text-xs text-stone-500 tabular-nums">
                  {completedTasksCount} / {tasks.length} Görev ({progressPercent}%)
                </span>
              </div>
              <div className="w-40 bg-stone-100 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-rose-600 h-full rounded-full transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 relative hidden lg:block min-h-[220px]">
            <img
              src="/src/assets/images/planner_journal_aesthetic_1791827514349.jpg"
              alt="Planlayıcı ve ajanda masası"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-white via-transparent to-transparent" />
          </div>
        </div>
      </div>

      {/* Main Grid: Left Tasks Blocks & Habits, Right Journal & Romantic Notes */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Tasks by Time Slot + Quick Add Task (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Quick Task Add Form */}
          <div className="bg-white rounded-xl border border-stone-200 p-4">
            <h2 className="text-sm font-semibold text-stone-900 mb-3 flex items-center gap-2">
              <Plus className="w-4 h-4 text-rose-600" />
              <span>Yeni Plan / Görev Ekle</span>
            </h2>
            <form onSubmit={addTask} className="space-y-3">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  placeholder="Örn: Akşam sevgilime çiçek al veya raporu hazırla..."
                  className="flex-1 px-3.5 py-2 text-sm rounded-lg border border-stone-200 focus:outline-none focus:ring-1 focus:ring-stone-900 text-stone-800"
                />
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-stone-900 hover:bg-stone-800 rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0"
                >
                  Ekle
                </button>
              </div>

              <div className="flex items-center gap-3 flex-wrap text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="text-stone-500">Zaman:</span>
                  <select
                    value={newTaskSlot}
                    onChange={(e: any) => setNewTaskSlot(e.target.value)}
                    className="px-2 py-1 rounded border border-stone-200 bg-stone-50 text-stone-700 text-xs focus:outline-none"
                  >
                    <option value="morning">Sabah</option>
                    <option value="afternoon">Öğle / İkindi</option>
                    <option value="evening">Akşam / Gece</option>
                  </select>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="text-stone-500">Kategori:</span>
                  <select
                    value={newTaskCategory}
                    onChange={(e: any) => setNewTaskCategory(e.target.value)}
                    className="px-2 py-1 rounded border border-stone-200 bg-stone-50 text-stone-700 text-xs focus:outline-none"
                  >
                    <option value="relationship">❤️ Aşk & Sevgili</option>
                    <option value="work">💼 İş & Çalışma</option>
                    <option value="personal">🌱 Kişisel</option>
                    <option value="health">🥗 Sağlık</option>
                  </select>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="text-stone-500">Öncelik:</span>
                  <select
                    value={newTaskPriority}
                    onChange={(e: any) => setNewTaskPriority(e.target.value)}
                    className="px-2 py-1 rounded border border-stone-200 bg-stone-50 text-stone-700 text-xs focus:outline-none"
                  >
                    <option value="medium">Normal</option>
                    <option value="high">Yüksek</option>
                    <option value="low">Düşük</option>
                  </select>
                </div>
              </div>
            </form>
          </div>

          {/* Time Blocks */}
          <div className="space-y-4">
            {renderSlotTasks('morning', 'Sabah Rutini & Öncelikleri', Sun)}
            {renderSlotTasks('afternoon', 'Öğle & Gün İçi Görevleri', Coffee)}
            {renderSlotTasks('evening', 'Akşam, Huzur & Sevgili Vakti', Sunset)}
          </div>
        </div>

        {/* Right Column: Habits, Mood & Romantic Journal (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Habits & Daily Streaks */}
          <div className="bg-white rounded-xl border border-stone-200 p-5">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-amber-500" />
                <h2 className="text-sm font-semibold text-stone-900">Günlük Alışkanlıklar</h2>
              </div>
              <button
                onClick={() => setShowAddHabit(!showAddHabit)}
                className="text-xs text-rose-600 hover:text-rose-700 font-medium cursor-pointer"
              >
                + Yeni
              </button>
            </div>

            {showAddHabit && (
              <form onSubmit={handleAddHabit} className="mt-3 flex gap-2">
                <input
                  type="text"
                  value={newHabitName}
                  onChange={(e) => setNewHabitName(e.target.value)}
                  placeholder="Alışkanlık adı..."
                  className="flex-1 px-2.5 py-1 text-xs rounded border border-stone-200 text-stone-800"
                />
                <button
                  type="submit"
                  className="px-2.5 py-1 text-xs bg-stone-900 text-white rounded font-medium cursor-pointer"
                >
                  Kaydet
                </button>
              </form>
            )}

            <div className="mt-4 space-y-2.5">
              {habits.map(habit => {
                const isDone = habit.completedDays.includes(selectedDate);
                return (
                  <div
                    key={habit.id}
                    className="flex items-center justify-between p-2.5 rounded-lg border border-stone-100 hover:bg-stone-50 transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-base">{habit.icon}</span>
                      <div>
                        <p className={`text-xs font-medium ${isDone ? 'text-stone-900 font-semibold' : 'text-stone-700'}`}>
                          {habit.name}
                        </p>
                        <span className="text-[10px] text-stone-400 tabular-nums">
                          {habit.streak} gün serisi 🔥
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => toggleHabit(habit.id)}
                      className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all cursor-pointer ${
                        isDone 
                          ? 'bg-rose-600 text-white shadow-xs' 
                          : 'border border-stone-200 text-stone-300 hover:border-stone-400'
                      }`}
                    >
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Daily Mood & Romantic Reflection */}
          <div className="bg-white rounded-xl border border-stone-200 p-5 space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-stone-100">
              <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
              <h2 className="text-sm font-semibold text-stone-900">Günün Modu & Sevgilime Not</h2>
            </div>

            {/* Mood selector */}
            <div>
              <label className="block text-xs text-stone-500 mb-2">Bugünkü Ruh Halin:</label>
              <div className="grid grid-cols-5 gap-1.5 text-center">
                {[
                  { id: 'joyful', label: 'Neşeli', emoji: '😄' },
                  { id: 'romantic', label: 'Aşık', emoji: '🥰' },
                  { id: 'calm', label: 'Huzurlu', emoji: '☕' },
                  { id: 'busy', label: 'Yoğun', emoji: '⚡' },
                  { id: 'tired', label: 'Yorgun', emoji: '🌙' },
                ].map(item => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setJournal({ ...journal, mood: item.id as any })}
                    className={`p-2 rounded-lg text-xs flex flex-col items-center gap-1 transition-all cursor-pointer ${
                      journal.mood === item.id
                        ? 'bg-rose-50 border border-rose-300 font-medium text-rose-900'
                        : 'border border-stone-100 hover:bg-stone-50 text-stone-600'
                    }`}
                  >
                    <span className="text-lg">{item.emoji}</span>
                    <span className="text-[10px]">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Partner thought note */}
            <div>
              <label className="block text-xs text-stone-500 mb-1">
                Bugün Sevgilimi Düşününce Aklıma Gelen:
              </label>
              <textarea
                rows={3}
                value={journal.partnerThought}
                onChange={(e) => setJournal({ ...journal, partnerThought: e.target.value })}
                placeholder="Ona söylemek istediğim güzel bir söz veya sürpriz düşüncesi..."
                className="w-full text-xs p-2.5 rounded-lg border border-stone-200 text-stone-800 focus:outline-none focus:ring-1 focus:ring-stone-900 resize-none"
              />
            </div>

            {/* Gratitude note */}
            <div>
              <label className="block text-xs text-stone-500 mb-1">
                Günün Şükran / Teşekkür Notu:
              </label>
              <input
                type="text"
                value={journal.gratitudeNote}
                onChange={(e) => setJournal({ ...journal, gratitudeNote: e.target.value })}
                placeholder="Bugün minnettar olduğum bir an..."
                className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-stone-200 text-stone-800 focus:outline-none focus:ring-1 focus:ring-stone-900"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
