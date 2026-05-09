import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import './Login.css';

export default function Registro() {
  const [form, setForm] = useState({ nombre: '', email: '', password: '', confirmar: '', rol: 'alumno', matricula: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmar) { setError('Las contraseñas no coinciden'); return; }
    setLoading(true); setError('');
    try {
      const { confirmar, ...datos } = form;
      const res = await authService.registro(datos);
      login(res.data);
      navigate(res.data.usuario.rol === 'coordinador' ? '/coordinador' : '/alumno');
    } catch (err) {
      setError(err.response?.data?.detail || 'Error al registrarse');
    } finally { setLoading(false); }
  };

  return (
    <div className="login-bg">
      <div className="login-card">
        <div className="login-logo">U</div>
        <h1 className="login-title">UNACH</h1>
        <p className="login-sub">Crear cuenta · Servicio Social</p>
        {error && <div className="login-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group"><label>Nombre completo</label><input type="text" placeholder="Tu nombre completo" value={form.nombre} onChange={e => setForm({...form, nombre: e.target.value})} required /></div>
          <div className="form-group"><label>Correo institucional</label><input type="email" placeholder="usuario@unach.mx" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required /></div>
          <div className="form-group"><label>Rol</label>
            <select value={form.rol} onChange={e => setForm({...form, rol: e.target.value})}>
              <option value="alumno">Alumno</option>
              <option value="coordinador">Coordinador</option>
            </select>
          </div>
          {form.rol === 'alumno' && <div className="form-group"><label>Matrícula</label><input type="text" placeholder="UNACH-2024-XXX" value={form.matricula} onChange={e => setForm({...form, matricula: e.target.value})} /></div>}
          <div className="form-group"><label>Contraseña</label><input type="password" placeholder="••••••••" value={form.password} onChange={e => setForm({...form, password: e.target.value})} required /></div>
          <div className="form-group"><label>Confirmar contraseña</label><input type="password" placeholder="••••••••" value={form.confirmar} onChange={e => setForm({...form, confirmar: e.target.value})} required /></div>
          <button type="submit" className="btn-login" disabled={loading}>{loading ? 'Creando cuenta...' : 'Crear cuenta'}</button>
        </form>
        <p className="login-register">¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link></p>
      </div>
    </div>
  );
}
