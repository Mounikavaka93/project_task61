import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/SocialContext';
import { useTitle } from '../hooks/useTitle';
import { wait } from '../utils/format';
import { Button, PasswordField, TextField } from '../components/ui/Button';
import { AuthLayout } from './AuthLayout';

const demo = { email: 'mounika@vesper.app', password: 'password123' };

function validate({ email, password }) {
  const errors = {};
  if (!email.trim()) errors.email = 'Email is required';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) errors.email = 'Enter a valid email address';
  if (!password) errors.password = 'Password is required';
  else if (password.length < 6) errors.password = 'Password must be at least 6 characters';
  return errors;
}

export function LoginPage() {
  useTitle('Log in');
  const { login } = useAuth();
  const showToast = useToast();
  const navigate = useNavigate();
  const [values, setValues] = useState({ email: '', password: '', remember: false });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [touched, setTouched] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const visibleErrors = {
    email: submitted || touched.email ? errors.email : '',
    password: submitted || touched.password ? errors.password : '',
  };

  function update(key, value) {
    const next = { ...values, [key]: value };
    setValues(next);
    setFormError('');
    setErrors(validate(next));
  }

  async function onSubmit(event) {
    event.preventDefault();
    setSubmitted(true);
    const nextErrors = validate(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    setSubmitting(true);
    await wait(650);
    const result = login(values);
    setSubmitting(false);
    if (!result.ok) {
      setFormError(result.error);
      return;
    }
    showToast('Welcome back');
    navigate('/', { replace: true });
  }

  return (
    <AuthLayout>
      <form onSubmit={onSubmit} className="animate-rise space-y-4" noValidate>
        <div>
          <h1 className="font-display text-4xl text-ink">Welcome back</h1>
          <p className="mt-2 text-sm text-ink-soft">Log in to see your feed, messages, and notifications.</p>
        </div>
        {formError && (
          <p role="alert" className="rounded-xl bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-700">
            {formError}
          </p>
        )}
        <TextField
          id="login-email"
          label="Email"
          type="email"
          autoComplete="email"
          value={values.email}
          error={visibleErrors.email}
          onBlur={() => setTouched((current) => ({ ...current, email: true }))}
          onChange={(event) => update('email', event.target.value)}
        />
        <PasswordField
          id="login-password"
          label="Password"
          autoComplete="current-password"
          value={values.password}
          error={visibleErrors.password}
          onBlur={() => setTouched((current) => ({ ...current, password: true }))}
          onChange={(event) => update('password', event.target.value)}
        />
        <label className="flex items-center gap-2 text-sm font-semibold text-ink-soft">
          <input
            type="checkbox"
            checked={values.remember}
            onChange={(event) => update('remember', event.target.checked)}
            className="h-4 w-4 rounded accent-brand-600"
          />
          Remember me
        </label>
        <Button type="submit" className="w-full" loading={submitting}>
          Log in
        </Button>
        <div className="rounded-2xl border border-line bg-brand-50 px-4 py-3 text-sm">
          <p className="font-bold text-ink">Try the demo</p>
          <p className="mt-1 text-ink-soft">
            {demo.email} · {demo.password}
          </p>
          <button
            type="button"
            className="mt-2 font-bold text-brand-700 hover:underline"
            onClick={() => {
              setValues({ email: demo.email, password: demo.password, remember: true });
              setErrors({});
              setFormError('');
            }}
          >
            Fill demo account
          </button>
        </div>
        <p className="text-center text-sm text-ink-soft">
          New here?{' '}
          <Link to="/signup" className="font-bold text-brand-700 hover:underline">
            Create an account
          </Link>
        </p>
        <p className="text-center text-xs text-ink-faint lg:hidden">This demo keeps accounts in your browser only.</p>
      </form>
    </AuthLayout>
  );
}
