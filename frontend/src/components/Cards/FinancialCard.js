const FinancialCard = ({ title, amount }) => {
    const monthName = new Date().toLocaleString('default', { month: 'long' });

    const updatedTitle = title.replace('Monthly', monthName);

    return (
        <div className="flex-1 px-2 justify-center w-16 bg-gray-700 shadow rounded h-300px">
            <div className="flex flex-col justify-end h-full">
                <p className="text-white font-bold self-start">{updatedTitle}</p>
                <p className="py-4 text-green-300 font-bold self-start">${amount}</p>
            </div>
        </div>
    );
};

export default FinancialCard;