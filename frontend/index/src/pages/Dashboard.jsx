import Layout from "../components/Layout";
import DashboardCard from "./DashboardCard";
function Dashboard(){
    return(
    <Layout title="Dashboard">
         <h1>Dashboard</h1>
         <p>
            Welcome to the TJ Tech Management System Dashboard.
         </p>
         <DashboardCard title="Total Users" value="1,234" icon="👥" />
         <DashboardCard title="Total Orders" value="567" icon="📦" />
         <DashboardCard title="Total Revenue" value="$12,345" icon="💰" />
    </Layout>
    
    );
}

export default Dashboard;