import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Modal } from '../components/Modal';

export function ClientsPage() {
  const [clients, setClients] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<any>({});

  const fetchClients = async () => {
    const { data } = await supabase.from('clients').select('*').order('created_at', { ascending: false });
    setClients(data || []);
  };

  useEffect(() => { fetchClients(); }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    if (formData.id) {
      await supabase.from('clients').update(formData).eq('id', formData.id);
    } else {
      await supabase.from('clients').insert([{ ...formData, user_id: user.id }]);
    }
    setIsModalOpen(false);
    fetchClients();
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza?')) {
      await supabase.from('clients').delete().eq('id', id);
      fetchClients();
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 24 }}>
        <button 
          onClick={() => { setFormData({}); setIsModalOpen(true); }}
          style={{ padding: '10px 22px', borderRadius: 8, background: 'var(--t1)', border: 'none', color: 'var(--s1)', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: "'Inter',sans-serif" }}
        >
          + Novo Cliente
        </button>
      </div>

      <div style={{ background: 'var(--s1)', border: '1px solid var(--ln)', borderRadius: 10, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'var(--s2)', borderBottom: '1px solid var(--ln2)' }}>
              <th style={{ padding: '12px 24px', fontSize: 13, fontWeight: 500, color: 'var(--t2)' }}>Nome</th>
              <th style={{ padding: '12px 24px', fontSize: 13, fontWeight: 500, color: 'var(--t2)' }}>Empresa</th>
              <th style={{ padding: '12px 24px', fontSize: 13, fontWeight: 500, color: 'var(--t2)' }}>Email</th>
              <th style={{ padding: '12px 24px', fontSize: 13, fontWeight: 500, color: 'var(--t2)' }}>Telefone</th>
              <th style={{ padding: '12px 24px', fontSize: 13, fontWeight: 500, color: 'var(--t2)' }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {clients.map(c => (
              <tr key={c.id} style={{ borderBottom: '1px solid var(--ln)' }}>
                <td style={{ padding: '16px 24px', fontSize: 13, fontWeight: 500 }}>{c.name}</td>
                <td style={{ padding: '16px 24px', fontSize: 13 }}>{c.company || '-'}</td>
                <td style={{ padding: '16px 24px', fontSize: 13 }}>{c.email || '-'}</td>
                <td style={{ padding: '16px 24px', fontSize: 13 }}>{c.phone || '-'}</td>
                <td style={{ padding: '16px 24px' }}>
                  <button onClick={() => { setFormData(c); setIsModalOpen(true); }} style={{ background: 'none', border: 'none', color: 'var(--blue)', fontSize: 13, cursor: 'pointer', marginRight: 12 }}>Editar</button>
                  <button onClick={() => handleDelete(c.id)} style={{ background: 'none', border: 'none', color: 'var(--red)', fontSize: 13, cursor: 'pointer' }}>Excluir</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={formData.id ? 'Editar Cliente' : 'Novo Cliente'}>
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {[
            { key: 'name', label: 'Nome *', required: true },
            { key: 'company', label: 'Empresa' },
            { key: 'email', label: 'Email', type: 'email' },
            { key: 'phone', label: 'Telefone' },
            { key: 'document', label: 'Documento (CPF/CNPJ)' },
            { key: 'address', label: 'Endereço' },
          ].map(field => (
            <div key={field.key}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 6, color: 'var(--t2)' }}>{field.label}</label>
              <input 
                type={field.type || 'text'}
                required={field.required}
                value={formData[field.key] || ''}
                onChange={e => setFormData({ ...formData, [field.key]: e.target.value })}
                style={{ width:'100%', padding:'10px 14px', background:'var(--s2)', border:'1px solid var(--ln2)', borderRadius:8, fontSize:13, color:'var(--t1)', fontFamily:"'Inter',sans-serif", outline:'none' }}
              />
            </div>
          ))}
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
