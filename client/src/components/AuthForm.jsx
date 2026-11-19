import { useState } from 'react';
import { api } from '../api.js';

export default function AuthForm({ onLogin }) {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    try {
      const data = isRegister
        ? await api('/auth/register', 'POST', { name, email, password })
        : await api('/auth/login', 'POST', { email, password });
      onLogin(data);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <form className="card" onSubmit={handleSubmit}>
      <h2>{isRegister ? 'Sign up' : 'Log in'}</h2>
      {isRegister && (
        <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
      )}
      <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      {error && <p className="error">{error}</p>}
      <button type="submit">{isRegister ? 'Sign up' : 'Log in'}</button>
      <p>
        {isRegister ? 'Already have an account?' : 'New here?'}{' '}
        <a href="#" onClick={(e) => { e.preventDefault(); setError(''); setIsRegister(!isRegister); }}>
          {isRegister ? 'Log in' : 'Sign up'}
        </a>
      </p>
    </form>
  );
}
