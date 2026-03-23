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
    <div className="animate-fade-in" style={{ maxWidth: 800 }}>
      <div className="glass" style={{ borderRadius: '28px', padding: '48px', border: '1px solid var(--surface-border)', boxShadow: 'var(--card-shadow)' }}>
        <div style={{ marginBottom: 40 }}>
          <h2 className="font-heading" style={{ fontSize: 28, fontWeight: 800, color: '#fff', marginBottom: 8, letterSpacing: '-1.5px' }}>🏛️ Configurações da Empresa</h2>
          <p style={{ fontSize: 14, color: 'var(--t3)' }}>Gerencie os dados que aparecerão nos seus orçamentos e documentos PDF.</p>
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
            fontWeight: 600
          }}>
            {msg}
          </div>
        )}
        
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
            {[
              { key: 'company_name', label: 'Nome da Empresa / Profissional', full: true },
              { key: 'document', label: 'CNPJ / CPF' },
              { key: 'phone', label: 'Telefone de Contato' },
              { key: 'email', label: 'E-mail Comercial', type: 'email' },
              { key: 'logo_url', label: 'URL da Logomarca (PNG/JPG)' },
              { key: 'address', label: 'Endereço Completo', full: true },
            ].map(field => (
              <div key={field.key} style={{ gridColumn: field.full ? 'span 2' : 'span 1' }}>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, marginBottom: 8, color: 'var(--t3)', textTransform: 'uppercase', letterSpacing: '1px' }}>{field.label}</label>
                <input 
                  type={field.type || 'text'}
                  value={formData[field.key] || ''}
                  onChange={e => setFormData({ ...formData, [field.key]: e.target.value })}
                  style={{ 
                    width: '100%', 
                    padding: '14px 18px', 
                    background: 'rgba(255,255,255,0.03)', 
                    border: '1px solid var(--surface-border)', 
                    borderRadius: '14px', 
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
          <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: 16 }}>
            <button 
              type="submit" 
              disabled={loading}
              className="glow-hover"
              style={{ 
                padding: '16px 40px', 
                borderRadius: '14px', 
                background: 'var(--accent)', 
                border: 'none', 
                color: '#fff', 
                fontSize: 15, 
                fontWeight: 700, 
                cursor: loading ? 'not-allowed' : 'pointer',
                boxShadow: '0 10px 25px var(--accent-glow)'
              }}
            >
              {loading ? 'Salvando Dados...' : 'Salvar Alterações'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
