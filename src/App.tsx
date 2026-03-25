import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from './lib/supabase';
import { Layout } from './components/Layout';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { ClientsPage } from './pages/ClientsPage';
import { ServicesPage } from './pages/ServicesPage';
import { QuotesPage } from './pages/QuotesPage';
import { NewQuotePage } from './pages/NewQuotePage';
import { QuoteDetailPage } from './pages/QuoteDetailPage';
import { ProfilePage } from './pages/ProfilePage';
import { LandingPage } from './pages/LandingPage';
import { SubscriptionPage } from './pages/SubscriptionPage';
import { useLocation } from 'react-router-dom';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isPro, setIsPro] = useState(false);
  const location = useLocation();

  useEffect(() => {
    async function checkSession() {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      
      if (session) {
        // Fetch is_pro status from profiles
        const { data } = await supabase
          .from('profiles')
          .select('is_pro')
          .eq('id', session.user.id)
          .single();
        
        if (data?.is_pro) setIsPro(true);
      }
      setLoading(false);
    }
    
    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) return <div style={{ padding: 40, color: 'var(--t1)', background: 'var(--bg)', minHeight: '100vh' }}>Carregando...</div>;
  if (!session) return <Navigate to="/login" replace />;

  // Admin Check
  const isAdmin = session.user.email === 'marcosgabriel20061216@gmail.com';
  
  if (!isAdmin) {
    const createdAt = new Date(session.user.created_at).getTime();
    const now = new Date().getTime();
    const fourteenDaysInMs = 14 * 24 * 60 * 60 * 1000;
    
    // Block only if NOT Pro AND Trial Expired
    if (!isPro && (now - createdAt > fourteenDaysInMs)) {
      const allowedPaths = ['/assinatura', '/perfil'];
      const isAllowed = allowedPaths.some(path => location.pathname.startsWith(path));
      
      if (!isAllowed) {
        return <Navigate to="/assinatura" replace />;
      }
    }
  }

  return <>{children}</>;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        
        <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/clientes" element={<ClientsPage />} />
          <Route path="/servicos" element={<ServicesPage />} />
          <Route path="/orcamentos" element={<QuotesPage />} />
          <Route path="/orcamentos/novo" element={<NewQuotePage />} />
          <Route path="/orcamentos/:id" element={<QuoteDetailPage />} />
          <Route path="/perfil" element={<ProfilePage />} />
          <Route path="/assinatura" element={<SubscriptionPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
