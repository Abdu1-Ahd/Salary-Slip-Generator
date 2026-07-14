import React, { useRef } from 'react';
import { Upload, X } from 'lucide-react';

export default function SignatureSection({ signatureInfo, onChange, showError }) {
  const fileInputRef = useRef(null);

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("Image must be smaller than 2MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        onChange({ ...signatureInfo, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    onChange({ ...signatureInfo, image: null });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <section className="bg-white rounded-lg shadow-sm border border-slate-200 p-[clamp(1rem,3vw,1.5rem)] mb-6">
      <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 border-l-4 border-accent pl-2">
        Signature
      </h2>
      <div className="flex flex-col gap-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={signatureInfo.enabled}
            onChange={(e) => onChange({ ...signatureInfo, enabled: e.target.checked })}
            className="w-4 h-4 text-accent border-slate-300 rounded focus:ring-accent"
          />
          <span className="text-sm font-medium text-slate-700">Enable Digital Signature</span>
        </label>

        {signatureInfo.enabled && (
          <div className="flex flex-col gap-4 pt-2 border-t border-slate-100">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
              <label className="text-sm font-medium text-slate-700 w-[10rem] flex-shrink-0 mt-2">
                Signature Image <span className="text-red-500">*</span>
              </label>
              <div className="flex-1 w-full flex items-center gap-4">
                {signatureInfo.image ? (
                  <div className="relative border border-slate-200 rounded-md p-2 bg-slate-50">
                    <img src={signatureInfo.image} alt="Signature" className="h-16 object-contain" />
                    <button
                      onClick={removeImage}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 shadow-md transition-colors"
                      title="Remove image"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <div className="flex-1">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageUpload}
                      accept="image/*"
                      className="hidden"
                      id="signature-upload"
                    />
                    <label
                      htmlFor="signature-upload"
                      className={`flex flex-col items-center justify-center w-full h-24 border-2 border-dashed rounded-lg cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors ${showError && !signatureInfo.image ? 'border-red-400' : 'border-slate-300'}`}
                    >
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className={`w-6 h-6 mb-2 ${showError && !signatureInfo.image ? 'text-red-400' : 'text-slate-400'}`} />
                        <p className={`text-xs ${showError && !signatureInfo.image ? 'text-red-500' : 'text-slate-500'}`}>Click to upload signature</p>
                      </div>
                    </label>
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <label htmlFor="signatoryName" className="text-sm font-medium text-slate-700 w-[10rem] flex-shrink-0">
                Signatory Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="signatoryName"
                value={signatureInfo.name}
                onChange={(e) => onChange({ ...signatureInfo, name: e.target.value })}
                placeholder="John Doe"
                className={`w-full px-3 py-1.5 border rounded-md focus:outline-none focus:ring-2 focus:ring-accent/50 text-sm ${showError && !signatureInfo.name ? 'border-red-500' : 'border-slate-300'}`}
              />
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <label htmlFor="signatoryDesignation" className="text-sm font-medium text-slate-700 w-[10rem] flex-shrink-0">
                Designation <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="signatoryDesignation"
                value={signatureInfo.designation}
                onChange={(e) => onChange({ ...signatureInfo, designation: e.target.value })}
                placeholder="HR Manager"
                className={`w-full px-3 py-1.5 border rounded-md focus:outline-none focus:ring-2 focus:ring-accent/50 text-sm ${showError && !signatureInfo.designation ? 'border-red-500' : 'border-slate-300'}`}
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
