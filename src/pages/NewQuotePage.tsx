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
    <div className="animate-fade-in" style={{ display: 'flex', gap: 32, alignItems: 'flex-start', flexDirection: window.innerWidth <= 1100 ? 'column' : 'row' }}>
      <div style={{ flex: '1', display: 'flex', flexDirection: 'column', gap: 32, minWidth: 0, width: '100%' }}>
        {/* Informações Básicas */}
        <div className="glass" style={{ padding: window.innerWidth <= 768 ? '24px' : '32px', borderRadius: '28px', border: '1px solid var(--surface-border)' }}>
          <h3 className="font-heading" style={{ fontSize: 18, fontWeight: 700, marginBottom: 24, color: 'var(--t1)' }}>📋 Informações Estratégicas</h3>
          <div style={{ display: 'grid', gridTemplateColumns: window.innerWidth <= 600 ? '1fr' : '1fr 1fr', gap: 24, marginBottom: 24 }}>
            <div>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 700, marginBottom: 10, color: 'var(--t3)', textTransform: 'uppercase', letterSpacing: '1px' }}>Título do Projeto</label>
              <input value={title} onChange={e => setTitle(e.target.value)} required style={{ width: '100%', padding: '14px 18px', background: 'var(--t4)', border: '1px solid var(--surface-border)', borderRadius: '14px', fontSize: 14, color: 'var(--t1)', fontFamily: "'Inter', sans-serif", outline: 'none' }} className="glow-hover" />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 700, marginBottom: 10, color: 'var(--t3)', textTransform: 'uppercase', letterSpacing: '1px' }}>Cliente Alvo</label>
              <select value={clientId} onChange={e => setClientId(e.target.value)} style={{ width: '100%', padding: '14px 18px', background: 'var(--t4)', border: '1px solid var(--surface-border)', borderRadius: '14px', fontSize: 14, color: 'var(--t1)', fontFamily: "'Inter', sans-serif", outline: 'none' }} className="glow-hover">
                <option value="">Selecione um cliente...</option>
                {clients.map(c => <option key={c.id} value={c.id} style={{ background: 'var(--bg)', color: 'var(--t1)' }}>{c.name}</option>)}
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: window.innerWidth <= 600 ? '1fr' : '1fr 1fr', gap: 24 }}>
             <div>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 700, marginBottom: 10, color: 'var(--t3)', textTransform: 'uppercase', letterSpacing: '1px' }}>Data de Validade</label>
              <input type="date" value={validUntil} onChange={e => setValidUntil(e.target.value)} style={{ width: '100%', padding: '14px 18px', background: 'var(--t4)', border: '1px solid var(--surface-border)', borderRadius: '14px', fontSize: 14, color: 'var(--t1)', fontFamily: "'Inter', sans-serif", outline: 'none' }} className="glow-hover" />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 700, marginBottom: 10, color: 'var(--t3)', textTransform: 'uppercase', letterSpacing: '1px' }}>Serviço Automático</label>
              <select onChange={e => handleMainServiceChange(e.target.value)} style={{ width: '100%', padding: '14px 18px', background: 'var(--t4)', border: '1px solid var(--accent-glow)', borderRadius: '14px', fontSize: 14, color: 'var(--accent)', fontWeight: 700, fontFamily: "'Inter', sans-serif", outline: 'none' }} className="glow-hover">
                <option value="">(Preencher Manualmente)</option>
                {services.map(s => <option key={s.id} value={s.id} style={{ background: 'var(--bg)', color: 'var(--t1)' }}>{s.name}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Itens do Orçamento */}
        <div className="glass" style={{ padding: window.innerWidth <= 768 ? '24px' : '32px', borderRadius: '28px', border: '1px solid var(--surface-border)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <h3 className="font-heading" style={{ fontSize: 18, fontWeight: 700, color: 'var(--t1)' }}>🛠️ Escopo e Itens</h3>
            <button onClick={addItem} className="glow-hover" style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', borderRadius: '12px', background: 'var(--accent-glow)', border: '1px solid var(--accent)', color: 'var(--accent)', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
              <Plus size={16} strokeWidth={3} /> Item
            </button>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {items.map((item, index) => (
              <div key={index} className="animate-fade-in" style={{ 
                display: 'flex', 
                gap: 20, 
                alignItems: 'flex-start', 
                padding: '20px', 
                background: 'rgba(255,255,255,0.01)', 
                borderRadius: '20px', 
                border: '1px solid var(--surface-border)',
                flexDirection: window.innerWidth <= 800 ? 'column' : 'row'
              }}>
                <div style={{ flex: 1, width: '100%' }}>
                  <select value={item.service_id} onChange={e => handleItemChange(index, 'service_id', e.target.value)} style={{ width: '100%', padding: '12px 14px', background: 'var(--t4)', border: '1px solid var(--surface-border)', borderRadius: '10px', fontSize: 13, color: 'var(--t1)', outline: 'none', marginBottom: 12 }}>
                    <option value="">(Serviço Customizado)</option>
                    {services.map(s => <option key={s.id} value={s.id} style={{ background: 'var(--bg)', color: 'var(--t1)' }}>{s.name}</option>)}
                  </select>
                  <input placeholder="Descrição detalhada do item..." value={item.description} onChange={e => handleItemChange(index, 'description', e.target.value)} style={{ width: '100%', padding: '12px 14px', background: 'transparent', border: '1px solid transparent', borderBottomColor: 'var(--surface-border)', fontSize: 13, color: 'var(--t2)', outline: 'none' }} />
                </div>
                <div style={{ display: 'flex', gap: 16, width: window.innerWidth <= 800 ? '100%' : 'auto' }}>
                  <div style={{ width: 80 }}>
                    <label style={{ display: 'block', fontSize: 10, fontWeight: 700, marginBottom: 6, color: 'var(--t3)', textTransform: 'uppercase' }}>QTD</label>
                    <input type="number" min="1" value={item.quantity} onChange={e => handleItemChange(index, 'quantity', e.target.value)} style={{ width: '100%', padding: '12px', background: 'var(--t4)', border: '1px solid var(--surface-border)', borderRadius: '10px', fontSize: 13, color: 'var(--t1)', textAlign: 'center' }} />
                  </div>
                  <div style={{ width: 140 }}>
                    <label style={{ display: 'block', fontSize: 10, fontWeight: 700, marginBottom: 6, color: 'var(--t3)', textTransform: 'uppercase' }}>UNIT.</label>
                    <input type="text" value={maskCurrency(item.unit_price)} onChange={e => handleItemChange(index, 'unit_price', parseCurrency(e.target.value))} style={{ width: '100%', padding: '12px', background: 'var(--t4)', border: '1px solid var(--surface-border)', borderRadius: '10px', fontSize: 13, color: 'var(--t1)', textAlign: 'right' }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 100 }}>
                    <label style={{ display: 'block', fontSize: 10, fontWeight: 700, marginBottom: 6, color: 'var(--t3)', textTransform: 'uppercase' }}>SUBTOTAL</label>
                    <div style={{ padding: '12px 0', fontSize: 15, fontWeight: 800, color: 'var(--accent)', textAlign: 'right' }}>
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.subtotal)}
                    </div>
                  </div>
                  <button onClick={() => removeItem(index)} className="glow-hover" style={{ marginTop: 20, padding: 12, background: 'rgba(239, 68, 68, 0.05)', border: 'none', borderRadius: '12px', color: 'var(--red)', cursor: 'pointer' }}>
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Notas */}
        <div className="glass" style={{ padding: window.innerWidth <= 768 ? '24px' : '32px', borderRadius: '28px', border: '1px solid var(--surface-border)' }}>
           <h3 className="font-heading" style={{ fontSize: 18, fontWeight: 700, marginBottom: 16, color: 'var(--t1)' }}>📝 Notas Adicionais</h3>
           <textarea placeholder="Termos de pagamento, prazos de entrega ou observações importantes..." value={notes} onChange={e => setNotes(e.target.value)} style={{ width: '100%', padding: '18px', background: 'var(--t4)', border: '1px solid var(--surface-border)', borderRadius: '16px', fontSize: 14, color: 'var(--t1)', fontFamily: "'Inter', sans-serif", outline: 'none', minHeight: 140, resize: 'vertical' }} className="glow-hover" />
        </div>
      </div>

      {/* Sidebar de Resumo */}
      <div style={{ width: window.innerWidth <= 1100 ? '100%' : 380, display: 'flex', flexDirection: 'column', gap: 24, position: window.innerWidth <= 1100 ? 'static' : 'sticky', top: 24 }}>
        <div className="glass animate-fade-in" style={{ padding: '32px', borderRadius: '28px', border: '1px solid var(--surface-border)', boxShadow: 'var(--card-shadow)' }}>
          <h3 className="font-heading" style={{ fontSize: 20, fontWeight: 700, marginBottom: 24, color: 'var(--t1)' }}>Resumo Estratégico</h3>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16, fontSize: 14, color: 'var(--t2)', fontWeight: 500 }}>
            <span>Subtotal Bruto</span>
            <span style={{ color: 'var(--t1)', fontWeight: 700 }}>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(subtotal)}</span>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, fontSize: 14, color: 'var(--t2)', fontWeight: 500 }}>
            <span>Desconto</span>
            <input type="text" value={maskCurrency(discount)} onChange={e => setDiscount(parseCurrency(e.target.value))} style={{ width: 120, padding: '10px 14px', background: 'var(--t4)', border: '1px solid var(--surface-border)', borderRadius: '12px', fontSize: 14, color: 'var(--green)', fontWeight: 800, textAlign: 'right', outline: 'none' }} className="glow-hover" />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 24, paddingTop: 24, borderTop: '2px dashed var(--surface-border)', marginBottom: 32 }}>
            <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--t1)' }}>Total Líquido</span>
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: 28, fontWeight: 900, color: 'var(--accent)', letterSpacing: '-1px' }}>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(total)}</span>
              <div style={{ fontSize: 11, color: 'var(--t3)', marginTop: 4, fontWeight: 700, textTransform: 'uppercase' }}>Pronto para envio</div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--t3)', textTransform: 'uppercase', display: 'block', marginBottom: 10, letterSpacing: '1px' }}>Status Vital</label>
              <select value={status} onChange={e => setStatus(e.target.value)} style={{ width: '100%', padding: '14px 18px', background: 'var(--t4)', border: '1px solid var(--surface-border)', borderRadius: '14px', fontSize: 14, color: 'var(--t1)', outline: 'none', fontWeight: 600 }} className="glow-hover">
                <option value="rascunho" style={{ background: 'var(--bg)' }}>Rascunho</option>
                <option value="enviado" style={{ background: 'var(--bg)' }}>Enviado</option>
                <option value="aprovado" style={{ background: 'var(--bg)' }}>Aprovado</option>
                <option value="recusado" style={{ background: 'var(--bg)' }}>Recusado</option>
              </select>
            </div>

            <button onClick={saveQuote} disabled={saving} className="glow-hover holographic-active" style={{ width: '100%', padding: '18px', borderRadius: '16px', background: 'linear-gradient(135deg, var(--accent) 0%, #a855f7 100%)', border: 'none', color: '#fff', fontSize: 16, fontWeight: 800, cursor: saving ? 'not-allowed' : 'pointer', boxShadow: '0 10px 25px var(--accent-glow)' }}>
              {saving ? 'PROCESSANDO...' : 'FINALIZAR E PUBLICAR'}
            </button>
            
            <button onClick={generatePDF} className="glow-hover" style={{ width: '100%', padding: '14px', borderRadius: '16px', background: 'transparent', border: '1px solid var(--surface-border)', color: 'var(--t1)', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
              VISUALIZAR DOCUMENTO
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
