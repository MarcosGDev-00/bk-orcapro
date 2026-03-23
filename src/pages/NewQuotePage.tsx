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
    <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
      <div style={{ flex: '6 1 0%', display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div style={{ background: 'var(--s1)', padding: 24, borderRadius: 10, border: '1px solid var(--ln)' }}>
          <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 6, color: 'var(--t2)' }}>Título do Orçamento *</label>
              <input value={title} onChange={e => setTitle(e.target.value)} required style={{ width:'100%', padding:'10px 14px', background:'var(--s2)', border:'1px solid var(--ln2)', borderRadius:8, fontSize:13, color:'var(--t1)', fontFamily:"'Inter',sans-serif", outline:'none' }} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 6, color: 'var(--t2)' }}>Cliente</label>
              <select value={clientId} onChange={e => setClientId(e.target.value)} style={{ width:'100%', padding:'10px 14px', background:'var(--s2)', border:'1px solid var(--ln2)', borderRadius:8, fontSize:13, color:'var(--t1)', fontFamily:"'Inter',sans-serif", outline:'none' }}>
                <option value="">Selecione um cliente...</option>
                {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 16 }}>
             <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 6, color: 'var(--t2)' }}>Validade</label>
              <input type="date" value={validUntil} onChange={e => setValidUntil(e.target.value)} style={{ width:'100%', padding:'10px 14px', background:'var(--s2)', border:'1px solid var(--ln2)', borderRadius:8, fontSize:13, color:'var(--t1)', fontFamily:"'Inter',sans-serif", outline: 'none' }} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 6, color: 'var(--t2)' }}>Serviço Principal</label>
              <select onChange={e => handleMainServiceChange(e.target.value)} style={{ width:'100%', padding:'10px 14px', background:'var(--s2)', border:'1px solid var(--ln2)', borderRadius:8, fontSize:13, color:'var(--t1)', fontFamily:"'Inter',sans-serif", outline:'none' }}>
                <option value="">(Nenhum - Preencher Manualmente)</option>
                {services.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
          </div>
        </div>

        <div style={{ background: 'var(--s1)', padding: 24, borderRadius: 10, border: '1px solid var(--ln)' }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 16 }}>Itens do Orçamento</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {items.map((item, index) => (
              <div key={index} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <div style={{ flex: 2 }}>
                  <select value={item.service_id} onChange={e => handleItemChange(index, 'service_id', e.target.value)} style={{ width:'100%', padding:'10px 14px', background:'var(--s2)', border:'1px solid var(--ln2)', borderRadius:8, fontSize:13, color:'var(--t1)', fontFamily:"'Inter',sans-serif", outline:'none', marginBottom: 8 }}>
                    <option value="">(Serviço avulso)</option>
                    {services.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                  <input placeholder="Descrição" value={item.description} onChange={e => handleItemChange(index, 'description', e.target.value)} style={{ width:'100%', padding:'10px 14px', background:'var(--s2)', border:'1px solid var(--ln2)', borderRadius:8, fontSize:13, color:'var(--t1)', fontFamily:"'Inter',sans-serif", outline:'none' }} />
                </div>
                <div style={{ width: 80 }}>
                  <input type="number" min="1" value={item.quantity} onChange={e => handleItemChange(index, 'quantity', e.target.value)} style={{ width:'100%', padding:'10px 14px', background:'var(--s2)', border:'1px solid var(--ln2)', borderRadius:8, fontSize:13, color:'var(--t1)', fontFamily:"'Inter',sans-serif", outline:'none' }} />
                </div>
                <div style={{ width: 120 }}>
                  <input type="text" value={maskCurrency(item.unit_price)} onChange={e => handleItemChange(index, 'unit_price', parseCurrency(e.target.value))} style={{ width:'100%', padding:'10px 14px', background:'var(--s2)', border:'1px solid var(--ln2)', borderRadius:8, fontSize:13, color:'var(--t1)', fontFamily:"'Inter',sans-serif", outline:'none' }} />
                </div>
                <div style={{ width: 120, padding: '10px 14px', fontSize: 13, background: 'var(--bg)', borderRadius: 8, border: '1px solid transparent', textAlign: 'right', fontWeight: 600 }}>
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.subtotal)}
                </div>
                <button onClick={() => removeItem(index)} style={{ padding: 10, background: 'transparent', border: 'none', color: 'var(--red)', cursor: 'pointer' }}>
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
          <button onClick={addItem} style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 16, padding: '10px 14px', borderRadius: 8, background: 'var(--bg)', border: '1px dashed var(--t3)', color: 'var(--t2)', fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: "'Inter',sans-serif", width: '100%', justifyContent: 'center' }}>
            <Plus size={16} /> Adicionar Item
          </button>
        </div>

        <div style={{ background: 'var(--s1)', padding: 24, borderRadius: 10, border: '1px solid var(--ln)' }}>
           <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 16 }}>Notas</h3>
           <textarea value={notes} onChange={e => setNotes(e.target.value)} style={{ width:'100%', padding:'10px 14px', background:'var(--s2)', border:'1px solid var(--ln2)', borderRadius:8, fontSize:13, color:'var(--t1)', fontFamily:"'Inter',sans-serif", outline:'none', minHeight: 100 }} />
        </div>
      </div>

      <div style={{ flex: '4 1 0%', display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div style={{ background: 'var(--s1)', padding: 24, borderRadius: 10, border: '1px solid var(--ln)' }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 16 }}>Resumo Financeiro</h3>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12, fontSize: 13, color: 'var(--t2)' }}>
            <span>Subtotal</span>
            <span>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(subtotal)}</span>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, fontSize: 13, color: 'var(--t2)' }}>
            <span>Desconto (R$)</span>
            <input type="text" value={maskCurrency(discount)} onChange={e => setDiscount(parseCurrency(e.target.value))} style={{ width: 100, padding:'6px 10px', background:'var(--s2)', border:'1px solid var(--ln2)', borderRadius:8, fontSize:13, color:'var(--t1)', fontFamily:"'Inter',sans-serif", outline:'none', textAlign: 'right' }} />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--ln)', fontSize: 16, fontWeight: 700 }}>
            <span>Total</span>
            <span>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(total)}</span>
          </div>
        </div>

        <div style={{ background: 'var(--s1)', padding: 24, borderRadius: 10, border: '1px solid var(--ln)' }}>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 6, color: 'var(--t2)' }}>Status do Orçamento</label>
          <select value={status} onChange={e => setStatus(e.target.value)} style={{ width:'100%', padding:'10px 14px', background:'var(--s2)', border:'1px solid var(--ln2)', borderRadius:8, fontSize:13, color:'var(--t1)', fontFamily:"'Inter',sans-serif", outline:'none', marginBottom: 24 }}>
            <option value="rascunho">Rascunho</option>
            <option value="enviado">Enviado</option>
            <option value="aprovado">Aprovado</option>
            <option value="recusado">Recusado</option>
          </select>

          <button onClick={saveQuote} disabled={saving} style={{ width: '100%', padding: '12px 22px', borderRadius: 8, background: 'var(--t1)', border: 'none', color: 'var(--s1)', fontSize: 13, fontWeight: 600, cursor: saving ? 'not-allowed' : 'pointer', fontFamily: "'Inter',sans-serif", marginBottom: 12 }}>
            {saving ? 'Salvando...' : 'Salvar Orçamento'}
          </button>
          
          <button onClick={generatePDF} style={{ width: '100%', padding: '12px 22px', borderRadius: 8, background: 'transparent', border: '1px solid var(--ln2)', color: 'var(--t1)', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: "'Inter',sans-serif" }}>
            Visualizar PDF
          </button>
        </div>
      </div>
    </div>
  );
}
