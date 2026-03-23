import { useInView } from '../shared/styles.jsx';
import Clouds from '../shared/Clouds.jsx';
import IconBox from '../shared/IconBox.jsx';
import Icons from '../shared/Icons.js';
import { useTranslation } from 'react-i18next';

const MeaningSection = () => {
  const { t } = useTranslation();
  const [ref, visible] = useInView(0.1);
  const pillars = t('whyPreservePage.meaning.pillars', { returnObjects: true });
  const iconList = [Icons.Shield, Icons.Heart, Icons.Star];
  const colorList = ['#2a5d8a', '#a82a4a', '#8a5a1a'];

  return (
    <section ref={ref} className="relative py-16 md:py-24 overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #b8e0f5 0%, #c8e8f5 35%, #ddf0f7 65%, #eef8fb 100%)' }}>
      <Clouds />
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 md:px-12"
        style={{ opacity: visible ? 1 : 0, animation: visible ? 'wpm-reveal 0.8s cubic-bezier(.22,1,.36,1) both' : 'none' }}>
        <div style={{ textAlign: 'center', marginBottom: 'clamp(40px,6vw,64px)' }}>
          <span className="wpm-label">{t('whyPreservePage.meaning.eyebrow')}</span>
          <blockquote style={{ fontFamily: '"Georgia", serif', fontSize: 'clamp(1.2rem,4.5vw,2.2rem)', fontWeight: 700, color: '#1a2744', lineHeight: 1.3, maxWidth: 640, margin: '0 auto 20px', fontStyle: 'italic', whiteSpace: 'pre-line' }}>
            {t('whyPreservePage.meaning.quote')}
          </blockquote>
          <p className="wpm-body" style={{ maxWidth: 460, margin: '0 auto' }}>{t('whyPreservePage.meaning.description')}</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'clamp(12px,2vw,20px)' }}>
          {pillars.map((p, i) => (
            <div key={i} className="wpm-card" style={{ padding: 'clamp(24px,3vw,36px)', textAlign: 'center' }}>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <IconBox icon={iconList[i]} color={colorList[i]} />
              </div>
              <h3 style={{ fontFamily: '"Georgia", serif', fontWeight: 700, color: '#1a2744', fontSize: 'clamp(1rem,3vw,1.2rem)', marginBottom: 12 }}>{p.title}</h3>
              <p style={{ color: '#3a5070', fontSize: 'clamp(0.8rem,2vw,0.88rem)', lineHeight: 1.7, margin: 0, fontFamily: '"Georgia", serif' }}>{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default MeaningSection;