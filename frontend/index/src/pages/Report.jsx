import Layout from "../components/Layout";
import "../css/report.css";
import { useEffect, useState } from "react";
import { fetchSales, fetchCustomers, fetchStocks } from "../Services/api";

function Report() {
    const [sales, setSales] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const loadReportData = async () => {
            try {
                const [salesData, customerData, stockData] = await Promise.all([
                    fetchSales(),
                    fetchCustomers(),
                    fetchStocks(),
                ]);

                setSales(salesData);
                setCustomers(customerData);
                setProducts(stockData);
            } catch (error) {
                setSales(JSON.parse(localStorage.getItem("sales")) || []);
                setCustomers(JSON.parse(localStorage.getItem("customers")) || []);
                setProducts(JSON.parse(localStorage.getItem("products")) || []);
            }
        };

        loadReportData();
    }, []);

    const totalRevenue = sales.reduce((total, sale) => total + Number(sale.total || 0), 0);
    const totalOrders = sales.length;
    const productsSold = sales.reduce((total, sale) => total + Number(sale.quantity || 0), 0);
    const totalCustomers = customers.length;

    return (
        <Layout title="Report">
            <div className="report-page">
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

                <div className="report-cards">
                    <div className="report-card">
                        <h3>Total Revenue</h3>
                        <h2>${totalRevenue}</h2>
                    </div>

                    <div className="report-card">
                        <h3>Total Orders</h3>
                        <h2>{totalOrders}</h2>
                    </div>

                    <div className="report-card">
                        <h3>Products Sold</h3>
                        <h2>{productsSold}</h2>
                    </div>

                    <div className="report-card">
                        <h3>Total Customers</h3>
                        <h2>{totalCustomers}</h2>
                    </div>
                </div>

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
                            {sales.map((sale, index) => (
                                <tr key={sale._id || sale.id || index}>
                                    <td>{index + 1}</td>
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