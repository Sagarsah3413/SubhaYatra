/**
 * Pure presentation helpers for the Explorer. No API calls, no React.
 * Everything here derives strictly from real record fields — nothing fabricated.
 */

export const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

export const MONTH_ABBR = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

export const PROVINCES = [
  'Koshi', 'Madhesh', 'Bagmati', 'Gandaki', 'Lumbini', 'Karnali', 'Sudurpashchim',
];

export const DIFFICULTIES = ['Easy', 'Moderate', 'Hard'];

export const ACCESS_TYPES = ['Road', 'Road+Hike', 'Trek', 'Fly-in'];

/** Capitalize the first letter of a lowercase dataset value for display. */
export function titleCase(value) {
  if (!value || typeof value !== 'string') return '';
  return value
    .split(/\s+/)
    .map((w) => (w ? w[0].toUpperCase() + w.slice(1) : w))
    .join(' ');
}

/**
 * Humanize season_months (array of ints 1-12) into compact month ranges.
 * e.g. [3,4,5,9,10,11] -> "Mar–May, Sep–Nov". Returns null when unavailable.
 */
export function humanizeSeason(months) {
  if (!Array.isArray(months) || months.length === 0) return null;

  const sorted = [...new Set(months.filter((m) => m >= 1 && m <= 12))].sort((a, b) => a - b);
  if (sorted.length === 0) return null;

  // Group consecutive months into ranges.
  const ranges = [];
  let start = sorted[0];
  let prev = sorted[0];

  for (let i = 1; i < sorted.length; i += 1) {
    const m = sorted[i];
    if (m === prev + 1) {
      prev = m;
    } else {
      ranges.push([start, prev]);
      start = m;
      prev = m;
    }
  }
  ranges.push([start, prev]);

  return ranges
    .map(([a, b]) => (a === b ? MONTH_ABBR[a - 1] : `${MONTH_ABBR[a - 1]}–${MONTH_ABBR[b - 1]}`))
    .join(', ');
}

/**
 * Access confidence presentation tier.
 *  - high   -> plain (no extra marking)
 *  - medium -> "inferred"
 *  - low    -> "approximate · needs review" (must stay visible)
 *  - null   -> unavailable
 */
export function accessConfidenceLabel(confidence) {
  switch (confidence) {
    case 'high':
      return { tier: 'high', note: null };
    case 'medium':
      return { tier: 'medium', note: 'inferred' };
    case 'low':
      return { tier: 'low', note: 'approximate · needs review' };
    default:
      return { tier: 'unknown', note: 'confidence unavailable' };
  }
}

/**
 * Build a concise, factual "why this matches" line from the ACTIVE filters and
 * real record fields. Never implies AI personalization.
 *
 * @param {Object} dest   destination record
 * @param {Object} filters { month, difficulty, province, access }
 */
export function buildWhyMatches(dest, filters = {}) {
  const parts = [];

  // Season — prefer the active month when it applies, else the general window.
  if (filters.month) {
    const m = Number(filters.month);
    if (Array.isArray(dest.season_months) && dest.season_months.includes(m)) {
      parts.push(`Good to visit in ${MONTH_NAMES[m - 1]}`);
    }
  } else {
    const season = humanizeSeason(dest.season_months);
    if (season) parts.push(`Best visited ${season}`);
  }

  // Difficulty.
  if (dest.difficulty) {
    parts.push(`${dest.difficulty} terrain`);
  }

  // Access.
  if (dest.access_type) {
    parts.push(`${dest.access_type} access`);
  }

  // Location — province + district when available.
  const province = dest.province;
  const district = titleCase(dest.district);
  if (province && district) {
    parts.push(`In ${province}, ${district}`);
  } else if (province) {
    parts.push(`In ${province}`);
  }

  if (parts.length === 0) return null;
  return parts.join(' · ');
}

/** Whether a record may be shown as a map pin (verified coords only). */
export function canShowPin(dest) {
  return (
    dest.map_pin_allowed === true &&
    typeof dest.latitude === 'number' &&
    typeof dest.longitude === 'number'
  );
}
