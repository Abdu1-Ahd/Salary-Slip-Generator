import React from 'react';
import { calculateGross } from '../utils/calculations';

export default function EarningsSection({ data, onChange, percents, setPercents, showError }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    const val = value === '' ? '' : Math.max(0, Number(value));

    if (name === 'grossSalary' || name === 'basicSalary') {
      onChange({ ...data, [name]: val, lastEdited: name === 'grossSalary' ? 'gross' : 'basic' });
    } else {
      onChange({ ...data, [name]: val });
    }
  };

  const handlePercentChange = (e, key) => {
    const val = Math.max(0, Number(e.target.value));
    setPercents({ ...percents, [key]: val });
  };

  const totalGrossEarnings = calculateGross(
    {
      basicSalary: data.basicSalary,
      hra: data.hra,
      conveyanceAllowance: data.conveyanceAllowance,
      medicalAllowance: data.medicalAllowance,
      deputationAllowance: data.deputationAllowance
    },
    data.bonus
  );

  const renderPercentageRow = (name, label, percentKey, isEditable = false, required = false) => (
    <div key={name} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-50 pb-2 mb-2">
      <label htmlFor={name} className={`text-sm flex-shrink-0 w-[10rem] ${isEditable ? 'font-medium text-slate-700' : 'text-slate-500'}`}>
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      <div className="flex items-center gap-2 flex-1 justify-end">
        {percentKey && (
          <div className="relative w-20">
            <input
              type="number" onWheel={(e) => e.target.blur()}
              value={percents[percentKey]}
              onChange={(e) => handlePercentChange(e, percentKey)}
              className="w-full px-2 py-1.5 border border-slate-200 text-center rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-accent/50 text-sm no-spinners"
            />
            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 text-xs pointer-events-none">%</span>
          </div>
        )}

        <div className="relative w-[12rem]">
          <span className={`absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none ${isEditable ? 'text-slate-500' : 'text-slate-400'}`}>PKR</span>
          <input
            type="number" onWheel={(e) => e.target.blur()}
            id={name}
            name={name}
            value={data[name] || (isEditable ? '' : 0)}
            onChange={isEditable ? handleChange : undefined}
            readOnly={!isEditable}
            min="0"
            className={`w-full pl-10 pr-3 py-1.5 border text-right rounded-md focus:outline-none text-sm no-spinners ${!isEditable ? 'bg-slate-50 text-slate-500 cursor-not-allowed border-slate-200' : 'focus:ring-2 focus:ring-accent/50'} ${showError && required && (!data[name] || data[name] <= 0) ? 'border-red-500' : 'border-slate-300'}`}
          />
        </div>
      </div>
    </div>
  );

  const totalPercent = Object.values(percents).reduce((a, b) => a + Number(b), 0);
  const percentError = totalPercent !== 100;

  return (
    <section className={`bg-white rounded-lg shadow-sm border p-[clamp(1rem,3vw,1.5rem)] mb-6 ${percentError ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-200'}`}>
      <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 border-l-4 border-accent pl-2">
        Earnings
      </h2>
      <div className="flex flex-col gap-1">

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 mb-2 border-b border-slate-100">
          <label htmlFor="grossSalary" className="text-sm font-bold text-accent w-[10rem] flex-shrink-0">
            Gross Salary <span className="text-red-500">*</span>
          </label>
          <div className="flex items-center gap-2 flex-1 justify-end">
            <div className="relative w-[12rem]">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">PKR</span>
              <input
                type="number" onWheel={(e) => e.target.blur()}
                id="grossSalary"
                name="grossSalary"
                value={data.grossSalary || ''}
                onChange={handleChange}
                min="0"
                className={`w-full pl-10 pr-3 py-2 border text-right rounded-md focus:outline-none focus:ring-2 focus:ring-accent/50 font-semibold bg-accent/5 no-spinners ${showError && (!data.grossSalary || data.grossSalary <= 0) ? 'border-red-500' : 'border-slate-300'}`}
              />
            </div>
          </div>
        </div>

        {renderPercentageRow('basicSalary', 'Basic Salary', 'basic', true, true)}
        {renderPercentageRow('hra', 'House Rent Allowance', 'hra', false)}
        {renderPercentageRow('conveyanceAllowance', 'Conveyance Allowance', 'conveyance', false)}
        {renderPercentageRow('medicalAllowance', 'Medical Allowance', 'medical', false)}
        {renderPercentageRow('deputationAllowance', 'Deputation Allowance', 'deputation', false)}

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 mb-2">
          <label htmlFor="bonus" className="text-sm font-medium text-slate-700 w-[10rem] flex-shrink-0">
            Bonus
          </label>
          <div className="flex items-center gap-2 flex-1 justify-end">
            <div className="relative w-[12rem]">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">PKR</span>
              <input
                type="number" onWheel={(e) => e.target.blur()}
                id="bonus"
                name="bonus"
                value={data.bonus || ''}
                onChange={handleChange}
                placeholder="0"
                min="0"
                className="w-full pl-10 pr-3 py-1.5 border border-slate-300 text-right rounded-md focus:outline-none focus:ring-2 focus:ring-accent/50 text-sm no-spinners"
              />
            </div>
          </div>
        </div>

        <div className="border-t border-slate-200 mt-2 pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex flex-col">
            <label className="text-sm font-bold text-slate-800 flex-shrink-0">Total Gross Earnings</label>
            {percentError && <span className="text-xs font-bold text-red-500 mt-1">Percentages must sum to 100% (currently {totalPercent}%)</span>}
          </div>
          <div className="w-full sm:max-w-xs text-right font-bold text-slate-800 bg-slate-50 py-2 px-3 rounded-md border border-slate-100">
            PKR {totalGrossEarnings.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
        </div>
      </div>
    </section>
  );
}
