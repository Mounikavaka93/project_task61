import { cn } from '../../utils/cn';
import { Icon } from './Icon';

export function Logo({ light = false, compact = false }) {
  return (
    <span className="inline-flex items-center gap-2.5">
      <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-brand-400 to-brand-700 text-white shadow-sm">
        <Icon name="aperture" className="h-5 w-5" />
      </span>
      {!compact && (
        <span className={cn('font-display text-[1.45rem] leading-none tracking-tight sm:text-[1.65rem]', light ? 'text-white' : 'text-ink')}>
          Mounika
        </span>
      )}
    </span>
  );
}
