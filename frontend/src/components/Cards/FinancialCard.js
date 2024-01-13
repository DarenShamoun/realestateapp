const FinancialCard = ({ title, amount, previousAmount, startDate, endDate }) => {
    const monthName = new Date().toLocaleString('default', { month: 'long' });
    let updatedTitle = title.replace('Monthly', monthName);
    let dateRangeText = '';

    // Add date range to title if startDate and endDate are provided
    if (startDate && endDate) {
        const formattedStartDate = new Date(startDate).toLocaleDateString();
        const formattedEndDate = new Date(endDate).toLocaleDateString();
        dateRangeText = `(${formattedStartDate} - ${formattedEndDate})`;
    }

    let percentageChange = null;
    let isPositiveChange = true;

    if (previousAmount !== undefined && previousAmount !== null) {
        percentageChange = ((amount - previousAmount) / previousAmount) * 100;
        isPositiveChange = percentageChange >= 0;
    }

    // Determine color for amount based on title
    const amountColor = (title.includes("Net profit") || title.includes("Total income")) ? 'text-green-300' : (isPositiveChange ? 'text-green-300' : 'text-red-500');

    return (
        <div className="flex-1 px-2 justify-center w-16 bg-gray-700 shadow rounded h-300px">
            <div className="flex flex-col justify-end h-full">
                <p className="text-white font-bold self-start">
                    {updatedTitle}
                    {dateRangeText && <span className="block text-xs text-gray-400">{dateRangeText}</span>}
                </p>
                <p className={`py-4 font-bold self-start ${amountColor}`}>${amount}</p>
                {percentageChange !== null && (
                    <p className={`text-xs ${isPositiveChange ? 'text-green-300' : 'text-red-500'}`}>
                        {isPositiveChange ? '+' : ''}{percentageChange.toFixed(2)}%
                    </p>
                )}
            </div>
        </div>
    );
};

export default FinancialCard;
