export default function ReportCard({ title, from, to, stats, children }) {
  const range = from === to ? from : `${from} to ${to}`;
  return (
    <div className="card">
      <h2>{title}</h2>
      <p className="muted">{range}</p>
      {!stats || stats.count === 0 ? (
        <p className="empty">No readings for this period yet. 🩸</p>
      ) : (
        <div className="stats">
          <div><b>{stats.highest}</b><span>Highest</span></div>
          <div><b>{stats.lowest}</b><span>Lowest</span></div>
          <div><b>{stats.average}</b><span>Average</span></div>
          <div><b>{stats.count}</b><span>Readings</span></div>
        </div>
      )}
      {children}
    </div>
  );
}
