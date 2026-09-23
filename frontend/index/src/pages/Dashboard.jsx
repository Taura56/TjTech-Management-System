import Layout from "../components/Layout";
import DashboardCard from "../components/DashboardCard";
import "../css/dashboard.css";
import { useState, useEffect } from "react";
import { fetchStocks, fetchCustomers, fetchSales } from "../Services/api";

function Dashboard() {
    const [products, setProducts] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [sales, setSales] = useState([]);

    useEffect(() => {
        const loadDashboardData = async () => {
            try {
                const [backendProducts, backendCustomers, backendSales] = await Promise.all([
                    fetchStocks(),
                    fetchCustomers(),
                    fetchSales(),
                ]);

                setProducts(backendProducts);
                setCustomers(backendCustomers);
                setSales(backendSales);
                localStorage.setItem("products", JSON.stringify(backendProducts));
                localStorage.setItem("customers", JSON.stringify(backendCustomers));
                localStorage.setItem("sales", JSON.stringify(backendSales));
            } catch (error) {
                const savedProducts = JSON.parse(localStorage.getItem("products")) || [];
                const savedCustomers = JSON.parse(localStorage.getItem("customers")) || [];
                const savedSales = JSON.parse(localStorage.getItem("sales")) || [];
                setProducts(savedProducts);
                setCustomers(savedCustomers);
                setSales(savedSales);
            }
        };

        loadDashboardData();
    }, []);

    const inStock = products.filter((product) => Number(product.stock ?? 0) > 10).length;
    const lowStock = products.filter((product) => Number(product.stock ?? 0) > 0 && Number(product.stock ?? 0) <= 10).length;
    const outOfStock = products.filter((product) => Number(product.stock ?? 0) === 0).length;
    const totalProducts = products.length;
    const totalCustomers = customers.length;
    const totalSales = sales.length;

    return (
        <Layout title="Dashboard">
            <p>Welcome to the TJ Tech Management System Dashboard.</p>

            <div className="dashboard-cards">
                <DashboardCard title="Total Products" value={totalProducts} icon="📦" />
                <DashboardCard title="In Stock" value={inStock} icon="✅" />
                <DashboardCard title="Low Stock" value={lowStock} icon="⚠️" />
                <DashboardCard title="Out of Stock" value={outOfStock} icon="❌" />
                <DashboardCard title="Total Customers" value={totalCustomers} icon="👥" />
                <DashboardCard title="Total Sales" value={totalSales} icon="💰" />
            </div>
        </Layout>
    );
}

export default Dashboard;