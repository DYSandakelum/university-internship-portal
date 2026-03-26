import React, { useEffect, useState } from 'react'
import { PageWrapper } from '../components/PageWrapper'
import { jobService } from '../services/jobService'
import { ArrowLeft, Bell, Mail, Smartphone, Save, AlertCircle } from 'lucide-react'
import { Link } from 'react-router-dom'

const DEFAULTS = {
  email: true,
  push: true,
  sms: false,
  newJobMatches: true,
  deadlineReminders: true,
  applicationUpdates: true,
  weeklyDigest: true,
  quietHoursEnabled: false,
  quietHoursStart: '22:00',
  quietHoursEnd: '08:00',
}

function ToggleRow({ icon: Icon, title, description, checked, onChange, disabled }) {
  return (
    <div className={`flex items-start justify-between gap-4 p-4 rounded-xl border ${disabled ? 'border-slate-200 bg-slate-50' : 'border-slate-200 bg-white'} transition-colors`}>
      <div className="flex items-start gap-3">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${disabled ? 'bg-slate-200 text-slate-500' : 'bg-primary/10 text-primary'}`}>
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <div className="font-semibold text-slate-900">{title}</div>
          <div className="text-sm text-slate-500 mt-0.5">{description}</div>
        </div>
      </div>
      <label className="relative inline-flex items-center cursor-pointer select-none">
        <input
          type="checkbox"
          className="sr-only"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
        />
        <span
          className={`w-11 h-6 rounded-full transition-colors ${checked ? 'bg-primary' : 'bg-slate-300'} ${disabled ? 'opacity-50' : ''}`}
        />
        <span
          className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform ${checked ? 'translate-x-5' : ''}`}
        />
      </label>
    </div>
  )
}

export function NotificationSettings() {
  const [settings, setSettings] = useState(DEFAULTS)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await jobService.getNotificationSettings()
        if (data && typeof data === 'object') {
          setSettings({ ...DEFAULTS, ...data })
        } else {
          setSettings(DEFAULTS)
        }
      } catch (err) {
        console.warn('Failed to fetch notification settings, using defaults', err)
        setSettings(DEFAULTS)
      } finally {
        setIsLoading(false)
      }
    }

    fetchSettings()
  }, [])

  const save = async () => {
    setIsSaving(true)
    setError(null)
    setSuccess(false)

    try {
      await jobService.updateNotificationSettings(settings)
      setSuccess(true)
      setTimeout(() => setSuccess(false), 2000)
    } catch (err) {
      console.warn('Failed to update notification settings', err)
      setError('Unable to save settings right now. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <PageWrapper>
      <div className="flex items-start justify-between gap-4 mb-8">
        <div>
          <Link to="/job-matching/notifications" className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-primary mb-2">
            <ArrowLeft className="w-4 h-4" />
            Back to notifications
          </Link>
          <h1 className="text-2xl font-bold text-slate-900">Notification Settings</h1>
          <p className="text-slate-500 mt-1">Control how and when you receive updates</p>
        </div>
        <button type="button" onClick={save} disabled={isLoading || isSaving} className="btn-primary">
          <Save className="w-4 h-4" />
          {isSaving ? 'Saving...' : 'Save'}
        </button>
      </div>

      {error && (
        <div className="glass-panel p-4 border border-error/20 bg-error/5 mb-6">
          <div className="flex items-center gap-2 text-error font-medium">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        </div>
      )}
      {success && (
        <div className="glass-panel p-4 border border-success/20 bg-success/5 mb-6">
          <div className="flex items-center gap-2 text-success font-medium">Settings saved successfully.</div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-panel p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Delivery Methods</h2>
          {isLoading ? (
            <div className="text-slate-500">Loading...</div>
          ) : (
            <div className="space-y-3">
              <ToggleRow
                icon={Mail}
                title="Email"
                description="Receive notifications in your inbox"
                checked={settings.email}
                onChange={(v) => setSettings((s) => ({ ...s, email: v }))}
              />
              <ToggleRow
                icon={Bell}
                title="Push"
                description="Browser and in-app push notifications"
                checked={settings.push}
                onChange={(v) => setSettings((s) => ({ ...s, push: v }))}
              />
              <ToggleRow
                icon={Smartphone}
                title="SMS"
                description="Text message alerts (carrier rates may apply)"
                checked={settings.sms}
                onChange={(v) => setSettings((s) => ({ ...s, sms: v }))}
              />
            </div>
          )}
        </div>

        <div className="glass-panel p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Notification Types</h2>
          {isLoading ? (
            <div className="text-slate-500">Loading...</div>
          ) : (
            <div className="space-y-3">
              <ToggleRow
                icon={Bell}
                title="New Job Matches"
                description="When we find roles that match your profile"
                checked={settings.newJobMatches}
                onChange={(v) => setSettings((s) => ({ ...s, newJobMatches: v }))}
              />
              <ToggleRow
                icon={Bell}
                title="Deadline Reminders"
                description="Get alerts before applications close"
                checked={settings.deadlineReminders}
                onChange={(v) => setSettings((s) => ({ ...s, deadlineReminders: v }))}
              />
              <ToggleRow
                icon={Bell}
                title="Application Updates"
                description="Views, interview requests, and status updates"
                checked={settings.applicationUpdates}
                onChange={(v) => setSettings((s) => ({ ...s, applicationUpdates: v }))}
              />
              <ToggleRow
                icon={Bell}
                title="Weekly Digest"
                description="A weekly summary of your activity"
                checked={settings.weeklyDigest}
                onChange={(v) => setSettings((s) => ({ ...s, weeklyDigest: v }))}
              />
            </div>
          )}
        </div>

        <div className="glass-panel p-6 lg:col-span-2">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Quiet Hours</h2>
          <p className="text-sm text-slate-500 mb-4">Mute non-critical notifications during your focus time.</p>
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex items-center gap-3">
              <label className="text-sm font-medium text-slate-700">Enable</label>
              <input
                type="checkbox"
                checked={settings.quietHoursEnabled}
                onChange={(e) => setSettings((s) => ({ ...s, quietHoursEnabled: e.target.checked }))}
                className="h-4 w-4"
              />
            </div>
            <div className={`flex items-center gap-3 ${settings.quietHoursEnabled ? '' : 'opacity-50 pointer-events-none'}`}>
              <div className="flex items-center gap-2">
                <label className="text-sm text-slate-600">From</label>
                <input
                  type="time"
                  value={settings.quietHoursStart}
                  onChange={(e) => setSettings((s) => ({ ...s, quietHoursStart: e.target.value }))}
                  className="form-input py-2"
                />
              </div>
              <div className="flex items-center gap-2">
                <label className="text-sm text-slate-600">To</label>
                <input
                  type="time"
                  value={settings.quietHoursEnd}
                  onChange={(e) => setSettings((s) => ({ ...s, quietHoursEnd: e.target.value }))}
                  className="form-input py-2"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  )
}
