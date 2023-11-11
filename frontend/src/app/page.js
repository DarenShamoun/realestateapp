import React from 'react';
import Layout from '../layout/Layout';
// Import additional components as needed

export default function Dashboard() {
    return (
        <Layout>
            <main className="container mx-auto p-4">
                <h1 className="text-2xl font-bold">Dashboard</h1>
                {/* Dashboard sections will be added here */}
                <div>
                    {/* Placeholder for property tiles */}
                    <h2 className="text-xl font-semibold mt-4 mb-2">Properties</h2>
                    {/* Placeholder content - replace with PropertyTile components later */}
                    <p>Property data will be displayed here.</p>
                </div>
                <div>
                    {/* Placeholder for financial overview */}
                    <h2 className="text-xl font-semibold mt-4 mb-2">Financial Overview</h2>
                    {/* Placeholder content - replace with financial data components later */}
                    <p>Financial data will be displayed here.</p>
                </div>
                {/* More sections as per your dashboard plan */}
            </main>
        </Layout>
    );
}
