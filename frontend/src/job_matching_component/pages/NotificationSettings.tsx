import React, { useEffect, useState } from 'react'
import { PageWrapper } from '../components/PageWrapper'
import { Link } from 'react-router-dom'
import { jobService } from '../services/jobService'
import {
  ArrowLeft,
  Bell,
  Mail,
  Smartphone,
  Calendar,
  Sparkles,
  Save,
  AlertCircle,
} from 'lucide-react'

type Settings = {
  emailNotifications: boolean
  pushNotifications: boolean
  deadlineReminders: boolean
  jobMatchAlerts: boolean
  insightUpdates: boolean
  weeklyDigest: boolean
  reminderFrequency: 'daily' | 'weekly'
}

const DEFAULT_SETTINGS: Settings = {
  emailNotifications: true,
  pushNotifications: false,
  deadlineReminders: true,
  jobMatchAlerts: true,
  insightUpdates: true,
  weeklyDigest: true,
  reminderFrequency: 'weekly',
}

export function NotificationSettings() {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  useEffect(() => {
    const fetchSettings = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const data = await jobService.getNotificationSettings()
        if (data && typeof data === 'object') {
          setSettings({ ...DEFAULT_SETTINGS, ...(data as any) })
        } else {
          setSettings(DEFAULT_SETTINGS)
        }
      } catch (err) {
        console.warn('Failed to fetch notification settings, using defaults', err)
        setSettings(DEFAULT_SETTINGS)
      } finally {
        setIsLoading(false)
      }
    }

    fetchSettings()
  }, [])

  const updateSetting = (key: keyof Settings, value: Settings[keyof Settings]) => {
    setSettings((prev) => ({ ...prev, [key]: value } as Settings))
  }

  const saveSettings = async () => {
    setIsSaving(true)
    setError(null)
    setSuccessMessage(null)
    try {
      await jobService.updateNotificationSettings(settings)
      setSuccessMessage('Settings saved successfully.')
      setTimeout(() => setSuccessMessage(null), 2500)
    } catch (err) {
      console.error('Failed to save settings', err)
      setError('Failed to save settings. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <PageWrapper>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link
            to="/job-matching/notifications"
            className="btn-icon bg-white border border-slate-200 hover:bg-slate-50"
            title="Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
              <Bell className="w-8 h-8 text-primary" />
              Notification Settings
            </h1>
            <p className="text-slate-500 mt-1">Choose how you want to be notified.</p>
          </div>
        </div>

        <button
          onClick={saveSettings}
          disabled={isSaving || isLoading}
          className="btn-primary flex items-center gap-2 disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {isSaving ? 'Saving...' : 'Save'}
        </button>
      </div>

      {error && (
        <div className="glass-panel p-4 mb-6 border border-error/20 bg-error/5 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-error" />
          <p className="text-slate-700">{error}</p>
        </div>
      )}
      {successMessage && (
        <div className="glass-panel p-4 mb-6 border border-success/20 bg-success/5">
          <p className="text-slate-700">{successMessage}</p>
        </div>
      )}

      {isLoading ? (
        <div className="glass-panel p-8 animate-pulse bg-white/50 h-[480px]" />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="glass-panel p-6">
            <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Mail className="w-5 h-5 text-primary" />
              Email Notifications
            </h2>
            <div className="space-y-4">
              <Toggle
                label="Email notifications"
                description="Receive important updates via email"
                checked={settings.emailNotifications}
                onChange={(v) => updateSetting('emailNotifications', v)}
              />
              <Toggle
                label="Weekly digest"
                description="A weekly summary of matches and insights"
                checked={settings.weeklyDigest}
                onChange={(v) => updateSetting('weeklyDigest', v)}
              />
            </div>
          </div>

          <div className="glass-panel p-6">
            <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Smartphone className="w-5 h-5 text-accent" />
              Push Notifications
            </h2>
            <div className="space-y-4">
              <Toggle
                label="Push notifications"
                description="Instant updates on your device"
                checked={settings.pushNotifications}
                onChange={(v) => updateSetting('pushNotifications', v)}
              />
            </div>
          </div>

          <div className="glass-panel p-6">
            <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-warning" />
              Deadlines
            </h2>
            <div className="space-y-4">
              <Toggle
                label="Deadline reminders"
                description="Get reminders before applications close"
                checked={settings.deadlineReminders}
                onChange={(v) => updateSetting('deadlineReminders', v)}
              />
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Reminder frequency</label>
                <select
                  value={settings.reminderFrequency}
                  onChange={(e) => updateSetting('reminderFrequency', e.target.value as any)}
                  className="form-input bg-white/50"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                </select>
              </div>
            </div>
          </div>

          <div className="glass-panel p-6">
            <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-success" />
              Matches & Insights
            </h2>
            <div className="space-y-4">
              <Toggle
                label="Job match alerts"
                description="Notifications when new matches appear"
                checked={settings.jobMatchAlerts}
                onChange={(v) => updateSetting('jobMatchAlerts', v)}
              />
              <Toggle
                label="Insight updates"
                description="Skill-gap and career insights"
                checked={settings.insightUpdates}
                onChange={(v) => updateSetting('insightUpdates', v)}
              />
            </div>
          </div>
        </div>
      )}
    </PageWrapper>
  )
}

function Toggle(props: {
  label: string
  description: string
  checked: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <p className="font-medium text-slate-900">{props.label}</p>
        <p className="text-sm text-slate-500">{props.description}</p>
      </div>
      <button
        type="button"
        onClick={() => props.onChange(!props.checked)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          props.checked ? 'bg-primary' : 'bg-slate-300'
        }`}
        aria-pressed={props.checked}
      >
        <span
          className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
            props.checked ? 'translate-x-5' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  )
}
