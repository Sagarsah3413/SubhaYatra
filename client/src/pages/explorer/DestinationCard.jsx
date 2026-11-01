import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import imageService from '../../services/imageService';
import {
  humanizeSeason,
  accessConfidenceLabel,
  buildWhyMatches,
  titleCase,
} from './explorerUtils';

/**
 * A single destination card — photography-led, editorial.
 * Navigates to the existing detail route (/place/:id) on click, matching
 * how other listings (RecommendationResults, similar places) navigate.
 */
export default function DestinationCard({ dest, filters }) {
  const navigate = useNavigate();
  const [imgFailed, setImgFailed] = useState(false);

  const imageUrl = imageService.getDestinationImageUrl(dest.image_path);
  const season = humanizeSeason(dest.season_months);
  const confidence = accessConfidenceLabel(dest.access_confidence);
  const why = buildWhyMatches(dest, filters);
  const district = titleCase(dest.district);

  const goToDetail = () => navigate(`/place/${dest.id}`);
  const onKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      goToDetail();
    }
  };

  // Confidence tier styling (amber is the single accent; low uses crimson text).
  const confidenceClass =
    confidence.tier === 'low'
      ? 'text-crimson-600 dark:text-crimson-400'
      : confidence.tier === 'medium'
        ? 'text-surface-600 dark:text-slate-400'
        : 'text-navy-700 dark:text-slate-300';

  return (
    <article
      role="link"
      tabIndex={0}
      onClick={goToDetail}
      onKeyDown={onKeyDown}
      aria-label={`View details for ${dest.name}`}
      className="group flex flex-col overflow-hidden rounded-lg border border-surface-300 bg-white
                 transition-shadow duration-200 hover:shadow-md cursor-pointer
                 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400
                 dark:border-navy-700 dark:bg-navy-900"
    >
      {/* Photo — restrained 16:10 band keeps the small source thumbnails close to
          native size (avoids upscaling) while keeping the grid visually uniform. */}
      <div className="relative aspect-[16/10] overflow-hidden bg-surface-100 dark:bg-navy-800">
        {imageUrl && !imgFailed ? (
          <img
            src={imageUrl}
            alt={dest.name}
            loading="lazy"
            onError={() => setImgFailed(true)}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-surface-500 dark:text-slate-500">
            <span className="text-xs font-medium uppercase tracking-wide">Image unavailable</span>
          </div>
        )}

        {dest.permit_hint && (
          <span className="absolute left-3 top-3 rounded bg-navy-900/85 px-2 py-1 text-[11px] font-semibold uppercase tracking-wide text-white">
            Permit likely
          </span>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div>
          <h3 className="font-serif text-xl leading-snug text-navy-900 dark:text-white">
            {dest.name}
          </h3>
          <p className="mt-1 text-sm text-surface-600 dark:text-slate-400">
            {dest.province}
            {district ? ` · ${district}` : ''}
          </p>
        </div>

        {/* Metadata grid */}
        <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
          <div>
            <dt className="text-[11px] font-semibold uppercase tracking-wide text-surface-500 dark:text-slate-500">
              Difficulty
            </dt>
            <dd className="text-navy-900 dark:text-slate-200">{dest.difficulty || '—'}</dd>
          </div>
          <div>
            <dt className="text-[11px] font-semibold uppercase tracking-wide text-surface-500 dark:text-slate-500">
              Best season
            </dt>
            <dd className="text-navy-900 dark:text-slate-200">
              {season || 'Season info unavailable'}
            </dd>
          </div>
          <div className="col-span-2">
            <dt className="text-[11px] font-semibold uppercase tracking-wide text-surface-500 dark:text-slate-500">
              Access
            </dt>
            <dd className="text-navy-900 dark:text-slate-200">
              {dest.access_type || '—'}
              {confidence.note && (
                <span className={`ml-2 text-xs ${confidenceClass}`}>({confidence.note})</span>
              )}
            </dd>
          </div>
        </dl>

        {dest.season_note && (
          <p className="text-xs italic text-surface-500 dark:text-slate-500">{dest.season_note}</p>
        )}

        {/* Approximate-location note when coords are not map-safe */}
        {dest.coord_status && dest.coord_status !== 'verified' && (
          <p className="text-xs text-surface-500 dark:text-slate-500">
            Approximate location — not shown on map
          </p>
        )}

        {/* Why this matches */}
        {why && (
          <p className="mt-auto border-t border-surface-200 pt-3 text-sm text-surface-700 dark:border-navy-700 dark:text-slate-300">
            {why}
          </p>
        )}
      </div>
    </article>
  );
}
