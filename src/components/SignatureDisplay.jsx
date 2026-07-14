import React from 'react';

export default function SignatureDisplay({ signature }) {
  if (!signature.image) return null;

  return (
    <div className="flex flex-col items-end text-right">
      <div className="h-16 flex items-end justify-end mb-1">
        <img 
          src={signature.image} 
          alt="Signature" 
          className="max-h-full object-contain"
        />
      </div>
      <p className="text-sm font-bold text-slate-800">{signature.name}</p>
      <p className="text-[10px] text-slate-500 uppercase tracking-wider">{signature.designation}</p>
    </div>
  );
}
