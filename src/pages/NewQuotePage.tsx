import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { Trash2, Plus } from 'lucide-react';
import { pdf } from '@react-pdf/renderer';
import { QuoteDocument } from '../components/QuoteDocument';
import { maskCurrency, parseCurrency } from '../lib/masks';

export function NewQuotePage() {
  const [clients, setClients] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const navigate = useNavigate();

  const [title, setTitle] = useState('Orçamento Padrão');
  const [clientId, setClientId] = useState('');
  const [notes, setNotes] = useState('');
  const [validUntil, setValidUntil] = useState('');
  const [status, setStatus] = useState('rascunho');
  const [discount, setDiscount] = useState(0);
  const [items, setItems] = useState<any[]>([
    { service_id: '', description: '', quantity: 1, unit_price: 0, subtotal: 0 }
  ]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    supabase.from('clients').select('*').order('name').then(({ data }) => setClients(data || []));
    supabase.from('services').select('*').order('name').then(({ data }) => setServices(data || []));
  }, []);

  const handleItemChange = (index: number, field: string, value: any) => {
    const newItems = [...items];
    const item = newItems[index];
    
    if (field === 'service_id' && value) {
      const s = services.find(srv => srv.id === value);
      if (s) {
        item.description = s.name;
        item.unit_price = s.unit_price;
      }
    }
    
    item[field] = value;
    item.subtotal = Number(item.quantity || 0) * Number(item.unit_price || 0);
    setItems(newItems);
  };

  const handleMainServiceChange = (id: string) => {
    if (!id) return;
    const s = services.find(srv => srv.id === id);
    if (!s) return;
    const newItems = [...items];
    if (newItems.length > 0) {
      newItems[0] = { ...newItems[0], service_id: s.id, description: s.name, unit_price: s.unit_price, subtotal: s.unit_price * (newItems[0].quantity || 1) };
    } else {
      newItems.push({ service_id: s.id, description: s.name, quantity: 1, unit_price: s.unit_price, subtotal: s.unit_price });
    }
    setItems(newItems);
  };

  const addItem = () => {
    setItems([...items, { service_id: '', description: '', quantity: 1, unit_price: 0, subtotal: 0 }]);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0);
  const total = subtotal - Number(discount);

  const saveQuote = async () => {
    if (!title) return alert('O título é obrigatório.');
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const quoteData = {
      user_id: user.id,
      client_id: clientId || null,
      title,
      status,
      notes,
      valid_until: validUntil || null,
      items,
      subtotal,
      discount,
      total
    };

    const { data, error } = await supabase.from('quotes').insert([quoteData]).select().single();
    setSaving(false);
    
    if (error) alert('Erro ao salvar.');
    else {
      navigate('/orcamentos');
    }
    return data;
  };

  const generatePDF = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    const { data: profile } = await supabase.from('profiles').select('*').eq('id', user?.id).single();
    const client = clients.find(c => c.id === clientId);
    
    const quoteData = { title, status, notes, valid_until: validUntil, items, subtotal, discount, total, created_at: new Date().toISOString() };
    
    const blob = await pdf(<QuoteDocument quote={quoteData} profile={profile} client={client} />).toBlob();
    const url = URL.createObjectURL(blob);
    window.open(url);
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', gap: 32, alignItems: 'flex-start' }}>
      <div style={{ flex: '1', display: 'flex', flexDirection: 'column', gap: 32, minWidth: 0 }}>
        {/* Informações Básicas */}
        <div className="glass" style={{ padding: '32px', borderRadius: '28px', border: '1px solid var(--surface-border)' }}>
          <h3 className="font-heading" style={{ fontSize: 18, fontWeight: 700, marginBottom: 24, color: '#fff' }}>📋 Informações Estratégicas</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }}>
            <div>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 700, marginBottom: 8, color: 'var(--t3)', textTransform: 'uppercase', letterSpacing: '1px' }}>Título do Projeto</label>
              <input value={title} onChange={e => setTitle(e.target.value)} required style={{ width: '100%', padding: '12px 16px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--surface-border)', borderRadius: '12px', fontSize: 14, color: '#fff', fontFamily: "'Inter', sans-serif", outline: 'none' }} onFocus={e => e.target.style.borderColor = 'var(--accent)'} onBlur={e => e.target.style.borderColor = 'var(--surface-border)'} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 700, marginBottom: 8, color: 'var(--t3)', textTransform: 'uppercase', letterSpacing: '1px' }}>Cliente Alvo</label>
              <select value={clientId} onChange={e => setClientId(e.target.value)} style={{ width: '100%', padding: '12px 16px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--surface-border)', borderRadius: '12px', fontSize: 14, color: '#fff', fontFamily: "'Inter', sans-serif", outline: 'none' }}>
                <option value="">Selecione um cliente...</option>
                {clients.map(c => <option key={c.id} value={c.id} style={{ background: '#0f172a' }}>{c.name}</option>)}
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
             <div>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 700, marginBottom: 8, color: 'var(--t3)', textTransform: 'uppercase', letterSpacing: '1px' }}>Data de Validade</label>
              <input type="date" value={validUntil} onChange={e => setValidUntil(e.target.value)} style={{ width: '100%', padding: '12px 16px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--surface-border)', borderRadius: '12px', fontSize: 14, color: '#fff', fontFamily: "'Inter', sans-serif", outline: 'none' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 700, marginBottom: 8, color: 'var(--t3)', textTransform: 'uppercase', letterSpacing: '1px' }}>Serviço Automático</label>
              <select onChange={e => handleMainServiceChange(e.target.value)} style={{ width: '100%', padding: '12px 16px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--accent-glow)', borderRadius: '12px', fontSize: 14, color: 'var(--accent)', fontWeight: 600, fontFamily: "'Inter', sans-serif", outline: 'none' }}>
                <option value="">(Preencher Manualmente)</option>
                {services.map(s => <option key={s.id} value={s.id} style={{ background: '#0f172a' }}>{s.name}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Itens do Orçamento */}
        <div className="glass" style={{ padding: '32px', borderRadius: '28px', border: '1px solid var(--surface-border)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <h3 className="font-heading" style={{ fontSize: 18, fontWeight: 700, color: '#fff' }}>🛠️ Escopo e Itens</h3>
            <button onClick={addItem} className="glow-hover" style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', borderRadius: '10px', background: 'rgba(99, 102, 241, 0.1)', border: '1px solid var(--accent)', color: 'var(--accent)', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
              <Plus size={14} strokeWidth={3} /> Adicionar Item
            </button>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {items.map((item, index) => (
              <div key={index} className="animate-fade-in" style={{ display: 'flex', gap: 16, alignItems: 'flex-start', padding: '16px', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ flex: 1 }}>
                  <select value={item.service_id} onChange={e => handleItemChange(index, 'service_id', e.target.value)} style={{ width: '100%', padding: '10px 12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--surface-border)', borderRadius: '8px', fontSize: 13, color: '#fff', outline: 'none', marginBottom: 8 }}>
                    <option value="">(Serviço Customizado)</option>
                    {services.map(s => <option key={s.id} value={s.id} style={{ background: '#0f172a' }}>{s.name}</option>)}
                  </select>
                  <input placeholder="Descrição detalhada do item..." value={item.description} onChange={e => handleItemChange(index, 'description', e.target.value)} style={{ width: '100%', padding: '10px 12px', background: 'transparent', border: '1px solid transparent', borderBottomColor: 'var(--surface-border)', fontSize: 13, color: 'var(--t2)', outline: 'none' }} />
                </div>
                <div style={{ width: 70 }}>
                  <label style={{ display: 'block', fontSize: 10, fontWeight: 700, marginBottom: 4, color: 'var(--t3)' }}>QTD</label>
                  <input type="number" min="1" value={item.quantity} onChange={e => handleItemChange(index, 'quantity', e.target.value)} style={{ width: '100%', padding: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--surface-border)', borderRadius: '8px', fontSize: 13, color: '#fff', textAlign: 'center' }} />
                </div>
                <div style={{ width: 130 }}>
                  <label style={{ display: 'block', fontSize: 10, fontWeight: 700, marginBottom: 4, color: 'var(--t3)' }}>PREÇO UNIT.</label>
                  <input type="text" value={maskCurrency(item.unit_price)} onChange={e => handleItemChange(index, 'unit_price', parseCurrency(e.target.value))} style={{ width: '100%', padding: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--surface-border)', borderRadius: '8px', fontSize: 13, color: '#fff', textAlign: 'right' }} />
                </div>
                <div style={{ width: 130 }}>
                  <label style={{ display: 'block', fontSize: 10, fontWeight: 700, marginBottom: 4, color: 'var(--t3)' }}>SUBTOTAL</label>
                  <div style={{ width: '100%', padding: '10px', fontSize: 14, fontWeight: 700, color: 'var(--accent)', textAlign: 'right' }}>
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.subtotal)}
                  </div>
                </div>
                <button onClick={() => removeItem(index)} style={{ marginTop: 24, padding: 8, background: 'rgba(239, 68, 68, 0.1)', border: 'none', borderRadius: '8px', color: 'var(--red)', cursor: 'pointer' }}>
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Notas */}
        <div className="glass" style={{ padding: '32px', borderRadius: '28px', border: '1px solid var(--surface-border)' }}>
           <h3 className="font-heading" style={{ fontSize: 18, fontWeight: 700, marginBottom: 16, color: '#fff' }}>📝 Notas Adicionais</h3>
           <textarea placeholder="Termos de pagamento, prazos de entrega ou observações importantes..." value={notes} onChange={e => setNotes(e.target.value)} style={{ width: '100%', padding: '16px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--surface-border)', borderRadius: '16px', fontSize: 14, color: '#fff', fontFamily: "'Inter', sans-serif", outline: 'none', minHeight: 120, resize: 'vertical' }} onFocus={e => e.target.style.borderColor = 'var(--accent)'} onBlur={e => e.target.style.borderColor = 'var(--surface-border)'} />
        </div>
      </div>

      {/* Sidebar de Resumo */}
      <div style={{ width: 360, display: 'flex', flexDirection: 'column', gap: 24, position: 'sticky', top: 24 }}>
        <div className="glass" style={{ padding: '32px', borderRadius: '28px', border: '1px solid var(--surface-border)', boxShadow: 'var(--card-shadow)' }}>
          <h3 className="font-heading" style={{ fontSize: 18, fontWeight: 700, marginBottom: 24, color: '#fff' }}>Resumo Final</h3>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16, fontSize: 14, color: 'var(--t2)' }}>
            <span>Subtotal Bruto</span>
            <span style={{ color: '#fff', fontWeight: 600 }}>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(subtotal)}</span>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, fontSize: 14, color: 'var(--t2)' }}>
            <span>Desconto Aplicado</span>
            <input type="text" value={maskCurrency(discount)} onChange={e => setDiscount(parseCurrency(e.target.value))} style={{ width: 100, padding: '8px 12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--surface-border)', borderRadius: '10px', fontSize: 14, color: 'var(--green)', fontWeight: 700, textAlign: 'right', outline: 'none' }} />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 24, paddingTop: 24, borderTop: '1px solid var(--surface-border)', marginBottom: 32 }}>
            <span style={{ fontSize: 16, fontWeight: 600, color: '#fff' }}>Total Líquido</span>
            <span style={{ fontSize: 24, fontWeight: 800, color: 'var(--accent)', letterSpacing: '-1px' }}>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(total)}</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--t3)', textTransform: 'uppercase' }}>Status da Proposta</label>
            <select value={status} onChange={e => setStatus(e.target.value)} style={{ width: '100%', padding: '12px 16px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--surface-border)', borderRadius: '12px', fontSize: 14, color: '#fff', outline: 'none', marginBottom: 12 }}>
              <option value="rascunho" style={{ background: '#0f172a' }}>Rascunho</option>
              <option value="enviado" style={{ background: '#0f172a' }}>Enviado</option>
              <option value="aprovado" style={{ background: '#0f172a' }}>Aprovado</option>
              <option value="recusado" style={{ background: '#0f172a' }}>Recusado</option>
            </select>

            <button onClick={saveQuote} disabled={saving} className="glow-hover" style={{ width: '100%', padding: '16px', borderRadius: '14px', background: 'linear-gradient(135deg, var(--accent) 0%, #a855f7 100%)', border: 'none', color: '#fff', fontSize: 15, fontWeight: 700, cursor: saving ? 'not-allowed' : 'pointer', boxShadow: '0 4px 15px var(--accent-glow)' }}>
              {saving ? 'Publicando...' : 'Salvar e Publicar'}
            </button>
            
            <button onClick={generatePDF} className="glow-hover" style={{ width: '100%', padding: '14px', borderRadius: '14px', background: 'transparent', border: '1px solid var(--surface-border)', color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
              Visualizar Prévia PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
