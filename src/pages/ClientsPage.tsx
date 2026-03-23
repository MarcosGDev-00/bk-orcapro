import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Modal } from '../components/Modal';
import { maskPhone, maskCpfCnpj } from '../lib/masks';

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
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 32 }}>
        <button 
          onClick={() => { setFormData({}); setIsModalOpen(true); }}
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
          + Novo Cliente
        </button>
      </div>

      <div className="glass" style={{ borderRadius: '24px', overflow: 'hidden', boxShadow: 'var(--card-shadow)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid var(--surface-border)' }}>
              <th style={{ padding: '20px 24px', fontSize: 12, fontWeight: 700, color: 'var(--t3)', textTransform: 'uppercase', letterSpacing: '1px' }}>Cliente</th>
              <th style={{ padding: '20px 24px', fontSize: 12, fontWeight: 700, color: 'var(--t3)', textTransform: 'uppercase', letterSpacing: '1px' }}>Empresa / Documento</th>
              <th style={{ padding: '20px 24px', fontSize: 12, fontWeight: 700, color: 'var(--t3)', textTransform: 'uppercase', letterSpacing: '1px' }}>Contato</th>
              <th style={{ padding: '20px 24px', fontSize: 12, fontWeight: 700, color: 'var(--t3)', textTransform: 'uppercase', letterSpacing: '1px' }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {clients.map(c => (
              <tr key={c.id} className="glow-hover" style={{ borderBottom: '1px solid var(--surface-border)', transition: '0.2s' }}>
                <td style={{ padding: '24px' }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: '#fff' }}>{c.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--t2)', marginTop: 2 }}>{c.email || 'Sem email'}</div>
                </td>
                <td style={{ padding: '24px' }}>
                  <div style={{ fontSize: 14, color: 'var(--t1)' }}>{c.company || '-'}</div>
                  <div style={{ fontSize: 11, color: 'var(--t3)', marginTop: 2 }}>{c.document || 'Sem doc'}</div>
                </td>
                <td style={{ padding: '24px', fontSize: 14, color: 'var(--t2)' }}>{c.phone || '-'}</td>
                <td style={{ padding: '24px' }}>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={() => { setFormData(c); setIsModalOpen(true); }} className="glass glow-hover" style={{ borderRadius: '10px', color: 'var(--blue)', cursor: 'pointer', padding: '10px', border: '1px solid rgba(59, 130, 246, 0.2)' }}>Editar</button>
                    <button onClick={() => handleDelete(c.id)} className="glass glow-hover" style={{ borderRadius: '10px', color: 'var(--red)', cursor: 'pointer', padding: '10px', border: '1px solid rgba(239, 68, 68, 0.2)' }}>Excluir</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={formData.id ? 'Editar Cliente' : 'Novo Cliente'}>
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            {[
              { key: 'name', label: 'Nome Completo *', required: true, full: true },
              { key: 'company', label: 'Nome da Empresa' },
              { key: 'document', label: 'CPF ou CNPJ' },
              { key: 'email', label: 'E-mail Principal', type: 'email' },
              { key: 'phone', label: 'WhatsApp / Telefone' },
              { key: 'address', label: 'Endereço Completo', full: true },
            ].map(field => (
              <div key={field.key} style={{ gridColumn: field.full ? 'span 2' : 'span 1' }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, marginBottom: 8, color: 'var(--t2)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{field.label}</label>
                <input 
                  type={field.type || 'text'}
                  required={field.required}
                  value={formData[field.key] || ''}
                  onChange={e => {
                    let val = e.target.value;
                    if (field.key === 'phone') val = maskPhone(val);
                    if (field.key === 'document') val = maskCpfCnpj(val);
                    setFormData({ ...formData, [field.key]: val });
                  }}
                  style={{ 
                    width: '100%', 
                    padding: '12px 16px', 
                    background: 'rgba(255,255,255,0.03)', 
                    border: '1px solid var(--surface-border)', 
                    borderRadius: '12px', 
                    fontSize: 14, 
                    color: '#fff', 
                    fontFamily: "'Inter', sans-serif", 
                    outline: 'none',
                    transition: 'border-color 0.2s'
                  }}
                  onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                  onBlur={e => e.target.style.borderColor = 'var(--surface-border)'}
                />
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
            <button 
              type="submit" 
              className="glow-hover"
              style={{ 
                padding: '12px 32px', 
                borderRadius: '12px', 
                background: 'var(--accent)', 
                border: 'none', 
                color: '#fff', 
                fontSize: 14, 
                fontWeight: 700, 
                cursor: 'pointer' 
              }}
            >
              Confirmar Cadastro
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
