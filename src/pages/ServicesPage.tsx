import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Modal } from '../components/Modal';
import { maskCurrency, parseCurrency } from '../lib/masks';

export function ServicesPage() {
  const [services, setServices] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<any>({ unit: 'un', unit_price: 0 });

  const fetchServices = async () => {
    const { data } = await supabase.from('services').select('*').order('created_at', { ascending: false });
    setServices(data || []);
  };

  useEffect(() => { fetchServices(); }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    if (formData.id) {
      await supabase.from('services').update(formData).eq('id', formData.id);
    } else {
      await supabase.from('services').insert([{ ...formData, user_id: user.id }]);
    }
    setIsModalOpen(false);
    fetchServices();
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza?')) {
      await supabase.from('services').delete().eq('id', id);
      fetchServices();
    }
  };

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 32 }}>
        <button 
          onClick={() => { setFormData({ unit: 'un', unit_price: 0 }); setIsModalOpen(true); }}
          className="glow-hover"
          style={{ 
            padding: '12px 28px', 
            borderRadius: '14px', 
            background: 'linear-gradient(135deg, var(--accent) 0%, #a855f7 100%)', 
            border: 'none', 
            color: '#fff', 
            fontSize: 14, 
            fontWeight: 700, 
            cursor: 'pointer',
            boxShadow: '0 4px 15px var(--accent-glow)'
          }}
        >
          + Novo Serviço
        </button>
      </div>

      <div className="glass" style={{ borderRadius: '24px', overflow: 'hidden', boxShadow: 'var(--card-shadow)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid var(--surface-border)' }}>
              <th style={{ padding: '20px 24px', fontSize: 12, fontWeight: 700, color: 'var(--t3)', textTransform: 'uppercase', letterSpacing: '1px' }}>Serviço</th>
              <th style={{ padding: '20px 24px', fontSize: 12, fontWeight: 700, color: 'var(--t3)', textTransform: 'uppercase', letterSpacing: '1px' }}>Valor / Unidade</th>
              <th style={{ padding: '20px 24px', fontSize: 12, fontWeight: 700, color: 'var(--t3)', textTransform: 'uppercase', letterSpacing: '1px' }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {services.map(s => (
              <tr key={s.id} className="glow-hover" style={{ borderBottom: '1px solid var(--surface-border)', transition: '0.2s' }}>
                <td style={{ padding: '24px' }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: '#fff' }}>{s.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--t2)', marginTop: 4 }}>{s.description || 'Sem descrição detalhada'}</div>
                </td>
                <td style={{ padding: '24px' }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: '#fff' }}>
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(s.unit_price))}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--t3)', marginTop: 2, textTransform: 'uppercase' }}>Por {s.unit}</div>
                </td>
                <td style={{ padding: '24px' }}>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={() => { setFormData(s); setIsModalOpen(true); }} className="glass glow-hover" style={{ borderRadius: '10px', color: 'var(--blue)', cursor: 'pointer', padding: '10px', border: '1px solid rgba(59, 130, 246, 0.2)' }}>Editar</button>
                    <button onClick={() => handleDelete(s.id)} className="glass glow-hover" style={{ borderRadius: '10px', color: 'var(--red)', cursor: 'pointer', padding: '10px', border: '1px solid rgba(239, 68, 68, 0.2)' }}>Deletar</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={formData.id ? 'Editar Serviço' : 'Novo Serviço'}>
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 700, marginBottom: 8, color: 'var(--t2)', textTransform: 'uppercase' }}>Nome do Serviço *</label>
            <input 
              required 
              value={formData.name || ''} 
              onChange={e => setFormData({ ...formData, name: e.target.value })} 
              style={{ width: '100%', padding: '12px 16px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--surface-border)', borderRadius: '12px', fontSize: 14, color: '#fff', fontFamily: "'Inter', sans-serif", outline: 'none' }} 
              onFocus={e => e.target.style.borderColor = 'var(--accent)'}
              onBlur={e => e.target.style.borderColor = 'var(--surface-border)'}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 700, marginBottom: 8, color: 'var(--t2)', textTransform: 'uppercase' }}>Descrição / Escopo</label>
            <textarea 
              value={formData.description || ''} 
              onChange={e => setFormData({ ...formData, description: e.target.value })} 
              style={{ width: '100%', padding: '12px 16px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--surface-border)', borderRadius: '12px', fontSize: 14, color: '#fff', fontFamily: "'Inter', sans-serif", outline: 'none', minHeight: 100, resize: 'vertical' }} 
              onFocus={e => e.target.style.borderColor = 'var(--accent)'}
              onBlur={e => e.target.style.borderColor = 'var(--surface-border)'}
            />
          </div>
          <div style={{ display: 'flex', gap: 20 }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, marginBottom: 8, color: 'var(--t2)', textTransform: 'uppercase' }}>Preço Unitário *</label>
              <input 
                type="text" 
                required 
                value={maskCurrency(formData.unit_price)} 
                onChange={e => setFormData({ ...formData, unit_price: parseCurrency(e.target.value) })} 
                style={{ width: '100%', padding: '12px 16px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--surface-border)', borderRadius: '12px', fontSize: 14, color: '#fff', fontFamily: "'Inter', sans-serif", outline: 'none' }} 
                onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                onBlur={e => e.target.style.borderColor = 'var(--surface-border)'}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, marginBottom: 8, color: 'var(--t2)', textTransform: 'uppercase' }}>Unidade (un/h/m²)</label>
              <input 
                value={formData.unit || 'un'} 
                onChange={e => setFormData({ ...formData, unit: e.target.value })} 
                style={{ width: '100%', padding: '12px 16px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--surface-border)', borderRadius: '12px', fontSize: 14, color: '#fff', fontFamily: "'Inter', sans-serif", outline: 'none' }} 
                onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                onBlur={e => e.target.style.borderColor = 'var(--surface-border)'}
              />
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
            <button 
              type="submit" 
              className="glow-hover"
              style={{ padding: '12px 32px', borderRadius: '12px', background: 'var(--accent)', border: 'none', color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}
            >
              Salvar Serviço
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
