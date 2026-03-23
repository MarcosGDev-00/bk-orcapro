import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function ProfilePage() {
  const [formData, setFormData] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    async function fetchProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
        if (data) setFormData(data);
      }
    }
    fetchProfile();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMsg('');
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase.from('profiles').upsert({ id: user.id, ...formData });
    setLoading(false);
    if (!error) setMsg('Perfil salvo com sucesso!');
    else setMsg('Erro ao salvar o perfil.');
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: 900, width: '100%', margin: '0 auto' }}>
      <div className="glass" style={{ borderRadius: '28px', padding: window.innerWidth <= 768 ? '32px' : '48px', border: '1px solid var(--surface-border)', boxShadow: 'var(--card-shadow)' }}>
        <div style={{ marginBottom: 40 }}>
          <h2 className="font-heading" style={{ fontSize: window.innerWidth <= 768 ? 24 : 32, fontWeight: 800, color: 'var(--t1)', marginBottom: 8, letterSpacing: '-1.5px' }}>🏛️ Configurações da Empresa</h2>
          <p style={{ fontSize: 14, color: 'var(--t3)', fontWeight: 500 }}>Gerencie os dados que aparecerão nos seus orçamentos e documentos PDF.</p>
        </div>

        {msg && (
          <div className="animate-fade-in" style={{ 
            background: msg.includes('Erro') ? 'rgba(239, 68, 68, 0.1)' : 'rgba(34, 197, 94, 0.1)', 
            color: msg.includes('Erro') ? 'var(--red)' : 'var(--green)', 
            padding: '16px 20px', 
            borderRadius: '16px', 
            fontSize: 14, 
            marginBottom: 32, 
            border: `1px solid ${msg.includes('Erro') ? 'rgba(239, 68, 68, 0.2)' : 'rgba(34, 197, 94, 0.2)'}`,
            fontWeight: 700
          }}>
            {msg}
          </div>
        )}
        
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div style={{ display: 'grid', gridTemplateColumns: window.innerWidth <= 600 ? '1fr' : '1fr 1fr', gap: 24 }}>
            {[
              { key: 'company_name', label: 'Nome da Empresa / Profissional', full: true },
              { key: 'document', label: 'CNPJ / CPF' },
              { key: 'phone', label: 'Telefone de Contato' },
              { key: 'email', label: 'E-mail Comercial', type: 'email' },
              { key: 'logo_url', label: 'URL da Logomarca (PNG/JPG)' },
              { key: 'address', label: 'Endereço Completo', full: true },
            ].map(field => (
              <div key={field.key} style={{ gridColumn: field.full && window.innerWidth > 600 ? 'span 2' : 'span 1' }}>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, marginBottom: 10, color: 'var(--t3)', textTransform: 'uppercase', letterSpacing: '1px' }}>{field.label}</label>
                <input 
                  type={field.type || 'text'}
                  value={formData[field.key] || ''}
                  onChange={e => setFormData({ ...formData, [field.key]: e.target.value })}
                  style={{ 
                    width: '100%', 
                    padding: '14px 18px', 
                    background: 'var(--t4)', 
                    border: '1px solid var(--surface-border)', 
                    borderRadius: '14px', 
                    fontSize: 14, 
                    color: 'var(--t1)', 
                    fontFamily: "'Inter', sans-serif", 
                    outline: 'none'
                  }}
                  className="glow-hover"
                />
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: window.innerWidth <= 600 ? 'stretch' : 'flex-start', marginTop: 16 }}>
            <button 
              type="submit" 
              disabled={loading}
              className="glow-hover holographic-active"
              style={{ 
                width: window.innerWidth <= 600 ? '100%' : 'auto',
                padding: '18px 48px', 
                borderRadius: '16px', 
                background: 'var(--accent)', 
                border: 'none', 
                color: '#fff', 
                fontSize: 16, 
                fontWeight: 800, 
                cursor: loading ? 'not-allowed' : 'pointer',
                boxShadow: '0 10px 25px var(--accent-glow)'
              }}
            >
              {loading ? 'SALVANDO DADOS...' : 'SALVAR ALTERAÇÕES'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
