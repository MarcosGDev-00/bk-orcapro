import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FileText, Check, ArrowRight, Shield, Zap, Layout as LayoutIcon, 
  Download, Users, Briefcase, Package, BarChart2, Send, ChevronDown,
  Sun, Moon
} from 'lucide-react';

export function LandingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('aura-theme');
    return saved ? saved === 'dark' : false;
  });

  React.useEffect(() => {
    document.body.className = isDark ? 'dark-theme' : '';
    localStorage.setItem('aura-theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  const faqItems = [
    { q: "Preciso de cartão de crédito para testar?", a: "Não. Os primeiros 14 dias são gratuitos e você não precisa cadastrar cartão. Só cobramos se você decidir continuar." },
    { q: "Posso cancelar quando quiser?", a: "Sim, sem multa e sem burocracia. Cancele pelo painel a qualquer momento." },
    { q: "O PDF tem minha logo e dados da empresa?", a: "Sim. Basta preencher o Perfil com os dados da sua empresa e eles aparecem automaticamente em todos os PDFs." },
    { q: "Funciona no celular?", a: "O sistema é responsivo e funciona em qualquer dispositivo. Para gerar PDFs, recomendamos o desktop." }
  ];

  return (
    <div className="animate-fade-in" style={{ background: 'var(--bg)', minHeight: '100vh', overflowX: 'hidden', color: 'var(--t1)' }}>
      {/* SEÇÃO 1 — NAVBAR */}
      <nav style={{ 
        position: 'fixed', top: 0, width: '100%', zIndex: 1000, padding: '20px 40px', 
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        backdropFilter: 'blur(10px)', background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid var(--surface-border)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 32, height: 32, borderRadius: '10px', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 5px 15px var(--accent-glow)' }}>
            <FileText size={18} color="#fff" />
          </div>
          <span className="font-heading" style={{ fontWeight: 800, fontSize: 20, letterSpacing: '-1px' }}>OrçaPro</span>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          <button
            onClick={() => setIsDark(!isDark)}
            className="glass glow-hover"
            style={{
              width: 36,
              height: 36,
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'var(--t2)',
              background: 'var(--surface)',
              border: '1px solid var(--surface-border)',
              outline: 'none'
            }}
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <Link to="/login" style={{ fontSize: 13, fontWeight: 700, color: 'var(--t2)', textDecoration: 'none' }}>Entrar</Link>
          <Link to="/login" className="glow-hover holographic-active" style={{ 
            padding: '10px 24px', borderRadius: '12px', fontSize: 13, fontWeight: 800, color: '#fff', textDecoration: 'none',
            background: 'linear-gradient(135deg, var(--accent) 0%, #a855f7 100%)', boxShadow: '0 4px 15px var(--accent-glow)'
          }}>
            Começar grátis
          </Link>
        </div>
      </nav>

      {/* SEÇÃO 2 — HERO */}
      <section style={{ paddingTop: 160, paddingBottom: 100, paddingLeft: 20, paddingRight: 20 }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', textAlign: 'center' }}>
          <div className="glass" style={{ display: 'inline-flex', padding: '6px 16px', borderRadius: '30px', marginBottom: 24, alignItems: 'center', gap: 8, border: '1px solid var(--accent-glow)' }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--green)', boxShadow: '0 0 10px var(--green)' }} />
            <span style={{ fontSize: 11, fontWeight: 800, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '1px' }}>Grátis por 14 dias — sem cartão</span>
          </div>
          
          <h1 className="font-heading" style={{ fontSize: window.innerWidth <= 768 ? 44 : 76, fontWeight: 900, lineHeight: 1, marginBottom: 24, letterSpacing: '-4px' }}>
            Crie orçamentos profissionais em <span style={{ fontStyle: 'italic', color: 'var(--accent)' }}>segundos</span>
          </h1>
          
          <p style={{ fontSize: 20, color: 'var(--t3)', maxWidth: 680, margin: '0 auto 48px', lineHeight: 1.6, fontWeight: 500 }}>
            Chega de planilha e PDF manual. Com o OrçaPro você monta, envia e acompanha orçamentos profissionais — tudo em um só lugar.
          </p>
          
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 80 }}>
            <Link to="/login" className="glow-hover holographic-active" style={{ 
              padding: '24px 48px', borderRadius: '20px', background: 'linear-gradient(135deg, var(--accent) 0%, #a855f7 100%)', color: '#fff', fontSize: 18, fontWeight: 900, textDecoration: 'none', boxShadow: '0 20px 40px var(--accent-glow)'
            }}>
              Criar conta grátis
            </Link>
            <a href="#demo" className="glass glow-hover" style={{ padding: '24px 40px', borderRadius: '20px', fontSize: 18, fontWeight: 700, textDecoration: 'none' }}>
              Ver demonstração
            </a>
          </div>

          {/* Product Preview Mockup */}
          <div className="glass animate-fade-in" style={{ 
            maxWidth: 1000, margin: '0 auto', borderRadius: '32px', overflow: 'hidden', border: '1px solid var(--surface-border)', 
            boxShadow: 'var(--card-shadow)', background: 'var(--bg)', display: 'flex', minHeight: 400
          }}>
            {/* Mock Sidebar */}
            <div style={{ width: 220, borderRight: '1px solid var(--surface-border)', padding: '24px 16px', display: window.innerWidth <= 768 ? 'none' : 'flex', flexDirection: 'column', gap: 12, textAlign: 'left' }}>
              <div style={{ width: '80%', height: 20, background: 'var(--t4)', borderRadius: '6px', marginBottom: 20 }} />
              {[LayoutIcon, FileText, Users, Briefcase].map((Icon, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px', borderRadius: '10px', background: i === 1 ? 'var(--accent-glow)' : 'transparent' }}>
                  <Icon size={18} color={i === 1 ? 'var(--accent)' : 'var(--t3)'} />
                  <div style={{ width: i === 1 ? '60%' : '40%', height: 8, background: i === 1 ? 'var(--accent)' : 'var(--t4)', borderRadius: '4px' }} />
                </div>
              ))}
            </div>
            
            {/* Mock Main Area */}
            <div style={{ flex: 1, padding: 40, background: 'var(--t4)', opacity: 0.9 }}>
              <div style={{ display: 'flex', gap: 20, marginBottom: 40 }}>
                {[
                  { label: 'Orçamentos', val: '12' },
                  { label: 'Total Aprovado', val: 'R$ 8.400' },
                  { label: 'Clientes', val: '5' }
                ].map((c, i) => (
                  <div key={i} className="glass" style={{ flex: 1, padding: '24px', borderRadius: '20px', textAlign: 'left' }}>
                    <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--t3)', textTransform: 'uppercase', marginBottom: 8 }}>{c.label}</div>
                    <div style={{ fontSize: 24, fontWeight: 900, color: 'var(--t1)' }}>{c.val}</div>
                  </div>
                ))}
              </div>
              
              <div className="glass" style={{ borderRadius: '20px', padding: '32px', textAlign: 'left' }}>
                <div style={{ width: '30%', height: 16, background: 'var(--t3)', borderRadius: '8px', marginBottom: 24, opacity: 0.2 }} />
                {[1, 2, 3].map(i => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '16px 0', borderBottom: i < 3 ? '1px solid var(--surface-border)' : 'none' }}>
                    <div style={{ width: '40%', height: 10, background: 'var(--t1)', borderRadius: '5px', opacity: 0.1 }} />
                    <div style={{ width: '15%', height: 10, background: 'var(--green)', borderRadius: '5px', opacity: 0.2 }} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SEÇÃO 3 — LOGOS SOCIAIS */}
      <section style={{ padding: '60px 20px', borderTop: '1px solid var(--surface-border)', borderBottom: '1px solid var(--surface-border)' }}>
        <p style={{ textAlign: 'center', fontSize: 14, fontWeight: 700, color: 'var(--t3)', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: 32 }}>Usado por freelancers de todo o Brasil</p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 40, flexWrap: 'wrap', opacity: 0.6, fontSize: 18, fontWeight: 800, color: 'var(--t2)' }}>
          {['Design', 'Dev', 'Marketing', 'Fotografia', 'Consultoria'].map(s => (
            <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--t3)' }} /> {s}
            </div>
          ))}
        </div>
      </section>

      {/* SEÇÃO 4 — FEATURES */}
      <section id="demo" style={{ padding: '120px 40px', background: 'var(--t4)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 80 }}>
            <span style={{ fontSize: 12, fontWeight: 800, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '2px' }}>FUNCIONALIDADES</span>
            <h2 className="font-heading" style={{ fontSize: 42, fontWeight: 800, marginTop: 16 }}>Tudo que você precisa para profissionalizar seus orçamentos</h2>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 32 }}>
            {[
              { icon: <FileText color="var(--blue)" />, title: 'Orçamentos em PDF', desc: 'Gere propostas com sua identidade visual em segundos.' },
              { icon: <Users color="var(--green)" />, title: 'Gestão de Clientes', desc: 'Cadastre e organize todos os seus clientes em um lugar.' },
              { icon: <Package color="#a855f7" />, title: 'Catálogo de Serviços', desc: 'Monte seu catálogo e insira serviços com um clique.' },
              { icon: <BarChart2 color="orange" />, title: 'Dashboard de Resultados', desc: 'Acompanhe o valor total em propostas aprovadas.' },
              { icon: <Send color="var(--accent)" />, title: 'Controle de Status', desc: 'Saiba quais orçamentos foram aprovados ou recusados.' },
              { icon: <Shield color="var(--t2)" />, title: '100% Seguro', desc: 'Seus dados protegidos com autenticação e RLS.' }
            ].map((f, i) => (
              <div key={i} className="glass glow-hover" style={{ padding: 40, borderRadius: '24px' }}>
                <div style={{ marginBottom: 24 }}>{f.icon}</div>
                <h3 className="font-heading" style={{ fontSize: 22, fontWeight: 800, marginBottom: 12 }}>{f.title}</h3>
                <p style={{ color: 'var(--t3)', lineHeight: 1.6, fontSize: 15, fontWeight: 500 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SEÇÃO 5 — COMO FUNCIONA */}
      <section style={{ padding: '120px 40px' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', textAlign: 'center' }}>
          <h2 className="font-heading" style={{ fontSize: 42, fontWeight: 800, marginBottom: 64 }}>Como funciona</h2>
          <div style={{ display: 'flex', gap: 40, flexDirection: window.innerWidth <= 768 ? 'column' : 'row' }}>
            {[
              { num: '01', title: 'Cadastre seus serviços', desc: 'Monte seu catálogo com preços e descrições.' },
              { num: '02', title: 'Monte o orçamento', desc: 'Selecione o cliente, adicione itens e defina o valor.' },
              { num: '03', title: 'Exporte e envie', desc: 'Gere o PDF profissional e envie para o cliente.' }
            ].map((step, i) => (
              <div key={i} style={{ flex: 1, textAlign: 'left', position: 'relative' }}>
                <div style={{ fontSize: 64, fontWeight: 900, color: 'var(--accent)', opacity: 0.1, position: 'absolute', top: -40, left: 0 }}>{step.num}</div>
                <h3 className="font-heading" style={{ fontSize: 24, fontWeight: 800, position: 'relative', marginBottom: 16 }}>{step.title}</h3>
                <p style={{ color: 'var(--t3)', lineHeight: 1.6, fontWeight: 500 }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SEÇÃO 6 — PREÇOS */}
      <section id="preços" style={{ padding: '120px 40px', background: 'var(--t4)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 80 }}>
            <h2 className="font-heading" style={{ fontSize: 42, fontWeight: 800 }}>Simples e acessível</h2>
          </div>
          
          <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap', justifyContent: 'center' }}>
            {/* Card Básico */}
            <div className="glass glow-hover" style={{ flex: 1, minWidth: 320, maxWidth: 400, padding: 56, borderRadius: '32px' }}>
              <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--t3)', letterSpacing: '2px', marginBottom: 24 }}>BÁSICO</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 12 }}>
                <span style={{ fontSize: 48, fontWeight: 900 }}>R$ 47</span>
                <span style={{ fontSize: 16, color: 'var(--t3)', fontWeight: 600 }}>/mês</span>
              </div>
              <p style={{ color: 'var(--t3)', fontSize: 14, fontWeight: 600, marginBottom: 40 }}>Para freelancers iniciando</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 48 }}>
                {['Até 20 orçamentos/mês', 'Clientes ilimitados', 'Exportação em PDF', 'Suporte por email'].map(f => (
                  <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 14, fontWeight: 600 }}>
                    <Check size={18} color="var(--green)" strokeWidth={3} /> {f}
                  </div>
                ))}
              </div>
              <Link to="/login" className="glass" style={{ display: 'block', textAlign: 'center', padding: '18px', borderRadius: '16px', fontWeight: 800, color: 'var(--t1)', textDecoration: 'none' }}>Começar agora</Link>
            </div>

            {/* Card Pro */}
            <div className="glass holographic-active" style={{ flex: 1, minWidth: 320, maxWidth: 400, padding: 56, borderRadius: '32px', border: '2px solid var(--accent)', boxShadow: '0 30px 60px var(--accent-glow)' }}>
              <div style={{ background: 'var(--accent)', color: '#fff', fontSize: 10, fontWeight: 900, padding: '4px 12px', borderRadius: '30px', letterSpacing: '1px', width: 'fit-content', marginBottom: 24 }}>MAIS POPULAR</div>
              <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--accent)', letterSpacing: '2px', marginBottom: 24 }}>PRO</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 12 }}>
                <span style={{ fontSize: 48, fontWeight: 900 }}>R$ 97</span>
                <span style={{ fontSize: 16, color: 'var(--t3)', fontWeight: 600 }}>/mês</span>
              </div>
              <p style={{ color: 'var(--t3)', fontSize: 14, fontWeight: 600, marginBottom: 40 }}>Para quem vive de freelance</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 48 }}>
                {['Orçamentos ilimitados', 'Clientes ilimitados', 'Exportação em PDF', 'Dashboard analítico', 'Múltiplos usuários', 'Suporte prioritário'].map(f => (
                  <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 14, fontWeight: 600 }}>
                    <Check size={18} color="var(--accent)" strokeWidth={3} /> {f}
                  </div>
                ))}
              </div>
              <Link to="/login" style={{ 
                display: 'block', textAlign: 'center', padding: '18px', borderRadius: '16px', fontWeight: 800, color: '#fff', textDecoration: 'none', 
                background: 'linear-gradient(135deg, var(--accent) 0%, #a855f7 100%)'
              }}>Começar agora</Link>
            </div>
          </div>
        </div>
      </section>

      {/* SEÇÃO 7 — FAQ */}
      <section style={{ padding: '120px 40px' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <h2 className="font-heading" style={{ fontSize: 42, fontWeight: 800, textAlign: 'center', marginBottom: 64 }}>Perguntas frequentes</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {faqItems.map((item, i) => (
              <div key={i} className="glass" style={{ borderRadius: '20px', overflow: 'hidden' }}>
                <button 
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  style={{ width: '100%', padding: '24px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}
                >
                  <span style={{ fontSize: 18, fontWeight: 800, color: 'var(--t1)' }}>{item.q}</span>
                  <ChevronDown size={20} style={{ transition: 'transform 0.3s', transform: openFaq === i ? 'rotate(180deg)' : 'none' }} />
                </button>
                <div style={{ 
                  maxHeight: openFaq === i ? 200 : 0, overflow: 'hidden', transition: 'max-height 0.3s cubic-bezier(0, 1, 0, 1)',
                  padding: openFaq === i ? '0 32px 24px' : '0 32px'
                }}>
                  <p style={{ color: 'var(--t3)', lineHeight: 1.6, fontWeight: 500 }}>{item.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SEÇÃO 8 — CTA FINAL */}
      <section style={{ padding: '120px 20px', textAlign: 'center' }}>
        <div className="glass holographic-active" style={{ maxWidth: 1000, margin: '0 auto', padding: '80px 40px', borderRadius: '48px', position: 'relative', overflow: 'hidden', border: '1px solid var(--accent)' }}>
          <h2 className="font-heading" style={{ fontSize: 48, fontWeight: 900, marginBottom: 16, letterSpacing: '-2px' }}>Comece agora e envie seu primeiro orçamento hoje</h2>
          <p style={{ fontSize: 20, color: 'var(--t2)', marginBottom: 48, fontWeight: 600 }}>14 dias grátis. Sem cartão. Sem compromisso.</p>
          <Link to="/login" className="glow-hover holographic-active" style={{ 
            padding: '24px 56px', borderRadius: '20px', background: 'linear-gradient(135deg, var(--accent) 0%, #a855f7 100%)', color: '#fff', fontSize: 18, fontWeight: 900, textDecoration: 'none', boxShadow: '0 20px 40px var(--accent-glow)'
          }}>
            Criar conta gratuita
          </Link>
        </div>
      </section>

      {/* SEÇÃO 9 — FOOTER */}
      <footer style={{ padding: '60px 40px', borderTop: '1px solid var(--surface-border)', background: 'rgba(255,255,255,0.01)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 24 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
              <div style={{ width: 24, height: 24, borderRadius: '8px', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <FileText size={14} color="#fff" />
              </div>
              <span className="font-heading" style={{ fontWeight: 800, fontSize: 18 }}>OrçaPro</span>
            </div>
            <p style={{ fontSize: 12, color: 'var(--t3)', fontWeight: 600 }}>© 2026 BK Corp. Todos os direitos reservados.</p>
          </div>
          <div style={{ display: 'flex', gap: 32 }}>
            <Link to="/login" style={{ fontSize: 14, fontWeight: 700, color: 'var(--t2)', textDecoration: 'none' }}>Entrar</Link>
            <Link to="/login" style={{ fontSize: 14, fontWeight: 700, color: 'var(--t2)', textDecoration: 'none' }}>Criar conta</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
