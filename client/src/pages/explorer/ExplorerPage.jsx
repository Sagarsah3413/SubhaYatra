import { useCallback, useEffect, useState } from 'react';
import { Header } from '../../components/header/Header';
import Footer from '../../components/footer/Footer';
import explorerService from '../../services/explorerService';
import ExplorerFilters from './ExplorerFilters';
import DestinationCard from './DestinationCard';
import ExplorerMap from './ExplorerMap';

const PAGE_LIMIT = 24;

const EMPTY_FILTERS = { month: '', difficulty: '', province: '', access: '' };

function SkeletonCard() {
  return (
    <div className="overflow-hidden rounded-lg border border-surface-300 dark:border-navy-700">
      <div className="aspect-[4/3] loading-skeleton" />
      <div className="space-y-3 p-5">
        <div className="h-5 w-3/4 rounded loading-skeleton" />
        <div className="h-4 w-1/2 rounded loading-skeleton" />
        <div className="h-4 w-full rounded loading-skeleton" />
        <div className="h-4 w-2/3 rounded loading-skeleton" />
      </div>
    </div>
  );
}

export default function ExplorerPage() {
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [page, setPage] = useState(1);

  const [options, setOptions] = useState(null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showMap, setShowMap] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false); // mobile collapsible

  const hasActive = Boolean(
    filters.month || filters.difficulty || filters.province || filters.access,
  );

  // Load filter options once.
  useEffect(() => {
    let active = true;
    explorerService
      .getOptions()
      .then((res) => active && setOptions(res))
      .catch(() => active && setOptions(null)); // non-fatal; filters still valid
    return () => {
      active = false;
    };
  }, []);

  // Fetch destinations whenever filters or page change.
  const fetchDestinations = useCallback(() => {
    setLoading(true);
    setError(null);

    explorerService
      .explore({
        month: filters.month,
        difficulty: filters.difficulty,
        province: filters.province,
        access: filters.access,
        page,
        limit: PAGE_LIMIT,
      })
      .then((res) => {
        setData(res);
        setLoading(false);
      })
      .catch((err) => {
        setError(
          err && err.isOffline
            ? "Can't reach the server. Make sure the backend is running on http://localhost:8000, then retry."
            : 'We could not load destinations just now.',
        );
        setLoading(false);
      });
  }, [filters, page]);

  useEffect(() => {
    fetchDestinations();
  }, [fetchDestinations]);

  // Changing any filter resets pagination to page 1.
  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1);
  };

  const handleReset = () => {
    setFilters(EMPTY_FILTERS);
    setPage(1);
  };

  const destinations = data?.destinations || [];
  const totalPages = data?.pages || 1;
  const total = data?.total ?? 0;

  return (
    <div className="flex min-h-screen flex-col bg-surface-50 text-navy-900 dark:bg-navy-950 dark:text-white">
      <Header />

      <main className="flex-1 pt-16">
        {/* Compact, photography-led hero that flows into results */}
        <section className="border-b border-surface-200 bg-white dark:border-navy-800 dark:bg-navy-900">
          <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:py-14">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-600 dark:text-amber-400">
              Explore Nepal
            </p>
            <h1 className="mt-3 max-w-2xl font-serif text-3xl leading-tight text-navy-900 dark:text-white sm:text-4xl">
              Find your next Nepal destination
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-surface-600 dark:text-slate-400 sm:text-base">
              Filter by month, difficulty, province, and how you want to get there. Every match is
              explained with the destination's own seasonal, terrain, and access details.
            </p>
          </div>
        </section>

        {/* Filters + controls */}
        <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
          {/* Mobile toggle for collapsible filters */}
          <div className="mb-4 flex items-center justify-between lg:hidden">
            <button
              type="button"
              onClick={() => setFiltersOpen((o) => !o)}
              aria-expanded={filtersOpen}
              className="inline-flex items-center gap-2 rounded-lg border border-surface-300 px-4 py-2 text-sm font-medium text-navy-900 dark:border-navy-700 dark:text-white"
            >
              Filters
              {hasActive && (
                <span className="inline-flex h-2 w-2 rounded-full bg-amber-500" aria-hidden="true" />
              )}
            </button>
          </div>

          <div className={`${filtersOpen ? 'block' : 'hidden'} lg:block`}>
            <ExplorerFilters
              filters={filters}
              options={options}
              onChange={handleFilterChange}
              onReset={handleReset}
              hasActive={hasActive}
            />
          </div>

          {/* Result summary + map toggle */}
          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-surface-200 pt-4 dark:border-navy-800">
            <p className="text-sm text-surface-600 dark:text-slate-400">
              {loading
                ? 'Loading destinations…'
                : error
                  ? ''
                  : `${total} destination${total === 1 ? '' : 's'} found`}
            </p>
            <button
              type="button"
              onClick={() => setShowMap((m) => !m)}
              aria-pressed={showMap}
              className={`inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors
                ${showMap
                  ? 'border-amber-500 text-amber-600 dark:border-amber-400 dark:text-amber-400'
                  : 'border-surface-300 text-navy-900 dark:border-navy-700 dark:text-white'}`}
            >
              {showMap ? 'Hide map' : 'Show map'}
            </button>
          </div>
        </section>

        {/* Map panel (hidden by default) */}
        {showMap && !loading && !error && destinations.length > 0 && (
          <section className="mx-auto max-w-7xl px-4 pb-6 sm:px-6">
            <ExplorerMap destinations={destinations} />
          </section>
        )}

        {/* Results */}
        <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6">
          {loading && (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          )}

          {!loading && error && (
            <div className="mx-auto max-w-md py-16 text-center">
              <h2 className="font-serif text-xl text-navy-900 dark:text-white">
                Something went wrong
              </h2>
              <p className="mt-2 text-sm text-surface-600 dark:text-slate-400">
                {error}
              </p>
              <button
                type="button"
                onClick={fetchDestinations}
                className="mt-5 rounded-lg bg-amber-500 px-5 py-2.5 text-sm font-semibold text-navy-950 transition-colors hover:bg-amber-400"
              >
                Retry
              </button>
            </div>
          )}

          {!loading && !error && destinations.length === 0 && (
            <div className="mx-auto max-w-md py-16 text-center">
              <h2 className="font-serif text-xl text-navy-900 dark:text-white">
                No destinations match your filters
              </h2>
              <p className="mt-2 text-sm text-surface-600 dark:text-slate-400">
                Try relaxing one filter — for example widening the month or choosing any province.
              </p>
              {hasActive && (
                <button
                  type="button"
                  onClick={handleReset}
                  className="mt-5 rounded-lg border border-surface-300 px-5 py-2.5 text-sm font-semibold text-navy-900 transition-colors hover:border-navy-400 dark:border-navy-700 dark:text-white"
                >
                  Clear all filters
                </button>
              )}
            </div>
          )}

          {!loading && !error && destinations.length > 0 && (
            <>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {destinations.map((dest) => (
                  <DestinationCard key={dest.id} dest={dest} filters={filters} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <nav
                  aria-label="Pagination"
                  className="mt-10 flex items-center justify-center gap-4"
                >
                  <button
                    type="button"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page <= 1}
                    className="rounded-lg border border-surface-300 px-4 py-2 text-sm font-medium text-navy-900 transition-colors hover:border-navy-400 disabled:cursor-not-allowed disabled:opacity-40 dark:border-navy-700 dark:text-white"
                  >
                    Previous
                  </button>
                  <span className="text-sm text-surface-600 dark:text-slate-400">
                    Page {page} of {totalPages}
                  </span>
                  <button
                    type="button"
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page >= totalPages}
                    className="rounded-lg border border-surface-300 px-4 py-2 text-sm font-medium text-navy-900 transition-colors hover:border-navy-400 disabled:cursor-not-allowed disabled:opacity-40 dark:border-navy-700 dark:text-white"
                  >
                    Next
                  </button>
                </nav>
              )}
            </>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
