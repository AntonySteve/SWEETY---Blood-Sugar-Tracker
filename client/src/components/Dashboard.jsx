import { useState, useEffect } from 'react';
import { api } from '../api.js';
import { slotLabel, today } from '../slots.js';
import ReadingForm from './ReadingForm.jsx';
import ReportCard from './ReportCard.jsx';

export default function Dashboard({ user, onLogout }) {
  const [date, setDate] = useState(today());
  const [report, setReport] = useState(null);
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState('');
  const [refresh, setRefresh] = useState(0);

  
  useEffect(() => {
    api('/reports?date=' + date)
      .then((data) => { setReport(data); setError(''); })
      .catch((err) => setError(err.message));
  }, [date, refresh]);

  function handleSaved(savedDate) {
    setEditing(null);
    setDate(savedDate);
    setRefresh((n) => n + 1);
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this reading?')) return;
    try {
      await api('/readings/' + id, 'DELETE');
      setEditing(null);
      setRefresh((n) => n + 1);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div>
      <div className="topbar">
        <span>Hello, {user.name}</span>
        <button className="secondary" onClick={onLogout}>Log out</button>
      </div>

      <ReadingForm editing={editing} onSaved={handleSaved} onCancel={() => setEditing(null)} />

      <div className="card">
        <label>
          Report date
          <input type="date" value={date} max={today()} onChange={(e) => e.target.value && setDate(e.target.value)} />
        </label>
        {error && <p className="error">{error}</p>}
      </div>

      {report && (
        <>
          <ReportCard title="Daily report" from={report.daily.from} to={report.daily.to} stats={report.daily.stats}>
            {report.daily.readings.length > 0 && (
              <table>
                <thead>
                  <tr><th>Slot</th><th>Value (mg/dl)</th><th></th></tr>
                </thead>
                <tbody>
                  {report.daily.readings.map((r) => (
                    <tr key={r.id}>
                      <td>{slotLabel(r.slot)}</td>
                      <td>{r.value}</td>
                      <td>
                        <button className="small" onClick={() => setEditing(r)}>Edit</button>{' '}
                        <button className="small danger" onClick={() => handleDelete(r.id)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </ReportCard>
          <ReportCard title="Month-to-date report" from={report.monthToDate.from} to={report.monthToDate.to} stats={report.monthToDate.stats} />
          <ReportCard title="Previous month report" from={report.previousMonth.from} to={report.previousMonth.to} stats={report.previousMonth.stats} />
        </>
      )}
    </div>
  );
}
