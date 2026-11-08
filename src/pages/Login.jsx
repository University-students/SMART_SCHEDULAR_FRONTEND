// Login page: sign in with a demo/local account or create a new local account.
import React, { useState } from 'react';
import {
  CalendarDays, Eye, EyeOff, LockKeyhole, Mail, ArrowRight,
  GraduationCap, ShieldCheck, UserRound, UserPlus, LogIn
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login, signup } = useAuth();
  const [mode, setMode] = useState('login'); // 'login' or 'signup'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('admin@unischedule.lk');
  const [password, setPassword] = useState('admin123');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('Administrator');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  // Switch between sign-in and account creation without leaving this page.
  const changeMode = (nextMode) => {
    setMode(nextMode);
    setError('');
    setSuccess('');
    setLoading(false);
    if (nextMode === 'signup') {
      setName('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setRole('Student');
    } else {
      setConfirmPassword('');
    }
  };

  // Validate the form and create a local account (validation lives in authService).
  const handleSignup = (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');
    try {
      const account = signup({ name, email, password, confirmPassword, role });
      setSuccess('Account created successfully. You can now sign in with your email and password.');
      setMode('login');
      setName('');
      setEmail(account.email);
      setPassword('');
      setConfirmPassword('');
      setRole(account.role);
    } catch (err) {
      setError(err.message);
    }
  };

  // Sign in using a built-in demo account or one created on this browser.
  const handleLogin = (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    window.setTimeout(() => {
      try {
        login(email, password, role); // AuthContext updates the user and App switches to the workspace
      } catch (err) {
        setLoading(false);
        setError(err.message);
      }
    }, 150);
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
            <p>{mode === 'login' ? 'Sign in to your academic workspace.' : 'Register to start using UniSchedule.'}</p>
          </div>

          {mode === 'signup' && <>
            <label className="login-label" htmlFor="signup-name">Full name</label>
            <div className="login-input-wrap"><UserRound size={17} /><input id="signup-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter your full name" autoComplete="name" required /></div>
          </>}

          <label className="login-label" htmlFor="login-email">Email address</label>
          <div className="login-input-wrap"><Mail size={17} /><input id="login-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@university.edu" required autoComplete="username" /></div>

          <label className="login-label" htmlFor="login-password">Password</label>
          <div className="login-input-wrap"><LockKeyhole size={17} /><input id="login-password" type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder={mode === 'signup' ? 'At least 6 characters' : 'Enter your password'} required autoComplete={mode === 'login' ? 'current-password' : 'new-password'} minLength={mode === 'signup' ? 6 : undefined} /><button type="button" className="login-eye" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? 'Hide password' : 'Show password'}>{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button></div>

          {mode === 'signup' && <>
            <label className="login-label" htmlFor="confirm-password">Confirm password</label>
            <div className="login-input-wrap"><LockKeyhole size={17} /><input id="confirm-password" type={showPassword ? 'text' : 'password'} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Enter password again" required autoComplete="new-password" /></div>
          </>}

          <label className="login-label" htmlFor="login-role">{mode === 'login' ? 'Sign in as' : 'Account type'}</label>
          <select id="login-role" className="login-role" value={role} onChange={(e) => setRole(e.target.value)}>
            <option>Administrator</option><option>Lecturer</option><option>Student</option>
          </select>

          {error && <div className="login-error" role="alert">{error}</div>}
          {success && <div className="login-success" role="status">{success}</div>}

          <button className="login-submit" type="submit" disabled={loading}>{mode === 'login' ? (loading ? 'Signing in…' : 'Sign in to UniSchedule') : 'Create account'} <ArrowRight size={17} /></button>

          <div className="login-switch">
            {mode === 'login' ? <>Don't have an account? <button type="button" onClick={() => changeMode('signup')}>Create account</button></> : <>Already have an account? <button type="button" onClick={() => changeMode('login')}>Sign in</button></>}
          </div>

          {mode === 'login' && <div className="login-demo">
            <b>Demo accounts</b>
            <p>Admin: admin@unischedule.lk / admin123</p>
            <p>Lecturer: lecturer@unischedule.lk / lecture123</p>
            <p>Student: student@unischedule.lk / student123</p>
            <small>New accounts are stored in this browser for this frontend prototype.</small>
          </div>}
          <div className="login-footer">© 2026 UniSchedule · Academic scheduling made simple</div>
        </form>
      </section>
    </main>
  );
}
