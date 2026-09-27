import "../css/navbar.css";

function Navbar({ title }) {
  return (
    <header className="topbar">
      <div>
        <p className="topbar__eyebrow">TJ Tech</p>
        <h1>{title}</h1>
      </div>
      <div className="topbar__user">
        <span className="avatar">T</span>
        <span>Admin</span>
      </div>
    </header>
  );
}

export default Navbar;
