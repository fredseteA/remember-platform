import { useEffect, useRef, useState } from 'react';
import { X, Download, Copy, CheckCircle, FileCode } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const FRONTEND_URL = process.env.REACT_APP_FRONTEND_URL || window.location.origin;

export default function QRCodeModal({ slug, name, onClose, highRes = false, adminOnly = false }) {
  const { t } = useTranslation();
  const qrContainerRef = useRef(null);
  const plateCanvasRef = useRef(null);
  const [copied, setCopied]             = useState(false);
  const [qrReady, setQrReady]           = useState(false);
  const [activeFormat, setActiveFormat] = useState('png');

  const memorialUrl = `${FRONTEND_URL}/memorial/${slug}`;
  const plateSize   = highRes ? 1200 : 600;
  const previewSize = 280;
  const qrSize      = Math.round(plateSize * 0.58);

  const buildPlate = (qrCanvas) => {
    const plate = plateCanvasRef.current;
    if (!plate || !qrCanvas) return;
    plate.width  = plateSize;
    plate.height = plateSize;
    const ctx    = plate.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, plateSize, plateSize);
    const cx     = plateSize / 2;
    const margin = plateSize * 0.08;
    const labelSize = Math.round(plateSize * 0.05);
    ctx.font         = `italic ${labelSize}px Georgia, serif`;
    ctx.fillStyle    = '#1a2744';
    ctx.textAlign    = 'center';
    ctx.textBaseline = 'top';
    const labelY     = margin;
    ctx.fillText(t('qrModal.plateLabel'), cx, labelY);
    const gap = plateSize * 0.05;
    const qrY = labelY + labelSize * 1.8 + gap;
    const qrX = (plateSize - qrSize) / 2;
    ctx.drawImage(qrCanvas, qrX, qrY, qrSize, qrSize);
    const logo       = new Image();
    logo.crossOrigin = 'anonymous';
    const finalize   = () => {
      if (logo.complete && logo.naturalWidth > 0) {
        const logoSize = qrSize * 0.17;
        const padding  = logoSize * 0.10;
        const lcx      = qrX + qrSize / 2;
        const lcy      = qrY + qrSize / 2;
        const bgR      = logoSize / 2 + padding;
        ctx.save();
        ctx.shadowColor = 'rgba(0,0,0,0.15)';
        ctx.shadowBlur  = 10;
        ctx.beginPath();
        ctx.arc(lcx, lcy, bgR, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();
        ctx.restore();
        ctx.beginPath();
        ctx.arc(lcx, lcy, bgR, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();
        ctx.save();
        ctx.beginPath();
        ctx.arc(lcx, lcy, logoSize / 2, 0, Math.PI * 2);
        ctx.clip();
        ctx.drawImage(logo, lcx - logoSize / 2, lcy - logoSize / 2, logoSize, logoSize);
        ctx.restore();
      }
      setQrReady(true);
    };
    logo.onload  = finalize;
    logo.onerror = finalize;
    logo.src     = '/logo-transparent.svg';
  };

  useEffect(() => {
    const generate = () => {
      if (!qrContainerRef.current) return;
      const QRCode = window.QRCode;
      if (!QRCode) return;
      qrContainerRef.current.innerHTML = '';
      setQrReady(false);
      new QRCode(qrContainerRef.current, { text: memorialUrl, width: qrSize, height: qrSize, colorDark: '#000000', colorLight: '#ffffff', correctLevel: QRCode.CorrectLevel.H });
      setTimeout(() => {
        const canvas = qrContainerRef.current?.querySelector('canvas');
        if (canvas) buildPlate(canvas);
        else setQrReady(true);
      }, 150);
    };
    if (window.QRCode) generate();
    else {
      const s  = document.createElement('script');
      s.src    = 'https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js';
      s.onload = generate;
      document.head.appendChild(s);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [memorialUrl, qrSize, plateSize]);

  const handleDownloadPng = () => {
    const c = plateCanvasRef.current;
    if (!c) return;
    const a    = document.createElement('a');
    a.download = `placa-${slug}.png`;
    a.href     = c.toDataURL('image/png');
    a.click();
  };

  const handleDownloadPdf = () => {
    const c = plateCanvasRef.current;
    if (!c) return;
    const loadAndGenerate = () => {
      const { jsPDF } = window.jspdf;
      const pdf       = new jsPDF({ unit: 'mm', format: [50, 50], orientation: 'portrait' });
      const imgData   = c.toDataURL('image/png');
      pdf.addImage(imgData, 'PNG', 0, 0, 50, 50);
      pdf.save(`placa-${slug}.pdf`);
    };
    if (window.jspdf) { loadAndGenerate(); }
    else {
      const s  = document.createElement('script');
      s.src    = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
      s.onload = loadAndGenerate;
      document.head.appendChild(s);
    }
  };

  const handleDownloadSvg = () => {
    const plateLabel = t('qrModal.plateLabel');
    const doGenerate = () => {
      const qr = window.qrcode(0, 'H');
      qr.addData(memorialUrl);
      qr.make();
      const moduleCount = qr.getModuleCount();
      const docW    = 50;
      const margin  = 3.5;
      const qrAreaW = docW - margin * 2;
      const cell    = qrAreaW / moduleCount;
      const qrAreaH = cell * moduleCount;
      const titleH  = 8.5;
      const urlH    = 5.0;
      const qrTop   = titleH;
      const qrLeft  = margin;
      const docH    = titleH + qrAreaH + urlH;
      const darkColor = '#1a2744';
      const grayColor = '#9ca3af';
      const esc = (s) => s.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
      const finderZones = [{ row: 0, col: 0 }, { row: 0, col: moduleCount - 7 }, { row: moduleCount - 7, col: 0 }];
      const isInFinder = (r, c) => finderZones.some(z => r >= z.row && r < z.row + 7 && c >= z.col && c < z.col + 7);
      const makeFinder = (x, y, s) => {
        const r1 = s * 0.9; const r2 = s * 0.45; const r3 = s * 0.3;
        return `<rect x="${x.toFixed(3)}" y="${y.toFixed(3)}" width="${(s*7).toFixed(3)}" height="${(s*7).toFixed(3)}" rx="${r1.toFixed(3)}" fill="${darkColor}"/><rect x="${(x+s).toFixed(3)}" y="${(y+s).toFixed(3)}" width="${(s*5).toFixed(3)}" height="${(s*5).toFixed(3)}" rx="${r2.toFixed(3)}" fill="#ffffff"/><rect x="${(x+s*2).toFixed(3)}" y="${(y+s*2).toFixed(3)}" width="${(s*3).toFixed(3)}" height="${(s*3).toFixed(3)}" rx="${r3.toFixed(3)}" fill="${darkColor}"/>`;
      };
      const logoDiameter = cell * moduleCount * 0.17;
      const logoPad      = logoDiameter * 0.12;
      const logoR        = logoDiameter / 2 + logoPad;
      const logoCX       = qrLeft + qrAreaW / 2;
      const logoCY       = qrTop  + qrAreaW / 2;
      const LOGO_OX         = 505.75;
      const LOGO_OY         = 427.9;
      const LOGO_BASE_SCALE = 0.00552;
      const LOGO_BASE_D     = 5.2;
      const logoFinalScale  = (logoR * 2 / LOGO_BASE_D) * LOGO_BASE_SCALE;
      const logoTransform   = `translate(${logoCX},${logoCY - logoR * 0.04}) scale(${logoFinalScale.toFixed(6)}) translate(${-LOGO_OX},${-LOGO_OY})`;
      const LOGO_PATHS = `<g transform="translate(0.000000,1024.000000) scale(0.100000,-0.100000)"
fill="#1a2744" stroke="none">
<path d="M4395 8025 c-149 -33 -254 -93 -356 -203 -204 -221 -231 -510 -73
-783 46 -79 131 -164 389 -389 110 -96 218 -191 240 -211 190 -174 429 -374
473 -395 81 -41 55 -58 510 339 605 528 657 579 722 712 59 118 73 188 68 320
-4 87 -11 126 -33 185 -85 232 -280 390 -531 430 -93 15 -182 5 -284 -34 -117
-44 -214 -111 -314 -217 l-84 -89 -83 85 c-139 143 -265 217 -425 250 -87 18
-138 18 -219 0z m240 -129 c120 -32 201 -88 350 -242 138 -143 131 -144 295
24 106 109 137 134 205 168 111 57 157 67 267 62 104 -6 174 -28 254 -81 176
-116 265 -309 236 -510 -24 -162 -91 -259 -331 -472 -86 -77 -198 -176 -247
-220 -77 -70 -478 -415 -527 -454 -18 -14 -37 -6 -82 35 -11 11 -101 89 -200
173 -309 266 -597 522 -680 605 -127 128 -185 258 -185 413 0 226 166 439 390
499 61 17 193 17 255 0z"/>
<path d="M5095 7418 c-40 -23 -44 -40 -45 -160 l0 -118 -110 0 c-62 0 -120 -5
-135 -12 -46 -21 -46 -95 0 -116 15 -7 73 -12 135 -12 l110 0 0 -196 c0 -118
4 -203 11 -215 19 -37 76 -44 121 -15 1 0 4 96 7 211 l6 210 121 5 c101 4 126
8 143 24 28 25 27 67 -2 94 -21 20 -34 22 -145 22 l-122 0 0 119 0 119 -31 26
c-35 29 -36 30 -64 14z"/></g>`;

      let modulePaths = '';
      const rModule = cell * 0.12;
      for (let r = 0; r < moduleCount; r++) {
        for (let c = 0; c < moduleCount; c++) {
          if (!qr.isDark(r, c)) continue;
          if (isInFinder(r, c)) continue;
          const mx  = qrLeft + c * cell;
          const my  = qrTop  + r * cell;
          const mcx = mx + cell / 2;
          const mcy = my + cell / 2;
          if (Math.sqrt((mcx - logoCX) ** 2 + (mcy - logoCY) ** 2) < logoR) continue;
          modulePaths += `<rect x="${mx.toFixed(3)}" y="${my.toFixed(3)}" width="${cell.toFixed(3)}" height="${cell.toFixed(3)}" rx="${rModule.toFixed(3)}" fill="${darkColor}"/>`;
        }
      }
      const fp1 = makeFinder(qrLeft, qrTop, cell);
      const fp2 = makeFinder(qrLeft + (moduleCount - 7) * cell, qrTop, cell);
      const fp3 = makeFinder(qrLeft, qrTop + (moduleCount - 7) * cell, cell);

      const svgContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
  width="${docW}mm" height="${docH.toFixed(3)}mm" viewBox="0 0 ${docW} ${docH.toFixed(3)}">
  <rect width="${docW}" height="${docH.toFixed(3)}" fill="#ffffff"/>
  <text x="${(docW/2).toFixed(3)}" y="6.2"
    font-family="Georgia, 'Times New Roman', serif"
    font-size="3.2" font-style="italic" font-weight="bold"
    fill="${darkColor}" text-anchor="middle">${esc(plateLabel)}</text>
  ${modulePaths}
  ${fp1}${fp2}${fp3}
  <circle cx="${logoCX.toFixed(3)}" cy="${logoCY.toFixed(3)}" r="${(logoR + 0.3).toFixed(3)}" fill="#ffffff"/>
  <circle cx="${logoCX.toFixed(3)}" cy="${logoCY.toFixed(3)}" r="${logoR.toFixed(3)}" fill="#ffffff"/>
  <defs><clipPath id="logoClip"><circle cx="${logoCX.toFixed(3)}" cy="${logoCY.toFixed(3)}" r="${logoR.toFixed(3)}"/></clipPath></defs>
  <g clip-path="url(#logoClip)"><g transform="${logoTransform}">${LOGO_PATHS}</g></g>
  <text x="${(docW/2).toFixed(3)}" y="${(qrTop + qrAreaH + urlH * 0.65).toFixed(3)}"
    font-family="'Courier New', Courier, monospace"
    font-size="1.6" fill="${grayColor}" text-anchor="middle">${esc(memorialUrl)}</text>
</svg>`;

      const blob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement('a');
      a.download = `placa-${slug}-vetorizado.svg`;
      a.href     = url;
      a.click();
      URL.revokeObjectURL(url);
    };

    if (window.qrcode) { doGenerate(); }
    else {
      const s2 = document.createElement('script');
      s2.src    = 'https://cdn.jsdelivr.net/npm/qrcode-generator@1.4.4/qrcode.js';
      s2.onload = doGenerate;
      document.head.appendChild(s2);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(memorialUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  useEffect(() => {
    const h = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose]);

  return (
    <div onClick={(e) => { if (e.target === e.currentTarget) onClose(); }} style={S.overlay}>
      <div style={S.modal}>

        <div style={S.header}>
          <div>
            <p style={S.eyebrow}>{highRes ? t('qrModal.titlePrint') : t('qrModal.titleDefault')}</p>
            <h3 style={S.title}>{name}</h3>
          </div>
          <button onClick={onClose} style={S.closeBtn}><X size={18} /></button>
        </div>

        {adminOnly && (
          <div style={{ display: 'flex', gap: 8, padding: '0 20px 4px' }}>
            {[
              { key: 'png', label: t('qrModal.formatPng') },
              { key: 'pdf', label: t('qrModal.formatPdf') },
              { key: 'svg', label: t('qrModal.formatSvg') },
            ].map(f => (
              <button key={f.key} onClick={() => setActiveFormat(f.key)}
                style={{ flex: 1, padding: '8px 6px', borderRadius: 8, border: activeFormat === f.key ? '2px solid #1a2744' : '1.5px solid #e5e7eb', background: activeFormat === f.key ? '#1a2744' : 'transparent', color: activeFormat === f.key ? '#fff' : '#6b7280', fontSize: 10, fontWeight: 700, cursor: 'pointer', transition: 'all 0.15s ease' }}>
                {f.label}
              </button>
            ))}
          </div>
        )}

        <div style={S.previewWrap}>
          <div ref={qrContainerRef} style={{ position: 'absolute', opacity: 0, pointerEvents: 'none', top: -9999, left: -9999 }} />
          {!qrReady && (
            <div style={{ ...S.spinnerWrap, width: previewSize, height: previewSize }}>
              <div style={S.spinner} />
            </div>
          )}
          <canvas ref={plateCanvasRef} style={{ width: previewSize, height: previewSize, borderRadius: 10, border: '1px solid #e5e7eb', boxShadow: '0 2px 16px rgba(26,39,68,0.08)', display: 'block', opacity: qrReady ? 1 : 0, transition: 'opacity 0.3s ease' }} />
        </div>

        <div style={S.infoBox}>
          {activeFormat === 'svg'
            ? <span dangerouslySetInnerHTML={{ __html: t('qrModal.infoSvg') }} />
            : activeFormat === 'pdf'
            ? <span dangerouslySetInnerHTML={{ __html: t('qrModal.infoPdf') }} />
            : highRes
            ? <span dangerouslySetInnerHTML={{ __html: t('qrModal.infoPng', { size: plateSize }) }} />
            : <span>{t('qrModal.infoPreview')}</span>
          }
        </div>

        <div style={S.urlBox}>
          <span style={S.urlText}>{memorialUrl}</span>
        </div>

        <div style={S.actions}>
          <button onClick={handleCopy} style={S.btnOutline} disabled={!qrReady}>
            {copied
              ? <><CheckCircle size={15} style={{ color: '#16a34a' }} /> {t('qrModal.copied')}</>
              : <><Copy size={15} /> {t('qrModal.copy')}</>
            }
          </button>

          {activeFormat === 'png' && (
            <button onClick={handleDownloadPng} style={S.btnPrimary} disabled={!qrReady}>
              <Download size={15} />
              {highRes ? t('qrModal.downloadPng') : t('qrModal.downloadPngDefault')}
            </button>
          )}
          {activeFormat === 'pdf' && (
            <button onClick={handleDownloadPdf} style={{ ...S.btnPrimary, background: '#dc2626' }} disabled={!qrReady}>
              <Download size={15} />
              {t('qrModal.downloadPdf')}
            </button>
          )}
          {activeFormat === 'svg' && (
            <button onClick={handleDownloadSvg} style={{ ...S.btnPrimary, background: '#1e40af' }} disabled={!qrReady}>
              <FileCode size={15} />
              {t('qrModal.downloadSvg')}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

const S = {
  overlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20 },
  modal: { background: '#fff', borderRadius: 20, width: '100%', maxWidth: 420, boxShadow: '0 24px 80px rgba(0,0,0,0.25)', overflow: 'hidden', animation: 'qrFadeIn 0.25s cubic-bezier(.22,1,.36,1)' },
  header: { display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', padding: '20px 20px 16px', borderBottom: '1px solid #f3f4f6' },
  eyebrow: { fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#9ca3af', margin: '0 0 4px' },
  title: { fontSize: 17, fontWeight: 700, color: '#1a2744', margin: 0, lineHeight: 1.3 },
  closeBtn: { background: 'transparent', border: 'none', cursor: 'pointer', color: '#9ca3af', padding: 4, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  previewWrap: { display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px 20px 16px', minHeight: 312, position: 'relative' },
  spinnerWrap: { position: 'absolute', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  spinner: { width: 36, height: 36, border: '3px solid #e5e7eb', borderTop: '3px solid #1a2744', borderRadius: '50%', animation: 'spin 0.8s linear infinite' },
  infoBox: { margin: '0 20px 10px', padding: '8px 12px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 8, fontSize: 12, color: '#15803d' },
  urlBox: { margin: '0 20px 14px', padding: '10px 14px', background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 10, overflow: 'hidden' },
  urlText: { fontSize: 12, color: '#6b7280', wordBreak: 'break-all', display: 'block' },
  actions: { display: 'flex', gap: 10, padding: '0 20px 20px' },
  btnOutline: { flex: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 7, padding: '11px 16px', borderRadius: 10, background: 'transparent', color: '#374151', border: '1.5px solid #d1d5db', fontSize: 13, fontWeight: 600, cursor: 'pointer' },
  btnPrimary: { flex: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 7, padding: '11px 16px', borderRadius: 10, background: '#1a2744', color: '#fff', border: 'none', fontSize: 13, fontWeight: 600, cursor: 'pointer' },
};

if (typeof document !== 'undefined' && !document.getElementById('qr-modal-styles')) {
  const s = document.createElement('style');
  s.id = 'qr-modal-styles';
  s.textContent = `
    @keyframes qrFadeIn { from { opacity:0; transform:scale(0.95) translateY(10px); } to { opacity:1; transform:scale(1) translateY(0); } }
    @keyframes spin { to { transform:rotate(360deg); } }
  `;
  document.head.appendChild(s);
}