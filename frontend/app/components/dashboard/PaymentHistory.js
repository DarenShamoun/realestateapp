const PaymentHistory = ({ payments }) => {
    return (
      <div className="p-4 border rounded shadow-lg">
        <h3 className="text-lg font-bold">Payment History</h3>
        {/* Map through payments to display them */}
        {payments.map((payment) => (
          <p key={payment.id}>${payment.amount} on {payment.date}</p>
        ))}
      </div>
    );
};
  