import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { StatusBadge } from '../components/StatusBadge';

export function DashboardPage() {
  const [metrics, setMetrics] = useState({ totalQuotes: 0, approvedQuotes: 0, totalValue: 0, totalClients: 0 });
  const [recentQuotes, setRecentQuotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const [quotesRes, clientsRes, recentRes] = await Promise.all([
        supabase.from('quotes').select('status, total', { count: 'exact' }),
        supabase.from('clients').select('id', { count: 'exact' }),
        supabase.from('quotes').select(`
          id, number, title, total, status, created_at,
          clients(name)
        `).order('created_at', { ascending: false }).limit(5)
      ]);

      const quotes = quotesRes.data || [];
      const approved = quotes.filter(q => q.status === 'aprovado');
      const totalValue = approved.reduce((sum, q) => sum + Number(q.total || 0), 0);

      setMetrics({
        totalQuotes: quotesRes.count || 0,
        approvedQuotes: approved.length,
        totalValue,
        totalClients: clientsRes.count || 0
      });
      setRecentQuotes(recentRes.data || []);
      setLoading(false);
    }
    loadData();
  }, []);

  if (loading) return <div style={{ padding: 40 }}>Carregando...</div>;

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24, marginBottom: 40 }}>
        {[
          { label: 'Orcamentos Totais', val: metrics.totalQuotes, icon: '📄', color: 'var(--accent)' },
          { label: 'Aprovados', val: metrics.approvedQuotes, icon: '✅', color: 'var(--green)' },
          { label: 'Valor Faturado', val: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(metrics.totalValue), icon: '💰', color: '#f59e0b' },
          { label: 'Clientes Base', val: metrics.totalClients, icon: '👥', color: 'var(--blue)' },
        ].map((m, i) => (
          <div key={i} className="glass glow-hover holographic-active" style={{ 
            padding: '28px', 
            borderRadius: '24px', 
            position: 'relative',
            overflow: 'hidden',
            border: '1px solid var(--surface-border)'
          }}>
            <div style={{ 
              position: 'absolute', 
              top: '-10%', 
              right: '-10%', 
              fontSize: '100px', 
              opacity: 0.08,
              filter: 'grayscale(1)',
              pointerEvents: 'none'
            }}>{m.icon}</div>
            
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--t3)', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: 16 }}>{m.label}</div>
            <div style={{ fontSize: 32, fontWeight: 800, color: 'var(--t1)', letterSpacing: '-1px' }}>{m.val}</div>
            <div style={{ marginTop: 16, width: '48px', height: '6px', borderRadius: '3px', background: m.color, boxShadow: `0 0 20px ${m.color}88` }}></div>
          </div>
        ))}
      </div>

      <div className="glass" style={{ borderRadius: '24px', overflow: 'hidden', boxShadow: 'var(--card-shadow)' }}>
        <div style={{ padding: '24px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--surface-border)', background: 'rgba(255,255,255,0.01)' }}>
          <h3 className="font-heading" style={{ fontSize: 20, fontWeight: 700, color: 'var(--t1)' }}>Atividade Recente</h3>
          <span style={{ fontSize: 13, color: 'var(--accent)', fontWeight: 700, cursor: 'pointer' }}>Ver Todos →</span>
        </div>
        
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: 800 }}>
            <thead>
              <tr style={{ background: 'rgba(255,255,255,0.02)' }}>
                <th style={{ padding: '20px 32px', fontSize: 11, fontWeight: 700, color: 'var(--t3)', textTransform: 'uppercase', letterSpacing: '1px' }}>Orçamento</th>
                <th style={{ padding: '20px 32px', fontSize: 11, fontWeight: 700, color: 'var(--t3)', textTransform: 'uppercase', letterSpacing: '1px' }}>Cliente</th>
                <th style={{ padding: '20px 32px', fontSize: 11, fontWeight: 700, color: 'var(--t3)', textTransform: 'uppercase', letterSpacing: '1px' }}>Valor</th>
                <th style={{ padding: '20px 32px', fontSize: 11, fontWeight: 700, color: 'var(--t3)', textTransform: 'uppercase', letterSpacing: '1px' }}>Status</th>
                <th style={{ padding: '20px 32px', fontSize: 11, fontWeight: 700, color: 'var(--t3)', textTransform: 'uppercase', letterSpacing: '1px' }}>Data</th>
              </tr>
            </thead>
            <tbody>
              {recentQuotes.map(q => (
                <tr key={q.id} className="glow-hover" style={{ borderBottom: '1px solid var(--surface-border)', cursor: 'default' }}>
                  <td style={{ padding: '24px 32px' }}>
                    <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--t1)' }}>{q.title}</div>
                    <div style={{ fontSize: 12, color: 'var(--t3)', marginTop: 4 }}>#{q.number}</div>
                  </td>
                  <td style={{ padding: '24px 32px', fontSize: 14, color: 'var(--t2)', fontWeight: 500 }}>{q.clients?.name || '-'}</td>
                  <td style={{ padding: '24px 32px', fontSize: 15, fontWeight: 800, color: 'var(--t1)' }}>
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(q.total))}
                  </td>
                  <td style={{ padding: '24px 32px' }}>
                    <StatusBadge status={q.status as any} />
                  </td>
                  <td style={{ padding: '24px 32px', fontSize: 13, color: 'var(--t3)', fontWeight: 500 }}>
                    {new Date(q.created_at).toLocaleDateString('pt-BR')}
                  </td>
                </tr>
              ))}
              {recentQuotes.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ padding: '48px 32px', textAlign: 'center', fontSize: 14, color: 'var(--t3)' }}>
                    Prepare sua primeira proposta para ver os dados aqui.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
