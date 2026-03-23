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
    <div className="animate-fade-in" style={{ maxWidth: 1000, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 40 }}>
        <div>
          <button onClick={() => navigate('/orcamentos')} style={{ background: 'transparent', border: 'none', color: 'var(--t3)', fontSize: 13, fontWeight: 700, cursor: 'pointer', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6, textTransform: 'uppercase', letterSpacing: '1px' }}>
            ← Voltar para lista
          </button>
          <h2 className="font-heading" style={{ fontSize: 32, fontWeight: 800, color: '#fff', letterSpacing: '-1px' }}>Orçamento <span style={{ color: 'var(--accent)' }}>#{quote.number}</span></h2>
        </div>
        <div style={{ display: 'flex', gap: 16 }}>
          <button onClick={downloadPDF} className="glow-hover" style={{ padding: '14px 28px', borderRadius: '14px', background: 'rgba(59, 130, 246, 0.1)', border: '1px solid var(--blue)', color: 'var(--blue)', fontSize: 14, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
            Gerar Documento PDF
          </button>
          <button onClick={sendWhatsApp} className="glow-hover" style={{ padding: '14px 28px', borderRadius: '14px', background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)', border: 'none', color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, boxShadow: '0 4px 15px rgba(22, 163, 74, 0.3)' }}>
            Enviar via WhatsApp
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 32 }}>
        <div className="glass" style={{ padding: '40px', borderRadius: '28px', border: '1px solid var(--surface-border)' }}>
          <h3 className="font-heading" style={{ fontSize: 20, fontWeight: 700, color: '#fff', marginBottom: 32 }}>Detalhamento da Proposta</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40 }}>
              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--t3)', textTransform: 'uppercase', marginBottom: 8 }}>Título do Projeto</label>
                <div style={{ fontSize: 18, color: '#fff', fontWeight: 600 }}>{quote.title}</div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--t3)', textTransform: 'uppercase', marginBottom: 8 }}>Cliente</label>
                <div style={{ fontSize: 18, color: '#fff', fontWeight: 600 }}>{client?.name || 'Sem cliente vinculado'}</div>
                <div style={{ fontSize: 13, color: 'var(--t2)', marginTop: 4 }}>{client?.company || 'Pessoa Física'}</div>
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--surface-border)', paddingTop: 24 }}>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--t3)', textTransform: 'uppercase', marginBottom: 16 }}>Escopo Técnico / Itens</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {quote.items?.map((item: any, i: number) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '16px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px' }}>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: '#fff' }}>{item.description}</div>
                      <div style={{ fontSize: 12, color: 'var(--t3)', marginTop: 2 }}>{item.quantity} un. x {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.unit_price)}</div>
                    </div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--accent)' }}>
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.subtotal)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {quote.notes && (
              <div style={{ borderTop: '1px solid var(--surface-border)', paddingTop: 24 }}>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--t3)', textTransform: 'uppercase', marginBottom: 8 }}>Observações</label>
                <div style={{ fontSize: 14, color: 'var(--t2)', lineHeight: 1.6 }}>{quote.notes}</div>
              </div>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
          <div className="glass" style={{ padding: '32px', borderRadius: '28px', border: '1px solid var(--surface-border)', background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(168, 85, 247, 0.1) 100%)' }}>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--t3)', textTransform: 'uppercase', marginBottom: 16 }}>Valor Total da Proposta</label>
            <div style={{ fontSize: 36, fontWeight: 900, color: 'var(--accent)', letterSpacing: '-1.5px', marginBottom: 8 }}>
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(quote.total))}
            </div>
            {quote.discount > 0 && (
              <div style={{ fontSize: 13, color: 'var(--green)', fontWeight: 600 }}>
                Desconto de {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(quote.discount))} aplicado
              </div>
            )}
          </div>

          <div className="glass" style={{ padding: '32px', borderRadius: '28px', border: '1px solid var(--surface-border)' }}>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--t3)', textTransform: 'uppercase', marginBottom: 16 }}>Status Atual</label>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', gap: 8, padding: '12px 20px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', border: '1px solid var(--surface-border)' }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: quote.status === 'aprovado' ? 'var(--green)' : quote.status === 'recusado' ? 'var(--red)' : 'var(--blue)' }} />
              {quote.status.toUpperCase()}
            </div>
            {quote.valid_until && (
              <div style={{ marginTop: 20, fontSize: 12, color: 'var(--t3)' }}>
                Válido até: <strong>{new Date(quote.valid_until).toLocaleDateString()}</strong>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
