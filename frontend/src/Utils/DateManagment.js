// This function returns the current date
export const getCurrentDate = () => {
    return new Date();
};

// This function returns the current month (1-12)
export const getCurrentMonth = () => {
    return getCurrentDate().getMonth() + 1;
};

// Returns the first day of the current month
export const getStartOfCurrentMonth = () => {
    const date = new Date();
    return new Date(date.getFullYear(), date.getMonth(), 1);
};

// Returns the last day of the current month
export const getEndOfCurrentMonth = () => {
    const date = new Date();
    return new Date(date.getFullYear(), date.getMonth() + 1, 0);
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

// Returns the first day of the month X months ago
export const getStartOfMonthMonthsAgo = (monthsAgo) => {
    const date = new Date();
    date.setMonth(date.getMonth() - monthsAgo);
    return new Date(date.getFullYear(), date.getMonth(), 1);
};

// Returns the last day of the month X months ago
export const getEndOfMonthMonthsAgo = (monthsAgo) => {
    const date = new Date();
    date.setMonth(date.getMonth() - monthsAgo + 1);
    return new Date(date.getFullYear(), date.getMonth(), 0);
};

// This function returns the last day of the previous month
export const getLastMonthDate = () => {
    const date = new Date(getCurrentYear(), getCurrentMonth() - 1, 0);
    return date;
};

// Function to format a date into specified format
export const formatDate = (input, format) => {
    let dateString;

    // Check if the input is a Date object or a string
    if (input instanceof Date) {
        // Convert the Date object to an ISO string
        dateString = input.toISOString().split('T')[0];
    } else if (typeof input === 'string') {
        // Use the string as is
        dateString = input;
    } else {
        // Log error for invalid input and return empty string
        console.error('Invalid date input:', input);
        return '';
    }

    // Split the dateString into components
    const [year, month, day] = dateString.split('-');

    // Validate date components
    if (!year || !month || !day) {
        console.error('Invalid date format:', dateString);
        return '';
    }

    // Format the date according to the specified format
    return format
        .replace('YYYY', year)
        .replace('YY', year.substr(2))
        .replace('MM', month)
        .replace('DD', day);
};
