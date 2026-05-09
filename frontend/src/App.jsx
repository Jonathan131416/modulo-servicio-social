import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Registro from './pages/Registro';
import AlumnoDashboard from './pages/AlumnoDashboard';
import CoordinadorDashboard from './pages/CoordinadorDashboard';

const PrivateRoute = ({ children, rol }) => {
  const { usuario } = useAuth();
  if (!usuario) return <Navigate to="/login" />;
  if (rol && usuario.rol !== rol) return <Navigate to="/login" />;
  return children;
};

function AppRoutes() {
  const { usuario } = useAuth();
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/registro" element={<Registro />} />
      <Route path="/alumno" element={<PrivateRoute rol="alumno"><AlumnoDashboard /></PrivateRoute>} />
      <Route path="/coordinador" element={<PrivateRoute rol="coordinador"><CoordinadorDashboard /></PrivateRoute>} />
      <Route path="/" element={<Navigate to={usuario ? (usuario.rol === 'coordinador' ? '/coordinador' : '/alumno') : '/login'} />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter><AppRoutes /></BrowserRouter>
    </AuthProvider>
  );
}
