import type { User as UserType } from '@/lib/api';

interface ServerResultsProps {
  users: UserType[];
  totalItems?: number;
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

/**
 * Server Component rendering the first page of results as static HTML.
 * Visible to crawlers without client JS. The client hydration swaps this
 * out for the interactive ResultsTable on mount.
 */
export default function ServerResults({ users, totalItems }: ServerResultsProps) {
  if (users.length === 0) return null;

  return (
    <div className="space-y-4">
      <h2 className="sr-only">نتایج جستجوی کاربران</h2>
      {totalItems != null && (
        <p className="px-1 text-sm text-slate-500 dark:text-slate-400">
          <span className="font-semibold text-slate-700 dark:text-slate-300">
            {users.length}
          </span>{' '}
          از <span className="font-semibold text-slate-700 dark:text-slate-300">{totalItems}</span> کاربر
        </p>
      )}
      <div className="grid grid-cols-1 gap-3">
        {users.map((user) => (
          <article key={user.id} className="card p-4">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-slate-200 text-sm font-bold text-slate-600 dark:bg-slate-700 dark:text-slate-300">
                {getInitials(user.full_name || '?')}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                  {user.full_name || 'نام نامشخص'}
                </h3>
                {user.job_title && (
                  <p className="mt-0.5 text-sm text-slate-600 dark:text-slate-400">
                    {user.job_title}
                  </p>
                )}
                {user.job_company_name && (
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    {user.job_company_name}
                  </p>
                )}
                {user.summary && (
                  <p className="mt-2 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
                    {user.summary.slice(0, 200)}
                  </p>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
