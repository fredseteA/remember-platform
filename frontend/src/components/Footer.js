import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Heart, Mail, Phone } from 'lucide-react';

const PHONE_NUMBER = '\u002B55 22 99208-0811';
const PHONE_HREF = 'https://wa.me/5522992080811';
const EMAIL = 'rememberqrcode@gmail.com';

const footerStyles = `
  @keyframes floatFoot1 {
    0%,100% { transform: translateY(0) translateX(0); }
    45%     { transform: translateY(-12px) translateX(7px); }
  }
  @keyframes floatFoot2 {
    0%,100% { transform: translateY(0) translateX(0); }
    55%     { transform: translateY(-9px) translateX(-6px); }
  }
  .footer-link {
    color: #3a5070;
    font-family: "Georgia", serif;
    font-size: 0.88rem;
    text-decoration: none;
    transition: color 0.25s ease;
  }
  .footer-link:hover { color: #1a2744; }
  .footer-divider {
    border: none;
    border-top: 1px solid rgba(26,39,68,0.1);
    margin: 0;
  }
`;

const headingStyle = {
  fontFamily: '"Georgia", serif',
  fontSize: '0.72rem',
  fontWeight: 700,
  letterSpacing: '0.18em',
  textTransform: 'uppercase',
  color: '#2a3d5e',
  marginBottom: '16px',
};

/**
 * Footer com gradiente contínuo em relação à página anterior.
 *
 * @param {string} startColor - Cor FINAL da última section da página atual.
 *
 * Uso por página:
 *   Home         → <Footer startColor="#eef8fb" />   (WhyChooseUs termina em #eef8fb)
 *   How It Works → <Footer startColor="#5aa8e0" />   (IncludedSection termina em #5aa8e0)
 *   Páginas brancas → <Footer startColor="#ffffff" />
 */
const Footer = ({ startColor = '#eef8fb' }) => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { to: '/',                 label: t('nav.home') },
    { to: '/how-it-works',    label: t('nav.howItWorks') },
    { to: '/explore',         label: t('nav.explore') },
    { to: '/create-memorial', label: t('nav.createMemorial') },
  ];

  const guarantees = ['Compra Segura', 'Entrega Rastreável', 'Suporte Dedicado'];

  const sectionBg = {
    // Começa exatamente na cor final da section anterior → sem linha de corte
    background: `linear-gradient(180deg, ${startColor} 0%, #ddf0f7 30%, #c8e8f5 60%, #a8d8f0 100%)`,
    marginTop: 0,
    borderTop: 'none',
    position: 'relative',
    overflow: 'hidden',
  };

  return (
    <footer data-testid="main-footer" style={sectionBg}>
      <style>{footerStyles}</style>

      {/* Nuvem esquerda */}
      <div
        className="absolute top-[-10px] left-[-50px] w-44 md:w-60 opacity-70 pointer-events-none select-none hidden md:block"
        style={{ animation: 'floatFoot1 10s ease-in-out infinite' }}
      >
        <img src="/clouds/cloud3.png" alt="" draggable={false}
          style={{ width: '100%', height: 'auto', display: 'block' }} />
      </div>

      {/* Nuvem direita */}
      <div
        className="absolute bottom-[20%] right-[-40px] w-40 md:w-52 opacity-60 pointer-events-none select-none"
        style={{ animation: 'floatFoot2 12s ease-in-out infinite' }}
      >
        <img src="/clouds/cloud2.png" alt="" draggable={false}
          style={{ width: '100%', height: 'auto', display: 'block' }} />
      </div>

      {/* Conteúdo */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 md:px-12 pt-14 md:pt-20 pb-8">

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 md:gap-12 mb-12 md:mb-16">

          {/* Logo */}
          <div className="sm:col-span-2 md:col-span-1">
            <img
              src="/logo-transparent.png"
              alt="Remember QRCode"
              style={{ height: 64, width: 'auto', marginBottom: 14 }}
            />
            <p style={{ color: '#3a5070', fontSize: '0.85rem', lineHeight: 1.7, fontFamily: '"Georgia", serif', maxWidth: 220 }}>
              Preservando memórias e homenageando vidas com amor e respeito.
            </p>
          </div>

          {/* Links rápidos */}
          <div>
            <h4 style={headingStyle}>Links Rápidos</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
              {quickLinks.map(({ to, label }) => (
                <li key={to}>
                  <Link to={to} className="footer-link">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Suporte */}
          <div>
            <h4 style={headingStyle}>Suporte</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Phone size={14} style={{ color: '#5aa8e0', flexShrink: 0 }} />
                <a
                  href={PHONE_HREF}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-link"
                  style={{ fontSize: '0.85rem' }}
                >
                  {PHONE_NUMBER}
                </a>
              </li>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                <Mail size={14} style={{ color: '#5aa8e0', flexShrink: 0, marginTop: 2 }} />
                <a
                  href={'mailto:' + EMAIL}
                  className="footer-link"
                  style={{ fontSize: '0.85rem', wordBreak: 'break-all' }}
                >
                  {EMAIL}
                </a>
              </li>
            </ul>
          </div>

          {/* Garantias */}
          <div>
            <h4 style={headingStyle}>Garantias</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
              {guarantees.map((item) => (
                <li key={item} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Heart size={13} style={{ color: '#5aa8e0', flexShrink: 0 }} />
                  <span style={{ color: '#3a5070', fontSize: '0.85rem', fontFamily: '"Georgia", serif' }}>
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Divisor */}
        <hr className="footer-divider" />

        {/* Rodapé final */}
        <div style={{ paddingTop: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', textAlign: 'center' }}>
          <img
            src="/logo-transparent.png"
            alt="Remember QRCode"
            style={{ height: 36, width: 'auto', opacity: 0.6 }}
          />
          <p style={{ color: '#3a5070', fontSize: '0.78rem', fontFamily: '"Georgia", serif', opacity: 0.8 }}>
            {'© ' + currentYear + ' Remember QRCode. Todos os direitos reservados.'}
          </p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;