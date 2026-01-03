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
      <div className={`flex items-center justify-between px-3 py-2 border-b ${mobile ? 'sticky top-0 bg-teal-700 z-10' : 'bg-teal-700'}`}>
        <div className="flex items-center gap-3">
          <button type="button" onClick={(e) => { e.stopPropagation(); goPrev(); }} onMouseDown={(e) => e.stopPropagation()} onTouchStart={(e) => e.stopPropagation()} onPointerDown={(e) => e.stopPropagation()} className="p-2 rounded-md bg-teal-800 hover:bg-teal-600 text-white" aria-label="Previous month">
            <HiChevronLeft size={20} />
          </button>

          <div className="text-center">
            <div id="nepali-calendar-title" className="text-xl font-semibold leading-tight text-white">{gregLabel}</div>
            <div className="text-sm text-emerald-100 mt-0.5">{bsLabel}</div>
          </div>

          <button type="button" onClick={(e) => { e.stopPropagation(); goNext(); }} onMouseDown={(e) => e.stopPropagation()} onTouchStart={(e) => e.stopPropagation()} onPointerDown={(e) => e.stopPropagation()} className="p-2 rounded-md bg-teal-800 hover:bg-teal-600 text-white" aria-label="Next month">
            <HiChevronRight size={20} />
          </button>
        </div>
        {monthFestivalCount > 0 && (
          <div className="ml-3 px-2 py-1 rounded bg-emerald-50 text-emerald-800 text-sm font-medium flex items-center gap-2" aria-live="polite" title={`${monthFestivalCount} festival(s) this month`}>
            <HiSparkles className="w-4 h-4 text-emerald-600" aria-hidden="true" />
            <span>{monthFestivalCount} festival{monthFestivalCount > 1 ? 's' : ''}</span>
          </div>
        )}

        <div className="flex items-center gap-2">
          <button type="button" onClick={(e) => { e.stopPropagation(); goToday(); }} onMouseDown={(e) => e.stopPropagation()} onTouchStart={(e) => e.stopPropagation()} onPointerDown={(e) => e.stopPropagation()} className={`px-3 py-1 bg-emerald-500 text-white rounded-md`}>Today</button>
          {onClose && (
            <button type="button" onClick={(e) => { e.stopPropagation(); onClose(); }} onMouseDown={(e) => e.stopPropagation()} onTouchStart={(e) => e.stopPropagation()} onPointerDown={(e) => e.stopPropagation()} className={`ml-2 px-3 py-1 bg-slate-800 text-white rounded-md`}>{mobile ? 'Close' : 'Close'}</button>
          )}
        </div>  
      </div>

      {/* Month Information Section */}
      {currentMonthInfo && (
        <div className="px-3 py-2 bg-gradient-to-r from-teal-50 to-emerald-50 border-b">
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0">
              <img 
                src={monthImage(nepaliMonthNum)}
                alt={`${currentMonthInfo.name} month`}
                className="w-12 h-9 rounded-lg object-cover border-2 border-teal-200 shadow-sm"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = '/src/assets/months/baisakh-month.svg';
                }}
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-lg font-bold text-teal-800">
                  {currentMonthInfo.name}
                  <span className="text-sm font-medium text-teal-600 ml-2">({currentMonthInfo.name_np})</span>
                </h3>
                <span className="px-2 py-1 bg-teal-100 text-teal-700 text-xs font-medium rounded-full">
                  {currentMonthInfo.season} • {currentMonthInfo.season_np}
                </span>
              </div>
              <p className="text-sm text-slate-600 mb-2">{currentMonthInfo.description}</p>
              <div className="flex flex-wrap gap-2 text-xs">
                <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded">🌡️ {currentMonthInfo.temperature}</span>
                {currentMonthInfo.festivals.length > 0 && (
                  <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded">
                    🎉 {currentMonthInfo.festivals.slice(0, 2).join(', ')}
                    {currentMonthInfo.festivals.length > 2 && ` +${currentMonthInfo.festivals.length - 2} more`}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="p-3 overflow-y-auto" style={{maxHeight: mobile ? 'calc(70vh - 80px)' : '400px'}}>
        <div className="grid grid-cols-7 gap-1 text-xs text-center text-slate-500 mb-2">
          {weekDaysShort.map((d) => (
            <div key={d} className="font-medium">{d}</div>
          ))}
        </div>

        <div className={`transition-opacity duration-200 ${fade ? 'opacity-30' : 'opacity-100'}`}>
          {/* Calendar grid */}
          <div className="mb-3">
            <div className="grid grid-cols-7 gap-1">
              {cells.map((dt, idx) => {
                if (!dt) return <div key={idx} className={cellHeight} />;

                const isToday = dt.toDateString() === today.toDateString();
                const isSelected = selected && dt.toDateString() === selected.toDateString();
                const isHighlighted = highlightedDate && dt.toDateString() === highlightedDate.toDateString();
                const bs = BikramSambat.fromAD(dt);
                const bsDay = bs.get('date');
                const bsDayDeva = toDevanagari(bsDay);
                const isBSToday = bs.isSame(bsToday, 'day');
                const monthKey = getBsMonthName(bs);
                const festivals = NEPALI_FESTIVALS[`${monthKey}-${bsDay}`] || [];

                return (
                  <button
                    key={idx}
                    onClick={(e) => {
                      e.stopPropagation();
                      const dateKey = toDateKey(dt);
                      const shouldDeselect = selected && selected.toDateString() === dt.toDateString();
                      const newSel = shouldDeselect ? null : dt;
                      setSelected(newSel);
                      setHighlightedDate(null); // Clear highlighted date when selecting manually
                      if (onSelect) onSelect(shouldDeselect ? null : dateKey);
                    }}
                    onMouseDown={(e) => e.stopPropagation()}
                    onTouchStart={(e) => e.stopPropagation()}
                    onPointerDown={(e) => e.stopPropagation()}
                    aria-current={isBSToday ? 'date' : undefined}
                    aria-expanded={isSelected ? 'true' : 'false'}
                    className={`${cellHeight} p-1 flex flex-col justify-center items-center text-center rounded-lg border transition-all duration-300 relative ${
                      isSelected 
                        ? 'bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-lg border-emerald-500 scale-105' 
                        : isHighlighted
                        ? 'bg-gradient-to-br from-blue-400 to-blue-500 text-white shadow-lg border-blue-400 scale-105 ring-2 ring-blue-300'
                        : 'bg-white border-slate-200 hover:border-emerald-300 hover:shadow-md hover:-translate-y-0.5 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-emerald-400'
                    } ${isToday ? 'ring-2 ring-blue-400 border-blue-300' : ''} ${isBSToday && !isSelected && !isHighlighted ? 'bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200' : ''}`}
                  >
                    <div className="flex flex-col items-center gap-1 w-full">
                      <div className={`text-sm font-bold leading-none ${isSelected || isHighlighted ? 'text-white' : isToday ? 'text-blue-600' : 'text-slate-700'}`}>{dt.getDate()}</div>
                      <div className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${isSelected || isHighlighted ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-700'}`}>{bsDayDeva}</div>
                      {festivals.length > 0 && (
                        <div className="absolute top-1 right-1">
                          <span className="w-2 h-2 inline-block rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 shadow-sm" title="Festival day" />
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Festival list sidebar */}
          <aside className="w-full">
            <div className="bg-white p-2 rounded-md shadow-sm border divide-y divide-slate-100">
              <div className="flex items-center justify-between">
                <div className="font-medium text-sm">Festivals</div>
                <div className="text-xs text-slate-500">{monthFestivalDays.length} day(s)</div>
              </div>

              <div className="mt-2 space-y-2 max-h-[150px] overflow-y-auto">
                {monthFestivalDays.length ? monthFestivalDays.map((item) => {
                  const title = item.festivals.map(f => (typeof f === 'string' ? f : f.name)).join(', ');
                  const isFestivalSelected = selected && selected.toDateString() === item.ad.toDateString();
                  return (
                    <div key={item.dateKey} role="button" tabIndex={0} onClick={(e) => { e.stopPropagation(); setSelected(new Date(item.dateKey)); if (onSelect) onSelect(item.dateKey); }} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); e.stopPropagation(); setSelected(new Date(item.dateKey)); if (onSelect) onSelect(item.dateKey); } }} className={`flex items-start gap-2 p-2 rounded border cursor-pointer transition focus:outline-none focus:ring-2 focus:ring-emerald-200 ${isFestivalSelected ? 'bg-emerald-50 border-emerald-300 shadow-md ring-2 ring-emerald-200' : 'hover:shadow-md hover:bg-slate-50'}`}>
                      <FestivalImage 
                        festival={item.festivals[0]}
                        alt={title}
                        className="w-10 h-10 rounded object-cover flex-shrink-0 border"
                        preferExternal={true}
                      />
                      <div className="flex-1 min-w-0">
                        <div className={`font-semibold text-xs truncate ${isFestivalSelected ? 'text-emerald-800' : 'text-slate-800'}`}>{title}</div>
                        <div className="text-xs text-slate-500">{item.ad.toLocaleDateString()} — {item.bs.format('YYYY MMMM D')}</div>
                      </div>
                      <div>
                        <button className={`px-2 py-1 text-xs font-semibold rounded ${isFestivalSelected ? 'bg-emerald-700 text-white' : 'bg-emerald-600 text-white hover:bg-emerald-700'}`}>View</button>
                      </div>
                    </div>
                  );
                }) : (
                  <div className="text-xs text-slate-500 text-center py-2">No festivals this month</div>
                )}
              </div>
            </div>
          </aside>
        </div>

        <div className="mt-3 border-t pt-2">
          <div className="text-sm text-slate-600 flex items-center justify-between">
            {selected ? (
              <div className="flex items-center gap-4">
                <div className="flex flex-col">
                  <div className="font-medium">Selected</div>
                  <div className="text-xs text-slate-500">AD: {selected.toLocaleDateString()}</div>
                  <div className="text-xs text-slate-500">BS: {BikramSambat.fromAD(selected).format('YYYY MMMM D')}</div>
                  {(() => {
                    const sbs = BikramSambat.fromAD(selected);
                    const selFests = NEPALI_FESTIVALS[`${getBsMonthName(sbs)}-${sbs.get('date')}`] || [];
                    if (!selFests.length) return null;
                    return (
                      <div className="mt-2 text-sm">
                        <div className="font-medium text-slate-700">Festivals</div>
                        <div className="mt-2 space-y-3">
                          {selFests.map((f) => {
                            const obj = typeof f === 'string' ? { id: f.toLowerCase().replace(/[^a-z0-9]+/g,'-'), name: f, name_np: '', desc: '' } : f;
                            return (
                              <div key={obj.id || obj.name} className="flex items-start gap-3">
                                <FestivalImage 
                                  festival={obj}
                                  alt={obj.name}
                                  className="w-8 h-8 rounded-md object-cover flex-shrink-0"
                                  preferExternal={true}
                                />
                                <div>
                                  <div className="font-semibold text-emerald-700">{obj.name} {obj.name_np ? <span className="text-[11px] text-slate-500">({obj.name_np})</span> : null}</div>
                                  {obj.desc && <div className="text-xs text-slate-500 mt-1">{obj.desc}</div>}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })()}
                </div>
                <div className="px-3 py-1 bg-emerald-600 text-white rounded-md font-semibold">{selected.getDate()}</div>
              </div>
            ) : (
              <div className="text-xs text-slate-500">No date selected — tap a day to select it</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};  
export default NepaliCalendar;
