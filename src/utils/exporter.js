
import { calculateGross, getTotalDeductions, getNetSalary } from './calculations';


export async function exportToPNG(element, filename) {
  if (!element) return;
  
  const parentContainer = document.getElementById('slip-preview-container');
  let removedClasses = [];
  
  if (parentContainer) {
    const classes = Array.from(parentContainer.classList);
    removedClasses = classes.filter(c => c.includes('scale') || c === 'transform');
    removedClasses.forEach(c => parentContainer.classList.remove(c));
    await new Promise(resolve => setTimeout(resolve, 150));
  }

  try {
    const { toPng } = await import('html-to-image');
    const dataUrl = await toPng(element, { 
      quality: 1, 
      pixelRatio: 2,
      style: {
        transform: 'none',
        margin: '0 auto',
      }
    });
    
    const link = document.createElement('a');
    link.download = `${filename}.png`;
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } finally {
    if (parentContainer && removedClasses.length) {
      removedClasses.forEach(c => parentContainer.classList.add(c));
    }
  }
}

export async function exportToPDF(element, filename) {
  if (!element) return;

  const parentContainer = document.getElementById('slip-preview-container');
  let removedClasses = [];
  
  if (parentContainer) {
    const classes = Array.from(parentContainer.classList);
    removedClasses = classes.filter(c => c.includes('scale') || c === 'transform');
    removedClasses.forEach(c => parentContainer.classList.remove(c));
    await new Promise(resolve => setTimeout(resolve, 150));
  }

  try {
    const { toPng } = await import('html-to-image');
    const { jsPDF } = await import('jspdf');

    const dataUrl = await toPng(element, { 
      quality: 1, 
      pixelRatio: 2,
      style: {
        transform: 'none',
        margin: '0 auto',
      }
    });

    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    
    const img = new Image();
    img.src = dataUrl;
    await new Promise((resolve) => {
      img.onload = resolve;
    });

    const pdfHeight = (img.height * pdfWidth) / img.width;
    pdf.addImage(dataUrl, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`${filename}.pdf`);
  } finally {
    if (parentContainer && removedClasses.length) {
      removedClasses.forEach(c => parentContainer.classList.add(c));
    }
  }
}

function prepareSpreadsheetData(data) {
  const { employeeInfo, payPeriod, earnings, deductions, companyInfo } = data;
  
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

  const formatAmount = (val) => Number(val || 0).toFixed(2);

  return [
    ['COMPANY DETAILS', ''],
    ['Company Name', companyInfo.companyName || ''],
    ['Address', (companyInfo.address || '').replace(/\n/g, ', ')],
    [],
    ['EMPLOYEE DETAILS', ''],
    ['Employee Name', employeeInfo.name],
    ['Employee ID', employeeInfo.employeeId],
    ['Designation', employeeInfo.designation],
    ['Department', employeeInfo.department],
    ['Date of Joining', employeeInfo.dateOfJoining],
    [],
    ['PAY PERIOD DETAILS', ''],
    ['Month', payPeriod.month],
    ['Year', payPeriod.year],
    ['Total Days', payPeriod.totalDays],
    ['Working Days', payPeriod.workingDays],
    ['Holidays', payPeriod.holidays],
    ['Leaves Taken', payPeriod.leavesTaken],
    ['Paid Days', payPeriod.paidDays],
    [],
    ['EARNINGS (PKR)', 'Amount'],
    ['Basic Salary', formatAmount(earnings.basicSalary)],
    ['House Rent Allowance', formatAmount(earnings.hra)],
    ['Conveyance Allowance', formatAmount(earnings.conveyanceAllowance)],
    ['Medical Allowance', formatAmount(earnings.medicalAllowance)],
    ['Deputation Allowance', formatAmount(earnings.deputationAllowance)],
    ['Bonus', formatAmount(earnings.bonus)],
    ['TOTAL EARNINGS', formatAmount(totalGross)],
    [],
    ['DEDUCTIONS (PKR)', 'Amount'],
    ['Tax (TDS)', formatAmount(deductions.tax)],
    ['Provident Fund', formatAmount(deductions.providentFund)],
    ['Loan Deduction', formatAmount(deductions.loanDeduction)],
    ['Other Deductions', formatAmount(deductions.otherDeductions)],
    ['TOTAL DEDUCTIONS', formatAmount(totalDeductions)],
    [],
    ['NET SALARY (PKR)', formatAmount(netSalary)]
  ];
}

export async function exportToExcel(data, filename) {
  const XLSX = await import('xlsx');
  const rows = prepareSpreadsheetData(data);
  const worksheet = XLSX.utils.aoa_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Salary Slip');
  XLSX.writeFile(workbook, `${filename}.xlsx`);
}

export async function exportToCSV(data, filename) {
  const XLSX = await import('xlsx');
  const rows = prepareSpreadsheetData(data);
  const worksheet = XLSX.utils.aoa_to_sheet(rows);
  const csv = XLSX.utils.sheet_to_csv(worksheet);
  
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.setAttribute('download', `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
