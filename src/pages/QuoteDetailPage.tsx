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
    <div className="animate-fade-in" style={{ maxWidth: 1100, margin: '0 auto', padding: window.innerWidth <= 768 ? '0 10px' : '0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 40, flexDirection: window.innerWidth <= 768 ? 'column' : 'row', gap: 24 }}>
        <div>
          <button onClick={() => navigate('/orcamentos')} style={{ background: 'transparent', border: 'none', color: 'var(--t3)', fontSize: 13, fontWeight: 700, cursor: 'pointer', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6, textTransform: 'uppercase', letterSpacing: '1px' }}>
            ← Voltar para lista
          </button>
          <h2 className="font-heading" style={{ fontSize: window.innerWidth <= 768 ? 28 : 36, fontWeight: 800, color: 'var(--t1)', letterSpacing: '-1px' }}>Orçamento <span style={{ color: 'var(--accent)' }}>#{quote.number}</span></h2>
        </div>
        <div style={{ display: 'flex', gap: 16, width: window.innerWidth <= 768 ? '100%' : 'auto' }}>
          <button onClick={downloadPDF} className="glow-hover" style={{ flex: 1, padding: '14px 24px', borderRadius: '14px', background: 'var(--t4)', border: '1px solid var(--surface-border)', color: 'var(--t1)', fontSize: 14, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center' }}>
            Gerar PDF
          </button>
          <button onClick={sendWhatsApp} className="glow-hover holographic-active" style={{ flex: 1, padding: '14px 24px', borderRadius: '14px', background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)', border: 'none', color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, boxShadow: '0 10px 20px rgba(22, 163, 74, 0.2)', justifyContent: 'center' }}>
            WhatsApp
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: window.innerWidth <= 1000 ? '1fr' : '1fr 340px', gap: 32 }}>
        <div className="glass" style={{ padding: window.innerWidth <= 768 ? '24px' : '40px', borderRadius: '28px', border: '1px solid var(--surface-border)' }}>
          <h3 className="font-heading" style={{ fontSize: 20, fontWeight: 700, color: 'var(--t1)', marginBottom: 32 }}>Detalhamento da Proposta</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div style={{ display: 'grid', gridTemplateColumns: window.innerWidth <= 600 ? '1fr' : '1fr 1fr', gap: 32 }}>
              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--t3)', textTransform: 'uppercase', marginBottom: 10, letterSpacing: '1px' }}>Título do Projeto</label>
                <div style={{ fontSize: 18, color: 'var(--t1)', fontWeight: 700 }}>{quote.title}</div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--t3)', textTransform: 'uppercase', marginBottom: 10, letterSpacing: '1px' }}>Cliente</label>
                <div style={{ fontSize: 18, color: 'var(--t1)', fontWeight: 700 }}>{client?.name || 'Sem cliente vinculado'}</div>
                {client?.company && <div style={{ fontSize: 13, color: 'var(--t2)', marginTop: 4, fontWeight: 500 }}>{client.company}</div>}
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--surface-border)', paddingTop: 24 }}>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--t3)', textTransform: 'uppercase', marginBottom: 16, letterSpacing: '1px' }}>Escopo Técnico / Itens</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {quote.items?.map((item: any, i: number) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '16px 20px', background: 'var(--t4)', borderRadius: '16px', border: '1px solid var(--surface-border)' }}>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--t1)' }}>{item.description}</div>
                      <div style={{ fontSize: 12, color: 'var(--t3)', marginTop: 4, fontWeight: 500 }}>{item.quantity} un. x {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.unit_price)}</div>
                    </div>
                    <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--accent)' }}>
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.subtotal)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {quote.notes && (
              <div style={{ borderTop: '1px solid var(--surface-border)', paddingTop: 24 }}>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--t3)', textTransform: 'uppercase', marginBottom: 10, letterSpacing: '1px' }}>Observações</label>
                <div style={{ fontSize: 14, color: 'var(--t2)', lineHeight: 1.6, background: 'var(--t4)', padding: '16px', borderRadius: '12px', border: '1px solid var(--surface-border)' }}>{quote.notes}</div>
              </div>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
          <div className="glass holographic-active" style={{ padding: '32px', borderRadius: '28px', border: '1px solid var(--surface-border)', background: 'linear-gradient(135deg, var(--accent-glow) 0%, transparent 100%)' }}>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--t3)', textTransform: 'uppercase', marginBottom: 16, letterSpacing: '1px' }}>Investimento Total</label>
            <div style={{ fontSize: 36, fontWeight: 900, color: 'var(--accent)', letterSpacing: '-1.5px', marginBottom: 8 }}>
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(quote.total))}
            </div>
            {quote.discount > 0 && (
              <div style={{ fontSize: 13, color: 'var(--green)', fontWeight: 700 }}>
                Desconto de {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(quote.discount))} aplicado
              </div>
            )}
          </div>

          <div className="glass" style={{ padding: '32px', borderRadius: '28px', border: '1px solid var(--surface-border)' }}>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--t3)', textTransform: 'uppercase', marginBottom: 16, letterSpacing: '1px' }}>Status Vital</label>
            <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--t1)', display: 'flex', alignItems: 'center', gap: 10, padding: '14px 20px', background: 'var(--t4)', borderRadius: '14px', border: '1px solid var(--surface-border)' }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: quote.status === 'aprovado' ? 'var(--green)' : quote.status === 'recusado' ? 'var(--red)' : 'var(--blue)', boxShadow: `0 0 10px ${quote.status === 'aprovado' ? 'var(--green)' : quote.status === 'recusado' ? 'var(--red)' : 'var(--blue)'}` }} />
              {quote.status.toUpperCase()}
            </div>
            {quote.valid_until && (
              <div style={{ marginTop: 20, fontSize: 12, color: 'var(--t3)', fontWeight: 600 }}>
                Válido até: <span style={{ color: 'var(--t2)' }}>{new Date(quote.valid_until).toLocaleDateString()}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
