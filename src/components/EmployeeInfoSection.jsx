import React from 'react';

export default function EmployeeInfoSection({ data, onChange, showError }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange({ ...data, [name]: value });
  };

  return (
    <section className="bg-white rounded-lg shadow-sm border border-slate-200 p-[clamp(1rem,3vw,1.5rem)] mb-6">
      <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 border-l-4 border-accent pl-2">
        Employee Information
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-[clamp(1rem,2vw,1.5rem)]">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="name" className="text-sm font-medium text-slate-700">Name <span className="text-red-500">*</span></label>
          <input
            type="text"
            id="name"
            name="name"
            value={data.name}
            onChange={handleChange}
            placeholder="e.g. Ahmed Raza"
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-accent/50 ${showError && !data.name ? 'border-red-500' : 'border-slate-300'}`}
          />
          {showError && !data.name && <span className="text-xs text-red-500">Name is required</span>}
        </div>
        
        <div className="flex flex-col gap-1.5">
          <label htmlFor="employeeId" className="text-sm font-medium text-slate-700">Employee ID <span className="text-red-500">*</span></label>
          <input
            type="text"
            id="employeeId"
            name="employeeId"
            value={data.employeeId}
            onChange={handleChange}
            placeholder="e.g. EMP-0231"
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-accent/50 ${showError && !data.employeeId ? 'border-red-500' : 'border-slate-300'}`}
          />
          {showError && !data.employeeId && <span className="text-xs text-red-500">Employee ID is required</span>}
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="designation" className="text-sm font-medium text-slate-700">Designation <span className="text-red-500">*</span></label>
          <input
            type="text"
            id="designation"
            name="designation"
            value={data.designation}
            onChange={handleChange}
            placeholder="e.g. Software Engineer"
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-accent/50 ${showError && !data.designation ? 'border-red-500' : 'border-slate-300'}`}
          />
          {showError && !data.designation && <span className="text-xs text-red-500">Designation is required</span>}
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="department" className="text-sm font-medium text-slate-700">Department</label>
          <input
            type="text"
            id="department"
            name="department"
            value={data.department}
            onChange={handleChange}
            placeholder="e.g. Engineering"
            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent/50"
          />
        </div>

        <div className="flex flex-col gap-1.5 md:col-span-2">
          <label htmlFor="dateOfJoining" className="text-sm font-medium text-slate-700">Date of Joining</label>
          <input
            type="date"
            id="dateOfJoining"
            name="dateOfJoining"
            value={data.dateOfJoining}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent/50"
          />
        </div>
      </div>
    </section>
  );
}
