import "../css/sidebar.css";
import { NavLink } from "react-router-dom";
function Sidebar(){
    return(
        <div className="sidebar">
            <h2>TJ Tech Management System</h2>
            <ul>
                <li>
                    <NavLink to="/">Dashboard</NavLink>
                </li>
                <li>
                    <NavLink to="/products">Products</NavLink>
                </li>
                <li>
                    <NavLink to="/customers">Customers</NavLink>
                </li>
                <li>
                    <NavLink to="/reports">Reports</NavLink>
                </li>
                <li>
                    <NavLink to="/sales">Sales</NavLink>
                </li>
            </ul>
        </div>
    );
}
export default Sidebar;