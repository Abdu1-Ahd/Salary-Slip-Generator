/**
 * calendarUtils.js
 * 
 * A production-grade calendar utility service for determining precise
 * date metrics, working days, and leap year logic.
 * 
 * This service relies purely on the native JavaScript Date API to ensure
 * absolute correctness for any past, current, or future year. It avoids
 * hardcoded day counts, estimations, or assumptions.
 */

const MONTH_MAP = {
  'Jan': 0, 'Feb': 1, 'Mar': 2, 'Apr': 3, 'May': 4, 'Jun': 5,
  'Jul': 6, 'Aug': 7, 'Sep': 8, 'Oct': 9, 'Nov': 10, 'Dec': 11
};

/**
 * Validates and converts month/year inputs into a safe Date object.
 */
function getValidMonthIndex(monthStr) {
  const monthIndex = MONTH_MAP[monthStr];
  if (monthIndex === undefined) {
    throw new Error(`Invalid month string provided: ${monthStr}`);
  }
  return monthIndex;
}

/**
 * Returns the exact number of days in a given month and year.
 * Automatically handles leap years (e.g., Feb 2024 returns 29, Feb 2025 returns 28).
 * 
 * @param {string} monthStr - Three-letter month abbreviation (e.g., 'Feb')
 * @param {number|string} year - The full year (e.g., 2024)
 * @returns {number} The exact number of days in the month.
 */
export function getExactDaysInMonth(monthStr, year) {
  if (!monthStr || !year) return 0;
  
  const month = getValidMonthIndex(monthStr);
  
  // Day 0 of the *next* month is the last day of the *current* month.
  // This natively leverages the system calendar to handle all leap years and day counts accurately.
  return new Date(Number(year), month + 1, 0).getDate();
}

/**
 * Calculates the exact number of working days in a month, excluding weekends (Saturday and Sunday).
 * 
 * @param {string} monthStr - Three-letter month abbreviation
 * @param {number|string} year - The full year
 * @param {number} holidays - Number of public holidays to subtract
 * @returns {number} The number of working days.
 */
export function getExactWorkingDays(monthStr, year, holidays = 0) {
  if (!monthStr || !year) return 0;

  const month = getValidMonthIndex(monthStr);
  const totalDays = getExactDaysInMonth(monthStr, year);
  
  let workingDaysCount = 0;

  // Iterate exactly through the days of the month based on the real calendar
  for (let day = 1; day <= totalDays; day++) {
    const date = new Date(Number(year), month, day);
    const dayOfWeek = date.getDay();
    
    // 0 = Sunday, 6 = Saturday
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      workingDaysCount++;
    }
  }

  // Ensure working days do not drop below zero if holidays exceed working days
  return Math.max(0, workingDaysCount - Number(holidays || 0));
}

/**
 * Calculates effective total and working days if an employee joined mid-month.
 * 
 * @param {string} monthStr 
 * @param {number|string} year 
 * @param {string} dateOfJoiningStr - YYYY-MM-DD
 * @param {number} holidays 
 * @returns {{totalDays: number, workingDays: number} | null}
 */
export function getEffectiveProratedDays(monthStr, year, dateOfJoiningStr, holidays = 0) {
  if (!monthStr || !year || !dateOfJoiningStr) return null;

  const month = getValidMonthIndex(monthStr);
  const joiningDate = new Date(dateOfJoiningStr);
  
  if (isNaN(joiningDate.getTime())) return null;

  // Only calculate mid-month logic if the joining date is exactly in this active pay period
  if (joiningDate.getFullYear() === Number(year) && joiningDate.getMonth() === month) {
    const totalDaysInFullMonth = getExactDaysInMonth(monthStr, year);
    const joiningDay = joiningDate.getDate();
    
    const effectiveTotalDays = totalDaysInFullMonth - joiningDay + 1;
    let workingDaysCount = 0;

    // Iterate from joining day to the end of the month
    for (let day = joiningDay; day <= totalDaysInFullMonth; day++) {
      const date = new Date(Number(year), month, day);
      const dayOfWeek = date.getDay();
      
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        workingDaysCount++;
      }
    }

    return {
      totalDays: effectiveTotalDays,
      workingDays: Math.max(0, workingDaysCount - Number(holidays || 0))
    };
  }

  return null; // Not a mid-month joiner for this specific period
}
