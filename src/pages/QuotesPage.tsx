import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { StatusBadge } from '../components/StatusBadge';
import { useNavigate } from 'react-router-dom';
import { Eye, Trash2, Download, MessageCircle, Plus } from 'lucide-react';
import { pdf } from '@react-pdf/renderer';
import { QuoteDocument } from '../components/QuoteDocument';

export function QuotesPage() {
  const [quotes, setQuotes] = useState<any[]>([]);
  const navigate = useNavigate();

  const fetchQuotes = async () => {
    const { data } = await supabase.from('quotes').select('*, clients(name)').order('created_at', { ascending: false });
    setQuotes(data || []);
  };

  useEffect(() => { fetchQuotes(); }, []);

  const handleDelete = async (id: string) => {
    if (confirm('Excluir este orçamento?')) {
      await supabase.from('quotes').delete().eq('id', id);
      fetchQuotes();
    }
  };

  const downloadPDF = async (quote: any) => {
    const { data: { user } } = await supabase.auth.getUser();
    const { data: profile } = await supabase.from('profiles').select('*').eq('id', user?.id).single();
    const { data: client } = quote.client_id ? await supabase.from('clients').select('*').eq('id', quote.client_id).single() : { data: null };
    
    const blob = await pdf(<QuoteDocument quote={quote} profile={profile} client={client} />).toBlob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Orcamento_${quote.number}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const sendWhatsApp = async (quote: any) => {
    const { data: client } = quote.client_id ? await supabase.from('clients').select('*').eq('id', quote.client_id).single() : { data: null };
    const phone = client?.phone ? client.phone.replace(/\D/g, '') : '';
    const totalMsg = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(quote.total));
    const text = `Olá${client?.name ? ` ${client.name}` : ''}, aqui está o resumo do nosso orçamento #${quote.number}.\n\n*Título:* ${quote.title}\n*Total:* ${totalMsg}\n\nEstou enviando o PDF do orçamento em anexo para sua análise.`;
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: window.innerWidth <= 768 ? 'center' : 'flex-end', marginBottom: 32 }}>
        <button 
          onClick={() => navigate('/orcamentos/novo')}
          className="glow-hover"
          style={{ 
            padding: '14px 32px', 
            borderRadius: '16px', 
            background: 'linear-gradient(135deg, var(--accent) 0%, #a855f7 100%)', 
            border: 'none', 
            color: '#fff', 
            fontSize: 15, 
            fontWeight: 700, 
            cursor: 'pointer', 
            boxShadow: '0 10px 20px var(--accent-glow)',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            width: window.innerWidth <= 768 ? '100%' : 'auto'
          }}
        >
          <Plus size={20} strokeWidth={3} /> Criar Novo Orçamento
        </button>
      </div>

      <div className="glass" style={{ borderRadius: '24px', overflow: 'hidden', boxShadow: 'var(--card-shadow)' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: 900 }}>
            <thead>
              <tr style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid var(--surface-border)' }}>
                <th style={{ padding: '20px 24px', fontSize: 11, fontWeight: 700, color: 'var(--t3)', textTransform: 'uppercase', letterSpacing: '1.5px' }}>ID</th>
                <th style={{ padding: '20px 24px', fontSize: 11, fontWeight: 700, color: 'var(--t3)', textTransform: 'uppercase', letterSpacing: '1.5px' }}>Título / Cliente</th>
                <th style={{ padding: '20px 24px', fontSize: 11, fontWeight: 700, color: 'var(--t3)', textTransform: 'uppercase', letterSpacing: '1.5px' }}>Investimento</th>
                <th style={{ padding: '20px 24px', fontSize: 11, fontWeight: 700, color: 'var(--t3)', textTransform: 'uppercase', letterSpacing: '1.5px' }}>Status</th>
                <th style={{ padding: '20px 24px', fontSize: 11, fontWeight: 700, color: 'var(--t3)', textTransform: 'uppercase', letterSpacing: '1.5px' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {quotes.map(q => (
                <tr key={q.id} className="glow-hover" style={{ borderBottom: '1px solid var(--surface-border)', transition: '0.2s' }}>
                  <td style={{ padding: '24px', fontSize: 13, color: 'var(--t3)', fontWeight: 700 }}>#{q.number}</td>
                  <td style={{ padding: '24px' }}>
                    <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--t1)' }}>{q.title}</div>
                    <div style={{ fontSize: 13, color: 'var(--t2)', marginTop: 4, fontWeight: 500 }}>{q.clients?.name || 'Cliente Omissivo'}</div>
                  </td>
                  <td style={{ padding: '24px', fontSize: 15, fontWeight: 800, color: 'var(--t1)' }}>
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(q.total))}
                  </td>
                  <td style={{ padding: '24px' }}>
                    <StatusBadge status={q.status as any} />
                  </td>
                  <td style={{ padding: '24px' }}>
                    <div style={{ display: 'flex', gap: 10 }}>
                      <button onClick={() => navigate(`/orcamentos/${q.id}`)} className="glass glow-hover" style={{ borderRadius: '12px', color: 'var(--blue)', cursor: 'pointer', padding: '10px', border: '1px solid rgba(59, 130, 246, 0.1)' }} title="Visualizar">
                        <Eye size={18} />
                      </button>
                      <button onClick={() => downloadPDF(q)} className="glass glow-hover" style={{ borderRadius: '12px', color: 'var(--t1)', cursor: 'pointer', padding: '10px', border: '1px solid var(--surface-border)' }} title="Baixar PDF">
                        <Download size={18} />
                      </button>
                      <button onClick={() => sendWhatsApp(q)} className="glass glow-hover" style={{ borderRadius: '12px', color: 'var(--green)', cursor: 'pointer', padding: '10px', border: '1px solid rgba(16, 185, 129, 0.1)' }} title="WhatsApp">
                        <MessageCircle size={18} />
                      </button>
                      <button onClick={() => handleDelete(q.id)} className="glass glow-hover" style={{ borderRadius: '12px', color: 'var(--red)', cursor: 'pointer', padding: '10px', border: '1px solid rgba(239, 68, 68, 0.1)' }} title="Deletar">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {quotes.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ padding: '60px 24px', textAlign: 'center', fontSize: 14, color: 'var(--t3)' }}>
                    Ainda não há orçamentos. Vamos começar o primeiro?
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
