import React, { useState, useEffect } from 'react';
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

const INITIAL_EVENTS = [
  { id: 1, date: new Date(2026, 3, 10).toISOString(), title: '春の運動会', color: '#81c784', family: '幸', type: '学校行事' },
  { id: 2, date: new Date(2026, 3, 15).toISOString(), title: '進路面談', color: '#f06292', family: 'ママ', type: '面談' },
  { id: 3, date: new Date(2026, 3, 22).toISOString(), title: 'ピアノコンクール', color: '#ffb74d', family: '希', type: '習い事' },
  { id: 4, date: new Date(2026, 3, 5).toISOString(), title: '家族会議', color: '#ff8a80', family: '全員', type: '家庭' },
];

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
    return saved ? JSON.parse(saved) : INITIAL_FAMILY_MEMBERS;
  });

  const [events, setEvents] = useState(() => {
    const saved = localStorage.getItem('ohana-events');
    if (saved) {
      return JSON.parse(saved).map(e => ({ ...e, date: new Date(e.date) }));
    }
    return INITIAL_EVENTS.map(e => ({ ...e, date: new Date(e.date) }));
  });

  useEffect(() => {
    localStorage.setItem('ohana-family', JSON.stringify(familyMembers));
  }, [familyMembers]);

  useEffect(() => {
    localStorage.setItem('ohana-events', JSON.stringify(events));
  }, [events]);

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
    : events.filter(e => e.family === selectedMember || e.family === '全員');

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
                const dayEvents = events.filter(e => isSameDay(e.date, day));
                return (
                  <div key={day.toString()} className={`weekly-day ${isSameDay(day, today) ? 'today-row' : ''}`}>
                    <div className="weekly-date">
                      <span className="w-day">{format(day, 'MM/dd')}</span>
                      <span className="w-weekday">{format(day, 'E', { locale: ja })}</span>
                    </div>
                    <div className="weekly-events">
                      {dayEvents.length > 0 ? dayEvents.map(e => {
                         const member = familyMembers.find(m => m.name === e.family) || familyMembers[0];
                         return (
                           <div key={e.id} className="weekly-event-item" style={{ borderLeftColor: e.color }} onClick={() => setShowEventDetail(e)}>
                             <span className="we-icon">{member?.icon || '📅'}</span>
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
            <p className="memo-text">週末はキャンプの準備を忘れずに！</p>
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
                   {filteredEvents.filter(e => isSameDay(e.date, day)).map(e => (
                     <motion.div 
                       layoutId={`event-${e.id}`}
                       whileHover={{ x: 3 }}
                       key={e.id} 
                       className="event-pill" 
                       style={{ backgroundColor: e.color }}
                       onClick={(ev) => {
                          ev.stopPropagation();
                          setShowEventDetail(e);
                       }}
                     >
                       <span className="pill-title">{e.title}</span>
                     </motion.div>
                   ))}
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
            <div className="add-event-form">
              <h3>予定の追加</h3>
              <div className="input-group">
                <label>日付</label>
                <input type="date" defaultValue={format(showAddModal, 'yyyy-MM-dd')} />
              </div>
              <div className="input-group">
                <label>タイトル</label>
                <input type="text" placeholder="例：ピアノの練習" />
              </div>
              <div className="input-group">
                <label>誰の予定？</label>
                <div className="member-selector">
                  {familyMembers.filter(m => m.name !== '全員').map(m => (
                    <button key={m.id || m.name} style={{ backgroundColor: m.color }}>{m.icon} {m.name}</button>
                  ))}
                </div>
              </div>
              <button className="submit-btn" onClick={() => setShowAddModal(false)}>保存する</button>
            </div>
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
                  <span className="value">{format(showEventDetail.date, 'yyyy年 MM月 dd日')}</span>
                </div>
                <div className="detail-item">
                   <span className="label">担当</span>
                   <span className="member-pill" style={{ backgroundColor: showEventDetail.color }}>{showEventDetail.family}</span>
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
              <div className="settings-members">
                {familyMembers.map(m => (
                  <div key={m.id} className="settings-member-row">
                     <div className="settings-member-preview" style={{ backgroundColor: m.color }}>{m.icon}</div>
                     <input 
                       className="icon-input"
                       type="text" 
                       maxLength="2"
                       value={m.icon} 
                       onChange={(e) => {
                         const newMembers = familyMembers.map(fm => fm.id === m.id ? { ...fm, icon: e.target.value } : fm);
                         setFamilyMembers(newMembers);
                       }} 
                     />
                     <input 
                       type="text" 
                       className="name-input"
                       value={m.name} 
                       onChange={(e) => {
                         const newMembers = familyMembers.map(fm => fm.id === m.id ? { ...fm, name: e.target.value } : fm);
                         setFamilyMembers(newMembers);
                       }} 
                     />
                     <input 
                       type="color" 
                       className="color-input"
                       value={m.color} 
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
