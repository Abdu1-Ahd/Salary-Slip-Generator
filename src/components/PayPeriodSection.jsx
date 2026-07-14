import React from 'react';

export default function PayPeriodSection({ data, onChange, showError }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'leavesTaken' || name === 'paidDays' || name === 'holidays') {
      const val = value === '' ? '' : Math.max(0, Number(value));
      onChange({ ...data, [name]: val, lastEdited: name === 'leavesTaken' ? 'leaves' : name === 'paidDays' ? 'paid' : data.lastEdited });
    } else {
      onChange({ ...data, [name]: value });
    }
  };

  const handleMonthYearChange = (e) => {
    if (!e.target.value) return;
    const [y, m] = e.target.value.split('-');
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthName = monthNames[parseInt(m, 10) - 1];
    onChange({ ...data, month: monthName, year: parseInt(y, 10) });
  };

  const monthMap = { Jan: '01', Feb: '02', Mar: '03', Apr: '04', May: '05', Jun: '06', Jul: '07', Aug: '08', Sep: '09', Oct: '10', Nov: '11', Dec: '12' };
  const mm = monthMap[data.month] || '01';
  const monthYearValue = data.year && data.month ? `${data.year}-${mm}` : '';

  const hasLeavesError = Number(data.leavesTaken) > Number(data.totalDays);
  const hasPaidError = Number(data.paidDays) > Number(data.totalDays);

  return (
    <section className="bg-white rounded-lg shadow-sm border border-slate-200 p-[clamp(1rem,3vw,1.5rem)] mb-6">
      <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 border-l-4 border-accent pl-2">
        Pay Period
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[clamp(1rem,2vw,1.5rem)] items-start">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="monthYear" className="text-sm font-medium text-slate-700">Month/Year <span className="text-red-500">*</span></label>
          <input
            type="month"
            id="monthYear"
            value={monthYearValue}
            onChange={handleMonthYearChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-accent/50 ${showError && (!data.month || !data.year) ? 'border-red-500' : 'border-slate-300'}`}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="totalDays" className="text-sm font-medium text-slate-700">Total Days</label>
          <input
            type="number" onWheel={(e) => e.target.blur()}
            id="totalDays"
            value={data.totalDays}
            readOnly
            className="w-full px-3 py-2 border border-slate-200 bg-slate-50 text-slate-500 rounded-md focus:outline-none cursor-not-allowed no-spinners"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="workingDays" className="text-sm font-medium text-slate-700">Working Days</label>
          <input
            type="number" onWheel={(e) => e.target.blur()}
            id="workingDays"
            value={data.workingDays}
            readOnly
            className="w-full px-3 py-2 border border-slate-200 bg-slate-50 text-slate-500 rounded-md focus:outline-none cursor-not-allowed no-spinners"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="holidays" className="text-sm font-medium text-slate-700">Holidays</label>
          <input
            type="number" onWheel={(e) => e.target.blur()}
            id="holidays"
            name="holidays"
            value={data.holidays === '' ? '' : (data.holidays || '')}
            onChange={handleChange}
            placeholder="0"
            min="0"
            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent/50 no-spinners"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="leavesTaken" className="text-sm font-medium text-slate-700">Leaves Taken <span className="text-red-500">*</span></label>
          <input
            type="number" onWheel={(e) => e.target.blur()}
            id="leavesTaken"
            name="leavesTaken"
            value={data.leavesTaken === '' ? '' : (data.leavesTaken || '')}
            onChange={handleChange}
            placeholder="0"
            min="0"
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-accent/50 ${hasLeavesError || (showError && data.leavesTaken === '') ? 'border-red-500 focus:ring-red-500/50' : 'border-slate-300'} no-spinners`}
          />
          {hasLeavesError && <span className="text-xs text-red-500">Cannot exceed total days</span>}
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="paidDays" className="text-sm font-medium text-slate-700">Paid Days</label>
          <input
            type="number" onWheel={(e) => e.target.blur()}
            id="paidDays"
            name="paidDays"
            value={data.paidDays === '' ? '' : (data.paidDays || '')}
            onChange={handleChange}
            placeholder="0"
            min="0"
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-accent/50 ${hasPaidError ? 'border-red-500 focus:ring-red-500/50' : 'border-slate-300'} font-semibold no-spinners`}
          />
          {hasPaidError && <span className="text-xs text-red-500">Cannot exceed total days</span>}
        </div>
      </div>
    </section>
  );
}
