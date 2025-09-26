import React, { useState } from 'react';
import Button from './Button';

// formulario auth reutilizable
export default function AuthForm({ mode = 'login', onSubmit }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const submit = (e) => {
    e.preventDefault();
    // reemplazar con auth real, en las bases
    if (onSubmit) onSubmit({ email, password });
  };

  return (
    <form className="form card" onSubmit={submit}>
      <h2>{mode === 'login' ? 'Sign in' : 'Create account'}</h2>
      <input className="input" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input className="input" placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <div style={{ display: 'flex', gap: 12 }}>
        <Button type="submit">{mode === 'login' ? 'Login' : 'Register'}</Button>
        <Button variant="ghost" type="button">Cancelar</Button>
      </div>
      <div className="small-muted">Continuar.</div>
    </form>
  );
}
