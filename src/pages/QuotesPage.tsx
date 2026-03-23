import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { StatusBadge } from '../components/StatusBadge';
import { useNavigate } from 'react-router-dom';
import { Eye, Trash2, Download, MessageCircle } from 'lucide-react';
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
    <div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 24 }}>
        <button 
          onClick={() => navigate('/orcamentos/novo')}
          style={{ padding: '10px 22px', borderRadius: 8, background: 'var(--t1)', border: 'none', color: 'var(--s1)', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: "'Inter',sans-serif" }}
        >
          + Novo Orçamento
        </button>
      </div>

      <div style={{ background: 'var(--s1)', border: '1px solid var(--ln)', borderRadius: 10, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'var(--s2)', borderBottom: '1px solid var(--ln2)' }}>
              <th style={{ padding: '12px 24px', fontSize: 13, fontWeight: 500, color: 'var(--t2)' }}>Nº</th>
              <th style={{ padding: '12px 24px', fontSize: 13, fontWeight: 500, color: 'var(--t2)' }}>Título</th>
              <th style={{ padding: '12px 24px', fontSize: 13, fontWeight: 500, color: 'var(--t2)' }}>Cliente</th>
              <th style={{ padding: '12px 24px', fontSize: 13, fontWeight: 500, color: 'var(--t2)' }}>Total</th>
              <th style={{ padding: '12px 24px', fontSize: 13, fontWeight: 500, color: 'var(--t2)' }}>Status</th>
              <th style={{ padding: '12px 24px', fontSize: 13, fontWeight: 500, color: 'var(--t2)' }}>Data</th>
              <th style={{ padding: '12px 24px', fontSize: 13, fontWeight: 500, color: 'var(--t2)' }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {quotes.map(q => (
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
                <td style={{ padding: '16px 24px' }}>
                  <button onClick={() => navigate(`/orcamentos/${q.id}`)} style={{ background: 'none', border: 'none', color: 'var(--blue)', cursor: 'pointer', padding: 4 }} title="Visualizar Detalhes">
                    <Eye size={16} />
                  </button>
                  <button onClick={() => downloadPDF(q)} style={{ background: 'none', border: 'none', color: 'var(--t1)', cursor: 'pointer', padding: 4, marginLeft: 8 }} title="Baixar PDF">
                    <Download size={16} />
                  </button>
                  <button onClick={() => sendWhatsApp(q)} style={{ background: 'none', border: 'none', color: '#16A34A', cursor: 'pointer', padding: 4, marginLeft: 8 }} title="Enviar WhatsApp">
                    <MessageCircle size={16} />
                  </button>
                  <button onClick={() => handleDelete(q.id)} style={{ background: 'none', border: 'none', color: 'var(--red)', cursor: 'pointer', padding: 4, marginLeft: 8 }} title="Excluir">
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
            {quotes.length === 0 && (
              <tr>
                <td colSpan={7} style={{ padding: '32px 24px', textAlign: 'center', fontSize: 13, color: 'var(--t3)' }}>Nenhum orçamento encontrado</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
