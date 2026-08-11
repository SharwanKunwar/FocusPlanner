import React from 'react';
import { FiUser, FiInfo, FiTag, FiClock } from 'react-icons/fi';

function ProfileDataCard({ item }) {
  const getTitle = (record) => {
    if (!record || typeof record !== 'object') return 'Fetched Record';

    const directTitle =
      record.name ||
      record.title ||
      record.email ||
      record.username ||
      record.fullName ||
      record.label ||
      record.id ||
      'Fetched Record';

    return directTitle;
  };

  const getSubtitle = (record) => {
    if (!record || typeof record !== 'object') return 'Profile details';

    if (record.role) return record.role;
    if (record.type) return record.type;
    if (record.status) return `Status: ${record.status}`;
    if (record.createdAt) return `Created: ${record.createdAt}`;
    return 'Profile details';
  };

  const formatValue = (value) => {
    if (value === null || value === undefined || value === '') return '—';

    if (typeof value === 'boolean') return value ? 'Yes' : 'No';
    if (typeof value === 'number' || typeof value === 'string') {
      if (typeof value === 'string' && value.length > 120) {
        return `${value.slice(0, 117)}...`;
      }
      return value;
    }

    if (Array.isArray(value)) {
      return value.length ? value.join(', ') : 'No items';
    }

    if (typeof value === 'object') {
      return JSON.stringify(value);
    }

    return String(value);
  };

  const fields = item && typeof item === 'object'
    ? Object.entries(item).filter(([key]) => !['password', 'token', 'accessToken', 'jwt'].includes(key))
    : [];

  const title = getTitle(item);
  const subtitle = getSubtitle(item);

  return (
    <div className="rounded-3xl border border-white/60 bg-white/80 p-5 shadow-[0_16px_40px_rgba(15,23,42,0.08)] backdrop-blur-xl">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h4 className="text-lg font-semibold text-slate-800">{title}</h4>
          <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
        </div>
        <div className="rounded-2xl bg-indigo-100 p-2 text-indigo-600">
          <FiUser className="text-lg" />
        </div>
      </div>

      <div className="mt-4 space-y-2">
        {fields.slice(0, 6).map(([key, value]) => (
          <div key={key} className="flex items-start justify-between gap-3 rounded-xl bg-slate-50/80 px-3 py-2">
            <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
              {key.toLowerCase().includes('status') || key.toLowerCase().includes('role') ? (
                <FiTag className="text-indigo-500" />
              ) : key.toLowerCase().includes('date') || key.toLowerCase().includes('time') ? (
                <FiClock className="text-emerald-500" />
              ) : (
                <FiInfo className="text-slate-400" />
              )}
              <span>{key}</span>
            </div>
            <span className="max-w-[60%] text-right text-sm text-slate-700 wrap-break-word">
              {formatValue(value)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProfileDataCard;
