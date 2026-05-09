import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { solicitudService } from '../services/api';
import './Dashboard.css';

const NAV = [
  { key: 'solicitudes', label: 'Gestión Solicitudes', icon: '📋' },
  { key: 'alumnos', label: 'Monitor Alumnos', icon: '👥' },
  { key: 'reportes', label: 'Reportes', icon: '📊' },
];

export default function CoordinadorDashboard() {
  const [activeNav, setActiveNav] = useState('solicitudes');
  const [solicitudes, setSolicitudes] = useState([]);
  const [filtro, setFiltro] = useState('');
  const [detalle, setDetalle] = useState(null);

  const cargar = () => {
    solicitudService.todas(filtro).then(r => setSolicitudes(r.data)).catch(() => {});
  };

  useEffect(() => { cargar(); }, [filtro, activeNav]);

  const accion = async (fn, id) => {
    try {
      await fn(id); cargar();
      if (detalle?.id === id) { const res = await solicitudService.obtener(id); setDetalle(res.data); }
    } catch {}
  };

  const badgeClass = (estado) => ({ pendiente: 'badge-pending', en_revision: 'badge-review', aprobada: 'badge-active', rechazada: 'badge-rejected' }[estado] || 'badge-pending');

  const totales = {
    total: solicitudes.length,
    pendientes: solicitudes.filter(s => s.estado === 'pendiente').length,
    aprobadas: solicitudes.filter(s => s.estado === 'aprobada').length,
  };

  return (
    <div className="app">
      <Navbar navItems={NAV} activeNav={activeNav} setActiveNav={(nav) => { setDetalle(null); setActiveNav(nav); }} />
      <div className="main">

        {detalle && (
          <div>
            <div className="page-header" style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
              <div>
                <div className="page-title">Detalle de Solicitud</div>
                <div className="page-sub">{detalle.nombre} — {detalle.institucion}</div>
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
              <div style={{display:'flex',gap:8,marginTop:20}}>
                {(detalle.estado === 'pendiente' || detalle.estado === 'en_revision') && <button className="btn btn-sm btn-gold" onClick={() => accion(solicitudService.aprobar, detalle.id)}>Aprobar</button>}
                {detalle.estado === 'pendiente' && <button className="btn btn-sm btn-outline" onClick={() => accion(solicitudService.revision, detalle.id)}>Poner en revisión</button>}
                {detalle.estado !== 'rechazada' && detalle.estado !== 'aprobada' && <button className="btn btn-sm btn-danger" onClick={() => accion(solicitudService.rechazar, detalle.id)}>Rechazar</button>}
              </div>
            </div>
          </div>
        )}

        {activeNav === 'solicitudes' && !detalle && (
          <div>
            <div className="page-header" style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
              <div>
                <div className="page-title">Gestión de Solicitudes</div>
                <div className="page-sub">UNACH — Módulo Servicio Social</div>
              </div>
              <select className="filter-select" value={filtro} onChange={e => setFiltro(e.target.value)}>
                <option value="">Todos los estados</option>
                <option value="pendiente">Pendientes</option>
                <option value="en_revision">En revisión</option>
                <option value="aprobada">Aprobadas</option>
                <option value="rechazada">Rechazadas</option>
              </select>
            </div>
            <div className="card">
              {solicitudes.length === 0 ? <div className="empty">No hay solicitudes.</div> : (
                <table className="table">
                  <thead><tr><th>Alumno</th><th>Institución</th><th>Carrera</th><th>Estado</th><th>Acciones</th></tr></thead>
                  <tbody>
                    {solicitudes.map(s => (
                      <tr key={s.id}>
                        <td>{s.nombre}</td><td>{s.institucion}</td><td>{s.carrera}</td>
                        <td><span className={`badge ${badgeClass(s.estado)}`}>{s.estado}</span></td>
                        <td className="acciones">
                          <button className="btn btn-sm btn-outline" onClick={() => setDetalle(s)}>Ver detalle</button>
                          {(s.estado === 'pendiente' || s.estado === 'en_revision') && <button className="btn btn-sm btn-gold" onClick={() => accion(solicitudService.aprobar, s.id)}>Aprobar</button>}
                          {s.estado !== 'rechazada' && s.estado !== 'aprobada' && <button className="btn btn-sm btn-danger" onClick={() => accion(solicitudService.rechazar, s.id)}>Rechazar</button>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {activeNav === 'alumnos' && !detalle && (
          <div>
            <div className="page-header">
              <div className="page-title">Monitor Alumnos</div>
              <div className="page-sub">Alumnos con solicitud aprobada</div>
            </div>
            <div className="card">
              <table className="table">
                <thead><tr><th>Alumno</th><th>Matrícula</th><th>Institución</th><th>Fecha inicio</th><th>Acción</th></tr></thead>
                <tbody>
                  {solicitudes.filter(s => s.estado === 'aprobada').map(s => (
                    <tr key={s.id}>
                      <td>{s.nombre}</td><td>{s.matricula}</td><td>{s.institucion}</td><td>{s.fecha_inicio}</td>
                      <td><button className="btn btn-sm btn-outline" onClick={() => setDetalle(s)}>Ver detalle</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeNav === 'reportes' && !detalle && (
          <div>
            <div className="page-header">
              <div className="page-title">Reportes del Módulo</div>
              <div className="page-sub">Estadísticas generales — Servicio Social</div>
            </div>
            <div className="metrics" style={{marginBottom:20}}>
              <div className="metric"><div className="metric-num">{totales.total}</div><div className="metric-label">Total solicitudes</div></div>
              <div className="metric gold"><div className="metric-num">{totales.pendientes}</div><div className="metric-label">Pendientes</div></div>
              <div className="metric green"><div className="metric-num">{totales.aprobadas}</div><div className="metric-label">Aprobadas</div></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
