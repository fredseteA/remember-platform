import { useEffect, useRef, useState } from 'react';
import { X, Download, Copy, CheckCircle } from 'lucide-react';

const FRONTEND_URL = process.env.REACT_APP_FRONTEND_URL || window.location.origin;

/**
 * QRCodeModal
 *
 * Props:
 *   slug        — string  slug do memorial
 *   name        — string  nome do homenageado (usado na frase "Em memória de...")
 *   onClose     — () => void
 *   highRes     — bool    true = alta resolução para impressão (admin)
 *
 * O canvas gerado é QUADRADO (proporção 1:1) simulando placa 5×5cm.
 * Layout do card:
 *   ┌─────────────────────┐
 *   │   Em memória de     │  ← frase superior
 *   │   [Nome Completo]   │  ← nome em destaque
 *   │   ┌───────────┐     │
 *   │   │  QR CODE  │     │  ← QR com logo no centro
 *   │   └───────────┘     │
 *   └─────────────────────┘
 */
export default function QRCodeModal({ slug, name, onClose, highRes = false }) {
  const qrContainerRef  = useRef(null); // div oculta para a lib
  const plateCanvasRef  = useRef(null); // canvas final da placa completa
  const [copied, setCopied]   = useState(false);
  const [qrReady, setQrReady] = useState(false);

  const memorialUrl = `${FRONTEND_URL}/memorial/${slug}`;

  // Dimensões do canvas final da placa (quadrado)
  // highRes = 1200px (equivale a ~300dpi em 10cm — suficiente para gravação)
  // normal  = 500px  (preview na tela)
  const plateSize = highRes ? 1200 : 500;

  // QR interno: 60% da placa
  const qrSize = Math.round(plateSize * 0.60);

  // ─── Monta o canvas da placa completa ────────────────────────────────────
  const buildPlate = (qrCanvas) => {
    const plate = plateCanvasRef.current;
    if (!plate) return;

    plate.width  = plateSize;
    plate.height = plateSize;
    const ctx = plate.getContext('2d');

    // Fundo branco
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, plateSize, plateSize);

    // ── Dimensões de layout ──────────────────────────────────────────────
    const padding     = plateSize * 0.07;  // margem geral
    const qrX         = (plateSize - qrSize) / 2;
    const totalText   = plateSize * 0.28;  // altura reservada para texto (28%)
    const qrY         = totalText + padding * 0.5;

    // ── Textos ────────────────────────────────────────────────────────────
    // "Em memória de"
    const label1Size = Math.round(plateSize * 0.055);
    ctx.font         = `${label1Size}px Georgia, serif`;
    ctx.fillStyle    = '#6b7280';
    ctx.textAlign    = 'center';
    ctx.textBaseline = 'top';
    ctx.fillText('Em memória de', plateSize / 2, padding);

    // Nome — pode ser longo, quebra em até 2 linhas
    const nameSize = Math.round(plateSize * 0.082);
    ctx.font       = `bold ${nameSize}px Georgia, serif`;
    ctx.fillStyle  = '#1a2744';

    const maxWidth   = plateSize - padding * 2;
    const nameLines  = wrapText(ctx, name, maxWidth);
    const lineHeight = nameSize * 1.25;
    const nameY      = padding + label1Size * 1.6;

    nameLines.slice(0, 2).forEach((line, i) => {
      ctx.fillText(line, plateSize / 2, nameY + i * lineHeight);
    });

    // ── QR Code no canvas intermediário ──────────────────────────────────
    // Cria canvas temporário para o QR no tamanho certo
    const tempCanvas        = document.createElement('canvas');
    tempCanvas.width        = qrSize;
    tempCanvas.height       = qrSize;
    const tempCtx           = tempCanvas.getContext('2d');
    tempCtx.drawImage(qrCanvas, 0, 0, qrSize, qrSize);

    // ── Logo no centro do QR ──────────────────────────────────────────────
    const logoImg       = new Image();
    logoImg.crossOrigin = 'anonymous';

    const finalize = () => {
      // Desenha QR na placa
      ctx.drawImage(tempCanvas, qrX, qrY, qrSize, qrSize);

      if (logoImg.complete && logoImg.naturalWidth > 0) {
        const logoSize = qrSize * 0.20;
        const padding2 = logoSize * 0.20;
        const cx       = qrX + qrSize / 2;
        const cy       = qrY + qrSize / 2;
        const bgR      = logoSize / 2 + padding2;

        // Sombra
        ctx.save();
        ctx.shadowColor = 'rgba(0,0,0,0.12)';
        ctx.shadowBlur  = 8;
        ctx.beginPath();
        ctx.arc(cx, cy, bgR, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();
        ctx.restore();

        // Círculo branco
        ctx.beginPath();
        ctx.arc(cx, cy, bgR, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();

        // Logo recortada
        ctx.save();
        ctx.beginPath();
        ctx.arc(cx, cy, logoSize / 2, 0, Math.PI * 2);
        ctx.clip();
        ctx.drawImage(logoImg, cx - logoSize / 2, cy - logoSize / 2, logoSize, logoSize);
        ctx.restore();
      }

      // ── Linha divisória sutil + URL embaixo ──────────────────────────
      const footerY = qrY + qrSize + padding * 0.6;

      ctx.strokeStyle = 'rgba(26,39,68,0.08)';
      ctx.lineWidth   = 1;
      ctx.beginPath();
      ctx.moveTo(padding * 2, footerY);
      ctx.lineTo(plateSize - padding * 2, footerY);
      ctx.stroke();

      const urlSize = Math.round(plateSize * 0.032);
      ctx.font      = `${urlSize}px monospace`;
      ctx.fillStyle = '#9ca3af';
      ctx.textAlign = 'center';

      // Trunca URL se muito longa
      const shortUrl = memorialUrl.replace('https://', '').replace('http://', '');
      ctx.fillText(shortUrl, plateSize / 2, footerY + padding * 0.5);

      setQrReady(true);
    };

    logoImg.onload  = finalize;
    logoImg.onerror = finalize; // sem logo, finaliza mesmo assim
    logoImg.src     = '/logo-transparent.png';
  };

  // ─── Quebra texto em linhas respeitando maxWidth ──────────────────────────
  const wrapText = (ctx, text, maxWidth) => {
    const words  = text.split(' ');
    const lines  = [];
    let current  = '';
    for (const word of words) {
      const test = current ? `${current} ${word}` : word;
      if (ctx.measureText(test).width > maxWidth && current) {
        lines.push(current);
        current = word;
      } else {
        current = test;
      }
    }
    if (current) lines.push(current);
    return lines;
  };

  // ─── Gera QR e monta a placa ──────────────────────────────────────────────
  useEffect(() => {
    const generate = () => {
      if (!qrContainerRef.current) return;
      const QRCode = window.QRCode;
      if (!QRCode) return;

      qrContainerRef.current.innerHTML = '';
      setQrReady(false);

      new QRCode(qrContainerRef.current, {
        text:         memorialUrl,
        width:        qrSize,
        height:       qrSize,
        colorDark:    '#1a2744',
        colorLight:   '#ffffff',
        correctLevel: QRCode.CorrectLevel.H,
      });

      setTimeout(() => {
        const canvas = qrContainerRef.current?.querySelector('canvas');
        if (canvas) buildPlate(canvas);
        else setQrReady(true);
      }, 150);
    };

    if (window.QRCode) {
      generate();
    } else {
      const script  = document.createElement('script');
      script.src    = 'https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js';
      script.onload = generate;
      document.head.appendChild(script);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [memorialUrl, qrSize, plateSize]);

  // ─── Download ─────────────────────────────────────────────────────────────
  const handleDownload = () => {
    const canvas = plateCanvasRef.current;
    if (!canvas) return;
    const link    = document.createElement('a');
    link.download = `placa-memorial-${slug}.png`;
    link.href     = canvas.toDataURL('image/png');
    link.click();
  };

  // ─── Copiar link ──────────────────────────────────────────────────────────
  const handleCopy = () => {
    navigator.clipboard.writeText(memorialUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // ─── ESC para fechar ──────────────────────────────────────────────────────
  useEffect(() => {
    const h = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose]);

  // Tamanho de preview do canvas na tela (sempre 300px)
  const previewSize = 300;

  return (
    <div
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      style={styles.overlay}
    >
      <div style={styles.modal}>

        {/* Header */}
        <div style={styles.header}>
          <div>
            <p style={styles.eyebrow}>
              {highRes ? 'QR Code para Impressão' : 'QR Code do Memorial'}
            </p>
            <h3 style={styles.title}>{name}</h3>
          </div>
          <button onClick={onClose} style={styles.closeBtn}>
            <X size={18} />
          </button>
        </div>

        {/* Preview da placa */}
        <div style={styles.previewWrap}>

          {/* Div oculta onde a lib gera o QR bruto */}
          <div
            ref={qrContainerRef}
            style={{ position: 'absolute', opacity: 0, pointerEvents: 'none', top: -9999, left: -9999 }}
          />

          {/* Spinner */}
          {!qrReady && (
            <div style={{ ...styles.spinnerWrap, width: previewSize, height: previewSize }}>
              <div style={styles.spinner} />
            </div>
          )}

          {/* Canvas da placa — quadrado, borda sutil */}
          <canvas
            ref={plateCanvasRef}
            style={{
              width:        previewSize,
              height:       previewSize,
              borderRadius: 12,
              border:       '1px solid #e5e7eb',
              boxShadow:    '0 4px 24px rgba(26,39,68,0.10)',
              display:      'block',
              opacity:      qrReady ? 1 : 0,
              transition:   'opacity 0.3s ease',
            }}
          />
        </div>

        {/* Info resolução */}
        <div style={styles.infoBox}>
          {highRes ? (
            <span>🖨️ <strong>{plateSize}×{plateSize}px</strong> — pronto para gravação em placa 5×5cm</span>
          ) : (
            <span>🔍 Preview — use o admin para baixar em alta resolução</span>
          )}
        </div>

        {/* URL */}
        <div style={styles.urlBox}>
          <span style={styles.urlText} title={memorialUrl}>{memorialUrl}</span>
        </div>

        {/* Ações */}
        <div style={styles.actions}>
          <button onClick={handleCopy} style={styles.btnOutline} disabled={!qrReady}>
            {copied
              ? <><CheckCircle size={15} style={{ color: '#16a34a' }} /> Copiado!</>
              : <><Copy size={15} /> Copiar link</>
            }
          </button>
          <button onClick={handleDownload} style={styles.btnPrimary} disabled={!qrReady}>
            <Download size={15} />
            {highRes ? 'Baixar para gráfica' : 'Baixar PNG'}
          </button>
        </div>

      </div>
    </div>
  );
}

// ─── Estilos ──────────────────────────────────────────────────────────────────
const styles = {
  overlay: {
    position: 'fixed', inset: 0,
    background: 'rgba(0,0,0,0.55)',
    backdropFilter: 'blur(4px)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    zIndex: 1000, padding: 20,
  },
  modal: {
    background: '#fff', borderRadius: 20,
    width: '100%', maxWidth: 400,
    boxShadow: '0 24px 80px rgba(0,0,0,0.25)',
    overflow: 'hidden',
    animation: 'qrFadeIn 0.25s cubic-bezier(.22,1,.36,1)',
  },
  header: {
    display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
    padding: '20px 20px 16px',
    borderBottom: '1px solid #f3f4f6',
  },
  eyebrow: {
    fontSize: 11, fontWeight: 700, letterSpacing: '0.12em',
    textTransform: 'uppercase', color: '#9ca3af', margin: '0 0 4px',
  },
  title: {
    fontSize: 17, fontWeight: 700, color: '#1a2744', margin: 0, lineHeight: 1.3,
  },
  closeBtn: {
    background: 'transparent', border: 'none', cursor: 'pointer',
    color: '#9ca3af', padding: 4, borderRadius: 8,
    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  previewWrap: {
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    padding: '24px 20px 20px',
    minHeight: 348, position: 'relative',
  },
  spinnerWrap: {
    position: 'absolute',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  spinner: {
    width: 36, height: 36,
    border: '3px solid #e5e7eb',
    borderTop: '3px solid #1a2744',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
  },
  infoBox: {
    margin: '0 20px 10px',
    padding: '8px 12px',
    background: '#f0fdf4', border: '1px solid #bbf7d0',
    borderRadius: 8, fontSize: 12, color: '#15803d',
  },
  urlBox: {
    margin: '0 20px 14px',
    padding: '10px 14px',
    background: '#f9fafb', border: '1px solid #e5e7eb',
    borderRadius: 10, overflow: 'hidden',
  },
  urlText: {
    fontSize: 12, color: '#6b7280', wordBreak: 'break-all', display: 'block',
  },
  actions: {
    display: 'flex', gap: 10, padding: '0 20px 20px',
  },
  btnOutline: {
    flex: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 7,
    padding: '11px 16px', borderRadius: 10,
    background: 'transparent', color: '#374151', border: '1.5px solid #d1d5db',
    fontSize: 13, fontWeight: 600, cursor: 'pointer',
  },
  btnPrimary: {
    flex: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 7,
    padding: '11px 16px', borderRadius: 10,
    background: '#1a2744', color: '#fff', border: 'none',
    fontSize: 13, fontWeight: 600, cursor: 'pointer',
  },
};

// Keyframes globais
if (typeof document !== 'undefined' && !document.getElementById('qr-modal-styles')) {
  const s = document.createElement('style');
  s.id = 'qr-modal-styles';
  s.textContent = `
    @keyframes qrFadeIn {
      from { opacity:0; transform:scale(0.95) translateY(10px); }
      to   { opacity:1; transform:scale(1)    translateY(0); }
    }
    @keyframes spin { to { transform:rotate(360deg); } }
  `;
  document.head.appendChild(s);
}