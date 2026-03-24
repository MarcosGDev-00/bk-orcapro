import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { 
  FileText, Users, Package, LayoutDashboard, Settings2, 
  LogOut, ChevronRight, ChevronLeft, CreditCard 
} from 'lucide-react';

export function Layout() {
  const [expanded, setExpanded] = useState(window.innerWidth > 1024);
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('aura-theme');
    return saved ? saved === 'dark' : false; // Default to Light Mode
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [userName, setUserName] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchUserData() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setEmail(user.email || '');
        const { data } = await supabase.from('profiles').select('company_name').eq('id', user.id).single();
        if (data?.company_name) setUserName(data.company_name);
      }
    }
    fetchUserData();

    // Listen for profile updates
    const channel = supabase.channel('profile_updates')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'profiles' }, (payload) => {
        if (payload.new.company_name) setUserName(payload.new.company_name);
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  useEffect(() => {
    document.body.className = isDark ? 'dark-theme' : '';
    localStorage.setItem('aura-theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 1024) setExpanded(false);
      else setExpanded(true);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
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
      { icon: CreditCard, label: 'Planos & Assinatura', path: '/assinatura' },
    ]}
  ];

  const pageTitle = navItems
    .flatMap(g => g.items)
    .find(i => location.pathname.startsWith(i.path) && i.path !== '/orcamentos' || location.pathname === i.path)?.label || 
    (location.pathname === '/orcamentos/novo' ? 'Novo Orçamento' : 'OrçaPro');

  const navLinkStyle = (isActive: boolean) => ({
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    padding: '12px 16px',
    marginBottom: '4px',
    borderRadius: '12px',
    color: isActive ? '#fff' : 'var(--t2)',
    background: isActive ? 'linear-gradient(135deg, var(--accent) 0%, #a855f7 100%)' : 'transparent',
    border: isActive ? 'none' : '1px solid transparent',
    textDecoration: 'none',
    fontSize: 14,
    fontWeight: 600,
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    boxShadow: isActive ? '0 8px 16px var(--accent-glow)' : 'none',
    whiteSpace: 'nowrap',
    overflow: 'hidden'
  });

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', background: 'var(--bg)', color: 'var(--t1)', overflow: 'hidden' }}>
      {/* Overlay Mobile */}
      {mobileMenuOpen && (
        <div 
          onClick={() => setMobileMenuOpen(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', zIndex: 140 }}
        />
      )}

      {/* Sidebar Flutuante */}
      <aside className={`glass ${mobileMenuOpen ? 'mobile-sidebar-open' : ''}`} style={{
        margin: window.innerWidth <= 1024 ? '0' : '16px',
        borderRadius: window.innerWidth <= 1024 ? '0 24px 24px 0' : '24px',
        width: window.innerWidth <= 1024 ? 280 : (expanded ? 240 : 80),
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        height: window.innerWidth <= 1024 ? '100vh' : 'calc(100vh - 32px)',
        boxShadow: 'var(--card-shadow)',
        zIndex: 150,
        overflow: 'visible' // CRITICAL: Allow toggle button to hang out
      }}>
        {/* Toggle Expansão Desktop (A "Bolinha") */}
        <button 
          onClick={() => setExpanded(!expanded)}
          className="desktop-only shadow-lg glow-hover"
          style={{
            position: 'absolute',
            right: -16,
            top: 48,
            width: 32,
            height: 32,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            padding: 0,
            color: 'var(--t1)',
            zIndex: 200,
            border: '1px solid var(--surface-border)',
            background: 'var(--surface)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            transition: 'all 0.3s',
            outline: 'none'
          }}
        >
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block' }}>
            {expanded ? (
              <path d="M18 10L12 16L18 22" /> // Center is 15 (optical center for pointing left)
            ) : (
              <path d="M14 10L20 16L14 22" /> // Center is 17 (optical center for pointing right)
            )}
          </svg>
        </button>

        {/* Sidebar Header - Branding Only (Desktop) */}
        <div 
          className="desktop-only" 
          style={{ padding: '32px 24px', display: 'flex', alignItems: 'center', gap: 16, flexShrink: 0 }}
        >
          <div style={{ 
            width: 36, 
            height: 36, 
            borderRadius: '12px', 
            background: 'linear-gradient(135deg, var(--accent) 0%, #a855f7 100%)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            boxShadow: '0 0 15px var(--accent-glow)',
            flexShrink: 0
          }}>
            <FileText size={20} color="#fff" />
          </div>
          {expanded && (
            <span className="font-heading" style={{ 
              fontWeight: 800, 
              fontSize: 18, 
              color: 'var(--t1)',
              whiteSpace: 'nowrap', 
              flexShrink: 0
            }}>
              OrçaPro
            </span>
          )}
        </div>

        {/* Header Mobile Only */}
        <div 
          className="mobile-only"
          style={{ padding: '32px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexShrink: 0 }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'nowrap' }}>
            <div style={{ width: 36, height: 36, borderRadius: '12px', background: 'linear-gradient(135deg, var(--accent) 0%, #a855f7 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <FileText size={20} color="#fff" />
            </div>
            <span className="font-heading" style={{ fontWeight: 800, fontSize: 18, color: 'var(--t1)', whiteSpace: 'nowrap' }}>OrçaPro</span>
          </div>
          <button 
            onClick={() => setMobileMenuOpen(false)}
            className="glass"
            style={{ width: 36, height: 36, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--surface-border)', color: 'var(--t2)', cursor: 'pointer' }}
          >
            <ChevronLeft size={20} strokeWidth={3} />
          </button>
        </div>

        <nav style={{ flex: 1, padding: '12px', overflowY: 'auto', overflowX: 'hidden' }}>
          {navItems.map((group, idx) => (
            <div key={idx} style={{ marginBottom: 32 }}>
              {(expanded || mobileMenuOpen) && (
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
                    onClick={() => setMobileMenuOpen(false)}
                    style={navLinkStyle(isActive)}
                    className={isActive ? 'holographic-active' : 'glow-hover'}
                  >
                    <item.icon size={20} style={{ 
                      flexShrink: 0,
                      color: isActive ? '#fff' : 'inherit'
                    }} />
                    {(expanded || mobileMenuOpen) && <span style={{ opacity: isActive ? 1 : 0.8 }}>{item.label}</span>}
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
              justifyContent: (expanded || mobileMenuOpen) ? 'flex-start' : 'center',
              gap: 16,
              width: '100%',
              background: 'rgba(239, 68, 68, 0.05)',
              border: '1px solid transparent',
              borderRadius: '12px',
              color: 'var(--red)',
              cursor: 'pointer',
              padding: (expanded || mobileMenuOpen) ? '12px 16px' : '12px 0',
              fontSize: 14,
              fontWeight: 600
            }}
          >
            <LogOut size={20} style={{ flexShrink: 0 }} />
            {(expanded || mobileMenuOpen) && <span>Sair</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, position: 'relative' }}>
        <header style={{
          height: 80,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: window.innerWidth <= 768 ? '0 20px' : '0 32px',
          flexShrink: 0,
          zIndex: 100,
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          background: 'rgba(var(--bg-rgb), 0.7)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderBottom: '1px solid var(--surface-border)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <button 
              onClick={() => setMobileMenuOpen(true)}
              className="mobile-only glass glow-hover"
              style={{ padding: 10, borderRadius: 12, display: 'flex', border: '1px solid var(--surface-border)', cursor: 'pointer', background: 'var(--surface)' }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <div style={{ width: 22, height: 2, background: 'var(--t1)', borderRadius: 2 }} />
                <div style={{ width: 16, height: 2, background: 'var(--t1)', borderRadius: 2 }} />
                <div style={{ width: 20, height: 2, background: 'var(--t1)', borderRadius: 2 }} />
              </div>
            </button>
            <div className="desktop-only">
              <h1 className="animate-fade-in" style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-1.5px', color: 'var(--t1)' }}>{pageTitle}</h1>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button
              onClick={() => setIsDark(!isDark)}
              className="glass glow-hover"
              style={{
                width: 40,
                height: 40,
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: 'var(--t2)',
                background: 'var(--surface)'
              }}
            >
              {isDark ? 
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="18.36" x2="5.64" y2="16.92"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg> 
                : 
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
              }
            </button>
            
            <div className="glass" style={{ padding: '4px 12px 4px 4px', borderRadius: '30px', display: 'flex', alignItems: 'center', gap: 10, border: '1px solid var(--surface-border)' }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent) 0%, #a855f7 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: '#fff' }}>
                {(userName || email).charAt(0).toUpperCase()}
              </div>
              <span className="desktop-only" style={{ fontSize: 13, fontWeight: 600, color: 'var(--t2)' }}>
                {userName || email.split('@')[0]}
              </span>
            </div>
          </div>
        </header>

        <div key={location.pathname} className="animate-fade-in" style={{ 
          flex: 1, 
          overflowY: 'auto', 
          overflowX: 'hidden', 
          padding: window.innerWidth <= 768 ? '96px 16px 16px' : '112px 32px 32px' 
        }}>
          <Outlet />
        </div>
      </main>
      
      <style>{`
        @media (max-width: 1024px) {
          .desktop-only { display: none !important; }
          .mobile-only { display: flex !important; }
        }
      `}</style>
    </div>
  );
}
