import React from 'react';

export default function CompanyInfoSection({ data, onChange, showError }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange({ ...data, [name]: value });
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onChange({ ...data, logo: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const removeLogo = () => {
    onChange({ ...data, logo: null });
  };

  return (
    <section className="bg-white rounded-lg shadow-sm border border-slate-200 p-[clamp(1rem,3vw,1.5rem)] mb-6">
      <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 border-l-4 border-accent pl-2">
        Company Information
      </h2>
      <div className="grid grid-cols-1 gap-[clamp(1rem,2vw,1.5rem)]">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="companyName" className="text-sm font-medium text-slate-700">Company Name <span className="text-red-500">*</span></label>
          <input
            type="text"
            id="companyName"
            name="companyName"
            value={data.companyName}
            onChange={handleChange}
            placeholder="e.g. Acme Corporation"
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-accent/50 ${showError && !data.companyName ? 'border-red-500' : 'border-slate-300'}`}
          />
          {showError && !data.companyName && <span className="text-xs text-red-500">Company Name is required</span>}
        </div>
        
        <div className="flex flex-col gap-1.5">
          <label htmlFor="address" className="text-sm font-medium text-slate-700">Company Address</label>
          <textarea
            id="address"
            name="address"
            value={data.address}
            onChange={handleChange}
            rows="2"
            placeholder="e.g. 123 Business Avenue, Tech Park"
            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent/50 resize-y"
          ></textarea>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-slate-700">Company Logo</label>
          <div className="flex items-center gap-4">
            {data.logo ? (
              <div className="flex items-center gap-4 border border-slate-200 rounded-md p-2 flex-1">
                <img src={data.logo} alt="Company Logo" className="w-[4rem] h-[4rem] object-contain" />
                <button
                  type="button"
                  onClick={removeLogo}
                  className="text-sm text-red-600 hover:text-red-800 font-medium ml-auto px-2 py-1"
                >
                  Remove logo
                </button>
              </div>
            ) : (
              <div className="flex-1">
                <input
                  type="file"
                  id="logo"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200 focus:outline-none cursor-pointer"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
