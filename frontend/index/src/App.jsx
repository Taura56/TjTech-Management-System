import { Navigate, Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Customers from "./pages/Customers";
import Sales from "./pages/Sales";
import Payments from "./pages/Payments";
import Report from "./pages/Report";
import Services from "./pages/Services";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/products" element={<Products />} />
      <Route path="/customers" element={<Customers />} />
      <Route path="/sales" element={<Sales />} />
      <Route path="/payments" element={<Payments />} />
      <Route path="/report" element={<Report />} />
      <Route path="/services" element={<Services />} />
    </Routes>
  );
}

export default App;
