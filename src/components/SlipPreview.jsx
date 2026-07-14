import React, { forwardRef } from 'react';
import { numberToWords } from '../utils/numberToWords';
import { calculateGross, getTotalDeductions, getNetSalary } from '../utils/calculations';
import QRCodeDisplay from './QRCodeDisplay';
import SignatureDisplay from './SignatureDisplay';

const SlipPreview = forwardRef(({ employeeInfo, payPeriod, earnings, deductions, companyInfo, verificationInfo, signatureInfo }, ref) => {
  const salaryBreakdown = {
    basicSalary: earnings.basicSalary,
    hra: earnings.hra,
    conveyanceAllowance: earnings.conveyanceAllowance,
    medicalAllowance: earnings.medicalAllowance,
    deputationAllowance: earnings.deputationAllowance
  };
  const totalGross = calculateGross(salaryBreakdown, earnings.bonus);
  const totalDeductions = getTotalDeductions(deductions);
  const netSalary = getNetSalary(totalGross, totalDeductions);
  const words = numberToWords(netSalary);

  const formatCurrency = (amount) => {
    return Number(amount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const today = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

  return (
    <div ref={ref} className="bg-white text-slate-800 p-8 shadow-lg mx-auto w-[800px] min-w-[800px] shrink-0">
      {/* Header */}
      <div className="flex flex-row justify-between items-stretch gap-4 mb-6">
        <div className="w-[10rem] flex-shrink-0 relative">
          {companyInfo.logo ? (
            <img src={companyInfo.logo} alt="Company Logo" className="absolute inset-0 w-full h-full object-contain object-left" />
          ) : (
            <div className="absolute inset-0 flex items-center justify-start text-xl font-bold text-slate-300">LOGO</div>
          )}
        </div>
        <div className="text-right">
          <h2 className="text-xl font-bold text-slate-800 uppercase tracking-wide">{companyInfo.companyName || 'COMPANY NAME'}</h2>
          {companyInfo.address && (
            <p className="text-sm text-slate-500 whitespace-pre-wrap mt-1">{companyInfo.address}</p>
          )}
        </div>
      </div>

      <hr className="border-slate-300 mb-6" />

      {/* Title */}
      <div className="text-center mb-4">
        <h1 className="text-2xl font-bold uppercase tracking-widest text-slate-800">Salary Slip</h1>
        <p className="text-sm text-slate-500 font-medium uppercase tracking-wide mt-1">
          {payPeriod.month || 'Month'} {payPeriod.year || 'Year'}
        </p>
      </div>

      {/* Employee Info Block */}
      <div className="grid grid-cols-2 gap-y-2 gap-x-8 mb-4 text-xs">
        <div className="flex justify-start gap-4">
          <span className="text-slate-500 w-[8rem] flex-shrink-0">Employee Name:</span>
          <span className="font-semibold text-slate-800">{employeeInfo.name || '-'}</span>
        </div>
        <div className="flex justify-start gap-4">
          <span className="text-slate-500 w-[8rem] flex-shrink-0">Employee ID:</span>
          <span className="font-semibold text-slate-800">{employeeInfo.employeeId || '-'}</span>
        </div>
        <div className="flex justify-start gap-4">
          <span className="text-slate-500 w-[8rem] flex-shrink-0">Designation:</span>
          <span className="font-semibold text-slate-800">{employeeInfo.designation || '-'}</span>
        </div>
        <div className="flex justify-start gap-4">
          <span className="text-slate-500 w-[8rem] flex-shrink-0">Department:</span>
          <span className="font-semibold text-slate-800">{employeeInfo.department || '-'}</span>
        </div>
        {employeeInfo.dateOfJoining && (
          <div className="flex justify-start gap-4">
            <span className="text-slate-500 w-[8rem] flex-shrink-0">Date of Joining:</span>
            <span className="font-semibold text-slate-800">{formatDate(employeeInfo.dateOfJoining)}</span>
          </div>
        )}
        <div className="flex justify-start gap-4">
          <span className="text-slate-500 w-[8rem] flex-shrink-0">Pay Period:</span>
          <span className="font-semibold text-slate-800">{payPeriod.month} {payPeriod.year}</span>
        </div>
        <div className="flex justify-start gap-4">
          <span className="text-slate-500 w-[8rem] flex-shrink-0">Total Days:</span>
          <span className="font-semibold text-slate-800">{payPeriod.totalDays || '0'}</span>
        </div>
        <div className="flex justify-start gap-4">
          <span className="text-slate-500 w-[8rem] flex-shrink-0">Working Days:</span>
          <span className="font-semibold text-slate-800">{payPeriod.workingDays || '0'}</span>
        </div>
        {Number(payPeriod.holidays) > 0 && (
          <div className="flex justify-start gap-4">
            <span className="text-slate-500 w-[8rem] flex-shrink-0">Holidays:</span>
            <span className="font-semibold text-slate-800">{payPeriod.holidays}</span>
          </div>
        )}
        <div className="flex justify-start gap-4">
          <span className="text-slate-500 w-[8rem] flex-shrink-0">Leaves Taken:</span>
          <span className="font-semibold text-slate-800">{payPeriod.leavesTaken || '0'}</span>
        </div>
        <div className="flex justify-start gap-4">
          <span className="text-slate-500 w-[8rem] flex-shrink-0">Paid Days:</span>
          <span className="font-semibold text-slate-800">{payPeriod.paidDays || '0'}</span>
        </div>
      </div>

      {/* Salary Details Tables */}
      <div className="grid grid-cols-2 gap-6 mb-4">
        {/* Earnings Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b-2 border-slate-300">
                <th className="py-2 text-left font-bold text-slate-700">Earnings</th>
                <th className="py-2 text-right font-bold text-slate-700">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-slate-100">
                <td className="py-2 text-slate-600">Gross Salary</td>
                <td className="py-2 text-right text-slate-800 font-medium">PKR {formatCurrency(earnings.grossSalary || 0)}</td>
              </tr>
              {Object.entries(earnings).map(([key, value]) => {
                if (key === 'grossSalary' || key === 'bonus' || key === 'lastEdited') return null; // handled separately
                if (!value && key !== 'basicSalary') return null;
                const labels = {
                  basicSalary: 'Basic Salary',
                  hra: 'House Rent Allowance',
                  conveyanceAllowance: 'Conveyance Allowance',
                  medicalAllowance: 'Medical Allowance',
                  deputationAllowance: 'Deputation Allowance'
                };
                return (
                  <tr key={key} className="border-b border-slate-100">
                    <td className="py-2 pl-4 text-slate-500 text-xs">└ {labels[key] || key}</td>
                    <td className="py-2 text-right text-slate-600 font-medium text-xs">PKR {formatCurrency(value)}</td>
                  </tr>
                );
              })}
              {Number(earnings.bonus) > 0 && (
                <tr className="border-b border-slate-100">
                  <td className="py-2 text-slate-600">Bonus</td>
                  <td className="py-2 text-right text-slate-800 font-medium">PKR {formatCurrency(earnings.bonus)}</td>
                </tr>
              )}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-slate-300 bg-slate-50">
                <td className="py-2 px-2 font-bold text-slate-800">Total Earnings</td>
                <td className="py-2 px-2 text-right font-bold text-slate-800">PKR {formatCurrency(totalGross)}</td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Deductions Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b-2 border-slate-300">
                <th className="py-2 text-left font-bold text-slate-700">Deductions</th>
                <th className="py-2 text-right font-bold text-slate-700">Amount</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(deductions).map(([key, value]) => {
                if (!value) return null;
                const labels = {
                  tax: 'Tax (TDS)',
                  providentFund: 'Provident Fund (PF)',
                  loanDeduction: 'Loan Deduction',
                  otherDeductions: 'Other Deductions'
                };
                return (
                  <tr key={key} className="border-b border-slate-100">
                    <td className="py-2 text-slate-600">{labels[key] || key}</td>
                    <td className="py-2 text-right text-slate-800 font-medium">PKR {formatCurrency(value)}</td>
                  </tr>
                );
              })}
              {totalDeductions === 0 && (
                <tr className="border-b border-slate-100">
                  <td className="py-2 text-slate-400 italic">No deductions</td>
                  <td className="py-2 text-right text-slate-400">-</td>
                </tr>
              )}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-slate-300 bg-slate-50">
                <td className="py-2 px-2 font-bold text-slate-800">Total Deductions</td>
                <td className="py-2 px-2 text-right font-bold text-slate-800">PKR {formatCurrency(totalDeductions)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Net Salary Banner */}
      <div className="bg-accent/10 border border-accent/20 rounded-lg p-4 text-center mb-4">
        <h3 className="text-sm font-semibold text-accent uppercase tracking-wider mb-2">
          NET SALARY <span className="text-3xl font-bold text-slate-800 ml-4"> <br /> PKR {formatCurrency(netSalary)}</span>
        </h3>
        <p className="text-sm text-slate-600 font-medium capitalize mt-2">
          (Rupees {words} Only)
        </p>
      </div>

      {/* Footer */}
      <div className={`mt-6 pt-4 border-t border-slate-200 flex items-end ${(!verificationInfo?.enabled && !signatureInfo?.enabled) ? 'justify-center' : 'justify-between'}`}>
        <div className={`flex flex-col text-xs text-slate-400 ${(!verificationInfo?.enabled && !signatureInfo?.enabled) ? 'text-center w-full' : 'text-left'}`}>
          <p>This is a computer-generated salary slip.</p>
          <p className="mt-1">Generated on: {today}</p>
        </div>
        {verificationInfo?.enabled && (
          <div className="flex flex-col items-center">
            <QRCodeDisplay value={verificationInfo.value} />
          </div>
        )}
        {signatureInfo?.enabled && (
          <div className="flex flex-col items-end text-right">
            <SignatureDisplay signature={signatureInfo} />
          </div>
        )}
      </div>
    </div>
  );
});

export default SlipPreview;
