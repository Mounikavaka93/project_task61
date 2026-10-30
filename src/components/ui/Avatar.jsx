import { useState } from 'react';
import { cn } from '../../utils/cn';

const sizes = {
  xs: 'h-8 w-8 text-[11px]',
  sm: 'h-9 w-9 text-xs',
  md: 'h-11 w-11 text-sm',
  story: 'h-14 w-14 text-lg',
  lg: 'h-16 w-16 text-xl',
  xl: 'h-24 w-24 text-3xl',
};

const gradients = [
  'from-violet-500 to-fuchsia-500',
  'from-amber-500 to-rose-500',
  'from-teal-500 to-indigo-500',
  'from-sky-500 to-violet-600',
  'from-orange-400 to-rose-500',
];

function initials(name = '') {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');
}

function gradientFor(id = '') {
  const index = [...id].reduce((sum, char) => sum + char.charCodeAt(0), 0) % gradients.length;
  return gradients[index];
}

export function Avatar({ user, size = 'md', online = false, className }) {
  const [failed, setFailed] = useState(false);
  const label = user?.name || 'Member';
  const showImage = Boolean(user?.avatar) && !failed;

  return (
    <span className={cn('relative inline-flex shrink-0', className)}>
      {showImage ? (
        <img
          src={user.avatar}
          alt=""
          className={cn('rounded-full object-cover', sizes[size])}
          onError={() => setFailed(true)}
        />
      ) : (
        <span
          aria-hidden="true"
          className={cn(
            'grid place-items-center rounded-full bg-gradient-to-br font-bold text-white',
            sizes[size],
            gradientFor(user?.id),
          )}
        >
          {initials(label) || 'L'}
        </span>
      )}
      {online && (
        <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-500" />
      )}
      <span className="sr-only">{label}</span>
    </span>
  );
}
