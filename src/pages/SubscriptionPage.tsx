import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Check, Star, Shield, Zap, CreditCard, MessageSquare } from 'lucide-react';

export function SubscriptionPage() {
  const [session, setSession] = useState<any>(null);
  const [daysRemaining, setDaysRemaining] = useState<number>(0);
  const [isExpired, setIsExpired] = useState(false);
  const adminEmail = 'marcosgabriel20061216@gmail.com';

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        const createdAt = new Date(session.user.created_at).getTime();
        const now = new Date().getTime();
        const fourteenDaysInMs = 14 * 24 * 60 * 60 * 1000;
        const remaining = Math.max(0, Math.ceil((fourteenDaysInMs - (now - createdAt)) / (1000 * 60 * 60 * 24)));
        setDaysRemaining(remaining);
        setIsExpired(now - createdAt > fourteenDaysInMs && session.user.email !== adminEmail);
      }
    });
  }, []);

  const isAdmin = session?.user?.email === adminEmail;

  return (
    <div className="animate-fade-in" style={{ maxWidth: 1000, margin: '0 auto', paddingBottom: 40 }}>
      <header style={{ marginBottom: 48, textAlign: 'center' }}>
        <h2 className="font-heading" style={{ fontSize: 42, fontWeight: 900, marginBottom: 16 }}>Sua Assinatura</h2>
        <p style={{ fontSize: 18, color: 'var(--t3)', fontWeight: 500 }}>
          {isAdmin 
            ? 'Você possui acesso vitalício e ilimitado como Administrador. 👑' 
            : `Você está no período de teste gratuito. ${isExpired ? 'Seu prazo expirou.' : `Restam ${daysRemaining} dias.`}`}
        </p>
      </header>

      {isExpired && !isAdmin && (
        <div className="glass" style={{ background: 'rgba(239, 68, 68, 0.05)', border: '1px solid var(--red)', padding: '24px', borderRadius: '24px', marginBottom: 48, textAlign: 'center' }}>
          <p style={{ color: 'var(--red)', fontWeight: 700, fontSize: 18 }}>🚨 Seu período de teste de 14 dias terminou.</p>
          <p style={{ color: 'var(--t2)', marginTop: 8 }}>Para continuar emitindo orçamentos profissionais, escolha um plano abaixo.</p>
        </div>
      )}

      <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap', justifyContent: 'center' }}>
        {/* Plano Básico */}
        <div className="glass glow-hover" style={{ flex: 1, minWidth: 320, maxWidth: 440, padding: 48, borderRadius: '32px', position: 'relative', opacity: isAdmin ? 0.7 : 1 }}>
          <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--t3)', letterSpacing: '2px', marginBottom: 20 }}>PLANO ESSENCIAL</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 32 }}>
            <span style={{ fontSize: 48, fontWeight: 900 }}>R$ 47</span>
            <span style={{ fontSize: 16, color: 'var(--t3)', fontWeight: 600 }}>/mês</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 48 }}>
            {['Até 20 orçamentos/mês', 'Clientes ilimitados', 'Exportação em PDF', 'Suporte por e-mail'].map(f => (
              <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 14, fontWeight: 600 }}>
                <Check size={18} color="var(--green)" strokeWidth={3} /> {f}
              </div>
            ))}
          </div>
          <button 
            disabled={isAdmin}
            className="glass"
            style={{ width: '100%', padding: '18px', borderRadius: '16px', fontWeight: 800, color: 'var(--t1)', border: '1px solid var(--surface-border)', cursor: isAdmin ? 'not-allowed' : 'pointer' }}
          >
            {isAdmin ? 'JÁ ATIVO' : 'ASSINAR AGORA'}
          </button>
        </div>

        {/* Plano Pro */}
        <div className="glass holographic-active" style={{ flex: 1, minWidth: 320, maxWidth: 440, padding: 48, borderRadius: '32px', border: '2px solid var(--accent)', boxShadow: '0 30px 60px var(--accent-glow)', position: 'relative', opacity: isAdmin ? 0.7 : 1 }}>
          <div style={{ position: 'absolute', top: 20, right: 30, background: 'var(--accent)', color: '#fff', fontSize: 10, fontWeight: 900, padding: '4px 12px', borderRadius: '30px', letterSpacing: '1px' }}>RECOMENDADO</div>
          <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--accent)', letterSpacing: '2px', marginBottom: 20 }}>PLANO PRO</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 32 }}>
            <span style={{ fontSize: 48, fontWeight: 900 }}>R$ 97</span>
            <span style={{ fontSize: 16, color: 'var(--t3)', fontWeight: 600 }}>/mês</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 48 }}>
            {['Orçamentos ilimitados', 'Clientes ilimitados', 'Dashboard analítico', 'Customização de marca (em breve)', 'Suporte prioritário 24/7'].map(f => (
              <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 14, fontWeight: 600 }}>
                <Check size={18} color="var(--accent)" strokeWidth={3} /> {f}
              </div>
            ))}
          </div>
          <button 
            disabled={isAdmin}
            style={{ 
              width: '100%', padding: '18px', borderRadius: '16px', fontWeight: 800, color: '#fff', 
              background: 'linear-gradient(135deg, var(--accent) 0%, #a855f7 100%)', border: 'none', 
              cursor: isAdmin ? 'not-allowed' : 'pointer', boxShadow: '0 10px 25px var(--accent-glow)' 
            }}
          >
            {isAdmin ? 'JÁ ATIVO' : 'UPGRADE PARA PRO'}
          </button>
        </div>
      </div>

      {!isAdmin && (
        <div style={{ marginTop: 64, textAlign: 'center' }}>
          <p style={{ color: 'var(--t3)', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            <Shield size={18} /> Pagamento 100% seguro via Stripe/BK Corp
          </p>
          <div style={{ marginTop: 24, display: 'flex', justifyContent: 'center', gap: 40 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--t3)' }}><CreditCard size={16} /> Cartão de Crédito</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--t3)' }}><Zap size={16} /> Liberação Instantânea</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--t3)' }}><MessageSquare size={16} /> Suporte Dedicado</div>
          </div>
        </div>
      )}
    </div>
  );
}
