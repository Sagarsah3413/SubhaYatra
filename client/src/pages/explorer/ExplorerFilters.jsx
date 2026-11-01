import { MONTH_NAMES, PROVINCES, DIFFICULTIES, ACCESS_TYPES } from './explorerUtils';

/**
 * Four single-select filters: month, difficulty, province, accessibility.
 * Choices come from the API options (for availability counts); valid values
 * are fixed by the backend contract. Each change bubbles up to the page which
 * resets pagination and refetches (combined with the backend's AND logic).
 */
function Select({ id, label, value, onChange, children }) {
  return (
    <label htmlFor={id} className="flex flex-col gap-1.5">
      <span className="text-[11px] font-semibold uppercase tracking-wide text-surface-600 dark:text-slate-400">
        {label}
      </span>
      <div className="relative">
        <select
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full appearance-none rounded-lg border bg-white px-3 py-2 pr-9 text-sm
                      text-navy-900 transition-colors focus:outline-none focus-visible:ring-2
                      focus-visible:ring-amber-400 dark:bg-navy-900 dark:text-white
                      ${value
              ? 'border-amber-500 dark:border-amber-400'
              : 'border-surface-300 dark:border-navy-700'}`}
        >
          {children}
        </select>
        <svg
          className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-surface-500 dark:text-slate-400"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 11.17l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
            clipRule="evenodd"
          />
        </svg>
      </div>
    </label>
  );
}

export default function ExplorerFilters({ filters, options, onChange, onReset, hasActive }) {
  const counts = options || {};
  const monthCount = (m) => counts.months?.[String(m)] ?? null;
  const provinceCount = (p) => counts.provinces?.[p] ?? null;
  const difficultyCount = (d) => counts.difficulties?.[d] ?? null;
  const accessCount = (a) => counts.access_types?.[a] ?? null;

  const withCount = (label, count) => (count != null ? `${label} (${count})` : label);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Select
        id="filter-month"
        label="Month"
        value={filters.month}
        onChange={(v) => onChange('month', v)}
      >
        <option value="">Any month</option>
        {MONTH_NAMES.map((name, i) => (
          <option key={name} value={i + 1}>
            {withCount(name, monthCount(i + 1))}
          </option>
        ))}
      </Select>

      <Select
        id="filter-difficulty"
        label="Difficulty"
        value={filters.difficulty}
        onChange={(v) => onChange('difficulty', v)}
      >
        <option value="">Any difficulty</option>
        {DIFFICULTIES.map((d) => (
          <option key={d} value={d}>
            {withCount(d, difficultyCount(d))}
          </option>
        ))}
      </Select>

      <Select
        id="filter-province"
        label="Province"
        value={filters.province}
        onChange={(v) => onChange('province', v)}
      >
        <option value="">Any province</option>
        {PROVINCES.map((p) => (
          <option key={p} value={p}>
            {withCount(p, provinceCount(p))}
          </option>
        ))}
      </Select>

      <Select
        id="filter-access"
        label="Accessibility"
        value={filters.access}
        onChange={(v) => onChange('access', v)}
      >
        <option value="">Any access</option>
        {ACCESS_TYPES.map((a) => (
          <option key={a} value={a}>
            {withCount(a, accessCount(a))}
          </option>
        ))}
      </Select>

      {hasActive && (
        <div className="sm:col-span-2 lg:col-span-4">
          <button
            type="button"
            onClick={onReset}
            className="text-sm font-medium text-amber-600 underline-offset-4 hover:underline dark:text-amber-400"
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
}
