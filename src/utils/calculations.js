export function getTotalDaysInMonth(monthStr, year) {
  if (!monthStr || !year) return 30;
  
  const monthMap = {
    'Jan': 0, 'Feb': 1, 'Mar': 2, 'Apr': 3, 'May': 4, 'Jun': 5,
    'Jul': 6, 'Aug': 7, 'Sep': 8, 'Oct': 9, 'Nov': 10, 'Dec': 11
  };
  const month = monthMap[monthStr];
  if (month === undefined) return 30;

  return new Date(year, month + 1, 0).getDate();
}

export function calculateWorkingDays(monthStr, year, holidays = 0) {
  if (!monthStr || !year) return 0;
  
  const monthMap = {
    'Jan': 0, 'Feb': 1, 'Mar': 2, 'Apr': 3, 'May': 4, 'Jun': 5,
    'Jul': 6, 'Aug': 7, 'Sep': 8, 'Oct': 9, 'Nov': 10, 'Dec': 11
  };
  const month = monthMap[monthStr];
  if (month === undefined) return 0;

  const date = new Date(year, month, 1);
  let totalDays = 0;
  let saturdays = 0;
  let sundays = 0;

  while (date.getMonth() === month) {
    totalDays++;
    if (date.getDay() === 6) saturdays++;
    if (date.getDay() === 0) sundays++;
    date.setDate(date.getDate() + 1);
  }

  return Math.max(0, totalDays - saturdays - sundays - Number(holidays || 0));
}

export function calculateEffectiveDays(monthStr, year, dateOfJoiningStr, holidays = 0) {
  if (!monthStr || !year || !dateOfJoiningStr) return null;

  const monthMap = {
    'Jan': 0, 'Feb': 1, 'Mar': 2, 'Apr': 3, 'May': 4, 'Jun': 5,
    'Jul': 6, 'Aug': 7, 'Sep': 8, 'Oct': 9, 'Nov': 10, 'Dec': 11
  };
  const month = monthMap[monthStr];
  if (month === undefined) return null;

  const joiningDate = new Date(dateOfJoiningStr);
  if (isNaN(joiningDate.getTime())) return null;

  // Check if joining date is in the same month and year as the pay period
  if (joiningDate.getFullYear() === Number(year) && joiningDate.getMonth() === month) {
    const totalDays = new Date(year, month + 1, 0).getDate();
    const joiningDay = joiningDate.getDate();
    const effectiveTotalDays = totalDays - joiningDay + 1;

    // Calculate working days (excluding weekends) from the joining day to end of month
    let workingDays = 0;
    const date = new Date(year, month, joiningDay);
    while (date.getMonth() === month) {
      if (date.getDay() !== 6 && date.getDay() !== 0) {
        workingDays++;
      }
      date.setDate(date.getDate() + 1);
    }

    return {
      totalDays: effectiveTotalDays,
      workingDays: Math.max(0, workingDays - Number(holidays || 0))
    };
  }

  return null;
}

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
