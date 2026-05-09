import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { solicitudService } from '../services/api';
import './Dashboard.css';

const NAV = [
  { key: 'solicitud', label: 'Nueva Solicitud', icon: '📋' },
  { key: 'seguimiento', label: 'Mi Seguimiento', icon: '📊' },
];

export default function AlumnoDashboard() {
  const [activeNav, setActiveNav] = useState('solicitud');
  const [solicitudes, setSolicitudes] = useState([]);
  const [detalle, setDetalle] = useState(null);
  const [form, setForm] = useState({ nombre: '', matricula: '', carrera: '', semestre: '', institucion: '', fecha_inicio: '', fecha_termino: '', actividades: '' });
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (activeNav === 'seguimiento') {
      solicitudService.misSolicitudes().then(r => setSolicitudes(r.data)).catch(() => {});
    }
  }, [activeNav]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setMsg('');
    try {
      await solicitudService.crear(form);
      setMsg('✅ Solicitud enviada correctamente');
      setForm({ nombre: '', matricula: '', carrera: '', semestre: '', institucion: '', fecha_inicio: '', fecha_termino: '', actividades: '' });
    } catch (err) {
      const detail = err.response?.data?.detail;
      const errorMsg = Array.isArray(detail) ? detail.map(d => d.msg).join(', ') : (detail || 'Error al enviar');
      setMsg('❌ ' + errorMsg);
    } finally { setLoading(false); }
  };

  const verDetalle = async (id) => {
    try { const res = await solicitudService.obtener(id); setDetalle(res.data); } catch {}
  };

  const badgeClass = (estado) => ({ pendiente: 'badge-pending', en_revision: 'badge-review', aprobada: 'badge-active', rechazada: 'badge-rejected' }[estado] || 'badge-pending');

  return (
    <div className="app">
      <Navbar navItems={NAV} activeNav={activeNav} setActiveNav={(nav) => { setDetalle(null); setActiveNav(nav); }} />
      <div className="main">

        {activeNav === 'solicitud' && (
          <div>
            <div className="page-header">
              <div className="page-title">Nueva Solicitud de Servicio Social</div>
              <div className="page-sub">UNACH — Registro de Servicio Social</div>
            </div>
            <div className="card">
              {msg && <div className={`alert ${msg.startsWith('✅') ? 'alert-success' : 'alert-error'}`}>{msg}</div>}
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Nombre del Alumno:</label>
                  <input value={form.nombre} onChange={e => setForm({...form, nombre: e.target.value})} placeholder="Tu nombre completo" required />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Matrícula:</label>
                    <input value={form.matricula} onChange={e => setForm({...form, matricula: e.target.value})} placeholder="UNACH-2024-XXX" required />
                  </div>
                  <div className="form-group">
                    <label>Semestre:</label>
                    <select value={form.semestre} onChange={e => setForm({...form, semestre: e.target.value})} required>
                      <option value="">Selecciona...</option>
                      <option>6° semestre</option><option>7° semestre</option><option>8° semestre</option>
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label>Carrera:</label>
                  <select value={form.carrera} onChange={e => setForm({...form, carrera: e.target.value})} required>
                    <option value="">Selecciona...</option>
                    <option>Ing. Desarrollo de Tecnologías y Software</option>
                    <option>Ing. en Sistemas</option>
                    <option>Licenciatura en Informática</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Institución Receptora:</label>
                  <input value={form.institucion} onChange={e => setForm({...form, institucion: e.target.value})} placeholder="Nombre de la empresa u organización" required />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Fecha de Inicio:</label>
                    <input type="date" value={form.fecha_inicio} onChange={e => setForm({...form, fecha_inicio: e.target.value})} required />
                  </div>
                  <div className="form-group">
                    <label>Fecha de Término:</label>
                    <input type="date" value={form.fecha_termino} onChange={e => setForm({...form, fecha_termino: e.target.value})} required />
                  </div>
                </div>
                <div className="form-group">
                  <label>Actividades a Realizar:</label>
                  <textarea rows="4" value={form.actividades} onChange={e => setForm({...form, actividades: e.target.value})} placeholder="Describe las actividades que realizarás..." required />
                </div>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Enviando...' : 'Enviar Solicitud de Servicio Social'}
                </button>
              </form>
            </div>
          </div>
        )}

        {activeNav === 'seguimiento' && !detalle && (
          <div>
            <div className="page-header">
              <div className="page-title">Mi Seguimiento</div>
              <div className="page-sub">Estado de tus solicitudes de servicio social</div>
            </div>
            <div className="card">
              {solicitudes.length === 0 ? <div className="empty">No tienes solicitudes aún.</div> : (
                <table className="table">
                  <thead><tr><th>Institución</th><th>Carrera</th><th>Fecha inicio</th><th>Estado</th><th>Acción</th></tr></thead>
                  <tbody>
                    {solicitudes.map(s => (
                      <tr key={s.id}>
                        <td>{s.institucion}</td><td>{s.carrera}</td><td>{s.fecha_inicio}</td>
                        <td><span className={`badge ${badgeClass(s.estado)}`}>{s.estado}</span></td>
                        <td><button className="btn btn-sm btn-outline" onClick={() => verDetalle(s.id)}>Ver detalle</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {activeNav === 'seguimiento' && detalle && (
          <div>
            <div className="page-header" style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
              <div>
                <div className="page-title">Detalle de Solicitud</div>
                <div className="page-sub">Información completa de tu solicitud</div>
              </div>
              <button className="btn btn-outline btn-sm" onClick={() => setDetalle(null)}>← Volver</button>
            </div>
            <div className="card">
              <div className="detalle-grid">
                <div className="detalle-item"><span className="detalle-label">Nombre</span><span>{detalle.nombre}</span></div>
                <div className="detalle-item"><span className="detalle-label">Matrícula</span><span>{detalle.matricula}</span></div>
                <div className="detalle-item"><span className="detalle-label">Carrera</span><span>{detalle.carrera}</span></div>
                <div className="detalle-item"><span className="detalle-label">Semestre</span><span>{detalle.semestre}</span></div>
                <div className="detalle-item"><span className="detalle-label">Institución</span><span>{detalle.institucion}</span></div>
                <div className="detalle-item"><span className="detalle-label">Estado</span><span className={`badge ${badgeClass(detalle.estado)}`}>{detalle.estado}</span></div>
                <div className="detalle-item"><span className="detalle-label">Fecha inicio</span><span>{detalle.fecha_inicio}</span></div>
                <div className="detalle-item"><span className="detalle-label">Fecha término</span><span>{detalle.fecha_termino}</span></div>
                <div className="detalle-item full"><span className="detalle-label">Actividades</span><p className="detalle-actividades">{detalle.actividades}</p></div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
