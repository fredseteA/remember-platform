import { useInView } from '../shared/styles.jsx';
import Clouds from '../shared/Clouds.jsx';
import IconBox from '../shared/IconBox.jsx';
import Icons from '../shared/Icons.js';
import { useTranslation } from 'react-i18next';

const HowItWorksSection = () => {
  const { t } = useTranslation();
  const [ref, visible] = useInView(0.08);
  const steps = t('whyPreservePage.howItWorks.steps', { returnObjects: true });
  const iconList = [Icons.Edit, Icons.Upload, Icons.Package, Icons.Infinity];
  const colorList = ['#2a5d8a', '#2a7a6a', '#6b5ea8', '#1a2744'];

  return (
    <section id="como-funciona" ref={ref} className="relative py-16 md:py-24 overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #eef8fb 0%, #ddf0f7 25%, #c8e8f5 60%, #b8e0f0 100%)' }}>
      <Clouds />
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 md:px-12"
        style={{ opacity: visible ? 1 : 0, animation: visible ? 'wpm-reveal 0.8s cubic-bezier(.22,1,.36,1) both' : 'none' }}>
        <div className="text-center mb-10 md:mb-14">
          <span className="wpm-label">{t('whyPreservePage.howItWorks.eyebrow')}</span>
          <h2 className="wpm-h2" style={{ whiteSpace: 'pre-line' }}>{t('whyPreservePage.howItWorks.title')}</h2>
          <p className="wpm-body" style={{ maxWidth: 420, margin: '0 auto' }}>{t('whyPreservePage.howItWorks.description')}</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: 'clamp(12px,2vw,20px)' }}>
          {steps.map((step, i) => (
            <div key={i} className="wpm-card" style={{ padding: 'clamp(22px,3vw,30px)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#1a2744', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: '"Georgia", serif', fontSize: '0.75rem', fontWeight: 700, flexShrink: 0, animation: 'wpm-pulseRing 2.5s ease-out infinite', animationDelay: `${i * 0.5}s` }}>
                  {parseInt(step.n)}
                </div>
                <span style={{ fontSize: '0.58rem', letterSpacing: '0.22em', color: '#5aa8e0', fontWeight: 700, textTransform: 'uppercase' }}>
                  {t('whyPreservePage.howItWorks.stepLabel')} {step.n}
                </span>
              </div>
              <IconBox icon={iconList[i]} color={colorList[i]} />
              <h3 style={{ fontFamily: '"Georgia", serif', fontWeight: 700, color: '#1a2744', fontSize: 'clamp(0.9rem,2.5vw,1.05rem)', marginBottom: 10, lineHeight: 1.3 }}>{step.title}</h3>
              <p style={{ color: '#3a5070', fontSize: 'clamp(0.78rem,2vw,0.85rem)', lineHeight: 1.68, margin: 0, fontFamily: '"Georgia", serif' }}>{step.desc}</p>
            </div>
          ))}
        </div>

        <div className="text-center mt-8 md:mt-10">
          <span className="wpm-pill">{t('whyPreservePage.howItWorks.footer')}</span>
        </div>
      </div>
    </section>
  );
}

export default HowItWorksSection;