import React, { useState, useMemo } from 'react';
import BikramSambat from '@nakarmi23/bikram-sambat';
import { HiChevronLeft, HiChevronRight, HiSparkles } from 'react-icons/hi';
import NEPALI_FESTIVALS from '../data/nepaliFestivals';
import NEPALI_MONTHS from '../data/nepaliMonths';
import FestivalImage from '../components/FestivalImage';

const weekDaysShort = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

function startOfMonth(date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}
function daysInMonth(date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
}

// Convert Arabic numerals to Devanagari digits
const devanagariDigits = ['०','१','२','३','४','५','६','७','८','९'];
function toDevanagari(num) {
  return String(num).split('').map(ch => (ch >= '0' && ch <= '9') ? devanagariDigits[ch] : ch).join('');
}

// Canonical Bikram Sambat month names (used as keys in NEPALI_FESTIVALS)
const BS_MONTH_NAMES = ['Baisakh','Jestha','Ashadh','Shrawan','Bhadra','Ashwin','Kartik','Mangsir','Poush','Magh','Falgun','Chaitra'];
function getBsMonthName(bs) {
  // Prefer numeric month if available (1-12) to avoid transliteration differences
  try {
    const m = bs.get('month');
    if (typeof m === 'number' && m >= 1 && m <= 12) return BS_MONTH_NAMES[m - 1];
  } catch (e) {
    // ignore
  }
  // Fallback to formatted month string and normalize some common variants
  const raw = String(bs.format('MMMM'));
  const normalized = raw
    .replace(/Mangshir/i, 'Mangsir')
    .replace(/Ashad/i, 'Ashadh')
    .replace(/Baisakh/i, 'Baisakh')
    .replace(/Shrawan/i, 'Shrawan');
  return normalized;
}

