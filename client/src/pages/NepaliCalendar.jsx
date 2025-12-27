import React, { useState, useMemo } from 'react';
import BikramSambat from '@nakarmi23/bikram-sambat';
import { HiChevronLeft, HiChevronRight, HiSparkles } from 'react-icons/hi';
import NEPALI_FESTIVALS from '../data/nepaliFestivals';

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

const NepaliCalendar = ({ full = false, onClose, mobile = false, selectedDate = null, onSelect = null } = {}) => {
  const today = new Date();
  const bsToday = BikramSambat.now();
  const [displayDate, setDisplayDate] = useState(startOfMonth(today));
  const [selected, setSelected] = useState(null);

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

  // Helper: resolve festival image URL (falls back to default)
  function festivalImage(obj) {
    try {
      if (!obj) return '/src/assets/festivals/festival-default.svg';

      // Use the image property if available, otherwise construct from id
      const imageName = obj.image || (obj.id ? `${obj.id}.svg` : null);
      if (!imageName) return '/src/assets/festivals/festival-default.svg';

      // Return the path directly for Vite to handle
      return `/src/assets/festivals/${imageName}`;
    } catch (e) {
      return '/src/assets/festivals/festival-default.svg';
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

  const [fade, setFade] = useState(false);

  const goPrev = () => {
    setFade(true);
    setTimeout(() => {
      setDisplayDate(d => new Date(d.getFullYear(), d.getMonth() - 1, 1));
      setFade(false);
    }, 160);
  };
  const goNext = () => {
    setFade(true);
    setTimeout(() => {
      setDisplayDate(d => new Date(d.getFullYear(), d.getMonth() + 1, 1));
      setFade(false);
    }, 160);
  };
  const goToday = () => {
    setDisplayDate(startOfMonth(today));
    setSelected(today);
  };

  // Mobile-aware container and sizing
  const containerClass = mobile
    ? 'bg-slate-50 rounded-t-lg shadow-2xl text-slate-900 overflow-y-auto w-full h-[70vh]'
    : 'bg-slate-50 rounded-lg shadow-2xl text-slate-900 overflow-hidden w-full max-w-3xl transform transition-shadow duration-150';

  const cellHeight = mobile ? 'h-10' : 'h-8';

  return (
    <div className={containerClass} role="dialog" aria-modal="true" aria-labelledby="nepali-calendar-title">
      <div className={`flex items-center justify-between px-4 py-3 border-b ${mobile ? 'sticky top-0 bg-teal-700 z-10' : 'bg-teal-700'}`}>
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

      <div className="p-4 overflow-y-auto" style={{maxHeight: mobile ? 'calc(70vh - 80px)' : '500px'}}>
        <div className="grid grid-cols-7 gap-2 text-xs text-center text-slate-500 mb-3">
          {weekDaysShort.map((d) => (
            <div key={d} className="font-medium">{d}</div>
          ))}
        </div>

        <div className={`transition-opacity duration-200 ${fade ? 'opacity-30' : 'opacity-100'}`}>
          {/* Calendar grid */}
          <div className="mb-4">
            <div className="grid grid-cols-7 gap-1">
              {cells.map((dt, idx) => {
                if (!dt) return <div key={idx} className={cellHeight} />;

                const isToday = dt.toDateString() === today.toDateString();
                const isSelected = selected && dt.toDateString() === selected.toDateString();
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
                      if (onSelect) onSelect(shouldDeselect ? null : dateKey);
                    }}
                    onMouseDown={(e) => e.stopPropagation()}
                    onTouchStart={(e) => e.stopPropagation()}
                    onPointerDown={(e) => e.stopPropagation()}
                    aria-current={isBSToday ? 'date' : undefined}
                    aria-expanded={isSelected ? 'true' : 'false'}
                    className={`${cellHeight} p-1 flex flex-col justify-center items-center text-center rounded-lg border transition-all duration-300 relative ${isSelected ? 'bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-lg border-emerald-500 scale-105' : 'bg-white border-slate-200 hover:border-emerald-300 hover:shadow-md hover:-translate-y-0.5 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-emerald-400'} ${isToday ? 'ring-2 ring-blue-400 border-blue-300' : ''} ${isBSToday && !isSelected ? 'bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200' : ''}`}
                  >
                    <div className="flex flex-col items-center gap-1 w-full">
                      <div className={`text-sm font-bold leading-none ${isSelected ? 'text-white' : isToday ? 'text-blue-600' : 'text-slate-700'}`}>{dt.getDate()}</div>
                      <div className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${isSelected ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-700'}`}>{bsDayDeva}</div>
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
            <div className="bg-white p-3 rounded-md shadow-sm border divide-y divide-slate-100">
              <div className="flex items-center justify-between">
                <div className="font-medium text-sm">Festivals</div>
                <div className="text-xs text-slate-500">{monthFestivalDays.length} day(s)</div>
              </div>

              <div className="mt-2 space-y-2 max-h-[200px] overflow-y-auto">
                {monthFestivalDays.length ? monthFestivalDays.map((item) => {
                  const title = item.festivals.map(f => (typeof f === 'string' ? f : f.name)).join(', ');
                  const isFestivalSelected = selected && selected.toDateString() === item.ad.toDateString();
                  return (
                    <div key={item.dateKey} role="button" tabIndex={0} onClick={(e) => { e.stopPropagation(); setSelected(new Date(item.dateKey)); if (onSelect) onSelect(item.dateKey); }} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); e.stopPropagation(); setSelected(new Date(item.dateKey)); if (onSelect) onSelect(item.dateKey); } }} className={`flex items-start gap-2 p-2 rounded border cursor-pointer transition focus:outline-none focus:ring-2 focus:ring-emerald-200 ${isFestivalSelected ? 'bg-emerald-50 border-emerald-300 shadow-md ring-2 ring-emerald-200' : 'hover:shadow-md hover:bg-slate-50'}`}>
                      <img src={festivalImage(item.festivals[0])} alt={title} className="w-10 h-10 rounded object-cover flex-shrink-0 border" />
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

        <div className="mt-4 border-t pt-3">
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
                                <img src={festivalImage(obj)} alt={obj.name} className="w-8 h-8 rounded-md object-cover flex-shrink-0" onError={(e)=>{e.currentTarget.onerror=null;e.currentTarget.src='/src/assets/festivals/festival-default.svg'}} />
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
