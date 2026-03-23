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
    <div style={{ maxWidth: 600 }}>
      <div style={{ background: 'var(--s1)', border: '1px solid var(--ln)', borderRadius: 10, padding: 32 }}>
        <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 24 }}>Dados da Empresa</h2>
        {msg && <div style={{ background: msg.includes('Erro') ? 'var(--rbg)' : 'var(--gbg)', color: msg.includes('Erro') ? 'var(--red)' : 'var(--green)', padding: '10px 14px', borderRadius: 8, fontSize: 13, marginBottom: 16, border: `1px solid ${msg.includes('Erro') ? 'var(--rbd)' : 'var(--gbd)'}` }}>{msg}</div>}
        
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {[
            { key: 'company_name', label: 'Nome da Empresa' },
            { key: 'document', label: 'Documento (CPF/CNPJ)' },
            { key: 'email', label: 'Email Comercial', type: 'email' },
            { key: 'phone', label: 'Telefone' },
            { key: 'address', label: 'Endereço Completo' },
            { key: 'logo_url', label: 'URL do Logo' },
          ].map(field => (
            <div key={field.key}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 6, color: 'var(--t2)' }}>{field.label}</label>
              <input 
                type={field.type || 'text'}
                value={formData[field.key] || ''}
                onChange={e => setFormData({ ...formData, [field.key]: e.target.value })}
                style={{ width:'100%', padding:'10px 14px', background:'var(--s2)', border:'1px solid var(--ln2)', borderRadius:8, fontSize:13, color:'var(--t1)', fontFamily:"'Inter',sans-serif", outline:'none' }}
              />
            </div>
          ))}
          <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: 16 }}>
            <button type="submit" disabled={loading} style={{ padding: '10px 22px', borderRadius: 8, background: 'var(--t1)', border: 'none', color: 'var(--s1)', fontSize: 13, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: "'Inter',sans-serif" }}>
              {loading ? 'Salvando...' : 'Salvar Perfil'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
