import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { QuoteDocument } from '../components/QuoteDocument';
import { pdf } from '@react-pdf/renderer';

export function QuoteDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quote, setQuote] = useState<any>(null);
  const [client, setClient] = useState<any>(null);

  useEffect(() => {
    async function loadQuote() {
      const { data: q } = await supabase.from('quotes').select('*').eq('id', id).single();
      if (q) {
        setQuote(q);
        if (q.client_id) {
          const { data: c } = await supabase.from('clients').select('*').eq('id', q.client_id).single();
          setClient(c);
        }
      }
    }
    loadQuote();
  }, [id]);

  const downloadPDF = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    const { data: profile } = await supabase.from('profiles').select('*').eq('id', user?.id).single();
    
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

  const sendWhatsApp = () => {
    const phone = client?.phone ? client.phone.replace(/\D/g, '') : '';
    const totalMsg = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(quote.total));
    const text = `Olá${client?.name ? ` ${client.name}` : ''}, aqui está o resumo do nosso orçamento #${quote.number}.\n\n*Título:* ${quote.title}\n*Total:* ${totalMsg}\n\nSegue o PDF do orçamento para sua análise.`;
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  if (!quote) return <div style={{ padding: 40 }}>Carregando...</div>;

  return (
    <div style={{ maxWidth: 800, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2 style={{ fontSize: 24, fontWeight: 700 }}>Orçamento #{quote.number}</h2>
        <div style={{ display: 'flex', gap: 12 }}>
          <button onClick={() => navigate('/orcamentos')} style={{ padding: '10px 22px', borderRadius: 8, background: 'transparent', border: '1px solid var(--ln2)', color: 'var(--t2)', fontSize: 13, cursor: 'pointer', fontFamily: "'Inter',sans-serif" }}>
            Voltar
          </button>
          <button onClick={downloadPDF} style={{ padding: '10px 22px', borderRadius: 8, background: 'var(--blue)', border: 'none', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: "'Inter',sans-serif" }}>
            Baixar PDF
          </button>
          <button onClick={sendWhatsApp} style={{ padding: '10px 22px', borderRadius: 8, background: '#16A34A', border: 'none', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: "'Inter',sans-serif" }}>
            WhatsApp
          </button>
        </div>
      </div>
      <div style={{ background: 'var(--s1)', padding: 32, borderRadius: 10, border: '1px solid var(--ln)' }}>
        <p style={{ marginBottom: 12 }}><strong>Título:</strong> {quote.title}</p>
        <p style={{ marginBottom: 12 }}><strong>Status:</strong> {quote.status}</p>
        <p style={{ marginBottom: 12 }}><strong>Total:</strong> {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(quote.total))}</p>
        <p style={{ marginBottom: 12 }}><strong>Cliente:</strong> {client?.name || 'Sem cliente vinculado'}</p>
      </div>
    </div>
  );
}
