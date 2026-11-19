import { useState } from 'react';
import AuthForm from './components/AuthForm.jsx';
import Dashboard from './components/Dashboard.jsx';

export default function App() {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user') || 'null'));

  function handleLogin(data) {
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    setUser(data.user);
  }

  function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  }

  return (
    <div className="container">
      <h1>🍬 Sweety</h1>
      {user ? <Dashboard user={user} onLogout={handleLogout} /> : <AuthForm onLogin={handleLogin} />}
    </div>
  );
}
