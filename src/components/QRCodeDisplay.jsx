import React from 'react';
import QRCode from 'react-qr-code';

export default function QRCodeDisplay({ value }) {
  if (!value) return null;

  return (
    <div className="flex flex-col items-center">
      <div className="p-2 bg-white border border-slate-200 rounded-lg shadow-sm">
        <QRCode
          value={value}
          size={80}
          level="M"
          className="w-20 h-20"
        />
      </div>
      <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-wider font-medium">Scan to Verify</p>
    </div>
  );
}
