import React from 'react';

export default function DeductionsSection({ data, onChange }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    const val = value === '' ? '' : Math.max(0, Number(value));
    onChange({ ...data, [name]: val });
  };

  const fields = [
    { name: 'tax', label: 'Tax (TDS)' },
    { name: 'providentFund', label: 'Provident Fund (PF)' },
    { name: 'loanDeduction', label: 'Loan Deduction' },
    { name: 'otherDeductions', label: 'Other Deductions' }
  ];

  const totalDeductions = Object.values(data).reduce((total, val) => total + (Number(val) || 0), 0);

  return (
    <section className="bg-white rounded-lg shadow-sm border border-slate-200 p-[clamp(1rem,3vw,1.5rem)] mb-6">
      <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 border-l-4 border-slate-400 pl-2">
        Deductions <span className="normal-case font-normal text-slate-400 ml-1">(Optional)</span>
      </h2>
      <div className="flex flex-col gap-3">
        {fields.map((field) => (
          <div key={field.name} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <label htmlFor={field.name} className="text-sm font-medium text-slate-700 w-[12rem] flex-shrink-0">
              {field.label}
            </label>
            <div className="relative w-full sm:max-w-xs">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">PKR</span>
              <input
                type="number"
                id={field.name}
                name={field.name}
                value={data[field.name] || ''}
                onChange={handleChange}
                placeholder="0"
                min="0"
                className="w-full pl-10 pr-3 py-2 border border-slate-300 text-right rounded-md focus:outline-none focus:ring-2 focus:ring-slate-400/50 no-spinners"
              />
            </div>
          </div>
        ))}
        
        <div className="border-t border-slate-200 mt-2 pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <label className="text-sm font-bold text-slate-800 w-[12rem] flex-shrink-0">Total Deductions</label>
          <div className="w-full sm:max-w-xs text-right font-bold text-slate-800 bg-slate-50 py-2 px-3 rounded-md border border-slate-100">
            PKR {totalDeductions.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
        </div>
      </div>
    </section>
  );
}
