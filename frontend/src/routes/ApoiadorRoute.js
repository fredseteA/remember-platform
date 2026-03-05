import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function ApoiadorRoute({ children }) {
  const { user } = useAuth();
  const [status, setStatus] = useState('loading'); // 'loading' | 'allowed' | 'denied'

  useEffect(() => {
    if (!user) {
      setStatus('denied');
      return;
    }
    (async () => {
      try {
        const token = await user.getIdToken();
        const res = await axios.get(`${API}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const role = res.data?.role || 'user';
        if (role === 'apoiador' || role === 'admin') {
          setStatus('allowed');
        } else {
          setStatus('denied');
        }
      } catch {
        setStatus('denied');
      }
    })();
  }, [user]);

  if (status === 'loading') {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        minHeight: '100vh', background: '#f0f4f8',
        fontFamily: '"Georgia", serif', color: '#1a2744', fontSize: '0.95rem'
      }}>
        Verificando acesso...
      </div>
    );
  }

  if (status === 'denied') {
    return <Navigate to="/" replace />;
  }

  return children;
}