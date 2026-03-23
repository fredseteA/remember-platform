import { useInView } from '../shared/styles.jsx';
import Clouds from '../shared/Clouds.jsx';
import IconBox from '../shared/IconBox.jsx';
import Icons from '../shared/Icons.js';
import { useTranslation } from 'react-i18next';

const MomentsSection = () => {
  const { t } = useTranslation();
  const [ref, visible] = useInView(0.08);
  const items = t('whyPreservePage.moments.items', { returnObjects: true });
  const iconList = [Icons.Sunrise, Icons.Heart, Icons.Award, Icons.Users, Icons.Globe, Icons.Shield, Icons.Users, Icons.Star];
  const colorList = ['#c47a2a', '#a82a4a', '#2a7a6a', '#2a5d8a', '#6b5ea8', '#2a6a4a', '#5a7a2a', '#8a5a1a'];

  return (
    <section ref={ref} className="relative py-16 md:py-24 overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #a8d8f0 0%, #c8e8f5 30%, #ddf0f7 65%, #eef8fb 100%)' }}>
      <style>{`@media(max-width:767px){ .moments-grid{ grid-template-columns:repeat(2,1fr) !important; } }`}</style>
      <Clouds />
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 md:px-12"
        style={{ opacity: visible ? 1 : 0, animation: visible ? 'wpm-reveal 0.8s cubic-bezier(.22,1,.36,1) both' : 'none' }}>
        <div className="text-center mb-10 md:mb-14">
          <span className="wpm-label">{t('whyPreservePage.moments.eyebrow')}</span>
          <h2 className="wpm-h2" style={{ whiteSpace: 'pre-line' }}>{t('whyPreservePage.moments.title')}</h2>
          <p className="wpm-body" style={{ maxWidth: 460, margin: '0 auto' }}>{t('whyPreservePage.moments.description')}</p>
        </div>

        <div className="moments-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'clamp(10px,2vw,18px)' }}>
          {items.map((m, i) => (
            <div key={i} className="wpm-card" style={{ padding: 'clamp(18px,2.5vw,24px)', textAlign: 'center' }}>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <IconBox icon={iconList[i]} color={colorList[i]} />
              </div>
              <h4 style={{ fontFamily: '"Georgia", serif', fontWeight: 700, color: '#1a2744', fontSize: 'clamp(0.82rem,2.5vw,0.95rem)', marginBottom: 8 }}>{m.label}</h4>
              <p style={{ color: '#3a5070', fontSize: 'clamp(0.7rem,1.8vw,0.78rem)', lineHeight: 1.62, margin: 0, fontFamily: '"Georgia", serif' }}>{m.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default MomentsSection;