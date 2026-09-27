import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import "../css/layout.css";
import "../css/navbar.css";
import "../css/sidebar.css";

function Layout({ title, children }) {
  return (
    <div className="layout-shell">
      <Sidebar />
      <div className="layout-main">
        <Navbar title={title} />
        <main className="page-content">{children}</main>
      </div>
    </div>
  );
}

export default Layout;
