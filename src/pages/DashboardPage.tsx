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
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 24, marginBottom: 32 }}>
        {[
          { label: 'TOTAL DE ORÇAMENTOS', val: metrics.totalQuotes },
          { label: 'ORÇAMENTOS APROVADOS', val: metrics.approvedQuotes },
          { label: 'VALOR TOTAL APROVADO (R$)', val: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(metrics.totalValue) },
          { label: 'CLIENTES CADASTRADOS', val: metrics.totalClients },
        ].map((m, i) => (
          <div key={i} style={{ padding: 24, background: 'var(--s1)', border: '1px solid var(--ln)', borderRadius: 10 }}>
            <div style={{ fontSize: 10, fontFamily: 'monospace', textTransform: 'uppercase', color: 'var(--t3)', marginBottom: 8 }}>{m.label}</div>
            <div style={{ fontSize: 32, fontWeight: 700, color: 'var(--t1)' }}>{m.val}</div>
          </div>
        ))}
      </div>

      <div style={{ background: 'var(--s1)', border: '1px solid var(--ln)', borderRadius: 10, overflow: 'hidden' }}>
        <h3 style={{ padding: '20px 24px', fontSize: 15, fontWeight: 600, borderBottom: '1px solid var(--ln)' }}>Últimos Orçamentos</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'var(--s2)', borderBottom: '1px solid var(--ln2)' }}>
              <th style={{ padding: '12px 24px', fontSize: 13, fontWeight: 500, color: 'var(--t2)' }}>Nº</th>
              <th style={{ padding: '12px 24px', fontSize: 13, fontWeight: 500, color: 'var(--t2)' }}>Título</th>
              <th style={{ padding: '12px 24px', fontSize: 13, fontWeight: 500, color: 'var(--t2)' }}>Cliente</th>
              <th style={{ padding: '12px 24px', fontSize: 13, fontWeight: 500, color: 'var(--t2)' }}>Valor</th>
              <th style={{ padding: '12px 24px', fontSize: 13, fontWeight: 500, color: 'var(--t2)' }}>Status</th>
              <th style={{ padding: '12px 24px', fontSize: 13, fontWeight: 500, color: 'var(--t2)' }}>Data</th>
            </tr>
          </thead>
          <tbody>
            {recentQuotes.map(q => (
              <tr key={q.id} style={{ borderBottom: '1px solid var(--ln)' }}>
                <td style={{ padding: '16px 24px', fontSize: 13 }}>#{q.number}</td>
                <td style={{ padding: '16px 24px', fontSize: 13, fontWeight: 500 }}>{q.title}</td>
                <td style={{ padding: '16px 24px', fontSize: 13 }}>{q.clients?.name || '-'}</td>
                <td style={{ padding: '16px 24px', fontSize: 13 }}>
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(q.total))}
                </td>
                <td style={{ padding: '16px 24px' }}>
                  <StatusBadge status={q.status as any} />
                </td>
                <td style={{ padding: '16px 24px', fontSize: 13, color: 'var(--t2)' }}>
                  {new Date(q.created_at).toLocaleDateString('pt-BR')}
                </td>
              </tr>
            ))}
            {recentQuotes.length === 0 && (
              <tr>
                <td colSpan={6} style={{ padding: '32px 24px', textAlign: 'center', fontSize: 13, color: 'var(--t3)' }}>Nenhum orçamento encontrado</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
