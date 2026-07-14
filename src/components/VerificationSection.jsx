import React from 'react';

export default function VerificationSection({ verificationInfo, onChange, showError }) {
  return (
    <section className="bg-white rounded-lg shadow-sm border border-slate-200 p-[clamp(1rem,3vw,1.5rem)] mb-6">
      <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 border-l-4 border-accent pl-2">
        Verification
      </h2>
      <div className="flex flex-col gap-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={verificationInfo.enabled}
            onChange={(e) => onChange({ ...verificationInfo, enabled: e.target.checked })}
            className="w-4 h-4 text-accent border-slate-300 rounded focus:ring-accent"
          />
          <span className="text-sm font-medium text-slate-700">Enable QR Code Verification</span>
        </label>

        {verificationInfo.enabled && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <label htmlFor="verificationValue" className="text-sm font-medium text-slate-700 w-[10rem] flex-shrink-0">
              Verification Value <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="verificationValue"
              value={verificationInfo.value}
              onChange={(e) => onChange({ ...verificationInfo, value: e.target.value })}
              placeholder="e.g. SLIP-12345 or https://verify.com/123"
              className={`w-full px-3 py-1.5 border rounded-md focus:outline-none focus:ring-2 focus:ring-accent/50 text-sm ${showError && !verificationInfo.value ? 'border-red-500' : 'border-slate-300'}`}
            />
          </div>
        )}
      </div>
    </section>
  );
}
