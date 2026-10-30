import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/SocialContext';
import { useTitle } from '../hooks/useTitle';
import { wait } from '../utils/format';
import { Button, PasswordField, TextField } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { AuthLayout } from './AuthLayout';

function validate(values, users) {
  const errors = {};
  const name = values.name.trim();
  const username = values.username.trim();
  const email = values.email.trim();

  if (name.length < 2) errors.name = 'Name must be at least 2 characters';
  else if (name.length > 40) errors.name = 'Name must be 40 characters or fewer';

  if (!username) errors.username = 'Username is required';
  else if (!/^[a-zA-Z0-9_]{3,20}$/.test(username)) errors.username = 'Use 3–20 letters, numbers, or underscores';
  else if (users.some((user) => user.username.toLowerCase() === username.toLowerCase())) errors.username = 'That username is taken';

  if (!email) errors.email = 'Email is required';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = 'Enter a valid email address';
  else if (users.some((user) => user.email.toLowerCase() === email.toLowerCase())) errors.email = 'An account with this email already exists';

  if (!values.password) errors.password = 'Password is required';
  else if (values.password.length < 6) errors.password = 'Use at least 6 characters';
  else if (values.password.length > 64) errors.password = 'Password must be 64 characters or fewer';

  if (!values.confirm) errors.confirm = 'Confirm your password';
  else if (values.confirm !== values.password) errors.confirm = 'Passwords do not match';

  if (!values.terms) errors.terms = 'Please agree to continue';
  return errors;
}

const empty = { name: '', username: '', email: '', password: '', confirm: '', terms: false, remember: false };

export function SignupPage() {
  useTitle('Sign up');
  const { users, signup } = useAuth();
  const showToast = useToast();
  const navigate = useNavigate();
  const [values, setValues] = useState(empty);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [termsOpen, setTermsOpen] = useState(false);

  function update(key, value) {
    const next = { ...values, [key]: value };
    setValues(next);
    setErrors(validate(next, users));
  }

  function show(name) {
    return submitted || touched[name] ? errors[name] : '';
  }

  async function onSubmit(event) {
    event.preventDefault();
    setSubmitted(true);
    const nextErrors = validate(values, users);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    setSubmitting(true);
    await wait(700);
    signup(values, values.remember);
    setSubmitting(false);
    showToast('Welcome to Mounika');
    navigate('/', { replace: true });
  }

  return (
    <AuthLayout>
      <form onSubmit={onSubmit} className="animate-rise space-y-4" noValidate>
        <div>
          <h1 className="font-display text-4xl text-ink">Create your account</h1>
          <p className="mt-2 text-sm text-ink-soft">Join the people already sharing work, trips, and ordinary good days.</p>
        </div>
        <TextField
          id="signup-name"
          label="Name"
          autoComplete="name"
          maxLength={40}
          value={values.name}
          error={show('name')}
          onBlur={() => setTouched((current) => ({ ...current, name: true }))}
          onChange={(event) => update('name', event.target.value)}
        />
        <TextField
          id="signup-username"
          label="Username"
          autoComplete="username"
          autoCapitalize="none"
          spellCheck={false}
          maxLength={20}
          value={values.username}
          error={show('username')}
          hint="Letters, numbers, and underscores."
          onBlur={() => setTouched((current) => ({ ...current, username: true }))}
          onChange={(event) => update('username', event.target.value)}
        />
        <TextField
          id="signup-email"
          label="Email"
          type="email"
          autoComplete="email"
          value={values.email}
          error={show('email')}
          onBlur={() => setTouched((current) => ({ ...current, email: true }))}
          onChange={(event) => update('email', event.target.value)}
        />
        <PasswordField
          id="signup-password"
          label="Password"
          autoComplete="new-password"
          maxLength={64}
          value={values.password}
          error={show('password')}
          hint="At least 6 characters."
          onBlur={() => setTouched((current) => ({ ...current, password: true }))}
          onChange={(event) => update('password', event.target.value)}
        />
        <PasswordField
          id="signup-confirm"
          label="Confirm password"
          autoComplete="new-password"
          maxLength={64}
          value={values.confirm}
          error={show('confirm')}
          onBlur={() => setTouched((current) => ({ ...current, confirm: true }))}
          onChange={(event) => update('confirm', event.target.value)}
        />
        <div>
          <label className="flex items-start gap-2 text-sm text-ink-soft">
            <input
              type="checkbox"
              checked={values.terms}
              onChange={(event) => update('terms', event.target.checked)}
              className="mt-0.5 h-4 w-4 accent-brand-600"
            />
            <span>
              I agree to the{' '}
              <button type="button" className="font-bold text-brand-700 hover:underline" onClick={() => setTermsOpen(true)}>
                Terms and Privacy Policy
              </button>
            </span>
          </label>
          {show('terms') && <p className="mt-1.5 text-xs font-medium text-rose-600">{show('terms')}</p>}
        </div>
        <label className="flex items-center gap-2 text-sm font-semibold text-ink-soft">
          <input
            type="checkbox"
            checked={values.remember}
            onChange={(event) => update('remember', event.target.checked)}
            className="h-4 w-4 accent-brand-600"
          />
          Remember me
        </label>
        <Button type="submit" className="w-full" loading={submitting}>
          Create account
        </Button>
        <p className="text-center text-sm text-ink-soft">
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-brand-700 hover:underline">
            Log in
          </Link>
        </p>
      </form>
      <Modal open={termsOpen} onClose={() => setTermsOpen(false)} title="Terms and privacy">
        <div className="space-y-3 text-sm leading-relaxed text-ink-soft">
          <p>Mounika is a front-end demo. Accounts, posts, and messages are stored in your browser and never sent to a server.</p>
          <p>Be kind in what you post here. Because this is sample software, do not enter a password you use anywhere else.</p>
          <p>You can clear the demo at any time by removing this site’s local storage in your browser settings.</p>
        </div>
      </Modal>
    </AuthLayout>
  );
}
