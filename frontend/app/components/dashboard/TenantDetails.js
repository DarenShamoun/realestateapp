const TenantDetails = ({ tenant }) => {
    return (
      <div className="p-4 border rounded shadow-lg">
        <h3 className="text-lg font-bold">{tenant.full_name}</h3>
        <p>Primary Phone: {tenant.primary_phone}</p>
        {/* Additional tenant details */}
      </div>
    );
};
  