import "../css/dashboard-card.css";

function DashboardCard({ title, value, icon }) {
  return (
    <div className="dashboard-card">
      <div className="dashboard-card__icon">{icon}</div>
      <div>
        <p>{title}</p>
        <h3>{value}</h3>
      </div>
    </div>
  );
}

export default DashboardCard;
