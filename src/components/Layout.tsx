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
    <div style={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden' }}>
      <aside style={{
        position: 'relative',
        width: expanded ? 224 : 64,
        background: 'var(--s1)',
        borderRight: '1px solid var(--ln)',
        transition: 'width 0.22s cubic-bezier(0.4,0,0.2,1)',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 40
      }}>
        <button 
          onClick={() => setExpanded(!expanded)}
          style={{
            position: 'absolute',
            right: -12,
            top: '50%',
            transform: 'translateY(-50%)',
            width: 24,
            height: 24,
            background: 'var(--s1)',
            border: '1px solid var(--ln)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: 'var(--t2)',
            zIndex: 50
          }}
        >
          {expanded ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
        </button>

        <div style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: 12, borderBottom: '1px solid var(--ln)' }}>
          <div style={{ width: 30, height: 30, borderRadius: 8, background: 'var(--t1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <FileText size={15} color="#fff" />
          </div>
          {expanded && <span style={{ fontWeight: 700, fontSize: 14, letterSpacing: 0.5 }}>ORÇAPRO</span>}
        </div>

        <nav style={{ flex: 1, padding: '20px 0', overflowY: 'auto', overflowX: 'hidden' }}>
          {navItems.map((group, idx) => (
            <div key={idx} style={{ marginBottom: 24 }}>
              {expanded && (
                <div style={{ padding: '0 20px', marginBottom: 8, fontSize: 10, fontWeight: 600, color: 'var(--t3)', letterSpacing: 1 }}>
                  {group.group}
                </div>
              )}
              {group.items.map(item => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  style={({ isActive }) => ({
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: '10px 20px',
                    color: isActive ? 'var(--t1)' : 'var(--t2)',
                    background: isActive ? 'var(--s2)' : 'transparent',
                    textDecoration: 'none',
                    fontSize: 13,
                    fontWeight: 500
                  })}
                >
                  <item.icon size={18} style={{ flexShrink: 0 }} />
                  {expanded && <span style={{ whiteSpace: 'nowrap' }}>{item.label}</span>}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>

        <div style={{ padding: '20px', borderTop: '1px solid var(--ln)' }}>
          <button
            onClick={handleLogout}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              width: '100%',
              background: 'transparent',
              border: 'none',
              color: 'var(--t2)',
              cursor: 'pointer',
              padding: '10px 0',
              fontSize: 13,
              fontWeight: 500
            }}
          >
            <LogOut size={18} style={{ flexShrink: 0 }} />
            {expanded && (
              <span style={{ 
                whiteSpace: 'nowrap', 
                overflow: 'hidden', 
                textOverflow: 'ellipsis',
                maxWidth: 130 
              }}>
                {email || 'Sair'}
              </span>
            )}
          </button>
        </div>
      </aside>

      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <header style={{
          height: 60,
          background: 'var(--s1)',
          borderBottom: '1px solid var(--ln)',
          display: 'flex',
          alignItems: 'center',
          padding: '0 24px',
          flexShrink: 0
        }}>
          <h1 style={{ fontSize: 15, fontWeight: 600 }}>{pageTitle}</h1>
        </header>

        <div style={{ flex: 1, overflow: 'auto', padding: '24px' }}>
          <Outlet />
        </div>
      </main>
    </div>
  );
}
