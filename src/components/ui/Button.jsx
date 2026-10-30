import { useState } from 'react';
import { cn } from '../../utils/cn';
import { Icon } from './Icon';

export function Spinner({ className }) {
  return (
    <span
      className={cn(
        'inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent',
        className,
      )}
      aria-hidden="true"
    />
  );
}

const variants = {
  primary: 'bg-brand-600 text-white shadow-sm hover:bg-brand-700',
  secondary: 'border border-line bg-white text-ink hover:bg-canvas',
  ghost: 'text-ink-soft hover:bg-ink/[0.05] hover:text-ink',
  soft: 'bg-brand-50 text-brand-700 hover:bg-brand-100',
  danger: 'bg-rose-50 text-rose-700 hover:bg-rose-100',
};

const sizes = {
  sm: 'h-9 px-3 text-sm',
  md: 'h-11 px-4 text-sm',
};

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  className,
  children,
  disabled,
  type = 'button',
  ...props
}) {
  return (
    <button
      type={type}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-xl font-bold transition duration-200 active:scale-[0.98] disabled:opacity-60',
        variants[variant],
        sizes[size],
        className,
      )}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading && <Spinner />}
      {children}
    </button>
  );
}

export function IconButton({ label, className, children, ...props }) {
  return (
    <button
      type="button"
      aria-label={label}
      className={cn(
        'inline-flex h-10 w-10 items-center justify-center rounded-xl text-ink-soft transition hover:bg-ink/[0.05] hover:text-ink',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export function inputClass(invalid) {
  return cn(
    'w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm text-ink outline-none transition placeholder:text-ink-faint focus:border-brand-500 focus:ring-4 focus:ring-brand-500/15',
    invalid ? 'border-rose-400 focus:border-rose-400 focus:ring-rose-400/15' : 'border-line',
  );
}

function FieldMessage({ id, error, hint }) {
  if (error) {
    return (
      <p id={id} className="mt-1.5 text-xs font-medium text-rose-600">
        {error}
      </p>
    );
  }
  if (hint) {
    return <p className="mt-1.5 text-xs text-ink-faint">{hint}</p>;
  }
  return null;
}

export function TextField({ id, label, error, hint, type = 'text', className, ...props }) {
  return (
    <div className={className}>
      {label && (
        <label htmlFor={id} className="mb-1.5 block text-sm font-bold text-ink">
          {label}
        </label>
      )}
      <input
        id={id}
        type={type}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        className={inputClass(Boolean(error))}
        {...props}
      />
      <FieldMessage id={`${id}-error`} error={error} hint={hint} />
    </div>
  );
}

export function PasswordField({ id, label, error, hint, className, ...props }) {
  const [visible, setVisible] = useState(false);

  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block text-sm font-bold text-ink">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={visible ? 'text' : 'password'}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          className={cn(inputClass(Boolean(error)), 'pr-11')}
          {...props}
        />
        <button
          type="button"
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-ink-faint transition hover:text-ink"
          onClick={() => setVisible((value) => !value)}
          aria-label={visible ? 'Hide password' : 'Show password'}
        >
          <Icon name={visible ? 'eyeOff' : 'eye'} className="h-5 w-5" />
        </button>
      </div>
      <FieldMessage id={`${id}-error`} error={error} hint={hint} />
    </div>
  );
}

export function TextAreaField({ id, label, error, hint, className, ...props }) {
  return (
    <div className={className}>
      {label && (
        <label htmlFor={id} className="mb-1.5 block text-sm font-bold text-ink">
          {label}
        </label>
      )}
      <textarea
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        className={cn(inputClass(Boolean(error)), 'min-h-28 resize-y')}
        {...props}
      />
      <FieldMessage id={`${id}-error`} error={error} hint={hint} />
    </div>
  );
}
