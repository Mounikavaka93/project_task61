import { cn } from '../../utils/cn';

export function EmptyState({ title, text, action, className }) {
  return (
    <div className={cn('rounded-2xl border border-dashed border-line bg-card px-6 py-12 text-center shadow-card', className)}>
      <h2 className="font-display text-2xl text-ink">{title}</h2>
      {text && <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-ink-soft">{text}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function PageHeader({ title, subtitle, action }) {
  return (
    <header className="mb-5 flex items-end justify-between gap-3">
      <div>
        <h1 className="font-display text-[2rem] leading-none text-ink sm:text-4xl">{title}</h1>
        {subtitle && <p className="mt-2 text-sm text-ink-soft">{subtitle}</p>}
      </div>
      {action}
    </header>
  );
}
