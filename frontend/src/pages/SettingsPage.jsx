import React, { useState } from 'react';
import {
  AlertTriangle, Bell, CheckCircle2, UserRound,
} from 'lucide-react';
import { ToggleRow, ShieldIcon } from '../components/shared';
import { apiRequest } from '../services/api';

export function SettingsPage({ role, notify, user, batches = [], onUserUpdate }) {
  const [push, setPush] = useState(true);
  const [auto, setAuto] = useState(true);
  const [batch, setBatch] = useState(user?.batch || '');
  const [emailReminders, setEmailReminders] = useState(Boolean(user?.emailReminders));
  const [savingEmail, setSavingEmail] = useState(false);
  const [emailError, setEmailError] = useState('');

  const saveEmailSettings = async () => {
    setSavingEmail(true);
    setEmailError('');
    try {
      const settings = { emailReminders };
      if (role === 'Student') settings.batch = batch;
      const { data } = await apiRequest('/auth/email-settings', {
        method: 'PUT',
        body: JSON.stringify(settings),
      });
      onUserUpdate?.(data);
      setEmailReminders(Boolean(data.emailReminders));
      setBatch(data.batch || '');
      notify(data.emailReminders ? 'Email lecture reminders enabled.' : 'Email settings saved.');
    } catch (error) {
      setEmailError(error.message);
    } finally {
      setSavingEmail(false);
    }
  };

  return (
    <div className="settings-grid">
      <section className="panel settings-panel">
        <div className="settings-title">
          <div className="settings-icon"><UserRound size={19} /></div>
          <div><h3>Workspace preferences</h3><p>Customise how you work with UniSchedule.</p></div>
        </div>
        <label className="field-label">Signed-in role</label>
        <div className="settings-select" aria-label="Signed-in role">{role}</div>
        <p className="field-help">Your access role is assigned by the system administrator.</p>
        <div className="settings-divider" />
        <div className="settings-title">
          <div className="settings-icon"><Bell size={19} /></div>
          <div><h3>Notifications</h3><p>Choose which alerts appear in this browser.</p></div>
        </div>
        <ToggleRow title="In-app notifications" desc="Show timetable updates in the notification centre." value={push} onChange={setPush} />
        <ToggleRow title="Conflict warnings" desc="Warn before saving overlapping lectures." value={auto} onChange={setAuto} />
        <button className="btn btn-primary" onClick={() => notify('Notification preferences apply to this browser session.')}>Save preferences</button>
        {['Lecturer', 'Student'].includes(role) && <>
          <div className="settings-divider" />
          <div className="settings-title">
            <div className="settings-icon"><Bell size={19} /></div>
            <div><h3>Email lecture reminders</h3><p>Receive a reminder 15 minutes before lectures at {user?.email || 'your account email'}.</p></div>
          </div>
          {role === 'Student' && <>
            <label className="field-label" htmlFor="email-batch">Your batch</label>
            <select id="email-batch" className="settings-input" value={batch} onChange={event => setBatch(event.target.value)}>
              <option value="">Select your batch</option>
              {batches.map(item => <option key={item.id} value={item.name}>{item.name}</option>)}
            </select>
          </>}
          <ToggleRow
            title="I agree to receive lecture reminders by email"
            desc="Reminders are sent to your signed-in account email. You can turn them off at any time."
            value={emailReminders}
            onChange={setEmailReminders}
          />
          <p className="field-help">Only opted-in lecturers and students receive reminders. Email delivery requires the university SMTP settings to be configured.</p>
          {emailError && <p className="settings-error" role="alert">{emailError}</p>}
          <button className="btn btn-primary" type="button" disabled={savingEmail} onClick={saveEmailSettings}>
            {savingEmail ? 'Saving…' : 'Save email settings'}
          </button>
        </>}
      </section>

      <section className="panel settings-panel">
        <div className="settings-title">
          <div className="settings-icon"><ShieldIcon /></div>
          <div><h3>Security & access</h3><p>API-enforced controls for this workspace.</p></div>
        </div>
        <div className="security-row"><CheckCircle2 size={17} /><div><b>Role-based access control</b><small>Write operations are restricted on the API.</small></div><span className="coming-soon">Enabled</span></div>
        <div className="security-row"><CheckCircle2 size={17} /><div><b>Secure password storage</b><small>Passwords are hashed on the server.</small></div><span className="coming-soon">Enabled</span></div>
        <div className="security-row"><CheckCircle2 size={17} /><div><b>Revocable session cookies</b><small>HttpOnly, SameSite cookies; HTTPS required in production.</small></div><span className="coming-soon">Enabled</span></div>
        <div className="security-note"><AlertTriangle size={17} /><p>Use HTTPS and a private MongoDB deployment in production. Keep the backend environment file outside version control.</p></div>
      </section>
    </div>
  );
}
