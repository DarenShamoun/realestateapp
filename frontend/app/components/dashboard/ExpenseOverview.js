const ExpenseOverview = ({ expenses }) => {
    return (
      <div className="p-4 border rounded shadow-lg">
        <h3 className="text-lg font-bold">Expenses Overview</h3>
        {/* Map through expenses to display them */}
        {expenses.map((expense) => (
          <p key={expense.id}>${expense.amount} - {expense.category}</p>
        ))}
      </div>
    );
};
  