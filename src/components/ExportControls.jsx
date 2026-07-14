import React, { useState, useRef, useEffect } from 'react';
import { useReactToPrint } from 'react-to-print';
import { exportToPDF, exportToPNG, exportToExcel, exportToCSV } from '../utils/exporter';
import { Download, FileText, Image as ImageIcon, Printer, ChevronUp, Sheet, Table } from 'lucide-react';

export default function ExportControls({ isReady, previewRef, missingFields, filename, fullData }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const triggerPrint = useReactToPrint({
    contentRef: previewRef,
    documentTitle: filename,
  });

  const handleToggleOpen = () => {
    const newIsOpen = !isOpen;
    setIsOpen(newIsOpen);
    if (newIsOpen) {
      setTimeout(() => {
        window.scrollTo({
          top: document.body.scrollHeight,
          behavior: 'smooth'
        });
      }, 50);
    }
  };

  const handleDownloadPDF = async () => {
    setIsOpen(false);
    try {
      await exportToPDF(previewRef.current, filename);
    } catch (err) {
      console.error("PDF generation failed:", err);
      alert("PDF generation failed: " + err.message);
    }
  };

  const handleDownloadPNG = async () => {
    setIsOpen(false);
    try {
      await exportToPNG(previewRef.current, filename);
    } catch (err) {
      console.error("PNG download failed:", err);
      alert("PNG download failed: " + err.message);
    }
  };

  const handleDownloadExcel = async () => {
    setIsOpen(false);
    try {
      await exportToExcel(fullData, filename);
    } catch (err) {
      console.error("Excel generation failed:", err);
      alert("Excel generation failed: " + err.message);
    }
  };

  const handleDownloadCSV = async () => {
    setIsOpen(false);
    try {
      await exportToCSV(fullData, filename);
    } catch (err) {
      console.error("CSV generation failed:", err);
      alert("CSV generation failed: " + err.message);
    }
  };

  return (
    <div className="mt-6 flex flex-col gap-3 relative" ref={dropdownRef}>
      {!isReady && (
        <div className="text-xs text-red-500 bg-red-50 p-3 rounded-md border border-red-100">
          <strong>Missing required fields:</strong> {missingFields.join(', ')}
        </div>
      )}
      <div className="flex flex-col sm:flex-row gap-3 w-full">
        <button
          onClick={triggerPrint}
          disabled={!isReady}
          className="flex-1 px-4 py-3 bg-accent text-white text-sm font-semibold rounded-md hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
        >
          <Printer className="w-4 h-4" />
          Print Slip
        </button>
        <div className="flex-1 relative">
          <button
            onClick={handleToggleOpen}
            disabled={!isReady}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-slate-800 text-white text-sm font-semibold rounded-md hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Download className="w-4 h-4" />
            Download Options
            <ChevronUp className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </button>

          {isOpen && isReady && (
            <div className="absolute bottom-full left-0 right-0 mb-2 bg-white rounded-md shadow-lg border border-slate-200 overflow-hidden z-10">
              <div className="flex flex-col py-1">
                <button
                  onClick={handleDownloadPDF}
                  className="flex items-center gap-3 px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 transition-colors text-left w-full"
                >
                  <FileText className="w-4 h-4 text-slate-400" />
                  <span className="font-medium">Download as PDF</span>
                </button>
                <button
                  onClick={handleDownloadPNG}
                  className="flex items-center gap-3 px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 transition-colors text-left w-full"
                >
                  <ImageIcon className="w-4 h-4 text-slate-400" />
                  <span className="font-medium">Download as PNG</span>
                </button>
                <div className="h-px bg-slate-100 my-1"></div>
                <button
                  onClick={handleDownloadExcel}
                  className="flex items-center gap-3 px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 transition-colors text-left w-full"
                >
                  <Sheet className="w-4 h-4 text-slate-400" />
                  <span className="font-medium">Download as Excel (XLSX)</span>
                </button>
                <button
                  onClick={handleDownloadCSV}
                  className="flex items-center gap-3 px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 transition-colors text-left w-full"
                >
                  <Table className="w-4 h-4 text-slate-400" />
                  <span className="font-medium">Download as CSV</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
