import React, { useState, useRef, useMemo, useEffect } from 'react';
import { SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react';
import Header from './components/Header';
import EmployeeInfoSection from './components/EmployeeInfoSection';
import PayPeriodSection from './components/PayPeriodSection';
import EarningsSection from './components/EarningsSection';
import DeductionsSection from './components/DeductionsSection';
import CompanyInfoSection from './components/CompanyInfoSection';
import VerificationSection from './components/VerificationSection';
import SignatureSection from './components/SignatureSection';
import SlipPreview from './components/SlipPreview';
import ExportControls from './components/ExportControls';
import { getTotalDaysInMonth, calculateWorkingDays, calculateEffectiveDays, calculatePaidDays, calculateSalaryBreakdown, calculateGross } from './utils/calculations';
import defaultLogo from './assets/logo.jpg';

function SalarySlipGenerator() {
  const [hasInteracted, setHasInteracted] = useState(false);

  const [employeeInfo, setEmployeeInfo] = useState({
    name: '', employeeId: '', designation: '', department: '', dateOfJoining: ''
  });

  const [payPeriod, setPayPeriod] = useState({
    month: new Date().toLocaleString('default', { month: 'short' }),
    year: new Date().getFullYear(),
    leavesTaken: 0,
    paidDays: 0,
    holidays: 0,
    lastEdited: 'leaves'
  });

  const [earningsInput, setEarningsInput] = useState({
    grossSalary: 0,
    basicSalary: 0,
    bonus: 0,
    lastEdited: 'gross'
  });

  const [percents, setPercents] = useState({
    basic: 25,
    hra: 45,
    conveyance: 5,
    medical: 5,
    deputation: 20
  });

  const [deductions, setDeductions] = useState({
    tax: 0, providentFund: 0, loanDeduction: 0, otherDeductions: 0
  });

  const [companyInfo, setCompanyInfo] = useState({
    companyName: 'Entire Solutions',
    address: 'Office #95, First Floor,\nKohinoor City,\nAbove Al-Fatah Store,\nJaranwala Road,\nFaisalabad',
    logo: defaultLogo
  });

  const [verificationInfo, setVerificationInfo] = useState({
    enabled: false, value: ''
  });

  const [signatureInfo, setSignatureInfo] = useState({
    enabled: false, image: null, name: '', designation: ''
  });


  const previewRef = useRef(null);

  // Pay Period Derived Calculations
  const actualTotalDaysInMonth = getTotalDaysInMonth(payPeriod.month, payPeriod.year);
  const effectiveDays = calculateEffectiveDays(payPeriod.month, payPeriod.year, employeeInfo.dateOfJoining, payPeriod.holidays);

  const totalDays = effectiveDays ? effectiveDays.totalDays : actualTotalDaysInMonth;
  const workingDays = effectiveDays ? effectiveDays.workingDays : calculateWorkingDays(payPeriod.month, payPeriod.year, payPeriod.holidays);
  
  let activeLeaves = Number(payPeriod.leavesTaken) || 0;
  let activePaid = Number(payPeriod.paidDays) || 0;

  if (payPeriod.lastEdited === 'paid') {
    if (activePaid > totalDays) activePaid = totalDays;
    activeLeaves = totalDays - activePaid;
  } else {
    if (activeLeaves > totalDays) activeLeaves = totalDays;
    activePaid = totalDays - activeLeaves;
  }
  const fullPayPeriod = { ...payPeriod, totalDays, workingDays, leavesTaken: activeLeaves, paidDays: activePaid };

  // Earnings Derived Calculations
  let activeGross = Number(earningsInput.grossSalary) || 0;
  let activeBasic = Number(earningsInput.basicSalary) || 0;

  if (earningsInput.lastEdited === 'basic') {
    activeGross = activeBasic / ((Number(percents.basic) || 1) / 100);
  } else {
    activeBasic = activeGross * ((Number(percents.basic) || 0) / 100);
  }

  // The form displays the Base (Unprorated) values
  const baseBreakdown = calculateSalaryBreakdown(activeGross, percents);
  const fullEarnings = { 
    ...earningsInput, 
    grossSalary: activeGross,
    basicSalary: activeBasic,
    bonus: earningsInput.bonus,
    ...baseBreakdown 
  };

  // The slip displays the Prorated values
  // Note: Prorated factor is always based on actualTotalDaysInMonth to reflect true partial-month pay relative to the full monthly rate
  const proratedFactor = actualTotalDaysInMonth > 0 ? (activePaid / actualTotalDaysInMonth) : 0;
  const proratedGross = activeGross * proratedFactor;
  const proratedBreakdown = calculateSalaryBreakdown(proratedGross, percents);
  const proratedEarnings = {
    ...earningsInput,
    grossSalary: proratedGross,
    basicSalary: proratedBreakdown.basicSalary,
    bonus: earningsInput.bonus,
    ...proratedBreakdown
  };

  const totalPercent = Object.values(percents).reduce((a, b) => a + Number(b), 0);

  // Track interaction
  useEffect(() => {
    if (employeeInfo.name || employeeInfo.employeeId || activeGross > 0) {
      setHasInteracted(true);
    }
  }, [employeeInfo, activeGross]);

  // Validation
  const missingFields = useMemo(() => {
    const missing = [];
    if (!employeeInfo.name) missing.push('Name');
    if (!employeeInfo.employeeId) missing.push('Employee ID');
    if (!employeeInfo.designation) missing.push('Designation');
    if (!payPeriod.month) missing.push('Month');
    if (!payPeriod.year) missing.push('Year');
    if (activeLeaves > totalDays) missing.push('Valid Leaves Taken');
    if (!activeGross || activeGross <= 0) missing.push('Gross Salary');
    if (!companyInfo.companyName) missing.push('Company Name');
    if (totalPercent !== 100) missing.push(`Allowance percentages must sum to 100% (currently ${totalPercent}%)`);
    if (verificationInfo.enabled && !verificationInfo.value) missing.push('Verification Value');
    if (signatureInfo.enabled) {
      if (!signatureInfo.image) missing.push('Signature Image');
      if (!signatureInfo.name) missing.push('Signatory Name');
      if (!signatureInfo.designation) missing.push('Signatory Designation');
    }
    return missing;
  }, [employeeInfo, payPeriod, activeGross, companyInfo, totalDays, activeLeaves, totalPercent, verificationInfo, signatureInfo]);

  const isReady = missingFields.length === 0;
  const filename = `SalarySlip_${employeeInfo.employeeId || 'Draft'}_${payPeriod.month}${payPeriod.year}`;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header />
      <main className="flex-1 max-w-[80rem] mx-auto w-full px-[clamp(1rem,3vw,2rem)] py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-[clamp(1.5rem,3vw,2rem)] items-start">
          {/* Form Side */}
          <div className="flex flex-col" onBlur={() => setHasInteracted(true)}>
            <EmployeeInfoSection data={employeeInfo} onChange={setEmployeeInfo} showError={hasInteracted && !isReady} />
            <PayPeriodSection data={fullPayPeriod} onChange={setPayPeriod} showError={hasInteracted && !isReady} />
            <EarningsSection data={fullEarnings} onChange={setEarningsInput} percents={percents} setPercents={setPercents} showError={hasInteracted && !isReady} />
            <DeductionsSection data={deductions} onChange={setDeductions} />
            <CompanyInfoSection data={companyInfo} onChange={setCompanyInfo} showError={hasInteracted && !isReady} />
            <VerificationSection verificationInfo={verificationInfo} onChange={setVerificationInfo} showError={hasInteracted && !isReady} />
            <SignatureSection signatureInfo={signatureInfo} onChange={setSignatureInfo} showError={hasInteracted && !isReady} />
          </div>

          {/* Preview Side */}
          <div className="sticky top-24 flex flex-col">
            <div className="border border-slate-200 rounded-lg overflow-hidden bg-white shadow-sm">
              <div className="overflow-x-auto bg-slate-100 p-4 sm:p-8 flex justify-center items-start">
                 {/* Provide scaling container to fit large slip on smaller screens visually, but exporting original */}
                <div id="slip-preview-container" className="transform origin-top lg:scale-100 sm:scale-90 scale-75 w-full flex justify-center">
                  <SlipPreview 
                    ref={previewRef}
                    employeeInfo={employeeInfo}
                    payPeriod={fullPayPeriod}
                    earnings={proratedEarnings}
                    deductions={deductions}
                    companyInfo={companyInfo}
                    verificationInfo={verificationInfo}
                    signatureInfo={signatureInfo}
                  />
                </div>
              </div>
            </div>
            <ExportControls 
              isReady={isReady} 
              previewRef={previewRef} 
              missingFields={missingFields} 
              filename={filename} 
              fullData={{ employeeInfo, payPeriod: fullPayPeriod, earnings: proratedEarnings, deductions, companyInfo }}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <>
      <SignedIn>
        <SalarySlipGenerator />
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
}
