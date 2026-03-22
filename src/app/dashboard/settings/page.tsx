'use client';
import React, { useState } from 'react';

export default function SettingsPage() {
  const [theme, setTheme] = useState('light');
  const [notifications, setNotifications] = useState(true);

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Settings</h1>
      <div className="bg-white p-6 rounded shadow max-w-md">
        <div className="mb-4">
          <label className="block mb-2 font-medium">Theme</label>
          <select
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            className="w-full border rounded p-2"
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </div>

        <div className="mb-4 flex items-center gap-2">
          <input
            type="checkbox"
            checked={notifications}
            onChange={(e) => setNotifications(e.target.checked)}
            className="w-4 h-4"
          />
          <label>Enable Notifications</label>
        </div>

        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Save Settings
        </button>
      </div>
    </div>
  );
}