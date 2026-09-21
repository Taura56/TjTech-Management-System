import Layout from "../components/Layout";
import DashboardCard from "../components/DashboardCard";
import "../css/dashboard.css";
import { useState, useEffect } from "react";
function Dashboard(){
        const[products, setProducts] = useState([]);
           /*cUSTOMER PAGE*/
        const [customers, setCustomers] = useState([]);
       useEffect(() => { 

    const savedProducts = 
    JSON.parse(localStorage.getItem("products")) || [];

    const savedCustomers =
    JSON.parse(localStorage.getItem("customers")) || [];

    setProducts(savedProducts);
    setCustomers(savedCustomers);

}, []);

    const inStock = products.filter(
        (product) => product.stock > 10
    ).length;

    const lowStock = products.filter(
        (product) => product.stock > 0 && product.stock <= 10
    ).length;

    const outOfStock = products.filter(
        (product) => product.stock === 0
    ).length;

    const totalProducts = products.length;
    const totalCustomers = customers.length;

 
    return(
        <Layout title="Dashboard">

            <p>
                Welcome to the TJ Tech Management System Dashboard.
            </p>

            <div className="dashboard-cards">

                <DashboardCard 
                    title="Total Products" 
                    value={totalProducts} 
                    icon="📦" 
                />

                <DashboardCard 
                    title="In Stock" 
                    value={inStock} 
                    icon="✅" 
                />

                <DashboardCard 
                    title="Low Stock" 
                    value={lowStock} 
                    icon="⚠️" 
                />

                <DashboardCard 
                    title="Out of Stock" 
                    value={outOfStock} 
                    icon="❌" 
                />

                <DashboardCard 
                    title="Total Customers" 
                    value={totalCustomers} 
                    icon="👥" 
                />

            </div>

        </Layout>
    );
}

export default Dashboard;