import React, { useState } from 'react';
import {
  CalendarDays, Eye, EyeOff, LockKeyhole, Mail, ArrowRight,
  GraduationCap, ShieldCheck, UserRound, UserPlus, LogIn,
} from 'lucide-react';
import { registerAccount, signIn } from '../services/authService';

export function Login({ onLogin, initialError = '' }) {
  const [mode, setMode] = useState('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(initialError);
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const changeMode = nextMode => {
    setMode(nextMode);
    setError('');
    setSuccess('');
    setPassword('');
    setConfirmPassword('');
  };

  const handleSignup = async event => {
    event.preventDefault();
    setError('');
    setSuccess('');
    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanName) return setError('Please enter your full name.');
    if (password.length < 12) return setError('Use a password with at least 12 characters.');
    if (password !== confirmPassword) return setError('Passwords do not match.');

    setLoading(true);
    try {
      const registration = await registerAccount({ name: cleanName, email: cleanEmail, password });
      setSuccess(`${registration.message} Sign in with your email and password.`);
      setMode('login');
      setName('');
      setEmail(cleanEmail);
      setPassword('');
      setConfirmPassword('');
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async event => {
    event.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const user = await signIn({ email: email.trim().toLowerCase(), password });
      onLogin(user);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login-page">
      <div className="login-decoration login-decoration-one" />
      <div className="login-decoration login-decoration-two" />

      <section className="login-brand-panel">
        <div className="login-brand">
          <div className="login-brand-mark"><CalendarDays size={25} /></div>
          <div><b>Uni<span>Schedule</span></b><small>SMART ACADEMIC PLANNER</small></div>
        </div>
        <div className="login-promo">
          <span className="login-kicker"><span className="sparkle-dot">✦</span> UNIVERSITY TIMETABLE MANAGEMENT</span>
          <h1>Make every<br />class <em>count.</em></h1>
          <p>One connected place for lecture schedules, rooms, lecturers and student batches.</p>
          <div className="login-feature"><span><CalendarDays size={18} /></span><div><b>Clear weekly calendar</b><small>See your classes at a glance.</small></div></div>
          <div className="login-feature"><span><ShieldCheck size={18} /></span><div><b>Smarter scheduling</b><small>Spot room, lecturer and batch conflicts.</small></div></div>
        </div>
        <div className="login-university"><GraduationCap size={18} /><span>Faculty of Technology<br /><small>South Eastern University of Sri Lanka</small></span></div>
      </section>

      <section className="login-form-panel">
        <form className="login-card" onSubmit={mode === 'login' ? handleLogin : handleSignup}>
          <div className="login-mobile-brand"><div className="login-brand-mark"><CalendarDays size={22} /></div><b>Uni<span>Schedule</span></b></div>

          <div className="login-welcome">
            <span className="login-mini-icon">{mode === 'login' ? <LogIn size={19} /> : <UserPlus size={19} />}</span>
            <h2>{mode === 'login' ? 'Welcome back' : 'Create your account'}</h2>
            <p>{mode === 'login' ? 'Sign in to your academic workspace.' : 'Register a secure student account.'}</p>
          </div>

          {mode === 'signup' && <>
            <label className="login-label" htmlFor="signup-name">Full name</label>
            <div className="login-input-wrap"><UserRound size={17} /><input id="signup-name" value={name} onChange={event => setName(event.target.value)} placeholder="Enter your full name" autoComplete="name" required maxLength={100} /></div>
          </>}

          <label className="login-label" htmlFor="login-email">Email address</label>
          <div className="login-input-wrap"><Mail size={17} /><input id="login-email" type="email" value={email} onChange={event => setEmail(event.target.value)} placeholder="you@university.edu" required autoComplete="username" maxLength={254} /></div>

          <label className="login-label" htmlFor="login-password">Password</label>
          <div className="login-input-wrap"><LockKeyhole size={17} /><input id="login-password" type={showPassword ? 'text' : 'password'} value={password} onChange={event => setPassword(event.target.value)} placeholder={mode === 'signup' ? 'At least 12 characters' : 'Enter your password'} required autoComplete={mode === 'login' ? 'current-password' : 'new-password'} minLength={mode === 'signup' ? 12 : undefined} maxLength={128} /><button type="button" className="login-eye" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? 'Hide password' : 'Show password'}>{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button></div>

          {mode === 'signup' && <>
            <label className="login-label" htmlFor="confirm-password">Confirm password</label>
            <div className="login-input-wrap"><LockKeyhole size={17} /><input id="confirm-password" type={showPassword ? 'text' : 'password'} value={confirmPassword} onChange={event => setConfirmPassword(event.target.value)} placeholder="Enter password again" required autoComplete="new-password" maxLength={128} /></div>
            <small className="field-help">Use at least 12 characters. Self-registration creates a student account; administrators are provisioned by the system operator.</small>
          </>}

          {error && <div className="login-error" role="alert">{error}</div>}
          {success && <div className="login-success" role="status">{success}</div>}

          <button className="login-submit" type="submit" disabled={loading}>{mode === 'login' ? (loading ? 'Signing in…' : 'Sign in to UniSchedule') : (loading ? 'Creating account…' : 'Create account')} <ArrowRight size={17} /></button>

          <div className="login-switch">
            {mode === 'login' ? <>Don't have an account? <button type="button" onClick={() => changeMode('signup')}>Create account</button></> : <>Already have an account? <button type="button" onClick={() => changeMode('login')}>Sign in</button></>}
          </div>
          <div className="login-demo">
            <small>Sign-in and scheduling data are secured by the UniSchedule API.</small>
          </div>
          <div className="login-footer">© 2026 UniSchedule · Academic scheduling made simple</div>
        </form>
      </section>
    </main>
  );
}
