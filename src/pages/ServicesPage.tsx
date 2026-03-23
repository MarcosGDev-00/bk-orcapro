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
      <div style={{ display: 'flex', justifyContent: window.innerWidth <= 768 ? 'center' : 'flex-end', marginBottom: 32 }}>
        <button 
          onClick={() => { setFormData({ unit: 'un', unit_price: 0 }); setIsModalOpen(true); }}
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
            width: window.innerWidth <= 768 ? '100%' : 'auto'
          }}
        >
          + Novo Serviço
        </button>
      </div>

      <div className="glass" style={{ borderRadius: '24px', overflow: 'hidden', boxShadow: 'var(--card-shadow)' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: 600 }}>
            <thead>
              <tr style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid var(--surface-border)' }}>
                <th style={{ padding: '20px 24px', fontSize: 11, fontWeight: 700, color: 'var(--t3)', textTransform: 'uppercase', letterSpacing: '1.5px' }}>Serviço</th>
                <th style={{ padding: '20px 24px', fontSize: 11, fontWeight: 700, color: 'var(--t3)', textTransform: 'uppercase', letterSpacing: '1.5px' }}>Valor / Unidade</th>
                <th style={{ padding: '20px 24px', fontSize: 11, fontWeight: 700, color: 'var(--t3)', textTransform: 'uppercase', letterSpacing: '1.5px' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {services.map(s => (
                <tr key={s.id} className="glow-hover" style={{ borderBottom: '1px solid var(--surface-border)', transition: '0.2s' }}>
                  <td style={{ padding: '24px' }}>
                    <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--t1)' }}>{s.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--t2)', marginTop: 4 }}>{s.description || 'Sem descrição detalhada'}</div>
                  </td>
                  <td style={{ padding: '24px' }}>
                    <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--t1)' }}>
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(s.unit_price))}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--t3)', marginTop: 4, textTransform: 'uppercase', fontWeight: 600 }}>Por {s.unit}</div>
                  </td>
                  <td style={{ padding: '24px' }}>
                    <div style={{ display: 'flex', gap: 10 }}>
                      <button onClick={() => { setFormData(s); setIsModalOpen(true); }} className="glass glow-hover" style={{ borderRadius: '12px', color: 'var(--blue)', cursor: 'pointer', padding: '10px 14px', border: '1px solid rgba(59, 130, 246, 0.1)', fontSize: 13, fontWeight: 600 }}>Editar</button>
                      <button onClick={() => handleDelete(s.id)} className="glass glow-hover" style={{ borderRadius: '12px', color: 'var(--red)', cursor: 'pointer', padding: '10px 14px', border: '1px solid rgba(239, 68, 68, 0.1)', fontSize: 13, fontWeight: 600 }}>Deletar</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={formData.id ? 'Editar Serviço' : 'Novo Serviço'}>
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
          <div>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 700, marginBottom: 10, color: 'var(--t3)', textTransform: 'uppercase', letterSpacing: '1px' }}>Nome do Serviço *</label>
            <input 
              required 
              value={formData.name || ''} 
              onChange={e => setFormData({ ...formData, name: e.target.value })} 
              style={{ width: '100%', padding: '14px 18px', background: 'var(--t4)', border: '1px solid var(--surface-border)', borderRadius: '14px', fontSize: 14, color: 'var(--t1)', fontFamily: "'Inter', sans-serif", outline: 'none' }} 
              className="glow-hover"
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 700, marginBottom: 10, color: 'var(--t3)', textTransform: 'uppercase', letterSpacing: '1px' }}>Descrição / Escopo</label>
            <textarea 
              value={formData.description || ''} 
              onChange={e => setFormData({ ...formData, description: e.target.value })} 
              style={{ width: '100%', padding: '14px 18px', background: 'var(--t4)', border: '1px solid var(--surface-border)', borderRadius: '14px', fontSize: 14, color: 'var(--t1)', fontFamily: "'Inter', sans-serif", outline: 'none', minHeight: 120, resize: 'vertical' }} 
              className="glow-hover"
            />
          </div>
          <div style={{ display: 'flex', gap: 24, flexDirection: window.innerWidth <= 768 ? 'column' : 'row' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 700, marginBottom: 10, color: 'var(--t3)', textTransform: 'uppercase', letterSpacing: '1px' }}>Preço Unitário *</label>
              <input 
                type="text" 
                required 
                value={maskCurrency(formData.unit_price)} 
                onChange={e => setFormData({ ...formData, unit_price: parseCurrency(e.target.value) })} 
                className="glow-hover"
                style={{ width: '100%', padding: '14px 18px', borderRadius: '14px', fontSize: 14, fontFamily: "'Inter', sans-serif", outline: 'none' }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 700, marginBottom: 10, color: 'var(--t3)', textTransform: 'uppercase', letterSpacing: '1px' }}>Unidade (un/h/m²)</label>
              <input 
                value={formData.unit || 'un'} 
                onChange={e => setFormData({ ...formData, unit: e.target.value })} 
                className="glow-hover"
                style={{ width: '100%', padding: '14px 18px', borderRadius: '14px', fontSize: 14, fontFamily: "'Inter', sans-serif", outline: 'none' }}
              />
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
            <button 
              type="submit" 
              className="glow-hover"
              style={{ 
                padding: '16px 48px', 
                borderRadius: '16px', 
                background: 'var(--accent)', 
                border: 'none', 
                color: '#fff', 
                fontSize: 15, 
                fontWeight: 700, 
                cursor: 'pointer',
                boxShadow: '0 10px 20px var(--accent-glow)',
                width: window.innerWidth <= 600 ? '100%' : 'auto'
              }}
            >
              Salvar Serviço
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
