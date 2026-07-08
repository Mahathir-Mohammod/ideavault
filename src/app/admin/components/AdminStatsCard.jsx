export default function AdminStatsCard({ label, value, icon, color = "primary" }) {
  return (
    <div className={`admin-stat-card admin-stat-${color}`}>
      <div className="admin-stat-icon">{icon}</div>
      <div className="admin-stat-info">
        <span className="admin-stat-value">{value ?? "—"}</span>
        <span className="admin-stat-label">{label}</span>
      </div>
    </div>
  );
}
