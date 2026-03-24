import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Check, ArrowRight, Shield, Zap, Star, Layout as LayoutIcon, Download, Users, Briefcase } from 'lucide-react';

export function LandingPage() {
  return (
    <div className="animate-fade-in" style={{ background: 'var(--bg)', minHeight: '100vh', overflowX: 'hidden' }}>
      {/* Navbar Minimalista */}
      <nav style={{ 
        position: 'fixed', 
        top: 0, 
        width: '100%', 
        zIndex: 1000, 
        padding: '24px 40px', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        backdropFilter: 'blur(10px)',
        background: 'rgba(255,255,255,0.05)',
        borderBottom: '1px solid var(--surface-border)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ 
            width: 32, 
            height: 32, 
            borderRadius: '10px', 
            background: 'var(--accent)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            boxShadow: '0 5px 15px var(--accent-glow)'
          }}>
            <FileText size={18} color="#fff" />
          </div>
          <span className="font-heading" style={{ fontWeight: 800, fontSize: 20, color: 'var(--t1)', letterSpacing: '-1px' }}>OrçaPro</span>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
          <div className="desktop-only" style={{ display: 'flex', gap: 24 }}>
            {['Recursos', 'Preços', 'Sobre'].map(item => (
              <a key={item} href={`#${item.toLowerCase()}`} style={{ fontSize: 13, fontWeight: 600, color: 'var(--t2)', textDecoration: 'none' }}>{item}</a>
            ))}
          </div>
          <Link to="/login" className="glass glow-hover" style={{ 
            padding: '10px 24px', 
            borderRadius: '12px', 
            fontSize: 13, 
            fontWeight: 700, 
            color: 'var(--accent)', 
            textDecoration: 'none',
            border: '1px solid var(--accent)',
            background: 'rgba(79, 70, 229, 0.05)'
          }}>
            Acessar Sistema
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{ paddingTop: 200, paddingBottom: 100, paddingLeft: 40, paddingRight: 40, position: 'relative' }}>
        <div className="container" style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 80, flexDirection: window.innerWidth <= 1000 ? 'column' : 'row' }}>
          <div style={{ flex: 1 }}>
            <div className="glass" style={{ display: 'inline-flex', padding: '6px 16px', borderRadius: '30px', marginBottom: 24, alignItems: 'center', gap: 8, border: '1px solid var(--accent-glow)' }}>
              <span style={{ fontSize: 11, fontWeight: 800, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '1px' }}>✨ Aura 2.0 chegou</span>
            </div>
            <h1 className="font-heading" style={{ 
              fontSize: window.innerWidth <= 768 ? 48 : 72, 
              fontWeight: 900, 
              color: 'var(--t1)', 
              lineHeight: 1, 
              marginBottom: 24, 
              letterSpacing: '-4px' 
            }}>
              Orçamentos que <br/> <span style={{ color: 'var(--accent)' }}>Convertem</span> em Segundos.
            </h1>
            <p style={{ fontSize: 20, color: 'var(--t3)', maxWidth: 540, marginBottom: 40, lineHeight: 1.6, fontWeight: 500 }}>
              O SaaS de gestão e emissão de orçamentos focado em freelancers e profissionais que não abrem mão da excelência visual.
            </p>
            <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
              <Link to="/login" className="glow-hover holographic-active" style={{ 
                padding: '20px 40px', 
                borderRadius: '16px', 
                background: 'linear-gradient(135deg, var(--accent) 0%, #a855f7 100%)', 
                color: '#fff', 
                fontSize: 16, 
                fontWeight: 800, 
                textDecoration: 'none',
                boxShadow: '0 20px 40px var(--accent-glow)',
                display: 'flex',
                alignItems: 'center',
                gap: 12
              }}>
                TESTAR GRÁTIS <ArrowRight size={20} />
              </Link>
              <a href="#preços" className="glass glow-hover" style={{ 
                padding: '20px 32px', 
                borderRadius: '16px', 
                fontSize: 16, 
                fontWeight: 700, 
                color: 'var(--t1)', 
                textDecoration: 'none'
              }}>
                Ver Planos
              </a>
            </div>
          </div>
          
          <div style={{ flex: 1, position: 'relative' }}>
            <div className="glass" style={{ borderRadius: '32px', overflow: 'hidden', transform: 'perspective(1000px) rotateY(-15deg) rotateX(5deg)', boxShadow: 'var(--card-shadow)', border: '1px solid var(--surface-border)' }}>
              <img src="/landing_hero.png" alt="OrçaPro Preview" style={{ width: '100%', height: 'auto', display: 'block' }} />
            </div>
            {/* Elementos flutuantes de "Aura" */}
            <div className="glass animate-fade-in" style={{ position: 'absolute', bottom: -20, left: -40, padding: '24px', borderRadius: '24px', display: 'flex', alignItems: 'center', gap: 16, boxShadow: 'var(--card-shadow)' }}>
              <div style={{ background: 'rgba(34, 197, 94, 0.1)', color: 'var(--green)', padding: 12, borderRadius: '12px' }}><Check size={24} strokeWidth={3} /></div>
              <div>
                <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--t1)' }}>R$ 12.450</div>
                <div style={{ fontSize: 12, color: 'var(--t3)', fontWeight: 600 }}>Aprovado em minutos</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recursos Section */}
      <section id="recursos" style={{ padding: '100px 40px', background: 'var(--t4)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 80 }}>
            <h2 className="font-heading" style={{ fontSize: 42, fontWeight: 800, color: 'var(--t1)', marginBottom: 16 }}>Construído para sua Performance</h2>
            <p style={{ fontSize: 18, color: 'var(--t3)', fontWeight: 500 }}>Tudo o que você precisa para gerir orçamentos como uma agência de elite.</p>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 32 }}>
            {[
              { icon: <Zap color="orange" />, title: 'Rapidez Extrema', desc: 'Gere um PDF profissional em menos de 60 segundos usando templates inteligentes.' },
              { icon: <Shield color="var(--green)" />, title: 'Credibilidade Total', desc: 'Design System Aura 2.0 garante que sua marca transmita confiança em cada pixel.' },
              { icon: <LayoutIcon color="var(--accent)" />, title: 'Interface de Elite', desc: 'Diga adeus às planilhas feias. Use um sistema que você realmente gosta de usar.' },
              { icon: <Users color="var(--blue)" />, title: 'Gestão de Clientes', desc: 'Cadastre e gerencie toda a sua base de clientes em um só lugar seguro.' },
              { icon: <Briefcase color="#a855f7" />, title: 'Catálogo Pro', desc: 'Mantenha seus serviços e preços organizados para cotações rápidas.' },
              { icon: <Download color="var(--t2)" />, title: 'PDF de Altar Qualidade', desc: 'Emissão de documentos elegantes prontos para serem assinados.' }
            ].map((f, i) => (
              <div key={i} className="glass glow-hover" style={{ padding: 40, borderRadius: '24px', transition: 'all 0.3s' }}>
                <div style={{ marginBottom: 24, fontSize: 32 }}>{f.icon}</div>
                <h3 className="font-heading" style={{ fontSize: 24, fontWeight: 800, color: 'var(--t1)', marginBottom: 16 }}>{f.title}</h3>
                <p style={{ color: 'var(--t3)', lineHeight: 1.6, fontSize: 15, fontWeight: 500 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="preços" style={{ padding: '120px 40px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <h2 className="font-heading" style={{ fontSize: 42, fontWeight: 800, color: 'var(--t1)', marginBottom: 16 }}>Planos para Todos os Níveis</h2>
            <p style={{ fontSize: 18, color: 'var(--t3)', fontWeight: 500 }}>Sem taxas de setup. Comece a lucrar hoje.</p>
          </div>
          
          <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap', justifyContent: 'center' }}>
            {/* Plano Básico */}
            <div className="glass glow-hover" style={{ flex: 1, minWidth: 320, maxWidth: 400, padding: 48, borderRadius: '32px', position: 'relative' }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--t3)', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: 20 }}>Básico / MEI</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 32 }}>
                <span style={{ fontSize: 48, fontWeight: 900, color: 'var(--t1)' }}>R$ 47</span>
                <span style={{ fontSize: 16, color: 'var(--t3)', fontWeight: 600 }}>/mês</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 40 }}>
                {['Clientes Ilimitados', '10 Orçamentos /mês', 'Geração de PDF Padrão', 'Suporte via Chat'].map(f => (
                  <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 14, color: 'var(--t2)', fontWeight: 600 }}>
                    <Check size={18} color="var(--green)" strokeWidth={3} /> {f}
                  </div>
                ))}
              </div>
              <Link to="/login" className="glass" style={{ display: 'block', textAlign: 'center', padding: '18px', borderRadius: '16px', fontWeight: 800, color: 'var(--t1)', textDecoration: 'none', border: '1px solid var(--surface-border)' }}>ASSINAR AGORA</Link>
            </div>

            {/* Plano Pro */}
            <div className="glass holographic-active" style={{ flex: 1, minWidth: 320, maxWidth: 400, padding: 48, borderRadius: '32px', border: '2px solid var(--accent)', boxShadow: '0 30px 60px var(--accent-glow)' }}>
              <div style={{ position: 'absolute', top: 20, right: 30, background: 'var(--accent)', color: '#fff', fontSize: 10, fontWeight: 900, padding: '4px 12px', borderRadius: '30px', letterSpacing: '1px' }}>RECOMENDADO</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: 20 }}>Profissional / Agência</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 32 }}>
                <span style={{ fontSize: 48, fontWeight: 900, color: 'var(--t1)' }}>R$ 97</span>
                <span style={{ fontSize: 16, color: 'var(--t3)', fontWeight: 600 }}>/mês</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 40 }}>
                {['Tudo do Básico', 'Orçamentos Ilimitados', 'Customização de Logo/Cores', 'Suporte Prioritário 24/7', 'Gestão de Profissionais'].map(f => (
                  <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 14, color: 'var(--t2)', fontWeight: 600 }}>
                    <Check size={18} color="var(--accent)" strokeWidth={3} /> {f}
                  </div>
                ))}
              </div>
              <Link to="/login" style={{ 
                display: 'block', 
                textAlign: 'center', 
                padding: '18px', 
                borderRadius: '16px', 
                fontWeight: 800, 
                color: '#fff', 
                textDecoration: 'none', 
                background: 'linear-gradient(135deg, var(--accent) 0%, #a855f7 100%)',
                boxShadow: '0 10px 25px var(--accent-glow)'
              }}>ASSINAR PRO</Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <footer style={{ padding: '100px 40px', background: 'var(--t1)', color: '#fff', textAlign: 'center' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <h2 className="font-heading" style={{ fontSize: 48, fontWeight: 800, marginBottom: 24, letterSpacing: '-2px' }}>Pronto para elevar seu negócio?</h2>
          <p style={{ fontSize: 18, color: 'var(--t2)', marginBottom: 48, fontWeight: 500 }}>Junte-se a centenas de MEIs e Freelancers que já transformaram seus resultados com o OrçaPro.</p>
          <Link to="/login" className="glow-hover holographic-active" style={{ 
            display: 'inline-flex', 
            padding: '24px 56px', 
            borderRadius: '20px', 
            background: 'linear-gradient(135deg, var(--accent) 0%, #a855f7 100%)', 
            color: '#fff', 
            fontSize: 18, 
            fontWeight: 800, 
            textDecoration: 'none'
          }}>CRIAR MINHA CONTA AGORA</Link>
          <div style={{ marginTop: 80, borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 40, fontSize: 14, color: 'var(--t3)' }}>
            © {new Date().getFullYear()} OrçaPro by BK Corp. Todos os direitos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
}
