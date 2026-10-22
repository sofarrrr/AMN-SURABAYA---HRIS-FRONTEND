import { useState } from 'react';
import type { FormEvent } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router';
import { useAuth } from '../hooks/useAuth';

export default function Login() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [recoveryMessage, setRecoveryMessage] = useState('');

  if (user) return <Navigate to={`/${user.role.toLowerCase()}/dashboard`} replace />;

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const found = login(email, password);
    if (found) {
      navigate(location.state?.from || `/${found.role.toLowerCase()}/dashboard`, { replace: true });
    } else {
      setError('Email atau kata sandi tidak sesuai.');
    }
  };

  return (
    <section className="login-page grid max-w-full content-center">
      <div className="login-intro grid">
        <h1 className="login-title">HRIS AMN Surabaya</h1>
        <p className="login-description">Akses data, layanan, dan kebutuhan HR dalam satu sistem.</p>
      </div>

      <form className="login-form grid" onSubmit={submit}>
        <label className="login-field grid">
          <span>Email</span>
          <input
            className="login-input"
            type="email"
            value={email}
            placeholder="Masukkan alamat email"
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="username"
            required
          />
        </label>

        <label className="login-field grid">
          <span>Password</span>
          <span className="login-password-control relative block min-w-0">
            <input
              className="login-input login-input-password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              placeholder="Masukkan kata sandi"
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              required
            />
            <button
              className="login-password-toggle absolute right-2 top-1/2 grid size-7 -translate-y-1/2 place-items-center rounded-md"
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
            >
              <img className="size-4" src="/assets/figma-eye-off.svg" alt="" />
            </button>
          </span>
        </label>

        {error && <p className="login-error" role="alert">{error}</p>}

        <button className="login-recovery justify-self-end rounded px-1 py-1" type="button" onClick={() => setRecoveryMessage('Silakan hubungi administrator HRIS untuk mengatur ulang kata sandi.')}>
          Forgot Password?
        </button>
        {recoveryMessage && <p className="login-recovery-message" role="status">{recoveryMessage}</p>}

        <button className="login-submit h-9 w-full justify-self-center rounded-2xl px-4" type="submit">
          Sign In
        </button>
      </form>

      <div className="login-social-section grid">
        <div className="login-divider flex w-full items-center justify-center py-2">
          <img className="h-px min-w-0 flex-1" src="/assets/figma-divider.svg" alt="" />
          <span className="login-divider-label">Or</span>
          <img className="h-px min-w-0 flex-1" src="/assets/figma-divider.svg" alt="" />
        </div>
        <button className="login-google-button flex w-full items-center justify-center disabled:cursor-not-allowed" type="button" disabled aria-label="Sign in with Google belum tersedia">
          <img src="/assets/figma-google.svg" alt="" />
          <span>Sign in with Google</span>
        </button>
      </div>
    </section>
  );
}
