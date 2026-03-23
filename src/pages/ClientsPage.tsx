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
      <div style={{ display: 'flex', justifyContent: window.innerWidth <= 768 ? 'center' : 'flex-end', marginBottom: 32 }}>
        <button 
          onClick={() => { setFormData({}); setIsModalOpen(true); }}
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
          + Novo Cliente
        </button>
      </div>

      <div className="glass" style={{ borderRadius: '24px', overflow: 'hidden', boxShadow: 'var(--card-shadow)' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: 600 }}>
            <thead>
              <tr style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid var(--surface-border)' }}>
                <th style={{ padding: '20px 24px', fontSize: 11, fontWeight: 700, color: 'var(--t3)', textTransform: 'uppercase', letterSpacing: '1.5px' }}>Cliente</th>
                <th style={{ padding: '20px 24px', fontSize: 11, fontWeight: 700, color: 'var(--t3)', textTransform: 'uppercase', letterSpacing: '1.5px' }}>Empresa / Documento</th>
                <th style={{ padding: '20px 24px', fontSize: 11, fontWeight: 700, color: 'var(--t3)', textTransform: 'uppercase', letterSpacing: '1.5px' }}>Contato</th>
                <th style={{ padding: '20px 24px', fontSize: 11, fontWeight: 700, color: 'var(--t3)', textTransform: 'uppercase', letterSpacing: '1.5px' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {clients.map(c => (
                <tr key={c.id} className="glow-hover" style={{ borderBottom: '1px solid var(--surface-border)', transition: '0.2s' }}>
                  <td style={{ padding: '24px' }}>
                    <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--t1)' }}>{c.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--t2)', marginTop: 4 }}>{c.email || 'Sem email'}</div>
                  </td>
                  <td style={{ padding: '24px' }}>
                    <div style={{ fontSize: 14, color: 'var(--t1)', fontWeight: 500 }}>{c.company || '-'}</div>
                    <div style={{ fontSize: 11, color: 'var(--t3)', marginTop: 4 }}>{c.document || 'Sem doc'}</div>
                  </td>
                  <td style={{ padding: '24px', fontSize: 14, color: 'var(--t2)', fontWeight: 500 }}>{c.phone || '-'}</td>
                  <td style={{ padding: '24px' }}>
                    <div style={{ display: 'flex', gap: 10 }}>
                      <button onClick={() => { setFormData(c); setIsModalOpen(true); }} className="glass glow-hover" style={{ borderRadius: '12px', color: 'var(--blue)', cursor: 'pointer', padding: '10px 14px', border: '1px solid rgba(59, 130, 246, 0.1)', fontSize: 13, fontWeight: 600 }}>Editar</button>
                      <button onClick={() => handleDelete(c.id)} className="glass glow-hover" style={{ borderRadius: '12px', color: 'var(--red)', cursor: 'pointer', padding: '10px 14px', border: '1px solid rgba(239, 68, 68, 0.1)', fontSize: 13, fontWeight: 600 }}>Excluir</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={formData.id ? 'Editar Cliente' : 'Novo Cliente'}>
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
          <div style={{ display: 'grid', gridTemplateColumns: window.innerWidth <= 768 ? '1fr' : '1fr 1fr', gap: 24 }}>
            {[
              { key: 'name', label: 'Nome Completo *', required: true, full: true },
              { key: 'company', label: 'Nome da Empresa' },
              { key: 'document', label: 'CPF ou CNPJ' },
              { key: 'email', label: 'E-mail Principal', type: 'email' },
              { key: 'phone', label: 'WhatsApp / Telefone' },
              { key: 'address', label: 'Endereço Completo', full: true },
            ].map(field => (
              <div key={field.key} style={{ gridColumn: field.full && window.innerWidth > 768 ? 'span 2' : 'span 1' }}>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, marginBottom: 10, color: 'var(--t3)', textTransform: 'uppercase', letterSpacing: '1px' }}>{field.label}</label>
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
                  className="glow-hover"
                  style={{ width: '100%', padding: '14px 18px', borderRadius: '14px', fontSize: 14, fontFamily: "'Inter', sans-serif", outline: 'none' }}
                />
              </div>
            ))}
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
              Confirmar Cadastro
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
