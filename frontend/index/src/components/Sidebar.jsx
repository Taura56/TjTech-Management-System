import { NavLink } from "react-router-dom";
import "../css/sidebar.css";

const navItems = [
  { label: "Dashboard", path: "/dashboard" },
  { label: "Products", path: "/products" },
  { label: "Customers", path: "/customers" },
  { label: "Sales", path: "/sales" },
  { label: "Payments", path: "/payments" },
  { label: "Services", path: "/services" },
  { label: "Reports", path: "/report" },
];

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="brand">
        <span className="brand__logo">TJ</span>
        <div>
          <strong>TJ Tech</strong>
          <small>Management</small>
        </div>
      </div>

      <nav className="nav">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;
