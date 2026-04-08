import React, { useState, useEffect, useRef } from 'react';
import { supabase } from './supabase';
import { Calendar as CalendarIcon, Plus, FileText, Settings, Users, ChevronLeft, ChevronRight, Camera, Bell, X, Check, Trash2, Edit3, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, startOfWeek, endOfWeek, parseISO, addDays } from 'date-fns';
import { ja } from 'date-fns/locale';
import './App.css';

const INITIAL_FAMILY_MEMBERS = [
  { id: 'all', name: '全員', color: '#7d7d7d', icon: '🏠' },
  { id: 'papa', name: 'パパ', color: '#4fc3f7', icon: '👨' },
  { id: 'mama', name: 'ママ', color: '#f06292', icon: '👩' },
  { id: 'yuki', name: '幸', color: '#81c784', icon: '👧' },
  { id: 'nozomi', name: '希', color: '#ffb74d', icon: '👧' },
  { id: 'akira', name: '晃', color: '#9575cd', icon: '👦' },
];

const INITIAL_EVENTS = [];

function App() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedMember, setSelectedMember] = useState('全員');
  const [showOcrModal, setShowOcrModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showEventDetail, setShowEventDetail] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  
  const [familyMembers, setFamilyMembers] = useState(() => {
    const saved = localStorage.getItem('ohana-family');
    if (saved) {
      const parsed = JSON.parse(saved);
      return parsed.map((m, i) => ({ ...m, id: m.id || `legacy_${i}`, icon: m.icon || '👤' }));
    }
    return INITIAL_FAMILY_MEMBERS;
  });

  const [familyMemo, setFamilyMemo] = useState(() => {
    return localStorage.getItem('ohana-memo') || '週末はキャンプの準備を忘れずに！';
  });

  const [events, setEvents] = useState(() => {
    const saved = localStorage.getItem('ohana-events');
    if (saved) {
      return JSON.parse(saved).map(e => ({ 
        ...e, 
        date: new Date(e.date),
        family: Array.isArray(e.family) ? e.family : [e.family] 
      }));
    }
    return INITIAL_EVENTS.map(e => ({ 
      ...e, 
      date: new Date(e.date),
      family: Array.isArray(e.family) ? e.family : [e.family] 
    }));
  });

  useEffect(() => {
    localStorage.setItem('ohana-family', JSON.stringify(familyMembers));
  }, [familyMembers]);

  useEffect(() => {
    localStorage.setItem('ohana-memo', familyMemo);
  }, [familyMemo]);

  useEffect(() => {
    localStorage.setItem('ohana-events', JSON.stringify(events));
  }, [events]);

  const prevEvents = useRef(JSON.stringify(events));
  const prevFamily = useRef(JSON.stringify(familyMembers));
  const prevMemo = useRef(familyMemo);

  useEffect(() => {
    if (!supabase) return;
    
    let isMounted = true;
    
    const parseAndSet = (data) => {
      if (!isMounted) return;
      if (data.family && data.family !== prevFamily.current) {
        prevFamily.current = data.family;
        setFamilyMembers(JSON.parse(data.family));
      }
      if (data.events && data.events !== prevEvents.current) {
        prevEvents.current = data.events;
        const parsed = JSON.parse(data.events);
        setEvents(parsed.map(e => ({...e, date: new Date(e.date)})));
      }
      if (data.memo && data.memo !== prevMemo.current) {
        prevMemo.current = data.memo;
        setFamilyMemo(data.memo);
      }
    };

    const fetchInitial = async () => {
      try {
        const { data, error } = await supabase.from('calendar_state').select('*').eq('id', 1).single();
        if (data) parseAndSet(data);
      } catch (err) {
        console.error('Supabase fetch error:', err);
      }
    };
    fetchInitial();

    const channel = supabase.channel('calendar_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'calendar_state', filter: 'id=eq.1' }, (payload) => {
        if (payload.new) parseAndSet(payload.new);
      })
      .subscribe();

    return () => {
      isMounted = false;
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    if (!supabase) return;
    
    const syncToDb = async () => {
      const currentEventsStr = JSON.stringify(events);
      const currentFamilyStr = JSON.stringify(familyMembers);
      
      let needsUpdate = false;
      if (prevEvents.current !== currentEventsStr) {
        prevEvents.current = currentEventsStr;
        needsUpdate = true;
      }
      if (prevFamily.current !== currentFamilyStr) {
        prevFamily.current = currentFamilyStr;
        needsUpdate = true;
      }
      if (prevMemo.current !== familyMemo) {
        prevMemo.current = familyMemo;
        needsUpdate = true;
      }

      if (needsUpdate) {
        try {
          await supabase.from('calendar_state').upsert({
            id: 1,
            events: currentEventsStr,
            family: currentFamilyStr,
            memo: familyMemo
          });
        } catch (err) {
          console.error("Supabase upsert error:", err);
        }
      }
    };
    const to = setTimeout(syncToDb, 1000);
    return () => clearTimeout(to);
  }, [events, familyMembers, familyMemo]);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);
  const days = eachDayOfInterval({ start: startDate, end: endDate });

  const today = new Date();
  const next7Days = Array.from({ length: 7 }).map((_, i) => addDays(today, i));

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  const handleFileUpload = (e) => {
    setIsScanning(true);
    // Simulate OCR and AI Analysis
    setTimeout(() => {
      const newEvent = {
        id: Date.now(),
        date: new Date(2026, 3, 28),
        title: '（自動抽出）給食なし・午前授業',
        color: '#81c784',
        family: '幸',
        type: '学校プリント'
      };
      setEvents(prev => [...prev, newEvent]);
      setIsScanning(false);
      setShowOcrModal(false);
      // Nice toast or alert? Just a modal for real feel?
    }, 2500);
  };

  const filteredEvents = selectedMember === '全員' 
    ? events 
    : events.filter(e => {
        const families = Array.isArray(e.family) ? e.family : [e.family];
        return families.includes(selectedMember) || families.includes('全員');
      });

  return (
    <div className="app-container">
      <header className="app-header glass-card">
        <div className="header-left">
          <motion.div animate={{ rotate: [0, 5, -5, 0] }} transition={{ repeat: Infinity, duration: 5 }}>
            <CalendarIcon className="icon-main" />
          </motion.div>
          <h1>細越家 カレンダー</h1>
        </div>
        
        <div className="family-filter">
          {familyMembers.map(m => (
            <button 
              key={m.id || m.name} 
              className={`filter-btn ${selectedMember === m.name ? 'active' : ''}`}
              onClick={() => setSelectedMember(m.name)}
              style={{ '--member-color': m.color }}
            >
              {m.name}
            </button>
          ))}
        </div>

        <div className="header-right">
          <div className="user-avatars">
            {familyMembers.filter(m => m.name !== '全員').slice(0, 4).map(m => (
              <div key={m.id || m.name} className="avatar-small emoji-avatar" style={{ backgroundColor: m.color }}>
                {m.icon}
              </div>
            ))}
            {familyMembers.filter(m => m.name !== '全員').length > 4 && (
              <div className="avatar-small emoji-avatar extra-avatar">+</div>
            )}
          </div>
          <button className="icon-btn" onClick={() => setShowSettingsModal(true)}><Settings size={22} /></button>
        </div>
      </header>

      <main className="main-layout">
        <aside className="sidebar">
          <section className="upcoming-events glass-card">
            <h3>予定カレンダー (1週間)</h3>
            <div className="weekly-calendar">
              {next7Days.map(day => {
                const dayEvents = events.filter(e => isSameDay(e.date, day)).sort((a, b) => {
                  if (!a.time && !b.time) return 0;
                  if (!a.time) return -1;
                  if (!b.time) return 1;
                  return a.time.localeCompare(b.time);
                });
                return (
                  <div key={day.toString()} className={`weekly-day ${isSameDay(day, today) ? 'today-row' : ''}`}>
                    <div className="weekly-date">
                      <span className="w-day">{format(day, 'MM/dd')}</span>
                      <span className="w-weekday">{format(day, 'E', { locale: ja })}</span>
                    </div>
                    <div className="weekly-events">
                      {dayEvents.length > 0 ? dayEvents.map(e => {
                         const eventFamilies = Array.isArray(e.family) ? e.family : [e.family];
                         const members = eventFamilies.map(fname => familyMembers.find(m => m.name === fname)).filter(Boolean);
                         const primaryColor = members.length > 0 ? members[0].color : e.color;
                         return (
                           <div key={e.id} className="weekly-event-item" style={{ borderLeftColor: primaryColor }} onClick={() => setShowEventDetail(e)}>
                             <span className="we-icon">
                               {members.length > 0 ? members.map((m, idx) => <span key={idx}>{m.icon}</span>) : '📅'}
                             </span>
                             {e.time && <span className="we-time">{e.time}</span>}
                             <span className="we-title">{e.title}</span>
                           </div>
                         );
                      }) : (
                        <div className="no-events">予定なし</div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
          
          <section className="family-memo glass-card">
            <h3><Heart size={16} /> 家族メモ</h3>
            <p className="memo-text" style={{ whiteSpace: 'pre-wrap' }}>{familyMemo}</p>
          </section>
        </aside>

        <section className="calendar-section">
          <div className="calendar-header">
            <motion.h2 key={currentDate.toString()} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
              {format(currentDate, 'yyyy年 MMMM', { locale: ja })}
            </motion.h2>
            <div className="calendar-nav glass-card">
              <button onClick={prevMonth} className="nav-btn"><ChevronLeft /></button>
              <button onClick={() => setCurrentDate(new Date())} className="today-btn">今日</button>
              <button onClick={nextMonth} className="nav-btn"><ChevronRight /></button>
            </div>
          </div>

          <div className="calendar-grid glass-card">
            {['日', '月', '火', '水', '木', '金', '土'].map(d => (
               <div key={d} className="day-header">{d}</div>
            ))}
            {days.map(day => (
              <motion.div 
                whileHover={{ scale: 1.01 }}
                key={day.toString()} 
                className={`day-cell ${!isSameMonth(day, monthStart) ? 'disabled' : ''} ${isSameDay(day, new Date()) ? 'today' : ''}`}
                onClick={() => {
                   if(isSameMonth(day, monthStart)) setShowAddModal(day);
                }}
              >
                 <span className="day-number">{format(day, 'd')}</span>
                 <div className="day-events">
                   {filteredEvents.filter(e => isSameDay(e.date, day)).sort((a, b) => {
                     if (!a.time && !b.time) return 0;
                     if (!a.time) return -1;
                     if (!b.time) return 1;
                     return a.time.localeCompare(b.time);
                   }).map(e => {
                     const eventFamilies = Array.isArray(e.family) ? e.family : [e.family];
                     const members = eventFamilies.map(fname => familyMembers.find(m => m.name === fname)).filter(Boolean);
                     const primaryColor = members.length > 0 ? members[0].color : e.color;
                     return (
                       <motion.div 
                         layoutId={`event-${e.id}`}
                         whileHover={{ x: 3 }}
                         key={e.id} 
                         className="event-pill" 
                         style={{ backgroundColor: primaryColor }}
                         onClick={(ev) => {
                            ev.stopPropagation();
                            setShowEventDetail(e);
                         }}
                       >
                         {members.length > 0 && <span style={{marginRight: '4px'}}>{members.map((m, idx) => <span key={idx}>{m.icon}</span>)}</span>}
                         {e.time && <span className="pill-time">{e.time}</span>}
                         <span className="pill-title">{e.title}</span>
                       </motion.div>
                     );
                   })}
                 </div>
              </motion.div>
            ))}
          </div>
        </section>
      </main>

      {/* Floating Action Buttons */}
      <div className="action-buttons">
        <motion.button 
          whileHover={{ scale: 1.05, y: -5 }} whileTap={{ scale: 0.95 }}
          className="fab btn-ocr"
          onClick={() => setShowOcrModal(true)}
        >
          <Camera size={24} />
          <span>プリントから取込</span>
        </motion.button>
        <motion.button 
          whileHover={{ scale: 1.05, y: -5 }} whileTap={{ scale: 0.95 }}
          className="fab btn-add"
          onClick={() => setShowAddModal(new Date())}
        >
          <Plus size={24} />
          <span>新しい予定</span>
        </motion.button>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {/* OCR Modal */}
        {showOcrModal && (
          <Modal onClose={() => setShowOcrModal(false)}>
            <div className="ocr-modal">
              <h3>魔法のスキャン</h3>
              <p>学校のプリントや配布PDFをAIで読み取り、自動で予定に追加します。</p>
              {isScanning ? (
                <div className="scanning-view">
                   <motion.div className="scan-bar" animate={{ top: ['0%', '100%', '0%'] }} transition={{ repeat: Infinity, duration: 2 }} />
                   <FileText size={100} className="scan-icon" />
                   <div className="scan-progress">プリントを解析中...</div>
                </div>
              ) : (
                <div className="upload-box" onClick={() => document.getElementById('ocr-input').click()}>
                  <input type="file" id="ocr-input" onChange={handleFileUpload} hidden />
                  <Camera size={48} />
                  <span>写真を撮る or ファイルを選択</span>
                </div>
              )}
            </div>
          </Modal>
        )}

        {/* Add Event Modal */}
        {showAddModal && (
          <Modal onClose={() => setShowAddModal(false)}>
            <AddEventForm 
              initialDate={showAddModal} 
              familyMembers={familyMembers}
              onCancel={() => setShowAddModal(false)}
              onSave={(newEvent) => {
                setEvents([...events, newEvent]);
                setShowAddModal(false);
              }}
            />
          </Modal>
        )}

        {/* Event Detail Modal */}
        {showEventDetail && (
          <Modal onClose={() => setShowEventDetail(null)}>
            <div className="event-detail">
              <div className="detail-header" style={{ color: showEventDetail.color }}>
                <Edit3 size={24} />
                <h3>予定の詳細</h3>
              </div>
              <div className="detail-body">
                <div className="detail-item">
                  <span className="label">タイトル</span>
                  <span className="value">{showEventDetail.title}</span>
                </div>
                <div className="detail-item">
                  <span className="label">日付</span>
                  <span className="value">{format(showEventDetail.date, 'yyyy年 MM月 dd日')} {showEventDetail.time ? showEventDetail.time : ''}</span>
                </div>
                <div className="detail-item">
                   <span className="label">担当</span>
                   <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                     {(Array.isArray(showEventDetail.family) ? showEventDetail.family : [showEventDetail.family]).map((fname, i) => {
                       const familyMember = familyMembers.find(m => m.name === fname);
                       return (
                         <span key={i} className="member-pill" style={{ backgroundColor: familyMember ? familyMember.color : showEventDetail.color }}>
                           {familyMember?.icon} {fname}
                         </span>
                       );
                     })}
                   </div>
                </div>
              </div>
              <div className="detail-actions">
                <button className="delete-btn" onClick={() => {
                  setEvents(events.filter(e => e.id !== showEventDetail.id));
                  setShowEventDetail(null);
                }}><Trash2 size={18} /> 削除</button>
                <button className="close-btn" onClick={() => setShowEventDetail(null)}>閉じる</button>
              </div>
            </div>
          </Modal>
        )}

        {/* Settings Modal */}
        {showSettingsModal && (
          <Modal onClose={() => setShowSettingsModal(false)}>
            <div className="settings-form">
              <h3><Settings size={22}/> 家族設定</h3>
              
              <div className="settings-section">
                <label className="settings-label">家族メモ</label>
                <textarea 
                  className="memo-input" 
                  value={familyMemo} 
                  onChange={e => setFamilyMemo(e.target.value)} 
                  rows={2}
                  placeholder="家族への伝言などを書き込みましょう"
                />
              </div>

              <div className="settings-section">
                <label className="settings-label">メンバー設定</label>
                <div className="settings-members">
                  {familyMembers.map(m => (
                    <div key={m.id} className="settings-member-row">
                       <div className="settings-member-preview" style={{ backgroundColor: m.color }}>{m.icon || ' '}</div>
                       <input 
                         className="icon-input"
                         type="text" 
                         maxLength="2"
                         value={m.icon || ''} 
                         onChange={(e) => {
                           const newMembers = familyMembers.map(fm => fm.id === m.id ? { ...fm, icon: e.target.value } : fm);
                           setFamilyMembers(newMembers);
                         }} 
                       />
                       <input 
                         type="text" 
                         className="name-input"
                         value={m.name || ''} 
                         onChange={(e) => {
                           const newMembers = familyMembers.map(fm => fm.id === m.id ? { ...fm, name: e.target.value } : fm);
                           setFamilyMembers(newMembers);
                         }} 
                       />
                       <input 
                         type="color" 
                         className="color-input"
                         value={m.color || '#000000'} 
                         onChange={(e) => {
                           const newMembers = familyMembers.map(fm => fm.id === m.id ? { ...fm, color: e.target.value } : fm);
                           setFamilyMembers(newMembers);
                         }} 
                       />
                       {m.id !== 'all' && (
                         <button className="del-btn" onClick={() => setFamilyMembers(familyMembers.filter(fm => fm.id !== m.id))}>
                           <Trash2 size={18}/>
                         </button>
                       )}
                    </div>
                  ))}
                </div>
                <button 
                  className="add-member-btn" 
                  onClick={() => {
                    const newId = `member_${Date.now()}`;
                    setFamilyMembers([...familyMembers, { id: newId, name: '新規', color: '#dddddd', icon: '❓' }]);
                  }}
                >
                  <Plus size={18}/> メンバー追加
                </button>
              </div>
              <button className="submit-btn" onClick={() => setShowSettingsModal(false)}>完了</button>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
}

function Modal({ children, onClose }) {
  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="modal-overlay" onClick={onClose}
    >
      <motion.div 
        initial={{ y: 50, scale: 0.95, opacity: 0 }}
        animate={{ y: 0, scale: 1, opacity: 1 }}
        exit={{ y: 50, scale: 0.95, opacity: 0 }}
        className="modal-container glass-card"
        onClick={e => e.stopPropagation()}
      >
        <button className="modal-close" onClick={onClose}><X /></button>
        {children}
      </motion.div>
    </motion.div>
  );
}

export default App;

function AddEventForm({ initialDate, familyMembers, onSave, onCancel }) {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(() => {
    try {
      return format(initialDate instanceof Date ? initialDate : new Date(), 'yyyy-MM-dd');
    } catch(e) {
      return format(new Date(), 'yyyy-MM-dd');
    }
  });
  const [time, setTime] = useState('');
  const [families, setFamilies] = useState([]);

  const handleSubmit = () => {
    if (!title) return;
    const selectedFamilies = families.length > 0 ? families.filter(f => f !== '全員') : ['全員'];
    const member = familyMembers.find(m => m.name === selectedFamilies[0]) || familyMembers[0];
    onSave({
      id: Date.now(),
      date: new Date(date),
      time: time,
      title: title,
      color: member.color,
      family: selectedFamilies,
      type: '手動追加'
    });
  };

  return (
    <div className="add-event-form">
      <h3>予定の追加</h3>
      <div className="input-group">
        <label>日付・時間</label>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <input type="date" style={{ flex: 1 }} value={date} onChange={e => setDate(e.target.value)} />
          <input type="time" style={{ width: '120px' }} value={time} onChange={e => setTime(e.target.value)} />
        </div>
      </div>
      <div className="input-group">
        <label>タイトル</label>
        <input type="text" placeholder="例：ピアノの練習" value={title} onChange={e => setTitle(e.target.value)} />
      </div>
      <div className="input-group">
        <label>誰の予定？</label>
        <div className="member-selector">
          {familyMembers.filter(m => m.name !== '全員').map(m => (
            <button 
              key={m.id || m.name} 
              className={`member-btn ${families.includes(m.name) ? 'active' : ''}`}
              style={{
                backgroundColor: families.includes(m.name) ? m.color : '#f0f0f0',
                color: families.includes(m.name) ? '#fff' : '#666',
                border: `2px solid ${families.includes(m.name) ? m.color : 'transparent'}`,
                padding: '0.6rem 1rem',
                borderRadius: '2rem',
                cursor: 'pointer',
                fontWeight: '700',
                transition: '0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
              onClick={() => {
                if (families.includes(m.name)) {
                  setFamilies(families.filter(f => f !== m.name));
                } else {
                  setFamilies([...families, m.name]);
                }
              }}
            >
              {m.icon} {m.name}
            </button>
          ))}
        </div>
      </div>
      <button className="submit-btn" onClick={handleSubmit}>保存する</button>
    </div>
  );
}
