import React from 'react';
import { UserButton, useUser } from '@clerk/clerk-react';

export default function Header() {
  const { user } = useUser();

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-[80rem] mx-auto px-[clamp(1rem,3vw,2rem)] h-16 flex items-center justify-between">
        <h1 className="text-xl md:text-2xl font-bold text-slate-800 tracking-tight">
          Salary Slip Generator
        </h1>
        {user && (
          <div className="flex items-center gap-3">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-medium text-slate-700">{user.fullName}</p>
              <p className="text-xs text-slate-500">{user.primaryEmailAddress?.emailAddress}</p>
            </div>
            <UserButton afterSignOutUrl="/" />
          </div>
        )}
      </div>
    </header>
  );
}
