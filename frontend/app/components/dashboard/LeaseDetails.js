const LeaseDetails = ({ lease }) => {
    return (
      <div className="p-4 border rounded shadow-lg">
        <h3 className="text-lg font-bold">Lease Details</h3>
        <p>Start Date: {lease.start_date}</p>
        <p>End Date: {lease.end_date}</p>
        {/* Additional lease details */}
      </div>
    );
};
  