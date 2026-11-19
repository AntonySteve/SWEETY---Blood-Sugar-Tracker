import { useState, useEffect } from 'react';
import { api } from '../api.js';
import { SLOTS, today } from '../slots.js';


export default function ReadingForm({ editing, onSaved, onCancel }) {
  const [date, setDate] = useState(today());
  const [slot, setSlot] = useState('morning');
  const [value, setValue] = useState('');
  const [error, setError] = useState('');

  
  useEffect(() => {
    if (editing) {
      setDate(editing.reading_date);
      setSlot(editing.slot);
      setValue(String(editing.value));
      setError('');
    }
  }, [editing]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    const body = { date, slot, value: value === '' ? '' : Number(value) };
    try {
      if (editing) {
        await api('/readings/' + editing.id, 'PUT', body);
      } else {
        await api('/readings', 'POST', body);
      }
      setValue('');
      onSaved(date);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <form className="card" onSubmit={handleSubmit}>
      <h2>{editing ? 'Edit reading' : 'Add reading'}</h2>
      <label>
        Date
        <input type="date" value={date} max={today()} onChange={(e) => setDate(e.target.value)} />
      </label>
      <label>
        Time slot
        <select value={slot} onChange={(e) => setSlot(e.target.value)}>
          {SLOTS.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
      </label>
      <label>
        Glucose value (mg/dl)
        <input type="number" value={value} onChange={(e) => setValue(e.target.value)} />
      </label>
      {error && <p className="error">{error}</p>}
      <button type="submit">{editing ? 'Update' : 'Add'}</button>
      {editing && (
        <button type="button" className="secondary" onClick={() => { setValue(''); setError(''); onCancel(); }}>
          Cancel
        </button>
      )}
    </form>
  );
}
