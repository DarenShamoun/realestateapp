import React from 'react';
import Layout from '../layout'; // Adjust the import path to your layout component
import PropertySummary from '../components/PropertySummary'; // A new component to be created

export default function DashboardPage() {
    return (
        <Layout>
            <main className="container mx-auto p-4">
                <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
                {/* You can add more dashboard-specific components here */}
                <PropertySummary />
                {/* Add other summaries like TenantSummary, LeaseSummary, etc. */}
            </main>
        </Layout>
    );
}
