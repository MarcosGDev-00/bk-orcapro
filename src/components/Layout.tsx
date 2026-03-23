import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { 
  FileText, Users, Package, LayoutDashboard, Settings2, 
  LogOut, ChevronRight, ChevronLeft 
} from 'lucide-react';

export function Layout() {
  const [expanded, setExpanded] = useState(true);
  const [email, setEmail] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) setEmail(data.user.email || '');
    });
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const navItems = [
    { group: 'PRINCIPAL', items: [
      { icon: FileText, label: 'Orçamentos', path: '/orcamentos' },
      { icon: Users, label: 'Clientes', path: '/clientes' },
      { icon: Package, label: 'Serviços', path: '/servicos' },
    ]},
    { group: 'CONTA', items: [
      { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
      { icon: Settings2, label: 'Meu Perfil', path: '/perfil' },
    ]}
  ];

  const pageTitle = navItems
    .flatMap(g => g.items)
    .find(i => location.pathname.startsWith(i.path) && i.path !== '/orcamentos' || location.pathname === i.path)?.label || 
    (location.pathname === '/orcamentos/novo' ? 'Novo Orçamento' : 'OrçaPro');

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', background: 'var(--bg)', color: 'var(--t1)', overflow: 'hidden' }}>
      {/* Sidebar Flutuante com Glassmorphism */}
      <aside className="glass" style={{
        margin: '16px',
        borderRadius: '24px',
        width: expanded ? 240 : 80,
        transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        boxShadow: 'var(--card-shadow)',
        zIndex: 100
      }}>
        <button 
          onClick={() => setExpanded(!expanded)}
          className="glass glow-hover"
          style={{
            position: 'absolute',
            right: -12,
            top: 48,
            width: 28,
            height: 28,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: 'var(--t1)',
            zIndex: 110,
            border: '1px solid var(--surface-border)'
          }}
        >
          {expanded ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
        </button>

        <div style={{ padding: '32px 24px', display: 'flex', alignItems: 'center', gap: 16 }}>
          <div className="glow-hover" style={{ 
            width: 36, 
            height: 36, 
            borderRadius: '12px', 
            background: 'linear-gradient(135deg, var(--accent) 0%, #a855f7 100%)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            boxShadow: '0 0 15px var(--accent-glow)'
          }}>
            <FileText size={20} color="#fff" />
          </div>
          {expanded && <span className="font-heading" style={{ fontWeight: 800, fontSize: 18, letterSpacing: '-0.5px', background: 'linear-gradient(to right, #fff, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>OrçaPro</span>}
        </div>

        <nav style={{ flex: 1, padding: '12px', overflowY: 'auto', overflowX: 'hidden' }}>
          {navItems.map((group, idx) => (
            <div key={idx} style={{ marginBottom: 32 }}>
              {expanded && (
                <div style={{ padding: '0 16px', marginBottom: 12, fontSize: 11, fontWeight: 700, color: 'var(--t3)', letterSpacing: '1.5px' }}>
                  {group.group}
                </div>
              )}
              {group.items.map(item => {
                const isActive = location.pathname.startsWith(item.path) && (item.path !== '/orcamentos' || location.pathname === '/orcamentos' || location.pathname.startsWith('/orcamentos/'));
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className="glow-hover"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 16,
                      padding: '12px 16px',
                      marginBottom: '4px',
                      borderRadius: '12px',
                      color: isActive ? '#fff' : 'var(--t2)',
                      background: isActive ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
                      border: isActive ? '1px solid rgba(99, 102, 241, 0.2)' : '1px solid transparent',
                      textDecoration: 'none',
                      fontSize: 14,
                      fontWeight: 500,
                      transition: 'all 0.2s'
                    }}
                  >
                    <item.icon size={20} style={{ 
                      flexShrink: 0,
                      color: isActive ? 'var(--accent)' : 'inherit'
                    }} />
                    {expanded && <span style={{ opacity: isActive ? 1 : 0.8 }}>{item.label}</span>}
                  </NavLink>
                );
              })}
            </div>
          ))}
        </nav>

        <div style={{ padding: '24px', borderTop: '1px solid var(--surface-border)' }}>
          <button
            onClick={handleLogout}
            className="glow-hover"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              width: '100%',
              background: 'rgba(239, 68, 68, 0.05)',
              border: '1px solid transparent',
              borderRadius: '12px',
              color: 'var(--red)',
              cursor: 'pointer',
              padding: '12px 16px',
              fontSize: 14,
              fontWeight: 500
            }}
          >
            <LogOut size={20} style={{ flexShrink: 0 }} />
            {expanded && (
              <span style={{ 
                whiteSpace: 'nowrap', 
                overflow: 'hidden', 
                textOverflow: 'ellipsis'
              }}>
                Logout
              </span>
            )}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, paddingRight: '16px' }}>
        <header style={{
          height: 80,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 32px',
          flexShrink: 0
        }}>
          <div>
            <h1 className="animate-fade-in" style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-0.5px' }}>{pageTitle}</h1>
            <p style={{ fontSize: 13, color: 'var(--t2)', marginTop: 4 }}>Gestão inteligente de orçamentos para BK Corp</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
             <div style={{ textAlign: 'right', display: 'none' }}>
                <p style={{ fontSize: 13, fontWeight: 600 }}>{email.split('@')[0]}</p>
                <p style={{ fontSize: 11, color: 'var(--t2)' }}>Administrador</p>
             </div>
             <div className="glass" style={{ width: 40, height: 40, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 600, color: 'var(--accent)', border: '1px solid var(--accent)' }}>
                {email.charAt(0).toUpperCase()}
             </div>
          </div>
        </header>

        <div className="animate-fade-in" style={{ flex: 1, overflow: 'auto', padding: '0 32px 32px 32px' }}>
          <Outlet />
        </div>
      </main>
    </div>
  );
}
