import Layout from "../components/Layout";
import "../css/report.css";
import { useState } from "react";


function Report() {
    {/* Sample sales data for demonstration purposes */}

    const sales = [
        {
            id: 1,
            customer: "John Doe",
            product: "Laptop",
            quantity: 2,
            total: 1700,
            date: "20/08/2026"
        },
        {
            id: 2,
            customer: "Jane Smith",
            product: "Mouse",
            quantity: 3,
            total: 60,
            date: "20/08/2026"
        }
    ];

    return (
        <Layout title="Report">
            {/* Report Page */}
            <div className="report-page">
            
            {/* Report Header */}
                <div className="report-header">

                    <div>
                        <h2>Sales Report</h2>
                        <p>View and analyze your business performance.</p>
                    </div>

                    <div className="report-actions">
                        <button className="print-btn">🖨 Print</button>
                        <button className="export-btn">📄 Export PDF</button>
                    </div>

                </div>

                {/* Report Cards */}
                <div className="report-cards">

                    <div className="report-card">
                        <h3>Total Revenue</h3>
                        <h2>$12,500</h2>
                    </div>

                    <div className="report-card">
                        <h3>Total Orders</h3>
                        <h2>25</h2>
                    </div>

                    <div className="report-card">
                        <h3>Products Sold</h3>
                        <h2>80</h2>
                    </div>

                    <div className="report-card">
                        <h3>Total Customers</h3>
                        <h2>18</h2>
                    </div>

                </div>

                {/* Sales Table */}
                <div className="sales-report">

                    <h2>Sales Transactions</h2>

                    <table>

                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Customer</th>
                                <th>Product</th>
                                <th>Quantity</th>
                                <th>Total</th>
                                <th>Date</th>
                            </tr>
                        </thead>


                        <tbody>

                            {sales.map((sale)=>(

                                <tr key={sale.id}>

                                    <td>{sale.id}</td>
                                    <td>{sale.customer}</td>
                                    <td>{sale.product}</td>
                                    <td>{sale.quantity}</td>
                                    <td>${sale.total}</td>
                                    <td>{sale.date}</td>

                                </tr>

                            ))}

                        </tbody>

                    </table>

                </div>

            </div>
        </Layout>
    );
}

export default Report;