const NepaliCalendar = ({ 
  full = false, 
  onClose, 
  mobile = false, 
  selectedDate = null, 
  onSelect = null,
  jumpToDate = null,
  onJumpComplete = null,
  onJumpError = null
} = {}) => {
  const today = new Date();
  const bsToday = BikramSambat.now();
  const [displayDate, setDisplayDate] = useState(startOfMonth(today));
  const [selected, setSelected] = useState(null);
  const [highlightedDate, setHighlightedDate] = useState(null);
  const [isNavigating, setIsNavigating] = useState(false);

  // Expose a stable date-key helper (yyyy-mm-dd)
  function toDateKey(d) { return d.toISOString().slice(0,10); }

  // Sync when parent passes a selectedDate (ISO string or Date)
  React.useEffect(() => {
    if (!selectedDate) { setSelected(null); return; }
    try {
      if (typeof selectedDate === 'string') setSelected(new Date(selectedDate));
      else if (selectedDate instanceof Date) setSelected(selectedDate);
      else setSelected(new Date(selectedDate));
    } catch (e) {
      setSelected(null);
    }
  }, [selectedDate]);

  // Handle jump to date functionality
  React.useEffect(() => {
    if (!jumpToDate) return;

    try {
      setIsNavigating(true);
      
      // Navigate to the month containing the target date
      const targetMonth = startOfMonth(jumpToDate);
      
      // Use fade transition like existing navigation
      setTimeout(() => {
        setDisplayDate(targetMonth);
        setHighlightedDate(jumpToDate);
        setSelected(jumpToDate);
        
        // Call success callback after a short delay to ensure rendering is complete
        setTimeout(() => {
          setIsNavigating(false);
          if (onJumpComplete) {
            onJumpComplete();
          }
        }, 200);
      }, 160);
      
    } catch (error) {
      setIsNavigating(false);
      if (onJumpError) {
        onJumpError('Failed to navigate to the selected date');
      }
    }
  }, [jumpToDate, onJumpComplete, onJumpError]);

  // Helper: resolve festival image URL (falls back to default)
  function festivalImage(obj) {
    try {
      if (!obj) {
        console.log('Festival image: No object provided, using default');
        return '/src/assets/festivals/festival-default.svg';
      }

      // For now, prioritize SVG files for reliability
      // We can enable external images later once CORS issues are resolved
      const imageName = obj.image || (obj.id ? `${obj.id}.svg` : null);
      if (imageName) {
        console.log('Festival image: Using SVG for', obj.name, ':', imageName);
        return `/src/assets/festivals/${imageName}`;
      }

      // Fallback to external imageUrl if SVG not available
      if (obj.imageUrl) {
        console.log('Festival image: Using external image for', obj.name, ':', obj.imageUrl);
        return obj.imageUrl;
      }

      console.log('Festival image: No image found, using default for', obj.name);
      return '/src/assets/festivals/festival-default.svg';
    } catch (e) {
      console.error('Error loading festival image:', e);
      return '/src/assets/festivals/festival-default.svg';
    }
  }

  // Helper: resolve month image URL (falls back to default)
  function monthImage(monthNum) {
    try {
      const monthInfo = NEPALI_MONTHS[monthNum];
      if (!monthInfo) return '/src/assets/months/baisakh-month.svg';

      // Prefer external imageUrl if available
      if (monthInfo.imageUrl && monthInfo.imageUrl !== 'https://example.com/...') {
        return monthInfo.imageUrl;
      }

      // Use the image property if available
      if (monthInfo.image) {
        return `/src/assets/months/${monthInfo.image}`;
      }

      return '/src/assets/months/baisakh-month.svg';
    } catch (e) {
      return '/src/assets/months/baisakh-month.svg';
    }
  }

  // Prepare month grid
  const startDay = startOfMonth(displayDate).getDay();
  const totalDays = daysInMonth(displayDate);
  const cells = useMemo(() => {
    const arr = [];
    for (let i = 0; i < startDay; i++) arr.push(null);
    for (let d = 1; d <= totalDays; d++) arr.push(new Date(displayDate.getFullYear(), displayDate.getMonth(), d));
    while (arr.length < 42) arr.push(null);
    return arr;
  }, [displayDate, startDay, totalDays]);

  // Debugging: log festival occurrences for the current display month
  React.useEffect(() => {
    const monthFests = [];
    cells.forEach((dt) => {
      if (!dt) return;
      const bs = BikramSambat.fromAD(dt);
      const day = bs.get('date');
      const monthKey = getBsMonthName(bs);
      const key = `${monthKey}-${day}`;
      const f = NEPALI_FESTIVALS[key];
      if (f) monthFests.push({ ad: dt.toISOString().slice(0,10), key, festivals: f });
    });
    if (monthFests.length) {
      console.debug('NepaliCalendar: festivals in display month', monthFests);
    } else {
      console.debug('NepaliCalendar: no festivals in display month for', displayDate.toISOString().slice(0,10));
    }
  }, [displayDate, cells]);

  // Compute month festival days and count for the current display month
  const monthFestivalDays = React.useMemo(() => {
    const arr = [];
    cells.forEach((dt) => {
      if (!dt) return;
      const bs = BikramSambat.fromAD(dt);
      const key = `${getBsMonthName(bs)}-${bs.get('date')}`;
      const f = NEPALI_FESTIVALS[key];
      if (f && f.length) {
        arr.push({ ad: dt, dateKey: toDateKey(dt), bs, key, festivals: Array.isArray(f) ? f : [f] });
      }
    });
    return arr;
  }, [cells]);

  const monthFestivalCount = monthFestivalDays.length;

  if (!full) {
    // compact fallback (used previously)
    const bsNow = BikramSambat.now();
    return (
      <div className="bg-slate-800 text-white rounded-md p-3 shadow-lg w-48">
        <div className="font-semibold text-sm mb-1">NEPALI CALENDAR</div>
        <div className="text-sm">AD: {today.toLocaleDateString()}</div>
        <div className="text-sm">BS: {bsNow.format('YYYY MMMM D')}</div>
      </div>
    );
  }

  const bsMonth = BikramSambat.fromAD(startOfMonth(displayDate));
  const gregLabel = displayDate.toLocaleString(undefined, { month: 'long', year: 'numeric' });
  const bsLabel = `${bsMonth.format('MMMM')} ${toDevanagari(bsMonth.get('year'))}`;
  
  // Get current Nepali month information
  const nepaliMonthNum = bsMonth.get('month');
  const currentMonthInfo = NEPALI_MONTHS[nepaliMonthNum];

  const [fade, setFade] = useState(false);

  const goPrev = () => {
    setFade(true);
    setHighlightedDate(null); // Clear highlighted date when navigating manually
    setTimeout(() => {
      setDisplayDate(d => new Date(d.getFullYear(), d.getMonth() - 1, 1));
      setFade(false);
    }, 160);
  };
  const goNext = () => {
    setFade(true);
    setHighlightedDate(null); // Clear highlighted date when navigating manually
    setTimeout(() => {
      setDisplayDate(d => new Date(d.getFullYear(), d.getMonth() + 1, 1));
      setFade(false);
    }, 160);
  };
  const goToday = () => {
    setHighlightedDate(null); // Clear highlighted date when going to today
    setDisplayDate(startOfMonth(today));
    setSelected(today);
  };

  // Mobile-aware container and sizing
  const containerClass = mobile
    ? 'bg-slate-50 rounded-t-lg shadow-2xl text-slate-900 overflow-y-auto w-full h-[70vh]'
    : 'bg-slate-50 rounded-lg shadow-2xl text-slate-900 overflow-hidden w-full max-w-2xl transform transition-shadow duration-150';

  const cellHeight = mobile ? 'h-10' : 'h-8';

  return (
    <div className={containerClass} role="dialog" aria-modal="true" aria-labelledby="nepali-calendar-title">
      {/* Professional Header - Orange/Red Theme */}
      <div className={`flex items-center justify-between px-6 py-4 border-b-4 border-orange-600 ${mobile ? 'sticky top-0 z-10' : ''} bg-gradient-to-r from-orange-500 to-red-600`}>
        <div className="flex items-center gap-4">
          <button 
            type="button" 
            onClick={(e) => { e.stopPropagation(); goPrev(); }} 
            onMouseDown={(e) => e.stopPropagation()} 
            onTouchStart={(e) => e.stopPropagation()} 
            onPointerDown={(e) => e.stopPropagation()} 
            className="p-2 rounded-lg bg-white/20 hover:bg-white/30 text-white transition-all" 
            aria-label="Previous month"
          >
            <HiChevronLeft size={24} />
          </button>

          <div className="text-center">
            <div id="nepali-calendar-title" className="text-2xl font-bold text-white">{bsLabel}</div>
            <div className="text-sm text-white/90 mt-1">{gregLabel}</div>
          </div>

          <button 
            type="button" 
            onClick={(e) => { e.stopPropagation(); goNext(); }} 
            onMouseDown={(e) => e.stopPropagation()} 
            onTouchStart={(e) => e.stopPropagation()} 
            onPointerDown={(e) => e.stopPropagation()} 
            className="p-2 rounded-lg bg-white/20 hover:bg-white/30 text-white transition-all" 
            aria-label="Next month"
          >
            <HiChevronRight size={24} />
          </button>
        </div>

        <div className="flex items-center gap-3">
          <button 
            type="button" 
            onClick={(e) => { e.stopPropagation(); goToday(); }} 
            onMouseDown={(e) => e.stopPropagation()} 
            onTouchStart={(e) => e.stopPropagation()} 
            onPointerDown={(e) => e.stopPropagation()} 
            className="px-4 py-2 bg-white text-orange-600 rounded-lg font-semibold hover:bg-white/90 transition-all"
          >
            Today
          </button>
          {onClose && (
            <button 
              type="button" 
              onClick={(e) => { e.stopPropagation(); onClose(); }} 
              onMouseDown={(e) => e.stopPropagation()} 
              onTouchStart={(e) => e.stopPropagation()} 
              onPointerDown={(e) => e.stopPropagation()} 
              className="px-4 py-2 bg-white/20 text-white rounded-lg font-semibold hover:bg-white/30 transition-all"
            >
              Close
            </button>
          )}
        </div>  
      </div>

      <div className="p-6 overflow-y-auto bg-white" style={{maxHeight: mobile ? 'calc(70vh - 80px)' : '500px'}}>
        {/* Professional Calendar Grid */}
        <div className={`transition-opacity duration-200 ${fade ? 'opacity-30' : 'opacity-100'}`}>
          {/* Week Days Header - Professional Style */}
          <div className="grid grid-cols-7 gap-2 mb-3 border-b-2 border-orange-500 pb-2">
            {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day, idx) => (
              <div 
                key={day} 
                className={`text-center font-bold text-sm py-2 ${
                  idx === 6 ? 'text-red-600' : 'text-gray-700'
                }`}
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid - Clean Professional Layout */}
          <div className="grid grid-cols-7 gap-2">
            {cells.map((dt, idx) => {
              if (!dt) return <div key={idx} className="h-24" />;

              const isToday = dt.toDateString() === today.toDateString();
              const isSelected = selected && dt.toDateString() === selected.toDateString();
              const isHighlighted = highlightedDate && dt.toDateString() === highlightedDate.toDateString();
              const bs = BikramSambat.fromAD(dt);
              const bsDay = bs.get('date');
              const bsDayDeva = toDevanagari(bsDay);
              const isBSToday = bs.isSame(bsToday, 'day');
              const monthKey = getBsMonthName(bs);
              const festivals = NEPALI_FESTIVALS[`${monthKey}-${bsDay}`] || [];
              const isSaturday = dt.getDay() === 6;

              return (
                <button
                  key={idx}
                  onClick={(e) => {
                    e.stopPropagation();
                    const dateKey = toDateKey(dt);
                    const shouldDeselect = selected && selected.toDateString() === dt.toDateString();
                    const newSel = shouldDeselect ? null : dt;
                    setSelected(newSel);
                    setHighlightedDate(null);
                    if (onSelect) onSelect(shouldDeselect ? null : dateKey);
                  }}
                  onMouseDown={(e) => e.stopPropagation()}
                  onTouchStart={(e) => e.stopPropagation()}
                  onPointerDown={(e) => e.stopPropagation()}
                  aria-current={isBSToday ? 'date' : undefined}
                  aria-expanded={isSelected ? 'true' : 'false'}
                  className={`h-24 p-2 flex flex-col items-center justify-start border-2 rounded-lg transition-all duration-200 relative ${
                    isSelected 
                      ? 'bg-orange-100 border-orange-500 shadow-lg scale-105' 
                      : isHighlighted
                      ? 'bg-blue-100 border-blue-500 shadow-lg scale-105'
                      : isToday
                      ? 'bg-orange-50 border-orange-400'
                      : 'bg-white border-gray-200 hover:border-orange-300 hover:shadow-md'
                  }`}
                >
                  {/* AD Date - Large */}
                  <div className={`text-3xl font-bold mb-1 ${
                    isSaturday ? 'text-red-600' : 
                    isSelected ? 'text-orange-700' : 
                    isToday ? 'text-orange-600' : 
                    'text-gray-800'
                  }`}>
                    {dt.getDate()}
                  </div>

                  {/* BS Date - Devanagari */}
                  <div className={`text-sm font-semibold ${
                    isSelected ? 'text-orange-600' : 
                    isToday ? 'text-orange-500' : 
                    'text-gray-600'
                  }`}>
                    {bsDayDeva}
                  </div>

                  {/* Festival Indicator */}
                  {festivals.length > 0 && (
                    <div className="mt-1">
                      <div className="w-2 h-2 rounded-full bg-red-500" title="Festival day" />
                    </div>
                  )}

                  {/* Festival Names - Small Text */}
                  {festivals.length > 0 && (
                    <div className="absolute bottom-1 left-1 right-1">
                      <div className="text-[9px] text-red-600 font-medium truncate text-center">
                        {Array.isArray(festivals) ? festivals[0].name : festivals.name}
                      </div>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Festival List Below Calendar */}
        {monthFestivalDays.length > 0 && (
          <div className="mt-6 pt-6 border-t-2 border-gray-200">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <HiSparkles className="w-5 h-5 text-orange-500" />
              Festivals This Month ({monthFestivalDays.length})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {monthFestivalDays.map(({ ad, bs, festivals }) => (
                <div 
                  key={toDateKey(ad)} 
                  className="p-3 bg-orange-50 border border-orange-200 rounded-lg hover:shadow-md transition-all"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 text-center">
                      <div className="text-2xl font-bold text-orange-600">{ad.getDate()}</div>
                      <div className="text-xs text-gray-600">{toDevanagari(bs.get('date'))}</div>
                    </div>
                    <div className="flex-1 min-w-0">
                      {festivals.map((f, i) => (
                        <div key={i} className="mb-1">
                          <div className="font-semibold text-sm text-gray-800 truncate">{f.name}</div>
                          {f.name_np && (
                            <div className="text-xs text-gray-600 truncate">{f.name_np}</div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};  
export default NepaliCalendar;
