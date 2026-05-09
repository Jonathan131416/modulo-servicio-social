import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import './Login.css';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const res = await authService.login(form);
      login(res.data);
      navigate(res.data.usuario.rol === 'coordinador' ? '/coordinador' : '/alumno');
    } catch (err) {
      setError(err.response?.data?.detail || 'Error al iniciar sesión');
    } finally { setLoading(false); }
  };

  return (
    <div className="login-bg">
      <div className="login-card">
        <div className="login-logo">U</div>
        <h1 className="login-title">UNACH</h1>
        <p className="login-sub">Módulo · Servicio Social</p>
        {error && <div className="login-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group"><label>Correo institucional</label><input type="email" placeholder="usuario@unach.mx" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required /></div>
          <div className="form-group"><label>Contraseña</label><input type="password" placeholder="••••••••" value={form.password} onChange={e => setForm({...form, password: e.target.value})} required /></div>
          <button type="submit" className="btn-login" disabled={loading}>{loading ? 'Ingresando...' : 'Ingresar'}</button>
        </form>
        <p className="login-register">¿No tienes cuenta? <Link to="/registro">Regístrate</Link></p>
      </div>
    </div>
  );
}
