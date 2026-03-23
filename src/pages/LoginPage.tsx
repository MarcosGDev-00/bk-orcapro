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
    <div className="animate-fade-in" style={{ display: 'flex', minHeight: '100vh', width: '100vw', background: 'var(--bg)', overflow: 'hidden' }}>
      {/* Lado Esquerdo - Hero / Branding */}
      <div style={{ 
        flex: 1.2, 
        position: 'relative', 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center', 
        padding: '0 80px',
        overflow: 'hidden'
      }}>
        {/* Background Image / Mesh */}
        <div style={{ 
          position: 'absolute', 
          inset: 0, 
          background: 'url(/login_premium_bg.png) center/cover no-repeat',
          zIndex: -1
        }} />
        <div style={{ 
          position: 'absolute', 
          inset: 0, 
          background: 'linear-gradient(to right, var(--bg) 0%, rgba(10,14,24,0.6) 100%)',
          zIndex: -1
        }} />

        <div style={{ maxWidth: 500, position: 'relative' }}>
          <div style={{ 
            width: 56, 
            height: 56, 
            borderRadius: '18px', 
            background: 'var(--accent)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            marginBottom: 40,
            boxShadow: '0 0 30px var(--accent-glow)',
            animation: 'pulse 3s infinite'
          }}>
            <FileText color="#fff" size={28} strokeWidth={2.5} />
          </div>
          
          <h1 className="font-heading" style={{ 
             fontSize: 48, 
             fontWeight: 800, 
             marginBottom: 24, 
             lineHeight: 1.1, 
             color: '#fff', 
             letterSpacing: '-2px' 
          }}>
            O futuro da sua <br/> <span style={{ color: 'var(--accent)' }}>Freelance Pro</span> começa aqui.
          </h1>
          
          <p style={{ fontSize: 18, color: 'var(--t2)', marginBottom: 48, lineHeight: 1.6 }}>
            Assuma o controle total do seu negócio com orçamentos de alto nível e uma gestão impecável.
          </p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {[
              'Orçamentos que encantam clientes à primeira vista',
              'Gestão inteligente de serviços e profissionais',
              'Fluxo de aprovação 100% automatizado'
            ].map((text, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ 
                  background: 'rgba(34, 197, 94, 0.15)', 
                  borderRadius: '10px', 
                  padding: 6, 
                  color: 'var(--green)',
                  border: '1px solid rgba(34, 197, 94, 0.2)'
                }}>
                  <Check size={14} strokeWidth={3} />
                </div>
                <span style={{ fontSize: 15, color: '#fff', fontWeight: 500 }}>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Lado Direito - Form de Login */}
      <div style={{ 
        flex: 0.8, 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center', 
        alignItems: 'center', 
        padding: '0 40px',
        background: 'rgba(255,255,255,0.01)'
      }}>
        <div className="glass shadow-2xl" style={{ 
          width: '100%', 
          maxWidth: 420, 
          padding: '48px', 
          borderRadius: '32px', 
          border: '1px solid var(--surface-border)',
          position: 'relative'
        }}>
          <div style={{ marginBottom: 40 }}>
            <h2 className="font-heading" style={{ fontSize: 28, fontWeight: 800, color: '#fff', marginBottom: 8, letterSpacing: '-0.5px' }}>
              {isLogin ? 'Bem-vindo de volta' : 'Comece sua jornada'}
            </h2>
            <p style={{ fontSize: 14, color: 'var(--t3)' }}>
              Insira suas credenciais para acessar o painel administrativo.
            </p>
          </div>
          
          {error && (
            <div className="animate-fade-in" style={{ 
              background: 'rgba(239, 68, 68, 0.1)', 
              color: 'var(--red)', 
              padding: '12px 16px', 
              borderRadius: '12px', 
              fontSize: 13, 
              marginBottom: 24, 
              border: '1px solid rgba(239, 68, 68, 0.2)',
              fontWeight: 600
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 700, marginBottom: 8, color: 'var(--t3)', textTransform: 'uppercase', letterSpacing: '1px' }}>Endereço de E-mail</label>
              <input 
                type="email" 
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="glow-hover"
                style={{ width:'100%', padding:'14px 18px', background:'rgba(255,255,255,0.03)', border:'1px solid var(--surface-border)', borderRadius:'14px', fontSize:14, color:'#fff', fontFamily:"'Inter',sans-serif", outline:'none' }}
              />
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--t3)', textTransform: 'uppercase', letterSpacing: '1px' }}>Senha de Acesso</label>
                {isLogin && <button type="button" style={{ fontSize: 11, background: 'none', border: 'none', color: 'var(--accent)', fontWeight: 700, cursor: 'pointer' }}>Esqueceu a senha?</button>}
              </div>
              <input 
                type="password" 
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className="glow-hover"
                style={{ width:'100%', padding:'14px 18px', background:'rgba(255,255,255,0.03)', border:'1px solid var(--surface-border)', borderRadius:'14px', fontSize:14, color:'#fff', fontFamily:"'Inter',sans-serif", outline:'none' }}
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="glow-hover"
              style={{ 
                padding:'16px', 
                borderRadius:'14px', 
                background:'linear-gradient(135deg, var(--accent) 0%, #a855f7 100%)', 
                border:'none', 
                color:'#fff', 
                fontSize:15, 
                fontWeight:700, 
                cursor: loading ? 'not-allowed' : 'pointer', 
                fontFamily:"'Inter',sans-serif", 
                marginTop: 12,
                boxShadow: '0 10px 25px var(--accent-glow)'
              }}
            >
              {loading ? 'Validando...' : (isLogin ? 'Entrar no Sistema' : 'Criar Conta Premium')}
            </button>
          </form>

          <p style={{ marginTop: 32, textAlign: 'center', fontSize: 14, color: 'var(--t3)' }}>
            {isLogin ? 'Ainda não possui acesso?' : 'Já possui uma conta?'}
            <button 
              onClick={() => { setIsLogin(!isLogin); setError(''); }}
              style={{ background: 'transparent', border: 'none', color: 'var(--accent)', fontWeight: 700, cursor: 'pointer', marginLeft: 6 }}
            >
              {isLogin ? 'Assine agora' : 'Faça login'}
            </button>
          </p>
        </div>
        
        <p style={{ position: 'absolute', bottom: 32, fontSize: 12, color: 'var(--t4)' }}>
          © 2024 BK Corp OrçaPro. Tecnologia de ponta para sua empresa.
        </p>
      </div>
    </div>
  );
}
