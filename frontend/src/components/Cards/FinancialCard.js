const FinancialCard = ({ title, amount, previousAmount }) => {
    const monthName = new Date().toLocaleString('default', { month: 'long' });
    const updatedTitle = title.replace('Monthly', monthName);

    let percentageChange = null;
    let isPositiveChange = true;

    if (previousAmount !== undefined && previousAmount !== null) {
        percentageChange = ((amount - previousAmount) / previousAmount) * 100;
        isPositiveChange = percentageChange >= 0;
    }

    return (
        <div className="flex-1 px-2 justify-center w-16 bg-gray-700 shadow rounded h-300px">
            <div className="flex flex-col justify-end h-full">
                <p className="text-white font-bold self-start">{updatedTitle}</p>
                <p className={`py-4 font-bold self-start ${isPositiveChange ? 'text-green-300' : 'text-red-500'}`}>${amount}</p>
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