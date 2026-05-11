import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(() => {
    const u = localStorage.getItem('usuario');
    return u ? JSON.parse(u) : null;
  });

  const login = (data) => {
    localStorage.setItem('token', data.token);
    localStorage.setItem('usuario', JSON.stringify(data.usuario));
    setUsuario(data.usuario);
  };

  const loginFromToken = (token, rol, rfc) => {
    const usuarioData = {
      rol: rol,
      rfc: rfc,
    };
    
    localStorage.setItem('token', token);
    localStorage.setItem('usuario', JSON.stringify(usuarioData));
    localStorage.setItem('userRole', rol);
    localStorage.setItem('userRFC', rfc);
    setUsuario(usuarioData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userRFC');
    setUsuario(null);
  };

  return (
    <AuthContext.Provider value={{ usuario, login, logout, loginFromToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
