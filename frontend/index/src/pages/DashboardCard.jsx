import "../css/dashboard-card.css";
function DashboardCard({title, value, icon}) {
    return(
        <div className="dashboard-card">
            <div className="icon">
                {icon}
            </div>
            <h4>{title}</h4>
            <h2>{value}</h2>
        </div>
    );
}
export default DashboardCard;