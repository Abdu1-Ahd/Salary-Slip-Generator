
export function calculatePaidDays(workingDays, leavesTaken) {
  return Math.max(0, Number(workingDays || 0) - Number(leavesTaken || 0));
}

export function calculateSalaryBreakdown(grossSalary, percents) {
  const gross = Math.max(0, Number(grossSalary) || 0);
  if (gross === 0 || !percents) {
    return { basicSalary: 0, hra: 0, conveyanceAllowance: 0, medicalAllowance: 0, deputationAllowance: 0 };
  }
  
  const basicSalary = gross * ((Number(percents.basic) || 0) / 100);
  const hra = gross * ((Number(percents.hra) || 0) / 100);
  const conveyanceAllowance = gross * ((Number(percents.conveyance) || 0) / 100);
  const medicalAllowance = gross * ((Number(percents.medical) || 0) / 100);
  const deputationAllowance = gross * ((Number(percents.deputation) || 0) / 100);

  return {
    basicSalary,
    hra,
    conveyanceAllowance,
    medicalAllowance,
    deputationAllowance
  };
}

export function calculateGross(salaryBreakdown, bonus) {
  if (!salaryBreakdown) return Math.max(0, Number(bonus) || 0);
  const componentsSum = Object.values(salaryBreakdown).reduce((total, val) => total + (Number(val) || 0), 0);
  return componentsSum + Math.max(0, Number(bonus) || 0);
}

export function getTotalDeductions(deductions) {
  if (!deductions) return 0;
  return Object.values(deductions).reduce((total, val) => total + Math.max(0, Number(val) || 0), 0);
}

export function getNetSalary(gross, totalDeductions) {
  return Math.max(0, gross - totalDeductions);
}
