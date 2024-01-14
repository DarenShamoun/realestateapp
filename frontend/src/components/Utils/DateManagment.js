// This function returns the current date
export const getCurrentDate = () => {
    return new Date();
};

// This function returns the current month (1-12)
export const getCurrentMonth = () => {
    return getCurrentDate().getMonth() + 1;
};

// This function returns the current year
export const getCurrentYear = () => {
    return getCurrentDate().getFullYear();
};

// This function returns a date object set to X months ago
export const getDateMonthsAgo = (monthsAgo) => {
    const currentDate = getCurrentDate();
    currentDate.setMonth(currentDate.getMonth() - monthsAgo);
    return currentDate;
};

// This function returns the last day of the previous month
export const getLastMonthDate = () => {
    const date = new Date(getCurrentYear(), getCurrentMonth() - 1, 0);
    return date;
};

// Function to format a date into specified format
export const formatDate = (date, format) => {
    const day = date.getDate();
    const month = date.getMonth() + 1; // Months are 0-indexed
    const year = date.getFullYear();
  
    // Replace format tokens with actual values
    return format
      .replace('DD', String(day).padStart(2, '0'))
      .replace('MM', String(month).padStart(2, '0'))
      .replace('YYYY', String(year))
      .replace('YY', String(year).substr(2));
};
