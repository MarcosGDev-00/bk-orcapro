import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Modal } from '../components/Modal';

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
    <div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 24 }}>
        <button 
          onClick={() => { setFormData({ unit: 'un', unit_price: 0 }); setIsModalOpen(true); }}
          style={{ padding: '10px 22px', borderRadius: 8, background: 'var(--t1)', border: 'none', color: 'var(--s1)', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: "'Inter',sans-serif" }}
        >
          + Novo Serviço
        </button>
      </div>

      <div style={{ background: 'var(--s1)', border: '1px solid var(--ln)', borderRadius: 10, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'var(--s2)', borderBottom: '1px solid var(--ln2)' }}>
              <th style={{ padding: '12px 24px', fontSize: 13, fontWeight: 500, color: 'var(--t2)' }}>Nome</th>
              <th style={{ padding: '12px 24px', fontSize: 13, fontWeight: 500, color: 'var(--t2)' }}>Descrição</th>
              <th style={{ padding: '12px 24px', fontSize: 13, fontWeight: 500, color: 'var(--t2)' }}>Preço Unit.</th>
              <th style={{ padding: '12px 24px', fontSize: 13, fontWeight: 500, color: 'var(--t2)' }}>Unidade</th>
              <th style={{ padding: '12px 24px', fontSize: 13, fontWeight: 500, color: 'var(--t2)' }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {services.map(s => (
              <tr key={s.id} style={{ borderBottom: '1px solid var(--ln)' }}>
                <td style={{ padding: '16px 24px', fontSize: 13, fontWeight: 500 }}>{s.name}</td>
                <td style={{ padding: '16px 24px', fontSize: 13 }}>{s.description || '-'}</td>
                <td style={{ padding: '16px 24px', fontSize: 13 }}>
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(s.unit_price))}
                </td>
                <td style={{ padding: '16px 24px', fontSize: 13 }}>{s.unit}</td>
                <td style={{ padding: '16px 24px' }}>
                  <button onClick={() => { setFormData(s); setIsModalOpen(true); }} style={{ background: 'none', border: 'none', color: 'var(--blue)', fontSize: 13, cursor: 'pointer', marginRight: 12 }}>Editar</button>
                  <button onClick={() => handleDelete(s.id)} style={{ background: 'none', border: 'none', color: 'var(--red)', fontSize: 13, cursor: 'pointer' }}>Excluir</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={formData.id ? 'Editar Serviço' : 'Novo Serviço'}>
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 6, color: 'var(--t2)' }}>Nome *</label>
            <input required value={formData.name || ''} onChange={e => setFormData({ ...formData, name: e.target.value })} style={{ width:'100%', padding:'10px 14px', background:'var(--s2)', border:'1px solid var(--ln2)', borderRadius:8, fontSize:13, color:'var(--t1)', fontFamily:"'Inter',sans-serif", outline:'none' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 6, color: 'var(--t2)' }}>Descrição</label>
            <input value={formData.description || ''} onChange={e => setFormData({ ...formData, description: e.target.value })} style={{ width:'100%', padding:'10px 14px', background:'var(--s2)', border:'1px solid var(--ln2)', borderRadius:8, fontSize:13, color:'var(--t1)', fontFamily:"'Inter',sans-serif", outline:'none' }} />
          </div>
          <div style={{ display: 'flex', gap: 16 }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 6, color: 'var(--t2)' }}>Preço *</label>
              <input type="number" step="0.01" required value={formData.unit_price || 0} onChange={e => setFormData({ ...formData, unit_price: e.target.value })} style={{ width:'100%', padding:'10px 14px', background:'var(--s2)', border:'1px solid var(--ln2)', borderRadius:8, fontSize:13, color:'var(--t1)', fontFamily:"'Inter',sans-serif", outline:'none' }} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 6, color: 'var(--t2)' }}>Unidade (un/h/m²)</label>
              <input value={formData.unit || 'un'} onChange={e => setFormData({ ...formData, unit: e.target.value })} style={{ width:'100%', padding:'10px 14px', background:'var(--s2)', border:'1px solid var(--ln2)', borderRadius:8, fontSize:13, color:'var(--t1)', fontFamily:"'Inter',sans-serif", outline:'none' }} />
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 16 }}>
            <button type="submit" style={{ padding: '10px 22px', borderRadius: 8, background: 'var(--t1)', border: 'none', color: 'var(--s1)', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: "'Inter',sans-serif" }}>
              Salvar
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
