import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Check, FileText } from 'lucide-react';

export function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) navigate('/dashboard');
    });
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate('/dashboard');
      } else {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        navigate('/dashboard'); // If auto confirm is enabled
      }
    } catch (err: any) {
      setError(err.message || 'Ocorreu um erro.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', width: '100vw' }}>
      <div style={{ flex: 1, background: 'var(--s1)', borderRight: '1px solid var(--ln)', padding: 60, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div style={{ maxWidth: 400 }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: 'var(--t1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
            <FileText color="#fff" size={20} />
          </div>
          <h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: 24, lineHeight: 1.2 }}>Crie orçamentos profissionais em segundos</h1>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ background: 'var(--gbd)', borderRadius: '50%', padding: 4, color: 'var(--green)' }}>
                <Check size={16} />
              </div>
              <span style={{ fontSize: 15, color: 'var(--t2)' }}>Gestão de clientes e serviços</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ background: 'var(--gbd)', borderRadius: '50%', padding: 4, color: 'var(--green)' }}>
                <Check size={16} />
              </div>
              <span style={{ fontSize: 15, color: 'var(--t2)' }}>Geração de PDF instantânea</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ background: 'var(--gbd)', borderRadius: '50%', padding: 4, color: 'var(--green)' }}>
                <Check size={16} />
              </div>
              <span style={{ fontSize: 15, color: 'var(--t2)' }}>Controle de status completo</span>
            </div>
          </div>
        </div>
      </div>

      <div style={{ flex: 1, background: 'var(--bg)', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: 40 }}>
        <div style={{ width: '100%', maxWidth: 360, background: 'var(--s1)', padding: 32, borderRadius: 12, border: '1px solid var(--ln)', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
          <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 24 }}>{isLogin ? 'Acesse sua conta' : 'Crie sua conta'}</h2>
          
          {error && <div style={{ background: 'var(--rbg)', color: 'var(--red)', padding: '10px 14px', borderRadius: 8, fontSize: 13, marginBottom: 16, border: '1px solid var(--rbd)' }}>{error}</div>}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 6, color: 'var(--t2)' }}>Email</label>
              <input 
                type="email" 
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                style={{ width:'100%', padding:'10px 14px', background:'var(--s2)', border:'1px solid var(--ln2)', borderRadius:8, fontSize:13, color:'var(--t1)', fontFamily:"'Inter',sans-serif", outline:'none' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 6, color: 'var(--t2)' }}>Senha</label>
              <input 
                type="password" 
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                style={{ width:'100%', padding:'10px 14px', background:'var(--s2)', border:'1px solid var(--ln2)', borderRadius:8, fontSize:13, color:'var(--t1)', fontFamily:"'Inter',sans-serif", outline:'none' }}
              />
            </div>
            <button 
              type="submit" 
              disabled={loading}
              style={{ padding:'10px 22px', borderRadius:8, background:'var(--t1)', border:'none', color:'var(--s1)', fontSize:13, fontWeight:600, cursor: loading ? 'not-allowed' : 'pointer', fontFamily:"'Inter',sans-serif", marginTop: 8 }}
            >
              {loading ? 'Aguarde...' : (isLogin ? 'Entrar' : 'Criar conta')}
            </button>
          </form>

          <div style={{ marginTop: 24, textAlign: 'center' }}>
            <button 
              onClick={() => { setIsLogin(!isLogin); setError(''); }}
              style={{ background: 'transparent', border: 'none', color: 'var(--blue)', fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily:"'Inter',sans-serif" }}
            >
              {isLogin ? 'Ainda não tem conta? Criar conta' : 'Já tem conta? Fazer login'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
